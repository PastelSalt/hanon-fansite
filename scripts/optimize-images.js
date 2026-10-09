// Builds web-ready images in public/assets from the untouched originals in assets/.
//   * backgrounds → WebP landscape widths + portrait (9:16) crops centred on a focal point
//   * UI images   → WebP at 1x/2x widths (alpha kept)
//   * vector      → favicon (SVG penguin) + PNG favicons
//   * favicon PNGs + Open Graph share image
// Usage: npm run images:optimize            (skips files that already exist)
//        npm run images:optimize -- --force (rebuild everything)
import sharp from 'sharp';
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = (p) => path.join(root, 'assets', p);
const out = (p) => path.join(root, 'public', 'assets', p);
const force = process.argv.includes('--force');

const exists = (p) => access(p).then(() => true, () => false);
async function emit(file, build) {
  if (!force && (await exists(file))) return;
  await mkdir(path.dirname(file), { recursive: true });
  await build(file);
  console.log('wrote', path.relative(root, file));
}

// focal = horizontal centre (0–1) of the subject (Hanon) for the portrait crops. Mapping: docs/IMPLEMENTATION_PLAN.md §1.4.
// Loaders 2 and 3 reuse section art until the owner adds dedicated loader artwork (swap the file here, nothing else).
const BACKGROUNDS = [
  { name: 'home', file: 'backgrounds/bg6.jpeg', focal: 0.56 },     // Hanon + giant penguin (逢坂レイ)
  { name: 'about', file: 'backgrounds/bg7.jpeg', focal: 0.5 },     // Hanon close-up, cosmetics (@Parfait_Pie_12)
  { name: 'news', file: 'backgrounds/bg4.jpeg', focal: 0.68 },     // café selfie with Kotoha (@snowclole)
  { name: 'discography', file: 'backgrounds/bg2.jpeg', focal: 0.6 }, // astronauts (artist unknown)
  { name: 'gallery', file: 'backgrounds/bg1.jpeg', focal: 0.3 },   // balloons + rainbow (artist unknown)
  { name: 'loader1', file: 'backgrounds/bg5.jpeg', focal: 0.62 },  // 4th anniversary (@snowclole); also the mobile menu
  { name: 'loader2', file: 'backgrounds/bg2.jpeg', focal: 0.6 },   // = discography art (placeholder)
  { name: 'loader3', file: 'backgrounds/bg1.jpeg', focal: 0.3 },   // = gallery art (placeholder)
];
const LANDSCAPE_WIDTHS = [1280, 1920, 2560];
const PORTRAIT_WIDTHS = [720, 1080];

const UI_IMAGES = [
  // name logo recovered from the archived aiceclass.com; trimmed to its content (822×270) before resizing
  { name: 'logo', file: 'icons/hanon_logo.png', widths: [400, 800], extract: { left: 98, top: 0, width: 822, height: 270 } },
  { name: 'moesoft', file: 'icons/moesoft_logo.png', widths: [360, 707] },
  { name: 'profile', file: 'icons/hanon_icon.jpeg', widths: [200, 400] },
  // official front-view model (© AiceClass), trimmed to the figure (752×1611)
  { name: 'pose', file: 'model/hanon_fullbody_model_front_only.png', widths: [400, 752], extract: { left: 164, top: 133, width: 752, height: 1611 } },
  { name: 'icon-x', file: 'icons/twitter.png', widths: [96] },
  { name: 'icon-youtube', file: 'icons/youtube.png', widths: [96] },
  { name: 'icon-twitch', file: 'icons/twitch.png', widths: [96] },
  // Official TwitCasting app icon (Moi Corporation brand guideline pack): resized only, never altered
  { name: 'icon-twitcasting', file: 'icons/twitcasting.png', widths: [96] },
];

// Favicon: the site's penguin sticker, flattened to fixed colours (no CSS variables, no <use>) so every renderer draws it
const PENGUIN = [
  '<g fill="#fff" stroke="#fff" stroke-width="10" stroke-linejoin="round">',
  '<path d="M0 -40 C 22 -40 36 -24 36 0 C 36 24 26 42 0 42 C -26 42 -36 24 -36 0 C -36 -24 -22 -40 0 -40 Z"/>',
  '<path d="M-32 2 C -44 7 -47 21 -41 29 C -36 25 -31 17 -29 10 Z"/><path d="M32 2 C 44 7 47 21 41 29 C 36 25 31 17 29 10 Z"/>',
  '<ellipse cx="-13" cy="42" rx="10" ry="5"/><ellipse cx="13" cy="42" rx="10" ry="5"/></g>',
  '<ellipse cx="-13" cy="42" rx="10" ry="5" fill="#ffc53d"/><ellipse cx="13" cy="42" rx="10" ry="5" fill="#ffc53d"/>',
  '<path d="M-32 2 C -44 7 -47 21 -41 29 C -36 25 -31 17 -29 10 Z" fill="#3b82e0"/><path d="M32 2 C 44 7 47 21 41 29 C 36 25 31 17 29 10 Z" fill="#3b82e0"/>',
  '<path d="M0 -40 C 22 -40 36 -24 36 0 C 36 24 26 42 0 42 C -26 42 -36 24 -36 0 C -36 -24 -22 -40 0 -40 Z" fill="#4f97f5"/>',
  '<path d="M0 -18 C -5 -27 -24 -28 -27 -10 C -30 6 -18 18 0 19 C 18 18 30 6 27 -10 C 24 -28 5 -27 0 -18 Z" fill="#fff"/>',
  '<ellipse cx="0" cy="31" rx="19" ry="10" fill="#fff"/>',
  '<circle cx="-10" cy="-4" r="4.6" fill="#1d3b66"/><circle cx="10" cy="-4" r="4.6" fill="#1d3b66"/>',
  '<ellipse cx="-18" cy="5" rx="5" ry="3.2" fill="#ffb8cf"/><ellipse cx="18" cy="5" rx="5" ry="3.2" fill="#ffb8cf"/>',
  '<ellipse cx="0" cy="3.5" rx="6.5" ry="4.3" fill="#ffc53d"/>',
  '<path d="M0 21 L-10 15.5 C -12 19 -12 23 -10 26.5 Z M0 21 L10 15.5 C 12 19 12 23 10 26.5 Z" fill="#ff8fb8"/><circle cx="0" cy="21" r="3" fill="#ff8fb8"/>',
].join('');
const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -48 100 100">${PENGUIN}</svg>\n`;

async function backgrounds() {
  for (const bg of BACKGROUNDS) {
    const input = src(bg.file);
    const { width: W, height: H } = await sharp(input).metadata();
    for (const w of LANDSCAPE_WIDTHS.filter((w) => w <= W)) {
      await emit(out(`bg/${bg.name}-${w}.webp`), (f) =>
        sharp(input).resize({ width: w }).webp({ quality: 72, effort: 5 }).toFile(f));
    }
    // portrait crop: full height, 9:16 window centred on the focal point
    const cropW = Math.min(W, Math.round((H * 9) / 16));
    const left = Math.max(0, Math.min(W - cropW, Math.round(bg.focal * W - cropW / 2)));
    // Always emit both portrait sizes so the frontend can rely on fixed names; small originals
    // (about/gallery ≈ 600 px wide crops) are upscaled here instead of by the browser.
    for (const w of PORTRAIT_WIDTHS) {
      await emit(out(`bg/${bg.name}-p${w}.webp`), (f) =>
        sharp(input).extract({ left, top: 0, width: cropW, height: H }).resize({ width: w })
          .webp({ quality: 72, effort: 5 }).toFile(f));
    }
  }
}

async function uiImages() {
  for (const img of UI_IMAGES) {
    for (const w of img.widths) {
      await emit(out(`img/${img.name}-${w}.webp`), (f) => {
        const base = img.extract ? sharp(src(img.file)).extract(img.extract) : sharp(src(img.file));
        return base.resize({ width: w, withoutEnlargement: true }).webp({ quality: 82, alphaQuality: 90, effort: 5 }).toFile(f);
      });
    }
  }
}

async function vectors() {
  await emit(path.join(root, 'public', 'favicon.svg'), (f) => writeFile(f, FAVICON_SVG));
  await emit(path.join(root, 'public', 'favicon-32.png'), (f) => sharp(Buffer.from(FAVICON_SVG)).resize(32, 32).png().toFile(f));
  await emit(path.join(root, 'public', 'apple-touch-icon.png'), (f) =>
    sharp(Buffer.from(FAVICON_SVG)).resize(160, 160).extend({ top: 10, bottom: 10, left: 10, right: 10, background: '#b7d7ef' })
      .flatten({ background: '#b7d7ef' }).png().toFile(f));
}

async function ogImage() {
  await emit(out('og-image.jpg'), async (f) => {
    const base = await sharp(src('backgrounds/bg6.jpeg')).resize(1200, 630, { fit: 'cover', position: 'centre' }).toBuffer();
    const logo = await sharp(src('icons/hanon_logo.png')).extract({ left: 98, top: 0, width: 822, height: 270 }).resize({ width: 560 }).toBuffer();
    await sharp(base).composite([{ input: logo, left: 40, top: 40 }]).jpeg({ quality: 82, mozjpeg: true }).toFile(f);
  });
}

await backgrounds();
await uiImages();
await vectors();
await ogImage();
console.log('images: done');
