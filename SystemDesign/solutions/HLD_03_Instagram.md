# HLD 03: Design Instagram (Photo Sharing)

## 💡 Quick Summary

> **What**: A photo/video sharing platform where users post content, follow others, and browse a personalized feed.  
> **Key Insight**: This is a read-heavy, media-heavy system. The challenge is serving billions of images fast (CDN + storage) and generating personalized feeds at scale.

---

## 🎯 The Problem in Simple Terms

Instagram handles:
- 100M+ photos uploaded daily
- 2B+ monthly active users browsing feeds
- Each photo needs multiple sizes (thumbnail, medium, full)
- Feed must be personalized and fast (< 300ms)

Think of it as: Twitter's feed problem + massive media storage + image processing pipeline.

---

## 📋 Requirements

### What It Must Do
| Feature | Detail |
|---------|--------|
| Upload photo/video | With captions, tags, location |
| News Feed | Personalized feed from followed users |
| Stories | 24-hour disappearing content |
| Like & Comment | Engage with posts |
| Explore | Discover new content (recommendation) |
| Direct Messages | Private messaging |

### Scale Numbers
```
Users: 2B monthly, 500M daily active
Uploads: 100M photos/day, 20M videos/day
Storage per photo: 5 sizes × 500KB avg = 2.5MB per upload
Daily new storage: 100M × 2.5MB = 250 TB/day!
Read:Write = 100:1
Feed latency: < 300ms
```

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "👤 Client"
        App[Mobile App / Web]
    end

    subgraph "🌐 Edge"
        CDN[CDN - CloudFront<br/>Serves 90% of images]
        LB[Load Balancer]
    end

    subgraph "⚙️ Services"
        Upload[Upload Service<br/>Handle new posts]
        Feed[Feed Service<br/>Generate timeline]
        User[User Service<br/>Profiles, follows]
        Story[Story Service<br/>24hr content]
        Search[Search/Explore]
    end

    subgraph "🖼️ Media Pipeline"
        Queue[Processing Queue]
        Resize[Image Resizer<br/>Generate thumbnails]
        S3[(Object Storage<br/>S3 - All media)]
    end

    subgraph "🗄️ Data"
        PostDB[(Posts Database)]
        FeedCache[(Feed Cache<br/>Redis)]
        GraphDB[(Social Graph)]
    end

    App --> CDN
    App --> LB --> Upload & Feed & User & Story
    Upload --> Queue --> Resize --> S3
    Feed --> FeedCache
    CDN --> S3
    Upload --> PostDB
    User --> GraphDB
