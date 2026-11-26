# Workflow Automation Engine (HighLevel / HubSpot / Klaviyo style: trigger → actions → waits → if/else, per contact)

> **The one idea to remember: "Every contact's journey is one saved row with a bookmark (which step am I on?) and an alarm clock (when do I wake up?). Workers are forgetful; the row remembers."**
> Think of a hotel wake-up-call desk. The desk doesn't stand next to each guest for two days. It writes "Room 501, wake at 10:00 Wednesday" on a card, files the card by time, and every minute it pulls the cards that are due. Our engine works the same way. When Rahul fills Priya's form, we create one **run** row for him: "workflow wf-12, version 1, now on step n2". After the welcome email the row says "asleep until Wednesday 10:00". A **Timer Service** pulls due rows, a stateless **Step Executor** moves each one forward a single step, and **Action Workers** do the real sending. Any server can crash at any moment, because everything that matters is in the row, and every "tell someone else" goes through an **outbox** row in the same transaction.
> Deep dive: [Deep Dive](#deep-dive-only-what-the-flows-did-not-cover)

## Requirements

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

### Functional (what the product does)

</td><td valign="top" width="50%" markdown="1">

### Non-functional (how well it must work)

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Business owners build and publish workflows**
  - Trigger, actions, waits, if/else, drawn in a visual builder and saved as a graph.
    - e.g. Priya publishes "New Lead Nurture" (wf-12) for her yoga studio.

</td><td valign="top" width="50%" markdown="1">

- **Editing never breaks contacts already inside**
  - Runs stay on the version they started with. Published versions are never edited.
    - e.g. Priya changes "2 days" to "1 day"; Rahul, already waiting, keeps his 2 days.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **A trigger enrolls the contact**
  - Form sent, tag added, appointment booked, email opened, and so on.
    - e.g. Rahul submits form f-3, so he enters wf-12.

</td><td valign="top" width="50%" markdown="1">

- **Enrolled once, step done once**
  - Kafka and SQS can deliver twice. Repeats must not enroll twice or send twice.
    - e.g. event e-77 arrives twice; Rahul still has only run r-9001.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Actions: email, SMS, tag, webhook**
  - Sent through outside companies (SendGrid, Twilio) or the business's own URL.
    - e.g. welcome email to Rahul; SMS to Anita, the sales rep.

</td><td valign="top" width="50%" markdown="1">

- **Fair between businesses**
  - One business blasting a million contacts must not delay the small ones.
    - e.g. a big gym's campaign does not hold up Priya's welcome email.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Waits from minutes to months**
  - "Wait 2 days", "wait until 9 am in the contact's time zone".
    - e.g. Rahul sleeps from Monday 10:00 to Wednesday 10:00.

</td><td valign="top" width="50%" markdown="1">

- **Waits survive anything and fire on time**
  - Crashes, deploys, restarts. A few seconds late is fine; lost is not.
    - e.g. we deploy 30 times while Rahul sleeps; he still wakes on Wednesday.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Conditions read what the contact did**
  - Opened, clicked, replied, has tag, booked.
    - e.g. "Did Rahul open the welcome email?"

</td><td valign="top" width="50%" markdown="1">

- **Honest open data and the law**
  - Machine opens (Apple Mail Privacy Protection) are ignored; opt-outs are checked before every send.
    - e.g. Rahul replies STOP, so no more SMS ever.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **See where each contact is**
  - Per contact: current step, history, errors.
    - e.g. Priya sees "Rahul: waiting at n3 until Wed 10:00".

</td><td valign="top" width="50%" markdown="1">

- **Most runs are asleep: scale for that**
  - Millions of sleeping runs cost only rows on disk, no memory or threads.
    - e.g. 50 million open runs, only a few thousand wake each second.

</td></tr>
</table>

## APIs

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

| Feature | API |
|---|---|
| Save draft | `PUT /v1/workflows/{id}/draft {trigger, nodes}` + `If-Match` → `{draft_rev}` |
| Publish | `POST /v1/workflows/{id}/publish` → `{version: 1}` |
| Pause / resume | `POST /v1/workflows/{id}:pause` |
| Submit form (public) | `POST /v1/forms/{form_id}/submissions {email, name, fields}` + form key → `202` |

</td><td valign="top" width="50%" markdown="1">

| Feature | API |
|---|---|
| Provider callbacks | `POST /v1/webhooks/sendgrid` (signed), `POST /v1/webhooks/twilio` (signed) |
| Enroll by hand | `POST /v1/workflows/{id}/enrollments {contact_id}` + `Idempotency-Key` |
| Remove contact | `DELETE /v1/runs/{run_id}` → status `EXITED` |
| Run history | `GET /v1/contacts/{id}/runs` → `[{run_id, current_node, status, next_run_at, steps[]}]` |

</td></tr></table>

## Diagram

A quick map of all the parts. Arrows (`──>`) show which way requests or data move.

```text
CALLERS (outside)                                ╔══ THE WORKFLOW ENGINE: everything inside this box is ours ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗   OUTSIDE COMPANIES / RECEIVERS
                                                 ║                                                                                                                                                                                                                                                                                                                                                                     ║
┌───────────────────────────────────┐            ║                                                        ┌───────────────────────────────────┐               ┌───────────────────────────────────┐               ┌───────────────────────────────────┐               ┌───────────────────────────────────┐               ┌───────────────────────────────────┐                                                        ║            ┌───────────────────────────────────┐
│ Priya (business owner)            │ ──┐        ║                                            ┌─────────> │ Workflow Service                  │ ────────────> │ Workflow DB (PostgreSQL)          │   ┌─────────> │ Trigger Matcher                   │ ────┬───────> │ Redis (cache)                     │   ┌─────────> │ Timer Service                     │                                                        ║    ┌─────> │ SendGrid (email)                  │
├───────────────────────────────────┤   │        ║                                            │           ├───────────────────────────────────┤               ├───────────────────────────────────┤   │           ├───────────────────────────────────┤     │         ├───────────────────────────────────┤   │           ├───────────────────────────────────┤                                                        ║    │       ├───────────────────────────────────┤
│ - builds + publishes workflows    │   │        ║                                            │           │ - saves drafts, publishes         │               │ - workflows, frozen versions      │   │           │ - event -> which workflows?       │     │         │ - trigger index, graph cache      │   │           │ - wakes runs whose wait ended     │                                                        ║    │       │ - delivers the email              │
│ - in the visual builder           │   │        ║                                            │           │ - checks the graph can run        │               │ - outbox -> relay -> Kafka        │   │           │ - enrolls the contact once        │     │         │ - rate limits, safe to lose       │   │           │ - SKIP LOCKED, every second       │                                                        ║    │       └───────────────────────────────────┘
└───────────────────────────────────┘   │        ║                                            │           └───────────────────────────────────┘               └───────────────────────────────────┘   │           └───────────────────────────────────┘     │         └───────────────────────────────────┘   │           └───────────────────────────────────┘                                                        ║    │
                                        │        ║                                            │                                                                                 │                     │                                                     │                                                 │                                                                                                        ║    │
                                        │        ║                                            │                                                                                 │                     │                                                     │                                                 │                                                                                                        ║    │
                                        │        ║                                            │                                                                                 ▼                     │                                                     │                                                 │                                                                                                        ║    │
┌───────────────────────────────────┐   │        ║    ┌───────────────────────────────────┐   │           ┌───────────────────────────────────┐               ┌───────────────────────────────────┐   │           ┌───────────────────────────────────┐     │         ┌───────────────────────────────────┐   │           ┌───────────────────────────────────┐               ┌───────────────────────────────────┐    ║    │       ┌───────────────────────────────────┐
│ Rahul's browser                   │ ──┼────────╫──> │ API Gateway                       │ ──┴─────────> │ Event Ingestion                   │ ────────────> │ Kafka (event pipe)                │ ──┼─────────> │ Step Executor                     │ ──┬─┴───────> │ Run DB (PostgreSQL)               │ ──┴─────────> │ SQS action queues                 │ ────────────> │ Action Workers                    │ ───╫────┼─────> │ Twilio (SMS)                      │
├───────────────────────────────────┤   │        ║    ├───────────────────────────────────┤               ├───────────────────────────────────┤               ├───────────────────────────────────┤   │           ├───────────────────────────────────┤   │           ├───────────────────────────────────┤               ├───────────────────────────────────┤               ├───────────────────────────────────┤    ║    │       ├───────────────────────────────────┤
│ - fills Priya's website form      │   │        ║    │ - login, form keys                │               │ - form: contact + outbox          │               │ - contact / workflow / run events │   │           │ - moves one run one step          │   │           │ - one row per contact journey     │               │ - one queue per channel           │               │ - email, SMS, tag, webhook        │    ║    │       │ - delivers the SMS                │
│ - is the contact                  │   │        ║    │ - rate limit per business         │               │ - opens/clicks: straight to Kafka │               │ - ordered per contact or run      │   │           │ - stateless, reads the graph      │   │           │ - next_run_at, steps, outbox      │               │ - fair per business, DLQ          │               │ - claim step, then send           │    ║    │       └───────────────────────────────────┘
└───────────────────────────────────┘   │        ║    └───────────────────────────────────┘               └───────────────────────────────────┘               └───────────────────────────────────┘   │           └───────────────────────────────────┘   │           └───────────────────────────────────┘               └───────────────────────────────────┘               └───────────────────────────────────┘    ║    │
                                        │        ║                                                                                                                                                    │                                                   │                                                                                                                                                            ║    │
                                        │        ║                                                                                                                                                    │                                                   │                                                                                                                                                            ║    │
                                        │        ║                                                                                                                                                    │                                                   │                                                                                                                                                            ║    │
┌───────────────────────────────────┐   │        ║                                                                                                                                                    │           ┌───────────────────────────────────┐   │           ┌───────────────────────────────────┐                                                                                                            ║    │       ┌───────────────────────────────────┐
│ Email / SMS callbacks             │ ──┘        ║                                                                                                                                                    └─────────> │ Activity Writer                   │ ──┴─────────> │ Contact DB (PostgreSQL)           │                                                                                                            ║    └─────> │ Business's own webhook URL        │
├───────────────────────────────────┤            ║                                                                                                                                                                ├───────────────────────────────────┤               ├───────────────────────────────────┤                                                                                                            ║            ├───────────────────────────────────┤
│ - SendGrid, Twilio webhooks       │            ║                                                                                                                                                                │ - saves opens, clicks, replies    │               │ - contacts, tags, opt-outs        │                                                                                                            ║            │ - e.g. Priya's booking tool       │
│ - delivered, opened, clicked      │            ║                                                                                                                                                                │ - drops repeats                   │               │ - activity: opened, clicked       │                                                                                                            ║            └───────────────────────────────────┘
└───────────────────────────────────┘            ║                                                                                                                                                                └───────────────────────────────────┘               └───────────────────────────────────┘                                                                                                            ║
                                                 ╚═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## Schema Overview

What every store keeps, one real example per box. Where a field can take several values, they are shown as `"A" or "B"`. Each row scrolls sideways.

### PostgreSQL: Workflow DB (+ the outbox shape every DB shares)

```text
╔══════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════╗
║ workflows (Workflow DB) · key workflow_id    ║    ║ workflow_versions (Workflow DB) · key workflow_id + version · never edited ║    ║ outbox (same shape in Workflow DB, Run DB, Contact DB)             ║
╟──────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────╢
║ {                                            ║    ║ {                                                                          ║    ║ {                                                                  ║
║   "workflow_id": "wf-12",                    ║    ║   "workflow_id": "wf-12",                                                  ║    ║   "id": "ob-5501",                                                 ║
║   "tenant_id": "t-17 (Priya's Yoga Studio)", ║    ║   "version": 1,                                                            ║    ║   "destination": "kafka:workflow.events" or "kafka:contact.events" ║
║   "name": "New Lead Nurture",                ║    ║   "trigger": { "type": "form.submitted", "form_id": "f-3" },               ║    ║                  or "kafka:run.events" or "sqs:actions-email"      ║
║   "live_version": 1,                         ║    ║   "reentry": "ONCE" or "EVERY_TIME",                                       ║    ║                  or "sqs:actions-sms" or "sqs:actions-tag",        ║
║   "status": "DRAFT" or "ACTIVE" or "PAUSED"  ║    ║   "start": "n2",                                                           ║    ║   "key": "wf-12" or "c-501" or "r-9001",                           ║
║ }                                            ║    ║   "nodes": {                                                               ║    ║   "payload": { "event_id": "ob-5501", "type": "...", ... },        ║
╚══════════════════════════════════════════════╝    ║     "n2": { "type": "send_email", "template": "welcome", "next": "n3" },   ║    ║   "created_at": "2026-11-23T10:00:00Z",                            ║
                                                    ║     "n3": { "type": "wait", "for": "P2D", "next": "n4" },                  ║    ║   "sent_at": null or "2026-11-23T10:00:00.4Z"                      ║
                                                    ║     "n4": { "type": "if", "rule": "opened(n2)", "yes": "n5", "no": "n7" }, ║    ║ }                                                                  ║
                                                    ║     "n5": { "type": "add_tag", "tag": "engaged", "next": "n6" },           ║    ╚════════════════════════════════════════════════════════════════════╝
                                                    ║     "n6": { "type": "send_sms", "to": "assigned_rep", "next": null },      ║
                                                    ║     "n7": { "type": "send_sms", "template": "follow_up", "next": "n8" },   ║
                                                    ║     "n8": { "type": "wait", "for": "P3D", "next": "n9" },                  ║
                                                    ║     "n9": { "type": "send_email", "template": "final", "next": null }      ║
                                                    ║   }                                                                        ║
                                                    ║ }                                                                          ║
                                                    ╚════════════════════════════════════════════════════════════════════════════╝
```

### PostgreSQL: Run DB + Contact DB

```text
╔════════════════════════════════════════════════════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════╗    ╔════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════════════════╗
║ runs (Run DB) · key run_id · UNIQUE workflow_id + contact_id + enroll_key · index status + next_run_at ║    ║ run_steps (Run DB) · key run_id + node_id    ║    ║ contacts (Contact DB) · key contact_id     ║    ║ contact_activity (Contact DB) · UNIQUE provider_event_id · index contact_id + type ║
╟────────────────────────────────────────────────────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────╢    ╟────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────────────────────╢
║ {                                                                                                      ║    ║ {                                            ║    ║ {                                          ║    ║ {                                                                                  ║
║   "run_id": "r-9001",                                                                                  ║    ║   "run_id": "r-9001",                        ║    ║   "contact_id": "c-501",                   ║    ║   "provider_event_id": "sg-evt-77Q",                                               ║
║   "tenant_id": "t-17",                                                                                 ║    ║   "node_id": "n2",                           ║    ║   "tenant_id": "t-17",                     ║    ║   "contact_id": "c-501",                                                           ║
║   "workflow_id": "wf-12",                                                                              ║    ║   "status": "PENDING" or "SENDING" or "SENT" ║    ║   "name": "Rahul",                         ║    ║   "type": "email.delivered" or "email.opened"                                      ║
║   "version": 1,                                                                                        ║    ║             or "FAILED" or "UNKNOWN",        ║    ║   "email": "rahul@example.com",            ║    ║           or "email.clicked" or "sms.delivered",                                   ║
║   "contact_id": "c-501 (Rahul)",                                                                       ║    ║   "provider_msg_id": "sg-AbC123" or null,    ║    ║   "phone": "+91-98xxxxxx01",               ║    ║   "run_id": "r-9001",                                                              ║
║   "enroll_key": "ONCE" or "e-77 (trigger event id)",                                                   ║    ║   "attempts": 1,                             ║    ║   "time_zone": "Asia/Kolkata",             ║    ║   "node_id": "n2",                                                                 ║
║   "current_node": "n2" or "n3" or "n4" or ...,                                                         ║    ║   "updated_at": "2026-11-23T10:00:02Z"       ║    ║   "tags": ["lead"] or ["lead", "engaged"], ║    ║   "machine_open": false or true,                                                   ║
║   "status": "READY" or "WAITING_ACTION" or "WAITING"                                                   ║    ║ }                                            ║    ║   "assigned_rep": "u-9 (Anita)",           ║    ║   "at": "2026-11-23T18:20:11Z"                                                     ║
║             or "DONE" or "EXITED" or "FAILED",                                                         ║    ╚══════════════════════════════════════════════╝    ║   "email_opt_out": false or true,          ║    ║ }                                                                                  ║
║   "next_run_at": "2026-11-25T10:00:03Z" or null,                                                       ║                                                        ║   "sms_opt_out": false or true             ║    ╚════════════════════════════════════════════════════════════════════════════════════╝
║   "row_version": 4                                                                                     ║                                                        ║ }                                          ║
║ }                                                                                                      ║                                                        ╚════════════════════════════════════════════╝
╚════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

### Redis, Kafka, SQS

```text
╔════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════════════════════╗
║ Redis · trigger index · key trig:{tenant}:{event type} ║    ║ Redis · graph cache + rate limit                             ║    ║ Kafka topics (key = ordering lane)                                 ║    ║ SQS message · queue actions-email or actions-sms or actions-tag ║
╟────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────────────────────╢
║ {                                                      ║    ║ {                                                            ║    ║ {                                                                  ║    ║ {                                                               ║
║   "key": "trig:t-17:form.submitted",                   ║    ║   "wfv:wf-12:1": "<the frozen nodes JSON>  (never stale)",   ║    ║   "workflow.events": "key workflow_id  (published, paused)",       ║    ║   "MessageGroupId": "t-17   (fair queue: one busy business      ║
║   "value": [ { "workflow_id": "wf-12", "version": 1,   ║    ║   "rl:t-17:sms": { "tokens": 18, "refill": "20 per second" } ║    ║   "contact.events":  "key contact_id   (form.submitted,            ║    ║                              cannot starve the others)",        ║
║                "filter": { "form_id": "f-3" } } ]      ║    ║ }                                                            ║    ║                                         email.opened, tag_added)", ║    ║   "body": { "event_id": "ob-5502", "run_id": "r-9001",          ║
║ }                                                      ║    ╚══════════════════════════════════════════════════════════════╝    ║   "run.events":      "key run_id       (run.ready,                 ║    ║             "node_id": "n2", "channel": "email",                ║
╚════════════════════════════════════════════════════════╝                                                                        ║                                         action.completed)"         ║    ║             "template": "welcome", "to": "c-501" }              ║
                                                                                                                                  ║ }                                                                  ║    ║ }                                                               ║
                                                                                                                                  ╚════════════════════════════════════════════════════════════════════╝    ╚═════════════════════════════════════════════════════════════════╝
```

## Flows (the big diagram, one piece at a time)

Each box says what it does in each step (`STEP n: what`, then how, then an example). Under each diagram, **Data in this flow** shows the rows and messages that flow writes (scroll sideways).

### Flow 1. Priya publishes "New Lead Nurture" → a frozen version 1 → the trigger index knows about it (Workflow Service → Workflow DB + outbox → Outbox Relay → Kafka → Trigger Matcher → Redis)

```text
┌── STEP 1 ────────────────────────────────────────────────┐             ┌── STEP 2, 3 ─────────────────────────────────────────────┐             ┌── STEP 3 ────────────────────────────────────────────────┐             ┌── STEP 4 ────────────────────────────────────────────────┐             ┌── STEP 4, 5 ─────────────────────────────────────────────┐             ┌── STEP 5 ────────────────────────────────────────────────┐             ┌── STEP 5 ────────────────────────────────────────────────┐
│ Priya  (business owner, visual builder)                  │             │ Workflow Service                                         │             │ Workflow DB  (PostgreSQL)                                │             │ Outbox Relay                                             │             │ Kafka  (topic workflow.events)                           │             │ Trigger Matcher                                          │             │ Redis  (cache)                                           │
├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤
│ STEP 1: Clicks Publish on "New Lead Nurture"             │ ──────────> │ STEP 2: Checks the graph can really run                  │ ──────────> │ STEP 3: Keeps the frozen version and the news            │ ──────────> │ STEP 4: Copies new outbox rows into Kafka                │ ──────────> │ STEP 4: Keeps each workflow's changes in order           │ ──────────> │ STEP 5: Updates the trigger index                        │ ──────────> │ STEP 5: Answers "who listens to this event?"             │
│   - POST /v1/workflows/wf-12/publish                     │             │   - every path ends, every wait has a length             │             │   - version rows are never edited, only added            │             │   - polls outbox (SKIP LOCKED), sends, marks sent        │             │   - same key = same partition = one lane                 │             │   - adds wf-12 v1 under its trigger                      │             │   - cache only: on a miss, read Workflow DB              │
│   - e.g. email -> wait 2d -> if opened -> ...            │             │   - e.g. n4 has both a yes and a no branch               │             │   - e.g. outbox ob-5501 workflow.published               │             │   - e.g. ob-5501 -> workflow.events, key wf-12           │             │   - e.g. published v1 is read before paused              │             │   - e.g. form.submitted + form f-3 -> wf-12 v1           │             │   - e.g. trig:t-17:form.submitted -> [wf-12 v1]          │
└──────────────────────────────────────────────────────────┘             │                                                          │             └──────────────────────────────────────────────────────────┘             └──────────────────────────────────────────────────────────┘             └──────────────────────────────────────────────────────────┘             └──────────────────────────────────────────────────────────┘             └──────────────────────────────────────────────────────────┘
                                                                         │ STEP 3: Saves version 1 + outbox in one go               │
                                                                         │   - BEGIN; INSERT version; UPDATE live; INSERT outbox    │
                                                                         │   - e.g. workflow_versions wf-12 v1, live_version = 1    │
                                                                         └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Workflow DB                                                                                                                                                           ▼ Kafka                                                 ▼ Redis
╔═══════════════════════════════════════════╗    ╔═════════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════╗
║ workflows (Workflow DB) · key workflow_id ║    ║ workflow_versions (Workflow DB) · key workflow_id + version ║    ║ outbox (Workflow DB)                         ║    ║ Kafka message                                    ║    ║ Redis key                                    ║
╟───────────────────────────────────────────╢    ╟─────────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────╢
║ {                                         ║    ║ {                                                           ║    ║ {                                            ║    ║ {                                                ║    ║ {                                            ║
║   "workflow_id": "wf-12",                 ║    ║   "workflow_id": "wf-12",                                   ║    ║   "id": "ob-5501",                           ║    ║   "topic": "workflow.events",                    ║    ║   "trig:t-17:form.submitted": [              ║
║   "tenant_id": "t-17",                    ║    ║   "version": 1,                                             ║    ║   "destination": "kafka:workflow.events",    ║    ║   "key": "wf-12",                                ║    ║     { "workflow_id": "wf-12", "version": 1,  ║
║   "name": "New Lead Nurture",             ║    ║   "trigger": { "type": "form.submitted",                    ║    ║   "key": "wf-12",                            ║    ║   "headers": { "event_id": "ob-5501" },          ║    ║       "filter": { "form_id": "f-3" } } ],    ║
║   "live_version": 1,                      ║    ║                "form_id": "f-3" },                          ║    ║   "payload": { "type": "workflow.published", ║    ║   "value": { "type": "workflow.published",       ║    ║   "wfv:wf-12:1": "<nodes JSON of version 1>" ║
║   "status": "ACTIVE"                      ║    ║   "reentry": "ONCE",                                        ║    ║                "version": 1 },               ║    ║              "tenant_id": "t-17", "version": 1 } ║    ║ }                                            ║
║ }                                         ║    ║   "start": "n2",                                            ║    ║   "sent_at": null                            ║    ║ }                                                ║    ╚══════════════════════════════════════════════╝
╚═══════════════════════════════════════════╝    ║   "nodes": { "n2": ..., "n9": ... }                         ║    ║ }                                            ║    ╚══════════════════════════════════════════════════╝
                                                 ║ }                                                           ║    ╚══════════════════════════════════════════════╝
                                                 ╚═════════════════════════════════════════════════════════════╝
```

1. **Priya clicks Publish**
   - **a) What is sent**
     - `POST /v1/workflows/wf-12/publish`; the draft graph is already saved
   - **Data change:** none yet
   - **Why a draft and a publish:** Priya can fiddle with the draft all week. Only Publish makes it live.

