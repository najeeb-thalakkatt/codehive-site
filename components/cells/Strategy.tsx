import "./viz.css";
import "./strategy.css";

/** Cell 01 visual. Keyframes are authored on the full 0–100% cell timeline; Cell.tsx
 *  compresses them into the second half of the scroll via .viz .anim. */
export default function Strategy() {
  return (
    <>
      <svg className="vizSvg" viewBox="0 0 1280 800" aria-hidden="true">
        <path className="anim" style={{ animationName: "trace" }} d="M 240 660 C 400 600, 520 470, 470 445" stroke="var(--alert)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
      </svg>
      <div className="card anim" style={{ animationName: "s1c0", width: 210 }}>chatbot pilot · marketing</div>
      <div className="card anim" style={{ animationName: "s1c1", width: 126 }}>vendor demo #4</div>
      <div className="card anim" style={{ animationName: "s1c2", width: 217 }}>board deck: are we behind?</div>
      <div className="card anim" style={{ animationName: "s1c3", width: 210 }}>GPT wrapper or own model?</div>
      <div className="card anim" style={{ animationName: "s1c4", width: 118 }}>no data owner</div>
      <div className="card anim" style={{ animationName: "s1c5", width: 96 }}>EU AI Act?</div>
      <div className="card anim" style={{ animationName: "s1c6", width: 240 }}>three pilots, one budget line</div>
      <svg className="hx anim" style={{ left: 840, top: 340, animationName: "s1h0" }} width="120" height="120" viewBox="-60 -60 120 120" aria-hidden="true"><polygon points="0,-58 50,-29 50,29 0,58 -50,29 -50,-29" fill="var(--amber)" /><text y="4" fill="var(--bg0)">assess</text></svg>
      <svg className="hx anim" style={{ left: 840, top: 224, animationName: "s1h1" }} width="120" height="120" viewBox="-60 -60 120 120" aria-hidden="true"><polygon points="0,-58 50,-29 50,29 0,58 -50,29 -50,-29" fill="var(--bg1)" stroke="var(--amber)" strokeWidth="2" /><text y="4" fill="var(--ink1)">brief the board</text></svg>
      <svg className="hx anim" style={{ left: 940, top: 282, animationName: "s1h2" }} width="120" height="120" viewBox="-60 -60 120 120" aria-hidden="true"><polygon points="0,-58 50,-29 50,29 0,58 -50,29 -50,-29" fill="var(--bg1)" stroke="var(--amber)" strokeWidth="2" /><text y="4" fill="var(--ink1)">build vs buy</text></svg>
      <svg className="hx anim" style={{ left: 940, top: 398, animationName: "s1h3" }} width="120" height="120" viewBox="-60 -60 120 120" aria-hidden="true"><polygon points="0,-58 50,-29 50,29 0,58 -50,29 -50,-29" fill="var(--bg1)" stroke="var(--amber)" strokeWidth="2" /><text y="4" fill="var(--ink1)">roadmap</text></svg>
      <svg className="hx anim" style={{ left: 840, top: 456, animationName: "s1h4" }} width="120" height="120" viewBox="-60 -60 120 120" aria-hidden="true"><polygon points="0,-58 50,-29 50,29 0,58 -50,29 -50,-29" fill="var(--bg1)" stroke="var(--amber)" strokeWidth="2" /><text y="4" fill="var(--ink1)">data readiness</text></svg>
      <svg className="hx anim" style={{ left: 740, top: 398, animationName: "s1h5" }} width="120" height="120" viewBox="-60 -60 120 120" aria-hidden="true"><polygon points="0,-58 50,-29 50,29 0,58 -50,29 -50,-29" fill="var(--bg1)" stroke="var(--amber)" strokeWidth="2" /><text y="4" fill="var(--ink1)">risks</text></svg>
      <svg className="hx anim" style={{ left: 740, top: 282, animationName: "s1h6" }} width="120" height="120" viewBox="-60 -60 120 120" aria-hidden="true"><polygon points="0,-58 50,-29 50,29 0,58 -50,29 -50,-29" fill="var(--bg1)" stroke="var(--amber)" strokeWidth="2" /><text y="4" fill="var(--ink1)">business case</text></svg>
      <svg className="anim" style={{ animationName: "tick", position: "absolute", left: 936, top: 350 }} width="26" height="26" viewBox="-13 -13 26 26" aria-hidden="true">
        <circle r="11" fill="var(--bg0)" stroke="var(--ok)" strokeWidth="2" />
        <path d="M -5 0 L -1.5 3.5 L 5 -4" stroke="var(--ok)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </>
  );
}
