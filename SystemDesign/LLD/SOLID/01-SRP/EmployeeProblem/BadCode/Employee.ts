// =============================================================================
// WHAT IS WRONG — Single Responsibility Principle (SRP) violation
// =============================================================================
// SRP rule: ONE reason to change per class. Employee has FOUR: payroll rules,
// DB persistence, email sending, and report formatting. Four different teams
// would all need to edit this same class.
//
// REAL SCENARIO: pay logic is duplicated — calculatePay() AND sendPayslip()
// each compute pay independently. Add overtime rules in one, forget the other,
// and the payslip now disagrees with the actual pay. That is exactly the drift
// SRP prevents. Also: the DB string hardcodes a password (secret leak) and the
// INSERT concatenates raw values (SQL-injection shape) — security concerns
// buried inside a "business" class nobody reviews for security.
//
// WHY BAD: one class, many axes of change = constant merge conflicts, untestable
// units (cannot test pay math without SMTP/DB), and logic drift between copies.
//
// HOW TO FIX (no code): separate concerns —
//   - Employee = data only.
//   - PayrollCalculator = the ONE source of truth for pay (overtime, tax).
//   - EmployeeRepository = persistence (parameterized queries, secret from env).
//   - PayslipMailer = email.
//   - ReportFormatter = html/csv/json output.
// Compose them; each changes for one reason only.
// =============================================================================
// ❌ SRP VIOLATION — "Single Responsibility Principle"
// A class should have ONE, and only one, reason to change.
// This class has FOUR reasons to change: business rules, DB schema,
// email provider, and report format. All glued into one blob.

export class Employee {
  constructor(
    public name: string,
    public email: string,
    public ratePerHour: number,
    public hoursWorked: number,
  ) {}

  // Reason to change #1: payroll/business rules
  calculatePay(): number {
    // bug: no overtime, no tax, magic numbers everywhere
    if (this.hoursWorked > 40) {
      return this.hoursWorked * this.ratePerHour; // overtime ignored
    }
    return this.hoursWorked * this.ratePerHour;
  }

  // Reason to change #2: database / persistence
  save(): void {
    const conn = "mysql://root:password@localhost:3306/hr"; // hardcoded secret + coupling
    console.log("Opening DB " + conn);
    console.log(`INSERT INTO employees VALUES ('${this.name}', '${this.email}')`); // SQL injection shape
    console.log("Closing DB");
  }

  // Reason to change #3: email / notifications
  sendPayslip(): void {
    console.log("Connecting to smtp.gmail.com:587");
    console.log("Sending payslip to " + this.email);
    // pay recomputed here too -> logic duplicated, can drift from calculatePay()
    const pay = this.hoursWorked * this.ratePerHour;
    console.log("Your pay is " + pay);
  }

  // Reason to change #4: reporting / presentation
  printReport(format: string): string {
    if (format === "html") {
      return "<h1>" + this.name + "</h1><p>Pay: " + this.calculatePay() + "</p>";
    } else if (format === "csv") {
      return this.name + "," + this.calculatePay();
    } else if (format === "json") {
      return JSON.stringify({ name: this.name, pay: this.calculatePay() });
    }
    return "";
  }
}

// Demo usage
const e = new Employee("Ada", "ada@corp.io", 50, 45);
e.save();
e.sendPayslip();
console.log(e.printReport("html"));
