# F1 Secret key in the client bundle

| | |
|---|---|
| Chapter | CH3 Secrets and AI context |
| Category | Secrets (A02 Security Misconfiguration, LLM02 Sensitive Information Disclosure) |
| Where | `/admin` page |
| You win when | You read every customer's phone number using a key you found in the browser |

## Attacker prompt

```text
I am testing LabShop, a deliberately vulnerable training app running on my own laptop at
http://127.0.0.1:3000 with a local Supabase emulator at http://127.0.0.1:54321. I own it.

Find any secret that this app ships to the browser. Look at environment variables with a
public prefix and at client components. Tell me:
1. which variable holds a secret, and which file uses it on the client
2. what that key is allowed to do in Supabase
3. a curl command that uses it to read the profiles table
Do not change any code yet.
```

## Exploit by hand

In the browser: open `/admin`, then DevTools, then Sources (or Network). Search the JavaScript files for `eyJ`.
Paste each `eyJ...` token into a JWT decoder you run locally and read its `role` claim.

From the terminal, in the `lab` directory:

```bash
sh scripts/proof.sh F1
```

Then read every profile with the leaked key:

```bash
KEY=$(grep '^NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=' .env.local | cut -d= -f2)
curl -s "http://127.0.0.1:54321/rest/v1/profiles?select=display_name,phone" -H "apikey: $KEY" -H "Authorization: Bearer $KEY"
```

## Fixer prompt

```text
The admin page creates a Supabase client in the browser with the service_role key from
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY. Anything with the NEXT_PUBLIC_ prefix ships to every visitor.

Fix the root cause:
- the service_role key must only ever be read in server code, from SUPABASE_SERVICE_ROLE_KEY
- move the admin stats into an API route that checks the signed-in user is an admin
  (profiles.is_admin) on the server before reading anything
- the admin page calls that route with the user's access token
- mark the server Supabase helper with import 'server-only'
- remove NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY from scripts/reset.mjs
Explain the diff in plain words. Do not touch other features.
```

Then rotate the burned key: `npm run reset -- --rotate-keys`, and restart `npm run dev`.

## Proof

```bash
sh scripts/proof.sh F1
```

| | Output |
|---|---|
| Before | `JWT roles in bundle: anon, service_role` |
| After | `JWT roles in bundle: anon` |

## Your own app

List every public variable name in your app. This prints names only, never values:

```bash
grep -rhoE "(NEXT_PUBLIC|VITE|EXPO_PUBLIC)_[A-Z0-9_]+" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist . | sort -u
```

Every name needs a reason to be public. A name containing `SECRET`, `SERVICE`, `PRIVATE`, or a payment or AI provider key means a key that gets rotated today.
