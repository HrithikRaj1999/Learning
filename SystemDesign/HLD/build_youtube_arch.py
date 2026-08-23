#!/usr/bin/env python3
"""Rebuild the YouTube HLD as ONE column-aligned architecture panel.

Style is copied from Design Ecommerce Website/Untitled-2026-03-12-2211.excalidraw:
transparent fills, #1e1e1e stroke, strokeWidth 1, roughness 1, fontFamily 6,
free-floating labels (no bound text), unbound arrows with explicit points.

Layout contract (this is the thing that was broken before):
  CLIENT | GATEWAY | SERVICES | CACHE / QUEUE | DATABASES | SCHEMA | RULES
one row per service, and that row runs straight across to its store and schema.
"""
import json, random, itertools

STROKE = "#1e1e1e"
_seq = itertools.count(1)


def _base(kind, x, y, w, h, **kw):
    return {
        "id": kw.pop("id", f"y{next(_seq)}"),
        "type": kind, "x": x, "y": y, "width": w, "height": h, "angle": 0,
        "strokeColor": STROKE, "backgroundColor": "transparent", "fillStyle": "solid",
        "strokeWidth": 1, "strokeStyle": kw.pop("dash", "solid"), "roughness": 1,
        "opacity": 100, "groupIds": [], "frameId": None,
        "seed": random.randint(1, 2 ** 31), "version": 100,
        "versionNonce": random.randint(1, 2 ** 31), "isDeleted": False,
        "boundElements": [], "updated": 1786600000000, "link": None, "locked": False,
        **kw,
    }


ELS = []


def rect(x, y, w, h, r=3):
    e = _base("rectangle", x, y, w, h, roundness={"type": r} if r else None)
    ELS.append(e)
    return e


def ellipse(x, y, w, h):
    e = _base("ellipse", x, y, w, h, roundness={"type": 2})
    ELS.append(e)
    return e


CHAR_W = 0.52  # rough advance width for fontFamily 6


def text(x, y, s, fs=12, align="left"):
    lines = s.split("\n")
    w = max(len(l) for l in lines) * fs * CHAR_W
    h = len(lines) * fs * 1.25
    e = _base("text", x, y, w, h, text=s, originalText=s, fontSize=fs, fontFamily=6,
              textAlign="left", verticalAlign="top", containerId=None,
              autoResize=True, lineHeight=1.25, roundness=None)
    ELS.append(e)
    return e


def centered(box, s, fs=12, dy=None):
    """Free-floating label centred inside a shape."""
    lines = s.split("\n")
    w = max(len(l) for l in lines) * fs * CHAR_W
    h = len(lines) * fs * 1.25
    x = box["x"] + (box["width"] - w) / 2
    y = box["y"] + (box["height"] - h) / 2 if dy is None else box["y"] + dy
    return text(x, y, s, fs)


def arrow(pts, dash="solid", head="arrow"):
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    x0, y0 = pts[0]
    e = _base("arrow", x0, y0, max(xs) - min(xs), max(ys) - min(ys),
              dash=dash, points=[[p[0] - x0, p[1] - y0] for p in pts],
              startBinding=None, endBinding=None, startArrowhead=None,
              endArrowhead=head, elbowed=False, roundness=None)
    ELS.append(e)
    return e


def label(x, y, s, fs=11):
    return text(x, y, s, fs)


# ---------------------------------------------------------------- columns
CL_X, CL_W = 60, 210
GW_X, GW_W = 340, 230
SV_X, SV_W = 690, 250
MD_X, MD_W = 1080, 250
DB_X, DB_W = 1470, 250
SC_X, SC_W = 1830, 330
RU_X = 2220
BOX_H = 70

R = {"upload": 200, "bytes": 330, "video": 460, "search": 590, "view": 720,
     "kafka": 850, "orch": 1020, "chunk": 1150, "trans": 1280, "pack": 1410,
     "index": 1540}
CY = {k: v + BOX_H / 2 for k, v in R.items()}
CY["kafka"] = R["kafka"] + 45

