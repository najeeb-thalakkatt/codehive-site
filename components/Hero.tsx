import s from "./Hero.module.css";
import { SERVICES } from "@/content/services";
const HEX = "0,-58 50,-29 50,29 0,58 -50,29 -50,-29";
// One tile per service, on the site grid: pointy-top r=58 hexes with a 6px gap, neighbours at (±106, 0)
// and (±53, ±92) from the centre. The centre is cell 04 (live in production); the ring runs clockwise
// from the north-west in cell order 01, 02, 03, then 05, 06; the south-east slot stays a ghost.
const tiles: [number, number, string, string, number][] = [
  [280, 280, "live", "04", .9], [227, 188, "plan", "01", .3], [333, 188, "agents", "02", .45], [386, 280, "models", "03", .6],
  [227, 372, "handover", "05", .2], [174, 280, "API", "06", .75],
];
const ghost: [number, number, number] = [333, 372, .1];
const nameOf = (id: string) => SERVICES.find((c) => c.id === id)?.name ?? id;

export default function Hero() {
  return (
    <section className={s.hero} id="top">
      <div className={`wrap ${s.grid}`}>
        <div>
          <div className="eyebrow">AI engineering as a service · Stockholm</div>
          <h1>Ship the <span style={{ color: "var(--amber)" }}>AI feature.</span></h1>
          <p>Backend engineering for teams adding LLM features without an ML team. Based in Stockholm, remote across Europe, the UK and the US.</p>
          <div className={s.cta}><a className="act" href="#book">Book a call</a><a className="act ghost" href="#services">See the services</a></div>
        </div>
        <div className={s.hint} aria-hidden="true">SCROLL<i /></div>
        <div className={s.viz}>
          <svg viewBox="0 0 560 560" width="100%" height="100%" role="group" aria-label="The six services">
            {tiles.map(([x, y, l, id, d]) => (
              <a key={id} href={`#cell-${id}`} className={s.tile} aria-label={`${id} ${nameOf(id)}`}>
                <title>{`${id} ${nameOf(id)}`}</title>
                <g transform={`translate(${x},${y})`}>
                  <g className={s.h} style={{ animationDelay: `${d}s` }}>
                    {id === "04"
                      ? <><polygon points={HEX} fill="var(--amber)" /><text y="4" fill="var(--bg0)">{l}</text></>
                      : <><polygon points={HEX} fill="var(--bg1)" stroke="var(--amber)" strokeWidth="2" /><text y="4" fill="var(--ink1)">{l}</text></>}
                  </g>
                </g>
              </a>
            ))}
            <g transform={`translate(${ghost[0]},${ghost[1]})`} aria-hidden="true">
              <g className={s.h} style={{ animationDelay: `${ghost[2]}s` }}>
                <polygon points={HEX} fill="none" stroke="var(--line2)" strokeWidth="2" strokeDasharray="6 5" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
