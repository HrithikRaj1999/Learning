# HLD 18: Design a Ticket Booking System (BookMyShow / Ticketmaster)

## 💡 Quick Summary

> **What**: A system for booking seats at events (movies, concerts) that handles seat selection, temporary holds, payment, and prevents double-booking.  
> **Key Insight**: The main challenge is concurrency — when 10,000 people try to book the same 500 seats simultaneously. We need temporary seat locks with TTL to prevent both double-booking AND indefinite holds.

---

## 🎯 The Problem in Simple Terms

When Taylor Swift concert tickets go on sale:
- 1M people try to buy 50,000 seats in seconds
- Two people CANNOT book the same seat
- If someone starts checkout but doesn't pay → seat must be released
- The system must be fair (first-come-first-served)

---

## 📋 Requirements

| Feature | Detail |
|---------|--------|
| Browse events | Search by city, date, type |
| View seat map | See available/booked seats visually |
| Select & hold seats | Temporarily reserve while user pays |
| Payment | Complete booking within time limit |
| No double-booking | One seat = one confirmed booking only |
| Waitlist | Notify if cancelled seats become available |

### Scale
```
Events: 1M+ active at any time
Peak concurrent users: 10M (during popular on-sale)
Seat selections/second: 100K+
Payment window: 10 minutes (then seat released)
Booking confirmation: < 3 seconds
```

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "👤 Users"
        Web[Web / Mobile]
    end

    subgraph "🌐 Gateway"
        Queue[Virtual Queue<br/>For high-demand events]
        API[API Gateway]
    end

    subgraph "⚙️ Services"
        Event[Event Service<br/>Browse & search]
        Booking[Booking Service<br/>Seat selection & hold]
        Payment[Payment Service<br/>Process transactions]
        Inventory[Seat Inventory<br/>Available/held/booked]
        Notify[Notification Service]
    end

    subgraph "🗄️ Storage"
        EventDB[(Event DB<br/>Shows, venues, schedules)]
        SeatDB[(Seat Inventory<br/>Redis + PostgreSQL)]
        BookingDB[(Booking Records)]
        Cache[(Cache Layer)]
    end

    Web --> Queue --> API
    API --> Event & Booking
    Booking --> Inventory --> SeatDB
    Booking --> Payment
    Payment --> BookingDB
    Booking --> Notify
    Event --> EventDB & Cache
```

---

## 🔍 Booking Flow (The Critical Path)

```mermaid
sequenceDiagram
    actor User
    participant API as Booking Service
    participant Inv as Seat Inventory (Redis)
    participant DB as Database
    participant Pay as Payment Service
    participant Timer as TTL Timer

    User->>API: "I want seats A1, A2 for concert_123"
    
    API->>Inv: Try to HOLD seats A1, A2 (atomic operation)
    
    alt Seats available ✅
        Inv->>Inv: Mark A1, A2 as HELD (TTL = 10 minutes)
        Inv-->>API: ✅ Seats held for you!
        API-->>User: Proceed to payment (10 min countdown)
        Timer->>Timer: Start 10-minute timer
        
        User->>API: Submit payment
        API->>Pay: Charge $200
        Pay-->>API: ✅ Payment successful
        API->>Inv: Convert HELD → BOOKED (permanent)
        API->>DB: Store booking record
        API-->>User: 🎉 Booking confirmed! Enjoy the show!
        
    else Seats already taken ❌
        Inv-->>API: ❌ Seats A1, A2 not available
        API-->>User: Sorry! Those seats are taken. Choose others.
    end
    
    Note over Timer,Inv: If user doesn't pay within 10 min:
    Timer->>Inv: TTL expired! Release A1, A2
    Inv->>Inv: Mark A1, A2 as AVAILABLE again
```

---

## 💺 Seat States

```mermaid
stateDiagram-v2
    [*] --> Available : Event created
    Available --> Held : User selects seat
    Held --> Booked : Payment confirmed ✅
    Held --> Available : TTL expires (10 min) ⏰
    Held --> Available : User cancels
    Booked --> Available : Refund processed
    Booked --> [*] : Event completed
    
    note right of Held : Seat locked for THIS user only<br/>Auto-releases after timeout
