#!/usr/bin/env bash
# Build, serve the export (no -s: it would rewrite /new/ to /), run the Playwright checks, print failures, stop the
# server. The build goes to .next-build so a `next dev` that is running (the founder's, on :3000) keeps its .next
# intact. With a custom distDir, `output: "export"` writes the static site INTO that directory, not into out/, so
# that is what gets served. The server takes :4173 when :3000 is busy; the checks read the origin from CHECK_ORIGIN.
set -u
cd "$(dirname "$0")/.."
NEXT_DIST_DIR=.next-build npm run build 2>&1 | grep -E "error|✓ Compiled" || true
PORT=3000
if lsof -nP -iTCP:3000 -sTCP:LISTEN >/dev/null 2>&1; then PORT=4173; fi
pkill -f "serve .next-build -l $PORT" >/dev/null 2>&1 || true
(npx serve .next-build -l "$PORT" >/dev/null 2>&1 &)
sleep 2
export CHECK_ORIGIN="http://localhost:$PORT"
echo "checks against $CHECK_ORIGIN"
status=0
for f in checks/hero.mjs checks/cards.mjs checks/new.mjs; do
  echo "== $f"
  node "$f" 2>&1 | grep -v "^ok" || true
  node "$f" >/dev/null 2>&1 || status=1
done
pkill -f "serve .next-build -l $PORT" || true
exit $status
