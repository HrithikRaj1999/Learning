# HLD 14: Design Autocomplete / Typeahead

## 💡 Quick Summary

> **What**: A system that suggests search completions as the user types, showing the most relevant suggestions within 100ms of each keystroke.  
> **Key Insight**: Use a Trie (prefix tree) data structure for fast prefix lookups, combined with pre-computed popularity rankings. The challenge is updating suggestions based on trending queries.

---

## 🎯 The Problem in Simple Terms

When you type "how to m..." in Google:
- Within 100ms, you see: "how to make pancakes", "how to meditate", "how to multiply fractions"
- These suggestions change based on what's trending, your location, and your personal history
- Google handles 8.5B searches/day → each keystroke triggers a suggestion lookup

---

## 📋 Requirements

| Feature | Detail |
|---------|--------|
| Prefix matching | Type "app" → show "apple", "application", "app store" |
| Top-K results | Show top 5-10 most popular matches |
| Fast response | < 100ms per keystroke (ideally < 50ms) |
| Fresh data | Trending queries appear within minutes |
| Personalization | Boost based on user's history |
| Multi-language | Support different scripts/languages |

### Scale
```
Queries/day: 8.5B
Unique queries: 5B+ (long tail)
Suggestions per keystroke: top 10
Latency budget: < 100ms
Updates: Trending queries appear within 5 minutes
QPS for autocomplete: ~60,000 (each search = ~5 keystrokes)
```

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "👤 User Types"
        User["User typing: 'how to m...'"]
    end

    subgraph "⚡ Serving Layer (real-time)"
        LB[Load Balancer]
        TrieServer[Trie Servers<br/>In-memory prefix lookup<br/>Multiple replicas]
    end

    subgraph "🔄 Data Collection (async)"
        QueryLog[Query Log<br/>All searches]
        Sampler[Sampler<br/>Sample 1/100 queries]
        Aggregator[Aggregator Service<br/>Count query frequencies]
        TrieBuilder[Trie Builder<br/>Rebuild trie periodically]
    end

    subgraph "🗄️ Storage"
        TrieStore[(Trie Snapshot<br/>Serialized trie data)]
        QueryDB[(Query Frequency DB)]
    end

    User -->|"Every keystroke"| LB --> TrieServer
    TrieServer -->|"Loads trie"| TrieStore
    
    QueryLog --> Sampler --> Aggregator --> QueryDB
    QueryDB --> TrieBuilder --> TrieStore
```

---

## 🌳 How the Trie Works

### What is a Trie? (Visual)

```mermaid
graph TD
    Root[Root] --> H[h]
    Root --> A[a]
    
    H --> HO[ho]
    HO --> HOW[how]
    HOW --> HOWT["how t"]
    HOWT --> HOWTO["how to"]
    HOWTO --> HOWTOM["how to m<br/>★ suggestions stored here"]
    
    A --> AP[ap]
    AP --> APP[app]
    APP --> APPL[appl]
    APPL --> APPLE["apple ★"]
    APP --> APPS["apps ★"]
    
    HOWTOM --> S1["how to make pancakes (freq: 50K)"]
    HOWTOM --> S2["how to meditate (freq: 45K)"]
    HOWTOM --> S3["how to multiply fractions (freq: 30K)"]
```

### Lookup Flow

```mermaid
sequenceDiagram
    actor User
    participant App as Frontend
    participant Server as Trie Server

    User->>App: Types "h"
    App->>Server: GET /suggest?q=h
    Server->>Server: Traverse trie to node "h"
    Server-->>App: [hello, how, house, help, ...]
    App-->>User: Show suggestions (50ms)
    
    User->>App: Types "ho" (debounced 100ms)
    App->>Server: GET /suggest?q=ho
    Server->>Server: Traverse trie to node "ho"
    Server-->>App: [how to, hotel, house, honda]
    App-->>User: Update suggestions
    
    User->>App: Types "how to m"
    App->>Server: GET /suggest?q=how to m
    Server->>Server: Traverse to "how to m" node
    Server->>Server: Return pre-computed top-10
    Server-->>App: [how to make pancakes, how to meditate, ...]
    App-->>User: Show final suggestions
