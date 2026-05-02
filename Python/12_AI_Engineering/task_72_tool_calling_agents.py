"""
==============================================================================
  TASK 72: Tool Calling & AI Agents
==============================================================================

REAL-WORLD CONTEXT:
AI agents can USE TOOLS: call APIs, run calculations, search databases.
The LLM decides WHICH tool to use and WITH WHAT arguments.

SCENARIO: AI assistant has tools:
  - WeatherTool: get_weather(city="London") → {"temp": 15, "condition": "cloudy"}
  - CalculatorTool: calculate(a=5, b=3, operation="add") → {"result": 8}

How it works:
  1. User asks: "What's the weather in London?"
  2. LLM outputs: { tool: "weather", args: { city: "London" } }
  3. System validates args with Pydantic schema
  4. System calls tool handler with validated args
  5. Result sent back to LLM for final response

WHAT'S WRONG (without validation):
  LLM outputs: { city: "" } → empty string hits API → crash
  With Pydantic: validated BEFORE calling handler → clear error

EXPECTED BEHAVIOR:
  run_tool(weather_tool, {"city": "London"}) → {"temp": 15, ...}
  run_tool(weather_tool, {"city": ""}) → ValidationError (min_length=2)
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
    pass
