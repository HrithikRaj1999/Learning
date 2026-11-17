# Distributed Message Queue Architecture (Amazon SQS style, with a Dead-Letter Queue)

> **The one idea to remember: "Handing out a message does not delete it. It only hides it for a while. The worker deletes it when the job is really done."**
> Picture a library book. When you borrow it, it leaves the shelf, but the library still owns it. If you don't return it or renew it in time, it goes back on the shelf for the next reader. A message in this queue works the same way.
> A **producer** (a service that has work to hand off, like the Order Service) drops a message into a named **queue** (a to-do tray). A **consumer** (a worker) takes a message, does the job, and then says "delete it". Between "here you go" and "delete it", the message is only **hidden** for a short time. That time is called the **visibility timeout**. If the worker crashes and never says "delete", the time runs out and the message simply **comes back** for another worker. That is why no message is ever lost.
> Some messages fail every single time (we call them "poison messages"). We don't retry those forever. After a set number of tries, the message is moved to a side queue called the **dead-letter queue (DLQ)**. Think of it as the "problem letters" box at a post office. An engineer gets an alert, fixes the bug, and moves the messages back.
> Every queue is split into **partitions** (like several checkout lanes in a shop, so many customers are served at once). Every partition is kept on **3 machines in 3 different buildings**. More lanes give speed (millions of messages a second). Three copies give safety (one building can burn down and nothing is lost).
> Deep dive: [Deep Dive](#deep-dive-only-what-the-flows-above-did-not-cover)

## Requirements (minimal)

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

### Functional (what the product does)

- **Create and delete queues (`CreateQueue`, `DeleteQueue`)**
  - Each queue has its own settings: how long a taken message stays hidden, how many days messages are kept, and which dead-letter queue catches the failures.
    - e.g. Priya sets up `order-emails` and its "problem box" `order-emails-dlq`.
- **Send a message (`SendMessage`), with an optional delay**
  - The producer hears "OK" only after the message is safely stored. A delay lets a message stay invisible for a while before anyone can take it.
    - e.g. Order Service sends "email Rahul about order o-301". A reminder email can be delayed by 10 minutes.
- **Receive messages with long polling (`ReceiveMessage`)**
  - If the queue is empty, the worker's request waits up to 20 seconds instead of coming back empty right away. Like waiting at the counter instead of phoning every second to ask "anything yet?".
    - e.g. Email Worker w-1 waits, and gets message m-501 the moment it arrives.
- **Delete after processing (`DeleteMessage`)**
  - The delete uses a **receipt handle**. It is like the claim ticket from a coat check: you get a fresh one every time you take a message, and you need it to finish the job.
    - e.g. w-1 sends the email to Rahul, then deletes m-501.
- **Visibility timeout**
  - A taken message is hidden for, say, 30 seconds. If nobody deletes it in that time, it comes back, like the library book that returns itself.
    - e.g. w-2 crashes while holding m-777. 30 seconds later, w-1 gets m-777.
- **Dead-letter queue (DLQ) + moving messages back**
  - After a set number of failed tries, the message moves to the dead-letter queue. After the bug is fixed, it can be moved back.
    - e.g. m-777 fails 5 times and lands in `order-emails-dlq`. Anita is paged, fixes the bug, and moves it back.
- **Optional: FIFO queue (First In, First Out)**
  - Strict order, and no duplicates, inside one **message group**. Think of one line per family at a counter: each family is served in order, but different families don't wait for each other.
    - e.g. in `payments.fifo`, Rahul's "charge" is always handled before his "refund".

</td><td valign="top" width="50%" markdown="1">

### Non-functional (how well it must work)

- **No message is ever lost (at-least-once delivery)**
  - "At least once" means every message is delivered one or more times, never zero. Each message is written to 3 machines in 3 buildings. "OK" means at least 2 of them have it on disk.
    - e.g. a whole building loses power. m-501 is still safe on the other two.
- **Handles a very large load, and grows by adding machines**
  - Millions of messages a second across many queues. A busy queue simply gets more partitions (more checkout lanes).
    - e.g. `order-emails` goes from 4 to 16 partitions before a big sale.
- **Fast**
  - A send is answered in under about 50 milliseconds (a blink takes about 100). That is one disk write plus one copy to a nearby building.
    - e.g. the Order Service is not slowed down by handing off the email job, so Rahul's checkout page stays quick.
- **Messages are kept for 4 to 14 days**
  - A message nobody has read is kept for the queue's keep-time (its retention period), then removed.
    - e.g. if the Email Workers are down for a whole weekend, Rahul's email is still waiting on Monday.
- **Always up**
  - When a machine dies, another copy takes over within seconds.
    - e.g. Storage Node 1 dies. Node 2 becomes the leader (the one copy that accepts writes) of p-2, and sends keep working.
- **One busy customer can't slow down the others**
  - Each queue and each account has a speed limit.
    - e.g. a runaway script sending 1 million messages a second is told "slow down". Other queues don't even notice.

</td></tr></table>

## APIs

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

| Feature | API |
|---|---|
| Create queue | `POST /v1/queues {name, attributes: {VisibilityTimeout, MessageRetentionPeriod, RedrivePolicy, FifoQueue}}` → `{queueUrl}` |
| Delete queue | `DELETE /v1/queues/{queue}` |
| Send | `POST /v1/queues/{queue}/messages {body, delaySeconds?, attributes?}` → `{messageId, md5OfBody}` |
| Send many | `POST /v1/queues/{queue}/messages:batch` (up to 10 in one call) |
| FIFO send extras | `messageGroupId` (what must stay in order), `messageDeduplicationId` (same id = same message) |

</td><td valign="top" width="50%" markdown="1">

| Feature | API |
|---|---|
| Receive | `GET /v1/queues/{queue}/messages?maxCount=10&waitTime=20&visibilityTimeout=30` → `{messages[{messageId, receiptHandle, body}]}` |
| Delete | `DELETE /v1/queues/{queue}/messages/{receiptHandle}` |
| More time | `PATCH /v1/queues/{queue}/messages/{receiptHandle} {visibilityTimeout}` (ChangeMessageVisibility) |
| Move back from DLQ | `POST /v1/move-tasks {source, destination, maxPerSecond}` → `{taskId}` (StartMessageMoveTask) |
| Move progress | `GET /v1/move-tasks/{taskId}` → `{status, moved, total}` |

</td></tr></table>

## Diagram

A quick map of all the parts and how they connect. Arrows (`──>`) show which way requests or messages move. What each store keeps is in **Schema Overview**; each flow below walks through one piece.

```text
PRODUCERS (outside)                       ╔══ THE QUEUE SYSTEM: everything inside this box is the queue ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗          CONSUMERS + ALERTS (outside)
                                          ║                                                                                                                                                                                ║
┌──────────────────────────────┐          ║                                                 ┌──────────────────────────────┐                                                            ┌──────────────────────────────┐   ║          ┌──────────────────────────────┐
│ Order Service (producer)     │ ─────┐   ║                                         ┌─────> │ Partition Leaders            │ ─────┬───────────────────────────────────────────────────> │ Front-end (receive side)     │ ──╫──┬─────> │ Email Workers (consumer)     │
├──────────────────────────────┤      │   ║                                         │       ├──────────────────────────────┤      │                                                     ├──────────────────────────────┤   ║  │       ├──────────────────────────────┤
│ - sends 'email Rahul'        │      │   ║                                         │       │ - hold the messages          │      │                                                     │ - same servers as on left    │   ║  │       │ - receive, email, delete     │
│ - holds nothing              │      │   ║                                         │       │ - log on disk                │      │                                                     │ - receive (long poll)        │   ║  │       │ - crash = message comes back │
└──────────────────────────────┘      │   ║                                         │       │ - ready list in memory       │      │                                                     │ - delete by receipt handle   │   ║  │       └──────────────────────────────┘
                                      │   ║                                         │       └──────────────────────────────┘      │                                                     └──────────────────────────────┘   ║  │
                                      │   ║                                         │                                             │                                                                                        ║  │
                                      │   ║                                         │                                             │                                                                                        ║  │
                                      │   ║                                         │                                             │                                                                                        ║  │
┌──────────────────────────────┐      │   ║   ┌──────────────────────────────┐      │       ┌──────────────────────────────┐      │       ┌──────────────────────────────┐                                                 ║  │       ┌──────────────────────────────┐
│ Payment Service (producer)   │ ─────┼───╫─> │ Front-end (send side)        │ ─────┼─────> │ Redis (settings cache)       │      ├─────> │ Follower Copies              │                                                 ║  └─────> │ Payment Workers (consumer)   │
├──────────────────────────────┤      │   ║   ├──────────────────────────────┤      │       ├──────────────────────────────┤      │       ├──────────────────────────────┤                                                 ║          ├──────────────────────────────┤
│ - sends payment steps        │      │   ║   │ - send + setup calls         │      │       │ - copy of queue settings     │      │       │ - 2 more copies, other zones │                                                 ║          │ - receive in order per user  │
│ - FIFO: order per user       │      │   ║   │ - check login + rate limit   │      │       │ - rate-limit counters        │      │       │ - OK after 2 of 3 have it    │                                                 ║          └──────────────────────────────┘
└──────────────────────────────┘      │   ║   │ - hold nothing, add more     │      │       │ - safe to lose               │      │       └──────────────────────────────┘                                                 ║
                                      │   ║   └──────────────────────────────┘      │       └──────────────────────────────┘      │                                                                                        ║
                                      │   ║                                         │                                             │                                                                                        ║
                                      │   ║                                         │                                             │                                                                                        ║
                                      │   ║                                         │                                             │                                                                                        ║
┌──────────────────────────────┐      │   ║                                         │                                             │       ┌──────────────────────────────┐              ┌──────────────────────────────┐   ║          ┌──────────────────────────────┐              ┌──────────────────────────────┐
│ Anita (on-call engineer)     │ ─────┘   ║                                         │                                             └─────> │ Visibility Timer             │ ─────┬─────> │ Dead-letter queue            │ ──╫────────> │ Metrics + Alarms             │ ───────────> │ Anita's phone                │
├──────────────────────────────┤          ║                                         │                                                     ├──────────────────────────────┤      │       ├──────────────────────────────┤   ║          ├──────────────────────────────┤              ├──────────────────────────────┤
│ - starts the move back       │          ║                                         │                                                     │ - hides received messages    │      │       │ - messages failed 5 times    │   ║          │ - dead-letter > 0 -> alarm   │              │ - gets the page              │
└──────────────────────────────┘          ║                                         │                                                     │ - time up -> ready again     │      │       │ - kept 14 days               │   ║          └──────────────────────────────┘              └──────────────────────────────┘
                                          ║                                         │                                                     │ - 5 fails -> dead-letter     │      │       └──────────────────────────────┘   ║
                                          ║                                         │                                                     └──────────────────────────────┘      │                                          ║
                                          ║                                         │                                                                                           │                                          ║
                                          ║                                         │                                                                                           │                                          ║
                                          ║                                         │                                                                                           │                                          ║
                                          ║                                         │       ┌──────────────────────────────┐              ┌──────────────────────────────┐      │                                          ║
                                          ║                                         └─────> │ Metadata Service             │ ─────┬─────> │ Move Task Worker             │ ─────┘                                          ║
                                          ║                                                 ├──────────────────────────────┤      │       ├──────────────────────────────┤                                                 ║
                                          ║                                                 │ - create / delete queues     │      │       │ - dead-letter -> main queue  │                                                 ║
                                          ║                                                 │ - start move tasks           │      │       │ - copy first, delete after   │                                                 ║
                                          ║                                                 │ - never touches messages     │      │       └──────────────────────────────┘                                                 ║
                                          ║                                                 └──────────────────────────────┘      │                                                                                        ║
                                          ║                                                                                       │                                                                                        ║
                                          ║                                                                                       │                                                                                        ║
                                          ║                                                                                       │                                                                                        ║
                                          ║                                                                                       │       ┌──────────────────────────────┐                                                 ║
                                          ║                                                                                       └─────> │ Metadata DB (PostgreSQL)     │                                                 ║
                                          ║                                                                                               ├──────────────────────────────┤                                                 ║
                                          ║                                                                                               │ - queues (settings)          │                                                 ║
                                          ║                                                                                               │ - partitions (who leads)     │                                                 ║
                                          ║                                                                                               │ - move_tasks                 │                                                 ║
                                          ║                                                                                               │ - outbox (changes to apply)  │                                                 ║
                                          ║                                                                                               └──────────────────────────────┘                                                 ║
                                          ║                                                                                                                                                                                ║
                                          ╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## Schema Overview

What every store keeps, as one real example per box. Where a field can take several values, they are shown as `"A" or "B"`. Each row scrolls sideways.

### PostgreSQL: Metadata DB (queues, partitions, move tasks, outbox)

```text
╔══════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════════════════╗
║ queues (Metadata DB) · UNIQUE account_id + name  ║    ║ partitions (Metadata DB) · key queue_id + partition_no      ║    ║ move_tasks (Metadata DB) · key task_id, one owner (lease)       ║    ║ outbox (Metadata DB) · same transaction as the change             ║
╟──────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────────────────────╢
║ {                                                ║    ║ {                                                           ║    ║ {                                                               ║    ║ {                                                                 ║
║   "queue_id": "q-12",                            ║    ║   "queue_id": "q-12",                                       ║    ║   "task_id": "t-9",                                             ║    ║   "id": "ob-41",                                                  ║
║   "account_id": "1111",                          ║    ║   "partition_no": 2,                                        ║    ║   "source_queue": "order-emails-dlq",                           ║    ║   "type": "queue.created" or "leader.changed" or "queue.deleted", ║
║   "name": "order-emails",                        ║    ║   "leader_node": "node-1 (zone a)",                         ║    ║   "destination_queue": "order-emails",                          ║    ║   "payload": {                                                    ║
║   "type": "STANDARD" or "FIFO",                  ║    ║   "follower_nodes": ["node-2 (zone b)", "node-3 (zone c)"], ║    ║   "max_per_second": 50,                                         ║    ║     "queue_id": "q-12",                                           ║
║   "visibility_timeout": "30 s",                  ║    ║   "epoch": 7,                                               ║    ║   "moved": 1,                                                   ║    ║     "partitions": 4                                               ║
║   "retention": "4 days",                         ║    ║   "status": "ACTIVE" or "MOVING"                            ║    ║   "total": 1,                                                   ║    ║   },                                                              ║
║   "delay": "0 s",                                ║    ║ }                                                           ║    ║   "owner_worker": null or "mover-3",                            ║    ║   "status": "NEW" or "DONE",                                      ║
║   "redrive_policy": {                            ║    ╚═════════════════════════════════════════════════════════════╝    ║   "lease_until": "10:40:30",                                    ║    ║   "created_at": "09:00:01"                                        ║
║     "dead_letter_queue": "order-emails-dlq",     ║                                                                       ║   "status": "RUNNING" or "COMPLETED" or "CANCELLED" or "FAILED" ║    ║ }                                                                 ║
║     "max_receive_count": 5                       ║                                                                       ║ }                                                               ║    ╚═══════════════════════════════════════════════════════════════════╝
║   },                                             ║                                                                       ╚═════════════════════════════════════════════════════════════════╝
║   "partition_count": 4,                          ║
║   "status": "CREATING" or "ACTIVE" or "DELETING" ║
║ }                                                ║
╚══════════════════════════════════════════════════╝
```

### Redis: settings cache + rate limits

```text
╔════════════════════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════╗
║ Redis key: queue settings + partition leaders (60 s copy in each       ║    ║ Redis key: rate-limit counter per queue per second ║
║ front-end)                                                             ║    ╟────────────────────────────────────────────────────╢
╟────────────────────────────────────────────────────────────────────────╢    ║ rl:order-emails:10:00:00 = 1240                    ║
║ {                                                                      ║    ║ (expires in 2 s; over the limit -> 'slow down')    ║
║   "qcfg:order-emails": {                                               ║    ╚════════════════════════════════════════════════════╝
║     "type": "STANDARD",                                                ║
║     "visibility_timeout": "30 s",                                      ║
║     "max_receive_count": 5,                                            ║
║     "dead_letter_queue": "order-emails-dlq",                           ║
║     "leaders": {                                                       ║
║       "p-0": "node-4",                                                 ║
║       "p-1": "node-2",                                                 ║
║       "p-2": "node-1",                                                 ║
║       "p-3": "node-6"                                                  ║
║     }                                                                  ║
║   }                                                                    ║
║ }                                                                      ║
╚════════════════════════════════════════════════════════════════════════╝
```

### Storage node: message log, state index, in-memory lists, files on disk

```text
╔══════════════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════╗
║ message log record (storage node, append-only file) · key offset ║    ║ message state index (storage node, RocksDB) · key message_id ║    ║ in memory on the leader (rebuilt from disk after a restart) ║    ║ files on a storage node disk                     ║
╟──────────────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────╢
║ {                                                                ║    ║ {                                                            ║    ║ ready list     : [m-498, m-499, m-501]                      ║    ║ /data/q-12/p-2/                                  ║
║   "offset": 88412,                                               ║    ║   "message_id": "m-501",                                     ║    ║ timer heap     : (10:00:12, m-497)  <- top                  ║    ║   00000000.log   sealed, messages 0..87999       ║
║   "message_id": "m-501",                                         ║    ║   "offset": 88412,                                           ║    ║ delayed heap   : (10:10:00, m-502)                          ║    ║   00088000.log   current file, new messages here ║
║   "sent_at": "10:00:00",                                         ║    ║   "state": "DELAYED" or "READY" or "INFLIGHT" or "DELETED",  ║    ║ waiting        : [w-3 until 10:00:20]                       ║    ║   state/         message state index (key-value) ║
║   "visible_at": "10:00:00",                                      ║    ║   "invisible_until": null or "10:00:31",                     ║    ╚═════════════════════════════════════════════════════════════╝    ║   checkpoint     last committed offset           ║
║   "body": {                                                      ║    ║   "receive_count": 1,                                        ║                                                                       ║ (old files are deleted whole, never edited)      ║
║     "order_id": "o-301",                                         ║    ║   "receipt_nonce": null or "n-8f3a"                          ║                                                                       ╚══════════════════════════════════════════════════╝
║     "email": "rahul@mail.com",                                   ║    ║ }                                                            ║
║     "template": "order_confirmed"                                ║    ╚══════════════════════════════════════════════════════════════╝
║   },                                                             ║
║   "attributes": {                                                ║
║     "source": "order-service"                                    ║
║   }                                                              ║
║ }                                                                ║
╚══════════════════════════════════════════════════════════════════╝
```

### What a consumer gets: the receive response and the receipt handle

```text
╔═════════════════════════════════════════════╗    ╔═══════════════════════════════════════════╗
║ what the worker receives                    ║    ║ receipt handle (inside the token, signed) ║
╟─────────────────────────────────────────────╢    ╟───────────────────────────────────────────╢
║ {                                           ║    ║ {                                         ║
║   "Messages": [                             ║    ║   "queue": "order-emails",                ║
║     {                                       ║    ║   "partition": "p-2",                     ║
║       "MessageId": "m-501",                 ║    ║   "message_id": "m-501",                  ║
║       "ReceiptHandle": "AQEBx9 (rh-501-a)", ║    ║   "receipt_nonce": "n-8f3a",              ║
║       "Body": {                             ║    ║   "signature": "hmac-sha256(...)"         ║
║         "order_id": "o-301",                ║    ║ }                                         ║
║         "email": "rahul@mail.com"           ║    ╚═══════════════════════════════════════════╝
║       },                                    ║
║       "Attributes": {                       ║
║         "ApproximateReceiveCount": 1,       ║
║         "SentTimestamp": "10:00:00"         ║
║       }                                     ║
║     }                                       ║
║   ]                                         ║
║ }                                           ║
╚═════════════════════════════════════════════╝
```

### Dead-letter queue: the redrive rule, a dead message, metrics and the alarm

```text
╔════════════════════════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════╗
║ redrive rule (part of the queue settings)                              ║    ║ message in the dead-letter queue                ║    ║ metrics, one point per queue per minute   ║    ║ alarm rule                                        ║
╟────────────────────────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────╢    ╟───────────────────────────────────────────╢    ╟───────────────────────────────────────────────────╢
║ {                                                                      ║    ║ {                                               ║    ║ 10:08  order-emails-dlq  visible = 1      ║    ║ {                                                 ║
║   "deadLetterTargetArn": "arn:aws:sqs:ap-south-1:1111:order-emails-    ║    ║   "message_id": "m-777",                        ║    ║ 10:08  order-emails      visible = 0,     ║    ║   "alarm": "order-emails-dlq not empty",          ║
║       dlq",                                                            ║    ║   "body": {                                     ║    ║                          oldest age = 2 s ║    ║   "metric": "ApproximateNumberOfMessagesVisible", ║
║   "maxReceiveCount": 5                                                 ║    ║     "order_id": "o-302",                        ║    ╚═══════════════════════════════════════════╝    ║   "condition": "> 0 for 1 minute",                ║
║ }                                                                      ║    ║     "email": "rahul@@mail.com"                  ║                                                     ║   "action": "page on-call (Anita)",               ║
╚════════════════════════════════════════════════════════════════════════╝    ║   },                                            ║                                                     ║   "state": "OK" or "ALARM"                        ║
                                                                              ║   "attributes": {                               ║                                                     ║ }                                                 ║
                                                                              ║     "dead_letter_source_queue": "order-emails", ║                                                     ╚═══════════════════════════════════════════════════╝
                                                                              ║     "receive_count_when_moved": 5,              ║
                                                                              ║     "first_sent_at": "10:05:00",                ║
                                                                              ║     "moved_at": "10:08:00"                      ║
                                                                              ║   },                                            ║
                                                                              ║   "state": "READY" or "INFLIGHT" or "DELETED"   ║
                                                                              ║ }                                               ║
                                                                              ╚═════════════════════════════════════════════════╝
