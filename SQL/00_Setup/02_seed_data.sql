SET search_path TO sql_mastery;

INSERT INTO departments (department_id, department_name) VALUES
    (1, 'Executive'),
    (2, 'Sales'),
    (3, 'Support'),
    (4, 'Operations'),
    (5, 'Data');

INSERT INTO employees (employee_id, full_name, email, department_id, manager_id, role_title, active, hired_on) VALUES
    (1, 'Avery Stone', 'avery.stone@example.com', 1, NULL, 'CEO', true, '2021-01-15'),
    (2, 'Maya Rao', 'maya.rao@example.com', 2, 1, 'Sales Director', true, '2021-05-20'),
    (3, 'Leo Kim', 'leo.kim@example.com', 3, 1, 'Support Director', true, '2021-06-18'),
    (4, 'Nora Patel', 'nora.patel@example.com', 4, 1, 'Operations Lead', true, '2022-02-10'),
    (5, 'Ethan Brooks', 'ethan.brooks@example.com', 2, 2, 'Account Executive', true, '2023-03-12'),
    (6, 'Priya Shah', 'priya.shah@example.com', 2, 2, 'Account Executive', true, '2023-08-02'),
    (7, 'Jon Bell', 'jon.bell@example.com', 3, 3, 'Support Agent', true, '2022-11-05'),
    (8, 'Sara Chen', 'sara.chen@example.com', 3, 3, 'Support Agent', false, '2022-09-09'),
    (9, 'Iris West', 'iris.west@example.com', 5, 1, 'Analytics Engineer', true, '2024-01-22');

INSERT INTO customers (customer_id, full_name, email, phone, city, state, country, signup_date, active) VALUES
    (1, 'Anika Sharma', 'anika.sharma@example.com', '+1-555-0101', 'Austin', 'TX', 'US', '2025-11-04', true),
    (2, 'Brian Miller', 'brian.miller@example.com', '+1-555-0102', 'Seattle', 'WA', 'US', '2025-12-14', true),
    (3, 'Carlos Diaz', 'carlos.diaz@example.com', NULL, 'Miami', 'FL', 'US', '2026-01-07', true),
    (4, 'Divya Nair', 'divya.nair@example.com', '+91-90000-00004', 'Bangalore', 'KA', 'IN', '2026-01-20', true),
    (5, 'Emma Wilson', 'emma.wilson@example.org', '+1-555-0105', 'Denver', 'CO', 'US', '2026-02-11', true),
    (6, 'Farhan Ali', 'farhan.ali@example.com', '+91-90000-00006', 'Mumbai', 'MH', 'IN', '2026-02-23', true),
    (7, 'Grace Lee', 'grace.lee@example.com', NULL, 'San Jose', 'CA', 'US', '2026-03-02', false),
    (8, 'Hannah Brown', 'hannah.brown@example.com', '+1-555-0108', 'Austin', 'TX', 'US', '2026-03-12', true),
    (9, 'Ivan Petrov', 'ivan.petrov@example.net', '+1-555-0109', 'Chicago', 'IL', 'US', '2026-03-18', true),
    (10, 'Julia Novak', 'julia.novak@example.com', NULL, 'Prague', NULL, 'CZ', '2026-03-25', true),
    (11, 'Ken Adams', 'ken.adams@example.com', '+1-555-0111', 'Seattle', 'WA', 'US', '2026-04-01', true),
    (12, 'Lina Gomez', 'lina.gomez@example.com', '+1-555-0112', 'Austin', 'TX', 'US', '2026-04-08', true);

