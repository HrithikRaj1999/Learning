# Lecture 2: SQL and Transactions

- **Q16. Differentiate DDL, DML, and DQL.**

  > - **Structured Query Language (SQL)**
  >   - Defines, changes, and retrieves relational data.
  > - **Data Definition Language (DDL): structure**
  >   - `CREATE`, `ALTER`, `DROP`.
  >     - Adding a column changes the schema.
  > - **Data Manipulation Language (DML): rows**
  >   - `INSERT`, `UPDATE`, `DELETE`.
  >     - Changing a product price changes stored data.
  > - **Data Query Language (DQL): retrieval**
  >   - `SELECT` retrieves matching data.

- **Q17. Why should a primary key remain stable?**

  > - **Stable identity**
  >   - The identifier should continue naming the same record.
  > - **Stable relationships**
  >   - Foreign keys depend on that identifier.
  >     - Changing customer email should not require changing every order reference.
  > - **Suitable choice**
  >   - Use `customer_id` for identity; keep changeable details in separate fields.

- **Q18. Design retail-table keys, constraints, and data-loading order.**

  > - **Primary keys**
  >   - Customers: `customer_id`; products: `product_id`; orders: `order_id`.
  >   - Order items: `(order_id, product_id)`; payments: `payment_id`.
  > - **Foreign keys**
  >   - Orders reference customers; order items reference orders and products.
  >   - Payments reference orders.
  >     - Make `payments.order_id` unique for at most one payment per order.
  > - **Order-item definition**
  >   ```sql
  >   CREATE TABLE order_items (
  >       order_id INTEGER REFERENCES orders(order_id),
  >       product_id INTEGER REFERENCES products(product_id),
  >       quantity INTEGER NOT NULL CHECK (quantity > 0),
  >       unit_price DECIMAL(12,2) NOT NULL CHECK (unit_price >= 0),
  >       PRIMARY KEY (order_id, product_id)
  >   );
  >   ```
  > - **Loading order**
  >   - Insert customers and products before dependent rows.
  >     - Minimum: four customers, six products, three categories, six orders, ten items.
  >   - Verify row counts, unique keys, and valid references.
  >   ```mermaid
  >   flowchart LR
  >       Customers[Customers] --> Orders[Orders]
  >       Products[Products] --> Items[Order items]
  >       Orders --> Items
  >       Orders --> Payments[Payments]
  >   ```

- **Q20. What happens when UPDATE omits WHERE?**

  > - **Effect**
  >   - Every row in the target table can change.
  > - **Restrict the update**
  >   - Match the required product identifier.
  >     - Confirm the selected row before updating.
  >   ```sql
  >   UPDATE products
  >   SET unit_price = unit_price + 100
  >   WHERE product_id = 101;
  >   ```
  > - **Transaction decision**
  >   - `COMMIT` keeps the change; `ROLLBACK` cancels an uncommitted change.

- **Q21. List products by descending price; retrieve August 2026 orders.**

  > - **Descending prices**
  >   - `DESC` means highest first.
  >     - Use the identifier to order equal prices consistently.
  >   ```sql
  >   SELECT product_id, product_name, unit_price
  >   FROM products
  >   ORDER BY unit_price DESC, product_id;
  >   ```
  > - **August orders**
  >   - Include August 1; exclude September 1.
  >   ```sql
  >   SELECT order_id, order_date
  >   FROM orders
  >   WHERE order_date >= '2026-08-01'
  >     AND order_date < '2026-09-01'
  >   ORDER BY order_date, order_id;
  >   ```

- **Q22. Calculate line-item amounts and revenue per product.**

  > - **Line amount: quantity multiplied by recorded unit price**
  >   ```sql
  >   SELECT order_id, product_id,
  >          quantity * unit_price AS line_amount
  >   FROM order_items
  >   ORDER BY order_id, product_id;
  >   ```
  > - **Product revenue: sum its line amounts**
  >   - Here, revenue means gross ordered value, before refunds or other adjustments.
  >   - `LEFT JOIN` retains unsold products.
  >     - `COALESCE` replaces a missing sum with zero.
  >   ```sql
  >   SELECT products.product_id,
  >          COALESCE(SUM(order_items.quantity *
  >                       order_items.unit_price), 0) AS revenue
  >   FROM products
  >   LEFT JOIN order_items
  >     ON order_items.product_id = products.product_id
  >   GROUP BY products.product_id
  >   ORDER BY products.product_id;
  >   ```

