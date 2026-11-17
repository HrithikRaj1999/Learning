# Social Media Feed Architecture (Facebook / Instagram style)

> **The one idea to remember: "Build each feed ahead of time, except for celebrities."**
> When a normal person posts, we copy the new post's id into the ready-made feed list of each of their followers (this is called **push**, or "fanout on write"). Opening the app then only means reading one short list from **Redis** (a very fast in-memory store). A celebrity has far too many followers to copy into, so their posts are **pulled** and mixed in at the moment a follower opens the feed. Doing both is called the **hybrid** model.
> Photos and videos never pass through our servers. The phone uploads them **straight to Amazon S3** (file storage) with a temporary signed link, and everyone downloads them from **CloudFront**, Amazon's CDN (Content Delivery Network: servers in many cities that keep copies close to users).
> Deep dive: [Deep Dive](#deep-dive-only-what-the-flows-above-did-not-cover)

## Requirements (minimal)

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

### Functional (what the product does)

</td><td valign="top" width="50%" markdown="1">

### Non-functional (how well it must work)

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Post text with a photo or video**
  - Our server only signs a temporary upload link. The phone uploads the file directly to S3.
    - e.g. Alice uploads a 3 MB photo and posts p-901 "Sunset at Goa".

</td><td valign="top" width="50%" markdown="1">

- **A saved post, like or follow is never lost**
  - The database saves the change and its event together, and Kafka keeps 3 copies of every event.
    - e.g. if Kafka is down for a minute, the events wait safely in the database.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Feed: posts from the people I follow**
  - Newest or best first, 20 posts per page, and a cursor (bookmark) for endless scrolling.
    - e.g. Bob opens the app and sees Alice's p-901 and Celeb's p-902.

</td><td valign="top" width="50%" markdown="1">

- **Feels instant**
  - The feed opens in a blink because it is prepared in advance, and images come from a nearby city.
    - e.g. one page = one read of Bob's list + one "get many posts at once" call.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Like / unlike and comment**
  - One like per person per post, and a like count on every post.
    - e.g. Bob likes p-902, and its count moves from 2,066,000 to 2,066,001.

</td><td valign="top" width="50%" markdown="1">

- **A celebrity must not knock the system over**
  - Pull instead of push for celebrities, split counters, tiny in-server caches and "one refill at a time" locks.
    - e.g. Celeb, with 100 million followers, posts, and nothing slows down.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Follow / unfollow**
  - One-way, Instagram style: Bob can follow Alice without Alice following him back.
    - e.g. Bob follows Alice, and her latest posts appear in his feed right away.

</td><td valign="top" width="50%" markdown="1">

- **Being up matters more than being perfectly exact**
  - A feed or a like count may be a few seconds behind. That is fine for a social app.
    - e.g. Bob sees 2,066,001 likes while the true number is already 2,066,040.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

</td><td valign="top" width="50%" markdown="1">

- **Handles a very large audience**
  - Hundreds of millions of people a day, and hundreds of thousands of feed opens every second at peak.
    - e.g. to grow, we add more servers of the same kind (more Redis machines, more fanout workers).

</td></tr>
</table>

## APIs

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

| Feature | API |
|---|---|
| Upload link | `POST /v1/media/upload-url {type, size}` → `{mediaId, presignedUrl}` |
| Create post | `POST /v1/posts {mediaIds, caption}` + `Idempotency-Key` |
| Feed | `GET /v1/feed?cursor=&limit=20` → `{posts[20], nextCursor}` |

</td><td valign="top" width="50%" markdown="1">

| Feature | API |
|---|---|
| Like / unlike | `PUT` / `DELETE /v1/posts/{postId}/like` |
| Comment | `POST /v1/posts/{postId}/comments` + `Idempotency-Key`; `GET …/comments?cursor=` |
| Follow / unfollow | `PUT` / `DELETE /v1/users/{userId}/follow` |

</td></tr></table>

## Diagram

A quick map of all the parts and how they connect. Arrows (`──>`) show which way requests or data move; the line on top skips columns (Bob's feed request goes from the API Gateway straight to the Feed Service). What each store keeps is in **Schema Overview**; each flow below walks through one piece.

```text
                                                              ┌─── feed request ──> Feed Service ─────────────>───────────────────────────────────────>───────────────────────────────────────>───────────────────────────────────────>───────────────────────────────────────>───────────────────────────────────────>───────────────────────────┐
                                                              │                                                                                                                                                                                                                                                                                   │
                                                              ^                                                                                                                                                                                                                                                                                   v
┌──────────────────────────────┐              ┌───────────────┴──────────────┐              ┌──────────────────────────────┐              ┌──────────────────────────────┐              ┌──────────────────────────────┐              ┌──────────────────────────────┐              ┌──────────────────────────────┐              ┌───────────────┬──────────────┐              ┌──────────────────────────────┐
│ Bob (mobile app)             │ ─────┬─────> │ API Gateway                  │ ─────┬─────> │ Like + Comment Service       │ ───────────> │ Cassandra (engagement)       │ ─────┬─────> │ Kafka (events)               │ ─────┬─────> │ Flink (counter)              │ ───────────> │ Post Cache (Redis)           │ ─────┬─────> │ Feed Service                 │ ───────────> │ Bob's feed screen            │
├──────────────────────────────┤      │       ├──────────────────────────────┤      │       ├──────────────────────────────┤              ├──────────────────────────────┤      │       ├──────────────────────────────┤      │       ├──────────────────────────────┤              ├──────────────────────────────┤      │       ├──────────────────────────────┤              ├──────────────────────────────┤
│ - feed, likes, comments      │      │       │ - check login + rate limit   │      │       │ - saves likes + comments     │              │ - user_likes, comments       │      │       │ - post, like, comment events │      │       │ - adds up likes in batches   │              │ - post details + counts      │      │       │ - Bob's list + celeb posts   │              │ - final list of posts        │
└──────────────────────────────┘      │       │ - route the call             │      │       │ - event saved in same batch  │              │ - outbox (relay -> Kafka)    │      │       │ - kept 7 days, 3 copies      │      │       └──────────────────────────────┘              │ - first page of comments     │      │       │ - fills details from cache   │              └──────────────────────────────┘
                                      │       └──────────────────────────────┘      │       └──────────────────────────────┘              │ - post_stats (counts)        │      │       └──────────────────────────────┘      │                                                     │ - miss lock                  │      │       └──────────────────────────────┘
                                      │                                             │                                                     └──────────────────────────────┘      │                                             │                                                     └──────────────────────────────┘      │
                                      │                                             │                                                                                           │                                             │                                                                                           │
                                      │                                             │                                                                                           │                                             │                                                                                           │
                                      │                                             │                                                                                           │                                             │                                                                                           │
┌──────────────────────────────┐      │                                             │       ┌──────────────────────────────┐              ┌──────────────────────────────┐      │                                             │       ┌──────────────────────────────┐              ┌──────────────────────────────┐      │
│ Celeb (mobile app)           │ ─────┤                                             ├─────> │ Post Service                 │ ───────────> │ Post DB (PostgreSQL)         │ ─────┤                                             ├─────> │ Fanout Workers               │ ───────────> │ Feed Cache (Redis)           │ ─────┘
├──────────────────────────────┤      │                                             │       ├──────────────────────────────┤              ├──────────────────────────────┤      │                                             │       ├──────────────────────────────┤              ├──────────────────────────────┤
│ - millions of followers      │      │                                             │       │ - saves new posts            │              │ - posts, media               │      │                                             │       │ - post id -> follower feeds  │              │ - feed:bob = post ids        │
└──────────────────────────────┘      │                                             │       │ - gives S3 upload links      │              │ - outbox                     │      │                                             │       │ - skips celebrities          │              │ - celebrity recent posts     │
                                      │                                             │       └──────────────────────────────┘              └──────────────────────────────┘      │                                             │       └──────────────────────────────┘              └──────────────────────────────┘
                                      │                                             │                                                                                           │                                             │
                                      │                                             │                                                                                           │                                             │
                                      │                                             │                                                                                           │                                             │
                                      │                                             │       ┌──────────────────────────────┐              ┌──────────────────────────────┐      │                                             │       ┌──────────────────────────────┐              ┌──────────────────────────────┐
                                      │                                             └─────> │ Follow Service               │ ───────────> │ Graph DB (PostgreSQL)        │ ─────┘                                             └─────> │ Notification Service         │ ───────────> │ Phones (push alerts)         │
                                      │                                                     ├──────────────────────────────┤              ├──────────────────────────────┤                                                            ├──────────────────────────────┤              ├──────────────────────────────┤
                                      │                                                     │ - follow / unfollow          │              │ - users                      │                                                            │ - push alerts                │              │ - 'Alice posted'             │
                                      │                                                     └──────────────────────────────┘              │ - following, followers       │                                                            └──────────────────────────────┘              └──────────────────────────────┘
                                      │                                                                                                   │ - outbox                     │
                                      │                                                                                                   └──────────────────────────────┘
                                      │
                                      │
                                      │
┌──────────────────────────────┐      │       ┌──────────────────────────────┐              ┌──────────────────────────────┐              ┌──────────────────────────────┐              ┌──────────────────────────────┐              ┌──────────────────────────────┐
│ Alice (web)                  │ ─────┴─────> │ S3 raw/ (uploads)            │ ───────────> │ Media Workers                │ ───────────> │ S3 processed/                │ ───────────> │ CloudFront (CDN)             │ ───────────> │ Phones (images)              │
├──────────────────────────────┤              ├──────────────────────────────┤              ├──────────────────────────────┤              ├──────────────────────────────┤              ├──────────────────────────────┤              ├──────────────────────────────┤
│ - posts photos               │              │ - photo as uploaded          │              │ - resize + compress photos   │              │ - ready-to-show sizes        │              │ - photo copies near users    │              │ - load the photos            │
└──────────────────────────────┘              │ - never shown                │              └──────────────────────────────┘              └──────────────────────────────┘              └──────────────────────────────┘              └──────────────────────────────┘
                                              └──────────────────────────────┘
```

## Schema Overview

What every store keeps, as one real example per box (Alice's post p-901, Bob's like and comment, Celeb's post p-902). Where a field can take several values, they are shown as `"A" or "B"`. Each row scrolls sideways.

### PostgreSQL: Post Database (posts, media, outbox)

```text
╔═══════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════════════╗
║ posts (Post DB) · key post_id · index author_id + post_id ║    ║ media (Post DB) · key media_id                    ║    ║ outbox (Post DB) · aggregatetype -> topic, aggregateid -> key ║
╟───────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────────────────╢
║ {                                                         ║    ║ {                                                 ║    ║ {                                                             ║
║   "post_id": "p-901",                                     ║    ║   "media_id": "m-77",                             ║    ║   "id": "e-1001",                                             ║
║   "author_id": "alice",                                   ║    ║   "owner_id": "alice",                            ║    ║   "aggregatetype": "post",                                    ║
║   "caption": "Sunset at Goa",                             ║    ║   "type": "photo" or "video",                     ║    ║   "aggregateid": "alice",                                     ║
║   "media_ids": ["m-77"],                                  ║    ║   "status": "UPLOADING" or "READY" or "REJECTED", ║    ║   "type": "post.created" or "post.deleted",                   ║
║   "status": "ACTIVE" or "DELETED",                        ║    ║   "raw_key": "raw/m-77.jpg",                      ║    ║   "payload": {                                                ║
║   "created_at": "09:30"                                   ║    ║   "processed_prefix": "processed/m-77/"           ║    ║     "post_id": "p-901",                                       ║
║ }                                                         ║    ║ }                                                 ║    ║     "author_id": "alice",                                     ║
╚═══════════════════════════════════════════════════════════╝    ╚═══════════════════════════════════════════════════╝    ║     "media_ids": ["m-77"]                                     ║
                                                                                                                          ║   },                                                          ║
                                                                                                                          ║   "created_at": "09:30"                                       ║
                                                                                                                          ║ }                                                             ║
                                                                                                                          ╚═══════════════════════════════════════════════════════════════╝
```

### PostgreSQL: Follower Graph Database (users, following, followers, outbox)

```text
╔══════════════════════════════════╗    ╔══════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════╗
║ users (Graph DB) · key user_id   ║    ║ following (Graph DB) · key follower_id + followee_id ║    ║ followers (Graph DB) · key followee_id + follower_id ║    ║ outbox (Graph DB) · aggregatetype -> topic, aggregateid -> key ║
╟──────────────────────────────────╢    ╟──────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────╢
║ {                                ║    ║ {                                                    ║    ║ {                                                    ║    ║ {                                                              ║
║   "user_id": "celeb",            ║    ║   "follower_id": "bob",                              ║    ║   "followee_id": "alice",                            ║    ║   "id": "e-2001",                                              ║
║   "name": "Celeb",               ║    ║   "followee_id": "alice",                            ║    ║   "follower_id": "bob"                               ║    ║   "aggregatetype": "follow",                                   ║
║   "follower_count": 100000000,   ║    ║   "created_at": "09:00"                              ║    ║ }                                                    ║    ║   "aggregateid": "bob",                                        ║
║   "is_celebrity": true or false, ║    ║ }                                                    ║    ╚══════════════════════════════════════════════════════╝    ║   "type": "follow.created" or "follow.deleted",                ║
║   "last_active_at": "09:29"      ║    ╚══════════════════════════════════════════════════════╝                                                                ║   "payload": {                                                 ║
║ }                                ║                                                                                                                            ║     "follower_id": "bob",                                      ║
╚══════════════════════════════════╝                                                                                                                            ║     "followee_id": "alice"                                     ║
                                                                                                                                                                ║   },                                                           ║
                                                                                                                                                                ║   "created_at": "09:00"                                        ║
                                                                                                                                                                ║ }                                                              ║
                                                                                                                                                                ╚════════════════════════════════════════════════════════════════╝
```

### Apache Cassandra: Engagement Database (likes, comments, counts, outbox)

```text
╔════════════════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════╗
║ user_likes (Cassandra) · partition user_id · key user_id + post_id ║    ║ comments (Cassandra) · partition post_id + day · sorted by comment_id ║    ║ post_stats (Cassandra) · key post_id · totals written by Flink ║    ║ like_outbox (Cassandra) · partition shard + minute · sorted by         ║    ║ comment_outbox (Cassandra) · partition shard + minute · sorted by      ║
╟────────────────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────╢    ║ event_id                                                               ║    ║ event_id                                                               ║
║ {                                                                  ║    ║ {                                                                     ║    ║ {                                                              ║    ╟────────────────────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────────╢
║   "user_id": "bob",                                                ║    ║   "post_id": "p-901",                                                 ║    ║   "post_id": "p-902",                                          ║    ║ {                                                                      ║    ║ {                                                                      ║
║   "post_id": "p-902",                                              ║    ║   "day": "2026-11-13",                                                ║    ║   "likes": 2066001,                                            ║    ║   "shard": 7,                                                          ║    ║   "shard": 3,                                                          ║
║   "liked_at": "09:31"                                              ║    ║   "comment_id": "cm-501",                                             ║    ║   "comments": 48210                                            ║    ║   "minute": "09:31",                                                   ║    ║   "minute": "09:32",                                                   ║
║ }                                                                  ║    ║   "author_id": "bob",                                                 ║    ║ }                                                              ║    ║   "event_id": "e-5001",                                                ║    ║   "event_id": "e-6001",                                                ║
╚════════════════════════════════════════════════════════════════════╝    ║   "text": "Beautiful!",                                               ║    ╚════════════════════════════════════════════════════════════════╝    ║   "topic": "like.events",                                              ║    ║   "topic": "comment.events",                                           ║
                                                                          ║   "created_at": "09:32"                                               ║                                                                          ║   "key": "bob",                                                        ║    ║   "key": "p-901",                                                      ║
                                                                          ║ }                                                                     ║                                                                          ║   "type": "like.created" or "like.deleted",                            ║    ║   "type": "comment.created",                                           ║
                                                                          ╚═══════════════════════════════════════════════════════════════════════╝                                                                          ║   "payload": {                                                         ║    ║   "payload": {                                                         ║
                                                                                                                                                                                                                             ║     "user_id": "bob",                                                  ║    ║     "post_id": "p-901",                                                ║
                                                                                                                                                                                                                             ║     "post_id": "p-902"                                                 ║    ║     "comment_id": "cm-501",                                            ║
                                                                                                                                                                                                                             ║   }                                                                    ║    ║     "author_id": "bob",                                                ║
                                                                                                                                                                                                                             ║ }                                                                      ║    ║     "post_author": "alice"                                             ║
                                                                                                                                                                                                                             ╚════════════════════════════════════════════════════════════════════════╝    ║   }                                                                    ║
                                                                                                                                                                                                                                                                                                           ║ }                                                                      ║
                                                                                                                                                                                                                                                                                                           ╚════════════════════════════════════════════════════════════════════════╝
```

### Redis: Feed Cache + Post Cache

```text
╔═══════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════╗    ╔════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════╗    ╔════════════════════════════════════╗    ╔═════════════════════════════════════════╗    ╔══════════════════════════════════════════════╗
║ Redis key: Bob's feed · sorted set            ║    ║ Redis key: a celebrity's recent posts · sorted set ║    ║ Redis key: celebrities Bob follows · set ║    ║ Redis key: repeat-safe request             ║    ║ Redis key: post details · hash                  ║    ║ Redis key: counts · hash           ║    ║ Redis key: miss lock (lease)            ║    ║ Redis key: first page of comments · list     ║
╟───────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────╢    ╟────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────╢    ╟────────────────────────────────────╢    ╟─────────────────────────────────────────╢    ╟──────────────────────────────────────────────╢
║ feed:bob = [p-901, p-880, p-871, ...]         ║    ║ author_recent:celeb = [p-902, p-850, ...]          ║    ║ celebs_followed:bob = {celeb}            ║    ║ idem:k-123 = {                             ║    ║ post:p-902 = {                                  ║    ║ stats:p-902 = {                    ║    ║ lease:post:p-902 = pod-17               ║    ║ comments:p-901:page1 = [cm-501, cm-498, ...] ║
║ (score = post id, newest first;               ║    ║ (newest 100; only celebrities have one)            ║    ╚══════════════════════════════════════════╝    ║   "status": 201,                           ║    ║   "author": "celeb",                            ║    ║   "likes": 2066001,                ║    ║ (set only if not there yet: one winner; ║    ║ (fresh 60 s, may be served old up to 10 min) ║
║  newest 500 kept, dropped after 30 idle days) ║    ╚════════════════════════════════════════════════════╝                                                    ║   "postId": "p-901"                        ║    ║   "caption": "New song out!",                   ║    ║   "comments": 48210                ║    ║  expires in 2 seconds)                  ║    ╚══════════════════════════════════════════════╝
╚═══════════════════════════════════════════════╝                                                                                                              ║ }                                          ║    ║   "image": "cdn.example.com/m-90/640.c3d4.webp" ║    ║ }                                  ║    ╚═════════════════════════════════════════╝
                                                                                                                                                               ║ (set only if not there yet, kept 24 hours) ║    ║ }                                               ║    ║ (overwritten with totals by Flink) ║
                                                                                                                                                               ╚════════════════════════════════════════════╝    ║ (expires in ≈1 hour ± a random extra)           ║    ╚════════════════════════════════════╝
                                                                                                                                                                                                                 ╚═════════════════════════════════════════════════╝
```

### Apache Kafka: topics, a sample message, and the Debezium (Change Data Capture) settings

```text
╔════════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════╗
║ Kafka topics                                               ║    ║ Kafka message                                                          ║    ║ Debezium settings (Change Data Capture)          ║
╟────────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────╢
║ topic            key        types                          ║    ║ {                                                                      ║    ║ table.include.list = public.outbox               ║
║ post.events      author     post.created, post.deleted     ║    ║   "topic": "post.events" or "follow.events" or "like.events" or        ║    ║   (watch only the outbox table)                  ║
║ follow.events    follower   follow.created, follow.deleted ║    ║       "comment.events",                                                ║    ║ transforms.outbox.type =                         ║
║ like.events      user       like.created, like.deleted     ║    ║   "key": "alice",                                                      ║    ║   io.debezium.transforms.outbox.EventRouter      ║
║ comment.events   post       comment.created                ║    ║   "headers": {                                                         ║    ║   (turn each row into a clean message)           ║
║                                                            ║    ║     "id": "e-1001",                                                    ║    ║ transforms.outbox.route.by.field = aggregatetype ║
║ (key = what must stay in order and spread the load;        ║    ║     "type": "post.created" or "post.deleted"                           ║    ║   (this column picks the topic)                  ║
║  kept 7 days, 3 copies)                                    ║    ║   },                                                                   ║    ║ transforms.outbox.route.topic.replacement =      ║
╚════════════════════════════════════════════════════════════╝    ║   "value": {                                                           ║    ║   ${routedByValue}.events                        ║
                                                                  ║     "post_id": "p-901",                                                ║    ║   (post -> post.events, follow -> follow.events) ║
                                                                  ║     "author_id": "alice",                                              ║    ╚══════════════════════════════════════════════════╝
                                                                  ║     "media_ids": ["m-77"]                                              ║
                                                                  ║   }                                                                    ║
                                                                  ║ }                                                                      ║
                                                                  ╚════════════════════════════════════════════════════════════════════════╝
```

### Amazon S3 objects: raw (uploaded) vs processed (ready to serve), and the job queue message

```text
╔════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════════╗    ╔════════════════════════════════╗
║ S3 raw/ = what the user uploaded (never served)        ║    ║ S3 processed/ = ready to serve (CloudFront's origin)      ║    ║ job queue message (Amazon SQS) ║
╟────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────────────╢    ╟────────────────────────────────╢
║ social-media/                                          ║    ║ social-media/                                             ║    ║ {                              ║
║   raw/                                                 ║    ║   processed/m-77/                                         ║    ║   "event": "ObjectCreated",    ║
║     m-77.jpg          Alice's photo, 3 MB              ║    ║     150.a1b2.webp     small, for the profile grid         ║    ║   "bucket": "social-media",    ║
║     m-88.mp4          a video, uploaded in parts       ║    ║     640.a1b2.webp     feed size                           ║    ║   "key": "raw/m-77.jpg",       ║
║                                                        ║    ║     1080.a1b2.webp    full screen                         ║    ║   "size": "3 MB"               ║
║ (private: only presigned links and the workers use it; ║    ║     blur.a1b2.jpg     tiny blurry preview                 ║    ║ }                              ║
║  any size or format the phone sends)                   ║    ║   processed/m-88/                                         ║    ╚════════════════════════════════╝
╚════════════════════════════════════════════════════════╝    ║     master.m3u8       video: list of qualities            ║
                                                              ║     360p/ ... 1080p/  video pieces                        ║
                                                              ║                                                           ║
                                                              ║ (private: only CloudFront may read it, OAC;               ║
                                                              ║  the name has a content fingerprint, so it never changes) ║
                                                              ╚═══════════════════════════════════════════════════════════╝
```

### Media variants (photo sizes + video playlist)

```text
╔═════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════╗
║ media variants (what the workers make)              ║    ║ video master playlist (processed/m-88/master.m3u8)       ║
╟─────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────╢
║ photo m-77:                                         ║    ║ #EXTM3U                                                  ║
║   blur   tiny, shown instantly while loading        ║    ║ #EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360    ║
║   150    profile grid square                        ║    ║ 360p/index.m3u8                                          ║
║   640    normal feed size                           ║    ║ #EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=854x480   ║
║   1080   full screen / zoom                         ║    ║ 480p/index.m3u8                                          ║
║                                                     ║    ║ #EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720  ║
║ video m-88:                                         ║    ║ 720p/index.m3u8                                          ║
║   360p, 480p, 720p, 1080p   cut into small pieces   ║    ║ #EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080 ║
║   master.m3u8 lists them; the player switches       ║    ║ 1080p/index.m3u8                                         ║
║   quality as the network changes                    ║    ║                                                          ║
║                                                     ║    ║ (the player reads this first, then picks a quality)      ║
║ (the phone picks the smallest one that looks sharp; ║    ╚══════════════════════════════════════════════════════════╝
║  WebP = a small modern image format)                ║
╚═════════════════════════════════════════════════════╝
```

### CloudFront (CDN): URL to S3, cache times, signed or unsigned

```text
╔═══════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════╗
║ CloudFront (CDN) = how a URL reaches S3                   ║    ║ access rules (signed or not?)                     ║
╟───────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────╢
║ cdn.example.com/*  ->  origin S3 social-media/processed/* ║    ║ download (unsigned, public posts):                ║
║                                                           ║    ║   https://cdn.example.com/m-77/640.a1b2.webp      ║
║ GET https://cdn.example.com/m-77/640.a1b2.webp            ║    ║                                                   ║
║   edge Mumbai: cached?  yes -> send it                    ║    ║ upload (signed by Post Service, 15 minutes):      ║
║                        no  -> ask Origin Shield           ║    ║   PUT https://social-media.s3.amazonaws.com/      ║
║   Origin Shield: cached? no -> read S3, keep, send        ║    ║       raw/m-77.jpg?X-Amz-Expires=900              ║
║                                                           ║    ║       &X-Amz-Signature=...                        ║
║ cache time:                                               ║    ║                                                   ║
║   images + video pieces   1 year (never change)           ║    ║ (S3 stays private: only CloudFront reads it, OAC) ║
║   Cache-Control: public, max-age=31536000, immutable      ║    ╚═══════════════════════════════════════════════════╝
╚═══════════════════════════════════════════════════════════╝
```

## Flows (the big diagram, one piece at a time)

Each flow is one slice of the big diagram. Every box says what it does in each step (`STEP n: what`, then how, then an example). Arrows go straight from box to box. Under each diagram, **Data in this flow** shows the rows, keys and messages that flow writes, side by side (scroll sideways). The numbered steps below match the `STEP n` in the boxes.

### Flow 1. Alice uploads a photo → it is ready to show everywhere (presigned link → S3 → job queue → workers → CloudFront)

```text
                              ┌─── STEP 2: the browser PUTs the photo straight into S3 raw/ (our servers never touch it) ─────────────────────────────────────>───────────────────────────────────────>───────────────────────────────────────>───────┐
                              │                                                                                                                                                                                                                       │
                              ^                                                                                                                                                                                                                       v
┌── STEP 1, 2 ────────────────┴────────────────────────────┐            ┌── STEP 1 ────────────────────────────────────────────────┐            ┌── STEP 1 ────────────────────────────────────────────────┐            ┌── STEP 2, 3 ────────────────┬────────────────────────────┐            ┌── STEP 3, 4 ─────────────────────────────────────────────┐            ┌── STEP 4 ────────────────────────────────────────────────┐            ┌── STEP 4, 5 ─────────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐
│ Alice  (web browser)                                     │            │ API Gateway  (front door)                                │            │ Post Service                                             │            │ Amazon S3  raw/ folder  (private)                        │            │ Amazon SQS  (Simple Queue Service, the job queue)        │            │ Media Processing Workers                                 │            │ Amazon S3  processed/ folder  (private)                  │            │ CloudFront  (CDN, Content Delivery Network)              │            │ Bob's phone  (feed screen)                               │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Asks for an upload link                          │ ─────────> │ STEP 1: Checks login + rate limit, then routes           │ ─────────> │ STEP 1: Signs a presigned upload link                    │ ────┐      │ STEP 2: Stores the uploaded photo                        │ ─────────> │ STEP 3: Holds the job until a worker finishes it         │ ─────────> │ STEP 4: Makes the ready-to-serve copies                  │ ────┬────> │ STEP 4: Keeps the ready copies                           │ ─────────> │ STEP 5: Serves the photo from near the viewer            │ ─────────> │ STEP 5: Shows the blurry preview, then the photo         │
│   - POST /v1/media/upload-url {type: jpg, size: 3 MB}    │            │   - /v1/media/* -> Post Service (gRPC, short time limit) │            │   - AWS code library getSignedUrl(PutObject): pure math, │     │      │   - checks the link's signature itself, never calls us   │            │   - a million uploads at once just make the queue longer │            │   - 150, 640 and 1080 pixel WebP images + a tiny blurry  │     │      │   - the name holds a content fingerprint, so a file      │            │   - cache hit: answers by itself, keeps it 1 year        │            │   - GET https://cdn.example.com/m-77/640.a1b2.webp       │
│   - e.g. gets {mediaId: m-77, presignedUrl}              │            │   - e.g. user id alice taken from the login token        │            │     S3 is not called                                     │     │      │   - e.g. raw/m-77.jpg, 3 MB                              │            │   - e.g. message: process raw/m-77.jpg                   │            │     preview                                              │     │      │     never changes                                        │            │   - e.g. Bob in Pune -> the Mumbai edge server           │            │   - e.g. keeps both on the phone for scrolling back      │
│                                                          │            └──────────────────────────────────────────────────────────┘            │   - e.g. only raw/m-77.jpg, 15 minutes, at most 30 MB    │     │      │                                                          │            │                                                          │            │   - a video -> 360p to 1080p streaming pieces            │     │      │   - e.g. processed/m-77/640.a1b2.webp                    │            │                                                          │            └──────────────────────────────────────────────────────────┘
│ STEP 2: Uploads the photo straight to S3                 │                                                                                    │                                                          │     │      │ STEP 3: Announces the new file                           │            │ STEP 4: Hands the job to one worker                      │            │   - e.g. 640.a1b2.webp: a1b2 = fingerprint of the        │     │      │                                                          │            │ STEP 5: On a miss: Origin Shield, then S3                │
│   - PUT <presignedUrl> with the 3 MB file; our servers   │                                                                                    │ STEP 1: Saves the media row                              │     │      │   - S3 event notification on raw/ -> Amazon SQS          │            │   - hidden while worked on; comes back if the worker     │            │          content                                         │     │      │ STEP 5: Lets only CloudFront read                        │            │   - one shared middle cache per region                   │
│     never touch it                                       │                                                                                    │   - INSERT INTO media, status UPLOADING                  │     │      │   - e.g. ObjectCreated for raw/m-77.jpg                  │            │     crashes                                              │            │                                                          │     │      │   - OAC (Origin Access Control) refuses everyone else    │            │   - e.g. a viral photo = one S3 read                     │
│   - e.g. a big video goes in 8 MB parts, sent side by    │                                                                                    │   - e.g. m-77 owned by alice                             │     │      └──────────────────────────────────────────────────────────┘            │   - e.g. 5 failures -> dead-letter queue + alert         │            │ STEP 4: Checks safety, then marks the media READY        │     │      │   - e.g. read only on a CloudFront cache miss            │            └──────────────────────────────────────────────────────────┘
│          side                                            │                                                                                    └──────────────────────────────────────────────────────────┘     │                                                                              └──────────────────────────────────────────────────────────┘            │   - unsafe -> REJECTED, never shown                      │     │      └──────────────────────────────────────────────────────────┘
└──────────────────────────────────────────────────────────┘                                                                                                                                                     │                                                                                                                                                      │   - e.g. UPDATE media SET status = READY for m-77        │     │
                                                                                                                                                                                                                 │                                                                                                                                                      └──────────────────────────────────────────────────────────┘     │
                                                                                                                                                                                                                 │                                                                                                                                                                                                                       │
                                                                                                                                                                                                                 │                                                                                                                                                                                                                       │
                                                                                                                                                                                                                 │                                                                                                                                                                                                                       │
                                                                                                                                                                                                                 │      ┌── STEP 1 ────────────────────────────────────────────────┐                                                                                                                                                     │      ┌── STEP 4 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                 │      │ Post Database  (PostgreSQL)                              │                                                                                                                                                     │      │ Post Database  (same database, drawn again)              │
                                                                                                                                                                                                                 │      ├──────────────────────────────────────────────────────────┤                                                                                                                                                     │      ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                 └────> │ STEP 1: Remembers the upload has started                 │                                                                                                                                                     └────> │ STEP 4: Marks the media ready                            │
                                                                                                                                                                                                                        │   - media row added                                      │                                                                                                                                                            │   - media row updated; a post may now use it             │
                                                                                                                                                                                                                        │   - e.g. m-77: photo, UPLOADING, raw/m-77.jpg            │                                                                                                                                                            │   - e.g. m-77: UPLOADING -> READY                        │
                                                                                                                                                                                                                        └──────────────────────────────────────────────────────────┘                                                                                                                                                            └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Post DB                                      ▼ S3 raw/                                             ▼ SQS                                 ▼ S3 processed/                                             ▼ Post DB                                      ▼ CloudFront
╔═════════════════════════════════════════╗    ╔════════════════════════════════════════════════╗    ╔════════════════════════════════╗    ╔══════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════╗    ╔══════════════════════════════════╗
║ media (Post DB) · key media_id          ║    ║ S3 files: raw/ (as uploaded)                   ║    ║ job queue message (Amazon SQS) ║    ║ S3 files: processed/ (ready to serve)                ║    ║ media (Post DB) · key media_id          ║    ║ CloudFront cache (per city)      ║
╟─────────────────────────────────────────╢    ╟────────────────────────────────────────────────╢    ╟────────────────────────────────╢    ╟──────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────╢    ╟──────────────────────────────────╢
║ {                                       ║    ║ raw/m-77.jpg     original photo, 3 MB, private ║    ║ {                              ║    ║ processed/m-77/150.a1b2.webp    small (profile grid) ║    ║ {                                       ║    ║ m-77/640.a1b2.webp   kept 1 year ║
║   "media_id": "m-77",                   ║    ╚════════════════════════════════════════════════╝    ║   "event": "ObjectCreated",    ║    ║ processed/m-77/640.a1b2.webp    feed size            ║    ║   "media_id": "m-77",                   ║    ║ m-77/blur.a1b2.jpg   kept 1 year ║
║   "owner_id": "alice",                  ║                                                          ║   "bucket": "social-media",    ║    ║ processed/m-77/1080.a1b2.webp   full screen          ║    ║   "owner_id": "alice",                  ║    ╚══════════════════════════════════╝
║   "type": "photo",                      ║                                                          ║   "key": "raw/m-77.jpg",       ║    ║ processed/m-77/blur.a1b2.jpg    tiny blurry preview  ║    ║   "type": "photo",                      ║
║   "status": "UPLOADING",                ║                                                          ║   "size": "3 MB"               ║    ╚══════════════════════════════════════════════════════╝    ║   "status": "READY",                    ║
║   "raw_key": "raw/m-77.jpg",            ║                                                          ║ }                              ║                                                                ║   "raw_key": "raw/m-77.jpg",            ║
║   "processed_prefix": "processed/m-77/" ║                                                          ╚════════════════════════════════╝                                                                ║   "processed_prefix": "processed/m-77/" ║
║ }                                       ║                                                                                                                                                            ║ }                                       ║
╚═════════════════════════════════════════╝                                                                                                                                                            ╚═════════════════════════════════════════╝
```

1. **Alice asks for an upload link, and the Post Service signs one**
   - **a) The request**
     - `POST /v1/media/upload-url {type: jpg, size: 3 MB}` through the API Gateway
   - **b) Signing the link**
     - the Post Service uses the AWS (Amazon Web Services) code library: `getSignedUrl(PutObject)` makes a **presigned URL**
     - pure math on our server with our secret key; S3 is not even called, so it takes about a millisecond
     - the link is locked down: only the file `raw/m-77.jpg`, only for 15 minutes, at most 30 MB, into a private bucket
     - like a delivery note: "the holder may drop one parcel named m-77 at warehouse door 3 before 10:15". The warehouse (S3) checks the signature on the note itself; it does not phone us
   - **c) The answer:** `{mediaId: m-77, presignedUrl}`
   - **Data change:** `media` row added `{media_id: m-77, owner_id: alice, type: photo, status: UPLOADING, raw_key: raw/m-77.jpg}`
   - **Why:** the link carries the permission, so Alice's browser never needs our S3 password, and our servers never carry the photo. At hundreds of terabytes of media a day, that traffic never touches our API servers.

