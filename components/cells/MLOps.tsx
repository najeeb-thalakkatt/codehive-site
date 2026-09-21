import "./viz.css";
import "./mlops.css";

/** Cell 04 visual. The prototype excuses drop out of frame, then a dev → test → prod → monitor
 *  pipeline draws itself, each stage turning green as it passes, and a trace log appears.
 *  Keyframes on the full 0–100% cell timeline. */
const excuses: [string, string, number, number, number][] = [
  ["s4d0", "works on my laptop", 156, 182, 110],
  ["s4d1", "no tracing", 96, 992, 120],
  ["s4d2", "streamlit demo, one user", 202, 79, 610],
  ["s4d3", "prompt injection", 141, 1050, 640],
  ["s4d4", "who pays for tokens?", 172, 614, 80],
];
const stages = ["dev", "test", "prod", "monitor"];
const HEX = "0,-44 38,-22 38,22 0,44 -38,22 -38,-22";

export default function MLOps() {
  return (
    <>
      {excuses.map(([name, text, width, left, top]) => (
        <div key={name} className="card anim" style={{ animationName: name, width, left, top }}>{text}</div>
      ))}
      <svg className="vizSvg" viewBox="0 0 1280 800" aria-hidden="true">
        <path className="anim" style={{ animationName: "s4wire" }} d="M 758 400 L 812 400 M 888 400 L 942 400 M 1018 400 L 1072 400" stroke="var(--amber)" strokeWidth="2" strokeDasharray="420" fill="none" />
      </svg>
      {stages.map((label, i) => (
        <svg key={label} className="hx anim" style={{ left: 660 + 130 * i, top: 340, animationName: `s4n${i}` }} width="120" height="120" viewBox="-60 -60 120 120" aria-hidden="true">
          <polygon className="anim" style={{ animationName: `s4g${i}` }} points={HEX} fill="var(--bg1)" strokeWidth="2" />
          <text y="4" fill="var(--ink1)">{label}</text>
          <circle className="anim" style={{ animationName: `s4o${i}` }} cx="24" cy="-30" r="4" fill="var(--ok)" />
        </svg>
      ))}
      <div className="mono log anim" style={{ animationName: "s4log" }}>
        trace  POST /v1/assist  · 214 ms · 1,120 tokens · cost within daily cap<br />
        guard  injection check passed · pii redacted · auth jwt ok<br />
        deploy terraform plan: 0 to add, 0 to change · prod = test
      </div>
    </>
  );
}
