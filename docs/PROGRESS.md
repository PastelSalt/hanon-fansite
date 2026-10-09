# PROGRESS.md: Self-Guide, Checklist & Resume Protocol

> **Purpose:** If a coding session gets cut off (token limit, crash, new session), this file tells the next session **exactly where things stand and what to do next**, without re-deriving anything.
> **The spec is [`../FORHANON.md`](../FORHANON.md); the phase map is [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md).** This file tracks execution.

| | |
|---|---|
| **Implementation authorized** | ✅ 2026-10-09 by owner ("do all the recommended … then start execution phase by phase") |
| **Last checkpoint** | 2026-10-09: Phase 1 (import + rebrand of identifiers, data, locales, seed) on branch `phase-1-import` |
| **Current phase** | Phase 2 — identity (palette, sprite, loader) |
| **Next action** | See §6 |

---

## 0. RESUME PROTOCOL (do this first, every new session)

1. **Read this whole file**, then `FORHANON.md` §2 (rules), §8 (lessons), §9 (performance rules) and `IMPLEMENTATION_PLAN.md` §1 (assets) + §4 (answers). Don't re-ask decided questions.
2. **Check real state; don't trust checkmarks blindly:** `git status`, `git branch`, `git log --oneline -10`. Look for `TODO(resume)` markers.
3. **Find §6 "Current focus / next action"** and continue from there.
4. **Update this file after every completed checklist item** (tick, short note, update "Last checkpoint" + §6). Commit small and often, one branch per phase (stacked: each phase branch starts from the previous one).
5. **Before stopping:** write a session-log entry (§11): what was done, what's half-done, the exact next step.
6. New ambiguity? Owner-facing → §7 and ask (with a recommendation + confidence). Technical → decide, record in §9.

---

## 1. HARD RULES (non-negotiable; full list in FORHANON.md §2)

1. **No secrets in tracked files** (code, SQL, docs, commits, logs). Bootstrap credentials only in `.env.local` and Vercel env vars. Check `git diff --cached` before every commit.
2. **No permanent deletion of DB content** (archive table; exceptions per FORHANON §2.2).
3. **Never touch the Kotoha site's resources** (repo `../kotoha-fansite` is read-only for us; its Vercel/Neon projects; Cloudinary folder `kotoha-fansite/`). Don't touch Vercel project `moesoft-web`.
4. **Ask the owner before** creating any outward-facing resource (GitHub repo, Vercel project, Neon project, Cloudinary preset), downloading files, or deleting anything we didn't create.
5. **Never fabricate content; never put words in Hanon's mouth.** Claude-written Japanese → `docs/JA_REVIEW_LIST.md`.
6. **AiceClass only as history** (dissolved; owner Q3).
7. **Git:** `main` = production; merge phase branches only with the owner's OK. Author `Moesoft: Moeko Software and Technologies <214653345+PastelSalt@users.noreply.github.com>` (repo-local config, set). Commit trailer: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never force-push, never skip hooks.
8. **Performance rules (FORHANON §9):** native scrolling only, no snapping/Lenis, no `backdrop-filter`, no per-frame root custom properties, no `content-visibility` on sections, effects budget ≤ Kotoha's.
9. SVG comments must never contain `--`. Keep `[hidden] { display: none !important }`. `.vercelignore` patterns start with `/`.

---

## 2. OBJECTIVES (definition of done)

- [ ] Public site: Loader → Home → About → News → Discography → Gallery → Footer, Hanon-branded ("Sazanami Scrapbook")
- [ ] No Kotoha leftovers except intentional duo mentions
- [ ] Bilingual EN/JA complete; JA review list written
- [ ] Neon project + migration + seed; Cloudinary preset + gallery seed; Vercel project + env vars (each with owner OK)
- [ ] Admin smoke test passed
- [ ] Perf + behaviour harness committed in `scripts/perf/`; FORHANON §9.3 targets met
- [ ] QA (a11y, contrast, CSP/SRI, phones by owner); cross-links with the Kotoha site once both are live
- [ ] Deployed to `hanon-fansite.vercel.app`; pre-launch reset; owner first login; bootstrap env vars removed

---

## 3. ENVIRONMENT FACTS