2. **The Workflow Service checks the graph can run**
   - **a) Checks**
     - every path ends; every `if` has a yes and a no; every wait has a length
     - a loop must contain a wait (otherwise one contact spins forever and burns SMS money)
   - **Data change:** none
   - **Why:** a broken graph found at publish time costs nothing. Found while 10,000 contacts are inside, it costs a support ticket per contact.

3. **One transaction: new frozen version + outbox row**
   - **a) The transaction**
     - `INSERT workflow_versions (wf-12, 1, nodes...)`, `UPDATE workflows SET live_version = 1`, `INSERT outbox`
   - **Data change:** `workflow_versions` row `{wf-12, version: 1}`, `workflows.live_version = 1`, `outbox` row `ob-5501 workflow.published`
   - **Why frozen versions:** each run remembers its version. If Priya edits later, she publishes version 2; Rahul keeps walking version 1 and never lands on a step that no longer exists.
   - **Why the outbox:** saving and then sending to Kafka is two writes. A crash between them means the Trigger Matcher never hears about wf-12, and form submissions are silently ignored.

4. **The Outbox Relay copies the row into Kafka**
   - **a) How**
     - a small loop: `SELECT ... FROM outbox WHERE sent_at IS NULL FOR UPDATE SKIP LOCKED LIMIT 500`, publish, set `sent_at`
     - a crash after publishing but before `sent_at` means it publishes again; readers drop repeats by `event_id`
   - **Data change:** Kafka `workflow.events`, key `wf-12`
   - **Market note:** Debezium (a CDC, Change Data Capture, tool that reads PostgreSQL's change log) does the same job without polling. Either is fine; a polling relay is simpler to run, and it can also send to SQS, which Flow 3 needs.

5. **The Trigger Matcher updates the trigger index in Redis**
   - **a) How**
     - `trig:t-17:form.submitted` gets `{wf-12, v1, filter form_id = f-3}`
     - `wfv:wf-12:1` gets the frozen graph; it can never go stale because version 1 never changes
   - **Data change:** two Redis keys
   - **Why Redis:** every incoming event asks "who listens to me?". Asking PostgreSQL thousands of times a second is wasteful. Redis is only a copy: on a miss the matcher reads Workflow DB and refills.

