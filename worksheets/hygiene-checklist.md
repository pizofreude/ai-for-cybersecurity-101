# Hygiene checklist

Name: ____________________ Date: ____________

Fill this in during CH1 pre-work. Your score goes into the CH1 deliverable.

## 1. Builder accounts

Email comes first: it resets the password of every other account.

| Account | Service I use | Passkey | Authenticator app | SMS only | Recovery codes in password manager |
|---|---|---|---|---|---|
| Email | | [ ] | [ ] | [ ] | [ ] |
| Code hosting (GitHub) | | [ ] | [ ] | [ ] | [ ] |
| Database and auth (Supabase, Firebase) | | [ ] | [ ] | [ ] | [ ] |
| Hosting (Vercel, Netlify, Cloudflare) | | [ ] | [ ] | [ ] | [ ] |
| Domain registrar | | [ ] | [ ] | [ ] | [ ] |
| Payments (Stripe, others) | | [ ] | [ ] | [ ] | [ ] |
| AI provider (Anthropic, OpenAI, Google) | | [ ] | [ ] | [ ] | [ ] |
| Other: | | [ ] | [ ] | [ ] | [ ] |

**Score:** ____ accounts with a passkey or authenticator app, out of ____ accounts.

SMS codes beat nothing, but SIM-swap attacks defeat them. Move to an app or a passkey where the service allows it.

## 2. Passwords

Rules from NIST SP 800-63B-4 (2025):

| Rule | Me |
|---|---|
| Every builder account has a unique password | [ ] |
| A password used without MFA is at least 15 characters | [ ] |
| A password used with MFA is at least 8 characters (longer is better) | [ ] |
| My password manager generates them | [ ] |
| I change a password when there is a sign it leaked, not on a timer | [ ] |

Password manager I use: ____________________

## 3. Build laptop

| Check | Me |
|---|---|
| The operating system and browser are up to date | [ ] |
| No cracked software, no unknown browser extensions | [ ] |
| The disk is encrypted (BitLocker, FileVault, LUKS) | [ ] |
| The screen locks after a few minutes | [ ] |
| I review GitHub and Google "authorised apps" and remove ones I do not use | [ ] |

## 4. Lab ready

Fill this in last. CH1 Step 4 installs the tools, and Step 5 starts the lab.

| Check | Me |
|---|---|
| `node -v` prints 22.13 or later | [ ] |
| `git --version`, `gitleaks version`, and `gh --version` all work | [ ] |
| The lab opens at http://127.0.0.1:3000 and I can sign in as `alice@lab.test` with password `alice-lab-pass` (a fake test account in the lab) | [ ] |
| `npm run check` ends with `All flags as expected.` | [ ] |

## 5. Optional

| Check | Me |
|---|---|
| My git commits are signed (SSH signing) | [ ] |
| GitHub shows my commits as "Verified" | [ ] |
