# Top 50 Most Asked System Design Questions at FAANG/MAANG & Fortune 500 (2025-2026)

> **Sources**: DesignGurus.io, System Design Primer (349k+ GitHub stars), InterviewBit, ByteByteGo (Alex Xu), IGotAnOffer, Glassdoor FAANG reports, Educative.io Grokking series, Exponent, HelloInterview — all cross-referenced as of May 2026.
>
> **Companies tracked**: Google, Amazon, Meta, Microsoft, Apple, Bloomberg, Goldman Sachs, Uber, Netflix, Airbnb, LinkedIn, TikTok, Stripe, Salesforce, Adobe, Oracle

---

## Part A: High-Level Design (HLD) — Top 30 Most Asked

> HLD focuses on architecture, component interactions, scalability, availability, and trade-offs.

| # | Question | Category | Frequency | Top Asking Companies |
|---:|---|---|---|---|
| 1 | Design a URL Shortener (TinyURL / Bit.ly) | Web Service | ★★★★★ | Google, Amazon, Meta, Microsoft, Bloomberg |
| 2 | Design Twitter / X (Timeline + Feed) | Social / Feed | ★★★★★ | Meta, Google, Amazon, Twitter, Bloomberg |
| 3 | Design Instagram (Photo Sharing + Feed) | Social / Media | ★★★★★ | Meta, Amazon, Google, Apple, TikTok |
| 4 | Design WhatsApp / Messenger (Chat System) | Messaging | ★★★★★ | Meta, Amazon, Microsoft, Google, Uber |
| 5 | Design YouTube / Netflix (Video Streaming) | Streaming | ★★★★★ | Netflix, Google, Amazon, Apple, Meta |
| 6 | Design an E-Commerce System (Amazon) | E-Commerce | ★★★★★ | Amazon, Microsoft, Google, Flipkart, Walmart |
| 7 | Design Uber / Lyft (Ride Sharing) | Location / Real-time | ★★★★★ | Uber, Google, Amazon, Lyft, Bloomberg |
| 8 | Design Google Search / Web Crawler | Search | ★★★★★ | Google, Amazon, Microsoft, Apple, Bloomberg |
| 9 | Design Dropbox / Google Drive (File Storage) | Cloud Storage | ★★★★☆ | Google, Microsoft, Amazon, Dropbox, Apple |
| 10 | Design a News Feed System (Facebook Feed) | Feed / Ranking | ★★★★☆ | Meta, Google, LinkedIn, Twitter, TikTok |
| 11 | Design a Rate Limiter | Infrastructure | ★★★★☆ | Stripe, Google, Amazon, Microsoft, Cloudflare |
| 12 | Design a Notification Service | Messaging | ★★★★☆ | Amazon, Meta, Google, Apple, Microsoft |
| 13 | Design a Chat System (Slack / Discord) | Real-time | ★★★★☆ | Microsoft, Salesforce, Amazon, Meta, Discord |
| 14 | Design Autocomplete / Typeahead | Search | ★★★★☆ | Google, Amazon, Microsoft, LinkedIn, Meta |
| 15 | Design a Distributed Cache (Redis / Memcached) | Infrastructure | ★★★★☆ | Amazon, Google, Meta, Microsoft, Netflix |
| 16 | Design a Payment System (Stripe / PayPal) | Fintech | ★★★★☆ | Stripe, Amazon, Google, Goldman Sachs, PayPal |
| 17 | Design Google Maps / Location Service | Geo / Maps | ★★★☆☆ | Google, Uber, Apple, Amazon, Microsoft |
| 18 | Design a Ticket Booking System (BookMyShow) | Booking | ★★★☆☆ | Amazon, Microsoft, Google, Bloomberg, Uber |
| 19 | Design Google Docs (Collaborative Editing) | Collaboration | ★★★☆☆ | Google, Microsoft, Meta, Amazon, Apple |
| 20 | Design a Distributed Message Queue (Kafka) | Infrastructure | ★★★☆☆ | LinkedIn, Amazon, Google, Microsoft, Uber |
| 21 | Design Spotify (Music Streaming) | Streaming | ★★★☆☆ | Spotify, Amazon, Apple, Google, Netflix |
| 22 | Design TikTok / Short Video Platform | Social / Video | ★★★☆☆ | TikTok, Meta, Google, Amazon, Apple |
| 23 | Design Airbnb (Rental Marketplace) | Marketplace | ★★★☆☆ | Airbnb, Amazon, Google, Uber, Microsoft |
| 24 | Design a Stock Exchange / Trading System | Fintech | ★★★☆☆ | Goldman Sachs, Bloomberg, Jane Street, Citadel, Amazon |
| 25 | Design a Web Crawler | Distributed Systems | ★★★☆☆ | Google, Amazon, Microsoft, Apple, Bloomberg |
| 26 | Design a Content Delivery Network (CDN) | Infrastructure | ★★☆☆☆ | Amazon, Cloudflare, Google, Netflix, Akamai |
| 27 | Design Zoom / Video Conferencing | Real-time / Streaming | ★★☆☆☆ | Microsoft, Google, Amazon, Zoom, Meta |
| 28 | Design a Metrics & Logging System | Observability | ★★☆☆☆ | Google, Amazon, Microsoft, Netflix, Uber |
| 29 | Design an Object Storage (Amazon S3) | Cloud Infrastructure | ★★☆☆☆ | Amazon, Google, Microsoft, Oracle, IBM |
| 30 | Design a Distributed Lock Service (Chubby / Zookeeper) | Infrastructure | ★★☆☆☆ | Google, Amazon, Microsoft, LinkedIn, Netflix |

