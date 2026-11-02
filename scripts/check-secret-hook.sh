#!/bin/sh
# Check that the pre-commit hook blocks a planted fake key and allows a clean commit.
# Runs in a throwaway repo, so this clone's index and history are never touched.
set -u
root="$(git rev-parse --show-toplevel)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

git init -q "$tmp"
git -C "$tmp" config core.hooksPath "$root/.githooks"

# Fake GitHub token, random on every run. It matches the gitleaks github-pat rule and grants nothing.
fake="ghp_$(LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | head -c 36)"
printf 'GITHUB_TOKEN=%s\n' "$fake" > "$tmp/config.js"
git -C "$tmp" add config.js
if git -C "$tmp" commit -q -m "planted key" >/dev/null 2>&1; then
  echo "FAIL: hook allowed a commit containing a fake key"
  exit 1
fi
echo "PASS: hook blocked the planted fake key"

git -C "$tmp" rm -q --cached config.js
printf 'export const greeting = "hello";\n' > "$tmp/clean.js"
git -C "$tmp" add clean.js
if ! git -C "$tmp" commit -q -m "clean file" >/dev/null 2>&1; then
  echo "FAIL: hook blocked a clean commit"
  exit 1
fi
echo "PASS: hook allowed a clean commit"
