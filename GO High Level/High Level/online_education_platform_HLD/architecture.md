# Online Education Platform Architecture (Courses + Recorded & Live Video, HighLevel "Memberships & Courses" style)

> **The one idea to remember: "Our servers give out permission. They never carry the video."**
> A video is huge, so it never passes through our own servers. The teacher's browser uploads it **straight into Amazon S3** (file storage). A converter (the **transcoder**) cuts it into small 6-second pieces in several qualities (this format is called **HLS**). Students download those pieces from **CloudFront**, Amazon's network of servers spread around the world, which only lets in people holding a **valid pass** (a signed cookie).
> Our own services do just three small jobs: decide **who may watch what**, take money **exactly once**, and remember **where each student stopped**.
> Deep dive: [Deep Dive](#deep-dive-only-what-the-flows-above-did-not-cover)

## Requirements (minimal)

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

### Functional (what the product does)

</td><td valign="top" width="50%" markdown="1">

### Non-functional (how well it must work)

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Teacher creates a course and uploads lesson videos**
  - The upload goes straight from the browser to S3. We then convert it into small streamable pieces.
    - e.g. Priya uploads a 2 GB, 60-minute lesson 7. A few minutes later it shows "Ready".

</td><td valign="top" width="50%" markdown="1">

- **Nothing important is ever lost**
  - Payments and uploads are saved in a database with backups. Events are kept as 3 copies on different machines. S3 keeps several copies of every file.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Students search and browse courses**
  - Word search that forgives typos, with filters (level, price) and suggestions while typing.
    - e.g. Rahul types "golang begginer" and still finds "Go for Beginners".

</td><td valign="top" width="50%" markdown="1">

- **Some things may be a few seconds late; money may not**
  - Search results and progress can lag by a second or two. "Did he pay?" and "Is he enrolled?" are always exact.
    - e.g. a newly published course appears in search about a second later.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Students enroll (free or paid)**
  - Charged once and enrolled once, even if the "Buy" button is tapped twice.
    - e.g. Rahul double-taps "Buy ₹999" on a bad network. He gets one charge and one enrollment.

</td><td valign="top" width="50%" markdown="1">

- **Money is handled exactly once**
  - Repeat-safe request ids, duplicate Stripe messages ignored, and a nightly check against Stripe.
    - e.g. Stripe sends "payment succeeded" twice. Rahul is enrolled once.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Students watch recorded lessons**
  - Only enrolled students. Quality adapts to the network. Playback resumes where they stopped.
    - e.g. Rahul reopens lesson 7 and it continues at 31:20.

</td><td valign="top" width="50%" markdown="1">

- **Videos can't be stolen easily**
  - Private storage, a short-lived pass to watch, locked pieces, and the key only for enrolled students.
    - e.g. if someone shares a copied video link, it doesn't work for anyone else.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Live classes**
  - The teacher streams from OBS. Students watch a few seconds behind. A few students can join "on stage" and talk.
    - e.g. Priya's live Q&A: thousands of students watching, 5 on stage.

</td><td valign="top" width="50%" markdown="1">

- **Handles a very large audience**
  - Millions of students a day and hundreds of thousands watching at the same moment.
    - e.g. so much video traffic that only a CDN can deliver it. Our own servers only hand out permissions.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Progress and certificates**
  - The app shows "% complete" per course. Finishing every lesson gives a certificate.

</td><td valign="top" width="50%" markdown="1">

- **Feels fast**
  - The video starts in about 2 seconds, search answers instantly, and live viewers are only a few seconds behind.
    - e.g. Rahul's first video piece comes from a Mumbai server, not from far away.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">



</td><td valign="top" width="50%" markdown="1">

- **Each school's data stays separate** (HighLevel: agency → sub-account `locationId`)
  - Every row, search document and cache key carries the school id.
    - e.g. Priya's students only ever see Priya's courses.

</td></tr></table>

## APIs

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

| Feature | API |
|---|---|
| Create course / lesson | `POST /v1/courses`, `POST /v1/courses/{id}/lessons` |
| Start video upload | `POST /v1/lessons/{id}/video/upload` → `{uploadId, partUrls[]}` |
| Finish video upload | `POST /v1/lessons/{id}/video/complete` |
| Publish | `POST /v1/courses/{id}/publish` + `Idempotency-Key` |
| Search | `GET /v1/search?q=&level=&price=&cursor=` |
| Suggestions while typing | `GET /v1/search/suggest?q=gol` |

</td><td valign="top" width="50%" markdown="1">

| Feature | API |
|---|---|
| Checkout | `POST /v1/checkout {courseId}` + `Idempotency-Key` → `{orderId, clientSecret}` |
| Stripe webhook | `POST /v1/webhooks/stripe` (signed by Stripe) |
| Playback | `GET /v1/lessons/{id}/playback` → `{playlistUrl, resumeAt}` + signed cookies |
| Unlock key | `GET /v1/keys/{keyId}` (only for enrolled students) |
| Progress | `POST /v1/progress {lessonId, positionSec}`; `GET /v1/courses/{id}/progress` |
| Live | `POST /v1/live` → `{streamKey, ingestUrl}`; `GET /v1/live/{id}/playback` |

</td></tr></table>

## Diagram

A quick map of all the parts and how they connect. Arrows (`──>`) show which way requests or data move. What each store keeps is in **Schema Overview**; each flow below walks through one piece.

```text
                                                              ┌─── search ──> Search Service ─────────────────>───────────────────────────────────────>───────────────────────────────────────>───────────────────────────────────────>───────────────────────────────────────>───────────────────────────────────────>───────────────────────────┐
                                                              │                                                                                                                                                                                                                                                                                   │
                                                              │                                                                                                                                                                                                                                                                                   │
┌──────────────────────────────┐                              │                             ┌──────────────────────────────┐              ┌──────────────────────────────┐              ┌──────────────────────────────┐              ┌──────────────────────────────┐              ┌──────────────────────────────┐                              │
│ Teacher (web)                │ ─────┐                       │                     ┌─────> │ Course Service               │ ─────┬─────> │ S3 (video files)             │ ───────────> │ Transcoder Workers           │ ───────────> │ CloudFront (CDN)             │ ───────────> │ Video player                 │                              │
├──────────────────────────────┤      │                       │                     │       ├──────────────────────────────┤      │       ├──────────────────────────────┤              ├──────────────────────────────┤              ├──────────────────────────────┤              ├──────────────────────────────┤                              │
│ - uploads, publishes         │      │                       │                     │       │ - courses + lessons          │      │       │ - raw/ = uploaded file       │              │ - raw -> HLS pieces          │              │ - copies near students       │              │ - playlist, then pieces      │                              │
└──────────────────────────────┘      │                       │                     │       │ - gives S3 upload links      │      │       │ - hls/ = 6-second pieces     │              │ - 360p to 1080p              │              │ - checks signed cookie       │              │ - quality follows network    │                              │
                                      │                       │                     │       │ - publishes                  │      │       └──────────────────────────────┘              └──────────────────────────────┘              └──────────────────────────────┘              └──────────────────────────────┘                              │
                                      │                       │                     │       └──────────────────────────────┘      │                                                                                                                                                                                                               │
                                      │                       │                     │                                             │                                                                                                                                                                                                               │
                                      │                       │                     │                                             │                                                                                                                                                                                                               │
                                      │                       │                     │                                             │                                                                                                                                                                                                               v
                                      │                       │                     │                                             │       ┌──────────────────────────────┐                                                            ┌──────────────────────────────┐              ┌──────────────────────────────┐              ┌───────────────┬──────────────┐              ┌──────────────────────────────┐
                                      │                       │                     │                                             └─────> │ Course DB (PostgreSQL)       │ ─────┐                                             ┌─────> │ Search Indexer               │ ───────────> │ Elasticsearch                │ ───────────> │ Search Service               │ ───────────> │ Search results               │
                                      │                       │                     │                                                     ├──────────────────────────────┤      │                                             │       ├──────────────────────────────┤              ├──────────────────────────────┤              ├──────────────────────────────┤              ├──────────────────────────────┤
                                      │                       │                     │                                                     │ - courses, lessons           │      │                                             │       │ - Kafka -> Elasticsearch     │              │ - one document per course    │              │ - search + suggestions       │              │ - courses Rahul sees         │
                                      │                       │                     │                                                     │ - videos (READY?)            │      │                                             │       └──────────────────────────────┘              │ - forgives typos             │              └──────────────────────────────┘              └──────────────────────────────┘
                                      │                       │                     │                                                     │ - outbox                     │      │                                             │                                                     └──────────────────────────────┘
                                      │                       │                     │                                                     └──────────────────────────────┘      │                                             │
                                      │                       │                     │                                                                                           │                                             │
                                      │                       │                     │                                                                                           │                                             │
                                      │                       ^                     │                                                                                           │                                             │
┌──────────────────────────────┐      │       ┌───────────────┴──────────────┐      │       ┌──────────────────────────────┐              ┌──────────────────────────────┐      │       ┌──────────────────────────────┐      │       ┌──────────────────────────────┐              ┌──────────────────────────────┐
│ Student (mobile app)         │ ─────┼─────> │ API Gateway                  │ ─────┼─────> │ Payment Service              │ ───────────> │ Payment DB (PostgreSQL)      │ ─────┼─────> │ Kafka (events)               │ ─────┼─────> │ Progress Writer              │ ───────────> │ Cassandra (progress)         │
├──────────────────────────────┤      │       ├──────────────────────────────┤      │       ├──────────────────────────────┤              ├──────────────────────────────┤      │       ├──────────────────────────────┤      │       ├──────────────────────────────┤              ├──────────────────────────────┤
│ - search, buy, watch         │      │       │ - check login + rate limit   │      │       │ - creates the order          │              │ - orders (PENDING / PAID)    │      │       │ - paid, published, progress  │      │       │ - batches progress writes    │              │ - last position per lesson   │
└──────────────────────────────┘      │       │ - route the call             │      │       │ - charges once via Stripe    │              │ - Stripe events handled      │      │       │ - kept days, 3 copies        │      │       └──────────────────────────────┘              │ - many small writes          │
                                      │       └──────────────────────────────┘      │       └──────────────────────────────┘              │ - outbox                     │      │       └──────────────────────────────┘      │                                                     └──────────────────────────────┘
                                      │                                             │                                                     └──────────────────────────────┘      │                                             │
                                      │                                             │                                                                                           │                                             │
                                      │                                             │                                                                                           │                                             │
                                      │                                             │                                                                                           │                                             │
┌──────────────────────────────┐      │                                             │       ┌──────────────────────────────┐                                                    │                                             │       ┌──────────────────────────────┐              ┌──────────────────────────────┐
│ Stripe (payments)            │ ─────┘                                             ├─────> │ Playback Service             │ ─────┐                                             │                                             ├─────> │ Notifications                │ ───────────> │ Phone + email                │
├──────────────────────────────┤                                                    │       ├──────────────────────────────┤      │                                             │                                             │       ├──────────────────────────────┤              ├──────────────────────────────┤
│ - takes the money            │                                                    │       │ - checks enrollment          │      │                                             │                                             │       │ - enrolled, certificate      │              │ - messages to students       │
│ - says 'paid' (webhook)      │                                                    │       │ - gives signed cookies       │      │                                             │                                             │       └──────────────────────────────┘              └──────────────────────────────┘
└──────────────────────────────┘                                                    │       │ - never sends video          │      │                                             │                                             │
                                                                                    │       └──────────────────────────────┘      │                                             │                                             │
                                                                                    │                                             │                                             │                                             │
                                                                                    │                                             │                                             │                                             │
                                                                                    │                                             │                                             │                                             │
                                                                                    │       ┌──────────────────────────────┐      │       ┌──────────────────────────────┐      │                                             │       ┌──────────────────────────────┐              ┌──────────────────────────────┐
                                                                                    └─────> │ Progress Service             │ ─────┴─────> │ Redis (cache)                │ ─────┘                                             └─────> │ Enrollment Service           │ ───────────> │ Enrollment DB (PostgreSQL)   │
                                                                                            ├──────────────────────────────┤              ├──────────────────────────────┤                                                            ├──────────────────────────────┤              ├──────────────────────────────┤
                                                                                            │ - takes 'I am at 31:20'      │              │ - who may watch              │                                                            │ - enrolls once on 'paid'     │              │ - enrollments, certificates  │
                                                                                            └──────────────────────────────┘              │ - resume point               │                                                            └──────────────────────────────┘              │ - truth for 'may watch'      │
                                                                                                                                          │ - course cards               │                                                                                                          │ - outbox                     │
                                                                                                                                          └──────────────────────────────┘                                                                                                          └──────────────────────────────┘



┌──────────────────────────────┐              ┌──────────────────────────────┐              ┌──────────────────────────────┐              ┌──────────────────────────────┐              ┌──────────────────────────────┐              ┌──────────────────────────────┐
│ Teacher (OBS live)           │ ───────────> │ Live Ingest                  │ ───────────> │ Live Transcoder              │ ───────────> │ Live Packager                │ ───────────> │ CloudFront (live)            │ ───────────> │ Live viewers                 │
├──────────────────────────────┤              ├──────────────────────────────┤              ├──────────────────────────────┤              ├──────────────────────────────┤              ├──────────────────────────────┤              ├──────────────────────────────┤
│ - streams a live class       │              │ - receives the live stream   │              │ - makes several qualities    │              │ - tiny parts, seconds behind │              │ - spreads live parts         │              │ - a few seconds behind       │
└──────────────────────────────┘              └──────────────────────────────┘              └──────────────────────────────┘              │ - saves the recording        │              └──────────────────────────────┘              └──────────────────────────────┘
                                                                                                                                          └──────────────────────────────┘
```

## Schema Overview

What every store keeps, as one real example per box. Where a field can take several values, they are shown as `"A" or "B"`. Each row scrolls sideways.

### PostgreSQL: Course DB (courses, lessons, videos, live classes)

```text
╔═════════════════════════════════════╗    ╔═════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════╗
║ courses (Course DB) · key course_id ║    ║ lessons (Course DB) · key lesson_id ║    ║ videos (Course DB) · key video_id                             ║    ║ live_sessions (Course DB) · key live_id       ║    ║ outbox (Course DB) · aggregatetype -> Kafka topic                      ║
╟─────────────────────────────────────╢    ╟─────────────────────────────────────╢    ╟───────────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────────╢
║ {                                   ║    ║ {                                   ║    ║ {                                                             ║    ║ {                                             ║    ║ {                                                                      ║
║   "course_id": "c-501",             ║    ║   "lesson_id": "l-7",               ║    ║   "video_id": "v-88",                                         ║    ║   "live_id": "live-12",                       ║    ║   "id": "e-1001",                                                      ║
║   "location_id": "loc-42",          ║    ║   "course_id": "c-501",             ║    ║   "lesson_id": "l-7",                                         ║    ║   "course_id": "c-501",                       ║    ║   "aggregatetype": "course" or "live",                                 ║
║   "title": "Go for Beginners",      ║    ║   "position": 7,                    ║    ║   "location_id": "loc-42",                                    ║    ║   "location_id": "loc-42",                    ║    ║   "aggregateid": "c-501",                                              ║
║   "level": "beginner",              ║    ║   "title": "Goroutines",            ║    ║   "status": "UPLOADING" or "UPLOADED" or "READY" or "FAILED", ║    ║   "stream_key_hash": "sha256:9c1e...",        ║    ║   "type": "course.published" or "video.ready" or "live.scheduled" or   ║
║   "price": 999,                     ║    ║   "video_id": "v-88",               ║    ║   "raw_s3_key": "raw/v-88.mp4",                               ║    ║   "status": "SCHEDULED" or "LIVE" or "ENDED", ║    ║       "live.started",                                                  ║
║   "currency": "INR",                ║    ║   "is_free_preview": false          ║    ║   "upload_id": "u-9",                                         ║    ║   "starts_at": "Thu 19:00"                    ║    ║   "payload": {                                                         ║
║   "status": "DRAFT" or "PUBLISHED", ║    ║ }                                   ║    ║   "hls_path": "hls/v-88/master.m3u8",                         ║    ║ }                                             ║    ║     "course_id": "c-501",                                              ║
║   "version": 7                      ║    ╚═════════════════════════════════════╝    ║   "key_id": "k-88",                                           ║    ╚═══════════════════════════════════════════════╝    ║     "title": "Go for Beginners",                                       ║
║ }                                   ║                                               ║   "duration_sec": 3600                                        ║                                                         ║     "level": "beginner",                                               ║
╚═════════════════════════════════════╝                                               ║ }                                                             ║                                                         ║     "price": 999,                                                      ║
                                                                                      ╚═══════════════════════════════════════════════════════════════╝                                                         ║     "location_id": "loc-42",                                           ║
                                                                                                                                                                                                                ║     "status": "PUBLISHED",                                             ║
                                                                                                                                                                                                                ║     "version": 7                                                       ║
                                                                                                                                                                                                                ║   },                                                                   ║
                                                                                                                                                                                                                ║   "created_at": "Mon 10:10"                                            ║
                                                                                                                                                                                                                ║ }                                                                      ║
                                                                                                                                                                                                                ╚════════════════════════════════════════════════════════════════════════╝
```

### PostgreSQL: Payment DB (orders, money)

```text
╔════════════════════════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════════════╗    ╔════════════════════════════════╗
║ orders (Payment DB) · UNIQUE user_id + idempotency_key                 ║    ║ processed_events (Payment DB) · key event_id (Stripe's) ║    ║ outbox (Payment DB)            ║
╟────────────────────────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────────────╢    ╟────────────────────────────────╢
║ {                                                                      ║    ║ {                                                       ║    ║ {                              ║
║   "order_id": "o-301",                                                 ║    ║   "event_id": "evt_9",                                  ║    ║   "id": "e-2001",              ║
║   "user_id": "rahul",                                                  ║    ║   "received_at": "10:31:02"                             ║    ║   "aggregatetype": "payment",  ║
║   "course_id": "c-501",                                                ║    ║ }                                                       ║    ║   "aggregateid": "rahul",      ║
║   "amount": 999,                                                       ║    ╚═════════════════════════════════════════════════════════╝    ║   "type": "payment.succeeded", ║
║   "currency": "INR",                                                   ║                                                                   ║   "payload": {                 ║
║   "status": "PENDING" or "PAID" or "FAILED" or "EXPIRED" or            ║                                                                   ║     "order_id": "o-301",       ║
║       "REFUNDED",                                                      ║                                                                   ║     "user_id": "rahul",        ║
║   "idempotency_key": "ik-77",                                          ║                                                                   ║     "course_id": "c-501",      ║
║   "stripe_payment_id": null or "pi_55"                                 ║                                                                   ║     "amount": 999,             ║
║ }                                                                      ║                                                                   ║     "currency": "INR"          ║
╚════════════════════════════════════════════════════════════════════════╝                                                                   ║   },                           ║
                                                                                                                                             ║   "created_at": "10:31:02"     ║
                                                                                                                                             ║ }                              ║
                                                                                                                                             ╚════════════════════════════════╝
```

### PostgreSQL: Enrollment DB (who is enrolled, completions, certificates)

```text
╔═══════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════╗
║ enrollments (Enrollment DB) · key user_id + course_id ║    ║ lesson_completions (Enrollment DB) · key user_id + lesson_id ║    ║ certificates (Enrollment DB) · UNIQUE user_id + course_id ║    ║ outbox (Enrollment DB)            ║
╟───────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────────────╢    ╟───────────────────────────────────╢
║ {                                                     ║    ║ {                                                            ║    ║ {                                                         ║    ║ {                                 ║
║   "user_id": "rahul",                                 ║    ║   "user_id": "rahul",                                        ║    ║   "user_id": "rahul",                                     ║    ║   "id": "e-3001",                 ║
║   "course_id": "c-501",                               ║    ║   "lesson_id": "l-7",                                        ║    ║   "course_id": "c-501",                                   ║    ║   "aggregatetype": "certificate", ║
║   "status": "ACTIVE" or "REVOKED",                    ║    ║   "completed_at": "10:42"                                    ║    ║   "issued_at": "Fri 18:40",                               ║    ║   "aggregateid": "rahul",         ║
║   "order_id": "o-301",                                ║    ║ }                                                            ║    ║   "pdf_url": null or "certs/rahul-c-501.pdf"              ║    ║   "type": "certificate.issued",   ║
║   "enrolled_at": "10:31"                              ║    ╚══════════════════════════════════════════════════════════════╝    ║ }                                                         ║    ║   "payload": {                    ║
║ }                                                     ║                                                                        ╚═══════════════════════════════════════════════════════════╝    ║     "user_id": "rahul",           ║
╚═══════════════════════════════════════════════════════╝                                                                                                                                         ║     "course_id": "c-501"          ║
                                                                                                                                                                                                  ║   },                              ║
                                                                                                                                                                                                  ║   "created_at": "Fri 18:40"       ║
                                                                                                                                                                                                  ║ }                                 ║
                                                                                                                                                                                                  ╚═══════════════════════════════════╝
```

### Elasticsearch, Redis, Cassandra

```text
╔═══════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════╗
║ Elasticsearch document (index courses) · id course_id ║    ║ Redis key: who may watch (kept 1 h, deleted on refund) ║    ║ Redis key: course card (kept 10 min) ║    ║ Redis key: repeat-safe request (kept 24 h)                             ║    ║ Redis key: resume point (hash, one field per lesson) ║    ║ progress (Cassandra) · partition user_id + course_id, sorted by        ║
╟───────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────╢    ║ lesson_id                                                              ║
║ {                                                     ║    ║ {                                                      ║    ║ {                                    ║    ║ {                                                                      ║    ║ {                                                    ║    ╟────────────────────────────────────────────────────────────────────────╢
║   "course_id": "c-501",                               ║    ║   "ent:rahul:c-501": 1                                 ║    ║   "course:c-501": {                  ║    ║   "idem:ik-77": "IN_PROGRESS" or {"status": 200, "orderId": "o-301",   ║    ║   "progress:rahul:c-501": {                          ║    ║ {                                                                      ║
║   "location_id": "loc-42",                            ║    ║ }                                                      ║    ║     "title": "Go for Beginners",     ║    ║       "clientSecret": "pi_55_secret"}                                  ║    ║     "l-7": {                                         ║    ║   "user_id": "rahul",                                                  ║
║   "title": "Go for Beginners",                        ║    ╚════════════════════════════════════════════════════════╝    ║     "price": 999,                    ║    ║ }                                                                      ║    ║       "pos": 1880,                                   ║    ║   "course_id": "c-501",                                                ║
║   "tags": ["golang", "backend"],                      ║                                                                  ║     "rating": 4.7,                   ║    ╚════════════════════════════════════════════════════════════════════════╝    ║       "watched": 1880,                               ║    ║   "lesson_id": "l-7",                                                  ║
║   "level": "beginner",                                ║                                                                  ║     "image": "c-501.jpg"             ║                                                                                  ║       "at": "10:42"                                  ║    ║   "position_sec": 1880,                                                ║
║   "price": 999,                                       ║                                                                  ║   }                                  ║                                                                                  ║     },                                               ║    ║   "watched_sec": 1880,                                                 ║
║   "rating": 4.7,                                      ║                                                                  ║ }                                    ║                                                                                  ║     "l-6": {                                         ║    ║   "updated_at": "10:42"                                                ║
║   "students": 1200,                                   ║                                                                  ╚══════════════════════════════════════╝                                                                                  ║       "pos": 2400,                                   ║    ║ }                                                                      ║
║   "status": "published" or "unpublished",             ║                                                                                                                                                                                            ║       "watched": 2400,                               ║    ╚════════════════════════════════════════════════════════════════════════╝
║   "version": 7                                        ║                                                                                                                                                                                            ║       "at": "Mon 21:10"                              ║
║ }                                                     ║                                                                                                                                                                                            ║     }                                                ║
╚═══════════════════════════════════════════════════════╝                                                                                                                                                                                            ║   }                                                  ║
                                                                                                                                                                                                                                                     ║ }                                                    ║
                                                                                                                                                                                                                                                     ╚══════════════════════════════════════════════════════╝
```

### Kafka, the job queue and Stripe's webhook

```text
╔═════════════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════╗    ╔════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════╗
║ Kafka topics                                                    ║    ║ Kafka message                                                          ║    ║ job queue message (Amazon SQS) ║    ║ Stripe webhook (signed)                                                ║
╟─────────────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────────╢    ╟────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────────╢
║ topic                key          types                         ║    ║ {                                                                      ║    ║ {                              ║    ║ {                                                                      ║
║ course.events        course_id    course.published, video.ready ║    ║   "topic": "course.events" or "payment.events" or "progress.events" or ║    ║   "event": "ObjectCreated",    ║    ║   "headers": {                                                         ║
║ payment.events       user_id      payment.succeeded             ║    ║       "certificate.events" or "live.events",                           ║    ║   "bucket": "edu-videos",      ║    ║     "Stripe-Signature": "t=1794573120,v1=5f2a..."                      ║
║ progress.events      user_id      progress.ping                 ║    ║   "key": "rahul",                                                      ║    ║   "key": "raw/v-88.mp4",       ║    ║   },                                                                   ║
║ certificate.events   user_id      certificate.issued            ║    ║   "headers": {                                                         ║    ║   "size": "2 GB"               ║    ║   "id": "evt_9",                                                       ║
║ live.events          live_id      live.scheduled, live.started  ║    ║     "id": "e-2001",                                                    ║    ║ }                              ║    ║   "type": "payment_intent.succeeded" or                                ║
║                                                                 ║    ║     "type": "payment.succeeded"                                        ║    ╚════════════════════════════════╝    ║       "payment_intent.payment_failed",                                 ║
║ kept 7 days, 3 copies; key = what must stay in order            ║    ║   },                                                                   ║                                          ║   "data": {                                                            ║
╚═════════════════════════════════════════════════════════════════╝    ║   "value": {                                                           ║                                          ║     "object": {                                                        ║
                                                                       ║     "order_id": "o-301",                                               ║                                          ║       "id": "pi_55",                                                   ║
                                                                       ║     "user_id": "rahul",                                                ║                                          ║       "amount": 99900,                                                 ║
                                                                       ║     "course_id": "c-501",                                              ║                                          ║       "currency": "inr",                                               ║
                                                                       ║     "amount": 999,                                                     ║                                          ║       "metadata": {                                                    ║
                                                                       ║     "currency": "INR"                                                  ║                                          ║         "order_id": "o-301"                                            ║
                                                                       ║   }                                                                    ║                                          ║       }                                                                ║
                                                                       ║ }                                                                      ║                                          ║     }                                                                  ║
                                                                       ╚════════════════════════════════════════════════════════════════════════╝                                          ║   }                                                                    ║
                                                                                                                                                                                           ║ }                                                                      ║
                                                                                                                                                                                           ╚════════════════════════════════════════════════════════════════════════╝
```

### S3 objects: raw (uploaded) vs hls (ready to serve)

```text
╔═════════════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════╗
║ S3 raw/ = what the teacher uploaded (never served)          ║    ║ S3 hls/ = ready to serve (CloudFront's origin)  ║
╟─────────────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────╢
║ edu-videos/                                                 ║    ║ edu-videos/                                     ║
║   raw/                                                      ║    ║   hls/v-88/                                     ║
║     v-88.mp4          2 GB, any format (mov, mkv, mp4)      ║    ║     master.m3u8         list of the 4 qualities ║
║   recordings/                                               ║    ║     1080p/index.m3u8    list of 600 pieces      ║
║     live-12.mp4       whole live class, saved after it ends ║    ║     1080p/seg_0001.ts   6-second locked piece   ║
║                                                             ║    ║     1080p/seg_0002.ts   ...                     ║
║ private: only Course Service + transcoder read it           ║    ║     720p/ 480p/ 360p/   same layout             ║
║ deleted after 30 days (the HLS copy is kept)                ║    ║     thumbs/0001.jpg     preview pictures        ║
╚═════════════════════════════════════════════════════════════╝    ║     captions/en.vtt     subtitles               ║
                                                                   ║                                                 ║
                                                                   ║ private: only CloudFront may read it (OAC)      ║
                                                                   ║ files never change, so the CDN keeps them long  ║
                                                                   ╚═════════════════════════════════════════════════╝
```

### HLS manifests (playlists)

```text
╔══════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════╗
║ master playlist (hls/v-88/master.m3u8)                   ║    ║ quality playlist (hls/v-88/720p/index.m3u8)                      ║    ║ live playlist (LL-HLS, made by the Live Packager)     ║
╟──────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────────╢
║ #EXTM3U                                                  ║    ║ #EXTM3U                                                          ║    ║ #EXTM3U                                               ║
║ #EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080 ║    ║ #EXT-X-VERSION:3                                                 ║    ║ #EXT-X-TARGETDURATION:4                               ║
║ 1080p/index.m3u8                                         ║    ║ #EXT-X-TARGETDURATION:6                                          ║    ║ #EXT-X-PART-INF:PART-TARGET=0.33                      ║
║ #EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720  ║    ║ #EXT-X-MEDIA-SEQUENCE:0                                          ║    ║ #EXT-X-MEDIA-SEQUENCE:812                             ║
║ 720p/index.m3u8                                          ║    ║ #EXT-X-KEY:METHOD=AES-128,URI="https://api.edu.com/v1/keys/k-88" ║    ║ #EXTINF:4.0,                                          ║
║ #EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=854x480   ║    ║ #EXTINF:6.0,                                                     ║    ║ seg_812.m4s                                           ║
║ 480p/index.m3u8                                          ║    ║ seg_0001.ts                                                      ║    ║ #EXT-X-PART:DURATION=0.33,URI="seg_813.part0.m4s"     ║
║ #EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360    ║    ║ #EXTINF:6.0,                                                     ║    ║ #EXT-X-PRELOAD-HINT:TYPE=PART,URI="seg_813.part1.m4s" ║
║ 360p/index.m3u8                                          ║    ║ seg_0002.ts                                                      ║    ║                                                       ║
║                                                          ║    ║ ...                                                              ║    ║ no EXT-X-ENDLIST: the list keeps growing              ║
║ the player reads this first, then picks a quality        ║    ║ #EXTINF:6.0,                                                     ║    ║ CloudFront keeps it only ≈1 second                    ║
║ BANDWIDTH = bits per second that quality needs           ║    ║ seg_0600.ts                                                      ║    ╚═══════════════════════════════════════════════════════╝
╚══════════════════════════════════════════════════════════╝    ║ #EXT-X-ENDLIST                                                   ║
                                                                ║                                                                  ║
                                                                ║ EXT-X-KEY = where to get the unlock key                          ║
                                                                ║ EXT-X-ENDLIST = recorded video (live has none)                   ║
                                                                ╚══════════════════════════════════════════════════════════════════╝
```

### CloudFront (CDN): URL to S3, caching, signed cookies

```text
╔════════════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════╗
║ CloudFront (CDN) = how a URL reaches S3                        ║    ║ signed cookies = the pass CloudFront checks          ║
╟────────────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────╢
║ cdn.edu.com/hls/*  ->  origin S3 edu-videos/hls/*              ║    ║ CloudFront-Policy      (base64 of the JSON below)    ║
║                                                                ║    ║ CloudFront-Signature   (signed with our private key) ║
║ GET https://cdn.edu.com/hls/v-88/720p/seg_0001.ts              ║    ║ CloudFront-Key-Pair-Id K2ABC                         ║
║   edge Mumbai: cached?  yes -> send it                         ║    ║                                                      ║
║                         no  -> Origin Shield -> S3, keep, send ║    ║ policy =                                             ║
║                                                                ║    ║ {                                                    ║
║ cache time:                                                    ║    ║   "Statement": [                                     ║
║   seg_*.ts      1 year (never changes)                         ║    ║     {                                                ║
║   *.m3u8 (VOD)  1 day                                          ║    ║       "Resource": "https://cdn.edu.com/hls/v-88/*",  ║
║   live .m3u8    1 second (changes all the time)                ║    ║       "Condition": {                                 ║
╚════════════════════════════════════════════════════════════════╝    ║         "DateLessThan": {                            ║
                                                                      ║           "AWS:EpochTime": 1794580200                ║
                                                                      ║         }                                            ║
                                                                      ║       }                                              ║
                                                                      ║     }                                                ║
                                                                      ║   ]                                                  ║
                                                                      ║ }                                                    ║
                                                                      ╚══════════════════════════════════════════════════════╝
```

## Flows (the big diagram, one piece at a time)

Each flow is one slice of the big diagram. Every box says what it does in each step (`STEP n: what`, then how, then an example). Arrows go straight from box to box. Under each diagram, **Data in this flow** shows the rows, keys and messages that flow writes, side by side (scroll sideways). The numbered steps below match the `STEP n` in the boxes.

### Flow 1. Teacher uploads a lesson video → it becomes streamable (S3 → job queue → transcoder → HLS pieces → READY + outbox → Debezium → Kafka)

```text
┌── STEP 1, 2, 6 ──────────────────────────────────────────┐            ┌── STEP 1, 2, 6 ──────────────────────────────────────────┐            ┌── STEP 1, 2 ─────────────────────────────────────────────┐
│ Priya  (teacher, web browser)                            │            │ Course Service                                           │            │ Course DB  (PostgreSQL)                                  │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Asks to upload lesson 7's video                  │ ────┬────> │ STEP 1: Opens a multipart upload at S3                   │ ────┬────> │ STEP 1: Stores the new video row                         │
│   - POST /v1/lessons/l-7/video/upload {size: 2 GB}       │     │      │   - S3 call CreateMultipartUpload returns an upload id   │     │      │   - INSERT INTO videos                                   │
│     through the API Gateway                              │     │      │   - e.g. upload id u-9 for raw/v-88.mp4                  │     │      │   - e.g. v-88, l-7, UPLOADING, upload id u-9             │
│   - e.g. gets upload id u-9 + 20 part links back         │     │      │                                                          │     │      │                                                          │
│                                                          │     │      │ STEP 1: Makes one temporary link per part                │     │      │ STEP 2: Marks the upload finished                        │
│ STEP 2: Uploads the parts straight to S3                 │     │      │   - presigned PUT links, one per 100 MB part, valid ≈1   │     │      │   - UPDATE videos SET status = 'UPLOADED'                │
│   - 4-6 parts at a time; a failed part is sent again     │     │      │     hour                                                 │     │      │   - e.g. v-88: UPLOADING -> UPLOADED                     │
│     alone                                                │     │      │   - e.g. 20 links, each only for its own part            │     │      └──────────────────────────────────────────────────────────┘
│   - then POST /v1/lessons/l-7/video/complete             │     │      │                                                          │     │
│   - e.g. our servers never touch the 2 GB                │     │      │ STEP 1: Saves the video row                              │     │
│                                                          │     │      │   - INSERT INTO videos, status UPLOADING                 │     │
│ STEP 6: Sees 'Ready' instead of 'Processing...'          │     │      │   - e.g. v-88 for lesson l-7, school loc-42              │     │
│   - the lesson page asks for the video status again      │     │      │                                                          │     │
│   - e.g. lesson 7: Ready, 60 minutes                     │     │      │ STEP 2: Asks S3 to join the parts                        │     │
└──────────────────────────────────────────────────────────┘     │      │   - S3 call CompleteMultipartUpload, then status         │     │
                                                                 │      │     UPLOADED                                             │     │
                                                                 │      │   - e.g. raw/v-88.mp4 becomes one 2 GB file              │     │
                                                                 │      │                                                          │     │
                                                                 │      │ STEP 6: Answers 'is v-88 ready?'                         │     │
                                                                 │      │   - reads the videos row                                 │     │
                                                                 │      │   - e.g. READY, 3600 seconds                             │     │
                                                                 │      └──────────────────────────────────────────────────────────┘     │
                                                                 │                                                                       │
                                                                 │                                                                       │
                                                                 │                                                                       │
                                                                 │                                                                       │      ┌── STEP 1, 2, 3 ──────────────────────────────────────────┐            ┌── STEP 3, 4 ─────────────────────────────────────────────┐            ┌── STEP 4, 5 ─────────────────────────────────────────────┐            ┌── STEP 4, 7 ─────────────────────────────────────────────┐            ┌── STEP 7 ────────────────────────────────────────────────┐
                                                                 │                                                                       │      │ Amazon S3  raw/ folder  (private)                        │            │ Job queue  (Amazon SQS, Simple Queue Service)            │            │ Transcoder Workers  (FFmpeg or MediaConvert)             │            │ Amazon S3  hls/ folder  (private)                        │            │ CloudFront  (CDN, Content Delivery Network)              │
                                                                 │                                                                       │      ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
                                                                 └───────────────────────────────────────────────────────────────────────┴────> │ STEP 1: Starts an empty multipart upload                 │ ─────────> │ STEP 3: Keeps the job until a worker finishes it         │ ─────────> │ STEP 4: Converts the video into HLS pieces               │ ────┬────> │ STEP 4: Stores the playable files                        │ ─────────> │ STEP 7: Ready to serve, nothing copied yet               │
                                                                                                                                                │   - keeps the parts aside until they are joined          │            │   - 1,000 uploads at 9 am simply wait in line            │            │   - probe, split at key frames, convert chunks in        │     │      │   - master playlist, 4 quality playlists, pieces,        │            │   - fetches a piece from hls/ the first time a student   │
                                                                                                                                                │   - e.g. upload id u-9                                   │            │   - e.g. 'transcode raw/v-88.mp4'                        │            │     parallel                                             │     │      │     thumbnails, captions                                 │            │     asks (Flow 5)                                        │
                                                                                                                                                │                                                          │            │                                                          │            │   - 4 qualities: 1080p, 720p, 480p, 360p                 │     │      │   - e.g. hls/v-88/master.m3u8                            │            │   - e.g. cdn.edu.com/hls/v-88/...                        │
                                                                                                                                                │ STEP 2: Receives the parts and joins them                │            │ STEP 4: Hands the job to one worker                      │            │   - cut into 6-second pieces + playlists                 │     │      │                                                          │            └──────────────────────────────────────────────────────────┘
                                                                                                                                                │   - each part arrives on its own presigned link          │            │   - a crashed worker's job comes back for another worker │            │   - e.g. ≈600 pieces per quality                         │     │      │ STEP 7: Lets only CloudFront read them                   │
                                                                                                                                                │   - e.g. raw/v-88.mp4, 2 GB                              │            │   - 3 failures -> dead-letter queue (failed jobs)        │            │                                                          │     │      │   - OAC (Origin Access Control) refuses everyone else    │
                                                                                                                                                │                                                          │            └──────────────────────────────────────────────────────────┘            │ STEP 4: Locks every piece                                │     │      └──────────────────────────────────────────────────────────┘
                                                                                                                                                │ STEP 3: Announces the new file                           │                                                                                    │   - AES-128 encryption with key k-88; the key is kept in │     │
                                                                                                                                                │   - built-in event notification on raw/: ObjectCreated   │                                                                                    │     our key store, not in S3                             │     │
                                                                                                                                                │   - e.g. bucket edu-videos, key raw/v-88.mp4             │                                                                                    │                                                          │     │
                                                                                                                                                └──────────────────────────────────────────────────────────┘                                                                                    │ STEP 5: Saves READY + outbox in one transaction          │     │
                                                                                                                                                                                                                                                                                                │   - UPDATE videos, INSERT INTO outbox, COMMIT            │     │
                                                                                                                                                                                                                                                                                                │   - e.g. both rows saved, or neither                     │     │
                                                                                                                                                                                                                                                                                                └──────────────────────────────────────────────────────────┘     │
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │      ┌── STEP 5, 6 ─────────────────────────────────────────────┐            ┌── STEP 6 ────────────────────────────────────────────────┐            ┌── STEP 6 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                                                                                                                                                                 │      │ Course DB  (same database, later)                        │            │ Debezium  (Change Data Capture)                          │            │ Kafka  (event pipe)                                      │
                                                                                                                                                                                                                                                                                                                                                                 │      ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                                                                                                                                                                 └────> │ STEP 5: Stores READY and the news together               │ ─────────> │ STEP 6: Copies the outbox row into Kafka                 │ ─────────> │ STEP 6: Announces 'video v-88 is ready'                  │
                                                                                                                                                                                                                                                                                                                                                                        │   - videos update + outbox insert in one commit          │            │   - aggregatetype course -> topic course.events          │            │   - topic course.events, key c-501, type video.ready     │
                                                                                                                                                                                                                                                                                                                                                                        │   - e.g. v-88 READY; outbox e-0999 video.ready           │            │   - e.g. e-0999 -> key c-501                             │            │   - e.g. all of c-501's events stay in one ordered line  │
                                                                                                                                                                                                                                                                                                                                                                        │                                                          │            └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘
                                                                                                                                                                                                                                                                                                                                                                        │ STEP 6: Its change log is read by Debezium               │
                                                                                                                                                                                                                                                                                                                                                                        │   - the WAL (Write-Ahead Log) now holds the outbox row   │
                                                                                                                                                                                                                                                                                                                                                                        └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Course DB                              ▼ S3 raw/                                                     ▼ Job queue                           ▼ S3 hls/                                              ▼ Course DB (later)                                                                                   ▼ Kafka
╔═══════════════════════════════════╗    ╔════════════════════════════════════════════════════════╗    ╔════════════════════════════════╗    ╔═════════════════════════════════════════════════╗    ╔═══════════════════════════════════════╗    ╔═══════════════════════════════════════════════════╗    ╔═════════════════════════════╗
║ videos (Course DB) · key video_id ║    ║ S3 raw/ = what the teacher uploaded (never served)     ║    ║ job queue message (Amazon SQS) ║    ║ S3 hls/ = ready to serve (CloudFront's origin)  ║    ║ videos (Course DB) · key video_id     ║    ║ outbox (Course DB) · aggregatetype -> Kafka topic ║    ║ Kafka message               ║
╟───────────────────────────────────╢    ╟────────────────────────────────────────────────────────╢    ╟────────────────────────────────╢    ╟─────────────────────────────────────────────────╢    ╟───────────────────────────────────────╢    ╟───────────────────────────────────────────────────╢    ╟─────────────────────────────╢
║ {                                 ║    ║ edu-videos/                                            ║    ║ {                              ║    ║ edu-videos/                                     ║    ║ {                                     ║    ║ {                                                 ║    ║ {                           ║
║   "video_id": "v-88",             ║    ║   raw/                                                 ║    ║   "event": "ObjectCreated",    ║    ║   hls/v-88/                                     ║    ║   "video_id": "v-88",                 ║    ║   "id": "e-0999",                                 ║    ║   "topic": "course.events", ║
║   "lesson_id": "l-7",             ║    ║     v-88.mp4          2 GB, any format (mov, mkv, mp4) ║    ║   "bucket": "edu-videos",      ║    ║     master.m3u8         list of the 4 qualities ║    ║   "lesson_id": "l-7",                 ║    ║   "aggregatetype": "course",                      ║    ║   "key": "c-501",           ║
║   "location_id": "loc-42",        ║    ╚════════════════════════════════════════════════════════╝    ║   "key": "raw/v-88.mp4",       ║    ║     1080p/index.m3u8    list of 600 pieces      ║    ║   "location_id": "loc-42",            ║    ║   "aggregateid": "c-501",                         ║    ║   "headers": {              ║
║   "status": "UPLOADING",          ║                                                                  ║   "size": "2 GB"               ║    ║     1080p/seg_0001.ts   6-second locked piece   ║    ║   "status": "READY",                  ║    ║   "type": "video.ready",                          ║    ║     "id": "e-0999",         ║
║   "raw_s3_key": "raw/v-88.mp4",   ║                                                                  ║ }                              ║    ║     1080p/seg_0002.ts   ...                     ║    ║   "raw_s3_key": "raw/v-88.mp4",       ║    ║   "payload": {                                    ║    ║     "type": "video.ready"   ║
║   "upload_id": "u-9",             ║                                                                  ╚════════════════════════════════╝    ║     720p/ 480p/ 360p/   same layout             ║    ║   "upload_id": "u-9",                 ║    ║     "video_id": "v-88",                           ║    ║   },                        ║
║   "hls_path": null,               ║                                                                                                        ║     thumbs/0001.jpg     preview pictures        ║    ║   "hls_path": "hls/v-88/master.m3u8", ║    ║     "lesson_id": "l-7"                            ║    ║   "value": {                ║
║   "key_id": null,                 ║                                                                                                        ║     captions/en.vtt     subtitles               ║    ║   "key_id": "k-88",                   ║    ║   },                                              ║    ║     "video_id": "v-88",     ║
║   "duration_sec": null            ║                                                                                                        ╚═════════════════════════════════════════════════╝    ║   "duration_sec": 3600                ║    ║   "created_at": "Mon 10:05"                       ║    ║     "lesson_id": "l-7"      ║
║ }                                 ║                                                                                                                                                               ║ }                                     ║    ║ }                                                 ║    ║   }                         ║
╚═══════════════════════════════════╝                                                                                                                                                               ╚═══════════════════════════════════════╝    ╚═══════════════════════════════════════════════════╝    ║ }                           ║
                                                                                                                                                                                                                                                                                                          ╚═════════════════════════════╝
```

1. **Priya asks to upload. The Course Service prepares upload links**
   - **a) What she sends**
     - `POST /v1/lessons/l-7/video/upload {size: 2 GB}` through the API Gateway
     - the file can't be played on a phone as it is: too big, unknown format, one fixed quality
   - **b) What the Course Service does**
     - asks S3 to start a multipart upload (S3 call `CreateMultipartUpload`); S3 returns upload id `u-9`
     - creates **20 presigned upload links**, one per 100 MB part; each link works only for its own part of `raw/v-88.mp4` and only for about an hour
   - **Data change:** `videos` row added `{video_id: v-88, lesson_id: l-7, location_id: loc-42, status: UPLOADING, raw_s3_key: raw/v-88.mp4, upload_id: u-9}`
   - **Why:** our servers never handle 2 GB of video, which would waste memory and network and break on retries. The links carry the permission, so the browser never needs our S3 password.
