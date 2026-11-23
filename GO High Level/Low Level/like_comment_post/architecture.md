# Like / Comment / Post Service Architecture (Instagram-style private posts: follow requests, likes, one-level replies)

> **The one idea to remember: "Ask the database who may see a post in the same query that reads it, let a primary key stop a second like, and move a counter only when a row really changed."**
> Picture a private photo album at Priya's house. Only people on her guest list may open it, and the guard checks the list at the door every single time, not once a week. In this service the guard is one SQL (Structured Query Language) query: "give me post 901 **if** it is mine **or** I am an accepted follower of its author". A stranger like Anita gets a plain "not found", so she can't even tell the album exists.
> Likes work like a guest book where each person can sign a page only once: the **primary key** (the "this combination must be unique" rule of the table) `userId + targetType + targetId` refuses a second signature, so a double tap is harmless. The like counter on the post moves **only** when a new signature really went in.
> The whole service is one Node.js program (Express, a small web framework) talking to one **PostgreSQL** database (a database with all-or-nothing transactions). Photos never pass through it: they live in **S3** (Amazon's file storage) and reach phones through a **CDN** (Content Delivery Network, copies of files kept close to the user).
> Deep dive: [Deep Dive](#deep-dive-only-what-the-flows-above-did-not-cover)

## Requirements (minimal)

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

### Functional (what the product does)

</td><td valign="top" width="50%" markdown="1">

### Non-functional (how well it must work)

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Follow by request, the author accepts**
  - Every account is private. Following starts as a request; it counts only after the author says yes.
    - e.g. Rahul (user 7) asks to follow Priya (user 42); Priya taps "Accept".

</td><td valign="top" width="50%" markdown="1">

- **Follower counts never drift**
  - Counts move only when a row really goes PENDING → ACCEPTED, or an ACCEPTED row is removed.
    - e.g. Priya taps "Accept" twice; her follower count goes up once.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Post text and photos**
  - The photo is uploaded to S3 first; the post only stores the file's key (its path in S3).
    - e.g. Priya posts "Sunset at Nandi Hills" with `posts/42/9f3a.jpg` → post 901.

</td><td valign="top" width="50%" markdown="1">

- **Nobody can attach someone else's photo**
  - A key is accepted only inside the caller's own folder `posts/<own id>/`. Photo links are built when read, so the CDN address can change any time.
    - e.g. Rahul sending `posts/42/9f3a.jpg` gets `400 INVALID_MEDIA_KEY`.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Only the author and accepted followers see a post**
  - Reading, liking, commenting and listing all check this first.
    - e.g. Rahul opens post 901; Anita (user 8, not a follower) can't.

</td><td valign="top" width="50%" markdown="1">

- **No leaks, not even "it exists"**
  - A hidden post answers `404` (not found), never `403` (forbidden). The check is inside the same query that reads the post.
    - e.g. Anita gets the same 404 as for a post id that never existed.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Like and unlike posts and comments**
  - One heart per person per post or comment; "Liked by" list.
    - e.g. Rahul likes post 901; it shows "1 like".

</td><td valign="top" width="50%" markdown="1">

- **Safe to repeat**
  - Like is a `PUT` (same request twice = same result). The primary key blocks a second row; the counter moves only on a new row.
    - e.g. a weak network sends Rahul's like twice; `likeCount` is 1.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Comments and replies**
  - Comment on a post, reply to a comment, reply to a reply (shown as "@name").
    - e.g. Rahul: "Wow, which camera?" → Priya: "Pixel 9!" → Rahul: "@Priya Saving up for one!"

</td><td valign="top" width="50%" markdown="1">

- **Threads stay shallow and fast**
  - Only one level of nesting: a reply to a reply is stored under the top comment. One index serves "top comments" and "replies of X".
    - e.g. Rahul's second message is stored under 5001, not under 5002.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Read everything page by page**
  - A person's posts, comments, replies, "Liked by", follow requests.
    - e.g. Rahul scrolls Priya's comments 20 at a time.

</td><td valign="top" width="50%" markdown="1">

- **Page 500 is as fast as page 1**
  - Cursor paging ("give me the ones after the last one I saw"), never `OFFSET`. At most 50 rows per page.
    - e.g. `?cursor=5001` jumps straight to the rows after comment 5001.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Edit and delete your own posts and comments**
  - Only the owner can; deleted things vanish from every list.
    - e.g. Priya deletes post 901; its comments disappear too.

</td><td valign="top" width="50%" markdown="1">

- **Delete is safe and undoable**
  - Soft delete: the row gets `status = 2` and stays, so comment and like rows still point at something real.
    - e.g. support can restore post 901 by setting `status = 1`.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

</td><td valign="top" width="50%" markdown="1">

- **Every call is signed in, with no login lookup**
  - A JWT (JSON Web Token, a signed "this is user 7" card) on every request, checked with a secret key, no database call.
    - e.g. no token → `401` before any route runs.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

</td><td valign="top" width="50%" markdown="1">

- **Clear, consistent errors**
  - Services throw a small `HttpError`; one error handler turns it into the reply. Unknown errors become `500` without leaking details.
    - e.g. `?cursor=abc` → `400 {"error": "INVALID_CURSOR"}`.

</td></tr>
</table>

## APIs

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

| Feature | API |
|---|---|
| Create post | `POST /v1/posts {content?, mediaKeys?}` → `201 {post}` (with `mediaUrls`) |
| Read post | `GET /v1/posts/{postId}` → `{post, likedByMe}` or `404` |
| Edit post | `PATCH /v1/posts/{postId} {content}` → `{post}` or `404` |
| Delete post | `DELETE /v1/posts/{postId}` → `204` |
| A person's posts | `GET /v1/users/{userId}/posts?cursor=<id>&limit=` → `{items, nextCursor}` |
| Add comment / reply | `POST /v1/posts/{postId}/comments {text, parentId?}` → `201 {comment}` |
| List comments | `GET /v1/posts/{postId}/comments?sort=top&cursor=<id>&limit=` → `{items (+2 replies each), nextCursor}` |
| More replies | `GET /v1/comments/{commentId}/replies?cursor=<id>&limit=` → `{items, nextCursor}` |
| Edit / delete comment | `PATCH /v1/comments/{commentId} {text}` → `{comment}`; `DELETE /v1/comments/{commentId}` → `204` |

</td><td valign="top" width="50%" markdown="1">

| Feature | API |
|---|---|
| Every call | header `Authorization: Bearer <JWT>`, else `401` |
| Like / unlike post | `PUT /v1/posts/{id}/like` → `200`; `DELETE /v1/posts/{id}/like` → `204` |
| Like / unlike comment | `PUT /v1/comments/{id}/like` → `200`; `DELETE /v1/comments/{id}/like` → `204` |
| Liked by | `GET /v1/posts/{id}/likes?cursor=<time>&limit=` → `{items: [{id, name, createdat}], nextCursor}` |
| Ask to follow | `PUT /v1/users/{userId}/follow` → `202` |
| Unfollow / cancel request | `DELETE /v1/users/{userId}/follow` → `204` |
| My follow requests | `GET /v1/users/me/follow-requests?cursor=<time>&limit=` → `{items, nextCursor}` |
| Accept | `POST /v1/users/me/follow-requests/{followerId}/accept` → `200` or `404` |
| Decline | `DELETE /v1/users/me/follow-requests/{followerId}` → `204` |

</td></tr></table>

## Diagram

A quick map of all the parts and how they connect. Arrows (`──>`) show which way requests move. What each store keeps is in **Schema Overview**; each flow below walks through one piece.

```text
PEOPLE (outside)                                ╔══ THE LIKE / COMMENT / POST SERVICE: everything inside this box is ours ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
                                                ║                                                                                                                                                                                                                                                                                                        ║
┌──────────────────────────────────┐            ║       ┌──────────────────────────────────┐              ┌──────────────────────────────────┐                                                                                                                                                                                                           ║
│ Rahul's app (follower)           │ ─────┬─────╫─────> │ CDN (Content Delivery Network)   │ ───────────> │ S3 (file storage)                │                                                                                                                                                                                                           ║
├──────────────────────────────────┤      │     ║       ├──────────────────────────────────┤              ├──────────────────────────────────┤                                                                                                                                                                                                           ║
│ - likes, comments, follows       │      │     ║       │ - photo copies near phones       │              │ - the original photos            │                                                                                                                                                                                                           ║
│ - loads photos from the CDN      │      │     ║       │ - asks S3 on a miss              │              │ - key posts/<user id>/<file>     │                                                                                                                                                                                                           ║
└──────────────────────────────────┘      │     ║       └──────────────────────────────────┘              └──────────────────────────────────┘                                                                                                                                                                                                           ║
                                          │     ║                                                                                                                                                                                                                                                                                                        ║
                                          │     ║                                                                                                                                                                                                                                                                                                        ║
                                          │     ║                                                                                                                                                                                                                                                                                                        ║
                                          │     ║                                                                                                                                                                                                                                                                                                        ║
┌──────────────────────────────────┐      │     ║       ┌──────────────────────────────────┐              ┌──────────────────────────────────┐              ┌──────────────────────────────────┐              ┌──────────────────────────────────┐              ┌──────────────────────────────────┐              ┌──────────────────────────────────┐   ║
│ Priya's app (author)             │ ─────┼─────╫─────> │ requireAuth (middleware)         │ ───────────> │ Routers + validate + paginate    │ ───────────> │ Controllers                      │ ───────────> │ Services                         │ ─────┬─────> │ db_queries.js                    │ ───────────> │ PostgreSQL                       │   ║
├──────────────────────────────────┤      │     ║       ├──────────────────────────────────┤              ├──────────────────────────────────┤              ├──────────────────────────────────┤              ├──────────────────────────────────┤      │       ├──────────────────────────────────┤              ├──────────────────────────────────┤   ║
│ - posts photos                   │      │     ║       │ - checks the JWT login token     │              │ - id, body and cursor checks     │              │ - read request, send reply       │              │ - who can see what, owner rules  │      │       │ - every SQL in one file          │              │ - users, follows                 │   ║
│ - accepts follow requests        │      │     ║       │ - sets req.userId                │              │ - 400 on bad input               │              │ - pick the status code           │              │ - counters, reply flattening     │      │       │ - values passed as $1, $2        │              │ - posts, comments, likes         │   ║
└──────────────────────────────────┘      │     ║       └──────────────────────────────────┘              └──────────────────────────────────┘              └──────────────────────────────────┘              └──────────────────────────────────┘      │       └──────────────────────────────────┘              └──────────────────────────────────┘   ║
                                          │     ║                                                                                                                                                                                                       │                                                                                                ║
                                          │     ║                                                                                                                                                                                                       │                                                                                                ║
                                          │     ║                                                                                                                                                                                                       │                                                                                                ║
                                          │     ║                                                                                                                                                                                                       │                                                                                                ║
┌──────────────────────────────────┐      │     ║                                                                                                                                                                                                       │       ┌──────────────────────────────────┐                                                     ║
│ Anita's app (stranger)           │ ─────┘     ║                                                                                                                                                                                                       └─────> │ errorHandler (middleware)        │                                                     ║
├──────────────────────────────────┤            ║                                                                                                                                                                                                               ├──────────────────────────────────┤                                                     ║
│ - not a follower of Priya        │            ║                                                                                                                                                                                                               │ - HttpError -> status + code     │                                                     ║
│ - gets 404 on her posts          │            ║                                                                                                                                                                                                               │ - anything else -> 500           │                                                     ║
└──────────────────────────────────┘            ║                                                                                                                                                                                                               └──────────────────────────────────┘                                                     ║
                                                ║                                                                                                                                                                                                                                                                                                        ║
                                                ╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## Schema Overview

What every store keeps, as one real example per box. Where a field can take several values, they are shown as `A or B`; `0 -> 1` means the value changes in the flows. Each row scrolls sideways.

### PostgreSQL: people and who follows whom

```text
╔════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════╗
║ users (PostgreSQL) · key id                ║    ║ follows (PostgreSQL) · PRIMARY KEY followerId + followeeId ║
╟────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────╢
║ {                                          ║    ║ {                                                          ║
║   "id": 42,                                ║    ║   "followerId": 7,     -- Rahul (asks)                     ║
║   "name": "Priya",                         ║    ║   "followeeId": 42,    -- Priya (accepts)                  ║
║   "followerCount": 0 -> 1,                 ║    ║   "status": 1 (PENDING) or 2 (ACCEPTED),                   ║
║   "followingCount": 0,                     ║    ║   "createdAt": "2026-11-22T18:00:00+05:30"                 ║
║   "createdAt": "2026-11-20T09:00:00+05:30" ║    ║ }                                                          ║
║ }                                          ║    ║ CHECK followerId <> followeeId                             ║
╚════════════════════════════════════════════╝    ║ INDEX followeeId + status + createdAt DESC                 ║
                                                  ╚════════════════════════════════════════════════════════════╝
```

### PostgreSQL: posts, comments and likes

```text
╔════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════════════════════╗
║ posts (PostgreSQL) · key id · INDEX authorId + id DESC ║    ║ comments (PostgreSQL) · key id · INDEX postId + parentId + id DESC ║    ║ likes (PostgreSQL) · PRIMARY KEY userId + targetType + targetId ║
╟────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────────────────────╢
║ {                                                      ║    ║ {                                                                  ║    ║ {                                                               ║
║   "id": 901,                                           ║    ║   "id": 5003,                                                      ║    ║   "userId": 7,                                                  ║
║   "authorId": 42,                                      ║    ║   "postId": 901,                                                   ║    ║   "targetType": 1 (post) or 2 (comment),                        ║
║   "content": "Sunset at Nandi Hills",                  ║    ║   "authorId": 7,                                                   ║    ║   "targetId": 901,                                              ║
║   "mediaKeys": ["posts/42/9f3a.jpg"],                  ║    ║   "parentId": null (top-level) or 5001,                            ║    ║   "createdAt": "2026-11-22T19:05:00+05:30"                      ║
║   "likeCount": 1,                                      ║    ║   "replyToUserId": null or 42,      -- shown as "@Priya"           ║    ║ }                                                               ║
║   "commentCount": 3,                                   ║    ║   "text": "Saving up for one!",                                    ║    ║ INDEX targetType + targetId + createdAt DESC                    ║
║   "status": 1 (active) or 2 (deleted),                 ║    ║   "likeCount": 0,                                                  ║    ╚═════════════════════════════════════════════════════════════════╝
║   "createdAt": "2026-11-22T19:00:00+05:30",            ║    ║   "replyCount": 0,                                                 ║
║   "updatedAt": "2026-11-22T19:00:00+05:30"             ║    ║   "status": 1 (active) or 2 (deleted),                             ║
║ }                                                      ║    ║   "createdAt": "2026-11-22T19:20:00+05:30"                         ║
╚════════════════════════════════════════════════════════╝    ║ }                                                                  ║
                                                              ╚════════════════════════════════════════════════════════════════════╝
```

### S3, CDN, login token and pages

```text
╔═══════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════╗
║ S3 object (file storage) · key posts/<user id>/<file> ║    ║ CDN URL (built on every read, never stored)   ║    ║ JWT login token (sent on every call, not stored) ║    ║ Page reply (every list) · cursor paging                  ║
╟───────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────╢
║ {                                                     ║    ║ CDN_BASE_URL + "/" + key                      ║    ║ Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...    ║    ║ {                                                        ║
║   "bucket": "media-bucket",                           ║    ║ = "https://cdn.example.com/posts/42/9f3a.jpg" ║    ║ payload {                                        ║    ║   "items": [ ... up to limit rows ... ],                 ║
║   "key": "posts/42/9f3a.jpg",                         ║    ║ hit  -> served from the nearby copy           ║    ║   "sub": "7",                 -- Rahul's user id ║    ║   "nextCursor": "5001" or "2026-11-22T19:05:00Z" or null ║
║   "content_type": "image/jpeg",                       ║    ║ miss -> fetched from S3 once, then cached     ║    ║   "exp": 1795000000           -- expiry time     ║    ║ }                                                        ║
║   "size_bytes": 812000                                ║    ╚═══════════════════════════════════════════════╝    ║ }                                                ║    ╚══════════════════════════════════════════════════════════╝
║ }                                                     ║                                                         ║ signed with JWT_SECRET (HS256)                   ║
╚═══════════════════════════════════════════════════════╝                                                         ╚══════════════════════════════════════════════════╝
```

## Flows (the big diagram, one piece at a time)

Each flow is one slice of the big diagram. Every box says what it does in each step (`STEP n: what`, then how, then an example). Under each diagram, **Data in this flow** shows the rows and replies that flow touches, side by side (scroll sideways). The numbered steps below match the `STEP n` in the boxes.

Every request walks the same path inside the one Node.js program (written at the top of `main.js`): `express.json` (turns the body text into an object) → `requireAuth` → router (id checks, `validate`, `paginate`) → controller → service → `db/db_queries.js` → PostgreSQL. If anything throws, Express 5 jumps straight to `errorHandler`.

### Flow 1. Rahul asks to follow Priya, Priya accepts (Rahul's app → requireAuth → routes/users.js → controllers/users.js → services/users.js → PostgreSQL follows + users)

```text
┌── STEP 1 ────────────────────────────────────────────────┐              ┌── STEP 2 ────────────────────────────────────────────────┐              ┌── STEP 2 ────────────────────────────────────────────────┐              ┌── STEP 3, 5 ─────────────────────────────────────────────┐              ┌── STEP 3, 4, 5 ──────────────────────────────────────────┐              ┌── STEP 3, 4, 5 ──────────────────────────────────────────┐
│ Rahul's app (user 7)                                     │              │ requireAuth (middleware/auth.js)                         │              │ routes/users.js                                          │              │ controllers/users.js                                     │              │ services/users.js                                        │              │ PostgreSQL (follows, users)                              │
├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤
│ STEP 1: Taps "Follow" on Priya                           │ ─────┬─────> │ STEP 2: Finds out who is calling                         │ ───────────> │ STEP 2: Checks the ids in the path                       │ ───────────> │ STEP 3: Calls the service, picks the status              │ ───────────> │ STEP 3: Creates only a PENDING request                   │ ───────────> │ STEP 3: Stores the request once                          │
│   - PUT /v1/users/42/follow                              │      │       │   - jwt.verify with JWT_SECRET                           │              │   - router.param -> checkId: 1-19 digits                 │              │   - follow -> 202 (request sent)                         │              │   - no self-follow, target must exist                    │              │   - INSERT ... ON CONFLICT DO NOTHING                    │
│   - Bearer token in the header                           │      │       │   - user id taken from "sub", never the body             │              │   - paginate("time") on the list                         │              │   - e.g. Rahul gets 202                                  │              │   - counts do not move yet                               │              │   - e.g. follows (7, 42) status 1                        │
│   - e.g. 18:00, Priya is private                         │      │       │   - e.g. Rahul -> 7, Priya -> 42                         │              │   - e.g. /users/abc/follow -> 400 INVALID_ID             │              │                                                          │              │   - e.g. follow(7, 42)                                   │              │                                                          │
└──────────────────────────────────────────────────────────┘      │       └──────────────────────────────────────────────────────────┘              └──────────────────────────────────────────────────────────┘              │ STEP 5: Answers the accept                               │              │                                                          │              │ STEP 4: Finds pending requests fast                      │
                                                                  │                                                                                                                                                           │   - accept -> 200, decline -> 204                        │              │ STEP 4: Lists who asked                                  │              │   - INDEX followeeId + status + createdAt                │
                                                                  │                                                                                                                                                           │   - e.g. Priya gets 200                                  │              │   - newest first, cursor = createdAt                     │              │   - e.g. only Priya's part of the index                  │
                                                                  │                                                                                                                                                           └──────────────────────────────────────────────────────────┘              │   - e.g. toPage -> nextCursor null                       │              │                                                          │
                                                                  │                                                                                                                                                                                                                                     │                                                          │              │ STEP 5: Flips PENDING -> ACCEPTED once                   │
                                                                  │                                                                                                                                                                                                                                     │ STEP 5: Accepts, then moves both counters                │              │   - UPDATE ... WHERE status = 1                          │
                                                                  │                                                                                                                                                                                                                                     │   - counters move only if 1 row changed                  │              │   - then two counter UPDATEs                             │
                                                                  │                                                                                                                                                                                                                                     │   - e.g. 0 rows -> notFound() -> 404                     │              │   - e.g. status 2, counts 0 -> 1                         │
                                                                  │                                                                                                                                                                                                                                     └──────────────────────────────────────────────────────────┘              └──────────────────────────────────────────────────────────┘
                                                                  │
                                                                  │
                                                                  │
                                                                  │
┌── STEP 4, 5 ─────────────────────────────────────────────┐      │
│ Priya's app (user 42)                                    │      │
├──────────────────────────────────────────────────────────┤      │
│ STEP 4: Opens "Follow requests"                          │ ─────┘
│   - GET /v1/users/me/follow-requests                     │
│   - e.g. sees Rahul, asked 18:00                         │
│                                                          │
│ STEP 5: Taps "Accept"                                    │
│   - POST .../follow-requests/7/accept                    │
│   - e.g. a second tap gets 404                           │
└──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ PostgreSQL                                                                                                                                           ▼ Reply
╔════════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════╗    ╔═════════════════════════════╗    ╔═══════════════════════════════════════════════════════════════════════════╗
║ follows (PostgreSQL) · PRIMARY KEY followerId + followeeId ║    ║ users (PostgreSQL) · key id                ║    ║ users (PostgreSQL) · key id ║    ║ 200 reply to GET /v1/users/me/follow-requests                             ║
╟────────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────╢    ╟─────────────────────────────╢    ╟───────────────────────────────────────────────────────────────────────────╢
║ {                                                          ║    ║ {                                          ║    ║ {                           ║    ║ {                                                                         ║
║   "followerId": 7,     -- Rahul (asks)                     ║    ║   "id": 42,                                ║    ║   "id": 7,                  ║    ║   "items": [                                                              ║
║   "followeeId": 42,    -- Priya (accepts)                  ║    ║   "name": "Priya",                         ║    ║   "name": "Rahul",          ║    ║     {"id": "7", "name": "Rahul", "createdat": "2026-11-22T12:30:00.000Z"} ║
║   "status": 1 (PENDING) or 2 (ACCEPTED),                   ║    ║   "followerCount": 0 -> 1,                 ║    ║   "followerCount": 0,       ║    ║   ],                                                                      ║
║   "createdAt": "2026-11-22T18:00:00+05:30"                 ║    ║   "followingCount": 0,                     ║    ║   "followingCount": 0 -> 1  ║    ║   "nextCursor": null                                                      ║
║ }                                                          ║    ║   "createdAt": "2026-11-20T09:00:00+05:30" ║    ║ }                           ║    ║ }                                                                         ║
║ CHECK followerId <> followeeId                             ║    ║ }                                          ║    ╚═════════════════════════════╝    ╚═══════════════════════════════════════════════════════════════════════════╝
║ INDEX followeeId + status + createdAt DESC                 ║    ╚════════════════════════════════════════════╝
╚════════════════════════════════════════════════════════════╝
```

1. **Rahul taps "Follow" on Priya's profile**
   - **a) Call:** `PUT /v1/users/42/follow` with `Authorization: Bearer <Rahul's JWT>`
   - **b) Why `PUT`:** `PUT` means "make it so". Sending it twice ends in the same state, so the app can retry freely on a bad network.
   - **Data change:** none yet

2. **requireAuth finds out who is calling, the router checks the id**
   - **a) Token:** `jwt.verify(token, JWT_SECRET)` checks the signature and the expiry, then `req.userId = "7"` from the `sub` field
     - **What a JWT is:** a small card the login service gave Rahul: "user 7, valid until X", plus a stamp made with a secret key. Anyone can read the card, but only our servers can make a valid stamp, so nobody can change "7" to "42".
   - **b) Path id:** `router.param('userId', checkId)` lets only 1 to 19 digits through (a `BIGINT` has at most 19 digits). `/users/abc/follow` → `400 INVALID_ID` before any SQL runs
   - **Data change:** none
   - **Why the user id never comes from the body:** if it did, Rahul could send `{"userId": 42}` and act as Priya.

