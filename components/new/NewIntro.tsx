import { SERVICES } from "@/content/services";
import s from "./NewIntro.module.css";

// where each hive sits in the field, in % of its width and height: a loose diagonal scatter, labels to the right
const SPOTS = [[2, 2], [36, 17], [4, 38], [42, 52], [10, 72], [50, 82]];

/** The services index on /new, after the reference's investor section: six small hives scattered on the left, each
 *  with its number and name (a link to its service), the headline on the right. The hives are drawn by the swarm:
 *  every `[data-swarm-scene="hive"]` square belongs to the `services` group, so the canvas deals a few dozen
 *  particles to each and they form a cell there. Each item is `[data-bee]`: the swarm moves the hive on a bee's
 *  wandering path and moves this element (the label with it) by the same offset, so the two never part. Reduced
 *  motion and "Pause motion" leave everything where the layout put it. */
export default function NewIntro() {
  return (
    <section id="services" className={`wrap ${s.intro}`} aria-labelledby="services-title">
      <nav aria-label="Six services" className={s.field}>
        {SERVICES.map((c, i) => (
          // the swarm writes a transform on this element (the bee wander), possibly before hydration
          <a key={c.id} href={`#cell-${c.id}`} className={s.item} data-bee suppressHydrationWarning style={{ left: `${SPOTS[i][0]}%`, top: `${SPOTS[i][1]}%` }}>
            <span className={s.hive} data-swarm-scene="hive" data-swarm-group="services" aria-hidden="true" />
            <span className={s.label}><span className={s.num}>{c.id}</span><span className={s.name}>{c.name}</span></span>
          </a>
        ))}
      </nav>
      <div className={s.text}>
        <h2 id="services-title" className={s.h2}>Six things we do.</h2>
        <p className={s.sub}>Each one starts with what is broken.</p>
      </div>
    </section>
  );
}