2. **The browser uploads the parts straight to S3**
   - **a) Parts in parallel**
     - 4-6 parts at the same time; if part 13 fails, only part 13 is sent again
   - **b) Finish**
     - the browser calls `POST /v1/lessons/l-7/video/complete`
     - the Course Service asks S3 to join the parts (S3 call `CompleteMultipartUpload`)
   - **Data change:**
     - S3 object created: `raw/v-88.mp4` (2 GB)
     - `videos` row updated: `status: UPLOADING → UPLOADED`
   - **Why:** parallel parts make the upload fast, and a dropped Wi-Fi connection costs one part, not the whole file.
3. **S3 tells the job queue: "new file arrived"**
   - **a) How**
     - S3 has a built-in event notification: when a file lands in `raw/`, it puts a message in **Amazon SQS** (Simple Queue Service, our job queue)
   - **Data change:** SQS message added `{event: ObjectCreated, bucket: edu-videos, key: raw/v-88.mp4}`
   - **Why a queue:** if 1,000 teachers upload at 9 am, jobs simply wait in line. Workers take them one by one, and nothing is lost or overloaded.
4. **A transcoder worker converts and locks the video** (see "How the transcoder works" below)
   - **a) Take the job**
     - one worker takes the message; while it works, nobody else sees it
     - if the worker crashes, the message comes back and another worker takes it; after 3 failures it goes to a "failed jobs" queue (dead-letter queue) for a human to look at
   - **b) Convert and lock**
     - 4 qualities, cut into 6-second pieces, each piece encrypted with key `k-88`
   - **Data change:** S3 objects created under `hls/v-88/`: a master playlist, 4 quality playlists, about 2,400 pieces (600 per quality), thumbnails and captions
   - **Why encryption at all:** Rahul is enrolled, so he legally gets the pieces. Without encryption he could save all 600 pieces and share them, and anyone could play them. With encryption the pieces are useless without key `k-88`, and our key address (`/v1/keys/k-88`) only answers enrolled, logged-in students. For premium courses, **DRM** (Digital Rights Management) goes further: the key is hidden inside the phone's secure hardware.
