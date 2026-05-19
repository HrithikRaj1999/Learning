# HLD 24: Design a Stock Exchange

## 💡 Quick Summary

> **What**: A system that matches buy/sell orders for financial instruments in real-time with extreme low latency and strict ordering guarantees.  
> **Key Insight**: The matching engine is the heart — it MUST be single-threaded and deterministic. At stock exchanges, microsecond latency matters. This is one of the few systems where you optimize for latency over scalability.

---

## 🎯 The Problem in Simple Terms

When a trader submits "Buy 100 shares of AAPL at $150":
- The system must check if anyone is selling AAPL at ≤ $150
- If yes → match instantly (microseconds)
- If no → add to the order book, wait for a matching seller
- MUST be fair: first order in = first to be matched (FIFO)
- MUST be consistent: everyone sees the same order of trades

---

## 📋 Requirements

| Feature | Detail |
|---------|--------|
| Place orders | Market, limit, stop orders |
| Order matching | Price-time priority (FIFO) |
| Order book | Real-time bid/ask display |
| Trade execution | Instant notification on fill |
| Market data | Real-time prices to all subscribers |
| Risk checks | Pre-trade validation |

### Scale
```
Orders/second: 100K - 1M (peak)
Matching latency: < 10 microseconds
Instruments: 10,000+ (stocks, options, etc.)
Concurrent users: 1M+ (traders, brokers, bots)
Uptime requirement: 99.999% during market hours
Market data updates: millions/second to subscribers
```

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "👥 Participants"
        Trader[Retail Traders]
        Broker[Brokers/Institutions]
        HFT[High-Frequency Traders]
    end

    subgraph "🚪 Gateway Layer"
        GW[Order Gateway<br/>Validation + Rate Limit]
        Risk[Risk Engine<br/>Pre-trade checks]
    end

    subgraph "⚡ Core (Ultra-low latency)"
        ME[Matching Engine<br/>Single-threaded per symbol<br/>In-memory order book]
    end

    subgraph "📡 Output"
        MarketData[Market Data Publisher<br/>Prices to everyone]
        TradeFeed[Trade Confirmation<br/>Back to traders]
    end

    subgraph "🗄️ Persistence"
        Journal[(Write-Ahead Journal<br/>Every order & trade)]
        DB[(Trade Database<br/>Settlement + history)]
    end

    Trader & Broker & HFT --> GW --> Risk --> ME
    ME --> MarketData & TradeFeed
    ME --> Journal --> DB
```

---

## 🔍 The Order Book & Matching

```mermaid
graph TD
    subgraph "Order Book for AAPL"
        subgraph "🟢 Bids (Buy Orders) — sorted highest first"
            B1["$150.10 × 500 shares (Alice)"]
            B2["$150.05 × 200 shares (Bob)"]
            B3["$150.00 × 1000 shares (Carol)"]
        end
        
        subgraph "🔴 Asks (Sell Orders) — sorted lowest first"
            A1["$150.15 × 300 shares (Dave)"]
            A2["$150.20 × 800 shares (Eve)"]
            A3["$150.50 × 100 shares (Frank)"]
        end
        
        Spread["Spread: $150.10 (best bid) — $150.15 (best ask) = $0.05"]
    end
```

### Matching Example

```mermaid
sequenceDiagram
    participant Trader as New Order
    participant ME as Matching Engine
    participant Book as Order Book
    participant Out as Trade Output

    Trader->>ME: SELL 400 AAPL @ Market (sell at any price)
    
    ME->>Book: Check best bid
    Note over Book: Best bid: $150.10 × 500 shares (Alice)
    
    ME->>ME: Match! Sell 400 to Alice @ $150.10
    Note over ME: Alice's order: 500 - 400 = 100 remaining
    
    ME->>Book: Update Alice's order to 100 shares
    ME->>Out: Trade: 400 AAPL @ $150.10 (Seller ↔ Alice)
    ME->>Out: Market data: Last trade $150.10
```

---

## ⚡ Why Single-Threaded Matching Engine?

```mermaid
graph TD
    subgraph "❌ Multi-threaded approach"
        Problem["Two threads match against same order<br/>→ Sold 500 shares to two buyers!<br/>→ Race condition = financial disaster"]
    end
    
    subgraph "✅ Single-threaded approach"
        Solution["One thread processes one order at a time<br/>→ Deterministic, no locks needed<br/>→ Sequential = correct by design<br/>→ Still fast: millions of matches/sec<br/>(in-memory, no I/O)"]
    end
    
    subgraph "Scalability trick"
        Shard["Each SYMBOL gets its own matching engine<br/>AAPL → Engine 1<br/>GOOGL → Engine 2<br/>TSLA → Engine 3<br/>Symbols are independent = parallel!"]
    end
```

---

## 🔄 Order Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Received: Order submitted
    Received --> Validated: Pass risk checks
    Received --> Rejected: Fail checks (insufficient funds, etc.)
    Validated --> Queued: Added to matching queue
    Queued --> PartialFill: Partially matched
    Queued --> Filled: Fully matched
    Queued --> Open: No match yet (resting in book)
    PartialFill --> Filled: Remaining shares matched
    Open --> Filled: New counter-order arrives
    Open --> Cancelled: Trader cancels
    Filled --> [*]
    Cancelled --> [*]
    Rejected --> [*]
```

---

## 📡 Market Data Distribution

```mermaid
graph LR
    ME2[Matching Engine] --> Sequencer["Sequencer<br/>Assign global sequence #"]
    Sequencer --> Multicast["UDP Multicast<br/>Same data to ALL subscribers simultaneously"]
    Multicast --> Sub1["Broker A"]
    Multicast --> Sub2["Broker B"]
    Multicast --> Sub3["HFT Firm"]
    Multicast --> Sub4["Data Vendors (Bloomberg)"]
    
    Note["UDP Multicast = fairness<br/>Everyone gets the data at the same time<br/>No one gets an unfair speed advantage"]
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Matching engine | Single-threaded, in-memory | Correctness > throughput; no locks needed |
| Scaling | Shard by symbol (one engine per symbol) | Symbols are independent; horizontal scale |
| Persistence | Write-ahead journal (synchronous) | Can replay to recover state after crash |
| Market data | UDP multicast | Fair access; lowest latency to all subscribers |
| Language/runtime | C++ or Rust (no GC!) | Garbage collection pauses = unacceptable latency spikes |
| Network | Kernel bypass (DPDK), co-located servers | Every microsecond matters at this level |

---

## 🚀 Scaling

| Challenge | Solution |
|-----------|----------|
| 1M orders/second | Shard by symbol across matching engines |
| Microsecond latency | In-memory; kernel bypass networking; no GC languages |
| Fault tolerance | Write-ahead log + hot standby (replay journal) |
| Market data fanout | UDP multicast (one send → all receive) |
| Global access | Regional gateways → central matching (for consistency) |
| After-hours processing | Batch settlement, clearing, reconciliation |
