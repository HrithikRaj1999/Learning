from langsmith import Client

from src.Rag_With_Judge.constants import (
    CHUNK_OVERLAP,
    CHUNK_SIZE,
    EMBEDDING_MODEL,
    EVAL_MAX_CONCURRENCY,
    EXPERIMENT_PREFIX,
    LLM_MODEL,
    TOP_K,
)
from src.Rag_With_Judge.Evaluation_Metrics.answer_relevance.answer_relevance import (
    answer_relevance,
)
from src.Rag_With_Judge.Evaluation_Metrics.correctness.correctness import correctness
from src.Rag_With_Judge.Evaluation_Metrics.document_relevance.document_relevance import (
    document_relevance,
)
from src.Rag_With_Judge.Evaluation_Metrics.groundedness.groundedness import groundedness
from src.Rag_With_Judge.rag import rag_bot
from src.Rag_With_Judge.testing_dataset import rag_dataset


def target(inputs: dict) -> dict:
    return rag_bot(inputs["question"])


def run_evals():
    return Client().evaluate(
        target,
        data=rag_dataset().name,
        evaluators=[correctness, answer_relevance, groundedness, document_relevance],
        experiment_prefix=EXPERIMENT_PREFIX,
        max_concurrency=EVAL_MAX_CONCURRENCY,
        metadata={
            "llm": LLM_MODEL,
            "embedding": EMBEDDING_MODEL,
            "judge": LLM_MODEL,
            "top_k": TOP_K,
            "chunk_size": CHUNK_SIZE,
            "chunk_overlap": CHUNK_OVERLAP,
        },
    )


if __name__ == "__main__":
    print(run_evals())
