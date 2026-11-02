# Run sheet

180 minutes in session, plus check-in. Clock times assume a 10:00 start. Shift them for your session.
Slide = section of the visual aid (`presentation/`). Chapter = Tera chapter.

## Before doors open (T-45 min)

| Time | Who | Do |
|---|---|---|
| 09:15 | Lead trainer | Open the visual aid at the `00` section. Open `presentation/speaker-notes/course-notes.pdf` on a second screen |
| 09:15 | Helpers | Run the [room setup](room-setup.md) checklist |
| 09:30 | Lead trainer | Run `npm run check` in a fresh lab on the trainer laptop. Expect `All flags as expected.` |
| 09:30 | Lead trainer | In Tera, check that chapters 2 to 6 have unlocked for today |

## Check-in (09:45 - 10:00), slide 00

| Time | Do | Say |
|---|---|---|
| 09:45 | Helpers greet at the door and ask "Did `npm run check` pass at home?" | |
| 09:55 | Show of hands on the lab check. Helpers go to every hand down | "Hands up if npm run check printed All flags as expected." |

## CH2 Think like the attacker (10:00 - 10:25), slide 02

| Clock | Min | Do |
|---|---|---|
| 10:00 | 3 | Moltbook story. No slides beyond 02 |
| 10:03 | 4 | Rules of engagement. Read the four rules aloud. Ask the room to repeat rule 1 |
| 10:07 | 5 | Four questions, walking through the LabShop worked example in CH2 |
| 10:12 | 10 | Exercise: threat model card on their own app. Helpers circulate |
| 10:22 | 3 | OAuth consent phishing, session token theft, APK sideloading |
| 10:25 | | Cue into CH3 |

## CH3 Secrets and AI context (10:25 - 11:00), slide 03

| Clock | Min | Do |
|---|---|---|
| 10:25 | 5 | Where secrets belong. "Share the problem, not the secret." |
| 10:30 | 5 | Public prefixes, publishable vs secret Supabase keys |
| 10:35 | 10 | Lab F1. Demo the attacker prompt on the projector first, then students run the loop |
| 10:45 | 7 | `gitleaks git -v` on their own app. Push protection |
| 10:52 | 5 | Agent context: deny list, `.cursorignore`. Students ask their agent to read `.env` |
| 10:57 | 3 | Rotate first, clean history second |
| 11:00 | | Cue into CH4 |

## CH4 OWASP Top 10 hunt (11:00 - 11:50), slide 04

| Clock | Min | Do |
|---|---|---|
| 11:00 | 2 | The lab loop. Point at the five steps |
| 11:02 | 10 | A01: F2 and F3. Remind: restart `npm run dev` after the F2 fix |
| 11:12 | 6 | A02: F4 |
| 11:18 | 10 | A05: F5 and F6 |
| 11:28 | 7 | A08: F7 |
| 11:35 | 7 | Lightning round: one failure and one fix for each of A03, A04, A06, A07, A09, A10. Show the A10 SQL error live |
| 11:42 | 8 | Own-app checks. Helpers watch for anyone testing a site they do not own |
| 11:50 | | Cue into the break |

Hard stop at 11:50 even if labs are unfinished. Students catch up with `git diff main lab-fixed -- lab/`.

## Break (11:50 - 12:00), slide BR

Helpers stay at their tables for the first 5 minutes. Lead trainer resets the demo lab: `npm run reset -- --code`.

## CH5 When the AI is the attack surface (12:00 - 12:35), slide 05

| Clock | Min | Do |
|---|---|---|
| 12:00 | 2 | Two attack surfaces |
| 12:02 | 8 | F8: direct, then indirect through a review. Demo the indirect route on the projector |
| 12:10 | 5 | F9 |
| 12:15 | 3 | Denial of wallet |
| 12:18 | 4 | Replit and SaaStr, Clinejection, SANDWORM_MODE, slopsquatting |
| 12:22 | 8 | Lock down your agent: walk the table |
| 12:30 | 5 | Kit install exercise and the two tests |
| 12:35 | | Cue into CH6 |

## CH6 Ship gate and breach plan (12:35 - 13:00), slide 06

| Clock | Min | Do |
|---|---|---|
| 12:35 | 8 | Copy `security.yml` and `dependabot.yml`, push, open Actions |
| 12:43 | 3 | SECURITY.md and private vulnerability reporting |
| 12:46 | 3 | Supabase Security Advisor, MDN HTTP Observatory |
| 12:49 | 3 | Pre-deploy checklist |
| 12:52 | 6 | Breach runbook and the PDPA table |
| 12:58 | 2 | Submit in Tera. Show where the approval button is |
| 13:00 | | Close. Approvals continue after class with the [approval rubric](approval-rubric.md) |

## If you run late

| Behind by | Cut |
|---|---|
| 5 min at 11:00 | Lightning round becomes a hand-out: point at the CH4 table |
| 10 min at 11:50 | Shorten the break to 5 minutes |
| 10 min at 12:35 | Skip the denial-of-wallet and incident stories in CH5: point at the chapter text |
| Any | Never cut the CH2 rules of engagement or the CH6 submission |
