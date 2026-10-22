from langsmith import Client

from src.Rag_With_Judge.aws import llm_client
from src.Rag_With_Judge.Evaluation_Metrics.answer_relevance.answer_relevance import (
    answer_relevance,
)
from src.Rag_With_Judge.Evaluation_Metrics.correctness.correctness import correctness
from src.Rag_With_Judge.Evaluation_Metrics.document_relevance.document_relevance import (
    document_relevance,
)
from src.Rag_With_Judge.Evaluation_Metrics.groundedness.groundedness import groundedness
from src.Rag_With_Judge.OpenSearch import chunk_retriever
from src.Rag_With_Judge.testing_dataset import rag_dataset


def target(inputs: dict) -> dict:
    docs = chunk_retriever(inputs["question"])
    llm = llm_client()
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
        {"role": "user", "content": inputs["question"]},
    ]
    answer = llm.invoke(messages).text
    return {"answer": answer, "documents": docs}


Client().evaluate(
    target,
    data=rag_dataset().name,
    evaluators=[correctness, answer_relevance, groundedness, document_relevance],
    experiment_prefix="rag-eval",
)
