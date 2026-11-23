"""Builds ../architecture.md from template.md. Run: python gen.py"""
import pathlib, re
from engine import diagram, data_row

HERE = pathlib.Path(__file__).parent
FW = 60                      # flow box width
FGAPS = [14] * 8


def node(col, band, title, *steps, badge=None, notes=None):
    """steps: (n, agenda, [how lines], example) -> STEP n: agenda / - how / - e.g. example"""
    lines = []
    if notes:
        lines = notes
    for i, (n, agenda, how, eg) in enumerate(steps):
        if i:
            lines.append('')
        lines.append(f'STEP {n}: {agenda}')
        lines += [f'  - {h}' for h in how]
        if eg:
            lines.append(f'  - e.g. {eg}')
    if badge is None and steps:
        badge = 'STEP ' + ', '.join(str(s[0]) for s in steps)
    return dict(col=col, band=band, title=title, lines=lines, badge=badge)


def flow(nodes, edges):
    return diagram(nodes, edges, FW, FGAPS, arrow_off=3)


def fence(s):
    return '```text\n' + s + '\n```'


# ---------------------------------------------------------------- data boxes (schema + example)
USERS = ('users (PostgreSQL) · key id', '''
{
  "id": 42,
  "name": "Priya",
  "followerCount": 0 -> 1,
  "followingCount": 0,
  "createdAt": "2026-11-20T09:00:00+05:30"
}''')
USERS_RAHUL = ('users (PostgreSQL) · key id', '''
{
  "id": 7,
  "name": "Rahul",
  "followerCount": 0,
  "followingCount": 0 -> 1
}''')
FOLLOWS = ('follows (PostgreSQL) · PRIMARY KEY followerId + followeeId', '''
{
  "followerId": 7,     -- Rahul (asks)
  "followeeId": 42,    -- Priya (accepts)
  "status": 1 (PENDING) or 2 (ACCEPTED),
  "createdAt": "2026-11-22T18:00:00+05:30"
}
CHECK followerId <> followeeId
INDEX followeeId + status + createdAt DESC''')
POSTS = ('posts (PostgreSQL) · key id · INDEX authorId + id DESC', '''
{
  "id": 901,
  "authorId": 42,
  "content": "Sunset at Nandi Hills",
  "mediaKeys": ["posts/42/9f3a.jpg"],
  "likeCount": 1,
  "commentCount": 3,
  "status": 1 (active) or 2 (deleted),
  "createdAt": "2026-11-22T19:00:00+05:30",
  "updatedAt": "2026-11-22T19:00:00+05:30"
}''')
COMMENTS = ('comments (PostgreSQL) · key id · INDEX postId + parentId + id DESC', '''
{
  "id": 5003,
  "postId": 901,
  "authorId": 7,
  "parentId": null (top-level) or 5001,
  "replyToUserId": null or 42,      -- shown as "@Priya"
  "text": "Saving up for one!",
  "likeCount": 0,
  "replyCount": 0,
  "status": 1 (active) or 2 (deleted),
  "createdAt": "2026-11-22T19:20:00+05:30"
}''')
LIKES = ('likes (PostgreSQL) · PRIMARY KEY userId + targetType + targetId', '''
{
  "userId": 7,
  "targetType": 1 (post) or 2 (comment),
  "targetId": 901,
  "createdAt": "2026-11-22T19:05:00+05:30"
}
INDEX targetType + targetId + createdAt DESC''')
S3OBJ = ('S3 object (file storage) · key posts/<user id>/<file>', '''
{
  "bucket": "media-bucket",
  "key": "posts/42/9f3a.jpg",
  "content_type": "image/jpeg",
  "size_bytes": 812000
}''')
CDNURL = ('CDN URL (built on every read, never stored)', '''
CDN_BASE_URL + "/" + key
= "https://cdn.example.com/posts/42/9f3a.jpg"
hit  -> served from the nearby copy
miss -> fetched from S3 once, then cached''')
JWT = ('JWT login token (sent on every call, not stored)', '''
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
payload {
  "sub": "7",                 -- Rahul's user id
  "exp": 1795000000           -- expiry time
}
signed with JWT_SECRET (HS256)''')
PAGE = ('Page reply (every list) · cursor paging', '''
{
  "items": [ ... up to limit rows ... ],
  "nextCursor": "5001" or "2026-11-22T19:05:00Z" or null
}''')
POST_REPLY = ('201 reply (what Priya\'s app gets back)', '''
{
  "post": {
    "id": "901",                  -- BIGINT comes back as a string
    "authorid": "42",             -- names come back lowercase
    "content": "Sunset at Nandi Hills",
    "likecount": 0,
    "commentcount": 0,
    "status": 1,
    "createdat": "2026-11-22T13:30:00.000Z",
    "mediaUrls": ["https://cdn.example.com/posts/42/9f3a.jpg"]
  }
}''')
GET_REPLY = ('200 reply to Rahul · 404 to Anita', '''
Rahul: { "post": { "id": "901", ... "mediaUrls": [...] },
         "likedByMe": false }
Anita: 404 (empty body), same as a post that never existed''')
ERRORS = ('Error replies (errorHandler)', '''
HttpError(404)                    -> 404, empty body
HttpError(400, "INVALID_CURSOR")  -> 400 {"error": "INVALID_CURSOR"}
broken JSON body                  -> 400 {"error": "INVALID_JSON"}
no / bad / expired token          -> 401
any other error                   -> 500 (details only in the log)''')


