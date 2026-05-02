"""
==============================================================================
  TASK 56: FastAPI & Pydantic Basics
==============================================================================

REAL-WORLD CONTEXT:
FastAPI is the MODERN Python web framework. Why companies switch to it:
  - Automatic API docs (Swagger UI generated from your code)
  - Type safety via Pydantic (invalid data rejected BEFORE your code runs)
  - Async support (handles 10x more requests than Flask)
  - Used by: Netflix, Uber, Microsoft

SCENARIO: Build a Product API with proper validation:
  - Pydantic models define EXACTLY what data looks like
  - Invalid data (negative price, empty name) rejected with clear errors
  - Response models ensure you never accidentally leak internal fields
  - Automatic OpenAPI docs at /docs

WHAT'S WRONG (without Pydantic):
  price = request.json["price"]  # could be "abc", -5, or missing entirely
  # No validation → garbage in database → broken frontend → angry users

WITH PYDANTIC:
  price: Decimal = Field(gt=0)  # MUST be positive decimal, enforced automatically
  # Invalid request → 422 with clear error message → frontend shows it

EXPECTED BEHAVIOR:
  POST /products {"name":"Widget","price":9.99,"stock":100} → 201 {"id":1,...}
  POST /products {"name":"","price":-5} → 422 validation error (min_length, gt=0)
  GET /products?q=widget → 200 [filtered products]
"""

from decimal import Decimal

from fastapi import FastAPI, HTTPException, Query, status
from pydantic import BaseModel, Field

app = FastAPI(title="Product API", version="1.0.0")

class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    price: Decimal = Field(gt=0)
    stock: int = Field(ge=0)
    tags: list[str] = Field(default_factory=list)

class ProductRead(ProductCreate):
    id: int

PRODUCTS: dict[int, ProductRead] = {}

@app.post("/products", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
def create_product(payload: ProductCreate) -> ProductRead:
    """Create a product and return the response model."""
    pass

@app.get("/products", response_model=list[ProductRead])
def list_products(q: str | None = Query(default=None, min_length=2)) -> list[ProductRead]:
    """List products. If q is present, filter by case-insensitive name match."""
    pass

@app.get("/products/{product_id}", response_model=ProductRead)
def get_product(product_id: int) -> ProductRead:
    """Return 404 when the product does not exist."""
    raise HTTPException(status_code=404, detail="Not implemented")