INSERT INTO products (product_id, sku, product_name, category, list_price, active, created_at, updated_at) VALUES
    (1, 'BK-101', 'SQL Deep Dive', 'Books', 49.00, true, '2025-10-01', '2026-01-15'),
    (2, 'BK-102', 'Analytics Patterns', 'Books', 59.00, true, '2025-10-01', '2026-01-15'),
    (3, 'EL-201', 'Wireless Keyboard', 'Electronics', 89.00, true, '2025-11-01', '2026-03-12'),
    (4, 'EL-202', 'Noise Canceling Headphones', 'Electronics', 199.00, true, '2025-11-01', '2026-03-12'),
    (5, 'OF-301', 'Standing Desk Mat', 'Office', 75.00, true, '2025-12-01', '2026-03-22'),
    (6, 'OF-302', 'Notebook Pack', 'Office', 24.00, true, '2025-12-01', '2026-03-22'),
    (7, 'SW-401', 'Team SaaS Monthly', 'Software', 29.00, true, '2026-01-01', '2026-01-01'),
    (8, 'SW-402', 'Team SaaS Annual', 'Software', 290.00, true, '2026-01-01', '2026-01-01'),
    (9, 'TR-501', 'Data Workshop Ticket', 'Training', 399.00, true, '2026-01-10', '2026-01-10'),
    (10, 'TR-502', 'SQL Mentoring Session', 'Training', 150.00, true, '2026-01-10', '2026-01-10'),
    (11, 'EL-203', 'USB-C Hub', 'Electronics', 45.00, true, '2026-02-01', '2026-02-01'),
    (12, 'OF-303', 'Desk Lamp', 'Office', 64.00, false, '2026-02-15', '2026-04-01');

INSERT INTO marketing_campaigns (campaign_id, campaign_code, campaign_name, channel, started_on, ended_on, budget) VALUES
    (1, 'spring_sql', 'Spring SQL Push', 'paid_search', '2026-03-01', '2026-03-31', 3000.00),
    (2, 'pro_upgrade', 'Pro Upgrade Launch', 'email', '2026-03-15', '2026-04-15', 1200.00),
    (3, 'office_bundle', 'Office Bundle', 'social', '2026-02-01', '2026-02-28', 1800.00),
    (4, 'april_retention', 'April Retention', 'email', '2026-04-01', '2026-04-30', 900.00);

INSERT INTO orders (order_id, customer_id, sales_rep_id, order_date, status, channel, coupon_code, shipping_city, created_at) VALUES
    (1, 1, 5, '2026-01-05 10:15', 'delivered', 'web', NULL, 'Austin', '2026-01-05 10:15'),
    (2, 2, 5, '2026-01-12 11:00', 'delivered', 'web', 'NEW10', 'Seattle', '2026-01-12 11:00'),
    (3, 3, 6, '2026-01-28 09:30', 'refunded', 'marketplace', NULL, 'Miami', '2026-01-28 09:30'),
    (4, 4, 6, '2026-02-04 14:10', 'delivered', 'web', 'INDIA15', 'Bangalore', '2026-02-04 14:10'),
    (5, 5, 5, '2026-02-10 16:45', 'cancelled', 'sales', NULL, 'Denver', '2026-02-10 16:45'),
    (6, 6, 6, '2026-02-18 08:20', 'delivered', 'web', 'NEW10', 'Mumbai', '2026-02-18 08:20'),
    (7, 1, 5, '2026-03-03 12:00', 'delivered', 'web', 'spring_sql', 'Austin', '2026-03-03 12:00'),
    (8, 8, 5, '2026-03-07 13:35', 'shipped', 'mobile', NULL, 'Austin', '2026-03-07 13:35'),
    (9, 9, 6, '2026-03-11 19:05', 'paid', 'web', 'spring_sql', 'Chicago', '2026-03-11 19:05'),
    (10, 10, 6, '2026-03-20 07:50', 'pending', 'sales', NULL, 'Prague', '2026-03-20 07:50'),
    (11, 11, 5, '2026-04-02 15:10', 'delivered', 'web', 'pro_upgrade', 'Seattle', '2026-04-02 15:10'),
    (12, 12, 5, '2026-04-04 09:25', 'paid', 'mobile', NULL, 'Dallas', '2026-04-04 09:25'),
    (13, 2, 5, '2026-04-08 18:20', 'delivered', 'web', 'april_retention', 'Seattle', '2026-04-08 18:20'),
    (14, 4, 6, '2026-04-10 20:45', 'paid', 'marketplace', NULL, 'Bangalore', '2026-04-10 20:45'),
    (15, 6, 6, '2026-04-12 10:05', 'pending', 'web', NULL, 'Mumbai', '2026-04-12 10:05'),
    (16, 3, 6, '2026-04-14 08:55', 'delivered', 'mobile', 'pro_upgrade', 'Miami', '2026-04-14 08:55'),
    (17, 8, 5, '2026-04-18 17:25', 'refunded', 'web', NULL, 'Austin', '2026-04-18 17:25'),
    (18, 9, 6, '2026-04-19 09:00', 'shipped', 'sales', 'april_retention', 'Chicago', '2026-04-19 09:00');

