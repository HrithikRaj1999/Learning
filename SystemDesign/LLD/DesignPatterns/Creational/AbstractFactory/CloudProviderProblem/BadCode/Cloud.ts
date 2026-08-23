// =============================================================================
// WHAT IS WRONG — missing Abstract Factory pattern
// =============================================================================
// PATTERN IDEA: an Abstract Factory creates a whole FAMILY of related objects
// that must match (all-AWS or all-GCP). You pick the factory once; it guarantees
// every product comes from the same family.
//
// WHAT'S WRONG HERE: provision() picks compute with an if but hardcodes S3 for
// storage. Nothing ties compute and storage to the same provider — you get GCE
// compute with AWS S3 storage.
//
// REAL SCENARIO: this is a real, expensive bug — cross-cloud data egress fees and
// latency, plus the family mismatch only shows up in production. Each new resource
// type (network, DB) adds more scattered provider ifs that can drift out of sync.
//
// WHY BAD: family consistency is unenforced; provider selection is duplicated and
// can mismatch; adding resource types multiplies the branching.
//
// HOW TO FIX (no code): define a CloudFactory interface with createCompute() and
// createStorage(); AwsFactory and GcpFactory implement it returning matching
// products. provision() picks ONE factory and calls it — every resource is
// guaranteed same-provider. New provider = a new factory.
// =============================================================================
// ❌ NO ABSTRACT FACTORY — cloud resources (compute + storage) created with
// provider if/else everywhere; easy to provision AWS compute + GCP storage.
class Ec2 { launch() { return "EC2 up"; } }
class S3 { put() { return "S3 put"; } }
class GceVm { launch() { return "GCE up"; } }
class GcsBucket { put() { return "GCS put"; } }

export function provision(cloud: string) {
  const compute = cloud === "aws" ? new Ec2() : new GceVm();
  const storage = new S3(); // 🐛 always S3 even on GCP -> cross-cloud mess + egress fees
  return compute.launch() + " + " + storage.put();
}
console.log(provision("gcp"));
