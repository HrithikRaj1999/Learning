# HLD 23: Design Airbnb (Accommodation Marketplace)

## 💡 Quick Summary

> **What**: A two-sided marketplace connecting hosts (with properties) to guests (searching for stays), handling search, booking, payments, and reviews.  
> **Key Insight**: The hardest problem is **search ranking** (matching guests to the right listing from millions) and **availability management** (preventing double-bookings in a distributed system).

---

## 🎯 The Problem in Simple Terms

When a guest searches "Paris, 2 adults, Dec 15-20":
- Filter millions of listings by location, dates, guests, price, amenities
- Rank results by relevance (reviews, host quality, match to preference)
- Show real-time availability (no stale "available" that's actually booked)
- When guest books, lock those dates atomically (no double booking)

---

## 📋 Requirements

| Feature | Detail |
|---------|--------|
| Search listings | Location, dates, guests, filters |
| Booking | Reserve dates, pay, confirm |
| Availability calendar | Hosts manage open dates |
| Payments | Hold funds → release after check-in |
| Reviews | Two-way (guest ↔ host) |
| Messaging | Host-guest communication |

### Scale
```
Listings: 7M+ active
Bookings/day: 2M+
Search queries/day: 100M+
Users: 150M+
Countries: 220+
```

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "👥 Users"
        Guest[Guest App]
        Host[Host App]
    end

    subgraph "⚙️ Services"
        SearchSvc[Search Service<br/>Elasticsearch + geo]
        BookingSvc[Booking Service<br/>Reserve + confirm]
        AvailSvc[Availability Service<br/>Calendar management]
        PaySvc[Payment Service<br/>Hold + release]
        ReviewSvc[Review Service]
        MsgSvc[Messaging Service]
    end

    subgraph "🗄️ Storage"
        ListingDB[(Listing DB<br/>Property details)]
        SearchIdx2[(Search Index<br/>Geo + filters)]
        BookingDB[(Booking DB<br/>Reservations)]
        CalendarDB[(Availability Calendar)]
        PayDB[(Payment Ledger)]
    end

    Guest --> SearchSvc & BookingSvc & MsgSvc
    Host --> AvailSvc & MsgSvc & ReviewSvc
    SearchSvc --> SearchIdx2
    BookingSvc --> AvailSvc --> CalendarDB
    BookingSvc --> PaySvc --> PayDB
```

---

## 🔍 Search Flow

```mermaid
sequenceDiagram
    actor Guest
    participant API as Search API
    participant Geo as Geo Filter
    participant Avail as Availability Check
    participant Rank as Ranking Model

    Guest->>API: Search: Paris, Dec 15-20, 2 guests, $100-200
    API->>Geo: Find listings within Paris bounding box
    Geo-->>API: 50,000 listings in area
    API->>API: Filter: price range, guest count, amenities
    Note over API: Reduces to ~5,000 listings
    API->>Avail: Check availability for Dec 15-20
    Avail-->>API: 2,000 available
    API->>Rank: Rank these 2,000 listings for this guest
    Note over Rank: Factors: reviews, response rate,<br/>guest's past preferences, price fit,<br/>photos quality, superhost status
    Rank-->>API: Top 20 results (page 1)
    API-->>Guest: Results with photos, price, rating
```

---

## 🔒 Booking & Double-Booking Prevention

```mermaid
sequenceDiagram
    actor GuestA as Guest A
    actor GuestB as Guest B
    participant Book as Booking Service
    participant Cal as Availability Service
    participant Pay as Payment Service

    Note over GuestA,GuestB: Both want same listing, same dates!
    
    GuestA->>Book: Book listing_99, Dec 15-20
    GuestB->>Book: Book listing_99, Dec 15-20
    
    Book->>Cal: Lock dates Dec 15-20 for listing_99 (optimistic lock)
    Note over Cal: Uses DB row-level lock or<br/>optimistic concurrency (version check)
    Cal-->>Book: ✅ Locked for Guest A (first to lock)
    
    Book->>Cal: Lock dates Dec 15-20 for listing_99
    Cal-->>Book: ❌ CONFLICT! Dates already held
    Book-->>GuestB: Sorry, these dates just became unavailable
    
    Book->>Pay: Charge Guest A
    Pay-->>Book: ✅ Payment authorized
    Book->>Cal: Confirm booking (dates permanently blocked)
    Book-->>GuestA: 🎉 Booking confirmed!
```

---

## 📅 Availability Calendar Design

```mermaid
graph TD
    subgraph "Calendar for Listing #99"
        Dec["December 2024"]
        D1["Dec 1-5: Available ✅"]
        D2["Dec 6-14: BOOKED (Guest: Alice)"]
        D3["Dec 15-20: Available ✅"]
        D4["Dec 21-31: Blocked by Host"]
    end
    
    subgraph "Data Model"
        Model["listing_id | date | status<br/>99 | Dec 6 | booked<br/>99 | Dec 7 | booked<br/>...<br/>99 | Dec 15 | available<br/>..."]
    end
    
    Note["One row per listing per date<br/>Simple to query: WHERE listing_id=99<br/>AND date BETWEEN '2024-12-15' AND '2024-12-20'<br/>AND status = 'available'"]
```

---

## 💰 Payment Flow

```mermaid
stateDiagram-v2
    [*] --> PaymentHeld: Guest books & pays
    PaymentHeld --> PayoutToHost: 24h after check-in
    PaymentHeld --> Refunded: Guest cancels (per policy)
    PaymentHeld --> Disputed: Guest files complaint
    Disputed --> Refunded: Resolution favors guest
    Disputed --> PayoutToHost: Resolution favors host
    
    note right of PaymentHeld: Money held in escrow<br/>Protects both parties
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Search index | Elasticsearch with geo_point | Built-in geo queries + full-text + faceted filters |
| Availability check | Separate service with row-level locks | Prevent double-booking; clear ownership |
| Booking model | Request → Hold (5min) → Confirm | Give time for payment without losing listing |
| Pricing | Dynamic (hosts set base; system suggests) | Seasonal demand, events, competitor pricing |
| Reviews | Post-checkout only; both sides review | Prevents retaliation; honest feedback |

---

## 🚀 Scaling

| Challenge | Solution |
|-----------|----------|
| 100M searches/day | Elasticsearch cluster; cache popular searches |
| Geo queries at scale | Geohash-based sharding; regional indices |
| Double-booking prevention | Optimistic locking + short hold period (5 min) |
| Payment across 220 countries | Multiple payment processors; local currency support |
| Real-time availability | Event-driven updates; calendar service pushes changes to search index |
