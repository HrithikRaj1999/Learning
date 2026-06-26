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
