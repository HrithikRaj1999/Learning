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
