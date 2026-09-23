"use client";
import { Fragment, useRef } from "react";
import { SERVICES } from "@/content/services";
import { usePlayOnEnter } from "@/lib/usePlayOnEnter";
import s from "./ServicesIntro.module.css";
import "./services-intro.css";

const HEX = "0,-58 50.2,-29 50.2,29 0,58 -50.2,29 -50.2,-29";
const WORDS = ["Six", "things", "we", "do."];

/** Services intro, from site-v3/layout-refs/services-intro.html. The heading words rise in one by
 *  one, the subline fades up, six hex cells drop in and a highlight runs 01 → 06 once and stops.
 *  Played once on enter by usePlayOnEnter (10 s); keyframes in services-intro.css. The honeycomb
 *  is 3+3 on the site grid (r=58, 6px gap) and 2+2+2 under 720px, positions set per cell in css. */
export default function ServicesIntro() {
  const ref = useRef<HTMLElement>(null);
  usePlayOnEnter(ref, 10);
  return (
    <section ref={ref} id="services" className={`wrap ${s.intro}`}>
      <div className={s.text}>
        <div className="eyebrow">Services</div>
        <h2 className={s.h2}>
          {WORDS.map((w, i) => (
            <Fragment key={w}><span className={s.clip}><span className="anim" style={{ animationName: `siw${i + 1}` }}>{w}</span></span>{i < WORDS.length - 1 ? " " : ""}</Fragment>
          ))}
        </h2>
        <p className={`${s.sub} anim`} style={{ animationName: "sisub" }}>Each one starts with what is broken.</p>
      </div>
      <nav aria-label="Six services">
        <svg className={s.hive}>
          {SERVICES.map((c, i) => (
            <a key={c.id} href={`#cell-${c.id}`} className={`${s.k} ${s[`k${i}`]}`} aria-label={`${c.id} ${c.name}`}>
              <g className="anim" style={{ animationName: `sic${i}` }}>
                <polygon className="anim" style={{ animationName: `sif${i}` }} points={HEX} fill="var(--bg1)" stroke="var(--amber)" strokeWidth="2" />
                <text className="anim" style={{ animationName: `sin${i}` }} y="-6" fill="var(--amber)">{c.id}</text>
                <text className="anim" style={{ animationName: `sit${i}` }} y="14" fill="var(--ink1)">{c.index}</text>
              </g>
            </a>
          ))}
        </svg>
      </nav>
    </section>
  );
}