2. **The browser uploads the photo directly to S3**
   - **a) A photo:** `PUT <presignedUrl>` with the 3 MB file
   - **b) A big video:** a **multipart upload**
     - 8 MB parts sent at the same time; a failed part is re-sent alone
     - e.g. a 200 MB video = 25 parts
   - **Data change:** S3 object created: `raw/m-77.jpg`
   - **Why:** parallel parts make big uploads fast, and a dropped connection costs one part, not the whole file. If the link expires first, nothing was stored; the phone just asks for a new link.

3. **S3 tells the job queue: "a new file arrived"**
   - **a) How:** S3's built-in event notification puts a message into **Amazon SQS** (Simple Queue Service, a job queue) whenever a file lands in `raw/`
   - **Data change:** SQS message added `{event: ObjectCreated, bucket: social-media, key: raw/m-77.jpg}`
   - **Why:** the queue protects the workers. If a million photos arrive at once, the queue just grows, and the workers catch up at their own speed. Nothing is lost and nothing is overloaded.

4. **Media Processing Workers make the ready-to-serve copies**
   - **a) Make the sizes**
     - a 150-pixel image (profile grid), a 640-pixel image (feed), a 1080-pixel image (full screen) in WebP (a small, modern image format), plus a tiny blurry preview
     - a video becomes a streaming format with qualities from 360p to 1080p
   - **b) Check safety:** an unsafe photo is marked `REJECTED` and never shown
   - **c) Name by content:** each file name holds a **fingerprint (hash) of its content**, e.g. `640.a1b2.webp`; a changed picture gets a new name
   - **d) If a worker crashes**
     - the SQS message reappears after a timeout and another worker retries it
     - after 5 failures it moves to a "failed jobs" queue (dead-letter queue) and the team is alerted
     - more workers start automatically when the queue gets long
   - **Data change:**
     - S3 objects created: `processed/m-77/150.a1b2.webp`, `640.a1b2.webp`, `1080.a1b2.webp`, `blur.a1b2.jpg`
     - `media` row updated `status: UPLOADING → READY`
   - **Why:** phones should download only the size they need, and a post may use m-77 only once it is READY.

