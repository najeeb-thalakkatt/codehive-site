import Mark from "./Mark";
// 44px tap targets (.navlink) in the footer's quieter ink
const tap: React.CSSProperties = { color: "var(--ink3)" };

export default function Footer() {
  return (
    <footer className="wrap mono" style={{ borderTop: "1px solid var(--line1)", padding: "20px clamp(20px,5vw,64px)", display: "flex", flexWrap: "wrap", gap: "16px 24px", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "var(--ink3)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Mark size={22} /><span style={{ fontVariantNumeric: "tabular-nums" }}>Codehive AB, Stockholm · Org.nr 559392-7576<br />VAT SE559392757601</span></div>
      <div style={{ display: "flex", gap: 24 }}><a href="mailto:dev@codehives.se" className="navlink" style={tap}>dev@codehives.se</a><a href="/privacy" className="navlink" style={tap}>Privacy</a><span style={{ ...tap, display: "inline-flex", alignItems: "center", minHeight: 44 }}>codehives.se</span></div>
    </footer>
  );
}
