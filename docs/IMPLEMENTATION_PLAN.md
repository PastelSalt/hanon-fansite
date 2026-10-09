# Hanon Fansite — Implementation Plan

> **Version 0.2 — 2026-10-09** (owner: "do all the recommended"; bg3 removed; credits researched). Execution plan for the build described in [`FORHANON.md`](../FORHANON.md).
> `FORHANON.md` is the **spec** (what and why). This file is the **plan** (in what order, which files, what is still blocking).
> In Phase 1 a fresh `docs/PROGRESS.md` takes over the day-to-day tracking (resume protocol, checklist, decisions log, session log); this plan stays as the phase map.
> Markers: ✅ done / decided · ⚠️ verify · ❓ owner input needed · ✋ owner checkpoint (stop and show).

---

## 0. Where things stand (2026-10-09)

| Item | State |
|---|---|
| This folder | git repo since Phase 1 (`main` = planning baseline; one stacked branch per phase) |
| Kotoha source | Available **locally** at `../kotoha-fansite` (`main` @ `e5a5cc3`, includes the performance pass + 2026-10-09 data fixes). It's read-only for us: we copy from it and never change it |
| Spec questions | Q1–Q9 ✅ and N1–N5 ✅ (2026-10-09, all as recommended) → §4 |
| Missing logo | ✅ **Recovered** from the Wayback Machine copy of the defunct aiceclass.com (§1.2) |
| Accounts / infra | Nothing created. Neon, Cloudinary preset, Vercel project, GitHub repo all wait for Phase 5 / owner OK |

---

## 1. Assets

### 1.1 What the owner supplied (`assets/`)

