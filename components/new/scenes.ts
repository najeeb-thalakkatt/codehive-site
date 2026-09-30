/** The swarm's formations, one per section of /new. Each scene is `n` home points in unit space (the
 *  anchor square spans -1..1) plus a `paint` that colours and dims each particle over time, which is how
 *  a formation tells its story: which pilot gets the budget, documents flowing through the assistant,
 *  bars growing on the benchmark, a pipeline turning green, knowledge rippling through the rings, a
 *  plain lattice with one request sweeping through. Colour indices are columns of the sprite atlas. */
import { cellHomes } from "./swarm-lib";

export const AMBER = 0, AMBER2 = 1, INK2 = 2, INK1 = 3, INK3 = 4, OK = 5;
export const COL_VARS = ["--amber", "--amber2", "--ink2", "--ink1", "--ink3", "--ok"];

export type Scene = {
  x: Float32Array; y: Float32Array; m: Float32Array; // homes and one number of meta per particle
  /** colour index and alpha multiplier for particle i at time t (seconds); `baked` is its own hero colour */
  paint: (m: number, t: number, i: number, baked: number) => readonly [number, number];
  stillT: number; // the time reduced motion shows: the finished state of the story
};

const rnd = Math.random;
const gauss = () => { let s = 0; for (let k = 0; k < 4; k++) s += rnd(); return (s - 2) * 1.2; };
const frac = (v: number) => v - Math.floor(v);
/** pointy-top hexagon outline point, circumradius r, stroke spread `w` */
const hexEdge = (cx: number, cy: number, r: number, w: number, out: [number, number]) => {
  const k = Math.floor(rnd() * 6), u = rnd(), a0 = Math.PI / 6 + (k * Math.PI) / 3, a1 = a0 + Math.PI / 3;
  const rr = r + (rnd() - 0.5) * w;
  out[0] = cx + rr * (Math.cos(a0) * (1 - u) + Math.cos(a1) * u); out[1] = cy + rr * (Math.sin(a0) * (1 - u) + Math.sin(a1) * u);
};
const seg = (x0: number, y0: number, x1: number, y1: number, w: number, out: [number, number]) => {
  const u = rnd(); out[0] = x0 + (x1 - x0) * u + (rnd() - 0.5) * w; out[1] = y0 + (y1 - y0) * u + (rnd() - 0.5) * w; return u;
};
const alloc = (n: number): Scene => ({ x: new Float32Array(n), y: new Float32Array(n), m: new Float32Array(n), paint: (_m, _t, _i, baked) => [baked, 1], stillT: 0 });
/** split n particles over parts by weight, returning [start, end) per part */
const split = (n: number, w: number[]) => { const s = w.reduce((a, b) => a + b, 0); let at = 0; return w.map((v) => { const a = at; at = Math.min(n, at + Math.round((v / s) * n)); return [a, at] as const; }); };
const P: [number, number] = [0, 0];

/** 00 the logo cell: the hero. Colours are the particle's own. */
export function cell(n: number): Scene {
  const h = cellHomes(n); return { x: h.x, y: h.y, m: new Float32Array(n), paint: (_m, _t, _i, baked) => [baked, 1], stillT: 0 };
}

/** 01 Strategy: six pilots as loose clusters. They are reviewed one by one, then one gets the budget. */
export function strategy(n: number): Scene {
  const s = alloc(n), sizes = [0.2, 0.11, 0.22, 0.13, 0.19, 0.15];
  split(n, sizes).forEach(([a, b], c) => { const ang = Math.PI / 6 + (c * Math.PI) / 3, cx = 0.6 * Math.cos(ang), cy = 0.6 * Math.sin(ang), r = 0.1 + sizes[c] * 0.45; for (let i = a; i < b; i++) { s.x[i] = cx + gauss() * r; s.y[i] = cy + gauss() * r; s.m[i] = c; } });
  const CHOSEN = 2;
  s.paint = (m, t) => { const u = t % 9; if (u < 4.2) return Math.floor(u / 0.7) === m ? [AMBER, 1] : [INK2, 0.6]; if (u < 8.2) return m === CHOSEN ? [AMBER, 1] : [INK3, 0.45]; return [INK2, 0.6]; };
  s.stillT = 6; return s;
}

