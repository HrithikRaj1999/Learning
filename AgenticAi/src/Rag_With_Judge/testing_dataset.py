from langsmith import Client

from src.Rag_With_Judge.constants import DATASET_NAME

examples = [
    {
        "inputs": {"question": "How does the ReAct agent use self-reflection?"},
        "outputs": {
            "answer": "ReAct integrates reasoning and acting by extending the action space to include discrete actions and language. The agent alternates Thought, Action and Observation steps, so reasoning traces guide tool use and observations update the plan."
        },
    },
    {
        "inputs": {
            "question": "What are the types of biases that can arise with few-shot prompting?"
        },
        "outputs": {
            "answer": "The biases include (1) majority label bias, when the example label distribution is unbalanced; (2) recency bias, when the model repeats labels near the end of the prompt; and (3) common token bias, when the model favors frequent tokens over rare ones."
        },
    },
    {
        "inputs": {"question": "What are five types of adversarial attacks?"},
        "outputs": {
            "answer": "Five types are (1) token manipulation, (2) gradient-based attacks, (3) jailbreak prompting, (4) human red-teaming, and (5) model red-teaming."
        },
    },
    {
        "inputs": {
            "question": "What are the three main components of an LLM-powered autonomous agent?"
        },
        "outputs": {
            "answer": "Planning, memory and tool use, with the LLM acting as the agent's brain."
        },
    },
    {
        "inputs": {"question": "What is Chain of Thought (CoT) prompting?"},
        "outputs": {
            "answer": "A prompting technique that makes the model produce intermediate reasoning steps before the final answer, which improves performance on complex tasks. It breaks hard problems into smaller steps and exposes the model's thinking."
        },
    },
    {
        "inputs": {"question": "How does Tree of Thoughts extend Chain of Thought?"},
        "outputs": {
            "answer": "It explores multiple reasoning possibilities at each step by decomposing the problem into thought steps and generating several thoughts per step, forming a tree. The tree is searched with BFS or DFS, and each state is evaluated by a classifier or majority vote."
        },
    },
    {
        "inputs": {
            "question": "What are the types of memory in an LLM agent, and how do they map to human memory?"
        },
        "outputs": {
            "answer": "Sensory memory maps to learned embedding representations of raw inputs, short-term (working) memory maps to in-context learning limited by the context window, and long-term memory maps to an external vector store accessed through fast retrieval."
        },
    },
    {
        "inputs": {
            "question": "What is the difference between zero-shot and few-shot prompting?"
        },
        "outputs": {
            "answer": "Zero-shot prompting gives the model the task description with no examples. Few-shot prompting includes a set of high-quality demonstrations of input and output pairs in the prompt before the target input."
        },
    },
    {
        "inputs": {
            "question": "What is a jailbreak in the context of adversarial attacks on LLMs?"
        },
        "outputs": {
            "answer": "A jailbreak is a prompt-based attack that tricks an aligned model into bypassing its safety training and producing content it would normally refuse, without needing white-box access to the model weights."
        },
    },
    {
        "inputs": {
            "question": "What is the role of the Reflexion framework in agents?"
        },
        "outputs": {
            "answer": "Reflexion gives agents dynamic memory and self-reflection. After each action the agent computes a heuristic to detect inefficient or hallucinated trajectories, and generates reflections that are stored in memory to improve later attempts."
        },
    },
]


def rag_dataset(dataset_name: str = DATASET_NAME):
    client = Client()
    if client.has_dataset(dataset_name=dataset_name):
        return client.read_dataset(dataset_name=dataset_name)
    dataset = client.create_dataset(dataset_name=dataset_name)
    client.create_examples(dataset_id=dataset.id, examples=examples)
    return dataset


if __name__ == "__main__":
    print(rag_dataset())