# ---------------------------------------------------------------- quick view
def quick():
    W = 36
    n = lambda col, band, title, *lines: dict(col=col, band=band, title=title, lines=list(lines))
    nodes = {
        'rahul': n(0, 0, "Rahul's app (follower)", '- likes, comments, follows', '- loads photos from the CDN'),
        'priya': n(0, 1, "Priya's app (author)", '- posts photos', '- accepts follow requests'),
        'anita': n(0, 2, "Anita's app (stranger)", '- not a follower of Priya', '- gets 404 on her posts'),
        'cdn': n(1, 0, 'CDN (Content Delivery Network)', '- photo copies near phones', '- asks S3 on a miss'),
        'auth': n(1, 1, 'requireAuth (middleware)', '- checks the JWT login token', '- sets req.userId'),
        's3': n(2, 0, 'S3 (file storage)', '- the original photos', '- key posts/<user id>/<file>'),
        'router': n(2, 1, 'Routers + validate + paginate', '- id, body and cursor checks', '- 400 on bad input'),
        'ctrl': n(3, 1, 'Controllers', '- read request, send reply', '- pick the status code'),
        'svc': n(4, 1, 'Services', '- who can see what, owner rules', '- counters, reply flattening'),
        'dbq': n(5, 1, 'db_queries.js', '- every SQL in one file', '- values passed as $1, $2'),
        'err': n(5, 2, 'errorHandler (middleware)', '- HttpError -> status + code', '- anything else -> 500'),
        'pg': n(6, 1, 'PostgreSQL', '- users, follows', '- posts, comments, likes'),
    }
    edges = [('rahul', 'cdn'), ('rahul', 'auth'), ('priya', 'auth'), ('anita', 'auth'), ('cdn', 's3'),
             ('auth', 'router'), ('router', 'ctrl'), ('ctrl', 'svc'), ('svc', 'dbq'), ('svc', 'err'), ('dbq', 'pg')]
    return diagram(nodes, edges, W, [20] + [14] * 6, arrow_off=1, band_gap=4, top_pad=2,
                   frame=dict(title='THE LIKE / COMMENT / POST SERVICE: everything inside this box is ours',
                              from_col=1, gap_off=12),
                   headings={0: 'PEOPLE (outside)'})


# ---------------------------------------------------------------- flows
def chain(*keys):
    return list(zip(keys, keys[1:]))


