import Mark from "./Mark";
// 44px tap targets without changing how the links look
const tap: React.CSSProperties = { color: "var(--ink3)", textDecoration: "none", display: "inline-flex", alignItems: "center", minHeight: 44 };

export default function Footer() {
  return (
    <footer className="wrap mono" style={{ borderTop: "1px solid var(--line1)", padding: "20px clamp(20px,5vw,64px)", display: "flex", flexWrap: "wrap", gap: "16px 24px", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "var(--ink3)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Mark size={22} /><span>Codehive AB · Org.nr 559392-7576 · VAT SE559392757601 · Stockholm</span></div>
      <div style={{ display: "flex", gap: 24 }}><a href="mailto:dev@codehives.se" style={tap}>dev@codehives.se</a><a href="/privacy" style={tap}>Privacy</a><span style={tap}>codehives.se</span></div>
    </footer>
  );
}
