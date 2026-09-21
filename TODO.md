# TODO, in order

Work top to bottom. Each item is one PR. Tick it in the same commit that finishes it.

## 1. Make it build
- [ ] `npm install`, `npm run build`, fix whatever the first compile complains about
- [ ] Confirm cell 01 pins, scrubs and streams in Chrome, Safari and Firefox
- [ ] Confirm `prefers-reduced-motion` shows the finished state of cell 01

## 2. Port the four remaining visuals (one PR each)
Source: `prototype/index.html`, keyframes prefixed `s2`, `s3`, `s4`, `s5`. Template: `components/cells/Strategy.tsx`.
- [ ] 02 Application development: tickets stack into a thread, amber reply with source line
- [ ] 03 Model work: model cards settle into a benchmark chart, EU-region badge
- [ ] 04 Production and MLOps: excuses drop away, dev/test/prod/monitor pipeline draws and turns green
- [ ] 05 Enablement: one lit cell, knowledge ripples through two rings
- [ ] Register each in `components/cells/index.ts`

## 3. Copy pass (founder, not Claude)
- [ ] Read `content/cells.ts` aloud once; rewrite anything you would not say to a client
- [ ] Decide the five CTAs: all "Start a project", all "Book a call", or as is
- [ ] Hero subline and contact paragraph: confirm or rewrite

## 4. Contact path
- [ ] Replace the `mailto` in `components/Contact.tsx` with Cal.com (or Calendly) embed, or a form posting to a serverless route that emails dev@codehives.se
- [ ] Spam protection on the form if a form (honeypot + rate limit is enough)
- [ ] Confirmation state: same wording as the action ("Booked" / "Sent")

## 5. Mobile
- [ ] Test on a real mid-range Android and an iPhone, not DevTools
- [ ] Re-choreograph each visual for a 390px column instead of the cropped desktop scene (hex radius 40, shorter labels, nothing entering from off-frame unless intended)
- [ ] Check the column drift (`@keyframes col`) does not push the action off-screen on short phones
- [ ] Check the hive canvas frame rate; halve flow count on mobile if it stutters

## 6. Launch plumbing
- [ ] Domain: point codehives.se at Vercel, www redirect, HTTPS
- [ ] Email: SPF, DKIM, DMARC for dev@codehives.se (do this before any outreach)
- [ ] OG image (1200×630) from the design system cover, wired in `app/layout.tsx`
- [ ] Favicon set: svg in place; add 32px png and apple-touch-icon from `codehive-favicon.svg`
- [ ] Privacy page (`/privacy`), linked from the footer; required once a form or analytics exists
- [ ] Cookie-free analytics (Plausible or Umami) in `app/layout.tsx`
- [ ] 404 page in brand
- [ ] Lighthouse: performance and accessibility both above 90 on mobile

## 7. Polish, after launch
- [ ] Hero hive: continue assembling on scroll and hand over to cell 01 (currently a load animation only)
- [ ] Hive glow: react to scroll speed
- [ ] Services intro: consider removing the "Five things we do" heading if the cells carry it
- [ ] Add a `/work` page only when there is a real AI case study to show; never a placeholder

## Not doing
- No blog, no team page, no client logos until there are clients
- No light theme
- No third-party animation libraries beyond GSAP
