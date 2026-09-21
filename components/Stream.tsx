import { Fragment } from "react";

/** Splits text into words that fade in one after another between progress t0 and t1 (0–1).
 *  Purely CSS + WAAPI: the words are always in the DOM, so screen readers get the full text.
 *  The space lives between the spans, not inside: `.w` is inline-block, and trailing
 *  whitespace inside an inline-block box is collapsed away. One element per word, no wrappers:
 *  every extra node here is hydration work on a phone, five cells deep. */
export default function Stream({ text, t0, t1 }: { text: string; t0: number; t1: number }) {
  const words = text.split(" ");
  // A negative delay means "already shown when the cell appears". Clamp it to the word's full
  // duration (.04s) so such a word is fully opaque at time 0, never caught mid-fade.
  const delay = (i: number) => { const d = t0 + ((t1 - t0) * i) / Math.max(1, words.length); return d < 0 ? -0.04 : d; };
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="w" style={{ animationDelay: `${delay(i).toFixed(3)}s` }}>{w}</span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </>
  );
}
