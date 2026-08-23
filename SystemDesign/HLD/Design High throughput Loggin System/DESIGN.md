# Device Telemetry Platform — High Level Design

> 100 M IoT agents push a JSON snapshot every 30 s. Admins see live fleet health.
> Raw payloads kept for audit. Dashboard ≤ 200 ms, event visible ≤ 20 s.
>
> Same question wearing other clothes: *CloudWatch metrics ingestion*, *Datadog live
> tail*, *Uber driver heartbeats*, *Mixpanel pipeline*.

Diagram: `telemetry-hld.excalidraw` (built by `build_telemetry_hld.py`).

---

## 0. The one sentence that decides the whole design

**3.3 M writes/s against ~1 K reads/s.** Every instinct from a social-feed design is
backwards here. You do not pre-build a per-user view — you **pre-count the fleet**.
Nothing is computed at read time, ever.

| | a social feed | this |
|---|---|---|
| traffic shape | 100 reads : 1 write | **3 300 writes : 1 read** |
| expensive side | the read | the write |
| the trick | pre-build every feed | pre-count the whole fleet |
| what's cached | one entry per user | a few hundred numbers per tenant |
| who's watching | 500 M people | 5 000 admins |
| must never lose | the post | the raw payload |
| scary event | a celebrity posts | a whole fleet reboots at once |

---

## 1. Functional requirements

1. Every agent pushes one JSON snapshot every 30 s — battery, cpu, disk, uptime, firmware.
2. We accept it, or we **tell it to slow down**. We never drop it in silence.
3. Every raw payload is kept, exactly as it arrived, for audit.
4. One screen shows the fleet *right now* — "20 % of devices are battery depleted" —
   sliceable by model, OS version, firmware, region.
5. Click a number → the devices behind it → the chart of any single device.
6. Admins write rules ("battery < 10 % for 5 min") and get paged **once**, not 200 000 times.
7. Admins can pull raw payloads back for a date range.
8. Nice to have: remote config push, firmware rollout tracking.

---

## 2. Non-functional requirements

### CAP — there is no single answer, there are four

| Surface | Choice | Why |
|---|---|---|
| **Ingest** | **AP** — availability > consistency | A refused write becomes a retry, and 100 M retries is a second outage on top of the first. Take it, remember it, sort it out afterwards. |
| **Dashboard** | **AP with bounded staleness** | A count 10 s old is fine. A blank screen is not. But every screen carries an `asOf` stamp, so stale data never pretends to be live. |
| **Audit lake** | **Durability first, latency last** | We may lose a dashboard. We may not lose a payload. |
| **Rules / alert state / authz** | **CP** — consistency > availability | Two engines disagreeing about one firing alert pages a human twice at 3 am. One Postgres, one truth. |

### Latency & throughput

- Dashboard read **< 200 ms p95**
- Event visible on the dashboard **< 20 s p99**
- Ingest responds **< 50 ms** — it only says "got it"
- Sustained **3.3 M events/s**, peak **6.6 M/s**
- One broken device must not be able to hurt the other 99 999 999

### The 20-second budget

```
device -> edge     TLS + hop to region              ~    80 ms
gateway            checks, then hand to Kafka       ~    30 ms
kafka              written and acknowledged         ~    20 ms
consumer           picked up and processed (p99)    ~   300 ms
rollup window      a 5 s tumbling window must close ~ 5 000 ms
counter + push     written, then down the socket    ~    50 ms
                                                    -----------
                                                    ~   5.5 s   p99
promise                                                  20 s
headroom for lag                                    ~  14.5 s
```

That headroom is the point. The budget is **deliberately loose** so a consumer can fall
behind for ten seconds without anybody breaking a promise.

### The 200-millisecond budget

```
tls + load balancer                                 ~    20 ms
token check (signed, no DB touched)                 ~     2 ms
headline tile: one read of one small hash           ~     2 ms
any other slice: one read of the cube (p95)         ~    60 ms
json + wire                                         ~    30 ms
                                                    -----------
                                                    ~   115 ms  p95
```

