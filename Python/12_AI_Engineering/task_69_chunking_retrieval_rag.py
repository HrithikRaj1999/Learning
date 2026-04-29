"""
================================================================
   TASK 69: Chunking, Retrieval, and RAG Internals   ****
================================================================

Goal:
- Split documents into chunks with overlap.
- Attach metadata for citations.
- Retrieve relevant chunks before generation.
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class Chunk:
    id: str
    document_id: str
    text: str
    start_word: int
    end_word: int


def chunk_words(document_id: str, text: str, chunk_size: int = 120, overlap: int = 20) -> list[Chunk]:
    """Split text by words with overlap."""
    pass  # YOUR CODE HERE


def build_context(chunks: list[Chunk], max_chars: int = 2000) -> str:
    """Build a citation-friendly context string."""
    pass  # YOUR CODE HERE


# Interview drills:
# - Why can too-large chunks hurt retrieval?
# - What metadata should be stored with each chunk?
# - How do you evaluate retrieval quality separately from generation quality?

