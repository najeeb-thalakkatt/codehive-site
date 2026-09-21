"use client";
import { useEffect, useState } from "react";
import s from "./Booking.module.css";

const CALENDLY = "https://calendly.com/najeeb-1989/30min";

/** Click-to-load Calendly. Nothing from calendly.com loads until the visitor asks for it, so the
 *  page stays cookie-free by default and the privacy page can say so. Any link to #book opens it. */
export default function Booking() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const check = () => { if (location.hash === "#book") setOpen(true); };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);
  const src = `${CALENDLY}?hide_gdpr_banner=1&background_color=0b0d10&text_color=f4f1ea&primary_color=f2b84b&embed_type=Inline&embed_domain=${typeof location !== "undefined" ? location.hostname : "codehives.se"}`;
  return (
    <div id="book" className={s.book}>
      <div className={s.row}>
        <button type="button" className="act" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="book-frame">Book a call</button>
        <a className={`mono ${s.mail}`} href="mailto:dev@codehives.se?subject=Codehive%20call">or email dev@codehives.se</a>
      </div>
      {open && (
        <div id="book-frame" className={s.frame}>
          <iframe title="Book a 30 minute call with Codehive" src={src} loading="lazy" />
          <p className={`mono ${s.note}`}>The booking form is provided by Calendly. See <a href="/privacy">privacy</a>.</p>
        </div>
      )}
    </div>
  );
}
