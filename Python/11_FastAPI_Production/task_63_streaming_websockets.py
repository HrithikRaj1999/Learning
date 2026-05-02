"""
==============================================================================
  TASK 63: Streaming Responses & WebSockets
==============================================================================

REAL-WORLD CONTEXT:
Streaming: send response in CHUNKS (not all at once). Used for:
  - AI text generation (ChatGPT-style token-by-token output)
  - Large file downloads (don't load entire file into memory)
  - Server-Sent Events (real-time updates)

WebSockets: persistent bi-directional connection. Used for:
  - Chat applications
  - Live notifications
  - Collaborative editing

SCENARIO:
  GET /stream?text=hello+world → streams words one-by-one (like ChatGPT typing)
  WS /ws/chat → echo server (foundation for chat apps)

WHY STREAMING MATTERS:
  Without: user waits 10 seconds for full AI response, sees nothing.
  With streaming: user sees words appearing in real-time (better UX).

EXPECTED BEHAVIOR:
  GET /stream → response arrives word-by-word (not all at once)
  WS /ws/chat → send "hello" → receive "echo: hello"
"""

import asyncio
from collections.abc import AsyncIterator

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse

app = FastAPI()

async def token_stream(text: str) -> AsyncIterator[str]:
    for word in text.split():
        await asyncio.sleep(0.05)
        yield word + " "

@app.get("/stream")
async def stream(text: str = "FastAPI streams responses well"):
    return StreamingResponse(token_stream(text), media_type="text/plain")

@app.websocket("/ws/chat")
async def chat(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            message = await websocket.receive_text()
            await websocket.send_text(f"echo: {message}")
    except WebSocketDisconnect:
        pass
