export default function Mark({ size = 30 }: { size?: number }) {
  const b = "M6,-16 C1,-16 2,-11 2,-6 C2,-2 0,-1 -3,0 C0,1 2,2 2,6 C2,11 1,16 6,16";
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 80 88" fill="none" aria-hidden="true">
      <polygon points="40,8 71.2,26 71.2,62 40,80 8.8,62 8.8,26" stroke="var(--amber)" strokeWidth="4" strokeLinejoin="round" />
      <g fill="none" stroke="var(--ink1)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" transform="translate(40,44)">
        <path transform="translate(-9,0)" d={b} /><path transform="translate(9,0) scale(-1,1)" d={b} />
      </g>
    </svg>
  );
}
