export default function Contact() {
  return (
    <section id="contact" className="wrap reveal" style={{ paddingTop: 96, paddingBottom: 96, borderTop: "1px solid var(--line1)" }}>
      <div className="eyebrow">Contact</div>
      <h2 style={{ fontSize: "clamp(36px,5vw,56px)", maxWidth: 640, marginTop: 14 }}>Tell us what is stuck between demo and production.</h2>
      <p style={{ fontSize: 18, color: "var(--ink2)", maxWidth: 560 }}>A twenty-minute call, no deck. If it is not a fit we will say so and point you somewhere better.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "14px 24px", alignItems: "center" }}>
        {/* TODO: replace mailto with a Cal.com embed or a form → dev@codehives.se before launch */}
        <a className="act" href="mailto:dev@codehives.se?subject=Codehive%20call">Book a call</a>
        <a className="mono" href="mailto:dev@codehives.se" style={{ color: "var(--ink1)", textDecoration: "none", fontSize: 14 }}>dev@codehives.se</a>
      </div>
    </section>
  );
}
