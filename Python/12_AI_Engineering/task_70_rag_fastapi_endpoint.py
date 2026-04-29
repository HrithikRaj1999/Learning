"""
================================================================
   TASK 70: RAG Endpoint with FastAPI                *****
================================================================

Goal:
- Combine FastAPI, retrieval, and an LLM provider.
- Return answers with source chunks.
- Keep the design testable with fakes.
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
    pass  # YOUR CODE HERE


# Challenge:
# - Add /documents upload endpoint.
# - Store chunks and embeddings.
# - Stream generated answer tokens.
# - Add tests with fake retriever/generator.

