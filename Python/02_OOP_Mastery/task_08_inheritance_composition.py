"""
================================================================
   TASK 8: Inheritance vs Composition                 ***
================================================================

Interview focus:
- Know when inheritance helps and when it creates fragile designs.
- Prefer composition when behavior varies independently.
"""


# ----- Challenge 8.1 -----
# Implement a notification system.
#
# Requirements:
# - EmailSender, SmsSender, SlackSender each implement send(to, message)
# - NotificationService accepts a sender object in its constructor
# - send_welcome(user) delegates to the sender
#
# Goal: composition. Do not make NotificationService inherit from senders.


# YOUR CODE HERE


# ----- Challenge 8.2 -----
# Implement a Report base class with subclasses:
# - SalesReport
# - ErrorReport
#
# Each subclass should implement title() and rows().
# The base class should provide render_csv().


# YOUR CODE HERE


if __name__ == "__main__":
    print("Add tests proving sender swapping does not change NotificationService.")

