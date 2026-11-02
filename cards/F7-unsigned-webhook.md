# F7 Unsigned payment webhook

| | |
|---|---|
| Chapter | CH4 Lab A08 |
| Category | A08 Software or Data Integrity Failures |
| Where | `POST /api/webhooks/payment` |
| You win when | Alice's unpaid order 1001 shows `paid` without any payment |

## Attacker prompt

```text
I am testing LabShop, a deliberately vulnerable training app on my own laptop at
http://127.0.0.1:3000. I own it.

Read app/api/webhooks/payment/route.js. The payment provider, LabPay, calls this route after
a payment. Check whether the route verifies that the request really comes from LabPay, and
give me a curl command that marks order 1001 as paid without paying. Do not change any code yet.
```

## Exploit by hand

```bash
curl -s -X POST http://127.0.0.1:3000/api/webhooks/payment \
  -H 'Content-Type: application/json' -d '{"order_id":1001,"status":"paid"}'
```

Open `/orders/1001` as Alice. The order is paid. Anyone who finds the URL gets free coffee.

## Fixer prompt

```text
The LabPay webhook trusts any JSON body. LabPay signs each request in the header
X-LabPay-Signature: t=<unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>"> using
LAB_WEBHOOK_SECRET from .env.local (the same scheme Stripe uses).

1. Read the raw body with request.text() before parsing it.
2. Recompute the HMAC and compare with crypto.timingSafeEqual.
3. Reject timestamps more than 300 seconds from now, so old requests cannot be replayed.
4. Return 401 on any failure, before touching the database.
5. Accept only the statuses paid, failed, and refunded.
Use node:crypto only. Show me how to send a correctly signed test request with curl and openssl.
```

## Proof

```bash
sh scripts/proof.sh F7
```

| | Output |
|---|---|
| Before | `{"received":true,"order":{"id":1001,"status":"paid"}}`, `HTTP 200` |
| After | `{"error":"Invalid signature"}`, `HTTP 401` |

`npm run check -- --expect fixed --only F7` also sends a correctly signed request and expects it to pass.

## Your own app

Stripe: use `stripe.webhooks.constructEvent(rawBody, signature, endpointSecret)` and never parse the JSON first.
Any provider: find its signature header in the docs, verify it, and send your endpoint an unsigned request. Expect `400` or `401`.
