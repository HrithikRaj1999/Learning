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