INSERT INTO order_items (order_item_id, order_id, product_id, quantity, unit_price, discount_pct) VALUES
    (1, 1, 1, 1, 49.00, 0), (2, 1, 3, 1, 89.00, 5),
    (3, 2, 2, 1, 59.00, 10), (4, 2, 6, 3, 24.00, 0),
    (5, 3, 4, 1, 199.00, 0), (6, 3, 11, 1, 45.00, 0),
    (7, 4, 1, 2, 49.00, 15), (8, 4, 10, 1, 150.00, 0),
    (9, 5, 5, 2, 75.00, 0),
    (10, 6, 8, 1, 290.00, 10), (11, 6, 2, 1, 59.00, 0),
    (12, 7, 9, 1, 399.00, 20), (13, 7, 1, 1, 49.00, 0),
    (14, 8, 3, 2, 89.00, 0), (15, 8, 11, 2, 45.00, 0),
    (16, 9, 7, 6, 29.00, 0), (17, 9, 6, 2, 24.00, 0),
    (18, 10, 10, 2, 150.00, 0),
    (19, 11, 8, 1, 290.00, 0), (20, 11, 4, 1, 199.00, 5),
    (21, 12, 5, 1, 75.00, 0), (22, 12, 6, 5, 24.00, 0),
    (23, 13, 2, 2, 59.00, 10), (24, 13, 3, 1, 89.00, 0),
    (25, 14, 1, 1, 49.00, 0), (26, 14, 7, 12, 29.00, 0),
    (27, 15, 4, 1, 199.00, 0),
    (28, 16, 9, 1, 399.00, 15), (29, 16, 11, 1, 45.00, 0),
    (30, 17, 3, 1, 89.00, 0), (31, 17, 5, 1, 75.00, 0),
    (32, 18, 10, 1, 150.00, 0), (33, 18, 6, 4, 24.00, 0);

INSERT INTO payments (payment_id, order_id, payment_date, amount, method, status, transaction_ref) VALUES
    (1, 1, '2026-01-05 10:17', 133.55, 'card', 'successful', 'TXN-001'),
    (2, 2, '2026-01-12 11:03', 125.10, 'card', 'successful', 'TXN-002'),
    (3, 3, '2026-01-28 09:35', 244.00, 'wallet', 'refunded', 'TXN-003'),
    (4, 4, '2026-02-04 14:12', 233.30, 'card', 'successful', 'TXN-004'),
    (5, 5, '2026-02-10 16:47', 0.00, 'card', 'failed', 'TXN-005'),
    (6, 6, '2026-02-18 08:23', 320.00, 'bank_transfer', 'successful', 'TXN-006'),
    (7, 7, '2026-03-03 12:02', 368.20, 'card', 'successful', 'TXN-007'),
    (8, 8, '2026-03-07 13:40', 268.00, 'card', 'successful', 'TXN-008'),
    (9, 9, '2026-03-11 19:07', 222.00, 'wallet', 'successful', 'TXN-009'),
    (10, 10, '2026-03-20 07:55', 0.00, 'card', 'pending', 'TXN-010'),
    (11, 11, '2026-04-02 15:12', 479.05, 'card', 'successful', 'TXN-011'),
    (12, 12, '2026-04-04 09:27', 195.00, 'wallet', 'successful', 'TXN-012'),
    (13, 13, '2026-04-08 18:25', 195.20, 'card', 'successful', 'TXN-013'),
    (14, 14, '2026-04-10 20:49', 397.00, 'bank_transfer', 'successful', 'TXN-014'),
    (15, 15, '2026-04-12 10:07', 0.00, 'card', 'failed', 'TXN-015'),
    (16, 16, '2026-04-14 09:01', 384.15, 'card', 'successful', 'TXN-016'),
    (17, 17, '2026-04-18 17:31', 164.00, 'card', 'refunded', 'TXN-017'),
    (18, 18, '2026-04-19 09:05', 246.00, 'card', 'successful', 'TXN-018');

