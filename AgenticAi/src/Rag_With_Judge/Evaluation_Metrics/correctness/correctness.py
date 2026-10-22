"""
==========================================================================
Correctness: is the answer right?
==========================================================================
- You write a test question, such as “What is LangGraph?”
- You also write the correct answer for that question.
- Your app answers the test question.
- The judge LLM compares your app’s answer with your correct answer.
- If they match in meaning, the result is pass.
- If your app says something wrong, the result is fail.
- It uses the test question, the correct answer and your app’s answer.
==========================================================================
"""

from dotenv.main import load_dotenv

from src.Rag_With_Judge.Evaluation_Metrics.correctness.prompts import (
    correctness_instructions,
)
from src.Rag_With_Judge.Evaluation_Metrics.correctness.types import Correctnessevaluate
from src.Rag_With_Judge.Evaluation_Metrics.grok_grader import evaluater_for

load_dotenv()


evaluater_llm = evaluater_for(Correctnessevaluate)


def correctness(inputs: dict, outputs: dict, reference_outputs: dict) -> dict:
    answers = f"""\
    QUESTION: {inputs["question"]}
    GROUND TRUTH ANSWER: {reference_outputs["answer"]}
    STUDENT ANSWER: {outputs["answer"]}
    """
    evaluate = evaluater_llm.invoke(
        [
            {"role": "system", "content": correctness_instructions},
            {"role": "user", "content": answers},
        ]
    )
    if not isinstance(evaluate, Correctnessevaluate):
        raise TypeError(f"Expected Correctnessevaluate, got {type(evaluate).__name__}")
    return {
        "key": "correctness",
        "score": evaluate.correct,
        "comment": evaluate.explanation,
    }
