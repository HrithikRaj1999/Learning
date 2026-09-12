// =============================================================================
// WHAT IS WRONG — Dependency Inversion Principle (DIP) violation
// =============================================================================
// DIP rule: high-level policy should depend on ABSTRACTIONS, not on concrete
// low-level details. Here NotificationService (the policy "notify a user") does
// `new EmailSender()` and `new MySqlUserRepo()` inside itself — hard-wired to
// SMTP and MySQL.
//
// REAL SCENARIO: product wants SMS instead of email, or moves MySQL -> Postgres.
// You must edit NotificationService itself, even though its policy ("look up
// address, send message") didn't change. Worse, you CANNOT unit-test notify()
// without a real database and a real SMTP server, because it constructs them
// internally — no way to inject a fake.
//
// WHY BAD: the important high-level rule is chained to swappable infrastructure
// details. Every infra change ripples up; testing requires real I/O.
//
// HOW TO FIX (no code): depend on interfaces. Define MessageSender and
// UserRepository abstractions; NotificationService receives them via its
// constructor (dependency injection). Email/SMS senders and MySQL/Postgres repos
// are implementation details chosen at the composition root. Swapping or mocking
// = pass a different implementation, no edit to the service.
// =============================================================================
// ❌ DIP VIOLATION — "Dependency Inversion Principle"
// High-level modules should NOT depend on low-level modules.
// Both should depend on abstractions. Here high-level news up concretes directly.

// Low-level detail
class EmailSender {
  send(to: string, msg: string): void {
    console.log("SMTP -> " + to + ": " + msg);
  }
}

// Low-level detail
class MySqlUserRepo {
  findEmail(userId: string): string {
    console.log("SELECT email FROM users WHERE id=" + userId);
    return userId + "@corp.io";
  }
}

// High-level policy — but it is hard-wired to the concretes above.
export class NotificationService {
  private email = new EmailSender();       // ❌ new inside = tight coupling
  private repo = new MySqlUserRepo();      // ❌ cannot swap DB, cannot mock

  notify(userId: string, message: string): void {
    const to = this.repo.findEmail(userId);
    this.email.send(to, message);
  }
}

// Want SMS instead of email? Postgres instead of MySQL? Want to unit-test
// without a real DB/SMTP? Impossible without editing this class.
new NotificationService().notify("42", "Server is down");
