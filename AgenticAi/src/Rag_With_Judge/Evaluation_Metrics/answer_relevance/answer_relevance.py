"""
==========================================================================
Answer relevance: is the answer about the question?
==========================================================================
- You write only the test question.
- Your app answers the test question.
- The judge LLM checks whether the answer is about what was asked.
- If the answer is on topic, the result is pass, even if some facts are wrong.
- If the answer talks about something else, the result is fail.
- It uses only the test question and your app’s answer.
==========================================================================
"""

from dotenv.main import load_dotenv

from src.Rag_With_Judge.Evaluation_Metrics.answer_relevance.prompts import (
    answer_relevance_instructions,
)
from src.Rag_With_Judge.Evaluation_Metrics.answer_relevance.types import (
    AnswerRelevanceevaluate,
)
from src.Rag_With_Judge.Evaluation_Metrics.grok_grader import evaluater_for

load_dotenv()


evaluater_llm = evaluater_for(AnswerRelevanceevaluate)


def answer_relevance(inputs: dict, outputs: dict) -> dict:
    answers = f"""\
    QUESTION: {inputs["question"]}
    STUDENT ANSWER: {outputs["answer"]}
    """
    evaluate = evaluater_llm.invoke(
        [
            {"role": "system", "content": answer_relevance_instructions},
            {"role": "user", "content": answers},
        ]
    )
    if not isinstance(evaluate, AnswerRelevanceevaluate):
        raise TypeError(
            f"Expected AnswerRelevanceevaluate, got {type(evaluate).__name__}"
        )
    return {
        "key": "answer_relevance",
        "score": evaluate.relevant,
        "comment": evaluate.explanation,
    }
