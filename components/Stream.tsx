/** Splits text into words that fade in one after another between progress t0 and t1 (0–1).
 *  Purely CSS + WAAPI: the words are always in the DOM, so screen readers get the full text. */
export default function Stream({ text, t0, t1 }: { text: string; t0: number; t1: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="w" style={{ animationDelay: `${(t0 + ((t1 - t0) * i) / Math.max(1, words.length)).toFixed(3)}s` }}>
          {w}{i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}