INSERT INTO shipments (shipment_id, order_id, shipped_at, delivered_at, carrier, tracking_code, shipping_cost) VALUES
    (1, 1, '2026-01-06 09:00', '2026-01-08 15:00', 'ShipFast', 'TRK-001', 8.50),
    (2, 2, '2026-01-13 10:00', '2026-01-16 12:30', 'ShipFast', 'TRK-002', 9.25),
    (3, 3, '2026-01-29 11:00', '2026-02-02 17:00', 'ParcelPro', 'TRK-003', 11.00),
    (4, 4, '2026-02-05 08:00', '2026-02-08 19:00', 'ParcelPro', 'TRK-004', 12.75),
    (5, 6, '2026-02-19 09:30', '2026-02-23 14:00', 'GlobalShip', 'TRK-006', 14.30),
    (6, 7, '2026-03-04 10:30', '2026-03-06 16:00', 'ShipFast', 'TRK-007', 7.80),
    (7, 8, '2026-03-08 12:00', NULL, 'ShipFast', 'TRK-008', 8.10),
    (8, 11, '2026-04-03 08:45', '2026-04-05 13:00', 'ShipFast', 'TRK-011', 10.20),
    (9, 13, '2026-04-09 09:00', '2026-04-11 10:00', 'ParcelPro', 'TRK-013', 9.60),
    (10, 16, '2026-04-15 10:00', '2026-04-17 18:00', 'GlobalShip', 'TRK-016', 15.50),
    (11, 18, '2026-04-20 09:30', NULL, 'ShipFast', 'TRK-018', 8.40);

INSERT INTO inventory_movements (product_id, movement_type, quantity_delta, movement_at, reference) VALUES
    (1, 'purchase', 100, '2026-01-01 08:00', 'PO-1001'), (1, 'sale', -1, '2026-01-05 10:15', 'order 1'),
    (1, 'sale', -2, '2026-02-04 14:10', 'order 4'), (1, 'sale', -1, '2026-03-03 12:00', 'order 7'),
    (2, 'purchase', 80, '2026-01-01 08:00', 'PO-1002'), (2, 'sale', -1, '2026-01-12 11:00', 'order 2'),
    (2, 'sale', -1, '2026-02-18 08:20', 'order 6'), (2, 'sale', -2, '2026-04-08 18:20', 'order 13'),
    (3, 'purchase', 50, '2026-01-01 08:00', 'PO-1003'), (3, 'sale', -1, '2026-01-05 10:15', 'order 1'),
    (3, 'sale', -2, '2026-03-07 13:35', 'order 8'), (3, 'return', 1, '2026-04-20 12:00', 'order 17 return'),
    (4, 'purchase', 40, '2026-01-01 08:00', 'PO-1004'), (4, 'sale', -1, '2026-01-28 09:30', 'order 3'),
    (4, 'sale', -1, '2026-04-02 15:10', 'order 11'), (4, 'sale', -1, '2026-04-12 10:05', 'order 15'),
    (5, 'purchase', 60, '2026-01-01 08:00', 'PO-1005'), (5, 'sale', -2, '2026-02-10 16:45', 'order 5'),
    (5, 'sale', -1, '2026-04-04 09:25', 'order 12'), (6, 'purchase', 200, '2026-01-01 08:00', 'PO-1006'),
    (6, 'sale', -3, '2026-01-12 11:00', 'order 2'), (6, 'sale', -5, '2026-04-04 09:25', 'order 12'),
    (7, 'purchase', 500, '2026-01-01 08:00', 'PO-1007'), (7, 'sale', -6, '2026-03-11 19:05', 'order 9'),
    (7, 'sale', -12, '2026-04-10 20:45', 'order 14'), (8, 'purchase', 150, '2026-01-01 08:00', 'PO-1008'),
    (8, 'sale', -1, '2026-02-18 08:20', 'order 6'), (8, 'sale', -1, '2026-04-02 15:10', 'order 11');

