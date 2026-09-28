/** Motion is off when the OS asks for reduced motion, or when the visitor pressed "Pause motion" in the
 *  footer: `html[data-motion="off"]`, remembered in localStorage and set before first paint by the
 *  inline script in app/layout.tsx. CSS reads the attribute; components read `motionOff()` and
 *  re-check on `onMotionChange`. Off means the same as reduced motion: every scene at its end state. */
const REDUCE = "(prefers-reduced-motion: reduce)";
const EVENT = "codehive:motion";
export const MOTION_KEY = "codehive-motion";

export const osReducedMotion = () => window.matchMedia(REDUCE).matches;
export const motionOff = () => osReducedMotion() || document.documentElement.dataset.motion === "off";

export function setMotionOff(off: boolean) {
  if (off) document.documentElement.dataset.motion = "off"; else delete document.documentElement.dataset.motion;
  try { if (off) localStorage.setItem(MOTION_KEY, "off"); else localStorage.removeItem(MOTION_KEY); } catch {}
  window.dispatchEvent(new Event(EVENT));
}

/** Calls `cb` when the OS setting or the footer toggle changes. Returns the unsubscribe. */
export function onMotionChange(cb: () => void) {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb); window.addEventListener(EVENT, cb);
  return () => { mq.removeEventListener("change", cb); window.removeEventListener(EVENT, cb); };
}