def flow1():
    nodes = {
        'rahul': node(0, 0, "Rahul's app (user 7)",
                      (1, 'Taps "Follow" on Priya', ['PUT /v1/users/42/follow', 'Bearer token in the header'], '18:00, Priya is private')),
        'priya': node(0, 1, "Priya's app (user 42)",
                      (4, 'Opens "Follow requests"', ['GET /v1/users/me/follow-requests'], 'sees Rahul, asked 18:00'),
                      (5, 'Taps "Accept"', ['POST .../follow-requests/7/accept'], 'a second tap gets 404')),
        'auth': node(1, 0, 'requireAuth (middleware/auth.js)',
                     (2, 'Finds out who is calling', ['jwt.verify with JWT_SECRET', 'user id taken from "sub", never the body'], 'Rahul -> 7, Priya -> 42')),
        'router': node(2, 0, 'routes/users.js',
                       (2, 'Checks the ids in the path', ['router.param -> checkId: 1-19 digits', 'paginate("time") on the list'], '/users/abc/follow -> 400 INVALID_ID')),
        'ctrl': node(3, 0, 'controllers/users.js',
                     (3, 'Calls the service, picks the status', ['follow -> 202 (request sent)'], 'Rahul gets 202'),
                     (5, 'Answers the accept', ['accept -> 200, decline -> 204'], 'Priya gets 200')),
        'svc': node(4, 0, 'services/users.js',
                    (3, 'Creates only a PENDING request', ['no self-follow, target must exist', 'counts do not move yet'], 'follow(7, 42)'),
                    (4, 'Lists who asked', ['newest first, cursor = createdAt'], 'toPage -> nextCursor null'),
                    (5, 'Accepts, then moves both counters', ['counters move only if 1 row changed'], '0 rows -> notFound() -> 404')),
        'pg': node(5, 0, 'PostgreSQL (follows, users)',
                   (3, 'Stores the request once', ['INSERT ... ON CONFLICT DO NOTHING'], 'follows (7, 42) status 1'),
                   (4, 'Finds pending requests fast', ['INDEX followeeId + status + createdAt'], 'only Priya\'s part of the index'),
                   (5, 'Flips PENDING -> ACCEPTED once', ['UPDATE ... WHERE status = 1', 'then two counter UPDATEs'], 'status 2, counts 0 -> 1')),
    }
    edges = [('rahul', 'auth'), ('priya', 'auth')] + chain('auth', 'router', 'ctrl', 'svc', 'pg')
    data = data_row([('PostgreSQL', [FOLLOWS, USERS, USERS_RAHUL]),
                     ('Reply', [('200 reply to GET /v1/users/me/follow-requests', '''
{
  "items": [
    {"id": "7", "name": "Rahul", "createdat": "2026-11-22T12:30:00.000Z"}
  ],
  "nextCursor": null
}''')])])
    return flow(nodes, edges), data


