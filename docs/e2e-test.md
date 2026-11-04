# End-to-end test

Run this once before setting the first class date. It tests what the scripted [dry run](dry-run.md) cannot: Tera, real agents, real laptops, and real reading time.

## Roles

| Role | Who | Account |
|---|---|---|
| Admin | Pizo | Tera admin |
| Tester | Someone who has not seen the course | A non-admin KrackedDevs account, on their own laptop |
| Timer | Anyone | Writes clock times into the results table below |

The tester uses their own coding agent: Claude Code, Cursor, or Codex. Test at least one Windows laptop, because every command runs in Git Bash there.

## 1. Set up the test on Tera (admin)

Tera shows a course to students only once it is published. A draft course returns 404 at `/courses/ai-for-cybersecurity-101`, even for admins.

1. Course page → **New session**:
   - **Session title**: `Internal test`
   - **Starts** and **Ends**: the test day, for example 10:00 to 13:30
   - **Venue**: where you test
   - **Capacity**: 2
   - **Issue the completion certificate when a student passes the last chapter**: on
2. Session page → **Overview** → **Trainers** card: add yourself as **primary**. The completion certificate needs a primary trainer.
3. Leave the session in **Draft**. Students see "Not open" and cannot take a seat.
4. **People** tab → **Give a seat** to the tester's account, with the reason `Internal test`. Unconfirmed: whether Tera gives a seat on a Draft session. If it refuses, click **Open registration** and give the seat at once. With a capacity of 2 the exposure is small.
5. Course page → tick **Published** → **Save course**. The course now shows in the catalogue.
6. Class day: Status card → **Move to in progress**. Mark attendance under **Roster and attendance**.
7. After the test: untick **Published**, and cancel the `Internal test` session from its Status card.

Chapter 1 opens when the seat is given. Chapters 2 to 6 open at 00:00 on the session's first day.

Tera allows one seat per person per course. Pick a tester who will not attend a real session, or confirm that cancelling the test session frees their seat.

## 2. Pre-work (tester, the day before)

| # | Do | Pass when |
|---|---|---|
| 1 | Open the course from Tera home, then chapter 1 | The step walk shows 5 steps, each with a countdown |
| 2 | Follow every step, using the links in the chapter | Every link opens. The hygiene checklist opens on GitHub |
| 3 | Clone and run the lab | `npm run check` ends with `All flags as expected.` |
| 4 | Submit the chapter 1 checkpoint | It clears on submit (auto complete) |

## 3. Class day (tester, timer, admin as trainer)

Admin projects https://kind-ground-0fdc76e00.3.azurestaticapps.net and follows the [run sheet](../facilitator/run-sheet.md).

| Chapter | Pass when |
|---|---|
| CH2 | Threat model file uploads. Chapter clears |
| CH3 | F1 closed by the tester's agent, not the reference fix. `gitleaks git -v` ran on the tester's own app |
| CH4 | F2 to F7 closed. `sh scripts/proof.sh F2 F3 F4 F5 F6 F7` output pasted into the checkpoint |
| CH5 | F8 captured by both routes, F8 and F9 closed. Agent kit installed, both kit tests passed |
| CH6 | Security workflow ran in the tester's repository. Repo link submitted |

Also check, per chapter:

- The step countdowns match the run sheet.
- Every GitHub link opens the right file.
- Code blocks copy cleanly into Git Bash.

## 4. Trainer path (admin)

| # | Do | Pass when |
|---|---|---|
| 1 | Open the CH6 submission | The repository link opens |
| 2 | Review it with the [approval rubric](../facilitator/approval-rubric.md) | All four criteria can be checked from what was submitted |
| 3 | Approve it | The completion certificate issues to the tester |
| 4 | Mark the tester present under **Roster and attendance** | A participation certificate issues 30 minutes after the session ends |

Open question to settle in this test: CH6 asks for a **git repo url**, but the chapter and the rubric accept screenshots for a private repository. Test with a private repository too. If the trainer cannot open it, change the deliverable to file upload, or drop the screenshot option.

## 5. Results

| Chapter | Budget | Clock start | Clock end | Actual | Overrun cause |
|---|---|---|---|---|---|
| CH1 (home) | 20 min | | | | |
| CH2 | 25 min | | | | |
| CH3 | 35 min | | | | |
| CH4 | 50 min | | | | |
| Break | 10 min | | | | |
| CH5 | 35 min | | | | |
| CH6 | 25 min | | | | |

Record each defect with the chapter, the step, what happened, and the fix. Fix in `chapters/`, run `node scripts/tera-lesson.mjs`, then paste the regenerated lesson into Tera.