```

---

## ⚡ Why Trie is Fast

```mermaid
graph LR
    subgraph "Trie: O(length of prefix)"
        T1["Type 'how' → 3 node traversals<br/>Find pre-stored top results<br/>Total: O(3) + O(1) = instant!"]
    end
    
    subgraph "vs. Database: O(log N)"
        T2["SELECT * WHERE query LIKE 'how%'<br/>ORDER BY frequency DESC LIMIT 10<br/>Scans millions of rows → SLOW"]
    end
```

**Key optimization**: Store the top-10 suggestions at EACH trie node (pre-computed). No need to traverse all children at query time.

---

## 🔄 How Suggestions Stay Fresh

```mermaid
graph LR
    subgraph "Every 5 minutes"
        Queries["Real-time query stream<br/>8.5B queries/day"]
        Sample["Sample 1%<br/>85M queries/day"]
        Count["Count frequencies<br/>per 5-min window"]
        Combine["Combine with historical<br/>decay old, boost new"]
        Build["Rebuild affected trie nodes"]
        Deploy["Push to Trie servers<br/>(hot swap)"]
    end
    
    Queries --> Sample --> Count --> Combine --> Build --> Deploy
```

### Freshness Example (Trending Query)

```mermaid
graph TD
    subgraph "Normal Day"
        Normal["'super bowl' frequency: 1,000/day<br/>Not in top suggestions for 'sup...'"]
    end
    
    subgraph "Super Bowl Sunday"
        Trending["'super bowl' frequency: 500,000/hour!<br/>Quickly rises to #1 suggestion for 'su...'"]
    end
    
    Normal -->|"Event happens"| Trending
    Trending -->|"Within 5 minutes"| Updated["Trie updated:<br/>'su...' → super bowl (top!)"]
```

---

## 🗄️ Data Flow (Collection → Serving)

```mermaid
graph TB
    subgraph "1️⃣ Collection"
        Users["Users search<br/>8.5B/day"] --> Kafka["Kafka<br/>Query stream"]
    end
    
    subgraph "2️⃣ Aggregation"
        Kafka --> MapReduce["Frequency counter<br/>(MapReduce / Flink)"]
        MapReduce --> FreqDB["Frequency Store<br/>'how to cook': 2.3M<br/>'how to code': 1.8M"]
    end
    
    subgraph "3️⃣ Trie Building"
        FreqDB --> Builder["Trie Builder<br/>Insert top queries<br/>Pre-compute top-K per node"]
        Builder --> Snapshot["Trie Snapshot<br/>(serialized, ~10GB)"]
    end
    
    subgraph "4️⃣ Serving"
        Snapshot --> Server1["Trie Server 1"]
        Snapshot --> Server2["Trie Server 2"]
        Snapshot --> ServerN["Trie Server N"]
    end
```

---

## 💡 Client-Side Optimizations

```mermaid
graph TD
    subgraph "Frontend Tricks (reduce server load)"
        Debounce["⏱️ Debounce<br/>Wait 100-200ms between keystrokes<br/>Don't fire on every letter"]
        
        LocalCache["💾 Browser Cache<br/>Cache recent prefixes locally<br/>'ho' → results cached for 5 min"]
        
        PrefixReuse["♻️ Prefix Reuse<br/>If 'how' returned 10 results<br/>Filter locally for 'how t'<br/>(don't hit server again)"]
        
        MinChars["📏 Min Chars<br/>Don't search until 2+ chars<br/>(too many results for 1 char)"]
    end
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Data structure | Trie (in-memory) | O(prefix length) lookup; fast prefix matching |
| Storage | Pre-compute top-K per node | Avoid expensive tree traversal at query time |
| Freshness | Rebuild every 5 minutes | Balance between freshness and computation cost |
| Sharding | Shard by prefix range (a-m, n-z) | Even distribution of queries |
| Personalization | Boost user's history on top of global | Client sends user context; server re-ranks |
| Multi-language | Separate trie per language/region | Different trending topics per locale |

---

## 🚀 Scaling Strategy

| Challenge | Solution |
|-----------|----------|
| 60K QPS for suggestions | Multiple trie server replicas; in-memory = fast |
| 5B unique queries in trie | Only keep top 10M most popular (covers 99% of searches) |
| Trie size (~10-50GB) | Fits in memory per server; shard if needed |
| Fresh trending data | Stream processing (Kafka + Flink); 5-min rebuild cycles |
| Multi-region latency | Trie replicas in each region |
| Long-tail queries (rare) | Fall back to DB search for unpopular prefixes |