# ---------------------------------------------------------------- titles
text(CL_X, 8, "YouTube  -  Detailed Architecture", 24)
text(CL_X, 46, "one row per service:   service  ->  cache / queue  ->  store  ->  schema", 12)
text(SV_X + 60, 122, "SERVICES", 16)
text(MD_X + 15, 122, "CACHE / QUEUE / OBJECT", 16)
text(DB_X + 55, 122, "DATABASES", 16)
text(SC_X + 110, 122, "SCHEMA", 16)

# ---------------------------------------------------------------- left column
client = rect(CL_X, R["video"] - 10, CL_W, 100)
centered(client, "Client\nbrowser / app", 13)

gateway = rect(GW_X, R["video"] - 30, GW_W, 140)
centered(gateway, "API GATEWAY\n- routing\n- JWT -> userId\n- rate limiting", 13)

sweeper = rect(CL_X, R["pack"], CL_W, 100)
centered(sweeper, "Sweeper cron\nevery 10 min", 13)
text(CL_X - 6, R["pack"] + 112,
     "the safety net for abandoned uploads:\nno client, no callback, just reconciliation", 10)

# ---------------------------------------------------------------- services
svc = {}


def service(key, title, sub, h=BOX_H):
    b = rect(SV_X, R[key], SV_W, h)
    centered(b, title + ("\n" + sub if sub else ""), 13)
    svc[key] = b
    return b


service("upload", "Upload Service", "initiate / sign / complete")
service("video", "Video Service", "metadata read + write")
service("search", "Search Service", "read side only")
service("view", "View Service", "fire and forget")
kafka = rect(SV_X, R["kafka"], SV_W, 90)
centered(kafka, "KAFKA", 14, dy=13)
text(SV_X + 18, R["kafka"] + 44, "video.uploaded | video.ready | view.events", 9)
service("orch", "Orchestrator", "builds the task DAG")
service("chunk", "Chunker", "aligned 10 s segments")
text(SV_X + 24, R["chunk"] + 86, "reads raw.mp4 straight from S3 RAW", 9)
service("trans", "Transcoder pool", "240 / 480 / 720 / 1080 / 4K")
service("pack", "Packager", "HLS master + index")
service("index", "Search Indexer", "consumer, never dual-write")

# ---------------------------------------------------------------- mid column
s3raw = ellipse(MD_X, R["bytes"] - 10, MD_W, 95)
centered(s3raw, "S3  RAW bucket\nmultipart -> Glacier 30 d", 12)

redis_meta = ellipse(MD_X, R["video"] - 10, MD_W, 95)
centered(redis_meta, "REDIS\n60 s cache, single-flight", 12)

redis_cnt = ellipse(MD_X, R["view"] - 10, MD_W, 95)
centered(redis_cnt, "REDIS counter\nINCR view:videoId", 12)

flink = rect(MD_X, R["kafka"] + 10, MD_W, BOX_H)
centered(flink, "Flink\ndedupe, watched > 30 s", 12)

s3proc = ellipse(MD_X, R["trans"] - 20, MD_W, 110)
centered(s3proc, "S3  PROCESSED\nchunks + manifests\nnever read by the app", 12)

# ---------------------------------------------------------------- db column
job_db = ellipse(DB_X, R["upload"] - 10, DB_W, 95)
centered(job_db, "upload_job DB\nTHE ONLY CP STORE", 12)

video_db = ellipse(DB_X, R["video"] - 10, DB_W, 95)
centered(video_db, "Video Metadata DB\nprimary + read replica", 12)

es = ellipse(DB_X, R["search"] - 10, DB_W, 95)
centered(es, "Elasticsearch\ntitle / desc / channel", 12)

cass = ellipse(DB_X, R["view"] - 10, DB_W, 95)
centered(cass, "Cassandra\nhourly rollup", 12)


# ---------------------------------------------------------------- schema column
def schema(y, h, body):
    rect(SC_X, y, SC_W, h)
    text(SC_X + 18, y + 12, body, 11)


schema(R["upload"] - 40, 130,
       "upload_job\n- video_id, s3_upload_id\n- idempotency_key\n- total_parts / done_tasks / total_tasks\n- state PENDING | COMPLETE | ABORTED")
