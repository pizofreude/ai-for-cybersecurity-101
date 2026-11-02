# Lab install timing

Budget: the CH1 pre-work allows 10 minutes for the lab install.

## Measured 2026-11-02

Fresh clone, empty npm cache, Windows 10, Node 24.21.0, home broadband.

| Step | Time |
|---|---|
| `git clone` (local disk) | 1 s |
| `npm ci` with an empty cache (29 packages from the npm registry) | 101 s |
| `npm run dev` until the first page returns 200 | 10 s |
| First `npm run check` (9 of 9 flags as expected) | 8 s |
| **Total** | **120 s** |

## Not measured

- A clone from GitHub. The repository is not published yet (plan P1-T5). Expect a few extra seconds.
- Installing Node.js and Git. CH1 asks students to install both before the lab step.
- macOS and Linux. The scripts use Node and POSIX `sh` only.
- Classroom Wi-Fi with 20 or more laptops at once. CH1 makes the install pre-work so it never runs on the room network.
