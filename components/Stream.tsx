/** Splits text into words that fade in one after another between progress t0 and t1 (0–1).
 *  Purely CSS + WAAPI: the words are always in the DOM, so screen readers get the full text.
 *  The space lives between the spans, not inside: `.w` is inline-block, and trailing
 *  whitespace inside an inline-block box is collapsed away. */
export default function Stream({ text, t0, t1 }: { text: string; t0: number; t1: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          <span className="w" style={{ animationDelay: `${(t0 + ((t1 - t0) * i) / Math.max(1, words.length)).toFixed(3)}s` }}>{w}</span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}
