"""
==============================================================================
  TASK 10: Design Patterns (Strategy, Observer, Factory)
==============================================================================

REAL-WORLD CONTEXT:
Design patterns solve RECURRING problems. You'll use these weekly in real jobs:
  - Strategy: swap algorithms at runtime (payment processing, sorting, compression)
  - Observer: notify multiple systems when something happens (event-driven)
  - Factory: create objects without hardcoding the exact class

SCENARIO 1 — Strategy Pattern:
  Payment system supports: CreditCard, PayPal, Crypto. Each has different
  processing logic. Strategy lets you swap payment method without changing
  the checkout code.

SCENARIO 2 — Observer Pattern:
  When an order is placed: send email, update inventory, notify shipping,
  log analytics. Adding a new observer doesn't change the Order class.

SCENARIO 3 — Factory Pattern:
  Create notifications (Email, SMS, Push) based on user preferences.
  Factory hides the creation logic from the calling code.

EXPECTED BEHAVIOR:
  # Strategy
  checkout = Checkout(PayPalPayment())
  checkout.pay(100) → "Paid $100 via PayPal"
  checkout = Checkout(CryptoPayment())
  checkout.pay(100) → "Paid $100 via Crypto"

  # Observer
  order.subscribe(email_notifier)
  order.subscribe(inventory_updater)
  order.place() → both observers notified

  # Factory
  NotificationFactory.create("sms") → SMSNotification instance
"""

# BUILD: Implement Strategy, Observer, and Factory patterns.
# Write one test per pattern verifying the key behavior.

if __name__ == "__main__":
    print("Implement each pattern and write one test per behavior.")
