"use client";

import { useEffect, useMemo, useState } from "react";

type Question = {
  category: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

const questions: Question[] = [
  {
    category: "Audit Dasar",
    question: "Prosedur mana yang paling tepat untuk menguji keberadaan saldo bank?",
    options: ["Rekalkulasi bunga", "Konfirmasi langsung ke bank", "Vouching biaya bank", "Analisis tren saldo"],
    answer: 1,
    explanation: "Konfirmasi eksternal yang dikendalikan auditor memberikan bukti langsung atas keberadaan saldo bank.",
  },
  {
    category: "PSAK 109",
    question: "Kenaikan risiko kredit signifikan umumnya memindahkan aset ke stage berapa?",
    options: ["Stage 1", "Stage 2", "Stage 3", "Tidak berpindah stage"],
    answer: 1,
    explanation: "Aset dengan SICR berpindah ke Stage 2 dan ECL diukur sepanjang umur instrumen.",
  },
  {
    category: "Asersi",
    question: "Asersi utama untuk kewajiban yang berisiko tidak dicatat adalah…",
    options: ["Existence", "Accuracy", "Completeness", "Valuation"],
    answer: 2,
    explanation: "Risiko kewajiban tidak dicatat berkaitan langsung dengan kelengkapan atau completeness.",
  },
  {
    category: "Kas dan Bank",
    question: "Outstanding cheque dalam rekonsiliasi bank berarti…",
    options: ["Cek telah dicatat perusahaan tetapi belum didebit bank", "Setoran belum dicatat perusahaan", "Biaya bank belum dicatat", "Cek ditolak pelanggan"],
    answer: 0,
    explanation: "Outstanding cheque sudah dicatat sebagai pengeluaran oleh perusahaan, namun belum diproses oleh bank.",
  },
  {
    category: "Bukti Audit",
    question: "Bukti audit mana yang umumnya memiliki reliabilitas paling tinggi?",
    options: ["Penjelasan lisan manajemen", "Dokumen internal tanpa kontrol", "Konfirmasi pihak eksternal", "Analisis auditor tahun lalu"],
    answer: 2,
    explanation: "Bukti dari sumber independen di luar entitas umumnya lebih andal dibanding bukti internal.",
  },
];

const leaders = [
  { name: "Alya P.", score: 4850, accuracy: "100%", color: "#ff7a59" },
  { name: "Raka D.", score: 4620, accuracy: "96%", color: "#7c6cf2" },
  { name: "Dimas K.", score: 4310, accuracy: "92%", color: "#31b8a0" },
];

type View = "home" | "play" | "result" | "host";

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [joinError, setJoinError] = useState("");
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [time, setTime] = useState(30);
  const [created, setCreated] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");

  useEffect(() => {
    if (view !== "play" || selected !== null) return;
    if (time <= 0) {
      setSelected(-1);
      return;
    }
    const id = window.setTimeout(() => setTime((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [view, time, selected]);

  const correct = useMemo(
    () => answers.filter((answer, index) => answer === questions[index]?.answer).length,
    [answers]
  );

  function startQuiz(playerName = "Kurniawan") {
    setName(playerName || "Peserta");
    setStep(0);
    setAnswers([]);
    setSelected(null);
    setTime(30);
    setView("play");
  }

  function joinQuiz() {
    if (pin.replace(/\s/g, "") !== "482917") {
      setJoinError("PIN belum tepat. Coba PIN demo 482 917.");
      return;
    }
    setJoinError("");
    startQuiz(name);
  }

  function choose(index: number) {
    if (selected !== null) return;
    setSelected(index);
  }

  function next() {
    const updated = [...answers, selected ?? -1];
    setAnswers(updated);
    if (step === questions.length - 1) {
      setView("result");
    } else {
      setStep((value) => value + 1);
      setSelected(null);
      setTime(30);
    }
  }

  const score = correct * 900 + Math.max(0, 500 - (questions.length * 30 - answers.length * 20));

  return (
    <main>
      <header className="topbar">
        <button className="brand" onClick={() => setView("home")} aria-label="Kembali ke beranda">
          <span className="brand-mark">Q</span>
          <span>Quiz<span>Arena</span></span>
        </button>
        <nav>
          <button className={view === "home" ? "active" : ""} onClick={() => setView("home")}>Beranda</button>
          <button className={view === "host" ? "active" : ""} onClick={() => setView("host")}>Dashboard host</button>
        </nav>
        <div className="header-actions">
          <button className="ghost" onClick={() => setView("host")}>Masuk</button>
          <button className="primary small" onClick={() => setShowCreate(true)}>+ Buat kuis</button>
        </div>
      </header>

      {view === "home" && (
        <>
          <section className="hero">
            <div className="hero-copy">
              <div className="eyebrow"><span>●</span> Belajar terasa seperti bermain</div>
              <h1>Kuis seru.<br /><em>Insight nyata.</em></h1>
              <p>Buat sesi belajar yang hidup, ukur pemahaman secara real-time, dan jadikan setiap jawaban berarti.</p>
              <div className="hero-buttons">
                <button className="primary large" onClick={() => setShowCreate(true)}>Buat kuis gratis <span>→</span></button>
                <button className="text-button" onClick={() => startQuiz()}>Coba kuis demo <span className="play">▶</span></button>
              </div>
              <div className="trust"><div className="avatars"><span>AP</span><span>RD</span><span>DK</span></div><b>2.400+</b> sesi kuis dimainkan minggu ini</div>
            </div>

            <div className="join-card">
              <div className="card-orb orb-one" /><div className="card-orb orb-two" />
              <div className="join-icon">⌁</div>
              <p className="label">MASUK KE SESI</p>
              <h2>Punya PIN kuis?</h2>
              <p className="muted">Masukkan PIN dari host untuk mulai bermain.</p>
              <label>Nama panggilan</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Kurniawan" />
              <label>PIN sesi</label>
              <div className="pin-row">
                <input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="000 000" inputMode="numeric" maxLength={7} />
                <button onClick={joinQuiz}>Gabung →</button>
              </div>
              {joinError && <p className="error">{joinError}</p>}
              <div className="demo-pin">PIN DEMO <b>482 917</b></div>
            </div>
          </section>

          <section className="feature-strip">
            <article><span className="feature-icon purple">⚡</span><div><b>Real-time</b><p>Skor & peringkat langsung</p></div></article>
            <article><span className="feature-icon orange">◎</span><div><b>Insight mendalam</b><p>Lihat topik yang perlu ditingkatkan</p></div></article>
            <article><span className="feature-icon green">✓</span><div><b>Siap dalam menit</b><p>Buat, bagikan, dan mulai</p></div></article>
          </section>

          <section className="how">
            <div><p className="section-kicker">CARA KERJA</p><h2>Dari ide menjadi arena<br />dalam tiga langkah.</h2></div>
            <div className="steps">
              <div><span>01</span><b>Buat kuis</b><p>Tulis soal sendiri atau gunakan bank soal siap pakai.</p></div>
              <div><span>02</span><b>Bagikan PIN</b><p>Peserta cukup membuka link dan memasukkan PIN.</p></div>
              <div><span>03</span><b>Lihat insight</b><p>Pantau skor, akurasi, dan materi yang belum dikuasai.</p></div>
            </div>
          </section>
        </>
      )}

      {view === "play" && (
        <section className="game-shell">
          <div className="game-top">
            <div><span className="live-dot" /> LIVE · Audit Challenge</div>
            <div className="player-chip"><span>{name.slice(0, 1).toUpperCase()}</span>{name}</div>
          </div>
          <div className="game-progress"><span style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
          <div className="question-meta"><span>SOAL {step + 1} DARI {questions.length}</span><b className={time < 8 ? "danger" : ""}>{time}s</b></div>
          <div className="question-card">
            <div className="question-category">{questions[step].category}</div>
            <h1>{questions[step].question}</h1>
            <div className="options">
              {questions[step].options.map((option, index) => {
                const isAnswer = questions[step].answer === index;
                const state = selected === null ? "" : isAnswer ? "correct" : selected === index ? "wrong" : "dim";
                return <button key={option} className={state} onClick={() => choose(index)}><span>{String.fromCharCode(65 + index)}</span>{option}<i>{state === "correct" ? "✓" : state === "wrong" ? "×" : ""}</i></button>;
              })}
            </div>
            {selected !== null && (
              <div className={`feedback ${selected === questions[step].answer ? "ok" : "no"}`}>
                <b>{selected === questions[step].answer ? "Tepat!" : selected === -1 ? "Waktu habis" : "Belum tepat"}</b>
                <p>{questions[step].explanation}</p>
                <button onClick={next}>{step === questions.length - 1 ? "Lihat hasil" : "Soal berikutnya"} →</button>
              </div>
            )}
          </div>
        </section>
      )}

      {view === "result" && (
        <section className="result-page">
          <div className="confetti">✦ <span>●</span> ◆ <i>✦</i></div>
          <p className="section-kicker">KUIS SELESAI</p>
          <h1>Kerja bagus, {name}!</h1>
          <p>Kamu menguasai sebagian besar materi audit dasar.</p>
          <div className="score-ring"><div><b>{correct}/{questions.length}</b><span>JAWABAN BENAR</span></div></div>
          <div className="result-stats">
            <div><span>SKOR</span><b>{score.toLocaleString("id-ID")}</b></div>
            <div><span>AKURASI</span><b>{Math.round((correct / questions.length) * 100)}%</b></div>
            <div><span>PERINGKAT</span><b>#{correct === 5 ? 1 : 4}</b></div>
          </div>
          <div className="result-actions"><button className="primary" onClick={() => startQuiz(name)}>Main lagi</button><button className="ghost outlined" onClick={() => setView("home")}>Kembali ke beranda</button></div>
        </section>
      )}

      {view === "host" && (
        <section className="dashboard">
          <div className="dash-heading"><div><p className="section-kicker">DASHBOARD HOST</p><h1>Selamat datang, Kurniawan.</h1><p>Pantau kuis dan perkembangan peserta dari satu tempat.</p></div><button className="primary" onClick={() => setShowCreate(true)}>+ Buat kuis baru</button></div>
          <div className="metric-grid">
            <article><span>KUIS AKTIF</span><b>3</b><i>+1 bulan ini</i></article>
            <article><span>TOTAL PESERTA</span><b>128</b><i>↑ 18%</i></article>
            <article><span>RATA-RATA SKOR</span><b>84%</b><i>↑ 6%</i></article>
            <article><span>SESI SELESAI</span><b>24</b><i>Semua waktu</i></article>
          </div>
          <div className="dash-grid">
            <div className="panel quiz-list"><div className="panel-title"><h2>Kuis terbaru</h2><button>Lihat semua</button></div>
              {created && <div className="quiz-item"><span className="quiz-badge pink">N</span><div><b>{quizTitle}</b><p>0 soal · Baru dibuat</p></div><strong>Draf</strong><button>•••</button></div>}
              <div className="quiz-item"><span className="quiz-badge violet">A</span><div><b>Audit Challenge 2026</b><p>5 soal · 48 peserta</p></div><strong className="live">Aktif</strong><button>•••</button></div>
              <div className="quiz-item"><span className="quiz-badge mint">P</span><div><b>PSAK 109 — ECL</b><p>20 soal · 36 peserta</p></div><strong>Selesai</strong><button>•••</button></div>
              <div className="quiz-item"><span className="quiz-badge gold">I</span><div><b>Internal Control Basics</b><p>15 soal · 44 peserta</p></div><strong>Selesai</strong><button>•••</button></div>
            </div>
            <div className="panel leaderboard"><div className="panel-title"><h2>Leaderboard</h2><span>Minggu ini</span></div>
              {leaders.map((leader, index) => <div className="leader" key={leader.name}><b>0{index + 1}</b><span className="leader-avatar" style={{background: leader.color}}>{leader.name[0]}</span><div><strong>{leader.name}</strong><small>{leader.accuracy} akurasi</small></div><em>{leader.score.toLocaleString("id-ID")}</em></div>)}
            </div>
          </div>
          <div className="panel insight"><div><p className="section-kicker">INSIGHT MINGGU INI</p><h2>Asersi audit perlu perhatian.</h2><p>Hanya 62% peserta menjawab topik completeness dengan benar. Pertimbangkan sesi remedial singkat.</p></div><button onClick={() => startQuiz()}>Mulai sesi remedial →</button></div>
        </section>
      )}

      {showCreate && (
        <div className="modal-backdrop" onMouseDown={() => setShowCreate(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setShowCreate(false)}>×</button>
            <div className="modal-icon">✦</div><p className="section-kicker">KUIS BARU</p><h2>Apa judul kuismu?</h2><p>Mulai dari judul. Soal dapat ditambahkan setelah kuis dibuat.</p>
            <label>Judul kuis</label><input autoFocus value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} placeholder="Contoh: Audit Kas & Bank" />
            <label>Kategori</label><select defaultValue="Audit & Akuntansi"><option>Audit & Akuntansi</option><option>Pelatihan umum</option><option>Pengetahuan produk</option></select>
            <div className="modal-actions"><button className="ghost outlined" onClick={() => setShowCreate(false)}>Batal</button><button className="primary" disabled={!quizTitle.trim()} onClick={() => {setCreated(true); setShowCreate(false); setView("host");}}>Buat & lanjutkan →</button></div>
          </div>
        </div>
      )}
    </main>
  );
}
