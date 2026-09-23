"use client";
import { useRef } from "react";
import { BOOK, SERVICES, type Service } from "@/content/services";
import { usePlayOnEnter } from "@/lib/usePlayOnEnter";
import Stream from "./Stream";
import ServiceAnimation from "./ServiceAnimation";
import s from "./Cell.module.css";

const TOTAL = String(SERVICES.length).padStart(2, "0");

/** One service card, from site-v3/layout-refs/section-compact-card.html: header row, a "you"
 *  bubble and a "codehive" bubble with the chips and the action on the left, the looping
 *  animation on the right. The text plays once on enter (the hook watches the text column only;
 *  the animation frame loops on its own). */
export default function Cell({ data, children }: { data: Service; children?: React.ReactNode }) {
  const text = useRef<HTMLDivElement>(null);
  usePlayOnEnter(text, 7);
  return (
    <section className={s.card} id={`cell-${data.id}`} aria-label={data.name}>
      <header className={s.head}>
        <div className={s.title}><span className={s.dot} /><span className={s.num}>{data.id}</span><span>{data.name}</span></div>
        <div className={s.count}>{data.id} / {TOTAL}</div>
      </header>
      <div className={s.body}>
        <div ref={text} className={s.text}>
          {/* Timeline (0–1 = the 7 s play). The question starts with a negative delay so its first
              words are already on screen the moment the card appears. */}
          <div className={`${s.bubble} ${s.you} anim`}>
            <div className={s.who}>you</div>
            <h2><Stream text={data.question} t0={-0.06} t1={0.12} /></h2>
            <p><Stream text={data.problem} t0={0.12} t1={0.3} /></p>
          </div>
          <div className={`${s.bubble} ${s.us} anim`}>
            <div className={`${s.who} ${s.whoUs}`}>codehive<span className={`${s.caret} anim`} /></div>
            <h3><Stream text={data.answer} t0={0.36} t1={0.46} /></h3>
            <p><Stream text={data.body} t0={0.47} t1={0.62} /></p>
          </div>
          <div className="chips">
            {data.chips.map((c, i) => (
              <span key={c} className="chip w" style={{ animationDelay: `${(0.63 + (0.09 * i) / data.chips.length).toFixed(3)}s` }}>{c}</span>
            ))}
          </div>
          {/* Plain #book works without JavaScript. The source card rides along as a data attribute and a
              custom event so Booking can prefill Calendly's service question. */}
          <a className="act w" style={{ animationDelay: ".74s" }} href="#book" data-source={`cell-${data.id}`}
            onClick={() => window.dispatchEvent(new CustomEvent("codehive:book", { detail: data.name }))}>{BOOK}</a>
        </div>
        <ServiceAnimation>{children}</ServiceAnimation>
      </div>
    </section>
  );
}
