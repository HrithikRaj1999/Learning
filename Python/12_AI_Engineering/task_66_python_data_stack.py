"""
==============================================================================
  TASK 66: Python Data Stack (Text Processing for AI)
==============================================================================

REAL-WORLD CONTEXT:
Before ANY AI/ML work, you need clean data. These are the preprocessing steps
that happen BEFORE data hits a model:
  - Normalize text (remove extra spaces, lowercase for consistent matching)
  - Count tokens (understand data distribution, estimate API costs)
  - Split data into train/test (evaluate model performance fairly)

SCENARIO:
  66.1 — normalize_text: Clean raw user input before feeding to AI model.
    Raw: "  Hello   AI  " → Clean: "hello ai"

  66.2 — token_counts: Count word frequencies across documents.
    Used for: TF-IDF, vocabulary building, understanding data.

  66.3 — train_test_split: Split dataset into training (80%) and test (20%).
    CRITICAL: test data must NEVER be seen during training (data leakage bug).

EXPECTED BEHAVIOR:
  normalize_text("  Hello   AI  ") → "hello ai"
  token_counts(["hello world", "hello ai"]) → Counter({"hello": 2, "world": 1, "ai": 1})
  train_test_split(100_items, 0.2) → (80 items, 20 items)
"""

from collections import Counter

def normalize_text(text: str) -> str:
    """Lowercase text, trim whitespace, and collapse repeated spaces."""
    pass

def token_counts(documents: list[str]) -> Counter[str]:
    """Return word frequencies across documents."""
    pass

def train_test_split(items: list[dict], test_ratio: float = 0.2) -> tuple[list[dict], list[dict]]:
    """Deterministic split without external libraries."""
    pass

if __name__ == "__main__":
    docs = ["  Hello   AI  ", "hello FastAPI"]
    assert normalize_text(docs[0]) == "hello ai"
    print("Implement the remaining functions and add pytest cases.")