/** 02 Applications: three document stacks on the left, the assistant cell in the middle, the answer
 *  lines on the right; a pulse travels documents → assistant → answer. */
export function applications(n: number): Scene {
  const s = alloc(n), parts = split(n, [0.14, 0.14, 0.14, 0.06, 0.06, 0.06, 0.2, 0.06, 0.14]);
  const docs = [-0.62, 0, 0.62];
  docs.forEach((cy, d) => { const [a, b] = parts[d]; for (let i = a; i < b; i++) { s.x[i] = -0.95 + rnd() * 0.4; s.y[i] = cy - 0.21 + rnd() * 0.42; s.m[i] = 0.02 + ((s.x[i] + 0.95) / 0.4) * 0.16; } });
  docs.forEach((cy, d) => { const [a, b] = parts[3 + d]; for (let i = a; i < b; i++) { const u = seg(-0.55, cy, -0.3, 0, 0.04, P); s.x[i] = P[0]; s.y[i] = P[1]; s.m[i] = 0.2 + u * 0.24; } });
  { const [a, b] = parts[6]; for (let i = a; i < b; i++) { hexEdge(0, 0, 0.3, 0.05, P); s.x[i] = P[0]; s.y[i] = P[1]; s.m[i] = 0.46 + rnd() * 0.08; } }
  { const [a, b] = parts[7]; for (let i = a; i < b; i++) { const u = seg(0.3, 0, 0.5, 0, 0.04, P); s.x[i] = P[0]; s.y[i] = P[1]; s.m[i] = 0.56 + u * 0.14; } }
  { const [a, b] = parts[8]; for (let i = a; i < b; i++) { const u = seg(0.5, 0, 0.95, 0, 0.02, P); s.x[i] = P[0]; s.y[i] = P[1] + [-0.15, 0, 0.15][i % 3]; s.m[i] = 0.72 + u * 0.26; } }
  s.paint = (m, t) => { const w = frac(t / 3.5); if (frac(m - w) < 0.13) return [AMBER, 1]; if (m < 0.2) return [INK3, 0.7]; if (m < 0.46) return [INK3, 0.35]; if (m < 0.56) return [INK2, 0.9]; if (m < 0.72) return [INK3, 0.35]; return [INK1, 0.8]; };
  s.stillT = 3.15; return s;
}

/** 03 Models: four candidate models as bars on your own benchmark. They fill up, the best one turns amber. */
export function models(n: number): Scene {
  const s = alloc(n), H = [0.5, 0.8, 1.25, 0.65], X = [-0.72, -0.24, 0.24, 0.72], parts = split(n, [0.2, 0.28, 0.4, 0.24, 0.08]);
  H.forEach((h, b) => { const [a, e] = parts[b]; for (let i = a; i < e; i++) { const f = rnd(); s.x[i] = X[b] + (rnd() - 0.5) * 0.34; s.y[i] = 0.72 - f * h; s.m[i] = b + f * 0.99; } });
  { const [a, e] = parts[4]; for (let i = a; i < e; i++) { s.x[i] = -0.95 + rnd() * 1.9; s.y[i] = 0.8 + (rnd() - 0.5) * 0.02; s.m[i] = 9; } }
  const BEST = 2;
  s.paint = (m, t) => { if (m >= 9) return [INK3, 0.6]; const u = t % 8, b = Math.floor(m), f = m - b; const level = Math.min(1, u / 3); if (f > level) return [INK3, 0.08]; if (u < 3.6) return [INK2, 0.85]; return b === BEST ? [AMBER, 1] : [INK2, 0.6]; };
  s.stillT = 6; return s;
}

/** 04 Production: dev → test → prod → monitor as four cells on a line. Each lights in turn; then the
 *  whole pipeline holds green: it runs without us. */
