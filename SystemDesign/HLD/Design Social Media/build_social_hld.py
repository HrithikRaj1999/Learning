#!/usr/bin/env python3
"""ONE interview-ready Social Media (Facebook / Instagram) HLD - black & white.

Top band  : requirements, estimates, entities, API  (the talking part)
Below     : the diagram, laid out as strict column lanes with orthogonal pipes
            UI | LB | SERVICES | STORES | CACHE | KAFKA | CONSUMERS | UI
Bottom    : one numbered sentence per arrow, plus the two panels that matter.
"""
import json, random, itertools

INK = "#1e1e1e"
SEQ = itertools.count(1)
ELS = []

CAT = {                        # everything is black on white; weight = emphasis
    "ui":  (INK, "transparent"),
    "svc": (INK, "transparent"),
    "db":  (INK, "transparent"),
    "q":   (INK, "transparent"),
    "lb":  (INK, "#1e1e1e"),
}

# ------------------------------------------------------------------ columns
UI_X, UI_W = 40, 210
GW_X, GW_W = 290, 30
SV_X, SV_W = 390, 300      # 390 .. 690
ST_X, ST_W = 800, 300      # 800 .. 1100
S2_X, S2_W = 1150, 240     # 1150 .. 1390
KF_X, KF_W = 1470, 200     # 1470 .. 1670
CO_X, CO_W = 1770, 310     # 1770 .. 2080
E_X,  E_W  = 2150, 300     # 2150 .. 2450
X_X,  X_W  = 2520, 300     # 2520 .. 2820
RU_X, RU_W = 2900, 220     # 2900 .. 3120

GA = 745      # gutter A  - the nightly-batch feedback drop
RC = 765      # gutter A  - service <-> service bus
CC = 640      # gutter A  - kafka -> post processor
AC = 1174     # gutter B  - archival cron -> S3
LC = 355      # left corridor - post processor -> graph service
TOP = 190     # free lane above the diagram
FAR = 3180    # free corridor right of everything

def ROW(i):   return 250 + 200 * i
def LANE(i):  return ROW(i) + 165
RY = [280, 500, 720, 940, 1160]
KF_Y, KF_H = 240, 2010


# ------------------------------------------------------------------ helpers
def _b(kind, x, y, w, h, **kw):
    return {"id": f"e{next(SEQ)}", "type": kind, "x": x, "y": y,
            "width": w, "height": h, "angle": 0,
            "strokeColor": kw.pop("stroke", INK),
            "backgroundColor": kw.pop("fill", "transparent"),
            "fillStyle": kw.pop("fs", "solid"),
            "strokeWidth": kw.pop("sw", 1),
            "strokeStyle": kw.pop("dash", "solid"),
            "roughness": kw.pop("rough", 1), "opacity": 100,
            "groupIds": [], "frameId": None,
            "seed": random.randint(1, 2 ** 31), "version": 100,
            "versionNonce": random.randint(1, 2 ** 31), "isDeleted": False,
            "boundElements": [], "updated": 1787160000000, "link": None,
            "locked": False, **kw}


def text(x, y, s, fs=12, font=6, col=INK):
    lines = s.split("\n")
    w = max(len(l) for l in lines) * fs * 0.52
    ELS.append(_b("text", x, y, w, len(lines) * fs * 1.25, text=s, originalText=s,
                  fontSize=fs, fontFamily=font, textAlign="left", verticalAlign="top",
                  containerId=None, autoResize=True, lineHeight=1.25, roundness=None,
                  stroke=col))


def ctext(cx, y, s, fs=12, col=INK):
    w = max(len(l) for l in s.split("\n")) * fs * 0.52
    text(cx - w / 2, y, s, fs, 6, col)