Note what is **not** on that list: no raw events, no scan, no join, no fan-out across
devices. If any of those appears in the read path the budget is gone, and caching cannot
bring it back — the cache would have to be recomputed by a scan.

---

## 3. Estimation

```
devices          100 M agents, one snapshot every 30 s

write rate       100 M / 30 s        = 3.3 M events/s sustained
peak             reboot storm / bad config push, 2x = 6.6 M/s
payload          ~800 B JSON (~250 B gzipped on the wire)
events/day       100 M x 2 880       = 288 BILLION/day

raw volume       288 B x 800 B       = ~230 TB/day uncompressed
audit lake       columnar + zstd ~15x = ~15 TB/day = ~5.5 PB/year
                 ^ this line is why a raw payload never goes near a database

reads            ~5 000 admins, tile refresh every 5 s = ~1 K reads/s
ratio            3 300 : 1 WRITE heavy

fleet counters   a few hundred numbers per tenant = under 4 KB of Redis
latest state     ~200 B x 100 M = ~20 GB of Redis, sharded
kafka            6.6 M/s x 800 B = ~5 GB/s peak; 5 000 partitions;
                 7 d retention = ~1.6 PB broker disk -> tiered storage to S3
ingest fleet     3.3 M rps / ~30 K rps per node = ~110 nodes + headroom, 3 regions
```

**Cost note.** The audit requirement is the expensive one, not the throughput.
Lifecycle it: S3 Standard 7 d → Infrequent Access 30 d → Glacier Deep Archive for the
1–7 year retention. Without tiering, "keep everything forever" is a seven-figure line item.

---

## 4. Core entities

```
Device          deviceId | tenantId | model | osVersion | firmware | registeredAt

Snapshot        eventId | deviceId | seq | emittedAt | receivedAt | schemaVersion
                | battery | cpu | disk | uptime
                    eventId = the repeat key      seq = the ordering key
                    two clocks on purpose: theirs (emittedAt) and ours (receivedAt)

DeviceState     deviceId | lastSeenAt | values | bucket        one row, overwritten
FleetCount      tenantId | dimension | bucket | count          the dashboard tile
RollupRow       tenantId | minute | model | osVersion | region | bucket | count

AlertRule       id | tenantId | expression | threshold | forDuration | severity | channels
AlertInstance   id | ruleId | fingerprint | state | startedAt | deviceCount
                    state: ok -> pending -> firing -> resolved

AuditBlob       blobKey | tenantId | minTs | maxTs | rows | sha256
Admin           id | tenantId | role        viewer | operator | owner
```

**Two clocks, kept apart.** `emittedAt` is the device's clock and decides where a reading
sits on *its* chart. `receivedAt` is ours and decides which window it is counted in.
Device clocks are wrong, we cannot fix them, and windowing on their clock would make the
20-second promise unkeepable. Reject `emittedAt` more than ±24 h from `receivedAt` and
flag the device.

---

## 5. API design

### Ingest

```
POST /v1/telemetry
  headers: x-api-key, x-device-id, x-idempotency-key, content-encoding: gzip
  body:    { eventId, seq, emittedAt, metrics { battery, cpu, disk, uptime } }
  202      { ackedUpTo, nextPushAfterSec, backoffHint }
  429      Retry-After: 60          <- the agent is TOLD to slow down

GET  /v1/agent/manifest              what to send, how often, sampling % -> served by CDN
```

### Dashboard

```
GET  /v1/fleet/summary?window=1m                  -> { total, byBucket {...}, asOf }
GET  /v1/fleet/breakdown?groupBy=model&metric=battery
GET  /v1/devices?filter=battery<10&cursor=&limit=50
GET  /v1/devices/{id}/series?metric=cpu&from=&to=&step=1m
WS   /v1/stream?since=<seq>                        live tiles, resumes from that sequence
GET  /v1/audit/export?from=&to=&deviceId=          a signed link, never the bytes
```