5. **Mark it READY and save the news, together**
   - **a) One database transaction**
     - `BEGIN; UPDATE videos ...; INSERT INTO outbox ...; COMMIT;`
   - **Data change:**
     - `videos` row updated `{status: READY, duration_sec: 3600, hls_path: hls/v-88/master.m3u8, key_id: k-88}`
     - `outbox` row added `{id: e-0999, aggregatetype: course, aggregateid: c-501, type: video.ready, payload: {video_id: v-88, lesson_id: l-7}}`
   - **Why one transaction:** if we saved "READY" and then crashed before sending the event, nobody would ever hear about it. With the outbox, both are saved or neither is.
6. **Debezium sends the news to Kafka, and Priya sees "Ready"**
   - **a) How**
     - Debezium (Change Data Capture) reads the database's change log (WAL, Write-Ahead Log) and sees the new outbox row
     - it publishes it to topic `course.events` with key `c-501` (more on how in Flow 2)
   - **b) Priya's page**
     - asks the Course Service for v-88's status again and changes from "Processing..." to "Ready, 60 minutes"
   - **Data change:** Kafka topic `course.events`, key `c-501`, header `type: video.ready`
   - **Why key = c-501:** all of this course's events go to one partition, one ordered line, so they are never read out of order.
7. **CloudFront is now able to serve it**
   - **a) Nothing is copied in advance**
     - CloudFront fetches a piece from `hls/` the first time a student asks for it (Flow 5)
   - **b) What "CloudFront origin = S3 `hls/`" means**
     - `hls/` is just a folder name in S3
     - **origin** means "where CloudFront fetches a file when it does not have it yet"
     - CloudFront's rule: "if a student asks for `/hls/v-88/720p/seg_0314.ts` and I don't have it, fetch it from `s3://edu-videos/hls/v-88/720p/seg_0314.ts`, keep a copy, and serve it"
   - **Data change:** none
   - **Why OAC (Origin Access Control):** it makes S3 refuse everyone except CloudFront, so nobody can skip the pass check by going to S3 directly.

**How the transcoder works (step by step, inside one job)**

The transcoder is a program, usually **FFmpeg** (free, open-source video tool) running on our worker machines, or **AWS Elemental MediaConvert** (Amazon's managed converter). For `raw/v-88.mp4` it does this:

1. **Look inside the file (probe).** It reads the video format, resolution, length (60 min) and audio tracks. A broken file fails here, early.
2. **Split into chunks.** It cuts the 60-minute video into, for example, 30 two-minute chunks at **key frames** (complete pictures the video can safely start from).
3. **Convert the chunks in parallel.** 30 workers each convert one chunk, so 60 minutes of work finishes in a few minutes. Each chunk is encoded with **H.264** (the video format every device plays) and **AAC** (Advanced Audio Coding, the audio format every device plays) into **4 qualities**:
   - 1080p (sharp, needs good Wi-Fi)
   - 720p (normal mobile)
   - 480p (weak 4G)
   - 360p (very weak network)
4. **Stitch the chunks back together** for each quality.
5. **Cut into 6-second pieces and write playlists (packaging).** Each quality becomes about 600 pieces (`seg_0001.ts` …) plus a playlist listing them. A **master playlist** lists the 4 qualities.
6. **Lock every piece (encrypt).** Pieces are encrypted with AES-128 key `k-88`. The key itself is stored in our key store, **not** in S3. Each quality playlist contains a line `#EXT-X-KEY:METHOD=AES-128,URI="https://api.edu.com/v1/keys/k-88"`, which tells the player where to ask for the key.
7. **Make extras.** Thumbnails for the progress bar, a poster image, and captions (`.vtt` subtitle file, optionally from automatic speech-to-text).
8. **Upload to S3 `hls/v-88/`**, then mark the job done. The SQS message is deleted only now, so a crash before this point means the job is retried.

```text
s3://edu-videos/hls/v-88/
├── master.m3u8              <- "there are 4 qualities: 1080p, 720p, 480p, 360p"
├── 1080p/index.m3u8         <- "pieces in order: seg_0001.ts, seg_0002.ts ... ; unlock key at /v1/keys/k-88"
├── 1080p/seg_0001.ts ...    <- 6-second locked pieces
├── 720p/  480p/  360p/      <- same layout per quality
├── thumbs/                  <- small pictures for the seek bar
└── captions/en.vtt          <- subtitles
```

**Say in the interview:** "The browser uploads directly to S3 with presigned multipart links. S3 puts a job on SQS. Workers split, convert in parallel into 4 qualities, cut into 6-second HLS pieces, encrypt them, and write to `hls/`. The READY status and the outbox event are saved in one transaction, and Debezium sends the event to Kafka."

### Flow 2. Teacher publishes the course → it shows up in search (outbox → Debezium (Change Data Capture) → Kafka → Elasticsearch)

```text
┌── STEP 1, 2 ─────────────────────────────────────────────┐            ┌── STEP 1, 2 ─────────────────────────────────────────────┐            ┌── STEP 2, 3, 6 ──────────────────────────────────────────┐            ┌── STEP 3 ────────────────────────────────────────────────┐            ┌── STEP 3, 4 ─────────────────────────────────────────────┐            ┌── STEP 4, 5 ─────────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐
│ Priya  (teacher, web browser)                            │            │ Course Service                                           │            │ Course DB  (PostgreSQL)                                  │            │ Debezium  (Change Data Capture, in Kafka Connect)        │            │ Kafka  (event pipe)                                      │            │ Search Indexer                                           │            │ Elasticsearch  (search engine)                           │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Clicks 'Publish' on Go for Beginners             │ ─────────> │ STEP 1: Has it seen pub-1 before?                        │ ────┬────> │ STEP 2: Stores PUBLISHED and the news                    │ ─────────> │ STEP 3: Copies the new outbox row into Kafka             │ ─────────> │ STEP 3: Keeps c-501's events in order                    │ ────┬────> │ STEP 4: Reads course.published                           │ ─────────> │ STEP 5: Makes the course searchable                      │
│   - POST /v1/courses/c-501/publish + Idempotency-Key     │            │   - yes: return the saved answer; no: go on              │     │      │   - courses update + outbox insert in one commit         │            │   - reads the WAL like a backup copy of the database     │            │   - topic course.events, key c-501 = one partition       │     │      │   - marks it done only after Elasticsearch confirms the  │            │   - document c-501 in index courses                      │
│     pub-1, through the API Gateway                       │            │                                                          │     │      │   - e.g. c-501 PUBLISHED, version 7; outbox e-1001       │            │     would                                                │            │   - e.g. type course.published, version 7                │     │      │     write                                                │            │   - e.g. 'Go for Beginners', published, loc-42           │
│   - e.g. a double click publishes once                   │            │ STEP 2: Checks the course is ready                       │     │      │                                                          │            │   - Outbox Event Router: aggregatetype -> topic,         │            │                                                          │     │      │                                                          │            └──────────────────────────────────────────────────────────┘
│                                                          │            │   - every lesson video READY and a price set             │     │      │ STEP 3: Writes every change into its change log          │            │     aggregateid -> key, payload -> body                  │            │ STEP 4: Hands it to two reader groups                    │     │      │ STEP 5: Writes the search document                       │
│ STEP 2: Sees 'Published'                                 │            │   - e.g. c-501, price ₹999                               │     │      │   - the WAL (Write-Ahead Log), in commit order           │            │   - e.g. e-1001 -> course.events, key c-501              │            │   - search-indexer and cache-cleaner, each at its own    │     │      │   - with version 7: an older version arriving late is    │
│   - search shows the course about a second later         │            │                                                          │     │      │                                                          │            │                                                          │            │     pace                                                 │     │      │     ignored                                              │
└──────────────────────────────────────────────────────────┘            │ STEP 2: Saves the change and the event together          │     │      │ STEP 6: Loses its old outbox rows                        │            │ STEP 3: Remembers how far it has read                    │            └──────────────────────────────────────────────────────────┘     │      │   - e.g. courses/c-501                                   │
                                                                        │   - one transaction: UPDATE courses, INSERT INTO outbox, │     │      │   - the table stays small                                │            │   - after a crash it goes on from there; a row may be    │                                                                             │      └──────────────────────────────────────────────────────────┘
                                                                        │     COMMIT                                               │     │      └──────────────────────────────────────────────────────────┘            │     sent twice                                           │                                                                             │
                                                                        │   - e.g. never writes to Elasticsearch itself            │     │                                                                              └──────────────────────────────────────────────────────────┘                                                                             │
                                                                        └──────────────────────────────────────────────────────────┘     │                                                                                                                                                                                                                       │
                                                                                                                                         │                                                                                                                                                                                                                       │
                                                                                                                                         │                                                                                                                                                                                                                       │
                                                                                                                                         │                                                                                                                                                                                                                       │
                                                                        ┌── STEP 6 ────────────────────────────────────────────────┐     │                                                                                                                                                                                                                       │      ┌── STEP 4, 5 ─────────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐
                                                                        │ Outbox Cleanup Job  (runs daily)                         │     │                                                                                                                                                                                                                       │      │ Cache Cleaner                                            │            │ Redis + CloudFront  (caches)                             │
                                                                        ├──────────────────────────────────────────────────────────┤     │                                                                                                                                                                                                                       │      ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
                                                                        │ STEP 6: Deletes outbox rows older than 1 day             │ ────┘                                                                                                                                                                                                                       └────> │ STEP 4: Reads the same message                           │ ─────────> │ STEP 5: Lose their old copy                              │
                                                                        │   - DELETE FROM outbox WHERE created_at < now() - 1 day  │                                                                                                                                                                                                                                    │   - its own reader group with its own bookmark           │            │   - the next reader gets fresh data                      │
                                                                        │   - e.g. rows only live until Debezium has copied them   │                                                                                                                                                                                                                                    │                                                          │            │   - e.g. course:c-501 deleted                            │
                                                                        └──────────────────────────────────────────────────────────┘                                                                                                                                                                                                                                    │ STEP 5: Deletes the old copies                           │            └──────────────────────────────────────────────────────────┘
                                                                                                                                                                                                                                                                                                                                                                        │   - Redis course:c-501 + the cached CloudFront course    │
                                                                                                                                                                                                                                                                                                                                                                        │     page                                                 │
                                                                                                                                                                                                                                                                                                                                                                        │   - e.g. refilled on the next visit                      │
                                                                                                                                                                                                                                                                                                                                                                        └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Course DB                                                                                         ▼ Kafka                                 ▼ Elasticsearch
╔═════════════════════════════════════╗    ╔═══════════════════════════════════════════════════╗    ╔══════════════════════════════════╗    ╔═══════════════════════════════════════════════════════╗
║ courses (Course DB) · key course_id ║    ║ outbox (Course DB) · aggregatetype -> Kafka topic ║    ║ Kafka message                    ║    ║ Elasticsearch document (index courses) · id course_id ║
╟─────────────────────────────────────╢    ╟───────────────────────────────────────────────────╢    ╟──────────────────────────────────╢    ╟───────────────────────────────────────────────────────╢
║ {                                   ║    ║ {                                                 ║    ║ {                                ║    ║ {                                                     ║
║   "course_id": "c-501",             ║    ║   "id": "e-1001",                                 ║    ║   "topic": "course.events",      ║    ║   "course_id": "c-501",                               ║
║   "location_id": "loc-42",          ║    ║   "aggregatetype": "course",                      ║    ║   "key": "c-501",                ║    ║   "location_id": "loc-42",                            ║
║   "title": "Go for Beginners",      ║    ║   "aggregateid": "c-501",                         ║    ║   "headers": {                   ║    ║   "title": "Go for Beginners",                        ║
║   "level": "beginner",              ║    ║   "type": "course.published",                     ║    ║     "id": "e-1001",              ║    ║   "tags": ["golang", "backend"],                      ║
║   "price": 999,                     ║    ║   "payload": {                                    ║    ║     "type": "course.published"   ║    ║   "level": "beginner",                                ║
║   "currency": "INR",                ║    ║     "course_id": "c-501",                         ║    ║   },                             ║    ║   "price": 999,                                       ║
║   "status": "PUBLISHED",            ║    ║     "title": "Go for Beginners",                  ║    ║   "value": {                     ║    ║   "rating": 4.7,                                      ║
║   "version": 7                      ║    ║     "level": "beginner",                          ║    ║     "course_id": "c-501",        ║    ║   "students": 1200,                                   ║
║ }                                   ║    ║     "price": 999,                                 ║    ║     "title": "Go for Beginners", ║    ║   "status": "published",                              ║
╚═════════════════════════════════════╝    ║     "location_id": "loc-42",                      ║    ║     "level": "beginner",         ║    ║   "version": 7                                        ║
                                           ║     "status": "PUBLISHED",                        ║    ║     "price": 999,                ║    ║ }                                                     ║
                                           ║     "version": 7                                  ║    ║     "location_id": "loc-42",     ║    ╚═══════════════════════════════════════════════════════╝
                                           ║   },                                              ║    ║     "status": "PUBLISHED",       ║
                                           ║   "created_at": "Mon 10:10"                       ║    ║     "version": 7                 ║
                                           ║ }                                                 ║    ║   }                              ║
                                           ╚═══════════════════════════════════════════════════╝    ║ }                                ║
                                                                                                    ╚══════════════════════════════════╝
```

1. **Priya clicks Publish**
   - **a) What she sends**
     - `POST /v1/courses/c-501/publish` with header `Idempotency-Key: pub-1`, through the API Gateway
   - **b) Repeat check**
     - the Course Service has seen `pub-1` before? It returns the saved answer, so a double click does nothing extra
   - **Data change:** none yet
   - **Why it is hard:** our main database (PostgreSQL) is the truth, but search runs on Elasticsearch, a separate system. Search must update reliably, never lose an update, and the Course Service must not talk to Elasticsearch itself.
