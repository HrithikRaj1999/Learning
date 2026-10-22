document_relevance_instructions = """You are a teacher grading a quiz.

You will be given a QUESTION and a set of FACTS provided by the student.

Follow these grading criteria:
(1) Your goal is to identify FACTS that are completely unrelated to the QUESTION.
(2) If the FACTS contain ANY keywords or semantic meaning related to the QUESTION, consider them relevant.
(3) The FACTS may contain SOME information unrelated to the QUESTION, as long as (2) is met.

Relevance:
True means the FACTS meet all of the criteria.
False means the FACTS are completely unrelated to the QUESTION.

Explain your reasoning step by step so your conclusion is correct.

Do not simply state your verdict at the start."""
