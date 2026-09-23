"use client";
import { useEffect, useRef, useState } from "react";
import { useScaleToFit } from "@/lib/useScaleToFit";
import s from "./ServiceAnimation.module.css";

/** The 640×600 animation frame of a service card. The visual inside is one of components/cells,
 *  drawn at its native size and scaled to the frame's width. Its CSS loop (13 s, see the module
 *  css) runs only while the frame is in view; reduced motion parks it on the finished state. */
export default function ServiceAnimation({ children }: { children: React.ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);
  const k = useScaleToFit(frame, 640);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const a of el.getAnimations({ subtree: true })) { a.pause(); a.currentTime = 12350; }
      return;
    }
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={frame} className={s.frame} aria-hidden="true">
      <div className={`${s.stage} ${on ? s.on : ""}`} style={{ transform: `scale(${k})` }}>{children}</div>
    </div>
  );
}
