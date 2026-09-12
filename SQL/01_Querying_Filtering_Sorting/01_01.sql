SELECT customer_id, full_name, email, city, signup_date
FROM customers
WHERE active = true
ORDER BY signup_date DESC;