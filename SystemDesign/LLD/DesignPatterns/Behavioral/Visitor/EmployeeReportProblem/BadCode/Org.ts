// =============================================================================
// WHAT IS WRONG — missing Visitor pattern
// =============================================================================
// PATTERN IDEA: a Visitor holds one operation across all element types; elements
// accept a visitor and dispatch. New operation = new visitor, elements untouched.
//
// WHAT'S WRONG HERE: annualCost() is an instanceof ladder over Engineer/Manager/
// Contractor, and bonus()/taxReport() each duplicate the same ladder. Every
// metric re-branches over the role types.
//
// REAL SCENARIO: add a "vacationDays" or "equityValue" report — another ladder.
// Add a new role (Intern) — you must edit EVERY metric function and a missed one
// throws "unknown role" at runtime. The per-role math for one metric is spread
// across ladders, not grouped.
//
// WHY BAD: each metric duplicates role dispatch; adding a role edits every metric;
// missing a case is a runtime error.
//
// HOW TO FIX (no code): define a Visitor with visitEngineer/visitManager/
// visitContractor; each role has accept(visitor). AnnualCostVisitor, BonusVisitor,
// etc. implement the interface. New metric = a new visitor; the compiler enforces
// that every role is handled. (Choose Visitor when metrics change more often than
// roles.)
// =============================================================================
// ❌ NO VISITOR — computing different metrics over org node types uses repeated
// type checks. salary, headcount, bonus each re-branch.
export class Engineer { constructor(public salary: number) {} }
export class Manager { constructor(public salary: number, public teamSize: number) {} }
export class Contractor { constructor(public hourly: number, public hours: number) {} }

export function annualCost(node: any): number {
  if (node instanceof Engineer) return node.salary;
  if (node instanceof Manager) return node.salary + node.teamSize * 1000; // mgmt overhead
  if (node instanceof Contractor) return node.hourly * node.hours;
  throw new Error("unknown role"); // bonus()/taxReport() duplicate the ladder
}
console.log(annualCost(new Manager(120000, 5)));