3. **The service saves only a PENDING request**
   - **a) Rules:** you can't follow yourself (`400 CANNOT_FOLLOW_SELF`); the target must exist (`userExists(42)`, else `404`)
   - **b) SQL:**

            INSERT INTO follows (followerId, followeeId, status) VALUES (7, 42, 1)
            ON CONFLICT DO NOTHING;   -- already asked or already following: nothing happens

   - **c) Reply:** the controller answers `202` ("request sent"), also on a repeat
   - **Data change:** `follows` row added `{followerId: 7, followeeId: 42, status: 1 (PENDING)}`; counts unchanged
   - **Why counts don't move yet:** a request is not a follow. If counts moved now, every ignored request would inflate Priya's follower number.
   - **Why the database has a `CHECK (followerId <> followeeId)` too:** the service check gives a nice error; the `CHECK` is the last guard if some other code path forgets it.

4. **Priya opens "Follow requests"**
   - **a) Call:** `GET /v1/users/me/follow-requests` → `paginate('time')` sets `req.page = {cursor: null, limit: 20}`
   - **b) SQL:** `follows JOIN users ... WHERE followeeId = 42 AND status = 1 ORDER BY createdAt DESC LIMIT 20`
   - **c) How it stays fast:** the index `(followeeId, status, createdAt DESC)` is already sorted that way, so PostgreSQL reads just Priya's pending part from the top, like opening a phone book at "Priya, pending" and reading down.
   - **Data change:** none
   - **Why `/me/`:** the user id comes from the token, so Priya can never ask for someone else's requests.

