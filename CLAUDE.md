# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Single-page marketing site for Codehive AB, an AI engineering consultancy in Stockholm.
Next.js 15 App Router, React 19, TypeScript strict, one canvas 2D particle swarm behind the page, CSS keyframes driven by the Web Animations API. Static export (`output: "export"`) deployed to GitHub Pages at codehives.se by `.github/workflows/pages.yml` on every push to `main`. Dark theme only.

## Commands
```
npm install
npm run dev      # http://localhost:3000
npm run build    # the check. Run it before claiming anything works; fix type errors, never `any` them away. Writes the static site to out/
npm run lint     # next lint (eslint-config-next)
```
While `npm run dev` is running (the founder's, usually on :3000), never build into `.next`: it breaks the dev
server (500s until restarted). Build aside with `NEXT_DIST_DIR=.next-build npm run build`: the static site then
lands in `.next-build/`, not `out/` (serve that: `npx serve .next-build -l 4173`). `scripts/run-checks.sh` does all
of this and takes :4173 when :3000 is busy (`CHECK_ORIGIN` tells the checks where). Only a plain `npm run build`
writes `out/`, which is what the deploy workflow uploads.
There is no test suite. Verification is `npm run build` plus a look in the browser, including with
`prefers-reduced-motion` on (it must render every figure's finished state).
No server features: no API routes, no `next/image` optimisation, no middleware. Everything must survive `output: "export"`.

`@/*` maps to the repo root (`@/content/services`, `@/lib/usePlayOnEnter`).

## Skills
Project skills in `.claude/skills/`: `init-session` (start here), `apply-tasks` (pasted task lists), `port-visual`
(artboard to cell), `check` (Playwright checks), `screens` (look at a section), `variants` (local comparison page),
`ship` (build, commit, push, deploy, Lighthouse). `scripts/status.sh` and `scripts/run-checks.sh` back them.

## Read first
- `README.md` for the page, the checks and what is wired vs not.
- `TODO.md` is the ordered backlog; one item per PR, tick it in the same commit that finishes it.
- `content/services.ts` before touching any copy. `SERVICES` is the only place a service number, name or word is typed.
- `styles/tokens.css` before choosing any colour, spacing or radius. Never write a raw hex in a component; use the variable.

## How the page fits together
`app/page.tsx` mounts, in order: `Swarm` (one fixed canvas behind everything), `NewNav`, then `NewHero`, `NewIntro`,
one `ServiceBlock` per entry in `content/services.ts` (`SERVICES`), `NewContact`, `Footer`. The page's own components
live in `components/new/` (the design began as the `/new` lab route and went live on 2026-10-02; `new-design/DESIGN.md`
is the reference it answers, in our brand). Everything that shows a service number, name or label reads from
`SERVICES`; nothing else types one. Nothing is boxed: no cards, no frames, one filled amber pill per view
(`NewNav` shows its pill only once the hero's has scrolled away).

### The swarm (`components/new/Swarm.tsx`, helpers in `swarm-lib.ts`, formations in `scenes.ts`)
One canvas, one rAF loop, tiny outlined hexagons drawn from a sprite atlas (no paths or shadows per particle). The same
particles tell the whole page: the logo cell in the hero, six small hives in the services index, one figure per
service, the cell again beside the contact headline, and a sparse drifting field in between.
- A formation's place is an element with `data-swarm-scene="<key>"` (a key of `SCENES`). Anchors are measured in
  document space on mount, resize, load and whenever the page's height changes (a ResizeObserver on `body`), so a late
  font swap or the booking frame opening never leaves them stale. `data-swarm-fit="width"` sizes by width (the band).
- The anchor nearest the middle of the viewport holds the particles: cohesion is full within 0.2 viewport heights and
  gone by 0.5, so neighbours never smear each other. Between figures the flight is turbulent.
- Counts: a base swarm of 2400 (700 at 820px and under) that every section shares, and 8000 (2300) for the logo cell
  so the braces read as a clear cut-out. The extras are live only while a cell is near; they never join the field or
  a service figure. The founder picked these by eye; do not change them without asking.
- `data-swarm-group` makes several anchors one group (the six hives of `NewIntro`); each `[data-bee]` ancestor wanders
  on a bee's path, its transform set by the swarm.
- The swarm owns some inline styles (opacity of a figure's square, transform of a bee) and may set them before React
  hydrates: those elements carry `suppressHydrationWarning`.
- Reduced motion and "Pause motion" draw the nearest formation's finished state once, locked to the page, and redraw
  on scroll. `data-swarm` (stage), `data-swarm-at` (dominant figure) and `data-swarm-n` (live particles) on the canvas
  are for the checks.
- A `Scene` is home points in unit space plus `paint(m, t, i, baked)` returning a colour column and alpha; colours are
  columns of the atlas (`COL_VARS`, tokens only).

### Service figures (`components/new/hybrid/`)
Each service's visual is a hybrid: the swarm draws the structure and a thin overlay of labels inside the same square
says what it means. They are the artboards of the "Codehive service animations" Claude Design canvas.
- `scripts/port-hybrid.py` turns the saved artboards (`new-design/hybrid-src/`) into `cfgs.ts`, `overlays.tsx` and
  `generated.css`. Never edit those three by hand; change the script or the source and run it again.
- The canvas has two options per service. `PICK` in the script is the founder's choice (2026-10-02: 01 B, 02 A, 03 B,
  04 B, 05 B, 06 B); only those are ported. To try another, change the letter and run the script.
- `engine.ts` runs a config as a `Scene` with a loop of `T` seconds: the swarm ticks it each frame while it is near
  (particles relocate on cue) and scrubs the overlay's CSS animations, which are paused in css, to the same loop time.
  One `getAnimations({ subtree: true })` per anchor when anchors are collected, never per frame.
- Overlay positions are % of the square, other lengths `cqw` of it (type never under 10px); the phone overlays
  (`.hy-phone`, 900px and under) carry at most two labels. 04 Production is a full-width band (`wide`).
- Reduced motion shows each figure's held final frame (`stillT`), which is the message of the loop.

### Play on enter (the text column)
- `lib/usePlayOnEnter.ts` collects every Web Animation inside a ref, holds them at 0, and once the element
  is in view plays them all once at rate 1/duration. Each block's text column plays over 3 s. Nothing is pinned or
  scrubbed by scroll.
- Motion is plain CSS `@keyframes` whose 0–100% is that timeline. `.anim` (in `app/globals.css`) sets duration
  1s, linear, fill both, paused; an element needs `.anim` plus an `animation-name`. `.w` is the streamed-word
  variant (`components/Stream.tsx`, one `.w` span per word, the space between spans, never inside).
- Block text timeline: the question is complete at 0 (negative `t0`), the problem streams 0.02–0.24, the codehive
  turn comes in at 0.36–0.46, body 0.47–0.62, chips 0.63–0.72; the action is shown from 0.
- Reduced motion: the hook sets every animation to its end and never plays.
- "Pause motion" (footer, `components/MotionToggle.tsx`, WCAG 2.2.2) sets `html[data-motion="off"]`, remembered in
  localStorage and applied before paint by `app/layout.tsx`. It means the same as reduced motion: anything new that
  moves must honour both (`motionOff()` / `onMotionChange()` in `lib/motion.ts`, or the attribute selector in CSS).
- Anything that reparents a block's DOM after mount recreates its CSS animations and orphans the hook's handles.

### Shared pieces and the budget
- `components/Booking.tsx` (click-to-load Calendly frame, opened by `#book`), `Footer`, `MotionToggle`, `Stream`,
  `Mark` are shared with `/privacy` and the 404 page, which still use the older `Nav`.
- Perf budget: Lighthouse mobile performance and accessibility both above 90 (98 and 100 at launch). Measure against
  the live site or a server that gzips; `python3 -m http.server` inflates LCP. Keep resting text at full opacity
  (dimmed text failed the contrast audit once, 1.6:1).
- Phone: no horizontal overflow at 375; overlay labels may reach past a figure's square, the block clips them.

### Previous page (v3), not mounted
`LiquidHero`/`LiquidCell` (the WebGL shader), `HiveCanvas`, `ServicesIntro`, `Cell`, `ServiceAnimation`,
`components/cells/`, `Contact`, `Reveal`, `lib/useScaleToFit.ts` and the checks `hero.mjs` and `cards.mjs` are still
in the repo, but nothing on the home page uses them. Do not extend them. Their documentation is in this file's
history (`git log -- CLAUDE.md`); removing them and the shader dependency is an open item in `TODO.md`.
`prototype/index.html` is the pre-v3 reference; do not edit it.

## Animation contract
- Anything played once has class `anim` (or `w`), an `animation-name`, and total delay+duration ≤ 1s. The
  service figures loop instead, on the swarm's clock; their overlay keyframes are authored on 0–100% of the loop.
- Prefer transform and opacity. Colour, stroke and border animations are allowed sparingly.
- Do not replace the keyframes with a JS animation library; extend them.
- `prefers-reduced-motion` must always render the finished state. Test it.

## Brand rules that are not negotiable
- Colours: near-black ground (`--bg0`), off-white text, one amber accent. Amber is a fill (`--amber` with dark text on it) or `--amber` as text on dark. No gradients, except the nav's fade of the page ground. No new accent colours. `--ok` and `--alert` are for solved/broken states in the animations and real errors only.
- Type: Familjen Grotesk for headlines, wordmark and actions; Schibsted Grotesk for body; IBM Plex Mono for eyebrows, chips, code and annotations. No other fonts. They are self-hosted by `next/font` in `app/layout.tsx` and exposed as `--font-display`, `--font-body`, `--font-mono`.
- Logo: hexagon with `{ }` inside, `components/Mark.tsx`. Wordmark is the typed word `codehive`, lowercase, never drawn.
- Buttons are pills (`--radius-pill`); hexagons are never rounded. Inline actions in the service blocks and contact are text with the
  hexagon marker and an underline on hover (`.act`). No title bar. Nav is the floating layer in `components/new/NewNav.tsx`.
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
  exception (the v3 hero shader, no longer mounted); there is still no animation library. "Not doing" in `TODO.md` applies: no blog, team page, client logos, light theme.
- Do not touch `prototype/index.html`; it is the reference the visuals were ported from.
- Contact is a click-to-load Calendly frame in `components/Booking.tsx`; analytics is Umami behind an env var set as a GitHub Actions variable.