```

### FIFO queue extras: sequence numbers, deduplication ids, group locks

```text
╔═══════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════╗
║ FIFO message log (storage node) · seq grows per partition ║    ║ deduplication ids (inside the partition), kept 5 minutes ║    ║ message group state (inside the partition) ║
╟───────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────╢
║ [                                                         ║    ║ user-rahul:charge-o-301 -> m-901                         ║    ║ {                                          ║
║   {                                                       ║    ║    (until 10:15:00)                                      ║    ║   "user-rahul": {                          ║
║     "seq": 1001,                                          ║    ║ user-rahul:refund-o-301 -> m-902                         ║    ║     "in_flight": null or "m-901",          ║
║     "group": "user-rahul",                                ║    ║    (until 10:15:02)                                      ║    ║     "waiting": ["m-902"]                   ║
║     "dedup_id": "charge-o-301",                           ║    ║ (saved in the same log write as the message)             ║    ║   }                                        ║
║     "message_id": "m-901",                                ║    ╚══════════════════════════════════════════════════════════╝    ║ }                                          ║
║     "body": "charge 999"                                  ║                                                                    ╚════════════════════════════════════════════╝
║   },                                                      ║
║   {                                                       ║
║     "seq": 1002,                                          ║
║     "group": "user-rahul",                                ║
║     "dedup_id": "refund-o-301",                           ║
║     "message_id": "m-902",                                ║
║     "body": "refund 999"                                  ║
║   }                                                       ║
║ ]                                                         ║
╚═══════════════════════════════════════════════════════════╝
```

## Flows (the big diagram, one piece at a time)

Each flow is one slice of the big diagram. Every box says what it does in each step (`STEP n: what`, then how, then an example). Arrows go straight from box to box. Under each diagram, **Data in this flow** shows the rows, keys, log records and messages that flow touches, side by side (scroll sideways). The numbered steps below match the `STEP n` in the boxes.

### Flow 1. Priya creates a queue and its dead-letter queue (CreateQueue → Metadata Service → PostgreSQL + outbox → Config Publisher → storage nodes + Redis)

```text
┌── STEP 1, 2 ─────────────────────────────────────────────┐            ┌── STEP 1, 2 ─────────────────────────────────────────────┐            ┌── STEP 2 ────────────────────────────────────────────────┐            ┌── STEP 2, 3 ─────────────────────────────────────────────┐            ┌── STEP 3, 4, 5 ──────────────────────────────────────────┐            ┌── STEP 4 ────────────────────────────────────────────────┐
│ Priya  (Order Service team, setup script)                │            │ Front-end Servers  (front door)                          │            │ Metadata Service  (the queue registry)                   │            │ Metadata DB  (PostgreSQL)                                │            │ Config Publisher  (small always-on worker)               │            │ Storage Nodes 1, 2, 3                                    │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Creates the dead-letter queue first              │ ─────────> │ STEP 1, 2: Checks who is calling, then sends the call    │ ─────────> │ STEP 2: Checks the redrive rule                          │ ─────────> │ STEP 2: Stores the queue and a to-do note                │ ─────────> │ STEP 3: Reads new outbox rows                            │ ────┬────> │ STEP 4: Create empty partitions                          │
│   - HTTPS POST /v1/queues (CreateQueue), retention 14    │            │            aside                                         │            │   - dead-letter queue exists, same account, same type    │            │   - queues + partitions + outbox rows in one commit      │            │   - many times a second; two publishers never take the   │     │      │   - 'create if missing', so a repeat is harmless         │
│     days                                                 │            │   - only Priya's account may create queues in it         │            │   - e.g. a FIFO queue needs a FIFO dead-letter queue     │            │   - e.g. q-12 CREATING; ob-41 queue.created NEW          │            │     same row                                             │     │      │   - e.g. /data/q-12/p-2/00000000.log on node-1, 2 and 3  │
│   - e.g. order-emails-dlq                                │            │   - setup calls go to the Metadata Service (gRPC)        │            │                                                          │            │                                                          │            │   - e.g. picks ob-41                                     │     │      └──────────────────────────────────────────────────────────┘
│                                                          │            │   - e.g. CreateQueue never touches a storage node        │            │ STEP 2: Plans the partitions                             │            │ STEP 3: Hands new outbox rows to one publisher           │            │                                                          │     │
│ STEP 1: Then creates the main queue                      │            └──────────────────────────────────────────────────────────┘            │   - least busy nodes, one per availability zone          │            │   - SELECT ... WHERE status = 'NEW' FOR UPDATE SKIP      │            │ STEP 4: Does the to-do, every step safe to repeat        │     │
│   - VisibilityTimeout 30 s, RedrivePolicy: after 5 tries │                                                                                    │     (building)                                           │            │     LOCKED                                               │            │   - gRPC CreatePartition to the 3 chosen nodes           │     │
│     -> order-emails-dlq                                  │                                                                                    │   - e.g. p-2: leader node-1, copies on node-2, node-3    │            │   - e.g. ob-41 locked by one Config Publisher            │            │   - Redis SET qcfg:order-emails                          │     │
│   - e.g. order-emails, kept 4 days                       │                                                                                    │                                                          │            └──────────────────────────────────────────────────────────┘            │   - e.g. crashed halfway? the row is still NEW, so it    │     │
│                                                          │                                                                                    │ STEP 2: Saves queue + partitions + outbox together       │                                                                                    │          runs again                                      │     │
│ STEP 2: Gets back the queue address                      │                                                                                    │   - one transaction: INSERT queues, partitions, outbox;  │                                                                                    │                                                          │     │
│   - a URL her service uses for every later call          │                                                                                    │     COMMIT                                               │                                                                                    │ STEP 5: Ticks the note off last                          │     │
│   - e.g. https://queue.example.com/1111/order-emails     │                                                                                    │   - e.g. never calls nodes or Redis itself               │                                                                                    │   - one transaction: queue ACTIVE + outbox row DONE      │     │
└──────────────────────────────────────────────────────────┘                                                                                    └──────────────────────────────────────────────────────────┘                                                                                    │   - e.g. q-12 ACTIVE; ob-41 DONE                         │     │
                                                                                                                                                                                                                                                                                                └──────────────────────────────────────────────────────────┘     │
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │      ┌── STEP 4 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                                                                                                                                                                 │      │ Redis  (settings cache)                                  │
                                                                                                                                                                                                                                                                                                                                                                 │      ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                                                                                                                                                                 ├────> │ STEP 4: Stores the queue settings                        │
                                                                                                                                                                                                                                                                                                                                                                 │      │   - qcfg:order-emails = settings + who leads each        │
                                                                                                                                                                                                                                                                                                                                                                 │      │     partition                                            │
                                                                                                                                                                                                                                                                                                                                                                 │      │   - e.g. p-2 is led by node-1                            │
                                                                                                                                                                                                                                                                                                                                                                 │      └──────────────────────────────────────────────────────────┘
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │      ┌── STEP 5 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                                                                                                                                                                 │      │ Metadata DB  (same database, drawn again)                │
                                                                                                                                                                                                                                                                                                                                                                 │      ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                                                                                                                                                                 └────> │ STEP 5: Queue ACTIVE, note DONE                          │
                                                                                                                                                                                                                                                                                                                                                                        │   - UPDATE queues + UPDATE outbox in one commit          │
                                                                                                                                                                                                                                                                                                                                                                        │   - e.g. q-12 CREATING -> ACTIVE; ob-41 NEW -> DONE      │
                                                                                                                                                                                                                                                                                                                                                                        └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Metadata DB                                                                                                                                                                          ▼ Storage Nodes                                         ▼ Redis                                                                       ▼ Metadata DB (step 5)
