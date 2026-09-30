import { Suspense } from "react";
import type { Metadata } from "next";
import Swarm from "@/components/new/Swarm";
import NewNav from "@/components/new/NewNav";
import NewHero from "@/components/new/NewHero";
import ServicesIntro from "@/components/ServicesIntro";
import ServiceBlock from "@/components/new/ServiceBlock";
import NewContact from "@/components/new/NewContact";
import Footer from "@/components/Footer";
import { SERVICES } from "@/content/services";
import v from "@/components/new/v4.module.css";

/** /new: the constellation design experiment (see new-design/DESIGN.md for the reference and
 *  components/new for our version). The file is `page.lab.tsx`: it is a route only when DESIGN_NEW=1
 *  puts `lab.tsx` in next.config's pageExtensions, so the deploy never builds it until it ships. */
export const metadata: Metadata = { title: "Codehive · new design (lab)", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <>
      <Swarm />
      <NewNav />
      <main id="main" className={v.v4}>
        <NewHero />
        <ServicesIntro />
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
