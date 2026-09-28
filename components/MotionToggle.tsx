"use client";
import { useEffect, useState } from "react";
import { motionOff, onMotionChange, osReducedMotion, setMotionOff } from "@/lib/motion";

/** Footer control that stops the ambient motion (shader, snippets, hive glow, card loops): WCAG 2.2.2.
 *  Hidden when the OS already asks for reduced motion, since everything is parked then. */
export default function MotionToggle() {
  const [off, setOff] = useState(false);
  const [os, setOs] = useState(false);
  useEffect(() => {
    const read = () => { setOff(motionOff()); setOs(osReducedMotion()); };
    read();
    return onMotionChange(read);
  }, []);
  if (os) return null;
  return (
    <button type="button" className="navlink" onClick={() => setMotionOff(!off)}
      style={{ background: "none", border: 0, padding: 0, font: "inherit", color: "var(--ink3)", cursor: "pointer" }}>
      {off ? "Play motion" : "Pause motion"}
    </button>
  );
}
