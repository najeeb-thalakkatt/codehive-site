/** Small shared pieces for the cell visuals. */
export const HEX58 = "0,-58 50.2,-29 50.2,29 0,58 -50.2,29 -50.2,-29";
export const HEX48 = "0,-48 41.6,-24 41.6,24 0,48 -41.6,24 -41.6,-24";

/** Green check, 16px, inline in a .note line. */
export function Tick() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--ok)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8.5 6.5 12 13 4.5" />
    </svg>
  );
}

/** Green check in a dark disc at a hexagon's top-right corner (svg coordinates, centre at 0,0). */
export function Badge({ name }: { name: string }) {
  return (
    <g className="anim" style={{ animationName: name }} transform="translate(22,-38)">
      <circle r="9" fill="var(--bg0)" />
      <path d="M-4,0.5 L-1,3.5 L4,-3" fill="none" stroke="var(--ok)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** One to three centred lines of mono text inside a hexagon (18px leading, centred on y=0). */
export function Lines({ lines, fill, name }: { lines: string[]; fill: string; name?: string }) {
  return (
    <text className={name ? "anim" : undefined} style={name ? { animationName: name } : undefined} fill={fill}>
      {lines.map((l, i) => <tspan key={l} x="0" y={(i - (lines.length - 1) / 2) * 18 + 4.5}>{l}</tspan>)}
    </text>
  );
}
