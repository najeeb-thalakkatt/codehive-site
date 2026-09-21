"use client";
import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Pins `sectionRef` for `distance` viewport heights and, as the user scrolls,
 * scrubs every paused CSS animation inside it by setting its currentTime.
 *
 * Why this and not GSAP tweens for everything: the choreography lives in
 * plain CSS @keyframes (shared with the design system mockups). GSAP is used
 * for what it is best at, pinning and a smoothed scroll progress; the
 * keyframes stay the single source of truth for motion.
 *
 * Convention: every animated element has `animation-play-state: paused`,
 * `animation-duration: 1s` (or a delay+duration that fits inside 1s),
 * and its keyframes are authored on a 0–100% timeline that equals section progress.
 */
export function useScrub(sectionRef: RefObject<HTMLElement | null>, distance = 1.2) {
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const anims: Animation[] = [];
    el.querySelectorAll<HTMLElement>(".anim, .w").forEach((node) => {
      node.getAnimations().forEach((a) => { a.pause(); anims.push(a); });
    });
    const apply = (p: number) => { const t = p * 999; for (const a of anims) a.currentTime = t; };

    if (reduce) { apply(1); return; }

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: () => `+=${window.innerHeight * distance}`,
      pin: true,
      scrub: 0.6,           // seconds of smoothing; this is the "not jerky" knob
      onUpdate: (self) => apply(self.progress),
      invalidateOnRefresh: true,
    });
    apply(0);
    return () => st.kill();
  }, [sectionRef, distance]);
}
