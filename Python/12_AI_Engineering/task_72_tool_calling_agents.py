"""
================================================================
   TASK 72: Tool Calling and Agentic Workflows       ****
================================================================

Goal:
- Define tools with strict input/output schemas.
- Route tool calls safely.
- Avoid giving the model uncontrolled execution.
"""

from collections.abc import Callable
from dataclasses import dataclass

from pydantic import BaseModel, Field, ValidationError


class WeatherArgs(BaseModel):
    city: str = Field(min_length=2, max_length=80)


class CalculatorArgs(BaseModel):
    a: float
    b: float
    operation: str = Field(pattern="^(add|subtract|multiply|divide)$")


@dataclass(frozen=True)
class Tool:
    name: str
    schema: type[BaseModel]
    handler: Callable[[BaseModel], dict]


def run_tool(tool: Tool, raw_args: dict) -> dict:
    """Validate raw_args with the tool schema, then call the handler."""
    pass  # YOUR CODE HERE


# Challenge:
# - Add weather and calculator handlers.
# - Add an allowlist of tool names.
# - Add audit logging for every tool call.
# - Add tests for invalid args and divide-by-zero.