╔═════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════╗
║ queues (Metadata DB) · UNIQUE account_id + name ║    ║ partitions (Metadata DB) · key queue_id + partition_no      ║    ║ outbox (Metadata DB) · same transaction as the change ║    ║ files on a storage node disk                     ║    ║ Redis key: queue settings + partition leaders (60 s copy in each       ║    ║ queues + outbox (Metadata DB), after step 5 ║
╟─────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────╢    ║ front-end)                                                             ║    ╟─────────────────────────────────────────────╢
║ {                                               ║    ║ {                                                           ║    ║ {                                                     ║    ║ /data/q-12/p-2/                                  ║    ╟────────────────────────────────────────────────────────────────────────╢    ║ {                                           ║
║   "queue_id": "q-12",                           ║    ║   "queue_id": "q-12",                                       ║    ║   "id": "ob-41",                                      ║    ║   00000000.log   sealed, messages 0..87999       ║    ║ {                                                                      ║    ║   "queues q-12": {                          ║
║   "account_id": "1111",                         ║    ║   "partition_no": 2,                                        ║    ║   "type": "queue.created",                            ║    ║   00088000.log   current file, new messages here ║    ║   "qcfg:order-emails": {                                               ║    ║     "status": "ACTIVE"                      ║
║   "name": "order-emails",                       ║    ║   "leader_node": "node-1 (zone a)",                         ║    ║   "payload": {                                        ║    ║   state/         message state index (key-value) ║    ║     "type": "STANDARD",                                                ║    ║   },                                        ║
║   "type": "STANDARD",                           ║    ║   "follower_nodes": ["node-2 (zone b)", "node-3 (zone c)"], ║    ║     "queue_id": "q-12",                               ║    ║   checkpoint     last committed offset           ║    ║     "visibility_timeout": "30 s",                                      ║    ║   "outbox ob-41": {                         ║
║   "visibility_timeout": "30 s",                 ║    ║   "epoch": 1,                                               ║    ║     "partitions": 4                                   ║    ║ (old files are deleted whole, never edited)      ║    ║     "max_receive_count": 5,                                            ║    ║     "status": "DONE"                        ║
║   "retention": "4 days",                        ║    ║   "status": "ACTIVE"                                        ║    ║   },                                                  ║    ╚══════════════════════════════════════════════════╝    ║     "dead_letter_queue": "order-emails-dlq",                           ║    ║   }                                         ║
║   "delay": "0 s",                               ║    ║ }                                                           ║    ║   "status": "NEW",                                    ║                                                            ║     "leaders": {                                                       ║    ║ }                                           ║
║   "redrive_policy": {                           ║    ╚═════════════════════════════════════════════════════════════╝    ║   "created_at": "09:00:01"                            ║                                                            ║       "p-0": "node-4",                                                 ║    ╚═════════════════════════════════════════════╝
║     "dead_letter_queue": "order-emails-dlq",    ║                                                                       ║ }                                                     ║                                                            ║       "p-1": "node-2",                                                 ║
║     "max_receive_count": 5                      ║                                                                       ╚═══════════════════════════════════════════════════════╝                                                            ║       "p-2": "node-1",                                                 ║
║   },                                            ║                                                                                                                                                                                            ║       "p-3": "node-6"                                                  ║
║   "partition_count": 4,                         ║                                                                                                                                                                                            ║     }                                                                  ║
║   "status": "CREATING"                          ║                                                                                                                                                                                            ║   }                                                                    ║
║ }                                               ║                                                                                                                                                                                            ║ }                                                                      ║
╚═════════════════════════════════════════════════╝                                                                                                                                                                                            ╚════════════════════════════════════════════════════════════════════════╝
```

1. **Priya creates the dead-letter queue first, then the main queue**
   - **a) Why a queue at all**
     - sending email is slow and sometimes fails, so the Order Service drops each email job into a queue (a to-do tray) and a separate worker sends it later
     - `order-emails-dlq` is the dead-letter queue: the "problem letters" box for messages that keep failing
   - **b) First call**
     - `POST /v1/queues {name: order-emails-dlq, attributes: {MessageRetentionPeriod: 14 days}}`
     - retention period = how long a message may sit before it is thrown away
   - **c) Second call**
     - `POST /v1/queues {name: order-emails, attributes: {VisibilityTimeout: 30, MessageRetentionPeriod: 4 days, RedrivePolicy: {deadLetterTargetArn: ...order-emails-dlq, maxReceiveCount: 5}}}`
     - the redrive policy is a simple rule: "tried 5 times and still failing → move to `order-emails-dlq`"
   - **d) The front-end** only checks that Priya may do this, then passes the call to the Metadata Service over gRPC (a fast internal call); setup calls never touch storage nodes
   - **Data change:** none yet
   - **Why this order:** the main queue's rule points to the dead-letter queue by name. A rule pointing to a box that doesn't exist yet is refused, like writing "send problems to Room 12" before Room 12 is built.
   - **Why the dead-letter queue is a normal queue:** it needs exactly the same things (safe storage, receive, delete, retention). So there is no special code, and Anita looks at failed messages with the tools she already knows.
2. **The Metadata Service checks the rule and saves the queue plus a to-do note, in one transaction**
   - **a) What it is:** the "registry office" of queues. It keeps the official list of queues and their settings in PostgreSQL (a classic SQL database).
   - **b) Checks the dead-letter queue**
     - it exists, it is in the same account and region, and it is the same type
     - a FIFO (First In, First Out) queue needs a FIFO dead-letter queue
   - **c) Plans the partitions** (like checkout lanes in a supermarket: 4 lanes, p-0 … p-3, serve 4 times as many people)
     - picks the least busy storage nodes, one per **availability zone** (a separate building with its own power and network)
     - only *writes down* the plan; it does not call the nodes yet
   - **d) One transaction:** `BEGIN; INSERT INTO queues ...; INSERT INTO partitions ...; INSERT INTO outbox ...; COMMIT;`
   - **Data change:**
     - `queues` row added `{queue_id: q-12, name: order-emails, type: STANDARD, visibility_timeout: 30 s, retention: 4 days, redrive_policy: {dead_letter_queue: order-emails-dlq, max_receive_count: 5}, partition_count: 4, status: CREATING}` (and a similar row q-13 for `order-emails-dlq`)
     - `partitions` rows added for p-0 … p-3, e.g. `{queue_id: q-12, partition_no: 2, leader_node: node-1, follower_nodes: [node-2, node-3], epoch: 1}`
     - `outbox` row added `{id: ob-41, type: queue.created, payload: {queue_id: q-12, partitions: 4}, status: NEW}`
     - Priya gets back `{queueUrl: https://queue.example.com/1111/order-emails}` right away
   - **What the epoch is:** a "term number" for the leader. It goes up each time a new leader takes over, so an old leader can be told "you're out of date".
   - **Why one transaction:** all the writes happen, or none do. Otherwise a crash could leave a queue with no partitions, or partitions with no queue.
   - **Why the outbox row:** "save, then call the nodes and Redis" is a dual write (two systems written one after the other). A crash right after the commit would leave PostgreSQL saying "order-emails exists" while no node has its files and Redis has no settings. Rahul's email job would have nowhere to go. The outbox row is in the *same* transaction, so the to-do note can't get lost. Like a waiter who writes your order and pins it on the kitchen rail in one move, instead of "I'll tell the chef later".
3. **The Config Publisher picks up the to-do note**
   - **a) What it is:** a small always-on worker that does nothing but read the outbox
   - **b) The query** (many times a second)
     - `SELECT * FROM outbox WHERE status = 'NEW' ORDER BY id FOR UPDATE SKIP LOCKED LIMIT 50`
     - `FOR UPDATE` locks the rows it takes; `SKIP LOCKED` lets a second publisher take other rows, so two publishers never do the same note
   - **Data change:** none yet; row ob-41 is only locked
   - **Why polling and not Debezium** (a CDC, Change Data Capture, tool that reads the database's change log): queues change only a few times a second, so a small query is cheap and has fewer moving parts. Debezium is the better choice at thousands of changes a second.
   - **Where else the outbox is used:** every change other machines must hear about: settings changes, a new partition leader after a node dies (`leader.changed`, Deep Dive 5), and deleting a queue (`queue.deleted`).
4. **The Config Publisher does the work in the note: partitions, then Redis**
   - **a) Partitions**
     - tells each chosen node "create partition q-12/p-2 if it isn't there"
     - each node creates an empty log file: a notebook where you only ever write on the next empty line
     - one node is the **leader** (handles all reads and writes for the partition); two are **followers** (keep copies), like one person writing the notes while two keep photocopies
   - **b) Redis** (a very fast store that keeps data in memory, like a whiteboard everyone can glance at)
     - `SET qcfg:order-emails` = the settings + which node leads each partition
   - **Data change:**
     - node-1: folder `/data/q-12/p-2/` with an empty `00000000.log`; the same on node-2 and node-3
     - Redis `qcfg:order-emails = {type: STANDARD, visibility_timeout: 30 s, max_receive_count: 5, dead_letter_queue: order-emails-dlq, leaders: {p-0: node-4, p-1: node-2, p-2: node-1, p-3: node-6}}`
   - **Why 3 buildings:** a fire, a power cut or a cut cable in one building loses only one copy. The other two keep Rahul's email job safe.
   - **Why every action is safe to repeat:** "create if missing" and "set this key to this value" give the same result once or five times. So if the publisher crashes halfway, the next one simply does the whole note again.
   - **Why Redis (and memory):** every send and receive needs "who leads p-2?". Asking PostgreSQL millions of times a second would overload it. Each front-end keeps the settings in its own memory for 60 seconds, then refreshes from Redis. If Redis loses the key, the front-end reads PostgreSQL once and puts it back. Redis is only a copy, so losing it loses nothing.
5. **The queue becomes ACTIVE and the note is ticked off, in one transaction**
   - **a) The update:** `UPDATE queues SET status = 'ACTIVE'` and `UPDATE outbox SET status = 'DONE'`, in one commit
   - **b) Sends before this** (queue still CREATING) get "queue not ready yet, try again in a moment"; the client library retries by itself
   - **Data change:** `queues` q-12 `status: CREATING → ACTIVE`; `outbox` ob-41 `status: NEW → DONE` (old DONE rows are deleted after 7 days)
   - **Why tick it off last:** if the publisher crashed after the partitions but before Redis, the note is still NEW, so another publisher does it again. Something may be done twice (harmless), but never zero times.

**Say in the interview:** "CreateQueue goes to a separate metadata service backed by PostgreSQL. It validates the redrive policy, saves the queue, its partitions and an outbox row in one transaction. A config publisher reads the outbox, creates the partitions on three nodes in three availability zones and writes the config cache, with idempotent steps, then marks the queue ACTIVE. So there is no dual write, and the data path never touches the metadata database."

### Flow 2. Order Service sends a message → it is safely stored (front-end → partition leader → 2 followers → OK)

```text
┌── STEP 1, 5 ─────────────────────────────────────────────┐            ┌── STEP 2, 3, 5 ──────────────────────────────────────────┐            ┌── STEP 2 ────────────────────────────────────────────────┐
│ Order Service  (producer, via its outbox relay)          │            │ Front-end Servers  (front door)                          │            │ Redis  (settings cache)                                  │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Sends 'email Rahul about o-301'                  │ ─────────> │ STEP 2: Checks the request and the rate limit            │ ────┬────> │ STEP 2: Gives settings, counts sends                     │
│   - HTTPS POST /v1/queues/order-emails/messages          │            │   - signature, body up to 256 KB                         │     │      │   - GET qcfg:order-emails (also kept 60 s in memory)     │
│   - e.g. body {order_id: o-301, template:                │            │   - Redis INCR on this second's counter                  │     │      │   - INCR rl:order-emails:10:00:00                        │
│          order_confirmed}                                │            │   - e.g. rl:order-emails:10:00:00 -> 1,240               │     │      │   - e.g. p-2 led by node-1; counter 1,239 -> 1,240       │
│                                                          │            │                                                          │     │      └──────────────────────────────────────────────────────────┘
│ STEP 5: Gets OK + message id                             │            │ STEP 2: Names the message, picks a partition             │     │
│   - only now marks its own outbox row sent               │            │   - id = time + server number + counter                  │     │
│   - no answer? sends again (maybe a duplicate)           │            │   - standard queue: any healthy partition                │     │
│   - e.g. 200 {messageId: m-501}                          │            │   - e.g. m-501 -> p-2, led by node-1 (from qcfg)         │     │
└──────────────────────────────────────────────────────────┘            │                                                          │     │
                                                                        │ STEP 3: Sends it to the partition leader                 │     │
                                                                        │   - gRPC Append to the leader of p-2 only                │     │
                                                                        │                                                          │     │
                                                                        │ STEP 5: Replies OK                                       │     │
                                                                        │   - with the message id and a body fingerprint (MD5)     │     │
                                                                        │   - e.g. 200 {messageId: m-501, md5OfBody: 9b1c...}      │     │
                                                                        └──────────────────────────────────────────────────────────┘     │
                                                                                                                                         │
                                                                                                                                         │
                                                                                                                                         │
                                                                                                                                         │      ┌── STEP 3, 4, 5 ──────────────────────────────────────────┐            ┌── STEP 4 ────────────────────────────────────────────────┐
                                                                                                                                         │      │ Partition p-2 leader  (Storage Node 1)                   │            │ Follower copies  (Storage Nodes 2 and 3)                 │
                                                                                                                                         │      ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
                                                                                                                                         └────> │ STEP 3: Appends m-501 to its log                         │ ─────────> │ STEP 4: Copy the record and confirm                      │
                                                                                                                                                │   - end of the current file, flushed to disk (fsync)     │            │   - same bytes at the same offset, on disk               │
                                                                                                                                                │   - e.g. offset 88,412                                   │            │   - e.g. 2 of 3 on disk = committed, safe if a building  │
                                                                                                                                                │                                                          │            │          burns                                           │
                                                                                                                                                │ STEP 3: Marks it READY                                   │            └──────────────────────────────────────────────────────────┘
                                                                                                                                                │   - state index row + ready list in memory               │
                                                                                                                                                │   - e.g. ready list: [m-498, m-499, m-501]               │
                                                                                                                                                │                                                          │
                                                                                                                                                │ STEP 4: Copies it to both followers                      │
                                                                                                                                                │   - same bytes, in log order                             │
                                                                                                                                                │                                                          │
                                                                                                                                                │ STEP 5: Answers OK once 2 of 3 have it                   │
                                                                                                                                                │   - and wakes a long-polling receiver, if any            │
                                                                                                                                                │   - e.g. w-1 gets m-501 at once (Flow 3)                 │
                                                                                                                                                └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Redis                                                                                                                                 ▼ Partition p-2 leader                                                                                                                                                                                         ▼ Follower copies
╔════════════════════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════════════════╗    ╔═════════════════════════════════╗
║ Redis key: queue settings + partition leaders (60 s copy in each       ║    ║ Redis key: rate-limit counter per queue per second ║    ║ message log record (storage node, append-only file) · key offset ║    ║ message state index (storage node, RocksDB) · key message_id ║    ║ in memory on the leader (rebuilt from disk after a restart) ║    ║ follower copy                   ║
║ front-end)                                                             ║    ╟────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────────────────╢    ╟─────────────────────────────────╢
╟────────────────────────────────────────────────────────────────────────╢    ║ rl:order-emails:10:00:00 = 1240                    ║    ║ {                                                                ║    ║ {                                                            ║    ║ ready list     : [m-498, m-499, m-501]                      ║    ║ same log records, same offsets  ║
║ {                                                                      ║    ║ (expires in 2 s; over the limit -> 'slow down')    ║    ║   "offset": 88412,                                               ║    ║   "message_id": "m-501",                                     ║    ║ timer heap     : (10:00:12, m-497)  <- top                  ║    ║ last offset copied     : 88412  ║
║   "qcfg:order-emails": {                                               ║    ╚════════════════════════════════════════════════════╝    ║   "message_id": "m-501",                                         ║    ║   "offset": 88412,                                           ║    ║ delayed heap   : (10:10:00, m-502)                          ║    ║ last offset committed  : 88412  ║
║     "type": "STANDARD",                                                ║                                                              ║   "sent_at": "10:00:00",                                         ║    ║   "state": "READY",                                          ║    ║ waiting        : [w-3 until 10:00:20]                       ║    ║   (committed = on 2 of 3 disks) ║
║     "visibility_timeout": "30 s",                                      ║                                                              ║   "visible_at": "10:00:00",                                      ║    ║   "invisible_until": null,                                   ║    ╚═════════════════════════════════════════════════════════════╝    ╚═════════════════════════════════╝
║     "max_receive_count": 5,                                            ║                                                              ║   "body": {                                                      ║    ║   "receive_count": 0,                                        ║
║     "dead_letter_queue": "order-emails-dlq",                           ║                                                              ║     "order_id": "o-301",                                         ║    ║   "receipt_nonce": null                                      ║
║     "leaders": {                                                       ║                                                              ║     "email": "rahul@mail.com",                                   ║    ║ }                                                            ║
║       "p-0": "node-4",                                                 ║                                                              ║     "template": "order_confirmed"                                ║    ╚══════════════════════════════════════════════════════════════╝
║       "p-1": "node-2",                                                 ║                                                              ║   },                                                             ║
║       "p-2": "node-1",                                                 ║                                                              ║   "attributes": {                                                ║
║       "p-3": "node-6"                                                  ║                                                              ║     "source": "order-service"                                    ║
║     }                                                                  ║                                                              ║   }                                                              ║
║   }                                                                    ║                                                              ║ }                                                                ║
║ }                                                                      ║                                                              ╚══════════════════════════════════════════════════════════════════╝
╚════════════════════════════════════════════════════════════════════════╝
```

