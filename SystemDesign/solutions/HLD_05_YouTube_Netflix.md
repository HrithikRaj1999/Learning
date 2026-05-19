# HLD 05: Design YouTube / Netflix (Video Streaming)

## 💡 Quick Summary

> **What**: A video streaming platform where users upload, process, and stream videos at scale.  
> **Key Insight**: The hardest part is the video processing pipeline (encoding into multiple resolutions/formats) and serving massive video files globally with adaptive bitrate streaming.

---

## 🎯 The Problem in Simple Terms

When you upload a 10-minute 4K video to YouTube:
- It must be converted into 6+ resolutions (144p to 4K)
- Each resolution in multiple formats (H.264, VP9, AV1)
- That's 20+ versions of one video!
- Then serve it to viewers worldwide with zero buffering

YouTube serves 1B+ hours of video DAILY. Netflix streams to 230M subscribers simultaneously.

---

## 📋 Requirements

### What It Must Do
| Feature | Detail |
|---------|--------|
| Upload video | Any format, up to hours long |
| Process/Encode | Convert to multiple resolutions & codecs |
| Stream | Adaptive bitrate based on user's bandwidth |
| Search | Find videos by title, description, tags |
| Recommendations | Suggest videos based on watch history |
| Comments & Likes | Social engagement |

### Scale Numbers
```
YouTube scale:
- 500 hours of video uploaded every MINUTE
- 1B hours watched/day
- 2B monthly users
- Average video: 10 min = 150MB (720p)
- Storage: 500 hrs/min × 60 × 24 × 150MB × 6 resolutions = ~3.9 PB/day NEW storage!
- Peak concurrent viewers: 100M+
```

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "👤 Users"
        Uploader[Video Creator]
        Viewer[Viewer / Subscriber]
    end

    subgraph "🌐 Edge"
        CDN[CDN - Global Edge<br/>Thousands of locations<br/>Caches popular videos]
    end

    subgraph "⬆️ Upload Path"
        UploadAPI[Upload Service]
        RawStore[(Raw Video Storage)]
        Queue[Processing Queue]
        Encoder[Video Encoder Farm<br/>Thousands of workers]
        EncodedStore[(Encoded Videos<br/>All resolutions)]
    end

    subgraph "▶️ Streaming Path"
        StreamAPI[Streaming Service]
        Manifest[Manifest Generator<br/>HLS/DASH playlist]
    end

    subgraph "🗄️ Metadata"
        MetaDB[(Video Metadata DB<br/>Title, description, tags)]
        SearchIdx[(Search Index)]
        RecoEngine[Recommendation Engine]
    end

    Uploader --> UploadAPI --> RawStore
    RawStore --> Queue --> Encoder --> EncodedStore
    EncodedStore --> CDN
    
    Viewer --> CDN
    CDN -->|Cache miss| StreamAPI
    StreamAPI --> Manifest
    StreamAPI --> EncodedStore
    
    Viewer --> SearchIdx
    Viewer --> RecoEngine
    UploadAPI --> MetaDB --> SearchIdx
```

---

## 🔍 How Video Upload & Processing Works

```mermaid
sequenceDiagram
    actor Creator as Video Creator
    participant API as Upload Service
    participant S3 as Raw Storage
    participant Q as Processing Queue
    participant Enc as Encoder Workers
    participant Out as Encoded Storage
    participant CDN as CDN
    participant DB as Metadata DB

    Creator->>API: Upload "my_video.mp4" (2GB)
    Note over Creator,API: Chunked upload (resumable)
    API->>S3: Store raw video
    API->>DB: Create record (title, status: "processing")
    API-->>Creator: ✅ Upload complete! Processing...
    
    API->>Q: Submit encoding job
    
    par Encode in parallel
        Q->>Enc: Encode 1080p H.264
        Q->>Enc: Encode 720p H.264
        Q->>Enc: Encode 480p H.264
        Q->>Enc: Encode 360p H.264
        Q->>Enc: Encode 1080p VP9
        Q->>Enc: Encode 4K H.265 (if source is 4K)
    end
    
    Enc->>Out: Store all encoded versions
    Enc->>DB: Update status: "ready"
    Enc->>CDN: Pre-warm popular regions
    
    Note over Creator: Gets notification: "Video is live!"
```

### Video Processing Pipeline (Detail)

```mermaid
graph LR
    Raw[Raw Video<br/>4K, 2GB] --> Split[Split into<br/>10-second chunks]
    Split --> Transcode1[Chunk 1<br/>Encode all resolutions]
    Split --> Transcode2[Chunk 2<br/>Encode all resolutions]
    Split --> TranscodeN[Chunk N...]
    
    Transcode1 & Transcode2 & TranscodeN --> Stitch[Stitch chunks<br/>back together]
    Stitch --> Output1[4K - 20 Mbps]
    Stitch --> Output2[1080p - 5 Mbps]
    Stitch --> Output3[720p - 2.5 Mbps]
    Stitch --> Output4[480p - 1 Mbps]
    Stitch --> Output5[360p - 0.5 Mbps]
