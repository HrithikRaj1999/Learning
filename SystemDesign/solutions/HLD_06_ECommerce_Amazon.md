# HLD 06: Design E-Commerce Platform (Amazon)

## 💡 Quick Summary

> **What**: An online marketplace where users browse products, add to cart, and complete purchases with payment.  
> **Key Insight**: The hardest parts are inventory management (preventing overselling), handling flash sales (sudden traffic spikes), and maintaining consistency across distributed services during checkout.

---

## 🎯 The Problem in Simple Terms

When 10,000 people try to buy the last iPhone during a flash sale:
- Only 100 are in stock
- You CANNOT sell 101 (overselling = real money loss)
- Checkout must complete in < 3 seconds
- If someone abandons cart, items must be released back

This requires careful orchestration of inventory, payments, and order management.

---

## 📋 Requirements

### What It Must Do
| Feature | Detail |
|---------|--------|
| Product catalog | Browse millions of products with search & filters |
| Shopping cart | Add/remove items, persist across sessions |
| Checkout | Address → payment → order confirmation |
| Inventory | Real-time stock tracking, no overselling |
| Orders | Track order status, history |
| Payments | Multiple methods, refunds |
| Recommendations | "Customers also bought..." |

### Scale Numbers
```
Products: 350M+ (Amazon scale)
Daily orders: 50M+
Peak: 50x during flash sales (Black Friday)
Cart sessions: 200M concurrent
Latency: Product page < 200ms, Checkout < 3 sec
Availability: 99.99% (every minute of downtime = $millions lost)
```

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "👤 Users"
        Web[Web Browser]
        Mobile[Mobile App]
    end

    subgraph "🌐 Edge & Gateway"
        CDN[CDN<br/>Static assets, images]
        API[API Gateway<br/>Auth, rate limiting, routing]
    end

    subgraph "⚙️ Core Services"
        Catalog[Product Catalog<br/>Search & browse]
        Cart[Cart Service<br/>Shopping cart]
        Order[Order Service<br/>Order lifecycle]
        Inventory[Inventory Service<br/>Stock management]
        Payment[Payment Service<br/>Process transactions]
        User[User Service<br/>Auth & profiles]
        Reco[Recommendation<br/>ML-based]
    end

    subgraph "🗄️ Data Stores"
        ProductDB[(Product DB<br/>Elasticsearch + PostgreSQL)]
        CartCache[(Cart<br/>Redis)]
        OrderDB[(Order DB<br/>PostgreSQL)]
        InvDB[(Inventory<br/>Redis + DB)]
        PayDB[(Payment<br/>PostgreSQL)]
    end

    subgraph "📬 Async"
        Queue[Message Queue<br/>Kafka]
        Notify[Notification Service<br/>Email, SMS, Push]
    end

    Web & Mobile --> CDN
    Web & Mobile --> API
    API --> Catalog & Cart & Order & User
    Order --> Inventory & Payment
    Catalog --> ProductDB
    Cart --> CartCache
    Order --> OrderDB
    Inventory --> InvDB
    Order --> Queue --> Notify
```

---

## 🔍 How Checkout Works (The Critical Path)

```mermaid
sequenceDiagram
    actor User
    participant Cart as Cart Service
    participant Order as Order Service
    participant Inv as Inventory Service
    participant Pay as Payment Service
    participant Notify as Notification

    User->>Cart: Proceed to checkout
    Cart->>Order: Create order from cart items
    
    Note over Order,Inv: Step 1: Reserve inventory
    Order->>Inv: Reserve 2x iPhone, 1x Case
    Inv->>Inv: Atomic decrement stock (Redis)
    Inv-->>Order: ✅ Reserved (hold for 10 minutes)
    
    Note over Order,Pay: Step 2: Process payment
    Order->>Pay: Charge $1,299.99
    Pay->>Pay: Call payment gateway (Stripe)
    Pay-->>Order: ✅ Payment successful
    
    Note over Order: Step 3: Confirm order
    Order->>Inv: Confirm reservation (permanent)
    Order->>Order: Status → CONFIRMED
    Order->>Notify: Send confirmation email
    Order-->>User: ✅ Order #12345 confirmed!
    
    Note over Inv: If payment fails:
    Note over Inv: Release reservation → stock goes back
```

### What Happens When Payment Fails?

```mermaid
graph TD
    Start[Checkout Started] --> Reserve[Reserve Inventory ✅]
    Reserve --> Payment{Payment<br/>Successful?}
    
    Payment -->|"✅ Yes"| Confirm[Confirm Order<br/>Keep inventory reserved]
    Payment -->|"❌ No"| Release[Release Inventory<br/>Stock returns to available]
    
    Confirm --> Ship[Ship Order]
    Release --> Back[Items back in stock<br/>Others can buy]