2. **The Course Service checks the course, then saves the change and the event together**
   - **a) Check**
     - every lesson video is READY and a price is set (c-501, ₹999)
   - **b) One transaction**
     - `BEGIN; UPDATE courses ...; INSERT INTO outbox ...; COMMIT;`
     - Priya now sees "Published"; search follows about a second later
   - **Data change:**
     - `courses` row updated `{course_id: c-501, status: DRAFT → PUBLISHED, version: 7}`
     - `outbox` row added `{id: e-1001, aggregatetype: course, aggregateid: c-501, type: course.published, payload: {course_id: c-501, title: "Go for Beginners", price: 999, level: beginner, version: 7}}`
   - **Why not write to Elasticsearch directly:** if Elasticsearch were down, or we crashed halfway, search and database would disagree forever.
3. **Debezium (Change Data Capture) copies the outbox row into Kafka**
   - **a) `course.events` vs `course.published`, not the same thing**
     - `course.events` is the **topic**, the Kafka channel (like a folder) that holds every event about courses
     - `course.published` is the **event type**, saying what happened in this one message; other messages in the same topic have types like `video.ready`
   - **b) How Debezium reads the database**
     - PostgreSQL writes every committed change into its **WAL** (Write-Ahead Log, the database's own diary of every change)
     - Debezium connects as a **replication client** (the same way a backup copy of the database follows the main one), so it is told about each change in commit order
     - it runs inside **Kafka Connect** (Kafka's service for running connectors), ignores tables it does not watch, and only picks up **new rows in `outbox`**
   - **c) How a row becomes a message**
     - its **Outbox Event Router** (a built-in Debezium step) maps the columns
     - `aggregatetype = course` → topic name; the pattern `<aggregatetype>.events` gives **`course.events`**
     - `aggregateid = c-501` → the **message key**; the same key always goes to the same partition (one ordered line)
     - `payload` → the **message body**; `id` and `type` → **message headers** (labels on the message)
   - **d) The configuration** (the mapping is only this part; the rest is Debezium's running loop)

            table.include.list                         = public.outbox                              (watch only the outbox table)
            transforms.outbox.type                     = io.debezium.transforms.outbox.EventRouter  (turn each row into a clean message)
            transforms.outbox.route.by.field           = aggregatetype                              (this column picks the topic)
            transforms.outbox.route.topic.replacement  = ${routedByValue}.events                    (course -> course.events)

   - **e) Never skip, maybe repeat**
     - Debezium saves "I have read up to this point in the WAL"; after a crash it continues from there
     - a row may occasionally be sent twice, and readers ignore duplicates using `id` or `version`
   - **Data change:** Kafka topic `course.events`, key `c-501`, headers `{id: e-1001, type: course.published}`, value = the full course (see **Data in this flow**)
   - **Why the full course in the message:** so the Search Indexer can write to Elasticsearch without calling the Course Service back.

4. **Two reader groups read the message**
   - **a) Search Indexer** (group `search-indexer`)
     - marks the message done only after Elasticsearch confirms the write, so a crash means it simply re-reads it
   - **b) Cache Cleaner** (group `cache-cleaner`)
     - reads the same message with its own bookmark
   - **Data change:** none yet
   - **Why two groups:** each group reads at its own pace, so a slow cache cleaner never holds up search.
5. **Elasticsearch is updated, and caches are cleaned**
   - **a) Search Indexer**
     - writes document `c-501` with `version: 7`; an older version arriving late is ignored
   - **b) Cache Cleaner**
     - deletes `course:c-501` from Redis and the cached course page from CloudFront; the next visitor refills them
   - **Data change:**
     - Elasticsearch `courses` index, document `c-501` = `{title: "Go for Beginners", level: beginner, price: 999, location_id: loc-42, status: published, rating: 4.7, version: 7}`
     - Redis key `course:c-501` deleted
   - **Why it's fine to be a second late:** search is about 1 second behind the database. That is fine for search (eventual consistency, meaning "correct soon"), and the database stays the single source of truth.
6. **The Outbox Cleanup Job keeps the outbox small**
   - **a) How**
     - a daily job runs `DELETE FROM outbox WHERE created_at < now() - interval '1 day'`
   - **Data change:** old `outbox` rows deleted
   - **Why:** outbox rows only need to live until Debezium has read them. Without cleanup the table grows forever.

**Say in the interview:** "Change and outbox row in one transaction, Debezium reads the WAL and routes the row to Kafka keyed by course id, and the indexer writes to Elasticsearch with a version number so old messages can't overwrite new ones."

### Flow 3. Student searches and browses courses (API Gateway → Search Service → Elasticsearch + Redis → Course DB only on a cache miss)

```text
┌── STEP 1, 5 ─────────────────────────────────────────────┐            ┌── STEP 1 ────────────────────────────────────────────────┐            ┌── STEP 2, 3, 4, 5 ───────────────────────────────────────┐            ┌── STEP 2 ────────────────────────────────────────────────┐
│ Rahul  (student, mobile app)                             │            │ API Gateway  (front door)                                │            │ Search Service                                           │            │ Elasticsearch  (search engine)                           │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Searches 'golang begginer'                       │ ─────────> │ STEP 1: Lets visitors browse, limits floods              │ ─────────> │ STEP 2: Builds the question for Elasticsearch            │ ────┬────> │ STEP 2: Matches words and forgives typos                 │
│   - GET /v1/search?q=golang begginer&level=beginner      │            │   - too many searches from one address get 429 (slow     │            │   - words to match + filters: published, school loc-42,  │     │      │   - title counts most, then tags, then description       │
│   - e.g. spelling mistake included; no login needed      │            │     down)                                                │            │     beginner                                             │     │      │   - fuzzy matching: 'begginer' finds 'beginner'          │
│                                                          │            └──────────────────────────────────────────────────────────┘            │                                                          │     │      │                                                          │
│ STEP 5: Sees 20 course cards                             │                                                                                    │ STEP 3: Fills in the course cards                        │     │      │ STEP 2: Ranks and counts                                 │
│   - 'Buy' on courses he doesn't own, 'Continue' on the   │                                                                                    │   - picture, price and 'Continue' badge from Redis       │     │      │   - word match × rating × students; counts per filter    │
│     rest                                                 │                                                                                    │                                                          │     │      │   - e.g. Beginner (12), Free (3)                         │
│   - next page: sends the cursor back                     │                                                                                    │ STEP 4: Refills a missing card from the database         │     │      └──────────────────────────────────────────────────────────┘
│   - typing 'gol' calls /v1/search/suggest                │                                                                                    │   - only one request reads; the others wait (a lock in   │     │
│   - e.g. 'Go for Beginners' ranked first                 │                                                                                    │     Redis)                                               │     │
└──────────────────────────────────────────────────────────┘                                                                                    │   - e.g. card c-501 kept 10 minutes                      │     │
                                                                                                                                                │                                                          │     │
                                                                                                                                                │ STEP 5: Answers the app                                  │     │
                                                                                                                                                │   - 20 cards + filter counts + next-page cursor          │     │
                                                                                                                                                └──────────────────────────────────────────────────────────┘     │
                                                                                                                                                                                                                 │
                                                                                                                                                                                                                 │
                                                                                                                                                                                                                 │
                                                                                                                                                                                                                 │      ┌── STEP 3 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                 │      │ Redis  (fast in-memory store)                            │
                                                                                                                                                                                                                 │      ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                 ├────> │ STEP 3: Gives ready-made cards and owned courses         │
                                                                                                                                                                                                                 │      │   - GET course:c-501; looks for ent:rahul:*              │
                                                                                                                                                                                                                 │      │   - e.g. Rahul doesn't own c-501 yet -> 'Buy'            │
                                                                                                                                                                                                                 │      └──────────────────────────────────────────────────────────┘
                                                                                                                                                                                                                 │
                                                                                                                                                                                                                 │
                                                                                                                                                                                                                 │
                                                                                                                                                                                                                 │      ┌── STEP 4 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                 │      │ Course DB  (PostgreSQL)                                  │
                                                                                                                                                                                                                 │      ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                 └────> │ STEP 4: Read only when a card is missing                 │
                                                                                                                                                                                                                        │   - SELECT the courses row                               │
                                                                                                                                                                                                                        │   - e.g. c-501 row -> new card in Redis                  │
                                                                                                                                                                                                                        └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Elasticsearch                                              ▼ Redis                                     ▼ Course DB
╔═══════════════════════════════════════════════════════╗    ╔══════════════════════════════════════╗    ╔═════════════════════════════════════╗
║ Elasticsearch document (index courses) · id course_id ║    ║ Redis key: course card (kept 10 min) ║    ║ courses (Course DB) · key course_id ║
╟───────────────────────────────────────────────────────╢    ╟──────────────────────────────────────╢    ╟─────────────────────────────────────╢
║ {                                                     ║    ║ {                                    ║    ║ {                                   ║
║   "course_id": "c-501",                               ║    ║   "course:c-501": {                  ║    ║   "course_id": "c-501",             ║
║   "location_id": "loc-42",                            ║    ║     "title": "Go for Beginners",     ║    ║   "location_id": "loc-42",          ║
║   "title": "Go for Beginners",                        ║    ║     "price": 999,                    ║    ║   "title": "Go for Beginners",      ║
║   "tags": ["golang", "backend"],                      ║    ║     "rating": 4.7,                   ║    ║   "level": "beginner",              ║
║   "level": "beginner",                                ║    ║     "image": "c-501.jpg"             ║    ║   "price": 999,                     ║
║   "price": 999,                                       ║    ║   }                                  ║    ║   "currency": "INR",                ║
║   "rating": 4.7,                                      ║    ║ }                                    ║    ║   "status": "PUBLISHED",            ║
║   "students": 1200,                                   ║    ╚══════════════════════════════════════╝    ║   "version": 7                      ║
║   "status": "published",                              ║                                                ║ }                                   ║
║   "version": 7                                        ║                                                ╚═════════════════════════════════════╝
║ }                                                     ║
╚═══════════════════════════════════════════════════════╝
```

1. **Rahul searches with a typo**
   - **a) What the app sends**
     - `GET /v1/search?q=golang begginer&level=beginner`
     - he should see the right courses, ranked well, with "Continue" on courses he already owns, in well under a second
   - **b) API Gateway**
     - browsing needs no login; the gateway limits how often one address can search (too many → 429, "slow down")
   - **Data change:** none. This flow is read-only.
   - **Why limit:** search is open to everyone, so one script could otherwise flood it.
2. **The Search Service asks Elasticsearch**
   - **a) Match**
     - published courses in school `loc-42` matching the words
     - title matches count most, then tags, then description
     - typos are allowed ("fuzzy" matching), so "begginer" matches "beginner"
   - **b) Rank and count**
     - word match × rating × number of students, so good, popular courses come first
     - counts per filter, e.g. "Beginner (12), Free (3)"
   - **Data change:** none
   - **Why Elasticsearch and not SQL `LIKE`:** a database can't forgive typos, rank by relevance or count filters quickly. Elasticsearch is built for exactly that.
3. **The Search Service fills in the cards from Redis**
   - **a) Course cards**
     - `GET course:c-501` → title, picture, price, rating
   - **b) Owned courses**
     - looks for `ent:rahul:*`; Rahul doesn't own c-501 yet, so its card shows "Buy" instead of "Continue"
   - **Data change:** none
   - **Why Redis:** the cards are the same for everyone and change rarely, so reading them from memory is much faster than the database.
4. **Only if Redis lacks a card: read the Course DB**
   - **a) Refill once**
     - read the `courses` row from PostgreSQL and put the card in Redis for 10 minutes
   - **b) No stampede**
     - if 1,000 people ask at the same moment, only **one** request goes to the database while the rest wait a moment (a lock in Redis)
   - **Data change:** Redis key `course:c-501` set (kept 10 minutes)
   - **Why the lock:** without it, a popular card expiring would send 1,000 identical reads to the database at once (a "stampede").
5. **Rahul sees 20 course cards**
   - **a) The answer**
     - 20 cards + filter counts + a **cursor** (bookmark); "Go for Beginners" ranked first
   - **b) Next page**
     - page 2 asks for results "after this bookmark", which stays fast even deep in the list and results don't shift
   - **c) Suggestions while typing**
     - `GET /v1/search/suggest?q=gol` uses a special Elasticsearch prefix index ("gol" → "golang") and answers in a few milliseconds
   - **Data change:** none
   - **Why a cursor, not a page number:** "page 500" makes the search engine find and throw away 10,000 results first. A bookmark starts right where the last page ended.

**Say in the interview:** "Elasticsearch for typo-tolerant search with filters and counts, results filtered by school id, cards from Redis with a lock against stampedes, and cursor-based pages."

### Flow 4. Student buys a course → charged once, enrolled once (Idempotency-Key → Stripe → signed webhook → PAID + outbox → Debezium → Kafka → Enrollment Service)