```

**Why split into chunks?** Parallel processing! A 1-hour video split into 360 chunks (10s each) can be encoded by 360 workers simultaneously. Total time: minutes instead of hours.

---

## ▶️ How Video Streaming Works (Adaptive Bitrate)

```mermaid
sequenceDiagram
    actor Viewer
    participant Player as Video Player
    participant CDN as CDN Edge
    participant API as Streaming Service

    Viewer->>Player: Click "Play"
    Player->>API: GET /video/abc123/manifest
    API-->>Player: Manifest file (list of available qualities)
    
    Note over Player: Manifest says: 4K, 1080p, 720p, 480p available
    
    Player->>Player: Check bandwidth: ~5 Mbps
    Player->>CDN: GET /video/abc123/1080p/chunk_001.ts
    CDN-->>Player: Video chunk (10 seconds)
    
    Note over Player: Bandwidth drops to 2 Mbps
    Player->>CDN: GET /video/abc123/720p/chunk_002.ts
    CDN-->>Player: Lower quality chunk (seamless switch!)
    
    Note over Player: Bandwidth recovers to 8 Mbps
    Player->>CDN: GET /video/abc123/1080p/chunk_003.ts
```

### How Adaptive Bitrate Works (Visual)

```mermaid
graph TD
    subgraph "📊 Player monitors bandwidth continuously"
        BW[Measured Bandwidth] --> Decision{Which quality<br/>fits current speed?}
        Decision -->|"> 15 Mbps"| Q4K[Stream 4K]
        Decision -->|"5-15 Mbps"| Q1080[Stream 1080p]
        Decision -->|"2-5 Mbps"| Q720[Stream 720p]
        Decision -->|"< 2 Mbps"| Q480[Stream 480p]
    end
    
    subgraph "🎬 Result"
        Smooth[Viewer sees smooth video<br/>Quality adjusts seamlessly<br/>No buffering!]
    end
    
    Q4K & Q1080 & Q720 & Q480 --> Smooth
```

---

## 🌍 CDN Strategy (Why Videos Don't Buffer)

```mermaid
graph TB
    subgraph "🏢 Origin (US-East)"
        Origin[Origin Server<br/>All videos stored here]
    end
    
    subgraph "🌍 CDN Edge Servers (Thousands worldwide)"
        Edge1[Tokyo Edge<br/>Cached: popular JP videos]
        Edge2[London Edge<br/>Cached: popular EU videos]
        Edge3[Mumbai Edge<br/>Cached: popular IN videos]
    end
    
    subgraph "👤 Viewers"
        JP[Viewer in Japan]
        UK[Viewer in UK]
        IN[Viewer in India]
    end
    
    JP -->|"< 20ms"| Edge1
    UK -->|"< 20ms"| Edge2
    IN -->|"< 20ms"| Edge3
    
    Edge1 -->|"Cache miss<br/>only first time"| Origin
    Edge2 -->|"Cache miss"| Origin
    Edge3 -->|"Cache miss"| Origin
```

**Key insight**: Popular videos (top 20%) serve 80% of traffic. These stay cached at edge. Less popular = fetched from origin on demand.

---

## 🗄️ Storage Architecture

```mermaid
graph TB
    subgraph "Video Storage (Petabytes)"
        Hot[Hot Storage - SSD<br/>New & trending videos<br/>Last 7 days]
        Warm[Warm Storage - HDD<br/>Regular videos<br/>Last 1 year]
        Cold[Cold Storage - Glacier<br/>Old/rare videos<br/>Rarely accessed]
    end
    
    subgraph "Metadata (Terabytes)"
        MySQL[MySQL<br/>Video info, users, channels]
        Redis[Redis<br/>View counts, likes]
        ES[Elasticsearch<br/>Search index]
    end
    
    Hot -->|"After 7 days"| Warm
    Warm -->|"After 1 year, low views"| Cold
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Encoding strategy | Pre-encode all resolutions | CPU cost upfront vs. smooth playback for billions of views |
| Streaming protocol | HLS/DASH (chunked) | Adaptive bitrate; works over HTTP; CDN-friendly |
| Storage tiering | Hot/Warm/Cold | 90% of views are recent/popular content; save $$$ |
| Upload | Chunked + resumable | Large files (GB+); don't restart on network failure |
| Processing | Split video into segments | Parallel encoding = minutes instead of hours |
| CDN | Multi-CDN strategy | No single CDN covers everywhere; use multiple |

---

## 🚀 Scaling Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| 500 hrs uploaded/minute | Massive encoder fleet (1000s of GPU workers) |
| 1B hours watched/day | CDN serves 95% of traffic; viewers rarely hit origin |
| Storage growing 4PB/day | Tiered storage (hot→warm→cold); compression improvements |
| Buffering during peak | Multiple CDN providers; overflow routing |
| Video processing time | Split into chunks → parallel encode → faster completion |
| Search 800M videos | Elasticsearch cluster; metadata + captions indexed |
