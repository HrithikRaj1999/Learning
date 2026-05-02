"""
==============================================================================
  TASK 73: Model Serving & Inference API
==============================================================================

REAL-WORLD CONTEXT:
You trained a model. Now serve it as an API so other services can use it.
This is how ML models get into production:
  - POST /predict {"text": "error in deployment"} → {"label": "bug"}
  - Model loaded ONCE at startup (not per-request)
  - Protocol pattern: swap KeywordClassifier for real ML model later

SCENARIO: Build a model serving API:
  - KeywordClassifier: simple rule-based model (works without GPU)
  - Protocol: any class with predict(text) → str works
  - FastAPI endpoint: validates input, calls model, returns prediction

WHY PROTOCOL PATTERN:
  During development: KeywordClassifier (fast, no dependencies)
  In production: TransformerClassifier (real ML model, requires PyTorch)
  Same API, same tests, different model — just swap the implementation.

EXPECTED BEHAVIOR:
  POST /predict {"text": "error in deployment"} → 200 {"label": "bug"}
  POST /predict {"text": "how do i reset?"} → 200 {"label": "question"}
  POST /predict {"text": ""} → 422 validation error (min_length=1)
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
