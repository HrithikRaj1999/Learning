"""
================================================================
   TASK 75: Capstone - AI Knowledge Base API         *****
================================================================

Build a portfolio-grade AI engineering project.

Project: AI Knowledge Base API

User story:
Users upload documents and ask questions. The API answers using only retrieved
source material and returns citations.

Core features:
- JWT auth and per-user document isolation.
- Upload .txt, .md, and .pdf files.
- Extract text and chunk it.
- Generate embeddings.
- Store vectors in Chroma, FAISS, or pgvector.
- Retrieve top-k chunks.
- Generate answer with citations.
- Stream answer tokens.
- Track feedback: thumbs up/down plus comments.

Engineering requirements:
- FastAPI package structure.
- Service interfaces for embedder, vector store, retriever, generator.
- Fake services for tests.
- Postgres for metadata.
- Redis for rate limiting/cache.
- Docker compose.
- CI with lint, tests, and coverage.
- Observability: request id, latency, token counts, estimated cost.

Evaluation requirements:
- 30 question-answer-source test cases.
- Retrieval recall metric.
- Answer faithfulness rubric.
- Regression report in README.

Interview talking points:
- Chunk size and overlap tradeoffs.
- Vector DB choice and metadata filters.
- Hallucination controls.
- Multi-tenant security.
- Streaming and cancellation.
- Cost optimization.
"""


if __name__ == "__main__":
    print("Build this as the final FastAPI + AI engineer portfolio project.")

