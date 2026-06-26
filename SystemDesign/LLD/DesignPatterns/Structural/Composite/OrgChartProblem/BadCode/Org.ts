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