5. **CloudFront serves the images**
   - **a) Nothing is copied in advance:** CloudFront fetches a file from `processed/` the first time someone in that city asks for it
   - **b) How a photo travels from S3 to Bob's phone**

            Bob's phone ──(a) GET https://cdn.example.com/m-77/640.a1b2.webp──> CloudFront edge server in Mumbai
                                                                                │  (b) "do I have this file in my cache?"
                                                                                │        YES (cache hit, almost always) -> send it back immediately
                                                                                │        NO  (cache miss) -> ask the regional middle cache (Origin Shield)
                                                                                v
                                                              Origin Shield (one shared middle cache for all edge servers in the region)
                                                                                │  has it? -> send it back
                                                                                │  no?     -> (c) fetch from S3 processed/m-77/640.a1b2.webp (allowed by OAC)
                                                                                v
                                                              S3 (private) -> the file goes back up: S3 -> Shield -> Mumbai edge (both keep a copy) -> Bob

   - **c) What "origin" means:** the origin is "where CloudFront fetches a file when it does not have it yet", here the S3 folder `processed/`
     - **OAC (Origin Access Control)** makes S3 refuse everyone except CloudFront, so nobody can bypass the CDN and read S3 directly
   - **d) On the phone:** the blurry preview first, then the 640-pixel image; both are kept on the phone, so scrolling back does not download them again
   - **Data change:** the Mumbai edge server and Origin Shield each keep a copy of `m-77/640.a1b2.webp` for 1 year
   - **Why the middle cache (Origin Shield):** when Celeb's photo goes viral, a million edge misses at the same moment become **one** fetch from S3.
   - **Why "cache for a year" is safe:** the file name contains its content fingerprint, so the file at that name never changes. CloudFront and the phone keep it with `Cache-Control: public, max-age=31536000, immutable`. A new picture simply gets a new name.

**Say in the interview:** "The server only signs a short-lived upload link; the client uploads directly to S3. S3 puts a job on SQS, workers make the sizes and mark the media READY, and CloudFront serves the files with content-hashed names cached for a year. The post is created only after the media is READY."

### Flow 2. Alice creates a post → it lands in her followers' feeds (outbox → Change Data Capture → Kafka → hybrid push / pull fanout)

```text
┌── STEP 1, 2 ─────────────────────────────────────────────┐            ┌── STEP 1 ────────────────────────────────────────────────┐            ┌── STEP 2 ────────────────────────────────────────────────┐            ┌── STEP 2, 3 ─────────────────────────────────────────────┐            ┌── STEP 3 ────────────────────────────────────────────────┐            ┌── STEP 3, 4 ─────────────────────────────────────────────┐            ┌── STEP 5, 6 ─────────────────────────────────────────────┐            ┌── STEP 6 ────────────────────────────────────────────────┐
│ Alice  (web browser)                                     │            │ API Gateway  (front door)                                │            │ Post Service                                             │            │ Post Database  (PostgreSQL, split by author)             │            │ Debezium  (Change Data Capture)                          │            │ Apache Kafka  (event pipe)                               │            │ Fanout Workers  (copy post ids into feeds)               │            │ Feed Cache  (Redis, in-memory)  <- THE FEED              │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Creates post p-901                               │ ────┬────> │ STEP 1: Checks login + rate limit, then routes           │ ─────────> │ STEP 2: Seen k-123 before?                               │ ────┬────> │ STEP 2: Stores the post and the news about it            │ ─────────> │ STEP 3: Copies the new outbox row into Kafka             │ ─────────> │ STEP 3: Keeps Alice's events in one ordered line         │ ────┬────> │ STEP 5: Finds who should get the post                    │ ────┬────> │ STEP 6: Holds each follower's ready-made list            │
│   - POST /v1/posts {caption: 'Sunset at Goa', mediaIds:  │     │      │   - /v1/posts -> Post Service (gRPC, short time limit)   │            │   - Redis SET idem:k-123 NX EX 86400 (set only if        │     │      │   - posts row + outbox row in the same commit            │            │   - reads only public.outbox from the WAL, in commit     │            │   - key alice -> one partition; 3 copies, acks=all       │     │      │   - reads users + followers, 1,000 at a time, active     │     │      │   - sorted set of post ids, score = post id              │
│     [m-77]} + Idempotency-Key: k-123                     │     │      │   - e.g. user id taken from the login token              │            │     missing)                                             │     │      │   - e.g. p-901 ACTIVE; e-1001 post.created               │            │     order                                                │            │   - e.g. post.created for p-901                          │     │      │     followers only                                       │     │      │   - e.g. feed:bob = [p-901, p-880, ...]                  │
│   - e.g. a retry sends the same k-123                    │     │      └──────────────────────────────────────────────────────────┘            │   - e.g. already there -> return the saved p-901         │     │      │                                                          │            │   - aggregatetype post -> topic post.events              │            │                                                          │     │      │   - e.g. alice: 220 of her 300 followers are active      │     │      │                                                          │
│                                                          │     │                                                                              │                                                          │     │      │ STEP 3: Writes every commit into its WAL                 │            │   - aggregateid alice -> message key; payload -> body    │            │ STEP 4: Hands it to two consumer groups                  │     │      │                                                          │     │      │ STEP 6: Holds a celebrity's recent posts                 │
│ STEP 2: Gets 201 Created at once                         │     │                                                                              │ STEP 2: Is the photo READY?                              │     │      │   - WAL = Write-Ahead Log, the database's own diary of   │            │   - e.g. e-1001 -> post.events, key alice                │            │   - fanout (kept fast) and notification (may fall        │     │      │ STEP 6: Normal author: pushes the id                     │     │      │   - newest 100 only; nobody pushes them                  │
│   - copying into feeds happens later, in the background  │     │                                                                              │   - not yet -> 409 Conflict                              │     │      │     changes                                              │            │                                                          │            │     behind)                                              │     │      │   - one Redis batch: ZADD + trim to the newest 500       │     │      │   - e.g. author_recent:celeb = [p-902, ...]              │
│   - e.g. {postId: p-901} in ≈50 ms                       │     │                                                                              │   - e.g. nobody ever sees a broken image                 │     │      │   - e.g. Debezium follows it like a backup copy would    │            │ STEP 3: Saves its place in the WAL                       │            │   - e.g. each group commits its offset only after the    │     │      │   - e.g. p-901 into feed:bob and 219 other feeds         │     │      └──────────────────────────────────────────────────────────┘
└──────────────────────────────────────────────────────────┘     │                                                                              │                                                          │     │      └──────────────────────────────────────────────────────────┘            │   - after a crash it continues from there: a repeat is   │            │          work                                            │     │      │                                                          │     │
                                                                 │                                                                              │ STEP 2: Makes a Snowflake id                             │     │                                                                              │     possible, a gap is not                               │            └──────────────────────────────────────────────────────────┘     │      │ STEP 6: Celebrity: does NOT push                         │     │
                                                                 │                                                                              │   - time + shard + counter: a bigger id is a newer post  │     │                                                                              └──────────────────────────────────────────────────────────┘                                                                             │      │   - one write: ZADD author_recent:celeb                  │     │
                                                                 │                                                                              │   - e.g. p-901                                           │     │                                                                                                                                                                                                                       │      │   - e.g. p-902 is pulled when followers read (Flow 6)    │     │
                                                                 │                                                                              │                                                          │     │                                                                                                                                                                                                                       │      └──────────────────────────────────────────────────────────┘     │
                                                                 │                                                                              │ STEP 2: Saves post + outbox row in ONE transaction       │     │                                                                                                                                                                                                                       │                                                                       │
                                                                 │                                                                              │   - BEGIN; INSERT posts; INSERT outbox; COMMIT           │     │                                                                                                                                                                                                                       │                                                                       │
                                                                 │                                                                              │   - e.g. both rows exist, or neither                     │     │                                                                                                                                                                                                                       │                                                                       │
                                                                 │                                                                              └──────────────────────────────────────────────────────────┘     │                                                                                                                                                                                                                       │                                                                       │
                                                                 │                                                                                                                                               │                                                                                                                                                                                                                       │                                                                       │
                                                                 │                                                                                                                                               │                                                                                                                                                                                                                       │                                                                       │
                                                                 │                                                                                                                                               │                                                                                                                                                                                                                       │                                                                       │
┌── STEP 1 ────────────────────────────────────────────────┐     │                                                                                                                                               │      ┌── STEP 2 ────────────────────────────────────────────────┐                                                                                                                                                     │                                                                       │      ┌── STEP 5 ────────────────────────────────────────────────┐
│ Celeb  (mobile app, a celebrity)                         │     │                                                                                                                                               │      │ Redis  (repeat-safe request ids)                         │                                                                                                                                                     │                                                                       │      │ Follower Graph Database  (PostgreSQL)                    │
├──────────────────────────────────────────────────────────┤     │                                                                                                                                               │      ├──────────────────────────────────────────────────────────┤                                                                                                                                                     │                                                                       │      ├──────────────────────────────────────────────────────────┤
│ STEP 1: Posts p-902 'New song out!'                      │ ────┘                                                                                                                                               └────> │ STEP 2: Remembers the answer for 24 hours                │                                                                                                                                                     │                                                                       └────> │ STEP 5: Answers 'who follows Alice?' on one server       │
│   - the same POST /v1/posts path as Alice                │                                                                                                                                                            │   - the key is created only if it is missing (NX)        │                                                                                                                                                     │                                                                              │   - followers is split by the person followed            │
│   - e.g. 100 million followers: too many to copy into    │                                                                                                                                                            │   - e.g. idem:k-123 = {status: 201, postId: p-901}       │                                                                                                                                                     │                                                                              │   - users says who is a celebrity and who is active      │
└──────────────────────────────────────────────────────────┘                                                                                                                                                            └──────────────────────────────────────────────────────────┘                                                                                                                                                     │                                                                              │   - e.g. alice: is_celebrity false; celeb: true          │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │                                                                              └──────────────────────────────────────────────────────────┘
                                                                                                                                                                                                                                                                                                                                                                                                                                         │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │      ┌── STEP 4, 7 ─────────────────────────────────────────────┐            ┌── STEP 7 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                                                                                                                                                                                                                                         │      │ Notification Service                                     │            │ Followers' phones                                        │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │      ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                                                                                                                                                                                                                                         └────> │ STEP 4: Reads the same post.events                       │ ─────────> │ STEP 7: Show 'Celeb posted'                              │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │   - its own consumer group, low priority                 │            │   - a push notification                                  │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │                                                          │            │   - e.g. a tap opens the feed                            │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │ STEP 7: Spreads celebrity alerts out                     │            └──────────────────────────────────────────────────────────┘
                                                                                                                                                                                                                                                                                                                                                                                                                                                │   - over ≈15 minutes, grouped, through Apple / Google    │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │     push                                                 │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │   - e.g. 'Celeb posted' to 100 million phones            │
                                                                                                                                                                                                                                                                                                                                                                                                                                                └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Post DB                                                                                                                             ▼ Redis                                           ▼ Debezium                                              ▼ Kafka                           ▼ Graph DB                                                                                          ▼ Feed Cache
╔═══════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════╗    ╔════════════════════════════╗    ╔══════════════════════════════════╗    ╔══════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════╗
║ posts (Post DB) · key post_id · index author_id + post_id ║    ║ outbox (Post DB) · aggregatetype -> topic, aggregateid -> key ║    ║ Redis key: repeat-safe request             ║    ║ Debezium settings (Change Data Capture)          ║    ║ Kafka message              ║    ║ users (Graph DB) · key user_id   ║    ║ followers (Graph DB) · key followee_id + follower_id ║    ║ Redis key: Bob's feed · sorted set            ║    ║ Redis key: a celebrity's recent posts · sorted set ║
╟───────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────╢    ╟────────────────────────────╢    ╟──────────────────────────────────╢    ╟──────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────╢
║ {                                                         ║    ║ {                                                             ║    ║ idem:k-123 = {                             ║    ║ table.include.list = public.outbox               ║    ║ {                          ║    ║ [                                ║    ║ {                                                    ║    ║ feed:bob = [p-901, p-880, p-871, ...]         ║    ║ author_recent:celeb = [p-902, p-850, ...]          ║
║   "post_id": "p-901",                                     ║    ║   "id": "e-1001",                                             ║    ║   "status": 201,                           ║    ║   (watch only the outbox table)                  ║    ║   "topic": "post.events",  ║    ║   {                              ║    ║   "followee_id": "alice",                            ║    ║ (score = post id, newest first;               ║    ║ (newest 100; only celebrities have one)            ║
║   "author_id": "alice",                                   ║    ║   "aggregatetype": "post",                                    ║    ║   "postId": "p-901"                        ║    ║ transforms.outbox.type =                         ║    ║   "key": "alice",          ║    ║     "user_id": "alice",          ║    ║   "follower_id": "bob"                               ║    ║  newest 500 kept, dropped after 30 idle days) ║    ╚════════════════════════════════════════════════════╝
║   "caption": "Sunset at Goa",                             ║    ║   "aggregateid": "alice",                                     ║    ║ }                                          ║    ║   io.debezium.transforms.outbox.EventRouter      ║    ║   "headers": {             ║    ║     "name": "Alice",             ║    ║ }                                                    ║    ╚═══════════════════════════════════════════════╝
║   "media_ids": ["m-77"],                                  ║    ║   "type": "post.created",                                     ║    ║ (set only if not there yet, kept 24 hours) ║    ║   (turn each row into a clean message)           ║    ║     "id": "e-1001",        ║    ║     "follower_count": 300,       ║    ╚══════════════════════════════════════════════════════╝
║   "status": "ACTIVE",                                     ║    ║   "payload": {                                                ║    ╚════════════════════════════════════════════╝    ║ transforms.outbox.route.by.field = aggregatetype ║    ║     "type": "post.created" ║    ║     "is_celebrity": false,       ║
║   "created_at": "09:30"                                   ║    ║     "post_id": "p-901",                                       ║                                                      ║   (this column picks the topic)                  ║    ║   },                       ║    ║     "last_active_at": "09:30"    ║
║ }                                                         ║    ║     "author_id": "alice",                                     ║                                                      ║ transforms.outbox.route.topic.replacement =      ║    ║   "value": {               ║    ║   },                             ║
╚═══════════════════════════════════════════════════════════╝    ║     "media_ids": ["m-77"]                                     ║                                                      ║   ${routedByValue}.events                        ║    ║     "post_id": "p-901",    ║    ║   {                              ║
                                                                 ║   },                                                          ║                                                      ║   (post -> post.events, follow -> follow.events) ║    ║     "author_id": "alice",  ║    ║     "user_id": "celeb",          ║
                                                                 ║   "created_at": "09:30"                                       ║                                                      ╚══════════════════════════════════════════════════╝    ║     "media_ids": ["m-77"]  ║    ║     "name": "Celeb",             ║
                                                                 ║ }                                                             ║                                                                                                              ║   }                        ║    ║     "follower_count": 100000000, ║
                                                                 ╚═══════════════════════════════════════════════════════════════╝                                                                                                              ║ }                          ║    ║     "is_celebrity": true,        ║
                                                                                                                                                                                                                                                ╚════════════════════════════╝    ║     "last_active_at": "09:29"    ║
                                                                                                                                                                                                                                                                                  ║   }                              ║
                                                                                                                                                                                                                                                                                  ║ ]                                ║
                                                                                                                                                                                                                                                                                  ╚══════════════════════════════════╝
```

