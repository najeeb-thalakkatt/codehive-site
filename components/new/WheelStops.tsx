"use client";
import { useEffect } from "react";

/** Makes the page's section stops (the CSS scroll snapping on `main[data-snap]`, app/globals.css) work with a mouse
 *  wheel. Left to itself the browser scrolls one notch and then snaps to the NEAREST stop, which is the one it just
 *  left: the page springs back and feels stuck. Here a wheel turn goes to the next stop in its direction when that
 *  stop is within one screen (nothing of the current section is left unseen); a section taller than the screen
 *  is scrolled by the wheel's own amount until it is (entered from below, it opens on its last screen). One turn, one section: wheel input is ignored until the jump is done and the wheel
 *  (or a trackpad's momentum) has gone quiet. Does nothing when snapping is off (reduced motion, "Pause motion"),
 *  and is not installed on touch-first devices, where the native snapping already behaves. */
export default function WheelStops() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const root = document.documentElement;
    let lock = 0; // until this time, wheel input belongs to the jump in progress
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) <= Math.abs(e.deltaX) || getComputedStyle(root).scrollSnapType === "none") return;
      const now = performance.now();
      if (now < lock) { e.preventDefault(); lock = Math.max(lock, now + 160); return; }
      // how far each section is from its stop: its top edge rests `--snap-top` below the viewport's
      const rest = (el: Element) => parseFloat(getComputedStyle(el).getPropertyValue("--snap-top")) || 0;
      const dist = (el: Element) => el.getBoundingClientRect().top - rest(el);
      const secs = [...document.querySelectorAll("main[data-snap] > section")];
      const to = e.deltaY > 0 ? secs.find((el) => dist(el) > 1) : secs.reverse().find((el) => dist(el) < -1);
      if (!to) return; // the page's end
      const H = window.innerHeight, down = e.deltaY > 0;
      e.preventDefault();
      // "within one screen" has a little slack: the strip above a stop is the padding at the end of the section
      // before it (the rule in globals.css), so a section taller than the screen by no more than that still fits
      const slack = rest(down ? to : to.nextElementSibling ?? to) + 8;
      if (Math.abs(dist(to)) <= H + slack) { to.scrollIntoView(); lock = now + 700; return; }
      // The stop is more than a screen away: a section taller than the screen. Scroll it here, as far as the wheel
      // says and never past its last screen, because browsers differ on a plain notch inside one (WebKit skips to
      // the next stop). Entered from the stop below, it opens on its last screen.
      const tall = down ? to.previousElementSibling : to, end = tall ? tall.getBoundingClientRect().bottom : H;
      if (!down && end < H - 1) { window.scrollBy(0, end - H); lock = now + 700; return; }
      const dy = e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? H : 1); // lines and pages to px
      window.scrollBy({ top: down ? Math.min(dy, end - H) : dy, behavior: "instant" });
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);
  return null;
}