### Alerts

```
POST /v1/alert-rules   |   GET /v1/alerts?state=firing   |   POST /v1/alerts/{id}/ack
```

---

## 6. The eleven flows — where each starts, what it touches, where it ends

The diagram is one strict left-to-right pipeline:

```
CLIENTS -> EDGE -> [SERVICES] -> [KAFKA] -> [WORKERS] -> [STORES] -> [SERVING] -> SCREENS
```

with the control plane as a separate band underneath. Every flow below runs through
it in one direction.

### 1. The telemetry write flow

- **Starts** — an agent wakes 30 s after it last slept, plus a random smear so 100 M
  machines never knock at the same instant. Reads battery/cpu/disk/uptime, stamps its
  **own** `eventId` and `seq`, gzips.
- **Then** — the ingest gateway checks three things in this order and no other:
  quarantined? (one set lookup, no parsing) → valid API key? → inside its token bucket?
  Any failure returns `429` + `Retry-After`. Never a `500`.
- **Then** — Ingest Service adds *our* clock as `receivedAt`, asks the guard rail whether
  it has seen this `eventId` in the last 10 min, produces one record onto
  `telemetry.raw` keyed by `deviceId`.
- **Ends** — Kafka acks, the agent gets `202 { nextPushAfterSec }`. ~30 ms. Nothing
  downstream has run, and the agent neither knows nor cares.
- **Cycle** — sleeps `nextPushAfterSec`, repeats. If the `202` never arrived it retries
  with the **same** `eventId`, which is exactly why a retry is harmless rather than a
  second reading.

### 2. The config flow — and the fleet-wide emergency brake

- **Starts** — the agent boots, or an hour has passed.
- **Then** — it asks the CDN for its manifest: which datapoints, how often, what sampling.
  100 M agents asking hourly is ~28 K rps, and none of it reaches us.
- **Then** — on a miss or purge, the CDN pulls once from Agent Config Service, which
  builds the manifest from the control database.
- **Ends** — the agent adopts the new interval on its next wake-up.
- **Cycle** — this is the emergency brake. A firmware bug making the fleet too loud is
  fixed by changing **one file**; everything slows within the hour with no deploy and no
  per-device action. Quarantine is the stick for one device. This is the stick for a million.

### 3. The audit flow

- **Starts** — Raw Archiver reads `telemetry.raw` in its own consumer group.
- **Then** — buffers into big columnar files (never many small ones — the small-file
  problem is what actually kills a data lake), zstd, one object per hour per tenant into
  the lake under **object lock**, so nobody including us can edit history.
- **Then** — writes one manifest row per object: key, tenant, minTs, maxTs, rows, checksum.
- **Ends** — hourly compaction merges small files and drops duplicates by `eventId`.
- **Cycle** — an auditor's date range makes Audit Export read the **manifest**, never the
  lake, and hand back a signed link; the bytes never pass through our services. This group
  is allowed to be 30 min behind — which is why it is the first thing we pause when the
  cluster is short.

### 4. The state flow — the narrow point of the whole system

- **Starts** — State Materializer reads the same `telemetry.raw` records.
- **Then** — compares incoming `seq` with the one it holds. Older or equal is dropped on
  the spot: that one comparison is both the duplicate defence and the out-of-order defence.
- **Then** — overwrites the device's latest state, appends to that device's Cassandra
  partition, computes the **bucket** (`critical <10 %`, `low 10–30`, `healthy >30`).
- **Ends** — same bucket as last time → writes **nothing** further. Changed, and only
  then → one record onto `device.state`.
- **Cycle** — 3.3 M readings/s in, ~40 k bucket changes/s out, because only 1–2 % of
  readings move a device between buckets. Everything downstream of here is ~80× cheaper
  than everything upstream.

### 5. The counting flow — and the repair that keeps it honest