1. **Alice creates the post**
   - **a) The request:** `POST /v1/posts {caption: "Sunset at Goa", mediaIds: [m-77]}` + header `Idempotency-Key: k-123`
     - the phone makes one unique id per attempt; a retry sends the **same** `k-123`
   - **b) Celeb** posts p-902 "New song out!" through exactly the same path
   - **Data change:** none yet
   - **Why the key:** if the answer is lost on a bad network and the phone retries, we return the saved answer instead of creating a second post.

2. **The Post Service checks, then saves the post and its event together**
   - **a) Seen k-123 before?**
     - it adds Redis key `idem:k-123` only if it does not exist yet (`SET … NX`, "set if Not eXists"), kept 24 hours
     - already there → it returns the saved answer: the same post, never a duplicate
   - **b) Is m-77 READY?** If not → `409 Conflict`, so followers never see a post with a broken image
   - **c) A unique id:** a **Snowflake id** made of time + server number + counter (41 bits of time, 13 bits of shard, 10 bits of sequence)
     - a bigger id means a newer post, so sorting by id = sorting by time, without asking any central counter
   - **d) One transaction**

            BEGIN;
            INSERT INTO posts (post_id, author_id, caption, media_ids, status)
                 VALUES ('p-901', 'alice', 'Sunset at Goa', '{m-77}', 'ACTIVE');
            INSERT INTO outbox (id, aggregatetype, aggregateid, type, payload)
                 VALUES ('e-1001', 'post', 'alice', 'post.created', '{"post_id": "p-901", ...}');
            COMMIT;

   - **e) The answer:** `201 Created {postId: p-901}` in about 50 milliseconds; everything after this happens in the background
   - **Data change:**
     - `posts` row added `{post_id: p-901, author_id: alice, caption: "Sunset at Goa", media_ids: [m-77], status: ACTIVE}`
     - `outbox` row added `{id: e-1001, aggregatetype: post, aggregateid: alice, type: post.created, payload: {post_id: p-901, author_id: alice}}`
     - Redis `idem:k-123 = {status: 201, postId: p-901}`
   - **Why one transaction:** both rows are saved, or neither is. The event can't be lost, and it can't be sent for a post that does not exist.
   - **Why the outbox at all:** the obvious way is "save to the database, then send to Kafka". If the server crashes between those two lines, the post exists and nobody is ever told, so it never reaches any feed. With the outbox, "tell everyone" is written into the same database, in the same transaction, like dropping a letter into the office out-tray while you sign the contract. A courier (Debezium) empties the tray; if Kafka is down, the letters just wait.

3. **Debezium (Change Data Capture) copies the outbox row into Kafka**
   - **a) Topic vs event type:** `post.events` is the **topic**, the Kafka channel (like a folder) that holds every event about posts. `post.created` is the **event type** of this one message; other messages in the same topic have types like `post.deleted`
   - **b) The settings** (also in the Debezium box under **Data in this flow**)

            table.include.list                         = public.outbox                              (watch only the outbox table)
            transforms.outbox.type                     = io.debezium.transforms.outbox.EventRouter  (turn each row into a clean message)
            transforms.outbox.route.by.field           = aggregatetype                              (this column picks the topic)
            transforms.outbox.route.topic.replacement  = ${routedByValue}.events                    (post -> post.events, follow -> follow.events)

   - **c) How Debezium does it, step by step**
     - PostgreSQL writes every committed change into its **WAL** (Write-Ahead Log, the database's own diary of every change). Debezium connects as a **replication client** (the way a backup copy of the database follows the main one), so it hears each change in commit order
     - it ignores every table except `outbox` and only picks up **new rows**
     - its **Outbox Event Router** (a built-in Debezium step) maps the columns: `aggregatetype = post` → topic `post.events`; `aggregateid = alice` → message key; `payload` → message body; `id` and `type` → message headers (labels on the message)
     - it publishes to Kafka and waits until Kafka confirms all 3 copies are saved (`acks=all`)
     - it saves "I have read up to here in the WAL"; after a crash it continues from there, so no row is skipped. A row may occasionally be sent twice, and readers ignore duplicates
   - **Data change:** Kafka topic `post.events`, key `alice`, headers `id = e-1001, type = post.created`, value `{"post_id": "p-901", "author_id": "alice", "media_ids": ["m-77"]}`
   - **Why the key is the author:** Kafka sends all messages with the same key to the same partition (one ordered line), so Alice's "created" can never be processed after her "deleted".
   - **Cleanup:** a daily job deletes old outbox rows. They only need to live until Debezium has read them.

4. **Kafka hands the event to two consumer groups**
   - **a) Consumer groups:** a consumer group is a team of workers that share one topic; each group reads every message at its own speed, without slowing the others
     - **fanout group** → Fanout Workers (important, kept fast)
     - **notification group** → Notification Service (low priority, allowed to fall behind)
   - **b) Bookmark after the work:** each worker commits its **offset** (its bookmark in the topic) only **after** the work is finished
   - **Data change:** none (only each group's offset moves forward)
   - **Why commit after the work:** after a crash a message may be processed twice, but never zero times.

5. **Fanout Workers look up who should get the post**
   - **a) Celebrity or not?** the author's `users` row
     - Alice has 300 followers → `is_celebrity = false`
     - Celeb has 100 million → `is_celebrity = true` (the line is 100,000 followers)
   - **b) Which followers?** for Alice they read the `followers` table **1,000 at a time**
     - it is split by the person followed, so "who follows Alice?" is answered by one server
     - only followers active in the last 30 days are kept: 220 of her 300
   - **Data change:** none (reads only)
   - **Why skip inactive followers:** most of the copying would go to people who never open the app. The other 80 get their feed rebuilt when they come back (Flow 6).

6. **Push for Alice, pull for Celeb**
   - **a) Alice → push:** one Redis batch of 220 commands, each adding p-901 to a follower's sorted list (`ZADD`, "add to sorted list") and trimming it to the newest 500
   - **b) Celeb → no push:** one single write, adding p-902 to `author_recent:celeb`, then stop; followers pull it when they read (Flow 6)
   - **c) Self-protection:** if fanout falls far behind (a viral hour), the celebrity line is lowered automatically, e.g. from 100,000 to 20,000 followers, so more authors become "pull" and the push work shrinks
   - **Data change:**
     - Redis `feed:bob = [p-901, p-880, p-871, …]` (and the same for the other 219 active followers)
     - Redis `author_recent:celeb = [p-902, p-850, …]`
   - **Why safe to repeat:** adding an id that is already in a sorted list changes nothing. If a worker crashes after 500 of 1,000 writes and the message is replayed, the result is the same.
   - **Why hybrid, in real life:** push is like a newspaper delivered to every subscriber's door: reading is instant, but a paper with 100 million subscribers needs 100 million deliveries for every edition. Pull is like walking to the newsstand: no delivery work, but you must visit every stand you care about. We deliver to the door for normal people, and each reader visits the few "celebrity newsstands" themselves.

7. **The Notification Service tells phones**
   - **a) Spread out:** for a celebrity it spreads the 100 million notifications over about 15 minutes and groups several into one, through Apple Push Notification service and Firebase Cloud Messaging (Google)
   - **b) Data lake:** it also copies all events into a data lake (files in S3 used to train the ranking model)
   - **Data change:** none in our stores; push messages go out to the phones
   - **Why spread out:** if 100 million phones were told at the same second, 100 million people would open the app at the same second.

**Push, pull or hybrid: the cost of each**

| Model | Work when someone posts | Work when someone reads | Problem |
|---|---|---|---|
| Push (fanout on write) | 1 write per follower | 1 Redis read | Celeb = 100 million writes per post |
| Pull (fanout on read) | 1 write | Ask every person you follow | Slow if you follow 1,000 people |
| **Hybrid (our choice)** | Push only if ≤ 100,000 followers | Your pushed list + pull about 10 celebrities | A small merge at read time |

**Say in the interview:** "The post and an outbox row are saved in one transaction; Debezium streams the outbox to Kafka keyed by author. Fanout pushes post ids into active followers' Redis feeds for normal authors and does one write to author_recent for celebrities, which followers pull at read time. Notifications for celebrities are spread out."

### Flow 3. Bob follows Alice → her posts appear in his feed (outbox → Change Data Capture → Kafka → reverse table + feed backfill)

