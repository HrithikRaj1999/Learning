# HLD 15: Design a Distributed Cache (like Redis/Memcached)

## 💡 Quick Summary

> **What**: A distributed in-memory key-value store that sits between your application and database, dramatically reducing latency and database load.  
> **Key Insight**: The main challenges are cache invalidation ("the hardest problem in CS"), consistent hashing for distribution, and handling cache failures without cascading to the DB.

---

## 🎯 The Problem in Simple Terms

Database reads take 5-50ms. Memory reads take 0.1ms. If you can serve 90% of reads from memory:
- Your app is 50-500x faster for those reads
- Your database handles 10x less load
- Users get sub-millisecond responses

But distributed caching introduces: stale data, cache stampedes, memory limits, and partition challenges.

---

## 📋 Requirements

| Feature | Detail |
|---------|--------|
| GET/SET/DELETE | Basic key-value operations |
| TTL (expiration) | Auto-expire keys after time |
| Distributed | Spread data across N nodes |
| High availability | Handle node failures gracefully |
| Eviction | Remove old data when memory full (LRU, LFU) |
| Atomic operations | INCR, compare-and-swap |

### Scale
```
Data size: 100TB+ across cluster
Operations: 10M+ requests/second
Latency: < 1ms for GET/SET
Nodes: 100+ servers
Availability: 99.99%
Hit rate target: > 95%
```

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "Application Servers"
        App1[App Server 1]
        App2[App Server 2]
        App3[App Server N]
    end

    subgraph "Cache Layer (Distributed)"
        CH[Consistent Hash Ring<br/>Determines which node owns which key]
        N1[Cache Node 1<br/>Keys: a-f]
        N2[Cache Node 2<br/>Keys: g-m]
        N3[Cache Node 3<br/>Keys: n-z]
    end

    subgraph "Database"
        DB[(Primary Database<br/>Source of truth)]
    end

    App1 & App2 & App3 --> CH
    CH --> N1 & N2 & N3
    App1 & App2 & App3 -->|"Cache miss"| DB
```

---

## 🔍 How Cache Read Works (Cache-Aside Pattern)

```mermaid
sequenceDiagram
    actor App as Application
    participant Cache as Cache Node
    participant DB as Database

    App->>Cache: GET user:123
    
    alt Cache HIT ✅ (95% of the time)
        Cache-->>App: {name: "Alice", email: "..."}
        Note over App: Response in < 1ms!
    else Cache MISS ❌
        Cache-->>App: null (not found)
        App->>DB: SELECT * FROM users WHERE id=123
        DB-->>App: {name: "Alice", email: "..."}
        App->>Cache: SET user:123 = data (TTL=1 hour)
        Note over App: Response in ~20ms (DB hit)
        Note over App: Next request will be a cache hit!
    end
```

---

## ⭕ Consistent Hashing (How Keys Are Distributed)

### The Problem with Simple Hashing

```mermaid
graph TD
    subgraph "❌ Simple modulo: hash(key) % N nodes"
        Problem["If you add/remove a node (N changes)<br/>MOST keys move to different nodes<br/>= massive cache misses = DB overwhelmed"]
    end
```

### Consistent Hashing Solution

```mermaid
graph TD
    subgraph "Hash Ring (0 to 2^32)"
        Ring["Imagine a circle (ring) of numbers 0 to 4 billion"]
    end
    
    subgraph "Nodes placed on ring"
        NA["Node A at position 1000"]
        NB["Node B at position 3000"]
        NC["Node C at position 5000"]
    end
    
    subgraph "Keys go to next node clockwise"
        K1["Key 'user:1' hashes to 1500 → goes to Node B (next clockwise)"]
        K2["Key 'user:2' hashes to 4000 → goes to Node C"]
        K3["Key 'user:3' hashes to 800 → goes to Node A"]
    end
```

```mermaid
graph LR
    subgraph "When Node B dies"
        Before["Before: A handles 1/3, B handles 1/3, C handles 1/3"]
        After["After: Only B's keys move to C<br/>A's keys stay! C gets a bit more<br/>Only 1/3 of keys remapped (not all!)"]
    end
```

---

## 🔄 Cache Invalidation Strategies

### Strategy 1: TTL (Time-To-Live) — Simplest ✅

```mermaid
graph LR
    Set["SET user:123 data TTL=3600"] --> Timer["⏱️ After 1 hour"]
    Timer --> Expire["Key auto-deleted"]
    Expire --> NextRead["Next read = cache miss → refresh from DB"]
