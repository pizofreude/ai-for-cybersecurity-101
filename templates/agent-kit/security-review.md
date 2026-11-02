# Security review before commit

Paste this into your coding agent before each commit, or run `/ship-review` in Claude Code.

```text
Review my staged changes for security problems before I commit. Do not edit any file.

1. Run: git diff --cached
   If nothing is staged, say so and stop.
2. Read SECURITY-RULES.md in the repository root.
3. Check every changed line against those rules. Look hardest for:
   - a secret, key, or token in code, config, tests, or logs
   - a secret given a public prefix (NEXT_PUBLIC_, VITE_, EXPO_PUBLIC_)
   - a table, route, or query that skips row-level security or an ownership check
   - user or model input reaching SQL, HTML, a shell, eval, or a file path
   - a webhook handler that acts before verifying the signature
   - prices, roles, or limits taken from the request
   - errors that fail open or show internal detail to users
   - a new dependency: does it exist, is it the intended package, is it maintained?
   - secrets or private data placed in an AI prompt
4. Never print a secret value. Write [REDACTED] and give the file and line.

Reply in this shape:

Verdict: PASS or BLOCK
| Rule | File:line | Problem | Fix |
|---|---|---|---|

BLOCK if any row is a secret, a missing access check, or injection. Otherwise PASS, and list
lower-risk notes in the table. Keep it under 20 rows. Say "No findings" when the table is empty.
```
