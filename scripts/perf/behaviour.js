// Behaviour suite (FORHANON.md §9.4): drives the public page in headless Chrome and checks the things that broke or
// mattered on the Kotoha site. Prints one line per check and exits non-zero if any fails.
// Usage: node scripts/perf/behaviour.js [baseUrl]          (default http://localhost:3000)
// Gallery/lightbox checks are skipped when the gallery is empty (local preview without Cloudinary).
import { launchChrome, sleep } from './cdp.js';

const base = process.argv[2] || 'http://localhost:3000';
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok: !!ok }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`); };
const skip = (name, why) => console.log(`skip  ${name}  (${why})`);

const chrome = await launchChrome({ width: 1366, height: 768 });
try {
  // ------------------------------------------------------------------ desktop, full motion
  const page = await chrome.newPage();
  const problems = [];
  page.on('Runtime.exceptionThrown', (p) => problems.push(p.exceptionDetails?.exception?.description || p.exceptionDetails?.text));
  page.on('Log.entryAdded', (p) => { if (p.entry.level === 'error' || /Content Security Policy/i.test(p.entry.text)) problems.push(p.entry.text); });
  await page.viewport(1366, 768);
  await page.goto(`${base}/?lang=en`);

  await sleep(400);
  const early = await page.eval(`({
    spinner: !!document.querySelector('#loader .star-spinner'),
    turning: getComputedStyle(document.querySelector('.star-spinner__outer')).animationName,
    confetti: !!window.confetti || [...document.scripts].some((s) => /canvas-confetti/.test(s.src)),
  })`);
  check('loader spinner is static markup and turns from first paint', early.spinner && early.turning === 'v2-spin', early.turning);
  check('confetti is not loaded during the loader', !early.confetti);

  await page.waitFor('!document.getElementById("loader")', { timeout: 20000 });
  await sleep(2500);
  check('confetti loads after the loader (idle)', await page.eval(`!!window.confetti || [...document.scripts].some((s) => /canvas-confetti/.test(s.src))`));
  check('the page opens on Home with its artwork active', await page.eval(`document.querySelector('.backdrop__art.is-active')?.dataset.art === 'home'`));

  // a wheel notch moves the page freely (no snapping back)
  await page.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 6, y: 400, deltaX: 0, deltaY: 120 });
  await sleep(900);
  const y1 = await page.eval('scrollY');
  check('one wheel notch scrolls and stays (no snap)', y1 > 40 && y1 < 400, `scrollY=${y1}`);

  // marquee: one looping Web Animation, running
  check('marquee runs as one Web Animation', await page.eval(`(() => { const a = document.querySelector('.marquee__track').getAnimations(); return a.length === 1 && a[0].playState === 'running'; })()`));

  // nav links land exactly on their section, and only that section's artwork is visible
  for (const id of ['about', 'news', 'discography', 'gallery']) {
    await page.eval(`document.querySelector('#nav-links a[data-nav-link="${id}"]').click()`);
    await sleep(2400);                                   // smooth scroll + 0.9 s crossfade + visibility switch
    const r = await page.eval(`({
      top: Math.round(document.getElementById('${id}').getBoundingClientRect().top),
      active: [...document.querySelectorAll('.backdrop__art')].filter((a) => getComputedStyle(a).visibility === 'visible').map((a) => a.dataset.art),
      current: document.querySelector('#nav-links a[aria-current="true"]')?.dataset.navLink,
    })`);
    check(`nav "${id}" lands on the section`, Math.abs(r.top) <= 2, `top=${r.top}`);
    check(`only the ${id} artwork is visible`, r.active.length === 1 && r.active[0] === id, r.active.join(','));
    check(`nav marks "${id}" as current`, r.current === id, r.current);
  }

  // penguin meter fills with page progress
  const fill = await page.eval(`parseFloat(getComputedStyle(document.getElementById('nav-progress')).getPropertyValue('--fill')) || 0`);
  check('penguin progress meter fills', fill > 0.3, `--fill=${fill.toFixed(2)}`);

  // lean only on on-screen cards
  const lean = await page.eval(`(() => { const off = [...document.querySelectorAll('.lean')].filter((el) => { const r = el.getBoundingClientRect(); return r.bottom < -innerHeight || r.top > 2 * innerHeight; }); return off.filter((el) => el.style.getPropertyValue('--lean')).length; })()`);
  check('velocity lean is never written to far off-screen cards', lean === 0, `${lean} cards`);
  check('no per-frame custom property on <html>', await page.eval(`!document.documentElement.getAttribute('style') || !/--/.test(document.documentElement.getAttribute('style'))`));

  // PageDown scrolls natively
  await page.eval('scrollTo(0, 0)'); await sleep(300);
  await page.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'PageDown', code: 'PageDown', windowsVirtualKeyCode: 34 });
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'PageDown', code: 'PageDown', windowsVirtualKeyCode: 34 });
  await sleep(900);
  check('PageDown scrolls', (await page.eval('scrollY')) > 300);

  // far sections drop their animations
  await page.eval('scrollTo(0, 0)'); await sleep(800);
  check('sections far away are marked .is-far', await page.eval(`document.getElementById('gallery').classList.contains('is-far')`));

  // gallery + lightbox
  const tiles = await page.eval(`document.querySelectorAll('#masonry .tile').length`);
  if (!tiles) skip('lightbox opens, locks scroll, Escape closes', 'gallery empty');
  else {
    await page.eval(`document.querySelector('#masonry .tile').click()`); await sleep(900);
    const open = await page.eval(`({ open: document.getElementById('lightbox').open, locked: document.documentElement.classList.contains('scroll-locked') })`);
    await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await sleep(700);
    check('lightbox opens, locks scroll, Escape closes', open.open && open.locked && !(await page.eval(`document.getElementById('lightbox').open`)));
  }

  // marquee reverses on scroll-up and survives a calm → full switch while reversed
  await page.eval('scrollTo(0, 1500)'); await sleep(400);
  for (let i = 0; i < 6; i++) { await page.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 6, y: 400, deltaX: 0, deltaY: -200 }); await sleep(60); }
  await sleep(200);
  check('marquee reverses while scrolling up', await page.eval(`(document.querySelector('.marquee__track').getAnimations()[0]?.playbackRate || 0) < 0`));

  // motion toggle → calm and back
  await page.eval(`document.querySelector('.site-nav [data-motion-toggle]').click()`); await sleep(300);
  const calm = await page.eval(`({ mode: document.documentElement.dataset.motion, marquee: document.querySelector('.marquee__track').getAnimations()[0]?.playState || 'none' })`);
  check('motion toggle switches to calm mode', calm.mode === 'calm', JSON.stringify(calm));
  await page.eval(`document.querySelector('.site-nav [data-motion-toggle]').click()`); await sleep(300);
  check('motion toggle switches back to full', await page.eval(`document.documentElement.dataset.motion === 'full'`));
  await page.eval('scrollTo(0, 0)'); await sleep(1200);
  check('marquee runs again after calm → full', await page.eval(`document.querySelector('.marquee__track').getAnimations()[0]?.playState === 'running'`));

  // language switch
  await page.eval(`document.querySelector('.site-nav [data-lang-switch] button:not([aria-pressed="true"])').click()`); await sleep(800);
  check('language switch to Japanese', await page.eval(`document.documentElement.lang === 'ja' && document.querySelector('#nav-links a[data-nav-link="about"]').textContent.trim() === 'プロフィール'`));

  check('no console errors or CSP violations', problems.length === 0, problems.slice(0, 3).join(' | '));
  page.close();

  // ------------------------------------------------------------------ phone: menu + reduced motion
  const phone = await chrome.newPage();
  await phone.viewport(390, 844);
  await phone.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await phone.goto(`${base}/?lang=en`);
  await phone.waitFor('!document.getElementById("loader")', { timeout: 20000 });
  await sleep(1500);
  check('reduced-motion device starts in calm mode', await phone.eval(`document.documentElement.dataset.motion === 'calm'`));
  await phone.eval(`document.querySelector('.nav-pill__menu').click()`); await sleep(900);
  const menu = await phone.eval(`({ open: document.getElementById('mobile-menu').classList.contains('is-open'), locked: document.documentElement.classList.contains('scroll-locked') })`);
  check('phone menu opens and locks scroll', menu.open && menu.locked, JSON.stringify(menu));
  await phone.eval(`document.querySelector('#mobile-menu a[data-nav-link="news"]').click()`); await sleep(1500);
  const after = await phone.eval(`({ open: document.getElementById('mobile-menu').classList.contains('is-open'), top: Math.round(document.getElementById('news').getBoundingClientRect().top), locked: document.documentElement.classList.contains('scroll-locked') })`);
  check('phone menu link closes the menu and lands on the section', !after.open && !after.locked && Math.abs(after.top) <= 2, JSON.stringify(after));
  phone.close();
} finally {
  await chrome.close();
}
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exitCode = failed ? 1 : 0;
