// =============================================================================
// WHAT IS WRONG — Interface Segregation Principle (ISP) violation
// =============================================================================
// ISP rule: no client should be forced to depend on methods it doesn't use.
// IMultiFunctionDevice bundles print + scan + fax + staple. A cheap printer can
// only print, yet is forced to implement scan/fax/staple.
//
// REAL SCENARIO: CheapPrinter throws on scan/fax/staple. Code that accepts an
// IMultiFunctionDevice will happily call scan() on it and crash at runtime. The
// interface promises four capabilities the object doesn't have — a lie that
// pushes failure to runtime and forces callers into instanceof/try-catch.
//
// WHY BAD: fat interface couples capabilities that don't co-occur; simple
// devices carry throwing stubs; the contract can't be trusted.
//
// HOW TO FIX (no code): segregate into role interfaces — Printer (print),
// Scanner (scan), Fax (fax), Stapler (staple). OfficeAllInOne implements all
// four; CheapPrinter implements only Printer. A function that just prints asks
// for a Printer, so a non-scanning device can never reach a scan() call.
// =============================================================================
// ❌ ISP VIOLATION — "Interface Segregation Principle"
// No client should be forced to depend on methods it does not use.
// One fat interface forces simple devices to stub out functions they lack.

export interface IMultiFunctionDevice {
  print(doc: string): void;
  scan(doc: string): void;
  fax(doc: string): void;
  staple(doc: string): void;
}

// A fancy office machine: fine, it does everything.
export class OfficeAllInOne implements IMultiFunctionDevice {
  print(doc: string) { console.log("printing " + doc); }
  scan(doc: string) { console.log("scanning " + doc); }
  fax(doc: string) { console.log("faxing " + doc); }
  staple(doc: string) { console.log("stapling " + doc); }
}

// A cheap printer: forced to implement scan/fax/staple it cannot do.
export class CheapPrinter implements IMultiFunctionDevice {
  print(doc: string) { console.log("printing " + doc); }
  // Forced stubs -> lying about capability, surprises callers (also LSP-ish)
  scan(_doc: string) { throw new Error("not supported"); }
  fax(_doc: string) { throw new Error("not supported"); }
  staple(_doc: string) { throw new Error("not supported"); }
}
