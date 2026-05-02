"""
==============================================================================
  TASK 69: Chunking & Retrieval for RAG
==============================================================================

REAL-WORLD CONTEXT:
RAG (Retrieval-Augmented Generation) is how ChatGPT-like apps answer questions
about YOUR documents. The process:
  1. Split documents into chunks (this task)
  2. Convert chunks to embeddings (Task 68)
  3. User asks question → find most relevant chunks → feed to LLM

SCENARIO: User uploads a 50-page PDF. They ask "What's the refund policy?"
  - Can't feed entire 50 pages to LLM (too expensive, too long)
  - Split into 120-word chunks with 20-word overlap
  - Find the 3 most relevant chunks (the ones about refunds)
  - Send only THOSE chunks to LLM with the question

WHY OVERLAP:
  Without overlap: a sentence split between chunks loses context.
  With overlap: boundary sentences appear in BOTH chunks (no information loss).

EXPECTED BEHAVIOR:
  chunk_words("doc1", long_text, chunk_size=120, overlap=20)
  → [Chunk(text="first 120 words..."), Chunk(text="last 20 + next 100..."), ...]
  build_context(chunks, max_chars=2000) → formatted string for LLM prompt
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
    pass

def build_context(chunks: list[Chunk], max_chars: int = 2000) -> str:
    """Build a citation-friendly context string."""
    pass
