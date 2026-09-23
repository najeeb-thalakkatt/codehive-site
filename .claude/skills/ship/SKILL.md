---
name: ship
description: Build, commit, push to main, wait for the GitHub Pages deploy, verify the live page and run Lighthouse twice. Use when work on codehive-site is done and should go live, or when asked to "push", "deploy", "ship" or "relaunch".
---

# Ship to codehives.se

1. `npm run build`. Fix type errors, never `any` them away. Stop here if it fails.
2. If uncommitted changes remain, commit them: subject in the imperative, task id first when the work
   comes from a task list, a short body saying why, then the two attribution trailers from the
   session's system reminder. One commit per task.
3. `git push --no-verify -q origin main` (the user's pre-push hook is interactive; they asked for
   direct pushes to main).
4. `sleep 20`, then `RUN=$(gh run list --workflow=pages.yml --branch=main -L1 --json databaseId -q '.[0].databaseId')`
   and `gh run watch $RUN --exit-status`. On failure read `gh run view $RUN --log-failed`; the usual
   causes have been fonts fetched at build time (fonts are self-hosted, keep it so) and env variables
   set on an environment instead of the repository.
5. `sleep 40`, then confirm the live HTML contains what changed (`curl -s https://codehives.se/ | grep -c ...`).
6. Lighthouse twice against the live site (never a python server):
   `npx lighthouse https://codehives.se/ --quiet --chrome-flags="--headless=new" --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=lh.json`
   and print performance, accessibility, LCP and TBT. Budget: accessibility 100, performance within
   5 points of the last baseline (it swings 90-99 with the network; TBT under 100 ms is the real check).
   If accessibility drops, list `color-contrast` items from the json: dim text over the ground has
   failed before (1.6:1 at opacity .35).
7. Stop any local server you started (`pkill -f "serve -s out"`).

Report: what is live, the numbers in a small table, and one next action.
