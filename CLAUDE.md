# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Single-page marketing site for Codehive AB, an AI engineering consultancy in Stockholm.
Next.js 15 App Router, React 19, TypeScript strict, CSS keyframes driven by the Web Animations API. Static export (`output: "export"`) deployed to GitHub Pages at codehives.se by `.github/workflows/pages.yml` on every push to `main`. Dark theme only.

## Commands
```
npm install
npm run dev      # http://localhost:3000
npm run build    # the check. Run it before claiming anything works; fix type errors, never `any` them away. Writes the static site to out/
npm run lint     # next lint (eslint-config-next)
```
There is no test suite. Verification is `npm run build` plus a look in the browser, including with
`prefers-reduced-motion` on (it must render every cell's finished state).
No server features: no API routes, no `next/image` optimisation, no middleware. Everything must survive `output: "export"`.

`@/*` maps to the repo root (`@/content/cells`, `@/lib/usePlayOnEnter`).

## Read first
- `README.md` for how the cells play and what is wired vs not.
- `TODO.md` is the ordered backlog; one item per PR, tick it in the same commit that finishes it.
- `content/cells.ts` before touching any copy. All words for the five service cells live there.
- `styles/tokens.css` before choosing any colour, spacing or radius. Never write a raw hex in a component; use the variable.

## How the page fits together
`app/page.tsx` mounts, in order: `HiveCanvas` (fixed background), `Reveal`, `Nav`, then `Hero`, the
"Five things we do" intro, one `Cell` per entry in `content/cells.ts`, `Contact`, `Footer`. It looks
up each cell's visual in the `visuals` map in `components/cells/index.ts` by cell id; a cell with no
entry renders its text but an empty visual box. All five are registered.

### Play on enter (the one non-obvious mechanism)
- Nothing is scrubbed by scroll position and nothing is pinned. `lib/usePlayOnEnter.ts` collects every
  Web Animation inside a cell, holds them at 0, and once a quarter of the section is in view plays them all
  at playback rate 1/7, so the 1 s keyframe timeline takes 7 s on screen. One play per cell per page load.
- Motion is plain CSS `@keyframes` whose 0–100% is that timeline. Keyframes stay the single source of truth;
  the hook only decides when they run. There is no animation library.
- `.anim` (in `app/globals.css`) sets duration 1s, linear, fill both, paused. An element needs `.anim` plus an
  `animation-name` to participate. `.w` is the streamed-word variant (duration .04s, staggered via `animation-delay`).
- Text streams via `components/Stream.tsx`: each word is a `.w` span with `animation-delay` spread between
  `t0` and `t1` (0–1 progress). All words are always in the DOM, so screen readers get the full text.
- The cell timeline: the question headline is partly visible at 0 (negative `t0`), the "you" turn is in by
  0.3, the visual box appears at 0.24–0.32 in its problem state, the "codehive" turn streams 0.36–0.62, chips
  0.63–0.72, action 0.74. Visual keyframes are authored on the full 0–100% and compressed into 0.42–1.0 by
  `.viz :global(.anim)` in `Cell.module.css`.
- Above 1100px the cell is two columns (text left, visual right); below, one column with the visual last.
- Reduced motion: the hook sets every animation to its end and never plays.

### Cell visuals
- Authored on a 1280×800 canvas (same coordinates as the design mockups and `prototype/index.html`).
  `Cell.tsx` shows the 720×520 region at (560,100), scaled to the column width on resize. Keep important
  elements inside that region, or let them enter from outside on purpose.
- Shared primitives are in `components/cells/viz.css` (`.hx` hexagon, `.card`, `.vizSvg`, `trace`, `tick`, `fadeout`).
  Per-cell keyframes go in their own css file next to the component (`strategy.css`).
- Recipe for a cell visual: `components/cells/<Name>.tsx` + `<name>.css` following `Strategy.tsx` (inline
  `animationName` per element, `aria-hidden` on decorative svg), registered by id in `components/cells/index.ts`.
  The prototype is the reference for coordinates and timing; do not edit it.
- Anything that reparents a cell's DOM after mount recreates its CSS animations and orphans the hook's handles.
  Do not reintroduce pinning or portals inside a cell without re-collecting in `usePlayOnEnter`.
- `.w` word spans are inline-block; the inter-word space must sit between spans, not inside them, and
  with no wrapper element per word: every node in a cell is hydration work on a phone.
- Never call `getAnimations()` per element. One `el.getAnimations({ subtree: true })` per cell. The per-element
  version forced hundreds of style recalcs inside React's effect flush and cost a second of main-thread time on
  mobile (Lighthouse blamed the framework chunk, which is misleading).
- The old scroll-scrub driver (GSAP ScrollTrigger pinning, progress → currentTime) was replaced on 2026-09-21 by
  play-on-enter at the founder's request. Do not bring pinning back without asking.
- Perf budget: Lighthouse mobile performance and accessibility both above 90. Re-run after touching
  `usePlayOnEnter`, `Stream`, `HiveCanvas` or anything that adds DOM nodes to a cell.
- `components/HiveCanvas.tsx` is a canvas hex lattice with glow "flows" that hop between cells; its density
  follows scroll position (full on hero, quiet behind cells, medium after). It reads the last `section[id^=cell-]`
  to know where the cells end, so keep that id pattern.
- `components/Reveal.tsx` is a plain IntersectionObserver that adds `.in` to `.reveal` elements for fade-ups
  outside the pinned cells.

## Animation contract
- Anything scrubbed has class `anim` (or `w`), an `animation-name`, and total delay+duration ≤ 1s.
- Prefer transform and opacity. Colour, stroke and border animations are allowed sparingly.
- Do not replace the keyframes with a JS animation library; extend them.
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
- Do not add dependencies without a reason written in the PR. The site should stay a small static page with
  no animation library at all. "Not doing" in `TODO.md` applies: no blog, team page, client logos, light theme.
- Do not touch `prototype/index.html`; it is the reference the visuals were ported from.
- Contact is a click-to-load Calendly frame in `components/Booking.tsx`; analytics is Umami behind an env var set as a GitHub Actions variable.
