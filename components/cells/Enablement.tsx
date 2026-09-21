import "./viz.css";
import "./enablement.css";

/** Cell 05 visual. Four fears fade out. One amber cell, "the one who knows", sits in the middle;
 *  the knowledge ripples outward: a first ring of named teams lights up, then a second ring.
 *  Keyframes on the full 0–100% cell timeline. */
const fears: [string, number, number, number, number][] = [
  ["vendor left, took the notes", 225, 128, 100, -8],
  ["two people know how it works", 232, 944, 110, 6],
  ["new hire, no docs", 149, 126, 630, 5],
  ["board reads about AI in the news", 263, 889, 660, -7],
];
const ring1: [number, number, string][] = [
  [840, 224, "eng"], [940, 282, "product"], [940, 398, "ops"], [840, 456, "support"], [740, 398, "sales"], [740, 282, "board"],
];
const ring2: [number, number][] = [
  [840, 108], [940, 166], [1040, 224], [1040, 340], [1040, 456], [940, 514], [840, 572], [740, 514], [640, 456], [640, 340], [640, 224], [740, 166],
];
const HEX = "0,-58 50,-29 50,29 0,58 -50,29 -50,-29";

export default function Enablement() {
  return (
    <>
      {fears.map(([text, width, left, top, rot]) => (
        <div key={text} className="card anim" style={{ animationName: "fadeout", width, left, top, transform: `rotate(${rot}deg)` }}>{text}</div>
      ))}
      <svg className="hx" style={{ left: 840, top: 340 }} width="120" height="120" viewBox="-60 -60 120 120" aria-hidden="true">
        <polygon points={HEX} fill="var(--amber)" />
        <text y="-2" fill="var(--bg0)" fontSize="11">the one</text>
        <text y="12" fill="var(--bg0)" fontSize="11">who knows</text>
      </svg>
      {ring1.map(([left, top, label], i) => (
        <svg key={label} className="hx" style={{ left, top }} width="120" height="120" viewBox="-60 -60 120 120" aria-hidden="true">
          <polygon className="anim" style={{ animationName: `s5r${i}` }} points={HEX} strokeWidth="2" />
          <text className="anim" style={{ animationName: `s5t${i}` }} y="4" fill="var(--ink1)">{label}</text>
        </svg>
      ))}
      {ring2.map(([left, top], i) => (
        <svg key={`${left}-${top}`} className="hx" style={{ left, top }} width="120" height="120" viewBox="-60 -60 120 120" aria-hidden="true">
          <polygon className="anim" style={{ animationName: `s5r${i + 6}` }} points={HEX} strokeWidth="2" />
        </svg>
      ))}
    </>
  );
}
