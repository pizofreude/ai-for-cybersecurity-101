# Pre-deploy checklist

App: ____________________ Release: ____________ Checked by: ____________________

One page, all ten OWASP Top 10:2025 categories. Run it before every launch and every big feature.

## OWASP Top 10:2025

| ID | Category | Check | Pass |
|---|---|---|---|
| A01 | Broken Access Control | RLS is on for every table, and Supabase Security Advisor shows no errors | [ ] |
| | | Every route that takes an ID returns another user's record as `404` or `403` | [ ] |
| | | Admin checks run on the server, never only in the browser | [ ] |
| A02 | Security Misconfiguration | No secret has a `NEXT_PUBLIC_`, `VITE_`, or `EXPO_PUBLIC_` prefix | [ ] |
| | | MDN HTTP Observatory grade is B or better | [ ] |
| | | CORS lists exact origins, never `*` on authenticated routes | [ ] |
| | | Debug mode, test routes, and sample data are off in production | [ ] |
| A03 | Software Supply Chain Failures | The lockfile is committed and CI installs with `npm ci` | [ ] |
| | | Every package added since the last release exists, is maintained, and was checked by a person | [ ] |
| | | The CI security workflow passed on this commit | [ ] |
| A04 | Cryptographic Failures | Passwords are handled by the auth provider, never hashed by our own code | [ ] |
| | | Every URL is HTTPS | [ ] |
| A05 | Injection | No SQL is built by joining strings with user input | [ ] |
| | | No user or model content goes through `dangerouslySetInnerHTML`, `v-html`, or `innerHTML` | [ ] |
| A06 | Insecure Design | Prices, credits, and roles come from the server, never from the request | [ ] |
| | | Signup, login, and AI endpoints are rate-limited | [ ] |
| A07 | Authentication Failures | Auth comes from a provider, not hand-rolled | [ ] |
| | | Admin and owner accounts use MFA | [ ] |
| A08 | Software or Data Integrity Failures | Every webhook verifies its signature before acting | [ ] |
| A09 | Security Logging and Alerting Failures | Sign-ins, admin actions, and payment events are logged | [ ] |
| | | Someone gets an alert on unusual volume or errors | [ ] |
| A10 | Mishandling of Exceptional Conditions | Errors fail closed: a failed check denies access | [ ] |
| | | Users see generic error messages, never stack traces, SQL, or keys | [ ] |

## AI features

| Check | Pass |
|---|---|
| No secret, key, or private business rule sits in a system prompt | [ ] |
| Model output is escaped before it reaches a page, a query, or a shell | [ ] |
| AI calls have a spend limit, a per-user rate limit, and a `max_tokens` cap | [ ] |

## Evidence log

Record the command and the result for each fix (CH4 asks for two).

| Check | Command or tool | Before | After |
|---|---|---|---|
| | | | |
| | | | |
| | | | |
