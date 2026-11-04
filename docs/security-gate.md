# Security gate record

Run on 2026-11-02 against the course repository (`main` and `lab-fixed`) and the visual aid.

| Check | Tool | Scope | Result |
|---|---|---|---|
| Secrets in history | gitleaks 8.30.1, `--log-opts=--all` | Every commit on every branch | No leaks found |
| Dependency advisories | `npm audit` | `lab/`, `presentation/` | 0 vulnerabilities in both |
| Dependency advisories | OSV-Scanner 2.7.0 | `lab/package-lock.json` (62 packages), `presentation/package-lock.json` (260 packages) | No issues found |
| Code patterns | Semgrep `p/default` (WSL2) | `presentation/`, `scripts/`, `templates/`, `facilitator/` | 0 findings, 240 rules, 44 files |
| Code patterns | Semgrep course rules [ai-builder.yml](../templates/semgrep/ai-builder.yml) | `lab/` on `main` | 6 findings, all planted flags (F1 in two files, F4, F5, F6, F9) |
| Code patterns | Semgrep course rules | `lab/` on `lab-fixed` | 0 findings |
| Workflow template | actionlint 1.7.12 | `templates/github/workflows/security.yml` | Pass |
| Visual aid headers | `presentation/scripts/validate-security.mjs` | `public/staticwebapp.config.json`, `dist/` | 8 of 8 pass |
| Visual aid parity | `presentation/scripts/validate-presentation-parity.mjs` | Contract, site, speaker notes | Pass |
| Content contract | `scripts/check-content.mjs` | Chapters, cards, files, links | Pass |
| Live visual aid headers | `curl` against the deployed site, 2026-11-04 | https://kind-ground-0fdc76e00.3.azurestaticapps.net | 14 of 14 global headers match `staticwebapp.config.json`. `/_astro/*` immutable, HTTP redirects to HTTPS |
| Live visual aid grade | MDN HTTP Observatory, 2026-11-04 | Same URL | A+, score 145, 12 of 12 tests passed |

## Finding: default rules miss the lab flags

Semgrep `p/default`, `p/react`, `p/nextjs`, and `p/javascript` reported none of the LabShop app flags.
They reported only plain-HTTP fetches to `127.0.0.1` in the lab's own scripts.
The course now ships [ai-builder.yml](../templates/semgrep/ai-builder.yml), and the CI template runs it next to `p/default`.
Safe lines in the emulator and the fixed chat page carry `nosemgrep` comments with reasons.

The lab on `main` stays deliberately vulnerable. Do not add the security workflow to this course repository unless it excludes `lab/`.

## Not run

- The security workflow on GitHub Actions. The course repository does not run it, because `lab/` on `main` is deliberately vulnerable. Every step ran locally with the same tool versions.
