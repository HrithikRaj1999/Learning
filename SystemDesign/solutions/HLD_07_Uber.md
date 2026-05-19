# HLD 07: Design Uber (Ride-Hailing Platform)

## 💡 Quick Summary

> **What**: A platform that matches riders with nearby drivers in real-time, tracks locations, calculates fares, and handles payments.  
> **Key Insight**: The core challenge is real-time geospatial matching — finding the nearest available driver among millions of moving vehicles, all updating their location every 3 seconds.

---

## 🎯 The Problem in Simple Terms

When you request an Uber ride:
- The system must find the 5 nearest available drivers (within seconds)
- Drivers are constantly moving (location updates every 3-4 seconds)
- 20M+ rides happen daily across 10,000+ cities
- ETA must be accurate (routing + traffic)
- Pricing changes dynamically based on demand (surge pricing)

---

## 📋 Requirements

### What It Must Do
| Feature | Detail |
|---------|--------|
| Request ride | Rider enters pickup & destination |
| Match driver | Find nearest available driver |
| Real-time tracking | See driver moving on map |
| ETA | Estimated arrival time |
| Pricing | Dynamic pricing with surge |
| Trip management | Start, track, end trip |
| Payments | Automatic fare calculation & charge |

### Scale Numbers
```
Active drivers: 5M+ worldwide
Rides/day: 20M+
Location updates: 5M drivers × 1 update/3 sec = 1.7M updates/second!
Matching latency: < 5 seconds
Cities: 10,000+
Peak: Friday night 10-50x normal in some areas
```

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "📱 Clients"
        Rider[Rider App]
        Driver[Driver App]
    end

    subgraph "🌐 Gateway"
        LB[Load Balancer]
        API[API Gateway]
    end

    subgraph "⚙️ Core Services"
        Match[Matching Service<br/>Find nearest driver]
        Trip[Trip Service<br/>Manage ride lifecycle]
        Location[Location Service<br/>Track all drivers]
        Price[Pricing Service<br/>Dynamic surge pricing]
        ETA[ETA Service<br/>Route & time estimation]
        Pay[Payment Service]
    end

    subgraph "🗄️ Data"
        GeoIdx[(Geospatial Index<br/>Driver locations - Redis)]
        TripDB[(Trip Database)]
        Map[(Map & Routing Data)]
    end

    subgraph "📬 Real-time"
        WS[WebSocket Servers<br/>Live updates]
        Kafka[Kafka<br/>Location stream]
    end

    Rider & Driver --> LB --> API
    API --> Match & Trip & Location & Price
    Driver -->|Location every 3s| WS --> Kafka --> Location
    Location --> GeoIdx
    Match --> GeoIdx
    ETA --> Map
    Trip --> TripDB
```

---

## 🔍 How Ride Matching Works

```mermaid
sequenceDiagram
    actor Rider
    participant API as Ride Service
    participant Price as Pricing
    participant Match as Matching Service
    participant Geo as Geospatial Index
    participant WS as WebSocket
    actor Driver

    Rider->>API: Request ride (pickup: A, dropoff: B)
    API->>Price: Calculate fare estimate
    Price->>Price: Base + distance + time + surge multiplier
    Price-->>API: $24.50 (surge: 1.5x)
    API-->>Rider: Confirm? $24.50 estimated
    
    Rider->>API: Confirm ride request!
    API->>Match: Find driver near pickup point A
    Match->>Geo: Query: drivers within 3km of (lat, lng)
    Geo-->>Match: [Driver_1 (0.5km), Driver_3 (1.2km), Driver_7 (2.1km)]
    
    Match->>Match: Rank by: distance + rating + acceptance rate
    Match->>WS: Send request to Driver_1
    WS->>Driver: 🔔 New ride request! (15 sec to accept)
    
    alt Driver accepts
        Driver-->>WS: ✅ Accept
        WS-->>API: Driver_1 accepted
        API-->>Rider: Driver found! ETA: 4 min
    else Driver ignores/rejects
        Note over Match: Try next driver (Driver_3)
        Match->>WS: Send to Driver_3
    end
```

---

## 📍 Location Tracking (1.7M Updates/Second!)

### How Driver Locations Are Tracked

```mermaid
graph LR
    subgraph "5M Active Drivers"
        D1[Driver 1<br/>GPS every 3s]
        D2[Driver 2<br/>GPS every 3s]
        DN[Driver N...]
    end
    
    subgraph "Ingestion"
        Kafka[Kafka<br/>Location Stream<br/>1.7M events/sec]
    end
    
    subgraph "Geospatial Index"
        Grid[Geohash Grid<br/>World divided into cells]
    end
    
    D1 & D2 & DN --> Kafka --> Grid
