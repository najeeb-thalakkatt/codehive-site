"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { SERVICES } from "@/content/services";
import { motionOff, onMotionChange } from "@/lib/motion";
import s from "./NewIntro.module.css";

// the hero's liquid-metal cell, six times small: loaded after hydration and only once the section is near
const LiquidCell = dynamic(() => import("../LiquidCell"), { ssr: false });

// where each cell sits in the field, in % of its width and height: a loose diagonal scatter, labels to the right
const SPOTS = [[2, 2], [36, 17], [4, 38], [42, 52], [10, 72], [50, 82]];

/** The services index on /new, after the reference's investor section: six honey cells revolving in a scattered
 *  field on the left, each with its number and name (a link to its service), the headline on the right. Each
 *  cell is the hero's liquid-metal shader at 160 px, turning on a 3D coin spin. The shaders mount when the
 *  section is within a viewport, run while it is on screen, and stop (speed 0, spin paused) under reduced
 *  motion or "Pause motion". */
export default function NewIntro() {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [on, setOn] = useState(false);
  const [speed, setSpeed] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setNear(true); setOn(e.isIntersecting); }, { rootMargin: "40% 0px" });
    io.observe(el);
    const motion = () => setSpeed(motionOff() ? 0 : 1);
    motion();
    const unsub = onMotionChange(motion);
    return () => { io.disconnect(); unsub(); };
  }, []);
  return (
    <section ref={ref} id="services" className={`wrap ${s.intro}`} aria-labelledby="services-title">
      <nav aria-label="Six services" className={s.field}>
        {SERVICES.map((c, i) => (
          <a key={c.id} href={`#cell-${c.id}`} className={s.item} style={{ left: `${SPOTS[i][0]}%`, top: `${SPOTS[i][1]}%`, "--i": i } as React.CSSProperties}>
            <span className={s.coin} aria-hidden="true">
              <span className={s.face}>
                <span className={s.front}>{near && <LiquidCell speed={on ? speed : 0} size={160} />}</span>
                {/* the cell's depth: two amber slices behind the face, so edge-on it reads as a solid; the honey shows from both sides */}
                <span className={s.rim} style={{ "--z": -4 } as React.CSSProperties} /><span className={s.rim} style={{ "--z": -8 } as React.CSSProperties} />
              </span>
            </span>
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