---

## Part B: Low-Level Design (LLD) — Top 20 Most Asked

> LLD focuses on class design, OOP principles, design patterns, APIs, database schema, and detailed component implementation.

| # | Question | Category | Frequency | Key Design Patterns |
|---:|---|---|---|---|
| 1 | Design LRU Cache | Data Structure / Design | ★★★★★ | HashMap + Doubly Linked List, Strategy |
| 2 | Design a Parking Lot System | OOP / Real-world | ★★★★★ | Strategy, Factory, Observer, Singleton |
| 3 | Design an Elevator System | OOP / State Machine | ★★★★☆ | State, Strategy, Observer, Command |
| 4 | Design a Rate Limiter (Implementation) | Algorithm / Design | ★★★★☆ | Token Bucket, Sliding Window, Decorator |
| 5 | Design a Library Management System | OOP / CRUD | ★★★★☆ | Repository, Factory, Observer |
| 6 | Design a Snake and Ladder Game | Game / OOP | ★★★☆☆ | State, Strategy, Factory |
| 7 | Design a Tic-Tac-Toe Game | Game / OOP | ★★★☆☆ | Strategy, Factory, State |
| 8 | Design an Online Booking System (Hotel/Movie) | Booking / Concurrency | ★★★☆☆ | Strategy, Observer, Locking, Builder |
| 9 | Design a Vending Machine | State Machine / OOP | ★★★☆☆ | State, Strategy, Chain of Responsibility |
| 10 | Design a Food Delivery App (Swiggy/Zomato) | Multi-entity | ★★★☆☆ | Strategy, Observer, Factory, Decorator |
| 11 | Design Stack Overflow / Q&A Platform | Social / CRUD | ★★★☆☆ | Observer, Strategy, Repository |
| 12 | Design an ATM Machine | State Machine | ★★★☆☆ | State, Chain of Responsibility, Singleton |
| 13 | Design a Chess Game | Game / OOP | ★★☆☆☆ | Strategy, Factory, Command, Observer |
| 14 | Design a File System (In-Memory) | Tree / OOP | ★★☆☆☆ | Composite, Iterator, Factory |
| 15 | Design a Logger / Logging Framework | Infrastructure | ★★☆☆☆ | Singleton, Observer, Chain of Responsibility |
| 16 | Design Splitwise (Expense Sharing) | Multi-entity / Algorithm | ★★☆☆☆ | Strategy, Observer, Graph (debt simplification) |
| 17 | Design a Task Scheduler (Cron) | Scheduling | ★★☆☆☆ | Priority Queue, Strategy, Observer |
| 18 | Design a Ride-Sharing App (LLD for Uber) | Multi-entity | ★★☆☆☆ | Strategy, Observer, State, Factory |
| 19 | Design an Online Shopping Cart | E-Commerce | ★★☆☆☆ | Strategy (pricing), Observer, Builder |
| 20 | Design a Pub-Sub Messaging System | Infrastructure | ★★☆☆☆ | Observer, Mediator, Strategy |

---

## Key Observations from FAANG Interviews

### HLD Patterns (What companies focus on)

```text
Google     → Search systems, distributed infra, collaborative tools, Maps
Amazon     → E-commerce, distributed systems, cloud infra, payment
Meta       → Social feeds, messaging, real-time systems, content delivery
Microsoft  → Collaboration (Office), cloud (Azure), gaming, enterprise
Apple      → Media streaming, storage, device sync, privacy-first design
Netflix    → Streaming, recommendation, microservices resilience
Uber       → Real-time location, dispatch, payments, surge pricing
Bloomberg  → Financial data, low-latency systems, trading platforms
Stripe     → Payment processing, API design, rate limiting
LinkedIn   → Feed ranking, messaging, graph systems, notifications
```

### LLD Patterns (What companies focus on)

```text
Amazon     → Parking Lot, Vending Machine, Library System, Online Shopping
Google     → LRU Cache, File System, Task Scheduler, Pub-Sub
Microsoft  → Elevator, Chess, Snake & Ladder, ATM
Meta       → Rate Limiter, Notification System, Feed ranking logic
Uber       → Ride Sharing LLD, Food Delivery, Driver Matching
Bloomberg  → Stock Exchange LLD, Order Book, Trading System
```

---

## How to Use This List

