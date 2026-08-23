#!/usr/bin/env python3
"""ONE Uber diagram: high level + the deep-dive bits that matter.

Deliberately small - this is what you can actually draw in a 30 minute
interview. Structure copied from the reference sketch, with the Redis lock
sitting between the matcher and the drivers, and no ZooKeeper.
"""
import json, random, itertools

INK = "#1e1e1e"
SEQ = itertools.count(1)
ELS = []


def _b(kind, x, y, w, h, **kw):
    return {"id": kw.pop("id", f"h{next(SEQ)}"), "type": kind, "x": x, "y": y,
            "width": w, "height": h, "angle": 0, "strokeColor": INK,
            "backgroundColor": "transparent", "fillStyle": "solid",
            "strokeWidth": kw.pop("sw", 1), "strokeStyle": kw.pop("dash", "solid"),
            "roughness": 1, "opacity": 100, "groupIds": [], "frameId": None,
            "seed": random.randint(1, 2 ** 31), "version": 100,
            "versionNonce": random.randint(1, 2 ** 31), "isDeleted": False,
            "boundElements": [], "updated": 1787160000000, "link": None,
            "locked": False, **kw}


def text(x, y, s, fs=12, font=6):
    lines = s.split("\n")
    w = max(len(l) for l in lines) * fs * (0.60 if font == 3 else 0.52)
    e = _b("text", x, y, w, len(lines) * fs * 1.25, text=s, originalText=s,
           fontSize=fs, fontFamily=font, textAlign="left", verticalAlign="top",
           containerId=None, autoResize=True, lineHeight=1.25, roundness=None)
    ELS.append(e)
    return e


def _shape(kind, x, y, w, h, sw=1):
    e = _b(kind, x, y, w, h, sw=sw,
           roundness={"type": 2 if kind == "ellipse" else 3})
    ELS.append(e)
    return e


class N:
    """Box + centred title + body lines. Knows its own edges."""

    def __init__(self, x, y, w, h, title, body="", kind="rectangle", sw=1, fs=13):
        self.x, self.y, self.w, self.h = x, y, w, h
        _shape(kind, x, y, w, h, sw)
        tw = len(title) * fs * 0.52
        pad = 14 if kind == "rectangle" else h * 0.22
        text(x + (w - tw) / 2, y + pad, title, fs)
        if body:
            bw = max(len(l) for l in body.split("\n")) * 11 * 0.52
            text(x + (w - bw) / 2, y + pad + fs * 1.7, body, 11)

    @property
    def r(self): return self.x + self.w
    @property
    def b(self): return self.y + self.h
    def rp(self, f=0.5): return (self.r, self.y + self.h * f)
    def lp(self, f=0.5): return (self.x, self.y + self.h * f)
    def tp(self, f=0.5): return (self.x + self.w * f, self.y)
    def bp(self, f=0.5): return (self.x + self.w * f, self.b)


def arrow(pts, dash="solid", head="arrow", both=False):
    x0, y0 = pts[0]
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    e = _b("arrow", x0, y0, max(xs) - min(xs), max(ys) - min(ys), dash=dash,
           points=[[p[0] - x0, p[1] - y0] for p in pts], startBinding=None,
           endBinding=None, startArrowhead="arrow" if both else None,
           endArrowhead=head, elbowed=False, roundness=None)
    ELS.append(e)
    return e


def link(a, b, label="", af=0.5, bf=0.5, side="r", dash="solid", both=False, ly=-20):
    """Edge to edge, routed through the empty gutter between two columns."""
    ax, ay = (a.rp(af) if side == "r" else a.lp(af))
    bx, by = (b.lp(bf) if side == "r" else b.rp(bf))
    gx = (ax + bx) / 2
    pts = [(ax, ay), (bx, by)] if abs(ay - by) < 4 else [(ax, ay), (gx, ay), (gx, by), (bx, by)]
    arrow(pts, dash=dash, both=both)
    if label:
        lw = max(len(l) for l in label.split("\n")) * 10 * 0.52
        text(gx - lw / 2, min(ay, by) + abs(ay - by) / 2 + ly, label, 10)


