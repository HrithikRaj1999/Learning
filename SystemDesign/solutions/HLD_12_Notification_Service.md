# HLD 12: Design a Notification Service

## 💡 Quick Summary

> **What**: A system that sends notifications to users across multiple channels (push, SMS, email) with templating, scheduling, and delivery guarantees.  
> **Key Insight**: The challenge is handling multiple delivery channels with different latencies, retry strategies, and rate limits while ensuring no duplicate notifications.

---

## 🎯 The Problem in Simple Terms

When someone likes your Instagram post, you get:
- A push notification on your phone (instant)
- Maybe an email (if you haven't seen it in 1 hour)
- Maybe an SMS (for critical alerts only)

The notification service must:
- Handle billions of notifications/day
- Route to the right channel based on user preferences
- Not spam users (batching, throttling)
- Retry failures (APNS/FCM can fail)
- Track delivery status

---

## 📋 Requirements

| Feature | Detail |
|---------|--------|
| Multi-channel | Push (iOS/Android), Email, SMS, In-app |
| Priority levels | Critical (instant), Normal, Low (batchable) |
| User preferences | Users choose what channels they want |
| Templates | Reusable notification templates |
| Scheduling | Send at specific time or after delay |
| Rate limiting | Don't spam users |
| Delivery tracking | Sent → Delivered → Opened |

### Scale
```
Notifications/day: 10B+ (Facebook scale)
Channels: Push (APNS/FCM), Email (SES), SMS (Twilio)
Delivery latency: < 1 second for critical
Users: 2B+
```

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "📨 Producers (many services)"
        OrderSvc[Order Service<br/>"Your order shipped!"]
        SocialSvc[Social Service<br/>"John liked your post"]
        AlertSvc[Alert Service<br/>"Login from new device"]
    end

    subgraph "⚙️ Notification Platform"
        API[Notification API<br/>Receives requests]
        Validator[Validator<br/>Check preferences, dedup]
        Prioritizer[Priority Queue<br/>Critical > Normal > Low]
        Template[Template Engine<br/>Render messages]
        Router[Channel Router<br/>Which channel to use?]
    end

    subgraph "📬 Channel Workers"
        Push[Push Worker<br/>APNS / FCM]
        Email[Email Worker<br/>SES / SendGrid]
        SMS[SMS Worker<br/>Twilio / SNS]
        InApp[In-App Worker<br/>WebSocket]
    end

    subgraph "🗄️ Storage"
        PrefsDB[(User Preferences)]
        TemplateDB[(Templates)]
        LogDB[(Delivery Logs)]
        Queue[(Message Queue<br/>Kafka)]
    end

    OrderSvc & SocialSvc & AlertSvc --> API
    API --> Validator --> Prioritizer --> Queue
    Queue --> Router
    Router --> Push & Email & SMS & InApp
    Template --> Router
    Push & Email & SMS --> LogDB
```

---

## 🔍 How a Notification Flows (End to End)

```mermaid
sequenceDiagram
    participant Svc as Order Service
    participant API as Notification API
    participant Val as Validator
    participant Queue as Kafka
    participant Router as Channel Router
    participant Push as Push Worker
    participant APNS as Apple APNS
    participant Phone as User's iPhone

    Svc->>API: Send notification {user: 123, template: "order_shipped", data: {order_id: 456}}
    API->>Val: Validate request
    Val->>Val: Check user preferences: push=ON, email=ON, sms=OFF
    Val->>Val: Check rate limit: user hasn't been spammed
    Val->>Val: Dedup: hasn't already been sent
    Val->>Queue: Enqueue with priority=NORMAL
    
    Queue->>Router: Process notification
    Router->>Router: Render template: "Your order #456 has shipped! 🚚"
    Router->>Push: Send via push (user prefers push)
    
    Push->>APNS: Send to device token xyz
    APNS-->>Push: ✅ Delivered
    Push->>LogDB: Log: delivered to device
    
    APNS->>Phone: 🔔 "Your order #456 has shipped!"
```

---

## 📬 Channel Selection Logic

```mermaid
graph TD
    Notification[New Notification] --> Priority{Priority Level?}
    
    Priority -->|"🔴 Critical<br/>(security alert)"| AllChannels[Send via ALL enabled channels<br/>Push + SMS + Email simultaneously]
    
    Priority -->|"🟡 Normal<br/>(social, orders)"| PreferredChannel["Send via preferred channel only<br/>(usually push)"]
    
    Priority -->|"🟢 Low<br/>(marketing, digest)"| Batch["Batch and send later<br/>(daily digest email)"]
    
    PreferredChannel --> Fallback{Delivered<br/>within 5 min?}
    Fallback -->|"No"| NextChannel["Escalate to next channel<br/>(push failed → try email)"]
    Fallback -->|"Yes"| Done[✅ Done]
```

---

## 🔄 Retry & Failure Handling

```mermaid
stateDiagram-v2
    [*] --> Queued : Notification created
    Queued --> Sending : Worker picks up
    Sending --> Delivered : Provider confirms ✅
    Sending --> Failed : Provider rejects ❌
    
    Failed --> Retry1 : Retry after 1 min
    Retry1 --> Sending : Attempt 2
    Retry1 --> Retry2 : Failed again
    Retry2 --> Sending : Attempt 3 (after 5 min)
    Retry2 --> DeadLetter : Max retries exceeded
    
    DeadLetter --> FallbackChannel : Try different channel
    Delivered --> [*]
```

---

## 🚫 Anti-Spam & Rate Limiting

```mermaid
graph TD
    subgraph "Rate Limiting Rules"
        R1["Max 3 push notifications/hour per user"]
        R2["Max 1 email/day for same event type"]
        R3["Max 1 SMS/day (expensive!)"]
        R4["Quiet hours: no push 10PM-8AM<br/>(unless critical)"]
    end
    
    subgraph "Batching for Low Priority"
        Low1["12:00 - John liked your post"]
        Low2["12:15 - Sarah liked your post"]
        Low3["12:30 - Mike liked your post"]
        Batch["→ Batched: '3 people liked your post'<br/>Sent as single notification"]
    end
```

---

## 📝 Template System

```mermaid
graph LR
    subgraph "Template"
        T["order_shipped:<br/>'Your order #{order_id}<br/>has shipped! Track: {url}'"]
    end
    
    subgraph "Data"
        D["{order_id: 456,<br/>url: 'track.ly/abc'}"]
    end
    
    subgraph "Rendered Output"
        Out["'Your order #456<br/>has shipped! Track: track.ly/abc'"]
    end
    
    T --> Render[Template Engine]
    D --> Render
    Render --> Out
    
    Out --> PushFormat["Push: short title + body"]
    Out --> EmailFormat["Email: full HTML template"]
    Out --> SMSFormat["SMS: plain text, 160 chars"]
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Queue system | Kafka (priority topics) | Handle 10B/day; separate critical vs. normal |
| Deduplication | Idempotency key (event_type + user + entity) | Prevent duplicate notifications |
| Channel selection | User preferences + priority-based escalation | Respect user choices; ensure critical alerts get through |
| Failure handling | Exponential backoff + fallback channel | Don't give up; try alternative path |
| Batching | Group similar notifications (1-hour window) | "5 people liked your post" > 5 separate notifications |
| Template storage | Version-controlled templates in DB | A/B test different messages; rollback bad templates |

---

## 🚀 Scaling Challenges

| Challenge | Solution |
|-----------|----------|
| 10B notifications/day | Kafka partitioned by user_id; parallel workers |
| Push provider rate limits | Connection pooling to APNS/FCM; respect their limits |
| Email deliverability | Warm up IPs; manage sender reputation; SPF/DKIM |
| Global delivery | Regional notification services; local provider connections |
| User preference changes | Cache preferences in Redis; invalidate on change |
| Analytics (open rates) | Tracking pixels in email; push delivery receipts |
