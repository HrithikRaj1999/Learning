from typing import Annotated
from annotated_types import doc
from langchain.chat_models.base import init_chat_model
from langchain_core.messages.human import HumanMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt.tool_node import tools_condition
from langgraph.pregel.main import RunnableConfig
from typing_extensions import TypedDict
from langchain_core.tools import tool
from langgraph.graph import END, START
from langgraph.graph.state import StateGraph
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from langchain_core.messages import BaseMessage
import os
from dotenv import load_dotenv

load_dotenv()

os.environ["LANGSMITH_TRACING"]="true"

memory=MemorySaver()
class State(TypedDict):
    messages:Annotated[list[BaseMessage],add_messages]

@tool
def add(a: float, b: float) -> float:
    """Add two numbers.

    Args:
        a: The first number to add.
        b: The second number to add.

    Returns:
        The sum of ``a`` and ``b``.
    """
    return a + b


llm = init_chat_model(
    "deepseek:deepseek-flash",
    extra_body={"thinking": {"type": "disabled"}},
)
tools=[add]
llm_with_tools = llm.bind_tools(tools)


def call_llm_model(state:State):
    return {"messages":[llm_with_tools.invoke(state['messages'])]}



# Graph
builder = StateGraph(State)
builder.add_node("tool_calling_llm", call_llm_model)
builder.add_node("tools", ToolNode(tools))


##Add Edges
builder.add_edge(START, "tool_calling_llm")
builder.add_conditional_edges(
    "tool_calling_llm",
    # If the latest result from assistant is a tool call -> tools_condition routes to tools
    # If the latest result from assistant is a result or not tool call-> tools_condition routes to END
    tools_condition,
)
builder.add_edge("tools", "tool_calling_llm")


graph = builder.compile(checkpointer=memory)
config:RunnableConfig = {"configurable": {"thread_id": "1"}}
while True:
    user_input = input("\nYou: ").strip()
    if user_input.lower() in {"exit", "quit", "q"}:
        print("Bye!")
        break
    if not user_input:
        continue

    response = graph.invoke(
        {"messages": [HumanMessage(content=user_input)]},
        config=config,
    )
    print("AI:", response["messages"][-1].content)
