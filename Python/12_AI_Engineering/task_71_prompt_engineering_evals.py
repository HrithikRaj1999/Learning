"""
================================================================
   TASK 71: Prompt Engineering and Evals             ****
================================================================

Goal:
- Treat prompts like code: versioned, tested, measured.
- Build a small eval harness.
- Track accuracy and failure cases.
"""

from dataclasses import dataclass
from typing import Callable


@dataclass(frozen=True)
class EvalCase:
    input: str
    expected: str


@dataclass(frozen=True)
class EvalResult:
    total: int
    passed: int
    failures: list[tuple[EvalCase, str]]


def exact_match_eval(cases: list[EvalCase], predictor: Callable[[str], str]) -> EvalResult:
    pass  # YOUR CODE HERE


def keyword_classifier(text: str) -> str:
    lowered = text.lower()
    if "refund" in lowered or "invoice" in lowered:
        return "billing"
    if "password" in lowered or "login" in lowered:
        return "account"
    return "other"


if __name__ == "__main__":
    cases = [
        EvalCase("Need refund for invoice", "billing"),
        EvalCase("Cannot login", "account"),
        EvalCase("Where is your office?", "other"),
    ]
    print(exact_match_eval(cases, keyword_classifier))

