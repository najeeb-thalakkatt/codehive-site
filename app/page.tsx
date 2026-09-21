import HiveCanvas from "@/components/HiveCanvas";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Cell from "@/components/Cell";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { cells } from "@/content/cells";
import { visuals } from "@/components/cells";

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
            Five things we do.<br /><span style={{ color: "var(--ink3)" }}>Each starts with what is broken.</span>
          </h2>
        </section>
        {cells.map((c) => {
          const Viz = visuals[c.id];
          return <Cell key={c.id} data={c}>{Viz ? <Viz /> : null}</Cell>;
        })}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