class N:
    """A box that knows its own edges. Name + at most two plain bullets."""

    def __init__(self, x, y, w, h, title="", bullets=(), cat="svc",
                 sw=1, tfs=14, bfs=11):
        self.x, self.y, self.w, self.h = x, y, w, h
        stroke, fill = CAT[cat]
        ELS.append(_b("rectangle", x, y, w, h, stroke=stroke, fill=fill, sw=sw,
                      roundness={"type": 3}))
        tc = "#ffffff" if cat == "lb" else INK
        if title:
            ctext(x + w / 2, y + 12, title, tfs, tc)
        if bullets:
            text(x + 16, y + 12 + tfs * 1.5, "\n".join("- " + b for b in bullets), bfs, 6, tc)

    @property
    def r(self): return self.x + self.w
    @property
    def b(self): return self.y + self.h
    def rp(self, f=0.5): return (self.r, self.y + self.h * f)
    def lp(self, f=0.5): return (self.x, self.y + self.h * f)
    def tp(self, f=0.5): return (self.x + self.w * f, self.y)
    def bp(self, f=0.5): return (self.x + self.w * f, self.b)


def pipe(pts, sw=1, both=False, dash="solid"):
    x0, y0 = pts[0]
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    ELS.append(_b("arrow", x0, y0, max(xs) - min(xs), max(ys) - min(ys),
                  dash=dash, sw=sw, rough=0,
                  points=[[p[0] - x0, p[1] - y0] for p in pts],
                  startBinding=None, endBinding=None,
                  startArrowhead="arrow" if both else None,
                  endArrowhead="arrow", elbowed=False, roundness=None))


def num(n, cx, cy, r=14):
    ELS.append(_b("ellipse", cx - r, cy - r, 2 * r, 2 * r, fill="#ffffff",
                  stroke=INK, sw=1, rough=1, roundness={"type": 2}))
    ctext(cx, cy - 7, str(n), 12)


def h_link(a, b, af=0.5, bf=None, n=None, sw=1, both=False):
    bf = af if bf is None else bf
    ax, ay = a.rp(af)
    bx, by = b.lp(bf)
    pts = [(ax, ay), (bx, ay)] if abs(ay - by) < 2 else \
          [(ax, ay), ((ax + bx) / 2, ay), ((ax + bx) / 2, by), (bx, by)]
    pipe(pts, sw=sw, both=both)
    if n is not None:
        num(n, ax + 34, min(ay, by) - 24)


def v_link(a, b, af=0.5, bf=None, n=None, sw=1, both=False):
    bf = af if bf is None else bf
    ax, ay = a.bp(af)
    bx, by = b.tp(bf)
    mid = (ay + by) / 2
    pipe([(ax, ay), (ax, mid), (bx, mid), (bx, by)] if abs(ax - bx) > 2
         else [(ax, ay), (bx, by)], sw=sw, both=both)
    if n is not None:
        num(n, ax + 30, ay + 26)


def panel(x, y, w, h, title):
    ELS.append(_b("rectangle", x, y, w, h, dash="dashed", stroke=INK,
                  fill="transparent", sw=1, roundness={"type": 3}))
    text(x + 22, y + 18, title, 16)


# ============================================================ 1. THE BRIEF
text(40, -850, "Social Media  -  Facebook / Instagram  -  High Level Design", 30)
text(40, -804, "one post write path, one feed read path, one queue in the middle, "
               "and every slow job hanging off that queue.", 14)

panel(40, -760, 950, 390, "A.  FUNCTIONAL  -  what it must do")
text(64, -708,
     "1   a user can post text, an image or a video\n\n"
     "2   a user can follow / unfollow anyone\n\n"
     "3   a user opens the app and sees a feed of posts\n     from the people they follow, newest first\n\n"
     "4   a user can like and comment on a post\n\n"
     "5   a user can search for people, posts and hashtags\n\n"
     "6   a user gets a live alert when someone likes,\n     comments or follows them\n\n"
     "7   nice to have: trending hashtags, stories, DMs", 13)

panel(1030, -760, 950, 390, "B.  NON FUNCTIONAL  -  how well")
text(1054, -708,
     "1   CAP\n"
     "       availability  >  consistency   for the feed\n"
     "           a 2 second old feed is fine, a blank feed is not\n"
     "       consistency  >  availability   for login and for\n"
     "           your own post - you must see your own post at once\n\n"
     "2   speed\n"
     "       feed opens in under 200 ms\n"
     "       posting answers in under 500 ms\n\n"
     "3   read heavy  -  about 100 reads for every 1 write\n"
     "       so: pre-compute the feed, cache hard, never scan\n\n"
     "4   durable  -  once we say 'posted', it is never lost\n\n"
     "5   one user is never bigger than one machine", 13)

