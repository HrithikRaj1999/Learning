# HLD 20: Design a Message Queue (like Kafka)

## 💡 Quick Summary

> **What**: A distributed messaging system that decouples producers from consumers, enabling async communication, event streaming, and reliable delivery at massive scale.  
> **Key Insight**: Kafka's secret is treating messages as an append-only log (like a commit log). This enables high throughput (sequential writes), replay (re-read old messages), and consumer independence.

---

## 🎯 The Problem in Simple Terms

Without a message queue:
- Service A calls Service B directly → if B is down, A fails too
- If B is slow, A is slow (tight coupling)
- If 1M events happen at once, B gets overwhelmed

With a message queue:
- A publishes events to the queue → A is done (fast!)
- B reads from the queue at its own pace
- If B dies, messages wait safely until B recovers

---

## 📋 Requirements

| Feature | Detail |
|---------|--------|
| Publish messages | Producers write to topics |
| Subscribe & consume | Consumers read from topics |
| Ordering | Messages ordered within a partition |
| Durability | Messages persisted to disk (not lost) |
| Replay | Re-read old messages (reset offset) |
| Consumer groups | Multiple consumers share work |
| At-least-once delivery | Every message processed at least once |

### Scale (Kafka-level)
```
Throughput: 1M+ messages/second per broker
Messages/day: 1 trillion+ (LinkedIn scale)
Retention: 7 days default (configurable, some keep forever)
Latency: < 10ms end-to-end
Brokers: 1000+ in a cluster
Topics: 100,000+
```

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "📤 Producers"
        P1[Order Service]
        P2[User Service]
        P3[Payment Service]
    end

    subgraph "📬 Kafka Cluster"
        subgraph "Topic: orders (3 partitions)"
            Part0[Partition 0<br/>Msgs: 0,3,6,9...]
            Part1[Partition 1<br/>Msgs: 1,4,7,10...]
            Part2[Partition 2<br/>Msgs: 2,5,8,11...]
        end
        
        subgraph "Brokers"
            B1[Broker 1<br/>Leader: Part 0]
            B2[Broker 2<br/>Leader: Part 1]
            B3[Broker 3<br/>Leader: Part 2]
        end
    end

    subgraph "📥 Consumer Group A (Email Service)"
        C1[Consumer 1<br/>Reads Part 0]
        C2[Consumer 2<br/>Reads Part 1, 2]
    end

    subgraph "📥 Consumer Group B (Analytics)"
        C3[Consumer 3<br/>Reads Part 0,1,2]
    end

    P1 & P2 & P3 --> Part0 & Part1 & Part2
    Part0 --> C1 & C3
    Part1 --> C2 & C3
    Part2 --> C2 & C3
```

---

## 🔍 Core Concepts Explained

### Topics & Partitions

```mermaid
graph TD
    subgraph "Topic = logical channel (like a category)"
        Topic["Topic: 'user-events'"]
    end
    
    subgraph "Partitions = physical splits for parallelism"
        P0["Partition 0<br/>Messages: [msg0, msg3, msg6, msg9]<br/>Ordered within partition!"]
        P1_2["Partition 1<br/>Messages: [msg1, msg4, msg7, msg10]"]
        P2_2["Partition 2<br/>Messages: [msg2, msg5, msg8, msg11]"]
    end
    
    Topic --> P0 & P1_2 & P2_2
    
    Note["More partitions = more parallelism<br/>Each partition = one ordered log<br/>Partition chosen by: hash(key) % num_partitions"]
```

### How Partitioning Ensures Order

```mermaid
graph LR
    subgraph "All events for user_123 go to SAME partition"
        E1["user_123: created account"] --> P["Partition 2<br/>(hash('user_123') % 3 = 2)"]
        E2["user_123: updated email"] --> P
        E3["user_123: deleted account"] --> P
    end
    
    Note["These events processed IN ORDER<br/>because same partition = guaranteed ordering"]
```

---

## 🔍 How Publishing Works

```mermaid
sequenceDiagram
    participant Producer as Order Service
    participant Kafka as Kafka Broker (Leader)
    participant Replica as Follower Replica

    Producer->>Kafka: Publish: {topic: "orders", key: "order_456", value: {status: "created"}}
    Kafka->>Kafka: Determine partition: hash("order_456") % 3 = 1
    Kafka->>Kafka: Append to Partition 1 log (sequential write to disk)
    Kafka->>Replica: Replicate to followers
    Replica-->>Kafka: ACK (replicated)
    Kafka-->>Producer: ✅ Offset 847 (message position in partition)
    
    Note over Kafka: Sequential disk write = FAST!<br/>Like appending to a file<br/>Can handle 1M+ msgs/sec per broker
