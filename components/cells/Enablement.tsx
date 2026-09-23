import "./viz.css";
import "./enablement.css";

/** Cell 05 visual. Four fears fade out. One amber cell, "the one who knows", sits in the middle;
 *  the knowledge ripples outward: a first ring of named teams lights up, then a second ring.
 *  Keyframes on the full 0–100% cell timeline. */
const fears: [string, number, number, number][] = [
  ["vendor left, took the notes", 128, 100, -8],
  ["two people know how it works", 944, 110, 6],
  ["new hire, no docs", 126, 630, 5],
  ["board reads about AI in the news", 889, 660, -7],
];
// Pointy-top r=58 hexes tessellated with a 6px gap around the centre (900,376), raised 24px so the bottom ring clears the desktop crop: ring 1 at (±106,0) and
// (±53,±92), ring 2 at (±212,0), (±159,±92), (±106,±184), (0,±184). left/top = centre − 60. Both rings
// are listed clockwise from the top so the ripple keyframes (s5r0.., s5r6..) keep their order.
const ring1: [number, number, string][] = [
  [787, 224, "eng"], [893, 224, "product"], [946, 316, "ops"], [893, 408, "support"], [787, 408, "sales"], [734, 316, "board"],
];
const ring2: [number, number][] = [
  [840, 132], [946, 132], [999, 224], [1052, 316], [999, 408], [946, 500], [840, 500], [734, 500], [681, 408], [628, 316], [681, 224], [734, 132],
];
const HEX = "0,-58 50,-29 50,29 0,58 -50,29 -50,-29";

export default function Enablement() {
  return (
    <>
      {fears.map(([text, left, top, rot]) => (
        <div key={text} className="card anim" style={{ animationName: "fadeout", left, top, transform: `rotate(${rot}deg)` }}>{text}</div>
      ))}
      <svg className="hx" style={{ left: 840, top: 316 }} width="120" height="120" viewBox="-60 -60 120 120" aria-hidden="true">
        <polygon points={HEX} fill="var(--amber)" />
        <text y="-3" fill="var(--bg0)">the one</text>
        <text y="11" fill="var(--bg0)">who knows</text>
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
