# HLD 26: Design a CDN (Content Delivery Network)

## 💡 Quick Summary

> **What**: A globally distributed network of servers that caches and serves content (images, videos, static files) from locations physically close to users.  
> **Key Insight**: Physics limits speed — light takes 130ms to cross the world. A CDN puts copies of content within 20ms of every user. The challenge is keeping cached content fresh while maximizing cache hit ratio.

---

## 🎯 The Problem in Simple Terms

Without CDN: User in Tokyo requests image from server in Virginia → 200ms round trip, server overloaded.

With CDN: Same image is cached at Tokyo edge server → 5ms response, origin server barely touched.

---

## 📋 Requirements

| Feature | Detail |
|---------|--------|
| Cache & serve static content | Images, CSS, JS, videos |
| Global distribution | Edge servers in 100+ cities |
| Cache invalidation | Update content when origin changes |
| SSL/TLS termination | HTTPS at the edge |
| DDoS protection | Absorb attacks at edge |
| Load balancing | Distribute traffic across edges |

### Scale
```
Edge locations: 300+ (globally)
Requests/second: 100M+
Bandwidth: 100+ Tbps
Cache hit ratio target: 95%+
Content size: petabytes cached globally
Latency target: < 50ms to any user worldwide
```

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "👥 Users (worldwide)"
        User1[User in Tokyo]
        User2[User in London]
        User3[User in NYC]
    end

    subgraph "🌍 DNS Routing"
        DNS[DNS Resolver<br/>Routes to nearest edge]
    end

    subgraph "📡 Edge Servers (PoPs)"
        Edge1[Tokyo PoP<br/>Cache + TLS]
        Edge2[London PoP<br/>Cache + TLS]
        Edge3[NYC PoP<br/>Cache + TLS]
    end

    subgraph "🏢 Origin Shield (Mid-tier)"
        Shield[Shield Cache<br/>Protects origin from<br/>thundering herd]
    end

    subgraph "🏠 Origin Server"
        Origin[Customer's Server<br/>Source of truth]
    end

    User1 --> DNS --> Edge1
    User2 --> DNS --> Edge2
    User3 --> DNS --> Edge3
    Edge1 & Edge2 & Edge3 -->|Cache MISS| Shield
    Shield -->|Cache MISS| Origin
```

---

## 🔍 Request Flow: Cache Hit vs Miss

```mermaid
sequenceDiagram
    actor User
    participant DNS2 as DNS
    participant Edge as Edge Server (nearest)
    participant Shield2 as Origin Shield
    participant Origin2 as Origin Server

    User->>DNS2: Resolve cdn.example.com
    DNS2-->>User: IP of nearest edge (Tokyo)
    
    User->>Edge: GET /images/hero.jpg
    
    alt Cache HIT (95% of requests)
        Edge-->>User: 200 OK (from cache, 5ms)
    else Cache MISS
        Edge->>Shield2: GET /images/hero.jpg
        alt Shield has it
            Shield2-->>Edge: 200 OK (from shield cache)
        else Shield miss too
            Shield2->>Origin2: GET /images/hero.jpg
            Origin2-->>Shield2: 200 OK + Cache-Control headers
            Shield2->>Shield2: Cache it (protect origin)
            Shield2-->>Edge: 200 OK
        end
        Edge->>Edge: Cache it locally
        Edge-->>User: 200 OK (slower first time: ~100ms)
    end
```

---

## 🌐 DNS-Based Routing (How Users Reach Nearest Edge)

```mermaid
graph TD
    subgraph "How cdn.example.com resolves differently per user"
        Tokyo_User["User in Tokyo<br/>DNS query → cdn.example.com"]
        London_User["User in London<br/>DNS query → cdn.example.com"]
    end
    
    subgraph "GeoDNS Resolution"
        GeoDNS["GeoDNS Server<br/>Checks requestor's IP location<br/>Returns nearest edge IP"]
    end
    
    Tokyo_User --> GeoDNS -->|"Returns Tokyo edge IP"| Tokyo_Edge["103.2.1.1 (Tokyo PoP)"]
    London_User --> GeoDNS -->|"Returns London edge IP"| London_Edge["185.5.3.2 (London PoP)"]
```

---

## ♻️ Cache Invalidation Strategies

```mermaid
graph TD
    subgraph "Strategy 1: TTL (Time-To-Live)"
        TTL["Cache-Control: max-age=3600<br/>Edge serves cached version for 1 hour<br/>After expiry: re-validate with origin"]
    end
    
    subgraph "Strategy 2: Purge API"
        Purge["Customer calls: POST /purge /images/hero.jpg<br/>CDN invalidates across ALL edges<br/>Next request fetches fresh copy"]
    end
    
    subgraph "Strategy 3: Versioned URLs (best practice)"
        Version["Instead of: /style.css<br/>Use: /style.v2.css or /style.css?v=abc123<br/>New URL = new cache entry<br/>No invalidation needed!"]
    end
```

---

## 🛡️ Origin Shield (Why Two Layers of Cache)

```mermaid
graph TD
    subgraph "Without Shield: Thundering Herd"
        Problem2["Popular new video published<br/>300 edge servers ALL cache miss<br/>300 simultaneous requests to origin<br/>Origin crashes 💀"]
    end
    
    subgraph "With Shield: Protected Origin"
        Solution2["300 edge servers miss → all ask Shield<br/>Shield misses → ONE request to origin<br/>Shield caches → serves to all 300 edges<br/>Origin handles only 1 request ✅"]
    end
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Routing | GeoDNS (geographic) | Simple; gets users to nearby edge |
| Alternative routing | Anycast IP | Same IP announced from multiple locations; BGP routes to nearest |
| Invalidation | TTL + purge API + versioned URLs | Combination handles all use cases |
| Cache layers | Edge + Shield (2-tier) | Protect origin; improve hit ratio |
| Cache eviction | LRU (Least Recently Used) | Simple; works well for web content |
| HTTPS | Terminate TLS at edge | Reduces latency (TLS handshake happens locally) |

---

## 🚀 Scaling

| Challenge | Solution |
|-----------|----------|
| Global coverage | 300+ PoPs; add more in underserved regions |
| Cache hit ratio | Origin shield; long TTLs; pre-warming popular content |
| DDoS attacks | Absorb at edge (distributed); rate limiting |
| Content updates | Purge propagation in < 5 seconds globally |
| Video streaming | Chunked delivery; adaptive bitrate at edge |
| Cost | Tiered pricing; hot content on SSD, cold on HDD |