panel(2020, -760, 1140, 390, "C.  ESTIMATION  -  the numbers you quote")
text(2044, -708,
     "DAU                     500 M\n"
     "posts                   20 % of them post once  =  100 M posts / day\n"
     "write QPS               100 M / 100 K s  =  1 K writes / s      peak 10 x  =  10 K / s\n"
     "feed opens              10 per user per day  =  5 B / day\n"
     "read QPS                5 B / 100 K s  =  50 K reads / s        peak 10 x  =  500 K / s\n"
     "ratio                   100 : 1 read heavy   ->   cache + pre-computed feed\n\n"
     "post row                1 KB x 100 M  =  100 GB / day  ~  36 TB / year   (text only)\n"
     "media                   20 % have media, 300 KB each  =  6 TB / day   ->   S3 + CDN\n\n"
     "fan out                 300 followers x 100 M posts  =  30 B feed writes / day\n"
     "                        this single line is why celebrities are handled differently\n\n"
     "feed cache              800 entries x 30 bytes  =  24 KB per user\n"
     "                        50 M active users  ~  1.2 TB of Redis", 13)

panel(40, -330, 950, 310, "D.  CORE ENTITIES")
text(64, -278,
     "User            id  |  name  |  handle  |  bio\n\n"
     "Follow          followerId  |  followeeId  |  createdAt\n\n"
     "Post            id  |  authorId  |  text  |  mediaUrl  |  createdAt\n\n"
     "FeedEntry       userId  |  postId  |  createdAt        (the pre-built feed)\n\n"
     "Like            postId  |  userId                      (that pair = one like)\n\n"
     "Comment         id  |  postId  |  userId  |  text  |  createdAt\n\n"
     "Notification    userId  |  type  |  actorId  |  postId  |  seen", 13)

panel(1030, -330, 950, 310, "E.  API DESIGN")
text(1054, -278,
     "POST    /v1/posts                    { text, mediaKey }   ->  postId\n"
     "GET     /v1/upload-url?type=image      ->  a short lived S3 link the phone uploads to\n"
     "GET     /v1/feed?cursor=<c>&limit=20   ->  [ posts ] + nextCursor    never a page number\n"
     "GET     /v1/users/{id}/posts?cursor=<c>    ->  that person's wall\n"
     "POST    /v1/users/{id}/follow     |   DELETE  /v1/users/{id}/follow\n"
     "POST    /v1/posts/{id}/like       |   DELETE  /v1/posts/{id}/like\n"
     "POST    /v1/posts/{id}/comments      { text }\n"
     "GET     /v1/posts/{id}/comments?cursor=<c>\n"
     "GET     /v1/search?q=<q>&type=post|user|tag\n"
     "WS      /v1/notifications              ->  the live like / comment / follow alerts", 13)

panel(2020, -330, 1140, 310, "F.  WHY EACH PIECE IS THERE")
text(2044, -278,
     "Kafka              one queue in the middle, so the write path never waits for the slow work\n"
     "Cassandra          feeds, posts, likes, comments  -  huge, append only, always read by key\n"
     "MySQL              users and follows  -  small, must be exactly right, needs joins\n"
     "Redis              the ready made feed, counters, presence, trends  -  everything hot\n"
     "S3 + CDN           the actual bytes  -  they must never travel through our services\n"
     "Elasticsearch      text search, where being a few seconds behind is acceptable\n"
     "Spark              counting and ranking over history, always outside the request path", 13)

