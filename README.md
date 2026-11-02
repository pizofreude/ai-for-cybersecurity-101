# AI for Cybersecurity 101

A 3-hour physical course on The AI Builder School (TABS), plus 20 minutes of pre-work.
It teaches builders who ship with AI coding agents how to attack and secure their own apps.

Students leave with:

- their own app audited
- its top three holes fixed
- a security gate that runs on every push

## Chapters

| Chapter | Title | Time | Review |
|---|---|---|---|
| CH1 | Lock your doors | pre-work, 20 min | self-check |
| CH2 | Think like the attacker | 25 min | self-check |
| CH3 | Secrets and AI context | 35 min | self-check |
| CH4 | OWASP Top 10 hunt | 50 min | self-check |
| - | Break | 10 min | - |
| CH5 | When the AI is the attack surface | 35 min | self-check |
| CH6 | Ship gate and breach plan | 25 min | approval |

Frameworks: OWASP Top 10:2025, OWASP LLM Top 10 2026, OWASP Agentic Top 10 2026, NIST SP 800-63B-4, and the Malaysian PDPA Data Breach Notification guideline.

## What is here

| Directory | Contents |
|---|---|
| [lab/](lab/README.md) | LabShop, the deliberately vulnerable lab app, with nine flags, a reset script, and the flag checker. The `lab-fixed` branch holds one fix commit per flag |
| [chapters/](chapters/README.md) | Tera chapter text for CH1 to CH6, plus the form sheet to paste into Tera |
| [cards/](cards/README.md) | Attacker and fixer prompt cards for every flag, and the threat model card |
| [worksheets/](worksheets/) | Hygiene checklist, threat model, pre-deploy checklist, breach runbook |
| [templates/](templates/) | `SECURITY.md`, the CI security workflow, Dependabot, Semgrep rules, and the [agent security kit](templates/agent-kit/README.md) |
| [presentation/](presentation/README.md) | Astro visual aid and Zenith speaker notes |
| [facilitator/](facilitator/run-sheet.md) | Run sheet, room setup, approval rubric, stuck-student steps, dry-run script |
| [docs/](docs/) | Scope proposal, install timing, dry run record, security gate record |

## Checks

```bash
node scripts/check-content.mjs     # chapters, cards, files, links
node scripts/tera-form.mjs --check # Tera form sheet matches the chapters
bash facilitator/dry-run.sh        # full student path on a fresh clone
```

## Scope and sources

The accepted scope, chapter design, decisions D1 to D7, and every source are in [docs/course-scope-proposal.md](docs/course-scope-proposal.md).

## Repository setup

Enable the secret gate once per clone. It needs [gitleaks](https://github.com/gitleaks/gitleaks#installing) installed.

```bash
sh scripts/install-hooks.sh
sh scripts/check-secret-hook.sh
```

The second command checks that the gate blocks a planted fake key.

## Legal boundary

The lab app in `lab/` is deliberately vulnerable.
It binds to localhost only and must never be deployed to a public host.
Attack only the provided lab app or an app you own.
Computer Crimes Act 1997 s.3 makes unauthorised access an offence.

## License

Apache License 2.0. See `LICENSE`.
