"use client";
import { useEffect, useRef, useState } from "react";
import { SERVICES } from "@/content/services";
import s from "./Booking.module.css";

const CALENDLY = "https://calendly.com/dev-codehive/30min";

/** Click-to-load Calendly. Nothing from calendly.com loads until the visitor asks for it, so the
 *  page stays cookie-free by default and the privacy page can say so.
 *  Any link to #book opens it. A cell's action also dispatches a `codehive:book` event carrying its
 *  label, which prefills Calendly's first invitee question ("Which service are you looking for?") via
 *  the `a1` parameter. The option text in Calendly must match `name` in content/services.ts exactly. */
export default function Booking() {
  const [open, setOpen] = useState<false | string>(false);
  const [loaded, setLoaded] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const scroll = () => document.getElementById("book")?.scrollIntoView({ block: "start", behavior: "instant" });
    const check = () => {
      if (location.hash !== "#book") return;
      setOpen((o) => (o === false ? "" : o)); // keep a label a cell's click just set
      scroll();
    };
    const fromCell = (e: Event) => { const label = (e as CustomEvent<string>).detail; if (SERVICES.some((c) => c.name === label)) setOpen(label); };
    window.addEventListener("codehive:book", fromCell);
    check();
    // On a direct load with the hash, the pin spacers are inserted after this effect and push the
    // section down by several screens, so scroll once more when the page has settled.
    const settle = () => setTimeout(scroll, 150);
    if (location.hash.startsWith("#book")) { if (document.readyState === "complete") settle(); else window.addEventListener("load", settle, { once: true }); }
    window.addEventListener("hashchange", check);
    return () => { window.removeEventListener("hashchange", check); window.removeEventListener("load", settle); window.removeEventListener("codehive:book", fromCell); };
  }, []);
  // The frame adds height below the section; scroll only once it is in the DOM, or the page is
  // too short to bring #book to the top.
  useEffect(() => { if (open !== false) document.getElementById("book")?.scrollIntoView({ block: "start", behavior: "instant" }); }, [open]);
  // Loading line goes away on the iframe's load event or on Calendly's own "viewed" message,
  // whichever arrives first; a late load event on a cross-origin frame is not something to wait on.
  useEffect(() => {
    if (open === false) return;
    const done = () => setLoaded(true);
    const el = frame.current; el?.addEventListener("load", done);
    const onMsg = (e: MessageEvent) => { if (e.origin === "https://calendly.com" && e.data?.event?.startsWith?.("calendly.")) done(); };
    window.addEventListener("message", onMsg);
    const fallback = window.setTimeout(done, 8000);
    return () => { el?.removeEventListener("load", done); window.removeEventListener("message", onMsg); window.clearTimeout(fallback); };
  }, [open]);
  const host = typeof location !== "undefined" ? location.hostname : "codehives.se";
  const src = `${CALENDLY}?hide_gdpr_banner=1&hide_event_type_details=1&background_color=14171c&text_color=f4f1ea&primary_color=f2b84b&embed_type=Inline&embed_domain=${host}${open ? `&a1=${encodeURIComponent(open)}` : ""}`;
  return (
    <div id="book" className={s.book}>
      <div className={s.row}>
        <button type="button" className="act" onClick={() => setOpen("")} aria-expanded={open !== false} aria-controls="book-frame">Book a call</button>
        <a className={`mono ${s.mail}`} href="mailto:dev@codehives.se?subject=Codehive%20call">or email dev@codehives.se</a>
      </div>
      {open !== false && (
        <div id="book-frame" className={s.frame}>
          {!loaded && <span className={`mono ${s.loading}`}>Loading the calendar</span>}
          <iframe ref={frame} title="Book a 30 minute call with Codehive" src={src} loading="lazy" />
          <p className={`mono ${s.note}`}>The booking form is provided by Calendly. See <a href="/privacy">privacy</a>.</p>
        </div>
      )}
    </div>
  );
}