- **Starts** — Rollup Job reads `device.state` — the bucket changes, not the firehose.
- **Then** — moves exactly two numbers per change: one down in the old bucket, one up in
  the new, in that tenant's counter hash. A few hundred numbers, under 4 KB, and the
  entire answer to "20 % of devices are battery depleted".
- **Then** — folds the same change into a per-minute cube keyed by tenant, minute, model,
  osVersion, firmware, region, so every slice is counted before anyone asks.
- **Ends** — every 5 min a reconciliation pass recomputes exact totals from the cube and
  **overwrites** the counters.
- **Cycle** — that last step is what makes approximate counters safe to build on. A worker
  can die mid-flight and lose a decrement; the error is real, bounded, and never older
  than five minutes.

### 6. The dashboard flow — the snapshot half

- **Starts** — an admin opens the fleet screen.
- **Then** — **one** request to Query Service. It reads the counter hash (~1 ms) and
  returns totals with an `asOf` sequence number.
- **Then** — a slice by model or OS is a *different* read: one query against the cube,
  50–100 ms, still no raw event. Clicking a number is a *third* kind: 50 devices in that
  bucket, with a cursor, from the latest-state store.
- **Ends** — ~115 ms p95, with the `asOf` time shown beside the number.
- **Cycle** — the admin never asks for the summary again. From here it is push, and the
  sequence number they were handed is the cursor that makes the push resumable.
  Snapshot first, then delta, always in that order.

### 7. The live tile flow — the delta half

- **Starts** — the browser opens a socket and sends the sequence it got with the summary.
- **Then** — the WebSocket Gateway reads the replay log forward from that sequence, sends
  what was missed, and only **then** switches to live.
- **Then** — Tile Publisher turns each counter change into one small update, stamps the
  next sequence, appends to the replay log, capped by **length** (not by hope).
- **Ends** — each node subscribes to a tenant's stream **once** and writes to every socket
  it holds. Never one subscription per browser.
- **Cycle** — a dead node is noticed within two missed pings (15 s apart); the browser
  waits a fully-jittered backoff so 50 000 dashboards don't return in the same second,
  reconnects to **any** node, replays from its cursor. Gap bigger than the log → server
  says `resync` and the browser drops back to flow 6. No branch ends with a wrong number.

### 8. The alert flow

- **Starts** — Alert Engine reads `device.state` and the rollup windows.
- **Then** — a rule that becomes true does **not** fire. It goes `PENDING` and must stay
  true for its whole `for` duration (three windows). That delay is what stops a fleet-wide
  flap from paging anybody.
- **Then** — on firing it writes to its own Postgres keyed by a **fingerprint** of
  rule + group, not by an event. A second firing of the same fingerprint updates that row.
- **Ends** — Notifier sends **one** message: "20 % of fleet battery critical, 203 441
  devices", with a link to the drill-down. Not 203 441 messages.
- **Cycle** — inhibition suppresses children of a bigger alert: if a region is down, the
  50 000 "device silent" alerts from that region never leave the building. It resolves the
  way it fired — three quiet windows, one resolution message, the same row updated.

### 9. The silence flow — the one people forget

- **Starts** — every accepted reading also drops the device's id into the heartbeat
  wheel's slot for the current 30 s.
- **Then** — Presence Sweeper walks slots older than 90 s (three missed pushes) looking
  for devices in an old slot and nowhere newer.
- **Ends** — each one produces a `device.silent` record, which flows through **exactly the
  same pipeline** as a real reading: moves the device to `SILENT`, moves the counters,
  can trigger an alert.
- **Cycle** — forgetting this is precisely how "20 % depleted" quietly becomes a lie:
  dead devices stay in the healthy bucket forever and every percentage is computed against
  a fleet that no longer exists. **Silence has to become an event before an event-driven
  system can do anything about it. Absence is not a signal.**

### 10. The failure and replay flow

