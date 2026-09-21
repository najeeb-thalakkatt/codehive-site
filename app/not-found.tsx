import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="wrap" style={{ minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", gap: 18, paddingTop: 120, paddingBottom: 96 }}>
        <div className="eyebrow">404</div>
        <h1 style={{ fontSize: "clamp(40px,6vw,72px)", maxWidth: 720 }}>Nothing at this address.</h1>
        <p style={{ fontSize: 18, color: "var(--ink2)", maxWidth: 520, margin: 0 }}>The page moved or never existed. The whole site is one page, so start there.</p>
        <div><a className="act" href="/">Back to the start</a></div>
      </main>
      <Footer />
    </>
  );
}
