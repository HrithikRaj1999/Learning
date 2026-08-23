#!/usr/bin/env python3
"""
System Design Interview Ready Diagram Generator for Device Telemetry Platform HLD.
Generates telemetry-hld.excalidraw with rich visual layout, color coding, bullet points,
clean flow arrows, and interview callout cards.
"""

import json
import random

INK = "#0f172a"
ELS = []
SEQ_ID = 0

def get_id():
    global SEQ_ID
    SEQ_ID += 1
    return f"elem_{SEQ_ID:05d}"

def base_elem(kind, x, y, w, h, **kw):
    return {
        "id": get_id(),
        "type": kind,
        "x": x,
        "y": y,
        "width": w,
        "height": h,
        "angle": 0,
        "strokeColor": kw.get("stroke", INK),
        "backgroundColor": kw.get("fill", "transparent"),
        "fillStyle": kw.get("fs", "solid"),
        "strokeWidth": kw.get("sw", 2),
        "strokeStyle": kw.get("dash", "solid"),
        "roughness": kw.get("rough", 0),
        "opacity": 100,
        "groupIds": [],
        "frameId": None,
        "roundness": kw.get("roundness", {"type": 3}),
        "seed": random.randint(1, 2**31),
        "version": 100,
        "versionNonce": random.randint(1, 2**31),
        "isDeleted": False,
        "boundElements": [],
        "updated": 1787160000000,
        "link": None,
        "locked": False,
    }

def rect(x, y, w, h, stroke=INK, fill="transparent", sw=2, dash="solid", rough=0, roundness=3):
    r_obj = {"type": roundness} if roundness is not None else None
    e = base_elem("rectangle", x, y, w, h, stroke=stroke, fill=fill, sw=sw, dash=dash, rough=rough, roundness=r_obj)
    ELS.append(e)
    return e

def text(x, y, s, fontSize=12, fontFamily=2, col=INK, textAlign="left"):
    lines = s.split("\n")
    max_w = max(len(l) for l in lines) * fontSize * 0.55 if lines else fontSize
    h = len(lines) * fontSize * 1.3
    e = base_elem("text", x, y, max_w, h, stroke=col, fill="transparent")
    e.update({
        "text": s,
        "originalText": s,
        "fontSize": fontSize,
        "fontFamily": fontFamily,
        "textAlign": textAlign,
        "verticalAlign": "top",
        "containerId": None,
        "autoResize": True,
        "lineHeight": 1.3,
        "roundness": None
    })
    ELS.append(e)
    return e

def line(p, q, stroke="#475569", sw=2, dash="solid", label="", both=False):
    dx = q[0] - p[0]
    dy = q[1] - p[1]
    e = base_elem("arrow", p[0], p[1], dx, dy, stroke=stroke, sw=sw, dash=dash, rough=0, roundness={"type": 2})
    e.update({
        "points": [[0, 0], [dx, dy]],
        "startBinding": None,
        "endBinding": None,
        "startArrowhead": "arrow" if both else None,
        "endArrowhead": "arrow",
        "elbowed": False
    })
    ELS.append(e)
    if label:
        lx = p[0] + dx * 0.5 - len(label) * 3
        ly = p[1] + dy * 0.5 - 14
        text(lx, ly, label, fontSize=10, fontFamily=3, col=stroke, textAlign="center")

def group_frame(x, y, w, h, title, stroke="#64748b", fill="#f8fafc"):
    rect(x, y, w, h, stroke=stroke, fill=fill, sw=1.5, dash="dashed", rough=0, roundness=3)
    text(x + 14, y + 10, title, fontSize=13, fontFamily=2, col=stroke)

