"use client";
import dynamic from "next/dynamic";
import { useEffect, useState, type CSSProperties } from "react";
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
 *  (see LiquidCell.tsx for why). Reduced motion freezes the metal (speed 0) and parks the snippets.
 *  colorBack is transparent so only the cell paints and the page's HiveCanvas lattice shows through
 *  around it (the reference had an opaque bg-000 hero). */
export default function LiquidHero() {
  const [speed, setSpeed] = useState(0.6);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setSpeed(mq.matches ? 0 : 0.6);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <section className={s.hero} id="top" aria-labelledby="hero-title">
      <div className={s.cell} aria-hidden="true">
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