| Item | Value |
|---|---|
| Project root | `/home/moeko/Desktop/Moesoft/hanon-fansite` |
| OS | Ubuntu 26.04.1 LTS |
| Node / npm / git | v26.10.0 / 11.19.1 / 2.53.0 |
| Browser for tests | `/usr/bin/google-chrome` (headless CDP harness, Phase 7) |
| Kotoha source | `../kotoha-fansite` @ `e5a5cc3` (copied in Phase 1; read-only) |
| Local preview | `node scripts/dev-server.js` (PORT, default 3000). Without `DATABASE_URL` the public API reads an in-memory PGlite DB loaded from `db/migrations` + `db/seed.sql` (`scripts/dev-db.js`) |
| Hanon YouTube channel ID | `UCJB1hgmiAD4ysg0Ao7uS8Rw` |
| Vercel / Neon / Cloudinary | not created yet (Phase 5, owner OK per resource). Plan: Vercel `hanon-fansite` (`sin1`), separate Neon project `hanon-fansite`, same Cloudinary cloud with folder `hanon-fansite/gallery` + preset `hanon_gallery_signed` |
| GitHub | owner creates the repo; no remote yet |
| Network quirk | `web.archive.org` doesn't resolve with local DNS → `curl --resolve web.archive.org:443:207.241.237.3` |

---

## 4. KEY DECISIONS: QUICK REFERENCE

- Same stack/architecture as Kotoha (FORHANON §3); started from a copy of the Kotoha code.
- Palette: blue base `#b7d7ef`, deep-blue stickers `#1f5e9e`, penguin gold, cool-white paper `#f7fbff`, navy ink (Q1).
- Motif: illustrated penguin sticker + ripples, drops, 4-point stars; **shell** as the photo mask (N4). Loader = two counter-rotating 4-point stars whose rays fill with progress, static penguin in the centre (Q2).
- No mascot art → the SVG penguin sticker does the cameo / empty states (Q9a).
- Stream schedule Mon & Thu 21:00 JST (`STREAM_DAYS` exported from `countdown.js`, read by the week strip).
- Special days: March 6 + July 9 (JST). Confetti: 🐧 + circles, blues/white/gold.
- Storage keys/cookies: `hf_lang`, `hf_motion`, `__Host-hf_session` / `hf_session_dev`.
- Art mapping (IMPLEMENTATION_PLAN §1.4): Home bg6, About bg7, News bg4, Discography bg2, Gallery bg1, loaders bg5 / bg2 / bg1 (reused until the owner adds more). bg3 removed (artist forbids re-uploads).

---

## 5. PHASE CHECKLIST

Legend: `[ ]` todo · `[~]` in progress · `[x]` done & verified · `[!]` blocked

### Phase 0 — Planning
- [x] Spec read; assets inventoried; logo + front model recovered from the AiceClass archive; plan written; owner answers recorded; credits researched (4 of 6 backgrounds)

### Phase 1 — Import + rebrand (branch `phase-1-import`)
- [x] `git init`, repo-local author, planning baseline on `main`
- [x] Kotoha tracked files copied minus the exclude list (79 files); `wipe.js` dropped
- [x] Identifiers: package name, cookies, storage keys, Cloudinary folder/preset/tags, password blocklist, admin titles
- [x] One schedule constant (Mon/Thu) shared by countdown + week strip
- [x] `data.js` (Hanon socials/official links/credits), `fx.js` (special days, penguin confetti)
- [x] Locales EN/JA rewritten for Hanon (+ `about.facts` loader-only facts); `index.html` text rebrand
- [x] `db/seed.sql` for Hanon (validated on PGlite: 8 videos, 15 news, 25 achievements, 23 releases; idempotent)
- [x] Dev-only PGlite preview DB (`scripts/dev-db.js`, hooked in `dev-server.js` + one line in `lib/db.js`)
- [x] Fresh PROGRESS.md, JA_REVIEW_LIST.md, README.md
- Leftovers by design: clover symbols/classes and pink/green colours → Phase 2; Kotoha image file names in `optimize-images.js` / `seed-gallery.js` → Phase 3

### Phase 2 — Identity (palette, sprite, loader) ✋ style tile
- [ ] tokens.css palette; admin.css colours; theme-color + critical loader CSS
- [ ] Sprite: `#pg-penguin`, `#drop`, `#ripple`, `#star`, `#shell`, keep `#spark`, `#heart`
- [ ] Replace `cl-leaf`/`cl-round` uses, `.clover-*` classes, `--clover-mask` → shell mask
- [ ] Loader spinner: 4-point stars, rays fill with progress, static penguin centre
- [ ] Sparkles pools, favicon SVG/PNGs in `optimize-images.js`
- [ ] Mascot peek → penguin sticker
- [ ] Style tile for the owner
- [ ] DESIGN_SYSTEM.md rebranded

