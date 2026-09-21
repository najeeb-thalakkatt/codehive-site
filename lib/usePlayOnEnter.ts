"use client";
import { useEffect, type RefObject } from "react";

/**
 * Plays every CSS animation inside `sectionRef` once, when the section scrolls into view.
 *
 * The choreography lives in plain CSS @keyframes authored on a 0–100% timeline (1s of animation
 * time). Nothing is tied to scroll position: the section enters, the scene plays over `duration`
 * seconds, and the reader scrolls on when they are ready. `prefers-reduced-motion` gets the
 * finished state immediately.
 *
 * Convention: every animated element has `animation-play-state: paused` and a delay+duration that
 * fits inside 1s. Calling play() on a CSSAnimation takes it out of CSS play-state control, so the
 * paused declaration only matters until we start it.
 */
export function usePlayOnEnter(sectionRef: RefObject<HTMLElement | null>, duration = 7) {
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const anims = el.getAnimations({ subtree: true });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { for (const a of anims) { a.pause(); a.currentTime = 999; } return; }
    for (const a of anims) { a.pause(); a.currentTime = 0; }
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      for (const a of anims) { a.playbackRate = 1 / duration; a.play(); }
    }, { rootMargin: "-25% 0px -25% 0px" }); // starts once a quarter of the section is on screen
    io.observe(el);
    return () => io.disconnect();
  }, [sectionRef, duration]);
}
