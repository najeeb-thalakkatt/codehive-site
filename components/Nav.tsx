import Mark from "./Mark";
export default function Nav() {
  return (
    // Not a title bar: a soft fade of the page ground so content scrolling under the nav does not collide with it.
    <header style={{ position: "fixed", left: 0, right: 0, top: 0, paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: 16, zIndex: 20, pointerEvents: "none", background: "linear-gradient(to bottom, var(--bg0) 0%, color-mix(in srgb, var(--bg0) 85%, transparent) 60%, transparent 100%)" }}>
      <div className="wrap" style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/#top" style={{ pointerEvents: "auto", display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "var(--ink1)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, letterSpacing: -0.5 }}>
          <Mark />codehive
        </a>
        <nav className="mono" style={{ pointerEvents: "auto", display: "flex", gap: 28, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>
          <a href="/#services" style={{ color: "var(--ink2)", textDecoration: "none", padding: "12px 0" }}>Services</a>
          <a href="/#contact" style={{ color: "var(--ink2)", textDecoration: "none", padding: "12px 0" }}>Contact</a>
        </nav>
      </div>
    </header>
  );
}