schema(R["video"] - 30, 145,
       "video\n- id, title, description\n- status INITIATED | UPLOADED |\n     TRANSCODING | READY | FAILED\n- raw_s3_key      videos/vid_9f2a/raw.mp4\n- manifest_path  vid_9f2a/master.m3u8")
schema(R["search"] - 10, 95,
       "es_doc\n- video_id\n- title, description, channel, tags")
schema(R["view"] - 10, 95,
       "view_count\n- video_id, hour_bucket\n- count")
schema(R["kafka"] - 10, 120,
       "kafka topics   (key = videoId)\n- video.uploaded   bytes are safe\n- video.ready         playable\n- view.events        heartbeat / 10 s")
schema(R["chunk"] - 30, 120,
       "fan-out math\n60 segments x 5 renditions\n= ~300 idempotent tasks\nspot instances, retry cost = 3 s")
schema(R["pack"] - 30, 180,
       "S3 PROCESSED layout\nvid_9f2a/master.m3u8\nvid_9f2a/720p/index.m3u8\nvid_9f2a/720p/seg_0001.ts\n\nread time URL =\nCDN_DOMAIN + \"/\" + manifest_path")

# ---------------------------------------------------------------- rules panel
text(RU_X, 165, """RULES THAT MAKE THIS CORRECT

1  Bucket state is the source of truth, not the DB row.
    object-created fires -> the DB row follows.
2  The server never touches video bytes. The client
    PUTs parts straight to S3 with pre-signed URLs.
3  upload_job DB is the only CP store. Every other
    store on this canvas is AP.
4  Never dual-write DB + Elasticsearch. ES is fed
    from video.ready, after the row already says READY.
5  Transcode is async. A dead worker only grows the
    Kafka backlog, it never fails an upload.
6  Every transcode task is idempotent, keyed by
    (videoId, segment, rendition). Retry is free.
7  Read path is Redis 60 s + read replica. Never primary.
8  manifest_path is stored RELATIVE. The CDN domain is
    added at read time -> swapping CDN = 1 env var.
9  Adaptive bitrate is client-driven. Same segment
    number, different rendition folder.
10 View count is fire and forget, eventually consistent.

WHAT THE OLD DIAGRAM GOT WRONG   (shape, not facts)

x  10 disconnected strips     ->  one system, one canvas
x  Kafka drawn three times    ->  one broker, three topics
x  no store column                ->  every service lands on
                                                its own row
x  schema floating far off      ->  schema sits on the row
                                                of its owner service""", 12)

# ---------------------------------------------------------------- arrows
# entry fan-out
arrow([(270, 500), (340, 500)])
label(272, 462, "1 | W1\nS1 | V1", 9)
arrow([(570, 470), (690, 245)])
label(584, 350, "2  route", 10)
arrow([(570, 500), (690, 495)])
label(600, 470, "W2", 10)
arrow([(570, 520), (690, 625)])
label(600, 556, "S2", 10)
arrow([(570, 540), (690, 755)])
label(578, 650, "V2", 10)

# upload row
arrow([(940, 235), (1470, 235)])
label(1006, 208, "3  video row (INITIATED) + upload_job   (S3 CreateMultipartUpload)", 10)
arrow([(940, 252), (1140, 322)])
label(706, 280, "4  pre-signed part URLs", 9)
arrow([(165, 450), (165, 75), (1205, 75), (1205, 320)], dash="dashed")
label(600, 44, "5  PUT 5 MB parts DIRECT to S3   -   the server is bypassed, it never sees a video byte", 11)
arrow([(1080, 367), (1010, 367), (1010, 895), (940, 895)], dash="dashed")
label(1016, 560, "6  object-created\n     bucket state = source of truth", 10)

# metadata read row
arrow([(940, 495), (1080, 495)])
label(946, 468, "W3  60 s cache", 9)
arrow([(1330, 495), (1470, 495)])
label(1334, 468, "W4  miss -> replica", 9)

# search row
arrow([(940, 625), (1470, 625)])
label(1060, 598, "S3  read side, ES only", 10)

