# Lecture 4: Transactions and Consistency

- **Q56. What is a distributed transaction? Why is a cross-bank transfer difficult?**

  > - **Meaning**
  >   - One logical transaction changes data across multiple database sites.
  > - **Transfer of 10,000**
  >   - Bank A debits 10,000; Bank B credits 10,000.
  >     - Both changes must succeed together or be undone together.
  > - **Difficulty**
  >   - A bank or network can fail while the other bank continues.
  >     - A local commit cannot guarantee the remote bank completed its work.
  > - **Roles**
  >   - Participants perform local work.
  >   - The coordinator manages the shared commit decision.

- **Q57. Explain Two-Phase Commit (2PC), a NO vote, and coordinator failure.**

  > - **Phase 1: prepare and vote**
  >   - Coordinator asks every participant whether it can commit.
  >   - Each participant records prepared state, then votes YES or NO.
  >     - YES means ready, not independently committed.
  > - **Phase 2: one final decision**
  >   - All required votes YES: record and send COMMIT.
  >   - Any NO: record and send ABORT.
  >     - Majority voting is insufficient; every required participant must agree.
  > - **Coordinator failure after preparation**
  >   - Prepared participants may block while the decision is recovered.
  >     - A timeout alone cannot safely determine COMMIT or ABORT.
  > - **Decision flow**
  >   ```mermaid
  >   flowchart LR
  >       Prepare[Prepare] --> Votes{All YES?}
  >       Votes -->|Yes| Commit[Log COMMIT and notify]
  >       Votes -->|No| Abort[Log ABORT and notify]
  >   ```

- **Q61. Customers, orders, and products occupy different regions. Where should queries execute?**

  > - **Goal: reduce costly data movement**
  >   - Compare network transfer, result size, and available processing capacity.
  > - **Data shipping**
  >   - Move records to the machine executing the query.
  > - **Query shipping**
  >   - Move suitable operations toward the stored data.
  > - **Push work down**
  >   - Selection pushdown filters unwanted rows early.
  >   - Projection pushdown removes unnecessary columns early.
  >     - Ship reduced results instead of entire tables when semantics remain unchanged.
  > - **Execution flow**
  >   ```mermaid
  >   flowchart LR
  >       Local[Local tables] --> Filter[Filter rows]
  >       Filter --> Columns[Keep needed columns]
  >       Columns --> Move[Transfer smaller results]
  >       Move --> Join[Join and return]
  >   ```

- **Q62. Disconnected replicas hold 20 and 10. Should the older replica keep serving requests?**

  > - **Assumption**
  >   - Writing 20 completed before the new read begins; no later write occurred.
  > - **Require current data: wait or reject**
  >   - Returning 10 would violate the required fresh-read guarantee.
  >     - Use this caution for final payments and stock reservations.
  > - **Allow stale data: return 10 temporarily**
  >   - Availability continues, but immediate agreement is relaxed.
  >     - This can suit product browsing or recommendation counts.
  > - **Decision**
  >   - Choose according to the business cost of stale information.

- **Q63. Explain CAP. Why is "choose any two" incomplete?**

  > - **Consistency**
  >   - Reads behave as if one current copy serves operations in real-time order.
  > - **Availability**
  >   - Valid requests to working nodes receive successful responses.
  > - **Partition tolerance**
  >   - The system must handle network-separated groups of nodes.
  >     - Nodes may remain healthy while communication fails.
  > - **During a partition**
  >   - Cannot guarantee both full consistency and availability for affected operations.
  >     - The trade-off concerns partition-time behavior, not three freely interchangeable features.
  > - **Trade-off**
  >   ```mermaid
  >   flowchart TB
  >       Partition[Network partition] --> Need{Required behavior?}
  >       Need -->|Current result| Consistent[Coordinate or reject]
  >       Need -->|Always respond| Available[May return stale data]
  >   ```

- **Q64. Compare ACID and BASE. Which suits checkout and reviews?**

  > - **ACID: transaction guarantees**
  >   - Atomicity: all changes or none.
  >   - Consistency: preserve declared rules.
  >   - Isolation: control interference between simultaneous transactions.
  >   - Durability: committed changes persist.
  > - **BASE: availability-oriented approach**
  >   - Basically Available: aim to continue serving requests.
  >   - Soft state: background propagation can change stored state.
  >   - Eventual consistency: replicas converge after updates stop and communication succeeds.
  > - **Checkout**
  >   - Favor coordinated correctness for payments and final stock.
  > - **Reviews and feeds**
  >   - Temporary disagreement may be acceptable.
  >     - Choose guarantees per operation; SQL and NoSQL labels do not decide everything.

- **Q65. Replica A writes 20. When must other readers see it?**

  > - **Strong consistency**
  >   - Reads beginning after the completed write cannot return the older 10.
  >     - Assume no later update changes the value.
  > - **Eventual consistency**
  >   - Other replicas may return 10 temporarily.
  >     - They converge when writes stop and propagation succeeds.
  > - **Read-your-writes**
  >   - The writer's session sees its own completed update or a newer version.
  > - **Monotonic reads**
  >   - One session does not return to an older observed version.
  > - **Causal consistency**
  >   - Readers observe causes before their dependent effects.
  >     - A reply must not appear before the post it answers.