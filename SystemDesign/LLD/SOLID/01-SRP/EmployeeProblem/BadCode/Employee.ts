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
