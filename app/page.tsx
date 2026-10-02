import { Suspense } from "react";
import Swarm from "@/components/new/Swarm";
import NewNav from "@/components/new/NewNav";
import NewHero from "@/components/new/NewHero";
import NewIntro from "@/components/new/NewIntro";
import ServiceBlock from "@/components/new/ServiceBlock";
import NewContact from "@/components/new/NewContact";
import Footer from "@/components/Footer";
import { SERVICES } from "@/content/services";
import v from "@/components/new/v4.module.css";

/** The page (v4, live 2026-10-02): one swarm of outlined hexagons behind everything (Swarm), which forms the logo
 *  cell in the hero, six small hives in the services index, one figure per service and the cell again at contact.
 *  It began as the /new lab route (new-design/DESIGN.md is the reference); components/new is our version. */
export default function Page() {
  return (
    <>
      <Swarm />
      <NewNav />
      <main id="main" className={v.v4} data-snap>
        <NewHero />
        <NewIntro />
        {/* Each block in its own Suspense boundary: the HTML is already there, so no fallback ever shows, but React
            hydrates each boundary as a separate short task instead of the whole page in one long one. */}
        {SERVICES.map((c, i) => (
          <Suspense key={c.id} fallback={null}>
            <ServiceBlock data={c} flip={i % 2 === 1} wide={c.animation === "production"} />
          </Suspense>
        ))}
        <NewContact />
      </main>
      <Footer />
    </>
  );
}
