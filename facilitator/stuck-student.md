# Stuck-student steps

For helpers. Find the symptom, run the fix, move on within 2 minutes.
If a lab still fails after 2 minutes, pair the student with a neighbour and fix it during the next exercise.

## Any lab: the 30-second triage

Run these from the student's `lab` directory, in order:

| # | Command | Expect |
|---|---|---|
| 1 | `git branch --show-current` | `main` |
| 2 | `node -v` | `v22.13` or later |
| 3 | `npm run check` | A list of PASS lines. If it says "The lab is not running", see Setup below |

## Setup and running

| Symptom | Fix |
|---|---|
| `npm ci` fails with `EBADENGINE` or syntax errors | Node is too old. Install Node 24 LTS, reopen the terminal |
| `npm ci` cannot reach the registry | Use the USB cache for the student's platform: `npm ci --offline --cache <usb>/npm-cache-<platform>` |
| `lab/.env.local is missing` | `npm run setup` |
| `Supabase emulator did not start on 127.0.0.1:54321` | Another process holds the port. Windows: `netstat -ano \| findstr :54321`, then end that PID in Task Manager. macOS or Linux: `lsof -i :54321`, then `kill <pid>` |
| Port 3000 already in use | As above for port 3000. Often an old `npm run dev` in another terminal |
| Commands fail on Windows with `'sh' is not recognized` | The student is in PowerShell or CMD. Open Git Bash |
| Sign-in says "Invalid login credentials" | Password is `alice-lab-pass`. If it still fails: `npm run reset` |
| The page shows old behaviour after a fix | Hard-refresh the browser. If the fix touched `emulator/` or `.env.local`, stop and rerun `npm run dev` |
| The lab is in a mess | `npm run reset -- --code`. It stashes the student's edits first: `git stash pop` brings them back |

## Per flag

| Flag | Symptom | Fix |
|---|---|---|
| F1 | No `service_role` in the bundle before the fix | The student already rotated or edited. `npm run reset -- --code`, then `npm run reset -- --rotate-keys`, restart `npm run dev`, open `/admin` once |
| F1 | After the fix, the page breaks with a `server-only` error | A client component still imports `lib/supabase-server.js`. The admin page must call `/api/admin/stats` instead |
| F1 | After the fix, `proof.sh F1` still shows `service_role` | Restart `npm run dev`. Next.js inlines env values at compile time |
| F2 | After the fix, the anon key still lists 4 notes | The emulator was not restarted. Stop and rerun `npm run dev` |
| F2 | After the fix, Alice sees no notes at all | The agent removed the `select` policy. Compare with `git diff main lab-fixed -- lab/emulator/policies.mjs` |
| F3 | Exploit returns 401 | The token is empty. Check the `TOKEN=` line printed something. The password is `alice-lab-pass` |
| F4 | Pages go blank after adding the CSP | Console shows CSP errors. Dev mode needs `'unsafe-eval'` in `script-src`. Compare with `lab-fixed/proxy.js` |
| F4 | CORS header still `*` | The header comes from `lib/http.js`, not `next.config.mjs` |
| F5 | The payload shows as text before any fix | The student is on `lab-fixed`. `git switch main` |
| F5 | Old payloads still pop alerts after the fix | Hard-refresh. Then `npm run reset` to clear stored reviews |
| F6 | The UNION payload returns a SQL error | The column count is wrong. The query selects three columns: `id, code, percent_off` |
| F7 | Signed test request fails after the fix | The signature must cover the raw body bytes exactly. Sign `<t>.<body>` with `LAB_WEBHOOK_SECRET` from `.env.local` |
| F8 | KopiBot refuses the injection | `ANTHROPIC_API_KEY` is set and Claude refused. Good teaching moment. For the flag, send `"model":"simulated"` with curl, or clear the key and restart |
| F8 | Indirect route does not leak | The question must mention "review", and the injected review must be on a product |
| F9 | No alert appears | A browser extension blocks it, or the student is on `lab-fixed`. Check `reply_html` with `sh scripts/proof.sh F9` |

## Own app (CH4, CH5, CH6)

| Symptom | Fix |
|---|---|
| The student has no app of their own | Use LabShop as "their app" for the CH4 checks, and their personal GitHub account for CH6 |
| The student wants to test a site they do not own | Stop them. Computer Crimes Act 1997 s.3. Point at the rules of engagement on the table |
| Supabase Security Advisor is empty | It needs the project's database to be reachable. Have them open Table Editor first, then the Advisor |
| The security workflow does not appear in Actions | The file must be at `.github/workflows/security.yml` on the default branch, and Actions must be enabled for the repository |
| gitleaks fails in CI on a test fixture | Add a `.gitleaksignore` entry with the finding's fingerprint, and write the reason in the submission |
| The agent kit tests pass but the agent still reads `.env` | Claude Code: the file must be `.claude/settings.json` in the repository root. Restart the agent session |
