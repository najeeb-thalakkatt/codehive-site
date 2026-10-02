"use client";
import { useEffect, useRef, useState } from "react";
import { ASK, type Service } from "@/content/services";
import { usePlayOnEnter } from "@/lib/usePlayOnEnter";
import Stream from "../Stream";
import { OVERLAYS } from "./hybrid/overlays";
import { NAMES } from "./hybrid/cfgs";
import "./hybrid/hybrid.css";
import "./hybrid/generated.css";
import s from "./ServiceBlock.module.css";

type Variant = "a" | "b";
// the option shown until the founder picks: the one whose held frame reads clearest at a glance
const DEFAULT: Record<string, Variant> = { "01": "b", "02": "a", "03": "b", "04": "a", "05": "a", "06": "b" };

/** One service on /new: the compact card's conversation (Cell.tsx) laid out as a floating two-column
 *  block. Same 3 s play-once timeline: the question is complete from the first frame, the codehive turn
 *  comes in at 0.32–0.46, body 0.47–0.62, chips 0.63–0.72, and the action is there from the start.
 *  The visual is a hybrid figure from the Claude Design canvas: the swarm draws the structure in the empty
 *  square (`data-swarm-scene` names the figure, e.g. `s02a`), and a thin overlay of labels inside the square says
 *  what it means. The canvas has two options per service; while this is a lab route a small A/B switch under the
 *  figure swaps them (remembered per service), and tells the swarm to read its anchors again.
 *  `wide` lays the block out as a full-width band with the copy centred beneath (the 1600 x 400 stage). */
export default function ServiceBlock({ data, flip = false, wide = false }: { data: Service; flip?: boolean; wide?: boolean }) {
  const text = useRef<HTMLDivElement>(null);
  usePlayOnEnter(text, 3);
  const [v, setV] = useState<Variant>(DEFAULT[data.id] ?? "a");
  const store = `codehive-lab-s${data.id}`;
  useEffect(() => { try { const x = localStorage.getItem(store); if (x === "a" || x === "b") setV(x); } catch {} }, [store]);
  // after the figure's markup has changed, the swarm collects the new anchor and its overlay animations
  useEffect(() => { window.dispatchEvent(new Event("codehive:swarm-refresh")); }, [v]);
  const pick = (x: Variant) => { setV(x); try { localStorage.setItem(store, x); } catch {} };
  const key = `s${data.id}${v}`;
  return (
    <section className={`wrap ${s.block} ${wide ? s.wide : ""}`} id={`cell-${data.id}`} aria-label={data.name} data-flip={(flip && !wide) || undefined}>
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
      <div className={s.vis}>
        <div key={key} className={s.scene} data-swarm-scene={key} data-swarm-fit="width" aria-hidden="true">
          <div className={`hy hy-desk hy-${key}`}>{OVERLAYS[key]}</div>
          <div className={`hy hy-phone hy-${key}p`}>{OVERLAYS[`${key}p`]}</div>
        </div>
        <div className={s.ab} role="group" aria-label={`Lab: figure option for ${data.name}`}>
          {(["a", "b"] as const).map((x) => (
            <button key={x} type="button" className={s.abBtn} aria-pressed={v === x} onClick={() => pick(x)}>{x.toUpperCase()} · {NAMES[`s${data.id}${x}`]}</button>
          ))}
        </div>
      </div>
    </section>
  );
}
