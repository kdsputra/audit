# QuizArena

QuizArena adalah aplikasi kuis interaktif yang dipulihkan dari Sites QuizArena.

## Isi Repository

- `app/page.tsx`: UI utama QuizArena, termasuk halaman beranda, mode bermain, hasil kuis, dashboard host, dan modal pembuatan kuis.
- `app/globals.css`: styling utama QuizArena.
- `app/layout.tsx`: metadata dan layout aplikasi.
- `worker/index.ts`: entry point Cloudflare Worker untuk runtime Sites/Vinext.
- `.openai/hosting.json`: konfigurasi project Sites QuizArena.
- `build/`, `scripts/`, `db/`, `drizzle/`, dan `tests/`: konfigurasi build, helper Sites, database stub, dan test pendukung.

## Menjalankan Project

Project ini memakai Next, React, Vinext, dan runtime Sites.

```bash
npm install
npm run dev
```

Untuk build Sites:

```bash
npm run build
```

## Asal Source

Source dipulihkan dari project Sites `QuizArena` dengan slug `quiz-arena`.