5. **Priya taps "Accept"**
   - **a) Flip once:**

            UPDATE follows SET status = 2
             WHERE followerId = 7 AND followeeId = 42 AND status = 1;   -- rowCount 1 or 0

   - **b) Only if 1 row changed:** `users.followingCount + 1` for Rahul and `users.followerCount + 1` for Priya. 0 rows (second tap, or no request) → `404`
   - **c) Decline instead:** `DELETE ... WHERE status = 1` → `204`. **Unfollow later:** `DELETE ... RETURNING status`; counts drop only if the deleted row was ACCEPTED (cancelling a pending request moves nothing)
   - **Data change:** `follows` (7, 42) status 1 → 2; `users` 42 `followerCount` 0 → 1; `users` 7 `followingCount` 0 → 1
   - **What the `WHERE status = 1` trick is called:** a conditional update (compare-and-set): "change it only if it still looks the way I expect". Two taps at the same moment can't both see PENDING, because PostgreSQL locks the row while updating it.
   - **Why (crash in between):** today the flip and the two counter updates are three separate statements on the pool (`db.query` each time), not one transaction. If the program dies after the flip, Rahul follows Priya but the counts stay 0 forever. The fix is to run all three inside one `BEGIN ... COMMIT` on one connection (`const c = await db.connect(); await c.query('BEGIN'); ...`), so either all three happen or none.

**Say in the interview:** "Following is a request row in `follows` with status PENDING. Accept is a conditional update `WHERE status = PENDING`, and counters move only when that update hit one row, all in one transaction. The user id always comes from the JWT."

### Flow 2. Priya posts a photo, Rahul's phone loads it (Priya's app → S3; Priya's app → requireAuth → validate.newPost → posts service → PostgreSQL; Rahul's app → CDN → S3)

```text
┌── STEP 1, 2 ─────────────────────────────────────────────┐              ┌── STEP 2 ────────────────────────────────────────────────┐              ┌── STEP 3 ────────────────────────────────────────────────┐              ┌── STEP 5 ────────────────────────────────────────────────┐              ┌── STEP 4 ────────────────────────────────────────────────┐              ┌── STEP 4 ────────────────────────────────────────────────┐
│ Priya's app (user 42)                                    │              │ requireAuth (middleware/auth.js)                         │              │ routes/posts.js + validate.newPost                       │              │ controllers/posts.js                                     │              │ services/posts.js                                        │              │ PostgreSQL (posts)                                       │
├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤
│ STEP 1: Uploads the photo to S3 first                    │ ───────────> │ STEP 2: Finds out who is posting                         │ ───────────> │ STEP 3: Checks the shape of the body                     │ ───────────> │ STEP 5: Replies 201 with the post                        │ ───────────> │ STEP 4: Checks keys, saves, builds URLs                  │ ───────────> │ STEP 4: Stores the post with S3 keys only                │
│   - pre-signed upload URL (not in this code)             │              │   - req.userId from the token                            │              │   - content: text or null                                │              │   - {post} with mediaUrls added                          │              │   - each key must start with posts/42/                   │              │   - INSERT ... RETURNING *                               │
│   - file goes phone -> S3 directly                       │              │   - e.g. Priya -> 42                                     │              │   - mediaKeys: list of strings                           │              │   - e.g. post 901                                        │              │   - no ".." in a key                                     │              │   - id from BIGSERIAL (a counter)                        │
│   - e.g. key posts/42/9f3a.jpg                           │              └──────────────────────────────────────────────────────────┘              │   - not both empty                                       │              └──────────────────────────────────────────────────────────┘              │   - URL = CDN_BASE_URL + "/" + key                       │              │   - e.g. post 901, likeCount 0                           │
│                                                          │                                                                                        │   - e.g. {} -> 400 EMPTY_POST                            │                                                                                        │   - e.g. posts/7/x.jpg -> 400                            │              └──────────────────────────────────────────────────────────┘
│ STEP 2: Sends the post                                   │                                                                                        └──────────────────────────────────────────────────────────┘                                                                                        └──────────────────────────────────────────────────────────┘
│   - POST /v1/posts {content, mediaKeys}                  │
│   - e.g. "Sunset at Nandi Hills"                         │
└──────────────────────────────────────────────────────────┘




┌── STEP 6 ────────────────────────────────────────────────┐              ┌── STEP 6 ────────────────────────────────────────────────┐              ┌── STEP 6 ────────────────────────────────────────────────┐
│ Rahul's app (user 7)                                     │              │ CDN (Content Delivery Network)                           │              │ S3 (file storage)                                        │
├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤
│ STEP 6: Shows the photo                                  │ ───────────> │ STEP 6: Serves the nearest copy                          │ ───────────> │ STEP 6: Hands the original to the CDN                    │
│   - loads each URL in mediaUrls                          │              │   - hit: send the copy it already has                    │              │   - only on a CDN miss                                   │
│   - e.g. cdn.example.com/posts/42/9f3a.jpg               │              │   - miss: fetch from S3, keep a copy                     │              │   - e.g. posts/42/9f3a.jpg                               │
└──────────────────────────────────────────────────────────┘              │   - e.g. first viewer = miss, rest = hits                │              └──────────────────────────────────────────────────────────┘
                                                                          └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ S3 + CDN                                                                                                        ▼ PostgreSQL                                                  ▼ Reply
╔═══════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════╗
║ S3 object (file storage) · key posts/<user id>/<file> ║    ║ CDN URL (built on every read, never stored)   ║    ║ posts (PostgreSQL) · key id · INDEX authorId + id DESC ║    ║ 201 reply (what Priya's app gets back)                             ║
╟───────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────╢
║ {                                                     ║    ║ CDN_BASE_URL + "/" + key                      ║    ║ {                                                      ║    ║ {                                                                  ║
║   "bucket": "media-bucket",                           ║    ║ = "https://cdn.example.com/posts/42/9f3a.jpg" ║    ║   "id": 901,                                           ║    ║   "post": {                                                        ║
║   "key": "posts/42/9f3a.jpg",                         ║    ║ hit  -> served from the nearby copy           ║    ║   "authorId": 42,                                      ║    ║     "id": "901",                  -- BIGINT comes back as a string ║
║   "content_type": "image/jpeg",                       ║    ║ miss -> fetched from S3 once, then cached     ║    ║   "content": "Sunset at Nandi Hills",                  ║    ║     "authorid": "42",             -- names come back lowercase     ║
║   "size_bytes": 812000                                ║    ╚═══════════════════════════════════════════════╝    ║   "mediaKeys": ["posts/42/9f3a.jpg"],                  ║    ║     "content": "Sunset at Nandi Hills",                            ║
║ }                                                     ║                                                         ║   "likeCount": 1,                                      ║    ║     "likecount": 0,                                                ║
╚═══════════════════════════════════════════════════════╝                                                         ║   "commentCount": 3,                                   ║    ║     "commentcount": 0,                                             ║
                                                                                                                  ║   "status": 1 (active) or 2 (deleted),                 ║    ║     "status": 1,                                                   ║
                                                                                                                  ║   "createdAt": "2026-11-22T19:00:00+05:30",            ║    ║     "createdat": "2026-11-22T13:30:00.000Z",                       ║
                                                                                                                  ║   "updatedAt": "2026-11-22T19:00:00+05:30"             ║    ║     "mediaUrls": ["https://cdn.example.com/posts/42/9f3a.jpg"]     ║
                                                                                                                  ║ }                                                      ║    ║   }                                                                ║
                                                                                                                  ╚════════════════════════════════════════════════════════╝    ║ }                                                                  ║
                                                                                                                                                                                ╚════════════════════════════════════════════════════════════════════╝
```

1. **Priya's phone uploads the photo to S3 first**
   - **a) How:** the app asks an upload endpoint (not part of this project) for a **pre-signed URL**: a link that allows "put one file at `posts/42/9f3a.jpg` in the next few minutes", signed with our AWS key
   - **b)** the phone sends the file bytes straight to S3 with that link
   - **Data change:** S3 object `posts/42/9f3a.jpg` (see Data in this flow)
   - **Why not send the photo through our Node.js server:** big files would tie up our server's memory and network for seconds each. S3 is built to take millions of uploads; our server only handles small JSON.

