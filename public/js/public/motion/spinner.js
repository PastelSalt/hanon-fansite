// The loader's star pair: outer white 4-point star + inner pale-blue star whose 4 rays light up gold as loading
// progresses, with a small penguin sitting still in the middle. Both stars keep turning (CSS animation → runs on the
// compositor even while scripts are busy).
const NS = 'http://www.w3.org/2000/svg';
export const STAR_PATH = 'M0 -44 Q 11 -11 44 0 Q 11 11 0 44 Q -11 11 -44 0 Q -11 -11 0 -44 Z';
const VIEWBOX = '-52 -52 104 104';
// Ray wedges around the centre (between the diagonals): top, right, bottom, left (clockwise fill order)
const RAYS = ['M0 0 L-52 -52 L52 -52 Z', 'M0 0 L52 -52 L52 52 Z', 'M0 0 L52 52 L-52 52 Z', 'M0 0 L-52 52 L-52 -52 Z'];
let uid = 0;

const svg = (tag, attrs = {}) => {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
};

/** Builds the spinner inside `host` (a .star-spinner element). Returns { setProgress(0…1), complete() }. */
export function mountSpinner(host) {
  // Static markup (index.html) already holds the stars so they turn before any script runs: adopt its rays.
  const adopted = [...host.querySelectorAll('.ray')];
  return adopted.length === 4 ? controls(host, adopted) : build(host);
}

function controls(host, rays) {
  return {
    setProgress(p) {
      const lit = Math.max(0, Math.min(4, Math.floor(p * 4 + 0.0001)));
      rays.forEach((r, i) => r.classList.toggle('is-on', i < lit));
      host.classList.toggle('is-complete', lit === 4);
    },
    complete() { this.setProgress(1); },
    reset() { this.setProgress(0); },
  };
}

function build(host) {
  const id = `star-clip-${++uid}`;
  // Outer: white star with a blue edge and a soft inner shade (filled, never hollow)
  const outer = svg('svg', { class: 'star-spinner__outer', viewBox: VIEWBOX, 'aria-hidden': 'true', focusable: 'false' });
  outer.append(
    svg('path', { class: 's-outer', d: STAR_PATH }),
    svg('path', { class: 's-outer-shade', d: STAR_PATH, transform: 'scale(0.72)' }),
  );

  // Inner: pale-blue star whose 4 rays light up with progress, plus gloss
  const inner = svg('svg', { class: 'star-spinner__inner', viewBox: VIEWBOX, 'aria-hidden': 'true', focusable: 'false' });
  const clip = svg('clipPath', { id });
  clip.append(svg('path', { d: STAR_PATH }));
  const defs = svg('defs');
  defs.append(clip);
  const group = svg('g', { 'clip-path': `url(#${id})` });
  const rays = RAYS.map((d) => svg('path', { class: 'ray', d }));
  group.append(...rays);
  inner.append(
    defs,
    svg('path', { class: 's-inner-bg', d: STAR_PATH }),
    group,
    svg('ellipse', { class: 's-inner-gloss', cx: -5, cy: -16, rx: 3, ry: 8, transform: 'rotate(-20 -5 -16)' }),
  );

  // The penguin never rotates: it lives outside the turning stars
  const penguin = svg('svg', { class: 'star-spinner__penguin pg', viewBox: VIEWBOX, 'aria-hidden': 'true', focusable: 'false' });
  penguin.append(svg('use', { href: '/assets/svg/v2-sprite.svg#pg-penguin' }));

  host.replaceChildren(outer, inner, penguin);
  return controls(host, rays);
}
