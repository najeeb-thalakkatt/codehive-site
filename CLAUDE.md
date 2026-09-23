# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Single-page marketing site for Codehive AB, an AI engineering consultancy in Stockholm.
Next.js 15 App Router, React 19, TypeScript strict, CSS keyframes driven by the Web Animations API, one WebGL shader in the hero. Static export (`output: "export"`) deployed to GitHub Pages at codehives.se by `.github/workflows/pages.yml` on every push to `main`. Dark theme only.

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

`@/*` maps to the repo root (`@/content/services`, `@/lib/usePlayOnEnter`).

## Skills
Project skills in `.claude/skills/`: `init-session` (start here), `apply-tasks` (pasted task lists), `port-visual`
(artboard to cell), `check` (Playwright checks), `screens` (look at a section), `variants` (local comparison page),
`ship` (build, commit, push, deploy, Lighthouse). `scripts/status.sh` and `scripts/run-checks.sh` back them.

## Read first
- `README.md` for how the cells play and what is wired vs not.
- `TODO.md` is the ordered backlog; one item per PR, tick it in the same commit that finishes it.
- `content/services.ts` before touching any copy. `SERVICES` is the only place a service number, name or word is typed.
- `styles/tokens.css` before choosing any colour, spacing or radius. Never write a raw hex in a component; use the variable.

## How the page fits together
`app/page.tsx` mounts, in order: `HiveCanvas` (fixed background), `Reveal`, `Nav`, then `LiquidHero`,
`ServicesIntro`, one `Cell` card per entry in `content/services.ts` (`SERVICES`), `Contact`, `Footer`.
Everything that shows a service number, name or label reads from `SERVICES`; nothing else types one.
The layout is the site-v3 package from the founder (hero, intro, compact card, six animations); port
its references, do not redesign them.

### Hero (`components/LiquidHero.tsx`)
A WebGL liquid-metal shader (`@paper-design/shaders-react`, the one dependency with a reason) masked by
`public/codehive-cell.svg`, the logo cell with the braces cut out. Loaded with `next/dynamic` after
hydration so the copy is the LCP and the 83 kB shader chunk stays off the first load. `colorBack` is
transparent so the HiveCanvas lattice shows through. A 760×420 radial darkening (`.shade`) sits behind the copy; it is the one gradient on the site.
Reduced motion sets `speed` 0 and parks the drifting snippets. Buttons are pills, ink on dark: no amber on the
honey. Hero B (`site-v3/layout-refs/hero-b-copy-over.html`) is the reference.

### Play on enter (text and intro)
- `lib/usePlayOnEnter.ts` collects every Web Animation inside a ref, holds them at 0, and once the element
  is in view plays them all once at rate 1/duration. The intro and each card's text column play over 7 s. Nothing is scrubbed by scroll and nothing is pinned.
- Motion is plain CSS `@keyframes` whose 0–100% is that timeline. `.anim` (in `app/globals.css`) sets duration
  1s, linear, fill both, paused; an element needs `.anim` plus an `animation-name`. `.w` is the streamed-word
  variant (`components/Stream.tsx`, one `.w` span per word, the space between spans, never inside).
- Card text timeline: question partly visible at 0 (negative `t0`), the "you" turn in by 0.3, the codehive
  bubble fades in at 0.32–0.36, its heading 0.36–0.46, body 0.47–0.62, chips 0.63–0.72, action 0.74.
- Keyframes in a CSS module get hashed names; keyframes referenced by inline `animationName` live in plain
  global css next to the component (`services-intro.css`, `components/cells/*.css`), prefixed per component.
- Reduced motion: the hook sets every animation to its end and never plays.

### Service cards and their animations
- `components/Cell.tsx` is the compact card: header row (dot, number, name, `0N / 06`), a "you" bubble and a
  "codehive" bubble with chips and the action on the left, `ServiceAnimation` on the right; one column under
  900px. Cards must fit a 720px-tall viewport at 1280 wide (check with `v3.mjs`-style measurements).
- `components/ServiceAnimation.tsx` is a 640×600 frame scaled to its width (`lib/useScaleToFit.ts`,
  `aspect-ratio` reserves the height so nothing shifts). The visual inside is one of `components/cells`,
  registered by the `animation` key in `SERVICES` in `components/cells/index.ts`.
