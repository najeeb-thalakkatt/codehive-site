import Booking from "../Booking";
import s from "./NewContact.module.css";

export default function NewContact() {
  return (
    <section id="contact" className={`wrap ${s.contact}`}>
      <div className={s.copy}>
        <h2 className={s.h2}>Tell us what is stuck.</h2>
        <p className={s.p}>A thirty-minute call, no deck. If it is not a fit we will say so and point you somewhere better.</p>
      </div>
      {/* the bookend: the swarm that opened the page forms the cell again beside the last headline */}
      <div className={s.scene} data-swarm-scene="cell" aria-hidden="true" />
      <div className={s.booking}><Booking /></div>
    </section>
  );
}