def flow2():
    nodes = {
        'priya': node(0, 0, "Priya's app (user 42)",
                      (1, 'Uploads the photo to S3 first', ['pre-signed upload URL (not in this code)', 'file goes phone -> S3 directly'], 'key posts/42/9f3a.jpg'),
                      (2, 'Sends the post', ['POST /v1/posts {content, mediaKeys}'], '"Sunset at Nandi Hills"')),
        'rahul': node(0, 1, "Rahul's app (user 7)",
                      (6, 'Shows the photo', ['loads each URL in mediaUrls'], 'cdn.example.com/posts/42/9f3a.jpg')),
        'auth': node(1, 0, 'requireAuth (middleware/auth.js)',
                     (2, 'Finds out who is posting', ['req.userId from the token'], 'Priya -> 42')),
        'cdn': node(1, 1, 'CDN (Content Delivery Network)',
                    (6, 'Serves the nearest copy', ['hit: send the copy it already has', 'miss: fetch from S3, keep a copy'], 'first viewer = miss, rest = hits')),
        'router': node(2, 0, 'routes/posts.js + validate.newPost',
                       (3, 'Checks the shape of the body', ['content: text or null', 'mediaKeys: list of strings', 'not both empty'], '{} -> 400 EMPTY_POST')),
        's3': node(2, 1, 'S3 (file storage)',
                   (6, 'Hands the original to the CDN', ['only on a CDN miss'], 'posts/42/9f3a.jpg')),
        'ctrl': node(3, 0, 'controllers/posts.js',
                     (5, 'Replies 201 with the post', ['{post} with mediaUrls added'], 'post 901')),
        'svc': node(4, 0, 'services/posts.js',
                    (4, 'Checks keys, saves, builds URLs', ['each key must start with posts/42/', 'no ".." in a key', 'URL = CDN_BASE_URL + "/" + key'], 'posts/7/x.jpg -> 400')),
        'pg': node(5, 0, 'PostgreSQL (posts)',
                   (4, 'Stores the post with S3 keys only', ['INSERT ... RETURNING *', 'id from BIGSERIAL (a counter)'], 'post 901, likeCount 0')),
    }
    edges = [('priya', 'auth'), ('rahul', 'cdn'), ('cdn', 's3')] + chain('auth', 'router', 'ctrl', 'svc', 'pg')
    data = data_row([('S3 + CDN', [S3OBJ, CDNURL]), ('PostgreSQL', [POSTS]), ('Reply', [POST_REPLY])])
    return flow(nodes, edges), data


def flow3():
    nodes = {
        'rahul': node(0, 0, "Rahul's app (user 7, follower)",
                      (1, 'Opens Priya\'s post', ['GET /v1/posts/901'], 'from his feed')),
        'anita': node(0, 1, "Anita's app (user 8, stranger)",
                      (1, 'Tries the same post', ['GET /v1/posts/901'], 'link shared in a chat')),
        'auth': node(1, 0, 'requireAuth (middleware/auth.js)',
                     (2, 'Finds out who is asking', ['no token -> 401 at once'], 'Rahul 7, Anita 8')),
        'router': node(2, 0, 'routes/posts.js',
                       (2, 'Checks the post id', ['checkId: 1-19 digits'], '/posts/abc -> 400 INVALID_ID')),
        'ctrl': node(3, 0, 'controllers/posts.js',
                     (4, 'Sends {post, likedByMe}', ['200 for Rahul'], 'likedByMe false')),
        'svc': node(4, 0, 'services/posts.js + shared.js',
                    (3, 'Asks "can this user see it?"', ['getVisiblePost: one query', 'no row -> throw notFound()'], 'Anita -> no row'),
                    (4, 'Adds "did I like it?"', ['likedByMe: 1 row in likes or not'], 'Rahul -> false')),
        'pg': node(5, 0, 'PostgreSQL (posts, follows, likes)',
                   (3, 'Answers read + access in one SQL', ['post live AND (my post OR', '  I am an ACCEPTED follower)'], '(7, 42, ACCEPTED) exists'),
                   (4, 'Checks the like by primary key', ['userId + targetType + targetId'], '(7, 1, 901) -> none')),
        'err': node(5, 1, 'errorHandler (middleware)',
                    (5, 'Turns the error into a reply', ['HttpError(404) -> 404, no body'], 'Anita sees "not found"')),
    }
    edges = [('rahul', 'auth'), ('anita', 'auth')] + chain('auth', 'router', 'ctrl', 'svc', 'pg') + [('svc', 'err')]
    data = data_row([('PostgreSQL', [POSTS, FOLLOWS]), ('Reply', [GET_REPLY])])
    return flow(nodes, edges), data


