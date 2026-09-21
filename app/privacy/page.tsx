import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Privacy · Codehive", description: "What codehives.se collects, and what it does not." };

const h2: React.CSSProperties = { fontSize: 24, marginTop: 40, marginBottom: 10 };
const p: React.CSSProperties = { margin: "0 0 14px", color: "var(--ink2)", maxWidth: 640 };

export default function Privacy() {
  return (
    <>
      <Nav />
      <main className="wrap" style={{ paddingTop: 140, paddingBottom: 96 }}>
        <div className="eyebrow">Privacy</div>
        <h1 style={{ fontSize: "clamp(36px,5vw,56px)", maxWidth: 720, margin: "14px 0 18px" }}>No cookies. Little else.</h1>
        <p style={p}>Codehive AB, org.nr 559392-7576, [PLACEHOLDER: street address], Stockholm, is responsible for this site and for the personal data described here. Questions go to <a href="mailto:dev@codehives.se">dev@codehives.se</a>.</p>

        <h2 style={h2}>What the site collects</h2>
        <p style={p}>The site sets no cookies of its own and loads nothing from third parties until you ask for it. It counts page views with Umami, a cookie-free analytics tool. Umami records the page, the referrer, browser and device type, and country. It does not store your IP address and cannot follow you across sites. Analytics data is processed on our behalf by Umami Software, Inc.</p>
        <p style={p}>The site is hosted by Vercel, Inc. Like any host, Vercel may keep short-lived request logs (IP address, time, URL) to run and protect the service.</p>

        <h2 style={h2}>If you book a call</h2>
        <p style={p}>Choosing Book a call loads a booking form from Calendly, LLC (USA) in a frame. What you enter there, your name, email and the time you pick, goes to Calendly and to us, and Calendly may set cookies inside that frame under its own privacy policy. Nothing from Calendly loads before you click. If you would rather not use it, email us instead.</p>

        <h2 style={h2}>If you email us</h2>
        <p style={p}>When you write to dev@codehives.se we keep the correspondence for as long as needed to answer you and to take steps towards a possible engagement. That is our legitimate interest and, where relevant, preparation of a contract. We do not add you to any list.</p>

        <h2 style={h2}>Your rights</h2>
        <p style={p}>You can ask what we hold about you, have it corrected or deleted, or object to how it is used. Email dev@codehives.se. You can also complain to the Swedish Authority for Privacy Protection, IMY.</p>

        <h2 style={h2}>Changes</h2>
        <p style={p}>If we add a form, a booking tool or anything else that collects data, this page changes first. Last updated 2026-09-21, booking form added.</p>
        <div style={{ marginTop: 32 }}><a className="act" href="/">Back to the start</a></div>
      </main>
      <Footer />
    </>
  );
}
