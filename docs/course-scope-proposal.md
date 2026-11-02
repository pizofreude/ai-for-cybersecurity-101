# AI for Cybersecurity 101: 3-Hour Course Scope Proposal

Status: scope ACCEPTED by Pizo on 2026-11-02 (section 4 chapter map). All section 7 decisions recorded 2026-11-02. Plan: `ame/Project Resources/plans/ai-for-cybersecurity-101-course-build-active.md`.
Date: 2026-11-02
Platform: TABS (The AI Builder School), Tera LMS at https://learn.theaibuilder.school/

## 1. Starting point: what AIMTO already covered (Aug 2026)

`C:\workspace\aimto-security-for-vibecoders` was a 30-minute, 7-slide talk. It taught five boundaries:

| # | Boundary | Tools |
|---|----------|-------|
| 1 | Safe AI context | Share the problem, not the secret |
| 2 | Human credentials | Bitwarden CLI, Vaultwarden |
| 3 | Application secrets | python-dotenv, Infisical runtime injection |
| 4 | Source identity | SSH commit signing via `gh` |
| 5 | Repository boundary | git-crypt |

Gaps the 3-hour course fills:

- No application security. Nothing on OWASP, access control, injection, or auth.
- No AI-native risks. Nothing on prompt injection, coding-agent permissions, MCP, or slopsquatting.
- No hands-on lab. Attendees watched prompts and commands. They did not attack or fix anything.
- No incident response or Malaysian legal context.

Reuse: AIMTO parts 1 to 3 compress into one 35-minute block. Parts 4 and 5 move to optional pre-work.

## 2. Platform constraints (TABS / Tera)

Read from `clients/TABS/Orgs/steps.md` and the public catalogue on 2026-11-02.

- **Course shape**: a course holds chapters. Each chapter has Title, Summary, Block, Duration, Deliverable, Review, and steps written in an editor.
- **Review modes**: `self-check` clears on submit. `approval` waits for a trainer.
- **Chapter unlock**: chapter 1 opens the moment a seat is paid. Other chapters open at 00:00 on class day. Chapter 1 is therefore the pre-work slot.
- **Certificates**: participation certificates issue 30 minutes after class to attendees marked present. Completion certificates issue when a student passes the last chapter, if the session has a primary trainer.
- **House pattern**: AI Builder Foundations runs 4 chapters (30 + 35 + 35 + 25 min), physical, laptop-first, trainer on projector. Claude for Business uses the loop: objective, worked example, template or prompt, exercise, evidence check.
- **Unconfirmed**: the step editor's line types. The steps guide says a table on the chapter page lists them. Reading it needs admin sign-in.

Design consequence: one chapter per block, each with a concrete deliverable. The last chapter uses `approval` review so the completion certificate means something.

## 3. Content landscape (current as of Nov 2026)

### 3.1 OWASP Top 10:2025 (web applications)

Source: https://top10.owasp.org/2025

| ID | Category | Vibe-coder failure that maps to it |
|----|----------|------------------------------------|
| A01 | Broken Access Control (now includes SSRF) | Supabase/Firebase with RLS off. IDOR on `/api/orders/123`. |
| A02 | Security Misconfiguration | Public buckets. `debug=true` in prod. Wildcard CORS. No security headers. |
| A03 | Software Supply Chain Failures (new) | Hallucinated packages. Compromised npm releases. Unpinned deps. |
| A04 | Cryptographic Failures | Homemade token schemes. Plain-text passwords. HTTP links. |
| A05 | Injection | String-built SQL. `dangerouslySetInnerHTML`. Shell calls with user input. |
| A06 | Insecure Design | No rate limit on signup credits. Price sent from the client. |
| A07 | Authentication Failures | Hand-rolled auth. No lockout. Magic links that never expire. |
| A08 | Software or Data Integrity Failures | Unsigned Stripe webhooks trusted as payment proof. |
| A09 | Security Logging and Alerting Failures | No audit trail. Nobody notices the breach for months. |
| A10 | Mishandling of Exceptional Conditions (new) | Fail-open on error. Stack traces and keys in error pages. |

### 3.2 OWASP Top 10 for LLM Applications 2026

Source: https://github.com/GenAI-Security-Project/GenAI-LLM-Top10 (published 2026-08-04).

1. LLM01 Prompt Injection
2. LLM02 Sensitive Information Disclosure
3. LLM03 Excessive Agency
4. LLM04 Supply Chain
5. LLM05 Data and Model Poisoning
6. LLM06 Unbounded Consumption
7. LLM07 Misinformation
8. LLM08 Hidden Context Exposure (broadened from System Prompt Leakage)
9. LLM09 Vector and Embedding Weaknesses
10. LLM10 Improper Output Handling

Checked 2026-11-02 against the repository README. Some secondary coverage gives a different order. Use this list.