def flow4():
    nodes = {
        'rahul': node(0, 0, "Rahul's app (user 7)",
                      (1, 'Double-taps the photo', ['PUT /v1/posts/901/like', 'weak network: sent twice'], '19:05'),
                      (5, 'Changes his mind', ['DELETE /v1/posts/901/like'], 'taps the heart again'),
                      (6, 'Opens "Liked by"', ['GET /v1/posts/901/likes'], 'sees names, newest first')),
        'auth': node(1, 0, 'requireAuth (middleware/auth.js)',
                     (2, 'Finds out who is liking', ['req.userId from the token'], 'Rahul -> 7')),
        'router': node(2, 0, 'routes/posts.js',
                       (2, 'Fixes WHAT is liked by the route', ['likes.like("posts") or ("comments")', 'never from the body'], '/comments/5001/like -> comment')),
        'ctrl': node(3, 0, 'controllers/likes.js',
                     (4, 'Same answer every time', ['like -> 200, unlike -> 204'], 'both taps get 200')),
        'svc': node(4, 0, 'services/likes.js',
                    (3, 'Can Rahul see the post?', ['getVisiblePost, else 404'], 'strangers cannot like'),
                    (4, 'Moves the counter only on a new row', ['rowCount 1 -> likeCount + 1', 'rowCount 0 -> do nothing'], '2nd tap -> 0 -> no change'),
                    (5, 'Unlike: no access check needed', ['you can only delete your own row'], 'rowCount 1 -> likeCount - 1')),
        'pg': node(5, 0, 'PostgreSQL (likes, posts)',
                   (4, 'Primary key blocks a 2nd like', ['INSERT ... ON CONFLICT DO NOTHING', 'UPDATE posts likeCount + 1'], '(7, 1, 901) once, count 1'),
                   (6, 'Lists likers by time', ['INDEX targetType+targetId+createdAt'], 'Rahul, 19:05')),
    }
    edges = chain('rahul', 'auth', 'router', 'ctrl', 'svc', 'pg')
    data = data_row([('PostgreSQL', [LIKES, ('posts (PostgreSQL) · only likeCount changes', '''
{
  "id": 901,
  "likeCount": 0 -> 1 -> 0
}''')]), ('Reply', [('200 reply to GET /v1/posts/901/likes', '''
{
  "items": [
    {"id": "7", "name": "Rahul", "createdat": "2026-11-22T13:35:00.000Z"}
  ],
  "nextCursor": null
}''')])])
    return flow(nodes, edges), data


