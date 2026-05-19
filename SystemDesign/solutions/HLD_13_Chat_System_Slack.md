# HLD 13: Design Slack / Chat System

## 💡 Quick Summary

> **What**: A real-time team messaging platform with channels, direct messages, file sharing, threads, and search across message history.  
> **Key Insight**: Unlike WhatsApp (P2P focused), Slack is workspace-centric. The challenges are channel fan-out (channels with 10K+ members), message persistence, and real-time sync across devices.

---

## 🎯 The Problem in Simple Terms

Slack handles:
- Millions of workspaces, each with hundreds of channels
- Users in multiple channels simultaneously
- Messages must appear instantly for all channel members
- Full-text search across millions of messages
- File sharing, threads, reactions, mentions
- Users switch between desktop/mobile seamlessly

---

## 📋 Requirements

| Feature | Detail |
|---------|--------|
| Channels | Public/private channels within workspace |
| Direct messages | 1:1 and group DMs |
| Real-time messaging | Messages appear instantly |
| Threads | Reply to specific messages |
| File sharing | Upload and share files |
| Search | Full-text search across all messages |
| Notifications | @mentions, channel activity |
| Presence | Online/away/DND status |

### Scale
```
Workspaces: 750K+ paid
DAU: 30M+
Messages/day: 1.5B+
Concurrent WebSocket connections: 10M+
Channels per workspace: up to 50K
Members per channel: up to 10K+
Message search: full history (years of messages)
```

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "💻 Clients"
        Desktop[Desktop App]
        Mobile[Mobile App]
        Web[Web Browser]
    end

    subgraph "🌐 Connection Layer"
        WS[WebSocket Gateway<br/>Real-time delivery]
        API[REST API<br/>CRUD operations]
    end

    subgraph "⚙️ Services"
        Msg[Message Service<br/>Send, edit, delete]
        Channel[Channel Service<br/>Create, join, leave]
        Presence[Presence Service<br/>Online/Away/DND]
        Search[Search Service<br/>Full-text search]
        File[File Service<br/>Upload/download]
        Notify[Notification Service<br/>Mentions, unreads]
    end

    subgraph "🗄️ Storage"
        MsgDB[(Message Store<br/>All messages)]
        ChannelDB[(Channel & User DB)]
        SearchIdx[(Search Index<br/>Elasticsearch)]
        FileStore[(File Storage<br/>S3)]
        Cache[(Redis Cache<br/>Presence, unreads)]
    end

    subgraph "📬 Events"
        Kafka[Kafka<br/>Message events]
    end

    Desktop & Mobile & Web --> WS & API
    API --> Msg & Channel & File
    WS --> Kafka
    Kafka --> Msg & Notify & Search
    Msg --> MsgDB
    Search --> SearchIdx
    File --> FileStore
    Presence --> Cache
```

---

## 🔍 How Sending a Message Works

```mermaid
sequenceDiagram
    actor Alice
    participant WS1 as WebSocket (Alice)
    participant Msg as Message Service
    participant DB as Message DB
    participant Kafka as Kafka
    participant FanOut as Fan-out Service
    participant WS2 as WebSocket (Bob)
    participant WS3 as WebSocket (Carol)
    actor Bob
    actor Carol

    Alice->>WS1: Send "Hey team!" to #engineering
    WS1->>Msg: Create message
    Msg->>DB: Store message
    Msg-->>WS1: ✅ Message stored (show as sent)
    WS1-->>Alice: ✓ Message appears in chat

    Msg->>Kafka: Event: new_message in #engineering
    Kafka->>FanOut: Deliver to channel members
    
    FanOut->>FanOut: Get #engineering members: [Alice, Bob, Carol, ...]
    
    par Deliver to online members
        FanOut->>WS2: Push message to Bob
        WS2->>Bob: 💬 "Hey team!" appears
    and
        FanOut->>WS3: Push message to Carol
        WS3->>Carol: 💬 "Hey team!" appears
    end
    
    Note over FanOut: Offline members get unread badge on reconnect
```

---

## 📺 Channel Fan-out Strategy

```mermaid
graph TD
    Msg[New message in channel] --> Size{Channel<br/>members?}
    
    Size -->|"< 500 members<br/>(most channels)"| DirectPush["Direct WebSocket push<br/>to each online member"]
    
    Size -->|"500-5000 members"| Batched["Batched push<br/>Send in groups of 100<br/>Small delay acceptable"]
    
    Size -->|"> 5000 members<br/>(#general in large org)"| LazyPull["Lazy delivery<br/>Members fetch on app focus<br/>Only push @mentions"]
