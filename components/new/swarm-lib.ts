/** Pure helpers for components/new/Swarm.tsx (a separate name: swarm.ts would clash with Swarm.tsx on a case-insensitive disk): home points sampled from the logo cell, and the sprite
 *  atlas of tiny outlined hexagons the swarm is drawn with. No DOM beyond an offscreen canvas. */

export const SIZES = [2, 3, 4]; // hex radius in css px, picked 50 / 35 / 15 %
export const COL_VARS = ["--amber", "--amber2", "--ink2", "--ink1"]; // picked 45 / 20 / 20 / 15 %
export const ROT_STEPS = 6; // 0..50° in 10° steps: a hexagon repeats every 60°
export const CELL = 2 * SIZES[SIZES.length - 1] + 3; // one atlas cell, css px, room for the stroke

export type Homes = { x: Float32Array; y: Float32Array }; // unit space: the hexagon's circumradius is 1

/** The cell from public/codehive-cell.svg, drawn in code: a pointy-top hexagon (r 320 in a 720 space)
 *  with the two braces (stroke 34, round caps) cut out. Sampled on a 192 px raster: 70 % of the homes
 *  from the inside, 30 % from the edge pixels, so the silhouette reads while the fill stays airy. */
export function cellHomes(n: number, rnd: () => number = Math.random): Homes {
  const S = 192, k = S / 720;
  const c = document.createElement("canvas"); c.width = S; c.height = S;
  const g = c.getContext("2d");
  if (!g) return hexHomes(n, rnd);
  g.translate(S / 2, S / 2); g.scale(k, k);
  g.fillStyle = "#fff";
  g.beginPath(); g.moveTo(0, -320); g.lineTo(277.1, -160); g.lineTo(277.1, 160); g.lineTo(0, 320); g.lineTo(-277.1, 160); g.lineTo(-277.1, -160); g.closePath(); g.fill();
  g.globalCompositeOperation = "destination-out";
  g.strokeStyle = "#000"; g.lineWidth = 34; g.lineCap = "round"; g.lineJoin = "round";
  const brace = new Path2D("M -52,-150 C -100,-150 -104,-126 -104,-90 L -104,-40 C -104,-16 -120,-4 -144,0 C -120,4 -104,16 -104,40 L -104,90 C -104,126 -100,150 -52,150");
  g.stroke(brace); g.scale(-1, 1); g.stroke(brace);
  g.setTransform(1, 0, 0, 1, 0, 0);
  const d = g.getImageData(0, 0, S, S).data;
  const on = (i: number, j: number) => i >= 0 && j >= 0 && i < S && j < S && d[(j * S + i) * 4 + 3] > 128;
  const inside: number[] = [], edge: number[] = [];
  for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) if (on(i, j)) (on(i - 1, j) && on(i + 1, j) && on(i, j - 1) && on(i, j + 1) ? inside : edge).push(j * S + i);
  if (!inside.length) return hexHomes(n, rnd);
  const x = new Float32Array(n), y = new Float32Array(n);
  for (let p = 0; p < n; p++) {
    const pool = edge.length && rnd() < 0.3 ? edge : inside;
    const q = pool[Math.floor(rnd() * pool.length)];
    const px = (q % S) + rnd(), py = Math.floor(q / S) + rnd();
    x[p] = (px - S / 2) / (320 * k); y[p] = (py - S / 2) / (320 * k);
  }
  return { x, y };
}

/** Fallback: points inside a plain pointy-top hexagon of circumradius 1 (no braces). */
export function hexHomes(n: number, rnd: () => number = Math.random): Homes {
  const x = new Float32Array(n), y = new Float32Array(n), s3 = Math.sqrt(3);
  for (let p = 0; p < n; ) {
    const px = rnd() * 2 - 1, py = rnd() * 2 - 1;
    if (Math.abs(px) <= s3 / 2 && Math.abs(py) <= 1 - Math.abs(px) / s3) { x[p] = px; y[p] = py; p++; }
  }
  return { x, y };
}

/** Sprite atlas: SIZES × colours × ROT_STEPS outlined hexagons at device resolution. Column = colour ×
 *  ROT_STEPS + rotation, row = size. Drawing one is a single drawImage: no path, no shadow, per particle. */
export function buildAtlas(dpr: number, colours: string[]): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = Math.ceil(colours.length * ROT_STEPS * CELL * dpr); c.height = Math.ceil(SIZES.length * CELL * dpr);
  const g = c.getContext("2d");
  if (!g) return c;
  g.scale(dpr, dpr); g.lineWidth = 1;
  SIZES.forEach((r, si) => colours.forEach((col, ci) => {
    g.strokeStyle = col;
    for (let ri = 0; ri < ROT_STEPS; ri++) {
      const cx = (ci * ROT_STEPS + ri) * CELL + CELL / 2, cy = si * CELL + CELL / 2, rot = (ri * 10 * Math.PI) / 180;
      g.beginPath();
      for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + rot + (k * Math.PI) / 3; const px = cx + r * Math.cos(a), py = cy + r * Math.sin(a); k ? g.lineTo(px, py) : g.moveTo(px, py); }
      g.closePath(); g.stroke();
    }
  }));
  return c;
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const smoothstep = (a: number, b: number, v: number) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };
