# HLD 09: Design Dropbox / Google Drive (File Storage & Sync)

## 💡 Quick Summary

> **What**: A cloud file storage service that syncs files across devices, handles versioning, and enables collaboration.  
> **Key Insight**: The core challenge is efficient sync — when you edit a 1GB file, don't re-upload the entire thing. Split files into chunks, detect which chunks changed, and only upload those.

---

## 🎯 The Problem in Simple Terms

When you save a file on your laptop, it should appear on your phone within seconds. But:
- Files can be huge (GB+)
- You might only change a few bytes
- Multiple people might edit simultaneously
- Network can be unreliable (resume interrupted uploads)
- Need version history (undo changes)

The trick: **chunking**. Split every file into 4MB blocks. Only sync the blocks that changed.

---

## 📋 Requirements

### What It Must Do
| Feature | Detail |
|---------|--------|
| Upload/Download | Store files in the cloud |
| Auto-sync | Changes sync across all devices |
| Versioning | Keep file history, rollback |
| Sharing | Share files/folders with others |
| Conflict resolution | Handle simultaneous edits |
| Offline support | Edit offline, sync when back |

### Scale Numbers
```
Users: 700M (Dropbox scale)
Files stored: 400B+
Storage: Exabytes total
File modifications/day: billions
Average file size: varies (docs ~100KB, photos ~5MB, videos ~1GB)
Sync latency: < 5 seconds for small files
Chunk size: 4MB
```

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "💻 Client Devices"
        Desktop[Desktop App<br/>File watcher + sync engine]
        Mobile[Mobile App]
        Web[Web Browser]
    end

    subgraph "🌐 Gateway"
        API[API Server<br/>Auth, routing]
    end

    subgraph "⚙️ Services"
        Meta[Metadata Service<br/>File info, structure]
        Sync[Sync Service<br/>Track changes, notify clients]
        Share[Sharing Service<br/>Permissions, links]
        Notify[Notification Service<br/>Push updates to devices]
    end

    subgraph "📦 Storage"
        ChunkStore[(Chunk Storage<br/>S3 / Block storage<br/>Actual file data)]
        MetaDB[(Metadata DB<br/>File tree, versions<br/>PostgreSQL)]
        Queue[Message Queue<br/>Change events]
    end

    Desktop & Mobile & Web --> API
    API --> Meta & Sync & Share
    Desktop -->|"Upload chunks"| ChunkStore
    Meta --> MetaDB
    Sync --> Queue --> Notify
    Notify -->|"Push: file changed!"| Desktop & Mobile
```

---

## 🔍 How File Sync Works

### The Chunking Strategy

```mermaid
graph LR
    subgraph "Original File (16 MB)"
        File["my_document.pdf<br/>16 MB total"]
    end
    
    subgraph "Split into 4MB chunks"
        C1["Chunk 1<br/>4MB<br/>hash: abc123"]
        C2["Chunk 2<br/>4MB<br/>hash: def456"]
        C3["Chunk 3<br/>4MB<br/>hash: ghi789"]
        C4["Chunk 4<br/>4MB<br/>hash: jkl012"]
    end
    
    File --> C1 & C2 & C3 & C4
```

### When You Edit a File (Only Changed Chunks Upload)

```mermaid
graph TD
    subgraph "Before Edit"
        B1["Chunk 1 ✓<br/>hash: abc123"]
        B2["Chunk 2 ✓<br/>hash: def456"]
        B3["Chunk 3 ✓<br/>hash: ghi789"]
        B4["Chunk 4 ✓<br/>hash: jkl012"]
    end
    
    subgraph "After Edit (you changed page 5)"
        A1["Chunk 1 ✓ same<br/>hash: abc123"]
        A2["Chunk 2 ⚠️ CHANGED<br/>hash: NEW_mno345"]
        A3["Chunk 3 ✓ same<br/>hash: ghi789"]
        A4["Chunk 4 ✓ same<br/>hash: jkl012"]
    end
    
    Result["Only upload Chunk 2!<br/>Upload: 4MB instead of 16MB<br/>75% bandwidth saved! 🎉"]
    
    A2 --> Result