def vlink(a, b, label="", af=0.5, bf=0.5, dash="solid"):
    ax, ay = a.bp(af)
    bx, by = b.tp(bf)
    arrow([(ax, ay), (ax, (ay + by) / 2), (bx, (ay + by) / 2), (bx, by)], dash=dash)
    if label:
        text(max(ax, bx) + 10, (ay + by) / 2 - 14, label, 10)


# ---------------------------------------------------------------- layout
CL, GW, SV, MD, DB, EN = 40, 380, 720, 1160, 1560, 1880

text(CL, 0, "Design Uber  -  High Level Design  +  Deep Dive", 26)
text(CL, 44, "one diagram: the request path, the Redis driver lock that stops double booking, "
             "and how the thundering herd is contained.", 12)

# clients
rider = N(CL, 200, 210, 100, "Rider Client", "iOS / Android")
driver = N(CL, 620, 210, 100, "Driver Client", "iOS / Android")

gw = N(GW, 180, 210, 420, "API GATEWAY\n+ LB")
text(GW + 24, 300, "- routing\n- authentication\n- rate limiting\n- accept / deny\n  comes back here", 11)

# services
ride = N(SV, 160, 300, 150, "Ride Service")
text(SV + 22, 200, "- fare estimation\n- creates the ride row\n- triggers the matching\n  workflow", 11)

match = N(SV, 380, 300, 175, "Ride Matching Service", sw=2)
text(SV + 22, 424, "- picks the closest drivers\n- takes the Redis lock on\n  ONE driver at a time\n"
                   "- CAS on the ride row when\n  the driver accepts", 11)

loc = N(SV, 620, 300, 110, "Location Service", "updateLocation() every 4 s")

notif = N(SV, 790, 300, 100, "Notification Service", "APN  /  FCM push")

# middle: external, queue, lock, geo store
mapsvc = N(MD, 20, 260, 90, "3rd Party Map Svc", "distance + real ETA")
queue = N(MD, 200, 260, 70, "Match Queue", "one job per ride request")

lock = N(MD, 330, 260, 175, "REDIS  -  DRIVER LOCK", sw=2)
text(MD + 18, 372, "SET lock:driver:{id} <tok>\n           NX PX 10000", 11, font=3)
text(MD + 18, 412, "OK   -> he is mine for 10 s\nnil  -> already offered,\n           take the next driver", 11)

geo = N(MD, 580, 260, 130, "Location DB  -  REDIS", "driver lat / lng per cell\nGEOSEARCH, TTL 30 s")

# store + entities
db = N(DB, 200, 240, 150, "DB", "Postgres\nstores Ride + Fare", kind="ellipse")

text(EN, 190, """Ride                          Fare
- rideId                     - fareId
- riderId, driverId     - source, destination
- source, destination - price, eta
- status REQUESTED  - surge_x
     ACCEPTED
     STARTED | ENDED    Rider / Driver
- req_token                - id, name
     (fencing token)       - vehicle, rating""", 12)

# ---------------------------------------------------------------- arrows
link(rider, gw, "getFareEstimate()", af=0.3, bf=0.15)
link(rider, gw, "requestRide()", af=0.75, bf=0.35, ly=4)
link(gw, ride, "route", af=0.12, bf=0.4)
link(ride, mapsvc, "distance + ETA", af=0.25, bf=0.6)
arrow([(SV + 300, 285), (DB, 285)])
text(1030, 262, "write fare + ride row", 10)
link(ride, queue, "enqueue the match job", af=0.85, bf=0.5)
link(queue, match, "consume", af=0.5, bf=0.15, side="l")
link(match, lock, "SET NX PX 10 s", af=0.25, bf=0.35)
link(lock, match, "nil / expired -> next driver", af=0.85, bf=0.8, side="l", dash="dashed", ly=-30)
link(match, geo, "fetch closest drivers", af=0.62, bf=0.25, ly=18)
arrow([(SV + 300, 546), (1470, 546), (1470, 327), (DB, 327)])
text(1180, 552, "CAS  REQUESTED -> ACCEPTED", 10)
arrow([(SV, 500), (660, 500), (660, 840), (SV, 840)])
text(600, 660, "offer ONE\ndriver", 10)
arrow([(SV, 840), (CL + 105, 840), (CL + 105, 720)])
text(CL + 130, 846, "push: accept or decline this ride ?", 10)
link(driver, gw, "acceptOrDeclineRide()", af=0.3, bf=0.72)
link(driver, gw, "updateLocation()", af=0.7, bf=0.9, ly=4)
link(gw, match, "the answer never goes\nstraight to the matcher", af=0.62, bf=0.55)
link(gw, loc, "route", af=0.92, bf=0.5)
link(loc, geo, "GEOADD + TTL 30 s", af=0.5, bf=0.55)

