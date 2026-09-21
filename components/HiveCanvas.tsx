"use client";
import { useEffect, useRef } from "react";

/** Full-page hex lattice with neon glow that hops cell to cell. Density follows scroll:
 *  full on the hero, quiet behind the cells, medium after. */
export default function HiveCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const R = 46, SQ3 = Math.sqrt(3);
    let W = 0, H = 0, dpr = 1, grid: HTMLCanvasElement | null = null, cells: [number, number][] = [], cellsEnd = 0;
    const flows: { at: number; prev: number; hops: number; wait: number; hue: string }[] = [];
    const lit = new Map<number, { t: number; d: number; s: number; hue: string }>();

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1); W = window.innerWidth; H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr; cv.style.width = `${W}px`; cv.style.height = `${H}px`;
      grid = document.createElement("canvas"); grid.width = cv.width; grid.height = cv.height;
      const g = grid.getContext("2d")!; g.scale(dpr, dpr); g.strokeStyle = "#1a1d23"; g.lineWidth = 1;
      cells = [];
      const w = SQ3 * R, h = 1.5 * R;
      for (let r = -1; r < Math.ceil(H / h) + 2; r++) for (let c = -1; c < Math.ceil(W / w) + 2; c++) {
        const x = c * w + (r % 2 ? w / 2 : 0), y = r * h; cells.push([x, y]);
        g.beginPath(); for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; const px = x + R * Math.cos(a), py = y + R * Math.sin(a); k ? g.lineTo(px, py) : g.moveTo(px, py); } g.closePath(); g.stroke();
      }
      const last = document.querySelector<HTMLElement>("section[id^=cell-]:last-of-type");
      cellsEnd = last ? last.offsetTop + last.offsetHeight : 0;
    };
    const neighbours = (i: number) => { const out: number[] = []; const w = SQ3 * R * 1.05; const [x, y] = cells[i]; for (let j = 0; j < cells.length; j++) { if (j === i) continue; const dx = cells[j][0] - x, dy = cells[j][1] - y; if (dx * dx + dy * dy < w * w) out.push(j); } return out; };
    const light = (i: number, s: number, hue: string) => lit.set(i, { t: 0, d: 2.2 + Math.random() * 1.6, s, hue });
    const drawHex = (x: number, y: number, r: number) => { ctx.beginPath(); for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; const px = x + r * Math.cos(a), py = y + r * Math.sin(a); k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); };

    let last = 0, raf = 0;
    const frame = (ts: number) => {
      if (document.hidden) { raf = 0; return; }
      if (!last) last = ts; const dt = Math.min(0.05, (ts - last) / 1000); last = ts;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H); if (grid) ctx.drawImage(grid, 0, 0, W, H);
      const y = window.scrollY, hh = window.innerHeight;
      const dens = y < hh * 0.8 ? 1 : y < cellsEnd ? 0.22 : 0.55;
      if (flows.length < Math.round(6 * dens) + 1 && Math.random() < 0.03 * dens) flows.push({ at: Math.floor(Math.random() * cells.length), prev: -1, hops: 3 + Math.floor(Math.random() * 6), wait: 0, hue: Math.random() < 0.88 ? "242,184,75" : "111,207,151" });
      for (let f = flows.length - 1; f >= 0; f--) {
        const fl = flows[f]; fl.wait -= dt;
        if (fl.wait <= 0) {
          light(fl.at, 1, fl.hue);
          const nb = neighbours(fl.at).filter((n) => n !== fl.prev);
          fl.prev = fl.at; fl.at = nb.length ? nb[Math.floor(Math.random() * nb.length)] : -1;
          fl.hops--; fl.wait = 0.45 + Math.random() * 0.5;
          if (fl.hops <= 0 || fl.at < 0) flows.splice(f, 1);
        }
      }
      if (Math.random() < 0.02 * dens) light(Math.floor(Math.random() * cells.length), 0.6, "242,184,75");
      for (const [key, L] of lit) {
        L.t += dt; if (L.t >= L.d) { lit.delete(key); continue; }
        const env = Math.sin(Math.PI * (L.t / L.d)) ** 2, a = env * L.s * (0.55 + 0.45 * dens);
        const c = cells[key]; if (!c) continue;
        ctx.shadowColor = `rgba(${L.hue},${(0.9 * a).toFixed(3)})`; ctx.shadowBlur = 22;
        ctx.strokeStyle = `rgba(${L.hue},${(0.85 * a).toFixed(3)})`; ctx.lineWidth = 1.6;
        ctx.fillStyle = `rgba(${L.hue},${(0.07 * a).toFixed(3)})`;
        drawHex(c[0], c[1], R - 1); ctx.fill(); ctx.stroke();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(frame);
    };
    const onVis = () => { if (!document.hidden && !raf && !reduce) { last = 0; raf = requestAnimationFrame(frame); } };
    resize(); window.addEventListener("resize", resize); document.addEventListener("visibilitychange", onVis);
    if (reduce) { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); if (grid) ctx.drawImage(grid, 0, 0, W, H); } else raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); document.removeEventListener("visibilitychange", onVis); };
  }, []);
  return <canvas ref={ref} aria-hidden="true" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />;
}
