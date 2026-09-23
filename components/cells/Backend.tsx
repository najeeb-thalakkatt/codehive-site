import "./viz.css";
import "./appdev.css";

/** Cell 06 visual, first version: the cell 02 chat stream with the plain-backend lines. It reuses the
 *  s2 keyframes from appdev.css (four tickets stack into a thread, the amber reply lands, then the
 *  log line). A visual of its own is planned; when it comes, give it backend.css and drop this import. */
const briefs: [string, string][] = [
  ["s2b0", "add AI to the reports"],
  ["s2b1", "the monthly export takes a week"],
  ["s2b2", "sync fails on Sundays"],
  ["s2b3", "CRM and ERP don't talk"],
];

export default function Backend() {
  return (
    <>
      {briefs.map(([name, text]) => (
        <div key={name} className="card anim" style={{ animationName: name, borderRadius: "12px 12px 12px 4px" }}>{text}</div>
      ))}
      <div className="reply anim" style={{ animationName: "s2reply", top: 440 }}>one API · one job · zero tokens</div>
      <div className="mono anim" style={{ animationName: "s2cite", position: "absolute", right: 120, top: 518, fontSize: 13, whiteSpace: "nowrap", color: "var(--ink3)" }}>runs nightly · 40 s · cost: the server you already have</div>
    </>
  );
}
