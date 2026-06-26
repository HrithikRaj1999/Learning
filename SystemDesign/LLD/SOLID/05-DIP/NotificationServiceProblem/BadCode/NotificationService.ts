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