INSERT INTO support_tickets (ticket_id, customer_id, order_id, assigned_to, opened_at, closed_at, priority, status, subject) VALUES
    (1, 3, 3, 7, '2026-01-29 10:00', '2026-02-01 11:30', 'high', 'closed', 'Refund request for damaged headphones'),
    (2, 5, 5, 8, '2026-02-10 18:00', NULL, 'medium', 'open', 'Payment failed but cart still reserved'),
    (3, 6, 6, 7, '2026-02-24 09:15', '2026-02-24 13:00', 'low', 'closed', 'Invoice copy needed'),
    (4, 8, 8, 7, '2026-03-09 16:20', NULL, 'urgent', 'open', 'Shipment delay for keyboard bundle'),
    (5, 10, 10, 8, '2026-03-21 08:10', NULL, 'medium', 'open', 'Pending order confirmation'),
    (6, 11, 11, 7, '2026-04-03 12:40', '2026-04-03 18:00', 'high', 'resolved', 'Upgrade license question'),
    (7, 12, 12, 7, '2026-04-05 10:00', NULL, 'low', 'pending_customer', 'Desk mat color question'),
    (8, 8, 17, 7, '2026-04-18 19:00', '2026-04-19 08:00', 'high', 'closed', 'Refund status after return');

INSERT INTO ticket_events (ticket_id, event_at, actor_type, event_type, note) VALUES
    (1, '2026-01-29 10:00', 'customer', 'created', 'Customer reports damage'),
    (1, '2026-01-29 11:00', 'agent', 'reply', 'Asked for photos'),
    (1, '2026-02-01 11:30', 'agent', 'closed', 'Refund issued'),
    (2, '2026-02-10 18:00', 'customer', 'created', 'Payment failure'),
    (2, '2026-02-11 09:15', 'agent', 'reply', 'Investigating cart hold'),
    (3, '2026-02-24 09:15', 'customer', 'created', 'Needs invoice'),
    (3, '2026-02-24 13:00', 'agent', 'closed', 'Invoice sent'),
    (4, '2026-03-09 16:20', 'customer', 'created', 'Shipment delayed'),
    (4, '2026-03-09 16:45', 'agent', 'reply', 'Carrier contacted'),
    (5, '2026-03-21 08:10', 'customer', 'created', 'Pending order'),
    (6, '2026-04-03 12:40', 'customer', 'created', 'Upgrade question'),
    (6, '2026-04-03 18:00', 'agent', 'resolved', 'Explained annual plan'),
    (7, '2026-04-05 10:00', 'customer', 'created', 'Color question'),
    (8, '2026-04-18 19:00', 'customer', 'created', 'Refund status'),
    (8, '2026-04-19 08:00', 'system', 'closed', 'Refund confirmed');

INSERT INTO web_events (customer_id, session_id, occurred_at, event_type, page_url, utm_campaign, metadata) VALUES
    (1, 's-001', '2026-03-01 09:00', 'visit', '/home', 'spring_sql', '{"device":"desktop","browser":"chrome"}'),
    (1, 's-001', '2026-03-01 09:04', 'product_view', '/products/9', 'spring_sql', '{"device":"desktop","browser":"chrome"}'),
    (1, 's-001', '2026-03-01 09:08', 'add_to_cart', '/cart', 'spring_sql', '{"device":"desktop","browser":"chrome"}'),
    (1, 's-001', '2026-03-03 12:00', 'purchase', '/checkout/success', 'spring_sql', '{"device":"desktop","browser":"chrome"}'),
    (8, 's-002', '2026-03-07 12:50', 'visit', '/home', NULL, '{"device":"mobile","browser":"safari"}'),
    (8, 's-002', '2026-03-07 13:02', 'product_view', '/products/3', NULL, '{"device":"mobile","browser":"safari"}'),
    (8, 's-002', '2026-03-07 13:20', 'purchase', '/checkout/success', NULL, '{"device":"mobile","browser":"safari"}'),
    (9, 's-003', '2026-03-11 18:40', 'visit', '/home', 'spring_sql', '{"device":"desktop","browser":"firefox"}'),
    (9, 's-003', '2026-03-11 18:55', 'purchase', '/checkout/success', 'spring_sql', '{"device":"desktop","browser":"firefox"}'),
    (11, 's-004', '2026-04-02 14:55', 'visit', '/pricing', 'pro_upgrade', '{"device":"desktop","browser":"edge","experiment":{"name":"pricing_v2","variant":"b"}}'),
    (11, 's-004', '2026-04-02 15:10', 'purchase', '/checkout/success', 'pro_upgrade', '{"device":"desktop","browser":"edge","experiment":{"name":"pricing_v2","variant":"b"}}'),
    (12, 's-005', '2026-04-04 09:00', 'visit', '/office', NULL, '{"device":"mobile","browser":"chrome"}'),
    (12, 's-005', '2026-04-04 09:20', 'purchase', '/checkout/success', NULL, '{"device":"mobile","browser":"chrome"}'),
    (NULL, 's-006', '2026-04-05 11:00', 'visit', '/blog/sql-window-functions', 'april_retention', '{"device":"desktop","browser":"chrome"}'),
    (4, 's-007', '2026-04-10 20:20', 'visit', '/software', NULL, '{"device":"mobile","browser":"chrome"}'),
    (4, 's-007', '2026-04-10 20:45', 'purchase', '/checkout/success', NULL, '{"device":"mobile","browser":"chrome"}'),
    (3, 's-008', '2026-04-14 08:30', 'visit', '/training', 'pro_upgrade', '{"device":"desktop","browser":"safari"}'),
    (3, 's-008', '2026-04-14 08:55', 'purchase', '/checkout/success', 'pro_upgrade', '{"device":"desktop","browser":"safari"}');