# ============================================================ 2. GATEWAY
gw1 = N(GW_X, 240, GW_W, 560, "", cat="lb")
ctext(GW_X + GW_W / 2, 300, "\n".join("APIGATEWAY+LB+AUTH"), 13, "#ffffff")
gw2 = N(GW_X, 1440, GW_W, 150, "", cat="lb")
ctext(GW_X + GW_W / 2, 1470, "\n".join("LB"), 13, "#ffffff")
gw3 = N(GW_X, 1930, GW_W, 260, "", cat="lb")
ctext(GW_X + GW_W / 2, 2010, "\n".join("LB"), 13, "#ffffff")

# ============================================================ 3. UI COLUMN
u1 = N(UI_X, ROW(0), UI_W, 110, "Login / Signup UI", ["email or OAuth"], cat="ui")
u2 = N(UI_X, ROW(1), UI_W, 110, "Follow / Friend UI", ["follow, unfollow"], cat="ui")
u3 = N(UI_X, ROW(2), UI_W, 110, "Create Post UI", ["text, photo, video"], cat="ui")
u4 = N(UI_X, ROW(6), UI_W, 130, "Feed / Profile Screen",
       ["scrolls forever", "asks for 20 at a time"], cat="ui")
u5 = N(UI_X, 1950, UI_W, 110, "Like / Comment UI", ["shows it instantly"], cat="ui")

# ============================================================ 4. SERVICES
s1 = N(SV_X, ROW(0), SV_W, 110, "User Service",
       ["login, signup, tokens", "reads and updates the profile"])
s2 = N(SV_X, ROW(1), SV_W, 110, "Graph Service",
       ["stores who follows who", "gives back the follower list"])
s3 = N(SV_X, ROW(2), SV_W, 110, "Post Ingestion Service", sw=2,
       bullets=["the single write door for a post", "saves it, then drops an event on Kafka"])
s4 = N(SV_X, ROW(3), SV_W, 110, "Asset Service",
       ["hands out the upload link", "makes thumbnails, pushes to CDN"])
s5 = N(SV_X, ROW(4), SV_W, 110, "Post Service",
       ["owns the post row", "reads one person's posts"])
s6 = N(SV_X, ROW(5), SV_W, 110, "Post Processor  (fan-out)", sw=2,
       bullets=["copies a new post into every follower's feed",
                "skips celebrities on purpose"])
s7 = N(SV_X, ROW(6), SV_W, 110, "Timeline Service", sw=2,
       bullets=["reads the feed we built earlier",
                "adds celebrity posts at read time"])
s8 = N(SV_X, ROW(7), SV_W, 110, "Archival Cron",
       ["moves posts older than 90 days", "keeps the live tables small"])
s9 = N(SV_X, ROW(8), SV_W, 110, "Like Service",
       ["one like per user per post", "count kept in Redis"])
s10 = N(SV_X, ROW(9), SV_W, 110, "Comment Service",
        ["adds a comment to a post", "reads them a page at a time"])

# ============================================================ 5. STORES
def cluster(x, y, w, title, note):
    n = N(x, y, w, 130, title, cat="db")
    for i, lab in enumerate(("Master", "Slave 1", "Slave 2")):
        bw = (w - 32) / 3 - 10
        bx = x + 16 + i * ((w - 32) / 3)
        ELS.append(_b("rectangle", bx, y + 46, bw, 34, stroke=INK,
                      fill="transparent", sw=1, roundness={"type": 3}))
        ctext(bx + bw / 2, y + 55, lab, 11)
    text(x + 16, y + 92, note, 10)
    return n

r1 = N(ST_X, ROW(0), ST_W, 110, "Redis  -  read through",
       ["logged in sessions + profiles", "miss goes on to MySQL"], cat="db")
d1 = cluster(S2_X, ROW(0), S2_W, "User DB  -  MySQL", "the one place that must be exact")
r2 = N(ST_X, ROW(1), ST_W, 110, "Redis  -  read through",
       ["follower lists of normal users", "a celebrity list is never cached whole"], cat="db")
d2 = cluster(S2_X, ROW(1), S2_W, "Graph DB  -  MySQL", "each edge is saved both ways")

su = N(ST_X, ROW(2), ST_W, 110, "Short URL Service",
       ["turns any link into 7 characters", "no lookup needed to make one"])
