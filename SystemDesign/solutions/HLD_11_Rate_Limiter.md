# HLD 11: Design a Rate Limiter

## 💡 Quick Summary

> **What**: A system that limits how many requests a user/IP can make in a given time window, protecting APIs from abuse and overload.  
> **Key Insight**: Multiple algorithms exist (Token Bucket, Sliding Window, Fixed Window). The choice depends on whether you need smooth rate limiting or simple counting.

---

## 🎯 The Problem in Simple Terms

Without rate limiting:
- A bot can hit your API 10,000 times/second → crashes your service
- One user can hog all resources → other users suffer
- DDoS attacks can overwhelm servers

With rate limiting:
- "You can make 100 requests/minute. After that, you get HTTP 429 (Too Many Requests)."

---

## 📋 Requirements

| Feature | Detail |
|---------|--------|
| Limit by user/IP | Track requests per client |
| Configurable rules | Different limits per endpoint, plan |
| Distributed | Works across multiple API servers |
| Low latency | < 1ms overhead per request |
| Accurate | No significant over-counting or under-counting |

### Scale
```
Requests: 10M/second across all APIs
Users: 100M+ 
Rules: Different limits per API endpoint & user tier
Latency added: < 1ms per check
```

---

## 🏗️ Where Does It Sit?

```mermaid
graph LR
    Client[Client Request] --> RL{Rate Limiter<br/>Allow or Reject?}
    RL -->|"✅ Under limit"| API[API Server<br/>Process request]
    RL -->|"❌ Over limit"| Reject[HTTP 429<br/>Too Many Requests]
    RL --> Redis[(Redis<br/>Counter storage)]
```

---

## 🔍 Algorithm 1: Token Bucket (Most Popular ✅)

### How It Works (Think of a Bucket of Tokens)

```mermaid
graph TD
    subgraph "Token Bucket Concept"
        Bucket["🪣 Bucket<br/>Capacity: 10 tokens<br/>Currently: 7 tokens"]
        Refill["⏱️ Refill Rate<br/>Add 2 tokens/second"]
        Request["📨 Each request<br/>takes 1 token"]
    end
    
    Refill -->|"Every second"| Bucket
    Bucket -->|"Has tokens?"| Allow["✅ Allow request<br/>Remove 1 token"]
    Bucket -->|"Empty!"| Deny["❌ Reject request<br/>429 Too Many Requests"]
```

### Visual Example (Timeline)

```mermaid
graph LR
    subgraph "Time → (bucket capacity=5, refill=1/sec)"
        T0["t=0<br/>🪙🪙🪙🪙🪙<br/>5 tokens"]
        T1["t=0.1<br/>3 requests arrive<br/>🪙🪙<br/>2 tokens left"]
        T2["t=1.0<br/>Refill +1<br/>🪙🪙🪙<br/>3 tokens"]
        T3["t=1.2<br/>4 requests arrive<br/>3 allowed ✅<br/>1 rejected ❌"]
    end
    
    T0 --> T1 --> T2 --> T3
```

**Why Token Bucket is great:**
- Allows short bursts (if bucket is full, you can use all tokens at once)
- Smooth long-term rate (refill rate = sustained throughput)
- Simple to implement

---

## 🔍 Algorithm 2: Sliding Window Counter

```mermaid
graph TD
    subgraph "Fixed Window Problem"
        W1["Window 1: 0:00-1:00<br/>Limit: 100 requests<br/>User sends 100 at 0:59"]
        W2["Window 2: 1:00-2:00<br/>Limit: 100 requests<br/>User sends 100 at 1:01"]
        Problem["⚠️ 200 requests in 2 seconds!<br/>Crosses window boundary"]
    end
```

```mermaid
graph TD
    subgraph "Sliding Window Fixes This"
        SW["Look at the LAST 60 seconds<br/>from current time (sliding)"]
        Count["Count requests in that window"]
        Check{"> 100?"}
        Check -->|Yes| Block["❌ Reject"]
        Check -->|No| Allow2["✅ Allow"]
    end
```

---

## 🏗️ Distributed Rate Limiter Architecture

```mermaid
graph TB
    subgraph "Multiple API Servers"
        S1[API Server 1]
        S2[API Server 2]
        S3[API Server 3]
    end
    
    subgraph "Shared Counter (Redis)"
        Redis[(Redis Cluster<br/>user:123:api:posts → count=47<br/>TTL = 60 seconds)]
    end
    
    S1 & S2 & S3 -->|"INCR + EXPIRE"| Redis
    
    Note["All servers share the same counter<br/>User can't bypass by hitting different servers"]
```

### Request Flow

```mermaid
sequenceDiagram
    actor Client
    participant API as API Server
    participant Redis as Redis

    Client->>API: GET /api/posts
    API->>Redis: INCR user:123:minute:1705593600
    Redis-->>API: Current count: 47
    
    API->>API: Is 47 < limit (100)?
    
    alt Under limit
        API-->>Client: 200 OK + data
        Note over Client,API: Headers: X-RateLimit-Remaining: 53
    else Over limit
        API-->>Client: 429 Too Many Requests
        Note over Client,API: Headers: Retry-After: 23 seconds
    end
```

---

## 📏 Rate Limiting Rules (Examples)

```mermaid
graph TB
    subgraph "Different limits per tier"
        Free["Free Tier<br/>100 req/min<br/>1000 req/day"]
        Pro["Pro Tier<br/>1000 req/min<br/>50,000 req/day"]
        Enterprise["Enterprise<br/>10,000 req/min<br/>Unlimited daily"]
    end
    
    subgraph "Different limits per endpoint"
        Login["POST /login<br/>5 attempts/min<br/>(prevent brute force)"]
        Search["GET /search<br/>30 req/min<br/>(expensive query)"]
        Read["GET /posts<br/>300 req/min<br/>(cheap read)"]
    end
```

---

## 📊 Algorithm Comparison

| Algorithm | Burst Handling | Memory | Accuracy | Best For |
|-----------|---------------|--------|----------|----------|
| **Token Bucket** ✅ | Allows bursts up to bucket size | Low (2 values per user) | Good | APIs with burst tolerance |
| Fixed Window | Edge-case: 2x burst at boundary | Low | Moderate | Simple use cases |
| Sliding Window Log | No bursts allowed | High (stores timestamps) | Perfect | Strict rate limiting |
| Sliding Window Counter | Smoothed | Low | Good | Balance of accuracy & memory |

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Algorithm | Token Bucket | Allows bursts; simple; low memory |
| Storage | Redis (centralized) | Shared state across all API servers; fast |
| Granularity | Per-user + per-IP + per-endpoint | Defense in depth; different limits per dimension |
| Exceeded response | 429 + Retry-After header | Client knows when to retry |
| Race conditions | Redis Lua script (atomic) | INCR + check in one atomic operation |
| Failure mode | Fail open (allow) | Better to allow some excess than block legitimate traffic |

---

## 🚀 Scaling & Edge Cases

| Challenge | Solution |
|-----------|----------|
| Distributed counting (race condition) | Redis Lua script: atomic INCR + TTL |
| Redis failure | Fail open; local in-memory fallback |
| Multiple rate dimensions | Hierarchical: check IP → user → endpoint |
| Clock drift across servers | Use Redis server time (single source of truth) |
| Memory for millions of users | Redis expires keys automatically (TTL) |
