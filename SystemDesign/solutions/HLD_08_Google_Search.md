# HLD 08: Design Google Search

## 💡 Quick Summary

> **What**: A web search engine that crawls the internet, indexes billions of pages, and returns relevant results in milliseconds.  
> **Key Insight**: The system has two halves — an offline pipeline (crawl → index billions of pages) and an online serving system (search → rank → return results in < 200ms).

---

## 🎯 The Problem in Simple Terms

Google indexes 100+ BILLION web pages. When you type "best pizza near me":
- It searches through 100B+ documents
- Finds the most relevant ones
- Ranks them by 200+ signals
- Returns results in < 200ms

This requires two systems working together:
1. **Crawling & Indexing** (offline, runs continuously): "Read the entire internet"
2. **Search & Ranking** (online, real-time): "Find the needle in the haystack, instantly"

---

## 📋 Requirements

### What It Must Do
| Feature | Detail |
|---------|--------|
| Web crawling | Discover & download web pages continuously |
| Indexing | Process pages into searchable format |
| Search | Return relevant results for any query |
| Ranking | Order by relevance (PageRank + 200 signals) |
| Autocomplete | Suggest queries as user types |
| Freshness | New pages indexed within minutes-hours |

### Scale Numbers
```
Web pages indexed: 100B+
Searches/day: 8.5B (100,000/second)
New/updated pages/day: hundreds of millions
Index size: 100+ PB
Latency: < 200ms for results
Availability: 99.999%
```

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "🕷️ Offline: Crawl & Index Pipeline"
        Seed[Seed URLs] --> Crawler[Web Crawler<br/>Fetch pages]
        Crawler --> Parser[HTML Parser<br/>Extract text & links]
        Parser --> NewURLs[New URLs<br/>Back to crawler]
        Parser --> Indexer[Indexer<br/>Build inverted index]
        Indexer --> Index[(Inverted Index<br/>Distributed across 1000s of machines)]
    end

    subgraph "🔍 Online: Search & Serve"
        User[User Query] --> Frontend[Search Frontend]
        Frontend --> QP[Query Processor<br/>Parse & expand query]
        QP --> Scatter[Scatter to index shards]
        Scatter --> Shard1[Index Shard 1]
        Scatter --> Shard2[Index Shard 2]
        Scatter --> ShardN[Index Shard N]
        Shard1 & Shard2 & ShardN --> Gather[Gather & Merge]
        Gather --> Ranker[Ranking Service<br/>ML model + PageRank]
        Ranker --> Results[Top 10 Results]
    end

    NewURLs -->|Feed back| Crawler
```

---

## 🕷️ How Web Crawling Works

```mermaid
sequenceDiagram
    participant Scheduler as URL Scheduler
    participant Crawler as Crawler Workers (1000s)
    participant DNS as DNS Resolver
    participant Web as Internet
    participant Store as Page Store
    participant URLFrontier as URL Frontier

    Scheduler->>Crawler: Here are 10,000 URLs to fetch
    
    loop For each URL
        Crawler->>DNS: Resolve domain → IP
        DNS-->>Crawler: IP address
        Crawler->>Web: HTTP GET page
        Web-->>Crawler: HTML content
        Crawler->>Crawler: Check robots.txt (allowed?)
        Crawler->>Store: Save raw HTML
        Crawler->>Crawler: Extract all links from page
        Crawler->>URLFrontier: Add new discovered URLs
    end
    
    URLFrontier->>Scheduler: Prioritize: which URLs to crawl next?
```

### URL Prioritization

```mermaid
graph TD
    subgraph "URL Priority Queue"
        High[🔴 High Priority<br/>• News sites (fresh!)<br/>• High PageRank sites<br/>• Recently changed]
        Medium[🟡 Medium Priority<br/>• Regular popular sites<br/>• Updated weekly]
        Low[🟢 Low Priority<br/>• Rarely changing pages<br/>• Low PageRank]
    end
    
    High -->|"Crawl every hour"| Crawler
    Medium -->|"Crawl every few days"| Crawler
    Low -->|"Crawl every month"| Crawler
    
    Crawler[Crawler Workers]
```

---

## 📑 How Indexing Works (Inverted Index)

### What is an Inverted Index?

Think of it like a book index. Instead of "page → words on that page", it's "word → which pages contain that word."

```mermaid
graph LR
    subgraph "Forward Index (what's on each page)"
        Page1["Page 1: 'The cat sat on the mat'"]
        Page2["Page 2: 'The dog chased the cat'"]
        Page3["Page 3: 'The mat is blue'"]
    end
    
    subgraph "Inverted Index (word → pages)"
        Cat["'cat' → [Page 1, Page 2]"]
        Mat["'mat' → [Page 1, Page 3]"]
        Dog["'dog' → [Page 2]"]
        Blue["'blue' → [Page 3]"]
    end
    
    Page1 & Page2 & Page3 -->|"Indexing<br/>process"| Cat & Mat & Dog & Blue
