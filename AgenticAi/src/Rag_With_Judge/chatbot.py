from rich.console import Console

from src.Rag_With_Judge.OpenSearch import index_exists, indexing_chunks
from src.Rag_With_Judge.rag import stream_answer

console = Console()


def answer(question: str) -> None:
    with console.status("Thinking..."):
        stream = stream_answer(question)
        first = next(stream, None)

    if first:
        print(first, end="", flush=True)
    for chunk in stream:
        print(chunk, end="", flush=True)
    print("\n")


def chatbot():
    with console.status("Loading..."):
        if not index_exists():
            indexing_chunks()
    print("Ready. Ask a question (type 'exit' to quit).\n")
    while True:
        question = input("You: ").strip()
        if not question or question.lower() in {"exit", "quit"}:
            break
        answer(question)


if __name__ == "__main__":
    chatbot()
