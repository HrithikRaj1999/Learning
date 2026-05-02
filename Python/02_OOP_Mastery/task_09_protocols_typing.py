"""
==============================================================================
  TASK 09: Protocols & Typing (Structural Subtyping)
==============================================================================

REAL-WORLD CONTEXT:
In Java/C#, you explicitly say `class Foo implements Bar`. In Python, you use
Protocols — if a class HAS the right methods, it satisfies the Protocol.
This is "duck typing" made type-safe.

SCENARIO: You're building a generic CRUD layer. Services need a "repository"
that can add, get, and list items. You don't want to force a specific base class.
Any class with the right methods should work (database, file, in-memory, API).

WHAT'S WRONG (without protocols):
  - Using ABCs forces inheritance (tight coupling)
  - No type checking on dict-based repos
  - mypy can't verify that your fake test repo matches the real interface

YOUR FIX:
  - Repository Protocol defines the contract (add, get, list)
  - InMemoryRepository implements it WITHOUT inheriting
  - mypy verifies structural compatibility at compile time

EXPECTED BEHAVIOR:
  repo: Repository[User, int] = InMemoryRepository()
  repo.add(User(id=1, name="Alice")) → User
  repo.get(1) → User | None
  repo.list() → [User(...)]
  # mypy passes — InMemoryRepository structurally matches Protocol
"""

from typing import Generic, Protocol, TypeVar

T = TypeVar("T")
Id = TypeVar("Id")


# PROTOCOL: Defines WHAT a repository must do (not HOW).
# Any class with these 3 methods satisfies it — no inheritance needed.
class Repository(Protocol[T, Id]):
    def add(self, item: T) -> T:
        ...

    def get(self, item_id: Id) -> T | None:
        ...

    def list(self) -> list[T]:
        ...


# YOUR FIX: Implement InMemoryRepository that satisfies the Protocol above.
# Store items in a dict. Return None for missing IDs.
class InMemoryRepository(Generic[T, Id]):
    pass


if __name__ == "__main__":
    print("Run static checks after implementing: mypy task_09_protocols_typing.py")
