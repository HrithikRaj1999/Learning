# HLD 29: Design Object Storage (like S3)

## 💡 Quick Summary

> **What**: A system that stores arbitrary files (blobs) at massive scale with high durability, accessed via simple HTTP APIs (PUT/GET).  
> **Key Insight**: Unlike file systems (hierarchy, directories), object storage is flat — each object has a unique key and is immutable. This simplicity enables extreme scale (exabytes). Durability is achieved through erasure coding (more efficient than replication).

---

## 🎯 The Problem in Simple Terms

Store any file (1KB to 5TB), retrieve it by key, never lose it. Period.
- PUT: Upload "photos/vacation/img001.jpg" → stored durably
- GET: Retrieve by key → returns exact bytes
- Guarantee: 99.999999999% durability (11 nines — lose 1 object per 10M years)

---

## 📋 Requirements

| Feature | Detail |
|---------|--------|
| Store objects | Any binary data, any size |
| Retrieve by key | O(1) lookup by bucket + key |
| Durability | 11 nines (never lose data) |
| Availability | 99.99% (always readable) |
| Versioning | Keep previous versions |
| Access control | Per-bucket and per-object policies |

### Scale
```
Objects stored: trillions
Total storage: exabytes
Object sizes: 1 byte to 5 TB
Requests/second: millions
Durability: 99.999999999%
Availability: 99.99%
```

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "👥 Clients"
        Client[Application<br/>PUT/GET/DELETE via HTTP]
    end

    subgraph "🚪 API Layer"
        LB[Load Balancer]
        API2[API Servers<br/>Auth, routing, validation]
    end

    subgraph "📋 Metadata"
        MetaDB2[(Metadata Service<br/>Key → location mapping<br/>Distributed KV store)]
    end

    subgraph "💾 Data Storage (Data Plane)"
        DN1[Data Node 1<br/>Disk arrays]
        DN2[Data Node 2<br/>Disk arrays]
        DN3[Data Node N<br/>Thousands of nodes]
    end

    subgraph "🛡️ Durability"
        EC["Erasure Coding<br/>Split into chunks +<br/>parity for redundancy"]
    end

    Client --> LB --> API2
    API2 --> MetaDB2
    API2 --> EC --> DN1 & DN2 & DN3
```

---

## 🔍 Write Path (PUT Object)

```mermaid
sequenceDiagram
    actor Client2 as Client
    participant API3 as API Server
    participant Meta as Metadata Service
    participant EC2 as Erasure Coding
    participant DN as Data Nodes (6 different)

    Client2->>API3: PUT /bucket/photos/img.jpg (10 MB)
    API3->>API3: Authenticate + authorize
    API3->>EC2: Split object into chunks + compute parity
    Note over EC2: 10MB → 4 data chunks + 2 parity chunks<br/>(4+2 erasure coding)
    
    par Write chunks to different nodes
        EC2->>DN: Chunk 1 → Node A
        EC2->>DN: Chunk 2 → Node B
        EC2->>DN: Chunk 3 → Node C
        EC2->>DN: Chunk 4 → Node D
        EC2->>DN: Parity 1 → Node E
        EC2->>DN: Parity 2 → Node F
    end
    
    DN-->>API3: All 6 chunks written ✅
    API3->>Meta: Store: "photos/img.jpg" → [NodeA:chunk1, NodeB:chunk2, ...]
    API3-->>Client2: 200 OK (object stored durably)
```

---

## 🛡️ Erasure Coding (Why Not Just Replicate 3x?)

```mermaid
graph TD
    subgraph "Option A: 3x Replication"
        Rep["10 MB object × 3 copies = 30 MB stored<br/>Can lose 2 copies, still have data<br/>Storage overhead: 200%"]
    end
    
    subgraph "Option B: Erasure Coding (4+2)"
        EC3["10 MB → 4 data chunks (2.5 MB each) + 2 parity chunks<br/>Total stored: 15 MB<br/>Can lose ANY 2 chunks, still reconstruct!<br/>Storage overhead: 50%"]
    end
    
    subgraph "Winner: Erasure Coding"
        Win["Same fault tolerance (survive 2 failures)<br/>but uses 50% less storage!<br/>At exabyte scale, this saves BILLIONS in disks"]
    end
```

---

## 🔍 Read Path (GET Object)

```mermaid
sequenceDiagram
    actor Client3 as Client
    participant API4 as API Server
    participant Meta2 as Metadata Service
    participant Nodes as Data Nodes

    Client3->>API4: GET /bucket/photos/img.jpg
    API4->>Meta2: Where are chunks of "photos/img.jpg"?
    Meta2-->>API4: Chunks at: [NodeA, NodeB, NodeC, NodeD, NodeE, NodeF]
    
    API4->>Nodes: Fetch 4 data chunks (only need 4 of 6!)
    
    alt All 4 data chunks available
        Nodes-->>API4: 4 chunks → reassemble → 10 MB
    else 1-2 nodes unavailable
        Nodes-->>API4: Got 3 data + 1 parity
        API4->>API4: Reconstruct missing chunk from parity
    end
    
    API4-->>Client3: 200 OK + 10 MB file
```

---

## 📋 Metadata Service (The Brain)

```mermaid
graph TD
    subgraph "What metadata stores"
        Entry["Key: 'photos/img.jpg'<br/>Bucket: 'my-bucket'<br/>Size: 10 MB<br/>Chunks: [A:c1, B:c2, C:c3, D:c4, E:p1, F:p2]<br/>Created: 2024-01-15<br/>Version: 3<br/>Content-Type: image/jpeg"]
    end
    
    subgraph "How it scales"
        Shard["Sharded by hash(bucket + key)<br/>Distributed across metadata nodes<br/>Replicated for availability"]
    end
    
    Note["Metadata is SMALL (< 1KB per object)<br/>But trillions of objects = still massive<br/>Must be fast: every read/write hits metadata first"]
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Redundancy | Erasure coding (not replication) | 50% overhead vs 200%; same durability |
| Consistency | Strong consistency (read-after-write) | User expects to read what they just wrote |
| Object model | Immutable (overwrite = new version) | Simplifies caching, replication, concurrency |
| Metadata | Separate service (not co-located with data) | Different access patterns; metadata fits in memory |
| Large objects | Multipart upload (chunked) | 5TB upload would timeout; chunks can retry independently |
| Storage tiering | Hot (SSD) / Warm (HDD) / Cold (tape/archive) | Most objects rarely accessed after 30 days |

---

## 🚀 Scaling

| Challenge | Solution |
|-----------|----------|
| Exabytes of data | Add data nodes linearly; erasure coding across racks |
| Trillions of objects | Sharded metadata service; consistent hashing |
| Disk failures | Background repair: detect missing chunks, reconstruct from parity |
| Rack/AZ failures | Place chunks across different racks/zones |
| Hot objects | Cache layer in front; CDN for public objects |
| Multipart upload | Client uploads chunks in parallel; server assembles |