cdn = N(ST_X, ROW(3), ST_W, 110, "CDN  -  recent media",
        ["holds photos and videos at the edge", "the browser never reaches a service"], cat="db")
s3b = N(S2_X, ROW(3), S2_W, 110, "S3",
        ["the original files", "cheap long term storage"], cat="db")

pc = N(ST_X, ROW(4), ST_W, 110, "Cassandra  -  posts",
       ["all posts of one author sit together", "newest first, only ever appended"], cat="db")
rf = N(ST_X, ROW(5), ST_W, 110, "Redis  -  ready made feed",
       ["the feed page we built in advance", "newest 800 posts per user"], cat="db")
at = N(ST_X, ROW(6), ST_W, 110, "Cassandra  -  timeline",
       ["the same feed, but on disk", "survives a Redis restart"], cat="db")
lk = N(ST_X, ROW(8), ST_W, 110, "Cassandra  -  likes",
       ["the row key is post + user", "so a double tap changes nothing"], cat="db")
lc = N(S2_X, ROW(8), S2_W, 110, "Redis",
       ["the like counter", "written back in batches"], cat="db")
cm = N(ST_X, ROW(9), ST_W, 110, "Cassandra  -  comments",
       ["all comments of one post together", "newest first"], cat="db")

# ============================================================ 6. KAFKA
kf = N(KF_X, KF_Y, KF_W, KF_H, "", cat="q", sw=2)
ctext(KF_X + KF_W / 2, 300, "\n".join("KAFKA"), 30)
ctext(KF_X + KF_W / 2, 560, "the queue in the middle.\n\nwriting is fast because\nnobody waits here for\nthe slow work to finish", 11)
text(KF_X + 26, 700, "EVENTS ON IT\n\n- post created\n- post deleted\n- follow added\n"
                     "- like added\n- comment added\n- user activity\n- notification", 12)
text(KF_X + 26, 940, "- all events of one\n  user go to the same\n  partition, so they\n  stay in order\n\n"
                     "- an event can arrive\n  twice, so every\n  reader is written to\n  ignore repeats\n\n"
                     "- kept for 7 days, so\n  a broken reader can\n  replay instead of\n  losing data", 11)

# ============================================================ 7. CONSUMERS
k1 = N(CO_X, RY[0], CO_W, 110, "Search Consumer",
       ["picks up every new post", "sends the words to the index"])
e1 = N(E_X, RY[0], E_W, 110, "Elasticsearch",
       ["word and hashtag index", "a few seconds behind, that is fine"], cat="db")
x1 = N(X_X, RY[0], X_W, 110, "Search Service",
       ["answers the search box", "popular searches come from cache"])
lb1 = N(2846, RY[0], 22, 110, "", cat="lb")
ctext(2857, RY[0] + 32, "L\nB", 12, "#ffffff")
u6 = N(RU_X, RY[0], RU_W, 110, "Search Screen", ["people, posts, tags"], cat="ui")

k2 = N(CO_X, RY[1], CO_W, 110, "Notification Consumer",
       ["picks up likes, comments, follows", "only bothers people who are online"])
x2 = N(E_X, RY[1], E_W, 110, "WebSocket Gateway",
       ["holds the open connections", "pushes the alert down"])
r3 = N(X_X, RY[1], X_W, 110, "Redis  -  presence",
       ["who is online right now", "and which gateway holds them"], cat="db")
u7 = N(RU_X, RY[1], RU_W, 110, "Users App / Browsers", ["gets it live"], cat="ui")

k3 = N(CO_X, RY[2], CO_W, 110, "Activity Tracker",
       ["what was opened and for how long", "this is what ranking learns from"])
e3 = N(E_X, RY[2], E_W, 110, "Cassandra  -  activity",
       ["one row per user per day", "written a lot, read by batch jobs"], cat="db")

k4 = N(CO_X, RY[3], CO_W, 110, "Spark Streaming",
       ["counts hashtags as they arrive", "a fresh count every 5 minutes"])
e4 = N(E_X, RY[3], E_W, 110, "Redis  -  trends",
       ["a sorted list per region", "reading the top 10 is one call"], cat="db")
