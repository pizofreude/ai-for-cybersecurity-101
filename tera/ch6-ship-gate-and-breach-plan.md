## Objective

By the end of this chapter, your own repository has:

- a security workflow that runs on every push and pull request
- a `SECURITY.md` that tells people how to report a hole
- a one-page breach runbook with the PDPA deadlines

A trainer reviews these three. Approval issues your completion certificate.

## Steps

### Add the security workflow

Copy two files from this course repository into your own:

| From | To |
|---|---|
| [templates/github/workflows/security.yml](https://github.com/pizofreude/ai-for-cybersecurity-101/blob/main/templates/github/workflows/security.yml) | `.github/workflows/security.yml` |
| [templates/github/dependabot.yml](https://github.com/pizofreude/ai-for-cybersecurity-101/blob/main/templates/github/dependabot.yml) | `.github/dependabot.yml` |
| [templates/semgrep/ai-builder.yml](https://github.com/pizofreude/ai-for-cybersecurity-101/blob/main/templates/semgrep/ai-builder.yml) | `.semgrep/ai-builder.yml` |

The workflow runs four checks on every push:

| Check | Catches |
|---|---|
| gitleaks | Secrets in the commits being pushed |
| `npm audit` | Dependencies with known vulnerabilities |
| OSV-Scanner | Known vulnerabilities across every lockfile in the repository |
| Semgrep | Risky code patterns. The course rules add unsafe HTML rendering, SQL built from template strings, secrets with a public prefix, and CORS open to every origin |

Scanners miss things. Semgrep's default rules found none of LabShop's flags, which is why the course rules exist. A green run is a floor, not proof.
When a finding is safe, suppress it on that line with `// nosemgrep: <rule-id> -- <reason>`. Never suppress without a reason.

Commit, push, and open the Actions tab. Fix anything red, or record why it is a false positive.
Dependabot then opens pull requests when a dependency needs an update.

The CI gate runs after a push. Add the local gate too, so problems stop before the commit:

```bash
sh templates/agent-kit/install.sh ../my-app claude --hooks
```

The [agent security kit](https://github.com/pizofreude/ai-for-cybersecurity-101/blob/main/templates/agent-kit/README.md) hooks run gitleaks on every commit and block a new dependency until you have checked it and listed it in `.vetted-packages.txt`.
Claude Code users: run `/ship-review` on your staged changes before each commit.

Cap: 8 min

### Publish SECURITY.md

Copy [templates/SECURITY.md](https://github.com/pizofreude/ai-for-cybersecurity-101/blob/main/templates/SECURITY.md) to the root of your repository.
Fill in a real contact address and your response time.
Turn on GitHub private vulnerability reporting in the repository's security settings, so reporters have a private channel.

Cap: 3 min

### Platform checks

- **Supabase:** open Advisors, then Security Advisor. Fix every error, starting with "RLS disabled".
- **Deployed site:** scan it at [MDN HTTP Observatory](https://developer.mozilla.org/en-US/observatory). Aim for B or better today, A later.

Cap: 3 min

### The pre-deploy checklist

Open [the pre-deploy checklist](https://github.com/pizofreude/ai-for-cybersecurity-101/blob/main/worksheets/pre-deploy-checklist.md). One page, all ten OWASP 2025 categories.
Tick what you checked today. The unticked lines are your next week of work.

Cap: 3 min

### The breach runbook

Fill in [the breach runbook](https://github.com/pizofreude/ai-for-cybersecurity-101/blob/main/worksheets/breach-runbook.md) for your app. Its four phases:

1. **Contain.** Take the leaking feature offline or lock the table.
2. **Rotate.** Every key that could be exposed, starting with the database secret key.
3. **Assess.** What data, how many people, since when. Keep notes with times.
4. **Notify.** Under the PDPA, when the breach applies to you.

What the PDPA Data Breach Notification Guideline (2025) requires of a data controller:

| Duty | When | Guideline |
|---|---|---|
| Notify the Personal Data Protection Commissioner | Only if the breach causes or is likely to cause "significant harm" | Para 5.1 |
| Deadline to the Commissioner | As soon as practicable, no later than 72 hours after you become aware of it | Paras 6.1, 6.2 |
| Notify affected people | If they face significant harm, no later than 7 days after notifying the Commissioner | Paras 8.1, 9.1 |

"Significant harm" covers physical harm or financial loss, misuse for illegal purposes, sensitive personal data such as health records, data that enables identity fraud when combined, and any breach affecting more than 1,000 people (paras 5.2, 5.3).
The 1,000-person test applies to notifying the Commissioner only, not to notifying people (para 8.2).

The guideline's own examples: leaked medical records are notifiable. Work email addresses of 200 staff on a lost, encrypted laptop are not likely to cause significant harm.

Notify through the PDP portal at pdp.gov.my or by email to `dbnpdp@pdp.gov.my`. A late notice must give the reasons and evidence for the delay (para 7.7).
A processor that suffers a breach must tell the controller, who then notifies. The controller's 72 hours start when the processor tells them.

This is a summary for builders, not legal advice. Read the guideline when you write your real runbook.

Cap: 6 min

## Checkpoint

Submit in Tera:

1. A link to your repository, or screenshots if it is private.
2. A link to the passing `security.yml` run.
3. Your filled breach runbook.

**Approval criteria**

The trainer approves when all of these hold:

- `SECURITY.md` is in the repository root and names a contact that reaches you.
- `security.yml` ran on a push and passed, or each failure has a written reason.
- The runbook names who does each phase, lists every key to rotate with where to rotate it, and states the 72-hour and 7-day PDPA deadlines.
- Nothing submitted contains a secret.

If something is missing, the trainer replies with the gap. Fix it and resubmit.