2. **Priya sends the post**
   - **a) Call:** `POST /v1/posts {content: "Sunset at Nandi Hills", mediaKeys: ["posts/42/9f3a.jpg"]}`
   - **b) requireAuth:** `req.userId = "42"`
   - **Data change:** none yet

3. **validate.newPost checks the shape of the body**
   - **a) Rules:** `content` is text or missing; `mediaKeys` is a list of strings; at least one of them is filled (`{}` → `400 EMPTY_POST`)
   - **b) Cleans up:** `req.body = {content, mediaKeys}`, so the service gets tidy values and nothing extra
   - **Data change:** none
   - **Why shape checks live in middleware, rules in the service:** "is it a list of strings?" needs nothing but the request. "Is this key yours?" needs the user, so it belongs with the business rules.

4. **The service checks the keys, saves the post and builds the links**
   - **a) Own folder only:** every key must start with `posts/42/` and contain no `..` (which could climb out of the folder). Rahul sending Priya's key → `400 INVALID_MEDIA_KEY`
   - **b) SQL:** `INSERT INTO posts (authorId, content, mediaKeys) VALUES (42, 'Sunset at Nandi Hills', '{posts/42/9f3a.jpg}') RETURNING *` → id 901 from `BIGSERIAL` (an auto-increasing number)
   - **c) Links:** `withMedia` drops `mediakeys` and adds `mediaUrls = CDN_BASE_URL + "/" + key`
   - **Data change:** `posts` row 901 `{authorId: 42, mediaKeys: ["posts/42/9f3a.jpg"], likeCount: 0, status: 1}`
   - **Why store keys, not full links:** if the CDN moves from `cdn.example.com` to `img.example.com`, or we switch to signed links, nothing in the database changes. The link is built on every read.

5. **Priya gets `201 {post}`**
   - **a) What she sees:** the reply in Data in this flow
   - **b) Two surprises in that reply (beginner traps):**
     - **Lowercase names:** the schema says `authorId`, but PostgreSQL folds names without quotes to lowercase, so the row comes back as `authorid`, `likecount`. That's why the code reads `parent.parentid`.
     - **Ids as strings:** the `pg` driver returns `BIGINT` as a string (`"901"`), because JavaScript numbers can't hold every 64-bit number exactly.
   - **Data change:** none

6. **Rahul's phone loads the photo through the CDN**
   - **a) Request:** `GET https://cdn.example.com/posts/42/9f3a.jpg` goes to the CDN server nearest Rahul (say, in Bengaluru)
   - **b) Cache miss (first viewer):** that server doesn't have it yet → fetches it once from S3 → keeps a copy → sends it to Rahul
   - **c) Cache hit (everyone after):** the copy is already there → sent at once, S3 is not asked
   - **Data change:** a cached copy at the CDN edge
   - **Why a CDN:** photos are the heaviest thing in the app. Serving them from nearby is faster for the phone and far cheaper than S3 or our server sending every copy.
   - **Watch out:** a plain CDN link works for anyone who has it. For truly private photos, use signed CDN links that expire (the code comment already leaves room for this).

**Say in the interview:** "Media goes phone → S3 with a pre-signed URL; the post stores only S3 keys, validated to sit in the caller's own prefix, and the API builds CDN URLs on read. The CDN serves hits from the edge and fetches misses from S3 once."

### Flow 3. Rahul opens Priya's post, Anita gets "not found" (apps → requireAuth → routes/posts.js → posts service → PostgreSQL; → errorHandler)

```text
┌── STEP 1 ────────────────────────────────────────────────┐              ┌── STEP 2 ────────────────────────────────────────────────┐              ┌── STEP 2 ────────────────────────────────────────────────┐              ┌── STEP 4 ────────────────────────────────────────────────┐              ┌── STEP 3, 4 ─────────────────────────────────────────────┐              ┌── STEP 3, 4 ─────────────────────────────────────────────┐
│ Rahul's app (user 7, follower)                           │              │ requireAuth (middleware/auth.js)                         │              │ routes/posts.js                                          │              │ controllers/posts.js                                     │              │ services/posts.js + shared.js                            │              │ PostgreSQL (posts, follows, likes)                       │
├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤
│ STEP 1: Opens Priya's post                               │ ─────┬─────> │ STEP 2: Finds out who is asking                          │ ───────────> │ STEP 2: Checks the post id                               │ ───────────> │ STEP 4: Sends {post, likedByMe}                          │ ───────────> │ STEP 3: Asks "can this user see it?"                     │ ─────┬─────> │ STEP 3: Answers read + access in one SQL                 │
│   - GET /v1/posts/901                                    │      │       │   - no token -> 401 at once                              │              │   - checkId: 1-19 digits                                 │              │   - 200 for Rahul                                        │              │   - getVisiblePost: one query                            │      │       │   - post live AND (my post OR                            │
│   - e.g. from his feed                                   │      │       │   - e.g. Rahul 7, Anita 8                                │              │   - e.g. /posts/abc -> 400 INVALID_ID                    │              │   - e.g. likedByMe false                                 │              │   - no row -> throw notFound()                           │      │       │   -   I am an ACCEPTED follower)                         │
└──────────────────────────────────────────────────────────┘      │       └──────────────────────────────────────────────────────────┘              └──────────────────────────────────────────────────────────┘              └──────────────────────────────────────────────────────────┘              │   - e.g. Anita -> no row                                 │      │       │   - e.g. (7, 42, ACCEPTED) exists                        │
                                                                  │                                                                                                                                                                                                                                     │                                                          │      │       │                                                          │
                                                                  │                                                                                                                                                                                                                                     │ STEP 4: Adds "did I like it?"                            │      │       │ STEP 4: Checks the like by primary key                   │
                                                                  │                                                                                                                                                                                                                                     │   - likedByMe: 1 row in likes or not                     │      │       │   - userId + targetType + targetId                       │
                                                                  │                                                                                                                                                                                                                                     │   - e.g. Rahul -> false                                  │      │       │   - e.g. (7, 1, 901) -> none                             │
                                                                  │                                                                                                                                                                                                                                     └──────────────────────────────────────────────────────────┘      │       └──────────────────────────────────────────────────────────┘
                                                                  │                                                                                                                                                                                                                                                                                                       │
                                                                  │                                                                                                                                                                                                                                                                                                       │
                                                                  │                                                                                                                                                                                                                                                                                                       │
                                                                  │                                                                                                                                                                                                                                                                                                       │
┌── STEP 1 ────────────────────────────────────────────────┐      │                                                                                                                                                                                                                                                                                                       │       ┌── STEP 5 ────────────────────────────────────────────────┐
│ Anita's app (user 8, stranger)                           │      │                                                                                                                                                                                                                                                                                                       │       │ errorHandler (middleware)                                │
├──────────────────────────────────────────────────────────┤      │                                                                                                                                                                                                                                                                                                       │       ├──────────────────────────────────────────────────────────┤
│ STEP 1: Tries the same post                              │ ─────┘                                                                                                                                                                                                                                                                                                       └─────> │ STEP 5: Turns the error into a reply                     │
│   - GET /v1/posts/901                                    │                                                                                                                                                                                                                                                                                                                      │   - HttpError(404) -> 404, no body                       │
│   - e.g. link shared in a chat                           │                                                                                                                                                                                                                                                                                                                      │   - e.g. Anita sees "not found"                          │
└──────────────────────────────────────────────────────────┘                                                                                                                                                                                                                                                                                                                      └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ PostgreSQL                                                                                                                    ▼ Reply
╔════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════╗
║ posts (PostgreSQL) · key id · INDEX authorId + id DESC ║    ║ follows (PostgreSQL) · PRIMARY KEY followerId + followeeId ║    ║ 200 reply to Rahul · 404 to Anita                          ║
╟────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────╢
║ {                                                      ║    ║ {                                                          ║    ║ Rahul: { "post": { "id": "901", ... "mediaUrls": [...] },  ║
║   "id": 901,                                           ║    ║   "followerId": 7,     -- Rahul (asks)                     ║    ║          "likedByMe": false }                              ║
║   "authorId": 42,                                      ║    ║   "followeeId": 42,    -- Priya (accepts)                  ║    ║ Anita: 404 (empty body), same as a post that never existed ║
║   "content": "Sunset at Nandi Hills",                  ║    ║   "status": 1 (PENDING) or 2 (ACCEPTED),                   ║    ╚════════════════════════════════════════════════════════════╝
║   "mediaKeys": ["posts/42/9f3a.jpg"],                  ║    ║   "createdAt": "2026-11-22T18:00:00+05:30"                 ║
║   "likeCount": 1,                                      ║    ║ }                                                          ║
║   "commentCount": 3,                                   ║    ║ CHECK followerId <> followeeId                             ║
║   "status": 1 (active) or 2 (deleted),                 ║    ║ INDEX followeeId + status + createdAt DESC                 ║
║   "createdAt": "2026-11-22T19:00:00+05:30",            ║    ╚════════════════════════════════════════════════════════════╝
║   "updatedAt": "2026-11-22T19:00:00+05:30"             ║
║ }                                                      ║
╚════════════════════════════════════════════════════════╝
```

1. **Both open post 901**
   - **a)** Rahul from his feed, Anita from a link someone shared: `GET /v1/posts/901`
   - **Data change:** none

2. **requireAuth and the id check**
   - **a)** Rahul → `"7"`, Anita → `"8"`; no token → `401` and the route never runs
   - **b)** `checkId('901')` passes; `/posts/abc` → `400 INVALID_ID`
   - **Data change:** none

3. **One query answers "read it" and "may I?" together**
   - **a) SQL (`visiblePost`):**

            SELECT p.* FROM posts p
             WHERE p.id = 901 AND p.status = 1
               AND (p.authorId = $2                              -- my own post
                    OR EXISTS (SELECT 1 FROM follows f           -- or I follow the author
                                WHERE f.followerId = $2 AND f.followeeId = p.authorId
                                  AND f.status = 2));            -- and she accepted

   - **b) Rahul ($2 = 7):** the row `follows (7, 42, 2)` exists → post comes back
   - **c) Anita ($2 = 8):** no such row → no post → the service throws `notFound()`
   - **Data change:** none
   - **What `EXISTS` does:** asks "is there at least one matching row?" and stops at the first one. Here it is a single primary-key lookup on `(followerId, followeeId)`, so it costs almost nothing.
   - **Why in one query, not "read, then check":** with two steps, someone could forget the second step in a new endpoint. Here every read of a post (`getVisiblePost`, `getVisibleComment`) has the rule built in.

4. **Rahul also gets "did I like it?"**
   - **a)** `SELECT 1 FROM likes WHERE userId = 7 AND targetType = 1 AND targetId = 901` → no row → `likedByMe: false`
   - **b)** controller → `200 {post, likedByMe: false}`
   - **Data change:** none
   - **Why:** the app draws the heart filled or empty. One primary-key lookup is cheaper than sending the whole "Liked by" list.

5. **Anita's error becomes a clean 404**
   - **a)** `notFound()` creates `HttpError(404)`; Express 5 sends any error thrown in an `async` handler to `errorHandler` by itself
   - **b)** `errorHandler` sees an `HttpError` with no code → `res.sendStatus(404)`
   - **Data change:** none
   - **Why 404 and not 403:** `403 Forbidden` would tell Anita "this post exists, you just can't see it". A private account must not leak even that.

