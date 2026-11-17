import os

from dotenv import load_dotenv

load_dotenv()


def _env_int(name: str, default: int) -> int:
    return int(os.getenv(name, default))


def _env_bool(name: str, default: bool) -> bool:
    return os.getenv(name, str(default)).strip().lower() in {"1", "true", "yes"}


def _env_list(name: str, default: list[str]) -> list[str]:
    raw = os.getenv(name)
    return [item.strip() for item in raw.split(",") if item.strip()] if raw else default


# AWS / Bedrock
AWS_REGION = os.getenv("AWS_REGION", "us-east-2")
AWS_ROLE_ARN = os.getenv("AWS_ROLE_ARN")
ROLE_SESSION_NAME = os.getenv("AWS_ROLE_SESSION_NAME", "rag-with-judge")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "amazon.titan-embed-text-v2:0")
LLM_MODEL = os.getenv("LLM_MODEL", "us.anthropic.claude-sonnet-5-5")
# Leave unset for models that reject sampling params (e.g. Claude Sonnet 5.5 on Bedrock).
LLM_TEMPERATURE = (
    float(os.environ["LLM_TEMPERATURE"]) if os.getenv("LLM_TEMPERATURE") else None
)

# OpenSearch
OPENSEARCH_URL = os.getenv("OPENSEARCH_URL", "http://localhost:9200")
OPENSEARCH_USER = os.getenv("OPENSEARCH_USER")  # only if security is enabled
OPENSEARCH_PASSWORD = os.getenv("OPENSEARCH_PASSWORD")
OPENSEARCH_VERIFY_CERTS = _env_bool("OPENSEARCH_VERIFY_CERTS", True)
INDEX_NAME = os.getenv("OPENSEARCH_INDEX", "lilian-weng-blogs")
VECTOR_ENGINE = os.getenv("OPENSEARCH_VECTOR_ENGINE", "faiss")
SPACE_TYPE = os.getenv("OPENSEARCH_SPACE_TYPE", "l2")
VECTOR_FIELD = "vector_field"
TEXT_FIELD = "text"
HNSW_M = _env_int("OPENSEARCH_HNSW_M", 16)
HNSW_EF_CONSTRUCTION = _env_int("OPENSEARCH_HNSW_EF_CONSTRUCTION", 512)
HNSW_EF_SEARCH = _env_int("OPENSEARCH_HNSW_EF_SEARCH", 512)
BULK_SIZE = _env_int("OPENSEARCH_BULK_SIZE", 2000)

# Ingestion
USER_AGENT = os.getenv("USER_AGENT", "AgenticAi-RAG-With-Judge/0.2")
HTTP_TIMEOUT = _env_int("HTTP_TIMEOUT", 30)
URLS = _env_list(
    "RAG_URLS",
    [
        "https://lilianweng.github.io/posts/2023-06-23-agent/",
        "https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/",
        "https://lilianweng.github.io/posts/2023-10-25-adv-attack-llm/",
    ],
)
# CSS classes holding the article on lilianweng.github.io; drops nav, footer and comments.
CONTENT_CSS_CLASSES = tuple(
    _env_list("RAG_CONTENT_CSS_CLASSES", ["post-title", "post-header", "post-content"])
)
CHUNK_SIZE = _env_int("CHUNK_SIZE", 250)
CHUNK_OVERLAP = _env_int("CHUNK_OVERLAP", 0)

# Retrieval
TOP_K = _env_int("TOP_K", 2)

# Evaluation (LangSmith)
DATASET_NAME = os.getenv("LANGSMITH_DATASET", "RAG Test Evaluation")
EXPERIMENT_PREFIX = os.getenv("LANGSMITH_EXPERIMENT_PREFIX", "rag-eval")
EVAL_MAX_CONCURRENCY = _env_int("EVAL_MAX_CONCURRENCY", 0)
