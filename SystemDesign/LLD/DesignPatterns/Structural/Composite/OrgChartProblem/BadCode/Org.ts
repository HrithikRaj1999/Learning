// =============================================================================
// WHAT IS WRONG — missing Composite pattern
// =============================================================================
// PATTERN IDEA: Composite treats leaves (Employee) and groups (Manager with
// reports) uniformly via one interface; each node computes its own roll-up.
//
// WHAT'S WRONG HERE: totalSalary() does instanceof Employee vs Manager and owns the
// recursion. The client walks the org tree itself.
//
// REAL SCENARIO: every roll-up (total salary, headcount, max depth, find) repeats
// the same Employee/Manager branching and recursion. Add a "Contractor" or
// "Team" node and you edit every roll-up; a missed case throws. The hierarchy shape
// leaks into all reporting code.
//
// WHY BAD: type checks and recursion duplicated across every roll-up; new node
// types break callers; clients coupled to the org structure.
//
// HOW TO FIX (no code): an OrgNode interface with totalSalary()/headcount();
// Employee returns its own, Manager sums itself plus its reports' values (recursing
// internally). Clients call node.totalSalary() with no instanceof. New node type =
// a new class.
// =============================================================================
// ❌ NO COMPOSITE — org tree handled with instanceof + client-owned recursion.
// Headcount/salary roll-ups re-implement the same branching every time.
export class Employee { constructor(public name: string, public salary: number) {} }
export class Manager { constructor(public name: string, public salary: number, public reports: any[] = []) {} }

export function totalSalary(node: any): number {
  if (node instanceof Employee) return node.salary;
  if (node instanceof Manager) {
    let sum = node.salary;
    for (const r of node.reports) sum += totalSalary(r); // client owns recursion
    return sum;
  }
  throw new Error("unknown");
}
const ceo = new Manager("CEO", 500, [new Employee("Dev", 100), new Manager("Lead", 200, [new Employee("Junior", 80)])]);
console.log(totalSalary(ceo));
