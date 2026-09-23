---
name: init-session
description: Start a codehive-site session - load the repo conventions, check git, the last GitHub Pages deploy and the live site, build, and list what is open. Use at the start of any session on codehives.se, or when asked "status".
---

# Init: codehive-site session

Run `bash scripts/status.sh` first (git state, last deploy, live sanity, open TODOs), then read
`CLAUDE.md` (architecture, brand and copy rules) before touching anything. Report in five lines or
fewer: branch and last commit, deploy state, live sanity, open items, what the user asked for.

## Conventions that were settled in earlier sessions (do not re-derive)
- Pushes go straight to `main`. The user's global pre-push hook asks an interactive question, so
  push with `git push --no-verify`. Every push deploys via `.github/workflows/pages.yml`; watch it with
  `gh run watch <id> --exit-status`.
- Every commit ends with the two attribution trailers from the session's system reminder
  (`Co-Authored-By: Claude ...` and `Claude-Session: ...`).
- Pasted task lists (`CLAUDE_TASKS_*.md`) get one commit per task, task id first in the subject
  (`T3 services heading: ...`). Copy is pasted byte-exact from the copy file, never paraphrased.
  Use the `apply-tasks` skill.
- Verification is `npm run build` plus the Playwright scripts in `checks/` (`check` skill) plus a
  look at screenshots (`screens` skill). Lighthouse is only meaningful against the live site or a
  gzip server (`npx serve -s out`); `python3 -m http.server` inflates LCP. Live scores swing 90-99
  from network variance; TBT is the stable number.
- The user judges visuals by eye: for anything subjective (shade, shadows, spacing) offer a local
  variants page (`variants` skill) rather than a metric.
- Brand: buttons are pills (`--radius-pill`), hexagons are never rounded, inline actions are `.act`.
  One amber accent; ink on dark over the honey. No hex codes in components, tokens only.
- Content: `content/services.ts` (`SERVICES`) is the only place a service number, name or word is
  typed. Calendly's "Which service" options must match `name` exactly.
- Do not edit `prototype/index.html`; do not add dependencies without a reason in the commit.

## Where things are
- Live: https://codehives.se (GitHub Pages, custom domain via `public/CNAME`).
- Design references: `site-v3/` packages the founder sends (zip in `~/Downloads`), unpacked in the
  scratchpad; the "Codehive service animations" canvas https://claude.ai/artifact/MtLje9ahfF4WvAN5wReE61.
- Booking: `components/Booking.tsx`, Calendly `dev-codehive/30min`, prefilled via `a1`.
- Analytics: Umami, repository variable `NEXT_PUBLIC_UMAMI_WEBSITE_ID`.