def flow5():
    nodes = {
        'rahul': node(0, 0, "Rahul's app (user 7)",
                      (1, 'Comments on the post', ['POST /v1/posts/901/comments {text}'], '"Wow, which camera?"'),
                      (3, 'Replies to Priya\'s reply', ['same call, parentId 5002'], '"Saving up for one!"')),
        'priya': node(0, 1, "Priya's app (user 42)",
                      (2, 'Replies to Rahul', ['same call, parentId 5001'], '"Pixel 9!"')),
        'auth': node(1, 0, 'requireAuth (middleware/auth.js)',
                     (1, 'Finds out who writes', ['req.userId from the token'], 'Rahul 7, Priya 42')),
        'router': node(2, 0, 'routes/posts.js + validate.newComment',
                       (1, 'Cleans the body', ['text: not empty, trimmed', 'parentId: digits or null'], '"   " -> 400 INVALID_TEXT')),
        'ctrl': node(3, 0, 'controllers/comments.js',
                     (1, 'Replies 201 {comment}', [], 'comment 5001')),
        'svc': node(4, 0, 'services/comments.js',
                    (1, 'Top-level comment', ['post must be visible to Rahul'], 'parentId null'),
                    (2, 'Reply to a top comment', ['parent must be live, same post'], 'parent 5001 is top -> 5001'),
                    (3, 'Reply to a reply: flatten', ['store under the TOP comment', 'replyToUserId = reply\'s author'], 'top 5001, "@Priya"'),
                    (4, 'Bumps the counters', ['commentCount + 1, replyCount + 1'], 'three separate statements')),
        'pg': node(5, 0, 'PostgreSQL (comments, posts)',
                   (1, 'Stores comment 5001', ['INSERT ... RETURNING *'], 'parentId NULL'),
                   (2, 'Stores 5002 under 5001', ['findLiveComment(5001, 901) first'], 'replyCount of 5001 -> 1'),
                   (3, 'Stores 5003 under 5001 too', ['parentId 5001, replyToUserId 42'], 'replyCount of 5001 -> 2'),
                   (4, 'Counters on the parent rows', ['UPDATE posts / comments ... + 1'], 'commentCount of 901 -> 3')),
    }
    edges = [('rahul', 'auth'), ('priya', 'auth')] + chain('auth', 'router', 'ctrl', 'svc', 'pg')
    data = data_row([('PostgreSQL', [
        ('comments row 5001 · top-level', '''
{
  "id": 5001, "postId": 901, "authorId": 7,
  "parentId": null, "replyToUserId": null,
  "text": "Wow, which camera?",
  "replyCount": 0 -> 1 -> 2
}'''),
        ('comments row 5002 · reply', '''
{
  "id": 5002, "postId": 901, "authorId": 42,
  "parentId": 5001, "replyToUserId": null,
  "text": "Pixel 9!"
}'''),
        ('comments row 5003 · reply to a reply, flattened', '''
{
  "id": 5003, "postId": 901, "authorId": 7,
  "parentId": 5001,          -- not 5002
  "replyToUserId": 42,       -- "@Priya"
  "text": "Saving up for one!"
}'''),
        ('posts row 901 · only commentCount changes', '''
{
  "id": 901,
  "commentCount": 0 -> 1 -> 2 -> 3
}''')])])
    return flow(nodes, edges), data


def flow6():
    nodes = {
        'rahul': node(0, 0, "Rahul's app (user 7)",
                      (1, 'Opens the comments', ['GET /v1/posts/901/comments?limit=20'], 'first page'),
                      (4, 'Scrolls for more', ['same call + cursor=<nextCursor>'], 'cursor=5001'),
                      (5, 'Taps "View more replies"', ['GET /v1/comments/5001/replies', '  ?cursor=5003'], 'after the 2 shown')),
        'auth': node(1, 0, 'requireAuth (middleware/auth.js)',
                     (1, 'Finds out who reads', ['req.userId from the token'], 'Rahul -> 7')),
        'router': node(2, 0, 'routes + paginate("id")',
                       (2, 'Turns the query into req.page', ['cursor: digits only', 'limit: default 20, max 50'], 'limit=500 -> 50')),
        'ctrl': node(3, 0, 'controllers/comments.js',
                     (2, 'Reads ?sort=top', ['top = most liked first'], 'default: newest first')),
        'svc': node(4, 0, 'services/comments.js + toPage',
                    (3, 'Builds the page', ['visible post first, else 404', 'full page -> nextCursor = last id', 'short page -> nextCursor null'], '20 rows -> next 5001')),
        'pg': node(5, 0, 'PostgreSQL (comments)',
                   (3, 'Top comments + 2 replies each', ['one query, replies as json_agg', 'INDEX postId + parentId + id DESC'], '5001 with [5002, 5003]'),
                   (4, 'Next page by id, not OFFSET', ['WHERE id < 5001'], 'jumps straight there'),
                   (5, 'Replies oldest first', ['WHERE parentId = 5001 AND id > 5003'], 'continues after 5003')),
    }
    edges = chain('rahul', 'auth', 'router', 'ctrl', 'svc', 'pg')
    data = data_row([('Reply', [('200 reply to GET /v1/posts/901/comments', '''
{
  "items": [
    {
      "id": "5001", "authorid": "7", "parentid": null,
      "text": "Wow, which camera?", "likecount": 0, "replycount": 2,
      "replies": [
        {"id": 5002, "authorid": 42, "text": "Pixel 9!", ...},
        {"id": 5003, "authorid": 7, "replytouserid": 42, ...}
      ]
    }
  ],
  "nextCursor": null
}'''), PAGE])])
    return flow(nodes, edges), data


