Ame project: ai-for-cybersecurity-101
Plan: ame/Project Resources/plans/ai-for-cybersecurity-101-course-build-active.md (Phases 2-8)
Status: resolved

# Spec - AI for Cybersecurity 101 course build

## Problem Statement

Builders who ship apps with AI coding agents leak keys, skip row-level security, and trust their agent with production.
Moltbook, the Tea app, Lovable CVE-2025-48757, and the Replit database deletion all came from these gaps.
A 3-hour TABS course must let each student break a realistic app, fix it with their own agent, and leave with a security gate on their own repo.
The course has no lab, no chapter text, no worksheets, no visual aid, and no facilitator material yet.

## Solution

One repository holds everything a trainer needs to run the course and everything a student copies.

- A deliberately vulnerable lab app that runs on a laptop with one install command and no cloud account.
- Seven planted flags, each with an attacker prompt card, a fixer prompt card, and a scripted proof.
- A fixed reference branch where every flag is closed.
- Tera chapter text for CH1 to CH6, with the form fields Tera needs.
- Worksheets and templates students copy into their own repo.
- An Astro visual aid with speaker notes, carrying the AIMTO A+ CSP baseline.
- Facilitator run sheet, room setup, approval rubric, and stuck-student steps.
- An agent security kit that installs into Claude Code, Cursor, and Codex.

## User Stories

1. As a student, I want the lab app to install with one command, so that pre-work finishes in under 10 minutes.
2. As a student, I want the lab to run without a Supabase or cloud account, so that I can start without sign-ups.
3. As a student, I want a visible "deliberately vulnerable" banner, so that I never mistake the lab for a real app.
4. As a student, I want the lab bound to 127.0.0.1, so that classmates on the same Wi-Fi cannot reach my vulnerable app.
5. As a student, I want the lab to use the same Supabase client code as my own app, so that the lessons transfer.
6. As a student, I want to find a secret key in the shipped JavaScript bundle, so that I learn what NEXT_PUBLIC_ exposes.
7. As a student, I want to read other users' private notes with only the anon key, so that I see what missing RLS means.
8. As a student, I want to open another user's order by changing an ID, so that I learn IDOR.
9. As a student, I want to see missing security headers and a permissive CORS policy, so that I learn A02.
10. As a student, I want to plant a stored XSS payload in a comment, so that I learn output encoding.
11. As a student, I want to dump a hidden table through a search box, so that I learn SQL injection.
12. As a student, I want to mark an order paid with an unsigned webhook, so that I learn A08 integrity checks.
13. As a student, I want to make the chatbot reveal its hidden instructions, so that I learn hidden context is not a secret store.
14. As a student, I want to make the chatbot emit HTML that the page runs, so that I learn improper output handling.
15. As a student, I want an attacker prompt card per flag, so that my coding agent helps me find the hole.
16. As a student, I want a fixer prompt card per flag, so that my coding agent closes the hole the right way.
17. As a student, I want a curl command per flag, so that I prove the fix with evidence instead of trust.
18. As a student, I want a one-command reset, so that I recover the lab after a broken exploit or fix.
19. As a student, I want to diff the fixed reference branch, so that I compare my fix with a known-good one.
20. As a student, I want the lab to run offline with a simulated model, so that the AI labs work without an API key.
21. As a student, I want the lab to use a real model when I set an API key, so that I see a real model fall for injection.
22. As a student, I want a hygiene checklist, so that I lock my builder accounts with passkeys and a password manager.
23. As a student, I want a threat model worksheet, so that I name what my own app must protect.
24. As a student, I want a one-page pre-deploy checklist for all ten OWASP 2025 categories, so that I check my app before each launch.
25. As a student, I want a breach runbook with the PDPA deadlines, so that I know the 72-hour and 7-day steps.
26. As a student, I want a SECURITY.md template, so that researchers know how to report a hole.
27. As a student, I want a CI security workflow template, so that every push runs secret, dependency, and code scans.
28. As a student, I want an agent rules file and deny list, so that my agent never reads .env or runs destructive commands.
29. As a student, I want install steps for Claude Code, Cursor, and Codex, so that the kit works with my agent.
30. As a student, I want a security reviewer prompt, so that my agent reviews each change before commit.
31. As a student, I want each Tera chapter to state its deliverable, so that I know what to submit.
32. As a student, I want CH6 approval criteria in advance, so that I know what earns the certificate.
33. As a trainer, I want a minute-by-minute run sheet, so that the class ends on time.
34. As a trainer, I want room setup and helper roles, so that network and power do not stall the class.
35. As a trainer, I want a CH6 approval rubric, so that approvals are consistent across trainers.
36. As a trainer, I want stuck-student steps per lab, so that helpers unblock students fast.
37. As a trainer, I want a visual aid with speaker notes, so that I present without reading from a document.
38. As a trainer, I want the visual aid to pass the A+ CSP gate, so that a security course is not insecure itself.
39. As a trainer, I want an automated flag check, so that I confirm the lab before every class.
40. As a trainer, I want a content check, so that chapter fields, cards, and timings never drift.
41. As Pizo, I want every legal boundary stated in CH2 and on the lab, so that no student attacks a third party.
42. As Pizo, I want each chapter ready to paste into Tera, so that course creation takes one sitting.

