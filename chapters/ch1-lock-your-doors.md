---
chapter: 1
title: Lock your doors
summary: Pre-work. Put passkeys or MFA on every account that can take down your app, set up a password manager, and get the lab running.
block: Before the session
duration_min: 20
deliverable: Completed hygiene checklist, plus the last line of npm run check from the lab app
review: self-check
---

# CH1 Lock your doors

This chapter opens when you register. Finish it before class day.
Class starts with the lab already running on your laptop, so nobody waits on Wi-Fi.

## Objective

By the end of this chapter:

- every account that can take down or leak your app has a passkey or MFA
- your passwords live in a password manager
- the LabShop lab app runs on your laptop

## Why it matters

Attackers rarely break your code first. They log in as you.
One phished GitHub or Supabase password gives them your source, your database, and your deploy button.

## Step 1: List your builder accounts (3 min)

Open [the hygiene checklist](../worksheets/hygiene-checklist.md) and fill in the account table.
Write down every service that holds part of your app:

| Account | Why an attacker wants it |
|---|---|
| Email (Google, Outlook) | Resets the password of every other account |
| GitHub | Source code, secrets in history, CI that deploys |
| Supabase or Firebase | Your users' data |
| Vercel, Netlify, or Cloudflare | Swap your site for a phishing page |
| Domain registrar | Point your domain anywhere |
| Stripe or another payment provider | Refunds, payouts, customer data |
| AI provider (Anthropic, OpenAI, Google) | API keys that bill you |

## Step 2: Turn on passkeys or MFA (7 min)

Work down the list in this order. Email comes first, because it resets everything else.

1. Add a **passkey** where the service offers one. Passkeys cannot be phished.
2. Where there is no passkey, use an **authenticator app**. Avoid SMS codes when an app option exists.
3. Save the recovery codes in your password manager, not in a screenshot.

Tick each account in the checklist as you finish it.

## Step 3: Use a password manager (4 min)

Install [Bitwarden](https://bitwarden.com/download/) or the manager you already trust.

Current NIST rules (SP 800-63B-4, 2025):

- A password used on its own must be at least **15 characters**.
- A password used together with MFA must be at least **8 characters**.
- Length beats symbols. Services must not force symbol rules or routine password changes.
- Change a password only when there is a sign it leaked.

Let the manager generate a unique password for every builder account. Never reuse one.

## Step 4: Install the tools (3 min)

| Tool | Check it works |
|---|---|
| [Node.js 24 LTS](https://nodejs.org/) (22.13 or later works) | `node -v` |
| [Git](https://git-scm.com/downloads) | `git --version` |
| [gitleaks](https://github.com/gitleaks/gitleaks#installing) | `gitleaks version` |
| [GitHub CLI](https://cli.github.com/) | `gh --version` |

On Windows, run every command in this course in Git Bash.

## Step 5: Run the lab (3 min plus install)

The lab app is LabShop, a small coffee shop. It is **deliberately vulnerable** and runs on your laptop only.

```bash
git clone {{REPO_URL}} ai-for-cybersecurity-101
cd ai-for-cybersecurity-101/lab
npm ci
npm run dev
```

The install takes about 2 minutes. Then:

1. Open http://127.0.0.1:3000. A red banner says the app is deliberately vulnerable.
2. Sign in as `alice@lab.test` with password `alice-lab-pass`.
3. In a second terminal, run `npm run check` from the `lab` directory. The last line reads `All flags as expected.`

Leave the lab on your laptop. Never deploy it.

## Optional: sign your commits

Signed commits prove a commit came from you. Follow [GitHub's SSH signing guide](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification).

## Deliverable

Submit in Tera:

1. Your hygiene checklist score: how many builder accounts have a passkey or MFA, out of how many.
2. The last line of `npm run check`.

## Self-check

- [ ] My email account has a passkey or MFA.
- [ ] GitHub and my database provider have a passkey or MFA.
- [ ] My recovery codes are in my password manager.
- [ ] The lab app opens at http://127.0.0.1:3000 and I can sign in as Alice.
- [ ] `npm run check` ends with `All flags as expected.`

Stuck on the lab install? Post the error in the class chat. A helper answers before class day.
