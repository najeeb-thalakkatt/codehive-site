"use client";
import { useEffect, useRef } from "react";
import type { CellData } from "@/content/cells";
import { desktopCrop, type Crop } from "@/components/cells";
import { useScrub } from "@/lib/useScrub";
import Stream from "./Stream";
import s from "./Cell.module.css";

export default function Cell({ data, mobileCrop, children }: { data: CellData; mobileCrop?: Crop; children?: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const viz = useRef<HTMLDivElement>(null);
  useScrub(ref, 1.8);

  // The visual is authored on a 1280×800 canvas; we show one crop of it scaled to the column:
  // the shared 720×520 window on desktop, a per-cell tighter window on narrow viewports.
  useEffect(() => {
    const fit = () => {
      if (!wrap.current || !viz.current) return;
      const c = window.innerWidth <= 820 && mobileCrop ? mobileCrop : desktopCrop;
      const k = wrap.current.clientWidth / c.w;
      wrap.current.style.height = `${Math.round(c.h * k)}px`;
      viz.current.style.transformOrigin = `${c.x}px ${c.y}px`;
      viz.current.style.transform = `translate(${-c.x}px,${-c.y}px) scale(${k})`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [mobileCrop]);

  return (
    <section ref={ref} className={s.cell} id={`cell-${data.id}`} aria-label={data.label}>
      <div className={s.stage}>
        <div className={`${s.col} anim`}>
          <div className={s.text}>
            <div className={`eyebrow ${s.eyebrow}`}><span className={s.num}>{data.id}</span>{data.label}</div>
            {/* Timeline (0–1 = scroll progress). The headline starts with a negative delay so its first
                words are already on screen when the cell pins: no empty frame between cells. */}
            <div className={`${s.msg} ${s.you} anim`}>
              <h2><Stream text={data.question} t0={-0.06} t1={0.12} /></h2>
              <p><Stream text={data.questionBody} t0={0.12} t1={0.3} /></p>
            </div>
            <div className={`${s.msg} ${s.us}`}>
              <div className={`${s.who} anim`}>codehive<span className={`${s.caret} anim`} /></div>
              <h2><Stream text={data.answer} t0={0.36} t1={0.46} /></h2>
              <p><Stream text={data.answerBody} t0={0.47} t1={0.62} /></p>
              <div className="chips">
                {data.chips.map((c, i) => (
                  <span key={c} className="chip w" style={{ animationDelay: `${(0.63 + (0.09 * i) / data.chips.length).toFixed(3)}s` }}>{c}</span>
                ))}
              </div>
              <a className="act w" style={{ animationDelay: ".74s" }} href={`#book-${data.id}`}>{data.cta}</a>
            </div>
          </div>
          <div ref={wrap} className={`${s.vizWrap} anim`}>
            <div ref={viz} className={s.viz}>{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