1. **The Order Service sends the message**
   - **a) The request:** `POST /v1/queues/order-emails/messages {body: {order_id: o-301, email: rahul@mail.com, template: order_confirmed}}`
   - **b) Sent through its own outbox**
     - the Order Service saves `orders` row o-301 **and** an `outbox` row `{event: order.confirmed, order_id: o-301}` in one transaction in its own database
     - a small relay reads that outbox, calls SendMessage, and marks the row sent only after it gets "OK"
   - **Data change:** none yet in the queue
   - **Why a queue at all:** if the Order Service sent the email itself, a slow email provider would make Rahul's checkout slow, and an email outage would break checkout. With a queue, checkout waits for one quick write, like dropping a letter in a postbox instead of driving it to the house.
   - **Why the outbox:** "save o-301, then send" is a dual write. A crash in between means o-301 is saved but Rahul never gets his email. With the outbox, a crash means the relay sends again: a duplicate, never a loss. The email worker's repeat-safe key (Flow 4) drops the duplicate.
2. **The front-end checks the request and picks a partition**
   - **a) Checks**
     - the signature: who is calling, and can they prove it
     - the body size: up to 256 KB
     - the rate limit: Redis `INCR rl:order-emails:10:00:00`, one counter per queue per second, shared by all front-ends
   - **b) Names the message:** `m-501`, built from the time + the server's number + a counter. Newer messages get bigger ids, and no central "ticket machine" is needed.
   - **c) Picks a partition**
     - a standard queue promises no order, so **any** healthy partition is fine; it picks one at random, skipping slow or overloaded ones → p-2
     - `qcfg:order-emails` (memory copy, else Redis) says node-1 leads p-2
   - **Data change:** Redis `rl:order-emails:10:00:00` goes from 1,239 to 1,240
   - **Why random:** it spreads the load evenly, and the front-ends don't need to talk to each other. A message doesn't care which lane it waits in.
3. **The leader of p-2 appends the message to its log**
   - **a) Append:** gRPC Append to node-1; the record goes at the end of the current file, at offset 88,412 (its line number in the notebook)
   - **b) Flush to disk (`fsync`)**
     - the operating system normally keeps new file data in memory for a while, like letters in your pocket until you pass a postbox
     - `fsync` forces it onto the disk now, so a power cut can't lose it
   - **c) Marks it ready:** state index row READY; m-501 joins the end of the ready list in memory
   - **d) Delayed messages:** with `delaySeconds` (say 10 minutes) the state is `DELAYED` and `visible_at = 10:10:00`. It waits in the **delayed heap** (a pile sorted by wake-up time) until a timer makes it READY, like a letter marked "do not open before 10:10".
   - **Data change:**
     - log record at offset 88,412: `{message_id: m-501, sent_at: 10:00:00, visible_at: 10:00:00, body: {...}}`
     - state index row `{message_id: m-501, state: READY, receive_count: 0}`
     - memory: ready list `[m-498, m-499, m-501]`
   - **Why append-only:** new records are only ever added at the end, never squeezed into the middle. Writing at the end is the fastest thing a disk can do.
   - **Why not keep messages only in memory:** memory is a whiteboard; one restart wipes it. Writing to disk on 2 machines *before* "OK" makes "OK" a promise we can keep.
4. **The followers copy the record**
   - **a) Copy:** the leader sends the record to node-2 and node-3; each writes it at the same offset and says "got it"
   - **b) Committed:** as soon as **one** follower confirms, the record is on 2 of 3 disks, so it is officially safe
   - **Data change:** node-2 and node-3: same log record at offset 88,412; "last committed offset = 88,412"
   - **Why 2 of 3, not 3 of 3:** waiting for all three makes every send as slow as the slowest machine, and Rahul waits. With 2 of 3, if node-1 dies right now, node-2 still has m-501.
5. **"OK" goes back to the Order Service**
   - **a) Response:** `200 {messageId: m-501, md5OfBody: 9b1c…}`
     - MD5 is a short fingerprint of the body; the Order Service compares it with its own to check that no bytes got garbled on the way
   - **b) A waiting worker:** if a worker is already long polling (Flow 3), the leader hands m-501 to it right away
   - **Data change:** the Order Service marks its own outbox row sent
   - **Why the producer may resend:** if the "OK" gets lost on the network, the Order Service can't tell whether m-501 was saved, so it sends again. A standard queue may then store a second copy, which is why workers must handle duplicates (Flow 4).

**Say in the interview:** "The front-end authenticates, rate-limits, assigns a time-sortable id and picks any healthy partition. The partition leader appends to its log, replicates to two followers in other AZs, and acknowledges once a majority (2 of 3) has it on disk."

### Flow 3. Email Worker receives a message (long polling + visibility timeout)

```text
┌── STEP 1, 5 ─────────────────────────────────────────────┐            ┌── STEP 2, 5 ─────────────────────────────────────────────┐            ┌── STEP 3, 4 ─────────────────────────────────────────────┐            ┌── STEP 4 ────────────────────────────────────────────────┐
│ Email Worker w-1  (consumer)                             │            │ Front-end Servers  (front door)                          │            │ Partition p-2 leader  (Storage Node 1)                   │            │ Follower copies  (Storage Nodes 2 and 3)                 │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Asks for up to 10 messages                       │ ─────────> │ STEP 2: Picks partitions to ask                          │ ─────────> │ STEP 3: Takes the oldest ready message                   │ ─────────> │ STEP 4: Copy the state change                            │
│   - HTTPS GET /v1/queues/order-                          │            │   - those that report ready messages, starting at a      │            │   - m-501 leaves the ready list                          │            │   - a new leader knows m-501 is hidden and was tried     │
│     emails/messages?maxCount=10&waitTime=20              │            │     random one                                           │            │                                                          │            │     once                                                 │
│   - e.g. happy to wait up to 20 seconds (long polling)   │            │   - e.g. gRPC Receive to the leader of p-2               │            │ STEP 3: Hides it for 30 seconds                          │            │   - e.g. m-501 INFLIGHT until 10:00:31, count 1          │
│                                                          │            │                                                          │            │   - state INFLIGHT, invisible_until, receive_count + 1   │            └──────────────────────────────────────────────────────────┘
│ STEP 5: Gets m-501 + its receipt handle                  │            │ STEP 2: All empty? Holds the request open                │            │   - e.g. until 10:00:31, receive_count 1                 │
│   - has 30 seconds to finish and delete it               │            │   - registers w-1 as a waiting receiver on the leaders   │            │                                                          │
│   - e.g. ReceiptHandle AQEBx9...,                        │            │   - e.g. waiting: [w-1 until 10:00:20]                   │            │ STEP 3: Puts it on the timer heap                        │
│          ApproximateReceiveCount 1                       │            │                                                          │            │   - a pile sorted by wake-up time, earliest on top       │
└──────────────────────────────────────────────────────────┘            │ STEP 5: Returns the batch                                │            │   - e.g. (10:00:31, m-501)                               │
                                                                        │   - messages from one or more partitions                 │            │                                                          │
                                                                        └──────────────────────────────────────────────────────────┘            │ STEP 3: Makes a signed receipt handle                    │
                                                                                                                                                │   - fresh random nonce, so older handles stop working    │
                                                                                                                                                │   - e.g. nonce n-8f3a                                    │
                                                                                                                                                │                                                          │
                                                                                                                                                │ STEP 4: Copies the state change                          │
                                                                                                                                                │   - a few bytes, not the body                            │
                                                                                                                                                └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Email Worker w-1                                                                                  ▼ Partition p-2 leader                                                                                                                 ▼ Follower copies
╔═════════════════════════════════════════════╗    ╔═══════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════════════════╗    ╔══════════════════════════════════╗
║ what the worker receives                    ║    ║ receipt handle (inside the token, signed) ║    ║ message state index (storage node, RocksDB) · key message_id ║    ║ in memory on the leader (rebuilt from disk after a restart) ║    ║ follower copy                    ║
╟─────────────────────────────────────────────╢    ╟───────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────────────────╢    ╟──────────────────────────────────╢
║ {                                           ║    ║ {                                         ║    ║ {                                                            ║    ║ ready list     : [m-502 ...]  (m-501 left)                  ║    ║ state record copied:             ║
║   "Messages": [                             ║    ║   "queue": "order-emails",                ║    ║   "message_id": "m-501",                                     ║    ║ timer heap     : (10:00:31, m-501)  <- top                  ║    ║   m-501 INFLIGHT until 10:00:31, ║
║     {                                       ║    ║   "partition": "p-2",                     ║    ║   "offset": 88412,                                           ║    ║                : (10:00:40, m-497)                          ║    ║   receive_count 1                ║
║       "MessageId": "m-501",                 ║    ║   "message_id": "m-501",                  ║    ║   "state": "INFLIGHT",                                       ║    ║ waiting        : []                                         ║    ╚══════════════════════════════════╝
║       "ReceiptHandle": "AQEBx9 (rh-501-a)", ║    ║   "receipt_nonce": "n-8f3a",              ║    ║   "invisible_until": "10:00:31",                             ║    ╚═════════════════════════════════════════════════════════════╝
║       "Body": {                             ║    ║   "signature": "hmac-sha256(...)"         ║    ║   "receive_count": 1,                                        ║
║         "order_id": "o-301",                ║    ║ }                                         ║    ║   "receipt_nonce": "n-8f3a"                                  ║
║         "email": "rahul@mail.com"           ║    ╚═══════════════════════════════════════════╝    ║ }                                                            ║
║       },                                    ║                                                     ╚══════════════════════════════════════════════════════════════╝
║       "Attributes": {                       ║
║         "ApproximateReceiveCount": 1,       ║
║         "SentTimestamp": "10:00:00"         ║
║       }                                     ║
║     }                                       ║
║   ]                                         ║
║ }                                           ║
╚═════════════════════════════════════════════╝
```

1. **w-1 asks for messages**
   - **a) The request:** `GET /v1/queues/order-emails/messages?maxCount=10&waitTime=20`, in plain words "up to 10 messages, and I'm happy to wait up to 20 seconds"
   - **b) The visibility timeout** is the queue's default, 30 seconds
   - **Data change:** none
   - **Why long polling:** short polling is phoning the shop every second: "anything?" "no." Thousands of empty answers that you still pay for. Long polling is waiting at the counter: one call, answered the moment something arrives.
2. **The front-end picks partitions to ask**
   - **a) Which ones:** every leader reports its number of ready messages a few times a second. The front-end starts at a random partition and asks the ones that have messages, until it has up to 10.
   - **b) All empty?**
     - it holds the request open (long polling) and registers w-1 as a waiting receiver on the leaders
     - when m-501 arrives (Flow 2, step 5) the leader wakes it at once; after 20 empty seconds it answers with an empty list
   - **Data change:** leader memory: waiting list `[w-1 until 10:00:20]` (only while waiting)
   - **Why a random start:** if every front-end always started at p-0, p-0 would always be emptied first while the other lanes pile up.
3. **The leader of p-2 hides m-501 and hands it out**
   - **a) Takes** the oldest message from the ready list: m-501
   - **b) Hides it**
     - INFLIGHT means "someone is working on it right now"; `invisible_until` is when it comes back if nobody finishes
     - `receive_count` counts the tries; at 5 the message goes to the dead-letter queue (Flow 5)
   - **c) Timer heap:** pushes `(10:00:31, m-501)`. A min-heap is a pile that always keeps the earliest wake-up time on top, like alarm clocks sorted so the next to ring is on top. Adding and removing stay cheap even with millions of items.
   - **d) Receipt handle:** `{queue: order-emails, partition: p-2, message_id: m-501, receipt_nonce: n-8f3a}`, signed with a secret key so nobody can forge one. Like the claim ticket from a coat check: only its holder can collect (here, delete) the coat.
   - **Data change:**
     - state index row `{message_id: m-501, state: INFLIGHT, invisible_until: 10:00:31, receive_count: 1, receipt_nonce: n-8f3a}`
     - memory: m-501 leaves the ready list; the timer heap top is `(10:00:31, m-501)`
   - **Why hide instead of delete:** if we deleted on receive and w-1 crashed, Rahul's email would never be sent. Like a library book: borrowed, off the shelf, and back on the shelf by itself if not returned in time.
   - **Why a new random number (nonce) on every receive:** if w-1 is too slow and m-501 is handed to w-3, w-3 gets a new nonce. w-1's old ticket no longer matches, so w-1 can't delete the message w-3 is still working on.
4. **The followers copy the state change**
   - **a) What is copied:** `m-501 INFLIGHT until 10:00:31, receive_count 1`, a few bytes; the body is already there
   - **Data change:** node-2 and node-3 record the same state
   - **Why copy this too:** if node-1 dies now, the new leader must know that m-501 is hidden and has been tried once. Otherwise the try count resets to zero, and a poison message (one that always makes the worker fail) loops forever and never reaches the dead-letter queue.
5. **w-1 gets the message**
   - **a) Response:** `{Messages: [{MessageId: m-501, ReceiptHandle: AQEBx9…, Body: {...}, Attributes: {ApproximateReceiveCount: 1}}]}`
   - **b) Deadline:** w-1 now has 30 seconds to send Rahul's email and delete the message (Flow 4)
   - **Data change:** none
   - **Why the handle comes with it:** only the holder of the latest handle may delete the message or ask for more time.

**Say in the interview:** "Receive doesn't delete; it marks the message in-flight with invisibleUntil = now + visibility timeout, bumps the receive count, replicates that small state change, and returns a receipt handle with a fresh nonce. Long polling parks the request on the leaders until a message arrives or 20 seconds pass."

### Flow 4. The worker finishes the job and deletes the message (DeleteMessage, ChangeMessageVisibility)

```text
┌── STEP 1, 2, 3 ──────────────────────────────────────────┐            ┌── STEP 2, 3 ─────────────────────────────────────────────┐            ┌── STEP 2, 4, 5 ──────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐
│ Email Worker w-1  (consumer)                             │            │ Front-end Servers  (front door)                          │            │ Partition p-2 leader  (Storage Node 1)                   │            │ Follower copies  (Storage Nodes 2 and 3)                 │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Sends Rahul's email                              │ ────┬────> │ STEP 2, 3: Reads the receipt handle                      │ ─────────> │ STEP 2: Moves the wake-up time                           │ ─────────> │ STEP 5: Copy the delete                                  │
│   - HTTPS call to the email provider, idempotency key    │     │      │   - checks its signature: a fake handle is refused       │            │   - invisible_until + 40 s; the heap entry moves         │            │   - a new leader never hands m-501 out again             │
│     m-501                                                │     │      │   - the handle already says p-2: no lookup               │            │   - e.g. 10:00:31 -> 10:01:01                            │            │   - e.g. tombstone for m-501                             │
│   - e.g. order confirmation for o-301                    │     │      │   - e.g. gRPC to the leader of p-2                       │            │                                                          │            └──────────────────────────────────────────────────────────┘
│                                                          │     │      └──────────────────────────────────────────────────────────┘            │ STEP 4: Checks the handle's nonce                        │
│ STEP 2: Slow? Asks for 40 more seconds                   │     │                                                                              │   - must match the latest receive                        │
│   - HTTPS PATCH .../messages/{receiptHandle}             │     │                                                                              │   - e.g. n-8f3a matches: w-1 is the holder               │
│     (ChangeMessageVisibility)                            │     │                                                                              │                                                          │
│   - e.g. at 10:00:21 the provider is slow                │     │                                                                              │ STEP 4: Marks it DELETED                                 │
│                                                          │     │                                                                              │   - off the timer heap; a tombstone is added to the log  │
│ STEP 3: Deletes the message after the email              │     │                                                                              │   - e.g. body freed later, a whole file at a time        │
│   - HTTPS DELETE .../messages/{receiptHandle}            │     │                                                                              │                                                          │
│   - e.g. handle AQEBx9...                                │     │                                                                              │ STEP 5: Copies the delete, then answers OK               │
└──────────────────────────────────────────────────────────┘     │                                                                              │   - tombstone sent to both followers                     │
                                                                 │                                                                              └──────────────────────────────────────────────────────────┘
                                                                 │
                                                                 │
                                                                 │
                                                                 │      ┌── STEP 1 ────────────────────────────────────────────────┐
                                                                 │      │ Email provider  (sends the email)                        │
                                                                 │      ├──────────────────────────────────────────────────────────┤
                                                                 └────> │ STEP 1: Delivers to Rahul once                           │
                                                                        │   - a repeated key m-501 is dropped                      │
                                                                        │   - e.g. sent log: m-501 SENT                            │
                                                                        └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Email provider                                     ▼ Front-end                                      ▼ Partition p-2 leader                                                                                          ▼ Follower copies
╔═══════════════════════════════════════════════╗    ╔═══════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════╗    ╔═══════════════════╗
║ email provider sent log · key idempotency_key ║    ║ receipt handle (inside the token, signed) ║    ║ message state index (storage node, RocksDB) · key message_id ║    ║ timer heap after extend + delete     ║    ║ follower copy     ║
╟───────────────────────────────────────────────╢    ╟───────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────╢    ╟───────────────────╢
║ {                                             ║    ║ {                                         ║    ║ {                                                            ║    ║ STEP 2: (10:01:01, m-501) moved down ║    ║ tombstone copied: ║
║   "idempotency_key": "m-501",                 ║    ║   "queue": "order-emails",                ║    ║   "message_id": "m-501",                                     ║    ║ STEP 4: m-501 removed                ║    ║   m-501 DELETED   ║
║   "to": "rahul@mail.com",                     ║    ║   "partition": "p-2",                     ║    ║   "offset": 88412,                                           ║    ║ top is now (10:00:40, m-497)         ║    ╚═══════════════════╝
║   "template": "order_confirmed",              ║    ║   "message_id": "m-501",                  ║    ║   "state": "DELETED",                                        ║    ╚══════════════════════════════════════╝
║   "status": "SENT"                            ║    ║   "receipt_nonce": "n-8f3a",              ║    ║   "invisible_until": null,                                   ║
║ }                                             ║    ║   "signature": "hmac-sha256(...)"         ║    ║   "receive_count": 1,                                        ║
╚═══════════════════════════════════════════════╝    ║ }                                         ║    ║   "receipt_nonce": "n-8f3a"                                  ║
                                                     ╚═══════════════════════════════════════════╝    ║ }                                                            ║
                                                                                                      ╚══════════════════════════════════════════════════════════════╝
```

