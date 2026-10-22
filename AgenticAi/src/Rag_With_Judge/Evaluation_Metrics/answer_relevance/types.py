from pydantic import BaseModel, ConfigDict, Field


class AnswerRelevanceevaluate(BaseModel):
    model_config = ConfigDict(strict=True, extra="forbid")

    explanation: str = Field(description="Explain your reasoning for the score")
    relevant: bool = Field(
        description="True if the answer addresses the question, False otherwise"
    )
