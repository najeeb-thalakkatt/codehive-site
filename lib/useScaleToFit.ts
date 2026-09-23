"use client";
import { useEffect, useState, type RefObject } from "react";

/** Scale factor that fits a `native`-px-wide stage into `ref`'s current width. Updates on resize. */
export function useScaleToFit(ref: RefObject<HTMLElement | null>, native: number) {
  const [k, setK] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / native));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, native]);
  return k;
}