1. **w-1 sends the email**
   - **a) The call:** the email provider, with `idempotency_key = m-501`. An idempotency key is a "this is job number X" label: the same label twice means the job is done once.
   - **Data change:** email provider's sent log `{idempotency_key: m-501, to: rahul@mail.com, template: order_confirmed, status: SENT}`
   - **Why the message id as the key:** delivery is "at least once", so m-501 **can** arrive twice (the producer resent it, or a worker crashed before deleting). The second time the provider says "already sent". "At least once" becomes "effectively exactly once": Rahul gets one email, not two.
2. **(Only if slow) w-1 asks for more time**
   - **a) The call:** at 10:00:21 the provider is slow; `PATCH /v1/queues/order-emails/messages/AQEBx9… {visibilityTimeout: 40}` (ChangeMessageVisibility), meaning "keep m-501 hidden 40 more seconds"
   - **b) On the leader:** `invisible_until` moves, and m-501's timer heap entry moves down to its new time
   - **Data change:** state index `invisible_until: 10:00:31 → 10:01:01`; heap entry `(10:01:01, m-501)`
   - **Why:** like renewing a library book. A worker with a long job keeps renewing a little at a time, a **heartbeat** (a regular "I'm still working" signal). If the worker crashes, the renewals stop and the message soon comes back for someone else.
   - **Why not one huge timeout (say 1 hour):** a crash would leave m-501 stuck and hidden for an hour, and Rahul would wait an hour for his email.
3. **w-1 deletes the message**
   - **a) The call:** `DELETE /v1/queues/order-emails/messages/AQEBx9…`; that long string is the receipt handle, proof that "I am the one who picked this up"
   - **b) The front-end** checks the handle's signature (so nobody can fake one) and reads `partition: p-2` from inside it, so no lookup is needed
   - **Data change:** none yet
   - **Why delete only after the email is sent:** deleting first and then crashing would lose Rahul's email for good.
4. **The leader checks the handle and marks m-501 deleted**
   - **a) Nonce check:** the handle's `n-8f3a` must match the latest receive. It does, so w-1 really is the current holder.
   - **b) An old handle** would fail: if w-1 had frozen past 10:00:31 and w-3 had received m-501 with a new nonce, w-1's delete gets "receipt handle is no longer valid". That is correct, and the email key still keeps it to one email.
   - **c) Delete:** m-501 comes off the timer heap, and a **tombstone** (a small "m-501 is gone" note) is added to the log without touching the original record
   - **d) Disk space:** the body is not erased now. A log file is removed whole once every message in it is deleted or past retention, e.g. `00000000.log`.
   - **Data change:** state index `{message_id: m-501, state: DELETED}`; tombstone in the log; the heap top is now `(10:00:40, m-497)`
   - **Why not erase right away:** cutting holes in the middle of a file is slow, like tearing single pages out of a bound notebook. Throwing away a whole old notebook is almost free.
5. **The followers copy the delete; the leader answers "OK"**
   - **a) Copy:** node-2 and node-3 store the tombstone, then w-1 gets "OK" and moves on to its next message
   - **Data change:** node-2 and node-3: tombstone for m-501
   - **Why:** if node-1 dies right after "OK", a follower becomes the new leader. Without the tombstone it would hand m-501 out again, and Rahul would get a second email.
   - **Why the consumer must still be repeat-safe:** there is always a tiny gap between "the work is done" and "the delete is saved". No queue can close that gap. Only the consumer can, with a unique key or "insert only if not already there".

**Say in the interview:** "Delete takes the receipt handle; the leader checks the nonce matches the latest receive, writes a tombstone and replicates it. Long jobs heartbeat with ChangeMessageVisibility. Delivery is at-least-once, so consumers use the message id as an idempotency key."

### Flow 5. A worker crashes, the message comes back, and after 5 tries it goes to the dead-letter queue (visibility timer → DLQ → alarm)

```text
┌── STEP 1 ────────────────────────────────────────────────┐            ┌── STEP 1, 3 ─────────────────────────────────────────────┐            ┌── STEP 1, 2, 3, 4 ───────────────────────────────────────┐            ┌── STEP 4, 5 ─────────────────────────────────────────────┐            ┌── STEP 5, 6 ─────────────────────────────────────────────┐            ┌── STEP 6 ────────────────────────────────────────────────┐
│ Email Worker w-2  (consumer)                             │            │ Front-end Servers  (front door)                          │            │ Partition p-1 leader  (order-emails)                     │            │ Dead-letter queue  order-emails-dlq                      │            │ Metrics + Alarms                                         │            │ Anita's phone  (on-call engineer)                        │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Receives m-777 and crashes                       │ ────┬────> │ STEP 1, 3: Passes the receives through                   │ ─────────> │ STEP 1: Hides m-777 for 30 seconds                       │ ─────────> │ STEP 4: Stores m-777                                     │ ─────────> │ STEP 5: Stores counts per queue                          │ ─────────> │ STEP 6: Gets paged                                       │
│   - HTTPS ReceiveMessage as in Flow 3; no delete is ever │     │      │   - gRPC Receive to the leader of p-1, as in Flow 3      │            │   - INFLIGHT, receive_count 1                            │            │   - same body, plus where it came from and how often it  │            │   - one point per queue per minute                       │            │   - phone call + app alert                               │
│     sent                                                 │     │      └──────────────────────────────────────────────────────────┘            │   - e.g. timer heap gets (10:05:30, m-777)               │            │     failed                                               │            │   - e.g. 10:08 order-emails-dlq visible = 1              │            │   - e.g. 'order-emails-dlq has 1 message' -> Flow 6      │
│   - e.g. o-302: rahul@@mail.com breaks the template      │     │                                                                              │                                                          │            │   - e.g. a normal queue, kept 14 days                    │            │                                                          │            └──────────────────────────────────────────────────────────┘
└──────────────────────────────────────────────────────────┘     │                                                                              │ STEP 2: Timer brings it back                             │            │                                                          │            │ STEP 6: Rule: dead-letter queue not empty                │
                                                                 │                                                                              │   - top of the heap is due and nobody deleted it         │            │ STEP 5: Reports its size                                 │            │   - more than 0 for 1 minute pages on-call               │
                                                                 │                                                                              │   - e.g. 10:05:30: INFLIGHT -> READY                     │            │   - every queue pushes its counts once a minute          │            │   - e.g. ALARM at 10:09                                  │
                                                                 │                                                                              │                                                          │            │   - e.g. visible = 1                                     │            └──────────────────────────────────────────────────────────┘
                                                                 │                                                                              │ STEP 3: Counts every receive                             │            └──────────────────────────────────────────────────────────┘
                                                                 │                                                                              │   - receive_count 2, 3, 4, 5                             │
                                                                 │                                                                              │   - e.g. last hidden until 10:08:00                      │
                                                                 │                                                                              │                                                          │
                                                                 │                                                                              │ STEP 4: Count reached 5: moves it                        │
                                                                 │                                                                              │   - gRPC Send into order-emails-dlq                      │
                                                                 │                                                                              │   - then delete from order-emails                        │
                                                                 │                                                                              │   - e.g. copy first, delete after                        │
                                                                 │                                                                              └──────────────────────────────────────────────────────────┘
                                                                 │
                                                                 │
                                                                 │
┌── STEP 3 ────────────────────────────────────────────────┐     │
│ Other Email Workers  (w-1, w-3)                          │     │
├──────────────────────────────────────────────────────────┤     │
│ STEP 3: Get m-777 again, and crash too                   │ ────┘
│   - HTTPS ReceiveMessage, same failure each time         │
│   - e.g. 4 more tries, the last at 10:07:30              │
└──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Partition p-1 leader                                                                                                                                                                                 ▼ Dead-letter queue                                    ▼ Metrics + Alarms
╔════════════════════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════╗
║ redrive rule (part of the queue settings)                              ║    ║ message state index (storage node, RocksDB) · key message_id ║    ║ timer heap of p-1 (only the top is looked at) ║    ║ message in the dead-letter queue                ║    ║ metrics, one point per queue per minute   ║    ║ alarm rule                                        ║
╟────────────────────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────╢    ╟───────────────────────────────────────────╢    ╟───────────────────────────────────────────────────╢
║ {                                                                      ║    ║ {                                                            ║    ║ 10:05:30  pop (10:05:30, m-777) -> READY      ║    ║ {                                               ║    ║ 10:08  order-emails-dlq  visible = 1      ║    ║ {                                                 ║
║   "deadLetterTargetArn": "arn:aws:sqs:ap-south-1:1111:order-emails-    ║    ║   "message_id": "m-777",                                     ║    ║           receive 2..5, each time:            ║    ║   "message_id": "m-777",                        ║    ║ 10:08  order-emails      visible = 0,     ║    ║   "alarm": "order-emails-dlq not empty",          ║
║       dlq",                                                            ║    ║   "offset": 51020,                                           ║    ║           push (now + 30 s, m-777)            ║    ║   "body": {                                     ║    ║                          oldest age = 2 s ║    ║   "metric": "ApproximateNumberOfMessagesVisible", ║
║   "maxReceiveCount": 5                                                 ║    ║   "state": "INFLIGHT",                                       ║    ║ 10:08:00  pop: count is 5 = limit             ║    ║     "order_id": "o-302",                        ║    ╚═══════════════════════════════════════════╝    ║   "condition": "> 0 for 1 minute",                ║
║ }                                                                      ║    ║   "invisible_until": "10:08:00",                             ║    ║           -> move to order-emails-dlq         ║    ║     "email": "rahul@@mail.com"                  ║                                                     ║   "action": "page on-call (Anita)",               ║
╚════════════════════════════════════════════════════════════════════════╝    ║   "receive_count": 5,                                        ║    ╚═══════════════════════════════════════════════╝    ║   },                                            ║                                                     ║   "state": "ALARM"                                ║
                                                                              ║   "receipt_nonce": "n-c41d"                                  ║                                                         ║   "attributes": {                               ║                                                     ║ }                                                 ║
                                                                              ║ }                                                            ║                                                         ║     "dead_letter_source_queue": "order-emails", ║                                                     ╚═══════════════════════════════════════════════════╝
                                                                              ╚══════════════════════════════════════════════════════════════╝                                                         ║     "receive_count_when_moved": 5,              ║
                                                                                                                                                                                                       ║     "first_sent_at": "10:05:00",                ║
                                                                                                                                                                                                       ║     "moved_at": "10:08:00"                      ║
                                                                                                                                                                                                       ║   },                                            ║
                                                                                                                                                                                                       ║   "state": "READY"                              ║
                                                                                                                                                                                                       ║ }                                               ║
                                                                                                                                                                                                       ╚═════════════════════════════════════════════════╝
```

1. **w-2 receives m-777 and crashes**
   - **a) The poison message:** m-777 is for order o-302 and has a broken address, `rahul@@mail.com`. The template code throws, and the worker process dies.
   - **b) The receive** happens at 10:05:00, exactly as in Flow 3; no delete is ever sent
   - **Data change:** state index `{message_id: m-777, state: INFLIGHT, invisible_until: 10:05:30, receive_count: 1}`; timer heap gets `(10:05:30, m-777)`
   - **Why this is dangerous:** every worker that touches m-777 dies the same way. Without a limit it would crash a worker every 30 seconds, forever, while good messages wait.
2. **The visibility timer brings m-777 back**
   - **a) The timer loop:** each leader looks at the top of its timer heap. Due → take it off. Not due → sleep until that time.
   - **b) At 10:05:30** the top item is m-777, and nobody deleted it
   - **Data change:** state index `state: INFLIGHT → READY`; m-777 goes back into the ready list
   - **Why a heap, not a scan:** checking millions of hidden messages every second to find the expired ones would be very slow. With a heap the next one to expire is always on top. One sorted pile with one alarm also beats a million separate alarms, one per message.
3. **Other workers get m-777 and fail too**
   - **a) The loop:** w-1 and w-3 receive it, crash, and m-777 comes back 30 seconds later, each time
   - **b) Counting:** every receive adds 1, so `receive_count` goes 2, 3, 4, 5
   - **Data change:** at 10:07:30 `{message_id: m-777, state: INFLIGHT, invisible_until: 10:08:00, receive_count: 5}`
   - **Why the count lives on the leader and is copied:** it must survive a leader change, or a poison message would never reach the limit.
4. **At 10:08:00 m-777 comes back with `receive_count = 5`, the limit, so it moves to the dead-letter queue**
   - **a) Reads the rule** Priya set in Flow 1: `{deadLetterTargetArn: order-emails-dlq, maxReceiveCount: 5}`
   - **b) Copy:** a normal send (Flow 2) into `order-emails-dlq`, with the same message id and body, plus labels: source queue, receive count and first sent time
   - **c) Delete:** removes m-777 from `order-emails` only after the dead-letter queue answers "OK" (2 of 3 copies on disk)
   - **d) Real Amazon SQS** does this check at the next receive instead of when the timer fires; the result is the same
   - **Data change:**
     - `order-emails-dlq` log: record added `{message_id: m-777, body: {order_id: o-302, email: "rahul@@mail.com"}, attributes: {dead_letter_source_queue: order-emails, receive_count_when_moved: 5, moved_at: 10:08:00}}`, state READY
     - `order-emails` state index: m-777 `DELETED`
   - **Why copy first, delete after:** if the leader dies between the two, m-777 is in both queues (a duplicate with the same id, dropped by the email key), never in neither (lost).
   - **Why not retry forever:** the dead-letter queue is the "problem parcels" shelf at a post office. After 5 failed deliveries the parcel goes on the shelf and a supervisor is called, while the van keeps delivering everything else.