```

---

## ⚡ Preventing Double-Booking (The Key Challenge)

### Problem: Race Condition

```mermaid
graph TD
    subgraph "❌ Without atomic locking"
        A["User A checks seat A1: Available ✓"]
        B["User B checks seat A1: Available ✓"]
        A2["User A books seat A1 → Success"]
        B2["User B books seat A1 → Success 💥"]
        Problem["DOUBLE BOOKED! Both think they got it!"]
        
        A --> A2
        B --> B2
        A2 & B2 --> Problem
    end
```

### Solution: Atomic Compare-and-Swap in Redis

```mermaid
sequenceDiagram
    participant A as User A
    participant B as User B
    participant Redis as Redis (Atomic)

    Note over Redis: seat:concert123:A1 = "available"
    
    A->>Redis: SET seat:concert123:A1 "held:userA" NX EX 600
    Note over Redis: NX = Only if Not eXists (atomic!)
    Redis-->>A: ✅ OK (got it!)
    
    B->>Redis: SET seat:concert123:A1 "held:userB" NX EX 600
    Note over Redis: NX fails — key already exists!
    Redis-->>B: ❌ FAIL (seat already held)
    
    B-->>B: "Seat taken — choose another"
```

**Key**: Redis `SET key value NX EX 600` is atomic. Only ONE request can succeed. The loser immediately knows and can try another seat.

---

## 🚦 Virtual Queue (For High-Demand Events)

```mermaid
graph TD
    subgraph "When 1M people rush for 50K seats"
        Rush["1M simultaneous requests"]
        Queue2["Virtual Waiting Room<br/>'You are #45,231 in queue'<br/>Admit 1000 users/minute"]
        Throttle["Controlled admission<br/>Servers not overwhelmed<br/>Fair ordering"]
        
        Rush --> Queue2 --> Throttle
    end
```

```mermaid
sequenceDiagram
    actor User
    participant Queue as Virtual Queue
    participant App as Booking System

    User->>Queue: "I want to buy tickets!"
    Queue-->>User: "You're #12,456 in line. ETA: 8 minutes. Please wait."
    
    Note over Queue: Admits users in batches (fairness)
    
    Queue->>User: "It's your turn! You have 10 minutes to select seats."
    User->>App: Browse available seats & select
```

---

## 🏟️ Seat Map Data Structure

```mermaid
graph TB
    subgraph "Venue Layout (hierarchical)"
        Venue[Concert Hall] --> Section1[Section A<br/>Premium]
        Venue --> Section2[Section B<br/>Standard]
        Venue --> Section3[Section C<br/>Economy]
        
        Section1 --> Row1[Row 1: seats 1-20]
        Section1 --> Row2[Row 2: seats 1-20]
        
        Row1 --> S1["A1 🟢"]
        Row1 --> S2["A2 🟡 held"]
        Row1 --> S3["A3 🔴 booked"]
    end
    
    subgraph "Legend"
        G["🟢 Available"]
        Y["🟡 Temporarily Held"]
        R["🔴 Booked (confirmed)"]
    end
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Seat locking | Redis with TTL (SET NX EX) | Atomic, auto-expires, fast |
| Hold duration | 10 minutes | Enough to complete payment; not too long to block others |
| High-demand protection | Virtual queue | Fair ordering; prevents server crash |
| Seat selection | Real-time seat map via WebSocket | Users see live availability |
| Payment failure | Auto-release held seats | Don't punish users for bank issues |
| Overbooking | Never (strict inventory) | Unlike airlines — a seat is a physical spot |

---

## 🚀 Scaling Challenges

| Challenge | Solution |
|-----------|----------|
| 1M simultaneous for one event | Virtual queue + admission control |
| Seat status real-time | Redis for state; WebSocket push updates to all viewers |
| Payment timeout handling | Redis TTL auto-releases; no cron job needed |
| Multiple events concurrently | Partition seat inventory by event_id |
| Scalper prevention | CAPTCHA + rate limiting + ID verification |
| Flash sale traffic (10,000x spike) | Auto-scale + CDN for static event pages |