- **Starts** — a consumer hits a payload it cannot handle.
- **Then** — three tries, then payload + offset + reason into the dead letter store, the
  offset is committed, the line moves on. A partition is **never** allowed to stop for one
  bad record.
- **Then** — a human fixes the cause (usually a schema change) and DLQ Replayer produces
  the fixed records back onto the topic.
- **Ends** — they flow through normally. Nothing is ever quietly thrown away.
- **Cycle** — the same machinery covers a much worse day. A group hours behind still has
  everything in Kafka for 7 days. If it can't catch up, seek the dashboard group to the
  **head** — the screen becomes right about *now* immediately — and let the 5-minute
  reconciliation repair the counters. Correctness comes back on its own; a live view does not.

### 11. The control flow

- **Starts** — an operator provisions a device, an admin writes a rule, or somebody
  changes who may see which fleet.
- **Then** — the admin gateway authenticates a **human** (a completely different path from
  the device one, different credentials, different rate limit), and Control Plane Service
  writes to the control database. The only transactional write anywhere, and it is tiny.
- **Ends** — picked up by whoever needs it: the alert engine reloads rules, the guard rail
  refreshes its device→tenant map, the manifest is rebuilt and pushed to the edge.
- **Cycle** — this band sits deliberately outside the pipeline. Small, strongly consistent,
  and allowed to be briefly unavailable — because nothing in the ingest path ever blocks
  on it. **A device keeps reporting perfectly well while the admin site is down.**

## 7. The five hard problems

### 7.1 A device goes mad and sends 10 000 events/s — how do you protect Kafka?

You cannot trust the agent. It is software you shipped, it is in the field, and you
cannot patch it quickly. So the defence is **layered, and each layer is cheaper than the
one behind it**.

1. **At the edge, before anything is parsed.** A quarantine set is checked first. A device
   that has been abusing us is rejected in microseconds — before the body is read, before
   any JSON is parsed, before Kafka is touched. One set lookup.
2. **A token bucket per device.** 100 pushes/min, burst 200. Over the line gets
   **`429` with `Retry-After`**. Never a `500`, never a silent drop — a `500` makes the
   agent retry immediately, and silence makes it retry forever. *The status code is the
   rate limiter.*
3. **The check itself must be cheap.** At 3.3 M/s you cannot do a Redis round trip per
   push. Each gateway node holds its own slice of the budget and reconciles to Redis once
   a second. Devices are consistently hashed to nodes, so one device's pushes land on the
   same node and the local count is very nearly exact.
4. **A quota above the device.** A per-tenant quota so one customer's broken fleet cannot
   eat the cluster others paid for, and a Kafka broker-level byte-rate quota per producer
   `client.id` underneath that so the broker throttles us even if everything above fails.
5. **The blast radius is already one partition.** Key = `deviceId`, so a mad device jams
   1 partition of 5 000. That is a design property, not luck. If one device ever gets big
   enough to matter, re-key it to `deviceId#randomShard` and give up its ordering — which
   costs nothing, because every event carries its own `seq`.
6. **Shed by priority, never uniformly.** If produce latency climbs, drop heartbeats first
   and keep crash reports and alerts. Uniform shedding throws away the rare events, which
   are exactly the ones that mattered.
7. **Then fix it at the source.** The `202` carries `nextPushAfterSec`, and the config
   manifest can lower the whole fleet's rate. Quarantine is the stick; the manifest is
   the actual fix.

### 7.2 The dashboard covers 500 k devices — how do you compute "20 % depleted" in 200 ms?

The wrong answer is to scan 500 k rows when the admin looks. The right answer is that
**the number was already finished before they looked.**

**Count on write, not on read.** Every reading falls into a bucket — `CRITICAL < 10 %`,
`LOW 10–30 %`, `HEALTHY > 30 %`. The State Materializer remembers which bucket each device
was in *last time*:

```
same bucket as last time   ->  write nothing at all
a different bucket         ->  one down, one up
```

Only **1–2 % of snapshots actually change bucket**, so 3.3 M readings/s become roughly
**40 k counter moves/s**. That single fact is the whole trick.

