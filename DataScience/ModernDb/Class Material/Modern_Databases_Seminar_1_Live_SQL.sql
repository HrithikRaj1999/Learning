-- MODERN DATABASES — SEMINAR 1 LIVE SQL
-- PostgreSQL 18
-- Run after connecting to: modern_db
-- This resets ONLY the modern_db schema.

DROP SCHEMA IF EXISTS modern_db CASCADE;
CREATE SCHEMA modern_db;
SET search_path TO modern_db;
SELECT current_schema();

-- 1. TABLES
CREATE TABLE customers (
    customer_id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT,
    email TEXT
);

CREATE TABLE products (
    product_id BIGSERIAL PRIMARY KEY,
    product_name TEXT NOT NULL,
    category TEXT,
    price NUMERIC(12,2)
);

CREATE TABLE orders (
    order_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT REFERENCES customers(customer_id),
    order_date DATE NOT NULL,
    status TEXT,
    total_amount NUMERIC(12,2)
);

CREATE TABLE order_items (
    order_id BIGINT REFERENCES orders(order_id),
    product_id BIGINT REFERENCES products(product_id),
    quantity INT,
    PRIMARY KEY (order_id, product_id)
);

CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    employee_name TEXT NOT NULL,
    manager_id INT REFERENCES employees(employee_id)
);

\dt

-- 2. SMALL DEMO DATA
INSERT INTO customers (name, city, email) VALUES
('Alice', 'Pune', 'alice@example.com'),
('Bob', 'Mumbai', 'bob@example.com'),
('Charlie', 'Pune', 'charlie@example.com'),
('Diana', 'Bengaluru', 'diana@example.com');

INSERT INTO products (product_name, category, price) VALUES
('Laptop', 'Electronics', 75000),
('Keyboard', 'Electronics', 2500),
('Coffee Maker', 'Home', 6500),
('Headphones', 'Electronics', 4500);

INSERT INTO orders (customer_id, order_date, status, total_amount) VALUES
(1, '2026-08-01', 'COMPLETED', 77500),
(1, '2026-08-15', 'SHIPPED', 4500),
(2, '2026-08-20', 'COMPLETED', 6500);

INSERT INTO employees (employee_id, employee_name, manager_id) VALUES
(1, 'CEO', NULL),
(2, 'Engineering Manager', 1),
(3, 'Sales Manager', 1),
(4, 'Developer A', 2),
(5, 'Developer B', 2),
(6, 'Sales Rep A', 3);

SELECT * FROM customers ORDER BY customer_id;
SELECT * FROM orders ORDER BY order_id;


-- 3. JOINS
-- INNER JOIN: only matching rows
SELECT c.customer_id, c.name, o.order_id, o.total_amount
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
ORDER BY c.customer_id;

-- LEFT JOIN: preserve every customer
SELECT c.customer_id, c.name, o.order_id, o.total_amount
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
ORDER BY c.customer_id;

-- SELF JOIN: employee -> manager
SELECT e.employee_name AS employee, m.employee_name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.employee_id
ORDER BY e.employee_id;

-- 4. LARGE DATASET FOR OPTIMIZATION
-- Customer 1 and 2 are rare; 3 and 4 are dominant.
INSERT INTO orders (customer_id, order_date, status, total_amount)
SELECT
    CASE
        WHEN g <= 100 THEN 1
        WHEN g <= 200 THEN 2
        WHEN g % 2 = 0 THEN 3
        ELSE 4
    END,
    DATE '2024-01-01' + ((g * 7) % 1096),
    CASE
        WHEN g % 3 = 0 THEN 'COMPLETED'
        WHEN g % 3 = 1 THEN 'SHIPPED'
        ELSE 'PROCESSING'
    END,
    ROUND((1000 + ((g * 37) % 99000))::numeric, 2)
FROM generate_series(1, 1000000) AS g;

SELECT COUNT(*) AS total_orders FROM orders;

SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id
ORDER BY customer_id;

-- 5. EXPLAIN BEFORE INDEX
EXPLAIN
SELECT *
FROM orders
WHERE customer_id = 1;

