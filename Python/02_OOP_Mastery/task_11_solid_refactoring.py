"""
================================================================
   TASK 11: SOLID Refactoring Challenge               *****
================================================================

Interview focus:
- Identify bad coupling.
- Refactor toward testable, replaceable collaborators.
- Explain SRP, OCP, LSP, ISP, and DIP with code.
"""


# ----- Starting Point -----
# This class does too much. Refactor it without changing behavior.


class OrderProcessor:
    def process(self, order):
        total = sum(item["price"] * item["quantity"] for item in order["items"])
        if order.get("coupon") == "SAVE10":
            total *= 0.9

        print(f"Charging card {order['card']} for {total}")
        print(f"Saving order for {order['user_email']}")
        print(f"Sending email to {order['user_email']}")
        return {"status": "processed", "total": total}


# ----- Challenge -----
# Refactor into collaborators:
# - PricingService
# - PaymentGateway protocol/interface
# - OrderRepository protocol/interface
# - EmailService protocol/interface
# - OrderProcessor orchestrator
#
# Add tests using fake payment/repository/email implementations.


# YOUR CODE HERE


if __name__ == "__main__":
    sample_order = {
        "user_email": "alice@example.com",
        "card": "4111111111111111",
        "coupon": "SAVE10",
        "items": [{"price": 100, "quantity": 2}],
    }
    print(OrderProcessor().process(sample_order))

