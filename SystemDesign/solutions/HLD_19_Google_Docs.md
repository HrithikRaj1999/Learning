# HLD 19: Design Google Docs (Real-Time Collaborative Editing)

## 💡 Quick Summary

> **What**: A system where multiple users simultaneously edit the same document and see each other's changes in real-time.  
> **Key Insight**: The core challenge is conflict resolution — when two people type at the same position simultaneously. Solved using Operational Transformation (OT) or CRDTs to merge edits without conflicts.

---

## 🎯 The Problem in Simple Terms

When Alice and Bob both edit a document simultaneously:
- Alice types "Hello" at position 5
- Bob deletes characters at position 3

These operations happen at the "same time" on different computers. How do we ensure both end up with the same final document? This is the **conflict resolution** problem.

---

## 📋 Requirements

| Feature | Detail |
|---------|--------|
| Real-time co-editing | Multiple cursors, see changes live |
| Conflict resolution | Simultaneous edits don't corrupt document |
| Offline support | Edit offline, sync when back |
| Version history | See previous versions, restore |
| Cursor awareness | See where other users are typing |
| Comments & suggestions | Annotate document |

### Scale
```
Concurrent editors per doc: up to 100
Documents: billions
Active editing sessions: 10M+
Latency for updates: < 100ms between users
Operation throughput: millions of operations/second globally
```

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "👥 Editors"
        Alice[Alice's Browser]
        Bob[Bob's Browser]
        Carol[Carol's Browser]
    end

    subgraph "🌐 Real-time Layer"
        WS[WebSocket Servers<br/>One per document session]
    end

    subgraph "⚙️ Core Services"
        OT[OT/CRDT Engine<br/>Transform & merge operations]
        Doc[Document Service<br/>Storage & retrieval]
        Version[Version Service<br/>History & snapshots]
        Presence[Presence Service<br/>Cursor positions]
    end

    subgraph "🗄️ Storage"
        OpLog[(Operation Log<br/>All edits ever made)]
        DocStore[(Document Snapshots<br/>Current state)]
        Cache[(Redis Cache<br/>Active doc state)]
    end

    Alice & Bob & Carol <-->|WebSocket| WS
    WS <--> OT
    OT --> OpLog
    OT --> Cache
    Doc --> DocStore
    Version --> OpLog
```

---

## 🔍 How Conflict Resolution Works (Operational Transformation)

### The Problem

```mermaid
graph TD
    subgraph "Initial document: 'ABCDE'"
        Start["Both Alice and Bob see: A B C D E"]
    end
    
    subgraph "Simultaneous edits"
        Alice_Op["Alice: INSERT 'X' at position 2<br/>Her view: A X B C D E"]
        Bob_Op["Bob: DELETE at position 4<br/>His view: A B C E"]
    end
    
    subgraph "❌ Without transformation"
        Problem["Bob's DELETE at pos 4 would delete 'D'<br/>But after Alice's insert, 'D' is now at position 5!<br/>Wrong character deleted! 💥"]
    end
    
    Start --> Alice_Op & Bob_Op --> Problem
```

### The OT Solution

```mermaid
sequenceDiagram
    participant Alice
    participant Server as OT Server
    participant Bob

    Note over Alice,Bob: Document: "ABCDE"
    
    Alice->>Server: Op1: INSERT('X', pos=2)
    Bob->>Server: Op2: DELETE(pos=4)
    
    Note over Server: Server receives both ops
    Note over Server: Transform Op2 against Op1:
    Note over Server: "Alice inserted before pos 4,<br/>so Bob's target shifted right by 1"
    Note over Server: Op2 becomes: DELETE(pos=5)
    
    Server->>Alice: Apply Op2 (transformed): DELETE(pos=5)
    Server->>Bob: Apply Op1: INSERT('X', pos=2)
    
    Note over Alice,Bob: Both end up with: "AXBCE" ✅
```

### Transformation Rules (Simple)

```mermaid
graph TD
    subgraph "Transform Op2 given Op1 happened first"
        Case1["If Op1 inserts BEFORE Op2's position<br/>→ Shift Op2's position RIGHT by 1"]
        Case2["If Op1 deletes BEFORE Op2's position<br/>→ Shift Op2's position LEFT by 1"]
        Case3["If Op1 and Op2 at SAME position<br/>→ Tiebreak by user ID (deterministic)"]
    end
```

---

## 🔄 Document Session Lifecycle

```mermaid
sequenceDiagram
    actor User as Alice opens doc
    participant WS as WebSocket Server
    participant Cache as Redis
    participant DB as Document Store
    participant OT as OT Engine

    User->>WS: Open document_123
    WS->>Cache: Is doc_123 active session?
    
    alt First editor (cold start)
        Cache-->>WS: No active session
        WS->>DB: Load latest snapshot
        DB-->>WS: Document content + version 42
        WS->>Cache: Store in Redis (active)
        WS->>OT: Start new session for doc_123
    else Others already editing
        Cache-->>WS: Active session exists
        WS->>OT: Get current document state
    end
    
    WS-->>User: Here's the document + list of active editors
    
    Note over User,OT: Now editing in real-time...
    
    User->>WS: Operation: INSERT "Hello" at pos 10
    WS->>OT: Transform against concurrent ops
    OT->>Cache: Update document state
    OT->>WS: Broadcast to other editors
    WS->>WS: Send to Bob, Carol, etc.
```

---

## 📋 Version History & Snapshots

```mermaid
graph LR
    subgraph "Operation Log (every keystroke)"
        Op1["Op 1: INSERT 'H' at 0"]
        Op2["Op 2: INSERT 'e' at 1"]
        Op3["Op 3: INSERT 'l' at 2"]
        Op4["... thousands of ops ..."]
    end
    
    subgraph "Snapshots (periodic checkpoints)"
        Snap1["Snapshot @ Op 100<br/>'Hello World...'<br/>Compressed full state"]
        Snap2["Snapshot @ Op 200<br/>'Hello World, this is...'"]
    end
    
    Op1 --> Op2 --> Op3 --> Op4
    Op4 -.->|"Every 100 ops"| Snap1
    Snap1 -.-> Snap2
```

**Why snapshots?** Without them, recovering a document would mean replaying ALL operations from the beginning (could be millions). Snapshots let you start from a recent checkpoint.

---

## 👥 Presence & Cursors

```mermaid
graph TD
    subgraph "What each user sees"
        Doc["Document Content"]
        Cursor1["Alice's cursor 🟦 at position 45"]
        Cursor2["Bob's cursor 🟩 at position 120"]
        Cursor3["Carol selecting 🟪 positions 80-95"]
    end
    
    subgraph "How it works"
        Heartbeat["Every 50ms: send cursor position<br/>via WebSocket to all others"]
    end
```

---

## 🗄️ Storage Architecture

```mermaid
graph TB
    subgraph "⚡ Active Documents (Redis)"
        Active["Currently-being-edited documents<br/>Full state in memory<br/>+ pending operation queue"]
    end
    
    subgraph "📝 Operation Log (Append-only DB)"
        OpLog2["Every operation ever applied<br/>Enables: version history, undo, replay<br/>Immutable audit trail"]
    end
    
    subgraph "📸 Document Snapshots (Object Storage)"
        Snaps["Periodic full-state captures<br/>Used for: fast open, version restore<br/>Every N operations or every 5 minutes"]
    end
    
    Active -->|"Flush periodically"| OpLog2
    OpLog2 -->|"Compact into"| Snaps
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Conflict resolution | OT (Operational Transformation) | Battle-tested (Google Docs uses it); works well with central server |
| Alternative | CRDTs (Conflict-free Replicated Data Types) | Better for P2P/offline but more complex for rich text |
| Transport | WebSocket | Bidirectional, low latency, persistent connection |
| Persistence | Op log + periodic snapshots | Full history (undo/audit) + fast recovery |
| Session management | One "authoritative" server per document | Simplifies OT (single point of ordering) |
| Offline edits | Queue ops locally, replay on reconnect | May cause large merge; acceptable for occasional offline |

---

## 🚀 Scaling Challenges

| Challenge | Solution |
|-----------|----------|
| 100 concurrent editors on one doc | Single server handles OT for one doc; stateful routing |
| Millions of active documents | Shard by document_id; route connections to correct server |
| Server failure mid-session | Op log allows replay from last snapshot; clients reconnect |
| Large documents (100+ pages) | Only send operations for visible portion; lazy load |
| Version history (millions of ops) | Compaction + snapshots; only store diff from last snapshot |
| Global latency | Regional WebSocket servers; central OT per document |
