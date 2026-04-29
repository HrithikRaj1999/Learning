"""
================================================================
   TASK 42: WebSockets with Python                ****    
================================================================

SETUP: pip install websockets flask-socketio
CONCEPTS: WebSocket protocol, real-time communication, events, rooms

INSTRUCTIONS:
WebSockets enable real-time features: chat, notifications, live updates.
"""

# =========== CHALLENGES ===========

"""
CHALLENGE 42.1 -- Simple WebSocket Echo Server
Using the 'websockets' library, create a server that:
- Accepts connections on ws://localhost:8765
- Echoes back any message it receives
- Logs connections and disconnections

import asyncio
import websockets

async def echo(websocket):
    async for message in websocket:
        await websocket.send(f"Echo: {message}")

# YOUR CODE HERE to start the server


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

# YOUR CODE HERE


CHALLENGE 42.3 -- Real-Time Dashboard
Create a page that shows:
- Live updating statistics (simulated with random data)
- Server pushes updates every 2 seconds
- Charts or numbers update without page reload
"""
