---
name: check
description: Run the codehive-site Playwright checks (hero contrast and snippets, card fit, play-once text, loop policy, phone overflow, reduced motion) against a fresh build served with gzip. Use after any change to the hero, cards, animations or the play hook, and before shipping.
---

# Headless checks

`bash scripts/run-checks.sh` builds, serves `out/` on port 3000 with `npx serve` (gzip, like the
live host), runs `checks/hero.mjs` and `checks/cards.mjs`, prints only failures, and stops the
server. Playwright is a dev dependency; run `npx playwright install chromium` once per machine.
The scripts write screenshots to `checks/shots/`; read the relevant ones with the Read tool after a
failure, or use the `screens` skill for a targeted look.

What the checks cover, so you know which one to trust:
- `hero.mjs`: luminance behind the copy block (< 45%), per-line contrast vs the brightest and darkest
  pixel behind it with shadows rendered (the brightest-pixel line is informational: the cream streak
  cannot reach 4.5:1 with the agreed shade, the user accepted that by eye), two pill buttons >= 48px,
  every drifting snippet centre inside the cell hexagon, and reveal pacing at 700 px/s.
- `cards.mjs`: page height vs live, six intro links in order, intro plays and finishes, every card
  <= 680px tall at 1280x720, text plays on entry and finishes in 8 s, loops run in view and pause off
  screen, no horizontal overflow at 375, reduced motion parks everything at the end state.

Rules learned the hard way:
- Screenshot before injecting test styles; `color: revert` on links turns them blue in the shot.
- A card that is already on screen when a previous check ends will have played early; scroll away
  first or check a later card.
- Element screenshots of the animation frame at "end" show a mid-loop frame, because it loops.
- `getAnimations()` once per subtree, never per element (a second of main-thread time on phones).
