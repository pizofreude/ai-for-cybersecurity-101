#!/bin/bash
# Scripted dry run of the student path. Run it on the trainer laptop before each class.
#   bash facilitator/dry-run.sh [work-dir]
# It clones this repository into work-dir (default: a temp directory), installs the lab,
# checks every flag is open, applies each reference fix from lab-fixed in order with its proof,
# checks every flag is closed, then checks reset --code reopens them. It stops any process on
# ports 3000 and 54321 first. Needs bash, git, node, npm, curl. Timings go to dry-run.log.
REPO=$(cd "$(dirname "$0")/.." && pwd)
WORK=${1:-$(mktemp -d)}
C=$WORK/dry-clone
LOG=$WORK/dry-run.log
: > "$LOG"
say() { echo "$*" | tee -a "$LOG"; }

stop_lab() {
  for port in 3000 54321; do
    if command -v lsof >/dev/null 2>&1; then
      lsof -ti "tcp:$port" -sTCP:LISTEN 2>/dev/null | xargs -r kill 2>/dev/null
    else
      for pid in $(netstat -ano | grep -E "127.0.0.1:$port .*LISTENING" | awk '{print $NF}' | sort -u); do
        taskkill //PID "$pid" //F >/dev/null 2>&1
      done
    fi
  done
  sleep 1
}

start_lab() {
  (cd "$C/lab" && npm run dev > "$WORK/dry-dev.log" 2>&1 &)
  for _ in $(seq 1 90); do
    curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/ 2>/dev/null | grep -q 200 && return 0
    sleep 1
  done
  return 1
}

failures=0
step() { # name, then command
  local name=$1; shift
  local t0=$(date +%s)
  "$@" >> "$LOG" 2>&1
  local code=$?
  [ "$code" -ne 0 ] && failures=$((failures + 1))
  say "$(printf '%-52s %4ss  %s' "$name" $(( $(date +%s) - t0 )) "$([ "$code" -eq 0 ] && echo PASS || echo "FAIL (exit $code)")")"
}

stop_lab
rm -rf "$C"
step "clone" git clone -q "$REPO" "$C"
cd "$C/lab" || exit 1
git fetch -q origin lab-fixed:lab-fixed
step "npm ci" npm ci --no-audit --no-fund
step "npm run dev to first page" start_lab
step "check: all 9 flags open" node scripts/check-flags.mjs

git switch -q -c dry-run-student
git config commit.gpgsign false
for sha in $(git log --reverse --format=%h --grep='^Fix F' main..lab-fixed); do
  subject=$(git log -1 --format=%s "$sha")
  flag=$(echo "$subject" | grep -oE 'F[0-9]' | head -1)
  step "apply: ${subject:0:44}" git cherry-pick -X theirs "$sha"
  restart=""
  git show --name-only --format= "$sha" | grep -qE 'emulator/|reset.mjs|next.config|proxy.js' && restart=1
  if [ "$flag" = F1 ]; then step "  rotate keys" node scripts/reset.mjs --rotate-keys; restart=1; fi
  if [ -n "$restart" ]; then stop_lab; step "  restart npm run dev" start_lab; fi
  step "  proof.sh $flag" sh scripts/proof.sh "$flag"
  step "  check $flag closed" node scripts/check-flags.mjs --expect fixed --only "$flag"
done

node scripts/reset.mjs >/dev/null
step "check: all 9 flags closed" node scripts/check-flags.mjs --expect fixed
step "reset -- --code" node scripts/reset.mjs --code
stop_lab
step "restart npm run dev" start_lab
step "check: all 9 flags open again" node scripts/check-flags.mjs
stop_lab

say ""
say "$([ "$failures" -eq 0 ] && echo "Dry run passed." || echo "Dry run: $failures step(s) failed. See $LOG")"
exit $((failures > 0))
