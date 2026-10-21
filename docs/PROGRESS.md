# PROGRESS.md: Self-Guide, Checklist & Resume Protocol

> **Purpose:** If a coding session gets cut off (token limit, crash, new session), this file tells the next session **exactly where things stand and what to do next**, without re-deriving anything.
> **The spec is [`../FORHANON.md`](../FORHANON.md); the phase map is [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md).** This file tracks execution.

| | |
|---|---|
| **Implementation authorized** | ✅ 2026-10-09 by owner ("do all the recommended … then start execution phase by phase") |
| **Last checkpoint** | 2026-10-09: **live at https://hanon-fansite.vercel.app** (Phase 5 infra done; owner adds the Cloudinary API key/secret in Vercel) |
| **Current phase** | Phase 7 — optimisation decision; Phase 8 QA |
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
7. **Git:** `main` = production; merge phase branches only with the owner's OK. Author `Moeko Works <214653345+PastelSalt@users.noreply.github.com>` (repo-local config, set). Commit trailer: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never force-push, never skip hooks.
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
| Project root | `/home/moeko/Desktop/Moeko Works/hanon-fansite` |
| OS | Ubuntu 26.04.1 LTS |
| Node / npm / git | v26.10.0 / 11.19.1 / 2.53.0 |
| Browser for tests | `/usr/bin/google-chrome` (headless CDP harness, Phase 7) |
| Vercel CLI | 63.1.0 (global, nvm), logged in as `pastelsalt` (2026-10-09); folder linked (`.vercel/`, git-ignored); `vercel link` also appends `VERCEL_OIDC_TOKEN` to `.env.local`. Deploy: push to `main` (Git-connected) or `vercel deploy --prod` |
| Kotoha source | `../kotoha-fansite` @ `e5a5cc3` (copied in Phase 1; read-only) |
| Local preview | `node scripts/dev-server.js` (PORT, default 3000). Without `DATABASE_URL` the public API reads an in-memory PGlite DB loaded from `db/migrations` + `db/seed.sql` (`scripts/dev-db.js`) |
| Hanon YouTube channel ID | `UCJB1hgmiAD4ysg0Ao7uS8Rw` |
| Vercel project | `hanon-fansite` → **https://hanon-fansite.vercel.app**, ID `prj_9UaSNs5M0OAfC3jPGpZN5QWViRHL`, personal scope (`team_iTXgjBMqb9YpVCwrSPc0UKWO`; connector calls: omit teamId), functions `sin1`, Node 24.x, no framework, output `public/`, Vercel Authentication on previews only |
| Vercel env vars | `DATABASE_URL` + `ANALYTICS_SALT` (Sensitive, Production + Preview; the production salt differs from the local one), `CLOUDINARY_CLOUD_NAME` / `_FOLDER` / `_UPLOAD_PRESET` (plain, all). **Owner adds `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET`** (Sensitive, Production + Preview), then redeploy |
| Neon project | `hanon-fansite`, ID **`broad-flower-24329862`**, `aws-ap-southeast-1`, PG 17, branch `main` = `br-falling-water-az0enons`, database `hanon`, role `hanon_owner`, endpoint `ep-rough-voice-azj6ei6t` (pooled host has `-pooler`). Free tier |
| Cloudinary | same cloud as Kotoha (`dijqsw0k8`); folder `hanon-fansite/gallery`; signed preset **`hanon_gallery_signed`** (created 2026-10-09, same settings as Kotoha's, tag `hanon-gallery`) |
| GitHub | private **https://github.com/PastelSalt/hanon-fansite** (created 2026-10-09 with the owner's `gh` login for the deployment); `main` = production |
| Secrets | `.env.local` (mode 600, git-ignored): DB URLs, local salt, Cloudinary names; owner adds the Cloudinary key/secret + bootstrap admin values there |
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
- [x] tokens.css palette (sky/gold/logo-pink, cool paper, navy ink, navy shadows); admin.css colours; theme-color + critical loader CSS
- [x] Sprite: `#pg-penguin` (after the logo's penguin), `#star`, `#drop`, `#ripple`, `#shell`; kept `#spark`, `#heart` (no `--` in comments; XML valid)
- [x] `.cl*` → `.pg` sticker classes + variants; clover markup/classes replaced (nav star dot, penguin meter, ripple stage, penguin mascot peek/state notes); `--shell-mask`
- [x] Loader spinner: two 4-point stars, rays light up gold with progress, still penguin in the centre (static markup + `spinner.js`)
- [x] Sparkles pools (gold/sky sparks, pink heart, star, drop); favicon = flat penguin SVG/PNGs; unused clover/divider SVG outputs dropped
- [x] DESIGN_SYSTEM.md rebranded; PERFORMANCE_PLAN.md marked as the Kotoha reference
- [x] `scripts/perf/cdp.js` + `shots.js` (headless Chrome screenshots per section; started early for visual checks)
- [ ] Style tile ✋ → shown to the owner as real-page screenshots after Phase 3 (art)

### Phase 3 — Art (branch `phase-3-art`)
- [x] `optimize-images.js` mapping (§4) + focal points checked on portrait crops; logo trimmed to 822×270 (`logo-400/800`); pose = official front model trimmed to 752×1611 (`pose-400/752`); profile from `hanon_icon.jpeg`; OG image = bg6 + logo; penguin favicons
- [x] `srcset`s match the emitted files (home/news/gallery top out at 1920; about/discography have 2560); logo/pose `width`/`height` updated (no layout shift); admin/login logos
- [x] Accents from the art: home `#ffe3a0` (penguin gold), about `#ffc0ce`, news `#f6cfb2`, disco `#cbc8f5`, gallery `#c5e8e4`
- [x] Gallery seed list: 4 credited fan artworks + key visual, front model, turnaround (© AiceClass); bg1/bg2 wait for their artists
- [x] `hanonpromotional.png` renamed to `.jpg` (it is a JPEG)
- [x] Screenshots 1920/1366/390 reviewed. Fixes: spinner penguin offset (an svg viewBox around a symbol that has its own), pointier spinner stars, chips no longer stretch in tall cards

### Phase 4 — Copy review (branch `phase-4-copy`)
- [x] EN/JA screenshots (1920/1366/390/360) reviewed: Japanese wraps cleanly (`line-break: strict`), no text overflow, no horizontal page scroll at 320–1920 px (scripted check)
- [x] Nothing readable under 13 px any more (inherited 9–12 px labels raised: ticket stub, LIVE, flip units, ribbon, stamp, profile kana, facts labels, tile credit, label chips, week strip); decorative text is `aria-hidden` (badge ring, "NO." circles, placeholder covers)
- [x] Phone nav: 「メニュー」 kept on one line; below 420 px the nav's motion toggle moves out (still in the menu + footer)
- [x] JA review list complete for everything written so far (`docs/JA_REVIEW_LIST.md`)

### Phase 5 — Infra + seed (owner: "you may start the online deployment", 2026-10-09)
- [x] Neon project `hanon-fansite` (Singapore, PG 17, db `hanon`) → `db:migrate` + `db:seed`: 8 videos, 15 news, 25 achievements, 23 releases
- [x] Cloudinary preset `hanon_gallery_signed` + gallery seed: the 7 originals uploaded through the connector's signed upload (no API secret needed locally) as `hanon-fansite/gallery/seed-*`, rows inserted with the `data.js` credits (same result as `npm run gallery:seed`)
- [x] Vercel project + env vars; private GitHub repo; first production deploy from `main` (`dpl_J6PJT15Kr4y5xLpLCUUxDSRb3KLP`) → https://hanon-fansite.vercel.app
- [x] Smoke test: page, API (home/gallery/geo), assets, `/login`, `/admin` = 200; `FORHANON.md`, `/assets/backgrounds/*`, `/docs/*`, `/scripts/*` = 404; CSP/HSTS/X-Frame-Options present
- [x] Behaviour suite on production data (local code + read-only API proxy, analytics swallowed): **33/33** incl. the gallery lightbox
- [x] Sister-site link in the footer ("Sister site: Kotoha fan site 🍀"), Q8 — both sites are live
- [x] Kotoha footer links back ("Sister site: Hanon fan site 🐧", commit `b4b722b` in the Kotoha repo, auto-deployed); Hanon redeployed (`dpl_CTR3vq3feMRck4JjAuqfYDQVVvCR`); production load in JA: no console/CSP errors
- [x] Vercel CLI installed + logged in (owner approved the device login); `vercel link` + `vercel git connect` → pushes to `main` deploy automatically
- [x] Owner added `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` in Vercel (Sensitive, Production; a key named for this project); production redeployed
- [x] Owner account bootstrapped by the owner (`npm run admin:bootstrap`; the temporary password was typed by the owner into a hidden prompt, never stored in a file): username `penguinhanon`, role owner, `must_change_password = true`
- [x] Owner logged in and changed the password (verified: `must_change_password = false`)
### Phase 6 — Admin smoke test (2026-10-09) ✅
- [x] Throwaway Neon branch `smoke-test-2026-10-09` (`br-dark-dawn-azy4aggl`, copy of production); on the copy only, the owner got a generated test password + forced change (production never touched — verified afterwards)
- [x] `scripts/perf/admin-smoke.js` (API level, refuses non-localhost URLs): **50/50** — login/wrong password/forced change/weak password, videos (YouTube lookup, draft, duplicate 409, publish, archive, restore), news (link + required-field validation, publish, edit, archive), achievements, discography (future release = Coming soon), gallery credit edit, accounts (`penguinhanon2`, owner-only 403, reset revokes sessions, remove, next is `penguinhanon3`), activity log, analytics, logout, Origin check, lockout 429
- [x] Admin UI walk in headless Chrome (login form → dashboard, videos, news, discography, gallery, accounts, archive, activity): all render, Hanon branding, no errors except the expected 401 `me` check on the login page
- [ ] Not tested here: gallery upload/delete (the copy's rows point at the real Cloudinary files; no local API secret) → owner tries one upload + delete on production with a test image
- [ ] Owner: delete the branch `smoke-test-2026-10-09` when no longer needed (or ask Claude)
### Phase 7 — Perf + behaviour harness (`scripts/perf/`, branch `phase-7-perf`) — harness done, final numbers after the gallery is seeded
- [x] `cdp.js` (headless Chrome over CDP, Node WebSocket, optional real GPU), `server.js` (serves any site's `public/` with its vercel.json headers, proxies `/api/public/*` read-only, `/api/track` → 204), `shots.js`, `scroll-bench.js` (rAF frame recorder, long tasks, `TRACE=1` per-thread breakdown, `OFF=` isolation), `behaviour.js` (32 checks)
- [x] Behaviour suite 32/32 locally (lightbox check skipped while the gallery is empty). Found + fixed an inherited bug: the marquee threw (and could stop) when motion was re-enabled while reversed after scrolling up (chip filed for the Kotoha repo)
- [x] Scroll bench on this machine = the owner's GPU class (headless Chrome confirms **AMD Radeon Vega 3**, radeonsi, Linux), wheel at the page edge, 1920×1080 back-to-back: **Hanon 13.1 fps · Hanon design on Kotoha's data 13.6 · Kotoha 12.6** → the rebrand costs nothing (slightly cheaper). Plain-text page = 60 fps (harness ceiling fine)
- [x] Where the time goes: the **GPU process** is busy ~25 s of a ~38 s run (raster/compositing), page main thread ~7 s. No single effect dominates: all animations off → 14 fps; backdrop off → 17.6; animations + backdrop + filters + shadows + text strokes off → 27.9. The cost is rasterising this detailed page while scrolling fast on a weak GPU (Kotoha's recorded 35–38 fps came from the owner's Windows machine, not comparable)
- [ ] Optimisation pass for both sites (leads: fewer/lighter layers while scrolling, raster cost of sprite `<use>` + text strokes, image decode sizes) — owner decision: worth a dedicated session?
- [ ] Re-measure with the seeded gallery and on the deployed site; owner checks real phones
### Phase 8 — QA ✋
- [x] SRI hashes re-verified against the served CDN bytes (GSAP 3.15.0, SplitText, canvas-confetti 1.9.4): all match
- [x] Nothing readable under 13 px; no overflow 320–1920 px (Phase 4)
### Phase 9 — Launch ✋

---

## 6. CURRENT FOCUS / NEXT ACTION

Ask the owner: (1) approve the look (screenshots = style tile ✋), (2) OK to create the Neon project, Cloudinary preset and Vercel project, (3) GitHub repo. Meanwhile, local-only work: Phase 7 harness (perf + behaviour) and the local parts of Phase 8.

---

## 7. OPEN QUESTIONS FOR OWNER

- Artists of **bg1** (balloons/rainbow duo) and **bg2** (astronaut duo) not found (reverse image search, cover thumbnails of Hanon/Kotoha/unit channels, X via search engines and Yahoo! Realtime). Shown as "Artist unknown" until the owner knows.
- 逢坂レイ's exact X post for bg6 not found; the credit links her profile.

---

## 8. OWNER ACTION ITEMS

- First admin login at https://hanon-fansite.vercel.app/login and change the temporary password.
- Optional: put the Cloudinary key/secret into `.env.local` too (only needed for local scripts such as `npm run gallery:seed`).
- Kotoha site: its Vercel project has no `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` (seen 2026-10-09), so its admin gallery upload probably fails in production.
- Later: more solo Hanon artwork (#はのぴく) for the loaders (and credits).

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

### 2026-10-09: Session 2 (deployment)
- Owner: "do the recommended actions, you may start the online deployment".
- `main` fast-forwarded to the reviewed phases. Created Neon `hanon-fansite`, Cloudinary preset `hanon_gallery_signed`, Vercel project `hanon-fansite`, private GitHub repo `PastelSalt/hanon-fansite`; migrated + seeded; gallery seeded (7 images); first production deploy READY at https://hanon-fansite.vercel.app.
- The Vercel CLI isn't signed in on this machine and the connector's inline upload can't carry 4 MB of images, so the deploy goes through GitHub (as for Kotoha).
- Footer sister-site links (Q8). Next: owner adds the Cloudinary key + bootstraps the admin → Phase 6 admin smoke test; Phase 7 optimisation decision.