**Say in the interview:** "Visibility is enforced in SQL: `posts WHERE id = ? AND (author = me OR EXISTS accepted follow)`. Not visible and not existing look the same, a 404, so private content doesn't leak its existence."

### Flow 4. Rahul likes the post twice by accident, then unlikes it (Rahul's app → requireAuth → routes/posts.js → likes service → PostgreSQL likes + posts.likeCount)

```text
┌── STEP 1, 5, 6 ──────────────────────────────────────────┐              ┌── STEP 2 ────────────────────────────────────────────────┐              ┌── STEP 2 ────────────────────────────────────────────────┐              ┌── STEP 4 ────────────────────────────────────────────────┐              ┌── STEP 3, 4, 5 ──────────────────────────────────────────┐              ┌── STEP 4, 6 ─────────────────────────────────────────────┐
│ Rahul's app (user 7)                                     │              │ requireAuth (middleware/auth.js)                         │              │ routes/posts.js                                          │              │ controllers/likes.js                                     │              │ services/likes.js                                        │              │ PostgreSQL (likes, posts)                                │
├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤
│ STEP 1: Double-taps the photo                            │ ───────────> │ STEP 2: Finds out who is liking                          │ ───────────> │ STEP 2: Fixes WHAT is liked by the route                 │ ───────────> │ STEP 4: Same answer every time                           │ ───────────> │ STEP 3: Can Rahul see the post?                          │ ───────────> │ STEP 4: Primary key blocks a 2nd like                    │
│   - PUT /v1/posts/901/like                               │              │   - req.userId from the token                            │              │   - likes.like("posts") or ("comments")                  │              │   - like -> 200, unlike -> 204                           │              │   - getVisiblePost, else 404                             │              │   - INSERT ... ON CONFLICT DO NOTHING                    │
│   - weak network: sent twice                             │              │   - e.g. Rahul -> 7                                      │              │   - never from the body                                  │              │   - e.g. both taps get 200                               │              │   - e.g. strangers cannot like                           │              │   - UPDATE posts likeCount + 1                           │
│   - e.g. 19:05                                           │              └──────────────────────────────────────────────────────────┘              │   - e.g. /comments/5001/like -> comment                  │              └──────────────────────────────────────────────────────────┘              │                                                          │              │   - e.g. (7, 1, 901) once, count 1                       │
│                                                          │                                                                                        └──────────────────────────────────────────────────────────┘                                                                                        │ STEP 4: Moves the counter only on a new row              │              │                                                          │
│ STEP 5: Changes his mind                                 │                                                                                                                                                                                                                                            │   - rowCount 1 -> likeCount + 1                          │              │ STEP 6: Lists likers by time                             │
│   - DELETE /v1/posts/901/like                            │                                                                                                                                                                                                                                            │   - rowCount 0 -> do nothing                             │              │   - INDEX targetType+targetId+createdAt                  │
│   - e.g. taps the heart again                            │                                                                                                                                                                                                                                            │   - e.g. 2nd tap -> 0 -> no change                       │              │   - e.g. Rahul, 19:05                                    │
│                                                          │                                                                                                                                                                                                                                            │                                                          │              └──────────────────────────────────────────────────────────┘
│ STEP 6: Opens "Liked by"                                 │                                                                                                                                                                                                                                            │ STEP 5: Unlike: no access check needed                   │
│   - GET /v1/posts/901/likes                              │                                                                                                                                                                                                                                            │   - you can only delete your own row                     │
│   - e.g. sees names, newest first                        │                                                                                                                                                                                                                                            │   - e.g. rowCount 1 -> likeCount - 1                     │
└──────────────────────────────────────────────────────────┘                                                                                                                                                                                                                                            └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ PostgreSQL                                                                                                              ▼ Reply
╔═════════════════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════════════════════════╗
║ likes (PostgreSQL) · PRIMARY KEY userId + targetType + targetId ║    ║ posts (PostgreSQL) · only likeCount changes ║    ║ 200 reply to GET /v1/posts/901/likes                                      ║
╟─────────────────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────────────────────────────╢
║ {                                                               ║    ║ {                                           ║    ║ {                                                                         ║
║   "userId": 7,                                                  ║    ║   "id": 901,                                ║    ║   "items": [                                                              ║
║   "targetType": 1 (post) or 2 (comment),                        ║    ║   "likeCount": 0 -> 1 -> 0                  ║    ║     {"id": "7", "name": "Rahul", "createdat": "2026-11-22T13:35:00.000Z"} ║
║   "targetId": 901,                                              ║    ║ }                                           ║    ║   ],                                                                      ║
║   "createdAt": "2026-11-22T19:05:00+05:30"                      ║    ╚═════════════════════════════════════════════╝    ║   "nextCursor": null                                                      ║
║ }                                                               ║                                                       ║ }                                                                         ║
║ INDEX targetType + targetId + createdAt DESC                    ║                                                       ╚═══════════════════════════════════════════════════════════════════════════╝
╚═════════════════════════════════════════════════════════════════╝
```

1. **Rahul double-taps the photo; the request goes out twice**
   - **a) Call:** `PUT /v1/posts/901/like`, and again (the app retried after a slow answer)
   - **Data change:** none yet
   - **Why `PUT` and not `POST`:** `PUT` says "the like should exist". Doing it twice leaves the same state, which is exactly what a retry needs.

2. **The route decides what is being liked**
   - **a)** `/posts/:id/like` → `likes.like('posts')`; `/comments/:id/like` → `likes.like('comments')`
   - **b)** the service maps `'posts'` → `targetType 1`, and in SQL `COUNTED[1] = 'posts'` picks the table name
   - **Data change:** none
   - **Why the table name never comes from the user:** table names can't be passed as `$1` parameters, so they are glued into the SQL text. If a user could choose them, they could inject SQL. A fixed map makes that impossible.

3. **Can Rahul see the post?**
   - **a)** `getVisiblePost(901, 7)` (Flow 3), else `404`
   - **Data change:** none
   - **Why:** without it, Anita could like a post she can't see, and Priya would get a like from a stranger.

4. **The primary key blocks the second like; the counter moves only on a new row**
   - **a) First request:**

            INSERT INTO likes (userId, targetType, targetId) VALUES (7, 1, 901)
            ON CONFLICT DO NOTHING;                        -- rowCount = 1
            UPDATE posts SET likeCount = likeCount + 1 WHERE id = 901;

   - **b) Second request:** the same `INSERT` hits the primary key `(userId, targetType, targetId)` → `rowCount = 0` → the `UPDATE` is skipped
   - **c) Reply:** both get `200`
   - **Data change:** `likes` row `(7, 1, 901)`; `posts` 901 `likeCount` 0 → 1 (once)
   - **Why a counter column at all:** counting `likes` rows on every post view would be slow for a popular post. A stored number is read for free with the post.
   - **Why (crash in between):** the `INSERT` and the `UPDATE` are two separate calls today. If the program dies between them, the like exists but the count stays 0, and a retry won't fix it (the retry's insert gets `rowCount 0`). The fix is one statement, which PostgreSQL always runs all-or-nothing:

            WITH ins AS (
              INSERT INTO likes (userId, targetType, targetId) VALUES (7, 1, 901)
              ON CONFLICT DO NOTHING RETURNING 1)
            UPDATE posts SET likeCount = likeCount + (SELECT count(*) FROM ins) WHERE id = 901;

5. **Rahul unlikes**
   - **a)** `DELETE FROM likes WHERE userId = 7 AND targetType = 1 AND targetId = 901` → `rowCount 1` → `likeCount - 1`. A repeat → `rowCount 0` → nothing
   - **b)** reply `204` (done, nothing to send back)
   - **Data change:** `likes` row gone; `likeCount` 1 → 0
   - **Why no visibility check here:** the `DELETE` only ever touches Rahul's own row. Even if Priya removed him as a follower, he can still take his like back.

6. **"Liked by" list**
   - **a)** `GET /v1/posts/901/likes` → `paginate('time')`: the cursor is a time, the last `createdAt` seen
   - **b)** `likes JOIN users WHERE targetType = 1 AND targetId = 901 AND createdAt < cursor ORDER BY createdAt DESC`, served by the index `(targetType, targetId, createdAt DESC)`
   - **Data change:** none
   - **Why this second index:** the primary key starts with `userId` ("did Rahul like X?"). "Who liked X?" needs the opposite order, so it gets its own index.

**Say in the interview:** "A like is a row with primary key (user, target type, target id). `INSERT ... ON CONFLICT DO NOTHING` makes it idempotent, and the denormalised counter is bumped only when the insert returned one row, ideally in the same statement or transaction."

### Flow 5. Rahul comments, Priya replies, Rahul replies to her reply (apps → requireAuth → validate.newComment → comments service → PostgreSQL comments + counters)

