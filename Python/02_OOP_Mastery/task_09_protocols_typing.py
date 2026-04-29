"""
================================================================
   TASK 9: Type Hints, Protocols, and Generics        ****
================================================================

Interview focus:
- Use typing to make code easier to change.
- Understand duck typing with Protocol.
- Use generics for reusable repositories.
"""

from typing import Generic, Protocol, TypeVar


T = TypeVar("T")
Id = TypeVar("Id")


class Repository(Protocol[T, Id]):
    def add(self, item: T) -> T:
        ...

    def get(self, item_id: Id) -> T | None:
        ...

    def list(self) -> list[T]:
        ...


# ----- Challenge 9.1 -----
# Implement an InMemoryRepository[T, Id].
# It should accept an id_getter callable in __init__.


class InMemoryRepository(Generic[T, Id]):
    pass  # YOUR CODE HERE


# ----- Challenge 9.2 -----
# Define a User dataclass and use InMemoryRepository[User, int].
# Add tests that mypy/pyright would understand from the annotations.


# YOUR CODE HERE


if __name__ == "__main__":
    print("Run static checks after implementing: mypy task_09_protocols_typing.py")

