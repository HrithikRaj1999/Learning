"""
==========================================================================
Groundedness: did the app make things up ( hallucinated)
==========================================================================
- You write only the test question.
- Your app finds documents and answers the test question.
- The judge LLM checks whether every claim in the answer comes from those documents.
- If the answer sticks to the documents, the result is pass.
- If the answer adds facts the documents don't contain, the result is fail.
- It uses only the retrieved documents and your app’s answer.
==========================================================================
"""

from dotenv.main import load_dotenv

from src.Rag_With_Judge.Evaluation_Metrics.grok_grader import evaluater_for
from src.Rag_With_Judge.Evaluation_Metrics.groundedness.prompts import (
    groundedness_instructions,
)
from src.Rag_With_Judge.Evaluation_Metrics.groundedness.types import (
    Groundednessevaluate,
)

load_dotenv()


evaluater_llm = evaluater_for(Groundednessevaluate)


def groundedness(inputs: dict, outputs: dict) -> dict:
    doc_string = "\n\n".join(doc.page_content for doc in outputs["documents"])
    answers = f"""\
    FACTS: {doc_string}
    STUDENT ANSWER: {outputs["answer"]}
    """
    evaluate = evaluater_llm.invoke(
        [
            {"role": "system", "content": groundedness_instructions},
            {"role": "user", "content": answers},
        ]
    )
    if not isinstance(evaluate, Groundednessevaluate):
        raise TypeError(f"Expected Groundednessevaluate, got {type(evaluate).__name__}")
    return {
        "key": "groundedness",
        "score": evaluate.grounded,
        "comment": evaluate.explanation,
    }
