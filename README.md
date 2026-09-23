# codehives.se

Next.js 15 (App Router), CSS keyframes driven by the Web Animations API. One page. Dark only. Static export, served by GitHub Pages at codehives.se.

## Run
```
npm install
npm run dev        # http://localhost:3000
```
Deploy: every push to `main` runs `.github/workflows/pages.yml`, which builds the static export (`out/`) and publishes it to GitHub Pages. `public/CNAME` pins the custom domain. Fonts are self-hosted by `next/font` at build time. Analytics: set the repository variable `NEXT_PUBLIC_UMAMI_WEBSITE_ID`; unset means no analytics script.

## Making changes
Small, safe change: commit on `main`, push, live in about a minute. Anything you want to look at first: branch, push, open a pull request; the workflow builds it as a check, merge when green, and the merge deploys. To undo a bad deploy, `git revert` the commit and push; the revert deploys the previous state. Preview locally with `npm run dev` (hot reload) or `npm run build && npx serve out` (exactly what ships).

## The hero shader
`components/LiquidCell.tsx` mounts the liquid-metal shader with a mask that was preprocessed once (`public/codehive-cell.processed.png`). If `public/codehive-cell.svg` changes, regenerate it: rasterise the svg at 1024px, run `toProcessedLiquidMetal` from `@paper-design/shaders` on it in a browser, save the `pngBlob`. Running the preprocessing at page load costs about 1.8 s of main-thread time on a phone.

## How the cells play
Each service cell is `components/Cell.tsx`. Its motion is plain CSS `@keyframes`, authored on a 0–100% timeline (1 s of animation time). Nothing is tied to scroll position: `lib/usePlayOnEnter.ts` waits until a quarter of the section is on screen, then plays every animation inside it once at a playback rate that stretches the 1 s timeline to 7 s (`usePlayOnEnter(ref, 7)`). The reader scrolls on when they are ready; the next cell plays when it arrives. No pinning, no GSAP.

Rules for anything you animate inside a cell:
- give it class `anim` (or `w` for streamed words) and `animation-name`
- keep `animation-duration` at 1s, or a delay+duration that adds up to ≤1s (the hook stretches that 1s to 7s on screen)
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
- `components/HiveCanvas.tsx` background lattice and glow; density follows scroll position
- `prototype/index.html` the static prototype this was ported from, kept for reference

## Before launch
Privacy page, cookie-free analytics, OG image, SPF/DKIM/DMARC for dev@codehives.se, test on a mid-range Android.