| File | Size | Content | Hanon solo? | Visible signature |
|---|---|---|---|---|
| `backgrounds/bg1.jpeg` | 2048×1072 | Hanon & Kotoha, balloons + rainbow, yellow frame baked in | duo | none spotted · **artist not found yet** |
| `backgrounds/bg2.jpeg` | 3840×2160 | Hanon & Kotoha as astronauts, deep navy space, gradient frame | duo | none spotted · **artist not found yet** |
| ~~`backgrounds/bg3.jpeg`~~ | 2048×1260 | **Removed 2026-10-09** (owner): signed `@l_millefeuille_` with "No AI training / No reuploading". Moved to the desktop Trash, not used anywhere | duo | ✗ |
| `backgrounds/bg4.jpeg` | 2048×1445 | Hanon & Kotoha café selfie, drinks | duo | ✅ **@snowclole** `x.com/snowclole/status/1784902250097422367` (byte-identical to Kotoha's credited Discography art) |
| `backgrounds/bg5.jpeg` | 2048×1536 | Hanon & Kotoha in white dresses, "HaKoniwa Lily 4th Anniversary", mostly white | duo | ✅ **@snowclole** `x.com/snowclole/status/1962514323965952440` (byte-identical to the post's image) |
| `backgrounds/bg6.jpeg` | 2048×1152 | **Hanon + giant penguin plush**, pale blue/white, crown, pixel hearts | **solo** | ✅ **逢坂レイ @6963Saki**: clean version of the thumbnail art of Hanon's cover おまえも♡ (`youtu.be/w41z2znVTmQ`, description credits "Thumbnail Illust：逢坂レイ"). Exact X post not found → link the artist's profile |
| `backgrounds/bg7.jpeg` | 2894×2039 | **Hanon close-up**, pink background, blue cosmetics + polaroids, lace edges | **solo** | ✅ **@Parfait_Pie_12** `x.com/Parfait_Pie_12/status/1596201447003394048` (2nd image; the 1st is Kotoha's News art) |
| `model/charactermodelsheet.jpeg` | 1228×800 | Official turnaround (4 views), "©AiceClass" in corner | solo | ©AiceClass |
| `model/hanonpromotional.png` | 1386×1732 | Official debut key visual (full body + bust + logo). **It's a JPEG with a `.png` name** → rename to `.jpg` in Phase 3 | solo | (official) |
| `icons/hanon_icon.jpeg` | 400×400 | Avatar: **Hanon's current X profile icon** (same art, slightly different crop) | solo | illustrator not stated → "Artist unknown" (like Kotoha's) |
| `icons/{twitter,youtube,twitch,twitcasting,moesoft_logo}.png` | | Same files as the Kotoha set → reuse as is | | |

Note: **5 of the 7 backgrounds are duo art** (Hanon × Kotoha). That suits a sister site, but Home and About should use the two solo pieces so the site reads as Hanon's first.

### 1.2 Recovered from the archived AiceClass site ✅ (owner asked for the logo, 2026-10-09)

aiceclass.com now returns 404, but the Wayback Machine still has its image files. Both files are **official AiceClass art**, so the credit is "© AiceClass" (the same credit the Kotoha site uses for its model).

| Saved as | Source (Wayback capture) | Size | Use |
|---|---|---|---|
| `assets/icons/hanon_logo.png` | `http://aiceclass.com/top/images/name_hanon.png` @ `20240529110027` | 1021×270 RGBA (content 822×270, transparent padding) | **The logo from the Instagram post** `CuMhc4XxAut` (2023-07-02 debut announcement): blue script "Hanon", penguin in a top hat, shell, music notes, white die-cut edge. Same proportions as Kotoha's logo (1000×288) |
| `assets/model/hanon_fullbody_model_front_only.png` | `https://aiceclass.com/hanon/images/img_hanon.png` @ `20260312070950` | 1072×1744 RGBA | Transparent front-view full body: **About stage pose** (until the owner supplies a different pose) + gallery seed (mirrors Kotoha's `kotoha_fullbody_model_front_only.png`) |

Also archived but **not downloaded** (ask if wanted): `top/images/img_hanon.png` (older 1028×1546 version of the same model), `hanon/images/shadow_hanon.png` (faded bust decoration, 780×600), `talent/images/thumbnail_hanon.png` (148×148).
Network note: `web.archive.org` doesn't resolve with this machine's DNS; `curl --resolve web.archive.org:443:207.241.237.3 …` works. Raw files: `https://web.archive.org/web/<timestamp>id_/<original-url>`.

**Logo colours** (sampled): blue `#5098f8`, cyan `#68d0f8`, pale cyan `#a8e8f8`, pink `#f8a8c8`/`#f898c0`, white edge. The approved palette (§5.2 of the spec) already fits: the logo blue sits between `--sky-400 #79b5ff` and `--sky-500 #4a90d9`. The logo's **pink** (also in her hair tips) can be a tiny decorative accent (hearts, the duo 🍀 touch); it's never used as a text or base colour.

### 1.3 Gaps vs. the Kotoha asset set (spec §6.4)

| Needed | Have | Gap / plan |
|---|---|---|
| 5 section artworks | 7 backgrounds | ✅ enough. Proposed mapping in §1.4 |
| 3 loader artworks | 1 left after sections (bg5) | ✅ N5: use what's available → loader1 = bg5, loader2 = bg2, loader3 = bg1 (reused section art, own output files so each slot can be swapped later by changing one line in `optimize-images.js`) |
| Name logo (transparent) | ✅ `hanon_logo.png` | trim the padding before resizing (§3, Phase 3) |
| Avatar (square) | ✅ `hanon_icon.jpeg` | Hanon's own X icon, illustrator unknown |
| Full-body pose (transparent) | ✅ official front model | owner may prefer a real pose later |
| Mascot (cameo, empty states) | ❌ none | ✅ Q9a: the **SVG penguin sticker** (`#pg-penguin`) instead of mascot art |
| Model sheets (gallery seed) | ✅ turnaround (1228×800, low-res) + front model + key visual | credit "© AiceClass" |
| Platform icons, Moesoft logo | ✅ | reuse |
| favicon, apple-touch-icon, og-image | ❌ | generate in `optimize-images.js` (penguin/star SVG favicon; OG = logo on `#b7d7ef` + key visual) |
| Clover frame PNGs, section divider | n/a | Hanon versions drawn as SVG in the script (ripple/scallop divider) |

### 1.4 Artwork mapping ✅ (Q9b, as recommended; swap any slot later)

| Slot | File | Why | Widths available (landscape) | Focal x (portrait crop, to tune) |
|---|---|---|---|---|
| Home | **bg6** | solo Hanon + penguin = her mark; pale, sits well on `#b7d7ef` | 1280, 1920 (**no 2560**) | ~0.62 |
| About | **bg7** | solo close-up; the pose stands on the left/right over it | 1280, 1920, 2560 | ~0.50 |
| News | **bg4** | everyday/selfie mood fits "latest news" | 1280, 1920 | ~0.68 (Hanon) |
| Discography | **bg2** | space/stars = the stella motif; 4K source. ⚠️ dark navy, check in the style tile that paper notes still read as "light scrapbook" | 1280, 1920, 2560 | ~0.55 |
| Gallery | **bg1** | balloons/rainbow, festive fan-art feel | 1280, 1920 | ~0.50 |
| Loader 1 | **bg5** | 4th anniversary piece, soft white (also mobile menu, like Kotoha's loader1) | 1280, 1920 | ~0.62 |
| Loader 2 | **bg2** (reused) | bg3 removed (N1); placeholder until the owner adds more | 1280, 1920, 2560 | ~0.55 |
| Loader 3 | **bg1** (reused) | placeholder until the owner adds more | 1280, 1920 | ~0.50 |

Kotoha's `index.html` hard-codes `home-2560` / `news-2560` in the backdrop `srcset` → with this mapping Hanon's `srcset`s must list only the widths that exist (home: 1280/1920; about + discography: up to 2560).

---

## 2. Phases

One branch per phase; merge to `main` only with the owner's OK (spec §2 rule 10). Each phase ends with a `docs/PROGRESS.md` session-log entry.

### Phase 0 — Planning (this session)

- [x] Read `FORHANON.md` end to end
- [x] Inventory the supplied assets; find what's missing
- [x] Recover the logo (and the transparent model) from the AiceClass archive
- [x] Size the rebrand work in the Kotoha code (§2 Phase 1 file list)
- [x] Write this plan
- [x] ✋ Owner answers §4 (Q9 + N1–N5): "do all the recommended" (2026-10-09)
- [x] Credits researched on X/YouTube (§1.1)

### Phase 1 — Bring in the Kotoha code, strip Kotoha (branch `phase-1-import`)

1. `git init`, repo-local author: `Moesoft: Moeko Software and Technologies <214653345+PastelSalt@users.noreply.github.com>`. The owner creates the GitHub remote whenever they like (we don't).
2. Copy tracked files from `../kotoha-fansite` **except** the spec §4.1 list:
   ```
   rsync -a --exclude-from=<list> ../kotoha-fansite/ ./
   ```
   Exclude: `.git/`, `.kilo/`, `.vercel/`, `node_modules/`, `.env.local`, `previous_failed_attempt_*`, `references/`, `assets/` (keep ours), `public/assets/bg/`, `public/assets/img/`, `public/assets/og-image.jpg`, `public/assets/svg/{clover-fill,clover-outline,divider}.svg` (generated Kotoha art), `public/favicon*`, `public/apple-touch-icon.png`, `docs/kotoha_*.md`, `docs/PROGRESS.md`, `docs/JA_REVIEW_LIST.md`, `docs/IMPLEMENTATION_PLAN.md`, `docs/DESIGN_V2_PLAN.md`, `FORHANON.md` (ours is the master), `MIGRATION.md`, `README.md` (rewrite).
   Keep as references and rebrand: `docs/DESIGN_SYSTEM.md` (the scrapbook vocabulary the spec §5.1 points to), `docs/PERFORMANCE_PLAN.md`.
3. Delete `public/js/public/motion/wipe.js` (unused; nothing imports it).
4. Rename/replace pass. The spec §4.2 table **misses several files**; the full list from a grep of the Kotoha repo (hit counts):
   - Spec table files: `package.json`(+lock), `lib/auth.js`, `api/track.js`, `prepaint.js`, `i18n-core.js`, `admin/prepaint.js`, `motion-boot.js`, `motion/prefs.js`, `lib/cloudinary.js`, `.env.example`, `seed-gallery.js`, `lib/password.js`, `api/admin.js`, `prelaunch-reset.js`, `optimize-images.js`, `data.js`, `countdown.js`, `home.js`, `fx.js`, `locales/{en,ja}.json`, `index.html` (64), `tokens.css`, `v2-sprite.svg`, `vercel.json`, `0001_init.sql`, `seed.sql`
   - **Not in the spec table:** `css/v2/components.css` (30 — `--clover-mask`, `.clover-meter`, nav dot), `css/v2/layout.css` (8 — `.clover-stage`, menu button "three small clovers"), `css/v2/motion.css` (5 — `.clover-spinner`), `css/v2/base.css` (2), `js/public/motion/spinner.js` (9 — clover geometry), `motion/sparkles.js` (4 — `cl-leaf` pools + green/pink colours), `render.js` (5) and `main.js` (5) (`sprite('cl-leaf', …)` call sites), `loader.js` (3), `motion/scroll-life.js` (2), `css/admin.css`, `login.html`, `admin.html`, `locales/admin/{en,ja}.json`
   - Class names: `clover-*` → `sazanami-*`/`star-*` per role (`.clover-spinner` → `.star-spinner`, `.clover-meter` → `.star-meter`, `.clover-stage` → `.ripple-stage`, `cl cl--pink` → `pg pg--…`).
   - Identifiers: `kf_` → `hf_` (cookie, `hf_lang`, `hf_motion`), folder/preset/tags per spec §4.2.
5. One schedule constant: `countdown.js` exports `STREAM_DAYS = [1, 4]` (Mon, Thu), `START_UTC_HOUR = 12`; `home.js` week strip derives its highlighted days from it (removes Kotoha's hard-coded `i === 1 || i === 4`).
6. Placeholder content: empty Kotoha rows out of `db/seed.sql`, locales reduced to Hanon placeholders, `data.js` CREDITS/SOCIALS emptied (filled in Phases 3–4).
7. Fresh `docs/PROGRESS.md` (same section structure as Kotoha's: resume protocol, hard rules, objectives, environment facts, key decisions, phase checklist, current focus, open questions, owner action items, technical decisions log, known issues, session log) and an empty `docs/JA_REVIEW_LIST.md`.
8. `npm install` (needs Node ≥ 22; this machine has v26).

**Done when:** `node scripts/dev-server.js` serves the page locally with placeholder content (`npm run dev` is `vercel dev`, which needs a linked Vercel project), and the grep `kotoha|Kotoha|KOTOHA|ことは|ことリス|Kotorisu|kf_|clover|cl-leaf|🍀` finds only intentional hits (duo mentions, sister-site link, the spec itself).

### Phase 2 — Identity: palette, sprite, loader (branch `phase-2-identity`) ✋ style tile

1. `tokens.css`: sky/gold/paper/ink tokens from spec §5.2; navy-tinted shadows; sky-white `--veil`; placeholder section accents.
2. `v2-sprite.svg`: illustrated, filled, die-cut white edge, gloss, `--c1..--c4`. No `--` inside XML comments.
   - `#pg-penguin` (round chibi penguin; replaces `#cl-leaf` everywhere), `#drop`, `#ripple`, `#star` (4-point stella), keep `#spark`, `#heart`.
   - Proposed extra: **`#shell`** (scallop shell; it's in the logo and her hair clip) → §4 N4.
3. Shape mask: Kotoha's `--clover-mask` clips photos into clovers. Hanon: **scallop-shell mask** (if N4 = yes) or star mask.
4. Loader spinner (`spinner.js`, `index.html` static markup, `motion.css`): two counter-rotating 4-point stars (outer white with blue edge, inner pale blue). The 4 rays replace the 4 petals as progress quadrants (same clockwise fill order). Static penguin in the centre that doesn't rotate. Turns from first paint (pure CSS), slower in calm mode, same iris exit.
5. Progress meter in the nav (`.star-meter`), nav-pill dot, menu button (three small penguins), week-strip stream-day markers, credits bullets → penguin/star symbols.
6. `fx.js`: special days `3-6`, `7-9` (JST); confetti `shapeFromText('🐧')` + circles, colours `#79b5ff #b7d7ef #ffffff #ffd66b #1f5e9e`. `sparkles.js` pools: penguin/star/drop in blue + gold.
7. Favicon SVG (penguin on white die-cut), `favicon-32.png`, `apple-touch-icon.png` generated by `optimize-images.js`.
8. **Style tile** for the owner: one page showing palette, type, sprite symbols, a paper note, sticker, stamp, the spinner and the logo on the base blue. Shown locally (not deployed).

**Done when:** the owner approves the style tile ✋.

### Phase 3 — Art wired in (branch `phase-3-art`)

1. Rename `hanonpromotional.png` → `hanonpromotional.jpg` (it's a JPEG).
2. `optimize-images.js`: `BACKGROUNDS` per the mapping the owner approves (§1.4) with tuned focal points; `UI_IMAGES`: logo (**`sharp().trim()` first**, content is 822×270 → emit 410/820 and update `width`/`height` attributes so there's no layout shift), profile 200/400 from `hanon_icon.jpeg`, pose 450/900 from the front model, no mascot entries unless Q9 brings one.
3. `index.html` backdrop/loader `srcset`s list only the widths that exist; `fetchpriority="low"` on non-Home art.
4. Pick `--accent-home/about/news/disco/gallery` from each artwork (same method as Kotoha).
5. `CREDITS` in `data.js` (`null` → "Artist unknown (作者不明)"); model credit line "© AiceClass" stays (historical, as on Kotoha).
6. Gallery seed list for `seed-gallery.js`: front model, turnaround sheet, key visual (© AiceClass) + fan art the owner clears.

**Done when:** every section shows Hanon art in EN and JA, portrait crops checked at 390 px.

### Phase 4 — Copy: locales EN/JA (branch `phase-4-copy`)

1. About (spec §7.2): bio, 8 pills (birthday March 6 · Pisces; 152 cm; activities; debut singer 2018 / VTuber 2023-07-09 *with AiceClass* as history; はのメン 🐧 + blue; Mon & Thu 21:00 JST #はのらじ; hashtags; favourites), "Did you know?" facts, bubbles (site voice only, never Hanon's words).
2. Background words `HANON / PROFILE / NEWS / MUSIC / FAN ART`, rotating badge `HANON ✦ FAN SITE ✦ はのん ✦` (inline `textPath`), marquee (spec §5.3, no AiceClass), vertical JP lines, titles/meta/OG/hreflang for `hanon-fansite.vercel.app`.
3. Footer: disclaimer (non-affiliation wording copied from Kotoha's AiceClass-as-history pattern), official links (§7.3), credits, privacy note. Sister-site link stays hidden until both sites are live (Q8).
4. Every Claude-written Japanese line → `docs/JA_REVIEW_LIST.md`.

**Done when:** EN ↔ JA complete, no missing keys, no overflow at 390 px.

### Phase 5 — Infra + seed (needs owner OK for **each** resource) ✋

Before seeding, settle the ⚠️ items with the sources in spec §13:
- [ ] 誓いはキュンと。— exact date and credit (unit vs. Hanon solo ver.)
- [ ] Vox EPs — Winter / Spring / Summer / Autumn dates (open hakoniwalily.jp `/release/` pages)
- [ ] エレクトリック・シティ — release date (MV is 2026-07-17)
- [ ] ソロライブ「アイオライト」2019-11-03; activity start 2018 exact date
- [ ] 決戦スピリット THE FIRST TAKE ver. date (add only if found)
- [ ] Profile ⚠️ fields: blood type O, catchphrase, hobbies, 「皇帝ペンギンたち」 meaning (leave out anything that stays unverified)
- [ ] Unit description wording on hakoniwalily.jp/profile

Then, each with a separate OK:
1. Neon project `hanon-fansite` → `npm run db:migrate` → `npm run db:seed` (videos ≥ 3 newest, news §7.6, achievements §7.7, discography §7.8).
2. Cloudinary (same cloud): folder `hanon-fansite/gallery`, preset `hanon_gallery_signed` → `gallery:seed`.
3. Vercel project `hanon-fansite`, region `sin1`, `outputDirectory: public`, env vars (new `ANALYTICS_SALT`, `DATABASE_URL` Sensitive). The owner puts the bootstrap admin credentials in `.env.local` and Vercel themself.

**Done when:** `/api/public/*` returns Hanon data.

### Phase 6 — Admin smoke test

Login, forced password change, CRUD per content type, archive/restore, gallery upload + delete, admin numbering (`<owner>2`, …), analytics views.

### Phase 7 — Performance + behaviour harness (commit it this time) — `scripts/perf/`

- `server.js` (static `public/` + `vercel.json` CSP, proxy `/api/public/*` read-only, `/api/track` → 204)
- `cdp.js` (headless Chrome over CDP with Node's `WebSocket`, `--headless=new --use-angle=gl --ignore-gpu-blocklist`)
- `scroll-bench.js` (wheel scroll down/up, rAF frame recorder + `scrollY`, tracing summary, 4× CPU option)
- `behaviour.js` (the ~35 checks of spec §9.4), `shots.js` (1920/1366/390 per section + diff)
- Targets (spec §9.3): ≥ 58 fps desktop; ≥ 35 fps at 1366×768 with 4× CPU on a weak GPU; no long tasks > 50 ms while scrolling; INP < 200 ms; CLS < 0.1. Effects budget ≤ Kotoha's (spec §9.2).

### Phase 8 — QA ✋

Keyboard/focus, screen-reader labels, contrast (AA), nothing < 13 px, JP line breaks, CSP/SRI (re-verify GSAP/SplitText/confetti hashes against served bytes), real phones (owner), cross-links with the Kotoha site (owner OK).

### Phase 9 — Launch ✋

Production deploy, `prelaunch:reset` (OK), first owner login, remove bootstrap env vars, then the Kotoha footer link (separate commit in the Kotoha repo, approved per Q8).

---

## 3. Watch-outs (from the spec's lessons, applied to Hanon specifically)

- **Spinner geometry is new code**, not a recolour: the clover quadrants map onto star rays, but the clip paths and the centre point change. Keep the static-markup-spins-first rule.
- **bg2 is the only dark artwork.** If the paper notes look heavy on it, swap Discography ↔ Gallery art or raise the veil for that section only.
- **Logo has transparent padding** (~100 px each side): trim, or the Home header will look off-centre next to Kotoha's.
- **`srcset` vs. emitted files:** the optimizer skips widths larger than the source; the hard-coded `srcset`s must follow.
- `.vercelignore` patterns anchored with `/`; `[hidden] { display:none !important }` stays; no `content-visibility` on sections; no `backdrop-filter`; no per-frame root custom properties; no Lenis, no snapping.
- Never write `--` inside SVG comments (the new sprite is the risky file).

---

## 4. Questions for the owner (with recommendation + confidence)

| # | Question | Recommendation | Confidence | Answer |
|---|---|---|---|---|
| Q9a | Does Hanon have a mascot (like Kotoha's) for the cameo / empty states? | No art needed: use the illustrated **penguin sticker** (`#pg-penguin`) for the cameo and empty/error states. (The top-hat penguin in her logo could be its look.) | medium | ✅ 2026-10-09 as recommended |
| Q9b | Artwork → section mapping and credits | Mapping in §1.4. Credits: owner supplies X handle + post URL per file; unknown → "Artist unknown (作者不明)" | medium | ✅ mapping as recommended; owner: "find the authors on X" → 4 of 6 found (§1.1); bg1, bg2 still unknown |
| N1 | **bg3** is signed `@l_millefeuille_` with "No AI training / No reuploading". Use it? | **Leave it out** unless the artist gives permission (a fan site showing it publicly is a re-upload) | high | ✅ owner: don't use, delete it (moved to the Trash) |
| N2 | OK to use the two files recovered from the archived AiceClass site (logo, front model) with "© AiceClass", like the Kotoha site's model credit? | yes | high | ✅ 2026-10-09 as recommended |
| N3 | Code transfer: copy from the local `../kotoha-fansite` folder (read-only) with the exclude list in Phase 1, and `git init` here? | yes; the owner adds the GitHub remote whenever they want | high | ✅ 2026-10-09 as recommended |
| N4 | Add a **shell** motif (sprite `#shell` + shell-shaped photo mask)? It's in her logo and hair clip | yes, as the mask; keep the penguin as the main icon | medium | ✅ 2026-10-09 as recommended |
| N5 | Only 1–2 loader images remain after the 5 sections. Run with fewer loaders, or will you add 1–2 more solo Hanon pieces (#はのぴく)? | run with what we have now; add solo pieces later (no code change needed) | medium | ✅ owner: use what's available now, replace later |

---

## 5. Asset provenance log

| Date | File | Source | By |
|---|---|---|---|
| (owner) | `assets/backgrounds/*`, `assets/model/charactermodelsheet.jpeg`, `assets/model/hanonpromotional.png`, `assets/icons/hanon_icon.jpeg` | supplied by the owner | owner |
| (owner) | `assets/icons/{twitter,youtube,twitch,twitcasting,moesoft_logo}.png` | same files as the Kotoha repo | owner |
| 2026-10-09 | `assets/icons/hanon_logo.png` | `web.archive.org/web/20240529110027id_/http://aiceclass.com/top/images/name_hanon.png` (matches Instagram post `CuMhc4XxAut`, 2023-07-02) | Claude, at the owner's request |
| 2026-10-09 | ~~`assets/backgrounds/bg3.jpeg`~~ | removed at the owner's request (artist's "No reuploading" notice); in the desktop Trash | Claude |
| 2026-10-09 | `assets/model/hanon_fullbody_model_front_only.png` | `web.archive.org/web/20260312070950id_/https://aiceclass.com/hanon/images/img_hanon.png` | Claude, alongside the logo |
