"use client";
import { useEffect, useRef } from "react";
import { motionOff, onMotionChange } from "@/lib/motion";
import { CELL, ROT_STEPS, buildAtlas, clamp01, smoothstep } from "./swarm-lib";
import { COL_VARS, SCENES, type Scene } from "./scenes";

/** One hive of a group: its own centre and size, the element that wanders with it (`[data-bee]`), its bee phase and offset. */
type Member = { el: HTMLElement; cx: number; cy: number; S: number; bee: HTMLElement | null; ph: number; ox: number; oy: number };
/** A formation's place on the page. A group (`data-swarm-group`) is one anchor with several members: the first
 *  `count` particles are dealt round-robin to the members, each forming the scene at its own spot; the rest stay ambient. */
type Anchor = { key: string; el: HTMLElement; cx: number; cy: number; S: number; scene: Scene; members?: Member[]; count: number };

/** The /new background: one swarm of tiny outlined hexagons for the whole page. On load they fly in and
 *  settle into the logo cell over the hero's right column; as you scroll, the section nearest the middle
 *  of the viewport pulls them into its own formation (`[data-swarm-scene]`, one per service, drawn by
 *  components/new/scenes.ts), and between sections they drift as a sparse field. The same particles
 *  travel from figure to figure, so the page reads as one story told by the swarm. One fixed canvas, one
 *  rAF loop, sprites from an atlas: no paths or shadows per particle. Reduced motion and "Pause motion"
 *  draw the nearest formation's finished state once and keep it in step with scroll. `data-swarm` and
 *  `data-swarm-at` on the canvas report the stage and the dominant formation for the checks.
 *  Behind the swarm a sparse field of small and a few large outlines drifts across the whole viewport at all
 *  times, with a parallax on the pointer (the figures follow it a little too), so the ground is never still.
 *  Story beats (a particle's colour and dimming) cross-fade over 180 ms instead of flipping. Touch pointers are
 *  ignored: a scrolling finger is not a pointer. In the still branch every layer moves with the page (no parallax).
 *  The motion is a swarm's, not a drift: every particle buzzes around its home on two frequencies, one in eight is a
 *  scout that ranges further, the flight between formations is turbulent, and grouped hives (the services index) wander
 *  like bees, taking their `[data-bee]` element (the label) with them. */