```text
┌── STEP 1, 3 ─────────────────────────────────────────────┐              ┌── STEP 1 ────────────────────────────────────────────────┐              ┌── STEP 1 ────────────────────────────────────────────────┐              ┌── STEP 1 ────────────────────────────────────────────────┐              ┌── STEP 1, 2, 3, 4 ───────────────────────────────────────┐              ┌── STEP 1, 2, 3, 4 ───────────────────────────────────────┐
│ Rahul's app (user 7)                                     │              │ requireAuth (middleware/auth.js)                         │              │ routes/posts.js + validate.newComment                    │              │ controllers/comments.js                                  │              │ services/comments.js                                     │              │ PostgreSQL (comments, posts)                             │
├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤
│ STEP 1: Comments on the post                             │ ─────┬─────> │ STEP 1: Finds out who writes                             │ ───────────> │ STEP 1: Cleans the body                                  │ ───────────> │ STEP 1: Replies 201 {comment}                            │ ───────────> │ STEP 1: Top-level comment                                │ ───────────> │ STEP 1: Stores comment 5001                              │
│   - POST /v1/posts/901/comments {text}                   │      │       │   - req.userId from the token                            │              │   - text: not empty, trimmed                             │              │   - e.g. comment 5001                                    │              │   - post must be visible to Rahul                        │              │   - INSERT ... RETURNING *                               │
│   - e.g. "Wow, which camera?"                            │      │       │   - e.g. Rahul 7, Priya 42                               │              │   - parentId: digits or null                             │              └──────────────────────────────────────────────────────────┘              │   - e.g. parentId null                                   │              │   - e.g. parentId NULL                                   │
│                                                          │      │       └──────────────────────────────────────────────────────────┘              │   - e.g. "   " -> 400 INVALID_TEXT                       │                                                                                        │                                                          │              │                                                          │
│ STEP 3: Replies to Priya's reply                         │      │                                                                                 └──────────────────────────────────────────────────────────┘                                                                                        │ STEP 2: Reply to a top comment                           │              │ STEP 2: Stores 5002 under 5001                           │
│   - same call, parentId 5002                             │      │                                                                                                                                                                                                                                     │   - parent must be live, same post                       │              │   - findLiveComment(5001, 901) first                     │
│   - e.g. "Saving up for one!"                            │      │                                                                                                                                                                                                                                     │   - e.g. parent 5001 is top -> 5001                      │              │   - e.g. replyCount of 5001 -> 1                         │
└──────────────────────────────────────────────────────────┘      │                                                                                                                                                                                                                                     │                                                          │              │                                                          │
                                                                  │                                                                                                                                                                                                                                     │ STEP 3: Reply to a reply: flatten                        │              │ STEP 3: Stores 5003 under 5001 too                       │
                                                                  │                                                                                                                                                                                                                                     │   - store under the TOP comment                          │              │   - parentId 5001, replyToUserId 42                      │
                                                                  │                                                                                                                                                                                                                                     │   - replyToUserId = reply's author                       │              │   - e.g. replyCount of 5001 -> 2                         │
                                                                  │                                                                                                                                                                                                                                     │   - e.g. top 5001, "@Priya"                              │              │                                                          │
                                                                  │                                                                                                                                                                                                                                     │                                                          │              │ STEP 4: Counters on the parent rows                      │
                                                                  │                                                                                                                                                                                                                                     │ STEP 4: Bumps the counters                               │              │   - UPDATE posts / comments ... + 1                      │
                                                                  │                                                                                                                                                                                                                                     │   - commentCount + 1, replyCount + 1                     │              │   - e.g. commentCount of 901 -> 3                        │
                                                                  │                                                                                                                                                                                                                                     │   - e.g. three separate statements                       │              └──────────────────────────────────────────────────────────┘
                                                                  │                                                                                                                                                                                                                                     └──────────────────────────────────────────────────────────┘
                                                                  │
                                                                  │
                                                                  │
                                                                  │
┌── STEP 2 ────────────────────────────────────────────────┐      │
│ Priya's app (user 42)                                    │      │
├──────────────────────────────────────────────────────────┤      │
│ STEP 2: Replies to Rahul                                 │ ─────┘
│   - same call, parentId 5001                             │
│   - e.g. "Pixel 9!"                                      │
└──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ PostgreSQL
╔═════════════════════════════════════════════╗    ╔══════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════╗
║ comments row 5001 · top-level               ║    ║ comments row 5002 · reply                    ║    ║ comments row 5003 · reply to a reply, flattened ║    ║ posts row 901 · only commentCount changes ║
╟─────────────────────────────────────────────╢    ╟──────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────╢    ╟───────────────────────────────────────────╢
║ {                                           ║    ║ {                                            ║    ║ {                                               ║    ║ {                                         ║
║   "id": 5001, "postId": 901, "authorId": 7, ║    ║   "id": 5002, "postId": 901, "authorId": 42, ║    ║   "id": 5003, "postId": 901, "authorId": 7,     ║    ║   "id": 901,                              ║
║   "parentId": null, "replyToUserId": null,  ║    ║   "parentId": 5001, "replyToUserId": null,   ║    ║   "parentId": 5001,          -- not 5002        ║    ║   "commentCount": 0 -> 1 -> 2 -> 3        ║
║   "text": "Wow, which camera?",             ║    ║   "text": "Pixel 9!"                         ║    ║   "replyToUserId": 42,       -- "@Priya"        ║    ║ }                                         ║
║   "replyCount": 0 -> 1 -> 2                 ║    ║ }                                            ║    ║   "text": "Saving up for one!"                  ║    ╚═══════════════════════════════════════════╝
║ }                                           ║    ╚══════════════════════════════════════════════╝    ║ }                                               ║
╚═════════════════════════════════════════════╝                                                        ╚═════════════════════════════════════════════════╝
```

1. **Rahul writes a top-level comment**
   - **a) Call:** `POST /v1/posts/901/comments {text: "  Wow, which camera?  "}`
   - **b) validate.newComment:** text must not be empty after trimming → `"Wow, which camera?"`; `parentId` is digits or `null`
   - **c) Service:** `getVisiblePost(901, 7)` → `INSERT INTO comments (postId, authorId, parentId, replyToUserId, text) VALUES (901, 7, NULL, NULL, ...)` → `UPDATE posts SET commentCount + 1`
   - **d) Reply:** `201 {comment}`
   - **Data change:** `comments` row 5001 `{parentId: null}`; `posts` 901 `commentCount` 0 → 1

2. **Priya replies to Rahul's comment**
   - **a) Call:** `{text: "Pixel 9!", parentId: 5001}`
   - **b) Parent check:** `findLiveComment(5001, 901)`: the parent must be live **and** on this same post, else `404` (so nobody can hang a reply on a comment from a different post)
   - **c)** 5001's own `parentid` is `null`, so it is a top comment → the new reply goes straight under it
   - **Data change:** `comments` row 5002 `{parentId: 5001}`; `comments` 5001 `replyCount` 0 → 1; `posts` 901 `commentCount` 1 → 2

3. **Rahul replies to Priya's reply: it is flattened**
   - **a) Call:** `{text: "Saving up for one!", parentId: 5002}`
   - **b)** 5002's `parentid` is 5001, so 5002 is itself a reply → store the new one under the **top** comment 5001, and set `replyToUserId = 42` (5002's author), which the app shows as "@Priya"
   - **Data change:** `comments` row 5003 `{parentId: 5001, replyToUserId: 42}`; 5001 `replyCount` 1 → 2; 901 `commentCount` 2 → 3
   - **Why only one level:** deep trees need recursive queries and get unreadable on a phone. With one level, "top comments" and "replies of 5001" are each one simple indexed query, and "@Priya" still shows who is answered.

4. **The counters**
   - **a)** `commentCount` counts all comments and replies on the post; `replyCount` counts replies under one top comment
   - **Data change:** as listed in steps 1 to 3
   - **Why (crash in between):** today the insert and the one or two counter updates are separate statements. A crash between them leaves a comment with a wrong count. Put them in one `BEGIN ... COMMIT` on one connection so all of it happens or none of it does.
   - **If we later send "Rahul commented on your post":** do not call a notification service right after the insert (that is a dual write: a crash in between loses the notice). Save an `outbox` row (a "to-do" row) in the same transaction, and let a relay or Debezium (a Change Data Capture tool) send it to Kafka, with receivers dropping repeats by event id.

**Say in the interview:** "Comments are a single table with `parentId` for one level of nesting; a reply to a reply is re-parented to the top comment with a `replyToUserId` mention. Insert plus counter updates should be one transaction; side effects go through an outbox."

### Flow 6. Rahul reads the comments page by page (Rahul's app → requireAuth → paginate → comments service → PostgreSQL)

```text
┌── STEP 1, 4, 5 ──────────────────────────────────────────┐              ┌── STEP 1 ────────────────────────────────────────────────┐              ┌── STEP 2 ────────────────────────────────────────────────┐              ┌── STEP 2 ────────────────────────────────────────────────┐              ┌── STEP 3 ────────────────────────────────────────────────┐              ┌── STEP 3, 4, 5 ──────────────────────────────────────────┐
│ Rahul's app (user 7)                                     │              │ requireAuth (middleware/auth.js)                         │              │ routes + paginate("id")                                  │              │ controllers/comments.js                                  │              │ services/comments.js + toPage                            │              │ PostgreSQL (comments)                                    │
├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤
│ STEP 1: Opens the comments                               │ ───────────> │ STEP 1: Finds out who reads                              │ ───────────> │ STEP 2: Turns the query into req.page                    │ ───────────> │ STEP 2: Reads ?sort=top                                  │ ───────────> │ STEP 3: Builds the page                                  │ ───────────> │ STEP 3: Top comments + 2 replies each                    │
│   - GET /v1/posts/901/comments?limit=20                  │              │   - req.userId from the token                            │              │   - cursor: digits only                                  │              │   - top = most liked first                               │              │   - visible post first, else 404                         │              │   - one query, replies as json_agg                       │
│   - e.g. first page                                      │              │   - e.g. Rahul -> 7                                      │              │   - limit: default 20, max 50                            │              │   - e.g. default: newest first                           │              │   - full page -> nextCursor = last id                    │              │   - INDEX postId + parentId + id DESC                    │
│                                                          │              └──────────────────────────────────────────────────────────┘              │   - e.g. limit=500 -> 50                                 │              └──────────────────────────────────────────────────────────┘              │   - short page -> nextCursor null                        │              │   - e.g. 5001 with [5002, 5003]                          │
│ STEP 4: Scrolls for more                                 │                                                                                        └──────────────────────────────────────────────────────────┘                                                                                        │   - e.g. 20 rows -> next 5001                            │              │                                                          │
│   - same call + cursor=<nextCursor>                      │                                                                                                                                                                                                                                            └──────────────────────────────────────────────────────────┘              │ STEP 4: Next page by id, not OFFSET                      │
│   - e.g. cursor=5001                                     │                                                                                                                                                                                                                                                                                                                      │   - WHERE id < 5001                                      │
│                                                          │                                                                                                                                                                                                                                                                                                                      │   - e.g. jumps straight there                            │
│ STEP 5: Taps "View more replies"                         │                                                                                                                                                                                                                                                                                                                      │                                                          │
│   - GET /v1/comments/5001/replies                        │                                                                                                                                                                                                                                                                                                                      │ STEP 5: Replies oldest first                             │
│   -   ?cursor=5003                                       │                                                                                                                                                                                                                                                                                                                      │   - WHERE parentId = 5001 AND id > 5003                  │
│   - e.g. after the 2 shown                               │                                                                                                                                                                                                                                                                                                                      │   - e.g. continues after 5003                            │
└──────────────────────────────────────────────────────────┘                                                                                                                                                                                                                                                                                                                      └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Reply
╔══════════════════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════╗
║ 200 reply to GET /v1/posts/901/comments                              ║    ║ Page reply (every list) · cursor paging                  ║
╟──────────────────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────╢
║ {                                                                    ║    ║ {                                                        ║
║   "items": [                                                         ║    ║   "items": [ ... up to limit rows ... ],                 ║
║     {                                                                ║    ║   "nextCursor": "5001" or "2026-11-22T19:05:00Z" or null ║
║       "id": "5001", "authorid": "7", "parentid": null,               ║    ║ }                                                        ║
║       "text": "Wow, which camera?", "likecount": 0, "replycount": 2, ║    ╚══════════════════════════════════════════════════════════╝
║       "replies": [                                                   ║
║         {"id": 5002, "authorid": 42, "text": "Pixel 9!", ...},       ║
║         {"id": 5003, "authorid": 7, "replytouserid": 42, ...}        ║
║       ]                                                              ║
║     }                                                                ║
║   ],                                                                 ║
║   "nextCursor": null                                                 ║
║ }                                                                    ║
╚══════════════════════════════════════════════════════════════════════╝
```

1. **Rahul opens the comments**
   - **a) Call:** `GET /v1/posts/901/comments?limit=20` (add `&sort=top` for most liked first)
   - **Data change:** none

2. **paginate turns the query string into `req.page`**
   - **a) Cursor:** for comment lists it must be digits (`paginate('id')`); for likes and follow requests a date (`paginate('time')`). Wrong → `400 INVALID_CURSOR`
   - **b) Limit:** default 20, at least 1, cut to 50 at most (`limit=500` → 50; `limit=0` → `400 INVALID_LIMIT`)
   - **Data change:** none
   - **Why a maximum:** without one, a single `?limit=1000000` call could make the database read every comment at once.

