import "./viz.css";
import "./models.css";

/** Cell 03 visual. Five model cards jitter in place, then settle into a benchmark chart.
 *  The bars grow from the same left edge; the fine-tuned open model is the amber one.
 *  Keyframes on the full 0–100% cell timeline. */
const models: { name: string; label: string; width: number; top: number; bar: number; amber?: boolean }[] = [
  { name: "s3m0", label: "gpt-4o via API", width: 126, top: 276, bar: 173 },
  { name: "s3m1", label: "claude via API", width: 126, top: 340, bar: 184 },
  { name: "s3m2", label: "llama 70b, prompt v37", width: 179, top: 404, bar: 134 },
  { name: "s3m3", label: "mistral, zero-shot", width: 156, top: 468, bar: 114 },
  { name: "s3m4", label: "llama 8b, fine-tuned on your data", width: 270, top: 532, bar: 232, amber: true },
];

export default function Models() {
  return (
    <>
      {models.map((m, i) => (
        <div key={m.name}>
          <div className="card anim" style={{ animationName: m.name, width: m.width, textAlign: "left" }}>{m.label}</div>
          <div className="anim" style={{ animationName: `s3bar${i}`, transformOrigin: "left", position: "absolute", left: 740, top: m.top, width: m.bar, height: 8, borderRadius: 4, background: m.amber ? "var(--amber)" : "var(--line2)" }} />
        </div>
      ))}
      <div className="mono anim" style={{ animationName: "s3axis", position: "absolute", left: 740, top: 560, width: 280, borderTop: "1px solid var(--line1)", paddingTop: 8, fontSize: 11, color: "var(--ink3)" }}>score on your eval set, same 200 cases for every model</div>
      <div className="mono badge anim" style={{ animationName: "s3lock", left: 1040, top: 520 }}>
        <svg width="12" height="14" viewBox="0 0 12 14" fill="none" stroke="var(--ok)" strokeWidth="1.5" aria-hidden="true"><rect x="1" y="6" width="10" height="7" rx="1.5" /><path d="M3 6 V4 a3 3 0 0 1 6 0 V6" /></svg>
        runs in your EU region
      </div>
    </>
  );
}
