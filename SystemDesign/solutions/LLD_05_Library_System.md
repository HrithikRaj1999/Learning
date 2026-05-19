# LLD 05: Design a Library Management System

## 💡 Quick Summary

> **What**: A system managing books, members, borrowing/returning, fines, and reservations.  
> **Key Insight**: Classic OOP exercise. Key patterns: **State Pattern** for book copy states, **Observer** for notifications, and proper separation between Book (metadata) and BookCopy (physical item).

---

## 🏗️ Class Design

```mermaid
classDiagram
    class Library {
        -books: Map~ISBN, Book~
        -members: Map~id, Member~
        -loans: List~Loan~
        +searchByTitle(title): List~Book~
        +searchByAuthor(author): List~Book~
        +checkout(member, bookCopy): Loan
        +returnBook(loan): Fine?
    }
    
    class Book {
        -isbn: string
        -title: string
        -author: string
        -copies: List~BookCopy~
        +getAvailableCopies(): List~BookCopy~
    }
    
    class BookCopy {
        -id: string
        -book: Book
        -state: CopyState
    }
    
    class CopyState {
        <<enumeration>>
        AVAILABLE
        CHECKED_OUT
        RESERVED
        LOST
    }
    
    class Member {
        -id: string
        -name: string
        -activeLoans: List~Loan~
        -maxBooks: int
        +canBorrow(): boolean
    }
    
    class Loan {
        -id: string
        -member: Member
        -bookCopy: BookCopy
        -issueDate: Date
        -dueDate: Date
        -returnDate: Date?
        +isOverdue(): boolean
        +calculateFine(): float
    }
    
    class Reservation {
        -member: Member
        -book: Book
        -date: Date
    }

    Library --> Book
    Library --> Member
    Library --> Loan
    Book --> BookCopy
    BookCopy --> CopyState
    Loan --> BookCopy
    Loan --> Member
```

---

## 🔄 Book Copy State Machine

```mermaid
stateDiagram-v2
    [*] --> AVAILABLE: Book added to library
    AVAILABLE --> CHECKED_OUT: Member borrows
    AVAILABLE --> RESERVED: Member reserves
    RESERVED --> CHECKED_OUT: Reserved member picks up
    CHECKED_OUT --> AVAILABLE: Returned (no reservations)
    CHECKED_OUT --> RESERVED: Returned (someone waiting)
    CHECKED_OUT --> LOST: Reported lost
    LOST --> AVAILABLE: Found and returned
```

---

## 🔍 Checkout Flow

```mermaid
sequenceDiagram
    actor Member2 as Member
    participant Lib as Library
    participant Book2 as Book
    participant Copy as BookCopy

    Member2->>Lib: checkout("ISBN-123")
    Lib->>Lib: member.canBorrow()? (< max books, no overdue fines)
    Lib->>Book2: getAvailableCopies()
    Book2-->>Lib: [Copy #7 AVAILABLE]
    Lib->>Copy: setState(CHECKED_OUT)
    Lib->>Lib: Create Loan (due in 14 days)
    Lib-->>Member2: ✅ Loan created, due: Feb 1
```

---

## 💻 Core Implementation

```python
from datetime import date, timedelta
from enum import Enum

class CopyState(Enum):
    AVAILABLE = "available"
    CHECKED_OUT = "checked_out"
    RESERVED = "reserved"
    LOST = "lost"

class BookCopy:
    def __init__(self, copy_id, book):
        self.id = copy_id
        self.book = book
        self.state = CopyState.AVAILABLE

class Member:
    MAX_BOOKS = 5
    
    def __init__(self, member_id, name):
        self.id = member_id
        self.name = name
        self.active_loans = []
    
    def can_borrow(self):
        return len(self.active_loans) < self.MAX_BOOKS

class Loan:
    FINE_PER_DAY = 0.50
    LOAN_PERIOD = 14  # days
    
    def __init__(self, member, book_copy):
        self.member = member
        self.book_copy = book_copy
        self.issue_date = date.today()
        self.due_date = date.today() + timedelta(days=self.LOAN_PERIOD)
        self.return_date = None
    
    def is_overdue(self):
        check_date = self.return_date or date.today()
        return check_date > self.due_date
    
    def calculate_fine(self):
        if not self.is_overdue():
            return 0
        check_date = self.return_date or date.today()
        overdue_days = (check_date - self.due_date).days
        return overdue_days * self.FINE_PER_DAY

class Library:
    def checkout(self, member, isbn):
        if not member.can_borrow():
            raise Exception("Borrow limit reached or outstanding fines")
        
        book = self.books[isbn]
        available = [c for c in book.copies if c.state == CopyState.AVAILABLE]
        if not available:
            raise Exception("No copies available")
        
        copy = available[0]
        copy.state = CopyState.CHECKED_OUT
        loan = Loan(member, copy)
        member.active_loans.append(loan)
        self.loans.append(loan)
        return loan
    
    def return_book(self, loan):
        loan.return_date = date.today()
        loan.member.active_loans.remove(loan)
        fine = loan.calculate_fine()
        
        # Check if someone reserved this book
        reservation = self._find_reservation(loan.book_copy.book)
        if reservation:
            loan.book_copy.state = CopyState.RESERVED
            self._notify(reservation.member, "Your reserved book is ready!")
        else:
            loan.book_copy.state = CopyState.AVAILABLE
        
        return fine
```

---

## 🧩 Design Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **State** | BookCopy states | Valid transitions enforced; behavior per state |
| **Observer** | Reservation notifications | Notify member when reserved book returned |
| **Strategy** | Fine calculation | Different policies (student vs regular) |
| **Repository** | BookRepository, MemberRepository | Separate data access from business logic |