x4 = N(X_X, RY[3], X_W, 110, "Trends Service",
       ["serves the trending list", "never touches a database"])
lb2 = N(2846, RY[3], 22, 110, "", cat="lb")
ctext(2857, RY[3] + 32, "L\nB", 12, "#ffffff")
u8 = N(RU_X, RY[3], RU_W, 110, "Trends + Activity UI", ["what is hot now"], cat="ui")

k5 = N(CO_X, RY[4], CO_W, 110, "Analytics Consumer",
       ["saves every event as it is", "drops nothing"])
e5 = N(E_X, RY[4], E_W, 110, "HDFS / S3  -  data lake",
       ["years of raw history", "cheap and replayable"], cat="db")
x5 = N(X_X, RY[4], X_W, 110, "Spark Batch Jobs",
       ["who you actually interact with", "runs every night"])

# ============================================================ 8. WIRING
GWR = GW_X + GW_W


def gate(u, s, y, n=None, sw=1):
    pipe([(u.r, y), (GW_X, y)], both=True)
    pipe([(GWR, y), (s.x, y)], both=True, sw=sw)
    if n is not None:
        num(n, GWR + 26, y - 26)


gate(u1, s1, 305, n=14)
gate(u2, s2, 505, n=13)
gate(u3, s3, 705, n=1, sw=2)
gate(u4, s7, 1510, n=9, sw=2)

pipe([(u5.r, 2005), (GW_X, 2005)], both=True)
pipe([(GWR, 1990), (LC, 1990), (LC, 1930), (s9.x, 1930)], both=True)
pipe([(GWR, 2020), (LC, 2020), (LC, 2110), (s10.x, 2110)], both=True)
num(15, 270, 2005)

# read through: service -> redis -> mysql
h_link(s1, r1, af=0.35, both=True)
h_link(r1, d1, af=0.35, bf=0.3, both=True)
h_link(s2, r2, af=0.35, both=True)
h_link(r2, d2, af=0.35, bf=0.3, both=True)

# the post write path
h_link(s3, su, af=0.3, n=3, both=True)
v_link(s3, s4, af=0.25, n=2, sw=2, both=True)
pipe([(s3.r, 735), (RC, 735), (RC, 1065), (s5.r, 1065)], sw=2, both=True)
num(4, RC - 30, 875)
h_link(s4, cdn, af=0.5, both=True)
h_link(cdn, s3b, af=0.5, both=True)
h_link(s5, pc, af=0.5, both=True)


def publish(s, i, n=None, sw=1):
    x = s.x + s.w * 0.85
    pipe([(x, s.b), (x, LANE(i)), (KF_X, LANE(i))], sw=sw)
    if n is not None:
        num(n, x - 34, s.b + 28)


publish(s1, 0)
publish(s2, 1)
publish(s3, 2, n=5, sw=2)
publish(s9, 8)
publish(s10, 9)

# fan-out worker
pipe([(KF_X, LANE(5)), (CC, LANE(5)), (CC, s6.y)], sw=2)
num(6, CC + 34, LANE(5) - 26)
pipe([(s6.x, 1330), (LC, 1330), (LC, 525), (s2.x, 525)], both=True)
num(7, LC - 30, 1286)
h_link(s6, rf, af=0.75, n=8, sw=2)
h_link(s7, at, af=0.5, both=True, sw=2)

# the feed read path
pipe([(rf.x + 60, rf.b), (rf.x + 60, rf.b + 40), (600, rf.b + 40), (600, s7.y)], sw=2)
num(10, rf.x + 92, rf.b + 22)
pipe([(s7.r, 1485), (RC, 1485), (RC, 1200), (600, 1200), (600, s5.b)], sw=2, both=True)
num(11, s7.r + 34, 1461)
pipe([(cdn.x + 30, cdn.b), (cdn.x + 30, 1010), (145, 1010), (145, u4.y)], sw=2)
num(12, 700, 990)