### 3.3 OWASP Top 10 for Agentic Applications 2026

Announced 2025-12-09 by the OWASP GenAI Security Project. Names checked 2026-11-02 against the official PDF: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/

- ASI01 Agent Goal Hijack
- ASI02 Tool Misuse and Exploitation
- ASI03 Identity and Privilege Abuse
- ASI04 Agentic Supply Chain Vulnerabilities (malicious tools, MCP servers, registries)
- ASI05 Unexpected Code Execution
- ASI06 Memory & Context Poisoning
- ASI07 Insecure Inter-Agent Communication
- ASI08 Cascading Failures
- ASI09 Human-Agent Trust Exploitation
- ASI10 Rogue Agents

Relevance: every TABS student runs a coding agent. Goal hijack, tool misuse, supply chain, and code execution apply to their own laptop today.

### 3.4 Case studies (teaching hooks)

| Case | When | Lesson | Maps to |
|------|------|--------|---------|
| Tea app | Jul 2025 | Open Firebase storage leaked ID photos | A01, A02 |
| Lovable RLS (CVE-2025-48757) | 2025 | Generated apps shipped with RLS off | A01 |
| Replit agent deletes SaaStr prod DB | Jul 2025 | Agent had prod write access and ignored a freeze | ASI02, LLM03 |
| Shai-Hulud npm worm | Sep 2025 | Self-spreading package compromise stole tokens | A03 |
| Moltbook | Feb 2026 | Vibe-coded app exposed ~1.5M API tokens. Supabase RLS missing. Found by Wiz. | A01, LLM02 |
| Lovable incidents | Feb to Apr 2026 | Source code, DB credentials, chat history exposed | A01, A02 |
| "Clinejection" | Feb 2026 | Prompt injection in a GitHub issue title gave CI code execution, then a rogue npm release | ASI01, A03 |
| SANDWORM_MODE | Feb 2026 | 19 npm packages injected a malicious MCP server into AI coding setups | ASI04, A03 |
| Axios: AI-built apps leaking data | May 2026 | Some builder tools defaulted apps to public | A02 |
| Slopsquatting study | May 2026 | 127 package names hallucinated identically by five frontier models. 53 still registrable. | A03, LLM04 |

Many 2026 statistics come from vendor blogs. Use the named incidents above, not the percentages, on slides.

### 3.5 Hygiene baseline

- **Passwords**: NIST SP 800-63B-4 (final, 2025), section 3.1.1.2, checked 2026-11-02 against https://pages.nist.gov/800-63-4/sp800-63b.html:
  - A password used as the only factor must be at least 15 characters.
  - A password used only inside MFA must be at least 8 characters.
  - Verifiers SHALL NOT impose composition rules.
  - Verifiers SHALL NOT force periodic changes. They force a change only on evidence of compromise.
  - Blocklist screening is required.
- **MFA**: passkeys are the phishing-resistant default. Synced passkeys qualify at AAL2.
- **Builder account list**: GitHub, Google, Supabase or Firebase, Vercel or Netlify, Cloudflare, domain registrar, Stripe, the AI provider. Each one alone can take down or leak the app.

### 3.6 Malaysian legal context

