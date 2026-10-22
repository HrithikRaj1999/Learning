import sys
from typing import Annotated

from annotated_types import doc
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langchain_core.messages import HumanMessage
from langchain_tavily import TavilySearch
from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import add_messages
from langgraph.graph.state import RunnableConfig
from typing_extensions import TypedDict

load_dotenv()


class State(TypedDict):
    messages: Annotated[list, add_messages]


# Non-thinking mode: in thinking mode DeepSeek expects reasoning_content to be
# echoed back between tool calls, which langchain-deepseek doesn't do.
llm = init_chat_model(
    "deepseek:deepseek-flash",
    extra_body={"thinking": {"type": "disabled"}},
)


# def chatbot(state: State):
#     return {"messages": [llm.invoke(state["messages"])]}


# graph_builder = StateGraph(State)

# Adding node
# graph_builder.add_node("llmchatbot", chatbot)

# # Adding Edges
# graph_builder.add_edge(START, "llmchatbot")
# graph_builder.add_edge("llmchatbot", END)

# # Compile the graph
# graph = graph_builder.compile()

# # Invoke the graph safely with a HumanMessage
# response = graph.invoke({"messages": [HumanMessage(content="Hi")]})
# # print(json.dumps(response, indent=2, default=lambda o: o.model_dump()))

# user_input=" ".join(sys.argv[1:]).strip()
# for event in graph.stream({"messages": [HumanMessage(content=user_input)]}):
#     for value in event.values():
#         print(value['messages'][-1].content)


## Stategraph
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import ToolNode, tools_condition

search_tool = TavilySearch(max_results=2)


def multiply(a: int, b: int) -> int:
    """multiply two numbers.

    Args:
        a (int): description
        b (int): description

    Returns:
        int: description
    """

    return a * b


tools = [search_tool, multiply]
llm_with_tools = llm.bind_tools(tools)


## Node Definitions
def tool_calling_llm(state: State):
    return {"messages": [llm_with_tools.invoke(state["messages"])]}


# Graph
builder = StateGraph(State)
builder.add_node("tool_calling_llm", tool_calling_llm)
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


# Exported for the LangGraph API: it manages persistence itself, so the
# compiled graph must not carry a custom checkpointer.
graph = builder.compile()


def main() -> None:
    # Local interactive runs keep their own in-memory persistence.
    local_graph = builder.compile(checkpointer=MemorySaver())
    config: RunnableConfig = {"configurable": {"thread_id": "1"}}
    while True:
        user_input = input("\nYou: ").strip()
        if user_input.lower() in {"exit", "quit", "q"}:
            print("Bye!")
            break
        if not user_input:
            continue

        response = local_graph.invoke(
            {"messages": [HumanMessage(content=user_input)]},
            config=config,
        )
        print("AI:", response["messages"][-1].content)


if __name__ == "__main__":
    main()