5. **Metrics report that the dead-letter queue is not empty**
   - **a) Once a minute** every leader reports counts per queue: visible messages, hidden messages, and the age of the oldest message, like a shop manager phoning in the length of the line
   - **Data change:** metrics store `10:08 order-emails-dlq visible = 1`
   - **Careful with retention:** in Amazon SQS a message's age in the dead-letter queue counts from when it was **first sent** to the original queue. If both queues kept messages 4 days and m-777 spent 3 days failing, only 1 day would be left. So the dead-letter queue gets the longest retention, 14 days.
6. **The alarm pages Anita**
   - **a) The rule:** `ApproximateNumberOfMessagesVisible` of `order-emails-dlq` > 0 for 1 minute → page the on-call engineer (a phone alert that wakes her up)
   - **Data change:** alarm state `OK → ALARM` at 10:09; page sent to Anita's phone
   - **Why alarm on "> 0":** every dead-letter message is a customer who did not get something; here, Rahul is still waiting for his email. Nobody checks a dead-letter queue on their own. Without an alarm, messages sit there unseen until retention deletes them.

**Say in the interview:** "Each partition leader keeps in-flight messages in a min-heap by invisibleUntil. When one expires it becomes visible again. When receiveCount reaches maxReceiveCount, the leader sends it to the DLQ (a normal queue), deletes it from the source only after the DLQ acknowledges, and a CloudWatch-style alarm on DLQ depth > 0 pages on-call."

### Flow 6. Anita fixes the bug and moves the failed messages back (StartMessageMoveTask → Move Task Worker → main queue)

```text
┌── STEP 1, 2 ─────────────────────────────────────────────┐            ┌── STEP 1, 2 ─────────────────────────────────────────────┐            ┌── STEP 3 ────────────────────────────────────────────────┐            ┌── STEP 3, 6 ─────────────────────────────────────────────┐            ┌── STEP 3, 4, 6 ──────────────────────────────────────────┐            ┌── STEP 4 ────────────────────────────────────────────────┐
│ Anita  (on-call engineer, console)                       │            │ Front-end Servers  (front door)                          │            │ Metadata Service                                         │            │ Metadata DB  (PostgreSQL)                                │            │ Move Task Worker  mover-3                                │            │ Dead-letter queue  order-emails-dlq                      │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Reads m-777 and ships a fix                      │ ─────────> │ STEP 1, 2: Checks Anita's rights, then routes            │ ─────────> │ STEP 3: Saves the task as a row                          │ ─────────> │ STEP 3: Holds the task until a worker claims it          │ ─────────> │ STEP 3: Claims t-9 with a lease                          │ ────┬────> │ STEP 4: Hands out m-777, then deletes it                 │
│   - a normal receive on order-emails-dlq, no delete      │            │   - may read the dead-letter queue and write the main    │            │   - INSERT move_tasks: RUNNING, no owner yet             │            │   - workers poll with FOR UPDATE SKIP LOCKED             │            │   - renews it every few seconds; if it dies, another     │     │      │   - only after order-emails said OK                      │
│   - e.g. sees rahul@@mail.com; deploys Email Workers v2  │            │     queue                                                │            │   - e.g. t-9: the row is the to-do note                  │            │   - e.g. t-9 owner mover-3, lease until 10:40:30         │            │     takes over                                           │     │      │   - e.g. m-777 DELETED here                              │
│                                                          │            │   - e.g. move tasks go to the Metadata Service (gRPC)    │            └──────────────────────────────────────────────────────────┘            │                                                          │            │                                                          │     │      └──────────────────────────────────────────────────────────┘
│ STEP 2: Starts a move task                               │            └──────────────────────────────────────────────────────────┘                                                                                    │ STEP 6: Records the finish                               │            │ STEP 4: Moves a batch: receive, send, delete             │     │
│   - HTTPS POST /v1/move-tasks (StartMessageMoveTask)     │                                                                                                                                                            │   - UPDATE move_tasks                                    │            │   - receive from order-emails-dlq, hidden 60 s           │     │
│   - e.g. order-emails-dlq -> order-emails, 50 per second │                                                                                                                                                            │   - e.g. t-9 COMPLETED, 1 of 1 moved                     │            │   - send into order-emails, receive_count 0              │     │
└──────────────────────────────────────────────────────────┘                                                                                                                                                            └──────────────────────────────────────────────────────────┘            │   - then delete from the dead-letter queue               │     │
                                                                                                                                                                                                                                                                                                │   - e.g. 50 a second, so the fixed workers aren't        │     │
                                                                                                                                                                                                                                                                                                │          flooded                                         │     │
                                                                                                                                                                                                                                                                                                │                                                          │     │
                                                                                                                                                                                                                                                                                                │ STEP 6: Reports progress                                 │     │
                                                                                                                                                                                                                                                                                                │   - UPDATE move_tasks through the Metadata Service       │     │
                                                                                                                                                                                                                                                                                                │   - e.g. moved 1 of 1                                    │     │
                                                                                                                                                                                                                                                                                                └──────────────────────────────────────────────────────────┘     │
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │      ┌── STEP 4, 5 ─────────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                                                                                                                                                                 │      │ Partition p-1 leader  (order-emails)                     │            │ Email Workers v2  (fixed consumers)                      │
                                                                                                                                                                                                                                                                                                                                                                 │      ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                                                                                                                                                                 └────> │ STEP 4: Appends m-777 again                              │ ─────────> │ STEP 5: Process and delete m-777                         │
                                                                                                                                                                                                                                                                                                                                                                        │   - READY, receive_count 0, like a brand-new message     │            │   - receive, send with the cleaned address, delete       │
                                                                                                                                                                                                                                                                                                                                                                        │   - e.g. new offset 51,990                               │            │   - e.g. Rahul finally gets his o-302 email              │
                                                                                                                                                                                                                                                                                                                                                                        │                                                          │            └──────────────────────────────────────────────────────────┘
                                                                                                                                                                                                                                                                                                                                                                        │ STEP 5: Hands it to the fixed workers                    │
                                                                                                                                                                                                                                                                                                                                                                        │   - the normal Flows 3 and 4                             │
                                                                                                                                                                                                                                                                                                                                                                        └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Metadata DB                                                    ▼ Dead-letter queue                                    ▼ Partition p-1 leader                                              ▼ Email Workers v2
╔═══════════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════╗
║ move_tasks (Metadata DB) · key task_id, one owner (lease) ║    ║ message in the dead-letter queue                ║    ║ message state index (storage node, RocksDB) · key message_id ║    ║ email provider sent log · key idempotency_key ║
╟───────────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────╢
║ {                                                         ║    ║ {                                               ║    ║ {                                                            ║    ║ {                                             ║
║   "task_id": "t-9",                                       ║    ║   "message_id": "m-777",                        ║    ║   "message_id": "m-777",                                     ║    ║   "idempotency_key": "m-777",                 ║
║   "source_queue": "order-emails-dlq",                     ║    ║   "body": {                                     ║    ║   "offset": 51990,                                           ║    ║   "to": "rahul@mail.com",                     ║
║   "destination_queue": "order-emails",                    ║    ║     "order_id": "o-302",                        ║    ║   "state": "READY",                                          ║    ║   "template": "order_confirmed",              ║
║   "max_per_second": 50,                                   ║    ║     "email": "rahul@@mail.com"                  ║    ║   "invisible_until": null,                                   ║    ║   "status": "SENT"                            ║
║   "moved": 1,                                             ║    ║   },                                            ║    ║   "receive_count": 0,                                        ║    ║ }                                             ║
║   "total": 1,                                             ║    ║   "attributes": {                               ║    ║   "receipt_nonce": null                                      ║    ╚═══════════════════════════════════════════════╝
║   "owner_worker": "mover-3",                              ║    ║     "dead_letter_source_queue": "order-emails", ║    ║ }                                                            ║
║   "lease_until": "10:40:30",                              ║    ║     "receive_count_when_moved": 5,              ║    ╚══════════════════════════════════════════════════════════════╝
║   "status": "COMPLETED"                                   ║    ║     "first_sent_at": "10:05:00",                ║
║ }                                                         ║    ║     "moved_at": "10:08:00"                      ║
╚═══════════════════════════════════════════════════════════╝    ║   },                                            ║
                                                                 ║   "state": "DELETED"                            ║
                                                                 ║ }                                               ║
                                                                 ╚═════════════════════════════════════════════════╝
```

1. **Anita looks at the failed message and ships a fix**
   - **a) Read:** a normal receive on `order-emails-dlq`, with no delete, so m-777 reappears afterwards. The email is `rahul@@mail.com`.
   - **b) Fix:** the template crashes on a double `@`; she deploys Email Workers v2, which clean up addresses like this
   - **c) If the message itself were bad** (not the code), she would not move it back. She would send a new, corrected message (for example after support finds Rahul's real address) and delete the old one.
   - **Data change:** none in the queue system
   - **Why a human looks first:** most dead-letter messages are there for a reason a retry won't fix: a bug, bad data, a missing record. Moving them back automatically would just send them round in a loop.
2. **She starts a move task**
   - **a) The call:** `POST /v1/move-tasks {source: order-emails-dlq, destination: order-emails, maxPerSecond: 50}` (StartMessageMoveTask), in plain words "move everything from the problem shelf back to the main line, at most 50 a second"
   - **b) The front-end** checks she may read the dead-letter queue and write the main queue, then sends the call to the Metadata Service
   - **Data change:** none yet
   - **Why a background task with a speed limit:** on a bad day there are thousands of messages, not one. Pushing them all back at once would flood the workers and the email provider, like opening a dam gate all at once.
3. **The Metadata Service saves the task; one worker claims it**
   - **a) Save:** `INSERT INTO move_tasks ...` with no owner and status RUNNING
   - **b) Claim:** Move Task Workers keep asking "any RUNNING task with no owner, or an owner whose lease ran out?" using `FOR UPDATE SKIP LOCKED`; mover-3 takes t-9
   - **c) Lease:** a "this job is mine, for now" claim that runs out unless renewed, like a parking ticket; mover-3 renews it every few seconds
   - **Data change:**
     - `move_tasks` row added `{task_id: t-9, source_queue: order-emails-dlq, destination_queue: order-emails, max_per_second: 50, moved: 0, total: 1, owner_worker: null, status: RUNNING}`
     - a moment later `{owner_worker: mover-3, lease_until: 10:40:30}`
   - **Why not call a worker directly:** "save the task, then tell a worker" is a dual write; a crash in between leaves a task nobody runs. The `move_tasks` row *is* the to-do note (the same idea as the outbox in Flow 1), so a saved task always gets picked up.
   - **Why a single owner:** two workers moving the same queue would double the speed limit and create more duplicates. If mover-3 dies, its lease runs out and another worker continues.
4. **The Move Task Worker moves messages: receive, send, delete**
   - **a) Receive** a batch from `order-emails-dlq`, hidden 60 seconds while it works
   - **b) Send** each message into `order-emails`, with a fresh `receive_count` of 0
   - **c) Delete** it from the dead-letter queue only after the send says "OK"
   - **d) Pace:** at most 50 a second
   - **Data change:** `order-emails` partition p-1: new record for m-777, state index `{message_id: m-777, state: READY, receive_count: 0}`; `order-emails-dlq`: m-777 `DELETED`
   - **Why the count starts again at 0:** the old failures came from the bug, not the message. Keeping 5 would send m-777 straight back to the dead-letter queue on the first small hiccup after the fix.
   - **Why copy first, delete after:** same as Flow 5: a crash in between means a duplicate, never a loss, and the email key (Flow 4) makes the duplicate harmless.
   - **Why 50 a second:** the fixed workers and the email provider are also handling normal traffic from new orders.
5. **Email Workers v2 process m-777 the normal way**
   - **a) Same as Flows 3 and 4:** receive, send the email to the cleaned-up address, delete
   - **Data change:** email sent log `{idempotency_key: m-777, to: rahul@mail.com, status: SENT}`; m-777 `DELETED` in `order-emails`
   - **Why this matters:** Rahul finally gets his email for o-302, late but not lost.
6. **The task finishes**
   - **a) Progress:** mover-3 writes `moved` and `status` through the Metadata Service
   - **Data change:** `move_tasks` row `{task_id: t-9, moved: 1, total: 1, status: COMPLETED}`; the dead-letter queue is empty again, so its alarm goes back to `OK`
   - **Why save progress:** if mover-3 dies halfway, the next owner continues from `moved` instead of starting over. Anita can go back to sleep.

**Say in the interview:** "Redrive is a metadata-tracked move task owned by one worker under a lease. It receives from the DLQ, sends to the source with a reset receive count, deletes from the DLQ after the send is acked, and is rate-limited so the fixed consumers aren't flooded."

### Flow 7. FIFO queue: Rahul's payment messages stay in order and are never duplicated (message group → one partition → dedup + sequence + group lock)

```text
┌── STEP 1 ────────────────────────────────────────────────┐            ┌── STEP 2, 4, 5 ──────────────────────────────────────────┐            ┌── STEP 3, 4, 5, 6 ───────────────────────────────────────┐            ┌── STEP 3, 4, 5 ──────────────────────────────────────────┐
│ Payment Service  (producer)                              │            │ Front-end Servers  (front door)                          │            │ FIFO partition p-1 leader  (payments.fifo)               │            │ Follower copies  (Storage Nodes 2 and 3)                 │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Sends 'charge', then 'refund'                    │ ────┬────> │ STEP 2: Picks the partition by group                     │ ─────────> │ STEP 3: Drops the repeat by deduplication id             │ ────┬────> │ STEP 3, 4, 5: Copy every change                          │
│   - HTTPS SendMessage, group user-rahul + a              │     │      │   - hash(user-rahul) mod 4 = 1, every time               │            │   - seen within 5 minutes: return the first id, store    │     │      │   - messages, deduplication ids and group locks          │
│     deduplication id                                     │     │      │   - e.g. gRPC Send to the leader of p-1                  │            │     nothing                                              │     │      └──────────────────────────────────────────────────────────┘
│   - e.g. charge-o-301, then refund-o-301                 │     │      │                                                          │            │   - e.g. retry of charge-o-301 -> m-901                  │     │
│                                                          │     │      │ STEP 4, 5: Passes receives and deletes through           │            │                                                          │     │
│ STEP 1: Times out, sends 'charge' again                  │     │      │   - receives ask every partition; a group lives in one   │            │ STEP 3: Numbers each new message                         │     │
│   - same deduplication id charge-o-301                   │     │      └──────────────────────────────────────────────────────────┘            │   - sequence number grows inside the partition           │     │
└──────────────────────────────────────────────────────────┘     │                                                                              │   - e.g. charge = 1001, refund = 1002                    │     │
                                                                 │                                                                              │                                                          │     │
                                                                 │                                                                              │ STEP 4: One message in flight per group                  │     │
                                                                 │                                                                              │   - user-rahul has 'charge' out, so 'refund' waits       │     │
                                                                 │                                                                              │   - e.g. user-priya's messages go out freely             │     │
                                                                 │                                                                              │                                                          │     │
                                                                 │                                                                              │ STEP 5: Delete unlocks the group                         │     │
                                                                 │                                                                              │   - the next message of user-rahul can go out            │     │
                                                                 │                                                                              │   - e.g. m-902 (refund) next                             │     │
                                                                 │                                                                              │                                                          │     │
                                                                 │                                                                              │ STEP 6: 'charge' failed 5 times? Moves it                │     │
                                                                 │                                                                              │   - gRPC Send into payments-dlq.fifo, then 'refund' runs │     │
                                                                 │                                                                              └──────────────────────────────────────────────────────────┘     │
                                                                 │                                                                                                                                               │
                                                                 │                                                                                                                                               │
                                                                 │                                                                                                                                               │
┌── STEP 4, 5 ─────────────────────────────────────────────┐     │                                                                                                                                               │      ┌── STEP 6 ────────────────────────────────────────────────┐
│ Payment Workers  pw-1, pw-2  (consumers)                 │     │                                                                                                                                               │      │ Dead-letter queue  payments-dlq.fifo                     │
├──────────────────────────────────────────────────────────┤     │                                                                                                                                               │      ├──────────────────────────────────────────────────────────┤
│ STEP 4: Ask for messages                                 │ ────┘                                                                                                                                               └────> │ STEP 6: Catches a charge that fails 5 times              │
│   - HTTPS ReceiveMessage                                 │                                                                                                                                                            │   - a FIFO queue needs a FIFO dead-letter queue          │
│   - e.g. pw-1 gets 'charge'; pw-2 gets user-priya's      │                                                                                                                                                            │   - e.g. m-901 here: the refund code must check 'was     │
│          m-950                                           │                                                                                                                                                            │          o-301 charged?'                                 │
│                                                          │                                                                                                                                                            └──────────────────────────────────────────────────────────┘
│ STEP 5: pw-1 deletes 'charge'                            │
│   - HTTPS DeleteMessage                                  │
│   - e.g. only now is 'refund' handed out                 │
└──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ FIFO partition p-1 leader
╔═══════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════╗
║ FIFO message log (storage node) · seq grows per partition ║    ║ deduplication ids (inside the partition), kept 5 minutes ║    ║ message group state (inside the partition) ║
╟───────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────╢
║ [                                                         ║    ║ user-rahul:charge-o-301 -> m-901                         ║    ║ {                                          ║
║   {                                                       ║    ║    (until 10:15:00)                                      ║    ║   "user-rahul": {                          ║
║     "seq": 1001,                                          ║    ║ user-rahul:refund-o-301 -> m-902                         ║    ║     "in_flight": "m-901",                  ║
║     "group": "user-rahul",                                ║    ║    (until 10:15:02)                                      ║    ║     "waiting": ["m-902"]                   ║
║     "dedup_id": "charge-o-301",                           ║    ║ (saved in the same log write as the message)             ║    ║   },                                       ║
║     "message_id": "m-901",                                ║    ╚══════════════════════════════════════════════════════════╝    ║   "user-priya": {                          ║
║     "body": "charge 999"                                  ║                                                                    ║     "in_flight": "m-950",                  ║
║   },                                                      ║                                                                    ║     "waiting": []                          ║
║   {                                                       ║                                                                    ║   }                                        ║
║     "seq": 1002,                                          ║                                                                    ║ }                                          ║
║     "group": "user-rahul",                                ║                                                                    ╚════════════════════════════════════════════╝
║     "dedup_id": "refund-o-301",                           ║
║     "message_id": "m-902",                                ║
║     "body": "refund 999"                                  ║
║   }                                                       ║
║ ]                                                         ║
╚═══════════════════════════════════════════════════════════╝
```