**Say in the interview:** "Publishing creates an immutable version with an outbox event in one transaction. The relay pushes it to Kafka, and the Trigger Matcher refreshes a Redis index of event type → listening workflows, so matching is a cache lookup."

### Flow 2. Rahul submits the form → he is enrolled exactly once (API Gateway → Event Ingestion → Contact DB + outbox → Outbox Relay → Kafka → Trigger Matcher → Redis + Run DB)

```text
┌── STEP 1 ────────────────────────────────────────────────┐             ┌── STEP 1 ────────────────────────────────────────────────┐             ┌── STEP 2 ────────────────────────────────────────────────┐             ┌── STEP 2 ────────────────────────────────────────────────┐             ┌── STEP 3 ────────────────────────────────────────────────┐             ┌── STEP 3, 4 ─────────────────────────────────────────────┐             ┌── STEP 4, 5 ─────────────────────────────────────────────┐             ┌── STEP 4 ────────────────────────────────────────────────┐
│ Rahul's browser  (Priya's website)                       │             │ API Gateway                                              │             │ Event Ingestion                                          │             │ Contact DB  (PostgreSQL)                                 │             │ Outbox Relay                                             │             │ Kafka  (topic contact.events)                            │             │ Trigger Matcher                                          │             │ Redis  (cache)                                           │
├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤
│ STEP 1: Submits the contact form                         │ ──────────> │ STEP 1: Checks the form key and the rate                 │ ──────────> │ STEP 2: Finds or creates the contact                     │ ──────────> │ STEP 2: Keeps Rahul and the "form sent" news             │ ──────────> │ STEP 3: Copies the outbox row into Kafka                 │ ──────────> │ STEP 3: Keeps each contact's events in order             │ ──────────> │ STEP 4: Finds the workflows that listen                  │ ──┬───────> │ STEP 4: Returns the listeners for the event              │
│   - POST /v1/forms/f-3/submissions                       │             │   - public form key -> business t-17                     │             │   - match by email inside business t-17                  │             │   - both rows commit together, or neither                │             │   - same relay as Flow 1, other table                    │             │   - key c-501 = one lane for Rahul                       │             │   - reads the trigger index, checks filters              │   │         │   - hit in well under a millisecond                      │
│   - e.g. Rahul, rahul@example.com, "yoga prices?"        │             │   - e.g. a bot sending 50 forms a minute -> 429          │             │   - e.g. new contact c-501 Rahul, tag "lead"             │             │   - e.g. contacts c-501 + outbox e-77                    │             │   - e.g. e-77 -> contact.events, key c-501               │             │   - e.g. form.submitted, later email.opened              │             │   - e.g. form f-3 -> wf-12 v1 matches                    │   │         │   - e.g. trig:t-17:form.submitted -> [wf-12 v1]          │
└──────────────────────────────────────────────────────────┘             └──────────────────────────────────────────────────────────┘             │                                                          │             └──────────────────────────────────────────────────────────┘             └──────────────────────────────────────────────────────────┘             │                                                          │             │                                                          │   │         └──────────────────────────────────────────────────────────┘
                                                                                                                                                  │ STEP 2: Saves contact + event in one transaction         │                                                                                                                                                               │ STEP 4: Feeds each reader group on its own               │             │ STEP 5: Enrolls Rahul exactly once                       │   │
                                                                                                                                                  │   - contacts upsert + outbox row                         │                                                                                                                                                               │   - trigger-matcher, activity-writer                     │             │   - INSERT run ON CONFLICT DO NOTHING + outbox           │   │
                                                                                                                                                  │   - e.g. event id e-77 form.submitted                    │                                                                                                                                                               │   - e.g. each group has its own bookmark                 │             │   - e.g. run r-9001 at n2, status READY                  │   │
                                                                                                                                                  └──────────────────────────────────────────────────────────┘                                                                                                                                                               └──────────────────────────────────────────────────────────┘             └──────────────────────────────────────────────────────────┘   │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     │         ┌── STEP 5 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     │         │ Run DB  (PostgreSQL)                                     │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     │         ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     └───────> │ STEP 5: Stores the run and the "start it" note           │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               │   - UNIQUE workflow + contact + enroll_key               │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               │   - e.g. a repeat of e-77 inserts nothing                │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Contact DB                                                                                                   ▼ Kafka                                                    ▼ Redis                                            ▼ Run DB
╔════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════╗
║ contacts (Contact DB) · key contact_id ║    ║ outbox (Contact DB)                                       ║    ║ Kafka message                                       ║    ║ Redis key (read)                            ║    ║ runs (Run DB) · UNIQUE workflow_id + contact_id + enroll_key ║    ║ outbox (Run DB)                       ║
╟────────────────────────────────────────╢    ╟───────────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────╢
║ {                                      ║    ║ {                                                         ║    ║ {                                                   ║    ║ {                                           ║    ║ {                                                            ║    ║ {                                     ║
║   "contact_id": "c-501",               ║    ║   "id": "e-77",                                           ║    ║   "topic": "contact.events",                        ║    ║   "trig:t-17:form.submitted": [             ║    ║   "run_id": "r-9001",                                        ║    ║   "id": "ob-6001",                    ║
║   "tenant_id": "t-17",                 ║    ║   "destination": "kafka:contact.events",                  ║    ║   "key": "c-501",                                   ║    ║     { "workflow_id": "wf-12", "version": 1, ║    ║   "workflow_id": "wf-12",                                    ║    ║   "destination": "kafka:run.events",  ║
║   "name": "Rahul",                     ║    ║   "key": "c-501",                                         ║    ║   "headers": { "event_id": "e-77" },                ║    ║       "filter": { "form_id": "f-3" } } ]    ║    ║   "version": 1,                                              ║    ║   "key": "r-9001",                    ║
║   "email": "rahul@example.com",        ║    ║   "payload": { "type": "form.submitted",                  ║    ║   "value": { "type": "form.submitted",              ║    ║ }                                           ║    ║   "contact_id": "c-501",                                     ║    ║   "payload": { "type": "run.ready" }, ║
║   "time_zone": "Asia/Kolkata",         ║    ║                "form_id": "f-3",                          ║    ║              "tenant_id": "t-17", "form_id": "f-3", ║    ╚═════════════════════════════════════════════╝    ║   "enroll_key": "ONCE",                                      ║    ║   "sent_at": null                     ║
║   "tags": ["lead"],                    ║    ║                "fields": { "message": "yoga prices?" } }, ║    ║              "at": "2026-11-23T10:00:00Z" }         ║                                                       ║   "current_node": "n2",                                      ║    ║ }                                     ║
║   "assigned_rep": "u-9 (Anita)",       ║    ║   "sent_at": null                                         ║    ║ }                                                   ║                                                       ║   "status": "READY",                                         ║    ╚═══════════════════════════════════════╝
║   "email_opt_out": false,              ║    ║ }                                                         ║    ╚═════════════════════════════════════════════════════╝                                                       ║   "next_run_at": null,                                       ║
║   "sms_opt_out": false                 ║    ╚═══════════════════════════════════════════════════════════╝                                                                                                                  ║   "row_version": 1                                           ║
║ }                                      ║                                                                                                                                                                                   ║ }                                                            ║
╚════════════════════════════════════════╝                                                                                                                                                                                   ╚══════════════════════════════════════════════════════════════╝
```