```

---

## 🏪 Inventory Management (Preventing Overselling)

### The Problem with Flash Sales

```mermaid
graph TD
    subgraph "❌ Without proper locking"
        Stock1["Stock = 1 iPhone left"]
        User1[User A checks: 1 in stock ✅] 
        User2[User B checks: 1 in stock ✅]
        User1 --> Buy1[User A buys → Stock = 0]
        User2 --> Buy2[User B buys → Stock = -1 ⚠️ OVERSOLD!]
    end
```

### Our Solution: Atomic Reserve with Redis

```mermaid
sequenceDiagram
    participant A as User A
    participant B as User B
    participant Redis as Redis (Atomic)

    Note over Redis: stock:iphone = 5

    A->>Redis: DECR stock:iphone (atomic!)
    Redis-->>A: Result: 4 ✅ (reserved)
    
    B->>Redis: DECR stock:iphone (atomic!)
    Redis-->>B: Result: 3 ✅ (reserved)
    
    Note over Redis: Even if simultaneous, DECR is atomic!
    Note over Redis: If result < 0 → reject & INCR back
```

### Reservation with TTL (Timeout)

```mermaid
stateDiagram-v2
    [*] --> Available : In stock
    Available --> Reserved : User starts checkout
    Reserved --> Sold : Payment confirmed
    Reserved --> Available : Timeout (10 min)<br/>or payment failed
    Sold --> [*]
    
    note right of Reserved : Reserved with 10-min TTL<br/>Auto-releases if abandoned
```

---

## 🛒 Shopping Cart Design

```mermaid
graph TD
    subgraph "Cart Storage Strategy"
        LoggedIn[Logged-in User] --> Redis[Redis<br/>Persistent, fast<br/>TTL = 30 days]
        Guest[Guest User] --> Local[Local Storage<br/>Browser cookie/session]
        
        Local -->|"User logs in"| Merge[Merge into Redis cart]
    end
```

**Why Redis for cart?**
- Fast reads/writes (< 1ms)
- TTL = auto-cleanup of abandoned carts
- Persists across devices (logged-in users)
- Handles 200M concurrent cart sessions

---

## 🔎 Product Search & Catalog

```mermaid
graph LR
    subgraph "Search Architecture"
        Query[User: 'wireless headphones'] --> ES[Elasticsearch<br/>Full-text search<br/>Facets & filters]
        ES --> Results[Results:<br/>1. Sony WH-1000<br/>2. AirPods Pro<br/>3. Bose QC45]
    end
    
    subgraph "Indexing Pipeline"
        ProductDB[Product DB] -->|"Change events"| Kafka[Kafka]
        Kafka --> Indexer[Index Worker]
        Indexer --> ES
    end
```

**Search features:**
- Full-text search with typo tolerance
- Filters: price range, brand, rating, Prime eligible
- Sort: relevance, price, rating, newest
- Autocomplete suggestions

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Inventory locking | Atomic Redis DECR | Fast, prevents overselling, no DB locks |
| Cart storage | Redis with TTL | Sub-ms reads, auto-cleanup, scales horizontally |
| Checkout flow | Saga pattern (compensating actions) | No distributed transactions needed; eventual consistency |
| Product search | Elasticsearch | Full-text, facets, fast; denormalized for read speed |
| Pricing | Eventual consistency | Price can change between cart add and checkout (show warning) |
| Database | Service-per-DB (microservices) | Independent scaling; fault isolation |

---

## 🚀 Handling Flash Sales (10,000x Normal Traffic)

```mermaid
graph TB
    subgraph "Flash Sale Protection"
        Queue1[Request Queue<br/>Buffer incoming requests]
        Queue1 --> RateLimit[Rate Limiter<br/>Max 1000 checkouts/sec]
        RateLimit --> Process[Process sequentially]
        Process --> StockCheck{Stock > 0?}
        StockCheck -->|Yes| Allow[Allow purchase ✅]
        StockCheck -->|No| Reject[Sold out page 🚫]
    end
    
    subgraph "Additional Measures"
        M1[CDN caches product page]
        M2[Pre-warm inventory in Redis]
        M3[Auto-scale checkout service]
        M4[Virtual waiting room for overflow]
    end
```

**Strategy:**
1. **Pre-warm**: Load inventory into Redis before sale starts
2. **Virtual queue**: Overflow users see "You're #5,432 in line"
3. **Rate limit**: Process checkouts in controlled batches
4. **CDN**: Product page served from edge (static)