```text
                              ┌─── STEP 4: Rahul pays on Stripe's form directly, card numbers never reach us ─────────>───────────────────────────────────────>───────────────────────────────────────>───────────────────────────────────────>───────┐
                              │                                                                                                                                                                                                                       │
                              ^                                                                                                                                                                                                                       v
┌── STEP 1, 3, 4, 8 ──────────┴────────────────────────────┐            ┌── STEP 1, 5, 8 ──────────────────────────────────────────┐            ┌── STEP 2, 3, 5, 8 ───────────────────────────────────────┐            ┌── STEP 3, 4, 9 ─────────────┬────────────────────────────┐
│ Rahul  (student, mobile app)                             │            │ API Gateway  (front door)                                │            │ Payment Service                                          │            │ Stripe API  (payment company)                            │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Taps 'Buy ₹999'                                  │ ────┬────> │ STEP 1, 8: Checks login, limits checkout tries           │ ─────────> │ STEP 2: Has it seen ik-77 before?                        │ ────┬────> │ STEP 3: Prepares the payment                             │
│   - POST /v1/checkout {courseId: c-501} + Idempotency-   │     │      │   - sends /checkout and /orders to the Payment Service   │            │   - Redis SET NX; already there: return the saved answer │     │      │   - same request id twice = the same payment, never two  │
│     Key ik-77; a retry sends the same key                │     │      │                                                          │            │                                                          │     │      │   - e.g. PaymentIntent pi_55, ₹999                       │
│   - e.g. a double tap on a shaky train network           │     │      │ STEP 5: Checks Stripe's signature                        │            │ STEP 2: Creates the order                                │     │      │                                                          │
│                                                          │     │      │   - a fake 'payment succeeded' is refused here           │            │   - INSERT INTO orders, status PENDING, price locked     │     │      │ STEP 4: Takes the money from Rahul's card                │
│ STEP 3: Gets the order and a payment token               │     │      │   - e.g. /webhooks/stripe -> Payment Service             │            │   - e.g. o-301, ₹999                                     │     │      │   - its own form inside the app, opened with the         │
│   - a retry gets the same order and token                │     │      └──────────────────────────────────────────────────────────┘            │                                                          │     │      │     clientSecret                                         │
│   - e.g. o-301 + pi_55_secret                            │     │                                                                              │ STEP 3: Asks Stripe to prepare the payment               │     │      │                                                          │
│                                                          │     │                                                                              │   - create PaymentIntent with Idempotency-Key o-301      │     │      │ STEP 9: Answers status questions                         │
│ STEP 4: Pays on Stripe's own card form                   │     │                                                                              │   - e.g. a retry gets the same pi_55                     │     │      │   - succeeded, failed or still waiting                   │
│   - the card number goes only to Stripe, never to us     │     │                                                                              │                                                          │     │      │   - e.g. pi_55: succeeded                                │
│   - e.g. his bank may ask for a one-time password        │     │                                                                              │ STEP 3: Saves the answer, then replies                   │     │      └──────────────────────────────────────────────────────────┘
│                                                          │     │                                                                              │   - orders.stripe_payment_id + the saved answer in Redis │     │
│ STEP 8: Asks 'is o-301 paid?' until it isn't PENDING     │     │                                                                              │   - e.g. {orderId: o-301, clientSecret}                  │     │
│   - GET /v1/orders/o-301 every few seconds               │     │                                                                              │                                                          │     │
│   - e.g. PAID: 'Enrolled!'; FAILED: 'Card declined'      │     │                                                                              │ STEP 5: Handles the webhook once, in one transaction     │     │
└──────────────────────────────────────────────────────────┘     │                                                                              │   - processed_events insert, PENDING -> PAID, outbox row │     │
                                                                 │                                                                              │   - e.g. evt_9 seen before? reply 200, do nothing        │     │
                                                                 │                                                                              │                                                          │     │
                                                                 │                                                                              │ STEP 5: A failed payment only becomes FAILED             │     │
                                                                 │                                                                              │   - no outbox row, so nobody is enrolled                 │     │
                                                                 │                                                                              │                                                          │     │
                                                                 │                                                                              │ STEP 8: Answers the status question                      │     │
                                                                 │                                                                              │   - reads orders o-301                                   │     │
                                                                 │                                                                              │   - e.g. PAID                                            │     │
                                                                 │                                                                              └──────────────────────────────────────────────────────────┘     │
                                                                 │                                                                                                                                               │
                                                                 │                                                                                                                                               │
                                                                 │                                                                                                                                               │
┌── STEP 5 ────────────────────────────────────────────────┐     │                                                                              ┌── STEP 9 ────────────────────────────────────────────────┐     │      ┌── STEP 2, 3, 5, 6, 9 ────────────────────────────────────┐            ┌── STEP 6 ────────────────────────────────────────────────┐            ┌── STEP 6, 7 ─────────────────────────────────────────────┐            ┌── STEP 7 ────────────────────────────────────────────────┐            ┌── STEP 7 ────────────────────────────────────────────────┐
│ Stripe  (calls our webhook)                              │     │                                                                              │ Reconciliation Job  (in Payment Service, every 5 min)    │     │      │ Payment DB  (PostgreSQL)                                 │            │ Debezium  (Change Data Capture)                          │            │ Kafka  (event pipe)                                      │            │ Enrollment Service                                       │            │ Enrollment DB  (PostgreSQL)                              │
├──────────────────────────────────────────────────────────┤     │                                                                              ├──────────────────────────────────────────────────────────┤     │      ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 5: Tells us the result                              │ ────┘                                                                              │ STEP 9: Finds orders PENDING for over 10 minutes         │ ────┼────> │ STEP 2: Stores the new order                             │ ─────────> │ STEP 6: Copies the outbox row into Kafka                 │ ─────────> │ STEP 6: Keeps Rahul's payment events in order            │ ────┬────> │ STEP 7: Enrolls Rahul once                               │ ────┬────> │ STEP 7: Stores the enrollment                            │
│   - POST /v1/webhooks/stripe, signed (Stripe-Signature   │                                                                                    │   - the webhook may be late or lost                      │     │      │   - UNIQUE (user_id, idempotency_key): no double order   │            │   - aggregatetype payment -> topic payment.events        │            │   - topic payment.events, key rahul                      │     │      │   - INSERT INTO enrollments; UNIQUE (user, course) makes │     │      │   - key (user_id, course_id)                             │
│     header)                                              │                                                                                    │                                                          │     │      │     even if Redis is lost                                │            │   - e.g. e-2001 -> key rahul                             │            │   - e.g. type payment.succeeded, o-301                   │     │      │     a repeat do nothing                                  │     │      │   - e.g. rahul, c-501, ACTIVE, order o-301               │
│   - e.g. evt_9: payment_intent.succeeded for pi_55       │                                                                                    │ STEP 9: Asks Stripe what happened, then fixes the order  │     │      │   - e.g. o-301 PENDING                                   │            └──────────────────────────────────────────────────────────┘            │                                                          │     │      │   - e.g. rahul + c-501, ACTIVE                           │     │      └──────────────────────────────────────────────────────────┘
│                                                          │                                                                                    │   - GET /payment_intents/pi_55, same change as the       │     │      │                                                          │                                                                                    │ STEP 7: Hands it to two reader groups                    │     │      │                                                          │     │
│ STEP 5: Sends again until we answer 200                  │                                                                                    │     webhook                                              │     │      │ STEP 3: Remembers Stripe's payment id                    │                                                                                    │   - enrollment and notification, each at its own pace    │     │      │ STEP 7: Unlocks the course                               │     │
│   - so the same event may arrive twice                   │                                                                                    │   - e.g. still unpaid after 30 minutes -> EXPIRED        │     │      │   - UPDATE orders SET stripe_payment_id                  │                                                                                    └──────────────────────────────────────────────────────────┘     │      │   - SET ent:rahul:c-501 = 1, then marks the message done │     │
└──────────────────────────────────────────────────────────┘                                                                                    │                                                          │     │      │   - e.g. pi_55                                           │                                                                                                                                                     │      └──────────────────────────────────────────────────────────┘     │
                                                                                                                                                │ STEP 9: Nightly: compares the day's payments with Stripe │     │      │                                                          │                                                                                                                                                     │                                                                       │
                                                                                                                                                │   - a payment we missed is fixed the same way            │     │      │ STEP 5: Stores the event id, PAID and the news           │                                                                                                                                                     │                                                                       │
                                                                                                                                                └──────────────────────────────────────────────────────────┘     │      │   - processed_events + orders update + outbox insert,    │                                                                                                                                                     │                                                                       │
                                                                                                                                                                                                                 │      │     one commit                                           │                                                                                                                                                     │                                                                       │
                                                                                                                                                                                                                 │      │   - e.g. evt_9; o-301 PAID; outbox e-2001                │                                                                                                                                                     │                                                                       │
                                                                                                                                                                                                                 │      │                                                          │                                                                                                                                                     │                                                                       │
                                                                                                                                                                                                                 │      │ STEP 6: Its change log is read by Debezium               │                                                                                                                                                     │                                                                       │
                                                                                                                                                                                                                 │      │   - the WAL (Write-Ahead Log)                            │                                                                                                                                                     │                                                                       │
                                                                                                                                                                                                                 │      │                                                          │                                                                                                                                                     │                                                                       │
                                                                                                                                                                                                                 │      │ STEP 9: Has stuck orders fixed                           │                                                                                                                                                     │                                                                       │
                                                                                                                                                                                                                 │      │   - UPDATE ... WHERE status = 'PENDING' only             │                                                                                                                                                     │                                                                       │
                                                                                                                                                                                                                 │      └──────────────────────────────────────────────────────────┘                                                                                                                                                     │                                                                       │
                                                                                                                                                                                                                 │                                                                                                                                                                                                                       │                                                                       │
                                                                                                                                                                                                                 │                                                                                                                                                                                                                       │                                                                       │
                                                                                                                                                                                                                 │                                                                                                                                                                                                                       │                                                                       │
                                                                                                                                                                                                                 │      ┌── STEP 2, 3 ─────────────────────────────────────────────┐                                                                                                                                                     │                                                                       │      ┌── STEP 7 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                 │      │ Redis  (repeat-safe requests)                            │                                                                                                                                                     │                                                                       │      │ Redis  (same Redis, drawn again)                         │
                                                                                                                                                                                                                 │      ├──────────────────────────────────────────────────────────┤                                                                                                                                                     │                                                                       │      ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                 └────> │ STEP 2: Stops a second order for the same tap            │                                                                                                                                                     │                                                                       └────> │ STEP 7: Says 'Rahul may watch c-501'                     │
                                                                                                                                                                                                                        │   - SET idem:ik-77 IN_PROGRESS NX, kept 24 hours         │                                                                                                                                                     │                                                                              │   - key ent:rahul:c-501                                  │
                                                                                                                                                                                                                        │                                                          │                                                                                                                                                     │                                                                              │   - e.g. the Playback Service reads it in Flow 5         │
                                                                                                                                                                                                                        │ STEP 3: Keeps the saved answer                           │                                                                                                                                                     │                                                                              └──────────────────────────────────────────────────────────┘
                                                                                                                                                                                                                        │   - a retry with ik-77 gets the same order               │                                                                                                                                                     │
                                                                                                                                                                                                                        │   - e.g. idem:ik-77 = {orderId: o-301}                   │                                                                                                                                                     │
                                                                                                                                                                                                                        └──────────────────────────────────────────────────────────┘                                                                                                                                                     │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │      ┌── STEP 7 ────────────────────────────────────────────────┐            ┌── STEP 7 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                                                                                                                                                                                                                                         │      │ Notification Service                                     │            │ Rahul's email                                            │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │      ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                                                                                                                                                                                                                                         └────> │ STEP 7: Sends the receipt + welcome email once           │ ─────────> │ STEP 7: 'You're enrolled!'                               │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │   - remembers payment.succeeded:o-301                    │            │   - with the receipt attached                            │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │   - e.g. Priya also sees a new student                   │            └──────────────────────────────────────────────────────────┘
                                                                                                                                                                                                                                                                                                                                                                                                                                                └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Payment DB                                                  ▼ Redis                                           ▼ Stripe                                                 ▼ Payment DB                                                                                                                                                       ▼ Kafka                                ▼ Enrollment DB                                              ▼ Redis
╔════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════╗    ╔════════════════════════════════╗    ╔═════════════════════════════════╗    ╔═══════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════╗
║ orders (Payment DB) · UNIQUE user_id + idempotency_key ║    ║ Redis key: repeat-safe request (kept 24 h) ║    ║ Stripe webhook (signed)                           ║    ║ processed_events (Payment DB) · key event_id (Stripe's) ║    ║ orders (Payment DB) · UNIQUE user_id + idempotency_key ║    ║ outbox (Payment DB)            ║    ║ Kafka message                   ║    ║ enrollments (Enrollment DB) · key user_id + course_id ║    ║ Redis key: who may watch (kept 1 h, deleted on refund) ║
╟────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────╢    ╟────────────────────────────────╢    ╟─────────────────────────────────╢    ╟───────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────╢
║ {                                                      ║    ║ {                                          ║    ║ {                                                 ║    ║ {                                                       ║    ║ {                                                      ║    ║ {                              ║    ║ {                               ║    ║ {                                                     ║    ║ {                                                      ║
║   "order_id": "o-301",                                 ║    ║   "idem:ik-77": {                          ║    ║   "headers": {                                    ║    ║   "event_id": "evt_9",                                  ║    ║   "order_id": "o-301",                                 ║    ║   "id": "e-2001",              ║    ║   "topic": "payment.events",    ║    ║   "user_id": "rahul",                                 ║    ║   "ent:rahul:c-501": 1                                 ║
║   "user_id": "rahul",                                  ║    ║     "status": 200,                         ║    ║     "Stripe-Signature": "t=1794573120,v1=5f2a..." ║    ║   "received_at": "10:31:02"                             ║    ║   "user_id": "rahul",                                  ║    ║   "aggregatetype": "payment",  ║    ║   "key": "rahul",               ║    ║   "course_id": "c-501",                               ║    ║ }                                                      ║
║   "course_id": "c-501",                                ║    ║     "orderId": "o-301",                    ║    ║   },                                              ║    ║ }                                                       ║    ║   "course_id": "c-501",                                ║    ║   "aggregateid": "rahul",      ║    ║   "headers": {                  ║    ║   "status": "ACTIVE",                                 ║    ╚════════════════════════════════════════════════════════╝
║   "amount": 999,                                       ║    ║     "clientSecret": "pi_55_secret"         ║    ║   "id": "evt_9",                                  ║    ╚═════════════════════════════════════════════════════════╝    ║   "amount": 999,                                       ║    ║   "type": "payment.succeeded", ║    ║     "id": "e-2001",             ║    ║   "order_id": "o-301",                                ║
║   "currency": "INR",                                   ║    ║   }                                        ║    ║   "type": "payment_intent.succeeded",             ║                                                                   ║   "currency": "INR",                                   ║    ║   "payload": {                 ║    ║     "type": "payment.succeeded" ║    ║   "enrolled_at": "10:31"                              ║
║   "status": "PENDING",                                 ║    ║ }                                          ║    ║   "data": {                                       ║                                                                   ║   "status": "PAID",                                    ║    ║     "order_id": "o-301",       ║    ║   },                            ║    ║ }                                                     ║
║   "idempotency_key": "ik-77",                          ║    ╚════════════════════════════════════════════╝    ║     "object": {                                   ║                                                                   ║   "idempotency_key": "ik-77",                          ║    ║     "user_id": "rahul",        ║    ║   "value": {                    ║    ╚═══════════════════════════════════════════════════════╝
║   "stripe_payment_id": null                            ║                                                      ║       "id": "pi_55",                              ║                                                                   ║   "stripe_payment_id": "pi_55"                         ║    ║     "course_id": "c-501",      ║    ║     "order_id": "o-301",        ║
║ }                                                      ║                                                      ║       "amount": 99900,                            ║                                                                   ║ }                                                      ║    ║     "amount": 999,             ║    ║     "user_id": "rahul",         ║
╚════════════════════════════════════════════════════════╝                                                      ║       "currency": "inr",                          ║                                                                   ╚════════════════════════════════════════════════════════╝    ║     "currency": "INR"          ║    ║     "course_id": "c-501",       ║
                                                                                                                ║       "metadata": {                               ║                                                                                                                                 ║   },                           ║    ║     "amount": 999,              ║
                                                                                                                ║         "order_id": "o-301"                       ║                                                                                                                                 ║   "created_at": "10:31:02"     ║    ║     "currency": "INR"           ║
                                                                                                                ║       }                                           ║                                                                                                                                 ║ }                              ║    ║   }                             ║
                                                                                                                ║     }                                             ║                                                                                                                                 ╚════════════════════════════════╝    ║ }                               ║
                                                                                                                ║   }                                               ║                                                                                                                                                                       ╚═════════════════════════════════╝
                                                                                                                ║ }                                                 ║
                                                                                                                ╚═══════════════════════════════════════════════════╝
```

1. **Rahul taps Buy**
   - **a) One id per purchase attempt**
     - the app creates a unique id **once** for this purchase attempt and sends `POST /v1/checkout {courseId: c-501}` with header `Idempotency-Key: ik-77`
     - a retry sends the **same** `ik-77`
   - **b) API Gateway**
     - checks his login, limits checkout tries, sends the call to the Payment Service
   - **Data change:** none yet
   - **Why it is hard:** he is on a shaky train network. The request might be sent twice, Stripe might tell us twice, and his phone might die after paying. In every case he must be **charged once** and **enrolled once**.
2. **The Payment Service: "have I seen ik-77?"**
   - **a) Repeat check in Redis**
     - adds key `idem:ik-77` only if it does not exist yet (Redis `SET ... NX`, "set if Not eXists"), for 24 hours
     - already there? Return the saved answer (the same order); nothing new is created
   - **b) New? Create the order**
     - price locked at ₹999
   - **Data change:**
     - Redis `idem:ik-77 = IN_PROGRESS`
     - `orders` row added `{order_id: o-301, user_id: rahul, course_id: c-501, amount: 999, currency: INR, status: PENDING, idempotency_key: ik-77}`
   - **Why also UNIQUE in the database:** (`user_id`, `idempotency_key`) is UNIQUE, so even if Redis is lost, the database refuses a duplicate order.
3. **Ask Stripe to prepare the payment, then reply to the app**
   - **a) PaymentIntent**
     - calls Stripe "create PaymentIntent" (Stripe's object for one payment attempt) with `Idempotency-Key: o-301`
     - if we retry, Stripe returns the **same** payment `pi_55`
   - **b) Reply**
     - `{orderId: o-301, clientSecret: pi_55_secret}`; without it the app could not open Stripe's card form
   - **Data change:**
     - `orders` row updated `stripe_payment_id: pi_55`
     - Redis `idem:ik-77` = the saved answer `{status: 200, orderId: o-301, clientSecret: pi_55_secret}`
   - **Why a key to Stripe too:** this protects the "us → Stripe" hop the same way `ik-77` protected the "app → us" hop.
4. **Rahul pays on Stripe's own card form**
   - **a) How**
     - the form opens inside the app using the `clientSecret` (a one-time token); his bank may ask for a one-time password
     - the card number goes **only** to Stripe, never to us
   - **Data change:** none on our side; Stripe takes the money
   - **Why:** we never see card numbers, so we don't have to meet the strict card-data security rules (PCI DSS, Payment Card Industry Data Security Standard).
5. **Stripe calls our webhook; the Payment Service handles it once**
   - **a) The call**
     - Stripe → `POST /v1/webhooks/stripe` → API Gateway → **Payment Service** (the service that created the order owns the result)
     - the API Gateway checks Stripe's signature (`Stripe-Signature` header), so fake "payment succeeded" calls are rejected
     - Stripe sends it again until we answer 200, so the same event may arrive twice
   - **b) One database transaction**
     - insert `evt_9` into `processed_events`; if it already exists, the insert fails, which means "already handled", and we reply 200 OK
     - `orders` o-301 `PENDING → PAID` (only if still PENDING)
     - add the outbox row
   - **c) If the payment failed** (`payment_intent.payment_failed`, e.g. card declined)
     - same repeat check, then `orders` o-301 `PENDING → FAILED`; no outbox row, so nothing gets enrolled
     - trying again is a new purchase attempt with a new Idempotency-Key, so a new order
   - **Data change:**
     - `processed_events` row added `{event_id: evt_9, received_at: 10:31:02}`
     - `orders` row updated `{order_id: o-301, status: PENDING → PAID}`
     - `outbox` row added `{id: e-2001, aggregatetype: payment, aggregateid: rahul, type: payment.succeeded, payload: {order_id: o-301, course_id: c-501, amount: 999}}`
   - **Why the webhook and not the app:** the app might be closed after paying. Stripe retries the webhook for days until we answer 200, so it is the reliable source of truth.
   - **Why not enroll here:** enrollment belongs to the Enrollment Service and its own database. The Payment Service only says "o-301 is paid"; the outbox makes sure that message is never lost.
6. **Debezium copies the outbox row to Kafka**
   - **a) How**
     - same as Flow 2: reads the Payment DB's WAL, routes `aggregatetype = payment` to topic `payment.events`
   - **Data change:** Kafka topic `payment.events`, key `rahul`, headers `{id: e-2001, type: payment.succeeded}`, value `{order_id: o-301, course_id: c-501, amount: 999}`
   - **Why key = rahul:** all of Rahul's payment events stay in one ordered line.
7. **Two readers react on their own**
   - **a) Enrollment Service**
     - adds the enrollment; the pair (user, course) is unique, so a repeated message changes nothing
     - then sets Redis `ent:rahul:c-501 = 1`; from now on the Playback Service (Flow 5) lets him watch
     - marks the message done only after both writes, so a crash means a safe retry
   - **b) Notification Service**
     - sends the receipt + welcome email; it remembers `payment.succeeded:o-301`, so the email is sent only once
   - **Data change:**
     - `enrollments` row added (Enrollment DB) `{user_id: rahul, course_id: c-501, status: ACTIVE, order_id: o-301, enrolled_at: 10:31}`
     - Redis key `ent:rahul:c-501 = 1`
   - **Why separate readers:** a slow email server must never delay Rahul's access to the course.
8. **The app learns the result**
   - **a) How**
     - while Rahul waits, the app shows "Confirming..." and keeps asking `GET /v1/orders/o-301` until the status is no longer PENDING
     - PAID → "Enrolled!"; FAILED → "Card declined, try again"
   - **Data change:** none
   - **Why ask us and not trust the app:** the app is never trusted to say "paid". Only Stripe's signed webhook (or the reconciliation job) can change the order.
9. **The Reconciliation Job fixes lost or late webhooks**
   - **a) Every 5 minutes**
     - finds orders still PENDING after 10 minutes and asks Stripe directly (`GET /payment_intents/pi_55`)
     - applies the same change as the webhook (PAID + outbox, or FAILED)
     - an order still unpaid after 30 minutes becomes EXPIRED
   - **b) Every night**
     - compares all of the day's orders with Stripe's records; a payment Stripe has but we missed (very rare) is fixed the same way
   - **Data change:** `orders` row `PENDING → PAID` (+ outbox row) or `PENDING → FAILED / EXPIRED`, only `WHERE status = 'PENDING'`
   - **Why:** webhooks are reliable but not perfect. This safety net means no paid student is ever left without a course. See **7. Payment state machine**.

**Say in the interview:** "Idempotency keys on every hop: app → us via `ik-77`, us → Stripe via the order id. The webhook goes to the Payment Service, is the truth, and is de-duplicated by event id. Order PAID + outbox are saved in one transaction, and the Enrollment Service enrolls from the `payment.succeeded` event. A reconciliation job against Stripe catches anything lost."

### Flow 5. Student watches a recorded lesson (Playback Service → Redis → signed cookies → CloudFront → S3)