3. **One query returns top comments with their first 2 replies**
   - **a) SQL (shortened):**

            SELECT c.*, (SELECT json_agg(r) FROM
                          (SELECT * FROM comments WHERE parentId = c.id AND status = 1
                           ORDER BY id LIMIT 2) r) AS replies
              FROM comments c
             WHERE postId = 901 AND parentId IS NULL AND status = 1
             ORDER BY id DESC LIMIT 20;

   - **b) `json_agg`:** packs the replies of each comment into a JSON list inside that comment's row, so the app gets the whole first screen in one call
   - **c) toPage:** if 20 rows came back there may be more → `nextCursor` = id of the last row; fewer → `nextCursor: null`
   - **Data change:** none
   - **How the index helps:** `(postId, parentId, id DESC)` already keeps "comments of post 901 with no parent, newest first" together and sorted, and the same index serves "replies of 5001".

4. **Next page with a cursor, not OFFSET**
   - **a)** `?cursor=5001` → `... AND id < 5001 ORDER BY id DESC LIMIT 20`
   - **Data change:** none
   - **Why not `OFFSET 1000`:** `OFFSET` makes the database read and throw away 1000 rows first, getting slower with every page. And if a new comment arrives while Rahul scrolls, `OFFSET` shows one comment twice. `id < 5001` jumps straight into the index.

5. **"View more replies"**
   - **a)** `GET /v1/comments/5001/replies?cursor=5003` → `WHERE parentId = 5001 AND id > 5003 ORDER BY id` (oldest first, carrying on after the 2 already shown)
   - **b)** `getVisibleComment(5001, 7)` checks the comment, its post, and the follow rule in one query
   - **Data change:** none

6. **Known shortcut: `sort=top` paging**
   - **a)** `sort=top` orders by `likeCount DESC, id DESC`, but the next page still uses `id < cursor`, so page 2 can skip or repeat comments
   - **b) Fix:** a two-part cursor `(likeCount, id)` and `WHERE (likeCount, id) < (12, 5001)`, plus an index on `(postId, parentId, likeCount DESC, id DESC)`
   - **Data change:** none

**Say in the interview:** "Lists use keyset (cursor) pagination on an indexed, unique sort key, capped at 50. The comments call returns top-level comments with the first two replies aggregated as JSON, and a separate replies endpoint continues from the last reply shown."

### Flow 7. Priya edits and deletes, Rahul can't touch her post, errors come out one way (apps → requireAuth → validate.editPost → posts service → PostgreSQL; → errorHandler)

```text
┌── STEP 1, 3 ─────────────────────────────────────────────┐              ┌── STEP 1 ────────────────────────────────────────────────┐              ┌── STEP 1 ────────────────────────────────────────────────┐              ┌── STEP 1 ────────────────────────────────────────────────┐              ┌── STEP 1, 2, 3 ──────────────────────────────────────────┐              ┌── STEP 1, 3 ─────────────────────────────────────────────┐
│ Priya's app (user 42)                                    │              │ requireAuth (middleware/auth.js)                         │              │ routes/posts.js + validate.editPost                      │              │ controllers/posts.js                                     │              │ services/posts.js                                        │              │ PostgreSQL (posts)                                       │
├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤
│ STEP 1: Fixes a typo in her post                         │ ─────┬─────> │ STEP 1: Finds out who edits                              │ ───────────> │ STEP 1: Checks the body                                  │ ───────────> │ STEP 1: Replies with the new post                        │ ───────────> │ STEP 1: Owner check inside the UPDATE                    │ ─────┬─────> │ STEP 1: Changes only my live post                        │
│   - PATCH /v1/posts/901 {content}                        │      │       │   - req.userId from the token                            │              │   - content must be a string                             │              │   - 200 {post}; delete -> 204                            │              │   - no row back -> throw notFound()                      │      │       │   - WHERE id = 901 AND authorId = 42                     │
│   - e.g. "Sunset at Nandi Hills!"                        │      │       │   - e.g. Priya 42, Rahul 7                               │              │   - e.g. {content: 5} -> 400                             │              │   - e.g. post 901                                        │              │   - e.g. Priya -> row back                               │      │       │   -   AND status = 1                                     │
│                                                          │      │       └──────────────────────────────────────────────────────────┘              └──────────────────────────────────────────────────────────┘              └──────────────────────────────────────────────────────────┘              │                                                          │      │       │   - e.g. updatedAt = now()                               │
│ STEP 3: Deletes the post                                 │      │                                                                                                                                                                                                                                     │ STEP 2: Same UPDATE, 0 rows for Rahul                    │      │       │                                                          │
│   - DELETE /v1/posts/901                                 │      │                                                                                                                                                                                                                                     │   - throw notFound()                                     │      │       │ STEP 3: Marks the post deleted                           │
│   - e.g. gone for everyone                               │      │                                                                                                                                                                                                                                     │   - e.g. Rahul -> 404                                    │      │       │   - UPDATE posts SET status = 2                          │
└──────────────────────────────────────────────────────────┘      │                                                                                                                                                                                                                                     │                                                          │      │       │   - e.g. comments hidden with it                         │
                                                                  │                                                                                                                                                                                                                                     │ STEP 3: Soft delete                                      │      │       └──────────────────────────────────────────────────────────┘
                                                                  │                                                                                                                                                                                                                                     │   - status = 2, row stays                                │      │
                                                                  │                                                                                                                                                                                                                                     │   - e.g. all reads skip status 2                         │      │
                                                                  │                                                                                                                                                                                                                                     └──────────────────────────────────────────────────────────┘      │
                                                                  │                                                                                                                                                                                                                                                                                                       │
                                                                  │                                                                                                                                                                                                                                                                                                       │
                                                                  │                                                                                                                                                                                                                                                                                                       │
                                                                  │                                                                                                                                                                                                                                                                                                       │
┌── STEP 2 ────────────────────────────────────────────────┐      │                                                                                                                                                                                                                                                                                                       │       ┌── STEP 4 ────────────────────────────────────────────────┐
│ Rahul's app (user 7)                                     │      │                                                                                                                                                                                                                                                                                                       │       │ errorHandler (middleware)                                │
├──────────────────────────────────────────────────────────┤      │                                                                                                                                                                                                                                                                                                       │       ├──────────────────────────────────────────────────────────┤
│ STEP 2: Tries to edit Priya's post                       │ ─────┘                                                                                                                                                                                                                                                                                                       └─────> │ STEP 4: One place that writes errors                     │
│   - PATCH /v1/posts/901 {content}                        │                                                                                                                                                                                                                                                                                                                      │   - HttpError -> its status (+ code)                     │
│   - e.g. gets 404                                        │                                                                                                                                                                                                                                                                                                                      │   - other errors -> log + 500                            │
└──────────────────────────────────────────────────────────┘                                                                                                                                                                                                                                                                                                                      │   - e.g. Rahul gets 404                                  │
                                                                                                                                                                                                                                                                                                                                                                                  └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ PostgreSQL                                                                     ▼ Replies
╔═══════════════════════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════════════════╗
║ posts row 901 · edited, then soft-deleted                                 ║    ║ Error replies (errorHandler)                                         ║
╟───────────────────────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────────────────╢
║ {                                                                         ║    ║ HttpError(404)                    -> 404, empty body                 ║
║   "id": 901,                                                              ║    ║ HttpError(400, "INVALID_CURSOR")  -> 400 {"error": "INVALID_CURSOR"} ║
║   "authorId": 42,                                                         ║    ║ broken JSON body                  -> 400 {"error": "INVALID_JSON"}   ║
║   "content": "Sunset at Nandi Hills" -> "Sunset at Nandi Hills!",         ║    ║ no / bad / expired token          -> 401                             ║
║   "status": 1 -> 2,                                                       ║    ║ any other error                   -> 500 (details only in the log)   ║
║   "updatedAt": "2026-11-22T19:00:00+05:30" -> "2026-11-22T20:10:00+05:30" ║    ╚══════════════════════════════════════════════════════════════════════╝
║ }                                                                         ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

1. **Priya fixes a typo**
   - **a) Call:** `PATCH /v1/posts/901 {content: "Sunset at Nandi Hills!"}`; `validate.editPost` wants a string
   - **b) SQL:**

            UPDATE posts SET content = 'Sunset at Nandi Hills!', updatedAt = now()
             WHERE id = 901 AND authorId = 42 AND status = 1
            RETURNING *;

   - **c)** a row came back → `200 {post}`
   - **Data change:** `posts` 901 `content` changed, `updatedAt` = now
   - **Why the owner check sits in the `WHERE`:** "read, check owner, then update" has a gap between the steps, and a forgotten check is a security hole. Here the update simply can't touch a row that isn't Priya's.

2. **Rahul tries the same edit**
   - **a)** same `UPDATE` with `authorId = 7` → no row → `notFound()` → `404`
   - **Data change:** none
   - **Why 404 again:** same idea as Flow 3. "Not yours" and "doesn't exist" look the same from outside.

3. **Priya deletes the post**
   - **a)** `UPDATE posts SET status = 2 WHERE id = 901 AND authorId = 42` → `204`
   - **b)** every read checks `status = 1`, and `visibleComment` also checks the post's status, so the post, its comments and likes all vanish from the app at once
   - **c) Comments:** `PATCH` / `DELETE /v1/comments/{id}` work the same way, owner in the `WHERE`
   - **Data change:** `posts` 901 `status` 1 → 2 (row kept)
   - **Why soft delete:** a real `DELETE` would fail (comments point at the post with a foreign key) or would need to remove thousands of comment and like rows in one go. A status flag is one tiny update and can be undone.
   - **Small gap:** `DELETE` answers `204` even when nothing was deleted (Rahul deleting Priya's post). It is harmless but hides mistakes; checking the row count and answering `404` would be clearer. The counters also don't go down when a comment is deleted.

4. **Every error comes out of one place**
   - **a) Services throw, never reply:** `throw notFound()` or `throw badRequest('INVALID_MEDIA_KEY')`; a service never touches `req` or `res`
   - **b) errorHandler (registered last in `main.js`):** `HttpError` → its status, plus `{"error": code}` when there is a code; broken JSON body → `400 INVALID_JSON`; anything else → log it and answer `500` with no details
   - **c) No route matched:** `routeNotFound` → `404`
   - **Data change:** none
   - **Why:** one place decides what errors look like. Database messages and stack traces (which can reveal table names) never reach the phone.

**Say in the interview:** "Edits and deletes put the ownership check in the `WHERE` clause and use `RETURNING` or the row count to decide between 200 and 404. Deletes are soft (`status = 2`) and every read filters on it. Errors are typed `HttpError`s mapped in one Express error middleware."

## Key design choices

Each row is one decision. Read it as: "For this area, we picked this, because the other way breaks like this."

| Area | Choice | Why (vs alternative) |
|---|---|---|
| Code layers | middleware → router → controller → service → `db_queries.js` | Mixing HTTP, rules and SQL in one function makes each hard to test and reuse; here a service never sees `req`/`res` |
| Login | JWT checked with a secret on every call | A session table would add a database lookup to every request |
| Who can see a post | Access rule inside the same SQL that reads it, 404 if hidden | "Read then check" can be forgotten in a new endpoint; 403 would leak that the post exists |
| Likes | Primary key `(userId, targetType, targetId)` + `ON CONFLICT DO NOTHING` | A plain insert would allow double likes; checking first and then inserting has a race between the two |
| Counters | Stored `likeCount`, `commentCount`, `replyCount`, follower counts, moved only when a row really changed | `COUNT(*)` on every view is slow for popular posts; moving the counter on every call drifts on retries |
| Follows | PENDING row, then a conditional update to ACCEPTED | A direct follow would skip the private-account rule; an unconditional update would double-count a second tap |
| Comment nesting | One level; reply to a reply is stored under the top comment with `replyToUserId` | Deep trees need recursive queries and don't fit a phone screen |
| Paging | Cursor on a sorted, indexed key; limit at most 50 | `OFFSET` gets slower page by page and shows duplicates when new rows arrive |
| Media | S3 keys in the row, pre-signed uploads, CDN links built on read | Bytes through our server waste it; stored full links break when the CDN address changes |
| Media ownership | Key must start with `posts/<own id>/`, no `..` | Otherwise anyone could attach anyone's photo to their post |
| Delete | Soft delete (`status = 2`) | A hard delete breaks foreign keys or has to remove thousands of child rows |
| SQL safety | Values as `$1, $2`; table names only from a fixed map | Gluing user input into SQL text allows SQL injection |
| Errors | `HttpError` thrown by services, one `errorHandler` | Scattered `res.status(...)` calls give inconsistent replies and can leak internals |

---

## Deep Dive (only what the flows above did not cover)

### 1. Back-of-the-envelope estimates (say these early)

Say we have a mid-size app: a few million users, ≈1 million active a day.

| Item | Math | Result |
|---|---|---|
| Reads | each active user opens ≈100 posts and comment screens a day | ≈100 million reads a day ≈1,200 a second, a few thousand at peak |
| Likes | ≈20 likes per user a day | ≈20 million rows a day ≈230 writes a second |
| Comments | ≈2 per user a day | ≈2 million rows a day |
| Like rows after a year | 20 million × 365 × ≈40 bytes | ≈300 GB with indexes: one big PostgreSQL machine, then split |
| Photos | ≈200,000 new photos a day × ≈1 MB | ≈200 GB a day in S3, served almost entirely from the CDN |

The point: **reads win by far**, so the work is making reads one indexed query each. **Likes are the biggest table**, so they are the first thing to split when one database is not enough.

---

### 2. How one request travels through the code

```text
main.js       express.json()      body text -> req.body (broken JSON -> errorHandler -> 400 INVALID_JSON)
              requireAuth         Bearer JWT -> req.userId, else 401
