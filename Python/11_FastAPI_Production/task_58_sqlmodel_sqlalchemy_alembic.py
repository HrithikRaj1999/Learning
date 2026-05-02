"""
==============================================================================
  TASK 58: SQLModel + SQLAlchemy + Alembic (Database Layer)
==============================================================================

REAL-WORLD CONTEXT:
SQLModel combines SQLAlchemy (ORM) + Pydantic (validation) in one class.
One model definition = database table + API validation + response schema.
Alembic handles migrations (alter tables without losing data in production).

SCENARIO: Build a Todo API with proper database layer:
  - SQLModel defines the table AND the API schemas
  - Session management via dependency injection
  - Migrations with Alembic (add columns without DROP TABLE)

WHY SQLModel OVER RAW SQLAlchemy:
  - Less boilerplate (one class instead of separate model + schema)
  - Pydantic validation built-in
  - FastAPI integration is seamless
  - Still uses SQLAlchemy under the hood (full power available)

EXPECTED BEHAVIOR:
  POST /todos {"title": "Buy milk"} → 201 {"id": 1, "title": "Buy milk", "completed": false}
  GET /todos → 200 [all todos from database]
  Data persists across server restarts (stored in SQLite/PostgreSQL)
"""

from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException
from sqlmodel import Field, Session, SQLModel, create_engine, select

class TodoBase(SQLModel):
    title: str = Field(min_length=1, max_length=120, index=True)
    completed: bool = False

class Todo(TodoBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

class TodoCreate(TodoBase):
    pass

class TodoRead(TodoBase):
    id: int

engine = create_engine("sqlite:///fastapi_todos.db", connect_args={"check_same_thread": False})

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]
app = FastAPI()

@app.on_event("startup")
def on_startup() -> None:
    SQLModel.metadata.create_all(engine)

@app.post("/todos", response_model=TodoRead)
def create_todo(payload: TodoCreate, session: SessionDep) -> Todo:
    pass

@app.get("/todos", response_model=list[TodoRead])
def list_todos(session: SessionDep, completed: bool | None = None) -> list[Todo]:
    pass

@app.patch("/todos/{todo_id}", response_model=TodoRead)
def mark_todo(todo_id: int, completed: bool, session: SessionDep) -> Todo:
    raise HTTPException(status_code=404, detail="Not implemented")
