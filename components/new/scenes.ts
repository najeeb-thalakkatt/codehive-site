/** The swarm's formations. Each scene is `n` home points in unit space (the anchor spans -1..1 across its
 *  width) plus a `paint` that colours and dims each particle over time. The logo cell and the small hives are
 *  written here; the six service figures come from the Claude Design canvas (hybrid/cfgs.ts, run by
 *  hybrid/engine.ts) in two options each. Colour indices are columns of the sprite atlas. */
import { cellHomes } from "./swarm-lib";
import { CFGS } from "./hybrid/cfgs";
import { hybridScene } from "./hybrid/engine";

export const AMBER = 0, AMBER2 = 1, INK2 = 2, INK1 = 3, INK3 = 4, OK = 5;
export const COL_VARS = ["--amber", "--amber2", "--ink2", "--ink1", "--ink3", "--ok", "--line2", "--alert", "--line1"];

export type Scene = {
  x: Float32Array; y: Float32Array; m: Float32Array; // homes and one number of meta per particle
  /** colour index and alpha multiplier for particle i at time t (seconds); `baked` is its own hero colour */
  paint: (m: number, t: number, i: number, baked: number) => readonly [number, number];
  stillT: number; // the time reduced motion shows: the finished state of the story
  count?: number;  // how many particles the figure uses; the rest stay in the ambient field (default: all)
  abs?: boolean;   // paint's second value is the particle's alpha itself, not a multiplier of its own
  maxSize?: number; // the largest sprite (index into SIZES) a particle may use while this figure holds it
  T?: number;      // loop length in seconds, for the overlay's clock
  tick?: (t: number) => void; // moves the homes for time t (figures whose particles relocate during the loop)
};

const rnd = Math.random;
const gauss = () => { let s = 0; for (let k = 0; k < 4; k++) s += rnd(); return (s - 2) * 1.2; };
/** pointy-top hexagon outline point, circumradius r, stroke spread `w` */
const hexEdge = (cx: number, cy: number, r: number, w: number, out: [number, number]) => {
  const k = Math.floor(rnd() * 6), u = rnd(), a0 = Math.PI / 6 + (k * Math.PI) / 3, a1 = a0 + Math.PI / 3;
  const rr = r + (rnd() - 0.5) * w;
  out[0] = cx + rr * (Math.cos(a0) * (1 - u) + Math.cos(a1) * u); out[1] = cy + rr * (Math.sin(a0) * (1 - u) + Math.sin(a1) * u);
};
const alloc = (n: number): Scene => ({ x: new Float32Array(n), y: new Float32Array(n), m: new Float32Array(n), paint: (_m, _t, _i, baked) => [baked, 1], stillT: 0 });
const P: [number, number] = [0, 0];

/** 00 the logo cell: the hero and the bookend at contact. Colours are the particle's own. On a phone the figure is
 *  about 230 px wide and the brace cut-out about 12: there the homes keep back from every edge and only the smallest
 *  sprite is used, so the braces stay a clear cut-out. */
export function cell(n: number, phone = false): Scene {
  const h = cellHomes(n, Math.random, phone ? 2 : 0);
  return { x: h.x, y: h.y, m: new Float32Array(n), paint: (_m, _t, _i, baked) => [baked, 1], stillT: 0, maxSize: phone ? 0 : undefined };
}

/** A small hive for the services index: a cell outline drawn by the swarm with a few bees inside. Every point is
 *  from the same shape, so any subset (a group deals its particles round-robin to several hives) forms a whole one. */
export function hive(n: number): Scene {
  const s = alloc(n);
  for (let i = 0; i < n; i++) { if (rnd() < 0.85) { hexEdge(0, 0, 0.9, 0.06, P); s.m[i] = 0; } else { P[0] = gauss() * 0.28; P[1] = gauss() * 0.28; s.m[i] = 1; } s.x[i] = P[0]; s.y[i] = P[1]; }
  s.paint = (m, _t, _i, baked) => (m === 0 ? [AMBER, 1] : [baked, 0.9]);
  return s;
}

export const SCENES: Record<string, (n: number, phone?: boolean) => Scene> = { cell, hive, ...Object.fromEntries(Object.entries(CFGS).map(([k, c]) => [k, hybridScene(c)])) };
