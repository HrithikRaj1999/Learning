# Abstract Factory — Cloud Provider Problem — Fix Hints
> One provider = one factory = one consistent resource family.
## Wrong now
`provision` picks compute by provider but hardcodes S3 storage → AWS storage on
GCP compute (cross-cloud latency + egress cost). Real infra footgun.
## Hints
- [ ] Product interfaces: `Compute`, `Storage`.
- [ ] `CloudFactory`: `createCompute()`, `createStorage()`.
- [ ] `AwsFactory` (EC2+S3), `GcpFactory` (GCE+GCS) return matched families.
- [ ] Select factory once from config; pass it everywhere.
## Done-when
- [ ] Can't provision compute and storage from different clouds by accident.
