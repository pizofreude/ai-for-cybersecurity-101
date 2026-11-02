# Flag proof record

Recorded 2026-11-02 on Windows 10, Node 24.21.0, Next.js 16.4.4, with the simulated chat model.
Two branches hold the lab:

- `main`: every flag open. Students work here.
- `lab-fixed`: one fix commit per flag. `git diff main lab-fixed -- lab/` shows every fix.

## How to reproduce

```bash
cd lab
npm run dev                         # terminal 1
npm run check                       # terminal 2, on main: expect 9 PASS
sh scripts/proof.sh                 # curl evidence for every flag
npm run reset                       # restore seed data after the proof
```

On `lab-fixed`, run `npm run reset -- --rotate-keys`, restart `npm run dev`, then `npm run check -- --expect fixed`.

## Results

`check-flags.mjs`: 9 of 9 PASS on `main` (`--expect vulnerable`) and 9 of 9 PASS on `lab-fixed` (`--expect fixed`).
The fixed run also checks that the normal feature still works.

| Flag | Chapter | curl evidence on `main` | curl evidence on `lab-fixed` |
|---|---|---|---|
| F1 | CH3 | JWT roles in bundle: `anon, service_role` | JWT roles in bundle: `anon` |
| F2 | CH4 A01 | anon key lists 4 notes, including `Private: bank reminder` | anon key lists 1 note: `Hello class` (public) |
| F3 | CH4 A01 | Alice reads order 1002: `HTTP 200`, Bob's address and `FLAG{idor-change-the-id}` | `HTTP 404`, `Order not found` |
| F4 | CH4 A02 | `X-Powered-By: Next.js`, `access-control-allow-origin: *`, no CSP | CSP with nonce, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, no CORS header for `https://evil.example` |
| F5 | CH4 A05 | page holds live `<img src=x onerror=alert(document.domain)>` | page holds `&lt;img src=x onerror=alert(document.domain)&gt;` |
| F6 | CH4 A05 | UNION returns `FLAG{union-select-dumps-hidden-tables}` from `coupons` | `[]` |
| F7 | CH4 A08 | unsigned webhook: `HTTP 200`, order 1001 `paid` | `HTTP 401`, `Invalid signature`; a correctly signed request still returns 200 |
| F8 | CH5 LLM01/LLM08 | injection prints the prompt with `FLAG{hidden-context-is-not-a-vault}` | injection still prints the prompt, but it holds no secret |
| F9 | CH5 LLM10 | `reply_html` is `<img src=x onerror=alert(1)>` | `reply_html` is `&lt;img src=x onerror=alert(1)&gt;` |

## What the record does not cover

- The Claude model path (`ANTHROPIC_API_KEY` set). No API key was used. A real model can refuse an injection that the simulated model obeys. F8 stays closed on `lab-fixed` for any model, because the prompt holds no secret.
- Browsers other than the Chromium-based app browser used for the sign-in and CSP pass.
- macOS and Linux. The scripts use only Node and POSIX `sh` with `curl`.
