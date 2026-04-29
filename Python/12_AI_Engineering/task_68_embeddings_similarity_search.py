"""
================================================================
   TASK 68: Embeddings and Similarity Search         ****
================================================================

Goal:
- Understand embeddings as numeric vectors.
- Implement cosine similarity.
- Build a tiny in-memory vector index.
"""

import math


Vector = list[float]


def cosine_similarity(a: Vector, b: Vector) -> float:
    pass  # YOUR CODE HERE


class InMemoryVectorIndex:
    def __init__(self) -> None:
        self._items: list[tuple[str, Vector, dict]] = []

    def add(self, item_id: str, vector: Vector, metadata: dict | None = None) -> None:
        pass  # YOUR CODE HERE

    def search(self, query_vector: Vector, top_k: int = 3) -> list[tuple[str, float, dict]]:
        pass  # YOUR CODE HERE


if __name__ == "__main__":
    assert round(cosine_similarity([1, 0], [1, 0]), 5) == 1.0
    assert round(cosine_similarity([1, 0], [0, 1]), 5) == 0.0
    print("Add search tests for ranking and metadata.")

