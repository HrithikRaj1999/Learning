// =============================================================================
// WHAT IS WRONG — Interface Segregation Principle (ISP) violation
// =============================================================================
// ISP rule: no client should depend on methods it doesn't use. IWorker bundles
// a work concern with human-only concerns (eat/sleep/takeBreak). A robot can
// work but has no concept of eating — yet it's forced to implement those.
//
// REAL SCENARIO: RobotWorker throws on eat/sleep/takeBreak. A scheduler that
// iterates IWorker[] calling takeBreak() (e.g. enforcing labor rules) crashes
// when it hits a robot. The interface conflates "thing that does work" with
// "human with biological needs," so the two can't share code cleanly.
//
// WHY BAD: unrelated concerns (labor vs biology) are welded into one interface;
// robots carry meaningless throwing stubs; callers can't trust the contract.
//
// HOW TO FIX (no code): segregate — Workable (work) is the shared role;
// Human-specific behaviors go in a separate interface (e.g. Feedable/Restable)
// implemented only by HumanWorker. Schedulers that only need work depend on
// Workable; both humans and robots qualify, robots without fake stubs.
// =============================================================================
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
