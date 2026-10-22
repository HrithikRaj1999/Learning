from constants import data
from dotenv.main import load_dotenv
from langchain_deepseek.chat_models import ChatDeepSeek
from langchain_groq import ChatGroq
from langsmith import Client

load_dotenv()
client = Client()
dataset_name = "Simple Chatbot Evaluation"
default_instructions = (
    "Answer with one short noun phrase of 8 to 14 words that states what the thing is "
    "and its core purpose or key mechanism (e.g. 'A framework for building LLM applications'). "
    "Start directly with the definition, do not repeat the term, and do not add examples."
)
eval_instructions = (
    "You are an expert professor specialized in grading students' answers to questions."
)


# Judge uses a different provider than the app under test (DeepSeek)
judge_llm = ChatGroq(model="openai/gpt-oss-120b", temperature=0)


def my_app(
    question: str,
    model: str = "deepseek-chat",
    instructions: str = default_instructions,
) -> str:
    llm = ChatDeepSeek(model=model, temperature=0)
    return llm.invoke(
        [
            {"role": "system", "content": instructions},
            {"role": "user", "content": question},
        ]
    ).text


def correctness(inputs: dict, outputs: dict, reference_outputs: dict) -> dict:
    user_content = f"""You are grading the following question:
{inputs["question"]}
Here is the real answer:
{reference_outputs["answer"]}
You are grading the following predicted answer:
{outputs["response"]}
Respond with CORRECT or INCORRECT:
Grade:
"""
    grade = judge_llm.invoke(
        [
            {"role": "system", "content": eval_instructions},
            {"role": "user", "content": user_content},
        ]
    ).text
    return {
        "key": "correctness",
        "score": grade.strip().upper().startswith("CORRECT"),
    }


def concision(outputs: dict, reference_outputs: dict) -> dict:
    return {
        "key": "concision",
        "score": int(len(outputs["response"]) < 2 * len(reference_outputs["answer"])),
    }


def main(experiment_prefix: str = "deepseek-simple-chatbot"):
    if not client.has_dataset(dataset_name=dataset_name):
        dataset = client.create_dataset(dataset_name)
        client.create_examples(dataset_id=dataset.id, examples=data)

    return client.evaluate(
        lambda inputs: {"response": my_app(inputs["question"])},
        data=dataset_name,
        evaluators=[correctness, concision],
        experiment_prefix=experiment_prefix,
    )


if __name__ == "__main__":
    main()
