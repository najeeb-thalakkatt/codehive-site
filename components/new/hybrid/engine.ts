/** Runs a hybrid service figure from the Claude Design canvas inside the page's swarm. The canvas defines each
 *  figure as a config (regions of home points, timed moves, moving tags, and a light function); the artboards
 *  draw it with their own loop. Here the same config becomes a `Scene` for components/new/Swarm.tsx: the swarm
 *  keeps the particles, the scroll morph, the buzz and the cross-fade, and asks the scene each frame where every
 *  particle's home is and how it is lit at loop time t.
 *  Coordinates: the artboards use px from the stage centre; a scene uses units of half the stage width, so a
 *  square stage spans -1..1 and the 1600 x 400 band spans -1..1 by -0.25..0.25. */
import type { Scene } from "../scenes";

/** palette names the light functions use, as columns of the swarm's sprite atlas (scenes.ts COL_VARS) */
export type Pal = Record<"amber" | "amber2" | "ink2" | "ink1" | "ink3" | "ok" | "line2" | "alert" | "line1" | "bg0", number>;
export const PAL: Pal = { amber: 0, amber2: 1, ink2: 2, ink1: 3, ink3: 4, ok: 5, line2: 6, alert: 7, line1: 8, bg0: 8 };

type Pt = number[]; // [x, y] or [x, y, u] for a point at fraction u along a line
export type Gen = {
  hex(cx: number, cy: number, R: number, n: number): Pt[];
  rect(cx: number, cy: number, w: number, h: number, n: number): Pt[];
  line(x1: number, y1: number, x2: number, y2: number, n: number): Pt[];
  cluster(cx: number, cy: number, R: number, n: number): Pt[];
  ring(cx: number, cy: number, R: number, n: number): Pt[];
};
export type Mv = { tag: string; at: number; dur?: number; to: Pt[] };
export type Cfg = {
  W: number; H: number; N: number; T: number; holdAt?: number;
  regions(G: Gen): { tag: string; pts: Pt[] }[];
  moves?(G: Gen): Mv[];
  dynamic?: Record<string, (t: number, p: { u: number }) => number[]>;
  light(tag: string, t: number, p: { u: number }, C: Pal): (number)[];
};

export const ramp = (t: number, a: number, b: number) => (t <= a ? 0 : t >= b ? 1 : (t - a) / (b - a));
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const ease = (u: number) => (u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u));

// the canvas's shape generators, unchanged (px, origin at the stage centre)
const G: Gen = {
  hex(cx, cy, R, n) { const p: Pt[] = []; for (let i = 0; i < n; i++) { const e = Math.floor(Math.random() * 6), u = Math.random(), a1 = ((e * 60 - 90) * Math.PI) / 180, a2 = (((e + 1) * 60 - 90) * Math.PI) / 180; p.push([cx + R * Math.cos(a1) * (1 - u) + R * Math.cos(a2) * u + gauss() * 1.2, cy + R * Math.sin(a1) * (1 - u) + R * Math.sin(a2) * u + gauss() * 1.2]); } return p; },
  rect(cx, cy, w, h, n) { const p: Pt[] = []; for (let i = 0; i < n; i++) p.push([cx + rnd(-w / 2, w / 2), cy + rnd(-h / 2, h / 2)]); return p; },
  line(x1, y1, x2, y2, n) { const p: Pt[] = []; for (let i = 0; i < n; i++) { const u = (i + Math.random()) / n; p.push([x1 + (x2 - x1) * u + gauss() * 1.5, y1 + (y2 - y1) * u + gauss() * 1.5, u]); } return p; },
  cluster(cx, cy, R, n) { const p: Pt[] = []; for (let i = 0; i < n; i++) p.push([cx + gauss() * R * 0.45, cy + gauss() * R * 0.45]); return p; },
  ring(cx, cy, R, n) { const p: Pt[] = []; for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2; p.push([cx + R * Math.cos(a) + gauss() * 2, cy + R * Math.sin(a) + gauss() * 2]); } return p; },
};

/** A scene factory for the swarm: `n` is the live particle count (2400 on desktop, 700 on phones, or the lab
 *  slider's). Each region keeps its share of its points (evenly spaced through the region, so a line stays a line);
 *  particles beyond the figure's total stay in the ambient field. Above the artboard's own count the regions are
 *  sampled again (each pass draws fresh points in the same shapes), so the figure grows denser with the swarm. */