```

---

## 🔍 How Consuming Works

```mermaid
sequenceDiagram
    participant Consumer as Email Service
    participant Kafka as Kafka Broker

    Consumer->>Kafka: POLL: Give me messages from Partition 1, offset 845+
    Kafka-->>Consumer: [msg@845, msg@846, msg@847] (batch)
    
    Consumer->>Consumer: Process messages (send emails)
    Consumer->>Kafka: COMMIT offset 848 (I've processed up to here)
    
    Note over Consumer: If consumer dies before commit:<br/>Next consumer starts from last committed offset<br/>= message re-processed (at-least-once)
    
    Consumer->>Kafka: POLL: Give me from offset 848+
    Kafka-->>Consumer: [msg@848, msg@849, ...]
```

---

## 👥 Consumer Groups (Parallel Processing)

```mermaid
graph TD
    subgraph "Topic with 4 partitions"
        P0_3["Partition 0"]
        P1_3["Partition 1"]
        P2_3["Partition 2"]
        P3["Partition 3"]
    end
    
    subgraph "Consumer Group: 'email-service' (3 consumers)"
        CG1["Consumer 1<br/>Assigned: P0"]
        CG2["Consumer 2<br/>Assigned: P1"]
        CG3["Consumer 3<br/>Assigned: P2, P3"]
    end
    
    P0_3 --> CG1
    P1_3 --> CG2
    P2_3 & P3 --> CG3
    
    Note["Each partition assigned to exactly ONE consumer in a group<br/>= no duplicate processing within a group<br/>Add more consumers = more parallelism (up to # partitions)"]
```

### What happens when a consumer dies?

```mermaid
graph LR
    subgraph "Before failure"
        B_C1["Consumer 1: P0, P1"]
        B_C2["Consumer 2: P2, P3"]
    end
    
    subgraph "Consumer 2 dies 💀"
        Rebalance["REBALANCE triggered!"]
    end
    
    subgraph "After rebalance"
        A_C1["Consumer 1: P0, P1, P2, P3<br/>(takes over dead consumer's partitions)"]
    end
    
    B_C1 & B_C2 --> Rebalance --> A_C1
```

---

## 💾 Storage: The Append-Only Log

```mermaid
graph LR
    subgraph "Partition = Append-only log on disk"
        Seg1["Segment 1 (old)<br/>offsets 0-999<br/>May be deleted after retention"]
        Seg2["Segment 2<br/>offsets 1000-1999"]
        Seg3["Segment 3 (active)<br/>offsets 2000-2847<br/>New messages appended here"]
    end
    
    Seg1 --> Seg2 --> Seg3
    
    Write["New message → append to end<br/>Sequential I/O = FAST!<br/>(100x faster than random writes)"]
```

**Why is Kafka so fast?**
- Sequential disk writes (append-only) are almost as fast as RAM
- Zero-copy: data goes disk → network without CPU copying
- Batching: sends groups of messages together
- No random seeks (unlike traditional databases)

---

## 🔄 Replication (Durability)

```mermaid
graph TD
    subgraph "Partition 0 (replication factor = 3)"
        Leader["Broker 1 - LEADER<br/>Handles all reads/writes"]
        Follower1["Broker 2 - FOLLOWER<br/>Copies from leader"]
        Follower2["Broker 3 - FOLLOWER<br/>Copies from leader"]
    end
    
    Leader -->|"Replicate"| Follower1
    Leader -->|"Replicate"| Follower2
    
    subgraph "If Leader dies"
        Elect["Follower 1 becomes new Leader<br/>No data loss!"]
    end
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Storage | Append-only log (disk) | Fast sequential I/O; cheap; durable |
| Ordering | Per-partition (not global) | Global ordering = single partition = no parallelism |
| Delivery | At-least-once (default) | Can achieve exactly-once with idempotent producer |
| Retention | Time-based (7 days default) | Not infinite; configurable per topic |
| Pull vs Push | Consumer pulls | Consumer controls pace; handles slow consumers gracefully |
| Replication | Synchronous (ISR) | Leader waits for N replicas before ACK = durable |

---

## 🚀 Scaling

| Challenge | Solution |
|-----------|----------|
| Throughput | Add partitions → add consumers → linear scaling |
| Storage | Segments expire based on retention policy |
| Broker failure | Replication + automatic leader election |
| Consumer failure | Rebalance partitions to remaining consumers |
| Ordering requirements | Use same partition key for related events |
| Exactly-once | Idempotent producer + transactional consumer |
