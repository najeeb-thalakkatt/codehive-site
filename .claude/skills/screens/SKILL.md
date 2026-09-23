---
name: screens
description: Take headless screenshots of a section of codehive-site at 1280x720, 1440x900 and 375x812 (optionally after waiting for its animation) and read them. Use to look at a change before shipping or when the user asks "how does X look".
---

# Screenshots

`node checks/screens.mjs <selector> [waitMs]` against a server on port 3000 (`npx serve -s out -l 3000`
after a build, or the dev server). It scrolls the selector into view, waits `waitMs` (default 800;
use 8000 to see a card's text at its end state, 2500 for the hero shader), and writes
`checks/shots/screen-<width>.png` for the three viewports. Then Read the pngs.

Reading tips: the animation frames loop, so a card "end" shot is a random loop frame; the hero
needs `--use-gl=swiftshader` (the script sets it); Firefox cannot be launched by Playwright on this
Mac, so Firefox stays a manual check by the founder.
