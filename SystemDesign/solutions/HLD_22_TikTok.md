# HLD 22: Design TikTok (Short Video Feed)

## 💡 Quick Summary

> **What**: A short-form video platform with an algorithmically curated "For You" feed that keeps users scrolling endlessly.  
> **Key Insight**: Unlike Instagram (follow-based feed), TikTok's feed is entirely algorithm-driven. You don't need followers — any video can go viral if the algorithm detects engagement. The recommendation engine IS the product.

---

## 🎯 The Problem in Simple Terms

The "For You" page must:
- Show you videos you'll love (even from creators you don't follow)
- Decide within the first few views if a video is worth promoting
- Handle billions of video views per day with minimal buffering
- Process uploaded videos instantly (transcode, moderate, distribute)

---

## 📋 Requirements

| Feature | Detail |
|---------|--------|
| Upload short videos | 15s to 10 min, with effects |
| For You feed | Personalized, infinite scroll |
| Interactions | Like, comment, share, duet |
| Discovery | Hashtags, sounds, trending |
| Creator tools | Filters, music overlay, editing |
| Live streaming | Real-time broadcasts |

### Scale
```
DAU: 1B+
Video uploads/day: 10M+
Video views/day: 10B+
Avg video size: 5-50 MB (raw), 2-10 MB (compressed)
Feed refresh: real-time, personalized per user
Content moderation: AI + human review
```

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "📱 Client"
        App[TikTok App<br/>Pre-buffers next 3 videos]
    end

    subgraph "🌐 Delivery"
        CDN2[Global CDN<br/>Videos at edge]
    end

    subgraph "⚙️ Core Services"
        Upload[Upload Service<br/>Ingest + transcode]
        Feed[Feed Service<br/>Personalized For You page]
        Reco2[Recommendation Engine<br/>The secret sauce 🤫]
        Social[Social Service<br/>Likes, comments, follows]
        Moderate[Moderation Service<br/>AI content review]
    end

    subgraph "🗄️ Storage"
        Video[(Video Storage<br/>All resolutions)]
        UserGraph[(User/Social Graph)]
        Interactions[(Engagement Data<br/>Views, watch time, likes)]
    end

    App <-->|"Stream video"| CDN2
    App <-->|"API"| Feed & Social
    Upload --> Moderate --> Video --> CDN2
    Feed --> Reco2 --> Interactions & UserGraph
```

---

## 🔍 The Recommendation Algorithm (Simplified)

```mermaid
graph TD
    subgraph "📊 Signals for each video"
        S1["Watch time % — Did they watch the whole thing?"]
        S2["Re-watches — Watched multiple times?"]
        S3["Likes/Comments/Shares"]
        S4["Profile visits after watching"]
        S5["'Not interested' signals"]
    end
    
    subgraph "🧪 How a new video gets tested"
        Step1["Video uploaded → show to small batch (~300 users)"]
        Step2["Measure engagement signals"]
        Step3{Engagement high?}
        Step4["Show to larger batch (10K users)"]
        Step5["Show to even larger batch (100K+)"]
        Step6["Video goes viral 🚀"]
        Step7["Stop promoting (low interest)"]
    end
    
    S1 & S2 & S3 & S4 & S5 --> Step2
    Step1 --> Step2 --> Step3
    Step3 -->|Yes| Step4 --> Step3
    Step4 -->|Yes| Step5 --> Step6
    Step3 -->|No| Step7
```

---

## 📤 Video Upload Pipeline

```mermaid
sequenceDiagram
    actor Creator
    participant API as Upload Service
    participant Store as Object Storage
    participant Trans as Transcoding Farm
    participant Mod as AI Moderation
    participant CDN3 as CDN
    participant Feed2 as Feed Service

    Creator->>API: Upload video (raw, 50MB)
    API->>Store: Store original
    API->>Trans: Transcode job queued
    
    par Parallel processing
        Trans->>Trans: Generate: 1080p, 720p, 480p, 360p
        Trans->>Trans: Generate thumbnail + preview
        Mod->>Mod: Check for: nudity, violence, copyright
    end
    
    Mod-->>API: ✅ Approved (or flagged for human review)
    Trans-->>CDN3: Push transcoded files to edge
    API->>Feed2: Video ready! Start showing in For You feed
    
    Note over Feed2: Initially shown to small test group<br/>Algorithm decides whether to promote
```

---

## 📱 Feed Loading (Client Pre-buffer Strategy)

```mermaid
graph TD
    subgraph "What the user sees"
        Current["Currently watching Video 3"]
    end
    
    subgraph "What's happening behind the scenes"
        Buffer["Already buffered:<br/>Video 4 (full), Video 5 (first 3s), Video 6 (first 3s)"]
        Prefetch["Prefetching next batch from recommendation API"]
    end
    
    Current --> Buffer
    
    Note["When user swipes up:<br/>Instant playback (already loaded!)<br/>Start buffering Video 7, 8, 9<br/>Report engagement on Video 3 to algorithm"]
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Feed algorithm | Pure algorithmic (not social graph) | Discovery > friends; virality potential |
| Video delivery | Aggressive pre-buffering (next 3 videos) | Instant swipe UX; uses more data but feels magical |
| Moderation | AI first, humans for edge cases | 10M uploads/day impossible to review manually |
| Upload processing | Async pipeline | Creator gets "processing" status; video live in ~minutes |
| Trending detection | Real-time engagement scoring | Fast trend cycles (hours, not days) |

---

## 🚀 Scaling

| Challenge | Solution |
|-----------|----------|
| 10B views/day | CDN caches popular videos; adaptive bitrate |
| Personalization for 1B users | Pre-compute candidate sets; real-time ranking at serve time |
| 10M uploads/day | Distributed transcoding farm (auto-scales) |
| Cold start (new users) | Start with popular/trending; learn preferences in ~30 swipes |
| Cold start (new videos) | Small batch testing system described above |
| Storage (petabytes) | Tiered: hot (CDN) → warm (SSD) → cold (HDD) based on view count |