```text
┌── STEP 1 ────────────────────────────────────────────────┐            ┌── STEP 1 ────────────────────────────────────────────────┐            ┌── STEP 2 ────────────────────────────────────────────────┐            ┌── STEP 2, 3 ─────────────────────────────────────────────┐            ┌── STEP 3 ────────────────────────────────────────────────┐            ┌── STEP 3, 4 ─────────────────────────────────────────────┐            ┌── STEP 4, 5 ─────────────────────────────────────────────┐            ┌── STEP 4 ────────────────────────────────────────────────┐
│ Bob  (mobile app)                                        │            │ API Gateway  (front door)                                │            │ Follow Service                                           │            │ Follower Graph Database  (PostgreSQL)                    │            │ Debezium  (Change Data Capture)                          │            │ Apache Kafka  (event pipe)                               │            │ Fanout Workers  (follow events)                          │            │ Follower Graph Database  (followers table)               │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Taps 'Follow' on Alice                           │ ─────────> │ STEP 1: Checks login + rate limit, then routes           │ ─────────> │ STEP 2: Saves follow + outbox row in ONE transaction     │ ─────────> │ STEP 2: Stores Bob's side of the follow                  │ ─────────> │ STEP 3: Copies the outbox row into Kafka                 │ ─────────> │ STEP 3: Keeps Bob's follow before a later unfollow       │ ─────────> │ STEP 4: Writes the reverse row                           │ ────┬────> │ STEP 4: Stores Alice's side of the follow                │
│   - PUT /v1/users/alice/follow; unfollow = DELETE on the │            │   - /v1/users/*/follow -> Follow Service (gRPC, short    │            │   - BEGIN; INSERT following; INSERT outbox; COMMIT       │            │   - following, split by follower_id                      │            │   - same settings as Flow 2: aggregatetype follow ->     │            │   - key bob = one ordered line                           │            │   - INSERT INTO followers (alice, bob), safe to repeat   │     │      │   - followers, split by followee_id                      │
│     same address                                         │            │     time limit)                                          │            │   - e.g. answers 204 No Content at once                  │            │   - e.g. bob -> alice; outbox e-2001 follow.created      │            │     follow.events                                        │            │   - e.g. follow.created                                  │            │   - e.g. alice <- bob                                    │     │      │   - e.g. alice <- bob                                    │
│   - e.g. repeating it gives the same result              │            │   - e.g. user id bob taken from the login token          │            └──────────────────────────────────────────────────────────┘            │                                                          │            │   - e.g. e-2001 -> follow.events, key bob                │            │                                                          │            │                                                          │     │      └──────────────────────────────────────────────────────────┘
└──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘                                                                                    │ STEP 3: Writes the commit into its WAL                   │            └──────────────────────────────────────────────────────────┘            │ STEP 4: Delivers it to the fanout group                  │            │ STEP 5: Alice is normal: copies her newest posts         │     │
                                                                                                                                                                                                                        │   - Debezium reads it from there                         │                                                                                    │   - the offset is committed only after the work          │            │   - reads her newest 20 post ids                         │     │
                                                                                                                                                                                                                        └──────────────────────────────────────────────────────────┘                                                                                    └──────────────────────────────────────────────────────────┘            │   - ZADD them into feed:bob                              │     │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │   - e.g. feed:bob gains p-901, p-870, ...                │     │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │                                                          │     │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │ STEP 5: A celebrity: just remembers her                  │     │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │   - SADD celebs_followed:bob                             │     │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │   - e.g. her posts are pulled at read time               │     │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │                                                          │     │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │ STEP 5: Unfollow: the opposite                           │     │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │   - deletes both rows, removes her ids from feed:bob     │     │
                                                                                                                                                                                                                                                                                                                                                                                                                                                └──────────────────────────────────────────────────────────┘     │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 │      ┌── STEP 5 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 │      │ Post Database  (PostgreSQL)                              │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 │      ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 ├────> │ STEP 5: Gives Alice's newest post ids                    │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 │      │   - index (author_id, post_id newest first)              │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 │      │   - e.g. p-901, p-870, ...                               │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 │      └──────────────────────────────────────────────────────────┘
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 │      ┌── STEP 5 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 │      │ Feed Cache  (Redis, in-memory)                           │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 │      ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 └────> │ STEP 5: Bob's feed gets her posts                        │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        │   - ZADD feed:bob, or SADD celebs_followed:bob for a     │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        │     celebrity                                            │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        │   - e.g. feed:bob = [p-901, p-880, ...]                  │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Graph DB                                                                                                                        ▼ Kafka                             ▼ Graph DB                                                  ▼ Post DB                                                        ▼ Feed Cache
╔══════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════╗    ╔══════════════════════════════╗    ╔══════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════╗    ╔══════════════════════════════════════════╗
║ following (Graph DB) · key follower_id + followee_id ║    ║ outbox (Graph DB) · aggregatetype -> topic, aggregateid -> key ║    ║ Kafka message                ║    ║ followers (Graph DB) · key followee_id + follower_id ║    ║ posts (Post DB) · key post_id · index author_id + post_id ║    ║ Redis key: Bob's feed · sorted set            ║    ║ Redis key: celebrities Bob follows · set ║
╟──────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────╢    ╟──────────────────────────────╢    ╟──────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────╢    ╟──────────────────────────────────────────╢
║ {                                                    ║    ║ {                                                              ║    ║ {                            ║    ║ {                                                    ║    ║ {                                                         ║    ║ feed:bob = [p-901, p-880, p-871, ...]         ║    ║ celebs_followed:bob = {celeb}            ║
║   "follower_id": "bob",                              ║    ║   "id": "e-2001",                                              ║    ║   "topic": "follow.events",  ║    ║   "followee_id": "alice",                            ║    ║   "post_id": "p-901",                                     ║    ║ (score = post id, newest first;               ║    ╚══════════════════════════════════════════╝
║   "followee_id": "alice",                            ║    ║   "aggregatetype": "follow",                                   ║    ║   "key": "bob",              ║    ║   "follower_id": "bob"                               ║    ║   "author_id": "alice",                                   ║    ║  newest 500 kept, dropped after 30 idle days) ║
║   "created_at": "09:00"                              ║    ║   "aggregateid": "bob",                                        ║    ║   "headers": {               ║    ║ }                                                    ║    ║   "caption": "Sunset at Goa",                             ║    ╚═══════════════════════════════════════════════╝
║ }                                                    ║    ║   "type": "follow.created",                                    ║    ║     "id": "e-2001",          ║    ╚══════════════════════════════════════════════════════╝    ║   "media_ids": ["m-77"],                                  ║
╚══════════════════════════════════════════════════════╝    ║   "payload": {                                                 ║    ║     "type": "follow.created" ║                                                                ║   "status": "ACTIVE",                                     ║
                                                            ║     "follower_id": "bob",                                      ║    ║   },                         ║                                                                ║   "created_at": "09:30"                                   ║
                                                            ║     "followee_id": "alice"                                     ║    ║   "value": {                 ║                                                                ║ }                                                         ║
                                                            ║   },                                                           ║    ║     "follower_id": "bob",    ║                                                                ╚═══════════════════════════════════════════════════════════╝
                                                            ║   "created_at": "09:00"                                        ║    ║     "followee_id": "alice"   ║
                                                            ║ }                                                              ║    ║   }                          ║
                                                            ╚════════════════════════════════════════════════════════════════╝    ║ }                            ║
                                                                                                                                  ╚══════════════════════════════╝
```

1. **Bob taps Follow**
   - **a) The request:** `PUT /v1/users/alice/follow`; unfollow is `DELETE` on the same address
   - **Data change:** none yet
   - **Why `PUT`:** doing it twice gives the same result as doing it once, so a retry on a bad network is safe.

2. **The Follow Service saves the follow and its event together**
   - **a) One transaction** (the same outbox pattern as posts): `INSERT INTO following` + `INSERT INTO outbox`, `COMMIT`
   - **b) The answer:** `204 No Content` at once; Bob's feed is updated in the background
   - **Data change:**
     - `following` row added `{follower_id: bob, followee_id: alice}`
     - `outbox` row added `{id: e-2001, aggregatetype: follow, aggregateid: bob, type: follow.created, payload: {follower_id: bob, followee_id: alice}}`
   - **Why only Bob's row:** follows are one-way, so Alice does not have to follow back. The reverse row comes in step 4.

3. **Debezium copies the outbox row into Kafka**
   - **a) Same settings as Flow 2:** `aggregatetype = follow` → topic `follow.events`; `aggregateid = bob` → message key
   - **Data change:** Kafka topic `follow.events`, key `bob`, header `type = follow.created`, value `{follower_id: bob, followee_id: alice}`
   - **Why the key is the follower:** Bob's follow and a later unfollow land in the same ordered line, so they are never processed in the wrong order.

4. **Fanout Workers (follow group) write the reverse row**
   - **a) How:** insert into `followers`; repeating it changes nothing
   - **Data change:** `followers` row added `{followee_id: alice, follower_id: bob}`
   - **Why two tables:** the database is split across many servers. `following` is split by follower, so "who does Bob follow?" is one server. `followers` is split by the person followed, so "who follows Alice?" (used by fanout in Flow 2) is also one server. With only one table, one of the two questions would have to ask every server.

5. **Bob's feed is updated right away**
   - **a) Alice is a normal user → copy (backfill)**
     - read her newest post ids from the `posts` index `(author_id, post_id newest first)`
     - add the last 20 to `feed:bob`
   - **b) If she were a celebrity → just remember her:** add her to the set `celebs_followed:bob`; her posts are pulled when Bob reads (Flow 6)
   - **c) Unfollow:** delete both rows and remove her posts from `feed:bob`; any that slip through are also filtered out at read time
   - **Data change:** Redis `feed:bob` gains `[p-901, p-870, …]`, or Redis `celebs_followed:bob = {celeb}` for a celebrity
   - **Why backfill:** Bob should see Alice's posts now, not only her next one.

**Say in the interview:** "Follow is an idempotent PUT; the follow row and an outbox row go in one transaction. A consumer writes the reverse table so both directions are single-shard lookups, then backfills the follower's feed, or adds the celebrity to a pull set."

### Flow 4. Bob likes Celeb's post → counted once, even at millions of likes a minute (Cassandra batch + outbox → Outbox Relay → Kafka → Flink split counter)

```text
┌── STEP 1 ────────────────────────────────────────────────┐            ┌── STEP 1 ────────────────────────────────────────────────┐            ┌── STEP 2 ────────────────────────────────────────────────┐            ┌── STEP 2, 3, 4 ──────────────────────────────────────────┐            ┌── STEP 3, 4 ─────────────────────────────────────────────┐            ┌── STEP 4, 5 ─────────────────────────────────────────────┐            ┌── STEP 5, 6 ─────────────────────────────────────────────┐            ┌── STEP 6 ────────────────────────────────────────────────┐
│ Bob  (mobile app)                                        │            │ API Gateway  (front door)                                │            │ Like / Comment Service                                   │            │ Engagement Database  (Apache Cassandra)                  │            │ Outbox Relay  (small always-on worker)                   │            │ Apache Kafka  (event pipe)                               │            │ Apache Flink  (stream processor that counts)             │            │ Post Cache  (Redis, in-memory)                           │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Taps the heart on Celeb's p-902                  │ ─────────> │ STEP 1: Checks login + rate limit, then routes           │ ─────────> │ STEP 2: Saves the like + its event in ONE logged batch   │ ─────────> │ STEP 2: Stores the like and the event, both or neither   │ ─────────> │ STEP 3: Reads unsent outbox rows                         │ ─────────> │ STEP 4: Keeps like events, keyed by the user             │ ─────────> │ STEP 5: Drops repeated event ids                         │ ────┬────> │ STEP 6: Shows the new total                              │
│   - PUT /v1/posts/p-902/like; unlike = DELETE            │            │   - /v1/posts/*/like -> Like / Comment Service (gRPC,    │            │   - BEGIN BATCH; user_likes + like_outbox; APPLY BATCH   │            │   - the batch log on other servers finishes a half-done  │            │   - each pod owns some of the 16 shards                  │            │   - keyed by post, Celeb's likes would pile onto one     │            │   - remembers every id for 24 hours                      │     │      │   - HSET stats:p-902 likes 2066001                       │
│   - e.g. it turns red at once (optimistic UI)            │            │     short time limit)                                    │            │   - e.g. replies 204 No Content in ≈20 ms                │            │     batch                                                │            │   - oldest minute with rows first, many times a second   │            │     partition                                            │            │   - e.g. a second e-5001 is thrown away                  │     │      │   - e.g. the app shows '2.1M'                            │
└──────────────────────────────────────────────────────────┘            │   - e.g. user id bob taken from the login token          │            │                                                          │            │   - e.g. user_likes bob / p-902; like_outbox e-5001      │            │   - re-reads the last few minutes for late rows          │            │   - e.g. like.events, key bob, id e-5001                 │            │                                                          │     │      └──────────────────────────────────────────────────────────┘
                                                                        └──────────────────────────────────────────────────────────┘            │ STEP 2: Never sends to Kafka, never adds +1              │            │                                                          │            │   - e.g. reads e-5001 from shard 7                       │            │                                                          │            │ STEP 5: Counts with a split counter                      │     │
                                                                                                                                                │   - the relay sends; Flink counts                        │            │ STEP 3: Gives the relay its unsent rows                  │            │                                                          │            │ STEP 5: Delivers them to Flink                           │            │   - key p-902#(hash(user) % 16): 16 workers share one    │     │
                                                                                                                                                └──────────────────────────────────────────────────────────┘            │   - like_outbox partition (shard, minute), sorted by     │            │ STEP 4: Publishes to Kafka, then deletes the row         │            │   - Flink saves its place in checkpoints                 │            │     post                                                 │     │
                                                                                                                                                                                                                        │     event_id                                             │            │   - send to like.events with acks=all, then DELETE from  │            └──────────────────────────────────────────────────────────┘            │   - e.g. p-902#7 goes up by 1                            │     │
                                                                                                                                                                                                                        │   - e.g. shard 7, minute 09:31                           │            │     like_outbox                                          │                                                                                    │                                                          │     │
                                                                                                                                                                                                                        │                                                          │            │   - e.g. crash before the delete = a repeat, never a     │                                                                                    │ STEP 6: Adds the 16 shares every 2 seconds               │     │
                                                                                                                                                                                                                        │ STEP 4: Drops the row once Kafka has it                  │            │          loss                                            │                                                                                    │   - writes the TOTAL, not +1, so a replay is harmless    │     │
                                                                                                                                                                                                                        │   - DELETE FROM like_outbox ... e-5001                   │            │                                                          │                                                                                    │   - e.g. p-902 = 2,066,001                               │     │
                                                                                                                                                                                                                        └──────────────────────────────────────────────────────────┘            │ STEP 4: Raises an alarm if a row is stuck                │                                                                                    └──────────────────────────────────────────────────────────┘     │
                                                                                                                                                                                                                                                                                                │   - any row waiting over 1 minute                        │                                                                                                                                                     │
                                                                                                                                                                                                                                                                                                └──────────────────────────────────────────────────────────┘                                                                                                                                                     │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 │      ┌── STEP 6 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 │      │ Engagement Database  (post_stats table)                  │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 │      ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 └────> │ STEP 6: Keeps the permanent total                        │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        │   - UPDATE post_stats SET likes = 2066001 WHERE post_id  │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        │     = p-902                                              │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        │   - e.g. a nightly job recounts from user_likes          │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Cassandra                                                                                                                                                                                                           ▼ Outbox Relay                                  ▼ Kafka                           ▼ Flink                                      ▼ Post Cache                              ▼ Cassandra
╔════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════╗    ╔════════════════════════════╗    ╔═══════════════════════════════════════╗    ╔════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════╗
║ Cassandra logged batch (like + event, both or neither) ║    ║ user_likes (Cassandra) · partition user_id · key user_id + post_id ║    ║ like_outbox (Cassandra) · partition shard + minute · sorted by         ║    ║ Outbox Relay progress (per shard)        ║    ║ Kafka message              ║    ║ Flink running counts (split counter)  ║    ║ Redis key: counts · hash           ║    ║ post_stats (Cassandra) · key post_id · totals written by Flink ║
╟────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────╢    ║ event_id                                                               ║    ╟──────────────────────────────────────────╢    ╟────────────────────────────╢    ╟───────────────────────────────────────╢    ╟────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────╢
║ BEGIN BATCH                                            ║    ║ {                                                                  ║    ╟────────────────────────────────────────────────────────────────────────╢    ║ shard 7: oldest minute with rows = 09:31 ║    ║ {                          ║    ║ p-902#0   = 129,100   (share 0 of 16) ║    ║ stats:p-902 = {                    ║    ║ {                                                              ║
║   INSERT INTO user_likes                               ║    ║   "user_id": "bob",                                                ║    ║ {                                                                      ║    ║ re-reads the last few minutes too, so a  ║    ║   "topic": "like.events",  ║    ║ p-902#1   = 128,950                   ║    ║   "likes": 2066001,                ║    ║   "post_id": "p-902",                                          ║
║     (bob, p-902, 09:31);                               ║    ║   "post_id": "p-902",                                              ║    ║   "shard": 7,                                                          ║    ║ late-arriving row is still sent          ║    ║   "key": "bob",            ║    ║ ...                                   ║    ║   "comments": 48210                ║    ║   "likes": 2066001,                                            ║
║   INSERT INTO like_outbox                              ║    ║   "liked_at": "09:31"                                              ║    ║   "minute": "09:31",                                                   ║    ║ alarm if any row waits over 1 minute     ║    ║   "headers": {             ║    ║ p-902#15  = 129,300                   ║    ║ }                                  ║    ║   "comments": 48210                                            ║
║     (7, 09:31, e-5001, like.events, bob, ...);         ║    ║ }                                                                  ║    ║   "event_id": "e-5001",                                                ║    ╚══════════════════════════════════════════╝    ║     "id": "e-5001",        ║    ║ sum every 2 seconds -> 2,066,001      ║    ║ (overwritten with totals by Flink) ║    ║ }                                                              ║
║ APPLY BATCH;                                           ║    ╚════════════════════════════════════════════════════════════════════╝    ║   "topic": "like.events",                                              ║                                                    ║     "type": "like.created" ║    ╚═══════════════════════════════════════╝    ╚════════════════════════════════════╝    ╚════════════════════════════════════════════════════════════════╝
║ (written to the batch log first: if a server dies      ║                                                                              ║   "key": "bob",                                                        ║                                                    ║   },                       ║
║  halfway, the rest is still written later)             ║                                                                              ║   "type": "like.created",                                              ║                                                    ║   "value": {               ║
╚════════════════════════════════════════════════════════╝                                                                              ║   "payload": {                                                         ║                                                    ║     "user_id": "bob",      ║
                                                                                                                                        ║     "user_id": "bob",                                                  ║                                                    ║     "post_id": "p-902"     ║
                                                                                                                                        ║     "post_id": "p-902"                                                 ║                                                    ║   }                        ║
                                                                                                                                        ║   }                                                                    ║                                                    ║ }                          ║
                                                                                                                                        ║ }                                                                      ║                                                    ╚════════════════════════════╝
                                                                                                                                        ╚════════════════════════════════════════════════════════════════════════╝
```

