"""
==============================================================================
  TASK 52: Capstone Project — Real-Time Chat Application
==============================================================================

REAL-WORLD CONTEXT:
Chat is the ultimate test of REAL-TIME skills:
  - WebSockets (persistent connections, instant message delivery)
  - State management (online/offline, typing indicators)
  - Data modeling (messages, rooms, read receipts)
  - Scalability (what happens with 10,000 concurrent users?)

SCENARIO: Build a Slack/Discord-like chat:
  - Public rooms and private DMs
  - Real-time messaging with typing indicators
  - File sharing, message editing/deletion
  - Online status and notifications

THIS PROVES YOU CAN:
  - Handle WebSocket connections (Flask-SocketIO or Django Channels)
  - Build real-time features (most apps are adding these)
  - Manage complex state across multiple users
  - Handle edge cases (reconnection, message ordering)

FEATURES TO BUILD:

6. FRONTEND
   - Responsive chat UI
   - Message bubbles (sent vs received)
   - Auto-scroll to latest message
   - Emoji picker (optional)

SETUP:
  pip install channels channels-redis daphne
"""
