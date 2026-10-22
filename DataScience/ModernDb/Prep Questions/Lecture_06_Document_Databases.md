# Lecture 6: Document Databases

- **Q81. Compare documents, rows, collections, JSON, and BSON.**

  > - **Document: fields, nested objects, and arrays**
  >   - Related information can form one record read together.
  >     - An aggregate means data commonly read and updated together.
  > - **Relational row: values in declared columns**
  >   - Related entities usually connect through keys and joins.
  > - **Collection: group of related documents**
  >   - MongoDB's `_id` identifies each document within its collection.
  > - **JavaScript Object Notation (JSON)**
  >   - Human-readable text containing named fields and values.
  > - **Binary JSON (BSON)**
  >   - Binary representation with additional types, including dates and ObjectId.
  >     - BSON is not simply compressed JSON.

- **Q82. Why does schema-less not mean no schema? When should catalogs remain relational?**

  > - **Flexible structure**
  >   - Documents can have different optional fields.
  >     - Laptop specifications differ from clothing specifications.
  > - **Rules still matter**
  >   - Keep common field names and types consistent.
  >   - Validate required identifiers and acceptable prices.
  >     - Numeric `59999` and text `"59999"` are different types.
  > - **Choose documents when**
  >   - Products have varied attributes and are usually retrieved as complete objects.
  > - **Keep a Relational Database Management System (RDBMS) when**
  >   - Strong relationships, complex joins, and multi-record transaction rules dominate.

- **Q83. When should data be embedded or referenced? Design a course-content portal.**

  > - **Embed: store related data inside its parent**
  >   - Suitable when small, bounded data belongs to one parent.
  >     - Embed article comments only when limited and commonly read with the article.
  > - **Reference: store another document's identifier**
  >   - Suitable for shared, independently updated, or continually growing data.
  >     - Separate large comment histories instead of growing one document indefinitely.
  > - **Course document**
  >   - Embed course title and module summaries.
  >   - Reference instructor profiles and detailed lesson or video records.
  > - **Separate collections**
  >   - Comments and quiz attempts can grow independently.
  >     - Attempts also require explicit correctness and transaction rules.
  >   - Index lesson lookup fields; use text indexing for lesson search.
  > - **Portal model**
  >   ```mermaid
  >   flowchart TB
  >       Course[Course and module summaries] --> Instructor[Instructor reference]
  >       Course --> Lessons[Lesson and video records]
  >       Course --> Comments[Separate comments]
  >       Course --> Attempts[Separate quiz attempts]
  >   ```

- **Q84. Insert and query a product; update an article; count products by category.**

  > - **Insert a nested product document**
  >   ```javascript
  >   db.products.insertOne({
  >     sku: "LAP-1001",
  >     category: "Laptop",
  >     price: 59999,
  >     specs: { ram: "16 GB" },
  >     variants: [{ color: "Silver", stock: 12 }]
  >   });
  >   ```
  > - **Filter fields; project only listing details**
  >   - Dot notation accesses the nested `specs.ram` field.
  >   ```javascript
  >   db.products.find(
  >     { category: "Laptop", "specs.ram": "16 GB" },
  >     { _id: 0, sku: 1, price: 1 }
  >   );
  >   ```
  > - **Update an existing article**
  >   - `$set` assigns a field; `$inc` increases a numeric field.
  >   ```javascript
  >   db.articles.updateOne(
  >     { slug: "why-nosql" },
  >     { $set: { status: "published" }, $inc: { views: 1 } }
  >   );
  >   ```
  > - **Aggregate: transform documents into a summary**
  >   - `$group` counts products per category; `$sort` places larger counts first.
  >   ```javascript
  >   db.products.aggregate([
  >     { $group: { _id: "$category", count: { $sum: 1 } } },
  >     { $sort: { count: -1 } }
  >   ]);
  >   ```

- **Q85. Why do indexes improve reads but slow writes?**

  > - **Index: an additional lookup structure**
  >   - Helps find matching documents without scanning every document.
  > - **Match common queries**
  >   - A single-field index supports one field.
  >   - A compound index combines fields in a useful order.
  >     - Category and price can support catalog filtering and sorting.
  > - **Write cost**
  >   - Inserts, updates, and deletes must maintain affected indexes.
  >     - Extra indexes also consume storage.
  > - **Decision**
  >   - Index frequent filters and sorts; avoid indexing every field automatically.