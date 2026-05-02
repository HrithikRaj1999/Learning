"""
==============================================================================
  TASK 42: WebSockets (Real-Time Communication)
==============================================================================

REAL-WORLD CONTEXT:
HTTP is request/response (client asks, server answers). WebSockets are
BI-DIRECTIONAL and PERSISTENT — server can push data to client anytime.

Used for: chat apps, live notifications, stock tickers, multiplayer games,
collaborative editing (Google Docs), live dashboards.

SCENARIO:
  42.1 — Echo Server:
    Client sends message → server sends it back. Simplest WebSocket example.
    Learn: connection lifecycle (open, message, close).

  42.2 — Chat Room:
    Multiple users connect → messages broadcast to ALL users.
    Features: join/leave notifications, rooms, user names.
    Uses Flask-SocketIO (production-ready WebSocket for Flask).

WHY NOT JUST USE HTTP POLLING:
  - HTTP polling: client asks every 1 second "any updates?" (wasteful)
  - WebSocket: server pushes updates INSTANTLY when they happen (efficient)
"""

# CHALLENGE 42.1 -- Simple WebSocket Echo Server
Using the 'websockets' library, create a server that:
- Accepts connections on ws://localhost:8765
- Echoes back any message it receives
- Logs connections and disconnections

import asyncio
import websockets

async def echo(websocket):
    async for message in websocket:
        await websocket.send(f"Echo: {message}")

CHALLENGE 42.2 -- Chat Room with Flask-SocketIO
Create a chat app with:
- Multiple users can connect
- Messages broadcast to all users
- "User joined/left" notifications
- Rooms support (join different chat rooms)

from flask import Flask
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
socketio = SocketIO(app)

@socketio.on('message')
def handle_message(data):
    emit('message', data, broadcast=True)

CHALLENGE 42.3 -- Real-Time Dashboard
Create a page that shows:
- Live updating statistics (simulated with random data)
- Server pushes updates every 2 seconds
- Charts or numbers update without page reload
"""
