import "./viz.css";
import "./appdev.css";
import { HEX58, Tick } from "./parts";

/** Cell 02 visual, from the "02 Applications" artboard. A customer question is typed, the assistant
 *  searches policy.pdf and Confluence (Tickets is a miss), two passages fly in, the hexagon fills
 *  amber and an answer streams out with its sources, checked against the eval set. */
const sources: [string, number, string][] = [["policy.pdf", 40, "s2hit"], ["Confluence", 150, "s2hit"], ["Tickets", 260, "s2miss"]];

export default function AppDev() {
  return (
    <div className="stg">
      <svg className="el" width="560" height="520" viewBox="0 0 560 520" style={{ left: 0, top: 0, overflow: "visible" }} aria-hidden="true">
        <path className="anim" style={{ animationName: "s2ln1" }} d="M336,190 C380,190 380,62 420,62" fill="none" stroke="var(--amber)" strokeWidth="1.5" strokeDasharray="200" strokeDashoffset="200" />
        <path className="anim" style={{ animationName: "s2ln2" }} d="M336,214 C380,214 380,172 420,172" fill="none" stroke="var(--amber)" strokeWidth="1.5" strokeDasharray="200" strokeDashoffset="200" />
        <path className="anim" style={{ animationName: "s2ln3" }} d="M336,236 C380,236 380,282 420,282" fill="none" stroke="var(--line2)" strokeWidth="1.5" strokeDasharray="200" strokeDashoffset="200" />
      </svg>
      <div className="el bub anim" style={{ left: 0, top: 40, width: 250, animationName: "s2ub" }}>
        <span className="typed anim" style={{ animationName: "s2q1", animationTimingFunction: "steps(28)" }}>Where is the refund policy</span>
        <span className="typed anim" style={{ animationName: "s2q2", animationTimingFunction: "steps(14)" }}>for EU orders?</span>
      </div>
      <div className="el lbl" style={{ left: 0, top: 122 }}>Customer</div>
      <div className="el lbl anim" style={{ left: 222, top: 292, width: 116, textAlign: "center", animationName: "s2status" }}>Searching</div>
      <svg className="el" width="116" height="116" viewBox="-58 -58 116 116" style={{ left: 222, top: 154, overflow: "visible" }} aria-hidden="true">
        <polygon className="anim" style={{ animationName: "s2hexfill" }} points={HEX58} fill="var(--bg1)" stroke="var(--amber)" strokeWidth="2" />
        <text className="anim" style={{ animationName: "s2hextext" }} y="4.5" fill="var(--ink1)">ASSISTANT</text>
      </svg>
      {sources.map(([t, top, name]) => (
        <div key={t} className="el box lbl anim" style={{ left: 420, top, width: 140, height: 44, display: "flex", alignItems: "center", padding: "0 14px", animationName: name }}>{t}</div>
      ))}
      <div className="el lbl s2chunk anim" style={{ left: 440, top: 90, animationName: "s2chunkA" }}>§4.2 Returns</div>
      <div className="el lbl s2chunk anim" style={{ left: 440, top: 200, animationName: "s2chunkB" }}>EU returns</div>
      <div className="el ans anim" style={{ left: 0, top: 330, width: 380, animationName: "s2ab" }}>
        <span className="typed anim" style={{ animationName: "s2l1", animationTimingFunction: "steps(30)" }}>EU orders can be returned within 14 days.</span>
        <span className="typed anim" style={{ animationName: "s2l2", animationTimingFunction: "steps(30)" }}>The full policy is in Returns §4.2, and the</span>
        <span className="typed anim" style={{ animationName: "s2l3", animationTimingFunction: "steps(30)" }}>return form is on the EU returns page.</span>
        <div className="anim" style={{ display: "flex", gap: 8, marginTop: 12, animationName: "s2src" }}>
          <span className="src lbl">policy.pdf · §4.2</span>
          <span className="src lbl">confluence · eu-returns</span>
        </div>
      </div>
      <div className="el note anim" style={{ left: 0, top: 470, animationName: "s2evl" }}><b>eval</b><span>cites policy.pdf §4.2 instead of guessing</span><Tick /></div>
    </div>
  );
}