1. **Rahul submits Priya's website form**
   - **a) The request**
     - `POST /v1/forms/f-3/submissions {email: rahul@example.com, name: Rahul, fields}`
     - the API Gateway turns the public form key into business `t-17` and rate-limits bots
   - **Data change:** none yet
   - **Why rate-limit here:** public forms get spammed. Each fake lead would start real SMS sends that cost Priya money.

2. **Event Ingestion saves the contact and the event in one transaction**
   - **a) Find or create the contact**
     - match by email inside business t-17; new, so contact `c-501`
   - **b) Same transaction:** `contacts` upsert + `outbox` row (event id `e-77`)
   - **Data change:** `contacts` row `{c-501, Rahul, tags: [lead]}`, `outbox` row `{e-77, form.submitted, key c-501}`
   - **Why:** "contact saved but event lost" means Rahul never gets the welcome email. "Event sent but contact rolled back" means a run for a contact who doesn't exist. One transaction makes both happen, or neither.
   - The website gets `202 Accepted` straight away; everything after this is background work.

3. **The relay publishes to Kafka `contact.events`, key `c-501`**
   - **a) Why key by contact**
     - all of Rahul's events travel in one ordered lane: form sent, then email opened, then tag added
   - **Data change:** Kafka message `form.submitted e-77`