def flow7():
    nodes = {
        'priya': node(0, 0, "Priya's app (user 42)",
                      (1, 'Fixes a typo in her post', ['PATCH /v1/posts/901 {content}'], '"Sunset at Nandi Hills!"'),
                      (3, 'Deletes the post', ['DELETE /v1/posts/901'], 'gone for everyone')),
        'rahul': node(0, 1, "Rahul's app (user 7)",
                      (2, 'Tries to edit Priya\'s post', ['PATCH /v1/posts/901 {content}'], 'gets 404')),
        'auth': node(1, 0, 'requireAuth (middleware/auth.js)',
                     (1, 'Finds out who edits', ['req.userId from the token'], 'Priya 42, Rahul 7')),
        'router': node(2, 0, 'routes/posts.js + validate.editPost',
                       (1, 'Checks the body', ['content must be a string'], '{content: 5} -> 400')),
        'ctrl': node(3, 0, 'controllers/posts.js',
                     (1, 'Replies with the new post', ['200 {post}; delete -> 204'], 'post 901')),
        'svc': node(4, 0, 'services/posts.js',
                    (1, 'Owner check inside the UPDATE', ['no row back -> throw notFound()'], 'Priya -> row back'),
                    (2, 'Same UPDATE, 0 rows for Rahul', ['throw notFound()'], 'Rahul -> 404'),
                    (3, 'Soft delete', ['status = 2, row stays'], 'all reads skip status 2')),
        'pg': node(5, 0, 'PostgreSQL (posts)',
                   (1, 'Changes only my live post', ['WHERE id = 901 AND authorId = 42', '  AND status = 1'], 'updatedAt = now()'),
                   (3, 'Marks the post deleted', ['UPDATE posts SET status = 2'], 'comments hidden with it')),
        'err': node(5, 1, 'errorHandler (middleware)',
                    (4, 'One place that writes errors', ['HttpError -> its status (+ code)', 'other errors -> log + 500'], 'Rahul gets 404')),
    }
    edges = [('priya', 'auth'), ('rahul', 'auth')] + chain('auth', 'router', 'ctrl', 'svc', 'pg') + [('svc', 'err')]
    data = data_row([('PostgreSQL', [('posts row 901 · edited, then soft-deleted', '''
{
  "id": 901,
  "authorId": 42,
  "content": "Sunset at Nandi Hills" -> "Sunset at Nandi Hills!",
  "status": 1 -> 2,
  "updatedAt": "2026-11-22T19:00:00+05:30" -> "2026-11-22T20:10:00+05:30"
}''')]), ('Replies', [ERRORS])])
    return flow(nodes, edges), data


# ---------------------------------------------------------------- build
parts = {
    'QUICK': fence(quick()),
    'SCHEMA_PEOPLE': fence(data_row([(None, [USERS, FOLLOWS])])),
    'SCHEMA_CONTENT': fence(data_row([(None, [POSTS, COMMENTS, LIKES])])),
    'SCHEMA_OTHER': fence(data_row([(None, [S3OBJ, CDNURL, JWT, PAGE])])),
}
for i, f in enumerate([flow1, flow2, flow3, flow4, flow5, flow6, flow7], 1):
    d, data = f()
    parts[f'FLOW{i}'] = fence(d)
    parts[f'DATA{i}'] = fence(data)

md = (HERE / 'template.md').read_text(encoding='utf-8')
md = re.sub(r'@@(\w+)@@', lambda m: parts.pop(m.group(1)), md)
assert not parts, f'unused parts: {list(parts)}'
assert '~' not in md.replace('```', ''), 'use ≈ not ~'
out = HERE.parent / 'architecture.md'
out.write_text(md, encoding='utf-8')
print('wrote', out)