1. **The Payment Service sends "charge", then "refund", then "charge" again**
   - **a) The messages**
     - `SendMessage {body: charge 999, messageGroupId: user-rahul, messageDeduplicationId: charge-o-301}`
     - then `refund 999` with `refund-o-301`
     - then, after a timeout, `charge` again with the **same** `charge-o-301`
   - **b) The labels**
     - `messageGroupId`: "these belong together and must stay in order", like one line per family at a counter
     - `messageDeduplicationId`: a "have I seen this before?" label
   - **Data change:** none yet
   - **Why a FIFO (First In, First Out) queue:** a refund handled before its charge gives back money that was never taken, and a repeated charge bills Rahul twice. A standard queue promises neither order nor "no duplicates", so FIFO adds its own rules, and they cost some speed.
2. **The front-end sends every message of a group to the same partition**
   - **a) The rule:** `hash(user-rahul) mod 4 = 1` → partition p-1, every time. A hash turns the name into a number; "mod 4" picks one of the 4 partitions.
   - **Data change:** none
   - **Why:** order can only be kept inside one single line. If Rahul's messages went to different lanes, nobody could say which came first. Different users go to different lanes, so the queue as a whole still scales.
3. **The leader checks the deduplication id, numbers the message, and copies it**
   - **a) New charge:** `charge-o-301` has not been seen → stored with sequence number 1001
   - **b) Refund:** `refund-o-301` → 1002 (a ticket number: 1001 comes before 1002)
   - **c) Repeated charge:** `charge-o-301` was seen within 5 minutes → nothing is stored; the first id, m-901, is returned. The Payment Service believes the message was sent, and it was. Rahul is charged once.
   - **d) Followers** copy the records **and** the deduplication entries
   - **Data change:**
     - log records `{seq: 1001, group: user-rahul, dedup_id: charge-o-301, message_id: m-901}` and `{seq: 1002, group: user-rahul, dedup_id: refund-o-301, message_id: m-902}`
     - deduplication entry `user-rahul:charge-o-301 → m-901 (until 10:15:00)`
   - **Why the deduplication entry is in the same log write:** in a separate store, a crash between "remember the id" and "save the message" could go wrong both ways: the message is lost, or a duplicate gets in. One write gives both or neither.
4. **Receive: one message in flight per group**
   - **a) pw-1** asks and gets m-901 (charge)
   - **b) pw-2** asks at the same moment. It does **not** get m-902, because `user-rahul` already has a message in flight. It gets `user-priya`'s m-950 instead.
   - **Data change:** group state `user-rahul: {in_flight: m-901, waiting: [m-902]}`, copied to the followers
   - **Why the group lock:** if pw-2 got the refund while pw-1 was still charging, the refund could finish first. The lock serves one member of a family at a time, so "in order" is true for the actual work, not just for how messages are stored.
5. **pw-1 deletes the charge; the group unlocks**
   - **a) Delete** as in Flow 4; the next receive hands out m-902 (refund)
   - **Data change:** m-901 `DELETED`; group state `user-rahul: {in_flight: null, waiting: [m-902]}`
   - **Is FIFO really "exactly once"?** It means no duplicate is **stored** for 5 minutes, and a group's messages go out one at a time, in order. But pw-1 could still crash after charging and before deleting, and the charge would come back. So the payment code still uses `o-301` as a repeat-safe key with the payment provider.
6. **What if the charge keeps failing?**
   - **a) After 5 tries** m-901 moves to `payments-dlq.fifo` (a FIFO queue needs a FIFO dead-letter queue). The group unlocks, and the refund **runs next**.
   - **Data change:** `payments-dlq.fifo`: m-901 READY; `payments.fifo`: m-901 `DELETED`
   - **Why this matters:** the refund now runs without its charge, so Rahul could get ₹999 he never paid. Treat the FIFO dead-letter alarm as urgent, and make the refund code check "was o-301 ever charged?" before paying out.
   - **Standard vs FIFO in one line:** standard = any partition, any order, maybe a duplicate, almost unlimited speed; FIFO = one partition per group, strict order, no duplicates, and each group only as fast as one worker can process it.

**Say in the interview:** "FIFO hashes the message group id to one partition, deduplicates by dedup id for 5 minutes inside the same replicated write, assigns sequence numbers, and only hands out the next message of a group after the previous one is deleted. Parallelism comes from many groups, not from one group."

## Key design choices

Each row is one decision. Read it as: "For this area, we picked this, because the other way breaks like this."

| Area | Choice | Why (vs alternative) |
|---|---|---|
| Delivery | At-least-once (every message is delivered one or more times, never zero): a message is hidden when a worker picks it up, and deleted only when the worker says "done" | If we deleted it the moment it was picked up (at-most-once), a worker crash would lose it for good. Rahul would never get his email |
| Hidden messages | Each message stores an `invisible_until` time. Each partition also keeps a **min-heap** in memory (a to-do pile that always keeps the earliest deadline on top) | Checking every message every second is slow. Giving every message its own timer thread means millions of threads, which no computer can run |
| Scale | A queue is split into partitions (like several checkout lanes). A standard send can go to any healthy partition | If one queue lives on one machine, the queue can never be faster than that one machine |
| Safety | One leader and 2 followers, each in a different availability zone (a separate building with its own power). We say "OK" once 2 of the 3 have it on disk | Waiting for all 3 makes every send as slow as the slowest machine. Keeping only 1 copy means a dead disk loses messages |
| Leader changes | Each partition has an **epoch** (a "term number" that goes up by one every time a new leader is chosen). Writes with an old epoch are refused | Without it, an old leader that wakes up could keep accepting writes that nobody else sees. Two leaders at once is called "split brain" |
| Settings | Queue and partition settings live in PostgreSQL, with copies in Redis and in each front-end's memory | If every send asked the database, the database would be flooded and fall over |
| Setup changes | Every change (create, settings, new leader, delete) is saved with an `outbox` row in one transaction. A Config Publisher does the follow-up work (partitions, Redis) with repeat-safe steps, then marks the row DONE | "Save, then call the nodes and Redis" is a dual write: a crash in between leaves a queue the database knows about but no machine does |
| Delete safety | Delete uses a receipt handle (like a coat-check ticket) with a new random number on every receive | If delete used only the message id, a slow old worker could delete a message that a newer worker is still working on |
| Waiting | Long polling, up to 20 seconds (the worker waits at the counter instead of phoning every second) | Short polling means huge numbers of empty calls that you still pay for, and messages arrive later |
| Poison messages | After `maxReceiveCount` failed tries, the message goes to the dead-letter queue. An alarm fires when it is not empty. Moving messages back is done slowly, at a set rate | Retrying forever means the same message crashes workers again and again. Dropping it means real work is lost |
| Moving to DLQ | First copy the message into the DLQ (dead-letter queue), then delete it from the main queue | If we deleted first and crashed before copying, the message would be gone everywhere |
| FIFO | FIFO (First In, First Out): one message group always lives on one partition. The deduplication id is saved in the same write. Only one message per group is being worked on at a time | Keeping one strict order across all partitions would need one single global line, and that cannot grow |
| Storage | Messages are added to the end of log files, plus a small index of each message's state. Old files are deleted whole | Changing or deleting bits in the middle of files is slow and wears out disks |

---

## Deep Dive (only what the flows above did not cover)

### 1. Back-of-the-envelope estimates (say these early)

"Back-of-the-envelope" means a rough guess you could do on a napkin. The goal is not exact numbers. The goal is to know how big the problem is.

Assume **1 million messages sent per second** in total, across all queues, average size **2 KB** (about one page of text).

| Item | Math | Result |
|---|---|---|
| Calls | each message = send + receive + delete | about 3 million calls a second (fewer with batches of 10) |
| Write traffic | 1 million × 2 KB × 3 copies | about 6 GB a second of disk writes across the fleet |
| Partitions | one partition handles about 3,000 messages a second | at least ≈350 partitions busy at peak; more to leave room |
| Storage if consumers keep up | messages live a few seconds | small: log files are deleted soon after |
| Storage if consumers stop for 4 days | 1 million × 2 KB × 4 days × 3 copies | about 2 PB, so the fleet must be sized for backlogs, not for normal days |

What each line means in plain words:

- **Calls:** every message causes three visits to the counter. The Order Service drops it off, a worker picks it up, and the worker says "done". So the counter sees three times more visits than there are messages. Workers can pick up and delete up to 10 at a time, which cuts this a lot.
- **Write traffic:** every message is written to 3 disks (the leader and 2 followers). So the disks write three times the raw data. 6 GB a second is roughly a full movie every second, spread over the whole fleet (all our storage machines together).
- **Partitions:** one partition is like one checkout lane. One lane can serve about 3,000 shoppers a second. To serve 1 million a second, you need about 350 lanes open at the busiest moment, plus spare lanes for surprises.
- **Storage if consumers keep up:** when workers are healthy, a message waits only a few seconds before it is deleted. The queue is like an empty to-do tray that never fills up.
- **Storage if consumers stop for 4 days:** if all workers are broken for the full default retention (how long a message is kept before it expires), nothing gets deleted. Messages pile up to about 2 PB (two thousand terabytes) including copies. You must buy disks for this bad day, not for a normal day.

The key point: on a normal day a queue holds very little. Its job is to **absorb backlogs** when consumers are slow or down. Think of a dam: most days water just flows through, but it must be built for the flood.

---

### 2. Data model (where each thing lives)

```text
-- Metadata Database (PostgreSQL): small, changes rarely

-- queues: one row per queue, holds its settings (timeouts, DLQ rule, how many partitions)
queues(queue_id PK, account_id, name, type, visibility_timeout, retention, delay, redrive_policy, partition_count, status)
  UNIQUE (account_id, name)
-- partitions: one row per piece of a queue, says which machine leads it and which machines keep copies
partitions(queue_id, partition_no, leader_node, follower_nodes, epoch, status)   PK (queue_id, partition_no)
-- move_tasks: one row per "move messages back from the DLQ" job, tracks progress and which worker owns it
move_tasks(task_id PK, source_queue, destination_queue, max_per_second, moved, total, owner_worker, lease_until, status)
-- outbox: one row per change other machines must hear about, written in the same transaction as the change
outbox(id PK, type, payload, status, created_at)   -- type: queue.created / leader.changed / queue.deleted; status: NEW / DONE

-- Storage node, per partition: big, changes all the time

-- log files: the diary, every event is added at the end and never edited
log files    00000000.log, 00088000.log ...   append-only records: message, receive, extend, delete (tombstone)
-- state index: a quick lookup, "where is message X and what state is it in right now"
state index  message_id -> {offset, state, invisible_until, receive_count, receipt_nonce}   (embedded key-value store, e.g. RocksDB)
-- memory: fast working lists, rebuilt from disk after a restart
memory       ready list, timer heap (in flight), delayed heap, waiting receivers, FIFO group state, dedup ids
```

A few words from the block, in plain language:

- **PK (primary key)** names each row uniquely, like a passport number. **Offset** is a record's position in a log file, like a page number.
- **Tombstone:** a small "this message is deleted" note added at the end of the log. The whole file is thrown out later, once every message in it is gone.
- **RocksDB:** a small "look up by name" store that runs inside the storage node program itself, with no separate server.
- **Why two kinds of storage:** queue settings are tiny and need transactions (all-or-nothing changes) and checks, such as "no two queues with the same name in one account". PostgreSQL is perfect for that. Messages are huge in number and need very fast adds. A log on the machine's own disk is perfect for that. Like keeping the shop's rule book in a safe, and the daily orders on a fast notepad.
- **After a restart** a node rebuilds its memory lists from the state index. Then it replays (re-reads and re-applies) the log from the last checkpoint (the last clean snapshot). That's why memory can be "only a copy": if the power goes off, disk still has it all.

---

### 3. How the visibility timeout works inside (three options)

Quick reminder: the visibility timeout is like a library book. When w-1 borrows m-501, it is hidden from everyone else. If w-1 doesn't return it (delete) or renew it (extend) in time, the book goes back on the shelf by itself. The question here is: **how does the shelf know when to take a book back?**

| Option | How | Good | Bad |
|---|---|---|---|
| **Timestamp only** | Each message has an `invisible_until` time. When a worker asks for a message, we skip any whose time is still in the future | Simple. Nothing extra kept in memory | To find the next free message, we walk past every hidden one. Slow when many messages are being worked on |
| **Min-heap (our choice)** | The time on disk is the truth. A min-heap in memory (a pile where the earliest deadline is always on top) tells the timer what runs out next | Seeing what expires next is instant. Adding or removing an entry is cheap | The heap lives in memory, so it must be rebuilt from the state index after a restart |
| **Timing wheel** | A ring of buckets, one per second, like a clock face. A message goes into the bucket for the second it expires | Even cheaper when there are millions of timers | Only accurate to the second. Harder to build |

- **Extend (`ChangeMessageVisibility`)** means "renew the book". We change `invisible_until` and move the heap entry. A common trick is "lazy delete": instead of digging the old entry out of the pile, just push a new one. When the old one later reaches the top, we compare it with the stored time. If they don't match, we throw it away.
- **Clock problems:** different machines' clocks are never exactly in sync. So only the leader of the partition checks the times, using its own clock. Since one clock decides everything for that partition, the machines never need to agree on the exact time.

