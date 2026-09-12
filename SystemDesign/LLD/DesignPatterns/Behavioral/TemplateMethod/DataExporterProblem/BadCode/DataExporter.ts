// =============================================================================
// WHAT IS WRONG — missing Template Method pattern
// =============================================================================
// PATTERN IDEA: the base class defines the fixed algorithm skeleton; subclasses
// override only the step that varies.
//
// WHAT'S WRONG HERE: CsvExporter and JsonExporter both repeat open-connection,
// validate-rows, close-connection and differ ONLY in how they build the body.
// The whole surrounding flow is duplicated.
//
// REAL SCENARIO: you add error handling, or change "validate rows" to also check
// permissions, or fix a connection-leak in the close step. You must edit both
// exporters (and any future XmlExporter) identically. Miss one and that format
// leaks connections or skips validation — a real correctness/resource bug.
//
// WHY BAD: the shared export pipeline is copy-pasted around the one varying line;
// fixes must be applied to every copy and drift.
//
// HOW TO FIX (no code): an Exporter base defines export() with the fixed steps
// (open/validate/close), calling an abstract buildBody(rows) hook. CsvExporter and
// JsonExporter override only buildBody(). The shared flow lives in one place.
// =============================================================================
// ❌ NO TEMPLATE METHOD — the same algorithm skeleton is copy-pasted across
// classes; only one step differs. Fix the shared flow => edit every copy.

export class CsvExporter {
  export(rows: object[]): string {
    console.log("open connection");        // duplicated
    console.log("validate rows");          // duplicated
    const body = rows.map(r => Object.values(r).join(",")).join("\n"); // the only real diff
    console.log("close connection");       // duplicated
    return body;
  }
}
export class JsonExporter {
  export(rows: object[]): string {
    console.log("open connection");        // duplicated
    console.log("validate rows");          // duplicated
    const body = JSON.stringify(rows);     // the only real diff
    console.log("close connection");       // duplicated
    return body;
  }
}
console.log(new CsvExporter().export([{ a: 1 }]));
