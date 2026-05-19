# HLD 28: Design a Metrics & Logging System

## 💡 Quick Summary

> **What**: A system that collects, stores, and queries time-series metrics (CPU, latency, error rates) and log data from thousands of services, enabling monitoring, alerting, and debugging.  
> **Key Insight**: Metrics are time-series data (value + timestamp). The write pattern is APPEND-ONLY and extremely high volume. Specialized time-series databases (not regular SQL) are needed. Logs are high-volume unstructured text requiring full-text search.

---

## 🎯 The Problem in Simple Terms

You have 1000 microservices, each emitting:
- Metrics: CPU=72%, memory=4.2GB, request_latency_p99=120ms (every 10 seconds)
- Logs: "2024-01-15 10:23:45 ERROR PaymentService: timeout connecting to Stripe"

You need to:
- Store all this (petabytes)
- Query: "show me p99 latency for PaymentService over the last 7 days"
- Alert: "if error rate > 5% for 3 minutes, page on-call engineer"
- Debug: "show all logs from request_id=abc123 across all services"

---

## 📋 Requirements

| Feature | Detail |
|---------|--------|
| Metrics collection | Pull or push from services |
| Metrics storage | High-volume time-series |
| Log aggregation | Centralized log storage + search |
| Dashboards | Visualize metrics over time |
| Alerting | Threshold + anomaly-based alerts |
| Distributed tracing | Follow request across services |

### Scale
```
Metrics data points ingested: 10M+ per second
Log lines/day: 100B+
Metric retention: 30 days full res, 1 year downsampled
Log retention: 14-30 days hot, 1 year cold
Query latency: < 1 second for dashboard charts
Services monitored: 10,000+
```

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "📤 Data Sources"
        App1[Service A<br/>Metrics + Logs]
        App2[Service B<br/>Metrics + Logs]
        App3[Infrastructure<br/>CPU, Memory, Disk]
    end

    subgraph "📥 Collection"
        Agent[Collection Agents<br/>Prometheus pull / push gateway]
        LogShipper[Log Shippers<br/>Fluentd / Filebeat]
    end

    subgraph "⚙️ Processing"
        Kafka2[Kafka<br/>Buffer + decouple]
        Aggregate[Stream Processor<br/>Pre-aggregate, downsample]
    end

    subgraph "🗄️ Storage"
        TSDB[(Time-Series DB<br/>Metrics: VictoriaMetrics / InfluxDB)]
        LogStore[(Log Storage<br/>Elasticsearch / Loki)]
        Cold2[(Cold Storage<br/>S3 for old data)]
    end

    subgraph "📊 Query & Alert"
        Dashboard[Grafana<br/>Dashboards]
        Alert2[Alert Manager<br/>Rules + routing]
        Query2[Query Engine<br/>PromQL / LogQL]
    end

    App1 & App2 & App3 --> Agent & LogShipper
    Agent --> Kafka2 --> Aggregate --> TSDB
    LogShipper --> Kafka2 --> LogStore
    TSDB & LogStore --> Query2 --> Dashboard & Alert2
    TSDB -->|"Downsample old data"| Cold2
```

---

## 🔍 How Time-Series Storage Works

```mermaid
graph TD
    subgraph "Metric data point"
        Point["metric: http_requests_total<br/>labels: {service='payment', status='500'}<br/>value: 42<br/>timestamp: 1705312345"]
    end
    
    subgraph "Time-Series DB optimization"
        Compress["Same metric, sequential timestamps<br/>→ Delta encoding: store differences<br/>1705312345, +10, +10, +10...<br/>→ 90%+ compression"]
    end
    
    subgraph "Why not regular SQL?"
        SQL["INSERT INTO metrics VALUES (...) 10M times/sec<br/>❌ B-tree indexes can't keep up<br/>❌ Random I/O kills performance"]
        TSDB2["Time-series DB: append-only LSM tree<br/>✅ Sequential writes (like Kafka!)<br/>✅ Columnar compression<br/>✅ Built-in downsampling"]
    end
```

---

## 📝 Log Pipeline

```mermaid
sequenceDiagram
    participant App as Service
    participant Agent2 as Log Agent (Filebeat)
    participant Kafka3 as Kafka
    participant Process as Log Processor
    participant ES as Elasticsearch
    participant User2 as Engineer

    App->>App: Write log to stdout/file
    Agent2->>Agent2: Tail log file, parse fields
    Agent2->>Kafka3: Ship log line (buffered)
    Kafka3->>Process: Stream of log lines
    Process->>Process: Enrich: add service name, region, trace_id
    Process->>ES: Index (full-text searchable)
    
    User2->>ES: Query: "error AND service:payment AND trace_id:abc123"
    ES-->>User2: All matching log lines, sorted by time
```

---

## 🚨 Alerting Flow

```mermaid
graph TD
    subgraph "Alert Rule"
        Rule["IF rate(http_errors[5m]) > 0.05<br/>FOR 3 minutes<br/>SEVERITY: critical"]
    end
    
    subgraph "Evaluation"
        Eval["Alert Manager checks rule every 30s<br/>Queries TSDB for current value"]
    end
    
    Rule --> Eval
    Eval -->|"Threshold crossed"| Pending["PENDING (wait 3 min to confirm)"]
    Pending -->|"Still true after 3 min"| Firing["FIRING 🔥"]
    Firing --> Route["Route by severity:<br/>Critical → PagerDuty → wake someone up<br/>Warning → Slack channel<br/>Info → just log it"]
    
    Pending -->|"Resolved within 3 min"| OK["OK (false alarm, no noise)"]
```

---

## 📉 Downsampling (Keep Old Data Small)

```mermaid
graph LR
    subgraph "Retention Strategy"
        Raw["Last 7 days: full resolution<br/>Every 10-second data point"]
        Med["7-30 days: 1-minute averages<br/>6x less data"]
        Low["30 days - 1 year: 5-minute averages<br/>30x less data"]
        Archive["1+ years: hourly aggregates<br/>or delete"]
    end
    
    Raw -->|"Downsample"| Med -->|"Downsample"| Low -->|"Downsample"| Archive
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Metrics collection | Pull (Prometheus-style) | Service health visible by pull success; simpler security |
| Log search | Elasticsearch / Loki | Full-text search; structured queries |
| Buffer | Kafka between collection and storage | Handle burst; decouple producers from consumers |
| Downsampling | Automatic time-based | Can't store raw data forever; dashboards don't need 10s resolution for last year |
| Alert evaluation | Central alert manager | Deduplicate alerts; group related; route correctly |
| Tracing | Distributed tracing (Jaeger/Zipkin) | Follow single request across services |

---

## 🚀 Scaling

| Challenge | Solution |
|-----------|----------|
| 10M metrics/second ingest | Kafka buffer → sharded TSDB (shard by metric name) |
| 100B logs/day | Tiered storage: hot (SSD, 7 days) → cold (S3, 1 year) |
| Query performance | Pre-compute common aggregations; recording rules |
| Alert noise | Grouping, deduplication, silence windows |
| Cross-service debugging | Distributed tracing with trace_id propagation |
| Cost | Aggressive downsampling; cold storage tier; drop debug logs early |
