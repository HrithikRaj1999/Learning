# HLD 16: Design a Payment System (Stripe / PayPal)

## 💡 Quick Summary

> **What**: A system that processes financial transactions between buyers, merchants, and banks — handling authorization, capture, refunds, and settlements.  
> **Key Insight**: The #1 priority is EXACTLY-ONCE processing. Charging someone twice or losing a payment is catastrophic. Idempotency keys and distributed transactions are essential.

---

## 🎯 The Problem in Simple Terms

When you buy something for $50 online:
1. Your card is **authorized** (bank confirms you have $50)
2. The amount is **captured** (money moves from your account)
3. The merchant gets paid in **settlement** (next business day)

If the network fails mid-transaction — did the charge go through? The system MUST handle this gracefully. No double charges. No lost money.

---

## 📋 Requirements

| Feature | Detail |
|---------|--------|
| Process payments | Credit card, debit, bank transfer |
| Idempotency | Same request never processed twice |
| Refunds | Full or partial refunds |
| Multi-currency | Handle USD, EUR, GBP, etc. |
| Reconciliation | Match our records with bank records daily |
| PCI Compliance | Never store raw card numbers |

### Scale
```
Transactions/day: 100M+ (Stripe scale)
Peak TPS: 50,000+
Latency: < 2 seconds per transaction
Availability: 99.999% (money can't sleep)
Accuracy: EXACTLY once (no double charges!)
Data retention: 7+ years (regulatory)
```

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "👤 Buyer Experience"
        Buyer[Buyer clicks 'Pay $50']
        Merchant[Merchant's Website]
    end

    subgraph "⚙️ Payment Platform"
        API[Payment API<br/>Idempotency check]
        Orchestrator[Payment Orchestrator<br/>Coordinates the flow]
        Tokenizer[Tokenization Service<br/>Card → token (PCI)]
        Fraud[Fraud Detection<br/>ML risk scoring]
        Ledger[Double-Entry Ledger<br/>All money movements]
    end

    subgraph "🏦 External"
        Gateway[Payment Gateway]
        Bank[Issuing Bank<br/>Buyer's bank]
        Acquirer[Acquiring Bank<br/>Merchant's bank]
    end

    subgraph "🗄️ Storage"
        TxnDB[(Transaction DB<br/>PostgreSQL)]
        EventLog[(Event Log<br/>Kafka)]
        WalletDB[(Wallet/Balance DB)]
    end

    Buyer --> Merchant --> API
    API --> Orchestrator
    Orchestrator --> Tokenizer & Fraud & Ledger
    Orchestrator --> Gateway --> Bank & Acquirer
    Orchestrator --> TxnDB
    Orchestrator --> EventLog
```

---

## 🔍 Payment Flow (Step by Step)

```mermaid
sequenceDiagram
    actor Buyer
    participant Merchant as Merchant Site
    participant API as Payment API
    participant Fraud as Fraud Check
    participant PSP as Payment Gateway
    participant Bank as Buyer's Bank
    participant Ledger as Ledger

    Buyer->>Merchant: Click "Pay $50"
    Merchant->>API: POST /payments {amount: 5000, currency: USD, idempotency_key: "abc123"}
    
    API->>API: Check idempotency: seen "abc123" before? No.
    API->>Fraud: Risk score for this transaction
    Fraud-->>API: Score: 0.12 (low risk ✅)
    
    API->>PSP: Authorize $50 on card ending 4242
    PSP->>Bank: Has buyer got $50? Hold it.
    Bank-->>PSP: ✅ Authorized (hold $50)
    PSP-->>API: Auth code: AUTH_789
    
    API->>Ledger: Record: buyer -$50, merchant +$50 (pending)
    API->>API: Store: idempotency_key "abc123" → result
    API-->>Merchant: ✅ Payment successful! {payment_id: "pay_xyz"}
    Merchant-->>Buyer: "Thank you! Order confirmed."
    
    Note over PSP,Bank: Settlement happens later (batch, overnight)
```

---

## 🔑 Idempotency (The Most Critical Feature)

### The Problem

```mermaid
graph TD
    subgraph "❌ Without Idempotency"
        Req1["Client sends: 'Charge $50'"]
        Net["Network timeout ⚠️<br/>Client doesn't know if it worked"]
        Retry["Client retries: 'Charge $50' again"]
        Double["💥 Customer charged $100!"]
        
        Req1 --> Net --> Retry --> Double
    end
```

### The Solution

```mermaid
graph TD
    subgraph "✅ With Idempotency Key"
        Req1b["Client sends: 'Charge $50'<br/>idempotency_key = 'order_456'"]
        Net2["Network timeout ⚠️"]
        Retry2["Client retries SAME key:<br/>'Charge $50, key=order_456'"]
        Check["Server checks: 'order_456' already processed!"]
        Return["Return original result (no re-charge)"]
        
        Req1b --> Net2 --> Retry2 --> Check --> Return
    end
```

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant DB as Idempotency Store

    Client->>Server: POST /pay {amount: 50, idem_key: "abc"}
    Server->>DB: EXISTS "abc"?
    DB-->>Server: No
    Server->>Server: Process payment...
    Server->>DB: STORE "abc" → {status: success, payment_id: "pay_1"}
    Server-->>Client: ✅ {payment_id: "pay_1"}
    
    Note over Client: Network issue — client retries
    Client->>Server: POST /pay {amount: 50, idem_key: "abc"} (RETRY)
    Server->>DB: EXISTS "abc"?
    DB-->>Server: Yes! Result = {status: success, payment_id: "pay_1"}
    Server-->>Client: ✅ {payment_id: "pay_1"} (same response, NO re-charge)
```

---

## 📒 Double-Entry Ledger (Every Dollar is Tracked)

```mermaid
graph LR
    subgraph "Accounting Rule: Every entry has a debit AND credit"
        Debit["DEBIT (money leaves)<br/>Buyer's account: -$50"]
        Credit["CREDIT (money enters)<br/>Merchant's account: +$50"]
    end
    
    subgraph "Ledger entries always balance"
        Balance["Sum of all debits = Sum of all credits<br/>If not → something is WRONG → alert!"]
    end
```

| Entry ID | Account | Type | Amount | Reference |
|----------|---------|------|--------|-----------|
| 1 | buyer_123 | DEBIT | $50.00 | pay_xyz |
| 2 | merchant_456 | CREDIT | $48.50 | pay_xyz |
| 3 | platform_fee | CREDIT | $1.50 | pay_xyz |

**Why double-entry?** If debits ≠ credits, you know immediately something went wrong. It's the foundation of all financial systems for 500+ years.

---

## 💳 Payment States

```mermaid
stateDiagram-v2
    [*] --> Created : Payment request received
    Created --> Processing : Fraud check passed
    Created --> Declined : Fraud check failed
    
    Processing --> Authorized : Bank says YES
    Processing --> Declined : Bank says NO
    
    Authorized --> Captured : Merchant confirms shipment
    Authorized --> Voided : Cancelled before capture
    
    Captured --> Settled : Money transferred (T+1)
    Captured --> Refunded : Full refund
    Captured --> PartialRefund : Partial refund
    
    Declined --> [*]
    Voided --> [*]
    Settled --> [*]
    Refunded --> [*]
```

---

## 🛡️ Fraud Detection

```mermaid
graph TD
    subgraph "Real-time signals (< 100ms decision)"
        S1[Transaction amount unusual?]
        S2[New device / location?]
        S3[Velocity: many attempts in short time?]
        S4[Card reported stolen?]
        S5[Shipping ≠ billing address?]
    end
    
    S1 & S2 & S3 & S4 & S5 --> ML[ML Risk Model<br/>Score 0.0 to 1.0]
    
    ML --> Decision{Score?}
    Decision -->|"< 0.3"| Allow["✅ Allow"]
    Decision -->|"0.3 - 0.7"| Challenge["⚠️ 3D Secure / OTP"]
    Decision -->|"> 0.7"| Block["❌ Block"]
```

---

## 📊 Key Trade-offs

| Decision | We Chose | Why |
|----------|----------|-----|
| Consistency | Strong (ACID transactions) | Money CANNOT be inconsistent |
| Idempotency | Server-side with client-provided key | Prevents double-charging even with retries |
| Ledger | Append-only double-entry | Auditable, never lose track of money |
| Card storage | Tokenization (never store raw PAN) | PCI-DSS compliance; reduce breach impact |
| Settlement | Batch (end of day) | Efficient; industry standard |
| Failure handling | Saga pattern with compensating actions | If step 3 fails, undo steps 1 and 2 |

---

## 🚀 Scaling & Reliability

| Challenge | Solution |
|-----------|----------|
| 50K TPS | Horizontal partitioning by merchant_id |
| Exactly-once processing | Idempotency keys + database constraints |
| Reconciliation | Daily batch job matches our records vs. bank records |
| Data retention (7 yrs) | Cold storage + archive; hot for recent 90 days |
| Multi-region | Active-passive per region; don't split transactions across regions |
| PCI compliance | Isolated card-handling service; encrypted at rest and in transit |
