"""
==============================================================================
  TASK 71: Prompt Engineering & Evaluations
==============================================================================

REAL-WORLD CONTEXT:
How do you know if your AI system is WORKING CORRECTLY? You evaluate it:
  - Define test cases (input + expected output)
  - Run your system on all test cases
  - Measure accuracy (how many did it get right?)
  - Track regressions (new prompt broke old cases?)

SCENARIO: You built a ticket classifier (Task 67). Is it accurate?
  - Create eval cases: [("Need refund", "billing"), ("Can't login", "account"), ...]
  - Run classifier on all cases
  - Report: 8/10 passed, 2 failures with details

WHY EVALS MATTER:
  Without evals: "I think the prompt works" (vibes-based engineering)
  With evals: "Accuracy is 94%, improved from 87% after prompt change" (data-driven)

EXPECTED BEHAVIOR:
  eval_result = exact_match_eval(cases, keyword_classifier)
  eval_result.total → 10
  eval_result.passed → 8
  eval_result.failures → [(case, actual_output)] for debugging
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
    pass

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
