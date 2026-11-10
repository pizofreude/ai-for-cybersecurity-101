## Objective

By the end of this chapter:

- you can tell a public key from a secret key in your own app
- your git history has no live secrets in it
- your coding agent cannot read your `.env` file

## Steps

### Where each secret belongs

| Secret | Where it lives | Never |
|---|---|---|
| Your own passwords and recovery codes | Password manager | Notes app, screenshots, chat |
| App secrets (database, payment, AI keys) | `.env` file listed in `.gitignore`, or a secrets manager such as Infisical | Committed to git, pasted into an AI chat |
| Production secrets | The hosting platform's environment settings | On a shared laptop or in a Slack message |

Share the problem with your AI agent, never the secret.
"My Supabase call returns 401" is enough. The key itself adds nothing and leaks forever.

Cap: 5 min

### Public keys and secret keys

Any variable with these prefixes is **copied into the JavaScript every visitor downloads**:

| Framework | Public prefix |
|---|---|
| Next.js | `NEXT_PUBLIC_` |
| Vite (React, Vue, Svelte) | `VITE_` |
| Expo | `EXPO_PUBLIC_` |

Supabase gives you two kinds of key:

| Key | Older name | Safe in the browser? | What it can do |
|---|---|---|---|
| Publishable key | `anon` key | Yes, **only if RLS is on** | Whatever your RLS policies allow |
| Secret key | `service_role` key | **Never** | Everything. It bypasses RLS |

Rule: a secret key never gets a public prefix.

Cap: 5 min

### Lab - steal the key from the bundle

Flag **F1**. Run the lab loop:

1. **Attack.** Open [the F1 card](https://github.com/pizofreude/ai-for-cybersecurity-101/blob/main/cards/F1-secret-in-bundle.md) and paste the attacker prompt into your coding agent. Find the secret key in the JavaScript that `/admin` sends to every visitor.
2. **Exploit.** Use the key to read every customer's phone number. The card shows how.
3. **Fix.** Paste the fixer prompt. Review the change before you accept it.
4. **Rotate.** The old key was public, so it is burned. Run `npm run reset -- --rotate-keys` and restart `npm run dev`.
5. **Prove.** Run `sh scripts/proof.sh F1` from the `lab` directory. The bundle now holds only the `anon` key.

Cap: 10 min

### Scan your history

Deleting a key from a file does not delete it from git history. Scan every commit of your own app:

```bash
cd path/to/your-app
gitleaks git -v
```

- `no leaks found`: you are done.
- A finding: note the rule and the file. Go to Step 6 before anything else.

Then turn on GitHub **push protection** for the repository.
Open the repository Settings, find the security section, and enable push protection under secret scanning.
GitHub then blocks a push that contains a known secret format.

Cap: 7 min

### Keep secrets out of your agent's context

Your coding agent reads files to help you, and anything it reads can end up in a prompt, a log, or a reply.
Deny it the files that hold secrets:

- **Claude Code:** copy the deny list from [the agent kit settings](https://github.com/pizofreude/ai-for-cybersecurity-101/blob/main/templates/agent-kit/claude/settings.json) into `.claude/settings.json` in your repository.
- **Cursor:** add `.env` and `.env.*` to a `.cursorignore` file.
- **Any agent:** copy [the security rules file](https://github.com/pizofreude/ai-for-cybersecurity-101/blob/main/templates/agent-kit/SECURITY-RULES.md) into your repository. CH5 installs the full kit.

Check it worked: ask your agent "What is in my .env file?" It must refuse or report that it cannot read it.

Cap: 5 min

### When a key leaks, rotate first

Order matters:

1. **Rotate.** Create a new key and revoke the old one in the provider's dashboard. This is the only step that stops an attacker who already copied it.
2. **Deploy** the new key to your hosting environment.
3. **Check** the provider's logs for use of the old key.
4. **Clean history** only after rotation, with `git filter-repo`. Assume anything pushed to GitHub was already copied.

Cap: 3 min

## Checkpoint

Submit in Tera:

1. The last line of `gitleaks git -v` on your own app.
2. Your agent's answer to "What is in my .env file?"
3. If gitleaks found a key: the provider name and the time you rotated it. Never paste the key.

**Self-check before you submit**

- F1 is closed: `sh scripts/proof.sh F1` shows only the `anon` key.
- No secret key in my app has a `NEXT_PUBLIC_`, `VITE_`, or `EXPO_PUBLIC_` prefix.
- `gitleaks git -v` on my app ends with `no leaks found`, or every finding is rotated.
- Push protection is on for my repository.
- My coding agent cannot read `.env`.
