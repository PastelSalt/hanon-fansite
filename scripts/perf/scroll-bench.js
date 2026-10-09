// Scroll smoothness benchmark (FORHANON.md §9.3/§9.4): wheel-scrolls the whole page down and back up in headless
// Chrome and records every animation frame (time + scrollY), plus long tasks.
// Usage: node scripts/perf/scroll-bench.js [baseUrl]
//   env SIZE=1366x768  CPU=4 (CPU slowdown)  GPU=1 (use the real GPU)  RUNS=2  LANG=en
//       TRACE=1  also records a devtools.timeline trace and prints the main-thread time per event type
//       OFF="css rules"  isolation experiment: injects a <style> first, e.g. OFF=".tile{animation:none!important}"
// Compare runs back-to-back on the same machine (±2 fps noise). Targets: ≥ 58 fps desktop on a normal machine;
// ≥ 35 fps at 1366×768 with 4× CPU on a weak GPU; no long tasks > 50 ms while scrolling.
import { launchChrome, sleep } from './cdp.js';

const base = process.argv[2] || 'http://localhost:3000';
const [w, h] = (process.env.SIZE || '1366x768').split('x').map(Number);
const cpu = Number(process.env.CPU || 1);
const runs = Number(process.env.RUNS || 2);
const lang = process.env.LANG_CODE || process.env.LANG?.slice(0, 2) === 'ja' ? 'ja' : 'en';

const RECORDER = `(() => {
  window.__frames = []; window.__long = [];
  let last = performance.now();
  const tick = (t) => { window.__frames.push([t - last, Math.round(scrollY)]); last = t; window.__raf = requestAnimationFrame(tick); };
  window.__raf = requestAnimationFrame(tick);
  try { new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__long.push(Math.round(e.duration)))).observe({ type: 'longtask', buffered: false }); } catch {}
})()`;

function summarize(frames, long) {
  const times = frames.slice(1).map(([dt]) => dt);
  const total = times.reduce((a, b) => a + b, 0);
  const sorted = [...times].sort((a, b) => a - b);
  const pct = (p) => sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))];
  return {
    fps: +(times.length / (total / 1000)).toFixed(1),
    p50: +pct(50).toFixed(1), p95: +pct(95).toFixed(1), worst: +sorted.at(-1).toFixed(1),
    over33: times.filter((t) => t > 33.4).length, over50: times.filter((t) => t > 50).length,
    longTasks: long.length, longest: long.length ? Math.max(...long) : 0, frames: times.length,
    maxY: Math.max(...frames.map(([, y]) => y)),
  };
}

const chrome = await launchChrome({ width: w, height: h, gpu: !!process.env.GPU });
const results = [];
try {
  for (let run = 1; run <= runs; run++) {
    const page = await chrome.newPage();
    await page.viewport(w, h);
    await page.goto(`${base}/?lang=${lang}`);
    await page.waitFor('!document.getElementById("loader")', { timeout: 25000 });
    await sleep(3000);
    if (process.env.OFF) await page.eval(`document.head.append(Object.assign(document.createElement('style'), { textContent: ${JSON.stringify(process.env.OFF)} }))`);
    const height = await page.eval('document.documentElement.scrollHeight');
    if (cpu > 1) await page.send('Emulation.setCPUThrottlingRate', { rate: cpu });
    const traceEvents = [];
    if (process.env.TRACE) {
      page.on('Tracing.dataCollected', (p) => traceEvents.push(...p.value));
      await page.send('Tracing.start', { categories: 'devtools.timeline,disabled-by-default-devtools.timeline,toplevel', transferMode: 'ReportEvents' });
    }
    await page.eval(RECORDER);
    const t0 = Date.now();
    // wheel at the left edge: over the page itself, never over an inner scroller (news list, discography) that
    // would latch the wheel and keep the page from moving
    const x = 6; const y = Math.round(h / 2);
    for (const dir of [1, -1]) {
      for (let i = 0; i < 400; i++) {
        await page.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x, y, deltaX: 0, deltaY: 100 * dir });
        await sleep(70);
        const done = await page.eval(dir > 0
          ? 'scrollY + innerHeight >= document.documentElement.scrollHeight - 4'
          : 'scrollY <= 0');
        if (done) break;
      }
      await sleep(400);
    }
    const { frames, long } = await page.eval('({ frames: window.__frames, long: window.__long })');
    if (process.env.TRACE) {
      const done = page.once('Tracing.tracingComplete', 60000);
      await page.send('Tracing.end');
      await done;
      // total duration per event name (complete events "X" only), top 14
      const threads = new Map();                                 // "pid:tid" → thread name
      for (const e of traceEvents) if (e.ph === 'M' && e.name === 'thread_name') threads.set(`${e.pid}:${e.tid}`, e.args.name);
      const busy = new Map();                                   // thread → ms in top-level tasks
      const byName = new Map();                                 // main-thread event → ms
      for (const e of traceEvents) {
        if (e.ph !== 'X' || !e.dur) continue;
        const th = threads.get(`${e.pid}:${e.tid}`) || '?';
        if (e.name === 'ThreadControllerImpl::RunTask' || e.name === 'ThreadPool_RunTask') busy.set(th, (busy.get(th) || 0) + e.dur / 1000);
        if (th === 'CrRendererMain' && e.name !== 'RunTask' && !e.name.startsWith('ThreadControllerImpl')) byName.set(e.name, (byName.get(e.name) || 0) + e.dur / 1000);
      }
      const top = (m, n) => [...m].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, ms]) => `${k} ${Math.round(ms)}`).join(' · ');
      console.log('busy per thread (ms):', top(busy, 8));
      console.log('main thread (ms):', top(byName, 12));
    }
    if (cpu > 1) await page.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    const s = { ...summarize(frames, long), page: height, secs: Math.round((Date.now() - t0) / 1000) };
    results.push(s);
    console.log(`run ${run} ${w}x${h} cpu×${cpu}${process.env.GPU ? ' gpu' : ''}:`, JSON.stringify(s));
    page.close();
  }
} finally {
  await chrome.close();
}
if (results.length > 1) console.log('mean fps:', +(results.reduce((a, r) => a + r.fps, 0) / results.length).toFixed(1));
