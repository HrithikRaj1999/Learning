# HLD 17: Design Google Maps

## 💡 Quick Summary

> **What**: A navigation system that provides map rendering, real-time routing with traffic, ETA estimation, and point-of-interest search.  
> **Key Insight**: Maps are served as pre-rendered tiles at different zoom levels. Routing uses graph algorithms (Dijkstra/A*) on a road network graph, enhanced with real-time traffic data from millions of phones.

---

## 🎯 The Problem in Simple Terms

Google Maps handles:
- Rendering the entire world's map at 20+ zoom levels
- Computing driving routes across millions of road segments
- Real-time traffic from billions of GPS data points
- Point-of-interest search (restaurants, gas stations, etc.)
- Turn-by-turn navigation that adapts to live conditions

---

## 📋 Requirements

| Feature | Detail |
|---------|--------|
| Map rendering | Display map at any zoom level, smooth pan/zoom |
| Routing | Find optimal path (shortest time, not just distance) |
| Real-time traffic | Show current road conditions |
| ETA | Accurate arrival time (adapts to traffic) |
| POI Search | Find places ("pizza near me") |
| Navigation | Turn-by-turn directions with re-routing |

### Scale
```
Users: 1B+ monthly
Map tiles served: 200B+ tile requests/day
Routes calculated: 1B+/day
GPS data points ingested: Trillions/day (from all Android phones!)
Road segments worldwide: 1B+
POIs: 200M+ businesses
```

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "📱 Client"
        App[Maps App<br/>Renders tiles + route overlay]
    end

    subgraph "🗺️ Map Serving"
        CDN[CDN<br/>Cached map tiles]
        TileServer[Tile Server<br/>Generate/serve map images]
    end

    subgraph "🛣️ Routing"
        RouteAPI[Routing Service]
        Graph[Road Graph<br/>Preprocessed segments]
        Traffic[Traffic Service<br/>Real-time speeds]
    end

    subgraph "📍 Location"
        GeoCode[Geocoding<br/>Address ↔ Coordinates]
        POI[POI Search<br/>Nearby places]
    end

    subgraph "🗄️ Data"
        MapData[(Map Data<br/>Roads, buildings, terrain)]
        TrafficDB[(Traffic Data<br/>Live + historical)]
        POIDB[(POI Database<br/>200M+ places)]
        TileCache[(Tile Cache<br/>Pre-rendered images)]
    end

    App --> CDN --> TileServer --> TileCache
    App --> RouteAPI
    RouteAPI --> Graph & Traffic
    App --> GeoCode & POI
    TileServer --> MapData
    Traffic --> TrafficDB
    POI --> POIDB
```

---

## 🗺️ How Map Rendering Works (Tiles)

### The Tile Pyramid

```mermaid
graph TD
    subgraph "Zoom Level 0 (whole world = 1 tile)"
        Z0[1 tile: entire Earth]
    end
    
    subgraph "Zoom Level 1 (4 tiles)"
        Z1a[NW] 
        Z1b[NE]
        Z1c[SW]
        Z1d[SE]
    end
    
    subgraph "Zoom Level 2 (16 tiles)"
        Z2["Each tile splits into 4..."]
    end
    
    subgraph "Zoom Level 20 (individual buildings!)"
        Z20["Billions of tiles<br/>Each covers ~1m² of Earth"]
    end
    
    Z0 --> Z1a & Z1b & Z1c & Z1d
    Z1a --> Z2
    Z2 -->|"..."| Z20
```

```mermaid
sequenceDiagram
    actor User
    participant App as Maps App
    participant CDN as CDN (Edge)
    participant Tile as Tile Server

    User->>App: Pan map to new area
    App->>App: Calculate which tiles needed (zoom 15, x=5, y=12...)
    
    App->>CDN: GET /tiles/15/5/12.png
    alt Tile cached at CDN ✅ (99% of cases)
        CDN-->>App: Tile image (< 20ms)
    else Not cached
        CDN->>Tile: Fetch tile
        Tile->>Tile: Render from vector data
        Tile-->>CDN: Tile image
        CDN-->>App: Tile image (cache for future)
    end
    
    App->>App: Stitch tiles together → smooth map!
```

---

## 🛣️ How Routing Works

### Road Network as a Graph

```mermaid
graph LR
    subgraph "Real roads = Graph nodes + edges"
        A[Intersection A] -->|"3 min<br/>1.2 km"| B[Intersection B]
        B -->|"2 min<br/>0.8 km"| C[Intersection C]
        A -->|"8 min<br/>5.0 km<br/>(highway)"| C
        C -->|"1 min<br/>0.3 km"| D[Destination]
        B -->|"4 min<br/>2.0 km"| D
    end
