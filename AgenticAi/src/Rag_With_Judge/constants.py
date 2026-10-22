import os

from dotenv import load_dotenv

load_dotenv()

# AWS / Bedrock
AWS_REGION = os.getenv("AWS_REGION", "us-east-2")
AWS_ROLE_ARN = os.getenv("AWS_ROLE_ARN")
ROLE_SESSION_NAME = "rag-with-judge"
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "amazon.titan-embed-text-v2:0")
LLM_MODEL = os.getenv("LLM_MODEL", "us.anthropic.claude-sonnet-4-5-20250929-v1:0")

# OpenSearch
OPENSEARCH_URL = os.getenv("OPENSEARCH_URL", "http://localhost:9200")
OPENSEARCH_USER = os.getenv("OPENSEARCH_USER")  # only if security is enabled
OPENSEARCH_PASSWORD = os.getenv("OPENSEARCH_PASSWORD")
INDEX_NAME = os.getenv("OPENSEARCH_INDEX", "lilian-weng-blogs")
VECTOR_ENGINE = "faiss"
SPACE_TYPE = "l2"
BULK_SIZE = 2000

# Ingestion
USER_AGENT = "AgenticAi-RAG-With-Judge/0.1"
URLS = [
    "https://lilianweng.github.io/posts/2023-06-23-agent/",
    "https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/",
    "https://lilianweng.github.io/posts/2023-10-25-adv-attack-llm/",
]
CHUNK_SIZE = 250
CHUNK_OVERLAP = 0

# Retrieval
TOP_K = 2
