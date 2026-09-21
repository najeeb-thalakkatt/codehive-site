# codehives.se

Next.js 15 (App Router) + GSAP ScrollTrigger. One page. Dark only. Static export, served by GitHub Pages at codehives.se.

## Run
```
npm install
npm run dev        # http://localhost:3000
```
Deploy: every push to `main` runs `.github/workflows/pages.yml`, which builds the static export (`out/`) and publishes it to GitHub Pages. `public/CNAME` pins the custom domain. Fonts are self-hosted by `next/font` at build time. Analytics: set the repository variable `NEXT_PUBLIC_UMAMI_WEBSITE_ID`; unset means no analytics script.

## Making changes
Small, safe change: commit on `main`, push, live in about a minute. Anything you want to look at first: branch, push, open a pull request; the workflow builds it as a check, merge when green, and the merge deploys. To undo a bad deploy, `git revert` the commit and push; the revert deploys the previous state. Preview locally with `npm run dev` (hot reload) or `npm run build && npx serve out` (exactly what ships).

## How the scroll works
Each service cell is `components/Cell.tsx`. Its motion is plain CSS `@keyframes`, authored on a 0–100% timeline that equals the cell's scroll progress. `lib/useScrub.ts` pins the section with ScrollTrigger and, on every scroll update, sets `currentTime` on every paused animation inside it (Web Animations API). ScrollTrigger's `scrub: 1.2` is the smoothing; raise it for lazier motion, lower for tighter. Each cell pins for 1.8 viewport heights (`useScrub(ref, 1.8)`); more distance means slower, calmer streaming.

Rules for anything you animate inside a cell:
- give it class `anim` (or `w` for streamed words) and `animation-name`
- keep `animation-duration` at 1s, or a delay+duration that adds up to ≤1s
- animate transform and opacity where you can; colour and stroke changes work but cost more on weak phones

Text streams in via `components/Stream.tsx`: each word is a span with an `animation-delay` between t0 and t1. All words are always in the DOM, so screen readers read the full text.

The cell visual is authored on a 1280×800 canvas (same coordinates as the design mockups). `Cell.tsx` shows the 720×520 region at (560,100) scaled to the column width, and compresses the visual's timeline into the second half of the scroll (`.viz .anim { animation-delay: .5s; animation-duration: .499s }`).

## What is wired and what is not
- All five cell visuals are ported and registered in `components/cells/index.ts`. Each is `<Name>.tsx` + `<name>.css` next to it; `Strategy.tsx` is the simplest one to copy for a new cell.
- Mobile is still the cropped desktop scene for every cell (see TODO 5).
- Contact is a `mailto`. Replace with Cal.com or a form before launch.
- No analytics. Add Plausible or Umami in `app/layout.tsx`.
- Mobile: the visual is a crop of the desktop scene. A re-choreographed mobile variant per cell is still to do.

## Where things live
- `content/cells.ts` all copy for the five cells
- `styles/tokens.css` the design tokens (mirror of the Codehive design system)
- `components/HiveCanvas.tsx` background lattice and glow; density follows scroll position
- `prototype/index.html` the static prototype this was ported from, kept for reference

## Before launch
Privacy page, cookie-free analytics, OG image, SPF/DKIM/DMARC for dev@codehives.se, test on a mid-range Android.
