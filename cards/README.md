# Prompt cards

One card per lab flag. Each card runs the lab loop: attacker prompt, exploit, fixer prompt, fix, proof.

| Card | Chapter | Category |
|---|---|---|
| [F1 Secret key in the bundle](F1-secret-in-bundle.md) | CH3 | Secrets |
| [F2 RLS off on notes](F2-rls-off.md) | CH4 | A01 Broken Access Control |
| [F3 IDOR on orders](F3-idor.md) | CH4 | A01 Broken Access Control |
| [F4 Headers and CORS](F4-headers-cors.md) | CH4 | A02 Security Misconfiguration |
| [F5 Stored XSS](F5-stored-xss.md) | CH4 | A05 Injection |
| [F6 SQL injection](F6-sql-injection.md) | CH4 | A05 Injection |
| [F7 Unsigned webhook](F7-unsigned-webhook.md) | CH4 | A08 Software or Data Integrity Failures |
| [F8 Prompt injection](F8-prompt-injection.md) | CH5 | LLM01 Prompt Injection, LLM08 Hidden Context Exposure |
| [F9 Output handling](F9-output-handling.md) | CH5 | LLM10 Improper Output Handling |
| [Threat model](threat-model.md) | CH2 | Planning |

## How to use a card

1. Open your coding agent in the `lab` directory of this repository.
2. Paste the **Attacker prompt**. Let the agent read the code and explain the hole.
3. Run the exploit. If the agent stalls, use **Exploit by hand**.
4. Paste the **Fixer prompt**. Read the diff before you accept it.
5. Run the **Proof** command. The output must change from the "before" line to the "after" line.

Every attacker prompt names the target as your own local lab. Keep that scope when you adapt a card to your own app.
