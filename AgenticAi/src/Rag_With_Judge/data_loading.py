import bs4
import requests
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from src.Rag_With_Judge.constants import (
    CHUNK_OVERLAP,
    CHUNK_SIZE,
    HTTP_TIMEOUT,
    URLS,
    USER_AGENT,
)


def load_web_page(url: str) -> Document:
    response = requests.get(
        url, headers={"User-Agent": USER_AGENT}, timeout=HTTP_TIMEOUT
    )
    response.raise_for_status()
    strainer = bs4.SoupStrainer(class_=CONTENT_CSS_CLASSES)
    soup = bs4.BeautifulSoup(response.text, "html.parser", parse_only=strainer)
    title = soup.find(class_="post-title")
    return Document(
        page_content=soup.get_text(),
        metadata={
            "source": url,
            "title": title.get_text(strip=True) if title else url,
        },
    )


def load_documents(urls: list[str]) -> list[Document]:
    return [load_web_page(url) for url in urls]


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