```

---

## 🔍 How Photo Upload Works

```mermaid
sequenceDiagram
    actor User
    participant App as Mobile App
    participant API as Upload Service
    participant S3 as Object Storage
    participant Queue as Processing Queue
    participant Resize as Image Processor
    participant DB as Post Database
    participant Fan as Feed Fan-out

    User->>App: Take photo + add caption
    App->>API: Upload image (multipart)
    API->>S3: Store original image
    S3-->>API: ✅ stored at s3://photos/original/abc123.jpg
    
    API->>DB: Create post record (user_id, caption, image_url, timestamp)
    API-->>User: ✅ Post published!
    
    Note over API,Resize: Async processing (user doesn't wait)
    API->>Queue: Process image job
    Queue->>Resize: Generate multiple sizes
    Resize->>S3: Store thumbnail (150×150)
    Resize->>S3: Store medium (600×600)
    Resize->>S3: Store large (1080×1080)
    
    API->>Fan: Fan-out to followers' feeds
```

### Image Sizes Generated

```mermaid
graph LR
    Original[📷 Original<br/>4032×3024<br/>3MB] --> T1[Thumbnail<br/>150×150<br/>15KB]
    Original --> T2[Medium<br/>600×600<br/>100KB]
    Original --> T3[Large<br/>1080×1080<br/>300KB]
    Original --> T4[Story Size<br/>1080×1920<br/>400KB]
```

---

## 📰 How the Feed Works

### Feed Generation (Same hybrid approach as Twitter)

```mermaid
graph TD
    Open[User opens Instagram] --> TL[Feed Service]
    TL --> Cache{Pre-built feed<br/>in Redis?}
    
    Cache -->|"✅ Yes"| Serve[Serve cached feed<br/>⚡ instant]
    Cache -->|"❌ No (cold start)"| Build[Build feed]
    
    Build --> GetFollows[Get list of followed users]
    GetFollows --> GetPosts[Get recent posts from each]
    GetPosts --> Rank[Rank by:<br/>• Recency<br/>• Engagement<br/>• Relationship<br/>• Content type]
    Rank --> Store[Cache in Redis]
    Store --> Serve
```

### Feed Ranking Signals

```mermaid
graph TB
    subgraph "🧠 Ranking Algorithm Inputs"
        Interest[Interest Score<br/>Do they like similar posts?]
        Recency[Recency<br/>How new is the post?]
        Relationship[Relationship<br/>How often do they interact?]
        Popularity[Popularity<br/>How many likes/comments?]
    end
    
    Interest & Recency & Relationship & Popularity --> Score[Final Score<br/>= weighted combination]
    Score --> Position[Position in Feed]
```

---

## 🗄️ Storage Architecture

```mermaid
graph TB
    subgraph "🖼️ Media (Biggest challenge)"
        S3[S3 - Object Storage<br/>Petabytes of images/videos]
        CDN2[CDN - 200+ edge locations<br/>Cache popular images close to users]
    end
    
    subgraph "📝 Metadata (Structured)"
        Postgres[PostgreSQL Sharded<br/>Posts, comments, users]
        Cassandra[Cassandra<br/>Feed data, activity]
    end
    
    subgraph "⚡ Cache (Speed)"
        Redis[Redis Cluster<br/>Feeds, counts, sessions]
        Memcache[Memcached<br/>Query results cache]
    end
    
    subgraph "🔍 Search"
        ES[Elasticsearch<br/>Hashtags, user search, explore]
    end
```

### How much storage?
```
100M photos/day × 2.5MB × 365 days = ~91 PB/year
With replication (3x) = ~273 PB/year
Cost at $0.023/GB/month = ~$75M/year just for storage!
```

---

## 📱 Stories (Disappearing Content)

```mermaid
sequenceDiagram
    actor User as User A Posts Story
    participant API as Story Service
    participant S3 as Storage
    participant Cache as Redis (TTL=24h)
    actor Viewer as User B Views Stories

    User->>API: Upload story (image/video)
    API->>S3: Store media
    API->>Cache: Add to User A's story list (TTL = 24 hours)
    
    Note over Cache: After 24 hours, automatically deleted from cache
    
    Viewer->>API: Get stories from followed users
    API->>Cache: Get active stories for followed users
    Cache-->>API: [story1, story2, story3] (only < 24hr old)
    API-->>Viewer: Display story carousel
```

**Key insight**: Stories use TTL (time-to-live) in Redis. After 24 hours, they just disappear from cache automatically. The media stays in S3 for a bit longer (backup) then gets garbage-collected.

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Image serving | CDN + S3 | CDN caches at edge; 90% of requests never hit origin |
| Feed strategy | Pre-computed + ranking | Can't compute at read time for 500M users |
| Multiple image sizes | Generate on upload | Costs storage but saves CPU on every view |
| Story storage | Redis with TTL | Auto-expiry, no cleanup jobs needed |
| Database | Sharded PostgreSQL | Instagram actually uses Postgres at massive scale |
| Consistency | Eventual for feed | OK if post appears 1-2s later in followers' feeds |

---

## 🚀 How It Scales

| Challenge | Solution |
|-----------|----------|
| 250 TB new images/day | S3 infinite storage + lifecycle policies |
| Serving images globally | 200+ CDN edge locations cache popular content |
| Feed for 500M daily users | Pre-computed feeds in Redis; hybrid fan-out |
| Hot posts (viral) | Separate trending cache; rate limit fan-out |
| Search & Explore | Elasticsearch + ML recommendation models |
| Database at scale | Shard by user_id; read replicas per region |