```

### Strategy 2: Write-Through (Strong Consistency)

```mermaid
sequenceDiagram
    actor App
    participant Cache as Cache
    participant DB as Database

    App->>Cache: Write: UPDATE user:123 name="Bob"
    Cache->>DB: Write to DB
    DB-->>Cache: ✅ DB updated
    Cache->>Cache: Update cache too
    Cache-->>App: ✅ Both updated
    
    Note over App,DB: Slower writes but cache always consistent
```

### Strategy 3: Write-Behind (Fast Writes, Eventual Consistency)

```mermaid
sequenceDiagram
    actor App
    participant Cache as Cache
    participant Queue as Write Queue
    participant DB as Database

    App->>Cache: Write: UPDATE user:123 name="Bob"
    Cache-->>App: ✅ Done! (fast response)
    Cache->>Queue: Queue DB write (async)
    
    Note over Queue,DB: Later (batched)...
    Queue->>DB: Batch write to DB
    
    Note over App,DB: Fast writes! But data could be lost if cache crashes before DB write
```

---

## ⚡ Cache Problems & Solutions

### Problem 1: Cache Stampede (Thundering Herd)

```mermaid
graph TD
    subgraph "❌ The Problem"
        Expire["Popular key expires"]
        R1["Request 1 → Cache miss → Hit DB"]
        R2["Request 2 → Cache miss → Hit DB"]
        R3["Request 3 → Cache miss → Hit DB"]
        R100["100 requests → ALL hit DB simultaneously!"]
        Crash["💥 Database overloaded!"]
        
        Expire --> R1 & R2 & R3 & R100 --> Crash
    end
```

```mermaid
graph TD
    subgraph "✅ Solution: Locking"
        Expire2["Popular key expires"]
        First["First request acquires lock<br/>Goes to DB, refreshes cache"]
        Rest["Other requests wait briefly<br/>Then read from refreshed cache"]
        
        Expire2 --> First
        Expire2 --> Rest
    end
```

### Problem 2: Cache Penetration (Non-existent Keys)

```mermaid
graph TD
    subgraph "❌ Problem"
        Bad["Attacker queries user:999999999<br/>(doesn't exist in DB)"]
        Miss["Always cache miss → Always hits DB"]
    end
    
    subgraph "✅ Solutions"
        Sol1["1. Cache null values<br/>SET user:999999999 = NULL (TTL=5min)"]
        Sol2["2. Bloom filter<br/>Quick check: 'does this key possibly exist?'<br/>If definitely no → reject immediately"]
    end
```

---

## 📏 Eviction Policies (When Memory is Full)

```mermaid
graph TD
    Full["Cache memory is FULL<br/>Need to evict something"]
    Full --> LRU["LRU (Least Recently Used) ✅<br/>Evict key not accessed longest<br/>Best for most workloads"]
    Full --> LFU["LFU (Least Frequently Used)<br/>Evict key accessed fewest times<br/>Better for skewed access patterns"]
    Full --> TTL2["TTL-based<br/>Evict keys closest to expiry"]
    Full --> Random["Random<br/>Surprisingly effective! Simple."]
```

---

## 🏗️ High Availability

```mermaid
graph TB
    subgraph "Replication (for reads)"
        Primary[Primary Node<br/>Handles writes]
        Replica1[Replica 1<br/>Handles reads]
        Replica2[Replica 2<br/>Handles reads]
        Primary -->|"Async replicate"| Replica1 & Replica2
    end
    
    subgraph "Failover"
        Monitor[Sentinel / Health Check]
        Monitor -->|"Primary dies?"| Promote["Promote replica to primary<br/>< 5 second failover"]
    end
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Distribution | Consistent hashing + virtual nodes | Minimal redistribution when adding/removing nodes |
| Invalidation | TTL + event-based invalidation | TTL for simplicity; events for critical data |
| Eviction | LRU | Best general-purpose; O(1) with hash map + linked list |
| Replication | Async (primary → replica) | Fast writes; slight staleness acceptable |
| Consistency | Eventual (not strong) | Cache is optimization, not source of truth |
| Serialization | Protocol buffers | Compact, fast, schema-aware |

---

## 🚀 Scaling Challenges

| Challenge | Solution |
|-----------|----------|
| Hot keys (celebrity profile) | Replicate hot keys to multiple nodes |
| Node failure | Replica takes over; consistent hash = minimal key movement |
| Memory limits | Eviction policies; tiered caching (L1 local + L2 distributed) |
| Cache stampede | Locking / singleflight pattern |
| Stale data | Event-driven invalidation for critical paths + TTL for others |
| Network partitions | Favor availability (serve stale) over consistency |
