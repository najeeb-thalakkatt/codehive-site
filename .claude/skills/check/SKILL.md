---
name: check
description: Run the codehive-site Playwright checks (swarm formations and particle counts, service figures and their overlays, play-once text, phone overflow, Pause motion, reduced motion) against a fresh build served with gzip. Use after any change to the swarm, the service blocks, the figures or the play hook, and before shipping.
---

# Headless checks

`bash scripts/run-checks.sh` builds into `.next-build/` (never into `.next`: that breaks a running dev
server), serves it with `npx serve` (gzip, like the live host; port 4173 when 3000 is busy), runs
`checks/page.mjs`, prints only failures, and stops the server. Playwright is a dev dependency; run `npx playwright install chromium` once per machine.
The scripts write screenshots to `checks/shots/`; read the relevant ones with the Read tool after a
failure, or use the `screens` skill for a targeted look.

What the check covers (`page.mjs`, the home page):
- the swarm settles within 5 s, the logo cell is drawn in its column with 8000 particles, the services
  index holds six hives that wander;
- blocks 02, 04, 06: fit at 1280x720, the swarm holds the block's figure with the base 2400 particles, the
  overlay's paused animations are scrubbed by the swarm, the text plays on entry and finishes in 4 s, the
  figure is drawn (looked for across its loop: a story can start dim);
- the cell forms again at contact, the nav pill appears past the hero, no horizontal overflow at 375,
  "Pause motion" and reduced motion draw the still finished state.
`hero.mjs` and `cards.mjs` test the previous page (v3) and are not run.

Rules learned the hard way:
- Particles live in viewport space: after an instant scroll they need about 1.5 s to fly to the new figure.
  Screenshot or read the canvas only after that wait.
- The swarm measures its anchors in document space; a check that changes layout must wait a frame.
- Screenshot before injecting test styles; `color: revert` on links turns them blue in the shot.
- A card that is already on screen when a previous check ends will have played early; scroll away
  first or check a later card.
- Element screenshots of the animation frame at "end" show a mid-loop frame, because it loops.
- `getAnimations()` once per subtree, never per element (a second of main-thread time on phones).