- **Q23. Find customers with at least two orders. When should HAVING replace WHERE?**

  > - **WHERE: filters individual rows before grouping**
  >   - Use it for dates, statuses, or individual prices.
  > - **HAVING: filters groups after aggregation**
  >   - Use it for counts, totals, or averages.
  >     - `COUNT(*) >= 2` describes a group, not one order.
  >   ```sql
  >   SELECT customer_id, COUNT(*) AS order_count
  >   FROM orders
  >   GROUP BY customer_id
  >   HAVING COUNT(*) >= 2
  >   ORDER BY customer_id;
  >   ```
  > - **Query flow**
  >   ```mermaid
  >   flowchart LR
  >       Rows[Rows] --> Filter[WHERE]
  >       Filter --> Groups[GROUP BY]
  >       Groups --> Keep[HAVING]
  >       Keep --> Result[Result]
  >   ```

- **Q24. How do EXPLAIN, indexes, selectivity, and statistics determine a query plan?**

  > - **EXPLAIN: show the chosen execution plan**
  >   - Does not execute the query.
  >   - `EXPLAIN ANALYZE` executes it and reports actual work.
  > - **Index: additional access path**
  >   - A sequential scan checks table rows directly.
  >   - An index scan uses the index to locate matching rows.
  >     - Creating an index does not force every query to use it.
  > - **Selectivity: how narrowly a condition filters records**
  >   - Few matching rows can favor an index.
  >   - Many matching rows can make a sequential scan cheaper.
  > - **Statistics: evidence for estimates**
  >   - `ANALYZE orders` refreshes PostgreSQL's table statistics.
  >     - Compare estimated and actual rows when investigating a poor plan.
  > - **PostgreSQL plan inspection**
  >   ```sql
  >   EXPLAIN SELECT * FROM orders WHERE customer_id = 1;
  >   CREATE INDEX idx_orders_customer ON orders(customer_id);
  >   EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 1;
  >   ```

- **Q25. Display every customer and total order amount, including customers without orders.**

  > - **Given tables**
  >   - `CUSTOMER(CustomerID, CustomerName)`.
  >   - `ORDER(OrderID, CustomerID, Amount)`.
  > - **SQL Server query**
  >   ```sql
  >   SELECT customer.CustomerID, customer.CustomerName,
  >          COALESCE(SUM(customer_order.Amount), 0) AS TotalAmount
  >   FROM CUSTOMER AS customer
  >   LEFT JOIN [ORDER] AS customer_order
  >     ON customer_order.CustomerID = customer.CustomerID
  >   GROUP BY customer.CustomerID, customer.CustomerName;
  >   ```
  > - **Why it works**
  >   - `LEFT JOIN` preserves every customer.
  >   - `GROUP BY` produces one group per customer.
  >   - `SUM` totals matching order amounts.
  >     - `COALESCE` changes a missing total to zero.
  > - **Why not INNER JOIN?**
  >   - It would omit customers with no matching orders.

- **Q26. Show orders with customer names and totals. When is LEFT JOIN preferable?**

  > - **One result row per order**
  >   - Aggregate items before joining their totals to orders.
  >     - A Common Table Expression (CTE) names this intermediate result.
  >   ```sql
  >   WITH order_totals AS (
  >       SELECT order_id, SUM(quantity * unit_price) AS order_total
  >       FROM order_items
  >       GROUP BY order_id
  >   )
  >   SELECT orders.order_id, customers.full_name,
  >          COALESCE(order_totals.order_total, 0) AS order_total
  >   FROM orders
  >   JOIN customers ON customers.customer_id = orders.customer_id
  >   LEFT JOIN order_totals ON order_totals.order_id = orders.order_id
  >   ORDER BY orders.order_id;
  >   ```
  > - **INNER JOIN: matching rows only**
  >   - Customers without orders disappear.
  > - **LEFT JOIN: every left-side row remains**
  >   - Use it when customers without orders must appear.
  >     - Count `orders.order_id`, not the unmatched placeholder row.
  >   ```sql
  >   SELECT customers.customer_id, customers.full_name,
  >          COUNT(orders.order_id) AS order_count
  >   FROM customers
  >   LEFT JOIN orders ON orders.customer_id = customers.customer_id
  >   GROUP BY customers.customer_id, customers.full_name
  >   ORDER BY customers.customer_id;
  >   ```
  > - **Self join: compare rows within the same table**
  >   - Join employees to their managers using separate table aliases.
  >     - Match `employee.manager_id` with `manager.employee_id`.

