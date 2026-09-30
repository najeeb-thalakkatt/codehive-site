"use client";
import { useEffect, useRef } from "react";
import Mark from "../Mark";
import { BOOK } from "@/content/services";
import s from "./NewNav.module.css";
import v from "./v4.module.css";

/** Nav for /new: transparent, logo left, two mono links and the amber pill right. The pill is shown only
 *  once the hero (`[data-swarm-hero]`) has scrolled above the nav, so the first view has one filled button. */
export default function NewNav() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current, hero = document.querySelector("[data-swarm-hero]");
    if (!el || !hero) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) delete el.dataset.pastHero; else el.dataset.pastHero = ""; }, { rootMargin: "-80px 0px 0px 0px", threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  return (
    <header ref={ref} className={s.nav}>
      <div className={`wrap ${s.row}`}>
        <a href="/new/#top" className={s.logo}><Mark />codehive</a>
        <nav aria-label="Primary" className={s.links}>
          <a href="/new/#services" className="navlink">Services</a>
          <a href="/new/#contact" className="navlink">Contact</a>
          <a href="#book" className={`${v.pill} ${s.pill}`}>{BOOK}</a>
        </nav>
      </div>
    </header>
  );
}
