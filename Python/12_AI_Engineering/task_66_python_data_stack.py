"""
================================================================
   TASK 66: Python Data Stack for AI Engineers       ***
================================================================

Goal:
- Load, clean, and validate tabular/text data.
- Build small reusable preprocessing functions.
- Know where pandas is useful and where plain Python is enough.
"""

from collections import Counter


def normalize_text(text: str) -> str:
    """Lowercase text, trim whitespace, and collapse repeated spaces."""
    pass  # YOUR CODE HERE


def token_counts(documents: list[str]) -> Counter[str]:
    """Return word frequencies across documents."""
    pass  # YOUR CODE HERE


def train_test_split(items: list[dict], test_ratio: float = 0.2) -> tuple[list[dict], list[dict]]:
    """Deterministic split without external libraries."""
    pass  # YOUR CODE HERE


if __name__ == "__main__":
    docs = ["  Hello   AI  ", "hello FastAPI"]
    assert normalize_text(docs[0]) == "hello ai"
    print("Implement the remaining functions and add pytest cases.")