```text
┌── STEP 1, 3, 4 ──────────────────────────────────────────┐                                                                                                                                                            ┌── STEP 4, 5 ─────────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐
│ Rahul  (student, mobile app)                             │                                                                                                                                                            │ CloudFront  (CDN, Content Delivery Network)              │            │ Amazon S3  hls/ folder  (private)                        │
├──────────────────────────────────────────────────────────┤                                                                                                                                                            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Taps lesson 7                                    │ ────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────> │ STEP 4: Checks the pass on every request                 │ ─────────> │ STEP 5: The original home of the pieces                  │
│   - GET /v1/lessons/l-7/playback through the API Gateway │     │                                                                                                                                                      │   - bad or expired signed cookie: 403 right there        │            │   - only CloudFront may read it (OAC); the pieces are    │
│     (checks login)                                       │     │                                                                                                                                                      │                                                          │            │     locked                                               │
│                                                          │     │                                                                                                                                                      │ STEP 4: Has the piece? Serves it                         │            │   - e.g. hls/v-88/720p/seg_0314.ts                       │
│ STEP 3: Gets the pass and the playlist link              │     │                                                                                                                                                      │   - a cache hit, from the edge server in Mumbai          │            └──────────────────────────────────────────────────────────┘
│   - signed cookies, valid 2 hours, only for /v-88/*      │     │                                                                                                                                                      │   - e.g. seg_0314.ts                                     │
│   - e.g. resume at 1880 s = 31:20                        │     │                                                                                                                                                      │                                                          │
│                                                          │     │                                                                                                                                                      │ STEP 5: Missing piece? Fetches it once                   │
│ STEP 4: The player downloads playlist + pieces           │     │                                                                                                                                                      │   - edge -> Origin Shield -> S3; both keep a copy        │
│   - master.m3u8 -> 720p/index.m3u8 -> piece #314         │     │                                                                                                                                                      │   - e.g. the next 10,000 students get the copy           │
│   - asks GET /v1/keys/k-88 once, unlocks pieces in       │     │                                                                                                                                                      └──────────────────────────────────────────────────────────┘
│     memory                                               │     │
│   - picks a higher or lower quality for each next piece  │     │
└──────────────────────────────────────────────────────────┘     │
                                                                 │
                                                                 │
                                                                 │
                                                                 │      ┌── STEP 2, 3, 4 ──────────────────────────────────────────┐            ┌── STEP 2, 4 ─────────────────────────────────────────────┐
                                                                 │      │ Playback Service                                         │            │ Redis  (fast in-memory store)                            │
                                                                 │      ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
                                                                 └────> │ STEP 2: Is Rahul enrolled in c-501?                      │ ────┬────> │ STEP 2, 4: Answers 'may Rahul watch?'                    │
                                                                        │   - Redis first; the database only if the key is missing │     │      │   - GET ent:rahul:c-501                                  │
                                                                        │                                                          │     │      │   - e.g. 1 = yes, enrolled                               │
                                                                        │ STEP 3: Signs the pass                                   │     │      └──────────────────────────────────────────────────────────┘
                                                                        │   - CloudFront signed cookies for /v-88/*, 2 hours,      │     │
                                                                        │     signed with our private key                          │     │
                                                                        │   - e.g. not enrolled: 403 'Buy this course'             │     │
                                                                        │                                                          │     │
                                                                        │ STEP 3: Returns the playlist link + resume point         │     │
                                                                        │   - the resume point comes from Flow 6                   │     │
                                                                        │   - e.g. playlistUrl .../v-88/master.m3u8, resumeAt 1880 │     │
                                                                        │                                                          │     │
                                                                        │ STEP 4: Hands out the unlock key                         │     │
                                                                        │   - GET /v1/keys/k-88 checks enrollment again first      │     │
                                                                        │   - e.g. the 16-byte key k-88                            │     │
                                                                        └──────────────────────────────────────────────────────────┘     │
                                                                                                                                         │
                                                                                                                                         │
                                                                                                                                         │
                                                                                                                                         │      ┌── STEP 2 ────────────────────────────────────────────────┐
                                                                                                                                         │      │ Enrollment DB  (PostgreSQL)                              │
                                                                                                                                         │      ├──────────────────────────────────────────────────────────┤
                                                                                                                                         └────> │ STEP 2: Read only if Redis has no answer                 │
                                                                                                                                                │   - read the enrollments row, then save the answer in    │
                                                                                                                                                │     Redis                                                │
                                                                                                                                                │   - e.g. rahul + c-501, ACTIVE                           │
                                                                                                                                                └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Redis                                                       ▼ Enrollment DB                                              ▼ Playback Service                                                                                                                        ▼ CloudFront
╔════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════╗
║ Redis key: who may watch (kept 1 h, deleted on refund) ║    ║ enrollments (Enrollment DB) · key user_id + course_id ║    ║ playback answer (Playback Service -> app)                              ║    ║ signed cookies = the pass CloudFront checks          ║    ║ quality playlist (hls/v-88/720p/index.m3u8)                      ║    ║ CloudFront (CDN) = how a URL reaches S3                        ║
╟────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────╢
║ {                                                      ║    ║ {                                                     ║    ║ {                                                                      ║    ║ CloudFront-Policy      (base64 of the JSON below)    ║    ║ #EXTM3U                                                          ║    ║ cdn.edu.com/hls/*  ->  origin S3 edu-videos/hls/*              ║
║   "ent:rahul:c-501": 1                                 ║    ║   "user_id": "rahul",                                 ║    ║   "playlistUrl": "https://cdn.edu.com/hls/v-88/master.m3u8",           ║    ║ CloudFront-Signature   (signed with our private key) ║    ║ #EXT-X-VERSION:3                                                 ║    ║                                                                ║
║ }                                                      ║    ║   "course_id": "c-501",                               ║    ║   "resumeAt": 1880,                                                    ║    ║ CloudFront-Key-Pair-Id K2ABC                         ║    ║ #EXT-X-TARGETDURATION:6                                          ║    ║ GET https://cdn.edu.com/hls/v-88/720p/seg_0001.ts              ║
╚════════════════════════════════════════════════════════╝    ║   "status": "ACTIVE",                                 ║    ║   "cookies": ["CloudFront-Policy", "CloudFront-Signature",             ║    ║                                                      ║    ║ #EXT-X-MEDIA-SEQUENCE:0                                          ║    ║   edge Mumbai: cached?  yes -> send it                         ║
                                                              ║   "order_id": "o-301",                                ║    ║       "CloudFront-Key-Pair-Id"]                                        ║    ║ policy =                                             ║    ║ #EXT-X-KEY:METHOD=AES-128,URI="https://api.edu.com/v1/keys/k-88" ║    ║                         no  -> Origin Shield -> S3, keep, send ║
                                                              ║   "enrolled_at": "10:31"                              ║    ║ }                                                                      ║    ║ {                                                    ║    ║ #EXTINF:6.0,                                                     ║    ║                                                                ║
                                                              ║ }                                                     ║    ╚════════════════════════════════════════════════════════════════════════╝    ║   "Statement": [                                     ║    ║ seg_0001.ts                                                      ║    ║ cache time:                                                    ║
                                                              ╚═══════════════════════════════════════════════════════╝                                                                                  ║     {                                                ║    ║ #EXTINF:6.0,                                                     ║    ║   seg_*.ts      1 year (never changes)                         ║
                                                                                                                                                                                                         ║       "Resource": "https://cdn.edu.com/hls/v-88/*",  ║    ║ seg_0002.ts                                                      ║    ║   *.m3u8 (VOD)  1 day                                          ║
                                                                                                                                                                                                         ║       "Condition": {                                 ║    ║ ...                                                              ║    ║   live .m3u8    1 second (changes all the time)                ║
                                                                                                                                                                                                         ║         "DateLessThan": {                            ║    ║ #EXTINF:6.0,                                                     ║    ╚════════════════════════════════════════════════════════════════╝
                                                                                                                                                                                                         ║           "AWS:EpochTime": 1794580200                ║    ║ seg_0600.ts                                                      ║
                                                                                                                                                                                                         ║         }                                            ║    ║ #EXT-X-ENDLIST                                                   ║
                                                                                                                                                                                                         ║       }                                              ║    ╚══════════════════════════════════════════════════════════════════╝
                                                                                                                                                                                                         ║     }                                                ║
                                                                                                                                                                                                         ║   ]                                                  ║
                                                                                                                                                                                                         ║ }                                                    ║
                                                                                                                                                                                                         ╚══════════════════════════════════════════════════════╝
```

1. **Rahul taps lesson 7**
   - **a) What the app sends**
     - `GET /v1/lessons/l-7/playback` through the API Gateway (which checks his login)
   - **Data change:** none
   - **Why ask our server at all:** our server only checks permission and gives a pass, which takes milliseconds. After that, **all** the video comes from CloudFront's Mumbai server, not from us.
2. **The Playback Service checks permission**
   - **a) Redis first**
     - reads `ent:rahul:c-501`
   - **b) Database only if the key is missing**
     - reads the `enrollments` row in the Enrollment DB and stores the answer in Redis
   - **Data change:** maybe Redis key `ent:rahul:c-501 = 1` refilled
   - **Why Redis:** every play of every lesson asks this question; memory answers it in about a millisecond.
3. **It signs the pass and replies**
   - **a) Not enrolled**
     - `403 Forbidden` and a "Buy this course" screen
   - **b) Enrolled**
     - creates **signed cookies** (a tamper-proof pass): "may read `https://cdn.edu.com/hls/v-88/*` until 2 hours from now", signed with our CloudFront private key
     - returns `{playlistUrl: https://cdn.edu.com/hls/v-88/master.m3u8, resumeAt: 1880}` (1880 seconds = 31:20, from Flow 6) plus the cookies
   - **Data change:** none
   - **Why signed *cookies* and not signed *links*:** one video has about 2,400 piece files. A signed link would have to be added to every line of every playlist. One cookie for `/hls/v-88/*` covers them all.
4. **The player downloads from CloudFront, piece by piece**
   - **a) Playlists**
     - reads `master.m3u8` (the 4 qualities), picks 720p, reads `720p/index.m3u8`, jumps to the piece at 31:20 (piece #314) and starts
   - **b) Unlock key**
     - the playlist says the pieces are locked, so the player calls `GET /v1/keys/k-88` **once**
     - the Playback Service checks enrollment again (Redis) and returns the 16-byte key; the player unlocks each piece in memory
   - **c) Quality follows the network**
     - for each new piece, the player measures the download speed and picks a higher or lower quality for the **next** piece (adaptive bitrate)
   - **d) CloudFront**
     - checks the cookie on every request; a cached piece (cache hit) is sent right away from the Mumbai edge server
   - **Data change:** none
   - **Why 6-second pieces:** the player can switch quality every few seconds and start anywhere without downloading the whole file.
5. **Only when CloudFront doesn't have a piece yet: fetch it from S3**
   - **a) Cache miss**
     - edge → Origin Shield (regional middle cache) → S3 `hls/` (allowed by OAC); both caches keep a copy
   - **Data change:** CloudFront caches now hold `hls/v-88/720p/seg_0314.ts`
   - **Why it scales:** the first student in Mumbai causes one S3 fetch. The next 10,000 students get the Mumbai copy.

**How a piece travels from S3 to Rahul's phone**

```text
Rahul's phone ──(a) GET /hls/v-88/720p/seg_0314.ts + signed cookie──> CloudFront edge server in Mumbai
                                                                   │  (b) checks the cookie signature and expiry  -> bad? 403, stop here
                                                                   │  (c) "do I have seg_0314 in my cache?"
                                                                   │        YES (cache hit, ≈95% of the time)  -> send it back immediately
                                                                   │        NO  (cache miss) -> ask the regional middle cache (Origin Shield)
                                                                   v
                                                  Origin Shield (one regional cache for all Indian edge servers)
                                                                   │  has it? -> send it back
                                                                   │  no?     -> (d) fetch from S3 hls/v-88/720p/seg_0314.ts (allowed by OAC)
                                                                   v
                                                  S3 (private)  -> piece goes back up: S3 -> Shield -> Mumbai edge (both keep a copy) -> Rahul
```

- **CloudFront *is* the CDN.** There is no separate CDN after it. CloudFront's edge servers in each city are the CDN.
- **Why the middle cache (Origin Shield)?** If 50 Indian edge servers all miss the same piece at once, S3 gets **1** request instead of 50.
- **Three locks together:** OAC (only CloudFront can read S3), signed cookie (only pass holders can read CloudFront), and encryption (only enrolled students get the key).

**Say in the interview:** "The API only checks permission and signs a 2-hour cookie. Video bytes go S3 → Origin Shield → edge → player and are cached at every level. Pieces are AES-encrypted, with the key behind an enrollment check."

### Flow 6. Progress tracking: where did I stop, % complete, certificate (Progress Service → Kafka first → Redis → Progress Writer → Cassandra; Completion Checker → outbox → Debezium → Kafka → email)

```text
┌── STEP 1, 3 ─────────────────────────────────────────────┐            ┌── STEP 2, 3 ─────────────────────────────────────────────┐            ┌── STEP 2, 4, 6 ──────────────────────────────────────────┐            ┌── STEP 4, 5 ─────────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐
│ Rahul  (student, mobile app)                             │            │ Progress Service                                         │            │ Kafka  (event pipe)                                      │            │ Progress Writer                                          │            │ Progress DB  (Apache Cassandra)                          │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Sends 'I am at 31:20'                            │ ─────────> │ STEP 2: Sends the ping to Kafka FIRST                    │ ────┬────> │ STEP 2: The first safe home of the ping                  │ ────┬────> │ STEP 4: Keeps only the newest ping per lesson            │ ─────────> │ STEP 5: Stores the latest position                       │
│   - POST /v1/progress {lessonId: l-7, positionSec: 1880} │            │   - acks=all: waits until all 3 copies are saved         │     │      │   - topic progress.events, key rahul keeps his pings in  │     │      │   - per 30-second window: two pings become one write     │            │   - partition (user, course), sorted by lesson; the      │
│     every 15 s and on pause                              │            │   - e.g. Kafka down? reply 503                           │     │      │     order                                                │     │      │                                                          │            │     latest write wins                                    │
│   - e.g. offline: pings wait on the phone                │            │                                                          │     │      │   - e.g. plays the role of the outbox here               │     │      │ STEP 5: Saves in batches                                 │            │   - e.g. rahul, c-501, l-7, 1880                         │
│                                                          │            │ STEP 3: Then saves the resume point and replies          │     │      │                                                          │     │      │   - upsert (insert or overwrite) into Cassandra          │            └──────────────────────────────────────────────────────────┘
│ STEP 3: Gets 204, or 503 and keeps the ping              │            │   - Redis hash; 'watched' only grows (max)               │     │      │ STEP 4, 6: Hands pings to two reader groups              │     │      └──────────────────────────────────────────────────────────┘
│   - 503 means: send it again a moment later              │            │   - e.g. 204 No Content; never waits for Cassandra       │     │      │   - progress-writer and completion-checker               │     │
│   - e.g. the course page shows '42% complete'            │            └──────────────────────────────────────────────────────────┘     │      └──────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────┘                                                                             │                                                                       │
                                                                                                                                         │                                                                       │
                                                                                                                                         │                                                                       │
                                                                                                                                         │                                                                       │
                                                                                                                                         │      ┌── STEP 3 ────────────────────────────────────────────────┐     │      ┌── STEP 6 ────────────────────────────────────────────────┐            ┌── STEP 6, 7 ─────────────────────────────────────────────┐            ┌── STEP 7 ────────────────────────────────────────────────┐            ┌── STEP 7 ────────────────────────────────────────────────┐            ┌── STEP 7 ────────────────────────────────────────────────┐
                                                                                                                                         │      │ Redis  (fast in-memory store)                            │     │      │ Completion Checker                                       │            │ Enrollment DB  (PostgreSQL)                              │            │ Debezium  (Change Data Capture)                          │            │ Kafka  (same Kafka, drawn again)                         │            │ Notification Service                                     │
                                                                                                                                         │      ├──────────────────────────────────────────────────────────┤     │      ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
                                                                                                                                         └────> │ STEP 3: Keeps the resume point for an instant resume     │     └────> │ STEP 6: Lesson almost fully watched?                     │ ─────────> │ STEP 6: Stores completion, certificate and the news      │ ─────────> │ STEP 7: Copies the outbox row into Kafka                 │ ─────────> │ STEP 7: Delivers certificate.issued                      │ ─────────> │ STEP 7: Makes the certificate PDF and emails it          │
                                                                                                                                                │   - HSET progress:rahul:c-501 l-7 {pos, watched}         │            │   - 90% or more -> the lesson is complete                │            │   - certificates UNIQUE (user, course): never twice      │            │   - aggregatetype certificate -> topic                   │            │   - topic certificate.events, group notification         │            │   - saves the PDF link; skips e-3001 if already sent     │
                                                                                                                                                │   - e.g. pos 1880, watched 1880                          │            │   - e.g. l-7 complete                                    │            │   - e.g. lesson_completions, certificates, outbox e-3001 │            │     certificate.events                                   │            │   - e.g. key rahul                                       │            │   - e.g. 'Congratulations, Rahul!'                       │
                                                                                                                                                │                                                          │            │                                                          │            │                                                          │            │   - e.g. e-3001 -> key rahul                             │            └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘
                                                                                                                                                │ STEP 3: Only a fast copy                                 │            │ STEP 6: All lessons done? The course is complete         │            │ STEP 7: Its change log is read by Debezium               │            └──────────────────────────────────────────────────────────┘
                                                                                                                                                │   - rebuilt from Kafka if it is lost                     │            │   - completion + certificate + outbox in ONE transaction │            │   - the WAL (Write-Ahead Log)                            │
                                                                                                                                                └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Kafka                              ▼ Redis                                                     ▼ Cassandra                                                                   ▼ Enrollment DB                                                                                                                                                               ▼ Kafka
╔═══════════════════════════════╗    ╔══════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════╗    ╔══════════════════════════════════╗
║ Kafka message                 ║    ║ Redis key: resume point (hash, one field per lesson) ║    ║ progress (Cassandra) · partition user_id + course_id, sorted by        ║    ║ lesson_completions (Enrollment DB) · key user_id + lesson_id ║    ║ certificates (Enrollment DB) · UNIQUE user_id + course_id ║    ║ outbox (Enrollment DB)            ║    ║ Kafka message                    ║
╟───────────────────────────────╢    ╟──────────────────────────────────────────────────────╢    ║ lesson_id                                                              ║    ╟──────────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────────────╢    ╟───────────────────────────────────╢    ╟──────────────────────────────────╢
║ {                             ║    ║ {                                                    ║    ╟────────────────────────────────────────────────────────────────────────╢    ║ {                                                            ║    ║ {                                                         ║    ║ {                                 ║    ║ {                                ║
║   "topic": "progress.events", ║    ║   "progress:rahul:c-501": {                          ║    ║ {                                                                      ║    ║   "user_id": "rahul",                                        ║    ║   "user_id": "rahul",                                     ║    ║   "id": "e-3001",                 ║    ║   "topic": "certificate.events", ║
║   "key": "rahul",             ║    ║     "l-7": {                                         ║    ║   "user_id": "rahul",                                                  ║    ║   "lesson_id": "l-7",                                        ║    ║   "course_id": "c-501",                                   ║    ║   "aggregatetype": "certificate", ║    ║   "key": "rahul",                ║
║   "headers": {                ║    ║       "pos": 1880,                                   ║    ║   "course_id": "c-501",                                                ║    ║   "completed_at": "10:42"                                    ║    ║   "issued_at": "Fri 18:40",                               ║    ║   "aggregateid": "rahul",         ║    ║   "headers": {                   ║
║     "type": "progress.ping"   ║    ║       "watched": 1880,                               ║    ║   "lesson_id": "l-7",                                                  ║    ║ }                                                            ║    ║   "pdf_url": null                                         ║    ║   "type": "certificate.issued",   ║    ║     "id": "e-3001",              ║
║   },                          ║    ║       "at": "10:42"                                  ║    ║   "position_sec": 1880,                                                ║    ╚══════════════════════════════════════════════════════════════╝    ║ }                                                         ║    ║   "payload": {                    ║    ║     "type": "certificate.issued" ║
║   "value": {                  ║    ║     },                                               ║    ║   "watched_sec": 1880,                                                 ║                                                                        ╚═══════════════════════════════════════════════════════════╝    ║     "user_id": "rahul",           ║    ║   },                             ║
║     "user_id": "rahul",       ║    ║     "l-6": {                                         ║    ║   "updated_at": "10:42"                                                ║                                                                                                                                         ║     "course_id": "c-501"          ║    ║   "value": {                     ║
║     "course_id": "c-501",     ║    ║       "pos": 2400,                                   ║    ║ }                                                                      ║                                                                                                                                         ║   },                              ║    ║     "user_id": "rahul",          ║
║     "lesson_id": "l-7",       ║    ║       "watched": 2400,                               ║    ╚════════════════════════════════════════════════════════════════════════╝                                                                                                                                         ║   "created_at": "Fri 18:40"       ║    ║     "course_id": "c-501"         ║
║     "position_sec": 1880,     ║    ║       "at": "Mon 21:10"                              ║                                                                                                                                                                                                                       ║ }                                 ║    ║   }                              ║
║     "sent_at": "10:42:15"     ║    ║     }                                                ║                                                                                                                                                                                                                       ╚═══════════════════════════════════╝    ║ }                                ║
║   }                           ║    ║   }                                                  ║                                                                                                                                                                                                                                                                ╚══════════════════════════════════╝
║ }                             ║    ║ }                                                    ║
╚═══════════════════════════════╝    ╚══════════════════════════════════════════════════════╝
```

