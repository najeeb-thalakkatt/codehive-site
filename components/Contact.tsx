import s from "./Contact.module.css";
import Booking from "./Booking";

const HEX = "0,-58 50,-29 50,29 0,58 -50,29 -50,-29";
// pointy-top r=58 hexes tessellated with a 6px gap: neighbours at (±106, 0) and (±53, ±92)
const cells: [number, number, "solid" | "line" | "dash"][] = [
  [280, 280, "solid"], [227, 188, "line"], [333, 188, "line"], [174, 280, "line"], [386, 280, "dash"], [333, 372, "dash"], [227, 372, "dash"],
];

export default function Contact() {
  return (
    <section id="contact" className={`wrap reveal ${s.contact}`}>
      <div>
        <div className="eyebrow">Contact</div>
        <h2 className={s.h2}>Tell us what is stuck.</h2>
        <p className={s.p}>A thirty-minute call, no deck. If it is not a fit we will say so and point you somewhere better.</p>
      </div>
      <svg className={s.hive} viewBox="110 124 340 312" aria-hidden="true">
        {cells.map(([x, y, st]) => (
          <g key={`${x}${y}`} transform={`translate(${x},${y})`}>
            {st === "solid" ? <polygon points={HEX} fill="var(--amber)" />
              : st === "line" ? <polygon points={HEX} fill="var(--bg1)" stroke="var(--amber)" strokeWidth="2" />
              : <polygon points={HEX} fill="none" stroke="var(--line2)" strokeWidth="2" strokeDasharray="6 5" />}
          </g>
        ))}
      </svg>
      <div className={s.booking}><Booking /></div>
    </section>
  );
}