-- 6. INDEX
CREATE INDEX idx_orders_customer ON orders(customer_id);

-- 7. EXPLAIN AFTER INDEX
EXPLAIN
SELECT *
FROM orders
WHERE customer_id = 1;

-- 8. ESTIMATED VS ACTUAL
EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM orders
WHERE customer_id = 1;

-- 9. LOW SELECTIVITY: optimizer may prefer sequential scan
EXPLAIN
SELECT *
FROM orders
WHERE customer_id IN (3, 4);

-- 10. PLANNER STATISTICS
SELECT
    tablename,
    attname,
    n_distinct,
    most_common_vals,
    most_common_freqs
FROM pg_stats
WHERE schemaname = 'modern_db'
  AND tablename = 'orders'
  AND attname = 'customer_id';

-- TABLE METADATA
SELECT relname, reltuples, relpages
FROM pg_class
WHERE relname = 'orders';

ANALYZE orders;

-- 11. HORIZONTAL PARTITIONING BY DATE
CREATE TABLE orders_partitioned (
    order_id BIGINT NOT NULL,
    customer_id BIGINT,
    order_date DATE NOT NULL,
    status TEXT,
    total_amount NUMERIC(12,2)
) PARTITION BY RANGE (order_date);

CREATE TABLE orders_2024
PARTITION OF orders_partitioned
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE orders_2025
PARTITION OF orders_partitioned
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE orders_2026
PARTITION OF orders_partitioned
FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

\dt orders*

-- 12. LOAD PARTITIONS
INSERT INTO orders_partitioned
    (order_id, customer_id, order_date, status, total_amount)
SELECT
    order_id, customer_id, order_date, status, total_amount
FROM orders;

-- 13. VERIFY PHYSICAL PARTITIONS
SELECT
    tableoid::regclass AS physical_partition,
    COUNT(*) AS row_count
FROM orders_partitioned
GROUP BY tableoid
ORDER BY physical_partition;

-- 14. PARTITION PRUNING
EXPLAIN
SELECT *
FROM orders_partitioned
WHERE order_date >= '2026-01-01'
  AND order_date < '2027-01-01';

EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM orders_partitioned
WHERE order_date >= '2026-01-01'
  AND order_date < '2027-01-01';

-- 15. NO PRUNING WHEN FILTER IS NOT ON PARTITION KEY
EXPLAIN
SELECT *
FROM orders_partitioned
WHERE customer_id = 1;

-- 16. OPTIONAL: VERTICAL PARTITIONING
CREATE TABLE orders_core (
    order_id BIGINT PRIMARY KEY,
    customer_id BIGINT,
    order_date DATE NOT NULL,
    status TEXT
);

CREATE TABLE orders_financial (
    order_id BIGINT PRIMARY KEY,
    total_amount NUMERIC(12,2),
    FOREIGN KEY (order_id) REFERENCES orders_core(order_id)
);

INSERT INTO orders_core
SELECT order_id, customer_id, order_date, status
FROM orders;

INSERT INTO orders_financial
SELECT order_id, total_amount
FROM orders;

-- Reconstruct a full order with a JOIN
SELECT
    c.order_id,
    c.customer_id,
    c.order_date,
    c.status,
    f.total_amount
FROM orders_core c
JOIN orders_financial f ON c.order_id = f.order_id
WHERE c.order_id = 1;

-- FINAL CHECK
SELECT COUNT(*) AS original_orders FROM orders;
SELECT COUNT(*) AS partitioned_orders FROM orders_partitioned;
SELECT COUNT(*) AS core_orders FROM orders_core;
SELECT COUNT(*) AS financial_orders FROM orders_financial;

-- TEACHING FLOW:
-- Tables -> Data -> JOINs -> Large dataset -> EXPLAIN -> Index
-- -> EXPLAIN ANALYZE -> Selectivity -> Statistics -> ANALYZE
-- -> Horizontal partitioning -> Pruning -> No pruning
-- -> Vertical partitioning.
