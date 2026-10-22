"""
==========================================================================
Document relevance: are the retrieved documents about the question?
==========================================================================
- You write only the test question.
- Your app's retriever finds documents for the test question.
- The judge LLM checks whether those documents are about the question.
- If the documents relate to the question, the result is pass.
- If the documents are about something else, the result is fail.
- It uses only the test question and the retrieved documents.
==========================================================================
"""

from dotenv.main import load_dotenv

from src.Rag_With_Judge.Evaluation_Metrics.document_relevance.prompts import (
    document_relevance_instructions,
)
from src.Rag_With_Judge.Evaluation_Metrics.document_relevance.types import (
    DocumentRelevanceevaluate,
)
from src.Rag_With_Judge.Evaluation_Metrics.grok_grader import evaluater_for

load_dotenv()


evaluater_llm = evaluater_for(DocumentRelevanceevaluate)


def document_relevance(inputs: dict, outputs: dict) -> dict:
    doc_string = "\n\n".join(doc.page_content for doc in outputs["documents"])
    answers = f"""\
    FACTS: {doc_string}
    QUESTION: {inputs["question"]}
    """
    evaluate = evaluater_llm.invoke(
        [
            {"role": "system", "content": document_relevance_instructions},
            {"role": "user", "content": answers},
        ]
    )
    if not isinstance(evaluate, DocumentRelevanceevaluate):
        raise TypeError(
            f"Expected DocumentRelevanceevaluate, got {type(evaluate).__name__}"
        )
    return {
        "key": "document_relevance",
        "score": evaluate.relevant,
        "comment": evaluate.explanation,
    }
