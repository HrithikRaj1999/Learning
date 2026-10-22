from typing import Optional, TypedDict

from langgraph.graph import END, START, StateGraph
from langgraph.graph.state import NotRequired


class QuadState(TypedDict):
    a: int
    b: int
    c: int
    equation: NotRequired[str]
    discriminant: NotRequired[float]
    result: NotRequired[str]


def show_equation(state: QuadState):
    equation = f"{state['a']}x2{state['b']}x{state['c']}"
    return {"equation": equation}


def calculate_discriminant(state: QuadState):
    dis = state["b"] ** 2 - (4 * state["a"] * state["c"])
    return {"discriminant": dis}


graph = StateGraph(QuadState)
graph.add_node("show_equation", show_equation)
graph.add_node("calculate_discriminant", calculate_discriminant)


graph.add_edge(START, "show_equation")
graph.add_edge("show_equation", "calculate_discriminant")
graph.add_edge("calculate_discriminant", END)

workflow = graph.compile()

initial_state: QuadState = {"a": 4, "b": -5, "c": 2}

workflow.invoke(initial_state)
