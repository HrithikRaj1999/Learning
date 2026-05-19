# HLD 04: Design WhatsApp (Real-Time Messaging)

## 💡 Quick Summary

> **What**: A real-time messaging system supporting 1:1 chats, group chats, media sharing, and online status.  
> **Key Insight**: The core challenge is maintaining persistent connections (WebSockets) to billions of devices and reliably delivering messages even when users are offline.

---

## 🎯 The Problem in Simple Terms

WhatsApp delivers 100B+ messages daily. When you send "Hey!" to a friend:
- If they're **online** → deliver instantly via WebSocket
- If they're **offline** → store it and deliver when they reconnect
- Show ✓ (sent) ✓✓ (delivered) and blue ✓✓ (read)
- All of this in under 100ms for online users

---

## 📋 Requirements

### What It Must Do
| Feature | Detail |
|---------|--------|
| 1:1 messaging | Text, images, videos, voice notes |
| Group chat | Up to 1024 members |
| Delivery receipts | Sent ✓, Delivered ✓✓, Read (blue) ✓✓ |
| Online/Last seen | Show when user was last active |
| Media sharing | Photos, videos, documents |
| End-to-end encryption | Server can't read messages |

### Scale Numbers
```
Users: 2B registered, 500M daily active
Messages: 100B/day = ~1.15M messages/second
Connections: 500M concurrent WebSocket connections
Group size: Up to 1024 members
Message size: Text ~100 bytes, Media ~1-10MB
Latency: < 100ms for online users
```

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "📱 Clients"
        A[User A - Phone]
        B[User B - Phone]
    end

    subgraph "🌐 Connection Layer"
        GW1[WebSocket Gateway 1]
        GW2[WebSocket Gateway 2]
        GW3[WebSocket Gateway N...]
    end

    subgraph "⚙️ Services"
        Chat[Chat Service<br/>Message routing]
        Group[Group Service<br/>Group management]
        Presence[Presence Service<br/>Online/offline status]
        Media[Media Service<br/>File upload/download]
    end

    subgraph "📬 Message Queue"
        Kafka[Kafka<br/>Message ordering]
    end

    subgraph "🗄️ Storage"
        MsgDB[(Message Store<br/>Cassandra)]
        UserDB[(User/Group DB<br/>MySQL)]
        S3[(Media Storage<br/>S3)]
        Session[(Session Store<br/>Redis)]
    end

    A ---|WebSocket| GW1
    B ---|WebSocket| GW2
    GW1 & GW2 & GW3 --> Chat
    Chat --> Kafka
    Kafka --> GW1 & GW2 & GW3
    Chat --> MsgDB
    Chat --> Presence
    Presence --> Session
    Media --> S3