# view row
arrow([(815, 790), (815, 850)])
label(825, 806, "V3  view.events", 10)
arrow([(940, 895), (1080, 895)])
label(962, 868, "V4  consume", 9)
arrow([(1205, 860), (1205, 810)])
label(1216, 822, "V5  INCR", 9)
arrow([(1330, 757), (1470, 757)])
label(1334, 730, "V6  hourly rollup", 9)

# transcode chain
arrow([(815, 940), (815, 1020)])
label(825, 966, "7  video.uploaded", 10)
arrow([(815, 1090), (815, 1150)])
label(825, 1106, "8  build the DAG", 10)
arrow([(815, 1220), (815, 1280)])
label(825, 1252, "9  ~300 idempotent tasks", 10)
arrow([(815, 1350), (815, 1410)])
label(825, 1366, "11  done_tasks == total_tasks", 10)
arrow([(940, 1315), (1080, 1315)])
label(944, 1288, "10  write .ts chunks", 9)
arrow([(940, 1430), (1100, 1374)])
label(946, 1442, "12  master.m3u8 + index.m3u8", 9)
arrow([(690, 1425), (630, 1425), (630, 885), (690, 885)])
label(470, 1050, "13  video.ready", 10)
arrow([(690, 912), (600, 912), (600, 1575), (690, 1575)])
label(330, 1592, "15  same topic, second consumer", 10)
arrow([(940, 1575), (1400, 1575), (1400, 640), (1470, 637)])
label(1130, 1592, "14  index AFTER ready", 10)

# store -> schema
for _y in (225, 502, 627, 757):
    arrow([(1720, _y), (1830, _y)])

# sweeper safety net
arrow([(270, 1502), (1430, 1502), (1430, 237), (1470, 237)], dash="dashed")
label(286, 1472, "0a  scan state=PENDING > 24 h    0b  S3 ListParts    0c  complete or abort", 10)

# ---------------------------------------------------------------- playback plane
text(CL_X, 1656, "PLAYBACK PLANE   -   100 PB/day, and no server sits on this path", 13)
player = rect(CL_X, 1700, CL_W, 80)
centered(player, "Client player\nHLS", 13)
edge = rect(GW_X, 1700, GW_W, 80)
centered(edge, "CDN edge\n~95 % hit, TTL 1 year", 13)
shield = rect(SV_X, 1700, SV_W, 80)
centered(shield, "CDN shield\ncollapses 10^4 misses -> 1", 12)
arrow([(270, 1740), (340, 1740)])
label(276, 1712, "W6", 10)
arrow([(570, 1740), (690, 1740)])
label(578, 1712, "W7  edge miss", 10)
arrow([(940, 1725), (1150, 1376)])
label(1004, 1638, "W8  shield miss -> origin, < 1 %", 10)
text(CL_X, 1812,
     "W5  Video Service already returned CDN_DOMAIN + \"/\" + manifest_path  (~1 KB of JSON) - that is the server's entire job on watch.", 11)
text(CL_X, 1840,
     "ADAPTIVE BITRATE is client-driven: the player measures throughput and pulls the next chunk from a different rendition folder.\nSame segment number, different folder -> seamless switch. The server is never asked.", 11)

# ---------------------------------------------------------------- merge
OX, OY = 7400, 3120
for e in ELS:
    e["x"] += OX
    e["y"] += OY

SRC = "/home/charles/Documents/Codes/Learning/SystemDesign/HLD/HLD youtube.BACKUP.excalidraw"
DST = "/home/charles/Documents/Codes/Learning/SystemDesign/HLD/HLD youtube.excalidraw"
doc = json.load(open(SRC))
keep = []
for e in doc["elements"]:
    if e.get("isDeleted"):
        continue
    if e["type"] == "image":
        e["x"], e["y"] = 7400, 5250
        keep.append(e)
        continue
    if e["x"] >= 7400 and e["y"] >= 3100:
        continue
    keep.append(e)
doc["elements"] = keep + ELS
json.dump(doc, open(DST, "w"))
print("kept", len(keep), "new", len(ELS), "total", len(doc["elements"]))
