"use client";
import { useRef, type ReactNode } from "react";
import { ASK, type Service } from "@/content/services";
import { usePlayOnEnter } from "@/lib/usePlayOnEnter";
import Stream from "../Stream";
import { OVERLAYS } from "./hybrid/overlays";
import { PICK } from "./hybrid/cfgs";
import "./hybrid/hybrid.css";
import "./hybrid/generated.css";
import s from "./ServiceBlock.module.css";

/** One service on the page: the conversation (a "you" turn and a "codehive" turn) laid out as a floating
 *  two-column block. A 3 s play-once timeline: the question is complete from the first frame, the codehive turn
 *  comes in at 0.32–0.46, body 0.47–0.62, chips 0.63–0.72, and the action is there from the start.
 *  The visual is a hybrid figure from the Claude Design canvas: the swarm draws the structure in the empty
 *  square (`data-swarm-scene` names the figure, e.g. `s02a`), and a thin overlay of labels inside the square says
 *  what it means. The canvas has two options per service; the chosen one is `PICK` (scripts/port-hybrid.py).
 *  `wide` lays the block out as a full-width band with the copy centred beneath (the 1600 x 400 stage).
 *  `figure` puts something else in the visual column instead of the swarm's square (the /hairline lab route). */
export default function ServiceBlock({ data, flip = false, wide = false, figure }: { data: Service; flip?: boolean; wide?: boolean; figure?: ReactNode }) {
  const text = useRef<HTMLDivElement>(null);
  usePlayOnEnter(text, 3);
  const key = PICK[data.id];
  return (
    <section className={`wrap ${s.block} ${wide ? s.wide : ""}`} id={`cell-${data.id}`} aria-label={data.name} data-flip={(flip && !wide) || undefined}>
      {/* outside the text column: on phones the title leads and the figure follows it, so a figure is never read as
          the previous service's */}
      <p className={`eyebrow ${s.head}`}><span className={s.num}>{data.id}</span>{data.name}</p>
      <div ref={text} className={s.text}>
        <p className={s.who}>you</p>
        <h2 className={s.h2}><Stream text={data.question} t0={-0.1} t1={-0.02} /></h2>
        <p className={s.p}><Stream text={data.problem} t0={0.02} t1={0.24} /></p>
        <p className={`${s.who} ${s.us} anim`}>codehive</p>
        <h3 className={`${s.h3} anim`}><Stream text={data.answer} t0={0.36} t1={0.46} /></h3>
        <p className={s.p}><Stream text={data.body} t0={0.47} t1={0.62} /></p>
        <ul className={s.chips}>
          {data.chips.map((c, i) => (
            <li key={c} className="w" style={{ animationDelay: `${(0.63 + (0.09 * i) / data.chips.length).toFixed(3)}s` }}>{c}</li>
          ))}
        </ul>
        <a className="act w" style={{ animationDelay: "-.04s" }} href="#book" data-source={`cell-${data.id}`}
          onClick={() => window.dispatchEvent(new CustomEvent("codehive:book", { detail: data.name }))}>{ASK}</a>
      </div>
      <div className={s.vis}>
        {figure ?? <>
        {/* the swarm owns this element's inline opacity (it fades the overlay with its hold on the figure) and may set it
            before React hydrates this block: tell React not to compare the style attribute */}
        <div className={s.scene} data-swarm-scene={key} data-swarm-fit="width" aria-hidden="true" suppressHydrationWarning>
          <div className={`hy hy-desk hy-${key}`}>{OVERLAYS[key]}</div>
          <div className={`hy hy-phone hy-${key}p`}>{OVERLAYS[`${key}p`]}</div>
        </div>
        </>}
      </div>
    </section>
  );
}
