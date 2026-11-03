## Objective

By the end of this chapter:

- you have exploited and fixed six LabShop flags across four OWASP categories
- you can name a failure and a fix for all ten OWASP Top 10:2025 categories
- you have run two of the checks against your own app

## Steps

### The lab loop

Every lab today runs the same five steps:

1. **Attack**: paste the card's attacker prompt into your coding agent.
2. **Exploit**: run the attack and capture the flag or the evidence.
3. **Fix**: paste the fixer prompt. Read the diff before you accept it.
4. **Restart** `npm run dev` if the fix touched `emulator/` or `.env.local`.
5. **Prove**: run `sh scripts/proof.sh <flag>`. The output must change.

Out of time on a lab? Run `git diff main lab-fixed -- lab/` to see the reference fix, then move on.
Broke the lab? Run `npm run reset -- --code`. Your edits are saved in `git stash`.

Cap: 2 min

### Lab A01 Broken Access Control

The number one category. It is how Moltbook, Lovable apps, and the Tea app leaked.

- **F2** - [card](https://github.com/pizofreude/ai-for-cybersecurity-101/blob/main/cards/F2-rls-off.md): read Bob's private notes with only the public `anon` key.
- **F3** - [card](https://github.com/pizofreude/ai-for-cybersecurity-101/blob/main/cards/F3-idor.md): signed in as Alice, change an order ID and read Bob's address.

Proof: `sh scripts/proof.sh F2 F3`. After the fix, the anon key sees only public notes, and order 1002 returns `404`.

Cap: 10 min

### Lab A02 Security Misconfiguration

- **F4** - [card](https://github.com/pizofreude/ai-for-cybersecurity-101/blob/main/cards/F4-headers-cors.md): LabShop sends no security headers, and its API lets any website call it.

Proof: `sh scripts/proof.sh F4`. After the fix you see a `content-security-policy` header and no `access-control-allow-origin` for `https://evil.example`.

For your own deployed app, scan it at [MDN HTTP Observatory](https://developer.mozilla.org/en-US/observatory).
The AIMTO course site scores A+ (130/100) with the same kind of headers.

Cap: 6 min

### Lab A05 Injection

- **F5** - [card](https://github.com/pizofreude/ai-for-cybersecurity-101/blob/main/cards/F5-stored-xss.md): post a review that runs JavaScript in every visitor's browser.
- **F6** - [card](https://github.com/pizofreude/ai-for-cybersecurity-101/blob/main/cards/F6-sql-injection.md): make the product search dump the hidden coupons table.

Proof: `sh scripts/proof.sh F5 F6`. After the fix, the review shows as text (`&lt;img`), and the search returns `[]`.

Cap: 10 min

### Lab A08 Software or Data Integrity Failures

- **F7** - [card](https://github.com/pizofreude/ai-for-cybersecurity-101/blob/main/cards/F7-unsigned-webhook.md): mark your own order as paid with a fake payment webhook.

Proof: `sh scripts/proof.sh F7`. After the fix, the unsigned request gets `401 Invalid signature`.

Cap: 7 min

### Lightning round: the other six

| Category | How AI-built apps fail | The fix |
|---|---|---|
| A03 Software Supply Chain Failures | The agent installs a package that does not exist yet, or a hijacked release | Check every new package on npmjs.com before installing. Commit the lockfile. Use `npm ci`. |
| A04 Cryptographic Failures | Homemade token or password hashing, plain HTTP links | Use your platform's auth. Never write your own crypto. HTTPS everywhere. |
| A06 Insecure Design | The browser sends the price, or free credits have no rate limit | The server decides prices, credits, and limits. Never trust a number from the client. |
| A07 Authentication Failures | Hand-rolled login, no lockout, magic links that never expire | Use Supabase Auth, Clerk, or your platform's auth. Turn on MFA for admins. |
| A09 Security Logging and Alerting Failures | Nobody notices a breach for months | Log sign-ins and admin actions. Set an alert for unusual volume. |
| A10 Mishandling of Exceptional Conditions | Errors fail open, or show stack traces and SQL to users | Fail closed. Log the detail on the server, show a generic message. |

A10 is live in LabShop: search for a single `'` and read the error. F6's fix also closes it.

Cap: 7 min

### Your own app

Pick the two checks that match your three fears from CH2:

| Check | Command or tool |
|---|---|
| RLS on every table | Supabase dashboard, then Advisors, then Security Advisor. Then query a table with only the publishable key: `curl "https://<project>.supabase.co/rest/v1/<table>?select=*&limit=3" -H "apikey: <publishable key>"` |
| IDOR | Sign in as a test user, request another test user's record by ID. Expect `404` or `403`. |
| Security headers | [MDN HTTP Observatory](https://developer.mozilla.org/en-US/observatory) on your deployed URL |
| Webhook signature | Send your webhook endpoint a request with no signature header. Expect `400` or `401`. |
| Injection | Search every raw SQL string and every `dangerouslySetInnerHTML` or `v-html` in your code |

Record the command and its output before and after your fix in the [pre-deploy checklist](https://github.com/pizofreude/ai-for-cybersecurity-101/blob/main/worksheets/pre-deploy-checklist.md).
Test only your own app, with test accounts.

Cap: 8 min

## Checkpoint

Submit in Tera:

1. The output of `sh scripts/proof.sh F2 F3 F4 F5 F6 F7` after your fixes.
2. For your own app: two checks, each with the command and its output before and after.

**Self-check**

- [ ] F2 to F7 are closed in my lab.
- [ ] I can name a failure and a fix for all ten categories.
- [ ] I ran two checks on my own app, using test accounts only.
- [ ] Each own-app fix has before and after evidence.
