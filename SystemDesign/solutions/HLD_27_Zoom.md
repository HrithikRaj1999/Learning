# HLD 27: Design Zoom (Video Conferencing)

## 💡 Quick Summary

> **What**: A real-time video/audio conferencing system supporting 1:1 calls, group meetings, screen sharing, and recordings.  
> **Key Insight**: Unlike streaming (one-way, tolerates buffering), video calls require **sub-200ms latency** (or conversation feels unnatural). Uses UDP (lossy but fast) over TCP (reliable but slow). Selective Forwarding Unit (SFU) architecture scales group calls.

---

## 🎯 The Problem in Simple Terms

In a 10-person video call:
- Each person sends 1 video stream + 1 audio stream
- Naive approach: each person sends to 9 others = 90 streams (N × (N-1)) — doesn't scale!
- Solution: everyone sends to a central server, server forwards selectively

---

## 📋 Requirements

| Feature | Detail |
|---------|--------|
| 1:1 video/audio | Peer-to-peer when possible |
| Group calls | Up to 1000 participants |
| Screen sharing | Low latency, high resolution |
| Recording | Cloud recording + transcription |
| Chat | In-meeting text chat |
| Adaptive quality | Adjust to network conditions |

### Scale
```
Concurrent meetings: 10M+
Participants in one meeting: up to 1000
Video quality: 720p/1080p (adaptive)
Latency target: < 150ms end-to-end
Bandwidth per participant: 1.5-4 Mbps (send + receive)
Audio codec: Opus (20ms frames)
Video codec: VP8/H.264/AV1
```

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "👥 Participants"
        A[Alice<br/>Camera + Mic]
        B[Bob<br/>Camera + Mic]
        C[Carol<br/>Camera + Mic]
    end

    subgraph "⚡ Media Layer"
        SFU[SFU Server<br/>Selective Forwarding Unit<br/>Receives all streams,<br/>forwards selectively]
    end

    subgraph "⚙️ Signaling & Control"
        Signal[Signaling Server<br/>WebSocket: join/leave/mute events]
        TURN[TURN/STUN Servers<br/>NAT traversal]
    end

    subgraph "📦 Supporting"
        Record[Recording Service<br/>Save to cloud]
        Transcode[Transcoding<br/>Mix streams for recording]
    end

    A & B & C <-->|"UDP: Video + Audio"| SFU
    A & B & C <-->|"WebSocket: Control"| Signal
    SFU --> Record --> Transcode
```

---

## 🔍 How SFU Works (vs. Alternatives)

```mermaid
graph LR
    subgraph "❌ Mesh (P2P) — doesn't scale"
        M1["Each person sends to everyone<br/>4 people = 12 streams<br/>10 people = 90 streams 😵"]
    end
    
    subgraph "❌ MCU — too expensive"
        M2["Server decodes ALL streams<br/>Mixes into ONE stream per recipient<br/>CPU-intensive; adds latency"]
    end
    
    subgraph "✅ SFU — best of both"
        M3["Each person sends 1 stream to server<br/>Server FORWARDS (no decoding!)<br/>Each receives N-1 streams<br/>Low CPU; low latency"]
    end
```

### SFU Detail

```mermaid
sequenceDiagram
    participant A as Alice
    participant SFU2 as SFU Server
    participant B as Bob
    participant C as Carol

    Note over A,C: 3-person call
    
    A->>SFU2: Send: Alice's video (720p) + audio
    B->>SFU2: Send: Bob's video (720p) + audio
    C->>SFU2: Send: Carol's video (360p — slow connection)
    
    SFU2->>B: Forward: Alice's video (720p) + Carol's video (360p)
    SFU2->>C: Forward: Alice's video (360p ← downscaled!) + Bob's video (360p)
    SFU2->>A: Forward: Bob's video (720p) + Carol's video (360p)
    
    Note over SFU2: SFU knows Carol has slow internet<br/>→ sends lower quality layers to Carol<br/>This is Simulcast/SVC!
```

---

## 📹 Simulcast (Adaptive Quality)

```mermaid
graph TD
    subgraph "What each sender transmits (Simulcast)"
        Sender["Alice's camera encodes simultaneously:<br/>High: 720p @ 1.5 Mbps<br/>Medium: 360p @ 500 Kbps<br/>Low: 180p @ 150 Kbps"]
    end
    
    subgraph "SFU picks quality per receiver"
        RecvBob["Bob (good internet) → gets High layer"]
        RecvCarol["Carol (bad internet) → gets Low layer"]
        RecvDave["Dave (speaker view, Alice is small) → gets Medium"]
    end
    
    Sender --> RecvBob & RecvCarol & RecvDave
```

---

## 🌐 NAT Traversal (Connecting Through Firewalls)

```mermaid
sequenceDiagram
    participant A as Alice (behind NAT)
    participant STUN as STUN Server
    participant TURN2 as TURN Server
    participant SFU3 as SFU

    A->>STUN: What's my public IP?
    STUN-->>A: Your public IP:port is 203.0.113.5:4567
    
    A->>SFU3: Try direct connection to SFU
    
    alt Direct connection works (80% of cases)
        A<-->SFU3: UDP media flows directly
    else Blocked by strict NAT/firewall
        A->>TURN2: Relay my media through you
        TURN2<-->SFU3: TURN relays packets
        Note over TURN2: Adds ~20ms latency; uses more bandwidth<br/>But it ALWAYS works (fallback)
    end
```

---

## 🎙️ Audio Processing Pipeline

```mermaid
graph LR
    Mic["Microphone<br/>Raw audio"] --> AEC["Echo Cancellation<br/>Remove speaker output<br/>from mic input"]
    AEC --> NS["Noise Suppression<br/>Remove background noise"]
    NS --> AGC["Auto Gain Control<br/>Normalize volume"]
    AGC --> Encode["Opus Encoder<br/>20ms frames"]
    Encode --> Network["Send via UDP"]
    
    Note["All this happens in < 20ms<br/>on the client device"]
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Transport | UDP (not TCP) | Dropped frame > delayed frame in real-time video |
| Architecture | SFU (not MCU, not Mesh) | Scales to large calls; low server CPU; low latency |
| Quality adaptation | Simulcast (3 layers per sender) | SFU picks best layer per receiver without transcoding |
| Fallback | TURN relay | Works through any firewall (unlike P2P) |
| Recording | Server-side (SFU records streams) | Doesn't burden participants; consistent quality |
| Audio codec | Opus | Adaptive bitrate; excellent quality at low bandwidth |

---

## 🚀 Scaling

| Challenge | Solution |
|-----------|----------|
| 1000-person meeting | SFU only forwards active speaker's video; others = audio only |
| Global latency | Regional SFU servers; route to nearest media server |
| SFU overload | Cascade SFUs (SFU-to-SFU forwarding for large meetings) |
| Network fluctuation | Simulcast + bandwidth estimation; drop quality gracefully |
| Recording large meetings | Dedicated recording nodes; async transcoding |
| TURN bandwidth cost | Minimize TURN usage; only for NAT-blocked users (~20%) |
