"""
==============================================================================
  TASK 11: SOLID Principles — Refactoring
==============================================================================

REAL-WORLD CONTEXT:
The code below is a MESS that violates all SOLID principles. It's a single
class doing 5 things: calculating totals, applying coupons, charging cards,
saving to database, AND sending emails. This is real code you'll find in
legacy codebases. Your job: refactor it.

WHAT'S WRONG:
  1. Single Responsibility (S): One class does EVERYTHING
  2. Open/Closed (O): Adding a new coupon type means modifying this class
  3. Dependency Inversion (D): Hardcoded to print (can't swap email provider)
  4. Not testable: Can't test pricing without also "sending emails"
  5. Changing payment provider requires changing OrderProcessor

YOUR FIX: Split into focused classes:
  - PriceCalculator: computes total + applies discounts
  - PaymentGateway (Protocol): charges card (swappable)
  - OrderRepository (Protocol): saves order (swappable)
  - EmailSender (Protocol): sends confirmation (swappable)
  - OrderProcessor: orchestrates the above (depends on abstractions)

EXPECTED BEHAVIOR AFTER REFACTORING:
  calculator = PriceCalculator([TenPercentCoupon()])
  processor = OrderProcessor(calculator, mock_payment, mock_repo, mock_email)
  result = processor.process(order)
  # Each piece testable independently. Adding new coupon = new class, not edit.
"""


# --- LEGACY CODE (THIS IS WHAT YOU REFACTOR) ---
# This class does too much. Split it following SOLID principles.
class OrderProcessor:
    def process(self, order):
        total = sum(item["price"] * item["quantity"] for item in order["items"])
        if order.get("coupon") == "SAVE10":
            total *= 0.9

        print(f"Charging card {order['card']} for {total}")
        print(f"Saving order for {order['user_email']}")
        print(f"Sending email to {order['user_email']}")
        return {"status": "processed", "total": total}


if __name__ == "__main__":
    sample_order = {
        "user_email": "alice@example.com",
        "card": "4111111111111111",
        "coupon": "SAVE10",
        "items": [{"price": 100, "quantity": 2}],
    }
    print(OrderProcessor().process(sample_order))