- The visuals are ports of the site-v3 artboards (`site-v3/animations`, identical to the "Codehive service
  animations" design canvas): each draws in a 560×520 `.stg` that the frame places at the artboard's 40px
  padding. Artboard timings carry over as keyframe percentages, colours as tokens, geometry unchanged.
- Loop policy: the frame's css turns every `.anim` inside into a 13 s infinite loop (`.stg` gets the end fade),
  running only while the frame is in view (IntersectionObserver) and paused otherwise. Under reduced motion
  the component parks every loop at 12.35 s (the finished scene, before the fade). The card's play-once hook
  watches the text column only, so it never touches the loop.
- Shared primitives: `components/cells/viz.css` (`.stg`, `.el`, `.lbl`, `.note`, `.tag`, `.typed`, `.bub`,
  `.ans`, `.box`, `.bar`, `stagefade`) and `components/cells/parts.tsx` (hex points, `Tick`, `Badge`, `Lines`).
  Hex clusters sit on the site grid: pointy-top, 6px gap, neighbours at √3·r+6.
- Never call `getAnimations()` per element. One `getAnimations({ subtree: true })` per column or frame.
- Anything that reparents a card's DOM after mount recreates its CSS animations and orphans the hook's handles.
- Perf budget: Lighthouse mobile performance and accessibility both above 90; performance within 5 points of
  the pre-v3 site (97–99). Measure against the live site or a server that gzips; `python3 -m http.server`
  inflates LCP. The dim-at-rest idea failed the contrast audit once (1.6:1); keep resting text at full opacity.
- `components/HiveCanvas.tsx` is a canvas hex lattice with glow "flows"; its density follows scroll position
  and it reads the last `section[id^=cell-]` to know where the cards end, so keep that id pattern.
- `components/Reveal.tsx` adds `.in` to `.reveal` elements for fade-ups (contact).
- `prototype/index.html` is the pre-v3 reference the first visuals came from; do not edit it.

## Animation contract
- Anything played once has class `anim` (or `w`), an `animation-name`, and total delay+duration ≤ 1s. The
  card animations loop instead; their keyframes are still authored on 0–100%.
- Prefer transform and opacity. Colour, stroke and border animations are allowed sparingly.
- Do not replace the keyframes with a JS animation library; extend them.
- `prefers-reduced-motion` must always render the finished state. Test it.

## Brand rules that are not negotiable
- Colours: near-black ground (`--bg0`), off-white text, one amber accent. Amber is a fill (`--amber` with dark text on it) or `--amber` as text on dark. No gradients. No new accent colours. `--ok` and `--alert` are for solved/broken states in the animations and real errors only.
- Type: Familjen Grotesk for headlines, wordmark and actions; Schibsted Grotesk for body; IBM Plex Mono for eyebrows, chips, code and annotations. No other fonts. They are self-hosted by `next/font` in `app/layout.tsx` and exposed as `--font-display`, `--font-body`, `--font-mono`.
- Logo: hexagon with `{ }` inside, `components/Mark.tsx`. Wordmark is the typed word `codehive`, lowercase, never drawn.
- Buttons are pills (`--radius-pill`); hexagons are never rounded. Inline actions in cards and contact are text with the
  hexagon marker and an underline on hover (`.act`). No title bar. Nav is the floating layer in `components/Nav.tsx`.
- No personal information anywhere on the site: no founder name, photo, LinkedIn, past employer names. Company voice only.

## Copy rules
- Short sentences. Concrete nouns. Name the stack and the trade-off.
- No: leverage, unlock, empower, seamless, cutting-edge, "AI-powered", exclamation marks, em dashes, arrows appended to button text, headlines shaped as "X. Now Y."
- Each cell is a conversation: the "you" turn is a question about the reader's situation; the "codehive" turn is a plain statement.
- Never invent numbers, clients, case studies or claims. If a fact is missing, leave a `[PLACEHOLDER]`, do not fill it.

## Working agreements
- Keep components small and colocated: `Foo.tsx` + `Foo.module.css`. Global CSS only in `app/globals.css`
  (and the cell visual css files, which are plain global css imported by their component).
- Do not add dependencies without a reason written in the PR. `@paper-design/shaders-react` is the one
  exception (the hero shader, site-v3 T1); there is still no animation library. "Not doing" in `TODO.md` applies: no blog, team page, client logos, light theme.
- Do not touch `prototype/index.html`; it is the reference the visuals were ported from.
- Contact is a click-to-load Calendly frame in `components/Booking.tsx`; analytics is Umami behind an env var set as a GitHub Actions variable.