def card(x, y, w, h, title, bullets=(), stroke="#334155", fill="#ffffff", title_color="#0f172a", title_size=13, bullet_size=11):
    rect(x, y, w, h, stroke=stroke, fill=fill, sw=2, dash="solid", rough=0, roundness=3)
    curr_y = y + 12
    text(x + 14, curr_y, title, fontSize=title_size, fontFamily=2, col=title_color)
    curr_y += title_size * 1.45
    if bullets:
        b_text = "\n".join("• " + b for b in bullets)
        text(x + 14, curr_y, b_text, fontSize=bullet_size, fontFamily=2, col="#1e293b")

class NodeBox:
    def __init__(self, x, y, w, h, title, subtitle="", bullets=(), stroke="#2563eb", fill="#dbeafe", title_color="#0f172a", title_size=13, bullet_size=11, sw=2):
        self.x, self.y, self.w, self.h = x, y, w, h
        rect(x, y, w, h, stroke=stroke, fill=fill, sw=sw, dash="solid", rough=0, roundness=3)
        curr_y = y + 10
        text(x + 12, curr_y, title, fontSize=title_size, fontFamily=2, col=title_color)
        curr_y += title_size * 1.35
        if subtitle:
            text(x + 12, curr_y, subtitle, fontSize=bullet_size - 1, fontFamily=3, col="#475569")
            curr_y += (bullet_size - 1) * 1.35
        if bullets:
            curr_y += 3
            bullet_str = "\n".join("• " + b for b in bullets)
            text(x + 12, curr_y, bullet_str, fontSize=bullet_size, fontFamily=2, col="#0f172a")

    @property
    def r(self): return self.x + self.w
    @property
    def b(self): return self.y + self.h
    def rp(self, f=0.5): return (self.r, self.y + self.h * f)
    def lp(self, f=0.5): return (self.x, self.y + self.h * f)
    def tp(self, f=0.5): return (self.x + self.w * f, self.y)
    def bp(self, f=0.5): return (self.x + self.w * f, self.b)

