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
