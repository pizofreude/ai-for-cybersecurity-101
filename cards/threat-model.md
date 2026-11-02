# Threat model card

| | |
|---|---|
| Chapter | CH2 Think like the attacker |
| Output | A draft for [the threat model worksheet](../worksheets/threat-model.md) |
| Time | 10 minutes |

## Interview prompt

Paste this into your coding agent, opened in your own app's repository.

```text
You are helping me write a one-page threat model of this app, which I built and own.

First, read the repository: the framework, the database and auth provider, API routes,
environment variable names (names only, never open .env files), third-party services,
webhooks, and any AI or LLM calls.

Then interview me. Ask one question at a time, at most 6 questions, about:
- who uses the app and what personal data it stores
- what would hurt most if it leaked, broke, or was abused
- which accounts and keys could take the app down
- anything you could not tell from the code

Then draft the model in this shape, and keep it to one page:

## 1. What are we building?
Two or three sentences, plus a list of components and where data flows.

## 2. What can go wrong?
### Assets (what an attacker wants)
### Entry points (where an attacker gets in)
### Top 3 fears
For each fear: the asset, the entry point, how it happens, and the damage. Rank by damage.

## 3. What will we do about it?
One concrete fix per fear, naming the file or setting to change.

## 4. How will we know it worked?
One command or check per fix that shows the before and after.

Mark every guess with (guess) so I can correct it. Do not invent features the code does not have.
```

## After the draft

- Delete every fear you cannot point at in your own code.
- Check each `(guess)`.
- Keep three fears. Copy the result into the worksheet.

## Example fear (from LabShop)

| Field | Value |
|---|---|
| Asset | Every customer's private notes |
| Entry point | Supabase REST API with the public anon key |
| How | RLS is off on `notes`, so the public key reads every row |
| Damage | Private data of every user exposed. PDPA notification if it causes significant harm |
| Fix | Enable RLS on `notes` with an owner-or-public policy |
| Check | `curl` the table with only the anon key: expect public rows only |