routes/*      router.param        :postId, :commentId, :userId ... must be 1-19 digits
              validate.*          shape of the body, trimmed and tidied
              paginate(type)      ?cursor & ?limit -> req.page
controllers/* one line each       read req -> call service -> pick status code
services/*    the rules           visibility, ownership, flattening, counters; throw HttpError on "no"
db/db_queries one file of SQL     every value passed as $1, $2 ...; one() / many() / count() helpers
db/db.js      pg Pool             a few open connections shared by all requests
errorHandler  last middleware     HttpError -> status (+ code), anything else -> 500
```

- **Why a connection pool:** opening a database connection takes a while (network handshake, login). The pool keeps a few open and lends one to each query.
- **Why that matters for transactions:** each `db.query` may get a **different** connection from the pool. `BEGIN` on one and `UPDATE` on another are not one transaction. A transaction must use `db.connect()` to hold one connection for all its statements, then `release()` it.

---

### 3. Indexes: which query each one serves

| Index | Serves | Without it |
|---|---|---|
| `posts (authorId, id DESC)` | Priya's posts, newest first, paged by id | Scan every post of every user |
| `comments (postId, parentId, id DESC)` | top comments of a post; replies of a comment | Scan all comments of the post and sort them |
| `likes PRIMARY KEY (userId, targetType, targetId)` | "did Rahul like 901?", no double likes | Double likes possible; heart lookup slow |
| `likes (targetType, targetId, createdAt DESC)` | "Liked by" list | Scan the whole likes table |
| `follows PRIMARY KEY (followerId, followeeId)` | "does Rahul follow Priya?" inside every visibility check | Every post read gets slow |
| `follows (followeeId, status, createdAt DESC)` | Priya's pending requests, her followers | Scan all follows |

- **Rule of thumb:** an index is a sorted copy of some columns. Put the "equals" columns first (`postId`, `parentId`) and the "sort by" column last (`id DESC`), so the answer is one continuous slice of the index.

---

### 4. The hot post (a celebrity's photo gets 50,000 likes a minute)

- **The problem:** every like runs `UPDATE posts SET likeCount = likeCount + 1 WHERE id = 901`. PostgreSQL locks that one row for each update, so all those likes wait in a single line for the same row.
- **Fix 1, counter shards:** keep 16 counter rows for the post (`post_like_counter(post_id, shard, n)`), add to a random one, and sum the 16 when reading. 16 short lines instead of one long one.
- **Fix 2, count later:** write only the `likes` row (the source of truth) plus an `outbox` row in the same transaction; a background job reads the outbox through Kafka and adds counts in batches ("+312 for post 901") every second. The count is a second behind, which nobody notices.
- **Fix 3, cache in Redis:** `INCR likes:901` in Redis (an in-memory store) for the live number, written back to PostgreSQL every few seconds. Fastest, but Redis must be treated as a cache that can be rebuilt from the `likes` table.
- **Why the `likes` table never changes:** whatever we do with the counter, one row per like stays the real record, so any counter can be rebuilt with `COUNT(*)`.

---

### 5. Splitting the database when one is not enough

- **Read copies first:** most traffic is reads, so add read replicas (copies that follow the main database) for lists and post views. Writes and "read right after my write" stay on the main one.
- **Then split by post:** `likes` and `comments` are almost always asked "for post X", so shard them by `targetId` / `postId` (all of a post's likes and comments live on one shard). The one cross-shard question, "everything Rahul liked", gets its own table keyed by `userId`, filled through an outbox.
- **Ids:** `BIGSERIAL` counts per database and would clash across shards. Switch to time-sortable ids (for example Snowflake ids: time + machine + counter), which keeps "newer = bigger id", so cursor paging by id still works.
- **Visibility check across shards:** `follows` is small and read on every request, so keep it on its own database and cache "does 7 follow 42?" briefly in Redis, cleared when a follow changes.

---

### 6. Failure scenarios

| Failure | What happens |
|---|---|
| Phone sends the like twice | Primary key blocks the second row, counter moves once, both get 200 |
| Program crashes between "insert like" and "bump counter" | Today: count off by one for good. With the one-statement CTE (Common Table Expression, a `WITH ...` sub-query) or a transaction: impossible |
| Priya taps "Accept" twice at the same moment | Both run `UPDATE ... WHERE status = 1`; PostgreSQL locks the row, the second finds status 2 and changes 0 rows → 404 |
| Rahul is removed as a follower while scrolling | The next request's visibility check fails → 404; his old likes and comments stay |
| A comment's parent is deleted while Priya types a reply | `findLiveComment` checks `status = 1` → 404, no reply to a dead comment |
| JWT expired | `jwt.verify` throws → 401; the app gets a new token from the login service |
| Broken JSON body | `express.json` throws `entity.parse.failed` → 400 INVALID_JSON |
| PostgreSQL is down | Every query throws → errorHandler logs it → 500; nothing half-written thanks to transactions |
| Photo uploaded but the post never created | The S3 file is unused; a nightly cleanup (or an S3 lifecycle rule on a `tmp/` prefix) removes it |
| A CDN edge server dies | Requests go to the next nearest edge, which fetches from S3 on its first miss |

---

### 7. Known gaps in the current code, and the fix

| Gap | Where | Fix |
|---|---|---|
| Like + counter are two statements, not atomic | `services/likes.js` | One CTE statement, or `BEGIN ... COMMIT` on one pooled connection |
| Comment insert + 1 or 2 counter updates not atomic | `services/comments.js` | One transaction |
| Accept / unfollow + two counter updates not atomic | `services/users.js`, `addFollowCounts` | One transaction |
| Deleting a comment or post doesn't lower `commentCount` / `replyCount` | `softDeleteComment` | Decrement in the same transaction, only if the row went from 1 to 2 |
| `DELETE` answers 204 even if nothing matched | `deletePost`, `deleteComment` | Check the row count, answer 404 if 0 |
| `sort=top` paging uses an id cursor | `topComments` | Cursor `(likeCount, id)` + matching index |
| Time cursors can skip rows with the same `createdAt` | `likers`, `pendingRequests` | Cursor `(createdAt, userId)` |
| CDN links are public | `withMedia` | Signed, expiring CDN links for private accounts |

---

### 8. End-to-end walk-through: Priya, Rahul and Anita

```text
18:00  Rahul  PUT /v1/users/42/follow                 -> follows (7, 42, PENDING), 202
18:02  Priya  POST /v1/users/me/follow-requests/7/accept -> PENDING->ACCEPTED, counts +1, 200
19:00  Priya  uploads posts/42/9f3a.jpg to S3          -> POST /v1/posts -> post 901, mediaUrls via CDN, 201
19:01  Rahul  GET /v1/posts/901                        -> visible (accepted follower), likedByMe false, photo from CDN (miss, then hits)
19:01  Anita  GET /v1/posts/901                        -> not visible -> 404, same as "does not exist"
19:05  Rahul  PUT /v1/posts/901/like (sent twice)      -> one likes row, likeCount 0->1
19:10  Rahul  comment 5001 / Priya reply 5002 / Rahul reply 5003 -> all under 5001, 5003 mentions @Priya, commentCount 3
19:30  Rahul  GET /v1/posts/901/comments               -> 5001 with [5002, 5003] inline, nextCursor null
20:10  Priya  PATCH then DELETE /v1/posts/901          -> content edited, then status 2; post and comments vanish for everyone
```

- **The happy path:** Rahul follows, sees, likes and comments on Priya's post; every write is guarded by a key or a `WHERE`.
- **The blocked path:** Anita never learns that post 901 exists.

---

### 9. Rapid-fire interview Q&A

| Question | Answer |
|---|---|
| How do you stop a double like? | Primary key `(userId, targetType, targetId)` + `INSERT ... ON CONFLICT DO NOTHING`; bump the counter only if a row was inserted |
| Why keep a `likeCount` column? | Counting rows on every view is slow for popular posts; the counter is read with the post for free |
| How do you keep the counter right? | Change it in the same statement or transaction as the like row, and only when the row count says something changed |
| How is privacy enforced? | Inside the SQL that reads the post: own post or an ACCEPTED follow row; otherwise 404 |
| Why 404 instead of 403? | 403 reveals that the post exists |
| How are nested replies stored? | One level: `parentId` points at the top comment; a reply to a reply is re-parented and keeps `replyToUserId` for the "@" |
| Why cursor paging? | `OFFSET` gets slower page by page and duplicates rows when new ones arrive; a cursor jumps into the index |
| Why store S3 keys and not URLs? | URLs are built on read, so the CDN domain or signing method can change without a data migration |
| How do uploads work? | Pre-signed S3 URL, phone uploads directly; the post only references keys in the user's own prefix |
| What about a viral post? | One counter row becomes a lock queue; shard the counter, batch counts through an outbox + Kafka, or keep the live number in Redis |
| How would you add notifications? | Outbox row in the same transaction as the like or comment → Debezium → Kafka → notifier that drops repeats by event id; never call the notifier directly after the write |
| How do you scale reads? | Read replicas first, then shard likes and comments by post id, with time-sortable ids |
