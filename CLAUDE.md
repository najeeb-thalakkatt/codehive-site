# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Single-page marketing site for Codehive AB, an AI engineering consultancy in Stockholm.
Next.js 15 App Router, React 19, TypeScript strict, GSAP ScrollTrigger. Deployed on Vercel. Dark theme only.

## Commands
```
npm install
npm run dev      # http://localhost:3000
npm run build    # the check. Run it before claiming anything works; fix type errors, never `any` them away
npm run lint     # next lint (eslint-config-next)
```
There is no test suite. Verification is `npm run build` plus a look in the browser, including with
`prefers-reduced-motion` on (it must render every cell's finished state).

`@/*` maps to the repo root (`@/content/cells`, `@/lib/useScrub`).

## Read first
- `README.md` for how the scroll scrub works and what is wired vs not.
- `TODO.md` is the ordered backlog; one item per PR, tick it in the same commit that finishes it.
- `content/cells.ts` before touching any copy. All words for the five service cells live there.
- `styles/tokens.css` before choosing any colour, spacing or radius. Never write a raw hex in a component; use the variable.

## How the page fits together
`app/page.tsx` mounts, in order: `HiveCanvas` (fixed background), `Reveal`, `Nav`, then `Hero`, the
"Five things we do" intro, one `Cell` per entry in `content/cells.ts`, `Contact`, `Footer`. It looks
up each cell's visual in the `visuals` map in `components/cells/index.ts` by cell id; a cell with no
entry renders its text but an empty visual box. All five are registered.

### The scroll scrub (the one non-obvious mechanism)
- Every `Cell` is pinned for 1.8 viewport heights by `lib/useScrub.ts` (GSAP ScrollTrigger, `scrub: 1.2`, `anticipatePin: 1`).
- Motion is NOT GSAP tweens. It is plain CSS `@keyframes` whose 0–100% equals the cell's scroll progress.
  On each scroll update the hook sets `currentTime = progress * 999ms` on every paused Web Animation
  found under `.anim` and `.w` elements. Keyframes stay the single source of truth; GSAP only pins and smooths.
- `.anim` (in `app/globals.css`) sets duration 1s, linear, fill both, paused. An element needs `.anim` plus an
  `animation-name` to participate. `.w` is the streamed-word variant (duration .04s, staggered via `animation-delay`).
- Text streams via `components/Stream.tsx`: each word is a `.w` span with `animation-delay` spread between
  `t0` and `t1` (0–1 progress). All words are always in the DOM, so screen readers get the full text.
- The cell timeline: the question headline is partly visible at progress 0 (negative `t0`), the "you" turn is
  in by 0.3, the visual box appears at 0.24–0.32 in its problem state, the "codehive" turn streams 0.36–0.62,
  chips 0.63–0.72, action 0.74, and the column drifts up (`@keyframes col`, `colWide`). Visual keyframes are
  authored on the full 0–100% and compressed into scroll 0.42–1.0 by `.viz :global(.anim)` in `Cell.module.css`.
- Above 1100px the cell is two columns (text left, visual right); below, one column with the visual last.
- Reduced motion: the hook applies progress 1 once and never creates the ScrollTrigger.

### Cell visuals
- Authored on a 1280×800 canvas (same coordinates as the design mockups and `prototype/index.html`).
  `Cell.tsx` shows the 720×520 region at (560,100), scaled to the column width on resize. Keep important
  elements inside that region, or let them enter from outside on purpose.
- Shared primitives are in `components/cells/viz.css` (`.hx` hexagon, `.card`, `.vizSvg`, `trace`, `tick`, `fadeout`).
  Per-cell keyframes go in their own css file next to the component (`strategy.css`).
- Recipe for a cell visual: `components/cells/<Name>.tsx` + `<name>.css` following `Strategy.tsx` (inline
  `animationName` per element, `aria-hidden` on decorative svg), registered by id in `components/cells/index.ts`.
  The prototype is the reference for coordinates and timing; do not edit it.
- Pinning reparents the section, which recreates every CSS animation inside it. `useScrub` therefore collects
  its handles after the trigger exists and again on every ScrollTrigger refresh. Keep it that way.
- `.w` word spans are inline-block; the inter-word space must sit between spans, not inside them, and
  with no wrapper element per word: every node in a cell is hydration work on a phone.
- Never call `getAnimations()` per element. One `el.getAnimations({ subtree: true })` per cell. The per-element
  version forced hundreds of style recalcs inside React's effect flush and cost a second of main-thread time on
  mobile (Lighthouse blamed the framework chunk, which is misleading).
- Perf budget: Lighthouse mobile performance and accessibility both above 90. Re-run after touching
  `useScrub`, `Stream`, `HiveCanvas` or anything that adds DOM nodes to a cell.
- `components/HiveCanvas.tsx` is a canvas hex lattice with glow "flows" that hop between cells; its density
  follows scroll position (full on hero, quiet behind cells, medium after). It reads the last `section[id^=cell-]`
  to know where the cells end, so keep that id pattern.
- `components/Reveal.tsx` is a plain IntersectionObserver that adds `.in` to `.reveal` elements for fade-ups
  outside the pinned cells.

## Animation contract
- Anything scrubbed has class `anim` (or `w`), an `animation-name`, and total delay+duration ≤ 1s.
- Prefer transform and opacity. Colour, stroke and border animations are allowed sparingly.
- Do not replace the keyframe scrub with GSAP tweens; extend it.
- `prefers-reduced-motion` must always render the finished state. Test it.

## Brand rules that are not negotiable
- Colours: near-black ground (`--bg0`), off-white text, one amber accent. Amber is a fill (`--amber` with dark text on it) or `--amber` as text on dark. No gradients. No new accent colours. `--ok` and `--alert` are for solved/broken states in the animations and real errors only.
- Type: Familjen Grotesk for headlines, wordmark and actions; Schibsted Grotesk for body; IBM Plex Mono for eyebrows, chips, code and annotations. No other fonts. They are self-hosted by `next/font` in `app/layout.tsx` and exposed as `--font-display`, `--font-body`, `--font-mono`.
- Logo: hexagon with `{ }` inside, `components/Mark.tsx`. Wordmark is the typed word `codehive`, lowercase, never drawn.
- No pill buttons, no title bar. Actions are text with the hexagon marker and an underline on hover (`.act`). Nav is the floating layer in `components/Nav.tsx`.
- No personal information anywhere on the site: no founder name, photo, LinkedIn, past employer names. Company voice only.

## Copy rules
- Short sentences. Concrete nouns. Name the stack and the trade-off.
- No: leverage, unlock, empower, seamless, cutting-edge, "AI-powered", exclamation marks, em dashes, arrows appended to button text, headlines shaped as "X. Now Y."
- Each cell is a conversation: the "you" turn is a question about the reader's situation; the "codehive" turn is a plain statement.
- Never invent numbers, clients, case studies or claims. If a fact is missing, leave a `[PLACEHOLDER]`, do not fill it.

## Working agreements
- Keep components small and colocated: `Foo.tsx` + `Foo.module.css`. Global CSS only in `app/globals.css`
  (and the cell visual css files, which are plain global css imported by their component).
- Do not add dependencies without a reason written in the PR. The site should stay a small static page.
  "Not doing" in `TODO.md` applies: no blog, team page, client logos, light theme, or animation libs beyond GSAP.
- Do not touch `prototype/index.html`; it is the reference the visuals were ported from.
- Contact is currently a `mailto`; no analytics yet. Both are `TODO.md` items, not oversights.
