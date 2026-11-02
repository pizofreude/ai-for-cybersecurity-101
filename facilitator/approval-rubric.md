# CH6 approval rubric

CH6 is the only chapter with `approval` review. Approving it issues the completion certificate, so every trainer applies the same bar.
Review within 3 working days of class.

## Approve when all four pass

| # | Criterion | Pass | Not yet |
|---|---|---|---|
| 1 | `SECURITY.md` | In the repository root. Names a contact that reaches the student (email or private vulnerability reporting turned on). Placeholders replaced | Missing, still has `<placeholders>`, or the only contact is a public issue tracker |
| 2 | Security workflow | `security.yml` ran on a push in the student's repository. Every job passed, or each failing job has a written reason (false positive, or a fix plan with a date) | Never ran, or red with no explanation |
| 3 | Breach runbook | Names a person for each phase. Lists every key in their app with where to rotate it. States 72 hours to the Commissioner when there is significant harm, and 7 days to affected people after that | A blank template, a missing key list, or wrong PDPA deadlines |
| 4 | No secrets | Nothing submitted shows a key, password, token, or real user's personal data | Any secret visible. Tell the student to rotate it and resubmit with it removed |

## How to check each one

| # | Look at |
|---|---|
| 1 | The repository root on GitHub, or the screenshot. Click the contact link if it is one |
| 2 | The Actions run link. Open each job. Read the written reasons for any red job |
| 3 | The runbook. Compare the key list against the services in their threat model from CH2 |
| 4 | Every screenshot and pasted log. Zoom in on terminals |

## Private repositories

A student whose repository is private submits screenshots of:

- `SECURITY.md` in the repository root
- the Actions run summary showing each job's status
- the filled runbook

Do not ask for repository access.

## Reply templates

**Approve**

> Approved. Your ship gate runs on every push and your runbook is ready. Keep the pre-deploy checklist next to your deploy button.

**Not yet**

> Nearly there. Missing: <criterion number and what is missing>. Fix it and resubmit in Tera. Everything else passes.

**Secret found**

> Your submission shows a <type of secret>. Treat it as leaked: rotate it in <provider> now, then resubmit with it removed. Everything else: <status>.

## Out of scope for approval

- The OWASP lab flags. CH4 and CH5 are self-check.
- The quality of the student's app, or how many checklist lines they ticked.
- A perfect Observatory grade.
