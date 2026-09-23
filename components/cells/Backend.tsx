import "./viz.css";
import "./backend.css";
import { HEX58, Lines, Tick } from "./parts";

/** Cell 06 visual, from the "06 Plain backend" artboard. The brief says add AI; the actual problems
 *  list themselves; the model cell is marked not needed and an amber API cell takes its place; the
 *  answer streams: one API, one job, zero tokens. */
const problems = ["the monthly export takes a week", "sync fails on Sundays", "CRM and ERP don't talk"];

export default function Backend() {
  return (
    <div className="stg">
      <div className="el bub anim" style={{ left: 0, top: 40, width: 250, animationName: "s6ub" }}>
        <span className="typed anim" style={{ animationName: "s6q1", animationTimingFunction: "steps(22)" }}>add AI to the reports</span>
      </div>
      <div className="el lbl" style={{ left: 0, top: 96 }}>The brief</div>
      <div className="el lbl anim" style={{ left: 0, top: 132, animationName: "s6actual" }}>The actual problem</div>
      {problems.map((t, i) => <div key={t} className="el tag anim" style={{ left: 0, top: 156 + 36 * i, animationName: `s6pb${i + 1}` }}>{t}</div>)}
      <svg className="el anim" width="116" height="116" viewBox="-58 -58 116 116" style={{ left: 400, top: 60, overflow: "visible", animationName: "s6model" }} aria-hidden="true">
        <polygon points={HEX58} fill="none" stroke="var(--line2)" strokeWidth="2" strokeDasharray="6 4" />
        <Lines lines={["MODEL BILL", "PER MONTH"]} fill="var(--ink3)" />
      </svg>
      <div className="el lbl anim" style={{ left: 402, top: 184, width: 112, textAlign: "center", color: "var(--alert)", animationName: "s6notneeded" }}>not needed</div>
      <svg className="el anim" width="116" height="116" viewBox="-58 -58 116 116" style={{ left: 400, top: 60, overflow: "visible", animationName: "s6api" }} aria-hidden="true">
        <polygon points={HEX58} fill="var(--amber)" stroke="var(--amber)" strokeWidth="2" />
        <Lines lines={["ONE API", "ONE JOB"]} fill="var(--bg0)" />
      </svg>
      <div className="el ans anim" style={{ left: 0, top: 300, width: 500, fontFamily: "var(--font-mono)", fontSize: 14, lineHeight: 1.6, animationName: "s6ab" }}>
        <span className="typed anim" style={{ animationName: "s6l1", animationTimingFunction: "steps(30)" }}>one API · one job · zero tokens</span>
        <span className="typed anim" style={{ color: "var(--ink2)", animationName: "s6l2", animationTimingFunction: "steps(54)" }}>runs nightly · 40 s · cost: the server you already have</span>
      </div>
      <div className="el note anim" style={{ left: 0, top: 400, animationName: "s6say" }}><b>verdict</b><span>we say so before you pay for a model you do not need</span><Tick /></div>
    </div>
  );
}
