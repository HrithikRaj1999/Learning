"""
================================================================
   TASK 74: AI Safety, Security, and Cost Controls   *****
================================================================

Goal:
- Defend against prompt injection and data leakage.
- Control spend and latency.
- Make AI behavior observable.
"""


SENSITIVE_PATTERNS = ["api_key", "password", "secret", "token"]


def redact_sensitive_text(text: str) -> str:
    """Replace obvious sensitive key/value pairs with [REDACTED]."""
    pass  # YOUR CODE HERE


def estimate_cost(input_tokens: int, output_tokens: int, input_per_million: float, output_per_million: float) -> float:
    """Estimate API cost."""
    pass  # YOUR CODE HERE


def detect_prompt_injection(text: str) -> bool:
    """Return True for common prompt-injection phrasing."""
    pass  # YOUR CODE HERE


# Checklist:
# - Never send secrets to model providers.
# - Scope retrieved context to the current user/tenant.
# - Log model, latency, token counts, and cost estimate.
# - Cache only safe responses.
# - Add human review for high-risk actions.
# - Use evals to track regressions after prompt/model changes.