export default function Swarm() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    let off = motionOff();
    const MAX = 2400;
    let W = 0, H = 0, dpr = 1, phone = false, n = MAX, atlas: HTMLCanvasElement | null = null, atlasDpr = 0;
    let anchors: Anchor[] = [];
    // per particle: start of the entrance, position, velocity, hover phase/rate/amplitude, delay, cohesion
    // jitter, ambient home (fractions of W and 1.2H) and parallax, base alpha, spin rate, size, own colour
    const F = () => new Float32Array(MAX);
    const sx = F(), sy = F(), x = F(), y = F(), vx = F(), vy = F(), ph = F(), hw = F(), ha = F(), dl = F(), jk = F(), ax = F(), ay = F(), par = F(), al = F(), rs = F();
    const sz = new Uint8Array(MAX), col = new Uint8Array(MAX);
    // story state per particle: current and previous colour column, the cross-fade between them, the eased dimming
    const curCol = new Uint8Array(MAX), prevCol = new Uint8Array(MAX), blend = F(), mulE = F();
    const pickW = (w: number[]) => { let r = Math.random(); for (let i = 0; i < w.length; i++) { if (r < w[i]) return i; r -= w[i]; } return w.length - 1; };
    for (let i = 0; i < MAX; i++) {
      // the buzz: quick (3–7 rad/s) and small (1.6–4 px), and one in sixteen is a scout that ranges three times further
      ph[i] = Math.random() * Math.PI * 2; hw[i] = 3 + Math.random() * 4; ha[i] = (1.6 + Math.random() * 2.4) * (Math.random() < 0.06 ? 3.2 : 1);
      dl[i] = Math.random() * 0.5; jk[i] = Math.random(); ax[i] = Math.random(); ay[i] = Math.random(); par[i] = 0.5 + Math.random() * 0.4;
      al[i] = 0.35 + Math.random() * 0.55; rs[i] = Math.random() < 0.1 ? 8 + Math.random() * 12 : 0;
      sz[i] = pickW([0.5, 0.35, 0.15]); col[i] = pickW([0.45, 0.2, 0.2, 0.15]);
      curCol[i] = prevCol[i] = col[i]; blend[i] = 1; mulE[i] = 1;
    }
    // the background field: small outlines drifting at depth, and a few large ones nearer the viewer. They
    // never join a formation; they wrap around the viewport, move a little with scroll and with the pointer
    const AMB = 220, BIG = 32;
    const bx = new Float32Array(AMB), by = new Float32Array(AMB), bvx = new Float32Array(AMB), bvy = new Float32Array(AMB), bd = new Float32Array(AMB), ba = new Float32Array(AMB), bp = new Float32Array(AMB);
    const bsz = new Uint8Array(AMB), bcol = new Uint8Array(AMB);
    const gx0 = new Float32Array(BIG), gy0 = new Float32Array(BIG), gvx = new Float32Array(BIG), gvy = new Float32Array(BIG), gr = new Float32Array(BIG), gd = new Float32Array(BIG), ga = new Float32Array(BIG), gp = new Float32Array(BIG), grs = new Float32Array(BIG);
    const gcol = new Uint8Array(BIG);
    let ambN = AMB, bigN = BIG, seeded = false;
    const seedField = () => {
      ambN = phone ? 70 : AMB; bigN = phone ? 10 : BIG;
      if (seeded) return; seeded = true;
      for (let i = 0; i < AMB; i++) { bx[i] = Math.random() * W; by[i] = Math.random() * H; const a = Math.random() * Math.PI * 2, v = 4 + Math.random() * 10; bvx[i] = Math.cos(a) * v; bvy[i] = Math.sin(a) * v; bd[i] = 0.3 + Math.random() * 0.7; ba[i] = 0.2 + Math.random() * 0.35; bp[i] = Math.random() * Math.PI * 2; bsz[i] = pickW([0.55, 0.35, 0.1]); bcol[i] = pickW([0.4, 0.15, 0.3, 0.15]); }
      for (let i = 0; i < BIG; i++) { gx0[i] = Math.random() * W; gy0[i] = Math.random() * H; const a = Math.random() * Math.PI * 2, v = 3 + Math.random() * 6; gvx[i] = Math.cos(a) * v; gvy[i] = Math.sin(a) * v; gr[i] = 9 + Math.random() * 18; gd[i] = 1 + Math.random() * 0.7; ga[i] = 0.1 + Math.random() * 0.2; gp[i] = Math.random() * Math.PI * 2; grs[i] = (Math.random() - 0.5) * 0.4; gcol[i] = pickW([0.45, 0.15, 0.25, 0.15]); }
    };
    let colours: string[] = [];
    let stage: "loading" | "entering" | "settled" | "still" = "loading", t0 = 0, now = 0;
    const setStage = (s: typeof stage) => { stage = s; cv.dataset.swarm = s; };
    setStage(off ? "still" : "loading");

    // one formation per `[data-swarm-scene]` element, sampled once for the largest count; measured on
    // resize and load like LiquidHero.measure, in document space so the figure scrolls with its section
    // formations are sampled for the live particle count (a phone draws 600, so its shapes are built from 600)
    const scenes = new Map<string, Scene>();
    const collect = () => {
      const groups = new Map<string, Anchor>();
      anchors = [...document.querySelectorAll<HTMLElement>("[data-swarm-scene]")].flatMap((el) => {
        const key = el.dataset.swarmScene || "", make = SCENES[key], id = `${key}:${n}`; if (!make) return [];
        if (!scenes.has(id)) scenes.set(id, make(n));
        const g = el.dataset.swarmGroup;
        if (!g) return [{ key, el, cx: 0, cy: 0, S: 0, scene: scenes.get(id)!, count: n }];
        const mb: Member = { el, cx: 0, cy: 0, S: 0, bee: el.closest<HTMLElement>("[data-bee]"), ph: 0, ox: 0, oy: 0 };
        const have = groups.get(g);
        if (have) { mb.ph = have.members!.length * 1.7; have.members!.push(mb); have.count = Math.min(n, have.members!.length * (phone ? 56 : 110)); return []; }
        const a: Anchor = { key, el, cx: 0, cy: 0, S: 0, scene: scenes.get(id)!, members: [mb], count: phone ? 56 : 110 };
        groups.set(g, a); return [a];
      });
    };
    // `data-swarm-fit="width"` sizes the formation by the anchor's width (a wide band) instead of its shorter side
    const measure = () => {
      for (const a of anchors) {
        if (a.members) {
          // each hive where its element is, minus the bee offset it currently carries; the group's centre is their mean
          let sy = 0, sx = 0;
          for (const m of a.members) { const r = m.el.getBoundingClientRect(); m.cx = r.left + r.width / 2 - m.ox; m.cy = r.top + r.height / 2 + window.scrollY - m.oy; m.S = 0.5 * Math.min(r.width, r.height); sx += m.cx; sy += m.cy; }
          a.cx = sx / a.members.length; a.cy = sy / a.members.length; a.S = a.members[0].S;
          continue;
        }
        const r = a.el.getBoundingClientRect(); a.cx = r.left + r.width / 2; a.cy = r.top + r.height / 2 + window.scrollY; a.S = a.el.dataset.swarmFit === "width" ? 0.475 * r.width : 0.5 * Math.min(r.width, r.height);
      }
    };
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1); W = window.innerWidth; H = window.innerHeight; phone = W <= 820;
      const n0 = n; n = phone ? 700 : MAX; if (n !== n0) collect();
      seedField();
      cv.width = W * dpr; cv.height = H * dpr; cv.style.width = `${W}px`; cv.style.height = `${H}px`;
      if (atlasDpr !== dpr) { const cs = getComputedStyle(document.documentElement); colours = COL_VARS.map((v) => cs.getPropertyValue(v).trim()); atlas = buildAtlas(dpr, colours); atlasDpr = dpr; }
      measure();
      if (off) still();
    };
    // scatter starts: polar around the first figure, 1.6–3.4 radii out, a third of them from beyond the viewport
    const scatter = () => {
      const a = anchors[0], cx = a ? a.cx : W / 2, cy = (a ? a.cy : H / 2) - window.scrollY, S = a ? a.S : 0.3 * H, far = Math.max(W, H);
      for (let i = 0; i < MAX; i++) {
        const ang = Math.random() * Math.PI * 2, r = i % 3 === 0 ? far * (0.6 + Math.random() * 0.4) : S * (1.6 + Math.random() * 1.8);
        x[i] = sx[i] = cx + r * Math.cos(ang); y[i] = sy[i] = cy + r * Math.sin(ang); vx[i] = vy[i] = 0;
      }
    };

    let px = -1e9, py = -1e9; // pointer, viewport px
    let mx = 0, my = 0; // smoothed pointer offset from the centre, -0.5..0.5, for the parallax
    const onMove = (e: PointerEvent) => { if (e.pointerType === "touch") return; px = e.clientX; py = e.clientY; };
    const onLeave = () => { px = py = -1e9; };

    /** The background field: drift, wrap, scroll and pointer parallax by depth; small ones from the atlas, the
     *  large ones as a stroked path (a few dozen, cheap). Static under reduced motion. */
    const drawField = (dt: number, stat: boolean, scrollY: number) => {
      if (!atlas) return;
      const cs = CELL, half = cs / 2, cd = cs * dpr, wrap = (v: number, m: number) => ((v % m) + m) % m;
      // the field fades in over 600 ms with the swarm's entrance; in the still branch it is simply there, and every
      // layer scrolls with the page (depth 1) so nothing slides against the copy
      const fade = stat ? 1 : 1 - (1 - clamp01((now - t0) / 0.6)) ** 3;
      for (let i = 0; i < ambN; i++) {
        // a bee's path, not a drift: the heading keeps turning and a faster wiggle rides on top
        if (!stat) { bx[i] += (bvx[i] + 12 * Math.sin(now * 0.7 + bp[i]) + 9 * Math.sin(now * 2.9 + bp[i] * 2.1)) * dt; by[i] += (bvy[i] + 12 * Math.cos(now * 0.6 + bp[i]) + 9 * Math.cos(now * 3.3 + bp[i] * 1.7)) * dt; }
        const X = wrap(bx[i] + mx * 50 * bd[i], W + 40) - 20, Y = wrap(by[i] - scrollY * (stat ? 1 : 0.12 * bd[i]) + my * 30 * bd[i], H + 40) - 20;
        ctx.globalAlpha = ba[i] * fade;
        ctx.drawImage(atlas, bcol[i] * ROT_STEPS * cd, bsz[i] * cd, cd, cd, X - half, Y - half, cs, cs);
      }
      for (let i = 0; i < bigN; i++) {
        if (!stat) { gx0[i] += gvx[i] * dt; gy0[i] += gvy[i] * dt; }
        const X = wrap(gx0[i] + mx * 90 * gd[i], W + 80) - 40, Y = wrap(gy0[i] - scrollY * (stat ? 1 : 0.2 * gd[i]) + my * 50 * gd[i], H + 80) - 40, r = gr[i], rot = stat ? gp[i] : gp[i] + now * grs[i];
        // depth cue: the nearer outlines (larger depth) draw a little heavier
        ctx.lineWidth = 0.7 + (gd[i] - 1) * 1.1;
        ctx.globalAlpha = ga[i] * fade; ctx.strokeStyle = colours[gcol[i]] || "#fff";
        ctx.beginPath();
        for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + rot + (k * Math.PI) / 3; const qx = X + r * Math.cos(a), qy = Y + r * Math.sin(a); k ? ctx.lineTo(qx, qy) : ctx.moveTo(qx, qy); }
        ctx.closePath(); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    const near: { a: Anchor; d: number }[] = [];
    /** One frame. `stat` draws the rest state (no hover, no entrance, no spring, each story at its end). */
    const draw = (dt: number, stat: boolean) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      if (!atlas) return false;
      const scrollY = window.scrollY, wrapH = 1.2 * H, entering = stage === "entering", t = now;
      // pointer parallax: ease towards the pointer (or back to the centre when it leaves)
      const tmx = !stat && px > -1e8 ? px / W - 0.5 : 0, tmy = !stat && py > -1e8 ? py / H - 0.5 : 0, ease = stat ? 1 : 1 - Math.exp(-3 * dt);
      mx += (tmx - mx) * ease; my += (tmy - my) * ease;
      drawField(dt, stat, scrollY);
      // the sections that can hold particles right now: within half a viewport of the middle. Cohesion is
      // full inside a quarter viewport and gone by half, so two neighbouring formations blend only in the
      // stretch between them (a morph on the way) and never smear each other
      near.length = 0;
      for (const a of anchors) { const d = Math.abs(a.cy - scrollY - H / 2) / H; if (d < 0.5) near.push({ a, d }); }
      near.sort((p, q) => p.d - q.d);
      const dom = near[0]?.a; cv.dataset.swarmAt = dom ? dom.key : "";
      // grouped hives wander like bees (a slow loop with a quicker wobble on it) and carry their label along; still
      // mode parks them where the layout put them
      for (const a of anchors) {
        if (!a.members) continue;
        const live = !stat && Math.abs(a.cy - scrollY - H / 2) < 1.2 * H;
        for (const m of a.members) {
          const ox = live ? 9 * Math.sin(t * 0.9 + m.ph) + 4 * Math.sin(t * 2.6 + m.ph * 2.3) : 0, oy = live ? 6 * Math.sin(t * 1.3 + m.ph * 1.9) + 3 * Math.sin(t * 3.4 + m.ph) : 0;
          if (ox !== m.ox || oy !== m.oy) { m.ox = ox; m.oy = oy; if (m.bee) m.bee.style.transform = ox || oy ? `translate3d(${ox.toFixed(1)}px, ${oy.toFixed(1)}px, 0)` : ""; }
        }
      }
      let allIn = true;
      const cs = CELL, half = cs / 2, cd = cs * dpr, hov = stat ? 0 : 1;
      for (let i = 0; i < n; i++) {
        // targets: each nearby formation pulls with its own cohesion (particles peel off in waves, by jitter);
        // what is left goes to the ambient field, which wraps down the page
        let tx = 0, ty = 0, K = 0, kd = 0, bz = 0;
        for (let q = 0; q < near.length; q++) {
          const { a, d } = near[q]; if (i >= a.count) continue;
          const k = 1 - smoothstep(0.2 + 0.15 * jk[i], 0.5, d); if (k <= 0) continue;
          if (q === 0) kd = k;
          // a group deals its particles round-robin to its hives; each hive carries its bee offset
          const m = a.members ? a.members[i % a.members.length] : null;
          const acx = m ? m.cx + m.ox : a.cx, acy = m ? m.cy + m.oy : a.cy, aS = m ? m.S : a.S;
          // how hard this particle buzzes here: scaled down on small figures, and stirred by a wave of agitation that
          // sweeps across the formation every few seconds, so the shape resolves, stirs and resolves again
          const sx0 = a.scene.x[i], sy0 = a.scene.y[i], wv = Math.sin(t * 0.9 - (sx0 * 2 + sy0) * 1.4 + q);
          bz += k * (aS < 117 ? 0.5 : aS > 260 ? 1 : aS / 260) * (0.5 + (wv > 0 ? 1.1 * wv * wv : 0));
          tx += k * (acx + mx * 36 + sx0 * aS * (1 + mx * 0.08));
          ty += k * (acy - scrollY + my * 24 + sy0 * aS);
          K += k;
        }
        if (K > 1) { tx /= K; ty /= K; bz /= K; K = 1; }
        const gx = ax[i] * W + hov * 16 * Math.sin(t * 0.8 + ph[i] * 3), gy = (((ay[i] * wrapH - scrollY * (stat ? 1 : par[i])) % wrapH) + wrapH) % wrapH - 0.1 * H + hov * 12 * Math.cos(t * 1.1 + ph[i] * 2);
        tx += (1 - K) * gx; ty += (1 - K) * gy;
        // in flight between a formation and the field the path is turbulent: strongest half way, nothing at either end
        if (hov && K > 0 && K < 1) { const tb = 4 * K * (1 - K) * 46; tx += tb * Math.sin(t * 2.1 + ph[i] * 5); ty += tb * Math.cos(t * 1.7 + ph[i] * 4); }
        if (stat) { x[i] = tx; y[i] = ty; vx[i] = vy[i] = 0; }
        else if (entering) {
          const E = clamp01((t - t0 - dl[i]) / 1.6), e = 1 - (1 - E) ** 4;
          x[i] = sx[i] + (tx - sx[i]) * e; y[i] = sy[i] + (ty - sy[i]) * e;
          if (E < 1) allIn = false;
        } else {
          // a damped spring to the target, in substeps of at most 50 ms so a slow frame (a phone, a busy
          // tab) still gets there in the same real time; the pointer pushes nearby particles off it
          for (let sdt = dt; sdt > 0; sdt -= 0.05) {
            const h = Math.min(0.05, sdt);
            vx[i] += (tx - x[i]) * 18 * h; vy[i] += (ty - y[i]) * 18 * h;
            const dx = x[i] - px, dy = y[i] - py, d2 = dx * dx + dy * dy;
            if (d2 < 110 * 110 && d2 > 0.01) { const d = Math.sqrt(d2), f = ((1 - d / 110) * 900 * h) / d; vx[i] += dx * f; vy[i] += dy * f; }
            const damp = Math.exp(-6 * h); vx[i] *= damp; vy[i] *= damp;
            x[i] += vx[i] * h; y[i] += vy[i] * h;
          }
        }
        // colour and dimming come from the dominant formation's story once it holds the particle; two thirds
        // fade out on the way to the ambient field (and stop being drawn), a third keeps drifting
        // the story's colour and dimming for this particle; a change cross-fades over 180 ms (two draws while it
        // blends), a dimming change eases with the same time constant. Still mode jumps to the end state.
        let pc = col[i], pm = 1;
        if (dom && kd > 0.5) { const r = dom.scene.paint(dom.scene.m[i], stat ? dom.scene.stillT : t, i, col[i]); pc = r[0]; pm = 1 + (r[1] - 1) * kd; }
        if (pc !== curCol[i]) { prevCol[i] = curCol[i]; curCol[i] = pc; blend[i] = 0; }
        if (stat) { blend[i] = 1; mulE[i] = pm; } else { blend[i] = Math.min(1, blend[i] + dt / 0.18); mulE[i] += (pm - mulE[i]) * (1 - Math.exp(-dt / 0.18)); }
        const a = al[i] * mulE[i] * (K > 0.02 ? 1 : 0.5) * (i % 3 === 0 ? 1 : K);
        // the buzz rides on top of the spring's position (two frequencies per axis), so it is as quick as a bee
        // without the spring smoothing it away
        const A = hov * ha[i] * bz, w = hw[i], p0 = ph[i];
        const X = x[i] + A * (Math.sin(t * w + p0) + 0.55 * Math.sin(t * w * 2.31 + p0 * 1.7)), Y = y[i] + A * (Math.cos(t * w * 0.83 + p0) + 0.55 * Math.sin(t * w * 1.87 + p0 * 2.3));
        if (a < 0.02 || X < -cs || Y < -cs || X > W + cs || Y > H + cs) continue;
        const rot = rs[i] ? Math.floor(((((t * rs[i] + 60 * ph[i]) % 60) + 60) % 60) / 10) : 0, b = blend[i];
        if (b < 1) { ctx.globalAlpha = a * (1 - b); ctx.drawImage(atlas, (prevCol[i] * ROT_STEPS + rot) * cd, sz[i] * cd, cd, cd, X - half, Y - half, cs, cs); }
        ctx.globalAlpha = a * b;
        ctx.drawImage(atlas, (curCol[i] * ROT_STEPS + rot) * cd, sz[i] * cd, cd, cd, X - half, Y - half, cs, cs);
      }
      ctx.globalAlpha = 1;
      if (entering && allIn) setStage("settled");
      return near.length > 0;
    };
    const still = () => { draw(0, true); };

    let raf = 0, last = 0;
    const frame = (ts: number) => {
      if (document.hidden) { raf = 0; return; }
      if (!last) last = ts; const dt = Math.min(0.25, (ts - last) / 1000); now = ts / 1000;
      last = ts;
      draw(dt, false); // every frame: the background field is always on screen and a half-rate drift reads as a tremor
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf && !document.hidden && !off) { last = 0; raf = requestAnimationFrame(frame); } };
    const onVis = () => start();
    let scrollRaf = 0;
    const onScroll = () => { if (off && !scrollRaf) scrollRaf = requestAnimationFrame(() => { scrollRaf = 0; still(); }); };
    const onMotion = () => {
      off = motionOff();
      if (off) { cancelAnimationFrame(raf); raf = 0; setStage("still"); still(); }
      else { setStage("settled"); still(); start(); }
    };

    resize(); collect(); measure();
    const first = anchors[0]?.scene;
    if (first) for (let i = 0; i < MAX; i++) dl[i] = 0.5 * Math.min(1, Math.hypot(first.x[i], first.y[i])); // the cell closes from the centre out
    if (off) { setStage("still"); still(); }
    else { scatter(); t0 = performance.now() / 1000; now = t0; setStage("entering"); start(); }

    const onLoad = () => { measure(); if (off) still(); };
    window.addEventListener("resize", resize); window.addEventListener("load", onLoad);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true }); document.addEventListener("pointerleave", onLeave); window.addEventListener("pointercancel", onLeave);
    document.addEventListener("visibilitychange", onVis);
    const unsub = onMotionChange(onMotion);
    return () => {
      cancelAnimationFrame(raf); cancelAnimationFrame(scrollRaf); unsub();
      for (const an of anchors) for (const m of an.members ?? []) if (m.bee) m.bee.style.transform = "";
      window.removeEventListener("resize", resize); window.removeEventListener("load", onLoad); window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove); document.removeEventListener("pointerleave", onLeave); window.removeEventListener("pointercancel", onLeave); document.removeEventListener("visibilitychange", onVis);
    };
  }, []);
  return <canvas ref={ref} aria-hidden="true" data-swarm="loading" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />;
}
