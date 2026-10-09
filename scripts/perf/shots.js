// Screenshots of every section at desktop / laptop / phone sizes, for visual review and before/after diffs.
// Waits for the loader to finish, then jumps to each section and lets its artwork crossfade and reveals settle.
// Usage: node scripts/perf/shots.js [baseUrl] [outDir]     (defaults: http://localhost:3000, .cache/shots)
//   env SIZES="1920x1080,1366x768,390x844"  LANGS="en,ja"  MOTION=full|calm  LOADER=1 (also capture the loader)
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { launchChrome, sleep } from './cdp.js';

const base = process.argv[2] || 'http://localhost:3000';
const outDir = process.argv[3] || '.cache/shots';
const sizes = (process.env.SIZES || '1920x1080,1366x768,390x844').split(',').map((s) => s.split('x').map(Number));
const langs = (process.env.LANGS || 'en').split(',');
const sections = ['home', 'about', 'news', 'discography', 'gallery', 'site-footer'];

await mkdir(outDir, { recursive: true });
const chrome = await launchChrome({ width: 1366, height: 768 });
const errors = [];
try {
  for (const [w, h] of sizes) {
    for (const lang of langs) {
      const page = await chrome.newPage();
      page.on('Runtime.exceptionThrown', (p) => errors.push(`${w}x${h} ${lang}: ${p.exceptionDetails?.exception?.description || p.exceptionDetails?.text}`));
      page.on('Log.entryAdded', (p) => { if (p.entry.level === 'error') errors.push(`${w}x${h} ${lang}: ${p.entry.text} ${p.entry.url || ''}`); });
      await page.viewport(w, h);
      if (process.env.MOTION === 'calm') await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      await page.goto(`${base}/?lang=${lang}`);
      if (process.env.LOADER) {
        await sleep(1500);
        await page.screenshot(path.join(outDir, `${w}x${h}-${lang}-0-loader.png`));
      }
      await page.waitFor('!document.getElementById("loader")', { timeout: 20000 });
      await sleep(2600);                                    // home intro (GSAP) + reveals
      for (const [i, id] of sections.entries()) {
        await page.eval(`document.getElementById(${JSON.stringify(id)}).scrollIntoView({ behavior: 'instant', block: 'start' })`);
        await sleep(1400);                                  // backdrop crossfade (0.9 s) + scroll-driven reveals
        await page.screenshot(path.join(outDir, `${w}x${h}-${lang}-${i + 1}-${id}.png`));
      }
      page.close();
    }
  }
} finally {
  await chrome.close();
}
console.log(`shots → ${outDir}`);
if (errors.length) { console.log('page errors:'); errors.forEach((e) => console.log(' ', e)); process.exitCode = 1; }
