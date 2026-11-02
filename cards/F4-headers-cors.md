# F4 Missing security headers and open CORS

| | |
|---|---|
| Chapter | CH4 Lab A02 |
| Category | A02 Security Misconfiguration |
| Where | Every page and every `/api/*` response |
| You win when | You list the missing headers and show the API accepts any origin |

## Attacker prompt

```text
I am testing LabShop, a deliberately vulnerable training app on my own laptop at
http://127.0.0.1:3000. I own it.

Audit its HTTP response headers. Check for Content-Security-Policy, frame protection,
X-Content-Type-Options, Referrer-Policy, and X-Powered-By on pages. Check what CORS headers
/api/* sends when the request comes from Origin: https://evil.example. Read lib/http.js and
next.config.mjs. Explain what an attacker gains from each gap. Do not change any code yet.
```

## Exploit by hand

```bash
curl -s -D - -o /dev/null http://127.0.0.1:3000/
curl -s -D - -o /dev/null -H 'Origin: https://evil.example' "http://127.0.0.1:3000/api/search?q=x"
```

`Access-Control-Allow-Origin: *` lets any website read this API's responses from a visitor's browser.
No `frame-ancestors` or `X-Frame-Options` lets any site embed the shop in a hidden frame (clickjacking).

## Fixer prompt

```text
LabShop sends no security headers and its API allows every origin.

1. Add a nonce-based Content-Security-Policy in proxy.js, following the Next.js 16 guide in
   node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md. Include
   frame-ancestors 'none', object-src 'none', base-uri 'self', and connect-src for the Supabase URL.
   Development needs 'unsafe-eval' for React; production must not.
2. In next.config.mjs: X-Content-Type-Options nosniff, X-Frame-Options DENY, Referrer-Policy
   strict-origin-when-cross-origin, a Permissions-Policy, and poweredByHeader false.
3. In lib/http.js: send no CORS headers by default. Allow only exact origins listed in an
   ALLOWED_ORIGINS environment variable.
Then open every page and confirm the browser console shows no CSP errors from our code.
```

## Proof

```bash
sh scripts/proof.sh F4
```

| | Output |
|---|---|
| Before | `X-Powered-By: Next.js`, `access-control-allow-origin: *`, no CSP |
| After | `content-security-policy: ...`, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, and no CORS header for `https://evil.example` |

## Your own app

Scan your deployed URL at [MDN HTTP Observatory](https://developer.mozilla.org/en-US/observatory).
Search your code for `Access-Control-Allow-Origin` and `cors(` and replace any `*` with an exact allowlist.
