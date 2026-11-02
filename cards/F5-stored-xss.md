# F5 Stored XSS in product reviews

| | |
|---|---|
| Chapter | CH4 Lab A05 |
| Category | A05 Injection (cross-site scripting) |
| Where | Review form on `/shop/1`, rendered by `app/shop/[id]/page.jsx` |
| You win when | A review you posted runs JavaScript for every visitor of the product page |

## Attacker prompt

```text
I am testing LabShop, a deliberately vulnerable training app on my own laptop at
http://127.0.0.1:3000. I own it.

Read how product reviews are stored and rendered (app/api/comments/route.js and
app/shop/[id]/page.jsx). Explain whether a review can contain HTML that runs in other
visitors' browsers, and write a harmless proof payload that only changes document.title or
shows alert(document.domain). Do not change any code yet.
```

## Exploit by hand

Sign in as Alice, open `/shop/1`, and post this review:

```html
<img src=x onerror="document.title='owned by a review'">
```

Reload the page. The tab title changes. Every visitor runs that code, and a real attacker would steal sessions instead.

## Fixer prompt

```text
Product reviews are rendered with dangerouslySetInnerHTML, so a stored review runs as HTML
and JavaScript in every visitor's browser.

Render the review body as plain text so React escapes it. Remove dangerouslySetInnerHTML from
the product page and drop the "HTML is allowed" hint from the review form. Do not try to
filter tags with a regex. If we ever need formatting, we will use a vetted sanitiser
such as DOMPurify. Explain why escaping on output is the fix, not cleaning on input.
```

## Proof

```bash
sh scripts/proof.sh F5
```

| | Output |
|---|---|
| Before | `<img src=x onerror=alert(document.domain)>` in the page |
| After | `&lt;img src=x onerror=alert(document.domain)&gt;` in the page |

Old payloads stay in the database but now display as text. Run `npm run reset` to clear them.

## Your own app

```bash
grep -rn -E "dangerouslySetInnerHTML|v-html|innerHTML\s*=|\{@html" --include=*.jsx --include=*.tsx --include=*.js --include=*.ts --include=*.vue --include=*.svelte .
```

Every hit that renders user or model content is this flag.
