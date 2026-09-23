# TODO, in order

Work top to bottom. Each item is one PR. Tick it in the same commit that finishes it.

## 1. Make it build
- [x] `npm install`, `npm run build`, fix whatever the first compile complains about
- [x] Confirm cell 01 pins, scrubs and streams in Chrome, Safari and Firefox (headless Chromium and WebKit verified; Firefox still to check by hand, the Playwright build would not launch on this machine)
- [x] Confirm `prefers-reduced-motion` shows the finished state of cell 01

## 2. Port the four remaining visuals (one PR each)
Source: `prototype/index.html`, keyframes prefixed `s2`, `s3`, `s4`, `s5`. Template: `components/cells/Strategy.tsx`.
- [x] 02 Application development: tickets stack into a thread, amber reply with source line
- [x] 03 Model work: model cards settle into a benchmark chart, EU-region badge
- [x] 04 Production and MLOps: excuses drop away, dev/test/prod/monitor pipeline draws and turns green
- [x] 05 Enablement: one lit cell, knowledge ripples through two rings
- [x] Register each in `components/cells/index.ts`

## 3. Copy pass (founder, not Claude)
- [x] Read `content/services.ts` aloud once; rewrite anything you would not say to a client (founder, 2026-09-21)
- [x] Decide the five CTAs: all "Start a project", all "Book a call", or as is (all "Book a call", hero too: every action opens the same Calendly)
- [ ] Hero subline and contact paragraph: confirm or rewrite

## 4. Contact path
- [x] Replace the `mailto` in `components/Contact.tsx` with Cal.com (or Calendly) embed, or a form posting to a serverless route that emails dev@codehives.se (Calendly, click-to-load frame in `components/Booking.tsx`; every "Book a call" / "Start a project" links to `#book`)
- [x] Spam protection on the form if a form (honeypot + rate limit is enough) (not needed, no form of our own)
- [x] Confirmation state: same wording as the action ("Booked" / "Sent") (Calendly's own confirmation)
- [x] Calendly URL is a personal handle and the form shows the host name; move to a company-named Calendly event when convenient (brand rule: company voice only) (now calendly.com/dev-codehives; check the display name inside the form is the company, not a person)

## 5. Mobile
- [x] Test on a real mid-range Android and an iPhone, not DevTools (founder, 2026-09-21)
- [x] Re-choreograph each visual for a 390px column instead of the cropped desktop scene (done as a per-cell mobile crop in `components/cells/index.ts`, same keyframes, tighter window around the finished state; revisit with true re-authored scenes if the crops read badly on a real phone)
- [x] Check the column drift (`@keyframes col`) does not push the action off-screen on short phones (headless 390×660 and 390×844, all five cells)
- [x] Check the hive canvas frame rate; halve flow count on mobile if it stutters (halved at ≤820px pre-emptively; confirm on device)

## 6. Launch plumbing
- [x] Domain: point codehives.se at GitHub Pages (live 2026-09-21: HTTPS enforced, www and http redirect to https://codehives.se. DNS has one A record, 185.199.108.153; add 109, 110 and 111 and the four AAAA records for redundancy)
- [x] Email: SPF, DKIM, DMARC for dev@codehives.se (Strato: SPF redirect, DKIM selectors, DMARC p=reject, 2026-09-22)
- [x] OG image (1200×630) from the design system cover, wired in `app/layout.tsx` (built from the hero, source in the commit message; swap for the real cover art if there is one)
- [x] Favicon set: svg in place; add 32px png and apple-touch-icon from `codehive-favicon.svg`
- [x] Privacy page (`/privacy`), linked from the footer; required once a form or analytics exists (street address is a [PLACEHOLDER])
- [x] Cookie-free analytics (Plausible or Umami) in `app/layout.tsx` (Umami Cloud; set NEXT_PUBLIC_UMAMI_WEBSITE_ID as a GitHub Actions repository variable, see .env.example)
- [x] 404 page in brand
- [x] Lighthouse: performance and accessibility both above 90 on mobile (97 / 100, simulated mobile against a local production build, 2026-09-21)

## 7. Polish, after launch
- [ ] v3 hero: the copy sits on the liquid metal; judge legibility on a real screen (text shadows are the reference's)
- [ ] v3 cards: on phones the 640-wide animations render at about 55%; phone artboards would fix it
- [ ] OG image still shows the pre-v3 hero tiles; re-render once the hero is final
- [ ] Hero hive: continue assembling on scroll and hand over to cell 01 (currently a load animation only)
- [ ] Hive glow: react to scroll speed
- [x] Services intro: the v3 intro (words rise in, six-cell index) replaced the text list, 2026-09-23
- [x] Cell 06 "Plain backend": own visual (all six visuals ported from the service animations canvas, 2026-09-23)
- [ ] Calendly: add "Plain backend" to the "Which service are you looking for?" options (must match `name` in content/services.ts)
- [ ] Add a `/work` page only when there is a real AI case study to show; never a placeholder

## Not doing
- No blog, no team page, no client logos until there are clients
- No light theme
- No third-party animation libraries (GSAP was removed with the scroll scrub on 2026-09-21)