4. **The Trigger Matcher finds the listening workflows**
   - **a) Lookup**
     - Redis `trig:t-17:form.submitted` → `[wf-12 v1, filter form_id = f-3]`; the filter matches
   - **b) Rules before enrolling**
     - is wf-12 `ACTIVE`? Does its re-entry rule allow Rahul in again?
   - **Data change:** none

5. **Enroll once: insert the run + an outbox row in one transaction**
   - **a) The insert**
     - `INSERT INTO runs (...) VALUES (r-9001, wf-12, 1, c-501, enroll_key 'ONCE', n2, READY) ON CONFLICT DO NOTHING`
     - plus `outbox {run.ready, key r-9001}` in the same transaction
   - **Data change:** `runs` row `{r-9001, current_node: n2, status: READY}`; `outbox` row `ob-6001`
   - **What enroll_key does:** `ONCE` means "only one run per contact per workflow, ever". `EVERY_TIME` uses the trigger event id (`e-77`), so a second form a month later starts a second run, but a repeat delivery of the same event does not.
   - **Why the UNIQUE rule and not "check first":** two copies of e-77 read by two consumers at the same moment would both see "no run yet". The database's unique rule lets exactly one insert win.

**Say in the interview:** "Ingestion upserts the contact with an outbox event; the matcher looks up listeners in Redis and inserts the run under a unique key (workflow, contact, enroll key) together with a run.ready outbox row, so duplicate deliveries can never double-enroll."

### Flow 3. The welcome email goes out once, then Rahul goes to sleep for 2 days (Kafka → Step Executor → Run DB + outbox → Outbox Relay → SQS → Email Worker → SendGrid → Run DB + outbox → Kafka)

```text
                                                                                                                                                                                                        ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
                                                                                                                                                                                                        ▼                                                                                                                                                                                                                          │
┌── STEP 1, 6 ─────────────────────────────────────────────┐             ┌── STEP 1, 2, 7 ──────────────────────────────────────────┐             ┌── STEP 2, 4, 5, 7 ───────────────────────────────────────┐             ┌── STEP 3, 6 ─────────────────────────────────────────────┐             ┌── STEP 3, 4 ─────────────────────────────────────────────┐             ┌── STEP 4, 5 ─────────────────────────────────────────────┐             ┌── STEP 5 ────────────────────────────────────────────────┐
│ Kafka  (topic run.events)                                │             │ Step Executor  (stateless, many copies)                  │             │ Run DB  (PostgreSQL)                                     │             │ Outbox Relay                                             │             │ SQS  (queue actions-email)                               │             │ Email Worker                                             │             │ SendGrid  (email company)                                │
├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤
│ STEP 1: Delivers "run r-9001 is ready"                   │ ──────────> │ STEP 1: Loads the run and its frozen graph               │ ──────────> │ STEP 2: Saves step + "send it" note together             │ ──────────> │ STEP 3: Sends the action to the right queue              │ ──────────> │ STEP 3: Holds the email job until a worker is free       │ ──────────> │ STEP 4: Checks rate limit, claims the step               │ ──────────> │ STEP 5: Delivers the welcome email                       │
│   - key r-9001 = one lane per run                        │             │   - run row from Run DB, graph from Redis                │             │   - UPDATE runs WHERE row_version = 1                    │             │   - destination sqs:actions-email                        │             │   - fair queue: each business gets its share             │             │   - Redis token bucket rl:t-17:email                     │             │   - adds an open-tracking pixel                          │
│   - e.g. run.ready from Flow 2                           │             │   - e.g. r-9001 at n2 = send_email "welcome"             │             │   - e.g. two executors? only one update wins             │             │   - e.g. MessageGroupId t-17                             │             │   - e.g. a 1M-contact blast cannot block t-17            │             │   - e.g. over the limit -> delay, try later              │             │   - e.g. to rahul@example.com                            │
│                                                          │             │                                                          │             │                                                          │             │                                                          │             │                                                          │             │                                                          │             └──────────────────────────────────────────────────────────┘
│ STEP 6: Delivers "the email step is done"                │             │ STEP 2: Checks, then asks for the email                  │             │ STEP 4: Lets one worker claim the step                   │             │ STEP 6: Sends "step done" to Kafka                       │             │ STEP 4: Hands it to one worker, retries on silence       │             │ STEP 5: Sends, then records the result                   │
│   - same lane, so it comes after run.ready               │             │   - opt-out check, then one transaction                  │             │   - UPDATE run_steps SET SENDING WHERE PENDING           │             │   - destination kafka:run.events                         │             │   - visibility timeout, 5 tries, then DLQ                │             │   - custom_args carry run_id + node_id                   │
│   - e.g. action.completed r-9001 n2                      │             │   - e.g. run_steps n2 PENDING + outbox to SQS            │             │   - e.g. 1 row = go; 0 rows = a repeat, skip             │             │   - e.g. action.completed, key r-9001                    │             │   - e.g. job ob-5502                                     │             │   - e.g. SendGrid 202, message id sg-AbC123              │
└──────────────────────────────────────────────────────────┘             │                                                          │             │                                                          │             └──────────────────────────────────────────────────────────┘             └──────────────────────────────────────────────────────────┘             └──────────────────────────────────────────────────────────┘
                              ▲                                          │ STEP 7: Moves to the wait and stops                      │             │ STEP 5: Saves SENT + "done" note together                │                                           │
                              │                                          │   - sets n3, WAITING, next_run_at = now + 2 days         │             │   - run_steps SENT + outbox action.completed             │                                           │
                              │                                          │   - e.g. next_run_at 2026-11-25T10:00:03Z                │             │   - e.g. provider_msg_id sg-AbC123                       │                                           │
                              │                                          └──────────────────────────────────────────────────────────┘             │                                                          │                                           │
                              │                                                                                                                   │ STEP 7: Holds the sleeping run                           │                                           │
                              │                                                                                                                   │   - partial index on next_run_at                         │                                           │
                              │                                                                                                                   │   - e.g. r-9001 WAITING until Wed 10:00                  │                                           │
                              │                                                                                                                   └──────────────────────────────────────────────────────────┘                                           │
                              │                                                                                                                                                                                                                          │
                              └──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Run DB                                                                                                                                                   ▼ SQS                                                     ▼ Redis                                                 ▼ SendGrid                                              ▼ Kafka
╔══════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════╗    ╔════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════╗
║ runs (Run DB) · after STEP 7             ║    ║ run_steps (Run DB) · key run_id + node_id         ║    ║ outbox (Run DB) · 2 rows                   ║    ║ SQS message (actions-email)                        ║    ║ Redis key (rate limit)                           ║    ║ SendGrid request (POST /v3/mail/send)            ║    ║ Kafka message                                    ║
╟──────────────────────────────────────────╢    ╟───────────────────────────────────────────────────╢    ╟────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────╢
║ {                                        ║    ║ {                                                 ║    ║ {                                          ║    ║ {                                                  ║    ║ {                                                ║    ║ {                                                ║    ║ {                                                ║
║   "run_id": "r-9001",                    ║    ║   "run_id": "r-9001",                             ║    ║   "id": "ob-5502",                         ║    ║   "MessageGroupId": "t-17",                        ║    ║   "rl:t-17:email": { "tokens": 49,               ║    ║   "to": "rahul@example.com",                     ║    ║   "topic": "run.events",                         ║
║   "current_node": "n3",                  ║    ║   "node_id": "n2",                                ║    ║   "destination": "sqs:actions-email",      ║    ║   "body": { "event_id": "ob-5502",                 ║    ║                      "refill": "50 per second" } ║    ║   "template_id": "welcome",                      ║    ║   "key": "r-9001",                               ║
║   "status": "WAITING",                   ║    ║   "status": "PENDING" then "SENDING" then "SENT", ║    ║   "key": "r-9001"                          ║    ║             "run_id": "r-9001", "node_id": "n2",   ║    ║ }                                                ║    ║   "custom_args": { "run_id": "r-9001",           ║    ║   "headers": { "event_id": "ob-5503" },          ║
║   "next_run_at": "2026-11-25T10:00:03Z", ║    ║   "provider_msg_id": "sg-AbC123",                 ║    ║ }                                          ║    ║             "template": "welcome", "to": "c-501" } ║    ╚══════════════════════════════════════════════════╝    ║                    "node_id": "n2" },            ║    ║   "value": { "type": "action.completed",         ║
║   "row_version": 3                       ║    ║   "attempts": 1                                   ║    ║ {                                          ║    ║ }                                                  ║                                                            ║   "tracking_settings": { "open_tracking": true } ║    ║              "node_id": "n2", "status": "SENT" } ║
║ }                                        ║    ║ }                                                 ║    ║   "id": "ob-5503",                         ║    ╚════════════════════════════════════════════════════╝                                                            ║ }                                                ║    ║ }                                                ║
╚══════════════════════════════════════════╝    ╚═══════════════════════════════════════════════════╝    ║   "destination": "kafka:run.events",       ║                                                                                                                      ╚══════════════════════════════════════════════════╝    ╚══════════════════════════════════════════════════╝
                                                                                                         ║   "key": "r-9001",                         ║
                                                                                                         ║   "payload": { "type": "action.completed", ║
                                                                                                         ║                "node_id": "n2" }           ║
                                                                                                         ║ }                                          ║
                                                                                                         ╚════════════════════════════════════════════╝
```

