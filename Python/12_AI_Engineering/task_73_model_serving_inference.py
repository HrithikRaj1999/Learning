"""
================================================================
   TASK 73: Model Serving and Inference Basics       ****
================================================================

Goal:
- Serve a simple local model behind a stable interface.
- Understand batching, latency, and warmup.
- Separate model loading from request handling.
"""

from typing import Protocol

from fastapi import FastAPI
from pydantic import BaseModel, Field


class Classifier(Protocol):
    def predict(self, text: str) -> str:
        ...


class KeywordClassifier:
    def predict(self, text: str) -> str:
        lowered = text.lower()
        if "error" in lowered or "failed" in lowered:
            return "bug"
        if "how do i" in lowered:
            return "question"
        return "other"


class PredictRequest(BaseModel):
    text: str = Field(min_length=1)


class PredictResponse(BaseModel):
    label: str


app = FastAPI()
model: Classifier = KeywordClassifier()


@app.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest) -> PredictResponse:
    return PredictResponse(label=model.predict(payload.text))


# Challenge:
# - Add batch prediction endpoint.
# - Add startup warmup.
# - Add latency logging.
# - Explain CPU vs GPU deployment tradeoffs.

