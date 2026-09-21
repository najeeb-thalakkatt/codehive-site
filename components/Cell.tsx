"use client";
import { useEffect, useRef } from "react";
import type { CellData } from "@/content/cells";
import { useScrub } from "@/lib/useScrub";
import Stream from "./Stream";
import s from "./Cell.module.css";

export default function Cell({ data, children }: { data: CellData; children?: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const viz = useRef<HTMLDivElement>(null);
  useScrub(ref, 1.2);

  // The visual is authored on a 1280×800 canvas; we show the 720×520 region at (560,100) scaled to the column.
  useEffect(() => {
    const fit = () => {
      if (!wrap.current || !viz.current) return;
      const k = wrap.current.clientWidth / 720;
      wrap.current.style.height = `${Math.round(520 * k)}px`;
      viz.current.style.transform = `translate(-560px,-100px) scale(${k})`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <section ref={ref} className={s.cell} id={`cell-${data.id}`} aria-label={data.label}>
      <div className={s.stage}>
        <div className={`${s.col} anim`}>
          <div className="eyebrow">{data.id} / {data.label}</div>
          <div className={`${s.msg} ${s.you} anim`}>
            <div className={s.who}>you</div>
            <h2><Stream text={data.question} t0={0.02} t1={0.2} /></h2>
            <p><Stream text={data.questionBody} t0={0.21} t1={0.4} /></p>
          </div>
          <div className={`${s.msg} ${s.us}`}>
            <div className={`${s.who} anim`}>codehive<span className={`${s.caret} anim`} /></div>
            <h2><Stream text={data.answer} t0={0.47} t1={0.58} /></h2>
            <p><Stream text={data.answerBody} t0={0.59} t1={0.74} /></p>
            <div className="chips">
              {data.chips.map((c, i) => (
                <span key={c} className="chip w" style={{ animationDelay: `${(0.75 + (0.09 * i) / data.chips.length).toFixed(3)}s` }}>{c}</span>
              ))}
            </div>
            <a className="act w" style={{ animationDelay: ".86s" }} href="#contact">{data.cta}</a>
          </div>
          <div ref={wrap} className={`${s.vizWrap} anim`}>
            <div ref={viz} className={s.viz}>{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