1. **The Step Executor picks up `run.ready r-9001`**
   - **a) Load**
     - the run row (`current_node n2`, `row_version 1`) from Run DB
     - the frozen graph `wfv:wf-12:1` from Redis: n2 = send_email "welcome"
   - **Data change:** none
   - **Why stateless executors:** an executor holds nothing between messages. Kill one mid-way and the next one reads the same row and carries on.

2. **Check, then record "send the email" in one transaction**
   - **a) Checks**
     - Rahul's `email_opt_out` is false; the workflow is still `ACTIVE`
   - **b) The transaction**
     - `UPDATE runs SET status = WAITING_ACTION, row_version = 2 WHERE run_id = r-9001 AND row_version = 1`
     - `INSERT run_steps (r-9001, n2, PENDING)` + `INSERT outbox (sqs:actions-email)`
   - **Data change:** `runs.status = WAITING_ACTION`; `run_steps` row n2 `PENDING`; outbox `ob-5502`
   - **What row_version does:** if two executors got the same message, only the first `UPDATE ... WHERE row_version = 1` changes a row. The second changes 0 rows and stops. This is optimistic locking: no lock is held, the loser just notices.

3. **The relay drops the job into SQS `actions-email`**
   - **a) Fair queue**
     - `MessageGroupId = t-17`; SQS fair queues spread delivery across businesses, so a big blast can't starve Priya
   - **Data change:** SQS message `{event_id ob-5502, run r-9001, node n2}`
   - **Why SQS here and Kafka elsewhere:** sends need per-message retry, delay and a DLQ (Dead Letter Queue), which SQS gives for free. Kafka is better for ordered event streams with many readers.

4. **The Email Worker checks the rate limit and claims the step**
   - **a) Rate limit**
     - Redis token bucket `rl:t-17:email`; if empty, push the message back with a short delay
   - **b) Claim**
     - `UPDATE run_steps SET status = SENDING WHERE run_id = r-9001 AND node_id = n2 AND status = PENDING`
     - 1 row changed = this worker owns it; 0 rows = someone already did it, so just delete the SQS message
   - **Data change:** `run_steps` n2 `PENDING → SENDING`

5. **Send through SendGrid, then save SENT + an outbox row in one transaction**
   - **a) Send**
     - `POST /v3/mail/send` with `custom_args {run_id, node_id}`, so later open events can be tied back to this step
   - **b) Record**
     - `run_steps` n2 `SENT, provider_msg_id sg-AbC123` + `outbox {action.completed, key r-9001}`
   - **Data change:** as above
   - **Crash in between (the honest part):** if the worker dies after SendGrid accepted the email but before the update, the row stays `SENDING`. SendGrid and Twilio have no idempotency keys, so no one can promise exactly-once at that edge. We make the gap tiny and choose per channel: a stale `SENDING` email is marked `UNKNOWN` and checked against SendGrid's activity by message id before any resend; SMS is never resent automatically (a duplicate SMS costs money and annoys people more than a missing one).

6. **The relay publishes `action.completed` to Kafka `run.events`**
   - **a) Same lane**
     - key `r-9001`, so it always arrives after the `run.ready` that started it
   - **Data change:** Kafka message `action.completed n2`

7. **The executor moves Rahul to the wait and stops**
   - **a) The update**
     - next node n3 is `wait P2D`: `current_node = n3, status = WAITING, next_run_at = now + 2 days` (in UTC)
   - **Data change:** `runs {n3, WAITING, next_run_at: 2026-11-25T10:00:03Z, row_version: 3}`
   - **Why no outbox here:** nobody needs to be told now. The row itself is the alarm clock, and the Timer Service will find it (Flow 4).
   - **Why not an SQS delay or a sleeping thread:** an SQS delay is at most 15 minutes and Kafka has no delayed delivery at all. A sleeping thread dies at the next deploy. A row with `next_run_at` survives everything.

**Say in the interview:** "The executor records the step as PENDING plus an outbox job in one transaction with an optimistic version check. Workers claim the step with a conditional update, send, then write SENT plus an action.completed outbox event. Providers have no idempotency, so we shrink that window and pick a per-channel policy. A wait is just a next_run_at on the row."

### Flow 4. Rahul opens the email; on Wednesday he wakes up and takes the "Yes" path (SendGrid webhook → Event Ingestion → Kafka → Activity Writer → Contact DB; Timer Service → Run DB + outbox → Outbox Relay → Kafka → Step Executor → Contact DB, Run DB)

