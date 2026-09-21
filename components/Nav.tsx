import Mark from "./Mark";
export default function Nav() {
  return (
    <header style={{ position: "fixed", left: 0, right: 0, top: "env(safe-area-inset-top, 0px)", zIndex: 20, pointerEvents: "none" }}>
      <div className="wrap" style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/#top" style={{ pointerEvents: "auto", display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "var(--ink1)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, letterSpacing: -0.5 }}>
          <Mark />codehive
        </a>
        <nav className="mono" style={{ pointerEvents: "auto", display: "flex", gap: 28, fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>
          <a href="/#services" style={{ color: "var(--ink2)", textDecoration: "none", padding: "12px 0" }}>Services</a>
          <a href="/#contact" style={{ color: "var(--ink2)", textDecoration: "none", padding: "12px 0" }}>Contact</a>
        </nav>
      </div>
    </header>
  );
}
