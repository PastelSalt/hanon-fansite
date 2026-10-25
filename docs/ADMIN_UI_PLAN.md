# Hanon Fan Site — Admin Panel UI Refresh (port of the Kotoha refresh)

| | |
|---|---|
| **Status** | **v0.2 (2026-10-25): live on production** (commit `27caad2`, merge `bb32e5e` into `main`). Checked on a mock preview + production files/`/login`; a real-data check (owner signs in) is still open |
| **Reference** | Kotoha's plan `../kotoha-fansite/docs/ADMIN_UI_PLAN.md` (read it for the why: problems found, dashboard layout, component list, ground rules) and its commit `dc82320` (the change itself, incl. the wide-screen fix: content max-width = sidebar + 1640px, `auto-fit` grids) |
| **Scope** | Same as Kotoha: look and layout of `/admin` + `/login` only, with the data the API already returns. No API/lib/DB/scripts/vercel.json changes, no new libraries, features or dark mode |
| **Rule** | The two admin panels stay identical in **layout, components, behaviour and locale keys**. Only the **theme** differs |

This file lists only what differs for Hanon. Everything not mentioned here is exactly as in Kotoha's plan.

---

## 1. Starting point

Hanon's admin was a copy of Kotoha's **old** admin, re-skinned sky blue: every file in `public/js/admin/*` was byte-identical to Kotoha's pre-refresh version (`dc82320^`), and `admin.html`, `login.html` and the admin locales differed only in branding (title, logo, the password blocklist words `hanon, penguin`). So the port is:

1. take Kotoha's refreshed `admin.html`, `login.html`, `js/admin/{analytics,content,gallery,main,pages,ui}.js`, `locales/admin/{en,ja}.json` as they are;
2. put Hanon's branding back (titles, `logo-400.webp` 400×131, `hanon/penguin` in the password rule);
3. swap the theme (§2) in `css/admin.css` and the sprite references (§3).

## 2. Theme mapping (Clover Scrapbook → Sazanami Scrapbook)

Values come from `public/css/v2/tokens.css` / `components.css`; `admin.css` keeps its own copy (no `@layer` import), as in Kotoha.

