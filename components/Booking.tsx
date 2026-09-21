"use client";
import { useEffect, useState } from "react";
import { cells } from "@/content/cells";
import s from "./Booking.module.css";

const CALENDLY = "https://calendly.com/dev-codehive/30min";

/** Click-to-load Calendly. Nothing from calendly.com loads until the visitor asks for it, so the
 *  page stays cookie-free by default and the privacy page can say so.
 *  Any link to #book opens it; #book-02 also prefills Calendly's first invitee question ("Which
 *  service are you looking for?") with that cell's label, via Calendly's `a1` parameter. The option
 *  text in Calendly must match `label` in content/cells.ts exactly. */
export default function Booking() {
  const [open, setOpen] = useState<false | string>(false);
  useEffect(() => {
    const scroll = () => document.getElementById("book")?.scrollIntoView({ block: "start", behavior: "instant" });
    const check = () => {
      const m = location.hash.match(/^#book(?:-(\d\d))?$/);
      if (!m) return;
      setOpen(cells.find((c) => c.id === m[1])?.label ?? "");
      scroll();
    };
    check();
    // On a direct load with the hash, the pin spacers are inserted after this effect and push the
    // section down by several screens, so scroll once more when the page has settled.
    const settle = () => setTimeout(scroll, 150);
    if (location.hash.startsWith("#book")) { if (document.readyState === "complete") settle(); else window.addEventListener("load", settle, { once: true }); }
    window.addEventListener("hashchange", check);
    return () => { window.removeEventListener("hashchange", check); window.removeEventListener("load", settle); };
  }, []);
  // The frame adds height below the section; scroll only once it is in the DOM, or the page is
  // too short to bring #book to the top.
  useEffect(() => { if (open !== false) document.getElementById("book")?.scrollIntoView({ block: "start", behavior: "instant" }); }, [open]);
  const host = typeof location !== "undefined" ? location.hostname : "codehives.se";
  const src = `${CALENDLY}?hide_gdpr_banner=1&hide_event_type_details=1&background_color=0b0d10&text_color=f4f1ea&primary_color=f2b84b&embed_type=Inline&embed_domain=${host}${open ? `&a1=${encodeURIComponent(open)}` : ""}`;
  return (
    <div id="book" className={s.book}>
      <div className={s.row}>
        <button type="button" className="act" onClick={() => setOpen("")} aria-expanded={open !== false} aria-controls="book-frame">Book a call</button>
        <a className={`mono ${s.mail}`} href="mailto:dev@codehives.se?subject=Codehive%20call">or email dev@codehives.se</a>
      </div>
      {open !== false && (
        <div id="book-frame" className={s.frame}>
          <iframe title="Book a 30 minute call with Codehive" src={src} loading="lazy" />
          <p className={`mono ${s.note}`}>The booking form is provided by Calendly. See <a href="/privacy">privacy</a>.</p>
        </div>
      )}
    </div>
  );
}
