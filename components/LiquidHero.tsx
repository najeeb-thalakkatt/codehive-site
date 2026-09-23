"use client";
import dynamic from "next/dynamic";
import { useEffect, useState, type CSSProperties } from "react";
import s from "./LiquidHero.module.css";

// The shader is WebGL and client-only; loading it after hydration keeps it out of the first paint
// and the initial bundle. The copy underneath is static HTML, so the headline is the LCP either way.
const LiquidMetal = dynamic(() => import("@paper-design/shaders-react").then((m) => m.LiquidMetal), { ssr: false });

// Lines that drift through the honey. Keep them real: things the stack actually does.
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
 *  The mask is `public/codehive-cell.svg`, passed as a URL; the installed package (0.0.81) types
 *  `image` as `HTMLImageElement | string` and loads a string itself. Reduced motion freezes the
 *  metal (speed 0) and parks the snippets. colorBack is transparent so only the cell paints and the
 *  page's HiveCanvas lattice shows through around it (the reference had an opaque bg-000 hero). */
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
        <LiquidMetal
          width={720}
          height={720}
          image="/codehive-cell.svg"
          shape="none"
          colorBack="rgba(11, 13, 16, 0)"
          colorTint="#f2b84b"
          repetition={2}
          softness={0.15}
          shiftRed={0.2}
          shiftBlue={-0.05}
          distortion={0.08}
          contour={0.4}
          angle={70}
          speed={speed}
          scale={0.9}
          fit="contain"
        />
        <ul className={s.code}>
          {SNIPPETS.map((t, i) => (
            <li key={t} style={{ "--x": `${18 + ((i * 23) % 60)}%`, "--d": `${-i * 5}s`, "--i": i } as CSSProperties}>{t}</li>
          ))}
        </ul>
      </div>

      <div className={s.copy}>
        <p className={s.eyebrow}>AI engineering as a service · Stockholm</p>
        <h1 id="hero-title" className={s.h1}>Ship the AI feature.</h1>
        <p className={s.sub}>Backend engineering for teams adding LLM features without an ML team. Based in Stockholm, remote across Europe, the UK and the US.</p>
        <div className={s.actions}>
          <a className={`act ${s.ink}`} href="#book">Book a call</a>
          <a className="act ghost" href="#services">See the services</a>
        </div>
      </div>

      <div className={s.scroll} aria-hidden="true">Scroll</div>
    </section>
  );
}
