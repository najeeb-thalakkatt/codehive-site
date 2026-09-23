import { Suspense } from "react";
import HiveCanvas from "@/components/HiveCanvas";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Cell from "@/components/Cell";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { SERVICES } from "@/content/services";
import { visuals } from "@/components/cells";
import p from "./page.module.css";

export default function Page() {
  return (
    <>
      <HiveCanvas />
      <Reveal />
      <Nav />
      <main>
        <Hero />
        <section className="wrap reveal" id="services" style={{ paddingTop: 96, paddingBottom: 24, borderTop: "1px solid var(--line1)" }}>
          <h2 style={{ fontSize: "clamp(34px,4.5vw,56px)" }}>
            Six things we do.<br /><span style={{ color: "var(--ink3)" }}>Each one starts with what is broken.</span>
          </h2>
          <nav aria-label="Services" className={`mono ${p.index}`}>
            {SERVICES.map((c) => (
              <a key={c.id} href={`#cell-${c.id}`}><span>{c.id}</span>{c.name}</a>
            ))}
          </nav>
        </section>
        {/* Each cell in its own Suspense boundary: the HTML is already streamed, so no fallback ever
            shows, but React hydrates each boundary as a separate short task instead of the whole
            page in one long one. That is what keeps the main thread free on a phone. */}
        {SERVICES.map((c) => {
          const v = visuals[c.animation];
          return (
            <Suspense key={c.id} fallback={null}>
              <Cell data={c} mobileCrop={v?.mobile}>{v ? <v.Component /> : null}</Cell>
            </Suspense>
          );
        })}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
