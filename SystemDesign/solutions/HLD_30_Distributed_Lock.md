# HLD 30: Design a Distributed Lock Service

## 💡 Quick Summary

> **What**: A service that provides mutual exclusion across distributed systems — ensuring only one process/node can hold a "lock" at a time, preventing race conditions.  
> **Key Insight**: Distributed locks are HARD because of partial failures. A node might acquire a lock, then crash. Without a TTL (auto-expiry), the lock is held forever (deadlock). With TTL, you risk two holders if the first node is just slow (not dead). This is the fundamental tension.

---

## 🎯 The Problem in Simple Terms

Three payment servers all try to process the same order simultaneously:
- Without lock: all three charge the customer → triple charge! 💀
- With distributed lock: only one acquires lock("order_123"), processes it, releases lock

---

## 📋 Requirements

| Feature | Detail |
|---------|--------|
| Mutual exclusion | Only one holder at a time |
| Deadlock prevention | Auto-expire (TTL) if holder crashes |
| Fairness | Optional: queued waiters get lock in order |
| Reentrant | Optional: same owner can re-acquire |
| Fencing token | Monotonic token to detect stale locks |
| High availability | Lock service itself must not be SPOF |

### Scale
```
Lock acquisitions/second: 100K+
Active locks: millions
Lock hold time: milliseconds to minutes
Availability: 99.99%
Nodes in cluster: 3-5 (odd number for consensus)
```

---

## 🏗️ Architecture Options

```mermaid
graph TD
    subgraph "Option 1: Redis-based (Redlock)"
        Redis1["Redis Node 1"]
        Redis2["Redis Node 2"]  
        Redis3["Redis Node 3"]
        Client1["Client acquires lock on majority (2/3)<br/>Simple, fast, but debated correctness"]
    end
    
    subgraph "Option 2: ZooKeeper / etcd (Consensus-based)"
        ZK["ZooKeeper/etcd Cluster<br/>(Raft/ZAB consensus)<br/>Strongly consistent<br/>Correct by design"]
    end
    
    subgraph "Option 3: Database (Simple but slow)"
        DB2["SELECT FOR UPDATE<br/>or unique constraint<br/>Works, but high latency"]
    end
```

---

## 🔍 How It Works (Consensus-based: etcd/ZooKeeper)

```mermaid
sequenceDiagram
    participant A as Server A
    participant B as Server B
    participant Lock as Lock Service (etcd cluster)

    A->>Lock: ACQUIRE lock("order_123"), TTL=30s
    Lock->>Lock: Consensus: all nodes agree A holds lock
    Lock-->>A: ✅ Acquired! Fencing token: 42

    B->>Lock: ACQUIRE lock("order_123"), TTL=30s
    Lock-->>B: ❌ DENIED (held by A, expires in 28s)
    
    Note over A: A processes order...
    A->>Lock: RELEASE lock("order_123")
    Lock-->>A: ✅ Released
    
    Lock->>B: 🔔 Lock available! (if B was waiting)
    B->>Lock: ACQUIRE lock("order_123")
    Lock-->>B: ✅ Acquired! Fencing token: 43
```

---

## ⚠️ The Dangerous Edge Case (Why TTL Isn't Enough)

```mermaid
sequenceDiagram
    participant A as Server A
    participant Lock2 as Lock Service
    participant B as Server B
    participant DB3 as Database

    A->>Lock2: ACQUIRE lock("order_123"), TTL=10s, token=42
    Lock2-->>A: ✅ Acquired

    Note over A: A starts processing...<br/>Then A has a long GC pause (15 seconds!)
    
    Note over Lock2: TTL expires! Lock auto-released.
    
    B->>Lock2: ACQUIRE lock("order_123"), token=43
    Lock2-->>B: ✅ Acquired
    B->>DB3: Process order (token=43)
    DB3-->>B: ✅ Done
    
    Note over A: A wakes up from GC pause<br/>Thinks it still holds the lock!
    A->>DB3: Process order (token=42)
    DB3-->>A: ❌ REJECTED (token 42 < 43 = stale!)
    
    Note over DB3: Fencing token saves us!<br/>DB rejects operations with old tokens.
```

---

## 🔑 Fencing Tokens (The Safety Net)

```mermaid
graph TD
    subgraph "Without fencing token"
        Bad["Two processes BOTH think they hold lock<br/>Both write to database<br/>Data corruption! 💀"]
    end
    
    subgraph "With fencing token"
        Good["Lock service issues monotonically increasing token<br/>Token 42 → Token 43 → Token 44...<br/>Database/resource rejects operations with old tokens<br/>Even if stale lock holder acts, it's blocked ✅"]
    end
```

---

## 🔄 Redlock Algorithm (Redis-based)

```mermaid
sequenceDiagram
    participant Client as Client
    participant R1 as Redis 1
    participant R2 as Redis 2
    participant R3 as Redis 3
    participant R4 as Redis 4
    participant R5 as Redis 5

    Note over Client: Try to set lock on MAJORITY of nodes
    Client->>R1: SET lock_key owner_id NX PX 10000
    R1-->>Client: ✅ OK
    Client->>R2: SET lock_key owner_id NX PX 10000
    R2-->>Client: ✅ OK
    Client->>R3: SET lock_key owner_id NX PX 10000
    R3-->>Client: ✅ OK
    Client->>R4: SET lock_key owner_id NX PX 10000
    R4-->>Client: ❌ FAIL (already held)
    Client->>R5: SET lock_key owner_id NX PX 10000
    R5-->>Client: ❌ FAIL
    
    Note over Client: Got 3/5 = majority ✅<br/>Lock acquired!<br/>Effective TTL = 10000ms - time_spent_acquiring
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Redlock vs Consensus | Consensus (etcd/ZooKeeper) for correctness-critical | Redlock has known theoretical issues (clock drift) |
| Redlock for | Performance-critical, approximate mutual exclusion | Faster; acceptable when duplicate work is tolerable |
| TTL | Always require TTL | Prevents permanent deadlock from crashed holders |
| Fencing tokens | Always use for critical resources | Safety net against stale lock holders |
| Availability vs Consistency | CP (Consistency + Partition tolerance) | A lock that lies is worse than a lock that's unavailable |
| Wait strategy | Exponential backoff + watch/subscribe | Don't spin-loop; react to release event |

---

## 🚀 Scaling

| Challenge | Solution |
|-----------|----------|
| High throughput | Shard locks by key hash across multiple lock groups |
| Lock contention | Keep critical sections short; use finer-grained locks |
| Node failure | Consensus (Raft/ZAB) handles leader election automatically |
| Network partition | CP system: minority partition cannot acquire new locks |
| Clock drift (Redlock) | Use logical clocks / fencing tokens instead of relying on wall clocks |
| Deadlock detection | TTL auto-expiry; monitor long-held locks |