1. **The app sends a ping every 15 seconds**
   - **a) What it sends**
     - `POST /v1/progress {lessonId: l-7, positionSec: 1880}`, plus one when he pauses or closes
     - offline? Pings are stored on the phone and sent later
   - **Data change:** none yet
   - **Why it is hard:** millions of students do the same, a huge stream of tiny updates. We save the latest position **instantly** for resuming, save it **permanently in batches** so the database isn't flooded, and never lose an answered ping, even if a server crashes halfway.
2. **The Progress Service sends the ping to Kafka FIRST and waits for "saved"**
   - **a) Kafka first**
     - Kafka confirms only after all 3 copies are saved (`acks=all`); the key `rahul` keeps his pings in order
   - **b) No confirm?**
     - reply `503`; the phone keeps the ping and sends it again a moment later
   - **c) Why not a normal outbox table here?**
     - an outbox is needed when you must **save a database row AND send an event**; here there is no database row to pair with
     - Redis is only a fast copy that can be rebuilt, so we write the event first, into Kafka, and treat everything else as a copy made from it
     - the old order ("Redis, then Kafka") was the risky one: a crash in between would keep the ping only in Redis, and the permanent record would never get it
   - **Data change:** Kafka topic `progress.events`, key `rahul`, value `{lesson_id: l-7, position_sec: 1880, sent_at: 10:42:15}`
   - **Why Kafka first:** Kafka is the **first safe home** of the ping, so it plays the role of the outbox here. Once Kafka has it, the Progress Writer will save it for sure.
3. **Then it saves the resume point in Redis and replies**
   - **a) Resume point**
     - Redis hash `progress:rahul:c-501`, field `l-7`
     - "watched up to" uses max: if he rewinds to minute 5, the resume position becomes 5:00, but "watched" stays at 31:20
   - **b) Reply**
     - `204 No Content`; it never waits for Cassandra; the course page shows "42% complete"
   - **c) Crash between Kafka and Redis?**
     - the phone got no answer, so it re-sends the same ping; Kafka gets a harmless copy (the newest position wins anyway) and Redis is updated
     - if Redis is lost entirely, it is refilled from Kafka
   - **Data change:** Redis `progress:rahul:c-501` → `l-7 = {pos: 1880, watched: max(old, 1880), at: 10:42}`
   - **Why "max":** progress never goes backwards.
4. **The Progress Writer reads in batches**
   - **a) How**
     - group `progress-writer`; in each 30-second window it keeps only the **newest** ping per (student, lesson)
   - **Data change:** none yet
   - **Why:** two pings become one write, so the database sees far fewer writes than the phones send.
5. **Permanent save in Cassandra**
   - **a) How**
     - upsert (insert or overwrite) in batches; the latest write wins
   - **Data change:** `progress` row upserted `{user_id: rahul, course_id: c-501, lesson_id: l-7, position_sec: 1880, watched_sec: 1880, updated_at: 10:42}`
   - **Why Cassandra:** it is built for a huge number of small writes, and "latest value wins" is exactly what we need.
6. **The Completion Checker: lesson done? course done?**
   - **a) Lesson**
     - group `completion-checker`; has he watched 90% or more of the lesson? Then it is complete; the course percent is updated (e.g. 42%)
   - **b) Course**
     - when all lessons are complete, the certificate is issued
   - **c) One Enrollment DB transaction** (the Enrollment Service owns this database)
     - `BEGIN; INSERT INTO lesson_completions ...; INSERT INTO certificates ...; INSERT INTO outbox ...; COMMIT;`
   - **Data change:**
     - `lesson_completions` row added `{user_id: rahul, lesson_id: l-7, completed_at: 10:42}`
     - (when the whole course is done) `certificates` row added `{user_id: rahul, course_id: c-501, issued_at: Fri 18:40}`, UNIQUE per user + course, so never twice
     - `outbox` row added `{id: e-3001, aggregatetype: certificate, aggregateid: rahul, type: certificate.issued}`
   - **Why the outbox:** without it, a crash after saving the certificate but before telling anyone would leave Rahul with a certificate he never hears about.
7. **Debezium sends the news; the Notification Service emails the certificate**
   - **a) Debezium**
     - reads the Enrollment DB's WAL and routes the row to topic `certificate.events`, key `rahul`
   - **b) Notification Service**
     - makes the certificate PDF, saves its link, and sends the "Congratulations, Rahul!" email
     - remembers event id `e-3001`, so a repeated event never sends a second email
   - **Data change:**
     - Kafka topic `certificate.events`, key `rahul`, headers `{id: e-3001, type: certificate.issued}`
     - `certificates` row updated `pdf_url: certs/rahul-c-501.pdf`
   - **Why a separate service:** making a PDF and sending email are slow and can fail; they must never hold up saving progress.

**Say in the interview:** "Each ping goes to Kafka first with acks=all, then to Redis for an instant resume, and only then do we reply, so an answered ping is never lost. A batch writer keeps the newest per lesson and upserts to Cassandra. Progress only moves forward. The completion and certificate rows are saved with an outbox row in one transaction, and Debezium sends the event that triggers the email."

### Flow 7. Live class (RTMPS in → LL-HLS for the crowd / WebRTC for the stage → recording; outbox → Debezium → Kafka → notifications)

```text
┌── STEP 1, 2, 7 ──────────────────────────────────────────┐            ┌── STEP 1, 2, 7 ──────────────────────────────────────────┐            ┌── STEP 1, 2, 7 ──────────────────────────────────────────┐            ┌── STEP 1, 2 ─────────────────────────────────────────────┐            ┌── STEP 1, 2 ─────────────────────────────────────────────┐            ┌── STEP 1, 2 ─────────────────────────────────────────────┐
│ Priya  (admin page + OBS streaming app)                  │            │ Course Service  (live classes)                           │            │ Course DB  (PostgreSQL)                                  │            │ Debezium  (Change Data Capture)                          │            │ Kafka  (event pipe)                                      │            │ Notification Service                                     │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Creates the live class                           │ ────┬────> │ STEP 1: Saves the class + a reminder event               │ ─────────> │ STEP 1: Stores the class and the news                    │ ─────────> │ STEP 1, 2: Copies the outbox rows into Kafka             │ ─────────> │ STEP 1, 2: Keeps live-12's events in order               │ ─────────> │ STEP 1: Sends reminder emails                            │
│   - POST /v1/live through the API Gateway                │     │      │   - one transaction: live_sessions row + outbox          │            │   - live_sessions insert + outbox insert, one commit     │            │   - aggregatetype live -> topic live.events              │            │   - topic live.events, key live-12                       │            │   - reads live.scheduled                                 │
│   - e.g. gets rtmps://ingest-mumbai... + stream key      │     │      │     live.scheduled                                       │            │   - e.g. live-12 SCHEDULED; outbox live.scheduled        │            │   - e.g. key live-12                                     │            │   - e.g. live.scheduled, then live.started               │            │   - e.g. 'Live Q&A on Thursday at 19:00'                 │
│          sk-12                                           │     │      │   - e.g. live-12, SCHEDULED                              │            │                                                          │            └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘            │                                                          │
│                                                          │     │      │                                                          │            │ STEP 2: Stores LIVE and the news                         │                                                                                                                                                            │ STEP 2: Sends 'Priya is live!'                           │
│ STEP 2: Starts streaming from OBS                        │     │      │ STEP 2: Marks it LIVE when the ingest server reports the │            │   - live_sessions update + outbox insert                 │                                                                                                                                                            │   - reads live.started                                   │
│   - RTMPS (live video over an encrypted connection), key │     │      │         stream                                           │            │   - e.g. live-12 LIVE; outbox e-4001                     │                                                                                                                                                            │   - e.g. push + email to enrolled students               │
│     in the address                                       │     │      │   - the Live Ingest Server calls it; UPDATE + outbox     │            │                                                          │                                                                                                                                                            └──────────────────────────────────────────────────────────┘
│                                                          │     │      │     live.started                                         │            │ STEP 7: Stores ENDED                                     │
│ STEP 7: Stops the stream                                 │     │      │   - e.g. 'Priya is live!'                                │            │   - plus a videos row for the recording                  │
│   - the class is over                                    │     │      │                                                          │            │   - e.g. live-12 ENDED                                   │
└──────────────────────────────────────────────────────────┘     │      │ STEP 7: Marks it ENDED and starts the recording's        │            └──────────────────────────────────────────────────────────┘
                                                                 │      │         conversion                                       │
                                                                 │      │   - a new videos row for the recording -> Flow 1         │
                                                                 │      └──────────────────────────────────────────────────────────┘
                                                                 │
                                                                 │
                                                                 │
                                                                 │      ┌── STEP 2, 3 ─────────────────────────────────────────────┐            ┌── STEP 3, 5 ─────────────────────────────────────────────┐            ┌── STEP 3, 4, 7 ──────────────────────────────────────────┐            ┌── STEP 4 ────────────────────────────────────────────────┐            ┌── STEP 4, 6 ─────────────────────────────────────────────┐            ┌── STEP 6 ────────────────────────────────────────────────┐
                                                                 │      │ Live Ingest Server                                       │            │ Live Transcoder  (live video converter)                  │            │ Live Packager                                            │            │ CloudFront  (live delivery)                              │            │ Students watching live                                   │            │ Chat Service                                             │
                                                                 │      ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
                                                                 └────> │ STEP 2: Checks the stream key                            │ ────┬────> │ STEP 3: Makes high, medium and low quality live          │ ─────────> │ STEP 3: Cuts parts shorter than a second                 │ ────┬────> │ STEP 4: Fetches each part once, serves thousands         │ ─────────> │ STEP 4: Watch about 2-3 seconds behind                   │ ─────────> │ STEP 6: Keeps one open connection per student            │
                                                                        │   - wrong key: disconnected; one streamer per key        │     │      │   - as the video arrives, lined up so players can switch │            │   - keeps the live playlist up to date (LL-HLS, Low-     │     │      │   - same kind of signed cookie as Flow 5: enrolled only  │            │   - the player re-reads the live playlist and fetches    │            │   - WebSocket: messages go both ways at once             │
                                                                        │   - e.g. sk-12 OK                                        │     │      │                                                          │            │     Latency HLS)                                         │     │      │   - e.g. ≈20,000 viewers                                 │            │     tiny parts                                           │            │                                                          │
                                                                        │                                                          │     │      │ STEP 5: Takes in the stage view too                      │            │   - e.g. a part every 0.33 s                             │     │      └──────────────────────────────────────────────────────────┘            │                                                          │            │ STEP 6: Shares each message with the class               │
                                                                        │ STEP 2: Has a backup server ready                        │     │      │   - the audience sees Priya and the students on stage    │            │                                                          │     │                                                                              │ STEP 6: Chat and raise a hand                            │            │   - raised hands are shown to Priya                      │
                                                                        │   - it takes over if this one fails                      │     │      └──────────────────────────────────────────────────────────┘            │ STEP 4: Gives each new part to CloudFront                │     │                                                                              │   - WebSocket to the Chat Service, separate from the     │            └──────────────────────────────────────────────────────────┘
                                                                        │                                                          │     │                                                                              │   - players learn about the part right away              │     │                                                                              │     video                                                │
                                                                        │ STEP 3: Passes the video on                              │     │                                                                              │                                                          │     │                                                                              └──────────────────────────────────────────────────────────┘
                                                                        │   - inside our private network                           │     │                                                                              │ STEP 7: Saves the whole class to S3                      │     │
                                                                        └──────────────────────────────────────────────────────────┘     │                                                                              │   - when the class ends                                  │     │
                                                                                                                                         │                                                                              │   - e.g. recordings/live-12.mp4                          │     │
                                                                                                                                         │                                                                              └──────────────────────────────────────────────────────────┘     │
                                                                                                                                         │                                                                                                                                               │
                                                                                                                                         │                                                                                                                                               │
                                                                                                                                         │                                                                                                                                               │
┌── STEP 5 ────────────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐     │                                                                                                                                               │      ┌── STEP 7 ────────────────────────────────────────────────┐
│ Priya + students on stage  (browser)                     │            │ WebRTC SFU  (Selective Forwarding Unit)                  │     │                                                                                                                                               │      │ Amazon S3  recordings/ folder                            │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤     │                                                                                                                                               │      ├──────────────────────────────────────────────────────────┤
│ STEP 5: Talk in real time                                │ ─────────> │ STEP 5: Forwards each person's video to the others       │ ────┘                                                                                                                                               └────> │ STEP 7: Keeps the recording                              │
│   - WebRTC (Web Real-Time Communication), under half a   │            │   - does not mix, only forwards                          │                                                                                                                                                            │   - it goes through Flow 1 and becomes a normal lesson   │
│     second of delay                                      │            │                                                          │                                                                                                                                                            │   - e.g. recordings/live-12.mp4                          │
│   - e.g. Priya + 5 students on stage                     │            │ STEP 5: Sends a stage view to the transcoder             │                                                                                                                                                            └──────────────────────────────────────────────────────────┘
└──────────────────────────────────────────────────────────┘            │   - so every viewer also sees the conversation           │
                                                                        └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Course DB                                                                                             ▼ Kafka                           ▼ Live Packager                                              ▼ S3 recordings/
╔═════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════╗    ╔════════════════════════════╗    ╔═══════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════════════════╗
║ live_sessions (Course DB) · key live_id ║    ║ outbox (Course DB) · aggregatetype -> Kafka topic ║    ║ Kafka message              ║    ║ live playlist (LL-HLS, made by the Live Packager)     ║    ║ S3 recordings/                                              ║
╟─────────────────────────────────────────╢    ╟───────────────────────────────────────────────────╢    ╟────────────────────────────╢    ╟───────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────────────────╢
║ {                                       ║    ║ {                                                 ║    ║ {                          ║    ║ #EXTM3U                                               ║    ║   recordings/                                               ║
║   "live_id": "live-12",                 ║    ║   "id": "e-4001",                                 ║    ║   "topic": "live.events",  ║    ║ #EXT-X-TARGETDURATION:4                               ║    ║     live-12.mp4       whole live class, saved after it ends ║
║   "course_id": "c-501",                 ║    ║   "aggregatetype": "live",                        ║    ║   "key": "live-12",        ║    ║ #EXT-X-PART-INF:PART-TARGET=0.33                      ║    ╚═════════════════════════════════════════════════════════════╝
║   "location_id": "loc-42",              ║    ║   "aggregateid": "live-12",                       ║    ║   "headers": {             ║    ║ #EXT-X-MEDIA-SEQUENCE:812                             ║
║   "stream_key_hash": "sha256:9c1e...",  ║    ║   "type": "live.started",                         ║    ║     "id": "e-4001",        ║    ║ #EXTINF:4.0,                                          ║
║   "status": "LIVE",                     ║    ║   "payload": {                                    ║    ║     "type": "live.started" ║    ║ seg_812.m4s                                           ║
║   "starts_at": "Thu 19:00"              ║    ║     "live_id": "live-12",                         ║    ║   },                       ║    ║ #EXT-X-PART:DURATION=0.33,URI="seg_813.part0.m4s"     ║
║ }                                       ║    ║     "course_id": "c-501"                          ║    ║   "value": {               ║    ║ #EXT-X-PRELOAD-HINT:TYPE=PART,URI="seg_813.part1.m4s" ║
╚═════════════════════════════════════════╝    ║   },                                              ║    ║     "live_id": "live-12",  ║    ║                                                       ║
                                               ║   "created_at": "Thu 19:00"                       ║    ║     "course_id": "c-501"   ║    ║ no EXT-X-ENDLIST: the list keeps growing              ║
                                               ║ }                                                 ║    ║   }                        ║    ║ CloudFront keeps it only ≈1 second                    ║
                                               ╚═══════════════════════════════════════════════════╝    ║ }                          ║    ╚═══════════════════════════════════════════════════════╝
                                                                                                        ╚════════════════════════════╝
```

1. **Priya creates the live class**
   - **a) What she sends**
     - `POST /v1/live` returns `{ingestUrl: rtmps://ingest-mumbai.edu.com/live, streamKey: sk-12}`
   - **b) One transaction**
     - `live_sessions` row + `outbox` row `live.scheduled`
   - **c) Reminders**
     - Debezium → Kafka `live.events` → the Notification Service sends "Live Q&A on Thursday at 19:00" emails
   - **Data change:**
     - `live_sessions` row added `{live_id: live-12, course_id: c-501, stream_key_hash: sha256:9c1e..., status: SCHEDULED, starts_at: Thu 19:00}`
     - `outbox` row added `{aggregatetype: live, aggregateid: live-12, type: live.scheduled}`
   - **Why it is hard:** thousands of students must see her only a few seconds late, and 5 students on stage must talk with her with almost no delay. Afterwards, the class becomes a normal recorded lesson.
2. **OBS starts streaming; the class goes LIVE**
   - **a) Ingest**
     - OBS sends the video to the Live Ingest Server over RTMPS (live video over an encrypted connection)
     - the server checks `sk-12` and that nobody else is already streaming with it; a backup ingest server can take over if this one fails
   - **b) Status**
     - the ingest server tells the Course Service; it saves LIVE + outbox `live.started` in one transaction
     - Debezium → Kafka → the Notification Service sends "Priya is live!" push and email to enrolled students
   - **Data change:**
     - `live_sessions` row updated `status: SCHEDULED → LIVE`
     - `outbox` row added `{id: e-4001, aggregatetype: live, aggregateid: live-12, type: live.started}`
     - Kafka topic `live.events`, key `live-12`
   - **Why only a hash of the stream key:** if the database leaks, nobody can use the stored value to stream into Priya's class.
3. **The Live Transcoder and Live Packager prepare the video as it arrives**
   - **a) Transcoder**
     - converts the stream into high, medium and low quality **as it arrives**, lined up so players can switch
   - **b) Packager**
     - cuts **parts under 1 second** (every 0.33 s) and keeps updating the live playlist (LL-HLS, Low-Latency HLS)
   - **Data change:** live playlist + parts in the packager's memory/storage
   - **Why tiny parts:** with normal 6-second pieces viewers would be 15-30 seconds behind. Tiny parts bring it down to a few seconds.
4. **CloudFront serves the crowd**
   - **a) How**
     - each new part is fetched from the packager **once** and served to thousands of viewers
     - viewers use the same kind of signed cookie as in Flow 5, so they must be enrolled
     - the player keeps re-reading the live playlist and fetching the tiny parts; the delay is about 2-3 seconds
   - **Data change:** none (CloudFront keeps the live playlist only ≈1 second)
   - **Why LL-HLS and not WebRTC for everyone:** LL-HLS is plain web downloads, so a CDN can copy it to any number of viewers. WebRTC needs a live connection per viewer.
5. **The stage (WebRTC)**
   - **a) Who**
     - up to 5 students join "on stage" from their browser
   - **b) How**
     - the **SFU** (Selective Forwarding Unit) forwards each person's video to the others with under half a second of delay; it does not mix, only forwards
     - it also sends a combined "stage view" into the Live Transcoder, so the whole audience sees the conversation
   - **Data change:** none
   - **Why WebRTC only here:** talking needs under half a second of delay; watching does not.
6. **Chat and raise hand**
   - **a) How**
     - each student keeps a WebSocket (one open connection where messages go both ways) to the **Chat Service**, separate from the video
     - the Chat Service shares each message with the class and shows raised hands to Priya
   - **Data change:** chat messages saved by the Chat Service
   - **Why separate from the video:** a chat problem must never freeze the video, and the other way round.
