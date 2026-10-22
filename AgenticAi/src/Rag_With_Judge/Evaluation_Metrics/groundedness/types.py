from pydantic import BaseModel, ConfigDict, Field


class Groundednessevaluate(BaseModel):
    model_config = ConfigDict(strict=True, extra="forbid")

    explanation: str = Field(description="Explain your reasoning for the score")
    grounded: bool = Field(
        description="True if the answer is supported by the documents, False otherwise"
    )
