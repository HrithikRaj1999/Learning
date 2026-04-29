"""
================================================================
   TASK 58: SQLModel/SQLAlchemy and Alembic          ****
================================================================

Goal:
- Model database tables.
- Inject a per-request session.
- Use transactions correctly.
- Understand migrations with Alembic.

Setup:
  pip install sqlmodel alembic
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
    pass  # YOUR CODE HERE


@app.get("/todos", response_model=list[TodoRead])
def list_todos(session: SessionDep, completed: bool | None = None) -> list[Todo]:
    pass  # YOUR CODE HERE


@app.patch("/todos/{todo_id}", response_model=TodoRead)
def mark_todo(todo_id: int, completed: bool, session: SessionDep) -> Todo:
    raise HTTPException(status_code=404, detail="Not implemented")


# Interview drills:
# - What is a migration and why not rely on create_all in production?
# - How do indexes affect read speed and write cost?
# - Where can N+1 queries appear?

