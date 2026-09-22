import "./viz.css";
import "./strategy.css";

/** Cell 01 visual. Loose problem cards fly in and become a hive. Keyframes are authored on the full
 *  0–100% cell timeline; Cell.tsx compresses them into the last 58% via .viz .anim.
 *
 *  Hex geometry: pointy-top, r = 58, tessellated with a 6px gap. Centre-to-centre distance is
 *  √3·r + gap ≈ 106, so the six neighbours sit at (±106, 0) and (±53, ±92) from the centre (900, 400).
 *  `left`/`top` are the 120×120 svg's corner, i.e. centre − 60. */
const HEX = "0,-58 50,-29 50,29 0,58 -50,29 -50,-29";
const ring: { name: string; left: number; top: number; label: string | [string, string] }[] = [
  { name: "s1h1", left: 787, top: 248, label: ["brief the", "board"] },   // NW
  { name: "s1h2", left: 893, top: 248, label: "build vs buy" },          // NE
  { name: "s1h3", left: 946, top: 340, label: "roadmap" },               // E
  { name: "s1h4", left: 893, top: 432, label: ["data", "readiness"] },   // SE
  { name: "s1h5", left: 787, top: 432, label: "risks" },                 // SW
  { name: "s1h6", left: 734, top: 340, label: ["business", "case"] },    // W
];
const cards: [string, string][] = [
  ["s1c0", "chatbot pilot · marketing"], ["s1c1", "vendor demo #4"], ["s1c2", "board deck: are we behind?"],
  ["s1c3", "GPT wrapper or own model?"], ["s1c4", "no data owner"], ["s1c5", "EU AI Act?"], ["s1c6", "three pilots, one budget line"],
];

export default function Strategy() {
  return (
    <>
      <svg className="vizSvg" viewBox="0 0 1280 800" aria-hidden="true">
        <path className="anim" style={{ animationName: "trace" }} d="M 240 660 C 400 600, 520 470, 470 445" stroke="var(--alert)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
      </svg>
      {cards.map(([name, text]) => (
        <div key={name} className="card anim" style={{ animationName: name }}>{text}</div>
      ))}
      <svg className="hx anim" style={{ left: 840, top: 340, animationName: "s1h0" }} width="120" height="120" viewBox="-60 -60 120 120" aria-hidden="true">
        <polygon points={HEX} fill="var(--amber)" /><text y="4" fill="var(--bg0)">assess</text>
      </svg>
      {ring.map((h) => (
        <svg key={h.name} className="hx anim" style={{ left: h.left, top: h.top, animationName: h.name }} width="120" height="120" viewBox="-60 -60 120 120" aria-hidden="true">
          <polygon points={HEX} fill="var(--bg1)" stroke="var(--amber)" strokeWidth="2" />
          {typeof h.label === "string"
            ? <text y="4" fill="var(--ink1)">{h.label}</text>
            : <><text y="-3" fill="var(--ink1)">{h.label[0]}</text><text y="11" fill="var(--ink1)">{h.label[1]}</text></>}
        </svg>
      ))}
      <svg className="anim" style={{ animationName: "tick", position: "absolute", left: 974, top: 261 }} width="26" height="26" viewBox="-13 -13 26 26" aria-hidden="true">
        <circle r="11" fill="var(--bg0)" stroke="var(--ok)" strokeWidth="2" />
        <path d="M -5 0 L -1.5 3.5 L 5 -4" stroke="var(--ok)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </>
  );
}