### Phase 3 — Art
- [ ] `optimize-images.js` mapping + focal points; logo trim; UI images; OG image
- [ ] `srcset`s match emitted files; accents from the art; gallery seed list

### Phase 4 — Copy review
- [ ] EN↔JA check at 390 px; JA review list complete

### Phase 5 — Infra + seed ✋ (owner OK per resource)
### Phase 6 — Admin smoke test
### Phase 7 — Perf + behaviour harness (`scripts/perf/`)
### Phase 8 — QA ✋
### Phase 9 — Launch ✋

---

## 6. CURRENT FOCUS / NEXT ACTION

Phase 2: palette tokens → sprite symbols → replace clover uses → spinner → style tile.

---

## 7. OPEN QUESTIONS FOR OWNER

- Artists of **bg1** (balloons/rainbow duo) and **bg2** (astronaut duo) not found (reverse image search, cover thumbnails of Hanon/Kotoha/unit channels, X via search engines and Yahoo! Realtime). Shown as "Artist unknown" until the owner knows.
- 逢坂レイ's exact X post for bg6 not found; the credit links her profile.

---

## 8. OWNER ACTION ITEMS

- Create the GitHub repo when ready (we add the remote then).
- Later: more solo Hanon artwork (#はのぴく) for the loaders (and credits).
- Phase 5: approve creating each of Neon project, Cloudinary preset, Vercel project; put bootstrap admin credentials in `.env.local` yourself.

---

## 9. TECHNICAL DECISIONS LOG

| Date | Decision | Why |
|---|---|---|
| 2026-10-09 | Stacked phase branches (`phase-1-import` → `phase-2-identity` → …) on top of a planning baseline on `main` | owner reviews/merges phase by phase |
| 2026-10-09 | Dev-only PGlite database for local preview (`scripts/dev-db.js`); `lib/db.js` returns `globalThis.__hfDevDb` when set (only the dev server sets it) | preview real content before Neon exists; validates migrations + seed on real Postgres |
| 2026-10-09 | Loader "Did you know?" = About pills + `about.facts` (loader-only sentences) | spec §7.2 lists facts that aren't pills |
| 2026-10-09 | Vox mini-album dates: Winter 2022-12-30, Summer **2023-08-13** (MusicBrainz; official page says it follows Winter Vox, so Wikipedia's 2022-08-13 is a year typo), Spring 2023-12-30, Autumn 2024-08-12 | spec ⚠️ items settled |
| 2026-10-09 | 「誓いはキュンと。」 seeded as a **cover** release, not an achievement: the anime OP is HoneyWorks feat.鈴木愛理; ハコニワリリィ released a cover (Hanon solo ver. MV 2026-05-09) | spec ⚠️ item; the spec's tentative "OPテーマ歌唱担当" would have been wrong |
| 2026-10-09 | Left out until sourced: ソロライブ「アイオライト」, exact 2018 start date, THE FIRST TAKE appearance, blood type, catchphrase, 「皇帝ペンギンたち」 | never seed unverified data |
| 2026-10-09 | Hobbies confirmed from the archived AiceClass profile (歌、映画鑑賞、美味しいものを食べること、寝ること); favourites from lit.link (からあげクンと餃子) | spec ⚠️ items settled |
| 2026-10-09 | Credits line "Name logo: © AiceClass" (logo designer not stated anywhere reachable) | don't guess a designer |

---

## 10. KNOWN ISSUES / TODO LATER

- `optimize-images.js` / `seed-gallery.js` still list Kotoha file names (Phase 3).
- Admin and auth can't run without a real database (PGlite preview covers the public API only).

---

## 11. SESSION LOG

### 2026-10-09: Session 1 (planning → Phase 1)
- Planning: read FORHANON.md; recovered the Hanon logo (`name_hanon.png`) and transparent front model from the Wayback copy of aiceclass.com; wrote IMPLEMENTATION_PLAN.md.
- Owner: "do all the recommended"; delete bg3; find the artists on X; use what's available for loaders.
- Credits: bg4 + bg5 @snowclole, bg7 @Parfait_Pie_12 (byte-identical to the X originals), bg6 逢坂レイ (@6963Saki, via the おまえも♡ cover thumbnail credit); bg1/bg2 unknown; avatar = Hanon's own X icon.
- Phase 1 done on `phase-1-import` (see §5).
