## Objective

By the end of this chapter you can:

- explain how a vibe-coded app leaks data without anyone "hacking" it
- state the legal line for every exercise today
- write a one-page threat model of your own app

## Steps

### Moltbook in 3 minutes

In February 2026, researchers at Wiz looked at Moltbook, a vibe-coded app built on Supabase.
Row-level security (RLS) was missing on its database.
Every Supabase app ships a public "anon" key to the browser. With RLS off, that public key reads the whole table.
About 1.5 million API tokens were exposed.

Nobody broke in. The door was never locked.
LabShop has the same hole. You will find it in CH4.

Cap: 3 min

### Rules of engagement

The Computer Crimes Act 1997, section 3, makes unauthorised access to a computer an offence in Malaysia.
Good intentions are not a defence. Today's rules:

1. Attack only LabShop on your own laptop, or an app you built and own.
2. In your own app, use test accounts and test data. Never open real users' records.
3. Never scan, probe, or "just check" someone else's site, including a classmate's, without written permission.
4. Found a hole in someone else's app? Stop. Report it to the owner through their `SECURITY.md` or contact page. Do not exploit it to prove it.

LabShop binds to `127.0.0.1`, so it is reachable only from your own laptop.

Cap: 4 min

### The four-question threat model

A threat model answers four questions:

1. **What are we building?** The parts of the app and where data flows.
2. **What can go wrong?** Who wants what, and how could they get it?
3. **What are we going to do about it?** The fix, ranked by damage.
4. **Did we do a good job?** Evidence that the fix works.

Worked example, LabShop:

| Question | LabShop answer |
|---|---|
| Assets | Customer addresses and phone numbers, private notes, payment status, staff discount code, admin dashboard |
| Entry points | Browser to Supabase (anon key), `/api/*` routes, payment webhook, chatbot, review form |
| Top 3 fears | Anyone reads every customer's data. A fake webhook marks orders paid. The chatbot gives away the staff discount. |
| Proof it is fixed | A `curl` command that used to leak data now returns `401`, `404`, or `[]` |

Cap: 5 min

### Exercise - threat model your own app

1. Open [the threat model prompt card](https://github.com/pizofreude/ai-for-cybersecurity-101/blob/main/cards/threat-model.md).
2. Paste it into your coding agent, inside your own app's repository.
3. Answer the agent's questions. It drafts the model from your code and your answers.
4. Edit the draft into [the threat model worksheet](https://github.com/pizofreude/ai-for-cybersecurity-101/blob/main/worksheets/threat-model.md). The agent guesses. You decide.

Keep it to one page. Three real fears beat twenty generic ones.

Cap: 10 min

### The attacks that skip your code

Three ways builders lose accounts even when MFA is on:

- **OAuth consent phishing.** A page asks you to "Sign in with GitHub" or Google and requests broad scopes. Approving it hands a stranger a token. Read the scopes before you click Authorize. Review authorised apps in GitHub and Google settings.
- **Session token theft.** Infostealer malware copies browser cookies, and a stolen session cookie skips MFA. Never install cracked software or random browser extensions on your build laptop.
- **APK sideloading.** Scam messages in Malaysia push "parcel", "bank", or "government" apps as APK files outside the Play Store. Installing one hands over SMS codes and notifications. Install apps only from the official store.

Cap: 3 min

## Checkpoint

Submit in Tera: your one-page threat model (assets, entry points, top 3 fears).

**Self-check**

- [ ] I can state the four rules of engagement.
- [ ] My threat model names real assets in my app, not generic ones.
- [ ] Each of my top 3 fears names an entry point.
- [ ] I know which fear I will test first in CH4.