```

---

## 🔍 How a Message Gets Delivered

### Case 1: Both Users Online (Real-Time Path)

```mermaid
sequenceDiagram
    participant A as 📱 User A
    participant GW1 as Gateway 1<br/>(A's connection)
    participant Chat as Chat Service
    participant Session as Session Store
    participant GW2 as Gateway 2<br/>(B's connection)
    participant B as 📱 User B

    A->>GW1: Send "Hey!" to User B
    GW1->>Chat: Route message
    Chat->>Session: Where is User B connected?
    Session-->>Chat: User B is on Gateway 2
    Chat->>GW2: Deliver message to User B
    GW2->>B: Push "Hey!" via WebSocket
    
    B-->>GW2: ✓✓ Delivered ACK
    GW2-->>Chat: Delivery confirmed
    Chat-->>GW1: ✓✓ Update status
    GW1-->>A: Show ✓✓ (delivered)
```

### Case 2: Receiver is Offline

```mermaid
sequenceDiagram
    participant A as 📱 User A
    participant GW1 as Gateway 1
    participant Chat as Chat Service
    participant Session as Session Store
    participant DB as Message Store
    participant Push as Push Notification
    participant B as 📱 User B (offline)

    A->>GW1: Send "Hey!" to User B
    GW1->>Chat: Route message
    Chat->>Session: Where is User B?
    Session-->>Chat: ❌ User B is OFFLINE
    
    Chat->>DB: Store message (pending delivery)
    Chat->>Push: Send push notification to B's device
    Chat-->>GW1: ✓ Sent (but not delivered yet)
    GW1-->>A: Show ✓ (sent)
    
    Note over B: Later... User B comes online
    B->>GW2: Connect via WebSocket
    GW2->>Chat: User B is online, check pending messages
    Chat->>DB: Get all pending messages for B
    DB-->>Chat: ["Hey!" from A, ...]
    Chat->>GW2: Deliver pending messages
    GW2->>B: Here are your messages!
    
    B-->>GW2: ✓✓ Delivered ACK
    GW2-->>Chat: Confirm delivery
    Chat-->>GW1: Update: ✓✓ delivered
    GW1-->>A: Show ✓✓
```

---

## 🔌 WebSocket Connection Management

```mermaid
graph TB
    subgraph "500M Concurrent Connections"
        subgraph "Gateway Server 1 (handles ~1M connections)"
            C1[Connection 1]
            C2[Connection 2]
            CN[Connection N...]
        end
        
        subgraph "Gateway Server 2"
            D1[Connection...]
        end
        
        subgraph "Gateway Server 500"
            E1[Connection...]
        end
    end
    
    subgraph "Session Registry (Redis)"
        Registry["user_A → Gateway_1<br/>user_B → Gateway_2<br/>user_C → Gateway_1<br/>...500M entries"]
    end
```

**How it works:**
1. When User A connects → their phone opens a WebSocket to the nearest gateway
2. The gateway registers: "User A is connected to me" in Redis
3. When a message arrives for User A → look up Redis → route to correct gateway
4. If gateway crashes → client auto-reconnects to another one

---

## 👥 Group Messaging

```mermaid
sequenceDiagram
    participant A as 📱 User A
    participant Chat as Chat Service
    participant Group as Group Service
    participant GW as Gateways
    participant B as 📱 User B
    participant C as 📱 User C
    participant D as 📱 User D (offline)
    participant DB as Message Store

    A->>Chat: Send "Hello group!" to Group_1
    Chat->>Group: Get Group_1 members
    Group-->>Chat: [B, C, D]
    
    par Deliver to online members
        Chat->>GW: Send to User B (online)
        GW->>B: "Hello group!"
    and
        Chat->>GW: Send to User C (online)
        GW->>C: "Hello group!"
    and
        Chat->>DB: Store for User D (offline)
    end
```

**Optimization for large groups (1000 members):**
- Don't fan-out individually — use Kafka topic per group
- Members subscribe to group topic
- Only fan-out to online members; offline get on reconnect

---

## ✓ Message Delivery Receipts

```mermaid
stateDiagram-v2
    [*] --> Sending : User taps send
    Sending --> Sent : Server received ✓
    Sent --> Delivered : Recipient device got it ✓✓
    Delivered --> Read : Recipient opened chat 🔵✓✓
    
    Sending --> Failed : No internet ❌
    Failed --> Sending : Retry on reconnect
```

---

## 🗄️ Storage Design

### Message Store (Cassandra — optimized for writes)

```mermaid
graph LR
    subgraph "Partition by conversation_id"
        Conv1["conversation_abc<br/>msg1, msg2, msg3..."]
        Conv2["conversation_xyz<br/>msg1, msg2..."]
    end
    
    subgraph "Why Cassandra?"
        W1[✅ High write throughput<br/>1M+ writes/sec]
        W2[✅ Time-series friendly<br/>Messages ordered by time]
        W3[✅ No single point of failure]
        W4[✅ Linear horizontal scaling]
    end
```

### Media Storage Flow
```mermaid
graph LR
    Upload[User uploads photo] --> Encrypt[Encrypt with<br/>symmetric key]
    Encrypt --> S3[Store in S3<br/>encrypted blob]
    S3 --> URL[Get download URL]
    URL --> Msg[Send URL + key<br/>in message]
    
    Download[Receiver gets message] --> Fetch[Download from S3]
    Fetch --> Decrypt[Decrypt with key<br/>from message]
    Decrypt --> Show[Display photo]
```

---

## 🔒 End-to-End Encryption (Simplified)

```mermaid
graph LR
    subgraph "User A's Phone"
        A_Msg[Message: Hey!]
        A_Key[B's Public Key]
        A_Enc[Encrypted message]
    end
    
    subgraph "Server (can't read!)"
        Server[Stores encrypted blob<br/>🔒 Cannot decrypt]
    end
    
    subgraph "User B's Phone"
        B_Key[B's Private Key]
        B_Dec[Decrypted: Hey!]
    end
    
    A_Msg --> A_Enc
    A_Key --> A_Enc
    A_Enc --> Server --> B_Key --> B_Dec
```

The server is just a relay — it stores and forwards encrypted blobs. Only the recipient's device can decrypt.

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Protocol | WebSocket | Persistent bidirectional; low overhead vs HTTP polling |
| Message store | Cassandra | Write-heavy (100B msgs/day); append-only; time-ordered |
| Session store | Redis | Fast lookup for "which gateway is user on?" |
| Delivery | At-least-once | Better duplicate than lost message; client deduplicates |
| Group strategy | Kafka topics | Efficient fan-out; members subscribe to group topic |
| Encryption | E2E (Signal Protocol) | Privacy; server never sees plaintext |

---

## 🚀 Scaling Strategy

| Challenge | Solution |
|-----------|----------|
| 500M concurrent connections | 500+ WebSocket gateway servers (1M connections each) |
| 1M messages/second | Kafka partitions; horizontal write scaling |
| Message ordering | Partition Kafka by conversation_id → ordering per chat |
| Gateway failure | Client auto-reconnects; session registry updates |
| Media delivery | S3 + CDN for large files; only URL in message |
| Global reach | Multi-region deployment with geo-routing |
