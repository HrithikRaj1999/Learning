from pydantic import BaseModel, ConfigDict, Field


class DocumentRelevanceevaluate(BaseModel):
    model_config = ConfigDict(strict=True, extra="forbid")

    explanation: str = Field(description="Explain your reasoning for the score")
    relevant: bool = Field(
        description="True if the documents are related to the question, False otherwise"
    )
