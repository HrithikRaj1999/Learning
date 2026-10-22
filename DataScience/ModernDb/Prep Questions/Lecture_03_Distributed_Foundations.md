# Lecture 3: Distributed Foundations

- **Q41. What is a distributed database? Why use one?**

  > - **Meaning**
  >   - One coordinated database stores data across networked machines called nodes.
  > - **Centralized system**
  >   - One main site simplifies administration.
  >     - Its failure can affect everyone; distant users experience more delay.
  > - **Distributed system**
  >   - Regional data placement reduces access delay.
  >   - Additional nodes increase storage and processing capacity.
  >   - Replicas improve resilience when another copy remains available.
  > - **Cost**
  >   - More network communication, coordination, and failure handling.

- **Q42. Show distributed architecture and explain distribution transparency.**

  > - **Global schema: the overall database structure**
  >   - Applications see a combined logical database.
  > - **Local schema: each site's structure**
  >   - Local managers handle their data and recovery.
  > - **Coordination**
  >   - Query processor plans work and combines results.
  >   - Transaction manager coordinates related changes.
  > - **Transparency: hide distribution details**
  >   - Location transparency hides where data resides.
  >   - Fragmentation transparency hides how data is divided.
  >   - Replication transparency hides duplicate copies.
  > - **Architecture**
  >   ```mermaid
  >   flowchart TB
  >       App[Application and global schema] --> Plan[Query and transaction coordination]
  >       Plan --> North[North: local database]
  >       Plan --> South[South: local database]
  >   ```

- **Q43. Differentiate the main distributed database architectures.**

  > - **Technology**
  >   - Homogeneous: sites use the same database technology.
  >   - Heterogeneous: sites integrate different database technologies.
  >     - Translation between models or query languages may be necessary.
  > - **Request roles**
  >   - Client-server: clients request services from database servers.
  >   - Peer-to-peer: nodes can both request and provide services.
  > - **Resource sharing**
  >   - Shared-nothing: each node owns its processor, memory, and storage.
  > - **Autonomy**
  >   - Federated: independent databases cooperate through an integrated view.

- **Q45. Compare horizontal, vertical, range, hash, and geographic partitioning.**

  > - **Partitioning: divide data into smaller parts**
  >   - A partition key determines record placement.
  > - **Horizontal: split rows**
  >   - Regional order tables contain different orders with the same columns.
  > - **Vertical: split columns**
  >   - Separate order details from financial fields.
  >     - Keep `order_id` in both parts; join on it to reconstruct records.
  > - **Row-placement choices**
  >   - Range: ordered intervals; suitable for date-range queries.
  >     - Recent ranges can become overloaded.
  >   - Hash: distribute using a key's hash; often balances records.
  >     - Date-range queries may need several partitions.
  >   - Geographic: place records by region for local access.
  > - **Combined choices**
  >   - Hybrid partitioning combines row and column splitting.
  >   - Sharding places partitions across separate database instances.
  >     - Partition pruning skips irrelevant partitions during a query.

- **Q47. Compare replication strategies and explain asynchronous failover risk.**

  > - **Replication: keep copies of the same data**
  >   - Partitioning divides data; replication duplicates it.
  > - **Write authority**
  >   - Leader-follower: one leader accepts writes; followers copy them.
  >   - Multi-leader: several leaders accept writes; conflicts need resolution.
  >   - Leaderless: requests coordinate with multiple replicas without one fixed leader.
  > - **Acknowledgment timing**
  >   - Synchronous: wait for required replicas before reporting success.
  >     - More delay, but stronger replication guarantees for acknowledged writes.
  >   - Asynchronous: acknowledge before all replicas finish copying.
  >     - Faster responses, but reads can be stale.
  > - **Failover risk**
  >   - Promoting a lagging follower may lose a recently acknowledged update.
  > - **Leader-follower flow**
  >   ```mermaid
  >   flowchart LR
  >       Write[Write request] --> Leader[Leader]
  >       Leader --> First[Follower 1]
  >       Leader --> Second[Follower 2]
  >   ```

- **Q49. For five replicas, compare read/write quorums of three versus two.**

  > - **Quorum: required number of participating replicas**
  >   - `N`: total replicas; `R`: read replicas; `W`: write acknowledgments.
  > - **Overlap condition: R + W > N**
  >   - For `N = 5`, `R = 3`, `W = 3`: `6 > 5`.
  >     - Every read set overlaps every completed write set.
  > - **Two plus two is insufficient**
  >   - For `R = 2`, `W = 2`: `4` does not exceed `5`.
  >     - Write to A and B; read from D and E.
  >     - Those reads can miss the write completely.
  > - **Meaning**
  >   - Overlap alone does not establish complete strong consistency.
  >     - Correct version selection and read/write coordination are also required.

- **Q50. How would you partition and replicate a global retail database?**

  > - **Partition for locality**
  >   - Place India, Europe, and United States users' orders in their respective regions.
  >   - Subdivide busy regions using customer identifiers.
  >     - Keep an order and its items together for local access.
  > - **Replicate for resilience**
  >   - Keep copies across independent permitted sites.
  >     - Copies within one failed site cannot protect against that site's outage.
  > - **Choose guarantees by workload**
  >   - Payments and final inventory require coordinated correctness.
  >   - Catalog browsing may tolerate temporarily stale copies.
  > - **Check workload balance**
  >   - A hot key receives disproportionate traffic.
  >     - Equal record counts do not guarantee equal request loads.
  > - **Trade-off**
  >   - Cross-region queries and transactions require extra network work.
  >     - For global daily reports, aggregate regionally and combine the smaller summaries.