```

**Edge weights = travel time (not just distance!)** — incorporates speed limits, road type, and LIVE TRAFFIC.

### Route Calculation

```mermaid
sequenceDiagram
    actor User
    participant API as Routing Service
    participant Graph as Road Graph
    participant Traffic as Traffic Service

    User->>API: Route from A to B?
    API->>Traffic: Current speeds on candidate roads?
    Traffic-->>API: Road speeds (live + predicted)
    API->>Graph: Find shortest-time path<br/>(A* algorithm with traffic-adjusted weights)
    Graph-->>API: Path: [A → C → F → G → B], ETA: 23 min
    API-->>User: Route + ETA + turn-by-turn directions
```

### Why Not Just Dijkstra?

```mermaid
graph TD
    subgraph "Optimization: Pre-computed highway hierarchy"
        Local["Local roads: search normally<br/>(near start & destination)"]
        Highway["Highways: pre-computed<br/>distances between exits"]
        
        Start["Start 📍"] --> Local1["Local roads<br/>to nearest highway"]
        Local1 --> Highway
        Highway --> Local2["Local roads<br/>from highway to destination"]
        Local2 --> End["End 📍"]
    end
    
    Note["Instead of searching 1B road segments,<br/>search ~10K (local) + pre-computed (highway)<br/>= 1000x faster!"]
```

---

## 🚦 Real-Time Traffic

```mermaid
graph LR
    subgraph "Data Sources"
        Android["📱 Billions of Android phones<br/>Send anonymous GPS + speed"]
        Waze["🚗 Waze user reports<br/>Accidents, police, road closures"]
        Sensors["🔴 Road sensors<br/>Traffic cameras, loop detectors"]
    end
    
    subgraph "Processing"
        Ingest["Kafka<br/>Ingest billions of data points"]
        MapMatch["Map Matching<br/>GPS point → which road?"]
        Speed["Speed Calculator<br/>Average speed per road segment"]
    end
    
    subgraph "Output"
        Live["Live Traffic Map<br/>🟢 Green = flowing<br/>🟡 Yellow = slow<br/>🔴 Red = stopped"]
        RouteUpdate["Updated ETAs<br/>Re-route if faster path exists"]
    end
    
    Android & Waze & Sensors --> Ingest --> MapMatch --> Speed --> Live & RouteUpdate
```

### How Traffic Colors Work

```mermaid
graph LR
    Speed["Current speed on road segment"]
    Limit["Speed limit for that road"]
    Ratio["Ratio = current / limit"]
    
    Ratio --> G{"> 0.75"} 
    G -->|Yes| Green["🟢 Green: flowing freely"]
    G -->|No| Y{"> 0.4"}
    Y -->|Yes| Yellow["🟡 Yellow: slower than usual"]
    Y -->|No| Red["🔴 Red: heavy traffic"]
```

---

## 📍 ETA Prediction

```mermaid
graph TD
    subgraph "ETA = sum of segment travel times"
        Seg1["Segment 1: 500m<br/>Live speed: 50 km/h<br/>Time: 36 seconds"]
        Seg2["Segment 2: 1.2km<br/>Live speed: 30 km/h<br/>Time: 144 seconds"]
        Seg3["Segment 3: 800m<br/>No live data → use historical<br/>Time: ~60 seconds"]
    end
    
    Seg1 --> Sum["Total ETA: 4 min"]
    Seg2 --> Sum
    Seg3 --> Sum
    
    ML["+ ML adjustment<br/>Traffic patterns: it's 5 PM, expect slowdown<br/>→ Adjusted ETA: 6 min"]
    Sum --> ML
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Map rendering | Vector tiles (client renders) | Smaller downloads, client-side styling, smooth zoom |
| Routing algorithm | A* + contraction hierarchies | A* alone too slow for long routes; pre-computation helps |
| Traffic data | Crowd-sourced (Android phones) | Billions of data points for free; real-time |
| Tile serving | CDN + aggressive caching | Map tiles rarely change; serve from edge |
| ETA | ML model (not just distance/speed) | Historical patterns improve accuracy (traffic lights, school zones) |
| Road updates | Satellite + Street View + user reports | Multiple sources for freshness |

---

## 🚀 Scaling

| Challenge | Solution |
|-----------|----------|
| 200B tile requests/day | CDN caches most tiles; tiles are static (change rarely) |
| 1B route calculations/day | Pre-computed hierarchy reduces graph search 1000x |
| Global traffic (real-time) | Process regionally; road speeds are local |
| Map freshness | Continuous satellite + street view + user edits pipeline |
| Offline support | Client downloads tile region + road graph for offline nav |