# ---------------------------------------------------------------- notes
NY = 990
n1 = N(CL, NY, 640, 300, "WHY THE REDIS LOCK", sw=2)
text(CL + 20, NY + 46, """the lock is per DRIVER, not per ride:
one driver can only ever hold ONE live offer.

SET .. NX PX 10000        take him for 10 s
Lua compare-and-delete     release him safely
  (a plain DEL could wipe a lock that already
   expired and was handed to another request)

the TTL is the crash plan: if the matcher dies,
the key expires and the driver frees himself.

the lock alone is not enough - two drivers can
still both tap accept, so the ride row decides:
UPDATE ride SET driver_id=$1, status='ACCEPTED'
 WHERE ride_id=$2 AND status='REQUESTED'
  -> 1 row = winner,  0 rows = too late""", 11)

n2 = N(720, NY, 700, 300, "THUNDERING HERD  -  and what stops it", sw=2)
text(740, NY + 46, """1  OFFER HERD - broadcast a ride to 10 drivers and five accept.
    Fix: lock per driver + the CAS above. Only one UPDATE returns a row.

2  RECONNECT STORM - a deploy drops every websocket and all 1M drivers
    reconnect in the same second.
    Fix: jittered backoff, drain slowly, roll out city by city.

3  HOT CELL - the airport is one Redis key on one shard.
    Fix: sub-shard it, cell:{id}:{0..N} - write to one, read all N.

4  RETRY STORM - the matcher slows, clients retry, load triples.
    Fix: backoff + jitter, retry budget, circuit breaker, shed at the gateway.""", 11)

n3 = N(1440, NY, 460, 300, "THE FLOW IN ONE BREATH", sw=2)
text(1460, NY + 46, """fare quote  ->  rider accepts the price
  ->  ride row REQUESTED
  ->  match job on the queue
  ->  matcher reads the closest drivers
  ->  locks driver #1 for 10 s
  ->  push offer to that one driver
  ->  no answer in 10 s ?  lock expires,
        offer driver #2
  ->  accept ?  CAS the ride row, release
        the lock, tell the rider
  ->  driver location keeps streaming
        into Redis for the next search""", 11)

# ---------------------------------------------------------------- merge
OX, OY = 5800, 5150
for e in ELS:
    e["x"] += OX
    e["y"] += OY

DST = "/home/charles/Documents/Codes/Learning/SystemDesign/HLD/Design Uber/uber.excalidraw"
raw = open(DST).read()
old = json.loads(raw[raw.index("{"):])
kept = []
for e in old["elements"]:
    if e.get("isDeleted"):
        continue
    if e["y"] >= OY - 50:            # this panel, regenerated every run
        continue
    if e["x"] >= 6400 and e["y"] >= 4560:   # the old separate HLD sketch
        continue
    kept.append(e)
doc = {"type": "excalidraw", "version": 2, "source": "https://excalidraw.com",
       "elements": kept + ELS,
       "appState": {"gridSize": 20, "gridStep": 5, "gridModeEnabled": False,
                    "viewBackgroundColor": "#ffffff"},
       "files": {}}
json.dump(doc, open(DST, "w"))
print("kept", len(kept), "new", len(ELS), "total", len(doc["elements"]))