7. **Priya stops; the recording becomes a normal lesson**
   - **a) Status**
     - the Course Service saves `ENDED`
   - **b) Recording**
     - the Live Packager saves the whole class as `recordings/live-12.mp4` in S3
     - a new `videos` row is added for it, and it goes through **Flow 1** (transcode → HLS → READY)
   - **Data change:**
     - `live_sessions` row updated `status: LIVE → ENDED`
     - S3 object created `recordings/live-12.mp4`
     - `videos` row added for the recording
   - **Why reuse Flow 1:** one pipeline for all recorded video; no second converter to build and maintain.

**Say in the interview:** "RTMPS in, convert live into several qualities, LL-HLS through the CDN for thousands at 2-3 seconds, a WebRTC SFU for the few who talk, and the recording reuses the upload pipeline."

## Key design choices

| Area | Choice | Why (vs alternative) |
|---|---|---|
| Upload | Presigned multipart → S3 | Proxying 2 GB through the API wastes servers and fails on retries |
| Transcode | SQS + chunk-parallel FFmpeg / MediaConvert | Queue absorbs bursts; chunks cut 60 min → ≈5 min |
| Delivery | HLS + CloudFront signed **cookies** | One signature covers 600 segments; signed URLs need rewriting every playlist |
| Video protection | AES-128 HLS encryption (DRM for premium) | Leaked segments are useless; DRM where the tenant pays for it |
| Live | RTMP in → LL-HLS out; WebRTC SFU for stage | LL-HLS scales on CDN at 2–3 s; WebRTC only where < 0.5 s matters |
| Search | Elasticsearch fed by outbox + CDC | Typo tolerance, facets, ranking; Postgres stays the truth |
| Payments | Idempotency keys + webhook as truth + reconciliation | Exactly-once effect over at-least-once networks |
| Progress | Kafka first (`acks=all`), then Redis, then batched Cassandra | Fast resume, smoothed writes, monotonic progress; "Redis then Kafka" could lose a ping on a crash |
| Events | **Every** "save a row + send an event" uses an outbox in the same transaction (Course, Payment, Enrollment DBs) | A direct "save, then send" (dual write) loses the event if the server crashes in between |
| Tenancy | `locationId` on every row / doc / key | HighLevel sub-accounts must never see each other's data |

---

## Deep Dive (only what the flows above did not cover)

**Short forms used below (full names)**

| Short form | Full name / meaning |
|---|---|
| HLS / LL-HLS | HTTP Live Streaming / Low-Latency HLS (Apple's streaming format; video split into small files + a playlist) |
| ABR | Adaptive bitrate (player switches quality based on network speed) |
| CMAF | Common Media Application Format (fMP4 segments usable by HLS and DASH) |
| RTMP(S) | Real-Time Messaging Protocol (over TLS) — what OBS sends |
| WebRTC / SFU | Web Real-Time Communication / Selective Forwarding Unit (forwards streams, doesn't mix) |
| CDN / OAC | Content Delivery Network / Origin Access Control (only CloudFront may read S3) |
| CDC | Change Data Capture (reads the database change log, sends new rows to Kafka) |
| SQS / DLQ | Amazon Simple Queue Service / dead-letter queue (failed jobs) |
| RF=3, acks=all | 3 copies / confirm only after all in-sync copies are saved |
| TTL / SWR | Time to live / stale-while-revalidate (serve old copy while one request refreshes) |
| PK / NX | Primary key / Redis "only if not already set" |
| p99 | 99% of requests are faster than this |
| DAU | Daily active users |

### 1. Back-of-the-envelope (say these early)

| Item | Math | Result |
|---|---|---|
| Watching | 5M DAU × 40 min/day | ≈140k avg, **≈500k peak concurrent streams** |
| Egress | 500k × 2.5 Mbps | **≈1.25 Tbps** → CDN only; S3 sees < 5% |
| Uploads | 5,000 hours of new video/day × ≈2 GB/h | ≈10 TB/day raw; ≈15 TB/day HLS ladder |
| Transcode | 5,000 h × 4 renditions, chunked | ≈300 vCPU-equivalents busy on average; spot autoscaling |
| Progress | 500k / 15 s | **≈33k heartbeats/s** → Redis + Kafka, ≈17k batched DB writes/s |
| Search | 5M × 3 searches/day | ≈175/s avg, ≈1k/s peak → small ES cluster (3 data nodes + replicas) |
| Payments | 100k enrollments/day | ≈1/s avg, **≈200/s in a flash sale** → Postgres is fine; correctness matters more |
| Live | 1,000 classes × 20k viewers | 20M viewers × 3 Mbps worst case → CDN; origin load ≈ per edge, not per viewer |

---

### 2. Data model + indexes

**Rule:** every hot read is a key lookup or one-partition read; tenancy (`location_id`) is part of every key.

```sql
-- Course DB (Postgres, sharded by location_id)
courses(course_id PK, location_id, title, price, status, version, ...)
lessons(lesson_id PK, course_id, position, video_id, is_free_preview)
videos(video_id PK, status, duration_s, key_id, hls_path)
live_sessions(live_id PK, course_id, stream_key_hash, status, starts_at)
outbox(id PK, aggregate_id, type, payload, created_at)
INDEX courses_by_location (location_id, status, course_id)

-- Payment DB (Postgres, owned by Payment Service)
orders(order_id PK, user_id, course_id, amount, currency, status, idem_key, stripe_pi)
  UNIQUE (user_id, idem_key)                   -- the real idempotency guard
processed_events(event_id PK, received_at)     -- Stripe webhook de-dup
outbox(...)

-- Enrollment DB (Postgres, owned by Enrollment Service)
enrollments(user_id, course_id, status, source_order_id)  PK (user_id, course_id)
lesson_completions(user_id, lesson_id, completed_at)      PK (user_id, lesson_id)
certificates(user_id, course_id, issued_at, pdf_url)      PK (user_id, course_id)
outbox(...)                                               -- certificate.issued, saved in the same transaction

-- Progress DB (Cassandra)
progress((user_id, course_id), lesson_id, position_s, watched_to_s, updated_at)
```

| Redis key | Type | Holds |
|---|---|---|
| `ent:{uid}:{courseId}` | STRING (TTL 1 h) | Enrolled? (deleted on refund) |
| `progress:{uid}:{courseId}` | HASH | lessonId → {pos, watchedTo, ts} |
| `idem:{key}` | STRING (TTL 24 h) | `IN_PROGRESS` or saved response |
| `course:{id}` | HASH (TTL 10 min ± jitter) | Course card |
| `streams:{uid}` | ZSET | Active playback sessions (concurrency limit) |

**Elasticsearch `courses` mapping (simplified)**

```json
{ "title": {"type":"text","analyzer":"english","fields":{"suggest":{"type":"completion"}}},
  "tags": {"type":"text"}, "description": {"type":"text"},
  "location_id": {"type":"keyword"}, "level": {"type":"keyword"}, "status": {"type":"keyword"},
  "price": {"type":"scaled_float","scaling_factor":100},
  "rating": {"type":"float"}, "enrollments": {"type":"integer"}, "published_at": {"type":"date"} }
```

---

### 3. Kafka (topics + keys)

| Topic | Key | Why this key |
|---|---|---|
| `course.events` | courseId | One course's publish → edit → unpublish stay in order |
| `video.events` | videoId | READY / FAILED per video in order |
| `payment.events` | userId | Rahul's paid → refunded stay in order |
| `progress.events` | userId | One user's heartbeats in order; spreads load evenly. Written **first**, before Redis |
| `certificate.events` | userId | From the Enrollment DB outbox; one certificate email per event id |
| `live.events` | liveId | Start / stop / recording-ready in order |

- Producer `acks=all`, idempotent producer, RF=3, `min.insync.replicas=2`
- Consumers commit **after** the work; every effect is idempotent (versioned ES writes, PK upserts, `SET`)

---

### 4. Transcoding deep dive

```text
raw/v-88.mp4 ─► probe (codec, duration, resolution)
            ─► split at key frames into 60 × 1-min chunks ─► N workers encode each chunk × 4 qualities
            ─► stitch per quality ─► package HLS (6 s segments, AES-128) ─► hls/v-88/{master,1080p,720p,480p,360p}.m3u8
```

| Rendition | Resolution | Video bitrate | Who gets it |
|---|---|---|---|
| 1080p | 1920×1080 | ≈5 Mbps | Wi-Fi / desktop |
| 720p | 1280×720 | ≈3 Mbps | Good 4G |
| 480p | 854×480 | ≈1.2 Mbps | Average mobile |
| 360p | 640×360 | ≈0.7 Mbps | Weak network |
| audio | — | 96 kbps | Audio-only mode |

- **Segment length tradeoff**: 6 s = fewer requests + better compression; 2 s = faster start / switching (used for live)
- **Per-title encoding**: a slide-heavy screencast looks fine at 720p 1.5 Mbps → cheaper ladder for "talking head + slides" courses (most course content)
- **Idempotent output path** `hls/v-88/` → a retried job overwrites the same files
- **Cost**: spot instances for FFmpeg workers (job is retryable); MediaConvert for simplicity at lower volume

```text
#EXTM3U                                    (master.m3u8)
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
1080p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=3000000,RESOLUTION=1280x720
720p.m3u8
...
#EXT-X-KEY:METHOD=AES-128,URI="https://api.example.com/v1/keys/k-88"   (inside each quality playlist)
```

---

### 5. Secure delivery (signed URLs vs cookies, keys, DRM)

| Option | How | Good for | Weakness |
|---|---|---|---|
| Signed URL | Signature in each URL | Single files (PDF, download) | HLS has 600 URLs → must rewrite every playlist |
| **Signed cookie ✅** | 1 signature for `hls/v-88/*` | HLS / LL-HLS | Cookie domain must match the CDN domain (`cdn.priya-academy.com` per tenant) |
| AES-128 HLS | Segments encrypted; key via our API | Leaked segment files | Key can be captured by a determined user |
| DRM (Widevine / FairPlay) | License server, hardware-backed | Premium tenants | Cost + complexity |

- S3 bucket: Block Public Access + OAC → **only CloudFront** can read
- Cookie TTL 2 h; player refreshes via `/playback` before expiry (long lessons, pause/resume)
- Refund / ban → `DEL ent:…` → next key or cookie refresh fails; existing cookie dies within ≤ 2 h
- Custom domains (HighLevel white-label): one CloudFront distribution with alternate domain names + ACM certificates per tenant domain

---

### 6. Live deep dive (latency budget)

```text
OBS encode ≈0.3 s ─► RTMPS to ingest ≈0.1 s ─► transcode ≈0.5 s ─► package part 0.33 s
   ─► CDN ≈0.1 s ─► player buffer ≈1–1.5 s (3 parts)                     ≈ 2–3 s glass-to-glass
WebRTC on stage: capture ─► SFU ─► peers                                  ≈ 0.2–0.5 s
```

- **Why not WebRTC for all 20,000?** SFU servers must hold a connection + forward every packet per viewer; CDN can't cache WebRTC → costly; LL-HLS reuses the same CDN as recorded video
- **Why not classic HLS?** 6 s segments × 3-segment buffer = 15–30 s → Q&A becomes impossible
- **Scaling SFU**: one room per SFU node; cascade SFUs across regions for bigger "on stage" groups
- **Failure**: primary ingest dies → backup ingest already receiving → origin switches input; players see a short stall, no reconnect
- **Chat at scale**: WebSocket gateways (sticky per connection) + Redis pub/sub per `live-12` channel; 20k viewers × 1 msg/min is small; slow mode + rate limit for spam

---

### 7. Payment state machine

```text
          create                 webhook succeeded              charge.refunded
(none) ──────────► PENDING ───────────────────────────► PAID ──────────────────► REFUNDED
                     │  webhook failed / 30 min timeout                        (enrollment REVOKED)
                     └──────────────────────────────► FAILED / EXPIRED
```

- Every move is `UPDATE … WHERE status = '<expected>'` → a duplicate or out-of-order event changes 0 rows
- **Source of truth = webhook**, not the client redirect ("payment success" page can be faked or never load)
- **Reconciliation job**: every 5 min, orders `PENDING > 10 min` → ask Stripe `GET /payment_intents/pi_55` → apply the same transition
- **Flash sale**: price + coupon validated at order creation and **locked** on the order; seat-limited cohorts use `UPDATE cohorts SET seats_left = seats_left - 1 WHERE seats_left > 0`
- **Free courses** skip Stripe: order `PAID` with amount 0 → same enrollment path (one code path)

---

### 8. Hot spots + thundering herd

| Where | Problem | Fix |
|---|---|---|
| New course launch email to 200k students | Course page + first lesson hit at once | CDN for landing page + segments; Redis card with **lock on miss**; pre-warm CDN by fetching first segments |
| Live class start (20k join in 60 s) | Playback + entitlement burst | Entitlement in Redis; cookies signed locally (no DB); CDN request collapsing |
| Hot cache key expiry | 10k misses → 10k DB reads | **Lease/lock on miss** + TTL jitter + stale-while-revalidate |
| Flash sale checkout | 200 orders/s + webhook burst | Idempotency keys, short transactions, Stripe handles card load, webhooks queued |
| Upload storm after a webinar | 10k transcode jobs | SQS buffer + autoscale on queue depth; priority queue for paid tenants |
| Progress heartbeats at peak | 33k/s | Redis absorbs; Kafka buffers; coalesced batch writes |

---

### 9. Backpressure (end to end)

```text
Client ◄─429─ Gateway ◄─deadline─ Services ─► Kafka (disk buffer) ─pull─► Consumers   (lag ↑ → autoscale)
S3 ─► SQS (queue depth) ─pull─► Transcoding Workers                              (depth ↑ → more spot workers)
Player ◄─ CDN ◄─ Origin Shield ◄─ S3/Origin                                      (collapse identical requests)
```

| Layer | What it does |
|---|---|
| Client | Backoff + jitter on 429/503; progress heartbeats buffered on device |
| Gateway | Per-user / per-tenant rate limits; shed analytics before playback / checkout |
| Services | Bounded pools + deadlines; fail fast (503) rather than queue forever |
| Kafka / SQS | Buffer spikes on disk; consumers pull at their own pace |
| Transcode | Autoscale on queue depth; DLQ after 3 failures |
| Player | ABR drops to 480p/360p when the network is slow instead of stalling |

**Degradation order:** pause search re-ranking → serve cached course cards → delay progress writes (Redis keeps them) → pause emails. **Never** degrade checkout correctness or entitlement checks.

---

### 10. Cache layers

| Layer | What | TTL / invalidation |
|---|---|---|
| Device | Downloaded lessons (offline, encrypted), last progress | Re-validated on reconnect |
| CDN | HLS segments, thumbnails, course landing pages | Segments: 1 year (immutable path); pages: short + invalidated on publish |
| Redis | Entitlements, progress, idempotency, course cards | 1 h / none / 24 h / 10 min ± jitter; DEL via CDC events |
| Elasticsearch | Search read model | Rebuilt from Kafka / Postgres; alias swap |

---

### 11. Failure scenarios

| Failure | What happens |
|---|---|
| Upload interrupted at part 180 | Client resumes from part 180 (`ListParts`); no restart |
| Transcoder crash mid-job | SQS message reappears → retried; same output path; 3 failures → DLQ + alert |
| Stripe webhook delayed 1 h | App shows "processing"; reconciliation job completes the order |
| Webhook delivered twice | `processed_events` PK conflict → 200, no-op |
| Redis node lost | Replica promoted; entitlements re-read from Postgres (with locks); progress replayed from Kafka |
| Progress Service crashes after Kafka, before Redis | The phone got no answer and re-sends; the copy in Kafka is harmless (newest wins) |
| A service crashes right after a database write | The outbox row was in the same transaction, so Debezium still sends the event |
| Elasticsearch cluster down | Search returns "popular courses" from cache; index rebuilt from Kafka replay |
| Kafka broker dies | Leader moves to an in-sync replica; `acks=all` → nothing lost; outbox holds events if Kafka fully down |
| Live ingest server dies | Backup ingest takes over; viewers see a short stall |
| CDN region issue | CloudFront routes to the next edge; Origin Shield protects S3 |
| Signed cookie expired mid-lesson | Player calls `/playback` again silently, continues |

---

### 12. Real-world anchors

- **HighLevel Memberships & Courses**: courses, offers (paid via Stripe), client portal on custom domains, sub-account (`locationId`) tenancy
- **Netflix**: per-title encoding; chunk-parallel encoding pipelines
- **Apple LL-HLS spec**: partial segments, preload hints, blocking playlist reload
- **Stripe**: `Idempotency-Key` header on API requests; webhooks are at-least-once and signed
- **Twitch / YouTube Live**: RTMP ingest → transcode → HLS via CDN
- **Zoom / Google Meet**: SFU architecture for interactive video

---

### 13. End-to-end walk-through: Priya and Rahul

```text
Mon 10:00  Priya uploads l-7       → 250 presigned parts → S3 raw/ → SQS → 60 chunk workers → hls/v-88 (AES) → READY (≈5 min)
Mon 10:10  Priya publishes c-501   → courses + outbox → CDC → course.events → ES doc v7 → searchable in ≈1 s
Tue 20:00  Rahul searches          → ES fuzzy "begginer" → c-501 ranked #1 → cards from Redis (≈120 ms)
Tue 20:02  Rahul taps Buy (twice)  → ik-77 → one order o-301 → Stripe pi_55 (key o-301) → confirms card + 3DS
Tue 20:02  Stripe webhook ×2       → evt_9 stored once → PAID + outbox → Enrollment Service: enrollment + ent:rahul:c-501 = 1 → email
Tue 20:03  Rahul plays l-7         → Redis entitlement → signed cookies (2 h) → CDN master.m3u8 → 720p segments
Tue 20:34  Rahul closes the app    → last heartbeat 1880 s → Kafka (acks=all) → Redis → 204 → Cassandra (batched)
Wed 08:00  Rahul reopens on laptop → GET progress → Redis → resumes at 31:20
Thu 19:00  Priya goes live-12      → OBS RTMPS → transcoder → LL-HLS → CDN → 20k viewers at ≈2.5 s; 5 on stage via WebRTC
Thu 20:00  Class ends              → recordings/live-12.mp4 → Flow 1 transcode → new lesson in c-501
```

---

### 14. Rapid-fire interview Q&A

| Question | Answer |
|---|---|
| How is a 2 GB video uploaded? | Presigned **multipart** URLs; browser → S3 directly; resume failed parts |
| Why HLS? | Plays everywhere over plain HTTP, CDN-cacheable, adaptive bitrate |
| How do you stop link sharing? | Private S3 + OAC, signed cookies (2 h, path-scoped), encrypted segments, key only for enrolled users, stream limit |
| Signed URL or cookie? | Cookie for HLS (hundreds of files); URL for single downloads |
| How do you make transcoding fast? | Chunk the video at key frames, encode chunks in parallel, stitch |
| Live latency? | LL-HLS ≈2–3 s for the crowd; WebRTC SFU < 0.5 s for the on-stage few |
| What if the user is charged twice? | Can't: idempotency key per hop, unique constraints, webhook de-dup, `PENDING → PAID` guard |
| Webhook never arrives? | Reconciliation job polls Stripe for stuck orders |
| How is search kept in sync? | Outbox + CDC → Kafka → indexer with external versioning |
| Progress at 33k writes/s? | Kafka first, then Redis; coalesce 30 s; batched Cassandra upserts; monotonic `watchedTo` |
| Any dual writes left? | No: every row + event pair uses an outbox; progress pings go to Kafka first, so Kafka is their outbox |
| Multi-tenant isolation? | `locationId` in every key, filter and cookie path; per-tenant rate limits |
| Biggest cost? | CDN egress → efficient ladders (per-title), high cache hit ratio, 360p/480p defaults on mobile data |
