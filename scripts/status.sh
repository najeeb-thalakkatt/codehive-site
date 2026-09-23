#!/usr/bin/env bash
# Session-start status for codehive-site: git, last deploy, live sanity, open TODOs.
set -u
cd "$(dirname "$0")/.."
echo "== git"; git status -sb | head -5; git log --oneline -5 | cat
echo "== last deploy"; gh run list --workflow=pages.yml --branch=main -L1 --json status,conclusion,createdAt,headSha -q '.[0] | "\(.status) \(.conclusion) \(.createdAt) \(.headSha[0:7])"' 2>/dev/null || echo "gh not available"
echo "== live"; H=$(curl -s https://codehives.se/ || true)
for s in "Six services" "cell-06" "hero-title" "Book a call"; do printf "%-18s %s\n" "$s" "$(printf '%s' "$H" | grep -c "$s")"; done
echo "== open TODO"; grep -n "^- \[ \]" TODO.md | head -12
echo "== deps"; node -p 'const p=require("./package.json");Object.keys(p.dependencies).join(" ")'
