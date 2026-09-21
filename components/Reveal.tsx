"use client";
import { useEffect } from "react";
/** Adds .in to every .reveal once it enters the viewport. Mount once in page.tsx if you want the fade-ups. */
export default function Reveal() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
