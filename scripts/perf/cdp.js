// Minimal Chrome DevTools Protocol client for the perf/behaviour/screenshot scripts (FORHANON.md §9.4).
// Launches headless Chrome with a remote-debugging port and talks to one page over Node's global WebSocket
// (no Puppeteer). Usage:
//   const chrome = await launchChrome({ width: 1366, height: 768 });
//   const page = await chrome.newPage();
//   await page.goto('http://localhost:3000/?lang=en');
//   await page.waitFor('!document.getElementById("loader")');
//   ... page.eval(expr) / page.send(method, params) / page.screenshot(file) ...
//   await chrome.close();
import { spawn } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const CHROME = process.env.CHROME || '/usr/bin/google-chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function launchChrome({ width = 1366, height = 768, gpu = false, port = 9300 + Math.floor(Math.random() * 500) } = {}) {
  const profile = await mkdtemp(path.join(tmpdir(), 'hf-chrome-'));
  const args = [
    '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, `--window-size=${width},${height}`,
    '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--mute-audio', '--disable-extensions',
    '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows',
    // the real GPU (headless otherwise renders in software and exaggerates draw costs)
    ...(gpu ? ['--use-angle=gl', '--ignore-gpu-blocklist', '--enable-gpu-rasterization'] : []),
    'about:blank',
  ];
  const proc = spawn(CHROME, args, { stdio: ['ignore', 'ignore', 'pipe'] });
  let version;
  for (let i = 0; i < 100 && !version; i++) {
    await sleep(100);
    try { version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); } catch { /* not up yet */ }
  }
  if (!version) { proc.kill('SIGKILL'); throw new Error('Chrome did not start'); }

  return {
    async newPage() {
      const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
      return connectPage(target.webSocketDebuggerUrl, { width, height });
    },
    async close() {
      proc.kill('SIGTERM');
      await sleep(300);
      await rm(profile, { recursive: true, force: true }).catch(() => {});
    },
  };
}

async function connectPage(wsUrl, { width, height }) {
  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let id = 0;
  const pending = new Map();
  const listeners = new Map();          // method → Set(callback)
  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(new Error(`${data.error.message} (${data.error.code})`)); else resolve(data.result);
    } else if (data.method) {
      listeners.get(data.method)?.forEach((cb) => cb(data.params));
    }
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const msgId = ++id;
    pending.set(msgId, { resolve, reject });
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
  const on = (method, cb) => {
    if (!listeners.has(method)) listeners.set(method, new Set());
    listeners.get(method).add(cb);
    return () => listeners.get(method).delete(cb);
  };
  const once = (method, timeout = 30000) => new Promise((resolve, reject) => {
    const timer = setTimeout(() => { off(); reject(new Error(`timeout waiting for ${method}`)); }, timeout);
    const off = on(method, (p) => { clearTimeout(timer); off(); resolve(p); });
  });

  await Promise.all([send('Page.enable'), send('Runtime.enable'), send('Log.enable')]);
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });

  const page = {
    send, on, once,
    /** Evaluates an expression in the page (awaits promises) and returns its value. */
    async eval(expression) {
      const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
      return r.result.value;
    },
    async goto(url, { timeout = 30000 } = {}) {
      const loaded = once('Page.loadEventFired', timeout);
      await send('Page.navigate', { url });
      await loaded;
    },
    /** Polls `expression` until it is truthy. */
    async waitFor(expression, { timeout = 20000, every = 100 } = {}) {
      const end = Date.now() + timeout;
      while (Date.now() < end) {
        if (await page.eval(`!!(${expression})`)) return;
        await sleep(every);
      }
      throw new Error(`timeout waiting for ${expression}`);
    },
    /** Emulates a phone/tablet/desktop viewport (touch + mobile flag below 768 px). */
    async viewport(w, h, { mobile = w < 768 } = {}) {
      await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: mobile ? 2 : 1, mobile });
      await send('Emulation.setTouchEmulationEnabled', mobile ? { enabled: true, maxTouchPoints: 5 } : { enabled: false });
    },
    async screenshot(file, { fullPage = false } = {}) {
      const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: fullPage });
      await writeFile(file, Buffer.from(r.data, 'base64'));
    },
    close: () => ws.close(),
  };
  return page;
}

export { sleep };