export function production(n: number): Scene {
  const s = alloc(n), X = [-0.72, -0.24, 0.24, 0.72], parts = split(n, [0.19, 0.19, 0.19, 0.19, 0.08, 0.08, 0.08]);
  X.forEach((cx, k) => { const [a, e] = parts[k]; for (let i = a; i < e; i++) { hexEdge(cx, 0, 0.19, 0.06, P); s.x[i] = P[0]; s.y[i] = P[1]; s.m[i] = k; } });
  for (let k = 0; k < 3; k++) { const [a, e] = parts[4 + k]; for (let i = a; i < e; i++) { seg(X[k] + 0.19, 0, X[k + 1] - 0.19, 0, 0.03, P); s.x[i] = P[0]; s.y[i] = P[1]; s.m[i] = 10 + k; } }
  s.paint = (m, t) => { const u = t % 8; if (u >= 4.6 && u < 7.6) return [OK, 1]; if (m < 10) { const k = m, on = u >= k * 1.1 && u < k * 1.1 + 1.1; return on ? [AMBER, 1] : u > k * 1.1 ? [AMBER2, 0.7] : [INK3, 0.55]; } const k = m - 10; return u >= k * 1.1 + 0.6 && u < k * 1.1 + 1.5 ? [AMBER, 1] : [INK3, 0.5]; };
  s.stillT = 6; return s;
}

/** 05 Enablement: a honeycomb of nineteen cells. Knowledge starts in one and ripples out ring by ring
 *  until the whole team holds it. */
export function enablement(n: number): Scene {
  const s = alloc(n), r = 0.16, p = Math.sqrt(3) * r + 0.035;
  const cells: [number, number, number][] = [[0, 0, 0]];
  for (let k = 0; k < 6; k++) { const a = (k * Math.PI) / 3; cells.push([p * Math.cos(a), p * Math.sin(a), 1]); }
  for (let k = 0; k < 6; k++) { const a = (k * Math.PI) / 3, b = a + Math.PI / 6; cells.push([2 * p * Math.cos(a), 2 * p * Math.sin(a), 2], [Math.sqrt(3) * p * Math.cos(b), Math.sqrt(3) * p * Math.sin(b), 2]); }
  split(n, cells.map(() => 1)).forEach(([a, e], c) => { const [cx, cy, ring] = cells[c]; for (let i = a; i < e; i++) { if (rnd() < 0.75) hexEdge(cx, cy, r, 0.05, P); else { P[0] = cx + gauss() * r * 0.35; P[1] = cy + gauss() * r * 0.35; } s.x[i] = P[0]; s.y[i] = P[1]; s.m[i] = ring; } });
  s.paint = (m, t) => { const u = t % 6.5; if (u >= 3.2 && u < 6) return [m === 0 ? AMBER : AMBER2, 1]; const lit = u >= m * 0.9 && u < m * 0.9 + 1.2; if (m === 0) return [AMBER, 1]; return lit ? [AMBER, 1] : u > m * 0.9 ? [AMBER2, 0.8] : [INK3, 0.55]; };
  s.stillT = 4.5; return s;
}

/** 06 Plain backend: a regular lattice of small cells, nothing clever, one request sweeping through. */
export function backend(n: number): Scene {
  const s = alloc(n), r = 0.085, w = Math.sqrt(3) * r + 0.03, h = 1.5 * r + 0.026;
  const cells: [number, number][] = [];
  for (let row = -4; row <= 4; row++) for (let col = -5; col <= 5; col++) { const x = col * w + (row % 2 ? w / 2 : 0), y = row * h; if (Math.abs(x) <= 0.92 && Math.abs(y) <= 0.92) cells.push([x, y]); }
  split(n, cells.map(() => 1)).forEach(([a, e], c) => { const [cx, cy] = cells[c]; for (let i = a; i < e; i++) { hexEdge(cx, cy, r, 0.03, P); s.x[i] = P[0]; s.y[i] = P[1]; s.m[i] = (cx + 1) / 2; } });
  s.paint = (m, t) => { const w = frac(t / 5); const d = frac(m - w); return d < 0.07 ? [AMBER, 1] : d < 0.16 ? [AMBER2, 0.75] : [INK2, 0.5]; };
  s.stillT = 2.5; return s;
}

export const SCENES: Record<string, (n: number) => Scene> = { cell, strategy, applications, models, production, enablement, backend };