| Kotoha | Hanon | Notes |
|---|---|---|
| page `--pink-300` + white dots | `--sky-300` `#b7d7ef` + the same dot pattern (dots 0.36 alpha) | ink on the page 8.6:1 |
| paper `#fffaf2`, sunken `#f7efe3` | `--paper` `#f7fbff`, sunken `#eaf2fa` | |
| ink `#2b3326` / ink-soft `#56614f` | `#22324a` / `#4a5b72` | ink-soft on paper 6.7:1 |
| green = content (buttons, tiles, active nav, split bars, bars, dropzone) | `--sky-500/600/700/900` | sky-700 text on paper 6.4:1; white on sky-700 6.7:1 |
| green sticker `green-500 → 600` | Hanon `.sticker` gradient `sky-500 → sky-600` | white on it 3.3–4.7:1 → sticker text kept ≥ 19px bold (AA large text); `sticker--sm` 18 → 19px |
| **pink = visitors** (sticker, KPI numbers, visits chart, chart tip, legend, archive/admin row icons, section pill, topbar "Admin" badge) | **gold** `--gold-200/300/500/600/700` (+ admin-only `--gold-50 #fff8e6`, `--gold-200 #ffe7a3`); sticker = Hanon's `.sticker--gold` (`gold-600 → 700`) | **Judgment call (§4).** KPI numbers gold-700 on paper 4.8:1; white on the gold sticker 3.5–5.0:1 (large text) |
| pink hover on sidebar links | `sky-50` / `sky-900` (as the public nav pill) | 10:1 |
| focus ring pink-700 | gold-700 (Hanon's `--focus-ring`) | |
| pink/green-tinted shadows | Hanon's `--shadow-paper/lift/modal/sticker` (navy-tinted) + `--shadow-sticker-gold` for the gold sticker | |
| beige dashed draft outlines `#c8b79f` etc. | `--dash` `#a9c3dd`; hairlines `--line` `#d6e3ef` | |
| `pill--admin` blue-soft | `sky-100` / `sky-900` | |
| dialog backdrop / mobile scrim plum | navy `rgb(16 36 64)` | |
| busiest-hours bars green-300 / peak green-600 | `sky-400` / `sky-600` | |

Unchanged: danger red, amber "owner/warn" pills, toast colours (ok = sky-700).

## 3. Sprite icons (`/assets/svg/v2-sprite.svg`)

`ui.js` `clover(variant, extraClass)` → **`penguin(variant, extraClass, symbol = 'pg-penguin')`**, class `.pg` (+ `.pg--gold` / `.pg--white`), same call sites. `sticker(…, { pink })` → `sticker(…, { gold })`; `.item__icon--pink` → `.item__icon--gold`.

| Place | Kotoha | Hanon |
|---|---|---|
| Sticker titles | white clover | penguin (gold-bow penguin on the gold visitors sticker) |
| Sidebar group labels | clover / pink clover / clover | Content = penguin · Records = gold `#shell` · Account = `#star` |
| Welcome card corner | pink clover | gold `#star` |
| User avatar / My Account card | clover (owner) / pink clover (admin) | penguin (owner) / gold-bow penguin (admin) |
| Empty states | pink clover (big) / clover (small) | penguin (big) / `#drop` (small) |
| Login card | clover + pink clover | penguin (top left) + gold `#star` (bottom right) |

## 4. Judgment calls

- **Visitors = gold.** Hanon's public site uses gold-700 as its warm accent (NEW stamp, ribbons, active nav link) and ships `.sticker--gold`, so gold is the closest match to Kotoha's "second brand colour" role and stays clearly apart from the blue content colour. Logo pink was rejected (public design system: decorative only, never text).
- **Sticker text size:** the public sky/gold sticker gradients are kept as they are; instead `sticker--sm` went from 18px to 19px so every sticker label counts as AA large text.
- **Japanese:** the admin locale was already identical to Kotoha's, so the new strings use the same wording; appended to `docs/JA_REVIEW_LIST.md` §5.

## 5. Preview (no `.env.local` in this checkout)

Mock server in the session scratchpad (never in the repo), launch config `admin-preview` in `.claude/launch.json` (git-ignored), port **3001** (Kotoha's preview keeps 3000 for side-by-side checks): serves `public/` with the `vercel.json` headers (CSP), proxies `/api/public/*` read-only to https://hanon-fansite.vercel.app, fakes `/api/auth/*` + `/api/admin/*` in memory (any username/password; mock users `penguinhanon`, `penguinhanon2/3`, two Japanese mock drafts), swallows `/api/track`. Gallery uploads answer "not configured".

## 6. Checklist

- [x] P0 Read Hanon's PROGRESS/DESIGN_SYSTEM/tokens/components and Kotoha's plan + `dc82320`; confirmed the admin JS was identical to Kotoha's old version
- [x] P1 Port on branch `admin-ui-refresh`: HTML, JS, locales from Kotoha + Hanon branding; `admin.css` re-themed (§2); sprite icons (§3); JA strings appended
- [x] P2 Mock preview checks: all 10 routes in EN + JA at 1920 / 1366 / 1024 / 375 px with no sideways scroll and no error states; chart hover label; range switch (30 → 90 days updates the two range KPIs); News edit dialog + save; mobile menu (scrim, Esc closes and returns focus to the toggle, tap on the scrim closes, focus moves into the menu); CSP header served; console clean except the expected 401 `auth/me` on `/login`
- [x] ✋ Owner approved the preview (2026-10-25), no adjustments
- [x] P3 Commit `27caad2` on `admin-ui-refresh` (secret scan clean, trailer) → pushed → merged into `main` (`bb32e5e`) → deployed. Production `admin.css`, `js/admin/*` and admin locales match the commit byte for byte; `/admin` + `/login` serve the new markup; CSP present; no console errors besides the expected 401
- [ ] P4 Real-data check after deploy (owner signs in; nothing in this checkout can reach Neon)