```text
┌── STEP 1 ────────────────────────────────────────────────┐             ┌── STEP 1 ────────────────────────────────────────────────┐             ┌── STEP 1, 2 ─────────────────────────────────────────────┐             ┌── STEP 2 ────────────────────────────────────────────────┐             ┌── STEP 2, 5, 6 ──────────────────────────────────────────┐
│ SendGrid  (event webhook)                                │             │ Event Ingestion                                          │             │ Kafka  (topic contact.events)                            │             │ Activity Writer                                          │             │ Contact DB  (PostgreSQL)                                 │
├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤
│ STEP 1: Tells us Rahul opened the email                  │ ──────────> │ STEP 1: Checks the signature, writes to Kafka            │ ──────────> │ STEP 1: Keeps Rahul's events in order                    │ ──────────> │ STEP 2: Saves the open, drops repeats                    │ ──────────> │ STEP 2: Keeps the activity row                           │
│   - signed POST, a batch of events                       │             │   - no row of its own, so Kafka goes first               │             │   - same lane as his form event                          │             │   - INSERT ON CONFLICT (provider_event_id)               │             │   - index contact_id + type                              │
│   - e.g. open, custom_args r-9001 / n2                   │             │   - e.g. email.opened, key c-501                         │             │   - e.g. email.opened after form.submitted               │             │   - e.g. SendGrid sends sg-evt-77Q twice                 │             │   - e.g. c-501 email.opened n2, Mon 18:20                │
└──────────────────────────────────────────────────────────┘             └──────────────────────────────────────────────────────────┘             └──────────────────────────────────────────────────────────┘             └──────────────────────────────────────────────────────────┘             │                                                          │
                                                                                                                                                                                                                                                                                                    │ STEP 5: Answers "did Rahul open n2?"                     │
                                                                                                                                                                                                                                                                                                    │   - one indexed lookup, real opens only                  │
                                                                                                                                                                                                                                                                                                    │   - e.g. yes: machine_open = false                       │
                                                                                                                                                                                                                                                                                                    │                                                          │
                                                                                                                                                                                                                                                                                                    │ STEP 6: Adds the tag (via the tag worker)                │
                                                                                                                                                                                                                                                                                                    │   - tags + outbox contact.tag_added                      │
                                                                                                                                                                                                                                                                                                    │   - e.g. Rahul now has "engaged"                         │
                                                                                                                                                                                                                                                                                                    └──────────────────────────────────────────────────────────┘
                                                                                                                                                                                                                                                                                                                                                          ▲
                                                                                                                                                                                                                                                                                                                                                          │
                                                                                                                                                                                                                                                                                                                                                          │
┌── STEP 3 ────────────────────────────────────────────────┐             ┌── STEP 3, 6 ─────────────────────────────────────────────┐             ┌── STEP 4 ────────────────────────────────────────────────┐             ┌── STEP 4 ────────────────────────────────────────────────┐             ┌── STEP 5, 6 ─────────────────────────────────────────────┐
│ Timer Service                                            │             │ Run DB  (PostgreSQL)                                     │             │ Outbox Relay                                             │             │ Kafka  (topic run.events)                                │             │ Step Executor                                            │
├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤             ├──────────────────────────────────────────────────────────┤
│ STEP 3: Wakes runs whose wait has ended                  │ ──────────> │ STEP 3: Hands out due runs to one timer only             │ ──────────> │ STEP 4: Sends "run is ready" to Kafka                    │ ──────────> │ STEP 4: Delivers the wake-up to an executor              │ ──────────> │ STEP 5: Runs the condition n4                            │
│   - every second, per Run DB shard                       │             │   - FOR UPDATE SKIP LOCKED, set READY + outbox           │             │   - destination kafka:run.events                         │             │   - one lane per run                                     │             │   - reads Contact DB, picks yes or no                    │
│   - e.g. Wed 10:00:03 -> r-9001 is due                   │             │   - e.g. r-9001 WAITING -> READY                         │             │   - e.g. run.ready, key r-9001                           │             │   - e.g. run.ready r-9001 at n4                          │             │   - e.g. opened -> yes -> n5                             │
└──────────────────────────────────────────────────────────┘             │                                                          │             └──────────────────────────────────────────────────────────┘             └──────────────────────────────────────────────────────────┘             │                                                          │
                                                                         │ STEP 6: Records the branch and the next actions          │                                                                                                                                                               │ STEP 6: Walks the Yes path, one action at a time         │
                                                                         │   - n5 PENDING + outbox sqs:actions-tag                  │                                                                                                                                                               │   - same as Flow 3 for each action                       │
                                                                         │   - e.g. then n6: SMS to Anita                           │                                                                                                                                                               │   - e.g. n5 add tag, then n6 SMS to Anita                │
                                                                         └──────────────────────────────────────────────────────────┘                                                                                                                                                               └──────────────────────────────────────────────────────────┘
                                                                                                       ▲                                                                                                                                                                                                                          │
                                                                                                       └──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ SendGrid                                    ▼ Kafka                                                  ▼ Contact DB                                                                                                 ▼ Run DB
╔════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════╗    ╔════════════════════════════════════╗    ╔═════════════════════════════════════════════════╗
║ SendGrid event webhook (one item)      ║    ║ Kafka message                                     ║    ║ contact_activity (Contact DB) · UNIQUE provider_event_id ║    ║ contacts (Contact DB) · after the tag ║    ║ runs (Run DB)                      ║    ║ run_steps + outbox (Run DB)                     ║
╟────────────────────────────────────────╢    ╟───────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────╢    ╟────────────────────────────────────╢    ╟─────────────────────────────────────────────────╢
║ {                                      ║    ║ {                                                 ║    ║ {                                                        ║    ║ {                                     ║    ║ {                                  ║    ║ {                                               ║
║   "event": "open",                     ║    ║   "topic": "contact.events",                      ║    ║   "provider_event_id": "sg-evt-77Q",                     ║    ║   "contact_id": "c-501",              ║    ║   "run_id": "r-9001",              ║    ║   "run_steps": { "run_id": "r-9001",            ║
║   "sg_event_id": "sg-evt-77Q",         ║    ║   "key": "c-501",                                 ║    ║   "contact_id": "c-501",                                 ║    ║   "tags": ["lead", "engaged"]         ║    ║   "current_node": "n4" then "n5",  ║    ║                  "node_id": "n5",               ║
║   "sg_message_id": "sg-AbC123",        ║    ║   "headers": { "event_id": "sg-evt-77Q" },        ║    ║   "type": "email.opened",                                ║    ║ }                                     ║    ║   "status": "WAITING" then "READY" ║    ║                  "status": "PENDING" },         ║
║   "email": "rahul@example.com",        ║    ║   "value": { "type": "email.opened",              ║    ║   "run_id": "r-9001",                                    ║    ╚═══════════════════════════════════════╝    ║             then "WAITING_ACTION", ║    ║   "outbox": { "id": "ob-5520",                  ║
║   "run_id": "r-9001", "node_id": "n2", ║    ║              "run_id": "r-9001", "node_id": "n2", ║    ║   "node_id": "n2",                                       ║                                                 ║   "next_run_at": null,             ║    ║               "destination": "sqs:actions-tag", ║
║   "sg_machine_open": false,            ║    ║              "machine_open": false }              ║    ║   "machine_open": false,                                 ║                                                 ║   "row_version": 5                 ║    ║               "key": "r-9001" }                 ║
║   "timestamp": 1763922011              ║    ║ }                                                 ║    ║   "at": "2026-11-23T18:20:11Z"                           ║                                                 ║ }                                  ║    ║ }                                               ║
║ }                                      ║    ╚═══════════════════════════════════════════════════╝    ║ }                                                        ║                                                 ╚════════════════════════════════════╝    ╚═════════════════════════════════════════════════╝
╚════════════════════════════════════════╝                                                             ╚══════════════════════════════════════════════════════════╝
```

1. **SendGrid tells us Rahul opened the email (Monday evening)**
   - **a) How opens work**
     - the email carries a tiny invisible image; when Rahul's mail app loads it, SendGrid records "open"
     - SendGrid's Event Webhook POSTs a signed batch to `/v1/webhooks/sendgrid`
   - **b) Ingestion**
     - checks the signature (otherwise anyone could fake opens), maps `custom_args` to `run r-9001, node n2`
     - writes straight to Kafka `contact.events`, key `c-501`; there is no row of its own to pair with, so Kafka goes first and acts as the outbox
   - **Data change:** Kafka message `email.opened`, `event_id sg-evt-77Q`
   - **Machine opens:** Apple Mail Privacy Protection loads every image on Apple's servers, so "opened" can be true even if Rahul never looked. SendGrid flags these (`sg_machine_open`). We keep the flag and the condition ignores those opens.

2. **The Activity Writer saves the open, once**
   - **a) Insert**
     - `INSERT INTO contact_activity ... ON CONFLICT (provider_event_id) DO NOTHING`
   - **Data change:** `contact_activity {sg-evt-77Q, c-501, email.opened, r-9001, n2, machine_open: false}`
   - **Why:** webhooks are retried by the sender, so the same open can arrive twice. The unique id turns repeats into no-ops.

3. **Wednesday 10:00:03: the Timer Service wakes Rahul**
   - **a) The query (each Run DB shard, every second)**

            BEGIN;
            SELECT run_id FROM runs
             WHERE status = 'WAITING' AND next_run_at <= now()
             ORDER BY next_run_at LIMIT 500
             FOR UPDATE SKIP LOCKED;
            UPDATE runs SET status = 'READY' ... ;  INSERT INTO outbox (run.ready ...);
            COMMIT;

   - **Data change:** `runs.status WAITING → READY`; outbox `run.ready r-9001`
   - **What SKIP LOCKED does:** several timer copies run at once. Each one skips rows another copy has already locked, so no run is woken twice and no copy waits on another.
   - **Why it scales:** a partial index on `next_run_at WHERE status = 'WAITING'` means the query only touches rows that are due now, never the millions still sleeping.

4. **The relay publishes `run.ready` to Kafka `run.events`**
   - **Data change:** Kafka message `run.ready r-9001`

5. **The executor runs the condition n4: "did Rahul open n2?"**
   - **a) The check**
     - `SELECT 1 FROM contact_activity WHERE contact_id = c-501 AND type = 'email.opened' AND run_id = r-9001 AND node_id = n2 AND NOT machine_open`
     - one row → **Yes** → next node n5
   - **Data change:** none (a read)
   - **Why read at wake-up and not store a flag on the run:** the open is a fact about the contact. Any workflow can ask about it, and the run row stays small.

6. **The executor walks the Yes path, one action at a time**
   - **a) n5 add tag "engaged"**
     - exactly the Flow 3 pattern: `run_steps n5 PENDING` + `outbox sqs:actions-tag`
     - the Tag Worker writes `contacts.tags += engaged` + `outbox contact.tag_added` in one transaction, so "tag added" can trigger *other* workflows
   - **b) n6 SMS to Anita**
     - after n5 completes: `actions-sms`, Twilio, to the assigned rep `u-9`
   - **c) The No path, for comparison**
     - n7 follow-up SMS → n8 `next_run_at = now + 3 days` → n9 final email → `DONE`
   - **Data change:** `runs {n5, WAITING_ACTION}`; `run_steps n5 PENDING`; outbox `ob-5520`; later `contacts.tags = [lead, engaged]`

