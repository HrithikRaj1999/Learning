// ❌ NO PROXY — no throttling around an expensive service. A hot loop can hammer
// it and blow quota; rate-limit logic would otherwise be copy-pasted at callers.
export class ExpensiveService {
  run(job: string): string {
    console.log("running costly job: " + job);
    return "done " + job;
  }
}
const svc = new ExpensiveService();
for (let i = 0; i < 5; i++) svc.run("job" + i); // no limit -> quota blown