export function hybridScene(cfg: Cfg): (n: number) => Scene {
  return (n) => {
    const passes = Math.max(1, Math.ceil(n / cfg.N)), k = 1 / (cfg.W / 2), keep = Math.min(1, n / (cfg.N * passes)), T = cfg.T;
    const regions = cfg.regions(G);
    for (let q = 1; q < passes; q++) cfg.regions(G).forEach((r, ri) => { if (regions[ri]?.tag === r.tag) regions[ri].pts.push(...r.pts); });
    const x = new Float32Array(n), y = new Float32Array(n), m = new Float32Array(n);
    const hx = new Float32Array(n), hy = new Float32Array(n), ox = new Float32Array(n), oy = new Float32Array(n), uu = new Float32Array(n);
    const fx = new Float32Array(n), fy = new Float32Array(n), fs = new Float32Array(n).fill(-9), fd = new Float32Array(n), p2 = new Float32Array(n), ph = new Float32Array(n);
    const tagOf = new Uint8Array(n), tags: string[] = [], byTag: number[][] = [];
    let count = 0;
    for (const r of regions) {
      const ti = tags.length; tags.push(r.tag); byTag.push([]);
      const want = Math.max(Math.min(4, r.pts.length), Math.round(r.pts.length * keep));
      for (let j = 0; j < want && count < n; j++) {
        const q = r.pts[Math.floor((j * r.pts.length) / want)], i = count++;
        hx[i] = ox[i] = x[i] = q[0] * k; hy[i] = oy[i] = y[i] = q[1] * k; uu[i] = q[2] || 0; tagOf[i] = ti; ph[i] = Math.random() * 6.283; byTag[ti].push(i);
      }
    }
    const moves = (cfg.moves ? cfg.moves(G) : []).map((mv) => ({ ti: tags.indexOf(mv.tag), at: mv.at, dur: mv.dur || 1, to: mv.to }));
    const dyn = tags.map((t) => cfg.dynamic?.[t]);
    const applied = new Uint8Array(moves.length), P = { u: 0 }, turb = 22 * k;
    let cycle = -1;
    const tick = (tAbs: number) => {
      const c = Math.floor(tAbs / T), t = tAbs - c * T;
      // a new loop: everything back to its first home. A move whose time has passed is applied as if it started
      // then, so a scene joined half way through its loop is where it should be, not at the start
      if (c !== cycle) { cycle = c; hx.set(ox); hy.set(oy); fs.fill(-9); applied.fill(0); }
      moves.forEach((mv, mi) => {
        if (applied[mi] || t < mv.at || mv.ti < 0) return; applied[mi] = 1;
        byTag[mv.ti].forEach((i, j) => { const q = mv.to[j % mv.to.length]; fx[i] = hx[i]; fy[i] = hy[i]; hx[i] = q[0] * k; hy[i] = q[1] * k; fs[i] = mv.at; fd[i] = mv.dur; p2[i] = Math.random(); });
      });
      for (let i = 0; i < count; i++) {
        let X = hx[i], Y = hy[i];
        const d = dyn[tagOf[i]];
        if (d) { P.u = uu[i]; const o = d(t, P); X = o[0] * k + ox[i]; Y = o[1] * k + oy[i]; }
        if (fs[i] >= 0 && t - fs[i] < fd[i] + 0.3) { // in flight to a new home: an eased path with turbulence, strongest half way
          const u = ease((t - fs[i] - p2[i] * 0.25) / fd[i]), s = Math.sin(Math.PI * u);
          X = fx[i] + (X - fx[i]) * u + Math.sin(t * 7 + ph[i]) * turb * s; Y = fy[i] + (Y - fy[i]) * u + Math.cos(t * 5.3 + ph[i]) * turb * s;
        }
        x[i] = X; y[i] = Y;
      }
    };
    const stillT = cfg.holdAt ?? T - 1;
    tick(stillT);
    return {
      x, y, m, count, abs: true, T, stillT, tick,
      paint: (_m, tAbs, i) => { P.u = uu[i]; const r = cfg.light(tags[tagOf[i]], tAbs % T, P, PAL); return [r[0], r[1]]; },
    };
  };
}
