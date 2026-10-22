from pydantic import BaseModel, ConfigDict, Field


class Correctnessevaluate(BaseModel):
    model_config = ConfigDict(strict=True, extra="forbid")

    explanation: str = Field(description="Explain your reasoning for the score")
    correct: bool = Field(description="True if the answer is correct, False otherwise")
