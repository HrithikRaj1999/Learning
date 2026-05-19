# HLD 25: Design a Web Crawler

## 💡 Quick Summary

> **What**: A system that systematically downloads web pages, extracts links, and follows them to discover and index the entire web.  
> **Key Insight**: The challenge isn't downloading one page — it's crawling billions of pages politely (respecting robots.txt, rate limits) while avoiding traps (infinite loops, duplicate content, spider traps) and keeping content fresh.

---

## 🎯 The Problem in Simple Terms

Google's crawler must:
- Start with some seed URLs
- Download page → extract all links → add to queue → repeat
- Don't visit the same page twice
- Don't hammer one website (be polite)
- Prioritize important/fresh pages
- Handle the entire web: 50B+ pages

---

## 📋 Requirements

| Feature | Detail |
|---------|--------|
| Crawl pages | Download HTML from URLs |
| Extract links | Find new URLs to crawl |
| Deduplication | Don't crawl same URL/content twice |
| Politeness | Respect robots.txt; rate limit per domain |
| Prioritization | Important pages first |
| Freshness | Re-crawl changed pages periodically |

### Scale
```
Pages to crawl: 50B+
Pages/day: 1B+ (combination of new + recrawl)
Unique domains: 200M+
Storage: petabytes of raw HTML
robots.txt cache: 200M entries
URL frontier size: billions of pending URLs
```

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "🌱 Seeds"
        Seeds[Seed URLs<br/>Starting points]
    end

    subgraph "📋 URL Frontier (Priority Queue)"
        Frontier[URL Queue<br/>Billions of URLs to visit<br/>Prioritized & politeness-managed]
    end

    subgraph "⬇️ Fetchers"
        F1[Fetcher 1]
        F2[Fetcher 2]
        F3[Fetcher N<br/>Thousands in parallel]
    end

    subgraph "⚙️ Processing Pipeline"
        Parse[HTML Parser<br/>Extract links + content]
        Dedup[URL Dedup<br/>Seen this URL before?]
        ContentDedup[Content Dedup<br/>Seen this content before?]
        Robots[Robots.txt Checker<br/>Allowed to crawl?]
    end

    subgraph "🗄️ Storage"
        Visited[(Visited URLs<br/>Bloom filter + DB)]
        Content[(Page Content Store)]
        RobotsCache[(robots.txt cache)]
    end

    Seeds --> Frontier
    Frontier --> F1 & F2 & F3
    F1 & F2 & F3 --> Parse
    Parse -->|New URLs| Dedup
    Dedup -->|Not seen| Robots
    Robots -->|Allowed| Frontier
    Parse -->|Page content| ContentDedup --> Content
    Dedup --> Visited
```

---

## 🔍 Crawl Flow

```mermaid
sequenceDiagram
    participant Queue as URL Frontier
    participant Fetch as Fetcher Worker
    participant Robots2 as Robots.txt Cache
    participant Web as Target Website
    participant Parse2 as Parser
    participant Store as Storage

    Queue->>Fetch: Next URL: https://example.com/page1
    Fetch->>Robots2: Can I crawl example.com/page1?
    Robots2-->>Fetch: ✅ Allowed (not blocked by robots.txt)
    
    Fetch->>Fetch: Check politeness: last crawled example.com 2s ago
    Note over Fetch: Wait if too recent (respect rate limit)
    
    Fetch->>Web: GET https://example.com/page1
    Web-->>Fetch: HTML response (200 OK)
    
    Fetch->>Parse2: Parse HTML
    Parse2->>Parse2: Extract links: [/page2, /page3, https://other.com/x]
    Parse2->>Store: Store page content + metadata
    
    Parse2->>Queue: Add new URLs (after dedup check)
```

---

## 🎯 URL Prioritization

```mermaid
graph TD
    subgraph "Priority Factors"
        PageRank["PageRank — how many sites link here?"]
        Freshness["Freshness — how often does it change?"]
        Depth["Depth — homepage > deep subpage"]
        Type["Type — news sites recrawl hourly; static sites weekly"]
    end
    
    subgraph "Priority Queues"
        High["High Priority<br/>Major news sites, homepages<br/>Crawl every few hours"]
        Medium["Medium Priority<br/>Popular pages<br/>Crawl daily"]
        Low["Low Priority<br/>Deep/static pages<br/>Crawl weekly/monthly"]
    end
    
    PageRank & Freshness & Depth & Type --> High & Medium & Low
```

---

## 🚫 Politeness: Domain-Level Rate Limiting

```mermaid
graph TD
    subgraph "URL Frontier: Politeness Layer"
        Queue1["Queue: example.com<br/>[/page1, /page2, /page3]<br/>Rate: 1 req/second"]
        Queue2["Queue: wikipedia.org<br/>[/wiki/A, /wiki/B, ...]<br/>Rate: 1 req/2 seconds"]
        Queue3["Queue: news.com<br/>[/article1, /article2]<br/>Rate: 1 req/second"]
    end
    
    Scheduler["Scheduler: Round-robin across domain queues<br/>Each domain has its own rate limit<br/>Never overload a single site"]
    
    Queue1 & Queue2 & Queue3 --> Scheduler --> Fetchers2["Thousands of parallel fetchers"]
    
    Note["1000 fetchers can fetch from 1000 DIFFERENT domains<br/>simultaneously — but only 1 request at a time per domain"]
```

---

## 🔄 Deduplication: Bloom Filter

```mermaid
graph LR
    subgraph "Problem: Have I seen this URL before?"
        URLs["50 billion URLs seen so far<br/>Can't fit all in memory!"]
    end
    
    subgraph "Solution: Bloom Filter"
        BF["Probabilistic data structure<br/>Memory: ~1 byte per URL = 50GB<br/>False positive rate: ~1%<br/>False negative rate: 0% (never misses)"]
    end
    
    subgraph "Result"
        R1["'Not in set' → definitely new → crawl it"]
        R2["'In set' → probably seen → check DB to confirm"]
    end
    
    URLs --> BF --> R1 & R2
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| URL dedup | Bloom filter + persistent DB | Memory-efficient; tiny false positive rate acceptable |
| Politeness | Per-domain queues with rate limits | Don't get blocked; be a good citizen |
| Content dedup | SimHash (fuzzy fingerprint) | Detect near-duplicate pages (slightly different URLs, same content) |
| Priority | PageRank + freshness score | Crawl important/changing pages more often |
| Storage format | WARC (Web ARChive) | Standard format; stores headers + body + metadata |
| DNS | Local DNS cache | DNS lookups are slow; cache heavily |

---

## 🚀 Scaling

| Challenge | Solution |
|-----------|----------|
| 1B pages/day | Thousands of parallel fetchers across distributed machines |
| URL frontier (billions) | Distributed queue (sharded by domain hash) |
| Dedup at scale | Bloom filter in memory + persistent store for verification |
| robots.txt for 200M domains | Cache with TTL; refresh periodically |
| Spider traps (infinite URLs) | Max depth limit; URL pattern detection; timeout per domain |
| Freshness | Track change frequency; re-crawl at predicted intervals |