## Implementation Decisions

### Lab architecture

- Two local processes started by one command.
  - A local Supabase emulator on 127.0.0.1:54321, the Supabase CLI default port.
  - The Next.js 16 app on 127.0.0.1:3000.
- The emulator replaces a real Supabase project. Reasons:
  - A cloud Supabase project is a public host. The plan forbids a public host for the vulnerable lab.
  - Local Supabase needs Docker and several GB of images. That breaks the 10-minute install.
  - Students cannot create accounts in pre-work without friction.
- The emulator stores data in SQLite through the Node built-in `node:sqlite`. No native build step and no extra dependency.
- The emulator speaks the Supabase wire format the lab uses:
  - PostgREST subset at `/rest/v1/<table>`: `select`, `eq`, `order`, `limit` on GET, and insert on POST.
  - GoTrue subset at `/auth/v1/token?grant_type=password`, `/auth/v1/user`, and `/auth/v1/logout`.
  - A service-only `/pg/query` endpoint that stands in for a direct Postgres connection string.
- Keys are HS256 JWTs with a `role` claim: `anon`, `authenticated`, `service_role`. The reset script generates them into `.env.local`, which is gitignored.
- Row-level security is emulated per table by a policy module. `service_role` bypasses it, as in Supabase.
  - Each policy carries a comment with the real Supabase SQL policy it stands for.
- The Next.js app uses `@supabase/supabase-js` against the emulator, so student code matches real Supabase code.
- The app reads no real secret. All seed users, notes, orders, and keys are fake.

### Flags

| ID | Chapter | Category | Vulnerable behaviour | Fixed behaviour |
|---|---|---|---|---|
| F1 | CH3 | Secrets | `service_role` key in a `NEXT_PUBLIC_` variable, shipped in a client chunk | Key only in server code, client bundle holds the anon key only |
| F2 | CH4 | A01 | `notes` table has RLS off, anon key reads every private note | RLS on, owner or public rows only |
| F3 | CH4 | A01 | `/api/orders/<id>` returns any user's order | Order returned only to its owner, else 404 |
| F4 | CH4 | A02 | No security headers, `/api/*` sends `Access-Control-Allow-Origin: *` | CSP, frame, nosniff, referrer headers set, CORS allowlist |
| F5 | CH4 | A05 | Comments render raw HTML (stored XSS) | Comments render as text |
| F6 | CH4 | A05 | `/api/search` concatenates input into SQL | Parameterised query |
| F7 | CH4 | A08 | Payment webhook accepts any JSON as proof of payment | HMAC-SHA256 signature, timestamp tolerance, timing-safe compare |
| F8 | CH5 | LLM01, LLM08 | Chatbot system prompt holds a staff discount code, injection reveals it | No secret in hidden context, discount checked server-side |
| F9 | CH5 | LLM10 | Chat reply rendered as raw HTML | Reply escaped before render |