# archiving + engagement
pipe([(s8.r, 1705), (AC, 1705), (AC, s3b.b)])
num(16, s8.r + 30, 1681)
h_link(s9, lk, af=0.5, both=True)
h_link(lk, lc, af=0.5, both=True)
h_link(s10, cm, af=0.5, both=True)


def consume(node, y, n=None):
    pipe([(KF_X + KF_W, y), (node.x, y)])
    if n is not None:
        num(n, node.x - 40, y - 26)


consume(k1, 335, n=17)
h_link(k1, e1)
pipe([(x1.x, 335), (e1.r, 335)], both=True)
pipe([(x1.r, 335), (lb1.x, 335)], both=True)
pipe([(lb1.r, 335), (u6.x, 335)], both=True)
num(18, 2884, 300)

consume(k2, 555, n=19)
h_link(k2, x2)
h_link(x2, r3, both=True)
pipe([(x2.x + x2.w / 2, x2.b), (x2.x + x2.w / 2, 665), (3010, 665), (3010, u7.b)], sw=2)

consume(k3, 775, n=20)
h_link(k3, e3)

consume(k4, 995, n=21)
h_link(k4, e4)
pipe([(x4.x, 995), (e4.r, 995)], both=True)
pipe([(x4.r, 995), (lb2.x, 995)], both=True)
pipe([(lb2.r, 995), (u8.x, 995)], both=True)

consume(k5, 1215, n=22)
h_link(k5, e5)
h_link(e5, x5)

pipe([(x5.r, 1220), (FAR, 1220), (FAR, TOP), (GA, TOP), (GA, 547), (s2.r, 547)], dash="dashed")
num(23, x5.r + 34, 1194)
text(1760, TOP - 26, "23   who you interact with most  +  how strong each follow is   ->   "
                     "goes straight back into the graph and into feed ordering", 12)

# ============================================================ 9. PANELS
FY = 1400
panel(1750, FY, 700, 360, "THE CELEBRITY PROBLEM")
text(1774, FY + 56,
     "a normal user has about 300 followers. copying a new post\n"
     "into 300 feeds is cheap - and the reader then does ONE lookup.\n\n"
     "a celebrity has 50 M followers. copying every post 50 M times\n"
     "would jam the worker and flood the cluster.\n\n"
     "so the Post Processor SKIPS anyone over the line\n"
     "( more than 100 k followers ). nothing is copied for them.\n\n"
     "the Timeline Service then does BOTH things at read time:\n"
     "      the ready made feed        for the ~300 normal follows\n"
     "   +  a live read per celebrity  for the ~50 famous ones\n"
     "      and merges the two lists by time.\n\n"
     "that live read is safe: it is one lookup per celebrity, and\n"
     "50 M readers all hit the same cached copy, not the database.", 13)

panel(2480, FY, 680, 360, "RULES THAT MAKE THIS WORK")
text(2504, FY + 56,
     "1   the same event may arrive twice, so every reader is\n"
     "     built so a repeat changes nothing.\n\n"
     "2   all events of one user go to one partition, so his\n"
     "     events stay in order. Global order is not needed.\n\n"
     "3   nothing scans a table. every read is 'give me this key,\n"
     "     newest 20'. that is why Cassandra and not MySQL.\n\n"
     "4   posting answers as soon as the row is saved. the slow\n"
     "     fan-out happens after, so the poster never waits.\n\n"
     "5   photos and videos never pass through a service. the\n"
     "     phone uploads to S3 and reads back from the CDN.\n\n"
     "6   a feed is capped at 800 entries. rows that grow\n"
     "     forever are how these systems actually die.", 13)

panel(1750, 1810, 1410, 280, "THE WHOLE THING IN ONE BREATH")
text(1774, 1866,
     "WRITE     you post  ->  Ingestion saves the row and the media  ->  it drops one event on Kafka  ->  it answers you\n"
     "               ->  Post Processor picks the event up  ->  asks Graph who follows you\n"
     "               ->  writes your post into each follower's ready made feed  ->  skips you if you are famous\n\n"
     "READ      a follower opens the app  ->  Timeline Service reads that ready made feed  (one lookup)\n"
     "               ->  adds the newest posts of the few celebrities they follow  ->  merges by time  ->  20 posts back\n"
     "               ->  the photos in those posts come straight from the CDN, not from us\n\n"
     "AFTER     the same Kafka event also feeds search, notifications, activity, trends and the nightly jobs.\n"
     "               none of them can slow the poster down, and any of them can be down without breaking posting.", 13)