**Why not just let each message set its own alarm?** A million hidden messages would mean a million alarms ringing in the computer. One sorted pile with one alarm (for whatever is on top) does the same job.

---

### 4. Partitions: how a queue is split, and which one to read

Think of partitions as checkout lanes in a supermarket. More lanes means more shoppers served at once.

- **Send (standard):** the message can go to any healthy partition. We pick two partitions at random and use the less busy one ("pick two at random, use the less busy one"). Like glancing at two lanes and joining the shorter. No machine needs to ask any other machine first.
- **Send (FIFO):** `hash(messageGroupId) mod partitions`. In plain words: turn the group name (like `user-rahul`) into a number, divide by the number of partitions, and use the remainder. The same group name always gives the same partition. So all of Rahul's messages stand in the same lane, in order.
- **Receive:** each partition leader tells the front-ends how many ready messages it has, a few times a second. The front-end starts at a random partition and only asks those that have messages. With long polling, it waits on several partitions at once and takes the first message that shows up.
- **Order in a standard queue:** inside one partition, messages come out roughly oldest first. Across partitions there is no order. That's the "best-effort ordering" of standard SQS: usually in order, but no promise.
- **Adding partitions** (a sale is coming, or a queue gets busy): new partitions are created and added to the settings. Senders start using them at once. Old partitions keep emptying as workers read them. No message is moved, just like opening a new lane doesn't move shoppers already waiting. FIFO is harder: changing the partition count would change which lane a group belongs to. So a group stays on its old partition until that group is empty.
- **Hot partition** (one partition doing far more work than the others): senders skip a slow leader, and one of its followers can take over as leader.

---

### 5. Replication and failover

Replication means keeping copies on several machines. Failover means a copy takes over when the main machine dies. Picture one person writing the meeting notes (the leader) while two others keep photocopies (the followers).

```text
Send m-501 to p-2:
  leader node-1 (epoch 7) ── append ──> disk
                 └── copy ──> node-2 ✔   (2 of 3 have it = committed -> "OK")
                 └── copy ──> node-3     (catches up a moment later)

node-1 dies:
  node-2 and node-3 stop hearing node-1's heartbeat ("I'm alive" pings), after about 2-3 seconds
  they pick the follower with the newest committed record -> node-2, epoch 8
  Metadata Service saves partitions (leader node-2, epoch 8) + outbox row leader.changed in ONE transaction
  Config Publisher reads the outbox -> updates Redis qcfg; front-ends retry the send on node-2
  node-1 comes back: its epoch 7 is old -> it becomes a follower and copies what it missed
```

- "Committed" means enough machines (2 of 3) have the record on disk that it can never be lost.
- This is the **Raft** idea. Raft is a well-known way for a few machines to agree on one shared history. A majority must agree on every write, and a new leader always has every committed record.
- **In-flight messages survive a failover.** "In flight" means a worker has picked the message up but not finished. They survive because receives, extends and deletes are also log records copied to the followers (Flows 3 and 4). So node-2 knows m-501 was borrowed by w-1 and until when.
- A failover can still create **duplicates**. Say node-1 handed m-501 to w-1, but died before copying that "receive" record. node-2 thinks m-501 is still waiting, so it hands it out again. At-least-once delivery allows this. Repeat-safe consumers (workers that check "did I already do this?") handle it, so Rahul still gets one email.

**Why does the epoch matter here?** When node-1 wakes up, it may still think it is the leader. Its epoch is 7, but everyone else is on 8. So its writes are refused, and it quietly becomes a follower. Without the epoch, both node-1 and node-2 could accept sends, and the two copies would drift apart.

---

### 6. Standard vs FIFO trade-off

A standard queue is a busy shop with many open counters: fast, but people may be served a bit out of order. FIFO is one line per family: each family is served strictly in order, but each family only moves as fast as its own line.

| | Standard | FIFO |
|---|---|---|
| Order | Roughly oldest first inside a partition; no order across partitions | Strict order inside each message group |
| Duplicates | Possible, but rare | A repeat with the same deduplication id is not stored if it arrives within 5 minutes |
| Speed | Almost no limit: just add partitions | Limited per group: only one message per group is being worked on at a time |
| Where a message goes | Any partition | The partition its group belongs to |
| Good for | Emails, image jobs, anything that is safe to do twice | Payments, stock updates, anything where order matters |

- **Rule of thumb:** use standard with repeat-safe consumers whenever you can. Use FIFO only when order really matters (Rahul's "charge" must come before his "refund"). Choose group ids so there are many groups, such as one per user or one per order. If you put everything in one group, you get one single line and lose all speed.

---

### 7. Tuning the dead-letter queue

The dead-letter queue is the "problem letters" box at a post office. These settings decide when a letter goes in that box, and how quickly someone notices.

| Setting | Guideline | Example |
|---|---|---|
| `maxReceiveCount` | High enough to survive a short outage, low enough to catch a truly broken message fast. Usually 3 to 10 | 5: if the email provider hiccups for 30 seconds, messages don't land in the DLQ by mistake |
| Visibility timeout | About 6 times the normal job time. For long jobs, extend it while working | Sending an email takes 2 seconds, so 30 seconds is safe |
| Retry spacing | On a temporary error, call `ChangeMessageVisibility` with a growing wait (10 s, 30 s, 2 min...) instead of retrying at once | The provider is down: wait longer each time instead of using up all 5 tries in 2 minutes |
| DLQ retention | Use the maximum, 14 days, longer than the main queue | A message's age counts from its first send, so a short DLQ retention could expire it soon after it arrives |
| Alarm | Fire when the DLQ has any message for 1 minute. Also watch "age of oldest message" on the main queue | Anita is paged at 10:09 |
| Type | A FIFO main queue needs a FIFO DLQ, in the same account and region | `payments.fifo` → `payments-dlq.fifo` |


---

### 8. Backpressure (end to end)

Backpressure means a slow part of the system can say "slow down" to the parts before it, instead of being flooded. Think of a restaurant kitchen: when the cooks fall behind, the waiter stops taking new tables for a moment. A queue **is** backpressure for the services around it. It lets producers (the senders) keep going while consumers (the workers) catch up.

```text
Producer ◄─throttle / 503─ Front-end (rate limit per queue + account) ──> Partition leaders (disk + copies)
                                                                                │  backlog grows (visible messages, age of oldest)
                                                                                v
                                                      Metrics ──> add more consumers (autoscale on queue depth)
Consumers pull at their own speed (long polling); a slow consumer just leaves messages waiting
```

- **Throttle / 503:** a "too busy, try again later" answer. 503 is the web code for "service unavailable".
- **Autoscale on queue depth:** when many messages are waiting, start more workers automatically. When the queue is empty again, stop them.

| Layer | What it does |
|---|---|
| Producer | On "slow down" or 503, it retries, waiting longer each time plus a little randomness (so all senders don't retry at the same instant). It sends in batches of 10 |
| Front-end | Limits how fast each queue and each account can send. It never drops a message it has already said "OK" to |
| Storage node | Refuses new writes when its disk is almost full. The front-end then sends to other partitions |
| Consumers | Ask only for as many messages as they can handle (`maxCount`). Add more workers when "messages visible" or "age of oldest message" grows |
| Downstream | Moving messages out of the DLQ is rate-limited (`maxPerSecond`), so the fixed workers aren't flooded all at once |

---

### 9. Failure scenarios

For each thing that can break, here is what the system does, so no message is lost.

| Failure | What happens |
|---|---|
| A consumer crashes mid-job | It never sends delete, so the visibility timeout runs out. The message shows up again, and another worker retries it |
| A message always crashes the consumer | After `maxReceiveCount` receives, it goes to the dead-letter queue. The alarm fires, someone fixes the bug, and the message is moved back (Flows 5, 6) |
| A partition leader dies | Within seconds, a follower that has every committed record becomes leader (with a new epoch). Nothing that got an "OK" is lost |
| A whole building (availability zone) goes down | Every partition still has 2 of its 3 copies in other buildings. Leaders that were in the dead building move to the others |
| The producer doesn't get an answer | It sends again. A standard queue may store a duplicate; FIFO drops the repeat by its deduplication id |
| Consumers are down for a day | Messages just wait (kept 4 to 14 days). An alarm on "age of oldest message" tells someone |
| Metadata Database is down | Sends and receives keep working from the cached (saved copy of) settings. Only creating, deleting and move tasks wait |
| Redis is down | Front-ends use their own in-memory copy of the settings. Rate limits fall back to each server counting on its own |
| Redis lost a settings key | The front-end reads the settings from PostgreSQL once and puts them back in Redis. Redis is only a copy |
| Metadata Service crashes right after saving a queue | The `outbox` row was saved in the same transaction, so the Config Publisher still creates the partitions and the Redis key |
| Config Publisher crashes halfway through a to-do | The outbox row is still NEW. Another publisher does it again; every step is "create if missing", so repeats are harmless |
| Order Service crashes after saving o-301, before sending | Its own outbox row survived. Its relay sends the message after the restart (maybe twice; the email key drops the repeat) |
| Disk fills up on a node | The node refuses new writes. Senders use other partitions. Operators add more machines |
| Move task worker dies | Its lease (a time-limited "this job is mine" claim) runs out. Another worker takes over and continues from the progress saved in `move_tasks` |

---

### 10. Real-world anchors

- **Amazon SQS:** has visibility timeout, receipt handles, long polling (up to 20 s), retention from 1 minute to 14 days (4 days by default), messages up to 256 KB, a redrive policy (the rule for when to send a message to the DLQ) with `maxReceiveCount`, `StartMessageMoveTask` for moving messages back, and FIFO with message groups and a 5-minute deduplication window. How it is built inside is not public; this document is one reasonable way to build it.
- **Kafka is different:** Kafka is a log that consumers **read through**, keeping a bookmark (offset) of how far they got. Messages are not deleted when one consumer finishes them. There is no per-message visibility timeout and no built-in dead-letter queue. A queue like SQS tracks **each message's** state. Kafka is like a newspaper everyone reads at their own pace; SQS is like a stack of job cards, each taken by one worker.
- **RabbitMQ:** "ack after processing" (say "done" only after the work is finished) and "dead-letter exchange" are the same ideas under different names.

**Real Amazon SQS vs this document: what is real, what is our guess**

Think of SQS like a **post office**. You only see the **counter**: you hand in a letter, you pick up a letter. You never see the **sorting room** behind the wall.

- **The counter** = the buttons and settings AWS gives you. These are **real** and written in AWS's guide.
- **The sorting room** = how AWS builds it inside. AWS keeps this **secret**, so this document **guesses** one good way.

**Real features (the counter):**

- **Visibility timeout.** When worker w-1 picks up message m-501, the message is **hidden, not deleted**. If w-1 crashes, m-501 shows up again after 30 seconds so another worker can do it.
- **At-least-once delivery.** Sometimes the same message is given out **twice**. So the worker checks "did I already send this email?" before sending. Rahul still gets only one email.
- **Dead-letter queue.** If a message fails 5 times (like m-777 with a broken email address), SQS moves it to a separate "failed" queue, `order-emails-dlq`. It stops blocking the others, and a person can look at it later.
- **FIFO (First In, First Out) groups.** Messages with the same group name, like `user-rahul`, come out **in the order they went in**. Rahul's "charge" is always handled before his "refund".

**Our guess (the sorting room):**

- Splitting a queue into **partitions** (smaller pieces), keeping **3 copies** of each piece, writing messages to the end of a file, and keeping a **timer list** of hidden messages.
- These are common building blocks. AWS hasn't said it does exactly this.

**Not part of SQS at all: MVCC (Multi-Version Concurrency Control)**

- It is a **database** trick. While someone is changing a row, other readers still see the **old copy**, so nobody has to wait.
- Like editing a shared document: people keep reading the last saved version until you press save.
- You'd only need it if you built a queue **inside a database table**, or for a booking system where two people try to grab the same appointment slot.

**Tip for the interview:** say which part is real SQS and which part is your own idea. For example: "SQS hides a message for 30 seconds after it is picked up. **In my design**, I keep a timer list to bring it back." That sounds honest and strong.

---

### 11. End-to-end walk-through: Priya, Rahul and Anita

One morning, start to finish. Priya sets things up, Rahul places orders, and Anita fixes a bug. Read each line left to right: the time, what happened, and what the system did.

```text
09:00     Priya creates order-emails-dlq, then order-emails (queue + outbox row, one transaction; Config Publisher builds 4 partitions x 3 copies)
10:00:00  Order Service sends m-501 (o-301)   -> front-end picks p-2 -> leader node-1 + node-2 on disk -> "OK"
10:00:01  w-1 long poll wakes                  -> m-501 INFLIGHT until 10:00:31, receive_count 1, handle n-8f3a
10:00:21  email provider slow                  -> ChangeMessageVisibility 40 s -> invisible until 10:01:01
10:00:23  email sent (key m-501)               -> DeleteMessage -> m-501 DELETED, tombstone copied
10:05:00  Order Service sends m-777 (o-302)    -> w-2 receives it and crashes
10:05:30  timer pops m-777                     -> READY; received 4 more times, every worker crashes, the last receive at 10:07:30
10:08:00  receive_count = 5                    -> copied to order-emails-dlq, then deleted from order-emails
10:09     alarm "order-emails-dlq not empty"   -> Anita paged
10:40     Anita deploys Email Workers v2       -> move task t-9, 50 per second -> m-777 back in order-emails, count 0
10:40:02  w-1 (v2) processes m-777             -> Rahul gets his o-302 email; t-9 COMPLETED; alarm back to OK
```

The story in words:

- **The happy path (o-301):** Rahul's first order goes in, w-1 picks it up a second later, asks for more time when the email provider is slow, and deletes it once the email is sent. Rahul gets exactly one email.
- **The poison message (o-302):** m-777 crashes every worker that touches it. After 5 tries it is moved to the "problem letters" box, so it stops blocking the other emails.
- **The fix:** Anita is paged, ships a fixed worker, and moves m-777 back at a gentle pace. Rahul gets his o-302 email, late but not lost.

---

### 12. Rapid-fire interview Q&A

| Question | Answer |
|---|---|
| How is a message not lost if a consumer crashes? | Picking it up only hides it. If no delete comes, it shows up again after the visibility timeout |
| How does the visibility timeout work inside? | Each message stores `invisible_until`. Each partition keeps a min-heap (a pile with the earliest deadline on top), so the timer always knows what expires next |
| Exactly once? | Standard: at-least-once, so consumers must be repeat-safe (use the message id as a "did I do this?" key). FIFO: repeats are not stored for 5 minutes, and only one message per group is worked on at a time |
| Why a receipt handle and not the message id for delete? | Each pick-up gets a new random number, like a new coat-check ticket. A slow old worker's ticket no longer matches, so it can't delete a message someone else now holds |
| How do you scale one queue? | Add partitions. Standard sends can go to any of them; receives start at a random one |
| How does FIFO keep order with partitions? | Order is promised only inside a message group, and a group always lives on one partition |
| When does a message go to the DLQ? | When its receive count has reached `maxReceiveCount` and it comes back once more. Copy it to the DLQ first, then delete it from the main queue |
| What if the DLQ fills up silently? | Alarm as soon as the DLQ has any message. Keep DLQ messages 14 days, remembering age counts from the first send |
| How do you move messages back? | A move task, owned by one worker and limited in speed: take from the DLQ, send to the main queue with count 0, delete from the DLQ |
| Why long polling? | Far fewer empty calls, and the message is handed over the moment it arrives |
| Any dual writes left? | No. Setup changes go through the Metadata DB outbox, move tasks are rows that workers claim, DLQ moves copy first and delete after, and producers send through their own outbox. The worst case is a duplicate, which repeat-safe consumers drop |
| What happens when a leader dies? | A follower with all committed records takes over with a higher epoch. Which messages were in flight was copied too, so nothing is forgotten |
| How long are messages kept? | 4 days by default, up to 14. A log file is deleted whole once all its messages are gone |
