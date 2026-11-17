"""
OpenSearch k-NN vector store written directly on opensearch-py.

`langchain-community` (which held `OpenSearchVectorSearch`) was sunset in May 2026
(langchain-ai/langchain-community#674) and has no standalone replacement package.
The index layout matches the old integration (`text`, `metadata`, `vector_field`),
so indexes it created keep working.
"""

import sys
from functools import cache

from langchain_core.documents import Document
from langsmith import traceable
from opensearchpy import OpenSearch, helpers

from src.Rag_With_Judge.aws import embedding_client
from src.Rag_With_Judge.constants import (
    BULK_SIZE,
    HNSW_EF_CONSTRUCTION,
    HNSW_EF_SEARCH,
    HNSW_M,
    INDEX_NAME,
    OPENSEARCH_PASSWORD,
    OPENSEARCH_URL,
    OPENSEARCH_USER,
    OPENSEARCH_VERIFY_CERTS,
    SPACE_TYPE,
    TEXT_FIELD,
    TOP_K,
    VECTOR_ENGINE,
    VECTOR_FIELD,
)
from src.Rag_With_Judge.data_loading import load_and_split_doc


@cache
def opensearch_client() -> OpenSearch:
    auth = (
        (OPENSEARCH_USER, OPENSEARCH_PASSWORD)
        if OPENSEARCH_USER and OPENSEARCH_PASSWORD
        else None
    )
    return OpenSearch(
        hosts=[OPENSEARCH_URL],
        http_auth=auth,
        verify_certs=OPENSEARCH_VERIFY_CERTS,
        ssl_show_warn=OPENSEARCH_VERIFY_CERTS,
    )


@cache
def _embeddings():
    return embedding_client()


def index_exists() -> bool:
    return opensearch_client().indices.exists(index=INDEX_NAME)


def _create_index(dimension: int) -> None:
    opensearch_client().indices.create(
        index=INDEX_NAME,
        body={
            "settings": {
                "index": {"knn": True, "knn.algo_param.ef_search": HNSW_EF_SEARCH}
            },
            "mappings": {
                "properties": {
                    TEXT_FIELD: {"type": "text"},
                    "metadata": {"type": "object"},
                    VECTOR_FIELD: {
                        "type": "knn_vector",
                        "dimension": dimension,
                        "method": {
                            "name": "hnsw",
                            "engine": VECTOR_ENGINE,
                            "space_type": SPACE_TYPE,
                            "parameters": {
                                "ef_construction": HNSW_EF_CONSTRUCTION,
                                "m": HNSW_M,
                            },
                        },
                    },
                }
            },
        },
    )


def indexing_chunks() -> int:
    chunks = load_and_split_doc()
    vectors = _embeddings().embed_documents([c.page_content for c in chunks])
    if not index_exists():
        _create_index(dimension=len(vectors[0]))

    actions = (
        {
            "_index": INDEX_NAME,
            "_source": {
                TEXT_FIELD: chunk.page_content,
                "metadata": chunk.metadata,
                VECTOR_FIELD: vector,
            },
        }
        for chunk, vector in zip(chunks, vectors, strict=True)
    )
    helpers.bulk(opensearch_client(), actions, chunk_size=BULK_SIZE)
    opensearch_client().indices.refresh(index=INDEX_NAME)
    return len(chunks)


def rebuild_index() -> int:
    if index_exists():
        opensearch_client().indices.delete(index=INDEX_NAME)
    return indexing_chunks()


@traceable(run_type="retriever", name="opensearch_knn")
def chunk_retriever(question: str, k: int = TOP_K) -> list[Document]:
    vector = _embeddings().embed_query(question)
    hits = opensearch_client().search(
        index=INDEX_NAME,
        body={
            "size": k,
            "query": {"knn": {VECTOR_FIELD: {"vector": vector, "k": k}}},
            "_source": {"excludes": [VECTOR_FIELD]},
        },
    )["hits"]["hits"]
    return [
        Document(
            page_content=hit["_source"][TEXT_FIELD],
            metadata={**hit["_source"].get("metadata", {}), "score": hit["_score"]},
        )
        for hit in hits
    ]


if __name__ == "__main__":
    if "--rebuild" in sys.argv:
        print(f"Rebuilt '{INDEX_NAME}' with {rebuild_index()} chunks")
    else:
        print(f"Index '{INDEX_NAME}' exists: {index_exists()}")