### Phase 1 (Week 1-2): Core HLD Questions (MUST DO)
```text
Questions: HLD #1-10
Focus: URL Shortener, Twitter, Instagram, WhatsApp, YouTube, E-Commerce, Uber, Search, Dropbox, News Feed
These cover 80% of actual interview questions.
```

### Phase 2 (Week 3-4): Supporting HLD + Core LLD
```text
HLD: #11-20 (Rate Limiter, Notifications, Chat, Autocomplete, Cache, Payments, Maps, Tickets, Docs, Kafka)
LLD: #1-10 (LRU Cache, Parking Lot, Elevator, Rate Limiter, Library, Games, Booking, Vending Machine)
```

### Phase 3 (Week 5-6): Advanced + Remaining
```text
HLD: #21-30 (Spotify, TikTok, Airbnb, Stock Exchange, Crawler, CDN, Zoom, Logging, S3, Distributed Lock)
LLD: #11-20 (ATM, Chess, File System, Logger, Splitwise, Scheduler, Pub-Sub)
```

---

## System Design Interview Framework (Use for Every Question)

### HLD Template (45 minutes)

```text
Step 1: Requirements Clarification (5 min)
  - Functional requirements (what the system does)
  - Non-functional requirements (scale, latency, availability, consistency)
  - Back-of-envelope estimation (QPS, storage, bandwidth)

Step 2: High-Level Architecture (10 min)
  - Draw the main components (clients, load balancers, services, databases, caches, queues)
  - Show data flow for main use cases

Step 3: Deep Dive into Key Components (20 min)
  - Database schema + choice (SQL vs NoSQL)
  - API design (REST endpoints)
  - Scaling strategy (sharding, replication, caching)
  - Key algorithms (feed ranking, matching, encoding)

Step 4: Address Bottlenecks & Trade-offs (10 min)
  - Single points of failure
  - CAP theorem trade-offs
  - Consistency model (strong vs eventual)
  - Monitoring, alerting, fault tolerance
```

### LLD Template (45 minutes)

```text
Step 1: Requirements & Use Cases (5 min)
  - Actors and their actions
  - Core functionality scope

Step 2: Class Diagram & Relationships (15 min)
  - Identify entities/classes
  - Define relationships (has-a, is-a)
  - Apply SOLID principles

Step 3: Design Patterns (10 min)
  - Which patterns apply and why
  - Show pattern implementation

Step 4: API / Interface Design (10 min)
  - Public methods/interfaces
  - Sequence diagrams for key flows

Step 5: Edge Cases & Concurrency (5 min)
  - Thread safety
  - Error handling
  - Extensibility
```

---

## Essential Concepts Checklist

### For HLD Interviews

| Concept | Must Know |
|---|---|
| Scalability | Horizontal vs Vertical, Auto-scaling |
| Load Balancing | L4 vs L7, Round Robin, Least Connections |
| Caching | Cache-aside, Write-through, Write-back, CDN caching |
| Database | SQL vs NoSQL, Sharding, Replication, Indexing |
| CAP Theorem | CP vs AP, Consistency models |
| Message Queues | Kafka, RabbitMQ, Pub-Sub vs Point-to-Point |
| Microservices | Service discovery, API Gateway, Circuit Breaker |
| Consistent Hashing | For distributed cache/DB partitioning |
| Rate Limiting | Token Bucket, Leaky Bucket, Sliding Window |
| CDN | Push vs Pull, Edge caching |
| WebSockets | Real-time bidirectional communication |
| Database Indexing | B-Tree, Hash Index, Composite Index |
| Consensus | Raft, Paxos, Leader Election |
| Data Partitioning | Range-based, Hash-based, Geographic |

### For LLD Interviews

| Concept | Must Know |
|---|---|
| SOLID Principles | Single Responsibility, Open-Closed, Liskov, Interface Segregation, Dependency Inversion |
| Design Patterns | Factory, Strategy, Observer, Singleton, Builder, Decorator, State, Command |
| OOP Concepts | Inheritance, Polymorphism, Encapsulation, Abstraction |
| UML Diagrams | Class diagrams, Sequence diagrams |
| API Design | RESTful conventions, Request/Response structure |
| Concurrency | Thread safety, Locks, Mutex, Semaphore |
| Database Schema | Normalization, Foreign Keys, Indexing |
| Clean Code | DRY, KISS, YAGNI, Composition over Inheritance |

---

## Top Resources (Ranked by Community Usage)

```text
1. System Design Primer (GitHub - 349k stars) — Free, comprehensive
2. Grokking the System Design Interview (DesignGurus.io) — Paid, structured
3. ByteByteGo (Alex Xu's System Design Interview books) — Book + Newsletter
4. Exponent (YouTube + Platform) — Free videos + paid mock
5. HelloInterview.com — Free structured answers
6. System Design Fight Club (YouTube) — Free deep dives
7. Gaurav Sen (YouTube) — Free intuitive explanations
8. InterviewBit System Design — Free questions + approaches
9. Educative.io courses — Paid, interactive
10. Tech Dummies (YouTube) — Free, LLD focused
```