- **Q27. Find customers without orders, orders without payments, and products never ordered.**

  > - **NOT EXISTS: keep records without a matching child**
  >   - The inner query checks each outer record's identifier.
  > - **Customers without orders**
  >   ```sql
  >   SELECT customers.customer_id, customers.full_name
  >   FROM customers
  >   WHERE NOT EXISTS (
  >       SELECT 1 FROM orders
  >       WHERE orders.customer_id = customers.customer_id
  >   )
  >   ORDER BY customers.customer_id;
  >   ```
  > - **Orders without payment records**
  >   ```sql
  >   SELECT orders.order_id FROM orders
  >   WHERE NOT EXISTS (
  >       SELECT 1 FROM payments
  >       WHERE payments.order_id = orders.order_id
  >   )
  >   ORDER BY orders.order_id;
  >   ```
  > - **Products never ordered**
  >   ```sql
  >   SELECT products.product_id, products.product_name
  >   FROM products
  >   WHERE NOT EXISTS (
  >       SELECT 1 FROM order_items
  >       WHERE order_items.product_id = products.product_id
  >   )
  >   ORDER BY products.product_id;
  >   ```

- **Q28. Find above-average product revenues and customers with shipped orders.**

  > - **Above-average revenue**
  >   - Calculate one revenue value per product before averaging.
  >     - Include unsold products as zero-revenue products.
  >   ```sql
  >   WITH product_revenue AS (
  >       SELECT products.product_id, products.product_name,
  >              COALESCE(SUM(order_items.quantity *
  >                           order_items.unit_price), 0) AS revenue
  >       FROM products
  >       LEFT JOIN order_items
  >         ON order_items.product_id = products.product_id
  >       GROUP BY products.product_id, products.product_name
  >   )
  >   SELECT product_id, product_name, revenue
  >   FROM product_revenue
  >   WHERE revenue > (SELECT AVG(1.0 * revenue) FROM product_revenue)
  >   ORDER BY product_id;
  >   ```
  > - **Shipped-order customers**
  >   - `EXISTS` returns each qualifying customer once.
  >   ```sql
  >   SELECT customers.customer_id, customers.full_name
  >   FROM customers
  >   WHERE EXISTS (
  >       SELECT 1 FROM orders
  >       WHERE orders.customer_id = customers.customer_id
  >         AND orders.status = 'SHIPPED'
  >   )
  >   ORDER BY customers.customer_id;
  >   ```

- **Q29. Rewrite the shipped-order subquery as a join. Why use DISTINCT?**

  > - **Equivalent customer-level query**
  >   ```sql
  >   SELECT DISTINCT customers.customer_id, customers.full_name
  >   FROM customers
  >   JOIN orders ON orders.customer_id = customers.customer_id
  >   WHERE orders.status = 'SHIPPED'
  >   ORDER BY customers.customer_id;
  >   ```
  > - **Why DISTINCT?**
  >   - One customer can match several shipped orders.
  >     - The raw join repeats that customer for every matching order.
  >   - `DISTINCT` removes repeated customer rows.
  > - **Result meaning**
  >   - One output row represents one customer, not one order.

- **Q30. Find category revenues, the top customer, and monthly order counts.**

  > - **Revenue by category**
  >   ```sql
  >   SELECT products.category,
  >          SUM(order_items.quantity * order_items.unit_price) AS revenue
  >   FROM order_items
  >   JOIN products ON products.product_id = order_items.product_id
  >   GROUP BY products.category
  >   ORDER BY products.category;
  >   ```
  > - **Top customer, including tied totals**
  >   - First total each customer's purchases; then select the maximum.
  >   ```sql
  >   WITH customer_spend AS (
  >       SELECT customers.customer_id, customers.full_name,
  >              COALESCE(SUM(order_items.quantity *
  >                           order_items.unit_price), 0) AS total_spent
  >       FROM customers
  >       LEFT JOIN orders ON orders.customer_id = customers.customer_id
  >       LEFT JOIN order_items ON order_items.order_id = orders.order_id
  >       GROUP BY customers.customer_id, customers.full_name
  >   )
  >   SELECT customer_id, full_name, total_spent
  >   FROM customer_spend
  >   WHERE total_spent = (SELECT MAX(total_spent) FROM customer_spend)
  >   ORDER BY customer_id;
  >   ```
  > - **Monthly orders: SQL Server**
  >   - Group by both year and month.
  >     - Count orders directly, avoiding multiplication from line-item joins.
  >   ```sql
  >   SELECT YEAR(order_date) AS order_year,
  >          MONTH(order_date) AS order_month, COUNT(*) AS order_count
  >   FROM orders
  >   GROUP BY YEAR(order_date), MONTH(order_date)
  >   ORDER BY order_year, order_month;
  >   ```

- **Q31. What does atomicity guarantee? Explain all four ACID properties.**

  > - **Atomicity: all or nothing**
  >   - Every transaction change succeeds together, or all are undone.
  >     - A bank transfer cannot retain only the debit.
  > - **Consistency: valid states**
  >   - Declared rules remain satisfied before and after the transaction.
  > - **Isolation: controlled simultaneous access**
  >   - Prevents interference according to the chosen isolation level.
  > - **Durability: committed changes persist**
  >   - Successful commits survive failures within the database's guarantees.
  > - **Transaction flow**
  >   ```mermaid
  >   flowchart LR
  >       Start[BEGIN] --> Work[Changes]
  >       Work -->|success| Commit[COMMIT]
  >       Work -->|failure| Undo[ROLLBACK]
  >   ```

