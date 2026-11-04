# Dry run record

## Scripted dry run, 2026-11-02

`bash facilitator/dry-run.sh` on Windows 10, Node 24.21.0, fresh clone, warm npm cache.
It replays the student path with the reference fixes. Result: **every step passed**.

| Chapter | Mechanical steps | Measured | Chapter budget |
|---|---|---|---|
| CH1 | clone, `npm ci`, first page, `npm run check` | 94 s (120 s with an empty npm cache, see [install-timing.md](install-timing.md)) | 20 min |
| CH3 | F1 fix, rotate keys, restart, proof, check | 11 s | 35 min |
| CH4 | F2-F7 fixes, 2 restarts, proofs, checks | 30 s | 50 min |
| CH5 | F8, F9 and the F8 follow-up fixes, proofs, checks | 5 s | 35 min |
| Reset | `reset -- --code`, restart, all flags open again | 15 s | n/a |

Restarts cost 6 to 9 seconds each. CH3 (F1) and CH4 (F2, F4) need one each.

## Scripted dry run from GitHub, 2026-11-04

Anonymous clone of https://github.com/pizofreude/ai-for-cybersecurity-101 (`main` at `55c13c4`, `lab-fixed` at `a04c572`), then `bash facilitator/dry-run.sh <dir>` from that clone.
Result: **every step passed** in 2 min 38 s. `npm ci` took 74 s, restarts 4 to 7 s.

Found: given a work directory that did not exist, the script failed at the first step. It now creates the directory.

## Overruns found and fixed

| Found | Fix | Rerun |
|---|---|---|
| `reset -- --code` left all nine flags closed when the fixes had been committed | `reset.mjs` now restores `lab/` from `origin/main` and rewrites keys (commit "Make reset --code reopen every flag after committed fixes") | Full dry run passed, all nine flags open again after reset |
| Browser sign-in failed: the emulator's CORS rejected the `x-supabase-api-version` header | Emulator echoes the requested headers (commit "Allow supabase-js preflight headers in the emulator") | Browser sign-in and every page checked |
| CH4 step minutes added up to 52, not 50 | A02 lab cut to 6 minutes. `check-content` now fails when step minutes do not match a chapter's duration | `check-content` PASS |

## Not measured

The script measures the machine, not the people. Not covered:

- Reading time, prompting the coding agent, and reviewing its diff. These fill most of each chapter's budget.
- Room effects: questions, helper load, slow laptops, Wi-Fi.
- The Claude, Cursor, and Codex agents writing the fixes. The script applies the reference fixes.

Before the first cohort, run one timed pass with a person who has not seen the course. Follow the [end-to-end test](e2e-test.md): it covers Tera, the tester's own agent, and the clock time per chapter.