1. **Bob taps the heart**
   - **a) The request:** `PUT /v1/posts/p-902/like`; unlike is `DELETE` on the same address; both are safe to repeat
   - **b) Optimistic UI:** the heart turns red on the phone **at once**, before the server answers (assume success, undo if it fails)
   - **Data change:** none yet
   - **Why:** about 2 million people a minute like Celeb's post; none of them should wait for the counting.

2. **The Like Service saves the like AND its event in one logged batch, then replies**
   - **a) The batch**

            BEGIN BATCH
              INSERT INTO user_likes (user_id, post_id, liked_at) VALUES ('bob', 'p-902', '09:31');
              INSERT INTO like_outbox (shard, minute, event_id, topic, key, type, payload)
                   VALUES (7, '09:31', 'e-5001', 'like.events', 'bob', 'like.created', '{...}');
            APPLY BATCH;

   - **b) How a logged batch works**
     - Cassandra first writes the whole batch into its **batch log** (a safety note kept on other servers), then writes the two rows
     - if the server dies halfway, another server finds the note and finishes the job: the like and its event are saved **both or neither**
     - it is not a full SQL transaction: for a split second a reader could see one row before the other. That is fine here; we only need "never one without the other"
   - **c) The answer:** `204 No Content` in about 20 milliseconds; the count updates in the background
   - **Data change:**
     - `user_likes` row added `{user_id: bob, post_id: p-902, liked_at: 09:31}`
     - `like_outbox` row added `{shard: 7, minute: 09:31, event_id: e-5001, topic: like.events, key: bob, type: like.created, payload: {user_id: bob, post_id: p-902}}`
   - **Why the primary key is (user, post):** a double like writes the same row again, so it is never counted twice.
   - **Why Cassandra:** likes are the most frequent write in the system (around 200,000 a second at peak), and Cassandra is built for huge numbers of small writes. "Did Bob like these 20 posts?" is one read from one partition (all of Bob's likes are stored together).
   - **Why not "save to Cassandra, then send to Kafka":** that is two separate writes (a **dual write**). If the pod crashes between them, Bob's like is saved but the event is lost forever: the count never includes it, and nothing retries. With the outbox in the same batch, the event waits safely in the database; if Kafka is down for 10 minutes, outbox rows simply pile up and are sent later.
   - **Why the outbox is split by `shard` (hash of the key, 16 shards) and minute:** at 200,000 likes a second, one outbox partition would be a hot spot. 16 shards × 1 minute keeps every partition small, and the relay can read each one in order.

3. **The Outbox Relay reads unsent outbox rows**
   - **a) How**
     - a small always-on worker; each relay pod owns some of the 16 shards
     - many times a second it reads `like_outbox` for its shards, starting from the **oldest minute that still has rows**, in `event_id` order
     - it also re-reads the last few minutes, so a row that arrived a little late (for example finished from the batch log) is still found
   - **Data change:** none yet; it only reads `{shard: 7, minute: 09:31, event_id: e-5001, …}`
   - **Why a relay:** it is the only one allowed to send these events, so nothing depends on the Like Service staying alive after it replied.
   - **Why not Debezium here, like the posts:** Debezium's outbox router is built for SQL databases (PostgreSQL / MySQL). Cassandra's change log (CDC, Change Data Capture) works per server and per file, and gives each change once per copy (3 copies = 3 times), which is awkward. A small relay that reads the outbox table is simpler and easy to reason about.

4. **The relay publishes to Kafka, then deletes the row**
   - **a) Publish:** topic `like.events`, key `bob`; it waits until Kafka confirms all copies are saved (`acks=all`)
   - **b) Delete:** only after that confirm is the `like_outbox` row e-5001 deleted
   - **c) Safety alarm:** if any outbox row waits more than 1 minute, the team is alerted (the relay is stuck)
   - **Data change:**
     - Kafka topic `like.events`, message `{key: bob, headers: {type: like.created, id: e-5001}, value: {user_id: bob, post_id: p-902}}`
     - `like_outbox` row e-5001 deleted
   - **Why the delete comes after the confirm:** if the relay crashes after sending but before deleting, the row is simply sent again. That can make a **duplicate, never a loss**. Every reader drops a repeated event id (step 5).
   - **Why the key is the user, not the post:** Kafka puts all messages with the same key on one partition (one server). Keyed by post, Celeb's 2 million likes a minute would all pile onto one overloaded partition (a "hot partition"). Keyed by user, they spread evenly, and Bob's like and unlike still stay in order.
   - **The outbox in real life:** Bob's like is a signed contract. Instead of "file the contract, then walk to the post office" (and maybe faint on the way), the clerk files the contract **and drops a letter in the out-tray in one move**. A courier (the relay) empties the out-tray all day, and only throws a letter away after the post office (Kafka) stamps it received.

5. **Apache Flink drops repeats, then counts with a split counter (the hot-post fix)**
   - **a) Drop repeats:** Flink remembers every event id it saw in the last 24 hours (in its own saved state); a second e-5001 from a relay retry is thrown away
   - **b) Split:** each like is counted under key `p-902#(hash(userId) % 16)`, i.e. one of 16 shares; 16 Flink workers each count one share of p-902 in parallel
   - **c) Add up:** every 2 seconds, the 16 partial sums are added into one total per post
   - **d) Checkpoints:** Flink saves snapshots of its counts and its place in Kafka, so after a restart each event is still counted exactly once
   - **Data change:** Flink's running state `p-902#0 = 129,100`, `p-902#1 = 128,950`, …, total `2,066,001`
   - **Why split, in real life:** instead of one cashier counting a stadium crowd through one gate, open 16 gates with one counter each, and every 2 seconds a supervisor adds the 16 numbers. Nobody waits in one long line.

6. **Flink writes the TOTAL, not +1**
   - **a) Two places:** the Post Cache for reading, `post_stats` as the permanent copy
   - **Data change:**
     - Redis `stats:p-902` → `likes = 2066001`
     - Cassandra `post_stats` row updated `{post_id: p-902, likes: 2066001}`
   - **Why totals:** replaying the same events writes the same total, so a replay is harmless. 2 million likes a minute become about 30 writes a minute instead of 2 million row updates.
   - **Why a few seconds late is fine:** the app shows "2.1M" anyway. A nightly job still recounts from `user_likes` as a last safety net.

**Say in the interview:** "Likes are stored per user in Cassandra with primary key (user, post), so a double like is impossible. The like and an outbox row are written in one logged batch, and an Outbox Relay sends the row to Kafka and deletes it after the ack, so no event is lost and repeats are dropped by event id. Events are keyed by user to avoid a hot partition. Flink counts with a 16-way salted key and writes totals every 2 seconds."

### Flow 5. Bob comments on Alice's post → saved, counted, Alice is told (Cassandra batch + outbox → Outbox Relay → Kafka → Flink + notifications)

```text
┌── STEP 1 ────────────────────────────────────────────────┐            ┌── STEP 1 ────────────────────────────────────────────────┐            ┌── STEP 2 ────────────────────────────────────────────────┐            ┌── STEP 2, 3, 4 ──────────────────────────────────────────┐            ┌── STEP 3, 4 ─────────────────────────────────────────────┐            ┌── STEP 4, 5 ─────────────────────────────────────────────┐            ┌── STEP 5, 6 ─────────────────────────────────────────────┐            ┌── STEP 6 ────────────────────────────────────────────────┐
│ Bob  (mobile app)                                        │            │ API Gateway  (front door)                                │            │ Like / Comment Service                                   │            │ Engagement Database  (Apache Cassandra)                  │            │ Outbox Relay  (small always-on worker)                   │            │ Apache Kafka  (event pipe)                               │            │ Apache Flink  (counts)                                   │            │ Post Cache  (Redis, in-memory)                           │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Comments 'Beautiful!' on Alice's p-901           │ ─────────> │ STEP 1: Checks login + rate limit, then routes           │ ─────────> │ STEP 2: Checks the comment                               │ ─────────> │ STEP 2: Stores the comment and the event, both or        │ ─────────> │ STEP 3: Reads unsent outbox rows                         │ ─────────> │ STEP 4: Keeps comments on p-901 in order                 │ ────┬────> │ STEP 5: Drops repeats, counts comments per post          │ ────┬────> │ STEP 6: Shows the new count                              │
│   - POST /v1/posts/p-901/comments + Idempotency-Key:     │            │   - /v1/posts/*/comments -> Like / Comment Service       │            │   - length, has Alice blocked Bob?, spam score           │            │         neither                                          │            │   - each pod owns some of the 16 shards                  │            │   - comment.events, key p-901                            │     │      │   - the same split-and-add method as likes               │     │      │   - HSET stats:p-901 comments 12                         │
│     k-456                                                │            │     (gRPC, short time limit)                             │            │                                                          │            │   - comments partition = (post, day)                     │            │   - oldest minute with rows first, many times a second   │            │   - e.g. id e-6001, type comment.created                 │     │      │   - e.g. p-901: 12 comments                              │     │      │                                                          │
│   - e.g. he sees his comment at once                     │            │   - e.g. user id bob taken from the login token          │            │ STEP 2: Saves comment + event in ONE logged batch        │            │   - e.g. p-901 / 2026-11-13 / cm-501; e-6001             │            │   - re-reads the last few minutes for late rows          │            │                                                          │     │      │                                                          │     │      │ STEP 6: Keeps the first page of comments                 │
└──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘            │   - BEGIN BATCH; comments + comment_outbox; APPLY BATCH  │            │                                                          │            │   - e.g. reads e-6001 from shard 3                       │            │ STEP 5: Delivers to two consumer groups                  │     │      │ STEP 6: Writes the totals                                │     │      │   - fresh 60 s, served old up to 10 min while one        │
                                                                                                                                                │   - e.g. replies 201 Created {commentId: cm-501}         │            │ STEP 3: Gives the relay its unsent rows                  │            │                                                          │            │   - counting (Flink) and notification, each at its own   │     │      │   - Redis stats:p-901 + Cassandra post_stats             │     │      │     request refreshes                                    │
                                                                                                                                                └──────────────────────────────────────────────────────────┘            │   - comment_outbox partition (shard, minute)             │            │ STEP 4: Publishes to Kafka, then deletes the row         │            │     pace                                                 │     │      │   - e.g. comments = 12                                   │     │      │   - e.g. comments:p-901:page1 = [cm-501, ...]            │
                                                                                                                                                                                                                        │   - e.g. shard 3, minute 09:32                           │            │   - send to comment.events with acks=all, then DELETE    │            └──────────────────────────────────────────────────────────┘     │      └──────────────────────────────────────────────────────────┘     │      └──────────────────────────────────────────────────────────┘
                                                                                                                                                                                                                        │                                                          │            │     from comment_outbox                                  │                                                                             │                                                                       │
                                                                                                                                                                                                                        │ STEP 4: Drops the row once Kafka has it                  │            │   - e.g. crash before the delete = a repeat, never a     │                                                                             │                                                                       │
                                                                                                                                                                                                                        │   - DELETE FROM comment_outbox ... e-6001                │            │          loss                                            │                                                                             │                                                                       │
                                                                                                                                                                                                                        └──────────────────────────────────────────────────────────┘            │                                                          │                                                                             │                                                                       │
                                                                                                                                                                                                                                                                                                │ STEP 4: Raises an alarm if a row is stuck                │                                                                             │                                                                       │
                                                                                                                                                                                                                                                                                                │   - any row waiting over 1 minute                        │                                                                             │                                                                       │
                                                                                                                                                                                                                                                                                                └──────────────────────────────────────────────────────────┘                                                                             │                                                                       │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │                                                                       │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │                                                                       │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │                                                                       │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │                                                                       │      ┌── STEP 6 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                                                                                                                                                                                                                                         │                                                                       │      │ Engagement Database  (post_stats table)                  │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │                                                                       │      ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                                                                                                                                                                                                                                         │                                                                       └────> │ STEP 6: Keeps the permanent total                        │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │                                                                              │   - UPDATE post_stats SET comments = 12 WHERE post_id =  │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │                                                                              │     p-901                                                │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │                                                                              └──────────────────────────────────────────────────────────┘
                                                                                                                                                                                                                                                                                                                                                                                                                                         │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │      ┌── STEP 5, 6 ─────────────────────────────────────────────┐            ┌── STEP 6 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                                                                                                                                                                                                                                         │      │ Notification Service  (+ moderation worker)              │            │ Alice's phone                                            │
                                                                                                                                                                                                                                                                                                                                                                                                                                         │      ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                                                                                                                                                                                                                                         └────> │ STEP 5: Skips an event id it already sent                │ ─────────> │ STEP 6: Shows 'Bob commented on your post'               │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │   - saves e-6001 as 'sent', set only if not there yet    │            │   - a push notification                                  │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │   - e.g. Alice is never told twice                       │            │   - e.g. a tap opens the comments on p-901               │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │                                                          │            └──────────────────────────────────────────────────────────┘
                                                                                                                                                                                                                                                                                                                                                                                                                                                │ STEP 5: Hides abusive comments                           │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │   - a separate moderation worker, in the background      │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │                                                          │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │ STEP 6: Tells the post's author                          │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │   - Apple / Google push, once per comment                │
                                                                                                                                                                                                                                                                                                                                                                                                                                                │   - e.g. 'Bob commented on your post'                    │
                                                                                                                                                                                                                                                                                                                                                                                                                                                └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Cassandra                                                                                                                                                                                                                 ▼ Outbox Relay                                  ▼ Kafka                              ▼ Post Cache                                                                                  ▼ Cassandra
╔═══════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════╗    ╔═══════════════════════════════╗    ╔════════════════════════════════════╗    ╔══════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════╗
║ Cassandra logged batch (comment + event, both or neither) ║    ║ comments (Cassandra) · partition post_id + day · sorted by comment_id ║    ║ comment_outbox (Cassandra) · partition shard + minute · sorted by      ║    ║ Outbox Relay progress (per shard)        ║    ║ Kafka message                 ║    ║ Redis key: counts · hash           ║    ║ Redis key: first page of comments · list     ║    ║ post_stats (Cassandra) · key post_id · totals written by Flink ║
╟───────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────────────────────────╢    ║ event_id                                                               ║    ╟──────────────────────────────────────────╢    ╟───────────────────────────────╢    ╟────────────────────────────────────╢    ╟──────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────╢
║ BEGIN BATCH                                               ║    ║ {                                                                     ║    ╟────────────────────────────────────────────────────────────────────────╢    ║ shard 3: oldest minute with rows = 09:32 ║    ║ {                             ║    ║ stats:p-901 = {                    ║    ║ comments:p-901:page1 = [cm-501, cm-498, ...] ║    ║ {                                                              ║
║   INSERT INTO comments                                    ║    ║   "post_id": "p-901",                                                 ║    ║ {                                                                      ║    ║ re-reads the last few minutes too, so a  ║    ║   "topic": "comment.events",  ║    ║   "likes": 64,                     ║    ║ (fresh 60 s, may be served old up to 10 min) ║    ║   "post_id": "p-901",                                          ║
║     (p-901, 2026-11-13, cm-501, ...);                     ║    ║   "day": "2026-11-13",                                                ║    ║   "shard": 3,                                                          ║    ║ late-arriving row is still sent          ║    ║   "key": "p-901",             ║    ║   "comments": 12                   ║    ╚══════════════════════════════════════════════╝    ║   "likes": 64,                                                 ║
║   INSERT INTO comment_outbox                              ║    ║   "comment_id": "cm-501",                                             ║    ║   "minute": "09:32",                                                   ║    ║ alarm if any row waits over 1 minute     ║    ║   "headers": {                ║    ║ }                                  ║                                                        ║   "comments": 12                                               ║
║     (3, 09:32, e-6001, comment.events, p-901, ...);       ║    ║   "author_id": "bob",                                                 ║    ║   "event_id": "e-6001",                                                ║    ╚══════════════════════════════════════════╝    ║     "id": "e-6001",           ║    ║ (overwritten with totals by Flink) ║                                                        ║ }                                                              ║
║ APPLY BATCH;                                              ║    ║   "text": "Beautiful!",                                               ║    ║   "topic": "comment.events",                                           ║                                                    ║     "type": "comment.created" ║    ╚════════════════════════════════════╝                                                        ╚════════════════════════════════════════════════════════════════╝
╚═══════════════════════════════════════════════════════════╝    ║   "created_at": "09:32"                                               ║    ║   "key": "p-901",                                                      ║                                                    ║   },                          ║
                                                                 ║ }                                                                     ║    ║   "type": "comment.created",                                           ║                                                    ║   "value": {                  ║
                                                                 ╚═══════════════════════════════════════════════════════════════════════╝    ║   "payload": {                                                         ║                                                    ║     "post_id": "p-901",       ║
                                                                                                                                              ║     "post_id": "p-901",                                                ║                                                    ║     "comment_id": "cm-501",   ║
                                                                                                                                              ║     "comment_id": "cm-501",                                            ║                                                    ║     "author_id": "bob",       ║
                                                                                                                                              ║     "author_id": "bob",                                                ║                                                    ║     "post_author": "alice"    ║
                                                                                                                                              ║     "post_author": "alice"                                             ║                                                    ║   }                           ║
                                                                                                                                              ║   }                                                                    ║                                                    ║ }                             ║
                                                                                                                                              ║ }                                                                      ║                                                    ╚═══════════════════════════════╝
                                                                                                                                              ╚════════════════════════════════════════════════════════════════════════╝
```