```

---

## 🔴 Unread Tracking

```mermaid
graph LR
    subgraph "Per User, Per Channel"
        Track["Channel: #engineering<br/>Last read message: msg_id_450<br/>Latest message: msg_id_472<br/>Unread count: 22"]
    end
    
    subgraph "Badge Calculation"
        Calc["Total unreads = sum across all channels<br/>Bold channel = has unreads<br/>Red badge = has @mention"]
    end
    
    Track --> Calc
```

```mermaid
sequenceDiagram
    actor User
    participant App as Slack App
    participant API as Unread Service
    participant Redis as Redis

    Note over User: Opens #engineering channel
    App->>API: Mark #engineering as read (cursor = msg_472)
    API->>Redis: SET user:123:channel:eng:last_read = msg_472
    API-->>App: ✅ Unread count → 0
    
    Note over User: New message arrives later
    App->>App: Message msg_473 arrives via WebSocket
    App->>App: Increment unread badge locally
```

---

## 🔍 Search Architecture

```mermaid
graph LR
    subgraph "Indexing Pipeline"
        Msg[New Message] --> Kafka[Kafka]
        Kafka --> Indexer[Search Indexer]
        Indexer --> ES[(Elasticsearch<br/>Full-text index<br/>Per workspace)]
    end
    
    subgraph "Search Query"
        User[User searches: 'deployment plan'] --> API[Search API]
        API --> ES
        ES -->|"Results"| API
        API --> Filter["Filter by:<br/>• Channel access<br/>• Date range<br/>• From user"]
        Filter --> Results["Matching messages<br/>with context"]
    end
```

---

## 🟢 Presence System (Online/Away/DND)

```mermaid
graph TD
    subgraph "How presence works"
        Heartbeat["Client sends heartbeat<br/>every 30 seconds via WebSocket"]
        Heartbeat --> Redis["Redis: SET presence:user_123 'active' EX 60"]
        
        NoHeartbeat["No heartbeat for 60 seconds"]
        NoHeartbeat --> Away["User marked as AWAY"]
    end
    
    subgraph "Presence states"
        Active["🟢 Active<br/>Heartbeat within 60s"]
        AwayState["🟡 Away<br/>No heartbeat > 60s"]
        DND["⛔ Do Not Disturb<br/>Manual setting"]
        Offline["⚫ Offline<br/>No connection"]
    end
```

---

## 🗄️ Data Architecture

```mermaid
graph TB
    subgraph "Messages (Vitess/MySQL Sharded)"
        Messages["Sharded by workspace_id + channel_id<br/>Billions of messages<br/>Append-only (rarely edited)"]
    end
    
    subgraph "Metadata (PostgreSQL)"
        Meta["Workspaces, channels, members<br/>Permissions, settings<br/>User profiles"]
    end
    
    subgraph "Real-time State (Redis)"
        RT["Presence status<br/>Unread cursors<br/>Active typing indicators<br/>WebSocket → user mapping"]
    end
    
    subgraph "Search (Elasticsearch)"
        Search2["Full message text<br/>Indexed per workspace<br/>ACL-aware search"]
    end
    
    subgraph "Files (S3 + CDN)"
        Files2["Uploaded files<br/>Thumbnails generated<br/>Served via CDN"]
    end
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Protocol | WebSocket (real-time) + REST (CRUD) | WebSocket for live messages; REST for everything else |
| Message ordering | Per-channel sequential IDs | Simple; no cross-channel ordering needed |
| Fan-out | Direct push for small channels; lazy for huge ones | Balance between instant delivery and server load |
| Search | Elasticsearch per workspace | Full-text search with access control |
| Unread tracking | Redis (user:channel cursor) | Fast reads; millions of updates/sec |
| Message storage | Sharded SQL (Vitess) | Need ordering, history, pagination |
| Typing indicators | Ephemeral (don't persist) | "Alice is typing..." is transient info |

---

## 🚀 Scaling Challenges

| Challenge | Solution |
|-----------|----------|
| 10M+ WebSocket connections | Gateway fleet; each handles ~100K connections |
| Large channel delivery (#general 10K+) | Lazy delivery; only push @mentions |
| Message search (years of history) | Elasticsearch sharded per workspace |
| File uploads in chat | S3 + async thumbnail generation |
| Cross-device sync | Unread cursors in Redis; sync on reconnect |
| Workspace isolation | Shard data by workspace; strict ACL |