```

### Geohash: How We Find Nearby Drivers

```mermaid
graph TB
    subgraph "🗺️ World divided into grid cells (Geohash)"
        Cell1["Cell 9q8yyk<br/>🚗 🚗 🚗<br/>(3 drivers here)"]
        Cell2["Cell 9q8yym<br/>🚗<br/>(1 driver)"]
        Cell3["Cell 9q8yyn<br/>🚗 🚗<br/>(2 drivers)"]
        Cell4["Cell 9q8yyp<br/>(empty)"]
    end
    
    subgraph "📍 Rider requests at cell 9q8yyk"
        Search["Search THIS cell<br/>+ all 8 adjacent cells"]
        Search --> Result["Found 6 drivers<br/>within radius!"]
    end
```

**How Geohash works:**
1. Divide the world into grid cells (like a chessboard)
2. Each cell has a string ID: "9q8yyk"
3. Store drivers in Redis: `geohash:9q8yyk → [driver_1, driver_3, driver_5]`
4. To find nearby: search the rider's cell + adjacent cells
5. Filter by actual distance (Haversine formula)

---

## 💰 Surge Pricing

```mermaid
graph TD
    subgraph "Every 2 minutes per zone"
        Demand[Count ride requests<br/>in this zone]
        Supply[Count available drivers<br/>in this zone]
        Ratio[Demand / Supply ratio]
    end
    
    Ratio --> Mult{Ratio value?}
    Mult -->|"< 1.0"| S1[Surge: 1.0x<br/>Normal price]
    Mult -->|"1.0 - 1.5"| S2[Surge: 1.3x]
    Mult -->|"1.5 - 2.5"| S3[Surge: 1.8x]
    Mult -->|"> 2.5"| S4[Surge: 2.5x<br/>Capped maximum]
```

**Example:** Friday night downtown
- 200 requests in zone, only 50 drivers available
- Ratio = 4.0 → Surge = 2.5x
- This incentivizes more drivers to come to that area

---

## 🚗 Trip Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Requested : Rider requests ride
    Requested --> Matching : Finding driver...
    Matching --> DriverAssigned : Driver accepts
    Matching --> NoDrivers : All nearby drivers rejected
    NoDrivers --> [*] : "No drivers available"
    
    DriverAssigned --> EnRoute : Driver heading to pickup
    EnRoute --> Arrived : Driver at pickup location
    Arrived --> InProgress : Rider picked up, trip starts
    InProgress --> Completed : Arrived at destination
    Completed --> [*] : Fare charged, ratings exchanged
    
    DriverAssigned --> Cancelled : Rider/Driver cancels
    EnRoute --> Cancelled : Rider/Driver cancels
    Cancelled --> [*]
```

---

## 🗄️ Data Architecture

```mermaid
graph TB
    subgraph "⚡ Real-time (Redis)"
        Loc[Driver Locations<br/>Geospatial index<br/>Updated every 3s]
        Avail[Driver Availability<br/>Available/Busy/Offline]
        Surge[Surge multipliers<br/>Per zone, per 2 min]
    end
    
    subgraph "📝 Transactional (PostgreSQL)"
        Trips[Trips table<br/>Ride history]
        Users[Users & Drivers<br/>Profiles, ratings]
        Payments[Payment records]
    end
    
    subgraph "📊 Analytics (Data Lake)"
        Events[All location events]
        ML[ML training data<br/>ETA models, surge prediction]
    end
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Location index | Redis Geospatial (GEOADD) | Sub-ms lookups, handles 1.7M writes/sec |
| Matching algorithm | Nearest + rank (rating, acceptance) | Pure nearest isn't best (driver might reject) |
| Location update freq | Every 3 seconds | Balance between accuracy and bandwidth |
| Surge calculation | Zone-based, every 2 min | Too frequent = unstable prices; too slow = inaccurate |
| Trip consistency | Strong (PostgreSQL) | Money involved — can't lose trip records |
| Communication | WebSocket | Real-time bidirectional for live tracking |

---

## 🚀 Scaling Challenges

| Challenge | Solution |
|-----------|----------|
| 1.7M location updates/sec | Kafka partitioned by city; Redis per region |
| Finding drivers fast | Geohash index; search cell + neighbors only |
| Peak demand (New Year's Eve) | Auto-scale matching service; pre-warm capacity |
| Global presence (10K cities) | Regional deployments; independent matching per city |
| ETA accuracy | ML model trained on historical trip data + live traffic |
| Driver-rider communication | WebSocket connections with auto-reconnect |