1. **Bob comments**
   - **a) The request:** `POST /v1/posts/p-901/comments {text: "Beautiful!"}` + `Idempotency-Key: k-456`
   - **Data change:** none yet
   - **Why the key:** a retry never posts the comment twice.

2. **The Comment Service checks it, then saves the comment AND its event in one logged batch**
   - **a) Checks:** length, whether Alice has blocked Bob, and a spam score
   - **b) One logged batch:** the `comments` row + the `comment_outbox` row, both or neither (as in Flow 4)
   - **c) The answer:** `201 Created {commentId: cm-501}`; Bob sees his comment at once
   - **Data change:**
     - `comments` row added `{post_id: p-901, day: 2026-11-13, comment_id: cm-501, author_id: bob, text: "Beautiful!"}`
     - `comment_outbox` row added `{shard: 3, minute: 09:32, event_id: e-6001, topic: comment.events, key: p-901, type: comment.created, payload: {post_id: p-901, comment_id: cm-501, author_id: bob, post_author: alice}}`
   - **Why the partition is (post, day):** a partition is the group of rows stored together on one server. With the day in the key, a viral post's 500,000 comments are split across days instead of one giant group. The `comment_id` is a Snowflake id, so comments are sorted by time inside each day.
   - **Why the outbox in the same batch:** same reason as likes. Without it, a crash right after saving would leave Bob's comment on the page but Alice never told and the count never raised.

3. **The Outbox Relay reads the unsent row**
   - **a) The same relay as Flow 4**, also reading `comment_outbox`, shard by shard
   - **Data change:** none yet; it reads `{shard: 3, minute: 09:32, event_id: e-6001, …}`
   - **Why:** only the relay sends, so the Comment Service can forget the event as soon as it replied.

4. **The relay publishes the event, then deletes the row**
   - **a) Publish:** topic `comment.events`, key `p-901`, `acks=all`
   - **b) Delete:** the `comment_outbox` row e-6001, only after the confirm
   - **Data change:**
     - Kafka topic `comment.events`, message `{key: p-901, headers: {type: comment.created, id: e-6001}, value: {post_id: p-901, comment_id: cm-501, author_id: bob, post_author: alice}}`
     - `comment_outbox` row e-6001 deleted
   - **Why the key is the post:** comments on one post stay in order. Unlike likes, comments are slow enough that one post does not overload a partition.

5. **Two consumer groups react, each at its own pace**
   - **a) Flink (counting group):** drops repeated event ids, then counts comments per post with the same split-and-add method as likes
   - **b) Notification Service:** first saves the event id `e-6001` as "sent" (set only if not there yet), so a repeated event never notifies Alice twice
   - **c) Moderation worker:** a separate worker hides abusive comments in the background
   - **Data change:** Flink's running count for p-901 becomes 12; `e-6001` is marked as sent
   - **Why separate groups:** a slow notification never holds up the count, and the other way round.

6. **Results: new count, Alice is told**
   - **a) Counts:** Redis `stats:p-901` gets the new total; Cassandra `post_stats` for p-901 gets the same total
   - **b) Alice is told:** "Bob commented on your post" through Apple / Google push services
   - **c) Reading comments later:** `GET /v1/posts/p-901/comments?cursor=…`
     - page 1 is cached in Redis (`comments:p-901:page1`) with **stale-while-revalidate**: "fresh" for 60 seconds; after that the old copy is still served (up to 10 minutes) while one request loads a fresh one in the background
     - next pages: the cursor walks back one day bucket at a time
   - **Data change:**
     - Redis `stats:p-901 = {likes: 64, comments: 12}`
     - Cassandra `post_stats` row updated `{post_id: p-901, comments: 12}`
     - Redis `comments:p-901:page1 = [cm-501, cm-498, …]`
   - **Why stale-while-revalidate:** a busy post's first page is read all the time; nobody waits for a refill, and only one request does it.

**Say in the interview:** "Comments go to Cassandra partitioned by (post, day) with time-sorted ids, together with an outbox row in one logged batch. The Outbox Relay sends the event keyed by post to Kafka, where it feeds a counter in Flink and the notification and moderation workers, all of which drop repeated event ids. The first page is cached with stale-while-revalidate."

### Flow 6. Bob opens his feed (Feed Cache push list + celebrity pull → merge → fill in details)

```text
                              ┌─── STEP 7: the phone downloads the images from CloudFront, nearest server first ──────>───────────────────────────────────────>───────────────────────────────────────>───────────────────────────────────────>───────────────────────────────────────>───────────────────────────────────────>───────────────────────────────────────>───────────────────────────────┐
                              │                                                                                                                                                                                                                                                                                                                                                                       │
                              ^                                                                                                                                                                                                                                                                                                                                                                       v
┌── STEP 1, 6, 7 ─────────────┴────────────────────────────┐            ┌── STEP 1 ────────────────────────────────────────────────┐            ┌── STEP 2, 3, 4, 6 ───────────────────────────────────────┐            ┌── STEP 2, 5 ─────────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐            ┌── STEP 7 ───────────────────┬────────────────────────────┐
│ Bob  (mobile app)                                        │            │ API Gateway  (front door)                                │            │ Feed Service                                             │            │ Feed Cache  (Redis, in-memory)  <- THE FEED              │            │ Follower Graph + Post Database  (PostgreSQL)             │            │ CloudFront  (CDN)                                        │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Opens his feed                                   │ ─────────> │ STEP 1: Checks login + limits, adds X-User-Id: bob       │ ─────────> │ STEP 2: Reads Bob's lists in one Redis round trip        │ ────┬────> │ STEP 2: Gives the pushed and the pulled ids              │ ─────────> │ STEP 5: Only if feed:bob is missing                      │            │ STEP 7: Serves the images from a nearby server           │
│   - GET /v1/feed?cursor=&limit=20                        │            │   - /v1/feed -> Feed Service (gRPC)                      │            │   - feed:bob, celebs_followed:bob, author_recent:celeb   │     │      │   - pushed by fanout (Flows 2, 3); celebrity lists       │            │   - reads following for bob, then each author's newest   │            │   - S3 is read only on a miss (Flow 1)                   │
│   - e.g. or pulls down to refresh                        │            │   - e.g. the feed is slowed down last when overloaded    │            │   - e.g. ≈5 ms                                           │     │      │     pulled now                                           │            │     posts                                                │            │   - e.g. the Mumbai edge for Bob                         │
│                                                          │            └──────────────────────────────────────────────────────────┘            │                                                          │     │      │   - e.g. feed:bob = [p-901, ...]; author_recent:celeb =  │            │   - e.g. the result is written into feed:bob             │            └──────────────────────────────────────────────────────────┘
│ STEP 6: Shows 20 posts                                   │                                                                                    │ STEP 3: Merges and ranks                                 │     │      │          [p-902, ...]                                    │            └──────────────────────────────────────────────────────────┘
│   - loads the next page early with nextCursor while he   │                                                                                    │   - drops deleted posts + blocked authors; newness,      │     │      │                                                          │
│     scrolls                                              │                                                                                    │     closeness, popularity                                │     │      │ STEP 5: No feed:bob at all? Rebuilt by pull              │
│   - e.g. Alice's p-901 and Celeb's p-902 among them      │                                                                                    │   - e.g. top 20; too slow -> newest first                │     │      │   - new or long-inactive user; a lock so it is built     │
│                                                          │                                                                                    │                                                          │     │      │     once                                                 │
│ STEP 7: Loads the images from CloudFront                 │                                                                                    │ STEP 4: Fills in the details                             │     │      └──────────────────────────────────────────────────────────┘
│   - blurry preview first, then the 640-pixel image       │                                                                                    │   - MGET post:{id} + stats:{id}; one Cassandra read for  │     │
│   - e.g. cdn.example.com/m-77/640.a1b2.webp              │                                                                                    │     Bob's likes                                          │     │
└──────────────────────────────────────────────────────────┘                                                                                    │   - e.g. text, image link, counts, red hearts            │     │
                                                                                                                                                │                                                          │     │
                                                                                                                                                │ STEP 6: Answers                                          │     │
                                                                                                                                                │   - {posts[20], nextCursor = smallest post id on the     │     │
                                                                                                                                                │     page}                                                │     │
                                                                                                                                                │   - e.g. 99% within ≈150 ms                              │     │
                                                                                                                                                └──────────────────────────────────────────────────────────┘     │
                                                                                                                                                                                                                 │
                                                                                                                                                                                                                 │
                                                                                                                                                                                                                 │
                                                                                                                                                                                                                 │      ┌── STEP 4, 5 ─────────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                 │      │ Post Cache  (Redis, in-memory)                           │            │ Post Database  (PostgreSQL)                              │
                                                                                                                                                                                                                 │      ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                 ├────> │ STEP 4: Gives post + counts for the 20 ids               │ ─────────> │ STEP 5: Only on a Post Cache miss                        │
                                                                                                                                                                                                                 │      │   - one MGET; a tiny in-server cache sits in front       │            │   - the lease winner reads p-902; the others wait ≈50    │
                                                                                                                                                                                                                 │      │   - e.g. post:p-902, stats:p-902                         │            │     ms, then read the cache                              │
                                                                                                                                                                                                                 │      │                                                          │            └──────────────────────────────────────────────────────────┘
                                                                                                                                                                                                                 │      │ STEP 5: A miss? One lease winner refills it              │
                                                                                                                                                                                                                 │      │   - SET lease:post:p-902 NX PX 2000                      │
                                                                                                                                                                                                                 │      │   - e.g. 400,000 misses -> 1 database read               │
                                                                                                                                                                                                                 │      └──────────────────────────────────────────────────────────┘
                                                                                                                                                                                                                 │
                                                                                                                                                                                                                 │
                                                                                                                                                                                                                 │
                                                                                                                                                                                                                 │      ┌── STEP 4 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                 │      │ Engagement Database  (Apache Cassandra)                  │
                                                                                                                                                                                                                 │      ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                 └────> │ STEP 4: Says which posts Bob liked                       │
                                                                                                                                                                                                                        │   - user_likes WHERE user_id = bob AND post_id IN (20    │
                                                                                                                                                                                                                        │     ids)                                                 │
                                                                                                                                                                                                                        │   - e.g. p-902 liked -> red heart                        │
                                                                                                                                                                                                                        └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Feed Cache                                                                                                                                                   ▼ Post Cache                                                                                                                                    ▼ Cassandra                                                               ▼ Graph + Post DB                                                                                                            ▼ CloudFront
╔═══════════════════════════════════════════════╗    ╔══════════════════════════════════════════╗    ╔════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════╗    ╔════════════════════════════════════╗    ╔═════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════════╗    ╔══════════════════════════════════╗
║ Redis key: Bob's feed · sorted set            ║    ║ Redis key: celebrities Bob follows · set ║    ║ Redis key: a celebrity's recent posts · sorted set ║    ║ Redis key: post details · hash                  ║    ║ Redis key: counts · hash           ║    ║ Redis key: miss lock (lease)            ║    ║ user_likes (Cassandra) · partition user_id · key user_id + post_id ║    ║ following (Graph DB) · key follower_id + followee_id ║    ║ posts (Post DB) · key post_id · index author_id + post_id ║    ║ CloudFront cache (per city)      ║
╟───────────────────────────────────────────────╢    ╟──────────────────────────────────────────╢    ╟────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────╢    ╟────────────────────────────────────╢    ╟─────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────────────╢    ╟──────────────────────────────────╢
║ feed:bob = [p-901, p-880, p-871, ...]         ║    ║ celebs_followed:bob = {celeb}            ║    ║ author_recent:celeb = [p-902, p-850, ...]          ║    ║ post:p-902 = {                                  ║    ║ stats:p-902 = {                    ║    ║ lease:post:p-902 = pod-17               ║    ║ {                                                                  ║    ║ {                                                    ║    ║ {                                                         ║    ║ m-77/640.a1b2.webp   kept 1 year ║
║ (score = post id, newest first;               ║    ╚══════════════════════════════════════════╝    ║ (newest 100; only celebrities have one)            ║    ║   "author": "celeb",                            ║    ║   "likes": 2066001,                ║    ║ (set only if not there yet: one winner; ║    ║   "user_id": "bob",                                                ║    ║   "follower_id": "bob",                              ║    ║   "post_id": "p-901",                                     ║    ║ m-77/blur.a1b2.jpg   kept 1 year ║
║  newest 500 kept, dropped after 30 idle days) ║                                                    ╚════════════════════════════════════════════════════╝    ║   "caption": "New song out!",                   ║    ║   "comments": 48210                ║    ║  expires in 2 seconds)                  ║    ║   "post_id": "p-902",                                              ║    ║   "followee_id": "alice",                            ║    ║   "author_id": "alice",                                   ║    ╚══════════════════════════════════╝
╚═══════════════════════════════════════════════╝                                                                                                              ║   "image": "cdn.example.com/m-90/640.c3d4.webp" ║    ║ }                                  ║    ╚═════════════════════════════════════════╝    ║   "liked_at": "09:31"                                              ║    ║   "created_at": "09:00"                              ║    ║   "caption": "Sunset at Goa",                             ║
                                                                                                                                                               ║ }                                               ║    ║ (overwritten with totals by Flink) ║                                                   ║ }                                                                  ║    ║ }                                                    ║    ║   "media_ids": ["m-77"],                                  ║
                                                                                                                                                               ║ (expires in ≈1 hour ± a random extra)           ║    ╚════════════════════════════════════╝                                                   ╚════════════════════════════════════════════════════════════════════╝    ╚══════════════════════════════════════════════════════╝    ║   "status": "ACTIVE",                                     ║
                                                                                                                                                               ╚═════════════════════════════════════════════════╝                                                                                                                                                                                                                                   ║   "created_at": "09:30"                                   ║
                                                                                                                                                                                                                                                                                                                                                                                                                                                     ║ }                                                         ║
                                                                                                                                                                                                                                                                                                                                                                                                                                                     ╚═══════════════════════════════════════════════════════════╝
```

1. **Bob opens the feed**
   - **a) The request:** `GET /v1/feed?cursor=&limit=20`
   - **b) API Gateway:** checks his login, adds the header `X-User-Id: bob`, and sends it to the Feed Service
   - **Data change:** none. This flow only reads (unless a cache has to be refilled, step 5)
   - **Why the feed has top priority:** when the system is overloaded, it is the last thing to be slowed down.

2. **The Feed Service reads Bob's lists**
   - **a) One batched round trip to Redis** (about 5 milliseconds)
     - `feed:bob` → newest **pushed** ids `[p-901, p-880, …]` (written by fanout in Flow 2)
     - `celebs_followed:bob` → `{celeb}` (written in Flow 3)
     - `author_recent:celeb` → newest **pulled** ids `[p-902, …]`
   - **Data change:** none
   - **Why one round trip:** three separate calls would triple the waiting.

3. **Merge and rank**
   - **a) Merge** the lists by post id; drop deleted posts and blocked authors
   - **b) Rank** by **newness**, **closeness** to Bob (how often he interacts with the author) and **popularity**, then keep the top 20
   - **c) Fallback:** if ranking takes too long, plain newest-first
   - **Data change:** none
   - **Why a fallback:** a slightly worse order is better than a slow feed.