```

### Building the Index

```mermaid
graph LR
    Raw[Raw HTML Pages] --> Parse[Parse & Clean<br/>Remove tags, scripts]
    Parse --> Tokenize[Tokenize<br/>Split into words]
    Tokenize --> Normalize[Normalize<br/>lowercase, stem]
    Normalize --> Build[Build Posting Lists<br/>word → doc_ids + positions]
    Build --> Distribute[Distribute across<br/>1000s of index servers]
```

---

## 🔍 How a Search Query is Served

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant QP as Query Processor
    participant Index as Index Shards (1000s)
    participant Rank as Ranking Service

    User->>FE: "best pizza restaurants NYC"
    FE->>QP: Process query
    QP->>QP: Tokenize: [best, pizza, restaurants, nyc]
    QP->>QP: Expand: [pizza → pizzeria, NYC → new york city]
    QP->>QP: Intent: local restaurant search
    
    QP->>Index: Scatter query to all relevant shards
    
    Note over Index: Each shard searches its portion
    Note over Index: Find docs containing: pizza AND restaurants AND nyc
    
    Index-->>QP: Shard 1: [doc_a, doc_b, doc_c] with scores
    Index-->>QP: Shard 2: [doc_d, doc_e] with scores
    Index-->>QP: Shard N: [doc_f] with scores
    
    QP->>Rank: Merge all candidates, apply ranking
    Rank->>Rank: Apply 200+ ranking signals
    Rank-->>FE: Top 10 results sorted by relevance
    FE-->>User: Results page (< 200ms total!)
```

### Scatter-Gather Pattern (Visual)

```mermaid
graph TB
    Query[User Query] --> Scatter[Scatter to ALL shards]
    
    Scatter --> S1[Shard 1<br/>docs A-M<br/>local search]
    Scatter --> S2[Shard 2<br/>docs N-Z<br/>local search]
    Scatter --> S3[Shard 3<br/>docs ...<br/>local search]
    
    S1 -->|"Top 100 local results"| Gather[Gather & Merge]
    S2 -->|"Top 100 local results"| Gather
    S3 -->|"Top 100 local results"| Gather
    
    Gather --> Rank[Global Ranking<br/>Pick top 10 overall]
    Rank --> User2[Return to User]
```

---

## 📊 PageRank (Simplified)

```mermaid
graph LR
    subgraph "Pages linking to each other"
        A[Page A<br/>Links: B, C]
        B[Page B<br/>Links: C]
        C[Page C<br/>Links: A]
        D[Page D<br/>Links: A, B, C]
    end
    
    subgraph "PageRank Score"
        ScoreA["Page A: High<br/>(C and D link to it)"]
        ScoreC["Page C: Highest<br/>(A, B, and D link to it)"]
        ScoreB["Page B: Medium<br/>(A and D link to it)"]
    end
```

**Key insight**: A page is important if other important pages link to it. It's like voting — a link from NYTimes counts more than a link from a random blog.

---

## 🗄️ Data Architecture

```mermaid
graph TB
    subgraph "Index Servers (Search)"
        IS["Inverted Index<br/>Sharded across 1000s of servers<br/>Each shard: portion of all documents<br/>Replicated 3x for availability"]
    end
    
    subgraph "Document Store"
        DS["Full page content<br/>Used for snippets in results<br/>Compressed storage"]
    end
    
    subgraph "URL Database"
        URLdb["All known URLs<br/>Crawl status, last visited<br/>Priority for re-crawl"]
    end
    
    subgraph "Knowledge Graph"
        KG["Entity information<br/>Used for rich results<br/>(info boxes, etc.)"]
    end
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Index distribution | Sharded by document ID | Even distribution; parallel search |
| Freshness vs. cost | Tiered crawl frequency | Important pages hourly; others weekly/monthly |
| Ranking | ML model (200+ signals) | Pure PageRank not enough; need context, freshness, location |
| Index update | Batch + real-time | Batch for full re-index; real-time for breaking news |
| Result count | Estimate, don't count | "About 1.2B results" is estimate (faster than exact) |
| Serving | Replicate each shard 3x | Any replica can serve; handles node failures |

---

## 🚀 Scaling Challenges

| Challenge | Solution |
|-----------|----------|
| 100B+ pages to index | Distribute across 1000s of index servers |
| 100K queries/second | Each shard handles portion; replicas for throughput |
| Freshness (breaking news) | Separate "real-time index" merged with main index |
| Global latency | Data centers per continent; serve from nearest |
| Crawl politeness | Respect robots.txt; rate limit per domain |
| Malicious pages (SEO spam) | Spam detection in ranking pipeline |