- **Q33. What do two sessions observe before rollback, after rollback, and after commit?**

  > - **Session A: update one product**
  >   ```sql
  >   BEGIN TRANSACTION;
  >   UPDATE products
  >   SET unit_price = unit_price + 100
  >   WHERE product_id = 101;
  >   SELECT unit_price FROM products WHERE product_id = 101;
  >   ```
  > - **Before commit**
  >   - Session A sees its own changed price.
  >   - Session B depends on isolation and versioning.
  >     - Locking `READ COMMITTED`: waits for the conflicting write.
  >     - Row-versioned reads: may see the earlier committed price.
  >     - `READ UNCOMMITTED`: may see the uncommitted price.
  > - **After ROLLBACK**
  >   - The original price remains.
  > - **After repeating and COMMIT**
  >   - A new committed read sees the increased price.

- **Q34. Distinguish dirty reads, non-repeatable reads, phantoms, lost updates, and deadlocks.**

  > - **Dirty read**
  >   - Reads another transaction's uncommitted change.
  >     - That change might later be rolled back.
  > - **Non-repeatable read**
  >   - Reading the same row twice returns different committed values.
  > - **Phantom read**
  >   - Repeating a filter finds a changed set of matching rows.
  > - **Lost update**
  >   - One writer overwrites another writer's change.
  > - **Deadlock**
  >   - Transactions form a cycle, each waiting for another's locked resource.
  >     - Ordinary blocking has waiting without necessarily having a cycle.

- **Q36. Add phone, create an order-summary view, and backfill cached totals.**

  > - **Add a nullable phone column; populate two customers**
  >   ```sql
  >   ALTER TABLE customers ADD phone VARCHAR(20) NULL;
  >   UPDATE customers
  >   SET phone = CASE customer_id
  >       WHEN 1 THEN '9000000001' ELSE '9000000002' END
  >   WHERE customer_id IN (1, 2);
  >   ```
  > - **Create the view in its own SQL Server batch**
  >   - A view stores the query definition, not a separate result copy.
  >   ```sql
  >   CREATE VIEW v_order_summary AS
  >   SELECT orders.order_id, orders.customer_id,
  >          COALESCE(SUM(order_items.quantity *
  >                       order_items.unit_price), 0) AS order_total
  >   FROM orders
  >   LEFT JOIN order_items ON order_items.order_id = orders.order_id
  >   GROUP BY orders.order_id, orders.customer_id;
  >   ```
  > - **Add and backfill stored totals**
  >   - Backfill means populating values for existing rows.
  >   ```sql
  >   ALTER TABLE orders ADD cached_order_total DECIMAL(12,2) NULL;
  >   UPDATE orders
  >   SET cached_order_total = COALESCE((
  >       SELECT SUM(order_items.quantity * order_items.unit_price)
  >       FROM order_items
  >       WHERE order_items.order_id = orders.order_id
  >   ), 0);
  >   ```
  > - **Denormalization: duplicate derived values for faster reads**
  >   - Cached totals avoid repeated aggregation.
  >     - Later item changes must also update or refresh those totals.
  > - **Migration order**
  >   - Add compatible fields, backfill data, then tighten constraints when ready.

- **Q38. Redesign an active retail cart using a key-value or document model.**

  > - **Access pattern: retrieve one user's complete cart**
  >   - Key: `cart:user:1`.
  >   - Value: embedded items, with references to shared products.
  >   ```json
  >   {
  >     "userId": 1,
  >     "items": [
  >       {"productId": 101, "quantity": 1},
  >       {"productId": 102, "quantity": 2}
  >     ]
  >   }
  >   ```
  > - **Two easier requests**
  >   - Fetch the full cart using its key.
  >   - Read all item quantities together.
  > - **Two risks**
  >   - Shared product details can become stale if duplicated.
  >   - Concurrent whole-cart updates can overwrite each other.
  > - **Checkout decision**
  >   - Keep authoritative orders and payments in the relational database.
  >     - Recheck current prices and stock before completing checkout.

- **Q40. Reject an uncertain checkout briefly, or risk incorrect processing?**

  > - **Final payments and stock: protect correctness**
  >   - Reject or defer when the required outcome cannot be guaranteed.
  >     - A timeout means the outcome is unknown, not necessarily unsuccessful.
  > - **Product browsing: temporary staleness may be acceptable**
  >   - An older catalog response can preserve availability.
  > - **Decision rule**
  >   - Choose according to the business cost of an incorrect result.