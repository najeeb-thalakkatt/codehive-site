import { Suspense } from "react";
import HiveCanvas from "@/components/HiveCanvas";
import Nav from "@/components/Nav";
import LiquidHero from "@/components/LiquidHero";
import ServicesIntro from "@/components/ServicesIntro";
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
        <LiquidHero />
        <ServicesIntro />
        {/* Each card in its own Suspense boundary: the HTML is already streamed, so no fallback ever
            shows, but React hydrates each boundary as a separate short task instead of the whole
            page in one long one. That is what keeps the main thread free on a phone. */}
        <div className={`wrap ${p.cards}`}>
          {SERVICES.map((c) => {
            const V = visuals[c.animation];
            return (
              <Suspense key={c.id} fallback={null}>
                <Cell data={c}>{V ? <V /> : null}</Cell>
              </Suspense>
            );
          })}
        </div>
        <Contact />
      </main>
      <Footer />
    </>
  );
}
