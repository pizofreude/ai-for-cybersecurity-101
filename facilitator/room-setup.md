# Room setup and helper roles

## Ratios

| Students | Lead trainer | Helpers |
|---|---|---|
| Up to 12 | 1 | 1 |
| 13 to 24 | 1 | 2 |
| 25 to 36 | 1 | 3 |

One helper per 12 students. Helpers know the lab loop and have run every card once.

## Roles

| Role | Before class | During class |
|---|---|---|
| Lead trainer | Runs the trainer laptop checks below. Owns the clock | Presents, demos each lab's first step on the projector, calls time |
| Helper A: install and lab | Answers pre-work install questions in the class chat the day before | Fixes broken labs with the [stuck-student steps](stuck-student.md). Owns `npm run reset` |
| Helper B: own-app and agent | Has a Next.js + Supabase app of their own ready as a backup example | Helps with own-app checks in CH4 and the agent kit in CH5. Watches the legal boundary |
| Helper C (25+ students) | Same as A | Covers the back half of the room |

## Room checklist (T-45 minutes)

- [ ] Power: one socket per student laptop, plus extension reels at every table.
- [ ] Wi-Fi: name and password on the whiteboard. Students need it only for agents and package checks. The lab runs offline.
- [ ] Projector: the visual aid readable from the back row at 100% zoom. Test `ArrowDown` navigation.
- [ ] Second screen or tablet for the speaker notes PDF.
- [ ] Trainer laptop: fresh clone of the course repository, `npm ci` done in `lab/`, `npm run check` passes.
- [ ] Trainer laptop: `lab-fixed` branch fetched, so `git diff main lab-fixed -- lab/` works offline.
- [ ] A USB drive with the course repository and a filled `lab/node_modules`, for any student whose install failed (see stuck-student steps).
- [ ] Tera: chapters 2 to 6 unlocked for today, and a primary trainer set on the session so certificates issue.
- [ ] Rules of engagement printed and placed on each table.

## Network rules

- The lab binds to `127.0.0.1`. Nobody exposes it with a tunnel (ngrok, Cloudflare Tunnel, `--host 0.0.0.0`).
- No scanning of the room network, the venue, or each other's laptops.
- A student who wants to test a classmate's app needs that classmate's written permission first. Helpers stop any test without it.

## After class

- [ ] Lead trainer reviews CH6 submissions with the [approval rubric](approval-rubric.md) within 3 working days.
- [ ] Collect what slowed the class and update the [run sheet](run-sheet.md).
