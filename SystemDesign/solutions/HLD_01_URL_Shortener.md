# HLD 01: Design a URL Shortener (like TinyURL / Bit.ly)

## 💡 Quick Summary

> **What**: A service that converts long URLs into short ones (e.g., `bit.ly/abc123`) and redirects users back.  
> **Key Insight**: The core challenge is generating unique short codes at scale without collisions, while handling 100:1 read-to-write ratio.

---

## 🎯 The Problem in Simple Terms

Imagine you have a really long URL like:
```
https://www.amazon.com/dp/B09V3KXJPB?ref=myi_title_dp&th=1&psc=1
```

You want to share it on Twitter (character limit!) or verbally tell someone. A URL shortener gives you:
```
https://short.ly/x7Km9p
```

When anyone clicks this short URL → they get redirected to the original long URL.

---

## 📋 Requirements

### What It Must Do (Functional)
| Feature | Detail |
|---------|--------|
| Shorten URL | User gives long URL → gets short URL back |
| Redirect | Anyone clicks short URL → goes to original |
| Custom aliases | User can pick their own short code (optional) |
| Expiration | URLs can expire after X days |
| Analytics | Track clicks, location, device |

### How Well It Must Do It (Non-Functional)
| Quality | Target | Why |
|---------|--------|-----|
| Availability | 99.99% | Broken redirects = broken internet |
| Latency | < 50ms redirect | Users won't wait |
| Scale | 100M daily users | Think billions of URLs |

### 📊 Back-of-Napkin Math

```
Writes: 1M new URLs/day = ~12/second
Reads:  100M redirects/day = ~1,200/second (peak: ~6,000/sec)
Storage: 1M × 500 bytes × 365 days × 5 years ≈ 900 GB
Short code: 7 chars of Base62 = 62⁷ = 3.5 TRILLION combos ✓
```

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "👤 User"
        Client[Browser / Mobile App]
    end

    subgraph "🌐 Entry Point"
        DNS[DNS - Route 53]
        CDN[CDN - CloudFront]
        LB[Load Balancer]
    end

    subgraph "⚙️ Application Layer"
        Write[Write Service<br/>Creates short URLs]
        Read[Read Service<br/>Handles redirects]
    end

    subgraph "🗄️ Data Layer"
        Cache[(Redis Cache<br/>Hot URLs)]
        DB[(Database<br/>All URL mappings)]
    end

    subgraph "🔑 ID Generation"
        KGS[Key Generation Service]
        ZK[Zookeeper<br/>Range Allocation]
    end

    subgraph "📊 Analytics"
        Queue[Message Queue]
        Analytics[Analytics Pipeline]
    end

    Client --> DNS --> CDN --> LB
    LB --> Write
    LB --> Read
    Write --> KGS --> ZK
    Write --> DB
    Read --> Cache
    Cache -->|Miss| DB
    Read --> Queue --> Analytics
```

---

## 🔍 How It Works — Step by Step

### Creating a Short URL

```mermaid
sequenceDiagram
    actor User
    participant API as Write Service
    participant KGS as Key Generator
    participant DB as Database
    participant Cache as Redis

    User->>API: POST /shorten {url: "https://very-long-url.com/..."}
    API->>API: Validate URL (is it real? not malicious?)
    API->>KGS: Give me a unique short code
    KGS-->>API: "x7Km9p"
    API->>DB: Store mapping: x7Km9p → long URL
    API->>Cache: Also cache it (hot data)
    API-->>User: ✅ Here's your short URL: short.ly/x7Km9p
```

### Redirecting (The Hot Path — must be FAST)

```mermaid
sequenceDiagram
    actor User
    participant LB as Load Balancer
    participant API as Read Service
    participant Cache as Redis Cache
    participant DB as Database

    User->>LB: GET short.ly/x7Km9p
    LB->>API: Forward request
    API->>Cache: Lookup "x7Km9p"
    
    alt Cache HIT (99% of cases)
        Cache-->>API: "https://very-long-url.com/..."
    else Cache MISS
        API->>DB: Lookup "x7Km9p"
        DB-->>API: "https://very-long-url.com/..."
        API->>Cache: Store for next time
    end
    
    API-->>User: 301 Redirect → original URL