INSERT INTO subscriptions (subscription_id, customer_id, plan_name, started_on, ended_on, monthly_price, status) VALUES
    (1, 1, 'Pro', '2026-01-01', NULL, 29.00, 'active'),
    (2, 2, 'Pro', '2026-01-15', NULL, 29.00, 'active'),
    (3, 3, 'Starter', '2026-01-25', '2026-03-01', 12.00, 'expired'),
    (4, 4, 'Pro', '2026-02-01', NULL, 29.00, 'active'),
    (5, 6, 'Enterprise', '2026-02-18', NULL, 99.00, 'active'),
    (6, 8, 'Starter', '2026-03-07', '2026-04-18', 12.00, 'cancelled'),
    (7, 11, 'Enterprise', '2026-04-02', NULL, 99.00, 'active'),
    (8, 12, 'Trial', '2026-04-04', '2026-05-04', 0.00, 'trialing');

SELECT setval(pg_get_serial_sequence('sql_mastery.departments', 'department_id'), (SELECT max(department_id) FROM departments));
SELECT setval(pg_get_serial_sequence('sql_mastery.employees', 'employee_id'), (SELECT max(employee_id) FROM employees));
SELECT setval(pg_get_serial_sequence('sql_mastery.customers', 'customer_id'), (SELECT max(customer_id) FROM customers));
SELECT setval(pg_get_serial_sequence('sql_mastery.products', 'product_id'), (SELECT max(product_id) FROM products));
SELECT setval(pg_get_serial_sequence('sql_mastery.marketing_campaigns', 'campaign_id'), (SELECT max(campaign_id) FROM marketing_campaigns));
SELECT setval(pg_get_serial_sequence('sql_mastery.orders', 'order_id'), (SELECT max(order_id) FROM orders));
SELECT setval(pg_get_serial_sequence('sql_mastery.order_items', 'order_item_id'), (SELECT max(order_item_id) FROM order_items));
SELECT setval(pg_get_serial_sequence('sql_mastery.payments', 'payment_id'), (SELECT max(payment_id) FROM payments));
SELECT setval(pg_get_serial_sequence('sql_mastery.shipments', 'shipment_id'), (SELECT max(shipment_id) FROM shipments));
SELECT setval(pg_get_serial_sequence('sql_mastery.inventory_movements', 'movement_id'), (SELECT max(movement_id) FROM inventory_movements));
SELECT setval(pg_get_serial_sequence('sql_mastery.support_tickets', 'ticket_id'), (SELECT max(ticket_id) FROM support_tickets));
SELECT setval(pg_get_serial_sequence('sql_mastery.ticket_events', 'ticket_event_id'), (SELECT max(ticket_event_id) FROM ticket_events));
SELECT setval(pg_get_serial_sequence('sql_mastery.web_events', 'event_id'), (SELECT max(event_id) FROM web_events));
SELECT setval(pg_get_serial_sequence('sql_mastery.subscriptions', 'subscription_id'), (SELECT max(subscription_id) FROM subscriptions));
