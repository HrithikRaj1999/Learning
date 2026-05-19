# HLD 02: Design Twitter / X (Social Feed)

## 💡 Quick Summary

> **What**: A social platform where users post short messages (tweets), follow others, and see a personalized timeline.  
> **Key Insight**: The main challenge is the "fan-out" problem — when a celebrity with 50M followers tweets, how do you deliver it to all of them in real-time?

---

## 🎯 The Problem in Simple Terms

When you open Twitter, you see a feed of tweets from people you follow. Sounds simple, but:
- 500M tweets/day are posted
- Some users have 50M+ followers
- Your timeline must load in < 200ms
- Tweets appear in near real-time

The question: Do you **pull** tweets when a user opens their feed, or **push** tweets to all followers when someone posts?

---

## 📋 Requirements

### What It Must Do
| Feature | Detail |
|---------|--------|
| Post tweet | Text (280 chars), images, videos |
| Timeline | See tweets from people you follow |
| Follow/Unfollow | Subscribe to other users |
| Like & Retweet | Engage with tweets |
| Search | Find tweets by keyword/hashtag |
| Notifications | Alerts for mentions, likes, follows |

### Scale Numbers
```
DAU: 300M users
Tweets/day: 500M (avg user reads 100+ tweets/session)
Reads:Writes = 1000:1 (read VERY heavy)
Celebrity: 1 user can have 50M followers
Timeline load: < 200ms
```

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "👤 Users"
        Mobile[Mobile App]
        Web[Web Browser]
    end

    subgraph "🌐 Gateway"
        LB[Load Balancer]
        API[API Gateway]
    end

    subgraph "⚙️ Core Services"
        Tweet[Tweet Service<br/>Post & store tweets]
        Timeline[Timeline Service<br/>Build user feeds]
        User[User Service<br/>Profiles & follows]
        Search[Search Service<br/>Full-text search]
        Notify[Notification Service]
    end

    subgraph "📬 Fan-out System"
        FO[Fan-out Service]
        Queue[Message Queue<br/>Kafka]
    end

    subgraph "🗄️ Storage"
        TweetDB[(Tweet Store<br/>All tweets)]
        TimelineCache[(Timeline Cache<br/>Redis - per user)]
        GraphDB[(Social Graph<br/>Who follows whom)]
        SearchIdx[(Search Index<br/>Elasticsearch)]
    end

    Mobile & Web --> LB --> API
    API --> Tweet & Timeline & User & Search
    Tweet --> Queue --> FO
    FO --> TimelineCache
    Timeline --> TimelineCache
    Tweet --> TweetDB
    User --> GraphDB
    Search --> SearchIdx
    Tweet --> Notify
