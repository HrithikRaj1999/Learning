from langchain_community.vectorstores.opensearch_vector_search import (
    OpenSearchVectorSearch,
)
from langchain_core.documents import Document
from opensearchpy import OpenSearch

from src.Rag_With_Judge.aws import embedding_client
from src.Rag_With_Judge.constants import (
    BULK_SIZE,
    INDEX_NAME,
    OPENSEARCH_URL,
    SPACE_TYPE,
    TOP_K,
    VECTOR_ENGINE,
)
from src.Rag_With_Judge.data_loading import load_and_split_doc


def index_exists() -> bool:
    client = OpenSearch(hosts=[OPENSEARCH_URL])
    return client.indices.exists(index=INDEX_NAME)


def indexing_chunks() -> int:
    chunks = load_and_split_doc()
    OpenSearchVectorSearch.from_documents(
        documents=chunks,
        embedding=embedding_client(),
        opensearch_url=OPENSEARCH_URL,
        index_name=INDEX_NAME,
        engine=VECTOR_ENGINE,
        space_type=SPACE_TYPE,
        bulk_size=BULK_SIZE,
    )
    return len(chunks)


def chunk_retriever(question: str, k: int = TOP_K) -> list[Document]:
    vectorstore = OpenSearchVectorSearch(
        opensearch_url=OPENSEARCH_URL,
        index_name=INDEX_NAME,
        embedding_function=embedding_client(),
        engine=VECTOR_ENGINE,
        space_type=SPACE_TYPE,
    )
    return vectorstore.similarity_search(question, k=k)
