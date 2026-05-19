# HLD 10: Design a News Feed System (Facebook)

## 💡 Quick Summary

> **What**: A system that generates a personalized timeline showing posts from friends and pages you follow, ranked by relevance.  
> **Key Insight**: Same fan-out problem as Twitter, but with a heavier ranking component. Facebook uses a complex ML model to decide what you see (not just chronological).

---

## 🎯 The Problem in Simple Terms

When you open Facebook, your News Feed shows posts from friends, groups, and pages — but NOT everything. An average user has 1,500+ potential posts but only sees ~300. The system must:
1. **Collect** all candidate posts (from your connections)
2. **Rank** them by predicted engagement (what will YOU find interesting?)
3. **Serve** the top ones fast (< 500ms)

---

## 📋 Requirements

### What It Must Do
| Feature | Detail |
|---------|--------|
| Publish post | Text, images, videos, links |
| Generate feed | Personalized, ranked content |
| Real-time updates | New posts appear without refresh |
| Engagement | Like, comment, share |
| Diverse content | Mix of friends, pages, groups, ads |

### Scale Numbers
```
DAU: 2B+
Posts created/day: 4B+
Average friends per user: 338
Feed requests/second: 500,000+
Candidate posts per user: 1,500
Shown in feed: ~300 (ranked)
Feed load time: < 500ms
```

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "📝 Publishing (Write Path)"
        User1[User posts content] --> PostService[Post Service]
        PostService --> PostDB[(Post Storage)]
        PostService --> FanOut[Fan-out Service]
        FanOut --> FeedCache[(Feed Caches<br/>Pre-computed per user)]
    end

    subgraph "📰 Feed Generation (Read Path)"
        User2[User opens app] --> FeedService[Feed Service]
        FeedService --> FeedCache
        FeedService --> Ranker[Ranking Service<br/>ML Model]
        Ranker --> Aggregator[Aggregator<br/>Fetch post details]
        Aggregator --> PostDB
    end

    subgraph "🧠 Ranking Signals"
        Social[Social signals<br/>Friend closeness]
        Content[Content signals<br/>Type, freshness]
        User3[User signals<br/>Past behavior]
    end

    Social & Content & User3 --> Ranker
```

---

## 🔍 How Feed Generation Works (Two Steps)

### Step 1: Candidate Collection

```mermaid
graph TD
    subgraph "Where do feed candidates come from?"
        Friends["👫 Friends' posts<br/>(338 avg friends × recent posts)"]
        Pages["📄 Pages you follow<br/>(brands, celebrities)"]
        Groups["👥 Groups you're in"]
        Ads["💰 Ads (separate pipeline)"]
    end
    
    Friends & Pages & Groups & Ads --> Pool["Candidate Pool<br/>~1,500 posts"]
    Pool --> Rank["Ranking → Show ~300"]