```

---

## 🔍 The Fan-Out Problem (The Heart of Twitter)

### What is Fan-Out?

When User A posts a tweet, it must appear in the timeline of ALL their followers. This is "fan-out."

```mermaid
graph TD
    subgraph "Celebrity posts a tweet"
        Celeb[🌟 Celebrity<br/>50M followers]
    end
    
    subgraph "Fan-out: deliver to all followers"
        Celeb --> F1[👤 Follower 1's timeline]
        Celeb --> F2[👤 Follower 2's timeline]
        Celeb --> F3[👤 Follower 3's timeline]
        Celeb --> FN[👤 ... 50M timelines!]
    end
```

### Two Approaches:

```mermaid
graph LR
    subgraph "Approach 1: Fan-out on WRITE (Push)"
        A1[User posts tweet] --> B1[Immediately push to<br/>ALL followers' caches]
        B1 --> C1[Timeline ready instantly<br/>when follower opens app]
    end
```

```mermaid
graph LR
    subgraph "Approach 2: Fan-out on READ (Pull)"
        A2[Follower opens app] --> B2[Query all users<br/>they follow]
        B2 --> C2[Merge & sort tweets<br/>on the fly]
    end
```

### Our Solution: Hybrid Approach ✅

```mermaid
graph TD
    Tweet[New Tweet Posted] --> Check{How many followers<br/>does author have?}
    
    Check -->|"< 10,000 followers<br/>(99% of users)"| Push[Fan-out on WRITE<br/>Push to all follower caches]
    Check -->|"> 10,000 followers<br/>(celebrities)"| Pull[Fan-out on READ<br/>Merge at read time]
    
    Push --> Cache[Pre-built timeline<br/>in Redis ⚡]
    Pull --> Merge[Merge celebrity tweets<br/>when user opens feed]
    
    Cache --> Final[User sees timeline]
    Merge --> Final
```

**Why hybrid?**
- Normal users (99%): Push is fine — 500 followers × 1 write = fast
- Celebrities: Push would mean 50M writes per tweet = too slow! Pull on demand instead.

---

## 🔍 How Timeline Generation Works

```mermaid
sequenceDiagram
    actor User as User Opens App
    participant TL as Timeline Service
    participant Cache as Redis Timeline Cache
    participant Tweet as Tweet Service
    participant Graph as Social Graph

    User->>TL: GET /timeline
    TL->>Cache: Get pre-built timeline for User
    Cache-->>TL: [tweet_id_1, tweet_id_5, tweet_id_9, ...]
    
    Note over TL: Merge with celebrity tweets
    TL->>Graph: Who does User follow that's a celebrity?
    Graph-->>TL: [celebrity_A, celebrity_B]
    TL->>Tweet: Get recent tweets from celebrity_A, celebrity_B
    Tweet-->>TL: [celeb_tweet_1, celeb_tweet_2]
    
    TL->>TL: Merge + Sort by time + Rank by relevance
    TL-->>User: Here's your timeline! (200ms)
```

---

## 🗄️ Data Storage

### What Goes Where?

```mermaid
graph TB
    subgraph "Redis (Hot Data - in memory)"
        R1[User timelines<br/>Last 800 tweet IDs per user]
        R2[Tweet counts<br/>Likes, retweets]
        R3[User sessions]
    end
    
    subgraph "MySQL/Postgres (Structured Data)"
        M1[User profiles]
        M2[Follow relationships]
        M3[Tweet metadata]
    end
    
    subgraph "Object Storage - S3"
        S1[Images]
        S2[Videos]
    end
    
    subgraph "Elasticsearch"
        E1[Tweet text index<br/>for search & hashtags]
    end
```

### Tweet Table (Sharded by user_id)
```
tweet_id | user_id | content | media_urls | created_at | like_count | retweet_count
```

### Social Graph (Who follows whom)
```
follower_id | followee_id | created_at
```
Indexed BOTH ways: "who do I follow?" and "who follows me?"

---

## ⚡ How a Tweet Gets Published

```mermaid
sequenceDiagram
    actor Author
    participant API as Tweet Service
    participant DB as Tweet DB
    participant Queue as Kafka
    participant FanOut as Fan-out Workers
    participant Cache as Redis Timelines

    Author->>API: POST "Hello world!"
    API->>DB: Store tweet
    API-->>Author: ✅ Tweet posted!
    
    API->>Queue: Publish event: {tweet_id, author_id}
    
    Note over Queue,FanOut: Async (doesn't block user)
    Queue->>FanOut: Process fan-out
    FanOut->>FanOut: Get author's follower list
    
    loop For each follower (< 10K followers)
        FanOut->>Cache: Prepend tweet_id to follower's timeline
    end
    
    Note over FanOut: Takes ~5 seconds for 10K followers
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Fan-out strategy | Hybrid (push + pull) | Push can't handle celebrities; pull is too slow for everyone |
| Timeline storage | Redis (in-memory) | Must load in < 200ms; RAM is fast |
| Tweet storage | Sharded SQL | Need indexes, counters, structured queries |
| Ordering | Time-based + ranking | Pure chronological is too noisy; add relevance |
| Consistency | Eventual | OK if tweet appears 2-5s late in feeds |

---

## 🚀 Scaling Bottlenecks & Solutions

| Bottleneck | Solution |
|------------|----------|
| Celebrity tweet fan-out | Pull-based for accounts > 10K followers |
| Timeline cache size | Only keep last 800 tweets per user; paginate |
| Hot tweets (viral) | Separate cache for trending tweets |
| Search at scale | Elasticsearch cluster with sharding by time |
| Media storage | S3 + CDN for images/videos |
| Thundering herd (events) | Rate limit fan-out workers; queue buffering |
