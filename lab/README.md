# LabShop: the deliberately vulnerable lab

LabShop is a small coffee shop app built the way many AI-assisted apps are built: Next.js, Supabase, and a chatbot.
It has holes on purpose.

> **Never deploy this app.** It binds to 127.0.0.1 only.
> Attack only this lab or an app you own. Computer Crimes Act 1997 s.3 makes unauthorised access an offence.

## Requirements

- Node.js 22.13 or later (Node 24 LTS recommended)
- Git
- No Supabase account, no Docker, no API key

## Run it

```bash
cd lab
npm ci
npm run dev
```

Open http://127.0.0.1:3000 and sign in as `alice@lab.test` with password `alice-lab-pass`.
`npm run dev` creates `.env.local` and the database on first run.

## What runs

| Process | Address | Role |
|---|---|---|
| Supabase emulator | http://127.0.0.1:54321 | Auth (`/auth/v1`), REST (`/rest/v1`), and row-level security, backed by SQLite |
| Next.js | http://127.0.0.1:3000 | The shop: pages, API routes, chatbot |

The emulator speaks the same wire format as Supabase, so the app uses the real `@supabase/supabase-js` client.
Row-level security policies live in `emulator/policies.mjs`. Each one names the Supabase SQL it stands for.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the emulator and Next.js |
| `npm run reset` | Restore seed data. Keys stay the same |
| `npm run reset -- --rotate-keys` | Restore seed data and generate new keys |
| `npm run check` | Run every exploit and report which flags are open |
| `npm run check -- --expect fixed` | Check every flag is closed and the normal feature still works |

## Lab accounts

| Who | Email | Password |
|---|---|---|
| You | alice@lab.test | alice-lab-pass |
| Another customer | bob@lab.test | bob-lab-pass |
| Shop admin | admin@lab.test | admin-lab-pass |

All data and keys are fake. They exist only on your laptop.
