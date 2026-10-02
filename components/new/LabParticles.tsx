"use client";
import { useEffect, useRef, useState } from "react";
import { COUNT_CAP, COUNT_DESK, COUNT_EVENT, COUNT_KEY, COUNT_MIN, PHONE_W, clampCount, defaultCount } from "./swarm-lib";
import s from "./LabParticles.module.css";

/** Lab only: a slider for how many particles the swarm draws, to judge by eye how dense the figures should be.
 *  It sits in the bottom left corner of /new, remembers its value on this device, and tells Swarm.tsx through a
 *  window event; "Reset" goes back to the default for the viewport (2400, or 700 on a phone). The spacer keeps the
 *  footer clear of the fixed bar at the end of the page. Goes away with the lab when a count is picked. */
export default function LabParticles() {
  const [def, setDef] = useState(COUNT_DESK);
  const [val, setVal] = useState<number | null>(null); // null: the default
  const raf = useRef(0);
  useEffect(() => {
    try { const v = Number(localStorage.getItem(COUNT_KEY)); if (v > 0) setVal(clampCount(v)); } catch {}
    const mq = window.matchMedia(`(max-width: ${PHONE_W}px)`), on = () => setDef(defaultCount(window.innerWidth));
    on(); mq.addEventListener("change", on);
    return () => { mq.removeEventListener("change", on); cancelAnimationFrame(raf.current); };
  }, []);
  // one message to the swarm per frame at most: it samples every figure again for the new count
  const send = (v: number | null) => {
    setVal(v);
    try { if (v === null) localStorage.removeItem(COUNT_KEY); else localStorage.setItem(COUNT_KEY, String(v)); } catch {}
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => window.dispatchEvent(new CustomEvent(COUNT_EVENT, { detail: v })));
  };
  const shown = val ?? def;
  return (
    <>
      <div className={s.spacer} aria-hidden="true" />
      <div className={s.bar} role="group" aria-label="Lab: particle count">
        <label className={s.label} htmlFor="lab-particles">Particles</label>
        <input id="lab-particles" className={s.range} type="range" min={COUNT_MIN} max={COUNT_CAP} step={100} value={shown}
          aria-valuetext={`${shown} particles`} onChange={(e) => send(clampCount(+e.target.value))} />
        <output className={s.val} htmlFor="lab-particles">{shown}</output>
        <button type="button" className={s.reset} disabled={val === null} onClick={() => send(null)}>Reset</button>
      </div>
    </>
  );
}
