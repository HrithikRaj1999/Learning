"""
================================================================
   TASK 63: Streaming Responses and WebSockets       ****
================================================================

Goal:
- Stream data progressively.
- Build a simple WebSocket endpoint.
- Understand where this helps AI applications.
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


# Challenge:
# - Add connection manager for multiple clients.
# - Broadcast messages to all clients.
# - Add tests/manual script using websockets.
# - Explain how this maps to streaming LLM responses.

