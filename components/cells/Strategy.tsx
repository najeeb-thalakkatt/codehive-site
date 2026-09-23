import "./viz.css";
import "./strategy.css";
import { Fragment, type CSSProperties } from "react";
import { HEX58, Lines, Tick } from "./parts";

/** Cell 01 visual, from the "01 Strategy" artboard of the service animations canvas.
 *  Three scattered pilots and the red trace between them collapse into one amber core, five
 *  strategy cells assemble around it, then the roadmap steps tick in below.
 *  The ring sits on the site's hex grid: pointy-top r=58 with a 6px gap, neighbours at (±106, 0) and (±53, ±92). */
const frags: [string, string, string, string[]][] = [
  ["104px", "110px", "-7deg", ["CHATBOT", "PILOT"]],
  ["440px", "130px", "5deg", ["VENDOR", "DEMO #4"]],
  ["300px", "380px", "-4deg", ["BOARD DECK:", "BEHIND?"]],
];
const cells: [string, string, string, string, string, string[]][] = [
  ["s1c1", "227px", "128px", "196px", "74px", ["STRATEGY"]],
  ["s1c2", "333px", "128px", "364px", "74px", ["BUILD VS", "BUY"]],
  ["s1c3", "386px", "220px", "448px", "220px", ["RISK"]],
  ["s1c4", "227px", "312px", "196px", "366px", ["ROADMAP"]],
  ["s1c5", "174px", "220px", "112px", "220px", ["BOARD", "BRIEFINGS"]],
];

export default function Strategy() {
  return (
    <div className="stg">
      <svg width="560" height="440" viewBox="0 0 560 440" style={{ display: "block", overflow: "visible" }} aria-hidden="true">
        <polyline className="anim" style={{ animationName: "s1trace" }} points="104,110 280,220 440,130 300,380 104,110" fill="none" stroke="var(--alert)" strokeWidth="1.5" strokeDasharray="6 6" strokeLinejoin="round" />
        {frags.map(([fx, fy, fr, lines]) => (
          <g key={fx + fy} className="anim" style={{ "--fx": fx, "--fy": fy, "--fr": fr, animationName: "s1frag" } as CSSProperties}>
            <polygon points={HEX58} fill="none" stroke="var(--line2)" strokeWidth="2" strokeDasharray="6 4" />
            <Lines lines={lines} fill="var(--ink3)" />
          </g>
        ))}
        <g className="anim" style={{ animationName: "s1chip" }}>
          <rect x="140" y="205" width="280" height="30" rx="6" fill="var(--bg1)" stroke="var(--line2)" strokeDasharray="4 3" />
          <text x="280" y="224.5" fill="var(--ink3)">THREE PILOTS, ONE BUDGET LINE</text>
        </g>
        {cells.map(([name, cx, cy, ox, oy, lines]) => (
          <g key={name} className="anim" style={{ "--cx": cx, "--cy": cy, "--ox": ox, "--oy": oy, animationName: name } as CSSProperties}>
            <polygon points={HEX58} fill="var(--bg1)" stroke="var(--amber)" strokeWidth="2" />
            <Lines lines={lines} fill="var(--ink1)" />
          </g>
        ))}
        <g className="anim" style={{ animationName: "s1core" }}>
          <polygon points={HEX58} fill="var(--amber)" />
          <Lines lines={["A PLAN THE", "BOARD CAN", "FUND"]} fill="var(--bg0)" />
        </g>
      </svg>
      <div className="el" style={{ left: 0, top: 452, width: 560, display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
        <div className="lbl">Roadmap · in the order it has to happen</div>
        <div className="note" style={{ gap: 24 }}>
          {["data", "people", "the change"].map((t, i) => (
            <Fragment key={t}>
              {i > 0 && <span style={{ color: "var(--line2)" }}>→</span>}
              <span className="note anim" style={{ animationName: `s1s${i + 1}` }}><b>0{i + 1}</b><span>{t}</span><Tick /></span>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
