"""
================================================================
   TASK 67: LLM API Basics and Structured Outputs    ****
================================================================

Goal:
- Call an LLM API through a small adapter.
- Return structured JSON, not loose text.
- Isolate provider-specific code behind an interface.

Recommended project shape:
  ai/providers/base.py
  ai/providers/openai_provider.py
  ai/schemas.py
  tests/test_llm_provider_contract.py
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


# Challenge:
# - Implement OpenAILLMProvider using the Responses API or your chosen SDK.
# - Enforce structured output with a schema.
# - Add retry/backoff for transient failures.
# - Add tests against FakeLLMProvider so CI does not need an API key.

