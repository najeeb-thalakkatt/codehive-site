import "./viz.css";
import "./appdev.css";

/** Cell 02 visual. Six loose tickets fly in and stack into one thread; the grounded reply
 *  lands in amber with its source line under it. Keyframes on the full 0–100% cell timeline. */
const tickets: [string, string, number][] = [
  ["s2b0", "how do I reset the API key?", 225],
  ["s2b1", "is the invoice VAT inclusive?", 240],
  ["s2b2", "same question as ticket #4411", 240],
  ["s2b3", "where is the SLA document?", 217],
  ["s2b4", "copy-paste into ChatGPT again", 240],
  ["s2b5", "the intern's chatbot demo", 210],
];

export default function AppDev() {
  return (
    <>
      {tickets.map(([name, text, width]) => (
        <div key={name} className="card anim" style={{ animationName: name, width, borderRadius: "12px 12px 12px 4px" }}>{text}</div>
      ))}
      <div className="reply anim" style={{ animationName: "s2reply" }}>Reset keys under Settings, API. Admin role required. Your last reset was 14 days ago.</div>
      <div className="mono anim" style={{ animationName: "s2cite", position: "absolute", left: 860, top: 598, fontSize: 11, color: "var(--ink3)" }}>source: handbook.pdf, p.12 · confidence high · handed to human: no</div>
    </>
  );
}
