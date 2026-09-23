#!/usr/bin/env bash
# Build, serve out/ with gzip on :3000, run the Playwright checks, print failures, stop the server.
set -u
cd "$(dirname "$0")/.."
npm run build 2>&1 | grep -E "error|✓ Compiled" || true
(npx serve -s out -l 3000 >/dev/null 2>&1 &)
sleep 2
status=0
for f in checks/hero.mjs checks/cards.mjs; do
  echo "== $f"
  node "$f" 2>&1 | grep -v "^ok" || true
  node "$f" >/dev/null 2>&1 || status=1
done
pkill -f "serve -s out" || true
exit $status
