import type { Metadata } from "next";
import { Suspense } from "react";
import Swarm from "@/components/new/Swarm";
import NewNav from "@/components/new/NewNav";
import NewHero from "@/components/new/NewHero";
import NewIntro from "@/components/new/NewIntro";
import ServiceBlock from "@/components/new/ServiceBlock";
import NewContact from "@/components/new/NewContact";
import Footer from "@/components/Footer";
import Figure from "@/components/hairline/Figure";
import { SERVICES } from "@/content/services";
import v from "@/components/new/v4.module.css";

export const metadata: Metadata = { title: "Codehive · hairline lab", robots: { index: false, follow: false } };

/** Which hairline figure (public/hairline/<name>.js) answers each service: a balance for the decision, a shelf of
 *  documents for the assistants, a height gauge for the benchmark, a flight of locks for the promotion to prod,
 *  lanterns for the knowledge that spreads, two tanks and a valve for the plain backend. */
const FIGURE: Record<string, string> = { "01": "beam", "02": "shelf", "03": "gauge", "04": "locks", "05": "lanterns", "06": "tanks" };

/** Lab route (2026-10-08): the live page with only the six service figures replaced by hairline figures, isometric
 *  line drawings that answer the pointer (the hairline skill, @lucasmarkes/hairline). The swarm stays: the logo cell
 *  in the hero, the hives, the field between sections and the cell at contact are the live page's. Scrolling is free: no
 *  section stops and no WheelStops (the founder asked for the lock to go, 2026-10-08). Not linked. */
export default function Page() {
  return (
    <>
      <Swarm />
      <NewNav />
      <main id="main" className={v.v4}>
        <NewHero />
        <NewIntro />
        {SERVICES.map((c, i) => (
          <Suspense key={c.id} fallback={null}>
            <ServiceBlock data={c} flip={i % 2 === 1} figure={<Figure name={FIGURE[c.id]} label={FIGURE[c.id]} />} />
          </Suspense>
        ))}
        <NewContact />
      </main>
      <Footer />
    </>
  );
}