4. **Fill in the details ("hydrate": turn ids into full posts)**
   - **a) Redis "get many keys at once" (`MGET`):** `post:{id}` and `stats:{id}` for the 20 ids → text, image link, like and comment counts
   - **b) Cassandra:** `user_likes WHERE user_id = bob AND post_id IN (…20 ids…)` → which hearts to show red; one read from one partition
   - **Data change:** none
   - **Why:** 20 posts cost one Redis call and one Cassandra read, not 40 separate calls.

5. **Only when something is missing from the cache (both protected by a lease)**
   - **a) Post Cache miss**
     - only the request that wins the lease (`SET lease:post:p-902 NX PX 2000`, "set if not there, expire in 2 seconds") reads the Post Database and refills Redis
     - everyone else waits about 50 milliseconds and reads the cache again
     - e.g. 400,000 misses on `post:p-902` → **1** database query
   - **b) No `feed:bob` at all** (new or long-inactive user): rebuild by pull
     - read `following` for Bob, then each author's newest posts from the `posts` index
     - write the result into `feed:bob`, again with a lock so 5 parallel requests rebuild it only once
   - **Data change:** Redis `lease:post:p-902 = pod-17` for 2 seconds, then `post:p-902` refilled; or `feed:bob` rebuilt
   - **Why a lease, in real life:** a popular shop's shelf runs empty and 1,000 customers all walk to the warehouse at once. A lease means the first customer gets a ticket and goes to the warehouse, the rest wait a moment by the shelf, and it is refilled once. Without it, a single expiring key on Celeb's post can send hundreds of thousands of reads to the database in one second (a "thundering herd").

6. **The response**
   - **a) The answer:** `{posts[20], nextCursor: <smallest post id on this page>}`; 99% of requests are answered within about 150 milliseconds
   - **b) Next page early:** the app asks for the next page with `nextCursor` while Bob scrolls
   - **Data change:** none
   - **Why a cursor, not a page number:** "give me posts older than id X" is a direct jump in a sorted list. "Skip the first 400 posts" (OFFSET) gets slower the deeper you scroll, and pages shift when new posts arrive.

7. **Images load from CloudFront**
   - **a) The same path as Flow 1, step 5:** the blurry preview first, then the 640-pixel image, from the nearest server
   - **Data change:** none (on a miss, CloudFront keeps a new copy)
   - **Why:** images never touch our servers, and the feed text never waits for them.

**Say in the interview:** "The feed is precomputed post ids in Redis (push), plus a small pull of the few celebrities you follow, merged and ranked, then hydrated with one multi-get and one Cassandra read. Misses are guarded by leases, and cold users are rebuilt by pull."

## Key design choices

| Area | Choice | Why (vs alternative) |
|---|---|---|
| Feed model | Hybrid: push to **active** followers for authors ≤ 100,000 followers, pull for celebrities; the line moves down automatically under load | Pure push = 100 million writes per celebrity post; pure pull = slow reads for people who follow many accounts |
| Media upload | Presigned link, client uploads **directly** to S3 → SQS → Media Workers → CloudFront | A service writing media to S3 itself (as in the reference image) carries every byte through our servers |
| Post database | Sharded PostgreSQL (split by author) | Needs a transaction to save post + outbox together; the reference image used Cassandra here |
| Likes and comments | Cassandra (Engagement Database) | Write-heavy and simple key lookups; no SQL transaction needed (the outbox uses a logged batch instead) |
| Events | **Every** event goes through an outbox: PostgreSQL outbox + Debezium for posts and follows; Cassandra logged batch + outbox table + Outbox Relay for likes and comments. One topic per kind of thing; keys chosen for order **and** spread | "Save then send" (a dual write) loses events on a crash, in any database; the reference image's raw / filtered / blocked post topics add little |
| Repeats from the outbox | Every event carries an id; every reader drops ids it has seen | An outbox gives "at least once": a crash can re-send, never lose |
| Like counts | Likes stored per user; Flink split (salted) counter writes totals every 2 seconds | A `like_count + 1` column = one hot row fought over by millions of writers |
| Follow graph | Two tables: `following` (split by follower) and `followers` (split by followee) | One table would make one of the two questions ask every server |
| Post ids | Snowflake ids (time + shard + counter) | Sortable by time and created without a central counter |
| Caching | Feed Cache (ids only) + Post Cache with tiny in-server cache, leases, random expiry + CDN | The reference image's author_latest_post / followers caches don't protect against stampedes |
| Backpressure | Rate limits, Kafka / SQS buffers, autoscale on lag, lower the celebrity line | Not shown in the reference image |
| APIs | `PUT` / `DELETE` (repeat-safe), cursor paging, `Idempotency-Key` | The reference image's `POST` like / unlike and page-number paging double-count on retries and get slow |

---

## Deep Dive (only what the flows above did not cover)

### 1. Back-of-the-envelope estimates (say these early)

Assume 500 million daily active users (people who open the app on a given day).

| Item | Math | Result |
|---|---|---|
| Posts | 500 million × 0.2 posts a day | about 1,200 a second on average, about 5,000 a second at peak → PostgreSQL is fine |
| Feed reads | 500 million × 20 opens a day | about 115,000 a second on average, **about 350,000 a second at peak** → prepare in advance + cache |
| Likes | 500 million × 10 likes a day | about 58,000 a second on average, about 200,000 a second at peak → Cassandra |
| Fanout writes | 100 million posts × about 200 active followers | about 230,000 a second on average, about 1 million a second at peak → about 100 Redis machines |
| Feed cache size | 300 million users × 500 ids × 16 bytes | about 2.5 TB → Redis split across many machines |
| Media | 100 million posts × 3 MB | about 300 TB a day → S3 + CDN |

---

### 2. Data model + indexes

**Rule:** every frequent read is a read from one partition (one server), in order, with a limit. No full-table scans, no OFFSET, no joins while reading the feed.

```sql
-- Post Database (PostgreSQL, split across servers by author)
posts(post_id PK, author_id, caption, media_ids, status, created_at, deleted_at)
INDEX posts_by_author (author_id, post_id DESC)        -- profile page, follow backfill
media(media_id PK, owner_id, type, status, raw_key, processed_prefix)
outbox(id PK, aggregatetype, aggregateid, type, payload, created_at)

-- Follower Graph Database (PostgreSQL): 2 tables so both lookups hit one server
users(user_id PK, name, follower_count, is_celebrity, last_active_at)
following(follower_id, followee_id)   PK both, split by follower_id
followers(followee_id, follower_id)   PK both, split by followee_id
outbox(...)

-- Engagement Database (Cassandra)
user_likes(user_id, post_id, liked_at)          PK ((user_id), post_id)          -- "did Bob like these 20?"
comments(post_id, day, comment_id, author_id, text)  PK ((post_id, day), comment_id)  -- day bucket = no giant partition
post_stats(post_id PK, likes, comments)
like_outbox(shard, minute, event_id, topic, key, type, payload)     PK ((shard, minute), event_id)  -- written in the SAME logged batch as user_likes
comment_outbox(...)                                                  same shape, written with comments
```

(PK = primary key, the unique key of a row. In Cassandra, the part in double brackets is the partition: rows stored together on one server.)

| Redis key | Type | Holds |
|---|---|---|
| `feed:{uid}` | sorted set, newest 500 | Pushed post ids, score = post id |
| `author_recent:{uid}` | sorted set, newest 100 | A celebrity's recent posts (for pull) |
| `celebs_followed:{uid}` | set | Celebrities this user follows |
| `post:{id}`, `stats:{id}` | hash | Post details, counts |
| `idem:{key}` | string, 24 hours | Saved answer for a repeated request |
| `lease:{key}` | string, 2 seconds | Who is refilling a missing cache key |

---

### 3. Kafka (topics + keys)

| Topic | Key | Why this key |
|---|---|---|
| `post.events` (`post.created`, `post.deleted`) | author id | One author's events stay in order |
| `like.events` | **user id** | Keyed by post, Celeb's 2 million likes a minute would land on one partition |
| `comment.events` (`comment.created`) | post id | Comments on a post stay in order |
| `follow.events` | follower id | Bob's follow → unfollow stay in order |

- Producers are only Debezium (PostgreSQL outboxes) and the Outbox Relay (Cassandra outboxes); no service sends to Kafka directly.
- Producers: wait for all copies (`acks=all`), idempotent producer (Kafka drops its own duplicate sends), 3 copies of every partition, and at least 2 copies must be in sync to accept a write (`min.insync.replicas=2`).
- Consumers mark a message done **after** the work, and every effect is safe to repeat (adding to sorted lists, upserts by primary key, writing totals).
  - e.g. fanout crashes after 500 of 1,000 `ZADD`s → the message is replayed → same result.

---

### 4. Celebrity hot spot (every place it hurts)

| Where | Problem with Celeb's `p-902` | Fix |
|---|---|---|
| Fanout | 100 million writes per post | **Pull:** one write to `author_recent:celeb` |
| Post cache read | 400,000 reads a second on one Redis key | **Tiny in-server cache (2 seconds)** + copies of the key `post:p-902#0..7` on different machines |
| Like counter | 2 million `likes + 1` a minute on one row | **Flink split (salted) counter** |
| Kafka partition | Keyed by post id → one hot partition | Key by **user id** |
| Comments | 500,000 an hour in one partition | Partition by `(post_id, day)` |
| Media | 100 million image loads | CDN + Origin Shield |
| Notifications | 100 million pushes → 100 million app opens at once | **Spread over 10–15 minutes** + warm the caches beforehand |

```text
Flink split counter
like.events (key = userId) → re-key to postId#(hash(userId) % 16)    ← p-902 spread over 16 workers
  → sum per 2-second window → re-group by postId → running total
  → write the TOTAL: HSET stats:p-902 likes 2066001 + UPDATE post_stats
```

- Writing **totals, not +1**, makes a replay harmless.
- About 3 seconds behind (the app shows "2.1M"). Repeated event ids are dropped first; a nightly job still recounts from `user_likes` and `comments` as a last safety net.

---

### 5. Thundering herd (cache stampede)

**Problem:** a popular cache key expires → thousands of requests miss at the same moment → all of them hit the database → the database falls over.

| Fix | How | Example |
|---|---|---|
| **Lease on miss** | `SET lease:key NX PX 2000` → only the winner reads the database; others wait 50 ms and read the cache again | 400,000 misses → 1 database query |
| **Request coalescing** | Inside one server, simultaneous misses for the same key share one fetch | 800 servers → at most 800 Redis calls |
| **Stale-while-revalidate** | Serve the old value while one caller fetches a fresh one | Comments page: fresh 60 seconds, served old up to 10 minutes |
| **Random expiry (TTL jitter)** | Time to live = 1 hour ± 10 minutes | Keys don't all expire together |
| **Spread out what you trigger** | Push notifications, retries (wait longer each time, plus randomness), scheduled jobs | 100 million pushes over 15 minutes |

---

### 6. Backpressure (end to end)

Backpressure means a slow part of the system can say "slow down" to the parts before it, instead of being flooded.

```text
Client ◄─429─ Gateway ◄─time limit─ Services ─► Kafka (buffer on disk) ─pull─► Consumers
                                                                   lag grows       → add more consumers
                                                                   lag grows a lot → lower the celebrity line
S3 ─► SQS (queue length) ─pull─► Media Workers (more workers when the queue grows)
```

| Layer | What it does |
|---|---|
| Client | On 429 / 503 errors, waits longer each time with some randomness; likes show at once on the phone |
| Gateway | Rate limit per user; drops low-priority work first (e.g. loading the next page early) |
| Services | Limited worker pools + time limits; fail fast (503) instead of queueing forever |
| Kafka | Buffers spikes on disk; consumers pull at their own speed |
| Fanout | Lag grows → more authors become "pull"; skip inactive followers |
| Media | Queue length → more workers; failures → dead-letter queue |

**What we give up first when overloaded:** skip ranking → show cached counts → show the last cached feed → pause notifications.

---

### 7. Cache layers

| Layer | What | How long / how it is cleared |
|---|---|---|
| Phone | Last feed page, images | Pull-to-refresh |
| CDN | Images and video | 1 year (new content = new file name) |
| Tiny in-server cache | Hot posts, celebrity `author_recent` | 1–5 seconds |
| Feed Cache (Redis) | `feed:{uid}`, ids only | Updated by fanout; removed after 30 idle days |
| Post Cache (Redis) | `post:{id}`, `stats:{id}` | 1 hour ± random extra; deleted when an edit / delete event arrives through Change Data Capture |

---

### 8. Failure scenarios

| Failure | What happens |
|---|---|
| A Redis feed machine dies | Its copy is promoted; missing feeds are rebuilt by pull (with leases) |
| The whole feed cache is lost | Feeds rebuilt lazily through a limited queue; users waiting too long get "popular now" |
| A Kafka server dies | Another copy takes over; with `acks=all` nothing is lost |
| The Post Database main server dies | Switch to a replica; outbox rows are still sent afterwards |
| The Like Service crashes right after saving a like | The outbox row was saved in the same batch, so the relay still sends the event |
| Kafka is down for 10 minutes | Outbox rows pile up in PostgreSQL / Cassandra; Debezium and the relay send them when Kafka is back |
| The Outbox Relay crashes after sending, before deleting | The row is sent again; Flink and the Notification Service drop the repeated event id |
| The relay is stuck | Alert when any outbox row waits more than 1 minute; another relay pod takes over its shards |
| Fanout falls behind (viral hour) | More workers on lag + lower the celebrity line + skip inactive followers |
| A media worker crashes | The SQS message reappears → retried; 5 failures → dead-letter queue + alert |
| The upload link expires | The phone asks for a new one; nothing was stored |

---

### 9. Real-world anchors

- **Facebook TAO:** a graph cache in front of sharded MySQL → our Follower Graph Database + caches.
- **Memcache at Facebook:** leases against the thundering herd, and cache deletion driven by the database change log.
- **Instagram ids:** Snowflake-style ids with the shard number inside, on sharded PostgreSQL.

---

### 10. End-to-end walk-through: Alice, Bob and Celeb

```text
09:00  Bob follows Alice   → following + outbox → follow.events → her last 20 posts added to feed:bob
09:30  Alice uploads       → POST /media/upload-url → presigned link → 3 MB PUT directly to S3 → workers → CloudFront
09:30  Alice posts p-901   → Post DB + outbox → post.events → 220 "add to list" commands → in feed:bob
09:30  Celeb posts p-902   → 1 write to author_recent:celeb; caches + CDN warmed; notifications spread out
09:31  Bob opens his feed  → feed:bob + author_recent:celeb → merge → rank → get many posts → 200 OK (≈140 ms)
09:31  Bob likes p-902     → user_likes + like_outbox (one batch) → relay → like.events → Flink → stats:p-902 = 2,066,001
09:32  Bob comments p-901  → comments + comment_outbox (one batch) → relay → comment.events → count + "Bob commented" to Alice
10:30  post:p-902 expires  → tiny in-server caches absorb most reads; 1 server wins the lease → 1 database read → refilled
```

---

### 11. Rapid-fire interview Q&A

| Question | Answer |
|---|---|
| Push or pull? | Hybrid: push for normal users, pull for celebrities |
| How is media uploaded? | The server signs a presigned link (AWS code library); the client PUTs directly to S3 |
| Why Kafka? | Absorbs spikes, separates services, many consumers on one stream, 7 days of replay |
| Is an event lost if Kafka is down? | No: the outbox keeps it in the database, written in the same transaction (PostgreSQL) or logged batch (Cassandra) |
| Cassandra has no transactions, so no outbox? | It still needs one. A logged batch saves the like and the outbox row both-or-neither; a relay sends the row |
| Can the outbox send an event twice? | Yes, after a crash. Every event has an id and every reader drops repeats |
| Like count at 2 million a minute? | Likes stored per user; Flink split counter; totals every 2 seconds |
| Double likes? | Primary key `(user_id, post_id)` + repeat-safe `PUT` |
| Thundering herd? | Leases + request coalescing + stale-while-revalidate + random expiry |
| Backpressure? | Rate limits, Kafka / SQS buffers, consumers pull, more workers when lag grows |
| Why a cursor? | A direct jump in a sorted index; pages stay stable |
| Redis wiped? | Rebuild feeds by pull with leases; "popular now" as a fallback |