**The read is then one call.** The tile is one small hash per tenant — a handful of
numbers. "20 % depleted" is `critical / total`. About 1 ms.

**Any other slice.** By model, OS version, firmware, region — the full cross product is far
too big for Redis. So the rollup job *also* writes a per-minute cube into ClickHouse
(`SummingMergeTree`, ordered by `tenantId, minute, model`). A column store answers a
500 k-row slice in 50–100 ms with no index at all, which is inside the budget.

**Two things that would otherwise rot it:**

- **Drift.** Counters miss decrements when a worker dies mid-flight. Every 5 minutes the
  exact count from the cube **overwrites** the fast counters. Fast reads, bounded error,
  and the error is never older than 5 minutes.
- **Silence.** A device that stops reporting must **leave** the counters, or "20 %"
  quietly becomes a lie about a shrinking fleet. The heartbeat wheel (2N time slots, each
  snapshot writes its id into `floor(now/30s)`) has a sweeper walking slots older than
  90 s and moving anything unheard into the `SILENT` bucket.

**The drill-down is a different query.** Clicking the tile means "give me 50 devices whose
bucket is CRITICAL, with a cursor" — a keyed, paginated read of the state store. Never
the same query as the tile.

### 7.3 Consumer lag hits 10 minutes — what do you do?

The promise was 20 seconds, so this is a **broken promise and an on-call action**, not a shrug.

**First, measure it in seconds, not messages.** 200 k behind is fine at 1 M/s and fatal at
100/s. `lag_records / consume_rate` is a number of *seconds*, and seconds is the unit the
promise was made in. Warn at 60 s, page at 300 s.

**Then ask which partition:**

```
every partition behind   ->  it is capacity
one partition behind     ->  a hot key, or a poison message
```

That one question splits the problem in two.

- **Capacity.** Add consumers, up to the number of partitions. That ceiling is exactly why
  5 000 partitions were chosen on day one, when choosing was free. Past it you must
  repartition — a migration, not a 3 am fix.
- **Poison message.** A consumer must **never** block a partition on one bad payload.
  Three tries, then it goes to `telemetry.dlq` with its offset and the error, the offset
  is committed, and the line moves on. A human replays it later, deliberately.
- **Rebalance storm.** A rolling restart that stops the world every time is its own
  outage. Cooperative-sticky assignment plus static `group.instance.id`, so a restart
  moves a few partitions instead of all of them.

**The part people miss — not all lag is equal.** The same event is read by several consumer
groups with different promises. The archiver may be 30 minutes behind and nobody notices,
because it only feeds the audit lake. The dashboard path may not be. So when we are short
of capacity we **pause the archiver** and give its CPU and network to the state path. It
catches up afterwards from the 7-day retention.

**The escape hatch.** If the dashboard path truly cannot catch up, **seek it to the head of
the topic**. The dashboard becomes right about *now*, immediately, and the 5-minute
reconciliation repairs the counters from the cube. Correctness comes back on its own; a
live view does not.

**And always say so on the screen.** `as of 14:02:31`. A stale dashboard that admits it is
stale is survivable. One that lies is how people make bad decisions.

### 7.4 The same event arrives twice — how do you dedupe?

It is not an edge case, it is the normal case. The agent times out on a request we
actually completed and retries. A producer retries. A consumer dies after doing the work
and before committing its offset. Plan for it **everywhere**, not in one place.

**The key is made by the device, not by us.** The agent stamps every snapshot with an
`eventId` (UUIDv7 or `hash(deviceId, emittedAt, seq)`) and a `seq` when it is *created*,
and reuses both on every retry. An id we generated on arrival would be different each time
and would prove nothing.