def build_diagram():
    # ------------------------------------------------------------------ TOP BANNER / ESSENTIALS
    card(40, 40, 830, 230,
         "1. SYSTEM OBJECTIVE & SCALE CONSTRAINTS",
         bullets=[
             "Target Scale: 100M IoT Agents | 1 Snapshot / 30s | 3.3M msgs/sec sustained (6.6M peak)",
             "Volume: 288 Billion events/day | 230 TB/day raw payload | 15 TB/day compressed audit lake",
             "Traffic Ratio: 3,300 : 1 (WRITE HEAVY) -> Must count on write, zero scans on read path",
             "SLA Commitments: Ingest Ack < 30ms | Dashboard Read < 200ms p95 | Visibility < 20s"
         ],
         stroke="#0f172a", fill="#ffffff", title_color="#0f172a", title_size=14, bullet_size=11.5)

    card(890, 40, 830, 230,
         "2. CORE SYSTEM DESIGN STRATEGY",
         bullets=[
             "Count-on-Write Architecture: Metrics pre-aggregated into Redis & ClickHouse at ingest",
             "Delta-State Compression: Materializer only emits downstream on bucket transitions (98% drop)",
             "Asynchronous Decoupling: Ingest Gateway accepts into Kafka; async workers process independently",
             "Self-Healing Reconciliation: 5-min cron pass overwrites Redis counters with ClickHouse cube totals"
         ],
         stroke="#059669", fill="#f0fdf4", title_color="#065f46", title_size=14, bullet_size=11.5)

    card(1740, 40, 740, 230,
         "3. SLA & LATENCY BUDGET BREAKDOWN",
         bullets=[
             "Ingest Latency (< 30ms): TLS (20ms) -> Token Check (2ms) -> Kafka Produce (8ms)",
             "Dashboard Read (< 115ms p95): Edge LB (20ms) -> Redis Summary Read (2ms) -> Wire (30ms)",
             "End-to-End Budget (< 5.5s vs 20s SLA): Ingest (110ms) -> Flink (300ms) -> Window (5s) -> WS (50ms)",
             "Audit Export: Signed S3 URLs generated from Postgres manifest; zero app data pass-through"
         ],
         stroke="#c2410c", fill="#fff7ed", title_color="#9a3412", title_size=14, bullet_size=11.5)

    # ------------------------------------------------------------------ PIPELINE GROUPS
    group_frame(40,   300, 280, 1140, "1. CLIENTS & EDGE", stroke="#0284c7", fill="#f0f9ff")
    group_frame(350,  300, 300, 1140, "2. INGESTION LAYER", stroke="#2563eb", fill="#eff6ff")
    group_frame(680,  300, 320, 1140, "3. EVENT STREAMING (KAFKA)", stroke="#ea580c", fill="#fff7ed")
    group_frame(1030, 300, 340, 1140, "4. STREAM PROCESSING WORKERS", stroke="#059669", fill="#ecfdf5")
    group_frame(1400, 300, 360, 1140, "5. DATA STORES & STORAGE", stroke="#0d9488", fill="#f0fdfa")
    group_frame(1790, 300, 320, 1140, "6. SERVING & API LAYER", stroke="#9333ea", fill="#faf5ff")
    group_frame(2140, 300, 340, 1140, "7. SCREENS & OUTPUTS", stroke="#c026d3", fill="#fdf4ff")

    # ------------------------------------------------------------------ 1. CLIENTS & EDGE
    c_iot = NodeBox(60, 360, 240, 160, "IoT Agent Fleet", "(100M Devices)",
                    bullets=["100M active devices", "1 snapshot / 30s", "Jittered push intervals", "Gzip payload (~250B wire)", "Client-side retry buffer"],
                    stroke="#0284c7", fill="#e0f2fe")
    c_cdn = NodeBox(60, 550, 240, 140, "Edge CDN", "(Cloudflare / CloudFront)",
                    bullets=["Static manifest cache", "Serves agent config at edge", "Offloads 99% config polls", "Edge IP Rate Limiting"],
                    stroke="#0284c7", fill="#e0f2fe")

    # ------------------------------------------------------------------ 2. INGESTION LAYER
    i_gw  = NodeBox(370, 360, 260, 160, "Ingest API Gateway", "(Envoy / Netty)",
                    bullets=["TLS termination & Auth", "Token-bucket rate limiter", "Ultra-fast <30ms response", "Returns 202 Accepted", "Returns 429 Retry-After"],
                    stroke="#2563eb", fill="#dbeafe")
    i_svc = NodeBox(370, 550, 260, 150, "Ingest Service", "(Go Microservice Fleet)",
                    bullets=["Stateless fleet (110+ nodes)", "Validates JSON schema", "Stamps receivedAt clock", "Produces to telemetry.raw"],
                    stroke="#2563eb", fill="#dbeafe")
    i_grd = NodeBox(370, 730, 260, 130, "Redis Ingest Guard", "(In-Memory Cache)",
                    bullets=["Device token bucket quotas", "10-min eventId dedupe filter", "Fast device->tenant mapping"],
                    stroke="#dc2626", fill="#fee2e2")

    # ------------------------------------------------------------------ 3. KAFKA CLUSTER
    k_hdr = NodeBox(700, 360, 280, 130, "Kafka Message Bus", "(Distributed Event Log)",
                    bullets=["5,000 Partitions (deviceId)", "3.3M msgs/s (6.6M peak)", "7-day retention (S3 tier)", "Decouples write & processing"],
                    stroke="#ea580c", fill="#ffedd5")
    k_raw = NodeBox(700, 510, 280, 85, "Topic: telemetry.raw", "(Firehose Stream)",
                    bullets=["Full raw JSON snapshots", "Key: deviceId"],
                    stroke="#d97706", fill="#fef3c7")
    k_st  = NodeBox(700, 610, 280, 85, "Topic: device.state", "(Delta Transition Stream)",
                    bullets=["Bucket changes only (~40k/s)", "Key: deviceId"],
                    stroke="#d97706", fill="#fef3c7")
    k_slt = NodeBox(700, 710, 280, 85, "Topic: device.silent", "(Presence Stream)",
                    bullets=["Missing heartbeat events", "Key: deviceId"],
                    stroke="#d97706", fill="#fef3c7")
    k_alt = NodeBox(700, 810, 280, 85, "Topic: alerts.fired", "(Alert Stream)",
                    bullets=["Firing rule instances", "Key: alertFingerprint"],
                    stroke="#d97706", fill="#fef3c7")
    k_dlq = NodeBox(700, 910, 280, 85, "Topic: telemetry.dlq", "(Dead Letter Queue)",
                    bullets=["Unparseable / bad payloads", "Key: deviceId"],
                    stroke="#991b1b", fill="#fef2f2")

    # ------------------------------------------------------------------ 4. STREAM WORKERS
    w_mat = NodeBox(1050, 360, 300, 160, "State Materializer", "(Flink / Stream Worker)",
                    bullets=["Consumes telemetry.raw", "Drops old sequence numbers", "Emits ONLY on bucket change", "98% load reduction (3.3M->40k)"],
                    stroke="#059669", fill="#d1fae5")
    w_rol = NodeBox(1050, 540, 300, 160, "Rollup & Counter Job", "(Flink Aggregator)",
                    bullets=["Consumes device.state", "Updates Redis counter hash", "Populates ClickHouse OLAP cube", "Kafka transactional writes"],
                    stroke="#059669", fill="#d1fae5")
    w_swp = NodeBox(1050, 720, 300, 140, "Presence Sweeper", "(Cron / Worker)",
                    bullets=["Sweeps 90s heartbeat slots", "Finds unheard devices", "Emits device.silent event", "Prevents stale metrics"],
                    stroke="#059669", fill="#d1fae5")
    w_arc = NodeBox(1050, 880, 300, 140, "Raw Archiver Worker", "(Parquet Writer)",
                    bullets=["Batches JSON into Parquet", "Applies Zstandard compression", "Flushes hourly blobs to S3", "15x compression ratio"],
                    stroke="#059669", fill="#d1fae5")
    w_alt = NodeBox(1050, 1040, 300, 140, "Alert Engine Worker", "(Rules Processor)",
                    bullets=["Evaluates sliding window rules", "Requires 3 consecutive windows", "Deduplicates by fingerprint", "Prevents alert fatigue"],
                    stroke="#059669", fill="#d1fae5")
    w_dlq = NodeBox(1050, 1200, 300, 120, "DLQ Replayer Worker", "(Recovery Worker)",
                    bullets=["Consumes telemetry.dlq", "Fixes schema & re-injects", "Safe manual replay trigger"],
                    stroke="#991b1b", fill="#fef2f2")

    # ------------------------------------------------------------------ 5. DATA STORES
    s_s3  = NodeBox(1420, 360, 320, 150, "S3 Immutable Audit Lake", "(Parquet + Zstd Object Lock)",
                    bullets=["100% raw payload archive", "WORM Object Lock (Compliance)", "Tiered: Standard -> IA -> Glacier", "15 TB/day compressed storage"],
                    stroke="#0d9488", fill="#ccfbf1")
    s_red = NodeBox(1420, 530, 320, 160, "Redis Sharded Cluster", "(In-Memory State & Cache)",
                    bullets=["Fleet Counters: Tile counts (<1ms)", "Latest State: 100M devices (~20GB)", "Heartbeat Wheel: 90s time slots", "Replay Stream: 5-min WS delta log"],
                    stroke="#dc2626", fill="#fee2e2")
    s_ch  = NodeBox(1420, 710, 320, 150, "ClickHouse OLAP DB", "(SummingMergeTree Cube)",
                    bullets=["Pre-aggregated 1-min metric cube", "Dimensions: tenant, model, OS, region", "Fast multi-dimension slice (<60ms)", "Zero read-time scans"],
                    stroke="#d97706", fill="#fef3c7")
    s_cas = NodeBox(1420, 880, 320, 140, "Cassandra Time-Series", "(NoSQL DB)",
                    bullets=["Per-device metric history", "Partition key: (deviceId, date)", "Single-device charts & graphs", "High write throughput"],
                    stroke="#2563eb", fill="#dbeafe")
    s_pg  = NodeBox(1420, 1040, 320, 150, "Postgres Control DB", "(Relational Storage - CP)",
                    bullets=["Devices, Tenants, Admins, Rules", "Audit Manifest: blobKey, sha256", "Alert State Machine (OK/Pending/Firing)", "Strict transactional consistency"],
                    stroke="#4f46e5", fill="#e0e7ff")
    s_dlq = NodeBox(1420, 1210, 320, 110, "Dead Letter Store", "(Postgres / S3 Storage)",
                    bullets=["Failed payloads & error stacktraces", "14-day retention for inspection"],
                    stroke="#991b1b", fill="#fef2f2")

    # ------------------------------------------------------------------ 6. SERVING LAYER
    r_qry = NodeBox(1810, 360, 280, 170, "Dashboard Query Service", "(Go / Java API)",
                    bullets=["Reads summary tiles from Redis (<2ms)", "Queries ClickHouse for slices (<60ms)", "Queries Cassandra for device history", "Zero raw event scans (p95 < 115ms)"],
                    stroke="#9333ea", fill="#faf5ff")
    r_ws  = NodeBox(1810, 550, 280, 160, "WebSocket Gateway", "(Netty / Stateful Push)",
                    bullets=["Holds open client WS sockets", "Streams Redis delta stream", "Resume via sequence cursor (since=<seq>)", "Exponential backoff + jitter defence"],
                    stroke="#9333ea", fill="#faf5ff")
    r_exp = NodeBox(1810, 730, 280, 140, "Audit Export Service", "(Export Microservice)",
                    bullets=["Queries Postgres manifest index", "Generates S3 presigned URLs", "Zero app data pass-through"],
                    stroke="#9333ea", fill="#faf5ff")
    r_not = NodeBox(1810, 890, 280, 140, "Alert Notifier Service", "(Notification Dispatcher)",
                    bullets=["Dispatches grouped alerts", "Integrates PagerDuty, Slack, Webhook", "Deduplicates per incident fingerprint"],
                    stroke="#9333ea", fill="#faf5ff")

    # ------------------------------------------------------------------ 7. SCREENS
    u_dash = NodeBox(2160, 360, 300, 170, "Fleet Admin Dashboard", "(React / Web App)",
                     bullets=["Real-time fleet health tiles with asOf stamp", "Multi-dimensional filter & drill-down", "Auto live WS streaming updates", "Zero blank screens on disconnect"],
                     stroke="#c026d3", fill="#fdf4ff")
    u_aud  = NodeBox(2160, 550, 300, 140, "Auditor Portal", "(Web UI)",
                     bullets=["Requests raw payload date export", "Verifies SHA256 cryptographic hashes", "Direct S3 presigned downloads"],
                     stroke="#c026d3", fill="#fdf4ff")
    u_alt  = NodeBox(2160, 710, 300, 140, "PagerDuty / Slack / Ops", "(Incident Channels)",
                     bullets=["Single consolidated alert page", "Contains device count & filter link", "Suppresses child alert flaps"],
                     stroke="#c026d3", fill="#fdf4ff")

    # ------------------------------------------------------------------ CONTROL PLANE BAND
    group_frame(350, 1470, 1760, 160, "CONTROL PLANE (MANAGEMENT & AUTHENTICATION)", stroke="#475569", fill="#f8fafc")
    c_ctl = NodeBox(370, 1510, 1720, 100, "Control Plane Service & Admin API Gateway", "(Stateless Go Fleet)",
                    bullets=[
                        "Handles Human Operator Auth (OAuth2 / RBAC), Device Provisioning, Tenant Quotas, Alert Rule CRUD, and CDN Manifest Building",
                        "Backed by Postgres Control DB | Completely decoupled from high-throughput device telemetry ingest path (devices function even if control plane is down)"
                    ],
                    stroke="#475569", fill="#ffffff")

    # ------------------------------------------------------------------ WIRING / ARROWS
    # Client & Edge
    line(c_iot.rp(0.3), i_gw.lp(0.3), stroke="#0284c7", label="3.3M/s Gzip JSON")
    line(c_iot.rp(0.7), c_cdn.lp(0.5), stroke="#0284c7", label="Poll Manifest")

    # Ingestion
    line(i_gw.rp(0.5), i_svc.lp(0.3), stroke="#2563eb", label="Validated Request")
    line(i_gw.bp(0.5), i_grd.tp(0.5), stroke="#dc2626", label="Quota Check / 429", both=True)
    line(i_svc.rp(0.5), k_raw.lp(0.5), stroke="#2563eb", label="Produce Partitioned")

    # Edge CDN & Control
    line(c_cdn.rp(0.5), c_ctl.lp(0.2), stroke="#475569", label="Pull Manifest", both=True)
    line(c_ctl.rp(0.7), s_pg.bp(0.2), stroke="#475569", label="Transactional Sync", both=True)

    # Kafka -> Workers
    line(k_raw.rp(0.3), w_mat.lp(0.5), stroke="#ea580c", label="Consume Raw")
    line(w_mat.rp(0.3), k_st.lp(0.5), stroke="#059669", label="Emit Transitions")
    line(k_st.rp(0.5), w_rol.lp(0.5), stroke="#ea580c", label="Consume State")

    line(k_raw.rp(0.7), w_arc.lp(0.5), stroke="#ea580c", label="Audit Pipeline")
    line(k_st.rp(0.8), w_alt.lp(0.5), stroke="#ea580c", label="Alert Evaluation")

    line(w_swp.lp(0.5), k_slt.rp(0.5), stroke="#059669", label="Emit Silence")
    line(k_alt.rp(0.5), r_not.lp(0.5), stroke="#ea580c", label="Consume Fired Alerts")
    line(k_dlq.rp(0.5), w_dlq.lp(0.5), stroke="#991b1b", label="Consume DLQ")

    # Workers -> Datastores
    line(w_mat.rp(0.7), s_red.lp(0.3), stroke="#059669", label="Update State")
    line(w_mat.rp(0.9), s_cas.lp(0.3), stroke="#059669", label="Append History")

    line(w_rol.rp(0.3), s_red.lp(0.6), stroke="#059669", label="Increment Counters")
    line(w_rol.rp(0.7), s_ch.lp(0.5), stroke="#059669", label="Write Rollup Cube")

    line(w_arc.rp(0.5), s_s3.lp(0.5), stroke="#059669", label="Write Parquet Blobs")
    line(w_swp.rp(0.5), s_red.lp(0.8), stroke="#059669", label="Read Slot Wheel", both=True)
    line(w_alt.rp(0.5), s_pg.lp(0.5), stroke="#059669", label="Update Alert State")

    # Stores -> Serving
    line(s_red.rp(0.3), r_qry.lp(0.3), stroke="#dc2626", label="Read Tile (<2ms)")
    line(s_ch.rp(0.5), r_qry.lp(0.6), stroke="#d97706", label="Query Cube (<60ms)")
    line(s_cas.rp(0.5), r_qry.lp(0.8), stroke="#2563eb", label="Read History")

    line(s_red.rp(0.7), r_ws.lp(0.5), stroke="#dc2626", label="Read Delta Stream")
    line(s_pg.rp(0.5), r_exp.lp(0.5), stroke="#4f46e5", label="Lookup Manifest")
    line(s_s3.rp(0.5), r_exp.lp(0.2), stroke="#0d9488", label="Presigned Link")

    # Serving -> Screens
    line(r_qry.rp(0.5), u_dash.lp(0.3), stroke="#9333ea", label="REST Summary")
    line(r_ws.rp(0.5), u_dash.lp(0.7), stroke="#9333ea", label="WS Delta Stream")
    line(r_exp.rp(0.5), u_aud.lp(0.5), stroke="#9333ea", label="Signed S3 URL")
    line(r_not.rp(0.5), u_alt.lp(0.5), stroke="#9333ea", label="Dispatch Alert Page")

    # ------------------------------------------------------------------ BOTTOM INTERVIEW ESSENTIAL CARDS
    card(40, 1670, 580, 310,
         "HARD PROBLEM 1: Rate Limiting & Overload Defense",
         bullets=[
             "Multi-Layer Protection: Edge IP Quarantine -> Device Token Bucket (100/min, burst 200) -> Tenant Quota",
             "Polite Backoff: Over-limit devices get 429 Too Many Requests with Retry-After: 60 header (never 500!)",
             "Blast Radius Isolation: Kafka partition key = deviceId; 1 rogue device jams 1 of 5,000 partitions",
             "Emergency Fleet Brake: Edge CDN manifest update can throttle all 100M agents within 1 hr without code deploy"
         ],
         stroke="#ef4444", fill="#fef2f2", title_color="#991b1b", title_size=13, bullet_size=11)

    card(650, 1670, 580, 310,
         "HARD PROBLEM 2: Real-time Fleet Aggregation (< 200ms)",
         bullets=[
             "Zero Read-Time Scans: Scanning 100M devices on read is impossible. Metrics are bucketed on write",
             "Delta Bucket Transitions: Critical (<10%), Low (10-30%), Healthy (>30%). Only bucket changes emit transitions",
             "ClickHouse OLAP Cube: Multi-dimension slices (Model, OS, Region) stored in SummingMergeTree (queries < 60ms)",
             "Drift Correction: 5-min worker reconciliation pass overwrites Redis counters to eliminate missed decrements"
         ],
         stroke="#10b981", fill="#ecfdf5", title_color="#065f46", title_size=13, bullet_size=11)

    card(1260, 1670, 580, 310,
         "HARD PROBLEM 3: Idempotency & Deduplication",
         bullets=[
             "Client-Generated Keys: Every snapshot carries eventId (UUIDv7) + sequenceNum generated at origin",
             "Gateway Dedupe: 10-min memory cache of eventIds returns cached 202 Accepted on agent retries",
             "State Store Dedupe: State Materializer drops events where seq <= current_seq (handles retries & out-of-order)",
             "Natural Counter Replay Safety: Replayed events compute same bucket state; 0 counter transitions emitted"
         ],
         stroke="#3b82f6", fill="#eff6ff", title_color="#1e40af", title_size=13, bullet_size=11)

    card(1870, 1670, 610, 310,
         "HARD PROBLEM 4: Resilient WebSockets & Disconnects",
         bullets=[
             "Snapshot + Delta Model: Dashboard fetches full summary via HTTP GET (asOf seq), then streams deltas over WS",
             "Redis Stream Replay Log: Stores last 5-min of updates. Reconnecting browser passes cursor since=<seq>",
             "Thundering Herd Defense: Reconnecting clients use Exponential Backoff + Full Jitter (base 1s, max 30s)",
             "Node Fan-out: Gateway node subscribes to Redis stream ONCE per tenant, fanning out to 50k open sockets"
         ],
         stroke="#a855f7", fill="#faf5ff", title_color="#6b21a8", title_size=13, bullet_size=11)

def main():
    build_diagram()
    doc = {
        "type": "excalidraw",
        "version": 2,
        "source": "build_telemetry_hld.py",
        "elements": ELS,
        "appState": {"viewBackgroundColor": "#ffffff", "gridSize": None},
        "files": {},
    }
    with open("telemetry-hld.excalidraw", "w") as f:
        json.dump(doc, f, indent=1)
    print(f"Successfully generated {len(ELS)} elements into telemetry-hld.excalidraw")

if __name__ == "__main__":
    main()
