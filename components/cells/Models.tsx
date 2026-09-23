import "./viz.css";
import "./models.css";
import { Tick } from "./parts";

/** Cell 03 visual, from the "03 Model work" artboard. Your eval set feeds three candidates, bars
 *  fill on the same cases, the open model moves into your EU infrastructure, is deployed, then
 *  fine-tuned and its bar goes amber. Model names are generic on purpose. */
const flows = ["M150,110 C180,110 180,80 200,80", "M150,110 C230,110 260,80 330,80", "M150,110 C300,110 360,80 460,80"];

function Card({ name, left, title, bar }: { name: string; left: number; title: string; bar: string }) {
  return (
    <div className="el anim s3card" style={{ left, animationName: name }}>
      <div className="lbl" style={{ color: "var(--ink1)" }}>{title}</div>
      <div className="bar"><div className="anim" style={{ animationName: bar, animationTimingFunction: "var(--eo)" }} /></div>
      <div className="lbl">on your eval</div>
    </div>
  );
}

export default function Models() {
  return (
    <div className="stg">
      <svg className="el" width="560" height="520" viewBox="0 0 560 520" style={{ left: 0, top: 0, overflow: "visible" }} aria-hidden="true">
        {flows.map((d, i) => <path key={d} className="anim" style={{ animationName: `s3flow${i + 1}` }} d={d} fill="none" stroke="var(--amber)" strokeWidth="1.5" strokeDasharray="260" strokeDashoffset="260" />)}
      </svg>
      <div className="el anim" style={{ left: 0, top: 60, width: 150, height: 100, animationName: "s3stack" }}>
        <div className="el s3sheet" style={{ left: 16, top: 0 }} />
        <div className="el s3sheet" style={{ left: 8, top: 10 }} />
        <div className="el s3sheet s3front" style={{ left: 0, top: 20 }}>
          <div className="lbl" style={{ color: "var(--ink1)" }}>Your eval set</div>
          <div className="lbl">same cases</div>
        </div>
      </div>
      <div className="el tag anim" style={{ left: 0, top: 168, animationName: "s3eutag" }}>must not leave the EU</div>
      <div className="el tag anim" style={{ left: 0, top: 168, borderStyle: "solid", borderColor: "var(--ok)", color: "var(--ok)", display: "flex", gap: 6, alignItems: "center", animationName: "s3oktag" }}>stays in the EU <Tick /></div>
      <Card name="s3card1" left={200} title="Frontier A" bar="s3bar1" />
      <Card name="s3card2" left={330} title="Frontier B" bar="s3bar2" />
      <Card name="s3card3" left={460} title="Open model" bar="s3bar3" />
      <div className="el note anim" style={{ left: 200, top: 150, animationName: "s3measured" }}><b>benchmark</b><span>the same cases for every model</span></div>
      <div className="el anim" style={{ left: 0, top: 240, width: 560, height: 250, border: "1px dashed var(--line2)", borderRadius: 20, animationName: "s3eubox" }}>
        <div className="el lbl" style={{ left: 20, top: 16 }}>Your infrastructure · EU</div>
        <div className="el lbl" style={{ left: 20, top: 40 }}>open weights · private inference</div>
      </div>
      <div className="el note anim" style={{ left: 420, top: 300, animationName: "s3deployed" }}><b>deployed</b><Tick /></div>
      <div className="el anim" style={{ left: 420, top: 340, width: 130, display: "flex", flexDirection: "column", gap: 4, animationName: "s3fttag" }}>
        <div className="note"><b>fine-tuned</b><Tick /></div>
        <div className="note" style={{ display: "block", whiteSpace: "normal", lineHeight: 1.5, color: "var(--ink3)" }}>QLoRA · your curated dataset</div>
      </div>
    </div>
  );
}