```

### Step 2: Ranking (The ML Magic)

```mermaid
graph LR
    subgraph "Input Signals"
        A[How close is this friend?<br/>Do you interact often?]
        B[Post type?<br/>Photo > text usually]
        C[How old is the post?<br/>Newer = higher]
        D[Engagement so far?<br/>Many likes = probably good]
        E[Your past behavior?<br/>Do you like similar posts?]
    end
    
    A & B & C & D & E --> ML[ML Ranking Model<br/>Predicts P(you'll engage)]
    ML --> Score["Score each candidate<br/>0.0 to 1.0"]
    Score --> Top["Show top 300<br/>in order of score"]
```

---

## 🔍 Complete Feed Request Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as Feed Service
    participant Cache as Feed Cache (Redis)
    participant Rank as Ranking Service
    participant Social as Social Graph
    participant Posts as Post Service

    User->>FE: GET /feed (open app)
    FE->>Cache: Get pre-computed candidate list for User
    Cache-->>FE: [post_ids: 101, 205, 342, 567, ...]
    
    FE->>Posts: Fetch full post data for these IDs
    Posts-->>FE: [{id:101, text:"...", author:"Alice", likes:42}, ...]
    
    FE->>Social: Get relationship scores (how close is user to each author?)
    Social-->>FE: {Alice: 0.8, Bob: 0.3, Page_X: 0.5}
    
    FE->>Rank: Rank these 1500 candidates for THIS user
    Rank->>Rank: Apply ML model with all signals
    Rank-->>FE: Ranked list [post_342, post_101, post_567, ...]
    
    FE-->>User: Here's your feed! (top 20 initially, paginate for more)
```

---

## 📬 Fan-Out Strategy (Hybrid, Same as Twitter)

```mermaid
graph TD
    NewPost[New Post Created] --> Check{Author's<br/>follower count?}
    
    Check -->|"< 5,000<br/>(normal user)"| Push["Fan-out on WRITE<br/>Push post_id to all<br/>followers' feed caches"]
    Check -->|"> 5,000<br/>(celebrity/page)"| Pull["Fan-out on READ<br/>Merge at feed generation time"]
    
    Push --> Ready["Follower's cached feed<br/>already has the post<br/>⚡ Instant on app open"]
    Pull --> Merge["Fetch celebrity posts<br/>on demand when user<br/>requests their feed"]
```

### Fan-out on Write (The Push Path)

```mermaid
sequenceDiagram
    participant Alice as Alice (500 friends)
    participant Post as Post Service
    participant Kafka as Message Queue
    participant Workers as Fan-out Workers
    participant Cache as Redis (Feed Caches)

    Alice->>Post: Create new post
    Post->>Kafka: Event: "Alice posted (post_id=101)"
    Kafka->>Workers: Process fan-out
    Workers->>Workers: Get Alice's friend list: [Bob, Carol, Dave, ...]
    
    loop For each of Alice's 500 friends
        Workers->>Cache: Prepend post_101 to friend's feed list
    end
    
    Note over Workers,Cache: 500 Redis writes<br/>Takes ~50ms total
```

---

## 🧠 Ranking Signals Deep Dive

| Signal Category | Examples | Weight |
|----------------|----------|--------|
| **Relationship** | How often you message/tag this person | Very High |
| **Content Type** | Video > Photo > Link > Text (varies by user) | High |
| **Recency** | Newer posts score higher | High |
| **Engagement** | Posts with many likes/comments | Medium |
| **Creator Quality** | Does this page post spam? | Medium |
| **Diversity** | Don't show 5 posts from same person in a row | Medium |
| **Negative signals** | User hid similar posts before | High (negative) |

---

## 🗄️ Storage Architecture

```mermaid
graph TB
    subgraph "⚡ Feed Cache (Redis)"
        FCache["Per-user feed lists<br/>List of post_ids (last 1000)<br/>Most users: pre-computed"]
    end
    
    subgraph "📝 Posts (MySQL sharded)"
        PostDB["Posts table: id, author, content, media, timestamp<br/>Sharded by user_id (author)<br/>~4B new posts/day"]
    end
    
    subgraph "👥 Social Graph (TAO - custom)"
        Graph["Friendships, follows, blocks<br/>Bi-directional edges<br/>Cached aggressively"]
    end
    
    subgraph "🖼️ Media"
        Blob["Object Storage (S3)<br/>Images, videos<br/>Served via CDN"]
    end
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Feed approach | Hybrid (push for normal, pull for celebrities) | Push alone can't handle celebrities; pull alone is too slow |
| Ranking | ML model (not chronological) | Better engagement; users see what matters to them |
| Cache strategy | Pre-compute feed candidates | Can't rank 1500 posts from scratch in real-time for every request |
| Freshness | Slight delay acceptable (5-30s) | Trade-off for better ranking quality |
| Feed length | ~1000 candidates cached per user | Balance memory (2B users × 1000 IDs × 8 bytes = ~16TB Redis) |
| Consistency | Eventual | Post shows up in friend's feed within seconds (not instant) |

---

## 🚀 Scaling Challenges

| Challenge | Solution |
|-----------|----------|
| 2B users × 1500 candidates each | Pre-compute; store only post_ids in Redis (small) |
| 500K feed requests/second | Redis cluster + multiple replicas |
| Ranking latency | Pre-filter to top ~500, then rank (not all 1500) |
| Celebrity fan-out | Pull-based; merge their posts at read time |
| Real-time updates | Long polling / SSE for new posts notification |
| ML model inference | Model servers with batch prediction; cache predictions |