```

---

## 🔑 The Hardest Part: Generating Unique Short Codes

### Option 1: Counter-Based (Our Choice ✅)

```mermaid
graph LR
    subgraph "Zookeeper divides number ranges"
        ZK[Zookeeper]
        ZK -->|"Range 1-1M"| S1[Server 1]
        ZK -->|"Range 1M-2M"| S2[Server 2]
        ZK -->|"Range 2M-3M"| S3[Server 3]
    end
    
    subgraph "Each server converts number to Base62"
        S1 -->|"1 → aB3x9p"| URL1[Short URL 1]
        S1 -->|"2 → cD5y2q"| URL2[Short URL 2]
    end
```

**Why this works**: Each server gets its own number range → no collisions, no coordination needed per request.

### Option 2: Hashing (Simpler but problematic)
- `MD5(long_url)` → take first 7 chars → check DB for collision
- **Problem**: Collisions require extra DB lookups

### Option 3: Random Generation
- Generate random 7-char string → check if exists → retry if taken
- **Problem**: As DB fills up, more collisions and retries

---

## 🗄️ Database Design

```mermaid
erDiagram
    URL_MAPPING {
        string short_code PK "x7Km9p"
        string long_url "https://..."
        datetime created_at
        datetime expires_at
        string user_id FK
    }
    
    ANALYTICS {
        string click_id PK
        string short_code FK
        datetime clicked_at
        string country
        string device_type
    }
    
    URL_MAPPING ||--o{ ANALYTICS : "has clicks"
```

**Why DynamoDB/Cassandra?** Simple key→value lookups, massive horizontal scaling, no complex joins needed.

---

## ⚡ Caching Strategy

```mermaid
graph TD
    A[Request for short.ly/x7Km9p] --> B{In Redis Cache?}
    B -->|"✅ HIT (99%)"| C[Return URL<br/>⚡ 2ms]
    B -->|"❌ MISS (1%)"| D[Query Database<br/>~20ms]
    D --> E[Store in Cache<br/>TTL = 24 hours]
    E --> C
```

**Key insight**: Top 20% of URLs get 80% of traffic (Pareto principle). We only need to cache the popular ones.

---

## 📊 Key Trade-offs

| Decision | We Chose | Alternative | Why |
|----------|----------|-------------|-----|
| ID generation | Counter + Base62 | Random/Hash | Zero collisions, predictable |
| Database | NoSQL (DynamoDB) | SQL (PostgreSQL) | Simple key-value, massive scale |
| Redirect code | 301 (permanent) | 302 (temporary) | Better for SEO, less analytics visibility |
| Consistency | Eventual | Strong | OK: new URL works within ~1 second |

---

## 🚀 Scaling Strategy

```mermaid
graph TB
    subgraph "Horizontal Scaling"
        LB[Load Balancer]
        LB --> S1[Server 1]
        LB --> S2[Server 2]
        LB --> S3[Server N...]
    end
    
    subgraph "Database Sharding by first char"
        S1 --> ShardA["Shard: a-m"]
        S2 --> ShardB["Shard: n-z"]
    end
    
    subgraph "Multi-Region Replication"
        US[US-East Primary] -.->|Async Replicate| EU[EU-West Replica]
        US -.->|Async Replicate| AP[Asia-Pacific Replica]
    end
```

**How we handle 100M+ daily users:**
1. **CDN caches** 301 redirects at edge (most traffic never hits our servers)
2. **Redis cluster** serves 99% of remaining requests from memory
3. **Database shards** by short code prefix for write distribution
4. **Read replicas** per region for global low latency
