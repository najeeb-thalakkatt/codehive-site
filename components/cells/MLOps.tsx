import "./viz.css";
import "./mlops.css";
import { HEX48, Badge, Tick } from "./parts";

/** Cell 04 visual, from the "04 Production" artboard. A notebook with no tracing, cost cap or login
 *  folds into a dev, test, prod pipeline that Terraform promotes; a JWT front door, a cost ceiling
 *  and tracing appear, and a request passes through. */
const stages: [string, number][] = [["DEV", 42], ["TEST", 192], ["PROD", 342]];

export default function MLOps() {
  return (
    <div className="stg">
      <div className="el anim s4nb" style={{ left: 0, top: 40, animationName: "s4nb" }}>
        <div className="note" style={{ color: "var(--ink1)" }}>prototype.ipynb</div>
        <div className="note" style={{ color: "var(--ink3)" }}>demo page · localhost</div>
      </div>
      <div className="el anim" style={{ left: 0, top: 128, display: "flex", gap: 8, flexWrap: "wrap", width: 260, animationName: "s4nbtrace" }}>
        <span className="tag" style={{ padding: "3px 8px" }}>no tracing</span>
        <span className="tag" style={{ padding: "3px 8px" }}>no cost cap</span>
        <span className="tag" style={{ padding: "3px 8px" }}>no login</span>
      </div>
      <svg className="el" width="560" height="520" viewBox="0 0 560 520" style={{ left: 0, top: 0, overflow: "visible" }} aria-hidden="true">
        <path className="anim" style={{ animationName: "s4ln" }} d="M138,298 L192,298 M288,298 L342,298" fill="none" stroke="var(--amber)" strokeWidth="1.5" strokeDasharray="300" strokeDashoffset="300" />
      </svg>
      {stages.map(([t, left], i) => (
        <svg key={t} className="el" width="96" height="96" viewBox="-48 -48 96 96" style={{ left, top: 250, overflow: "visible" }} aria-hidden="true">
          <polygon className="anim" style={{ animationName: `s4st${i + 1}` }} points={HEX48} fill="var(--bg1)" stroke="var(--line2)" strokeWidth="2" />
          <text y="4.5" fill="var(--ink1)">{t}</text>
          <Badge name={`s4tk${i + 1}`} />
        </svg>
      ))}
      <svg className="el anim" width="20" height="20" viewBox="-10 -10 20 20" style={{ left: 80, top: 288, overflow: "visible", animationName: "s4pk" }} aria-hidden="true">
        <polygon points="0,-10 8.7,-5 8.7,5 0,10 -8.7,5 -8.7,-5" fill="var(--amber)" />
      </svg>
      <div className="el note anim" style={{ left: 42, top: 360, animationName: "s4tf" }}><b>terraform</b><span>promotes dev → test → prod on its own</span></div>
      <div className="el box lbl anim" style={{ left: 340, top: 128, width: 100, padding: "6px 0", textAlign: "center", animationName: "s4jwt" }}>JWT</div>
      <div className="el anim" style={{ left: 384, top: 70, width: 12, height: 12, borderRadius: "50%", background: "var(--ink1)", animationName: "s4req" }} />
      <div className="el lbl" style={{ left: 402, top: 66 }}>request</div>
      <div className="el anim" style={{ left: 0, top: 410, width: 260, display: "flex", flexDirection: "column", gap: 6, animationName: "s4g1" }}>
        <div className="lbl">cost ceiling</div>
        <div className="bar" style={{ overflow: "visible", position: "relative" }}>
          <div className="anim" style={{ background: "var(--amber)", borderRadius: 4, animationName: "s4cost", animationTimingFunction: "var(--eo)" }} />
          <div style={{ position: "absolute", right: 0, top: -4, width: 2, height: 16, background: "var(--ink1)" }} />
        </div>
      </div>
      <div className="el anim" style={{ left: 300, top: 410, width: 260, display: "flex", flexDirection: "column", gap: 6, animationName: "s4g2" }}>
        <div className="lbl">trace · langfuse</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div className="anim" style={{ height: 8, borderRadius: 4, background: "var(--line2)", width: 0, animationName: "s4span1", animationTimingFunction: "var(--eo)" }} />
          <div className="anim" style={{ height: 8, borderRadius: 4, background: "var(--amber)", width: 0, marginLeft: 40, animationName: "s4span2", animationTimingFunction: "var(--eo)" }} />
        </div>
      </div>
      <div className="el note anim" style={{ left: 0, top: 470, animationName: "s4g3" }}><b>handover</b><span>a system your team can run without us</span><Tick /></div>
    </div>
  );
}
