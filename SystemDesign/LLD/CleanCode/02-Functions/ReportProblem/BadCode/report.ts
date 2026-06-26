// ❌ BAD FUNCTION — fetches, filters, aggregates, formats, AND prints in one.
export function generateSalesReport(orders: any[]): void {
  // filter
  const recent = orders.filter((o) => o.date > "2024-01-01");
  // aggregate
  let total = 0; const byRegion: any = {};
  for (const o of recent) { total += o.amount; byRegion[o.region] = (byRegion[o.region] || 0) + o.amount; }
  // format + print mixed together
  console.log("=== SALES ==="); 
  console.log("Total: " + total);
  for (const r in byRegion) console.log(r + ": " + byRegion[r]);
}