- **PDPA amendment 2024**: data breach notification and DPO appointment took effect 2025-06-01. The Commissioner issued the Data Breach Notification Guideline on 2025-02-25. Processors now carry direct security duties.
- **Deadlines** (checked 2026-11-02 against the guideline PDF, https://www.pdp.gov.my/wp-content/uploads/2025/08/GP_DBN_ENG.pdf):
  - Para 6.1, Commissioner: "as soon as practicable and no later than seventy-two (72) hours from the occurrence" of the breach.
  - Para 6.2 examples: the clock starts when the controller learns of the breach. For a processor's breach, it starts when the processor tells the controller.
  - Para 7.7: a late notice must give reasons for the delay and supporting evidence.
  - Para 9.1, affected people: "not later than seven (7) days" after the initial notice to the Commissioner.
  - Para 5.2, significant harm: physical harm, financial loss, credit damage, property damage, unlawful use, sensitive data exposure, identity-fraud combinations.
  - Para 5.3, significant scale: more than 1,000 affected data subjects.
  - Teaching example from the guideline: leaked medical records are always notifiable. Leaked work emails of 200 staff on an encrypted laptop are not.
- **Computer Crimes Act 1997, s.3**: unauthorised access is an offence. The course teaches attacks only on apps the student owns or the provided lab app. Say this on the first slide.
- **Cyber Security Act 2024**: applies to national critical information infrastructure entities. Mention once for awareness only.

## 4. Proposed course: "AI for Cybersecurity 101" (working title was "Ship It Safe", renamed by D7)

- **Audience**: AI Builder Foundations graduates and anyone shipping AI-built apps.
- **Format**: physical, own laptop, 3 hours plus 20 minutes of pre-work.
- **Promise**: leave with your own app audited, its top three holes fixed, and a security gate that runs on every push.

### 4.1 Chapter map

| Ch | Block | Title | Min | Deliverable | Review |
|----|-------|-------|----:|-------------|--------|
| 1 | Before the session | Lock your doors | 20 (pre-work) | Hygiene checklist: passkeys or MFA on every builder account, password manager, lab app cloned | self-check |
| 2 | Block 1 | Think like the attacker | 25 | One-page threat model of your own app: assets, entry points, top 3 fears | self-check |
| 3 | Block 2 | Secrets and AI context | 35 | Clean `gitleaks` run on full history. Agent deny-list for `.env`. Any leaked key rotated. | self-check |
| 4 | Block 3 | OWASP Top 10 hunt | 50 | Lab flags captured. Two fixes in your own app, each with before and after `curl` proof. | self-check |
| - | Break | | 10 | | |
| 5 | Block 4 | When the AI is the attack surface | 35 | Prompt-injection flag captured on the lab chatbot. Coding-agent permissions locked down. | self-check |
| 6 | Block 5 | Ship gate and breach plan | 25 | `SECURITY.md`, CI security workflow passing, 1-page incident runbook | **approval** |

Total in session: 180 minutes.

### 4.2 Block detail

**Ch 1: Lock your doors (pre-work, opens on payment)**
- Inventory every builder account. Turn on passkeys or MFA for each.
- Install a password manager. Bitwarden reuses AIMTO part 2.
- Install `gitleaks`, `gh`, and Node or Python to match the lab app.
- Clone the lab app and run it locally.
- Optional: SSH commit signing (AIMTO part 4).

**Ch 2: Think like the attacker (25 min)**
- Open: Moltbook in 3 minutes. One missing setting exposed 1.5M tokens.
- Rules of engagement: Computer Crimes Act s.3. Test only what you own.
- Four-question threat model: what are we building, what can go wrong, what will we do, did it work.
- Exercise: an AI prompt card interviews the student and drafts the threat model. The student edits it.
- Hygiene topics: phishing and OAuth consent phishing, session-token theft, local scam patterns such as APK sideloading.

**Ch 3: Secrets and AI context (35 min)**
- Compressed AIMTO parts 1 to 3.
- Client versus server keys: `NEXT_PUBLIC_` and `VITE_` prefixes ship to the browser. Supabase anon key versus `service_role` key.
- Lab: open DevTools on the lab app and find the key in the JS bundle.
- Lab: run `gitleaks detect` on full history, then turn on GitHub push protection.
- Agent context: deny coding agents read access to `.env`. Never paste secrets into chat.
- Leak response: rotate first, then clean history.

**Ch 4: OWASP Top 10 hunt (50 min)**
- Deep labs, 4 categories at 10 minutes each:
  - A01: read another user's data through missing RLS or IDOR.
  - A02: score the app on MDN HTTP Observatory, then add headers. AIMTO reached A+ / 130, so use it as the worked example.
  - A05: XSS through a rendered comment, and SQL injection through a raw query.
  - A08: forge an unsigned payment webhook.
- Lightning round, 10 minutes for the other six: one failure and one fix each.
- Loop for every lab: attacker prompt card, exploit, fixer prompt card, fix, `curl` proof.
- Students repeat the two most relevant checks on their own Foundations app.

**Ch 5: When the AI is the attack surface (35 min)**
- AI features in your app, from the LLM Top 10 2026:
  - Prompt injection against the lab chatbot to reveal hidden context (LLM01, LLM08).
  - Denial of wallet when a leaked or unmetered key burns money (LLM06).
  - Model output rendered as HTML (LLM10).
- AI that builds your app, from the Agentic Top 10:
  - Replit DB deletion and Clinejection.
  - Agent permission modes: lock down auto-approve.
  - Check an MCP server before you install it.
  - Slopsquatting: check every package an agent installs. Commit lockfiles.
- Exercise: write the agent's permission deny list and a security rules file the agent reads every session.

**Ch 6: Ship gate and breach plan (25 min)**
- CI workflow: Dependabot, secret scanning, `npm audit` or OSV-Scanner, Semgrep or CodeQL.
- Platform checks: Supabase Security Advisor, MDN HTTP Observatory.
- Pre-deploy checklist covering the 10 OWASP categories in one page.
- Breach runbook: contain, rotate, assess, notify. PDPA breach notification duty.
- Trainer approves `SECURITY.md` and the passing CI run. Approval issues the completion certificate.

## 5. Ambitious options (pick any)

| Option | Cost to build | Value |
|--------|---------------|-------|
| **Lab app with 10 planted flags**, one per OWASP category, plus a live leaderboard | High: 2 to 3 days | Gamified. Reusable across every cohort. |
| **"Security reviewer" agent kit**: a rules file, prompt cards, and a pre-commit hook students keep | Medium | Students take the course home inside their coding agent |
| **Consent-based red-team swap**: pairs attack each other's apps under a signed scope | Low build, high facilitation | Most memorable segment. Needs a written scope form for the legal boundary. |
| **7-day follow-up chapter**: one fix a day, trainer-reviewed | Low | Turns a 3-hour class into a habit. Uses the Tera approval flow. |
| **Two tracks**: beginner (hygiene + secrets + A01/A02) and builder (full) | Medium | Serves mixed rooms |
| **Second course**: "AI for Cybersecurity" for defenders, using AI to triage logs and write detections | High | Matches this repo's name. Different audience. |

## 6. Materials list (built after approval)

- Lab app: deliberately vulnerable, matching the Foundations stack, with a reset script.
- Slides or visual aid: extend the AIMTO Astro presentation and keep its CSP and A+ gate.
- Speaker notes: Zenith, parity-checked against slides as in AIMTO.
- Tera chapter text for 6 chapters.
- Prompt card deck: attacker and fixer pairs.
- One-page checklists: hygiene, pre-deploy, breach runbook.
- Facilitator ops sheet: timing, reset steps, room helpers.

## 7. Decisions (recorded 2026-11-02 by Pizo)

| # | Decision | Answer |
|---|----------|--------|
| D1 | Lab target | Both: provided lab app and the student's own app |
| D2 | Lab stack | Next.js + Supabase |
| D3 | Track and price | Free track. No price, no sales switch. |
| D4 | Prerequisite | Open to anyone who brings an app they built |
| D5 | Time split | 50 min web (Ch4) / 35 min AI (Ch5), as proposed |
| D6 | Ambitious options | Agent security kit only |
| D7 | Course name | AI for Cybersecurity 101 |

Not chosen in D6: flag leaderboard, red-team swap, 7-day follow-up, two tracks, second defender course.

D7 note: the course is still the builder-security course in section 4. Only the title changes.

## 8. Facts to check before building

Checked 2026-11-02:

- [x] LLM Top 10 2026 order: matches the repository README.
- [x] Agentic Top 10 ASI01 to ASI10: matches the official PDF.
- [x] PDPA deadlines: 72 hours (para 6.1) and 7 days (para 9.1), read from the pdp.gov.my guideline PDF.
- [x] NIST 800-63B-4: 15 characters single-factor, 8 characters inside MFA.

Still open:

- [ ] Tera chapter editor line types. These need an admin view.

## Sources

- OWASP Top 10:2025: https://top10.owasp.org/2025
- OWASP LLM Top 10 2026: https://github.com/GenAI-Security-Project/GenAI-LLM-Top10
- CSA note on LLM Top 10 2026: https://labs.cloudsecurityalliance.org/research/csa-research-note-owasp-genai-top10-2026-agent-control-stand/
- OWASP Agentic Top 10 2026 (official): https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
- Agentic Top 10 summary: https://www.aigl.blog/owasp-top-10-for-agentic-applications-2026.md
- Agentic Top 10 categories: https://docs.modulos.ai/frameworks/owasp-top-10-agentic
- Vibe-coding incidents 2026: https://decloak.dev/journal/uncloaked-380-000-exposed-apps-and-the-vibe-coding-security-problem-nobody-s-fixing
- Axios report (May 2026): https://www.axios.com/2026/05/07/loveable-replit-vibe-coding-privacy
- Clinejection: https://snyk.io/blog/cline-supply-chain-attack-prompt-injection-github-actions/
- MCP RCE advisory: https://www.ox.security/blog/mcp-supply-chain-advisory-rce-vulnerabilities-across-the-ai-ecosystem/
- MCP design flaw: https://thehackernews.com/2026/04/anthropic-mcp-design-vulnerability.html
- Slopsquatting (CSO): https://www.csoonline.com/article/4201164
- Slopsquatting (CSA): https://labs.cloudsecurityalliance.org/research-rb/csa-research-note-slopsquatting-ai-coding-assistant-supply-c/
- PDPA Data Breach Notification Guideline (official): https://www.pdp.gov.my/wp-content/uploads/2025/08/GP_DBN_ENG.pdf
- PDPA breach guideline summary: https://privacymatters.dlapiper.com/2025/03/malaysia-guidelines-issued-on-data-breach-notification-and-data-protection-officer-appointment/
- PDPA amendment commencement: https://insightplus.bakermckenzie.com/bm/data-technology/malaysia-personal-data-protection-amendment-act-2024-to-come-into-force
- NIST SP 800-63B-4: https://pages.nist.gov/800-63-4/sp800-63b.html
- TABS catalogue: https://learn.theaibuilder.school/catalogue
