CREATE TABLE customers (
    customer_id INT NOT NULL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    city VARCHAR(60) NOT NULL
);

CREATE TABLE products (
    product_id INT NOT NULL PRIMARY KEY,
    product_name VARCHAR(120) NOT NULL,
    category VARCHAR(60) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    active INT NOT NULL DEFAULT 1 CHECK (active IN (0, 1))
);

CREATE TABLE orders (
    order_id INT NOT NULL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customers(customer_id),
    order_date DATE NOT NULL,
    status VARCHAR(12) NOT NULL CHECK (status IN ('PLACED', 'SHIPPED', 'CANCELLED'))
);

CREATE TABLE order_items (
    order_id INT NOT NULL REFERENCES orders(order_id),
    product_id INT NOT NULL REFERENCES products(product_id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    discount DECIMAL(10,2) NULL CHECK (discount >= 0),
    PRIMARY KEY (order_id, product_id)
);

CREATE TABLE payments (
    payment_id INT NOT NULL PRIMARY KEY,
    order_id INT NOT NULL UNIQUE REFERENCES orders(order_id),
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0)
);

INSERT INTO customers (customer_id, full_name, email, city) VALUES
    (1, 'Asha Rao', 'asha@example.com', 'Pune'),
    (2, 'Ravi Sen', 'ravi@example.com', 'Delhi'),
    (3, 'Mina Shah', 'mina@example.com', 'Pune'),
    (4, 'Omar Khan', 'omar@example.com', 'Chennai');

INSERT INTO products (product_id, product_name, category, unit_price) VALUES
    (101, 'Keyboard', 'Accessories', 1000),
    (102, 'Mouse', 'Accessories', 500),
    (103, 'Monitor', 'Displays', 10000),
    (104, 'Cable', 'Accessories', 200),
    (105, 'Notebook', 'Stationery', 100),
    (106, 'Pen', 'Stationery', 20);

INSERT INTO orders (order_id, customer_id, order_date, status) VALUES
    (101, 1, '2026-07-01', 'SHIPPED'),
    (102, 1, '2026-07-15', 'PLACED'),
    (103, 2, '2026-08-01', 'SHIPPED'),
    (104, 2, '2026-08-02', 'PLACED'),
    (105, 3, '2026-08-03', 'SHIPPED'),
    (106, 3, '2026-08-04', 'PLACED');

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
    (101, 101, 1, 1000),
    (101, 102, 2, 500),
    (102, 103, 1, 10000),
    (102, 104, 2, 200),
    (103, 102, 1, 500),
    (103, 105, 5, 100),
    (104, 101, 2, 1000),
    (104, 104, 1, 200),
    (105, 103, 1, 10000),
    (106, 105, 10, 100);

INSERT INTO payments (payment_id, order_id, amount) VALUES
    (501, 101, 2000),
    (502, 103, 1000),
    (503, 105, 10000);