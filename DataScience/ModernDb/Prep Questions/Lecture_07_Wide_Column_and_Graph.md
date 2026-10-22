# Lecture 7: Wide-Column and Graph Databases

- **Q86. What are wide-column storage, column families, and sparse data?**

  > - **Wide-column model**
  >   - Organizes data around keys and related column groups.
  >     - Cassandra and Bigtable support distributed, large-scale access.
  > - **Column family**
  >   - Groups values commonly accessed together.
  > - **Sparse data**
  >   - Some records omit values that other records contain.
  >     - A temperature sensor may have no humidity measurement.
  > - **Benefit**
  >   - Supports varied measurements without requiring every record to contain every value.
  > - **Product distinction**
  >   - Cassandra still declares table columns; flexibility depends on the database.

- **Q88. Why start with queries? Explain partition keys, clustering keys, and oversized partitions.**

  > - **Query-first design**
  >   - Choose the required reads before deciding the table's keys.
  >     - Different access patterns may require separate query-specific tables.
  > - **Partition key: choose the data group**
  >   - `(sensor_id, day)` groups one sensor's readings for one day.
  > - **Clustering key: order rows within that partition**
  >   - `reading_time` supports ordered time-range retrieval.
  > - **Oversized partition risk**
  >   - Too many rows overload storage, reads, compaction, and recovery.
  >     - Time buckets limit growth; select their size using event volume.
  > - **Read path**
  >   ```mermaid
  >   flowchart LR
  >       Query[Sensor and day] --> Partition[One partition]
  >       Partition --> Time[Ordered reading times]
  >       Time --> Slice[Requested time range]
  >   ```

- **Q89. Write a Cassandra table and retrieve one sensor's bounded time range.**

  > - **Cassandra Query Language (CQL)**
  >   - Define a table for sensor-and-day queries.
  >   ```cql
  >   CREATE TABLE readings_by_sensor_day (
  >       sensor_id text,
  >       day date,
  >       reading_time timestamp,
  >       temperature double,
  >       humidity double,
  >       PRIMARY KEY ((sensor_id, day), reading_time)
  >   );
  >   ```
  > - **Retrieve readings from 09:00 inclusive to 10:00 exclusive**
  >   ```cql
  >   SELECT reading_time, temperature, humidity
  >   FROM readings_by_sensor_day
  >   WHERE sensor_id = 'S1007'
  >     AND day = '2026-09-04'
  >     AND reading_time >= '2026-09-04 09:00:00'
  >     AND reading_time < '2026-09-04 10:00:00';
  >   ```
  > - **Why efficient?**
  >   - The complete partition key locates the relevant group.
  >   - The clustering restriction reads an ordered slice.
  >     - No cluster-wide search is needed for this access pattern.

- **Q91. Define nodes, relationships, properties, and traversal in a property graph.**

  > - **Node: an entity**
  >   - Student, Course, and Book become nodes.
  > - **Relationship: a connection**
  >   - Student `ENROLLED_IN` Course; Course `USES` Book.
  > - **Property: a fact about a node or relationship**
  >   - Student name belongs to the student node.
  >   - Enrollment semester belongs to the enrollment relationship.
  > - **Traversal: follow relationships**
  >   - Student to Course to Book takes two hops.
  >     - A hop is one relationship step.
  > - **Learning network**
  >   ```mermaid
  >   flowchart LR
  >       Student[Asha: Student S101] -->|ENROLLED_IN: Fall| Course[Course DB101]
  >       Course -->|USES| Book[Database System Concepts]
  >   ```

- **Q93. Find products reviewed by customer C101's friends using Cypher.**

  > - **Cypher: graph pattern-matching language**
  >   - Start at the customer, follow friends, then their reviews and products.
  >   ```cypher
  >   MATCH (customer:Customer)-[:FRIEND_OF]->(friend:Customer)
  >   MATCH (friend)-[:WROTE]->(:Review)-[:REVIEWS]->(product:Product)
  >   WHERE customer.id = 'C101'
  >   RETURN product.name, count(*) AS friendSignals
  >   ORDER BY friendSignals DESC;
  >   ```
  > - **Result**
  >   - Product names are grouped and ordered by matching review-path counts.
  >     - `friendSignals` counts matching paths, not necessarily distinct friends.
  > - **Meaning**
  >   - More matching friend reviews give a stronger recommendation signal.

- **Q94. How does graph traversal differ from relational joins?**

  > - **Relational approach**
  >   - Store entities and connections in tables.
  >   - Join matching keys to reconstruct paths.
  > - **Graph approach**
  >   - Store relationships directly between nodes.
  >   - Express multi-hop paths using relationship patterns.
  >     - Useful for recommendations, fraud connections, and dependencies.
  > - **Performance condition**
  >   - Starting-node indexes, traversal depth, and connection counts matter.
  >     - Unbounded traversal can become expensive; graph does not mean automatically faster.

- **Q95. Choose databases for campus registrations, gate events, friendships, receipts, and recommendations.**

  > - **Registrations and payment receipts: relational database**
  >   - Require constraints, valid relationships, and transaction correctness.
  > - **Entry-gate events: wide-column database**
  >   - High-volume events fit partitioned, time-ordered reads.
  >     - Choose keys matching gate, date, and required time windows.
  > - **Clubs and friendships: graph database**
  >   - Connected students and memberships fit relationship traversal.
  > - **Elective recommendation paths: graph database**
  >   - Follow relevant student, course, and relationship paths.
  > - **Decision**
  >   - Choose by access pattern and correctness risk, not product popularity.