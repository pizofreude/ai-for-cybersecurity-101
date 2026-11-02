# Breach runbook

App: ____________________ Owner: ____________________ Last reviewed: ____________

Fill this in during CH6, before anything goes wrong. Print it, or keep it where you can reach it with your laptop offline.

## Who does what

| Role | Name | Phone | Backup |
|---|---|---|---|
| Incident lead (decides) | | | |
| Fixer (code and infrastructure) | | | |
| Contact for users and the Commissioner | | | |
| Data Protection Officer, if appointed | | | |

## Phase 1: Contain (first hour)

Stop the leak before you investigate it.

- [ ] Write down the time you learned of the breach. The PDPA 72-hour clock starts here.
- [ ] Take the leaking feature offline, or switch the site to maintenance mode.
- [ ] Lock the exposed table: turn RLS on, or revoke the public role's access.
- [ ] Keep the logs. Do not delete data, accounts, or history. You need them to assess.

## Phase 2: Rotate (first hours)

Every key that could be exposed. A rotated key is the only thing that stops someone who already copied it.

| Key | Where to rotate it | Who | Done at |
|---|---|---|---|
| Database secret key (Supabase `service_role` or secret key) | Supabase dashboard, Project Settings, API keys | | |
| Database password | | | |
| Payment secret key and webhook secret | | | |
| AI provider key | | | |
| Hosting and CI tokens | | | |
| Other: | | | |

- [ ] Deploy the new keys to production.
- [ ] Sign out all user sessions if user tokens may be exposed.

## Phase 3: Assess (first 48 hours)

| Question | Answer |
|---|---|
| What data was exposed (fields, not only tables)? | |
| How many people are affected? | |
| Since when, and until when? | |
| Was it accessed, or only exposed? What do the logs show? | |
| Does it include sensitive personal data (health, financial, ID numbers)? | |
| Was a data processor involved? When did they tell us? | |

Keep a timeline with times. The Commissioner and the affected people will ask.

## Phase 4: Notify

Malaysian PDPA Data Breach Notification Guideline (2025). This is a summary for builders, not legal advice.

**Is it notifiable?** Notify the Commissioner if the breach causes or is likely to cause "significant harm" (para 5.1). Significant harm means a risk that the data (para 5.2):

- [ ] may cause physical harm, financial loss, credit damage, or property loss or damage
- [ ] may be misused for illegal purposes
- [ ] includes sensitive personal data
- [ ] could enable identity fraud when combined with other information
- [ ] is of significant scale: more than 1,000 affected people (para 5.3)

| Duty | Deadline | Done at |
|---|---|---|
| Notify the Personal Data Protection Commissioner | As soon as practicable, no later than **72 hours** after we became aware (paras 6.1, 6.2) | |
| Notify affected people, if they face significant harm (scale alone does not count, para 8.2) | No later than **7 days** after the Commissioner notice (para 9.1) | |

- Channel: the PDP portal at pdp.gov.my, or email `dbnpdp@pdp.gov.my`.
- Late? The notice must state the reasons and evidence for the delay (para 7.7).
- A processor's breach: the processor tells us, and our 72 hours start then.
- Other laws or regulators may also require notice. Check yours.

Message to affected people. Draft it now, in plain words:

> What happened: 
> What data: 
> What we have done: 
> What you should do: 
> Contact: 

## Phase 5: Learn (within 2 weeks)

- [ ] Root cause, in one sentence.
- [ ] The fix, with the proof command from the pre-deploy checklist.
- [ ] Add a check to CI or the pre-deploy checklist so it cannot happen the same way again.
