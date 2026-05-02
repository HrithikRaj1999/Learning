"""
==============================================================================
  TASK 75: AI Knowledge Base Capstone
==============================================================================

REAL-WORLD CONTEXT:
This is the FINAL capstone. Build a complete AI-powered knowledge base:
  - Upload documents (PDF, text, markdown)
  - Ask questions in natural language
  - Get answers WITH source citations
  - All behind a FastAPI with auth, streaming, and proper error handling

COMBINES EVERYTHING:
  - Task 66: Text preprocessing and normalization
  - Task 67: Structured LLM outputs
  - Task 68: Vector embeddings and similarity search
  - Task 69: Document chunking and retrieval
  - Task 70: RAG endpoint architecture
  - Task 71: Evaluation framework
  - Task 72: Tool calling (optional: search tool, calculator)
  - Task 73: Model serving patterns
  - Task 74: Safety, security, cost management

FEATURES:
  - POST /documents → upload and index document (chunked + embedded)
  - POST /ask → RAG query with streaming response
  - GET /documents → list indexed documents
  - Auth: JWT tokens, rate limiting per user
  - Safety: prompt injection detection, cost tracking, PII redaction
  - Testing: full test suite with fakes (no real LLM calls in tests)

THIS PROVES YOU CAN:
  Build a production AI application from scratch. This is the #1 most
  in-demand skill for Python developers in 2024-2025.
"""

# Build this as a real project folder with proper structure:
# knowledge_base/
#   app/
#     main.py, models/, routes/, services/, tests/
#   Dockerfile, docker-compose.yml, .env.example, README.md
