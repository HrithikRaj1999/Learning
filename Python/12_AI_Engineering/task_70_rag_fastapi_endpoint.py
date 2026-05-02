"""
==============================================================================
  TASK 70: RAG FastAPI Endpoint
==============================================================================

REAL-WORLD CONTEXT:
Combine everything into a working API:
  User sends: POST /ask {"question": "What's the refund policy?"}
  System does: retrieve relevant chunks → generate answer → return with sources
  User gets: {"answer": "Refunds are processed within 7 days...", "sources": [...]}

SCENARIO: Build a complete RAG API endpoint:
  - Retriever: finds relevant document chunks (from Task 68/69)
  - AnswerGenerator: sends context + question to LLM, gets answer
  - API: ties them together with proper request/response models

ARCHITECTURE (testable with fakes):
  Retriever (Protocol) → can be real vector DB or fake for tests
  AnswerGenerator (Protocol) → can be real LLM or fake for tests
  FastAPI endpoint → uses dependency injection for both

EXPECTED BEHAVIOR:
  POST /ask {"question": "refund policy?", "top_k": 3}
  → 200 { "answer": "Based on the documents...", "sources": [{chunk_id, text, score}] }
  In tests: fake retriever returns known chunks, verify answer format
"""

from typing import Protocol

from fastapi import Depends, FastAPI
from pydantic import BaseModel, Field

class Source(BaseModel):
    document_id: str
    chunk_id: str
    text: str
    score: float

class AskRequest(BaseModel):
    question: str = Field(min_length=3)
    top_k: int = Field(default=4, ge=1, le=10)

class AskResponse(BaseModel):
    answer: str
    sources: list[Source]

class Retriever(Protocol):
    def retrieve(self, query: str, top_k: int) -> list[Source]:
        ...

class AnswerGenerator(Protocol):
    def answer(self, question: str, sources: list[Source]) -> str:
        ...

app = FastAPI(title="RAG API")

def get_retriever() -> Retriever:
    raise NotImplementedError

def get_generator() -> AnswerGenerator:
    raise NotImplementedError

@app.post("/ask", response_model=AskResponse)
def ask(
    payload: AskRequest,
    retriever: Retriever = Depends(get_retriever),
    generator: AnswerGenerator = Depends(get_generator),
) -> AskResponse:
    pass
