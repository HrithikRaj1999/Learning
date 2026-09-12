// =============================================================================
// WHAT IS WRONG — Dependency Inversion Principle (DIP) violation
// =============================================================================
// DIP rule: high-level policy depends on abstractions, not concretes.
// ReportService news up a concrete CsvFormatter AND calls node's fs.writeFileSync
// directly — bolted to one output format and one storage medium (local disk).
//
// REAL SCENARIO: you need the report as JSON, or written to S3 instead of disk,
// or you want to test generate() without touching the filesystem. All three are
// impossible without editing ReportService, because the format and the sink are
// hardcoded. The fs call also makes the class untestable in CI (it really writes
// a file).
//
// WHY BAD: policy ("turn rows into a report and store it") is welded to CSV +
// local fs; every format/destination change edits this class; no test seam.
//
// HOW TO FIX (no code): depend on abstractions — a Formatter interface
// (CSV/JSON implementations) and a Storage/Writer interface (Disk/S3/InMemory).
// Inject both via the constructor. generate() formats then writes through the
// interfaces; tests inject an in-memory writer, prod injects S3 — no edits.
// =============================================================================
// ❌ DIP — ReportService directly depends on the concrete filesystem and a
// concrete CSV writer. Want S3 or in-memory for tests? Impossible.
import * as fs from "node:fs";

class CsvFormatter { format(rows: object[]) { return rows.map(r => Object.values(r).join(",")).join("\n"); } }

export class ReportService {
  private formatter = new CsvFormatter(); // ❌ concrete
  generate(rows: object[], path: string): void {
    const csv = this.formatter.format(rows);
    fs.writeFileSync(path, csv); // ❌ hard dependency on node fs -> untestable
  }
}
new ReportService().generate([{ a: 1 }], "/tmp/r.csv");