- The plan's P2-T3 and P2-T5 each cover two flags (F2+F3 and F5+F6).
- The simulated model is deterministic and gullible. It obeys "ignore previous instructions" and repeats its instructions or input. It is labelled in the UI.
- With `ANTHROPIC_API_KEY` set, the chatbot uses `claude-haiku-5-5`. The fix for F8 holds for any model, because the secret is no longer in the prompt.

### Branches

- `main` holds the vulnerable lab.
- `lab-fixed` branches from `main` after the reset script lands and adds one fix commit per flag. `git diff main lab-fixed -- lab/` shows every fix.

### Content

- Chapter files use YAML front matter for the Tera form fields: `title`, `summary`, `block`, `duration_min`, `deliverable`, `review`. The body is the chapter text.
- The timing contract: CH2 to CH6 plus the 10-minute break total 180 minutes. CH1 is 20 minutes of pre-work.
- Prompt cards use one file per flag with an attacker section, a fixer section, and a proof section.
- Tera editor line types (P0-T10) are unknown. Chapter bodies stay plain Markdown until Pizo shares them.

### Visual aid

- Astro 7 static site in `presentation/`, built from the AIMTO stack and its two gates: security headers and slide-to-notes parity.
- One content contract drives the slides and the speaker notes.

## Testing Decisions

- A good test drives external behaviour only: HTTP requests, rendered HTML, the client bundle, file contents. It never imports lab internals.
- Seam 1, lab: `check-flags` sends each exploit to a running lab over HTTP and reports per flag.
  - `--expect vulnerable` passes when every exploit succeeds.
  - `--expect fixed` passes when every exploit fails and the legitimate path still works.
  - It runs against `main` and against a `lab-fixed` worktree.
- Seam 2, content: `check-content` reads the repo files and checks:
  - every chapter has all six front-matter fields and a valid review value
  - CH2 to CH6 plus the break total 180 minutes
  - every flag has an attacker card, a fixer card, and a proof command
  - every relative link resolves
- Seam 3, visual aid: the AIMTO gates (`validate-security.mjs`, `validate-presentation-parity.mjs`) carried over, plus `astro build`.
- Prior art: `scripts/check-secret-hook.sh` (throwaway-repo behaviour test) and the two AIMTO validators.

## Out of Scope

- Deploying the lab anywhere. It runs on 127.0.0.1 only.
- A real Supabase project, Docker, or Supabase CLI for the lab.
- Creating the Tera course, chapters, session, or GitHub repo. These are Pizo-only tasks.
- A human-timed classroom dry run. The agent times a clean-clone install and a scripted pass only.
- Payment, price, or sales switch. The course is on the free track (D3).
- Any exercise against a host the student does not own.

## Further Notes

- Computer Crimes Act 1997 s.3 sets the attack boundary. CH2 states it before any lab.
- PDPA DBN deadlines come from the official guideline PDF: para 6.1 (72 hours to the Commissioner), para 9.1 (7 days to data subjects), para 5.3 (more than 1,000 data subjects is significant scale).
- The emulator choice changes how D2 "Next.js + Supabase" is delivered, not the decision itself. The client code is real supabase-js. The own-app repeat in CH4 uses each student's real Supabase project.

## Comments

2026-11-02 - Built to this spec. Changes from the spec:
- Semgrep `p/default` missed every lab flag, so the course ships `templates/semgrep/ai-builder.yml` and the CI template runs it.
- `reset -- --code` restores from `origin/main` and rewrites keys, so committed fixes reopen too (found by the dry run).
- The kit command is `/ship-review`, because `/security-review` is a built-in Claude Code command.
Open, owner-only: GitHub repository (P1-T5), Tera editor line types (P0-T10), visual aid deploy (P5-T5), Tera course creation and publish (P8-T4, P8-T5).
