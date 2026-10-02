import { BOOK } from "@/content/services";
import s from "./NewHero.module.css";
import v from "./v4.module.css";

/** Hero: oversized weight-400 headline, one amber pill, one text action; the swarm assembles the
 *  logo cell in the right column. Copy is the live hero's, unchanged. */
export default function NewHero() {
  return (
    <section id="top" className={`wrap ${s.hero}`} data-swarm-hero aria-labelledby="hero-title">
      <div className={s.copy}>
        <p className="eyebrow" style={{ margin: 0 }}>AI engineering as a service</p>
        <h1 id="hero-title" className={s.h1}>Ship the AI feature.</h1>
        <p className={s.sub}>Backend engineering for teams adding LLM features without an ML team.</p>
        <div className={s.actions}>
          <a className={v.pill} href="#book">{BOOK}</a>
          <a className="act" href="#services">See the services</a>
        </div>
      </div>
      <div className={s.target} data-swarm-scene="cell" aria-hidden="true" />
    </section>
  );
}
