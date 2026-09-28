"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motionOff, onMotionChange } from "@/lib/motion";
import s from "./LiquidHero.module.css";

// The shader is WebGL and client-only; loading it after hydration keeps it out of the first paint
// and the initial bundle. The copy underneath is static HTML, so the headline is the LCP either way.
const LiquidCell = dynamic(() => import("./LiquidCell"), { ssr: false });

// Lines that drift through the honey in three columns (30/50/70% of the cell), between 18% and 82% of its
// height so their centres stay inside the hex (addendum T8). Keep them real: things the stack actually does.
const SNIPPETS = [
  "POST /v1/agents/run",
  "retriever.search(query, k=8)",
  "evals.run(suite)",
  "terraform apply",
  '@app.post("/chat")',
  'trace.span("rerank")',
  'model = "open-weights"',
  "cost_ceiling.check()",
];

/** Hero: a honey liquid-metal hive cell (the logo, braces cut out) with the copy over it.
 *  The mask is `public/codehive-cell.svg`, preprocessed once into `codehive-cell.processed.png`
 *  (see LiquidCell.tsx for why). Reduced motion and "Pause motion" freeze the metal (speed 0) and park the snippets.
 *  colorBack is transparent so only the cell paints and the page's HiveCanvas lattice shows through
 *  around it (the reference had an opaque bg-000 hero). */
export default function LiquidHero() {
  const [speed, setSpeed] = useState(0.6);
  const hero = useRef<HTMLElement>(null);
  const cell = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const apply = () => setSpeed(motionOff() ? 0 : 0.6);
    apply();
    return onMotionChange(apply);
  }, []);
  // Handover target (see the css), in document space from the cell's centre. The hex in the mask is 89% of
  // the cell's height; a lattice cell is 92px tall (HiveCanvas R 46).
  useEffect(() => {
    const h = hero.current, c = cell.current;
    if (!h || !c) return;
    const measure = () => {
      const hr = h.getBoundingClientRect();
      const x0 = hr.left + hr.width / 2, y0 = hr.top + scrollY + hr.height / 2, hexH = 0.89 * c.offsetWidth;
      const set = (k: string, v: number) => c.style.setProperty(k, `${v.toFixed(2)}${k.endsWith("s") ? "" : "px"}`);
      // the lattice is fixed to the viewport: take the cell nearest the gap between the intro's heading and
      // honeycomb (one cell in from the right on a phone), a fifth down, as it sits when the hero has just
      // left (scrollY = the hero's bottom)
      const R = 46, w = Math.sqrt(3) * R, rh = 1.5 * R;
      const r = Math.round((innerHeight * 0.2) / rh), off = r % 2 ? w / 2 : 0;
      const col = Math.round(((innerWidth > 720 ? innerWidth * 0.55 : innerWidth - w) - off) / w);
      set("--lx", col * w + off - x0);
      set("--ly", r * rh + hr.bottom + scrollY - y0);
      set("--ls", (2 * R) / hexH);
    };
    measure();
    addEventListener("resize", measure); addEventListener("load", measure);
    return () => { removeEventListener("resize", measure); removeEventListener("load", measure); };
  }, []);

  return (
    <section ref={hero} className={s.hero} id="top" aria-labelledby="hero-title">
      <div ref={cell} className={s.cell} aria-hidden="true">
        <LiquidCell speed={speed} />
        <ul className={s.code}>
          {SNIPPETS.map((t, i) => (
            <li key={t} style={{ "--x": `${[30, 50, 70][i % 3]}%`, "--d": `${-i * 5}s`, "--i": i } as CSSProperties}>{t}</li>
          ))}
        </ul>
        {/* radial darkening behind the copy block: the one gradient on the site, only there to carry the copy */}
        <div className={s.shade} />
      </div>

      <div className={s.copy}>
        <p className={s.eyebrow}>AI engineering as a service</p>
        <h1 id="hero-title" className={s.h1}>Ship the AI feature.</h1>
        <p className={s.sub}>Backend engineering for teams adding LLM features without an ML team.</p>
        <div className={s.actions}>
          <a className={s.btn} href="#book">Book a call</a>
          <a className={s.btnGhost} href="#services">See the services</a>
        </div>
      </div>

    </section>
  );
}
