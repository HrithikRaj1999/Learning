"""
==============================================================================
  TASK 08: Inheritance vs Composition
==============================================================================

REAL-WORLD CONTEXT:
A notification system can send via: Email, SMS, Push, Slack.
BAD approach: EmailNotifier, SMSNotifier, PushNotifier (inheritance explosion).
GOOD approach: NotificationService that TAKES a sender (composition/injection).

SCENARIO: Your startup has a NotificationService. Currently it's hardcoded
to send emails. Now PM says "add SMS for premium users." With inheritance,
you'd need to copy the whole class. With composition, you just swap the sender.

WHAT'S WRONG (inheritance approach):
  class EmailNotifier: ...       # sends email
  class SMSNotifier: ...         # 90% copy-paste from EmailNotifier
  class PushNotifier: ...        # another copy-paste
  # Adding a new channel = another class with duplicated logic

YOUR FIX (composition approach):
  class NotificationService:
      def __init__(self, sender: MessageSender):  # inject the strategy
          self.sender = sender
      def notify(self, user, message):
          self.sender.send(user.contact, message)

  # Swap sender without changing NotificationService:
  service = NotificationService(EmailSender())
  service = NotificationService(SMSSender())  # same service, different channel

EXPECTED BEHAVIOR:
  - Create MessageSender protocol (interface)
  - Create EmailSender, SMSSender implementations
  - NotificationService works with ANY sender
  - Tests prove swapping sender doesn't break anything
"""

# BUILD: MessageSender protocol + NotificationService with injected sender
# Write tests that swap senders and verify behavior is consistent.

if __name__ == "__main__":
    print("Add tests proving sender swapping does not change NotificationService.")
