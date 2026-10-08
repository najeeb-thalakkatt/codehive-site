"use client";
import { useEffect, useRef } from "react";
import { motionOff, onMotionChange } from "@/lib/motion";
import s from "./Figure.module.css";

/** A figure made with the hairline skill (@lucasmarkes/hairline): an isometric line drawing that answers the pointer.
 *  The engine is `public/hairline/kernel.js`, unchanged from the skill; each figure is `public/hairline/<name>.js`,
 *  a module that ends with `hairline({ name, means, range, tour, mount })`. This component loads both once, mounts
 *  the figure in a 400 x 320 stage at the middle of its slider range, and walks its tour (the unseen pointer) while
 *  it is on screen, giving way to a real pointer. Reduced motion and "Pause motion" land every spring at once and
 *  stop the tour (the kernel's own switch). The read-out is the corner label the figure writes to. */
type Fig = { name: string; means: string; range: [number, number, number]; tour: ([number, number] | null)[] | null; mount: (h: { stage: HTMLElement; svg: SVGSVGElement; read: HTMLElement }, v: number) => { set: (v: number) => void; destroy: () => void } };
type HLKernel = { inject: (root: Document) => void; mk: (tag: string, attrs: Record<string, string>, parent: Element) => SVGSVGElement; tour: (stage: HTMLElement, stops: Fig["tour"]) => { stop: () => void }; LAP: Fig["tour"]; setReducedMotion: (on: boolean) => void };
declare global { interface Window { hairline?: (f: Fig) => void; HL?: HLKernel } }

const figs = new Map<string, Fig>();
const loads = new Map<string, Promise<void>>();
/** One script per src, loaded once. The kernel is a classic script (it defines the global `HL`); a figure is a module. */
function load(src: string, module = false) {
  let p = loads.get(src);
  if (!p) {
    p = new Promise((ok, fail) => {
      window.hairline ??= (f) => { figs.set(f.name, f); };
      const el = document.createElement("script");
      if (module) el.type = "module";
      el.src = src; el.onload = () => ok(); el.onerror = () => fail(new Error(`hairline: ${src} did not load`));
      document.head.append(el);
    });
    loads.set(src, p);
  }
  return p;
}

export default function Figure({ name, label }: { name: string; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const readRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const stage = ref.current, read = readRef.current;
    if (!stage || !read) return;
    let handle: { destroy: () => void } | null = null, lap: { stop: () => void } | null = null, gone = false;
    load("/hairline/kernel.js").then(() => load(`/hairline/${name}.js`, true)).then(() => {
      const HL = window.HL, fig = figs.get(name);
      if (gone || !HL || !fig) return;
      HL.inject(document);
      stage.setAttribute("data-hairline", fig.name);
      stage.setAttribute("aria-label", fig.means);
      const svg = HL.mk("svg", { viewBox: "0 0 400 320", "aria-hidden": "true" }, stage);
      read.textContent = "rest";
      handle = fig.mount({ stage, svg, read }, fig.range[1]);
      if (motionOff()) HL.setReducedMotion(true);
      lap = HL.tour(stage, fig.tour || HL.LAP);
    }).catch((e) => { if (!gone) read.textContent = String(e.message || e); });
    // the kernel follows the OS setting by itself; the footer's "Pause motion" is ours to pass on
    const unsub = onMotionChange(() => window.HL?.setReducedMotion(motionOff()));
    return () => { gone = true; unsub(); lap?.stop(); handle?.destroy(); stage.replaceChildren(); };
  }, [name]);
  return (
    <div className={s.fig}>
      <div ref={ref} className={s.stage} role="img" />
      <span className={s.read}>{label && <span className={s.label}>{label}</span>}<span ref={readRef} aria-live="polite" /></span>
    </div>
  );
}
