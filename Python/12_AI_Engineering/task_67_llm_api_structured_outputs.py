"""
==============================================================================
  TASK 67: LLM API — Structured Outputs
==============================================================================

REAL-WORLD CONTEXT:
LLMs return free text. But your app needs STRUCTURED data:
  - Classify support tickets into categories (billing, technical, account)
  - Extract entities from text (names, dates, amounts)
  - Generate data that matches a schema (JSON with specific fields)

SCENARIO: Auto-classify support tickets:
  Input: "I haven't received my invoice for January"
  Output: { category: "billing", priority: "medium", summary: "Missing invoice" }

WHAT'S WRONG (without structured output):
  LLM says: "This seems like a billing issue" → how do you route it?
  Need: a Pydantic model that VALIDATES the LLM's output.

YOUR FIX:
  - Define TicketClassification schema (Pydantic)
  - LLMProvider protocol (swap real/fake implementations)
  - FakeLLMProvider for testing (deterministic, no API calls)

EXPECTED BEHAVIOR:
  provider.classify_ticket("Need invoice") → TicketClassification(category="billing",...)
  # In tests: use FakeLLMProvider (no OpenAI calls, free, deterministic)
  # In prod: use OpenAIProvider (real API, structured output mode)
"""

from typing import Protocol

from pydantic import BaseModel, Field

class TicketClassification(BaseModel):
    category: str = Field(pattern="^(billing|technical|account|other)$")
    priority: str = Field(pattern="^(low|medium|high|urgent)$")
    summary: str = Field(min_length=5, max_length=200)

class LLMProvider(Protocol):
    def classify_ticket(self, text: str) -> TicketClassification:
        ...

class FakeLLMProvider:
    """Deterministic fake for tests."""

    def classify_ticket(self, text: str) -> TicketClassification:
        lowered = text.lower()
        if "invoice" in lowered or "payment" in lowered:
            return TicketClassification(category="billing", priority="medium", summary="Billing related issue")
        return TicketClassification(category="other", priority="low", summary="General support request")