| Where | The answer |
|---|---|
| **At the gateway** | A 10-minute memory of `eventId`s. A repeat gets the **same `202`** the first one got, so the agent stops retrying and goes away happy. Best effort only — this cache is allowed to be lost. |
| **Into Kafka** | Idempotent producer + `acks=all`, which kills duplicates a producer retry would create within a session. |
| **Latest state** | Newest `seq` wins; an older or equal one is dropped. Idempotent **and** it fixes out-of-order arrival at the same time, for free. |
| **The counters** | *The one that matters.* Counters are **never** moved by an event — they are moved by a **change of bucket**. A replayed event computes the same bucket the device is already in, so there is no change, so nothing moves. Replay safety falls out of the design instead of being bolted on. |
| **The audit lake** | Duplicates are allowed to **land**; hourly compaction removes them by `eventId`. The lake values never losing anything far above never repeating anything. |
| **Alerts** | An alert is identified by a **fingerprint** = `hash(ruleId, groupKey)`, not by an event. Firing twice updates the same row. Nobody is paged twice. |

**Exactly-once, where it is worth paying for.** The Flink rollup runs with Kafka
transactions and checkpointing, so its writes land exactly once. Everywhere else is
at-least-once plus idempotent writes — cheaper, simpler, and just as correct.

### 7.5 The WebSocket server dies — how does the admin reconnect without missing data?

**The rule that makes it survivable:** the socket is an accelerator, never the source of
truth. Anything pushed down it must also be reachable by a plain `GET`. A browser that
loses its socket becomes **slow**, not **wrong**. Everything below is the mechanics of
that one sentence.

1. **Snapshot, then delta.** On open the browser asks for the full summary once and gets
   an `asOf` sequence number with it. After that it only receives changes, each carrying
   the next sequence number.
2. **The reconnect carries the cursor.** The browser reconnects to **any** node — nodes
   hold no state worth keeping — and says "I last saw sequence N". The node reads the
   Redis Stream replay log forward from N, sends what was missed, then switches to live.
   The last five minutes are kept, capped by **length** (`MAXLEN ~ 10000`), not by hope.
   Redis Streams, not pub/sub — pub/sub drops everything on disconnect, which is the exact
   failure we are defending against.
3. **If the gap is too big** (laptop asleep, log rolled past N), the server answers
   `{type: "resync"}`, the browser re-fetches the summary and carries on. No branch of
   this ends with silently wrong numbers on a screen.
4. **Noticing the death quickly.** An application-level ping every 15 s, because a
   protocol-level ping does not survive every proxy in the path. Two missed pongs and the
   client treats the socket as dead.
5. **The part that actually breaks things.** 50 000 dashboards reconnecting in the same
   second is a self-inflicted DoS. **Exponential backoff with full jitter**, base 1 s,
   capped at 30 s. And on a deploy the node sends
   `{type: "going_away", reconnectAfterMs: random(0,5000)}` and drains for 30 s, so a
   rolling restart never stampedes either.
6. **Fan out per node, not per socket.** Each node subscribes to a tenant's update stream
   **once** and writes it to every socket it holds. 50 k sockets is small; 50 k
   subscriptions would not be.
7. **Who is where.** A `connId -> node` registry is kept for targeted pushes, but the
   reconnect never depends on it. The cursor lives in the browser — the only place in this
   whole design that survives our restarts.

---

## 8. Alerting

Two rule classes, evaluated differently:

- **Per-device** — evaluated by the State Materializer on a bucket transition. Event-driven,
  no polling, effectively free.
- **Fleet-level** — evaluated by the Alert Engine against the rollup stream every 30 s
  (`fires if pct_critical > 20 for 3 consecutive windows`).

**The `for` duration prevents flapping.** A rule must hold for N windows before it moves
`pending → firing`. This is Prometheus's model and it is the right one.

**State machine in Postgres** (`ok → pending → firing → resolved`), with a unique
constraint on the fingerprint. CP store, because a duplicate page at 3 am is a real incident.

**Grouping is the whole game.** 200 000 devices going critical must be **one** page —
"20 % of fleet battery-critical, 203 441 devices" with a link to the drill-down — not
200 000 pages. Group by `ruleId + groupBy dimension`; notify once per group with a count.

