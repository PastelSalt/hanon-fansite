# Hanon Fan Site

An unofficial, non-profit, bilingual (日本語 / English) fan site for **Hanon (はのん)**, vocalist of the duo ハコニワリリィ (HaKoniwalily) with Kotoha, of the music trio StellaPhizz, and a HoneyWorks guest vocalist. Built by **Moeko Software and Technologies** as the sister site of the [Kotoha fan site](https://kotoha-fansite.vercel.app/).

Design: **"Sazanami Scrapbook"** (さざなみ = ripples): the Kotoha site's scrapbook (paper notes taped onto fan art, die-cut stickers, washi tape, stamps) in Hanon's colours (blue 🩵 + penguin gold) with her mark 🐧, ripples, water drops and stars.

> Status: live at **https://hanon-fansite.vercel.app** (admin setup in progress). Spec: [`FORHANON.md`](FORHANON.md) · phase map: [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) · progress: [`docs/PROGRESS.md`](docs/PROGRESS.md).

## Stack

Plain HTML + CSS + ES modules in `public/` (no build step) · Vercel Functions (Node, ESM) in `api/` + `lib/` · Neon Postgres · Cloudinary · GSAP 3.15 + SplitText, canvas-confetti (CDN, SRI-pinned).

## Local development

Requires Node ≥ 22.

```bash
npm install
node scripts/dev-server.js          # http://localhost:3000
```

Without `DATABASE_URL` the public API serves the seed content from an in-memory Postgres (PGlite), so the site can be previewed before a Neon database exists. Admin and login need the real database:

```bash
cp .env.example .env.local          # then fill in real values (never commit .env.local)
npm run db:migrate && npm run db:seed
node --env-file=.env.local scripts/dev-server.js
```

Other scripts: `npm run images:optimize` (originals in `assets/` → WebP in `public/assets/`), `npm run admin:bootstrap`, `npm run gallery:seed`, `npm run prelaunch:reset` (owner's OK only).

## Credits

Character design はなあられ · modeling 鍋公かお · model and name logo © AiceClass. Background artists are credited in the site footer and in `public/js/public/data.js`. Site design & code © 2026 Moeko Software and Technologies.
