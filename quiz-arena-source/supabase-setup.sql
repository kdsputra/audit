-- QuizArena Supabase setup
-- Run this once in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.quizarena_config (
  id integer primary key default 1 check (id = 1),
  admin_password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quizarena_quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text default '',
  description text default '',
  pin text not null unique,
  questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quizarena_results (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references public.quizarena_quizzes(id) on delete cascade,
  quiz_title text not null,
  player text not null,
  correct integer not null,
  total integer not null,
  points integer not null,
  elapsed integer not null,
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.quizarena_config enable row level security;
alter table public.quizarena_quizzes enable row level security;
alter table public.quizarena_results enable row level security;

insert into public.quizarena_config (id, admin_password_hash)
values (1, extensions.crypt('admin123', extensions.gen_salt('bf')))
on conflict (id) do nothing;

insert into public.quizarena_quizzes (title, category, description, pin, questions)
values (
  'Audit Challenge 2026',
  'Audit & Akuntansi',
  'Kuis demo QuizArena.',
  '482917',
  '[{"text":"Prosedur mana yang paling tepat untuk menguji keberadaan saldo bank?","options":["Rekalkulasi bunga","Konfirmasi langsung ke bank","Vouching biaya bank","Analisis tren saldo"],"answer":1,"explanation":"Konfirmasi eksternal yang dikendalikan auditor memberikan bukti langsung."},{"text":"Kenaikan risiko kredit signifikan umumnya memindahkan aset ke stage berapa?","options":["Stage 1","Stage 2","Stage 3","Tidak berpindah stage"],"answer":1,"explanation":"Aset dengan SICR berpindah ke Stage 2."},{"text":"Asersi utama untuk kewajiban yang berisiko tidak dicatat adalah...","options":["Existence","Accuracy","Completeness","Valuation"],"answer":2,"explanation":"Risiko kewajiban tidak dicatat berkaitan dengan completeness."}]'::jsonb
)
on conflict (pin) do nothing;

create or replace function public.quizarena_is_admin(admin_password text)
returns boolean language sql security definer set search_path = public, extensions as $$
  select exists (
    select 1
    from public.quizarena_config
    where id = 1
      and admin_password_hash = extensions.crypt(admin_password, admin_password_hash)
  );
$$;

create or replace function public.quizarena_public_quiz(session_pin text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare q record;
begin
  select id, title, category, description, pin, questions into q from public.quizarena_quizzes where pin = session_pin;
  if q.id is null then return null; end if;
  return jsonb_build_object('id', q.id, 'title', q.title, 'category', q.category, 'description', q.description, 'pin', q.pin, 'questions', (select jsonb_agg(jsonb_build_object('text', item->>'text', 'options', item->'options')) from jsonb_array_elements(q.questions) item));
end;
$$;

create or replace function public.quizarena_submit(session_pin text, player_name text, submitted_answers jsonb, elapsed_seconds integer)
returns jsonb language plpgsql security definer set search_path = public as $$
declare q record; idx integer; total integer; correct integer := 0; answer integer; points integer; result_id uuid;
begin
  select id, title, questions into q from public.quizarena_quizzes where pin = session_pin;
  if q.id is null then raise exception 'Quiz not found'; end if;
  total := jsonb_array_length(q.questions);
  for idx in 0..total - 1 loop
    answer := ((submitted_answers ->> idx)::integer);
    if answer = ((q.questions -> idx ->> 'answer')::integer) then correct := correct + 1; end if;
  end loop;
  points := correct * 900 + greatest(0, 500 - greatest(1, elapsed_seconds));
  insert into public.quizarena_results (quiz_id, quiz_title, player, correct, total, points, elapsed, answers)
  values (q.id, q.title, coalesce(nullif(trim(player_name), ''), 'Peserta'), correct, total, points, greatest(1, elapsed_seconds), submitted_answers)
  returning id into result_id;
  return jsonb_build_object('id', result_id, 'quizTitle', q.title, 'player', coalesce(nullif(trim(player_name), ''), 'Peserta'), 'correct', correct, 'total', total, 'points', points, 'elapsed', greatest(1, elapsed_seconds));
end;
$$;

create or replace function public.quizarena_admin_data(admin_password text)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not public.quizarena_is_admin(admin_password) then raise exception 'Unauthorized'; end if;
  return jsonb_build_object('quizzes', coalesce((select jsonb_agg(to_jsonb(q) order by updated_at desc) from public.quizarena_quizzes q), '[]'::jsonb), 'results', coalesce((select jsonb_agg(to_jsonb(r) order by created_at desc) from public.quizarena_results r), '[]'::jsonb));
end;
$$;

create or replace function public.quizarena_save_quiz(admin_password text, quiz jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare saved public.quizarena_quizzes; quiz_id uuid;
begin
  if not public.quizarena_is_admin(admin_password) then raise exception 'Unauthorized'; end if;
  quiz_id := nullif(quiz->>'id', '')::uuid;
  if quiz_id is null then
    insert into public.quizarena_quizzes (title, category, description, pin, questions) values (quiz->>'title', coalesce(quiz->>'category', ''), coalesce(quiz->>'description', ''), quiz->>'pin', quiz->'questions') returning * into saved;
  else
    update public.quizarena_quizzes set title = quiz->>'title', category = coalesce(quiz->>'category', ''), description = coalesce(quiz->>'description', ''), pin = quiz->>'pin', questions = quiz->'questions', updated_at = now() where id = quiz_id returning * into saved;
  end if;
  return to_jsonb(saved);
end;
$$;

create or replace function public.quizarena_delete_quiz(admin_password text, quiz_id uuid)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not public.quizarena_is_admin(admin_password) then raise exception 'Unauthorized'; end if;
  delete from public.quizarena_quizzes where id = quiz_id;
  return true;
end;
$$;

create or replace function public.quizarena_clear_results(admin_password text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not public.quizarena_is_admin(admin_password) then raise exception 'Unauthorized'; end if;
  delete from public.quizarena_results;
  return true;
end;
$$;

create or replace function public.quizarena_change_password(admin_password text, new_password text)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.quizarena_is_admin(admin_password) then raise exception 'Unauthorized'; end if;
  if length(new_password) < 6 then raise exception 'Password must be at least 6 characters'; end if;
  update public.quizarena_config
  set admin_password_hash = extensions.crypt(new_password, extensions.gen_salt('bf')),
      updated_at = now()
  where id = 1;
  return true;
end;
$$;
