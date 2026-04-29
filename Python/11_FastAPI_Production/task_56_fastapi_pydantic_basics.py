"""
================================================================
   TASK 56: FastAPI and Pydantic Basics              ***
================================================================

Build a small Product API.

Concepts:
- path/query/body parameters
- request and response models
- validation with Field
- HTTPException and status codes
- OpenAPI docs

Run:
  fastapi dev task_56_fastapi_pydantic_basics.py
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
    pass  # YOUR CODE HERE


@app.get("/products", response_model=list[ProductRead])
def list_products(q: str | None = Query(default=None, min_length=2)) -> list[ProductRead]:
    """List products. If q is present, filter by case-insensitive name match."""
    pass  # YOUR CODE HERE


@app.get("/products/{product_id}", response_model=ProductRead)
def get_product(product_id: int) -> ProductRead:
    """Return 404 when the product does not exist."""
    raise HTTPException(status_code=404, detail="Not implemented")

