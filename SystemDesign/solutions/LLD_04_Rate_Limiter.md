# LLD 04: Design a Rate Limiter

## 💡 Quick Summary

> **What**: A component that limits how many requests a client can make in a time window.  
> **Key Insight**: Multiple algorithms exist with different trade-offs. **Token Bucket** (bursty traffic allowed) and **Sliding Window** (smooth limiting) are the two most common in production.

---

## 🎯 Algorithms Compared

| Algorithm | Behavior | Best For |
|-----------|----------|----------|
| Token Bucket | Allows bursts up to bucket size | APIs (allow short bursts) |
| Leaky Bucket | Fixed rate output regardless of input | Smoothing traffic |
| Fixed Window | Count per fixed time window | Simple use cases |
| Sliding Window Log | Exact count in rolling window | Precision-critical |
| Sliding Window Counter | Approximation (weighted) | Memory-efficient |

---

## 🪣 Token Bucket (Most Common)

```mermaid
graph TD
    subgraph "Token Bucket Concept"
        Bucket["Bucket (capacity: 10 tokens)<br/>Currently: 7 tokens"]
        Refill["Refill: 2 tokens/second added"]
        Request["Each request costs 1 token"]
    end
    
    Refill -->|"Every 500ms"| Bucket
    Bucket -->|"Token available? ✅ Allow"| Allow["Request passes"]
    Bucket -->|"Empty? ❌ Reject"| Reject["HTTP 429 Too Many Requests"]
```

```mermaid
sequenceDiagram
    participant Client
    participant Limiter as Token Bucket
    
    Note over Limiter: Bucket: 5/10 tokens, refill: 2/sec
    
    Client->>Limiter: Request 1
    Limiter-->>Client: ✅ (4 tokens left)
    Client->>Limiter: Request 2
    Limiter-->>Client: ✅ (3 tokens left)
    Client->>Limiter: Request 3
    Limiter-->>Client: ✅ (2 tokens left)
    Client->>Limiter: Request 4
    Limiter-->>Client: ✅ (1 token left)
    Client->>Limiter: Request 5
    Limiter-->>Client: ✅ (0 tokens left)
    Client->>Limiter: Request 6
    Limiter-->>Client: ❌ 429 (no tokens! wait 500ms)
    
    Note over Limiter: 500ms later: +1 token (refill)
    Client->>Limiter: Request 7
    Limiter-->>Client: ✅ (0 tokens left again)
```

---

## 🏗️ Class Design

```mermaid
classDiagram
    class RateLimiter {
        <<interface>>
        +isAllowed(clientId): boolean
    }
    
    class TokenBucketLimiter {
        -buckets: Map~string, Bucket~
        -capacity: int
        -refillRate: float
        +isAllowed(clientId): boolean
    }
    
    class SlidingWindowLimiter {
        -logs: Map~string, List~timestamp~~
        -windowSize: Duration
        -maxRequests: int
        +isAllowed(clientId): boolean
    }
    
    class Bucket {
        -tokens: float
        -lastRefillTime: long
        -capacity: int
        -refillRate: float
        +tryConsume(): boolean
        -refill(): void
    }
    
    class RateLimiterMiddleware {
        -limiter: RateLimiter
        +handle(request): Response
    }

    RateLimiter <|.. TokenBucketLimiter
    RateLimiter <|.. SlidingWindowLimiter
    TokenBucketLimiter --> Bucket
    RateLimiterMiddleware --> RateLimiter
```

---

## 💻 Token Bucket Implementation

```python
import time

class TokenBucket:
    def __init__(self, capacity, refill_rate):
        self.capacity = capacity
        self.tokens = capacity
        self.refill_rate = refill_rate  # tokens per second
        self.last_refill = time.time()
    
    def try_consume(self) -> bool:
        self._refill()
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False
    
    def _refill(self):
        now = time.time()
        elapsed = now - self.last_refill
        new_tokens = elapsed * self.refill_rate
        self.tokens = min(self.capacity, self.tokens + new_tokens)
        self.last_refill = now

class RateLimiter:
    def __init__(self, capacity=10, refill_rate=2):
        self.buckets = {}  # client_id → TokenBucket
        self.capacity = capacity
        self.refill_rate = refill_rate
    
    def is_allowed(self, client_id: str) -> bool:
        if client_id not in self.buckets:
            self.buckets[client_id] = TokenBucket(self.capacity, self.refill_rate)
        return self.buckets[client_id].try_consume()
```

---

## 📐 Sliding Window Counter (Memory-Efficient)

```mermaid
graph TD
    subgraph "Sliding Window: limit = 100 req/min"
        Prev["Previous window (12:00-12:01)<br/>Had 80 requests"]
        Curr["Current window (12:01-12:02)<br/>Has 30 requests so far"]
        Now["Current time: 12:01:40<br/>(40s into current window = 67% through)"]
    end
    
    subgraph "Weighted count"
        Calc["Estimate = (prev × overlap%) + current<br/>= 80 × 0.33 + 30<br/>= 26.4 + 30 = 56.4<br/>< 100 → ✅ ALLOW"]
    end
    
    Prev & Curr & Now --> Calc
```

---

## 🧩 Where to Place the Rate Limiter

```mermaid
graph LR
    Client2["Client"] --> LB2["Load Balancer<br/>(can rate limit here)"]
    LB2 --> Gateway["API Gateway<br/>(BEST place for rate limiting)"]
    Gateway --> Service2["Service<br/>(can also self-limit)"]
    
    Redis2["Redis<br/>(shared counter<br/>for distributed)"] -.-> Gateway
```

---

## 📊 Algorithm Trade-offs

| Algorithm | Pros | Cons |
|-----------|------|------|
| Token Bucket | Allows bursts; simple; memory-efficient | Burst can overwhelm downstream momentarily |
| Sliding Window Log | Exact; no approximation | Memory-heavy (stores every timestamp) |
| Sliding Window Counter | Good approximation; low memory | ~1% inaccuracy at window boundaries |
| Fixed Window | Simplest | Burst at window boundary (2x limit possible) |
| Leaky Bucket | Smooth output rate | No burst tolerance; queue management |

---

## 🔄 Distributed Rate Limiting (Redis-based)

```python
# Redis + Lua script for atomic token bucket
LUA_SCRIPT = """
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local data = redis.call('HMGET', key, 'tokens', 'last_refill')
local tokens = tonumber(data[1]) or capacity
local last_refill = tonumber(data[2]) or now

-- Refill
local elapsed = now - last_refill
tokens = math.min(capacity, tokens + elapsed * refill_rate)

-- Try consume
if tokens >= 1 then
    tokens = tokens - 1
    redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
    redis.call('EXPIRE', key, 60)
    return 1  -- allowed
else
    redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
    return 0  -- denied
end
"""
```

**Why Lua script?** Atomic execution in Redis — no race conditions between read and write.
