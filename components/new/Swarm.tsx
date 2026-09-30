"use client";
import { useEffect, useRef } from "react";
import { motionOff, onMotionChange } from "@/lib/motion";
import { CELL, COL_VARS, ROT_STEPS, buildAtlas, cellHomes, clamp01, smoothstep, type Homes } from "./swarm-lib";

/** The /new background: a swarm of tiny outlined hexagons. On load they fly in from around the hero and
 *  settle into the logo cell over the hero's right column (measured from `[data-swarm-target]`), hover
 *  there and scatter around the pointer. As the hero scrolls out (`[data-swarm-hero]`) they peel off in
 *  waves into a sparse field drifting down the rest of the page. One fixed canvas, one rAF loop, sprites
 *  from an atlas: no paths or shadows per particle. Reduced motion and "Pause motion" draw the settled
 *  scene once and keep it in step with scroll; nothing moves. `data-swarm` reports the stage for checks. */
export default function Swarm() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    let off = motionOff();
    const MAX = 1600;
    let W = 0, H = 0, dpr = 1, phone = false, n = MAX, atlas: HTMLCanvasElement | null = null, atlasDpr = 0;
    // shape placement in document space (cx, cy), radius S; the hero's bottom for the scroll coupling
    let cxDoc = 0, cyDoc = 0, S = 0, heroEnd = 0, hasTarget = false;
    // per particle: home (unit), entrance start, position, velocity, hover phase/rate/amplitude, delay,
    // cohesion jitter, ambient home (fractions of W and 1.2H) and parallax, base alpha, spin rate
    const F = () => new Float32Array(MAX);
    const hx = F(), hy = F(), sx = F(), sy = F(), x = F(), y = F(), vx = F(), vy = F(), ph = F(), hw = F(), ha = F(), dl = F(), jk = F(), ax = F(), ay = F(), par = F(), al = F(), rs = F();
    const sz = new Uint8Array(MAX), col = new Uint8Array(MAX);
    const pickW = (w: number[]) => { let r = Math.random(); for (let i = 0; i < w.length; i++) { if (r < w[i]) return i; r -= w[i]; } return w.length - 1; };
    for (let i = 0; i < MAX; i++) {
      ph[i] = Math.random() * Math.PI * 2; hw[i] = 0.6 + Math.random() * 0.6; ha[i] = 1.5 + Math.random() * 1.5;
      dl[i] = Math.random() * 0.5; jk[i] = Math.random(); ax[i] = Math.random(); ay[i] = Math.random(); par[i] = 0.5 + Math.random() * 0.4;
      al[i] = 0.35 + Math.random() * 0.55; rs[i] = Math.random() < 0.1 ? 8 + Math.random() * 12 : 0;
      sz[i] = pickW([0.5, 0.35, 0.15]); col[i] = pickW([0.45, 0.2, 0.2, 0.15]);
    }
    let homes: Homes | null = null;
    let stage: "loading" | "entering" | "settled" | "still" = "loading", t0 = 0, now = 0;
    const setStage = (s: typeof stage) => { stage = s; cv.dataset.swarm = s; };
    setStage(off ? "still" : "loading");

    const measure = () => {
      const tgt = document.querySelector<HTMLElement>("[data-swarm-target]");
      const hero = document.querySelector<HTMLElement>("[data-swarm-hero]");
      hasTarget = !!tgt;
      if (tgt) { const r = tgt.getBoundingClientRect(); cxDoc = r.left + r.width / 2; cyDoc = r.top + r.height / 2 + window.scrollY; S = 0.46 * Math.min(r.width, r.height); }
      heroEnd = hero ? hero.getBoundingClientRect().bottom + window.scrollY : H;
    };
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1); W = window.innerWidth; H = window.innerHeight; phone = W <= 820; n = phone ? 600 : MAX;
      cv.width = W * dpr; cv.height = H * dpr; cv.style.width = `${W}px`; cv.style.height = `${H}px`;
      if (atlasDpr !== dpr) {
        const cs = getComputedStyle(document.documentElement);
        atlas = buildAtlas(dpr, COL_VARS.map((v) => cs.getPropertyValue(v).trim())); atlasDpr = dpr;
      }
      measure();
      if (off) still();
    };
    // scatter starts: polar around the shape, 1.6–3.4 radii out, a third of them from beyond the viewport
    const scatter = () => {
      const cy = cyDoc - window.scrollY, far = Math.max(W, H);
      for (let i = 0; i < MAX; i++) {
        const a = Math.random() * Math.PI * 2, r = i % 3 === 0 ? far * (0.6 + Math.random() * 0.4) : S * (1.6 + Math.random() * 1.8);
        x[i] = sx[i] = cxDoc + r * Math.cos(a); y[i] = sy[i] = cy + r * Math.sin(a); vx[i] = vy[i] = 0;
      }
    };

    let px = -1e9, py = -1e9; // pointer, viewport px
    const onMove = (e: PointerEvent) => { px = e.clientX; py = e.clientY; };
    const onLeave = () => { px = py = -1e9; };

    /** One frame. `stat` draws the rest state (no hover, no entrance, no spring): reduced motion, or a resize. */
    const draw = (dt: number, stat: boolean) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      if (!atlas || !homes) return;
      const scrollY = window.scrollY, cy = cyDoc - scrollY;
      const p = hasTarget ? clamp01(scrollY / Math.max(1, heroEnd - 0.5 * H)) : 1;
      const wrapH = 1.2 * H, entering = stage === "entering", t = now;
      let allIn = true;
      const cs = CELL, half = cs / 2, cd = cs * dpr;
      for (let i = 0; i < n; i++) {
        const k = 1 - smoothstep(0.1 + 0.25 * jk[i], 0.9, p);
        // shape target with its hover, ambient target on a field that wraps down the page, blended by cohesion
        const hov = stat ? 0 : 1;
        const fx = cxDoc + hx[i] * S + hov * ha[i] * Math.sin(t * hw[i] + ph[i]);
        const fy = cy + hy[i] * S + hov * ha[i] * Math.cos(t * hw[i] * 0.8 + ph[i]);
        const gx = ax[i] * W, gy = (((ay[i] * wrapH - scrollY * par[i]) % wrapH) + wrapH) % wrapH - 0.1 * H;
        const tx = gx + (fx - gx) * k, ty = gy + (fy - gy) * k;
        if (stat) { x[i] = tx; y[i] = ty; vx[i] = vy[i] = 0; }
        else if (entering) {
          const E = clamp01((t - t0 - dl[i]) / 2), e = 1 - (1 - E) ** 3;
          x[i] = sx[i] + (tx - sx[i]) * e; y[i] = sy[i] + (ty - sy[i]) * e;
          if (E < 1) allIn = false;
        } else {
          // a damped spring to the target; the pointer pushes nearby particles off it
          vx[i] += (tx - x[i]) * 14 * dt; vy[i] += (ty - y[i]) * 14 * dt;
          const dx = x[i] - px, dy = y[i] - py, d2 = dx * dx + dy * dy;
          if (d2 < 110 * 110 && d2 > 0.01) { const d = Math.sqrt(d2), f = ((1 - d / 110) * 900 * dt) / d; vx[i] += dx * f; vy[i] += dy * f; }
          const damp = Math.exp(-6 * dt); vx[i] *= damp; vy[i] *= damp;
          x[i] += vx[i] * dt; y[i] += vy[i] * dt;
        }
        // two thirds fade out as they leave the shape (and stop being drawn); the rest is the ambient field
        const a = al[i] * (k > 0.02 ? 1 : 0.5) * (phone ? 0.55 : 1) * (i % 3 === 0 ? 1 : k);
        const X = x[i], Y = y[i];
        if (a < 0.02 || X < -cs || Y < -cs || X > W + cs || Y > H + cs) continue;
        const rot = rs[i] ? Math.floor(((((t * rs[i] + 60 * ph[i]) % 60) + 60) % 60) / 10) : 0;
        ctx.globalAlpha = a;
        ctx.drawImage(atlas, (col[i] * ROT_STEPS + rot) * cd, sz[i] * cd, cd, cd, X - half, Y - half, cs, cs);
      }
      ctx.globalAlpha = 1;
      if (entering && allIn) setStage("settled");
      return p;
    };
    const still = () => { draw(0, true); };

    let raf = 0, last = 0, tick = 0;
    const frame = (ts: number) => {
      if (document.hidden) { raf = 0; return; }
      if (!last) last = ts; const dt = Math.min(0.05, (ts - last) / 1000); now = ts / 1000;
      // below the hero the field is sparse and slow: every other frame is enough
      if (stage === "settled" && window.scrollY > heroEnd && (tick++ & 1)) { raf = requestAnimationFrame(frame); return; }
      last = ts;
      draw(dt, false);
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf && !document.hidden && !off) { last = 0; raf = requestAnimationFrame(frame); } };
    const onVis = () => start();
    let scrollRaf = 0;
    const onScroll = () => { if (off && !scrollRaf) scrollRaf = requestAnimationFrame(() => { scrollRaf = 0; still(); }); };
    const onMotion = () => {
      off = motionOff();
      if (off) { cancelAnimationFrame(raf); raf = 0; setStage("still"); still(); }
      else { setStage(homes ? "settled" : "loading"); still(); start(); }
    };

    resize();
    // the homes come from a 192 px raster of the logo cell, a few ms once; the entrance starts from wherever
    // the particles are (their scatter starts) the moment they exist
    homes = cellHomes(MAX);
    for (let i = 0; i < MAX; i++) { hx[i] = homes.x[i]; hy[i] = homes.y[i]; }
    if (off) { setStage("still"); still(); }
    else { scatter(); t0 = performance.now() / 1000; now = t0; setStage("entering"); start(); }

    const onLoad = () => { measure(); if (off) still(); };
    window.addEventListener("resize", resize); window.addEventListener("load", onLoad);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true }); document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    const unsub = onMotionChange(onMotion);
    return () => {
      cancelAnimationFrame(raf); cancelAnimationFrame(scrollRaf); unsub();
      window.removeEventListener("resize", resize); window.removeEventListener("load", onLoad); window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove); document.removeEventListener("pointerleave", onLeave); document.removeEventListener("visibilitychange", onVis);
    };
  }, []);
  return <canvas ref={ref} aria-hidden="true" data-swarm="loading" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />;
}
