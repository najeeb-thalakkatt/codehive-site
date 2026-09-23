import "./viz.css";
import "./enablement.css";
import { HEX48, Badge, Tick } from "./parts";

/** Cell 05 visual, from the "05 Enablement" artboard. The one who knows leaves and the knowledge
 *  with them; Codehive lands in the middle of the team and pairs with each role until every cell is
 *  lit, then steps away while the team stays lit. Ring on the site grid at r=48 (pitch √3·48 + 6). */
const ring: [number, number, string][] = [
  [369.1, 250, "ENGINEER"], [324.55, 327.2, "OPS"], [235.45, 327.2, "RUNBOOKS"], [190.9, 250, "BOARD"], [235.45, 172.8, "PRODUCT"], [324.55, 172.8, "SUPPORT"],
];

export default function Enablement() {
  return (
    <div className="stg">
      <svg width="560" height="520" viewBox="0 0 560 520" style={{ display: "block", overflow: "visible" }} aria-hidden="true">
        {ring.map(([x, y], i) => (
          <line key={i} className="anim" style={{ animationName: `s5pl${i}` }} x1="280" y1="250" x2={x} y2={y} stroke="var(--amber)" strokeWidth="2" strokeDasharray="120" strokeDashoffset="120" />
        ))}
        {ring.map(([x, y, t], i) => (
          <g key={t} transform={`translate(${x},${y})`}>
            <polygon className="anim" style={{ animationName: `s5rs${i}` }} points={HEX48} fill="var(--bg1)" stroke="var(--line2)" strokeWidth="2" strokeDasharray="6 4" />
            <text className="anim" style={{ animationName: `s5rt${i}` }} y="4.5" fill="var(--ink3)">{t}</text>
            <Badge name={`s5rk${i}`} />
          </g>
        ))}
        <g className="anim" style={{ animationName: "s5one" }}>
          <polygon className="anim" style={{ animationName: "s5onestroke" }} points={HEX48} fill="var(--amber)" stroke="var(--amber)" strokeWidth="2" />
          <text className="anim" style={{ animationName: "s5onetext" }} fill="var(--bg0)"><tspan x="0" y="-4.5">THE ONE</tspan><tspan x="0" y="13.5">WHO KNOWS</tspan></text>
        </g>
        <g className="anim" style={{ animationName: "s5leaves" }}>
          <rect x="180" y="440" width="200" height="30" rx="6" fill="var(--bg1)" stroke="var(--line2)" strokeDasharray="4 3" />
          <text x="280" y="459.5" fill="var(--alert)">KNOWLEDGE LEAVES TOO</text>
        </g>
        <g className="anim" style={{ animationName: "s5ch" }}>
          <polygon points={HEX48} fill="var(--amber)" stroke="var(--amber)" strokeWidth="2" />
          <text y="4.5" fill="var(--bg0)">CODEHIVE</text>
        </g>
        <text className="anim" style={{ animationName: "s5pair" }} x="280" y="459.5" fill="var(--ink3)">PAIRING · TRAINING · RUNBOOKS</text>
      </svg>
      <div className="el note anim" style={{ left: 0, top: 476, width: 560, justifyContent: "center", animationName: "s5stays" }}><b>handover</b><span>the knowledge stays when we leave</span><Tick /></div>
    </div>
  );
}
