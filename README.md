# codehives.se

Next.js 15 (App Router), one canvas particle swarm behind the page, CSS keyframes driven by the Web Animations API. One page. Dark only. Static export, served by GitHub Pages at codehives.se.

## Run
```
npm install
npm run dev        # http://localhost:3000
```
Deploy: every push to `main` runs `.github/workflows/pages.yml`, which builds the static export (`out/`) and publishes it to GitHub Pages. `public/CNAME` pins the custom domain. Fonts are self-hosted by `next/font` at build time. Analytics: set the repository variable `NEXT_PUBLIC_UMAMI_WEBSITE_ID`; unset means no analytics script.

## Making changes
Small, safe change: commit on `main`, push, live in about a minute. Anything you want to look at first: branch, push, open a pull request; the workflow builds it as a check, merge when green, and the merge deploys. To undo a bad deploy, `git revert` the commit and push; the revert deploys the previous state. Preview locally with `npm run dev` (hot reload) or `npm run build && npx serve out` (exactly what ships).

## Checks
`bash scripts/run-checks.sh` builds into `.next-build/` (so a running `npm run dev` survives), serves it without `-s`, runs `checks/page.mjs` and prints only failures. It takes port 4173 when 3000 is busy and tells the check where through `CHECK_ORIGIN`. `checks/page.mjs` covers the home page: the swarm assembles the logo cell with 8000 particles, the services index holds six hives that wander, each service figure is held by the swarm with the base 2400 particles and its overlay runs on the swarm's clock, block text plays once, the cell forms again at contact, the nav pill, phone overflow, "Pause motion" and reduced motion. Playwright is a dev dependency; run `npx playwright install chromium` once. `checks/hero.mjs` and `checks/cards.mjs` test the previous page (v3) and are no longer run.

## The page (v4, live 2026-10-02)
`app/page.tsx` is the swarm design: it began as the `/new` lab route, built from `new-design/DESIGN.md` (and dala.craftedbygc.com, whose one particle field morphs from section to section) in our own brand. Its components are in `components/new/`: the Swarm canvas, its formations in `scenes.ts`, NewNav, NewHero, NewIntro, ServiceBlock, NewContact, plus the shared booking and footer. One swarm of outlined hexagons tells the whole page: the logo cell in the hero, six small hives in the services index (a `data-swarm-group`, each `[data-bee]` item wandering on a bee's path with its label), one figure per service on each block's empty visual column (`[data-swarm-scene]`), and the cell again beside the contact headline, with the particles morphing between them as you scroll. 04 Production is a full-width band. The swarm has two counts (`swarm-lib.ts`): a base of 2400 particles (700 on phones) that every section shares, and 8000 (2300 on phones) for the logo cell so the braces read as a clear cut-out; the extra particles are live only while a cell holds them. The six service figures are hybrid artboards from the Claude Design canvas ("Codehive service animations"): the swarm draws the structure and a thin overlay of labels names it. `scripts/port-hybrid.py` turns the saved artboards (`new-design/hybrid-src/`) into `components/new/hybrid/` (configs, overlay JSX, prefixed keyframes); `hybrid/engine.ts` runs a config as a swarm scene, and the swarm scrubs the overlay's paused CSS animations to the same loop time. The canvas has two options per service; `PICK` in the script holds the chosen one (01 B, 02 A, 03 B, 04 B, 05 B, 06 B) and only those are ported. Audit reports live in the ignored `motion-audits/`.

The sections from "The hero shader" to "What is wired and what is not" describe the previous page (v3). Its components are still in the repo but the home page no longer mounts them; see `TODO.md` for their removal.

## The hero shader
`components/LiquidCell.tsx` mounts the liquid-metal shader with a mask that was preprocessed once (`public/codehive-cell.processed.png`). If `public/codehive-cell.svg` changes, regenerate it: rasterise the svg at 1024px, run `toProcessedLiquidMetal` from `@paper-design/shaders` on it in a browser, save the `pngBlob`. Running the preprocessing at page load costs about 1.8 s of main-thread time on a phone.

## How the cells play
Each service cell is `components/Cell.tsx`. Its motion is plain CSS `@keyframes`, authored on a 0–100% timeline (1 s of animation time). Nothing is tied to scroll position: `lib/usePlayOnEnter.ts` waits until a quarter of the section is on screen, then plays every animation inside it once at a playback rate that stretches the 1 s timeline to 3 s (`usePlayOnEnter(ref, 3)`; the services intro uses 7 s). The reader scrolls on when they are ready; the next cell plays when it arrives. No pinning, no GSAP.

Rules for anything you animate inside a cell:
- give it class `anim` (or `w` for streamed words) and `animation-name`
- keep `animation-duration` at 1s, or a delay+duration that adds up to ≤1s (the hook stretches that 1s to 3s on screen for a card, 7s for the intro)
- animate transform and opacity where you can; colour and stroke changes work but cost more on weak phones

Text streams in via `components/Stream.tsx`: each word is a span with an `animation-delay` between t0 and t1. All words are always in the DOM, so screen readers read the full text.

The cell visual is authored on a 1280×800 canvas (same coordinates as the design mockups). `Cell.tsx` shows the 720×520 region at (560,100) on desktop, or a per-cell tighter window on narrow viewports, scaled to the column width, and compresses the visual's timeline into the last 58% of the play (`.viz .anim { animation-delay: .42s; animation-duration: .579s }`).

## What is wired and what is not
- All six service animations are ported from site-v3 (same as the design canvas), loop inside each card's frame, and are registered in `components/cells/index.ts`. Each is `<Name>.tsx` + `<name>.css` next to it; `Strategy.tsx` is the simplest one to copy for a new cell.
- Mobile is still the cropped desktop scene for every cell (see TODO 5).
- Contact is a `mailto`. Replace with Cal.com or a form before launch.
- No analytics. Add Plausible or Umami in `app/layout.tsx`.
- Mobile: the visual is a crop of the desktop scene. A re-choreographed mobile variant per cell is still to do.

## Where things live
- `content/services.ts` all copy for the six services
- `styles/tokens.css` the design tokens (mirror of the Codehive design system)
- `components/new/` the live page: the swarm, its formations and the service figures
- `components/HiveCanvas.tsx` the v3 background lattice (not mounted)
- `prototype/index.html` the static prototype this was ported from, kept for reference

## Before launch
Privacy page, cookie-free analytics, OG image, SPF/DKIM/DMARC for dev@codehives.se, test on a mid-range Android.
