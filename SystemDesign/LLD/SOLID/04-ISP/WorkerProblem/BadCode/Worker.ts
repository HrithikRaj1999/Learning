// ❌ ISP — IWorker bundles human + machine concerns. A RobotWorker is forced to
// implement eat()/sleep()/takeBreak() it has no concept of.
export interface IWorker {
  work(): string;
  eat(): string;
  sleep(): string;
  takeBreak(): string;
}
export class HumanWorker implements IWorker {
  work() { return "coding"; }
  eat() { return "lunch"; }
  sleep() { return "zzz"; }
  takeBreak() { return "coffee"; }
}
export class RobotWorker implements IWorker {
  work() { return "welding"; }
  // forced, meaningless stubs that throw -> callers can't trust the interface
  eat() { throw new Error("robots don't eat"); }
  sleep() { throw new Error("robots don't sleep"); }
  takeBreak() { throw new Error("robots don't break"); }
}
