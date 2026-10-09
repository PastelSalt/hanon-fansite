// Cursor sparkle trail (desktop mouse only, subtle): a small pool of illustrated sparkles, hearts, stars and drops
// (from the v2 SVG sprite) that fade behind the pointer. Off on touch devices and in calm mode. Decorative only.
import { isCalm } from './prefs.js';

const NS = 'http://www.w3.org/2000/svg';
const SPRITE = '/assets/svg/v2-sprite.svg';
// [symbol, colour custom properties]
const SHAPES = [
  ['spark', { '--c1': '#fff2b3', '--c2': '#f2b632' }],
  ['spark', { '--c1': '#eaf4ff', '--c2': '#4a90d9' }],
  ['spark', { '--c1': '#ffffff', '--c2': '#79b5ff' }],
  ['heart', { '--c1': '#f898c0' }],
  ['star', { '--c1': '#f6bf3a', '--c2': '#ffe08a', '--c3': '#fff6d6', '--c4': '#a35f00' }],
  ['drop', { '--c1': '#79b5ff', '--c2': '#cde4f6', '--c3': '#f3f9fe', '--c4': '#1f5e9e' }],
];

export function startSparkles({ perShape = 4, every = 42 } = {}) {
  if (!matchMedia('(pointer: fine)').matches) return;
  const layer = document.createElement('div');
  layer.className = 'sparkle-layer';
  layer.setAttribute('aria-hidden', 'true');
  // A few ready-made sparkles per shape: spawning only moves and animates one, it never re-points its <use>.
  const pools = SHAPES.map(([symbol, colours]) => ({
    symbol,
    next: 0,
    items: Array.from({ length: perShape }, () => {
      const s = document.createElementNS(NS, 'svg');
      s.setAttribute('class', 'sparkle');
      for (const [k, v] of Object.entries(colours)) s.style.setProperty(k, v);
      const use = document.createElementNS(NS, 'use');
      use.setAttribute('href', `${SPRITE}#${symbol}`);
      s.append(use);
      layer.append(s);
      return s;
    }),
  }));
  document.body.append(layer);
  let lastSpawn = 0;

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || isCalm()) return;
    const now = performance.now();
    if (now - lastSpawn < every) return;
    lastSpawn = now;
    const pool = pools[Math.floor(Math.random() * pools.length)];
    const s = pool.items[pool.next];
    pool.next = (pool.next + 1) % pool.items.length;
    const size = pool.symbol === 'star' || pool.symbol === 'drop' ? 12 + Math.random() * 6 : 10 + Math.random() * 8;
    const x = e.clientX - size / 2;
    const y = e.clientY - size / 2;
    const dx = (Math.random() - 0.5) * 36;
    const dy = 12 + Math.random() * 28;
    s.style.width = `${size}px`;
    s.style.height = `${size}px`;
    s.animate([
      { opacity: 0.95, transform: `translate(${x}px, ${y}px) scale(1) rotate(0deg)` },
      { opacity: 0, transform: `translate(${x + dx}px, ${y + dy}px) scale(0.3) rotate(${dx * 5}deg)` },
    ], { duration: 780, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
  }, { passive: true });
}