# ============================================================ 10. THE FLOW
FLY = 2320
panel(40, FLY, 3120, 470, "THE FLOW  -  what every numbered arrow is")
_flow = [
 ("1",  "Create Post UI  ->  gateway  ->  Post Ingestion",
        "the gateway checks who you are and slows down abusers"),
 ("2",  "Post Ingestion  ->  Asset Service",
        "gives back an upload link, the phone sends the file to S3 itself"),
 ("3",  "Post Ingestion  ->  Short URL Service",
        "every link in the post becomes 7 characters"),
 ("4",  "Post Ingestion  ->  Post Service  ->  Cassandra",
        "the post row is saved before anything else happens"),
 ("5",  "Post Ingestion  ->  Kafka, then answers you",
        "your request ends here - the copying is somebody else's job"),
 ("6",  "Post Processor reads the new post event",
        "many workers share the load, add more to go faster"),
 ("7",  "Post Processor asks Graph Service who follows you",
        "the list is cached; a celebrity comes back as a flag instead"),
 ("8",  "Post Processor writes into every follower's feed",
        "into Redis for speed and Cassandra so it survives a restart"),
 ("9",  "Feed Screen  ->  gateway  ->  Timeline Service",
        "asks for 20 posts and a cursor, never a page number"),
 ("10", "Timeline Service reads the ready made feed",
        "Redis first, Cassandra behind it - both are single lookups"),
 ("11", "Timeline Service also pulls celebrity posts live",
        "these were never copied, so they are fetched and merged now"),
 ("12", "photos and videos load straight from the CDN",
        "our services only ever move ids and text"),
 ("13", "Follow UI  ->  Graph Service  ->  Redis  ->  MySQL",
        "the edge is saved both ways, then an event goes on Kafka"),
 ("14", "Login  ->  User Service  ->  Redis  ->  MySQL",
        "the only part of the system that must be exactly right"),
 ("15", "Like / Comment  ->  their services  ->  Cassandra",
        "count in Redis, the truth in Cassandra, event on Kafka"),
 ("16", "Archival Cron moves 90 day old posts to S3",
        "keeps the live tables small so reads stay fast"),
 ("17", "Search Consumer sends every new post to the index",
        "search being 2 seconds behind is fine, search being down is not"),
 ("18", "Search Screen  ->  LB  ->  Search Service  ->  index",
        "the same popular searches are answered from cache"),
 ("19", "Notification Consumer  ->  WebSocket Gateway  ->  you",
        "Redis says which gateway is holding your connection"),
 ("20", "Activity Tracker saves what you opened and read",
        "this is the signal that decides feed order later"),
 ("21", "Spark Streaming counts hashtags  ->  Redis  ->  Trends",
        "a fresh count every 5 minutes, read with one call"),
 ("22", "Analytics Consumer saves every raw event to the lake",
        "cheap storage, kept for years, can be replayed"),
 ("23", "the nightly jobs feed their result back into ranking",
        "how close you are to each person changes your feed order"),
]
for i, (n, what, detail) in enumerate(_flow):
    col, rowi = i // 8, i % 8
    bx = 70 + col * 1035
    by = FLY + 56 + rowi * 49
    num(int(n), bx + 14, by + 12)
    text(bx + 38, by, what, 13)
    text(bx + 38, by + 20, detail, 11)

# ============================================================ OUT
doc = {"type": "excalidraw", "version": 2, "source": "build_social_hld.py",
       "elements": ELS, "appState": {"viewBackgroundColor": "#ffffff",
                                     "gridSize": None}, "files": {}}
with open("social-media-hld.excalidraw", "w") as f:
    json.dump(doc, f, indent=1)
print(f"{len(ELS)} elements -> social-media-hld.excalidraw")
