import s from "./Hero.module.css";
const HEX = "0,-58 50,-29 50,29 0,58 -50,29 -50,-29";
const cells: [number, number, string, "solid" | "line" | "dash", number][] = [
  [280, 280, "prod", "solid", .9], [280, 164, "RAG", "line", .3], [380, 222, "agents", "line", .45], [380, 338, "evals", "line", .6],
  [280, 396, "", "dash", .1], [180, 338, "", "dash", .2], [180, 222, "API", "line", .75],
];
export default function Hero() {
  return (
    <section className={s.hero} id="top">
      <div className={`wrap ${s.grid}`}>
        <div>
          <div className="eyebrow">AI engineering as a service · Stockholm</div>
          <h1>Ship the <span style={{ color: "var(--amber)" }}>AI feature.</span></h1>
          <p>Backend engineering for teams adding LLM features without an ML team. Based in Stockholm, working with companies across Europe, the UK and the US.</p>
          <div className={s.cta}><a className="act" href="#contact">Start a project</a><a className="act ghost" href="#services">See the services</a></div>
          <div className="mono" style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", fontSize: 13, color: "var(--ink3)" }}>
            <span>Senior backend engineers only</span><span>·</span><span>Python, Go</span><span>·</span><span>AWS, GCP, Azure</span>
          </div>
        </div>
        <div className={s.hint} aria-hidden="true">SCROLL<i /></div>
        <div className={s.viz}>
          <svg viewBox="0 0 560 560" width="100%" height="100%" aria-hidden="true">
            {cells.map(([x, y, l, st, d]) => (
              <g key={`${x}${y}`} transform={`translate(${x},${y})`}>
                <g className={s.h} style={{ animationDelay: `${d}s` }}>
                  {st === "solid" ? <><polygon points={HEX} fill="var(--amber)" /><text y="4" fill="var(--bg0)">{l}</text></>
                    : st === "line" ? <><polygon points={HEX} fill="var(--bg1)" stroke="var(--amber)" strokeWidth="2" /><text y="4" fill="var(--ink1)">{l}</text></>
                    : <polygon points={HEX} fill="none" stroke="var(--line2)" strokeWidth="2" strokeDasharray="6 5" />}
                </g>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