```

---

## 🔍 Upload Flow (Step by Step)

```mermaid
sequenceDiagram
    actor User
    participant Client as Desktop Client
    participant API as API Server
    participant Meta as Metadata Service
    participant S3 as Chunk Storage (S3)
    participant Sync as Sync Service
    participant Other as Other Devices

    User->>Client: Save file (edit page 5)
    Client->>Client: Detect change (file watcher)
    Client->>Client: Re-chunk file, compute hashes
    Client->>Client: Compare hashes: only Chunk 2 changed!
    
    Client->>API: "I want to upload new version of file_123"
    API->>Meta: Create new version record
    Meta-->>API: Version 5 created (pending)
    
    Client->>S3: Upload Chunk 2 (4MB)
    S3-->>Client: ✅ Stored, chunk_id = xyz
    
    Client->>API: Commit: version 5 complete, chunks = [abc123, NEW_mno345, ghi789, jkl012]
    API->>Meta: Update file metadata (new chunk list)
    
    API->>Sync: Notify: file_123 changed!
    Sync->>Other: Push notification to all other devices
    Other->>Other: Download only the changed chunk
```

---

## 🔄 How Other Devices Sync (Download)

```mermaid
sequenceDiagram
    participant Sync as Sync Service
    participant Phone as Phone (other device)
    participant Meta as Metadata Service
    participant S3 as Chunk Storage

    Sync->>Phone: Push: "file_123 updated to version 5!"
    Phone->>Meta: What changed in version 5?
    Meta-->>Phone: Chunk 2 is now hash "NEW_mno345"
    Phone->>Phone: Do I have chunk "NEW_mno345" locally?
    Phone->>Phone: No! Need to download it.
    Phone->>S3: Download chunk "NEW_mno345"
    S3-->>Phone: Here's the 4MB chunk
    Phone->>Phone: Reconstruct file with new chunk
    Phone->>Phone: File updated! ✅
```

---

## 🔀 Conflict Resolution

What happens when two people edit the same file at the same time?

```mermaid
graph TD
    Original["File v3 (original)"] --> EditA[Alice edits → v4a]
    Original --> EditB[Bob edits → v4b]
    
    EditA & EditB --> Conflict{Who saves first?}
    
    Conflict -->|"Alice saves first"| AliceWins["Alice's version becomes v4"]
    Conflict -->|"Bob saves second"| BobConflict["Bob gets conflict!<br/>His version saved as<br/>'file (conflicted copy).pdf'"]
    
    AliceWins --> Merge["Both versions preserved<br/>User decides what to keep"]
    BobConflict --> Merge
```

**Strategy**: Last-writer-wins + conflicted copy. Never lose anyone's work.

---

## 📦 Deduplication (Save Storage!)

```mermaid
graph TD
    subgraph "Without Dedup"
        U1["Alice uploads photo.jpg<br/>5MB stored"]
        U2["Bob uploads SAME photo.jpg<br/>5MB stored again"]
        Total1["Total: 10MB for same file ❌"]
    end
    
    subgraph "With Dedup (content-addressed storage)"
        U3["Alice uploads photo.jpg<br/>hash = abc123<br/>5MB stored"]
        U4["Bob uploads same photo<br/>hash = abc123<br/>Already exists! 0MB stored"]
        Total2["Total: 5MB! Both users point to same chunks ✅"]
    end
```

**How it works**: Chunks are stored by their hash (content-addressed). If two users upload the same content, it's stored only once. Both file metadata just points to the same chunk.

---

## 🗄️ Data Architecture

```mermaid
graph TB
    subgraph "Metadata (PostgreSQL)"
        Files["files table<br/>id, name, owner, current_version"]
        Versions["versions table<br/>file_id, version_num, chunk_list, timestamp"]
        Chunks["chunks table<br/>chunk_hash, storage_path, ref_count"]
    end
    
    subgraph "File Data (Object Storage)"
        S3["S3 / GCS<br/>Actual chunk bytes<br/>Organized by hash<br/>Replicated 3x across data centers"]
    end
    
    subgraph "Sync State (Redis)"
        Cursors["User sync cursors<br/>What's the latest change they've seen?"]
    end
    
    Files --> Versions --> Chunks --> S3
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Chunk size | 4MB | Balance: too small = too many chunks overhead; too large = wasteful uploads |
| Sync trigger | Push notification (long poll) | Faster than polling; less battery drain |
| Conflict handling | Last-writer-wins + conflicted copy | Never lose data; let user resolve |
| Deduplication | Content-addressed (by chunk hash) | Massive storage savings (60%+ for similar files) |
| Storage | S3 (object storage) | Infinite scale, 11 nines durability, cheap |
| Compression | Compress chunks before upload | 30-50% bandwidth savings |

---

## 🚀 Scaling Challenges

| Challenge | Solution |
|-----------|----------|
| Exabytes of data | Object storage (S3) — essentially unlimited |
| Billions of file operations/day | Metadata sharded by user_id |
| Minimize upload bandwidth | Chunking + delta sync (only changed chunks) |
| Notifications to all devices | Long polling / WebSocket + message queue |
| File versioning at scale | Store only chunk diffs between versions (not full copies) |
| Offline support | Client queues changes; replays on reconnect |
