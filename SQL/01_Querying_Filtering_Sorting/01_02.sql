SELECT order_id, customer_id, order_date, channel, status FROM Orders
WHERE status = 'paid' AND  order_date <= '2026-03-31';