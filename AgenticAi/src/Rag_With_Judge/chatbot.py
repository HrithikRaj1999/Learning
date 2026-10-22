from langsmith import traceable
from rich.console import Console

from src.Rag_With_Judge.aws import llm_client
from src.Rag_With_Judge.OpenSearch import chunk_retriever, index_exists, indexing_chunks

console = Console()
llm = llm_client()


def answer(question: str) -> None:
    with console.status("Thinking..."):
        docs = chunk_retriever(question)
        context = "\n\n".join(d.page_content for d in docs)
        messages = [
            {
                "role": "system",
                "content": (
                    "Answer using only the context below. "
                    "If the answer is not in the context, say you don't know.\n\n"
                    "Dont be over smart and say unnesary things keep the total explaination in bullet points"
                    "Having proper indentation and sub sub points make it visually appealing"
                    f"Documents:\n{context}"
                ),
            },
            {"role": "user", "content": question},
        ]
        stream = llm.stream(messages)
        first = next(stream, None)

    if first:
        print(first.text, end="", flush=True)
    for chunk in stream:
        print(chunk.text, end="", flush=True)
    print("\n")


@traceable()
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
