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
