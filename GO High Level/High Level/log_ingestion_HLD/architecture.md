# Distributed Logging Architecture (log ingestion: services → Fluent Bit → Kafka → Flink → Elasticsearch, TimescaleDB, S3)

> **The one idea to remember: "Services only print. A small agent on every machine carries the lines into Kafka, and one Flink job cleans them once and feeds three stores, each built for one question: find a line (Elasticsearch), watch the numbers (TimescaleDB), keep a year cheaply (S3)."**
> Picture a big office where every desk writes notes on paper. Nobody walks their notes to the archive; a courier (Fluent Bit) passes each floor, collects the notes in a bag and drops the bag in a safe, numbered mailroom (Kafka). One clerk (Flink) opens every bag, throws out copies, blacks out card numbers and files each note three ways: in a searchable card index for this week, as a tally of "how many errors per minute", and in cheap boxes in the basement for a year.
> In every flow: tenant (customer company) **acme**, three users and their requests **c-101**, **c-102**, **c-103**. User 3's card is declined, and the line `"card declined"` (logId `01JCXA7Q`) travels the whole way. **Meera** is the on-call engineer and **Arjun** is the developer of user-service.
> Deep dive: [Deep Dive](#deep-dive-with-kafka-internals)

## Requirements (minimal)

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

### Functional (what the product does)

</td><td valign="top" width="50%" markdown="1">

### Non-functional (how well it must work)

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Collect logs from every service, with no code per service**
  - Services print JSON lines to stdout (the console). An agent on each machine ships them to Kafka.
    - e.g. order-, user- and payment-service logs are all collected, and none of them knows Kafka exists.

</td><td valign="top" width="50%" markdown="1">

- **Logging never slows down or breaks a service (99.9% up)**
  - Printing is fast and local. Kafka and a disk buffer on each machine sit between the services and every store.
    - e.g. Kafka is down for 10 minutes: orders keep working and the lines wait on disk.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Search recent logs (7 days)**
  - Search by word, service, level and tenant in Kibana.
    - e.g. `service:payment AND level:ERROR` in the last 15 minutes.

</td><td valign="top" width="50%" markdown="1">

- **A line is searchable within ≈10 seconds**
  - Streaming the whole way, with an Elasticsearch refresh every second.
    - e.g. User 3's "card declined" can be found about a second after Flink writes it.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Follow one request across services**
  - The API Gateway makes one correlationId per request and every service logs it.
    - e.g. `c-103` shows order → user → payment "card declined".

</td><td valign="top" width="50%" markdown="1">

- **No accepted line is lost, and none is stored twice**
  - 3 copies in Kafka, writes confirmed by at least 2, and every store write keyed by logId.
    - e.g. a Kafka server dies or a batch is sent twice: User 3's error is still there, exactly once.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Metrics and alerts**
  - Error counts and slow-request times per service per minute, with alert rules.
    - e.g. payment errors above 5% for 5 minutes → Meera's phone rings.

</td><td valign="top" width="50%" markdown="1">

- **An alert arrives within ≈2 minutes of the rule becoming true**
  - Counts are made while the lines stream past, not by searching later.
    - e.g. the 5th bad minute ends at 09:35 and Meera is paged right after.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Keep a year of logs and query them with SQL**
  - Hourly files in S3, queried by Athena, moved to Glacier after a year.
    - e.g. "How many acme payment errors in June?"

</td><td valign="top" width="50%" markdown="1">

- **Cost stays low as the volume grows**
  - gzip on the wire, fewer DEBUG lines, 7 days in Elasticsearch only, then cheap files.
    - e.g. ≈1 TB a day; a year of it lives in S3 and Glacier, not on search servers.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Many tenants on one system**
  - Every line carries a tenantId; limits and quotas per tenant.
    - e.g. acme sees only acme's lines and can't flood the other tenants.

</td><td valign="top" width="50%" markdown="1">

- **Personal data is masked, and tenants are kept apart**
  - PII (Personally Identifiable Information) is masked before any store; TLS on every connection; search filtered by tenant.
    - e.g. card `4111111111111111` is stored as `****1111`.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Bad lines are kept and can be replayed**
  - A line Flink can't read goes to a DLQ (Dead Letter Queue) topic with the reason.
    - e.g. a new date format from user-service is parked, fixed and replayed.

</td><td valign="top" width="50%" markdown="1">

- **Scale: ≈25,000 lines a second on average, ≈100,000 at peak**
  - Kafka partitions, more Flink workers and more Elasticsearch servers can be added.
    - e.g. a sale spike is soaked up by Kafka while the stores catch up.

</td></tr>
</table>

## APIs

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

| Feature | API |
|---|---|
| Log line (every service) | stdout, one JSON line: `{logId, tenantId, service, level, ts, correlationId, msg, durationMs}` |
| Pass the request id | Header `X-Correlation-Id: c-103` + `X-Tenant-Id: acme` on every call; returned to the client |
| Ship to Kafka (Fluent Bit) | Produce to topic `logs-raw`, key `tenantId:service`, `acks=all`, gzip batches |
| Park a bad line (Flink) | Produce to topic `logs-dlq`: `{raw, error, service, failed_at}` + header `source` |
| Replay bad lines | DLQ replay job: read `logs-dlq` → produce the `raw` line to `logs-raw` (same key) |

</td><td valign="top" width="50%" markdown="1">

| Feature | API |
|---|---|
| Index (Flink → Elasticsearch) | `POST /_bulk`: `{"index": {"_index": "logs-2026.11.12", "_id": "01JCXA7Q"}}` + the document |
| Search (Kibana → Elasticsearch) | `POST /logs-*/_search {query: correlationId = "c-103", sort: ts}` → hits |
| Metrics (Flink → TimescaleDB) | `INSERT INTO service_metrics ... ON CONFLICT (ts, tenant, service) DO UPDATE` |
| Graphs + alerts (Grafana) | SQL on `service_metrics`; a firing alert → PagerDuty |
| Old logs (Athena → S3) | `SELECT count(*) FROM logs WHERE tenant = 'acme' AND dt BETWEEN ...` |

</td></tr></table>

## Diagram

A quick map of all the parts and how they connect. The apps that write logs sit on the left, the people who read them on the right, and everything in the double-line frame is the logging system.

```text
PRODUCERS (outside)                                                                                                                   ╔══ THE LOGGING SYSTEM: everything inside this box is ours ════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗          CONSUMERS (outside)
                                                                                                                                      ║                                                                                                                                                                                                                              ║
                                                                                            ┌──────────────────────────────┐          ║   ┌──────────────────────────────┐                                                                                                          ┌──────────────────────────────┐              ┌──────────────────────────────┐   ║
                                                                                    ┌─────> │ order-service                │ ─────────╫─> │ Fluent Bit (Node A)          │ ─────┐                                                                                           ┌─────> │ Elasticsearch                │ ───────────> │ Kibana                       │ ──╫──┐
                                                                                    │       ├──────────────────────────────┤          ║   ├──────────────────────────────┤      │                                                                                           │       ├──────────────────────────────┤              ├──────────────────────────────┤   ║  │
                                                                                    │       │ - JSON lines to stdout       │          ║   │ - tails container logs       │      │                                                                                           │       │ - full-text search, 7 days   │              │ - search the log lines       │   ║  │
                                                                                    │       └──────────────────────────────┘          ║   │ - batch, gzip, disk buffer   │      │                                                                                           │       │ - _id = logId                │              └──────────────────────────────┘   ║  │
                                                                                    │                                                 ║   └──────────────────────────────┘      │                                                                                           │       └──────────────────────────────┘                                                 ║  │
                                                                                    │                                                 ║                                         │                                                                                           │                                                                                        ║  │
                                                                                    │                                                 ║                                         │                                                                                           │                                                                                        ║  │
                                                                                    │                                                 ║                                         │                                                                                           │                                                                                        ║  │
┌──────────────────────────────┐              ┌──────────────────────────────┐      │       ┌──────────────────────────────┐          ║   ┌──────────────────────────────┐      │       ┌──────────────────────────────┐              ┌──────────────────────────────┐      │       ┌──────────────────────────────┐              ┌──────────────────────────────┐   ║  │       ┌──────────────────────────────┐
│ Clients                      │ ───────────> │ API Gateway                  │ ─────┼─────> │ user-service                 │ ─────────╫─> │ Fluent Bit (Node B)          │ ─────┼─────> │ Kafka (topic logs-raw)       │ ───────────> │ Flink (stream processing)    │ ─────┼─────> │ TimescaleDB                  │ ───────────> │ Grafana                      │ ──╫──┼─────> │ Developer / on-call          │
├──────────────────────────────┤              ├──────────────────────────────┤      │       ├──────────────────────────────┤          ║   ├──────────────────────────────┤      │       ├──────────────────────────────┤              ├──────────────────────────────┤      │       ├──────────────────────────────┤              ├──────────────────────────────┤   ║  │       ├──────────────────────────────┤
│ - web, mobile, partner apps  │              │ - adds correlationId         │      │       │ - JSON lines to stdout       │          ║   │ - one agent per machine      │      │       │ - key tenantId:service       │              │ - checks + masks each line   │      │       │ - 1 row per service a minute │              │ - graphs + alerts            │   ║  │       │ - Meera (on-call engineer)   │
│ - Users 1-3 of tenant acme   │              │ - adds tenantId              │      │       └──────────────────────────────┘          ║   └──────────────────────────────┘      │       │ - 3 copies, kept 7 days      │              │ - drops repeats by logId     │      │       └──────────────────────────────┘              └──────────────────────────────┘   ║  │       │ - Arjun (developer)          │
│ - never send logs to us      │              │ - rate limit per tenant      │      │                                                 ║                                         │       └──────────────────────────────┘              │ - 1-minute counts            │      │                                                                                        ║  │       │ - debug, alerts, audits      │
└──────────────────────────────┘              └──────────────────────────────┘      │                                                 ║                                         │                                                     │ - hourly Parquet files       │      │                                                                                        ║  │       └──────────────────────────────┘
                                                                                    │                                                 ║                                         │                                                     └──────────────────────────────┘      │                                                                                        ║  │
                                                                                    │                                                 ║                                         │                                                                                           │                                                                                        ║  │
                                                                                    │                                                 ║                                         │                                                                                           │                                                                                        ║  │
                                                                                    │                                                 ║                                         │                                                                                           │                                                                                        ║  │
                                                                                    │       ┌──────────────────────────────┐          ║   ┌──────────────────────────────┐      │                                                                                           │       ┌──────────────────────────────┐              ┌──────────────────────────────┐   ║  │
                                                                                    └─────> │ payment-service              │ ─────────╫─> │ Fluent Bit (Node C)          │ ─────┘                                                                                           ├─────> │ S3 + Glacier                 │ ───────────> │ Athena                       │ ──╫──┘
                                                                                            ├──────────────────────────────┤          ║   ├──────────────────────────────┤                                                                                                  │       ├──────────────────────────────┤              ├──────────────────────────────┤   ║
                                                                                            │ - JSON lines to stdout       │          ║   │ - the Kafka producer         │                                                                                                  │       │ - Parquet files, 1 year      │              │ - SQL on the old files       │   ║
                                                                                            └──────────────────────────────┘          ║   └──────────────────────────────┘                                                                                                  │       │ - then Glacier               │              └──────────────────────────────┘   ║
                                                                                                                                      ║                                                                                                                                     │       └──────────────────────────────┘                                                 ║
                                                                                                                                      ║                                                                                                                                     │                                                                                        ║
                                                                                                                                      ║                                                                                                                                     │                                                                                        ║
                                                                                                                                      ║                                                                                                                                     │                                                                                        ║
                                                                                                                                      ║                                                                                                                                     │       ┌──────────────────────────────┐                                                 ║
                                                                                                                                      ║                                                                                                                                     └─────> │ DLQ topic (logs-dlq)         │                                                 ║
                                                                                                                                      ║                                                                                                                                             ├──────────────────────────────┤                                                 ║
                                                                                                                                      ║                                                                                                                                             │ - bad lines + the reason     │                                                 ║
                                                                                                                                      ║                                                                                                                                             │ - replayed after a fix       │                                                 ║
                                                                                                                                      ║                                                                                                                                             └──────────────────────────────┘                                                 ║
                                                                                                                                      ║                                                                                                                                                                                                                              ║
                                                                                                                                      ╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## Schema Overview

What every message and store keeps, as one real example per box. Where a field can take several values, they are shown as `"A" or "B"`. Each row scrolls sideways.

### The log line and the Kafka messages

```text
╔════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════╗
║ log line (stdout of every service)                 ║    ║ Kafka message (topic logs-raw) · key tenantId:service   ║    ║ Kafka message (topic logs-dlq)                                         ║
╟────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────────╢
║ {                                                  ║    ║ {                                                       ║    ║ {                                                                      ║
║   "logId": "01JCXA7Q",                             ║    ║   "topic": "logs-raw",                                  ║    ║   "topic": "logs-dlq",                                                 ║
║   "tenantId": "acme",                              ║    ║   "partition": 5,                                       ║    ║   "key": "acme:user",                                                  ║
║   "service": "order" or "user" or "payment",       ║    ║   "offset": 2000418,                                    ║    ║   "headers": {                                                         ║
║   "level": "DEBUG" or "INFO" or "WARN" or "ERROR", ║    ║   "key": "acme:order" or "acme:user" or "acme:payment", ║    ║     "error": "bad_ts" or "bad_json" or "missing_field",                ║
║   "ts": "2026-11-12T09:30:00.120Z",                ║    ║   "headers": {                                          ║    ║     "source": "logs-raw/3/880112"                                      ║
║   "correlationId": "c-103",                        ║    ║     "agent": "fluent-bit/node-c"                        ║    ║   },                                                                   ║
║   "userId": "user-3",                              ║    ║   },                                                    ║    ║   "value": {                                                           ║
║   "durationMs": 412,                               ║    ║   "value": {                                            ║    ║     "raw": "{\"logId\":\"01JCXB2M\",\"tenantId\":\"acme\",\"service\": ║
║   "msg": "card declined",                          ║    ║     "logId": "01JCXA7Q",                                ║    ║         \"user\",\"level\":\"INFO\",\"ts\":\"12/11/2026                ║
║   "card": "4111111111111111"                       ║    ║     "tenantId": "acme",                                 ║    ║         09:31:05\",\"correlationId\":\"c-102\",\"msg\":\"profile       ║
║ }                                                  ║    ║     "service": "order" or "user" or "payment",          ║    ║         viewed\"}",                                                    ║
╚════════════════════════════════════════════════════╝    ║     "level": "DEBUG" or "INFO" or "WARN" or "ERROR",    ║    ║     "error": "bad_ts" or "bad_json" or "missing_field",                ║
                                                          ║     "ts": "2026-11-12T09:30:00.120Z",                   ║    ║     "service": "user",                                                 ║
                                                          ║     "correlationId": "c-103",                           ║    ║     "failed_at": "2026-11-12T09:31:06Z"                                ║
                                                          ║     "userId": "user-3",                                 ║    ║   }                                                                    ║
                                                          ║     "durationMs": 412,                                  ║    ║ }                                                                      ║
                                                          ║     "msg": "card declined",                             ║    ╚════════════════════════════════════════════════════════════════════════╝
                                                          ║     "card": "4111111111111111",                         ║
                                                          ║     "k8s": {                                            ║
                                                          ║       "pod": "payment-7d9f",                            ║
                                                          ║       "namespace": "prod",                              ║
                                                          ║       "node": "node-c"                                  ║
                                                          ║     }                                                   ║
                                                          ║   }                                                     ║
                                                          ║ }                                                       ║
                                                          ╚═════════════════════════════════════════════════════════╝
```

### The three stores (search, numbers, history)

```text
╔══════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════╗
║ Elasticsearch document · _id = logId                 ║    ║ service_metrics (TimescaleDB) · UNIQUE ts + tenant + service ║    ║ S3 object (Parquet, hourly)                                            ║
╟──────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────────╢
║ {                                                    ║    ║ {                                                            ║    ║ {                                                                      ║
║   "_index": "logs-2026.11.12",                       ║    ║   "ts": "2026-11-12T09:30:00Z",                              ║    ║   "path": "s3://logs/tenant=acme/service=payment/dt=2026-11-           ║
║   "_id": "01JCXA7Q",                                 ║    ║   "tenant": "acme",                                          ║    ║       12/hour=09/part-0001.parquet",                                   ║
║   "_source": {                                       ║    ║   "service": "order" or "user" or "payment",                 ║    ║   "format": "Parquet (stored by column, compressed)",                  ║
║     "tenantId": "acme",                              ║    ║   "total": 1200,                                             ║    ║   "size": "≈400 MB",                                                   ║
║     "service": "order" or "user" or "payment",       ║    ║   "errors": 78,                                              ║    ║   "columns": ["logId", "ts", "level", "correlationId", "msg", "..."],  ║
║     "level": "DEBUG" or "INFO" or "WARN" or "ERROR", ║    ║   "p99_ms": 870,                                             ║    ║   "storage_class": "STANDARD" or "GLACIER"                             ║
║     "ts": "2026-11-12T09:30:00.120Z",                ║    ║   "dlq": 0                                                   ║    ║ }                                                                      ║
║     "correlationId": "c-103",                        ║    ║ }                                                            ║    ╚════════════════════════════════════════════════════════════════════════╝
║     "userId": "user-3",                              ║    ╚══════════════════════════════════════════════════════════════╝
║     "durationMs": 412,                               ║
║     "msg": "card declined",                          ║
║     "card": "****1111",                              ║
║     "pod": "payment-7d9f",                           ║
║     "region": "ap-south-1"                           ║
║   }                                                  ║
║ }                                                    ║
╚══════════════════════════════════════════════════════╝
```

### Rules that move or drop old data

```text
╔══════════════════════════════════════════════╗    ╔══════════════════════════════════════╗    ╔═══════════════════════════════════════════════════╗
║ Elasticsearch ILM policy                     ║    ║ S3 lifecycle rule                    ║    ║ Grafana alert rule                                ║
╟──────────────────────────────────────────────╢    ╟──────────────────────────────────────╢    ╟───────────────────────────────────────────────────╢
║ policy logs-7d (index logs-YYYY.MM.DD):      ║    ║ rule logs-archive (bucket logs):     ║    ║ rule 'acme payment error rate > 5%':              ║
║   hot   day 0-1  SSD, takes writes           ║    ║   after 365 days -> GLACIER          ║    ║   every 1 min run:                                ║
║   warm  day 2-7  cheaper disks, read-only,   ║    ║   Glacier restore: minutes to hours, ║    ║     SELECT ts, errors::float / total              ║
║                  force-merge to 1 segment    ║    ║   only for audits                    ║    ║     FROM service_metrics                          ║
║   delete after 7 days (drop the whole index) ║    ╚══════════════════════════════════════╝    ║     WHERE tenant = 'acme' AND service = 'payment' ║
╚══════════════════════════════════════════════╝                                                ║       AND ts > now() - interval '5 minutes'       ║
                                                                                                ║   fire if every row > 0.05 for 5 min              ║
                                                                                                ║   send to PagerDuty: team payments-oncall         ║
                                                                                                ╚═══════════════════════════════════════════════════╝
```

## Flows (the big diagram, one piece at a time)

Each flow is one slice of the big diagram. Every box says what it does in each step (`STEP n: what`, then how, then an example). Arrows go straight from box to box. Under each diagram, **Data in this flow** shows the lines, messages and rows that flow writes, side by side (scroll sideways). The numbered steps below match the `STEP n` in the boxes.

### Flow 1. User 3's "card declined" line travels from payment-service to all three stores (API Gateway → payment-service stdout → Fluent Bit → Kafka → Flink → Elasticsearch + TimescaleDB + S3)

```text
┌── STEP 1 ────────────────────────────────────────────────┐            ┌── STEP 1 ────────────────────────────────────────────────┐            ┌── STEP 2 ────────────────────────────────────────────────┐            ┌── STEP 3 ────────────────────────────────────────────────┐            ┌── STEP 4 ────────────────────────────────────────────────┐            ┌── STEP 5, 6, 7, 8 ───────────────────────────────────────┐            ┌── STEP 6 ────────────────────────────────────────────────┐
│ User 3's app  (a client of tenant acme)                  │            │ API Gateway  (front door)                                │            │ payment-service  (pod payment-7d9f on Node C)            │            │ Fluent Bit  (DaemonSet agent on Node C)                  │            │ Kafka  (topic logs-raw, 3 copies of each partition)      │            │ Flink  (consumer group flink-log-processor)              │            │ Elasticsearch  (daily index logs-2026.11.12)             │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Taps 'Place order'                               │ ─────────> │ STEP 1: Stamps two ids on the request                    │ ─────────> │ STEP 2: Prints one JSON line to stdout                   │ ─────────> │ STEP 3: Reads the file and ships a batch                 │ ─────────> │ STEP 4: Stores the line safely, in order                 │ ─────────> │ STEP 5: Cleans the line once                             │ ────┬────> │ STEP 6: Makes the line searchable                        │
│   - HTTPS POST /orders; the app itself never sends logs  │            │   - makes a new correlationId, header X-Correlation-Id   │            │   - the shared logger adds logId, ts, tenantId,          │            │   - tail /var/log/containers/payment-*.log               │            │   - hash(key) picks partition P5; its leader is Broker 3 │            │   - checks the must-have fields: logId, ts, service      │     │      │   - _bulk write with _id = logId                         │
│   - e.g. User 3 pays with a card ending 1111             │            │   - reads tenantId from the API key, header X-Tenant-Id  │            │     correlationId                                        │            │   - adds pod + namespace, builds key tenantId:service    │            │   - Brokers 1 and 2 copy it, then the 'OK' goes back     │            │   - masks PII, adds region, drops repeats by logId       │     │      │   - a refresh every 1 s makes it visible                 │
└──────────────────────────────────────────────────────────┘            │   - token bucket: acme may send 1000 requests a second   │            │   - Kubernetes copies stdout into a file on the node     │            │   - batch of ≈1 s or 1 MB, gzip, acks=all, disk buffer   │            │   - e.g. P5 offset 2000418                               │            │   - e.g. card 4111111111111111 -> ****1111               │     │      │   - e.g. searchable at ≈09:30:01                         │
                                                                        │   - e.g. X-Correlation-Id: c-103, X-Tenant-Id: acme      │            │   - e.g. ERROR 'card declined', logId 01JCXA7Q           │            │   - e.g. key acme:payment -> topic logs-raw              │            └──────────────────────────────────────────────────────────┘            │                                                          │     │      └──────────────────────────────────────────────────────────┘
                                                                        └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘                                                                                    │ STEP 6, 7, 8: Sends the clean line three ways            │     │
                                                                                                                                                                                                                                                                                                                                                                        │   - search now, 1-minute counts, hourly files            │     │
                                                                                                                                                                                                                                                                                                                                                                        └──────────────────────────────────────────────────────────┘     │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │      ┌── STEP 7 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                                                                                                                                                                                                                                         │      │ TimescaleDB  (table service_metrics)                     │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │      ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                                                                                                                                                                                                                                         ├────> │ STEP 7: Stores one count row per minute                  │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │      │   - upsert on (ts, tenant, service) when the minute      │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │      │     closes                                               │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │      │   - e.g. 09:30 payment: 1200 lines, 78 errors, p99 870   │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │      │          ms                                              │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │      └──────────────────────────────────────────────────────────┘
                                                                                                                                                                                                                                                                                                                                                                                                                                         │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │      ┌── STEP 8 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                                                                                                                                                                                                                                         │      │ S3  (bucket logs, Parquet files)                         │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │      ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                                                                                                                                                                                                                                         └────> │ STEP 8: Keeps the line for a year, cheaply               │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │   - one Parquet file per hour per tenant + service       │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │   - the path holds tenant, service, date and hour        │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │   - e.g. dt=2026-11-12/hour=09/part-0001.parquet         │
                                                                                                                                                                                                                                                                                                                                                                                                                                                └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ payment-service                          ▼ Kafka                                                      ▼ Elasticsearch                              ▼ TimescaleDB                                                       ▼ S3
╔═════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════╗
║ log line (stdout of every service)  ║    ║ Kafka message (topic logs-raw) · key tenantId:service ║    ║ Elasticsearch document · _id = logId  ║    ║ service_metrics (TimescaleDB) · UNIQUE ts + tenant + service ║    ║ S3 object (Parquet, hourly)                                            ║
╟─────────────────────────────────────╢    ╟───────────────────────────────────────────────────────╢    ╟───────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────────╢
║ {                                   ║    ║ {                                                     ║    ║ {                                     ║    ║ {                                                            ║    ║ {                                                                      ║
║   "logId": "01JCXA7Q",              ║    ║   "topic": "logs-raw",                                ║    ║   "_index": "logs-2026.11.12",        ║    ║   "ts": "2026-11-12T09:30:00Z",                              ║    ║   "path": "s3://logs/tenant=acme/service=payment/dt=2026-11-           ║
║   "tenantId": "acme",               ║    ║   "partition": 5,                                     ║    ║   "_id": "01JCXA7Q",                  ║    ║   "tenant": "acme",                                          ║    ║       12/hour=09/part-0001.parquet",                                   ║
║   "service": "payment",             ║    ║   "offset": 2000418,                                  ║    ║   "_source": {                        ║    ║   "service": "payment",                                      ║    ║   "format": "Parquet (stored by column, compressed)",                  ║
║   "level": "ERROR",                 ║    ║   "key": "acme:payment",                              ║    ║     "tenantId": "acme",               ║    ║   "total": 1200,                                             ║    ║   "size": "≈400 MB",                                                   ║
║   "ts": "2026-11-12T09:30:00.120Z", ║    ║   "headers": {                                        ║    ║     "service": "payment",             ║    ║   "errors": 78,                                              ║    ║   "columns": ["logId", "ts", "level", "correlationId", "msg", "..."],  ║
║   "correlationId": "c-103",         ║    ║     "agent": "fluent-bit/node-c"                      ║    ║     "level": "ERROR",                 ║    ║   "p99_ms": 870,                                             ║    ║   "storage_class": "STANDARD"                                          ║
║   "userId": "user-3",               ║    ║   },                                                  ║    ║     "ts": "2026-11-12T09:30:00.120Z", ║    ║   "dlq": 0                                                   ║    ║ }                                                                      ║
║   "durationMs": 412,                ║    ║   "value": {                                          ║    ║     "correlationId": "c-103",         ║    ║ }                                                            ║    ╚════════════════════════════════════════════════════════════════════════╝
║   "msg": "card declined",           ║    ║     "logId": "01JCXA7Q",                              ║    ║     "userId": "user-3",               ║    ╚══════════════════════════════════════════════════════════════╝
║   "card": "4111111111111111"        ║    ║     "tenantId": "acme",                               ║    ║     "durationMs": 412,                ║
║ }                                   ║    ║     "service": "payment",                             ║    ║     "msg": "card declined",           ║
╚═════════════════════════════════════╝    ║     "level": "ERROR",                                 ║    ║     "card": "****1111",               ║
                                           ║     "ts": "2026-11-12T09:30:00.120Z",                 ║    ║     "pod": "payment-7d9f",            ║
                                           ║     "correlationId": "c-103",                         ║    ║     "region": "ap-south-1"            ║
                                           ║     "userId": "user-3",                               ║    ║   }                                   ║
                                           ║     "durationMs": 412,                                ║    ║ }                                     ║
                                           ║     "msg": "card declined",                           ║    ╚═══════════════════════════════════════╝
                                           ║     "card": "4111111111111111",                       ║
                                           ║     "k8s": {                                          ║
                                           ║       "pod": "payment-7d9f",                          ║
                                           ║       "namespace": "prod",                            ║
                                           ║       "node": "node-c"                                ║
                                           ║     }                                                 ║
                                           ║   }                                                   ║
                                           ║ }                                                     ║
                                           ╚═══════════════════════════════════════════════════════╝
```

1. **User 3 places an order; the API Gateway stamps two ids on it**
   - **a) The request**
     - User 3's app sends `POST /orders` over HTTPS
     - clients never send logs: only our own servers do
   - **b) What the gateway adds**
     - a new correlationId `c-103` in header `X-Correlation-Id`, like a courier tracking number for this one request
     - the tenantId `acme`, read from the API key `k_acme`, in header `X-Tenant-Id`
     - a rate limit per tenant (a token bucket): acme may send 1000 requests a second; request 1001 gets `429 Too Many Requests`
   - **c) The answer** carries the same `X-Correlation-Id`, so User 3 can quote "ref c-103" to support
   - **Data change:** none yet (only headers on the request)
   - **Why:** one id made at the front door is the only way to join the lines of three services later. If each service made its own id, Meera could never follow one request.

2. **payment-service prints one JSON line to stdout**
   - **a) The work**
     - order-service creates the order, calls user-service (verify User 3), then payment-service (charge the card)
     - a shared HTTP middleware copies `X-Correlation-Id: c-103` into every outgoing call, so all three services log `c-103`
   - **b) The line**
     - the shared logger library (Logback for Java, pino for Node.js) prints `{"logId":"01JCXA7Q","tenantId":"acme","service":"payment","level":"ERROR","correlationId":"c-103","msg":"card declined", ...}`
     - logId is a ULID (a unique id that also sorts by time), made once per line; a retry never makes a new one
   - **c) Where it goes**
     - to stdout (the console): no file of its own, no network call
     - Kubernetes (the system that runs the containers) copies stdout into `/var/log/containers/payment-7d9f_prod_payment-abc.log` on Node C
   - **Data change:** one line appended to that file on Node C
   - **Why JSON:** machines read fields like `level` and `correlationId` directly, with no guessing from free text.
   - **Why stdout:** printing is fast and never blocks the payment. Even if Kafka is down, the service does not notice.

3. **Fluent Bit on Node C ships the line to Kafka**
   - **a) Read**
     - Fluent Bit is a small log-shipping program; one copy runs on every machine (a Kubernetes DaemonSet)
     - its `tail` input reads every new line of `/var/log/containers/*.log`
     - its `kubernetes` filter adds pod `payment-7d9f` and namespace `prod`; a small filter builds the key `acme:payment`
   - **b) Trim**
     - DEBUG sampling: keeps 10% of DEBUG lines (e.g. user-service's "cache hit"); ERROR lines are always kept
     - a quota per tenant: above 5 GB a day, acme loses DEBUG and INFO lines, never ERROR
   - **c) Send**
     - collects lines for ≈1 second or 1 MB, then sends one gzip batch (10 MB of JSON becomes ≈1.5 MB), like a postman delivering a full bag instead of every letter on its own
     - Fluent Bit is the Kafka producer: `acks=all`, idempotence on
     - while Kafka can't be reached, batches wait in a disk buffer (`/var/log/flb-storage/`) and go out later
   - **Data change:** a produce request to topic `logs-raw`, key `acme:payment`, inside a gzip batch
   - **Why one agent per machine:** 50 machines means 50 agents, not 2,000 sidecars (one extra container per pod). Services never need a Kafka library.

4. **Kafka stores the line on three brokers**
   - **a) Pick the lane**
     - `partition = hash(key) % number of partitions`: `acme:payment` goes to P5
     - same key → same partition → acme's payment lines stay in order
   - **b) Copy, then say OK**
     - P5's leader is Broker 3; it appends the line at offset 2000418
     - Brokers 1 and 2 (followers) copy it; with `acks=all` and `min.insync.replicas=2`, the OK goes back only when at least 2 brokers have it
   - **Data change:** Kafka topic `logs-raw`, partition 5, offset 2000418, key `acme:payment`, value = the JSON line + pod info
   - **Why Kafka in the middle:** it soaks up a sale spike while Elasticsearch writes at its own pace, and it keeps 7 days so any store can be filled again (Flow 5).

5. **Flink cleans the line once**
   - **a) Check:** the must-have fields (`logId`, `ts`, `service`) are there and `ts` is a real time; a broken line goes to the DLQ (Flow 2)
   - **b) Mask PII** (card numbers, emails): `4111111111111111` → `****1111`, `john@x.com` → `j***@x.com`
   - **c) Enrich:** adds `region: ap-south-1`
   - **d) Drop repeats:** remembers every logId seen in the last 10 minutes; a second `01JCXA7Q` is dropped
   - **Data change:** Flink's dedup state gets `01JCXA7Q` (kept 10 minutes)
   - **Why mask here:** once a card number lands in Elasticsearch or S3 it sits in backups and old files for a year. Masking before every store means it never lands.
   - **Why one job for all three stores:** they all get exactly the same clean line.

6. **Elasticsearch makes it searchable in about a second**
   - **a) Write:** Flink's Elasticsearch sink sends `_bulk` requests over HTTPS to today's index `logs-2026.11.12`, with `_id = logId`; it retries on `429` or a timeout
   - **b) Visible:** a refresh every second turns new lines into a searchable segment
   - **Data change:** Elasticsearch document `logs-2026.11.12/01JCXA7Q` added, with card `****1111`
   - **Why `_id = logId`:** the same line written twice (a retry or a replay) overwrites itself. There are never two copies.
   - **Why one index per day:** deleting a day after 7 days means dropping one index, a cheap file delete instead of a slow delete of millions of documents.

7. **TimescaleDB gets one count row for the minute**
   - **a) Count:** Flink groups lines by tenant + service into 1-minute windows, by the line's own time (`ts`)
   - **b) Write:** when 09:30 closes: 1200 lines, 78 errors, p99 870 ms (99 in 100 requests were faster than 870 ms)
   - **Data change:** `service_metrics` row added `{ts: 09:30, tenant: acme, service: payment, total: 1200, errors: 78, p99_ms: 870, dlq: 0}`
   - **Why a separate store for numbers:** Grafana reads 5 small rows instead of counting millions of lines in Elasticsearch every minute (Flow 3).

8. **S3 keeps the line for a year as Parquet**
   - **a) Collect:** Flink's file sink gathers the hour's lines per tenant + service
   - **b) Write:** Parquet is a file format that stores data column by column, compressed (≈10 times smaller than JSON); the file is finished at the first Flink checkpoint after 10:00
   - **c) Later:** an S3 lifecycle rule moves files to Glacier (very cheap storage that is slow to read) after 365 days
   - **Data change:** S3 object `s3://logs/tenant=acme/service=payment/dt=2026-11-12/hour=09/part-0001.parquet` added
   - **Why hourly, with tenant, service and date in the path:** Athena then reads only the folders a question needs (Flow 4). Files of a few hundred MB are big enough to read fast and are finished often.

**Say in the interview:** "Services log JSON to stdout with a correlationId made at the gateway. A Fluent Bit DaemonSet batches lines into Kafka keyed by tenant:service with acks=all. One Flink job validates, masks PII and dedups by logId, then fans out to Elasticsearch for search, TimescaleDB for 1-minute metrics and S3 Parquet for a year of cheap history."

### Flow 2. A line Flink can't read goes to the DLQ, is fixed and replayed (user-service → Fluent Bit → Kafka logs-raw → Flink → logs-dlq → Arjun's fix → replay job → logs-raw → Flink → Elasticsearch)

```text
┌── STEP 1 ────────────────────────────────────────────────┐            ┌── STEP 1 ────────────────────────────────────────────────┐            ┌── STEP 2 ────────────────────────────────────────────────┐            ┌── STEP 3 ────────────────────────────────────────────────┐            ┌── STEP 4 ────────────────────────────────────────────────┐            ┌── STEP 6 ────────────────────────────────────────────────┐            ┌── STEP 6 ────────────────────────────────────────────────┐            ┌── STEP 7 ────────────────────────────────────────────────┐            ┌── STEP 8 ────────────────────────────────────────────────┐
│ user-service  (Node B, new logger version)               │            │ Fluent Bit  (Node B)                                     │            │ Kafka  (topic logs-raw)                                  │            │ Flink  (old parser)                                      │            │ Kafka  (topic logs-dlq)                                  │            │ DLQ replay job  (small Kafka consumer + producer)        │            │ Kafka  (topic logs-raw, drawn again)                     │            │ Flink  (new parser)                                      │            │ Elasticsearch  (index logs-2026.11.12)                   │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Prints a line with a new date format             │ ─────────> │ STEP 1: Ships it like any other line                     │ ─────────> │ STEP 2: Stores it like any other line                    │ ─────────> │ STEP 3: Can't read ts, so parks the line                 │ ─────────> │ STEP 4: Keeps every bad line for 7 days                  │ ────┬────> │ STEP 6: Puts the parked lines back in the pipe           │ ─────────> │ STEP 6: Takes the lines in again                         │ ─────────> │ STEP 7: Reads the old line now                           │ ─────────> │ STEP 8: Shows the lines in Kibana at last                │
│   - Arjun's 09:31 deploy changed the logger's ts format  │            │   - the agent does not check fields: it stays small and  │            │   - key acme:user always lands on partition P3           │            │   - the ts check fails -> reason bad_ts                  │            │   - Flink also counts DLQ lines per service              │     │      │   - reads logs-dlq, keeps service = user                 │            │   - same key acme:user -> same P3, new offsets           │            │   - parse, mask, drop repeats by logId                   │            │   - _id = logId: a second replay overwrites, never       │
│   - e.g. ts '12/11/2026 09:31:05' for User 2, c-102      │            │     fast                                                 │            │   - e.g. P3 offset 880112                                │            │   - writes the raw line + reason to logs-dlq             │            │   - Grafana alert: DLQ rate above 1% for 5 minutes       │     │      │   - re-sends the original raw line, same key             │            │   - e.g. P3 offset 912340                                │            │   - then the normal three sinks                          │            │     doubles                                              │
└──────────────────────────────────────────────────────────┘            │   - e.g. key acme:user                                   │            └──────────────────────────────────────────────────────────┘            │   - goes on with the next line, no crash                 │            │   - e.g. user-service: 1 in 5 lines go to the DLQ        │     │      │   - e.g. ≈20,000 lines from 09:31 to 09:52               │            └──────────────────────────────────────────────────────────┘            │   - e.g. ts -> 2026-11-12T09:31:05Z                      │            │   - e.g. User 2's c-102 'profile viewed'                 │
                                                                        └──────────────────────────────────────────────────────────┘                                                                                    │   - e.g. error bad_ts, from logs-raw P3 880112           │            └──────────────────────────────────────────────────────────┘     │      └──────────────────────────────────────────────────────────┘                                                                                    └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘
                                                                                                                                                                                                                        └──────────────────────────────────────────────────────────┘                                                                             │
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                ┌── STEP 5, 6 ─────────────────────────────────────────────┐     │
                                                                                                                                                                                                                                                                                                │ Arjun  (developer of user-service)                       │     │
                                                                                                                                                                                                                                                                                                ├──────────────────────────────────────────────────────────┤     │
                                                                                                                                                                                                                                                                                                │ STEP 5: Reads the reason and fixes the parser            │ ────┘
                                                                                                                                                                                                                                                                                                │   - reads a few DLQ messages: raw line + bad_ts          │
                                                                                                                                                                                                                                                                                                │   - adds dd/MM/yyyy HH:mm:ss to Flink's parser           │
                                                                                                                                                                                                                                                                                                │   - e.g. Flink restarts from a savepoint: no line lost   │
                                                                                                                                                                                                                                                                                                │                                                          │
                                                                                                                                                                                                                                                                                                │ STEP 6: Starts the replay job                            │
                                                                                                                                                                                                                                                                                                │   - from the first user-service DLQ offset of today      │
                                                                                                                                                                                                                                                                                                └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Kafka logs-dlq                                                              ▼ Kafka logs-raw (replayed)                                                   ▼ Elasticsearch
╔════════════════════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════╗
║ Kafka message (topic logs-dlq)                                         ║    ║ Kafka message (topic logs-raw, replayed)                               ║    ║ Elasticsearch document · _id = logId ║
╟────────────────────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────╢
║ {                                                                      ║    ║ {                                                                      ║    ║ {                                    ║
║   "topic": "logs-dlq",                                                 ║    ║   "topic": "logs-raw",                                                 ║    ║   "_index": "logs-2026.11.12",       ║
║   "key": "acme:user",                                                  ║    ║   "partition": 3,                                                      ║    ║   "_id": "01JCXB2M",                 ║
║   "headers": {                                                         ║    ║   "offset": 912340,                                                    ║    ║   "_source": {                       ║
║     "error": "bad_ts",                                                 ║    ║   "key": "acme:user",                                                  ║    ║     "tenantId": "acme",              ║
║     "source": "logs-raw/3/880112"                                      ║    ║   "headers": {                                                         ║    ║     "service": "user",               ║
║   },                                                                   ║    ║     "agent": "dlq-replay",                                             ║    ║     "level": "INFO",                 ║
║   "value": {                                                           ║    ║     "replay": "true"                                                   ║    ║     "ts": "2026-11-12T09:31:05Z",    ║
║     "raw": "{\"logId\":\"01JCXB2M\",\"tenantId\":\"acme\",\"service\": ║    ║   },                                                                   ║    ║     "correlationId": "c-102",        ║
║         \"user\",\"level\":\"INFO\",\"ts\":\"12/11/2026                ║    ║   "value": "{\"logId\":\"01JCXB2M\",\"tenantId\":\"acme\",\"service\": ║    ║     "msg": "profile viewed",         ║
║         09:31:05\",\"correlationId\":\"c-102\",\"msg\":\"profile       ║    ║       \"user\",\"level\":\"INFO\",\"ts\":\"12/11/2026                  ║    ║     "region": "ap-south-1"           ║
║         viewed\"}",                                                    ║    ║       09:31:05\",\"correlationId\":\"c-102\",\"msg\":\"profile         ║    ║   }                                  ║
║     "error": "bad_ts",                                                 ║    ║       viewed\"}"                                                       ║    ║ }                                    ║
║     "service": "user",                                                 ║    ║ }                                                                      ║    ╚══════════════════════════════════════╝
║     "failed_at": "2026-11-12T09:31:06Z"                                ║    ╚════════════════════════════════════════════════════════════════════════╝
║   }                                                                    ║
║ }                                                                      ║
╚════════════════════════════════════════════════════════════════════════╝
```

1. **user-service prints a line Flink can't read; Fluent Bit ships it anyway**
   - **a) The change**
     - Arjun deploys a new logger version at 09:31; it writes `ts` as `12/11/2026 09:31:05` instead of `2026-11-12T09:31:05Z`
     - User 2 views a profile (request `c-102`): `{"logId":"01JCXB2M","service":"user","ts":"12/11/2026 09:31:05","msg":"profile viewed"}`
   - **b) Fluent Bit** does not look inside the fields: it reads, batches and sends with key `acme:user`
   - **Data change:** a line appended on Node B; a produce request to `logs-raw`
   - **Why the agent doesn't check:** an agent on every machine must stay tiny. Checking in one place (Flink) is easier to change and to watch.

2. **Kafka stores it like any other line**
   - key `acme:user` → partition P3, offset 880112, 3 copies
   - **Data change:** `logs-raw` P3 offset 880112
   - **Why:** Kafka stores bytes and never reads them, so it stays fast.

3. **Flink can't read `ts`, so it parks the line in the DLQ**
   - **a) The check fails:** the reason is `bad_ts`
   - **b) Park it:** a DLQ (Dead Letter Queue, a box for letters that can't be delivered) message goes to topic `logs-dlq` with the raw line, the reason and where it came from (`logs-raw/3/880112`)
   - **c) Go on:** the next line is processed; the job does not crash
   - **Data change:** `logs-dlq` message `{raw: "...", error: bad_ts, service: user, failed_at: 09:31:06}`
   - **Why not drop it:** a dropped line vanishes silently; nobody would know User 2's lines are missing.
   - **Why not crash:** one bad line would stop the logs of every tenant.

4. **The DLQ keeps it; an alert tells Arjun**
   - **a) Keep:** `logs-dlq` is a normal Kafka topic with the same 7-day retention: found on Friday, fixed on Monday, still replayable
   - **b) Alert:** Flink also counts DLQ lines per service per minute; a Grafana rule fires when a service's DLQ rate is above 1% for 5 minutes
     - user-service jumps to 1 line in 5 right after the 09:31 deploy
   - **Data change:** `service_metrics` rows for user-service now have `dlq` at about a fifth of `total`
   - **Why alert on the rate:** a few bad lines are normal. A jump right after a deploy means a broken logger, and a rollback is often the quickest fix.

5. **Arjun fixes the parser**
   - **a) Look:** he reads a few `logs-dlq` messages; every one says `bad_ts` with the new format
   - **b) Fix:** Flink's parser learns the format `dd/MM/yyyy HH:mm:ss` (and the user-service logger goes back to the standard format in its next release)
   - **c) Restart safely:** Flink is stopped with a savepoint (a saved snapshot of its state and Kafka offsets) and started from it with the new parser, so no line is skipped
   - **Data change:** a new Flink job version runs from the savepoint
   - **Why fix before replay:** replaying into the old parser would just send every line back to the DLQ.

6. **The replay job puts the parked lines back into `logs-raw`**
   - **a) Read:** a small job reads `logs-dlq` from the first user-service message of today and keeps only `service = user`
   - **b) Re-send:** each original `raw` line goes to `logs-raw` with the same key `acme:user` (and the same logId inside) and header `replay: true`
   - **Data change:** ≈20,000 messages on `logs-raw` P3, from offset 912340
   - **Why the same key:** the lines land in P3 again, in order with acme's other user-service lines.

7. **Flink with the new parser reads them**
   - **a) Normal path:** `ts` becomes `2026-11-12T09:31:05Z`; masking, dropping repeats by logId, then the three stores
   - **b) A known gap:** the lines are too late for the 1-minute counts (those windows closed long ago), so the 09:31 to 09:52 user-service counts stay a little low; S3 gets them in a new file under `hour=09`
   - **Data change:** Flink's dedup state gets the replayed logIds
   - **Why logId matters here:** if Arjun runs the replay twice, the second copies are dropped (and would only overwrite in Elasticsearch anyway).

8. **Elasticsearch shows the lines at last**
   - document `01JCXB2M` lands in `logs-2026.11.12`; Kibana shows User 2's `c-102` "profile viewed" at its real time, 09:31:05
   - **Data change:** Elasticsearch documents added for the ≈20,000 replayed lines
   - **Why `_id = logId`:** a second replay overwrites the same documents, so the count never doubles.

**Say in the interview:** "Validation lives in Flink. Anything that fails goes to a DLQ topic with the raw payload and the reason, so the job never crashes and nothing is silently dropped. We alert on the DLQ rate per service, fix the parser, restart from a savepoint and replay the DLQ into the main topic; logId-based idempotency makes replays safe."

### Flow 3. Payment errors climb, and Grafana pages Meera (Kafka P5 → Flink 1-minute windows → TimescaleDB → Grafana alert rule → PagerDuty → Meera)

```text
┌── STEP 1 ────────────────────────────────────────────────┐            ┌── STEP 2, 3 ─────────────────────────────────────────────┐            ┌── STEP 3, 4 ─────────────────────────────────────────────┐            ┌── STEP 4, 5 ─────────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐
│ Kafka  (topic logs-raw, partition P5)                    │            │ Flink  (1-minute window per tenant + service)            │            │ TimescaleDB  (hypertable service_metrics)                │            │ Grafana  (dashboards + alert rules)                      │            │ Meera's phone  (on-call engineer)                        │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Holds every acme payment line in order           │ ─────────> │ STEP 2: Counts each minute by the line's own time        │ ─────────> │ STEP 3: Stores one small row per minute                  │ ─────────> │ STEP 4: Checks the rule every minute                     │ ─────────> │ STEP 5: Rings                                            │
│   - key acme:payment, so Users 1 and 3 sit side by side  │            │   - keyBy(tenant, service), 1-minute tumbling window     │            │   - upsert on (ts, tenant, service): a retry never adds  │            │   - SQL: errors / total per minute, last 5 minutes       │            │   - PagerDuty calls until she acknowledges               │
│   - e.g. 2000417 'charge ok', 2000418 'card declined'    │            │   - uses ts, not arrival time; waits 30 s for late lines │            │     a 2nd row                                            │            │   - e.g. all 5 minutes are above 5%                      │            │   - e.g. she opens Kibana from the link (Flow 4)         │
└──────────────────────────────────────────────────────────┘            │   - e.g. 09:30 window: 1200 lines, 78 of them ERROR      │            │   - e.g. 09:30 acme payment 1200 / 78 / 870              │            │                                                          │            └──────────────────────────────────────────────────────────┘
                                                                        │                                                          │            │                                                          │            │ STEP 5: Fires the alert at 09:35                         │
                                                                        │ STEP 3: Closes the window and writes one row             │            │ STEP 4: Answers Grafana's query                          │            │   - sends it to PagerDuty with links to the graph and to │
                                                                        │   - p99 worked out from the durationMs field of each     │            │   - reads 5 rows from today's chunk                      │            │     Kibana                                               │
                                                                        │     line                                                 │            │   - e.g. error rate 6.5%, 6.1%, 7.0%, 6.8%, 6.4%         │            │   - e.g. 'acme payment error rate > 5%'                  │
                                                                        │   - e.g. p99 870 ms                                      │            └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘
                                                                        └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ TimescaleDB                                                       ▼ Grafana                                                ▼ PagerDuty page
╔══════════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════╗
║ service_metrics (TimescaleDB) · UNIQUE ts + tenant + service ║    ║ Grafana alert rule                                ║    ║ alert sent to PagerDuty                               ║
╟──────────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────────╢
║ [                                                            ║    ║ rule 'acme payment error rate > 5%':              ║    ║ {                                                     ║
║   {                                                          ║    ║   every 1 min run:                                ║    ║   "alert": "acme payment error rate > 5%",            ║
║     "ts": "2026-11-12T09:30:00Z",                            ║    ║     SELECT ts, errors::float / total              ║    ║   "status": "firing",                                 ║
║     "tenant": "acme",                                        ║    ║     FROM service_metrics                          ║    ║   "started_at": "2026-11-12T09:35:00Z",               ║
║     "service": "payment",                                    ║    ║     WHERE tenant = 'acme' AND service = 'payment' ║    ║   "value": "6.4%",                                    ║
║     "total": 1200,                                           ║    ║       AND ts > now() - interval '5 minutes'       ║    ║   "links": {                                          ║
║     "errors": 78,                                            ║    ║   fire if every row > 0.05 for 5 min              ║    ║     "graph": "grafana/d/payments",                    ║
║     "p99_ms": 870,                                           ║    ║   send to PagerDuty: team payments-oncall         ║    ║     "logs": "kibana: service:payment AND level:ERROR" ║
║     "dlq": 0                                                 ║    ╚═══════════════════════════════════════════════════╝    ║   },                                                  ║
║   },                                                         ║                                                             ║   "on_call": "Meera"                                  ║
║   {                                                          ║                                                             ║ }                                                     ║
║     "ts": "2026-11-12T09:31:00Z",                            ║                                                             ╚═══════════════════════════════════════════════════════╝
║     "tenant": "acme",                                        ║
║     "service": "payment",                                    ║
║     "total": 1200,                                           ║
║     "errors": 73,                                            ║
║     "p99_ms": 870,                                           ║
║     "dlq": 0                                                 ║
║   },                                                         ║
║   {                                                          ║
║     "ts": "2026-11-12T09:32:00Z",                            ║
║     "tenant": "acme",                                        ║
║     "service": "payment",                                    ║
║     "total": 1200,                                           ║
║     "errors": 84,                                            ║
║     "p99_ms": 870,                                           ║
║     "dlq": 0                                                 ║
║   },                                                         ║
║   {                                                          ║
║     "ts": "2026-11-12T09:33:00Z",                            ║
║     "tenant": "acme",                                        ║
║     "service": "payment",                                    ║
║     "total": 1200,                                           ║
║     "errors": 82,                                            ║
║     "p99_ms": 870,                                           ║
║     "dlq": 0                                                 ║
║   },                                                         ║
║   {                                                          ║
║     "ts": "2026-11-12T09:34:00Z",                            ║
║     "tenant": "acme",                                        ║
║     "service": "payment",                                    ║
║     "total": 1200,                                           ║
║     "errors": 77,                                            ║
║     "p99_ms": 870,                                           ║
║     "dlq": 0                                                 ║
║   }                                                          ║
║ ]                                                            ║
╚══════════════════════════════════════════════════════════════╝
```

1. **Kafka holds acme's payment lines in order**
   - every payment line, success or failure, is in P5 (key `acme:payment`): User 1's "charge ok" at 2000417, User 3's "card declined" at 2000418
   - **Data change:** none (Flink only reads)
   - **Why:** same key → same partition → one Flink worker sees all of acme's payment lines and can count them alone.

2. **Flink counts each minute by the line's own time**
   - **a) Group:** `keyBy(tenant, service)` sends every acme payment line to the same counter
   - **b) Window:** 1-minute tumbling windows: 09:30:00 to 09:30:59, then 09:31, with no overlap
   - **c) Event time:** it uses `ts` from the line, not the time the line arrived; a watermark (Flink's "I have seen everything up to this time" marker) waits 30 seconds for late lines, so a 09:30:50 line that arrives at 09:31:10 still counts in 09:30
   - **Data change:** Flink window state for (acme, payment, 09:30): 1200 lines, 78 errors, the durations for p99
   - **Why event time:** after a slow-down or a replay, lines arrive late. Counting by arrival time would put them in the wrong minute and invent a spike.

3. **The window closes and one row goes to TimescaleDB**
   - **a) Close:** when the watermark passes 09:31 (≈09:31:30)
   - **b) p99:** worked out from each line's `durationMs`: 99 in 100 payments were faster than 870 ms
   - **c) TimescaleDB** is PostgreSQL plus automatic time chunks (a hypertable): one chunk per day, and old chunks are dropped whole
   - **Data change:** `service_metrics` row `{ts: 09:30, tenant: acme, service: payment, total: 1200, errors: 78, p99_ms: 870}`; then the rows for 09:31 to 09:34 the same way
   - **Why upsert on (ts, tenant, service):** after a Flink restart the same window may be written again. It replaces the row and never adds a second one.

4. **Grafana checks the rule every minute**
   - the rule's SQL gives the error rate of the last 5 minutes: 6.5%, 6.1%, 7.0%, 6.8%, 6.4%
   - "for 5 minutes" means every one of them is above 5%
   - **Data change:** the alert goes from pending to firing at 09:35
   - **Why 5 minutes:** one bad minute (a short bank hiccup) would wake Meera for nothing.

5. **Meera is paged**
   - **a) Send:** Grafana sends the alert to PagerDuty (a service that calls the on-call person's phone until they answer)
   - **b) Links:** the alert carries the payment graph and a Kibana search `service:payment AND level:ERROR`
   - **Data change:** a PagerDuty incident for team payments-oncall
   - **Why it's fast:** counts are made while the lines stream past, so the page goes out within ≈2 minutes of the 5th bad minute ending, and the link takes Meera straight to the right lines (Flow 4).

**Say in the interview:** "Flink pre-aggregates per tenant and service in 1-minute event-time windows with a 30-second watermark and upserts into a TimescaleDB hypertable. Grafana alerts on error rate above 5% for 5 minutes and pages through PagerDuty, with links into Kibana."

### Flow 4. Meera finds why User 3's payment failed, then answers an audit question (Kibana → Elasticsearch; Athena → S3 Parquet)

```text
┌── STEP 1, 3, 5 ──────────────────────────────────────────┐            ┌── STEP 1, 3 ─────────────────────────────────────────────┐            ┌── STEP 2, 4 ─────────────────────────────────────────────┐
│ Meera  (on-call engineer)                                │            │ Kibana  (search screen)                                  │            │ Elasticsearch  (daily indices, 7 days)                   │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Searches the failing service                     │ ────┬────> │ STEP 1, 3: Turns the query into a search request         │ ─────────> │ STEP 2: Searches only the matching days                  │
│   - Kibana, last 15 minutes                              │     │      │   - Kibana server -> POST logs-*/_search on port 9200    │            │   - today's index logs-2026.11.12, all shards at once    │
│   - e.g. tenantId:acme AND service:payment AND           │     │      │   - e.g. KQL becomes Query DSL, sorted by ts             │            │   - returns the hits + a count by msg                    │
│          level:ERROR                                     │     │      └──────────────────────────────────────────────────────────┘            │   - e.g. most errors say 'card declined'                 │
│                                                          │     │                                                                              │                                                          │
│ STEP 3: Follows one request end to end                   │     │                                                                              │ STEP 4: Returns the whole request path                   │
│   - clicks User 3's line, then searches its              │     │                                                                              │   - every line with c-103, sorted by ts                  │
│     correlationId                                        │     │                                                                              │   - e.g. order created -> user 3 verified -> card        │
│   - e.g. correlationId:"c-103"                           │     │                                                                              │          declined                                        │
│                                                          │     │                                                                              └──────────────────────────────────────────────────────────┘
│ STEP 5: Answers an audit question                        │     │
│   - older than 7 days, so not in Elasticsearch: Athena   │     │
│     SQL                                                  │     │
│   - e.g. acme payment errors in June 2026                │     │
└──────────────────────────────────────────────────────────┘     │
                                                                 │
                                                                 │
                                                                 │
                                                                 │      ┌── STEP 5 ────────────────────────────────────────────────┐            ┌── STEP 6 ────────────────────────────────────────────────┐
                                                                 │      │ Athena  (SQL on S3 files)                                │            │ S3  (Parquet files, 1 year)                              │
                                                                 │      ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
                                                                 └────> │ STEP 5: Runs the SQL with no server to manage            │ ─────────> │ STEP 6: Hands Athena only the files it needs             │
                                                                        │   - table logs from the Glue Data Catalog; path parts =  │            │   - path filter: tenant=acme, service=payment, June      │
                                                                        │     columns                                              │            │   - reads the level column only; skips blocks by min/max │
                                                                        │   - e.g. you pay per GB read                             │            │   - e.g. reads one month of one service, not a whole     │
                                                                        └──────────────────────────────────────────────────────────┘            │          year                                            │
                                                                                                                                                └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Kibana                                                      ▼ Elasticsearch                     ▼ Athena                                               ▼ S3
╔════════════════════════════════════════════════════════╗    ╔══════════════════════════════╗    ╔═════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════╗
║ search request                                         ║    ║ hits for c-103               ║    ║ Athena SQL                                      ║    ║ S3 object (Parquet, hourly)                                            ║
╟────────────────────────────────────────────────────────╢    ╟──────────────────────────────╢    ╟─────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────────╢
║ Kibana query (KQL): correlationId:"c-103"              ║    ║ [                            ║    ║ SELECT count(*) FROM logs                       ║    ║ {                                                                      ║
║ becomes POST logs-*/_search:                           ║    ║   {                          ║    ║ WHERE tenant = 'acme' AND service = 'payment'   ║    ║   "path": "s3://logs/tenant=acme/service=payment/dt=2026-06-           ║
║   { "query": { "term": { "correlationId": "c-103" } }, ║    ║     "ts": "09:30:00.050",    ║    ║   AND level = 'ERROR'                           ║    ║       15/hour=14/part-0001.parquet",                                   ║
║     "sort": [ { "ts": "asc" } ] }                      ║    ║     "service": "order",      ║    ║   AND dt BETWEEN '2026-06-01' AND '2026-06-30'; ║    ║   "format": "Parquet (stored by column, compressed)",                  ║
╚════════════════════════════════════════════════════════╝    ║     "level": "INFO",         ║    ║ -- reads only tenant=acme/service=payment/      ║    ║   "size": "≈400 MB",                                                   ║
                                                              ║     "msg": "order created"   ║    ║ --   dt=2026-06-01 .. dt=2026-06-30 folders     ║    ║   "columns": ["logId", "ts", "level", "correlationId", "msg", "..."],  ║
                                                              ║   },                         ║    ╚═════════════════════════════════════════════════╝    ║   "storage_class": "STANDARD"                                          ║
                                                              ║   {                          ║                                                           ║ }                                                                      ║
                                                              ║     "ts": "09:30:00.080",    ║                                                           ╚════════════════════════════════════════════════════════════════════════╝
                                                              ║     "service": "user",       ║
                                                              ║     "level": "INFO",         ║
                                                              ║     "msg": "user 3 verified" ║
                                                              ║   },                         ║
                                                              ║   {                          ║
                                                              ║     "ts": "09:30:00.120",    ║
                                                              ║     "service": "payment",    ║
                                                              ║     "level": "ERROR",        ║
                                                              ║     "msg": "card declined"   ║
                                                              ║   }                          ║
                                                              ║ ]                            ║
                                                              ╚══════════════════════════════╝
```

1. **Meera searches the failing service**
   - she opens Kibana (the web screen for Elasticsearch) from the alert link
   - the query is `tenantId:acme AND service:payment AND level:ERROR`, last 15 minutes
   - **Data change:** none (search only reads)
   - **Why the tenant filter:** Kibana spaces add the tenant filter by role, so each team only ever sees its own tenant's lines.

2. **Elasticsearch searches only the days that match**
   - **a) Translate:** the Kibana server turns KQL (Kibana Query Language) into Elasticsearch Query DSL and calls `POST logs-*/_search` on port 9200
   - **b) Narrow:** the time filter leaves only today's index `logs-2026.11.12`; each of its shards searches its part at the same time, then the results are merged
   - **c) Answer:** the newest hits plus a count per `msg`: most errors say "card declined"
   - **Data change:** none
   - **Why it is fast:** Elasticsearch keeps an inverted index (word → list of lines), like the index at the back of a book.

3. **Meera follows one request**
   - she clicks User 3's line, copies `correlationId: c-103` and searches `correlationId:"c-103"`
   - **Data change:** none
   - **Why:** the error line says what failed; the whole path says why.

4. **Elasticsearch returns the whole path**
   - 7 lines from 3 services, sorted by `ts`: order created → user 3 verified → card declined
   - **Data change:** none
   - **Why it works:** `c-103` was made once at the gateway and passed in `X-Correlation-Id` on every call (Flow 1).

5. **A week later, an audit question goes to Athena**
   - **a) The question:** "How many acme payment errors in June?" June left Elasticsearch long ago (7 days only)
   - **b) Athena** runs SQL straight on the S3 files with no server to manage; the table `logs` lives in the Glue Data Catalog, with `tenant`, `service`, `dt` and `hour` taken from the folder names
   - **c) The SQL:**

            SELECT count(*) FROM logs
            WHERE tenant = 'acme' AND service = 'payment'
              AND level = 'ERROR'
              AND dt BETWEEN '2026-06-01' AND '2026-06-30';

   - **Data change:** Athena saves the answer as a small CSV file in its results bucket
   - **Why not keep a year in Elasticsearch:** ≈1 TB a day on fast, indexed disks would cost many times more than Parquet in S3, and audits are rare and can wait a few seconds.

6. **S3 hands Athena only the files it needs**
   - **a) Folders:** only `tenant=acme/service=payment/dt=2026-06-01` to `dt=2026-06-30` are listed (partition pruning)
   - **b) Columns:** Parquet stores data by column, so only `level` is read, not `msg` or the rest
   - **c) Blocks:** each block (row group) keeps the min and max of every column; blocks with no ERROR are skipped
   - **d) Older than a year:** those files are in Glacier and must be restored first (minutes to hours), so that is only for audits
   - **Data change:** none
   - **Why:** Athena charges per GB read. Good folders plus Parquet make the same question far cheaper and faster.

**Say in the interview:** "Recent logs are searched in Kibana on daily Elasticsearch indices; the correlationId from the gateway turns one error into the full request path. Anything older than 7 days is queried with Athena on hourly Parquet in S3, partitioned by tenant, service, date and hour, so a query reads only the folders and columns it needs."

### Flow 5. A Kafka broker dies, and later Elasticsearch is down for 6 hours: nothing is lost (Fluent Bit → Broker 3 → KRaft controller → Broker 1 → Flink checkpoint → Elasticsearch catch-up)

```text
┌── STEP 1, 3 ─────────────────────────────────────────────┐            ┌── STEP 1 ────────────────────────────────────────────────┐            ┌── STEP 2 ────────────────────────────────────────────────┐            ┌── STEP 2, 3, 4 ──────────────────────────────────────────┐            ┌── STEP 4, 5, 6 ──────────────────────────────────────────┐            ┌── STEP 5, 7 ─────────────────────────────────────────────┐
│ Fluent Bit  (Node C, the Kafka producer)                 │            │ Kafka Broker 3  (old leader of P5)                       │            │ KRaft controller  (Kafka's own brain)                    │            │ Kafka Broker 1  (new leader of P5)                       │            │ Flink  (consumer group flink-log-processor)              │            │ Elasticsearch  (cluster down 6 hours)                    │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Sends a batch to P5's leader, Broker 3           │ ────┬────> │ STEP 1: Dies before it can answer                        │ ─────────> │ STEP 2: Picks a new leader for P5                        │ ────┬────> │ STEP 2: Takes over P5                                    │ ─────────> │ STEP 4: Reads on from its own checkpoint                 │ ─────────> │ STEP 5: Down after a bad upgrade                         │
│   - acks=all: waits for the copies before 'OK'           │     │      │   - power loss in the middle of the request              │            │   - Broker 3 misses its heartbeats -> fenced off         │     │      │   - holds every acked line: acks=all +                   │            │   - offsets live in Flink's checkpoint, not in the       │            │   - cluster red, writes refused                          │
│   - e.g. producer id 77, sequence 512: the next payment  │     │      │   - e.g. last offset written 2000419                     │            │   - the new leader comes only from the in-sync list      │     │      │     min.insync.replicas=2                                │            │     broker                                               │            │   - e.g. 13 Nov 01:00 to 07:00                           │
│          lines                                           │     │      └──────────────────────────────────────────────────────────┘            │     (ISR)                                                │     │      │   - e.g. high watermark 2000418                          │            │   - e.g. P5 from 2000300                                 │            │                                                          │
│                                                          │     │                                                                              │   - e.g. ISR {B3, B1, B2} -> leader B1, epoch + 1        │     │      │                                                          │            │                                                          │            │ STEP 7: Takes the backlog without duplicates             │
│ STEP 3: Gets no answer, so sends again                   │     │                                                                              └──────────────────────────────────────────────────────────┘     │      │ STEP 3: Writes the retried batch once                    │            │ STEP 5: Can't write while Elasticsearch is down          │            │   - _id = logId: a line sent twice overwrites itself     │
│   - the batch stays in memory + disk buffer until acked  │     │                                                                                                                                               │      │   - producer id 77, sequence 512 already there? just ack │            │   - the ES sink retries with back-off                    │            │   - e.g. the document count is right after the catch-up  │
│   - asks for fresh metadata: P5's leader is now Broker 1 │     │                                                                                                                                               │      │     again                                                │            │   - checkpoints wait, so offsets stay put                │            └──────────────────────────────────────────────────────────┘
│   - e.g. same producer id 77, sequence 512               │     │                                                                                                                                               │      │   - e.g. offset 2000419 stays the only copy              │            │   - Kafka lag grows; Kafka keeps 7 days                  │
└──────────────────────────────────────────────────────────┘     │                                                                                                                                               │      │                                                          │            │   - e.g. 13 Nov 01:00 to 07:00                           │
                                                                 │                                                                                                                                               │      │ STEP 4: Serves Flink from the same offsets               │            │                                                          │
                                                                 │                                                                                                                                               │      │   - Flink reconnects and reads on                        │            │ STEP 6: Catches up when it is back                       │
                                                                 │                                                                                                                                               │      └──────────────────────────────────────────────────────────┘            │   - restarts from the last good checkpoint and reads     │
                                                                 │                                                                                                                                               │                                                                              │     again                                                │
                                                                 │                                                                                                                                               │                                                                              │   - e.g. P5 from the 01:00 offset                        │
                                                                 │                                                                                                                                               │                                                                              └──────────────────────────────────────────────────────────┘
                                                                 │                                                                                                                                               │
                                                                 │                                                                                                                                               │
                                                                 │                                                                                                                                               │
                                                                 │                                                                                                                                               │
                                                                 │                                                                                                                                               │
                                                                 │                                                                                                                                               │
                                                                 └───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Kafka P5                                                  ▼ Fluent Bit                    ▼ Flink                                                                       ▼ Elasticsearch
╔══════════════════════════════════════════════════════╗    ╔══════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════╗
║ partition P5 (KRaft metadata)                        ║    ║ producer batch           ║    ║ Flink checkpoint                                                       ║    ║ Elasticsearch document · _id = logId  ║
╟──────────────────────────────────────────────────────╢    ╟──────────────────────────╢    ╟────────────────────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────╢
║ P5 before: leader B3, ISR {B3, B1, B2}               ║    ║ {                        ║    ║ {                                                                      ║    ║ {                                     ║
║   B3 last offset 2000419 (not on B2 yet)             ║    ║   "producer_id": 77,     ║    ║   "checkpoint_id": 4411,                                               ║    ║   "_index": "logs-2026.11.12",        ║
║   high watermark 2000418                             ║    ║   "sequence": 512,       ║    ║   "taken_at": "2026-11-13T00:59:30Z",                                  ║    ║   "_id": "01JCXA7Q",                  ║
║ P5 after:  leader B1, ISR {B1, B2}, epoch + 1        ║    ║   "topic": "logs-raw",   ║    ║   "offsets": {                                                         ║    ║   "_source": {                        ║
║   2000419 was never 'OK'ed, so Fluent Bit resends it ║    ║   "partition": 5,        ║    ║     "logs-raw/5": 2000300                                              ║    ║     "tenantId": "acme",               ║
╚══════════════════════════════════════════════════════╝    ║   "records": 400,        ║    ║   },                                                                   ║    ║     "service": "payment",             ║
                                                            ║   "compression": "gzip", ║    ║   "state": ["dedup logIds (10 min TTL)", "open 1-minute windows",      ║    ║     "level": "ERROR",                 ║
                                                            ║   "first_record": {      ║    ║       "half-written Parquet files"]                                    ║    ║     "ts": "2026-11-12T09:30:00.120Z", ║
                                                            ║     "logId": "01JCXA7R", ║    ║ }                                                                      ║    ║     "correlationId": "c-103",         ║
                                                            ║     "offset": 2000419,   ║    ╚════════════════════════════════════════════════════════════════════════╝    ║     "userId": "user-3",               ║
                                                            ║     "msg": "charge ok"   ║                                                                                  ║     "durationMs": 412,                ║
                                                            ║   }                      ║                                                                                  ║     "msg": "card declined",           ║
                                                            ║ }                        ║                                                                                  ║     "card": "****1111",               ║
                                                            ╚══════════════════════════╝                                                                                  ║     "pod": "payment-7d9f",            ║
                                                                                                                                                                          ║     "region": "ap-south-1"            ║
                                                                                                                                                                          ║   }                                   ║
                                                                                                                                                                          ║ }                                     ║
                                                                                                                                                                          ╚═══════════════════════════════════════╝
```

1. **Fluent Bit sends a batch to Broker 3, which dies**
   - **a) Send:** Fluent Bit on Node C sends the next payment batch to P5's leader, Broker 3, tagged producer id 77, sequence 512 (the idempotent producer numbers every batch)
   - **b) Crash:** Broker 3 appends it as offset 2000419, Broker 1 copies it, Broker 2 has not yet; then the power goes, before the OK
   - **Data change:** P5 offset 2000419 on Brokers 3 and 1, never confirmed
   - **Why `acks=all`:** with `acks=1` Broker 3 would have said OK right after writing, and the lines would have died with it.

2. **The KRaft controller picks a new leader for P5**
   - **a) Who decides:** KRaft is Kafka's built-in controller group (it replaced ZooKeeper); it stores which broker leads each partition
   - **b) Detect:** Broker 3 misses its heartbeats and is fenced off
   - **c) Choose:** the new leader comes only from the ISR (in-sync replicas: the copies that are caught up); unclean leader election is off
   - **Data change:** KRaft metadata for P5: leader Broker 1, ISR {B1, B2}, leader epoch + 1
   - **Why only from the ISR:** a copy that is behind would be missing confirmed lines. Better a few seconds of "unavailable" than silently losing logs.

3. **Fluent Bit sends again; Broker 1 keeps one copy**
   - **a) Retry:** no OK came, so the batch is still in the disk buffer; Fluent Bit asks for fresh metadata and sends it to Broker 1
   - **b) No double:** Broker 1 already has producer 77, sequence 512 (it copied it from Broker 3), so it doesn't write it again; it just says OK
   - **c) Still safe:** the ISR is now {B1, B2}: 2 copies, which meets `min.insync.replicas=2`; if Broker 2 also died, writes would get `NotEnoughReplicas` and Fluent Bit would keep buffering on disk
   - **Data change:** nothing new on P5 (2000419 is there once); the high watermark moves to 2000419 when Broker 2 copies it
   - **Why:** retries are how we survive failures; sequence numbers make a retry harmless.

4. **Flink reads on**
   - Flink's Kafka reader learns the new leader and goes on from its own offsets
   - it could only ever read up to the high watermark (the last offset that every in-sync copy has), so it never saw a line that could vanish
   - **Data change:** none
   - **Why offsets live in Flink's checkpoint:** Flink restores its state and its offsets together, so counts and stores agree after a crash.

5. **The next night, Elasticsearch is down for 6 hours**
   - **a) Outage:** a bad upgrade at 01:00 on 13 Nov; writes are refused until 07:00
   - **b) Flink waits:** the Elasticsearch sink retries with back-off; checkpoints can't finish because the sink can't flush, so the saved offsets stay at ≈01:00
   - **c) Back pressure:** the whole job slows down, so TimescaleDB and S3 wait too; Kafka keeps the lines (7 days)
   - **Data change:** consumer lag for `flink-log-processor` grows to ≈6 hours; services and Fluent Bit see no change
   - **Why services don't notice:** they only print to stdout, and Kafka sits between them and every store.
   - **Bigger setups:** run the Elasticsearch writer as its own consumer group, so TimescaleDB and S3 keep going during an Elasticsearch outage.

6. **Elasticsearch is back; Flink catches up**
   - **a) Catch up:** Flink restarts from the last good checkpoint (offsets of ≈01:00) and reads the 6 hours again at full speed
   - **b) If Elasticsearch lost data instead** (restored from an old snapshot): a one-off job starts from a time; Kafka's `.timeindex` file turns "01:00" into an offset
   - **Data change:** Flink checkpoint offsets move forward again
   - **Why rewinding is safe:** see the next step.

7. **Elasticsearch takes the backlog without duplicates**
   - lines that were already sent before the outage are sent again; `_id = logId` makes them overwrite themselves
   - **Data change:** documents for 01:00 to 07:00 added; the count equals the number of lines, no doubles
   - **Why:** at-least-once delivery plus idempotent writes gives the same result as exactly-once.

**Say in the interview:** "Kafka runs with RF=3, acks=all, min.insync.replicas=2 and unclean leader election off, so a broker loss only moves leadership inside the ISR; the idempotent producer turns retries into no-ops. Flink keeps offsets in its checkpoints, so when Elasticsearch is down it simply lags and later replays from Kafka, and `_id = logId` keeps the re-index free of duplicates."

## Key design choices

| Area | Choice | Why vs alternative |
|---|---|---|
| Getting logs out of services | JSON to stdout; a Fluent Bit DaemonSet (one agent per machine) ships it | Services writing to Kafka themselves tie every service to Kafka (libraries, retries, outages slowing the app); a sidecar per pod means thousands of agents. |
| Request tracing | correlationId made at the API Gateway, passed in `X-Correlation-Id` on every hop, plus tenantId | Each service making its own id can't be joined; without tenantId there are no per-tenant quotas or search filters. |
| Buffer between agents and stores | Kafka, key `tenantId:service`, 3 copies, 7 days | Agents writing straight to Elasticsearch drop lines on a spike or an outage and give no replay; a key like `service#timestamp` scatters one service's lines and loses their order. |
| No line lost | Disk buffer + `acks=all` + `min.insync.replicas=2` + unclean leader election off | `acks=1` loses a confirmed line when the leader dies before copying it. |
| No duplicates | Idempotent producer + Flink dedup by logId + Elasticsearch `_id = logId` | End-to-end exactly-once transactions are slow and complex; at-least-once plus idempotent writes gives the same result. |
| Processing | One Flink job: check, mask, enrich, dedup, then three sinks | Cleaning in each store repeats the work, and PII could reach a store before it is masked. |
| Bad lines | DLQ topic `logs-dlq` + alert on DLQ rate + replay job | Dropping loses data silently; crashing stops the logs of every tenant for one bad line. |
| Search | Elasticsearch, daily indices, ILM (Index Lifecycle Management) hot → warm → delete at 7 days, 30-50 GB shards | One big index needs slow delete-by-query; a year on search servers costs far more than files. |
| Metrics + alerts | Flink 1-minute event-time counts → TimescaleDB → Grafana | Counting raw lines in Elasticsearch every minute scans millions of documents per alert rule. |
| Archive | Hourly Parquet in S3 by tenant/service/date/hour, Athena, Glacier after a year | JSON files are ≈10 times bigger and every query reads whole rows; daily files are slow to appear and big to scan. |
| Privacy | PII masked in Flink before any store; TLS everywhere | Hiding it only on the Kibana screen still leaves it on disks, in backups and in S3. |
| Fair use | Rate limit per tenant at the gateway, quota per tenant in Fluent Bit | One noisy tenant would fill Kafka and Elasticsearch for everyone. |

## Deep Dive (with Kafka internals)

Only what the flows above did not cover in depth, with the same story: tenant acme, User 1 (order, `c-101`, success), User 2 (profile view, `c-102`, success), User 3 (order, `c-103`, card declined).

---

### 1. Clients → API Gateway

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

- **What happens per request**
  - The gateway authenticates the user, then attaches `correlationId` and `tenantId`
    - e.g. User 3 → `POST /orders` → gateway adds `X-Correlation-Id: c-103`, `X-Tenant-Id: acme`
  - The correlationId is returned in the response for support
    - e.g. User 3 sees "Payment failed, ref c-103"

</td><td valign="top" width="50%" markdown="1">

- **Per-tenant rate limiting (token bucket)**
  - Each tenant has a bucket; a request takes one token, and tokens refill at a fixed rate
    - e.g. acme: 1000 tokens/s, so Users 1, 2 and 3 together share 1000 rps
  - When the bucket is empty, the gateway rejects early, so no log flood reaches the backend
    - e.g. a bot from acme sends 5000 rps → 4000 get HTTP 429, and the order service stays healthy

</td></tr></table>

---

### 2. Microservices: order / user / payment

- **Structured JSON on stdout**
  - Every service uses the same field contract
    - e.g. payment-service for User 3: `{"logId":"01JCXA7Q","tenantId":"acme","service":"payment","level":"ERROR","ts":"2026-11-12T09:30:00.120Z","correlationId":"c-103","msg":"card declined"}`
  - Fixed fields mean no guessing from free text
    - e.g. Kibana filters on `level` and `service` directly
- **A unique logId on every line**
  - A ULID (unique and sorted by time), made once when the line is printed
    - e.g. `01JCXA7Q`
  - A line sent twice keeps the same logId, which is what makes dedup and `_id = logId` work
    - e.g. a Fluent Bit retry never creates a new id
- **No log files inside the container**
  - Kubernetes writes stdout to a file on the node
    - e.g. `/var/log/containers/payment-7d9f_prod_payment-abc.log`
- **Correlation ID propagation**
  - A shared HTTP client middleware copies `X-Correlation-Id` into every outgoing call
    - e.g. order → user (verify User 3) → payment (charge card) all carry c-103
  - So one correlationId gives logs from all three services
    - e.g. Kibana `correlationId:"c-103"` → 3 services, 7 log lines, in time order

---

### 3. Fluent Bit (DaemonSet)

```text
 Node A                         Node B                         Node C
┌──────────────────────┐       ┌──────────────────────┐       ┌──────────────────────┐
│ order-service pod    │       │ user-service pod     │       │ payment-service pod  │
│   └─ stdout → file   │       │   └─ stdout → file   │       │   └─ stdout → file   │
│ Fluent Bit           │       │ Fluent Bit           │       │ Fluent Bit           │
│ tail → filter → out  │       │ tail → filter → out  │       │ tail → filter → out  │
└──────────┬───────────┘       └──────────┬───────────┘       └──────────┬───────────┘
           └──────────────────────────────┼──────────────────────────────┘
                                          v
                                   Kafka  logs-raw
```

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

- **Pipeline inside the agent**
  - `tail` input → `kubernetes` filter (adds pod and namespace) → filter that builds the key → `kafka` output
    - e.g. a small Lua filter sets `kafka_key = tenantId .. ":" .. service` → `acme:payment`
  - Filesystem buffering survives Kafka outages
    - e.g. `storage.path /var/log/flb-storage/`, input `storage.type filesystem`, output `storage.total_limit_size 5G`
- **Kafka output settings (Fluent Bit uses librdkafka)**
  - Key and reliability
    - e.g. `message_key_field kafka_key`, `rdkafka.request.required.acks -1` (= all), `rdkafka.enable.idempotence true`
  - Throughput
    - e.g. `rdkafka.compression.codec gzip`, `rdkafka.linger.ms 50`, `rdkafka.batch.size 1000000`

</td><td valign="top" width="50%" markdown="1">

- **Why a DaemonSet, not a sidecar**
  - One agent per machine reads every container's log file on that machine
    - e.g. 50 nodes = 50 agents, not 2,000 sidecars (one per pod)
  - A sidecar would add memory and CPU to every pod and one more thing to update in every deploy
- **Gotcha: the partitioner**
  - librdkafka's default partitioner is `consistent_random` (CRC32). The Java client uses murmur2
    - e.g. the same key `acme:payment` can land on a **different partition** from Java producers
  - Fix: use the same hashing everywhere
    - e.g. `rdkafka.partitioner murmur2_random`
- **Sampling and quota**
  - Drop most DEBUG logs at the edge
    - e.g. user-service DEBUG "cache hit" → keep 10%
  - Cap per-tenant volume
    - e.g. acme over 5 GB/day → drop INFO, but payment ERROR for User 3 is always kept

</td></tr></table>

---

### 4. Kafka internals (core deep dive)

#### 4.1 Cluster layout

```text
                 ┌────────────────────────── KRaft controller quorum ──────────────────────────┐
                 │  stores metadata: topics, partitions, leaders, ISR (no ZooKeeper in 4.x)    │
                 └─────────────────────────────────────────────────────────────────────────────┘
   Broker 1                          Broker 2                          Broker 3
┌───────────────────────┐         ┌───────────────────────┐         ┌───────────────────────┐
│ P0 (L)  P1 (F)  P2 (F)│         │ P0 (F)  P1 (L)  P2 (F)│         │ P0 (F)  P1 (F)  P2 (L)│
│ P3 (L)  P4 (F)  P5 (F)│         │ P3 (F)  P4 (L)  P5 (F)│         │ P3 (F)  P4 (F)  P5 (L)│
└───────────────────────┘         └───────────────────────┘         └───────────────────────┘
 Topic logs-raw: 6 partitions, RF=3   (L = leader, F = follower)
```

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

- **Topic → partitions → replicas**
  - A topic is split into partitions; each partition is an ordered, append-only log
    - e.g. `logs-raw` has P0..P5
  - Each partition has 3 copies (RF=3) on different brokers; one is the leader
    - e.g. P5 leader on Broker 3, followers on Brokers 1 and 2

</td><td valign="top" width="50%" markdown="1">

- **Leaders are spread across brokers**
  - Producers and consumers talk **only to the leader** of a partition
    - e.g. all writes for P5 go to Broker 3
  - Spreading leaders spreads the load
    - e.g. each broker leads 2 of the 6 partitions

</td></tr></table>

#### 4.2 Producer path: from log line to partition

```text
log record ──> serialize ──> partitioner ──────────────> per-partition batch ──> compress ──> leader broker
               (JSON bytes)   hash(key) % 6               (batch.size / linger.ms)  (gzip)      (ProduceRequest)
```

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

- **Partitioner picks the partition from the key**
  - `partition = hash(key) % numPartitions`
    - e.g. `acme:order → P1`, `acme:user → P3`, `acme:payment → P5` (illustrative hash results)
  - Same key → always the same partition → logs stay **in order**
    - e.g. payment logs for Users 1 and 3 are in P5 in the exact order they were produced

</td><td valign="top" width="50%" markdown="1">

- **Batching**
  - The producer collects records per partition until `batch.size` is full or `linger.ms` expires
    - e.g. 400 payment logs in 50 ms → 1 batch to P5 instead of 400 requests
  - Compression is applied per batch (better ratio than per record)
    - e.g. a 1 MB batch of similar JSON → ≈150 KB gzip

</td></tr></table>

Ordering is **per partition only**, not across the topic. order-service (P1) and payment-service (P5) lines aren't in one global order. Use `ts` + correlationId to rebuild the request.

#### 4.3 Inside one partition: offsets and segments

```text
Partition P5 (acme:payment) on Broker 3 disk:   /kafka-logs/logs-raw-5/

  00000000000000000000.log   offsets 0 .. 999,999        (closed segment)
  00000000000001000000.log   offsets 1,000,000 .. 1,999,999  (closed)
  00000000000002000000.log   offsets 2,000,000 .. now   ← active segment (appends here)
  + .index (offset → file position)   + .timeindex (timestamp → offset)

  ... | 2000417: User 1 "charge ok" | 2000418: User 3 "card declined" | 2000419: ... ← append
```

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

- **Offset = position in the partition**
  - Each record gets the next offset; it never changes
    - e.g. User 3's "card declined" = P5 offset 2000418
  - Consumers track "what I've read" as an offset per partition
    - e.g. Flink has read P5 up to 2000418

</td><td valign="top" width="50%" markdown="1">

- **Segments and indexes**
  - The log is split into segment files (default ≈1 GB); only the active one is written
    - e.g. new payment logs append to `...2000000.log`
  - `.index` and `.timeindex` give fast lookups
    - e.g. "replay from 09:00" → timeindex → offset 1,950,200 → seek directly
- **Retention = delete whole old segments**
  - `retention.ms = 604800000` (7 days); a closed segment is deleted when its newest record is older than that
    - e.g. Monday's segment is removed next Monday, which is cheap (a file delete, not a row delete)
  - Reads are fast because of sequential I/O + page cache + zero-copy (`sendfile`)
    - e.g. Flink reading P5 mostly hits the OS page cache, not the disk

</td></tr></table>

#### 4.4 Replication, ISR and the high watermark

```text
P5 replicas            LEO (last written)       Leader view
Broker 3 (Leader)      2000419                  ISR = {B3, B1, B2}
Broker 1 (Follower)    2000419                  HW  = min LEO of ISR = 2000418
Broker 2 (Follower)    2000418    ← 1 behind
                                                 Consumers can read only up to HW
```

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

- **Followers pull from the leader**
  - Followers send fetch requests to the leader and copy the records
    - e.g. B1 and B2 continuously fetch P5 from B3
  - **ISR** (in-sync replicas) = replicas that are caught up within `replica.lag.time.max.ms` (default 30 s)
    - e.g. if B2 stalls for 40 s → removed from the ISR → ISR = {B3, B1}

</td><td valign="top" width="50%" markdown="1">

- **High watermark (HW)**
  - The HW is the highest offset copied to **all** ISR replicas; only records below it are visible to consumers
    - e.g. offset 2000419 isn't yet on B2 → Flink can't read it yet
  - This prevents consumers from seeing data that could vanish if the leader dies
    - e.g. B3 crashes before replicating 2000419 → nobody ever saw it, so nothing is inconsistent

</td></tr></table>

#### 4.5 acks=all + min.insync.replicas=2

| Situation (P5, RF=3, min.insync=2) | ISR size | Producer result |
|---|---|---|
| All brokers healthy | 3 | ✅ ack after B3, B1, B2 have it |
| B2 down | 2 | ✅ ack after B3 and B1 have it |
| B1 and B2 down | 1 | ❌ `NotEnoughReplicas` → Fluent Bit retries / buffers to disk |

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

- **acks options**
  - `acks=0` fire-and-forget, `acks=1` leader only, `acks=all` all ISR replicas
    - e.g. with `acks=1`: B3 acks User 3's error, then dies before replicating → **log lost**
  - `acks=all` + `min.insync.replicas=2` → every acked record is on at least 2 brokers
    - e.g. B3 dies after ack → B1 still has User 3's error → no loss

</td><td valign="top" width="50%" markdown="1">

- **Unclean leader election = off**
  - Only an ISR replica can become leader
    - e.g. a lagging replica missing offsets 2000400+ can't be leader
  - Trade-off: availability vs. losing data
    - e.g. if no ISR replica is alive, P5 is unavailable rather than silently losing logs

</td></tr></table>

#### 4.6 Idempotent producer (no duplicates from retries)

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

- **The problem**
  - The producer sends a batch, the leader writes it, but the ack is lost on the network
    - e.g. Fluent Bit on Node C retries the batch with User 3's error
  - Without protection, the log is written twice
    - e.g. P5 offsets 2000418 and 2000420 hold the same log

</td><td valign="top" width="50%" markdown="1">

- **The fix: Producer ID + sequence number**
  - Each producer gets a PID; each batch per partition gets an increasing sequence number
    - e.g. PID 77, seq 512 → the broker has already seen it → drops the duplicate, acks again
  - Enabled with `enable.idempotence=true` (default in the modern Java client)
    - e.g. it covers retries within one producer session; it does **not** dedupe across restarts → that's why Flink also dedups by logId

</td></tr></table>

#### 4.7 Consumer groups and offsets (Flink side)

```text
Consumer group: flink-log-processor           Partitions assigned
┌─────────────────────────┐
│ Flink source subtask 0  │ ◄── P0, P1  (acme:order ...)
│ Flink source subtask 1  │ ◄── P2, P3  (acme:user ...)
│ Flink source subtask 2  │ ◄── P4, P5  (acme:payment ...)
└─────────────────────────┘
```

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

- **One partition → one consumer in a group**
  - Partitions are split across the group's members; that's how consumption scales
    - e.g. 6 partitions, 3 subtasks → 2 partitions each
  - More consumers than partitions → the extra ones sit idle
    - e.g. 8 subtasks for 6 partitions → 2 idle; **partition count = max parallelism**
- **Offsets and replay**
  - Plain consumers commit offsets to the internal topic `__consumer_offsets`
    - e.g. group `flink-log-processor`, P5 → 2000418
  - Flink stores offsets **in its checkpoint** (committing back to Kafka is only for monitoring)
    - e.g. after a crash, Flink restores P5 = 2000300 from the checkpoint and re-reads 118 records

</td><td valign="top" width="50%" markdown="1">

- **Multiple independent consumers**
  - Each consumer group reads the full topic with its own offsets
    - e.g. `flink-log-processor` and an `audit-archiver` both read P5 without affecting each other
- **Rebalance**
  - Group membership changes → partitions are reassigned
    - e.g. subtask 2 dies → P4, P5 move to the others (Flink handles this through its own restart)
  - Lag = latest offset − committed offset
    - e.g. P5 lag 50,000 → payment logs reach Kibana minutes late → alert

</td></tr></table>

#### 4.8 Failure scenarios (walk through these in the interview)

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

- **Broker 3 (leader of P5) crashes**
  - The controller picks a new leader from the ISR
    - e.g. B1 becomes P5 leader in seconds
  - Producers and consumers refresh metadata and continue
    - e.g. Fluent Bit on Node C retries → writes to B1, with no loss (acks=all)

</td><td valign="top" width="50%" markdown="1">

- **Elasticsearch is down for 6 hours**
  - Kafka still holds 7 days of data
    - e.g. all payment logs for Users 1–3 are still in P5
  - Rewind and replay
    - e.g. restart the ES sink from a savepoint / offset by time (09:00) → re-index; `_id=logId` → no duplicates
- **Hot partition**
  - One key gets far more traffic than the others
    - e.g. a sale → `acme:payment` gets 50x traffic → P5 overloaded, P1/P3 idle
  - Fix: salt the key
    - e.g. `acme:payment:0..3` spreads over 4 partitions; you keep order per salt bucket, not for all payment logs

</td></tr></table>

#### 4.9 Sizing quick math

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

- **Partitions**
  - Need ≥ (target throughput / per-partition throughput)
    - e.g. 300 MB/s ÷ ≈10 MB/s per partition ≈ 30 partitions → choose 48 for headroom
  - Hard to reduce later; adding partitions changes key → partition mapping
    - e.g. going 6 → 12 moves `acme:payment` to a new partition (ordering breaks at that moment)

</td><td valign="top" width="50%" markdown="1">

- **Storage**
  - Daily volume × retention × RF
    - e.g. 1 TB/day × 7 days × 3 = 21 TB raw (≈ 4–5 TB with gzip)
  - Keep disk < ≈70% full
    - e.g. 21 TB → provision ≈30 TB

</td></tr></table>

---

### 5. Flink (stream processing)

```text
KafkaSource ─> parse/validate ─┬─> (invalid) ────────────────────────────> DLQ topic
                               └─> mask PII ─> enrich ─> keyBy(logId) dedup ─┬─> ES sink
                                                                             ├─> keyBy(service) 1-min window ─> TimescaleDB
                                                                             └─> hourly Parquet ─> S3
```

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

- **Parse, validate, mask**
  - Each record is checked against the schema
    - e.g. user-service sends `"ts": "yesterday"` → DLQ with reason `bad_ts`
  - PII is masked before anything is stored
    - e.g. User 3's `card=4111111111111111` → `card=****1111`
- **Dedup with keyed state**
  - `keyBy(logId)` → each logId has its own small state entry with a TTL
    - e.g. `01JCXA7Q` seen at 09:30:00 → a second copy at 09:30:02 is dropped
  - The TTL keeps state bounded
    - e.g. 10 min TTL → only the last 10 min of logIds in RocksDB

</td><td valign="top" width="50%" markdown="1">

- **Event time and windows**
  - Watermarks handle late logs (event time = `ts`, not arrival time)
    - e.g. bounded out-of-orderness 30 s → a payment log for 09:30:50 that arrives at 09:31:10 still counts in the 09:30 window
  - Tumbling 1-min window per service
    - e.g. `payment 09:30 → total=1200, errors=78 (User 3 included), p99=870ms`
- **Checkpoints = consistency**
  - Barriers flow through the job; state + Kafka offsets are snapshotted together
    - e.g. every 30 s → `{P5: 2000300, dedup-state, window-state}`
  - On failure: restore the snapshot and re-read from those offsets
    - e.g. some records are re-sent to ES, but `_id=logId` makes it effectively exactly-once

</td></tr></table>

---

### 6. DLQ (Dead Letter Queue)

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

- **Why a Kafka topic for bad logs**
  - The main job keeps running; bad data is kept, not dropped
    - e.g. `logs-dlq` record: `{raw: "...", error: "bad_ts", service: "user"}`
  - Same 7-day retention, so you have time to fix
    - e.g. found on Friday, fixed on Monday, still replayable

</td><td valign="top" width="50%" markdown="1">

- **Monitor + replay**
  - Alert on the DLQ rate per service
    - e.g. user-service DLQ jumps to 20% after a deploy → roll back
  - After fixing the parser, replay into `logs-raw`
    - e.g. a small job reads `logs-dlq` → re-publishes → normal flow

</td></tr></table>

---

### 7. Elasticsearch + Kibana

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

- **Write path**
  - Document → shard via `hash(_routing) % primary_shards` (`_routing` defaults to `_id` = logId)
    - e.g. User 3's error `01JCXA7Q` → shard 2 of `logs-2026.11.12`
  - Primary writes to the translog + memory buffer, then replicates to replica shards
    - e.g. the ack comes back only after the replicas confirm
- **Near real-time search**
  - A refresh (default every 1 s) turns the buffer into a searchable segment
    - e.g. User 3's error is searchable ≈1 s after indexing
  - Background merges combine small segments
    - e.g. warm phase → force-merge to 1 segment per shard (faster reads)

</td><td valign="top" width="50%" markdown="1">

- **Idempotency with `_id = logId`**
  - Re-indexing the same logId overwrites the document instead of adding one
    - e.g. Flink replay after a crash → the doc count stays the same
  - That's why Kafka replay + Flink retry are safe
    - e.g. 6-hour ES outage replay → no duplicates
- **Daily indices + ILM (Index Lifecycle Management: automatic rules that move old data to cheaper disks, then delete it)**
  - Hot (SSD, writes) → warm (HDD, read-only) → delete at 7 days
    - e.g. `logs-2026.11.05` is dropped on 11-12 in one cheap operation
  - Shards of 30–50 GB: too small = overhead per shard, too big = slow to move and recover after a node dies
    - e.g. 1 TB/day → 25 primaries × 40 GB
- **Kibana queries**
  - Per correlationId
    - e.g. `correlationId:"c-103"` → order → user → payment "card declined"
  - Per service and level
    - e.g. `service:payment AND level:ERROR AND tenantId:acme`

</td></tr></table>

---

### 8. TimescaleDB + Grafana

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

- **Hypertable**
  - A normal SQL table that is automatically split into time chunks
    - e.g. `service_metrics(ts, tenant, service, total, errors, p99_ms, dlq)` chunked by 1 day
  - Old chunks drop fast (like ES indices)
    - e.g. `drop_chunks` older than 90 days

</td><td valign="top" width="50%" markdown="1">

- **Queries and alerts**
  - SQL for dashboards
    - e.g. `SELECT ts, errors::float/total FROM service_metrics WHERE service='payment' AND ts > now()-interval '1 hour';`
  - Grafana alert rule
    - e.g. payment error rate > 5% for 5 min → page on-call (User 3's failures contribute)
- **Why not Elasticsearch for metrics**
  - Aggregating raw logs again and again is expensive
    - e.g. scanning 10M payment logs vs. reading 60 rows/hour
  - Flink pre-aggregates once
    - e.g. 1 row per service per minute = 1,440 rows a day per service

</td></tr></table>

---

### 9. S3 + Parquet + Athena (+ Glacier)

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

- **Layout**
  - Hive-style partitions in the path
    - e.g. `s3://logs/tenant=acme/service=payment/dt=2026-11-12/hour=09/part-0001.parquet`
  - Hourly files (not too small, not too big)
    - e.g. 128 MB–1 GB per file is the sweet spot
- **Parquet internals**
  - Columnar: row groups → column chunks with min/max stats
    - e.g. a query on `level='ERROR'` reads only the `level` and `msg` columns
  - Predicate pushdown skips row groups whose stats don't match
    - e.g. a row group with `ts` max 08:59 is skipped for a 09:30 query

</td><td valign="top" width="50%" markdown="1">

- **Athena**
  - Serverless SQL; you pay per data scanned
    - e.g. `WHERE tenant='acme' AND dt='2026-11-12'` scans 1 day, not 1 year
  - Typical query
    - e.g. `SELECT service, count(*) FROM logs WHERE tenant='acme' AND level='ERROR' AND dt BETWEEN '2026-06-01' AND '2026-06-30' GROUP BY service;`
- **Glacier**
  - An S3 lifecycle rule moves files after 365 days
    - e.g. `transition: GLACIER after 365d`
  - Restore takes minutes to hours, so it's only for audits
    - e.g. a regulator asks for acme's payment logs from 2025

</td></tr></table>

---

### 10. End-to-end walk-through: User 3's failed payment

```text
09:30:00.000  User 3 → POST /orders                        Gateway: correlationId c-103, tenant acme
09:30:00.050  order-service   INFO  "order created"         → stdout → Fluent Bit (Node A) → P1
09:30:00.080  user-service    INFO  "user 3 verified"       → stdout → Fluent Bit (Node B) → P3
09:30:00.120  payment-service ERROR "card declined"         → stdout → Fluent Bit (Node C) → P5 offset 2000418
09:30:00.170  Kafka: B3 leader writes, B1 + B2 replicate → HW advances → ack to Fluent Bit
09:30:00.300  Flink: read P5 → validate → mask card → dedup → ES + 09:30 window + Parquet buffer
09:30:01.300  ES refresh → "card declined" searchable in Kibana
09:31:30      Window closes → payment errors=78 → TimescaleDB
09:35:00      Error rate > 5% for 5 min → Grafana alert → on-call
09:36:00      On-call: Kibana correlationId:"c-103" → order → user → payment "card declined"
10:00:00      Hourly Parquet for 09:00 written to S3 → queryable in Athena for a year
```

---

### 11. Rapid-fire interview Q&A

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

- **Why Kafka between agents and ES?**
  - It absorbs spikes and decouples producers from consumers
    - e.g. a sale spike → Kafka buffers it while ES indexes at its own pace
  - It gives 7-day replay
    - e.g. ES outage → no data loss
- **How do you guarantee no loss?**
  - Fluent Bit disk buffer + `acks=all` + `min.insync.replicas=2` + RF=3
    - e.g. any single broker or node can fail
  - Flink checkpoints + Kafka offsets
    - e.g. a crash resumes from the last checkpoint

</td><td valign="top" width="50%" markdown="1">

- **How do you avoid duplicates?**
  - Idempotent producer (retries within a session)
    - e.g. a lost ack → the broker drops the repeat
  - Flink dedup + ES `_id=logId` (everything else)
    - e.g. a replay overwrites the same doc
- **Why key = tenantId:service?**
  - Ordering per tenant + service, and load is spread
    - e.g. acme payment logs are always in order
  - Watch for hot keys
    - e.g. salt `acme:payment:0..3`

</td></tr></table>