**Also needed:** silences / maintenance windows, and **inhibition** — if "region down" is
firing, suppress the 50 000 "device silent" alerts from that region.

**Missing-data alerts are the hardest kind.** "Device silent" needs a timer, not an event.
The presence wheel sweeper emits `device.silent`, which then flows through the same
pipeline as everything else. *Silence has to become an event before it can be alerted on.*

**Delivery** is `alerts.fired` → Notifier with retries and its own DLQ. At-least-once plus
fingerprint dedupe at the channel level.

---

## 9. Storage & retention

| Store | Holds | Key / order | Retention |
|---|---|---|---|
| **S3 + Object Lock** | raw payloads, Parquet + zstd | `raw/dt=/hour=/tenant=/part-*.parquet.zst` | 7 y, WORM (compliance mode) |
| **Cassandra** | per-device history | `((deviceId, day), ts)` | 30 d, then S3 |
| **ClickHouse** | per-minute rollup cube | `ORDER BY (tenantId, minute, model)` | 90 d |
| **Redis** | fleet counters, latest state, guard rail, heartbeat wheel, replay log | hash / string / zset / stream | seconds → minutes |
| **Postgres** | devices, tenants, admins, rules, alert state, blob manifest | relational | forever (it's small) |

- Hourly **compaction** merges small files and dedupes by `eventId`. The small-file problem
  is what actually kills these lakes.
- The **manifest table** in Postgres (`blobKey, minTs, maxTs, rows, sha256`) means an audit
  export reads an index, never scans the lake.
- Lifecycle: Standard 7 d → IA 30 d → Glacier Deep Archive.

**Schema evolution.** Agents live in the field for years and cannot be upgraded on demand.
Every payload carries `schemaVersion`, validated against a registry, **backward-compatible
only**. Unknown fields are preserved into the raw archive and ignored by the materializer.

**Multi-tenancy.** `tenantId` in every partition key, row-level security in Postgres,
per-tenant rate quotas, per-tenant Kafka quotas.

---

## 10. Rules that make this work

1. **Count on write, never scan on read.** Every 200 ms budget here comes from that sentence.
2. The ingest path does exactly three things: check it, stamp it, hand it to Kafka.
3. Nothing downstream may slow an agent down, and no consumer may slow another consumer
   down. Separate groups, separate promises, separate right to fall behind.
4. A repeat must change nothing — a property built into every consumer, not something we
   hope a cache remembered for us.
5. **Two clocks, kept apart.** Theirs for charts, ours for windows.
6. Every screen says how old it is. Stale is fine. Lying is not.
7. A device going quiet is an **event**, not the absence of one.
8. Raw payloads never go near a database.
9. The blast radius of one bad device is one partition out of five thousand.
10. Every limit answers with a `429` and a retry time. A `500` makes 100 M machines retry
    *harder*, which is how a small problem becomes a real outage.

---

## 11. Trade-offs I am accepting on purpose

- **Approximate counters between reconciliations.** Up to 5 minutes of drift on the
  headline tile, in exchange for a 1 ms read. If the product needs exactness, the cube is
  always there — it just costs 60 ms instead of 1 ms.
- **Bucket boundaries are fixed at write time.** Changing the "critical" threshold from
  10 % to 15 % means re-deriving counters from the cube, not just changing a query. That is
  the price of pre-counting. Mitigation: keep buckets fine-grained (5 % steps) and let the
  dashboard sum ranges.
- **Per-device ordering is sacrificed for re-keyed hot devices.** Fine, because `seq` makes
  every consumer order-independent anyway.
- **The archiver is allowed to be far behind.** Audit completeness is eventual, guaranteed
  by Kafka retention plus DLQ replay, not by real-time processing.
- **No exactly-once end to end.** Only the rollup pays for it. Everywhere else,
  at-least-once + idempotent writes is cheaper and equally correct.