**Say in the interview:** "Opens come back through signed provider webhooks into contact activity, with machine opens flagged. Waits are rows with next_run_at; a timer claims due rows with SKIP LOCKED and emits run.ready through the outbox. The condition is a read of contact activity at wake-up, then each branch action reuses the same outbox → SQS → worker pattern."

## Key design choices

| Area | Choice | Why vs alternative |
|---|---|---|
| Journey state | One `runs` row per contact per workflow, with `current_node` + `next_run_at` | vs keeping state in workers or queues: those forget on a crash. The row is the single truth. |
| Workflow edits | Immutable versions; runs pin their version | vs editing in place: running contacts would point at deleted steps. |
| Waits | `next_run_at` + partial index + Timer Service with `SKIP LOCKED` | vs SQS delay (15 min max), Kafka (no delay), Redis sorted set alone (can lose timers on failover), cron scans of the whole table (slow). |
| Events vs jobs | Kafka for events (ordered, many readers); SQS for send jobs (retry, delay, DLQ, fair queues) | vs one tool for both: Kafka has no per-message retry; SQS has no replay or multiple readers. |
| Telling other systems | Outbox row in the same transaction, relay publishes; readers drop repeats by `event_id` | vs save then publish: a crash in between loses the event or leaves a half-done run. |
| Duplicate sends | `UNIQUE` enroll key, `row_version`, conditional claim `PENDING → SENDING` | vs "check then act": two copies both pass the check. |
| Provider edge | Per-channel policy: email may be checked and resent, SMS never auto-resent | vs pretending exactly-once: SendGrid and Twilio have no idempotency keys. |
| Fairness | SQS fair queues by business + Redis token bucket per business per channel | vs one shared FIFO: one big campaign delays everyone. |
| Conditions | Read contact activity at wake-up; ignore machine opens | vs trusting raw opens: Apple Mail Privacy Protection makes most iPhone opens fake. |
| Build vs buy | Interview: draw this. Production: seriously consider Temporal (see Deep Dive) | Temporal gives durable timers and retries out of the box, but adds a cluster to run and strict code rules. |

## Deep Dive (only what the flows did not cover)

### 1. Back-of-the-envelope estimates (say these early)

Assume ≈100,000 businesses, ≈50 million runs open at any moment, and each run doing ≈10 steps over ≈2 weeks. That gives ≈400 step executions a second on average, and ≈10x that at peaks (Monday-morning campaigns, Black Friday). Each run row is ≈300 bytes, so 50 million runs is ≈15 GB plus indexes: small for PostgreSQL, but split into shards by `run_id` so timers and writes spread out. The key insight: **almost all runs are asleep**, so the design must make sleeping free (just a row) and waking cheap (an index range scan).

### 2. What the market actually uses (honest comparison)

| Option | What it is | Good for | Why not (or when) |
|---|---|---|---|
| **Own engine on PostgreSQL** (this doc) | runs table + timer + executor + outbox | Full control, cheap per run, easy to explain | You build retries, versioning and monitoring yourself |
| **Temporal** (open source; grew out of Uber's Cadence) | "Durable execution": code that can `sleep(2 days)` and survive crashes; the server saves every step and timer | Exactly this problem. Publicly used by companies such as Netflix, Snap, Datadog and Coinbase. Write **one generic "interpreter" workflow** that walks the business's JSON graph | A cluster to run (or pay Temporal Cloud per action), workflow code must be deterministic, versioning needs care, history size limits per run |
| **AWS Step Functions** | Managed state machines | A few long business processes | Standard: priced per state change, which gets expensive for millions of contacts times many steps; Express: max 5 minutes, so no 2-day waits |
| **n8n / Zapier / Make** | Visual automation tools | One company's own glue work | Built for "one workflow, a few runs", not "one run per contact, millions at once, multi-tenant" |
| **Apache Airflow** | Scheduled batch jobs (DAGs) | Nightly data pipelines | Wrong shape: one run per schedule, not per contact event |
| **HighLevel, HubSpot, Klaviyo, Braze, Customer.io** | Products with exactly this builder | The product you are designing | Their internals are mostly not public. Don't claim you know them; say "this is how I would build it" |

What to say: "I'd draw the PostgreSQL design to show I understand the moving parts. In production I'd prototype on Temporal, with one interpreter workflow per enrollment, because it gives durable timers, retries and history for free. I'd only build my own if cost per run or tenant isolation forced it."

### 3. Timers in more detail

- **Shards:** Run DB is split by `run_id` hash; each shard has its own Timer copies, so no single "due list" becomes a hot spot.
- **Precision:** polling every second gives "a few seconds late at worst", which is fine for marketing.
- **Big spikes:** 100,000 contacts all waiting "until Monday 9:00" wake at once. Add a small random jitter (0 to 60 seconds) when setting `next_run_at`, and let the fair queues spread the sends.
- **Time zones and quiet hours:** "wait until 9 am" is worked out in the contact's zone (`Asia/Kolkata`) and stored as UTC. SMS outside 8 am to 9 pm local time is pushed to the next morning, because rules in many countries (for example TCPA, the US Telephone Consumer Protection Act) limit those hours.
- **Faster index option:** a Redis sorted set (score = wake time) can sit in front for sub-second wake-ups, but it is only a copy; the row in Run DB stays the truth.

### 4. Event waits ("wait until opened, or 2 days")

Store the run as `WAITING` with `next_run_at = +2 days` **and** a row in `run_waits {contact_id, event: email.opened, run_id}`. The Activity Writer, after saving an open, looks up `run_waits` for that contact and sets matching runs to `READY` + outbox in one transaction. Whichever comes first (the event or the timer) wins the `row_version` update; the other one changes 0 rows.

### 5. Exits and edits

- **Unsubscribe / STOP:** the opt-out flag is checked before every send (Flow 3, step 2). Twilio also blocks numbers that replied STOP.
- **Goal reached:** e.g. "leave when an appointment is booked": an `appointment.booked` event sets matching runs to `EXITED`.
- **Pause workflow:** the executor sees `PAUSED` and parks runs; resume puts them back to `READY`.
- **Delete a step that live runs are on:** impossible by design: versions are frozen. Offer "move contacts from v1 step n3 to v2 step n3" as a deliberate bulk action.

### 6. Failure scenarios

| What breaks | What happens | Why it is safe |
|---|---|---|
| Executor crashes mid-step | Kafka redelivers `run.ready` | `row_version` check: the work is redone or skipped, never doubled |
| Worker crashes after SendGrid accepted | Row stuck `SENDING` | Per-channel policy (Flow 3, step 5) |
| SendGrid down | Sends fail, SQS retries with backoff | After 5 tries → DLQ; run marked `FAILED` at n2, visible to Priya, replayable |
| Relay down | Outbox rows pile up | Nothing lost; they go out when it returns |
| Redis lost | Cache misses | Refilled from Workflow DB; rate limits briefly loose |
| Run DB shard fails over | Timers on that shard pause for seconds | Replica promoted; late wake-ups, nothing lost |
| Business's webhook URL slow | Their own queue backs up | Per-business fair queue plus timeouts; other businesses unaffected |

### 7. Why a "boxes in a line" answer gets rejected

Interviewers look for: (1) **where the per-contact state lives** (runs row + versions), (2) **how a 2-day wait survives a deploy** (stored timer, not a queue delay), (3) **the feedback loop** (worker result → next step, and opens coming back via webhooks), (4) **no duplicates** (unique keys, claims, outbox), (5) **fairness between tenants**. A diagram of Gateway → Kafka → Orchestrator → SQS → Workers with an unlabelled Redis covers none of these.

### 8. Rapid-fire interview Q&A

- **Why not one long-running process per contact?** 50 million mostly idle processes would waste memory and die on every deploy. A row costs bytes.
- **How do you guarantee order of steps for one contact?** Only one executor can move a run at a time (`row_version`), and run events are keyed by `run_id`.
- **What if a business edits a workflow while contacts are inside?** New version; old runs finish on the old one.
- **How do you stop one tenant from hurting others?** Fair queues by tenant, token buckets per tenant per channel, per-tenant caps on active runs.
- **Exactly-once sends?** Inside our system yes (unique keys, claims, outbox). At SendGrid/Twilio, no one can promise it; we shrink the window and choose per channel.
- **How do you show "where is Rahul"?** `runs` + `run_steps` already hold it; the history API reads them.
- **When would you pick Temporal?** When the team accepts running it (or paying for Temporal Cloud) and wants timers, retries and history without building them.
