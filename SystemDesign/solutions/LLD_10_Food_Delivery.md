# LLD 10: Design a Food Delivery System (Swiggy/Zomato)

## 💡 Quick Summary

> **What**: A food ordering system connecting customers, restaurants, and delivery partners with order management, assignment, and tracking.  
> **Key Insight**: Three key challenges — (1) real-time delivery partner assignment (nearest available), (2) order state management across multiple actors, (3) ETA estimation considering prep time + travel time.

---

## 🔄 Order State Machine

```mermaid
stateDiagram-v2
    [*] --> PLACED: Customer places order
    PLACED --> CONFIRMED: Restaurant accepts
    PLACED --> REJECTED: Restaurant rejects
    CONFIRMED --> PREPARING: Kitchen starts cooking
    PREPARING --> READY: Food ready for pickup
    READY --> PICKED_UP: Delivery partner collects
    PICKED_UP --> ON_THE_WAY: En route to customer
    ON_THE_WAY --> DELIVERED: Handed to customer
    
    PLACED --> CANCELLED: Customer cancels
    CONFIRMED --> CANCELLED: Customer cancels (before prep)
```

---

## 🏗️ Class Design

```mermaid
classDiagram
    class Order {
        -id: string
        -customer: Customer
        -restaurant: Restaurant
        -items: List~OrderItem~
        -deliveryPartner: DeliveryPartner?
        -status: OrderStatus
        -totalAmount: float
        -placedAt: DateTime
        -deliveredAt: DateTime?
    }
    
    class Customer {
        -id: string
        -name: string
        -address: Location
        +placeOrder(restaurant, items): Order
        +cancelOrder(orderId): void
    }
    
    class Restaurant {
        -id: string
        -name: string
        -location: Location
        -menu: List~MenuItem~
        -isOpen: boolean
        +acceptOrder(orderId): void
        +markReady(orderId): void
    }
    
    class DeliveryPartner {
        -id: string
        -name: string
        -location: Location
        -isAvailable: boolean
        -currentOrder: Order?
        +accept(order): void
        +pickup(): void
        +deliver(): void
    }
    
    class OrderService {
        +createOrder(customer, restaurant, items): Order
        +assignPartner(orderId): void
        +updateStatus(orderId, status): void
    }
    
    class DeliveryAssigner {
        +findBestPartner(restaurant): DeliveryPartner
    }

    Order --> Customer
    Order --> Restaurant
    Order --> DeliveryPartner
    OrderService --> Order
    OrderService --> DeliveryAssigner
```

---

## 🔍 Order Flow

```mermaid
sequenceDiagram
    actor Customer2 as Customer
    participant OS as Order Service
    participant Rest as Restaurant
    participant Assign as Delivery Assigner
    participant DP as Delivery Partner

    Customer2->>OS: Place order (Burger + Fries from McD)
    OS->>OS: Calculate total, create Order (PLACED)
    OS->>Rest: New order notification
    Rest->>OS: Accept order → status: CONFIRMED
    OS->>Assign: Find delivery partner near restaurant
    
    Note over Assign: Find available partners within 3km<br/>Sort by distance, rating, acceptance rate
    Assign-->>OS: Best match: Rahul (1.2km away)
    
    OS->>DP: Order offer (show earnings, distance)
    DP->>OS: Accept!
    OS->>OS: Assign Rahul, status: PREPARING
    
    Rest->>OS: Food ready! → status: READY
    OS->>DP: Head to restaurant for pickup
    DP->>OS: Picked up → status: PICKED_UP
    DP->>OS: Delivered → status: DELIVERED
    OS->>Customer2: Order delivered! Rate your experience.
```

---

## 🚗 Delivery Partner Assignment

```mermaid
graph TD
    subgraph "Assignment Algorithm"
        Step1["1. Get restaurant location"]
        Step2["2. Find all AVAILABLE partners within 5km radius"]
        Step3["3. Score each: distance (40%) + rating (30%) + acceptance_rate (30%)"]
        Step4["4. Send offer to top candidate"]
        Step5{Accepted?}
        Step6["Assigned! ✅"]
        Step7["Try next candidate"]
    end
    
    Step1 --> Step2 --> Step3 --> Step4 --> Step5
    Step5 -->|Yes| Step6
    Step5 -->|No / Timeout 30s| Step7 --> Step4
```

---

## 💻 Core Implementation

```python
from enum import Enum
from datetime import datetime
import math

class OrderStatus(Enum):
    PLACED = "placed"
    CONFIRMED = "confirmed"
    PREPARING = "preparing"
    READY = "ready"
    PICKED_UP = "picked_up"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class OrderService:
    def create_order(self, customer, restaurant, items):
        order = Order(customer=customer, restaurant=restaurant, items=items)
        order.status = OrderStatus.PLACED
        # Notify restaurant
        self.notify_restaurant(restaurant, order)
        return order
    
    def assign_partner(self, order):
        candidates = self.find_nearby_partners(
            location=order.restaurant.location, radius_km=5
        )
        candidates.sort(key=lambda p: self._score(p, order.restaurant))
        
        for partner in candidates:
            if self.send_offer(partner, order, timeout=30):
                order.delivery_partner = partner
                partner.is_available = False
                partner.current_order = order
                return partner
        
        raise NoPartnerAvailable("Retrying in 30 seconds...")
    
    def _score(self, partner, restaurant):
        distance = self._haversine(partner.location, restaurant.location)
        # Lower score = better (weighted combination)
        return distance * 0.4 + (5 - partner.rating) * 0.3 + (1 - partner.acceptance_rate) * 0.3

class ETACalculator:
    def estimate(self, order):
        prep_time = order.restaurant.avg_prep_time  # e.g., 15 min
        pickup_travel = self._travel_time(order.delivery_partner.location, order.restaurant.location)
        delivery_travel = self._travel_time(order.restaurant.location, order.customer.address)
        return prep_time + pickup_travel + delivery_travel
```

---

## 🧩 Design Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **State** | Order status transitions | Each status has valid next states |
| **Observer** | Notifications to all parties | Customer, restaurant, partner all get updates |
| **Strategy** | Partner assignment algorithm | Swap scoring strategies (distance-first vs rating-first) |
| **Command** | Order actions (accept, reject, cancel) | Each action validates, transitions, and notifies |

---

## 📊 Key Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Partner assignment | Nearest + scoring | Pure nearest ignores partner quality |
| Offer timeout | 30 seconds | Don't wait forever; try next partner |
| ETA calculation | Prep + pickup travel + delivery travel | Transparent breakdown for customer |
| Cancellation | Free before PREPARING, fee after | Restaurant already started work |
| Real-time tracking | Partner sends GPS every 5 seconds | Customer sees live map |
