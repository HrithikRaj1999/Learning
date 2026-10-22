from langchain_community.document_loaders import WebBaseLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from src.Rag_With_Judge.constants import CHUNK_OVERLAP, CHUNK_SIZE, URLS


def load_documents(urls: list[str]) -> list[Document]:
    docs = [WebBaseLoader(url).load() for url in urls]
    return [item for sublist in docs for item in sublist]


def split_documents(
    docs: list[Document],
    chunk_size: int = CHUNK_SIZE,
    chunk_overlap: int = CHUNK_OVERLAP,
) -> list[Document]:
    text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )
    return text_splitter.split_documents(docs)


def load_and_split_doc(urls: list[str] = URLS) -> list[Document]:
    return split_documents(load_documents(urls))
