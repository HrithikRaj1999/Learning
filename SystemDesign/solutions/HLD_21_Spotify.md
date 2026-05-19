# HLD 21: Design Spotify (Music Streaming)

## 💡 Quick Summary

> **What**: A music streaming platform that serves audio content, manages playlists, and provides personalized recommendations.  
> **Key Insight**: Unlike video (YouTube), audio files are small (~3-10MB per song). The challenge is seamless playback (no buffering gaps between songs), offline downloads, and the recommendation engine that keeps users engaged.

---

## 🎯 The Problem in Simple Terms

When you hit play on Spotify:
- Audio starts within 200ms (pre-buffered)
- Songs transition seamlessly (next song pre-loaded)
- Quality adapts to your network (low/normal/high/very high)
- 100M+ songs available, personalized for each of 500M+ users

---

## 📋 Requirements

| Feature | Detail |
|---------|--------|
| Stream music | Play songs with adaptive quality |
| Search | Find songs, artists, albums, playlists |
| Playlists | Create, share, collaborative playlists |
| Recommendations | Discover Weekly, Daily Mix, Radio |
| Offline | Download for offline playback |
| Social | See what friends are playing |

### Scale
```
Songs: 100M+ tracks
Users: 500M+ (200M+ paid subscribers)
Concurrent streams: 50M+
Audio file sizes: 3MB (low) to 10MB (lossless)
Total storage: 100M × 10MB × multiple qualities = ~4 PB
Daily streams: 1B+
```

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "🎧 Client"
        App[Spotify App<br/>Buffer + decoder]
    end

    subgraph "🌐 Edge"
        CDN[CDN<br/>Audio files cached globally]
    end

    subgraph "⚙️ Services"
        Stream[Streaming Service<br/>Serve audio chunks]
        Catalog[Catalog Service<br/>Songs, albums, artists]
        Playlist[Playlist Service]
        Search2[Search Service]
        Reco[Recommendation Engine<br/>ML-based]
    end

    subgraph "🗄️ Storage"
        AudioStore[(Audio Storage<br/>All songs, all qualities)]
        MetaDB[(Metadata DB<br/>Song info, artists)]
        UserDB[(User DB<br/>Preferences, history)]
        SearchIdx[(Search Index)]
    end

    App -->|"Stream audio"| CDN --> AudioStore
    App -->|"API calls"| Catalog & Playlist & Search2 & Reco
    Reco --> UserDB
    Search2 --> SearchIdx
    Catalog --> MetaDB
```

---

## 🔍 How Audio Streaming Works

```mermaid
sequenceDiagram
    actor User
    participant App as Spotify App
    participant CDN as CDN (nearest edge)
    participant Origin as Audio Storage

    User->>App: Play "Bohemian Rhapsody"
    App->>App: Check quality setting (320kbps)
    App->>CDN: GET /audio/song_123/320kbps/chunk_0
    CDN-->>App: Audio chunk (first 10 seconds)
    App->>App: Start playback immediately!
    
    par Pre-buffer next chunks
        App->>CDN: GET /chunk_1
        App->>CDN: GET /chunk_2 (stay 30s ahead)
    end
    
    Note over App: When song is 80% done:
    App->>App: Pre-load NEXT song in queue
    App->>CDN: GET /next_song/chunk_0
    Note over App: Seamless transition! No gap between songs.
```

### Adaptive Bitrate for Audio

```mermaid
graph TD
    BW[Monitor network speed] --> Decision{Bandwidth?}
    Decision -->|"> 1 Mbps"| High["Very High: 320 kbps<br/>Best quality"]
    Decision -->|"500kbps - 1Mbps"| Normal["Normal: 160 kbps"]
    Decision -->|"< 500kbps"| Low["Low: 96 kbps<br/>Save data"]
    Decision -->|"No network"| Offline["Play downloaded songs"]
```

---

## 🧠 Recommendation Engine

```mermaid
graph TD
    subgraph "Input Signals"
        History["Listening history<br/>What do you play?"]
        Skips["Skip behavior<br/>What DON'T you like?"]
        Likes["Saved songs & likes"]
        Similar["Similar users<br/>People with similar taste"]
        Audio["Audio features<br/>Tempo, energy, mood"]
    end
    
    History & Skips & Likes & Similar & Audio --> ML["ML Models<br/>Collaborative filtering +<br/>Content-based +<br/>NLP on playlists"]
    
    ML --> Output1["Discover Weekly<br/>30 new songs every Monday"]
    ML --> Output2["Daily Mix<br/>Based on your genres"]
    ML --> Output3["Radio<br/>Similar to a seed song"]
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Audio delivery | CDN + chunked streaming | Low latency; CDN caches popular songs near users |
| Quality | Multiple encodings stored | Pre-encode at upload; save CPU at serving time |
| Buffer strategy | 30-second lookahead + next song preload | Seamless playback; handle brief network drops |
| Offline | Encrypted downloads + license check | DRM protection; works without internet |
| Recommendations | Hybrid ML (collaborative + content) | Cold start problem: new songs have no history → use audio features |
| Search | Elasticsearch with fuzzy matching | Handles typos; fast full-text across 100M songs |

---

## 🚀 Scaling

| Challenge | Solution |
|-----------|----------|
| 50M concurrent streams | CDN serves 95% of audio; only cache misses hit origin |
| 100M songs stored | Multiple quality levels × formats; tiered storage (hot/cold) |
| Personalization at scale | Pre-compute recommendations in batch (nightly); real-time adjustments |
| New song ingestion | Async pipeline: upload → transcode all qualities → distribute to CDN |
| Global low latency | CDN edge nodes in 100+ countries |
