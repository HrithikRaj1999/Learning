# SQL Scenario Guide - Real-Life Expectations

Each SQL entry explains the business report or operation behind the exercise, what can go wrong, what to write, and how to test it. Exercises run basic -> advanced -> expert.

## Challenge 01.01 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.01`
- Original ask: Return each active customer with customer_id, full_name, email, city, and signup_date sorted by newest signup first.
- In simple words: Write a query or SQL script that answers only this request: Return each active customer with customer_id, full_name, email, city, and signup_date sorted by newest signup first.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return each active customer with customer_id, full_name, email, city, and signup_date sorted by newest signup first. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 01.02 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.02`
- Original ask: Find products with list_price between 50 and 250 and active true, ordered by price descending.
- In simple words: Write a query or SQL script that answers only this request: Find products with list_price between 50 and 250 and active true, ordered by price descending.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find products with list_price between 50 and 250 and active true, ordered by price descending. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 01.03 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.03`
- Original ask: Return customers from Bangalore, Mumbai, or Austin whose email ends with '.com'.
- In simple words: Write a query or SQL script that answers only this request: Return customers from Bangalore, Mumbai, or Austin whose email ends with '.com'.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return customers from Bangalore, Mumbai, or Austin whose email ends with '.com'. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 01.04 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.04`
- Original ask: Show orders where coupon_code is null and channel is not 'marketplace'.
- In simple words: Write a query or SQL script that answers only this request: Show orders where coupon_code is null and channel is not 'marketplace'.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Show orders where coupon_code is null and channel is not 'marketplace'. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 01.05 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.05`
- Original ask: Build preferred_contact using phone when present, else email.
- In simple words: Write a query or SQL script that answers only this request: Build preferred_contact using phone when present, else email.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build preferred_contact using phone when present, else email. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 01.06 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.06`
- Original ask: Label every order 'fresh', 'recent', or 'older' relative to 2026-04-01 using CASE.
- In simple words: Write a query or SQL script that answers only this request: Label every order 'fresh', 'recent', or 'older' relative to 2026-04-01 using CASE.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Label every order 'fresh', 'recent', or 'older' relative to 2026-04-01 using CASE. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 01.07 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.07`
- Original ask: Return page 3 of orders with 5 rows per page using deterministic ordering.
- In simple words: Write a query or SQL script that answers only this request: Return page 3 of orders with 5 rows per page using deterministic ordering.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return page 3 of orders with 5 rows per page using deterministic ordering. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 01.08 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.08`
- Original ask: Return distinct cities appearing in either customers.city or orders.shipping_city.
- In simple words: Write a query or SQL script that answers only this request: Return distinct cities appearing in either customers.city or orders.shipping_city.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return distinct cities appearing in either customers.city or orders.shipping_city. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 01.09 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.09`
- Original ask: Return web events whose metadata device is 'mobile'.
- In simple words: Write a query or SQL script that answers only this request: Return web events whose metadata device is 'mobile'.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return web events whose metadata device is 'mobile'. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 01.10 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.10`
- Original ask: Return tickets whose subject matches 'refund', 'delay', or 'login' via regex.
- In simple words: Write a query or SQL script that answers only this request: Return tickets whose subject matches 'refund', 'delay', or 'login' via regex.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return tickets whose subject matches 'refund', 'delay', or 'login' via regex. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 02.01 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.01`
- Original ask: Return every order with customer full_name, email, order_date, status, and channel.
- In simple words: Write a query or SQL script that answers only this request: Return every order with customer full_name, email, order_date, status, and channel.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return every order with customer full_name, email, order_date, status, and channel. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 02.02 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.02`
- Original ask: Return each order item with product_name, category, quantity, unit_price, and line gross.
- In simple words: Write a query or SQL script that answers only this request: Return each order item with product_name, category, quantity, unit_price, and line gross.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return each order item with product_name, category, quantity, unit_price, and line gross. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 02.03 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.03`
- Original ask: List all customers and their orders, keeping customers who never ordered.
- In simple words: Write a query or SQL script that answers only this request: List all customers and their orders, keeping customers who never ordered.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: List all customers and their orders, keeping customers who never ordered. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 02.04 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.04`
- Original ask: Find customers who never ordered using a LEFT JOIN anti join.
- In simple words: Write a query or SQL script that answers only this request: Find customers who never ordered using a LEFT JOIN anti join.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find customers who never ordered using a LEFT JOIN anti join. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 02.05 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.05`
- Original ask: Find customers with at least one delivered order using EXISTS.
- In simple words: Write a query or SQL script that answers only this request: Find customers with at least one delivered order using EXISTS.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find customers with at least one delivered order using EXISTS. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 02.06 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.06`
- Original ask: Return employees with their manager name via self join.
- In simple words: Write a query or SQL script that answers only this request: Return employees with their manager name via self join.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return employees with their manager name via self join. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 02.07 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.07`
- Original ask: Compute delivery duration in days for delivered shipments.
- In simple words: Write a query or SQL script that answers only this request: Compute delivery duration in days for delivered shipments.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Compute delivery duration in days for delivered shipments. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 02.08 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.08`
- Original ask: Find orders with no successful payment using NOT EXISTS.
- In simple words: Write a query or SQL script that answers only this request: Find orders with no successful payment using NOT EXISTS.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find orders with no successful payment using NOT EXISTS. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 02.09 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.09`
- Original ask: Use FULL OUTER JOIN to show cities present only on one side.
- In simple words: Write a query or SQL script that answers only this request: Use FULL OUTER JOIN to show cities present only on one side.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use FULL OUTER JOIN to show cities present only on one side. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 02.10 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.10`
- Original ask: Build one row per order with customer, sales rep, payment, shipment, item-count.
- In simple words: Write a query or SQL script that answers only this request: Build one row per order with customer, sales rep, payment, shipment, item-count.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build one row per order with customer, sales rep, payment, shipment, item-count. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 03.01 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.01`
- Original ask: Calculate net revenue per order from quantity, unit_price, discount_pct.
- In simple words: Write a query or SQL script that answers only this request: Calculate net revenue per order from quantity, unit_price, discount_pct.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate net revenue per order from quantity, unit_price, discount_pct. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 03.02 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.02`
- Original ask: Return total paid amount per customer for successful payments only.
- In simple words: Write a query or SQL script that answers only this request: Return total paid amount per customer for successful payments only.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return total paid amount per customer for successful payments only. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 03.03 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.03`
- Original ask: Count orders by status and channel.
- In simple words: Write a query or SQL script that answers only this request: Count orders by status and channel.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Count orders by status and channel. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 03.04 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.04`
- Original ask: Find customers with more than two orders, with count and latest order date.
- In simple words: Write a query or SQL script that answers only this request: Find customers with more than two orders, with count and latest order date.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find customers with more than two orders, with count and latest order date. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 03.05 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.05`
- Original ask: Compute average order value per month.
- In simple words: Write a query or SQL script that answers only this request: Compute average order value per month.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Compute average order value per month. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 03.06 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.06`
- Original ask: Count open/pending/closed tickets per priority using filtered aggregates.
- In simple words: Write a query or SQL script that answers only this request: Count open/pending/closed tickets per priority using filtered aggregates.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Count open/pending/closed tickets per priority using filtered aggregates. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 03.07 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.07`
- Original ask: Build monthly revenue with subtotal rows using ROLLUP.
- In simple words: Write a query or SQL script that answers only this request: Build monthly revenue with subtotal rows using ROLLUP.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build monthly revenue with subtotal rows using ROLLUP. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 03.08 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.08`
- Original ask: Return revenue by month, by channel, and grand total via GROUPING SETS.
- In simple words: Write a query or SQL script that answers only this request: Return revenue by month, by channel, and grand total via GROUPING SETS.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return revenue by month, by channel, and grand total via GROUPING SETS. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 03.09 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.09`
- Original ask: Return each customer with a comma-separated list of purchased categories.
- In simple words: Write a query or SQL script that answers only this request: Return each customer with a comma-separated list of purchased categories.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return each customer with a comma-separated list of purchased categories. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 03.10 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.10`
- Original ask: Return each order as a JSON array of product_name, quantity, net_amount.
- In simple words: Write a query or SQL script that answers only this request: Return each order as a JSON array of product_name, quantity, net_amount.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return each order as a JSON array of product_name, quantity, net_amount. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 04.01 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.01`
- Original ask: Return orders whose total is above the overall average order total.
- In simple words: Write a query or SQL script that answers only this request: Return orders whose total is above the overall average order total.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return orders whose total is above the overall average order total. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 04.02 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.02`
- Original ask: Return products priced above the average price of their category.
- In simple words: Write a query or SQL script that answers only this request: Return products priced above the average price of their category.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return products priced above the average price of their category. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 04.03 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.03`
- Original ask: Use a CTE for order totals, then rank customers by total spend.
- In simple words: Write a query or SQL script that answers only this request: Use a CTE for order totals, then rank customers by total spend.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use a CTE for order totals, then rank customers by total spend. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 04.04 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.04`
- Original ask: Use EXISTS to find customers who both ordered and opened a ticket.
- In simple words: Write a query or SQL script that answers only this request: Use EXISTS to find customers who both ordered and opened a ticket.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use EXISTS to find customers who both ordered and opened a ticket. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 04.05 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.05`
- Original ask: Return the latest payment per order using a correlated subquery.
- In simple words: Write a query or SQL script that answers only this request: Return the latest payment per order using a correlated subquery.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return the latest payment per order using a correlated subquery. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 04.06 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.06`
- Original ask: Build a CTE pipeline for gross, discount, net revenue, and payment status.
- In simple words: Write a query or SQL script that answers only this request: Build a CTE pipeline for gross, discount, net revenue, and payment status.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build a CTE pipeline for gross, discount, net revenue, and payment status. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 04.07 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.07`
- Original ask: Return each customer's most recent web event using LATERAL.
- In simple words: Write a query or SQL script that answers only this request: Return each customer's most recent web event using LATERAL.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return each customer's most recent web event using LATERAL. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 04.08 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.08`
- Original ask: Use LATERAL to return the top two products by quantity per customer.
- In simple words: Write a query or SQL script that answers only this request: Use LATERAL to return the top two products by quantity per customer.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use LATERAL to return the top two products by quantity per customer. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 04.09 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.09`
- Original ask: Use a recursive CTE to walk the employee manager hierarchy.
- In simple words: Write a query or SQL script that answers only this request: Use a recursive CTE to walk the employee manager hierarchy.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use a recursive CTE to walk the employee manager hierarchy. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 04.10 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.10`
- Original ask: Find customers whose spend exceeds their city's average lifetime spend.
- In simple words: Write a query or SQL script that answers only this request: Find customers whose spend exceeds their city's average lifetime spend.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find customers whose spend exceeds their city's average lifetime spend. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 05.01 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.01`
- Original ask: Return the first order per customer using ROW_NUMBER.
- In simple words: Write a query or SQL script that answers only this request: Return the first order per customer using ROW_NUMBER.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return the first order per customer using ROW_NUMBER. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/05_Window_Functions/task_05_window_functions.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 05.02 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.02`
- Original ask: Rank customers by lifetime net revenue using RANK and DENSE_RANK.
- In simple words: Write a query or SQL script that answers only this request: Rank customers by lifetime net revenue using RANK and DENSE_RANK.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Rank customers by lifetime net revenue using RANK and DENSE_RANK. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/05_Window_Functions/task_05_window_functions.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 05.03 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.03`
- Original ask: Use LAG to show previous order date and days between orders.
- In simple words: Write a query or SQL script that answers only this request: Use LAG to show previous order date and days between orders.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use LAG to show previous order date and days between orders. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/05_Window_Functions/task_05_window_functions.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 05.04 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.04`
- Original ask: Running total of daily successful payment amount.
- In simple words: Write a query or SQL script that answers only this request: Running total of daily successful payment amount.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Running total of daily successful payment amount. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/05_Window_Functions/task_05_window_functions.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 05.05 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.05`
- Original ask: Divide customers into revenue quartiles using NTILE.
- In simple words: Write a query or SQL script that answers only this request: Divide customers into revenue quartiles using NTILE.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Divide customers into revenue quartiles using NTILE. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/05_Window_Functions/task_05_window_functions.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 05.06 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.06`
- Original ask: Return the top three products by quantity per category.
- In simple words: Write a query or SQL script that answers only this request: Return the top three products by quantity per category.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return the top three products by quantity per category. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/05_Window_Functions/task_05_window_functions.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 05.07 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.07`
- Original ask: 7-day moving average of daily web event count.
- In simple words: Write a query or SQL script that answers only this request: 7-day moving average of daily web event count.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: 7-day moving average of daily web event count. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/05_Window_Functions/task_05_window_functions.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 05.08 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.08`
- Original ask: Each order's percentage of monthly revenue via SUM over partition.
- In simple words: Write a query or SQL script that answers only this request: Each order's percentage of monthly revenue via SUM over partition.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Each order's percentage of monthly revenue via SUM over partition. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/05_Window_Functions/task_05_window_functions.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 05.09 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.09`
- Original ask: Group consecutive daily activity into islands per customer.
- In simple words: Write a query or SQL script that answers only this request: Group consecutive daily activity into islands per customer.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Group consecutive daily activity into islands per customer. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/05_Window_Functions/task_05_window_functions.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 05.10 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.10`
- Original ask: Sessionize web events; new session after 30 minutes of inactivity.
- In simple words: Write a query or SQL script that answers only this request: Sessionize web events; new session after 30 minutes of inactivity.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Sessionize web events; new session after 30 minutes of inactivity. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/05_Window_Functions/task_05_window_functions.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 06.01 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.01`
- Original ask: Create product_reviews with rating 1-5 and one review per customer/product.
- In simple words: Write a query or SQL script that answers only this request: Create product_reviews with rating 1-5 and one review per customer/product.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create product_reviews with rating 1-5 and one review per customer/product. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 06.02 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.02`
- Original ask: Add a CHECK preventing shipments.delivered_at before shipped_at.
- In simple words: Write a query or SQL script that answers only this request: Add a CHECK preventing shipments.delivered_at before shipped_at.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Add a CHECK preventing shipments.delivered_at before shipped_at. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 06.03 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.03`
- Original ask: Add a generated net_line_amount column to order_items.
- In simple words: Write a query or SQL script that answers only this request: Add a generated net_line_amount column to order_items.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Add a generated net_line_amount column to order_items. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 06.04 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.04`
- Original ask: Add orders.sales_rep_id FK to employees with explicit delete behavior.
- In simple words: Write a query or SQL script that answers only this request: Add orders.sales_rep_id FK to employees with explicit delete behavior.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Add orders.sales_rep_id FK to employees with explicit delete behavior. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 06.05 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.05`
- Original ask: Split product category into a categories table referenced by products.
- In simple words: Write a query or SQL script that answers only this request: Split product category into a categories table referenced by products.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Split product category into a categories table referenced by products. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 06.06 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.06`
- Original ask: Create a campaign-product bridge table with composite primary key.
- In simple words: Write a query or SQL script that answers only this request: Create a campaign-product bridge table with composite primary key.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a campaign-product bridge table with composite primary key. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 06.07 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.07`
- Original ask: Create an audit table for order status transitions.
- In simple words: Write a query or SQL script that answers only this request: Create an audit table for order status transitions.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create an audit table for order status transitions. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 06.08 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.08`
- Original ask: Add an exclusion constraint preventing overlapping active subscriptions.
- In simple words: Write a query or SQL script that answers only this request: Add an exclusion constraint preventing overlapping active subscriptions.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Add an exclusion constraint preventing overlapping active subscriptions. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 06.09 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.09`
- Original ask: Create a monthly partitioned web_events_archive table.
- In simple words: Write a query or SQL script that answers only this request: Create a monthly partitioned web_events_archive table.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a monthly partitioned web_events_archive table. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 06.10 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.10`
- Original ask: Outline a star schema with fact_orders and customer/product/date dims.
- In simple words: Write a query or SQL script that answers only this request: Outline a star schema with fact_orders and customer/product/date dims.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Outline a star schema with fact_orders and customer/product/date dims. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 07.01 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.01`
- Original ask: Insert a customer and return the generated customer_id.
- In simple words: Write a query or SQL script that answers only this request: Insert a customer and return the generated customer_id.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Insert a customer and return the generated customer_id. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 07.02 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.02`
- Original ask: Bulk insert campaign rows from a VALUES clause.
- In simple words: Write a query or SQL script that answers only this request: Bulk insert campaign rows from a VALUES clause.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Bulk insert campaign rows from a VALUES clause. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 07.03 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.03`
- Original ask: Upsert a customer by email with ON CONFLICT.
- In simple words: Write a query or SQL script that answers only this request: Upsert a customer by email with ON CONFLICT.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Upsert a customer by email with ON CONFLICT. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 07.04 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.04`
- Original ask: Reset failed payments to pending for non-cancelled orders.
- In simple words: Write a query or SQL script that answers only this request: Reset failed payments to pending for non-cancelled orders.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Reset failed payments to pending for non-cancelled orders. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 07.05 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.05`
- Original ask: Mark orders delivered using UPDATE ... FROM joins.
- In simple words: Write a query or SQL script that answers only this request: Mark orders delivered using UPDATE ... FROM joins.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Mark orders delivered using UPDATE ... FROM joins. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 07.06 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.06`
- Original ask: Guard a risky status update with SAVEPOINT and rollback.
- In simple words: Write a query or SQL script that answers only this request: Guard a risky status update with SAVEPOINT and rollback.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Guard a risky status update with SAVEPOINT and rollback. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 07.07 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.07`
- Original ask: Sync a staging price table into products using MERGE.
- In simple words: Write a query or SQL script that answers only this request: Sync a staging price table into products using MERGE.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Sync a staging price table into products using MERGE. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 07.08 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.08`
- Original ask: Remove duplicate staging rows with DELETE ... USING, keep newest.
- In simple words: Write a query or SQL script that answers only this request: Remove duplicate staging rows with DELETE ... USING, keep newest.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Remove duplicate staging rows with DELETE ... USING, keep newest. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 07.09 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.09`
- Original ask: Insert a ticket and its first event in one writable CTE.
- In simple words: Write a query or SQL script that answers only this request: Insert a ticket and its first event in one writable CTE.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Insert a ticket and its first event in one writable CTE. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 07.10 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.10`
- Original ask: Write an idempotent daily load that can rerun without duplicates.
- In simple words: Write a query or SQL script that answers only this request: Write an idempotent daily load that can rerun without duplicates.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Write an idempotent daily load that can rerun without duplicates. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 08.01 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.01`
- Original ask: EXPLAIN a customer lookup by email and propose an index.
- In simple words: Write a query or SQL script that answers only this request: EXPLAIN a customer lookup by email and propose an index.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: EXPLAIN a customer lookup by email and propose an index. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 08.02 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.02`
- Original ask: Create a composite index for customer_id + order_date desc.
- In simple words: Write a query or SQL script that answers only this request: Create a composite index for customer_id + order_date desc.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a composite index for customer_id + order_date desc. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 08.03 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.03`
- Original ask: Create a partial index for open support tickets.
- In simple words: Write a query or SQL script that answers only this request: Create a partial index for open support tickets.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a partial index for open support tickets. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 08.04 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.04`
- Original ask: Create an expression index on lower(email) and use it.
- In simple words: Write a query or SQL script that answers only this request: Create an expression index on lower(email) and use it.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create an expression index on lower(email) and use it. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 08.05 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.05`
- Original ask: Create a covering index for payments by order_id including amount/status.
- In simple words: Write a query or SQL script that answers only this request: Create a covering index for payments by order_id including amount/status.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a covering index for payments by order_id including amount/status. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 08.06 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.06`
- Original ask: Rewrite a non-sargable date filter so an index can be used.
- In simple words: Write a query or SQL script that answers only this request: Rewrite a non-sargable date filter so an index can be used.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Rewrite a non-sargable date filter so an index can be used. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 08.07 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.07`
- Original ask: Create a GIN index on web_events.metadata and query by device.
- In simple words: Write a query or SQL script that answers only this request: Create a GIN index on web_events.metadata and query by device.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a GIN index on web_events.metadata and query by device. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 08.08 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.08`
- Original ask: Write keyset pagination using order_date and order_id.
- In simple words: Write a query or SQL script that answers only this request: Write keyset pagination using order_date and order_id.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Write keyset pagination using order_date and order_id. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 08.09 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.09`
- Original ask: Compare DISTINCT ON vs ROW_NUMBER plans for latest payment per order.
- In simple words: Write a query or SQL script that answers only this request: Compare DISTINCT ON vs ROW_NUMBER plans for latest payment per order.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Compare DISTINCT ON vs ROW_NUMBER plans for latest payment per order. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 08.10 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.10`
- Original ask: Design an indexing strategy for a month/city/status/channel dashboard.
- In simple words: Write a query or SQL script that answers only this request: Design an indexing strategy for a month/city/status/channel dashboard.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Design an indexing strategy for a month/city/status/channel dashboard. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 09.01 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.01`
- Original ask: Extract device, browser, referrer from web_events.metadata.
- In simple words: Write a query or SQL script that answers only this request: Extract device, browser, referrer from web_events.metadata.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Extract device, browser, referrer from web_events.metadata. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 09.02 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.02`
- Original ask: Normalize phone numbers to digits only with regexp_replace.
- In simple words: Write a query or SQL script that answers only this request: Normalize phone numbers to digits only with regexp_replace.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Normalize phone numbers to digits only with regexp_replace. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 09.03 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.03`
- Original ask: Aggregate event types per session into a text array.
- In simple words: Write a query or SQL script that answers only this request: Aggregate event types per session into a text array.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Aggregate event types per session into a text array. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 09.04 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.04`
- Original ask: Use unnest to turn a category array into rows.
- In simple words: Write a query or SQL script that answers only this request: Use unnest to turn a category array into rows.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use unnest to turn a category array into rows. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 09.05 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.05`
- Original ask: Build a daterange per subscription and test if 2026-04-15 is inside.
- In simple words: Write a query or SQL script that answers only this request: Build a daterange per subscription and test if 2026-04-15 is inside.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build a daterange per subscription and test if 2026-04-15 is inside. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 09.06 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.06`
- Original ask: Create a SQL function for net line amount and use it.
- In simple words: Write a query or SQL script that answers only this request: Create a SQL function for net line amount and use it.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a SQL function for net line amount and use it. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 09.07 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.07`
- Original ask: Create a tsvector search over support_tickets.subject.
- In simple words: Write a query or SQL script that answers only this request: Create a tsvector search over support_tickets.subject.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a tsvector search over support_tickets.subject. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 09.08 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.08`
- Original ask: Use DISTINCT ON for latest payment per order.
- In simple words: Write a query or SQL script that answers only this request: Use DISTINCT ON for latest payment per order.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use DISTINCT ON for latest payment per order. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 09.09 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.09`
- Original ask: Use FILTER aggregates to build compact pivot metrics.
- In simple words: Write a query or SQL script that answers only this request: Use FILTER aggregates to build compact pivot metrics.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use FILTER aggregates to build compact pivot metrics. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 09.10 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.10`
- Original ask: Create a composite type for gross/discount/net and return it.
- In simple words: Write a query or SQL script that answers only this request: Create a composite type for gross/discount/net and return it.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a composite type for gross/discount/net and return it. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 10.01 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.01`
- Original ask: Monthly revenue: gross, discount, net, paid, refunded, outstanding.
- In simple words: Write a query or SQL script that answers only this request: Monthly revenue: gross, discount, net, paid, refunded, outstanding.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Monthly revenue: gross, discount, net, paid, refunded, outstanding. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 10.02 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.02`
- Original ask: Customer LTV = successful payments minus refunds.
- In simple words: Write a query or SQL script that answers only this request: Customer LTV = successful payments minus refunds.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Customer LTV = successful payments minus refunds. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 10.03 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.03`
- Original ask: Signup cohort month vs first purchase month per customer.
- In simple words: Write a query or SQL script that answers only this request: Signup cohort month vs first purchase month per customer.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Signup cohort month vs first purchase month per customer. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 10.04 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.04`
- Original ask: SLA compliance for high-priority tickets closed within 24h.
- In simple words: Write a query or SQL script that answers only this request: SLA compliance for high-priority tickets closed within 24h.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: SLA compliance for high-priority tickets closed within 24h. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 10.05 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.05`
- Original ask: RFM segments from recency, frequency, monetary value.
- In simple words: Write a query or SQL script that answers only this request: RFM segments from recency, frequency, monetary value.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: RFM segments from recency, frequency, monetary value. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 10.06 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.06`
- Original ask: Funnel visit to view to cart to purchase from web_events.
- In simple words: Write a query or SQL script that answers only this request: Funnel visit to view to cart to purchase from web_events.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Funnel visit to view to cart to purchase from web_events. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 10.07 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.07`
- Original ask: Customer 360 row with spend, orders, tickets, activity, subscription.
- In simple words: Write a query or SQL script that answers only this request: Customer 360 row with spend, orders, tickets, activity, subscription.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Customer 360 row with spend, orders, tickets, activity, subscription. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 10.08 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.08`
- Original ask: Rolling 30-day active customer metric.
- In simple words: Write a query or SQL script that answers only this request: Rolling 30-day active customer metric.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Rolling 30-day active customer metric. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 10.09 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.09`
- Original ask: Retention matrix: cohort month vs months since signup.
- In simple words: Write a query or SQL script that answers only this request: Retention matrix: cohort month vs months since signup.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Retention matrix: cohort month vs months since signup. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 10.10 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.10`
- Original ask: MRR plus new, expansion, contraction, churned MRR.
- In simple words: Write a query or SQL script that answers only this request: MRR plus new, expansion, contraction, churned MRR.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: MRR plus new, expansion, contraction, churned MRR. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 11.01 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.01`
- Original ask: Reporting view exposing order totals but hiding customer email.
- In simple words: Write a query or SQL script that answers only this request: Reporting view exposing order totals but hiding customer email.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Reporting view exposing order totals but hiding customer email. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 11.02 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.02`
- Original ask: Masked customer view: email domain and last four phone digits only.
- In simple words: Write a query or SQL script that answers only this request: Masked customer view: email domain and last four phone digits only.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Masked customer view: email domain and last four phone digits only. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 11.03 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.03`
- Original ask: Daily revenue materialized view with a refresh command.
- In simple words: Write a query or SQL script that answers only this request: Daily revenue materialized view with a refresh command.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Daily revenue materialized view with a refresh command. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 11.04 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.04`
- Original ask: Grant SELECT on reporting views to a readonly_analyst role.
- In simple words: Write a query or SQL script that answers only this request: Grant SELECT on reporting views to a readonly_analyst role.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Grant SELECT on reporting views to a readonly_analyst role. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 11.05 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.05`
- Original ask: Support role that updates only ticket status and assignee.
- In simple words: Write a query or SQL script that answers only this request: Support role that updates only ticket status and assignee.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Support role that updates only ticket status and assignee. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 11.06 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.06`
- Original ask: Enable RLS on support_tickets; agents see only their tickets.
- In simple words: Write a query or SQL script that answers only this request: Enable RLS on support_tickets; agents see only their tickets.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Enable RLS on support_tickets; agents see only their tickets. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 11.07 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.07`
- Original ask: RLS policy so sales reps see only their orders.
- In simple words: Write a query or SQL script that answers only this request: RLS policy so sales reps see only their orders.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: RLS policy so sales reps see only their orders. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 11.08 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.08`
- Original ask: Security definer function returning customer lifetime spend.
- In simple words: Write a query or SQL script that answers only this request: Security definer function returning customer lifetime spend.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Security definer function returning customer lifetime spend. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 11.09 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.09`
- Original ask: Least-privilege matrix for analyst, support_agent, sales_rep, admin.
- In simple words: Write a query or SQL script that answers only this request: Least-privilege matrix for analyst, support_agent, sales_rep, admin.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Least-privilege matrix for analyst, support_agent, sales_rep, admin. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 11.10 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.10`
- Original ask: Secure partner sharing layer with campaign metrics only.
- In simple words: Write a query or SQL script that answers only this request: Secure partner sharing layer with campaign metrics only.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Secure partner sharing layer with campaign metrics only. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 12.01 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.01`
- Original ask: SQL function returning an order's net total.
- In simple words: Write a query or SQL script that answers only this request: SQL function returning an order's net total.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: SQL function returning an order's net total. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 12.02 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.02`
- Original ask: PL/pgSQL function returning customer lifetime spend.
- In simple words: Write a query or SQL script that answers only this request: PL/pgSQL function returning customer lifetime spend.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: PL/pgSQL function returning customer lifetime spend. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 12.03 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.03`
- Original ask: Trigger writing order status changes to an audit table.
- In simple words: Write a query or SQL script that answers only this request: Trigger writing order status changes to an audit table.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Trigger writing order status changes to an audit table. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 12.04 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.04`
- Original ask: Trigger updating products.updated_at when list_price changes.
- In simple words: Write a query or SQL script that answers only this request: Trigger updating products.updated_at when list_price changes.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Trigger updating products.updated_at when list_price changes. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 12.05 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.05`
- Original ask: Trigger preventing delivered orders from reverting to pending.
- In simple words: Write a query or SQL script that answers only this request: Trigger preventing delivered orders from reverting to pending.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Trigger preventing delivered orders from reverting to pending. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 12.06 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.06`
- Original ask: Procedure closing stale pending tickets older than N days.
- In simple words: Write a query or SQL script that answers only this request: Procedure closing stale pending tickets older than N days.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Procedure closing stale pending tickets older than N days. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 12.07 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.07`
- Original ask: Trigger auto-closing a ticket on a 'resolved' event.
- In simple words: Write a query or SQL script that answers only this request: Trigger auto-closing a ticket on a 'resolved' event.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Trigger auto-closing a ticket on a 'resolved' event. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 12.08 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.08`
- Original ask: Trigger maintaining inventory balance after movement inserts.
- In simple words: Write a query or SQL script that answers only this request: Trigger maintaining inventory balance after movement inserts.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Trigger maintaining inventory balance after movement inserts. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 12.09 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.09`
- Original ask: Reusable audit function using TG_TABLE_NAME across tables.
- In simple words: Write a query or SQL script that answers only this request: Reusable audit function using TG_TABLE_NAME across tables.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Reusable audit function using TG_TABLE_NAME across tables. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 12.10 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.10`
- Original ask: Test pack proving one trigger handles insert, update, invalid input.
- In simple words: Write a query or SQL script that answers only this request: Test pack proving one trigger handles insert, update, invalid input.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Test pack proving one trigger handles insert, update, invalid input. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 13.01 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.01`
- Original ask: Return rows where customers.email is null or duplicated.
- In simple words: Write a query or SQL script that answers only this request: Return rows where customers.email is null or duplicated.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return rows where customers.email is null or duplicated. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 13.02 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.02`
- Original ask: Return order_items with quantity <= 0 or unit_price < 0.
- In simple words: Write a query or SQL script that answers only this request: Return order_items with quantity <= 0 or unit_price < 0.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return order_items with quantity <= 0 or unit_price < 0. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 13.03 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.03`
- Original ask: Find shipments delivered before they were shipped.
- In simple words: Write a query or SQL script that answers only this request: Find shipments delivered before they were shipped.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find shipments delivered before they were shipped. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 13.04 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.04`
- Original ask: Find paid orders with no successful payment row.
- In simple words: Write a query or SQL script that answers only this request: Find paid orders with no successful payment row.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find paid orders with no successful payment row. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 13.05 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.05`
- Original ask: Reconcile order net total vs successful payment amount.
- In simple words: Write a query or SQL script that answers only this request: Reconcile order net total vs successful payment amount.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Reconcile order net total vs successful payment amount. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 13.06 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.06`
- Original ask: Detect duplicate web_events on session/event/time/url.
- In simple words: Write a query or SQL script that answers only this request: Detect duplicate web_events on session/event/time/url.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Detect duplicate web_events on session/event/time/url. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 13.07 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.07`
- Original ask: Profile null percentage for selected customer columns.
- In simple words: Write a query or SQL script that answers only this request: Profile null percentage for selected customer columns.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Profile null percentage for selected customer columns. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 13.08 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.08`
- Original ask: Flag daily revenue more than 3 std devs from trailing average.
- In simple words: Write a query or SQL script that answers only this request: Flag daily revenue more than 3 std devs from trailing average.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Flag daily revenue more than 3 std devs from trailing average. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 13.09 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.09`
- Original ask: Find impossible status combinations across orders/payments/shipments.
- In simple words: Write a query or SQL script that answers only this request: Find impossible status combinations across orders/payments/shipments.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find impossible status combinations across orders/payments/shipments. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 13.10 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.10`
- Original ask: Build a scorecard with test_name, failing_rows, severity, owner.
- In simple words: Write a query or SQL script that answers only this request: Build a scorecard with test_name, failing_rows, severity, owner.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build a scorecard with test_name, failing_rows, severity, owner. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 14.01 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.01`
- Original ask: Ecommerce reporting mart: fact_order_items + customer/product/date/campaign.
- In simple words: Write a query or SQL script that answers only this request: Ecommerce reporting mart: fact_order_items + customer/product/date/campaign.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Ecommerce reporting mart: fact_order_items + customer/product/date/campaign. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 14.02 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.02`
- Original ask: Customer 360 mart with documented refresh logic.
- In simple words: Write a query or SQL script that answers only this request: Customer 360 mart with documented refresh logic.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Customer 360 mart with documented refresh logic. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 14.03 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.03`
- Original ask: Subscription retention dashboard: cohort, active months, churn, MRR.
- In simple words: Write a query or SQL script that answers only this request: Subscription retention dashboard: cohort, active months, churn, MRR.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Subscription retention dashboard: cohort, active months, churn, MRR. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 14.04 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.04`
- Original ask: Support ops mart: SLA, backlog, reopen rate, workload, priority.
- In simple words: Write a query or SQL script that answers only this request: Support ops mart: SLA, backlog, reopen rate, workload, priority.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Support ops mart: SLA, backlog, reopen rate, workload, priority. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 14.05 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.05`
- Original ask: SQL-only ETL from staging.raw_orders into normalized orders/items.
- In simple words: Write a query or SQL script that answers only this request: SQL-only ETL from staging.raw_orders into normalized orders/items.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: SQL-only ETL from staging.raw_orders into normalized orders/items. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 14.06 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.06`
- Original ask: Audit mechanism for order and payment status changes.
- In simple words: Write a query or SQL script that answers only this request: Audit mechanism for order and payment status changes.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Audit mechanism for order and payment status changes. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 14.07 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.07`
- Original ask: Complete indexing plan for 360 + dashboards with EXPLAIN notes.
- In simple words: Write a query or SQL script that answers only this request: Complete indexing plan for 360 + dashboards with EXPLAIN notes.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Complete indexing plan for 360 + dashboards with EXPLAIN notes. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 14.08 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.08`
- Original ask: Row-level security model for regional reps and support agents.
- In simple words: Write a query or SQL script that answers only this request: Row-level security model for regional reps and support agents.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Row-level security model for regional reps and support agents. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 14.09 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.09`
- Original ask: Test pack validating constraints, transformations, and metrics.
- In simple words: Write a query or SQL script that answers only this request: Test pack validating constraints, transformations, and metrics.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Test pack validating constraints, transformations, and metrics. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

## Challenge 14.10 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.10`
- Original ask: Production readiness README: backup, restore, monitoring, deploy.
- In simple words: Write a query or SQL script that answers only this request: Production readiness README: backup, restore, monitoring, deploy.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Production readiness README: backup, restore, monitoring, deploy. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL. Place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, add the query in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. Inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected change without unintended side effects.

