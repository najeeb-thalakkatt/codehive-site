"use client";
import { useRef } from "react";
import { ASK, type Service } from "@/content/services";
import { usePlayOnEnter } from "@/lib/usePlayOnEnter";
import Stream from "../Stream";
import s from "./ServiceBlock.module.css";

/** One service on /new: the compact card's conversation (Cell.tsx) laid out as a floating two-column
 *  block. Same 3 s play-once timeline: the question is complete from the first frame, the codehive turn
 *  comes in at 0.32–0.46, body 0.47–0.62, chips 0.63–0.72, and the action is there from the start.
 *  The visual column is empty space the swarm fills: `data-swarm-scene` names the formation
 *  (components/new/scenes.ts, keyed like `animation` in content/services.ts). */
export default function ServiceBlock({ data, flip = false }: { data: Service; flip?: boolean }) {
  const text = useRef<HTMLDivElement>(null);
  usePlayOnEnter(text, 3);
  return (
    <section className={`wrap ${s.block}`} id={`cell-${data.id}`} aria-label={data.name} data-flip={flip || undefined}>
      <div ref={text} className={s.text}>
        <p className={`eyebrow ${s.head}`}><span className={s.num}>{data.id}</span>{data.name}</p>
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
      <div className={s.scene} data-swarm-scene={data.animation} aria-hidden="true" />
    </section>
  );
}
