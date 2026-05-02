# SQL Scenario Guide - Real-Life Expectations

Each SQL entry explains the business report or database operation behind the exercise, what can go wrong, what to write, and how to test it.

## Challenge 01.01 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.01`
- Original ask: Return each active customer with customer_id, full_name, email, city, and signup_date sorted by newest signup first.
- In simple words: Write a query or SQL script that answers only this request: Return each active customer with customer_id, full_name, email, city, and signup_date sorted by newest signup first.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return each active customer with customer_id, full_name, email, city, and signup_date sorted by newest signup first. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.01 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.02 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.02`
- Original ask: List paid orders placed in March 2026 with order_id, customer_id, order_date, channel, and status sorted by order_date then order_id.
- In simple words: Write a query or SQL script that answers only this request: List paid orders placed in March 2026 with order_id, customer_id, order_date, channel, and status sorted by order_date then order_id.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: List paid orders placed in March 2026 with order_id, customer_id, order_date, channel, and status sorted by order_date then order_id. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.02 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.03 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.03`
- Original ask: Find products whose list_price is between 50 and 250 and whose active flag is true, ordered by price descending.
- In simple words: Write a query or SQL script that answers only this request: Find products whose list_price is between 50 and 250 and whose active flag is true, ordered by price descending.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find products whose list_price is between 50 and 250 and whose active flag is true, ordered by price descending. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.03 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.04 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.04`
- Original ask: Return customers from either Bangalore, Mumbai, or Austin whose email ends with '.com'.
- In simple words: Write a query or SQL script that answers only this request: Return customers from either Bangalore, Mumbai, or Austin whose email ends with '.com'.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return customers from either Bangalore, Mumbai, or Austin whose email ends with '.com'. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.04 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.05 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.05`
- Original ask: Show orders where coupon_code is null and channel is not 'marketplace'.
- In simple words: Write a query or SQL script that answers only this request: Show orders where coupon_code is null and channel is not 'marketplace'.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Show orders where coupon_code is null and channel is not 'marketplace'. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.05 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.06 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.06`
- Original ask: Create a customer contact list that uses phone when present, otherwise email, as preferred_contact.
- In simple words: Write a query or SQL script that answers only this request: Create a customer contact list that uses phone when present, otherwise email, as preferred_contact.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a customer contact list that uses phone when present, otherwise email, as preferred_contact. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.06 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.07 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.07`
- Original ask: Label every order as 'fresh', 'recent', or 'older' based on order_date relative to 2026-04-01 using CASE.
- In simple words: Write a query or SQL script that answers only this request: Label every order as 'fresh', 'recent', or 'older' based on order_date relative to 2026-04-01 using CASE.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Label every order as 'fresh', 'recent', or 'older' based on order_date relative to 2026-04-01 using CASE. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.07 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.08 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.08`
- Original ask: Return the first 10 web events after 2026-03-01 for anonymous sessions where customer_id is null.
- In simple words: Write a query or SQL script that answers only this request: Return the first 10 web events after 2026-03-01 for anonymous sessions where customer_id is null.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return the first 10 web events after 2026-03-01 for anonymous sessions where customer_id is null. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.08 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.09 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.09`
- Original ask: Find support tickets with high or urgent priority that are not closed.
- In simple words: Write a query or SQL script that answers only this request: Find support tickets with high or urgent priority that are not closed.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find support tickets with high or urgent priority that are not closed. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.09 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.10 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.10`
- Original ask: Return distinct cities that appear in either customers.city or orders.shipping_city.
- In simple words: Write a query or SQL script that answers only this request: Return distinct cities that appear in either customers.city or orders.shipping_city.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return distinct cities that appear in either customers.city or orders.shipping_city. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.10 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.11 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.11`
- Original ask: List customers whose names contain the letter 'a' case-insensitively and sort by the position of the first 'a'.
- In simple words: Write a query or SQL script that answers only this request: List customers whose names contain the letter 'a' case-insensitively and sort by the position of the first 'a'.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: List customers whose names contain the letter 'a' case-insensitively and sort by the position of the first 'a'. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.11 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.12 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.12`
- Original ask: Return orders with a derived is_completed flag that is true only for delivered or refunded statuses.
- In simple words: Write a query or SQL script that answers only this request: Return orders with a derived is_completed flag that is true only for delivered or refunded statuses.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return orders with a derived is_completed flag that is true only for delivered or refunded statuses. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.12 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.13 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.13`
- Original ask: Find products where sku starts with 'BK-' or 'EL-' and the product name contains at least two words.
- In simple words: Write a query or SQL script that answers only this request: Find products where sku starts with 'BK-' or 'EL-' and the product name contains at least two words.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find products where sku starts with 'BK-' or 'EL-' and the product name contains at least two words. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.13 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.14 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.14`
- Original ask: Return payment rows where amount is not equal to 0 and status is not failed, sorted by absolute amount descending.
- In simple words: Write a query or SQL script that answers only this request: Return payment rows where amount is not equal to 0 and status is not failed, sorted by absolute amount descending.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return payment rows where amount is not equal to 0 and status is not failed, sorted by absolute amount descending. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.14 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.15 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.15`
- Original ask: Build a query that casts order_date to date and returns only weekend orders.
- In simple words: Write a query or SQL script that answers only this request: Build a query that casts order_date to date and returns only weekend orders.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build a query that casts order_date to date and returns only weekend orders. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.15 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.16 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.16`
- Original ask: Show web events whose metadata JSON contains a device value of 'mobile'.
- In simple words: Write a query or SQL script that answers only this request: Show web events whose metadata JSON contains a device value of 'mobile'.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Show web events whose metadata JSON contains a device value of 'mobile'. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.16 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.17 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.17`
- Original ask: Return orders paginated as page 3 with 5 rows per page using deterministic ordering.
- In simple words: Write a query or SQL script that answers only this request: Return orders paginated as page 3 with 5 rows per page using deterministic ordering.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return orders paginated as page 3 with 5 rows per page using deterministic ordering. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.17 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.18 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.18`
- Original ask: Find customers with signup_date in the last 90 days from 2026-04-30.
- In simple words: Write a query or SQL script that answers only this request: Find customers with signup_date in the last 90 days from 2026-04-30.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find customers with signup_date in the last 90 days from 2026-04-30. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.18 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.19 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.19`
- Original ask: Return a single column called entity_name that unions customer names and product names without duplicates.
- In simple words: Write a query or SQL script that answers only this request: Return a single column called entity_name that unions customer names and product names without duplicates.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return a single column called entity_name that unions customer names and product names without duplicates. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.19 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.20 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.20`
- Original ask: Return a single column called entity_name that unions customer names and product names while keeping duplicates.
- In simple words: Write a query or SQL script that answers only this request: Return a single column called entity_name that unions customer names and product names while keeping duplicates.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return a single column called entity_name that unions customer names and product names while keeping duplicates. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.20 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.21 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.21`
- Original ask: Show products with list_price rounded to the nearest 10 and sorted by the rounded value.
- In simple words: Write a query or SQL script that answers only this request: Show products with list_price rounded to the nearest 10 and sorted by the rounded value.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Show products with list_price rounded to the nearest 10 and sorted by the rounded value. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.21 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.22 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.22`
- Original ask: Filter orders where shipping_city differs from the customer's profile city.
- In simple words: Write a query or SQL script that answers only this request: Filter orders where shipping_city differs from the customer's profile city.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Filter orders where shipping_city differs from the customer's profile city. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.22 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.23 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.23`
- Original ask: Return tickets where subject has the word 'refund', 'delay', or 'login' using a regular expression.
- In simple words: Write a query or SQL script that answers only this request: Return tickets where subject has the word 'refund', 'delay', or 'login' using a regular expression.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return tickets where subject has the word 'refund', 'delay', or 'login' using a regular expression. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.23 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.24 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.24`
- Original ask: Create a compact order label in the format ORD-<order_id>-<channel> using string concatenation.
- In simple words: Write a query or SQL script that answers only this request: Create a compact order label in the format ORD-<order_id>-<channel> using string concatenation.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a compact order label in the format ORD-<order_id>-<channel> using string concatenation. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.24 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 01.25 - Task 01: Querying, Filtering, and Sorting
- File/folder: `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`
- Function/code to work on: `SQL statement for challenge 01.25`
- Original ask: Return customers with no state value and display 'UNKNOWN' as state_display.
- In simple words: Write a query or SQL script that answers only this request: Return customers with no state value and display 'UNKNOWN' as state_display.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return customers with no state value and display 'UNKNOWN' as state_display. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 01.25 after `SET search_path TO sql_mastery;` in `SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.01 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.01`
- Original ask: Return every order with customer full_name, email, order_date, status, and channel.
- In simple words: Write a query or SQL script that answers only this request: Return every order with customer full_name, email, order_date, status, and channel.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return every order with customer full_name, email, order_date, status, and channel. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.01 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.02 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.02`
- Original ask: Return each order item with order_id, product_name, category, quantity, unit_price, and line gross amount.
- In simple words: Write a query or SQL script that answers only this request: Return each order item with order_id, product_name, category, quantity, unit_price, and line gross amount.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return each order item with order_id, product_name, category, quantity, unit_price, and line gross amount. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.02 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.03 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.03`
- Original ask: List all customers and their orders, keeping customers who have never ordered.
- In simple words: Write a query or SQL script that answers only this request: List all customers and their orders, keeping customers who have never ordered.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: List all customers and their orders, keeping customers who have never ordered. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.03 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.04 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.04`
- Original ask: Find customers who have not placed any order using a LEFT JOIN anti join pattern.
- In simple words: Write a query or SQL script that answers only this request: Find customers who have not placed any order using a LEFT JOIN anti join pattern.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find customers who have not placed any order using a LEFT JOIN anti join pattern. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.04 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.05 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.05`
- Original ask: Find customers who have placed at least one delivered order using EXISTS or a semi join.
- In simple words: Write a query or SQL script that answers only this request: Find customers who have placed at least one delivered order using EXISTS or a semi join.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find customers who have placed at least one delivered order using EXISTS or a semi join. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.05 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.06 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.06`
- Original ask: Return employees with their manager name using a self join on employees.
- In simple words: Write a query or SQL script that answers only this request: Return employees with their manager name using a self join on employees.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return employees with their manager name using a self join on employees. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.06 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.07 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.07`
- Original ask: Return each support ticket with customer name, assigned employee name, and related order status when present.
- In simple words: Write a query or SQL script that answers only this request: Return each support ticket with customer name, assigned employee name, and related order status when present.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return each support ticket with customer name, assigned employee name, and related order status when present. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.07 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.08 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.08`
- Original ask: Join payments to orders and customers, but keep failed or unmatched payment investigations visible.
- In simple words: Write a query or SQL script that answers only this request: Join payments to orders and customers, but keep failed or unmatched payment investigations visible.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Join payments to orders and customers, but keep failed or unmatched payment investigations visible. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.08 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.09 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.09`
- Original ask: Find order_items whose stored unit_price differs from the current products.list_price.
- In simple words: Write a query or SQL script that answers only this request: Find order_items whose stored unit_price differs from the current products.list_price.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find order_items whose stored unit_price differs from the current products.list_price. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.09 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.10 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.10`
- Original ask: Return product categories and the number of distinct customers who bought each category.
- In simple words: Write a query or SQL script that answers only this request: Return product categories and the number of distinct customers who bought each category.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return product categories and the number of distinct customers who bought each category. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.10 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.11 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.11`
- Original ask: Find customer pairs from the same city without returning duplicate reversed pairs.
- In simple words: Write a query or SQL script that answers only this request: Find customer pairs from the same city without returning duplicate reversed pairs.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find customer pairs from the same city without returning duplicate reversed pairs. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.11 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.12 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.12`
- Original ask: Join shipments to orders and calculate delivery duration in days for delivered shipments.
- In simple words: Write a query or SQL script that answers only this request: Join shipments to orders and calculate delivery duration in days for delivered shipments.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Join shipments to orders and calculate delivery duration in days for delivered shipments. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.12 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.13 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.13`
- Original ask: Return customers who opened a support ticket before their first order date.
- In simple words: Write a query or SQL script that answers only this request: Return customers who opened a support ticket before their first order date.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return customers who opened a support ticket before their first order date. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.13 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.14 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.14`
- Original ask: Find orders that have no successful payment using a NOT EXISTS anti join.
- In simple words: Write a query or SQL script that answers only this request: Find orders that have no successful payment using a NOT EXISTS anti join.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find orders that have no successful payment using a NOT EXISTS anti join. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.14 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.15 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.15`
- Original ask: Return every marketing campaign with matching web events by utm_campaign, keeping campaigns with zero events.
- In simple words: Write a query or SQL script that answers only this request: Return every marketing campaign with matching web events by utm_campaign, keeping campaigns with zero events.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return every marketing campaign with matching web events by utm_campaign, keeping campaigns with zero events. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.15 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.16 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.16`
- Original ask: Join web_events to customers and orders where a purchase event occurs within 7 days before an order.
- In simple words: Write a query or SQL script that answers only this request: Join web_events to customers and orders where a purchase event occurs within 7 days before an order.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Join web_events to customers and orders where a purchase event occurs within 7 days before an order. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.16 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.17 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.17`
- Original ask: Find products that have inventory movements but have never appeared in order_items.
- In simple words: Write a query or SQL script that answers only this request: Find products that have inventory movements but have never appeared in order_items.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find products that have inventory movements but have never appeared in order_items. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.17 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.18 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.18`
- Original ask: Return sales reps and the customers they have served through orders, removing duplicates.
- In simple words: Write a query or SQL script that answers only this request: Return sales reps and the customers they have served through orders, removing duplicates.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return sales reps and the customers they have served through orders, removing duplicates. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.18 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.19 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.19`
- Original ask: Detect accidental row multiplication by joining orders, order_items, and payments and comparing row counts per order.
- In simple words: Write a query or SQL script that answers only this request: Detect accidental row multiplication by joining orders, order_items, and payments and comparing row counts per order.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Detect accidental row multiplication by joining orders, order_items, and payments and comparing row counts per order. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.19 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.20 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.20`
- Original ask: Use a FULL OUTER JOIN to compare customer cities against shipping cities and show cities present on only one side.
- In simple words: Write a query or SQL script that answers only this request: Use a FULL OUTER JOIN to compare customer cities against shipping cities and show cities present on only one side.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use a FULL OUTER JOIN to compare customer cities against shipping cities and show cities present on only one side. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.20 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.21 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.21`
- Original ask: Return tickets with their latest ticket_event by joining to a derived table.
- In simple words: Write a query or SQL script that answers only this request: Return tickets with their latest ticket_event by joining to a derived table.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return tickets with their latest ticket_event by joining to a derived table. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.21 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.22 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.22`
- Original ask: Find customers whose subscription active period overlaps their order date.
- In simple words: Write a query or SQL script that answers only this request: Find customers whose subscription active period overlaps their order date.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find customers whose subscription active period overlaps their order date. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.22 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.23 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.23`
- Original ask: Join products to order_items with a non-equi condition that flags line prices below 80 percent of list_price.
- In simple words: Write a query or SQL script that answers only this request: Join products to order_items with a non-equi condition that flags line prices below 80 percent of list_price.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Join products to order_items with a non-equi condition that flags line prices below 80 percent of list_price. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.23 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.24 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.24`
- Original ask: Return the department hierarchy with each employee and department name.
- In simple words: Write a query or SQL script that answers only this request: Return the department hierarchy with each employee and department name.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return the department hierarchy with each employee and department name. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.24 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 02.25 - Task 02: Joins and Relationships
- File/folder: `SQL/02_Joins_Relationships/task_02_joins_relationships.sql`
- Function/code to work on: `SQL statement for challenge 02.25`
- Original ask: Build an order fact query with one row per order containing customer, sales rep, payment, shipment, and item-count fields.
- In simple words: Write a query or SQL script that answers only this request: Build an order fact query with one row per order containing customer, sales rep, payment, shipment, and item-count fields.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build an order fact query with one row per order containing customer, sales rep, payment, shipment, and item-count fields. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 02.25 after `SET search_path TO sql_mastery;` in `SQL/02_Joins_Relationships/task_02_joins_relationships.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/02_Joins_Relationships/task_02_joins_relationships.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.01 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.01`
- Original ask: Calculate total revenue per order using order_items quantity, unit_price, and discount_pct.
- In simple words: Write a query or SQL script that answers only this request: Calculate total revenue per order using order_items quantity, unit_price, and discount_pct.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate total revenue per order using order_items quantity, unit_price, and discount_pct. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.01 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.02 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.02`
- Original ask: Return total paid amount per customer for successful payments only.
- In simple words: Write a query or SQL script that answers only this request: Return total paid amount per customer for successful payments only.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return total paid amount per customer for successful payments only. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.02 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.03 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.03`
- Original ask: Count orders by status and channel in a single grouped result.
- In simple words: Write a query or SQL script that answers only this request: Count orders by status and channel in a single grouped result.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Count orders by status and channel in a single grouped result. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.03 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.04 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.04`
- Original ask: Find customers with more than two orders and show order_count and latest_order_date.
- In simple words: Write a query or SQL script that answers only this request: Find customers with more than two orders and show order_count and latest_order_date.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find customers with more than two orders and show order_count and latest_order_date. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.04 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.05 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.05`
- Original ask: Return average order value per month based on line totals.
- In simple words: Write a query or SQL script that answers only this request: Return average order value per month based on line totals.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return average order value per month based on line totals. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.05 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.06 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.06`
- Original ask: Calculate product-level quantity sold, gross revenue, and average discount.
- In simple words: Write a query or SQL script that answers only this request: Calculate product-level quantity sold, gross revenue, and average discount.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate product-level quantity sold, gross revenue, and average discount. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.06 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.07 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.07`
- Original ask: Find categories where total quantity sold is greater than 10.
- In simple words: Write a query or SQL script that answers only this request: Find categories where total quantity sold is greater than 10.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find categories where total quantity sold is greater than 10. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.07 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.08 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.08`
- Original ask: Use filtered aggregates to count open, pending, and closed support tickets per priority.
- In simple words: Write a query or SQL script that answers only this request: Use filtered aggregates to count open, pending, and closed support tickets per priority.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use filtered aggregates to count open, pending, and closed support tickets per priority. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.08 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.09 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.09`
- Original ask: Return each sales rep with delivered_order_count and refunded_order_count.
- In simple words: Write a query or SQL script that answers only this request: Return each sales rep with delivered_order_count and refunded_order_count.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return each sales rep with delivered_order_count and refunded_order_count. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.09 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.10 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.10`
- Original ask: Calculate distinct customer count per marketing campaign using web_events.
- In simple words: Write a query or SQL script that answers only this request: Calculate distinct customer count per marketing campaign using web_events.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate distinct customer count per marketing campaign using web_events. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.10 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.11 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.11`
- Original ask: Build a monthly revenue report with subtotal rows using ROLLUP.
- In simple words: Write a query or SQL script that answers only this request: Build a monthly revenue report with subtotal rows using ROLLUP.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build a monthly revenue report with subtotal rows using ROLLUP. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.11 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.12 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.12`
- Original ask: Build a status-by-channel cube showing counts for every combination and subtotal.
- In simple words: Write a query or SQL script that answers only this request: Build a status-by-channel cube showing counts for every combination and subtotal.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build a status-by-channel cube showing counts for every combination and subtotal. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.12 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.13 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.13`
- Original ask: Use GROUPING SETS to return revenue by month, by channel, and grand total in one result.
- In simple words: Write a query or SQL script that answers only this request: Use GROUPING SETS to return revenue by month, by channel, and grand total in one result.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use GROUPING SETS to return revenue by month, by channel, and grand total in one result. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.13 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.14 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.14`
- Original ask: Calculate median payment amount per payment method.
- In simple words: Write a query or SQL script that answers only this request: Calculate median payment amount per payment method.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate median payment amount per payment method. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.14 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.15 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.15`
- Original ask: Calculate 90th percentile delivery duration by carrier.
- In simple words: Write a query or SQL script that answers only this request: Calculate 90th percentile delivery duration by carrier.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate 90th percentile delivery duration by carrier. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.15 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.16 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.16`
- Original ask: Return each customer with a comma-separated list of categories they purchased.
- In simple words: Write a query or SQL script that answers only this request: Return each customer with a comma-separated list of categories they purchased.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return each customer with a comma-separated list of categories they purchased. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.16 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.17 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.17`
- Original ask: Return each order as a JSON array of item objects containing product_name, quantity, and net_amount.
- In simple words: Write a query or SQL script that answers only this request: Return each order as a JSON array of item objects containing product_name, quantity, and net_amount.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return each order as a JSON array of item objects containing product_name, quantity, and net_amount. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.17 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.18 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.18`
- Original ask: Find duplicate customer email domains and count customers per domain.
- In simple words: Write a query or SQL script that answers only this request: Find duplicate customer email domains and count customers per domain.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find duplicate customer email domains and count customers per domain. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.18 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.19 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.19`
- Original ask: Compute support ticket average resolution hours by assigned employee.
- In simple words: Write a query or SQL script that answers only this request: Compute support ticket average resolution hours by assigned employee.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Compute support ticket average resolution hours by assigned employee. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.19 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.20 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.20`
- Original ask: Return products whose revenue contribution is more than 15 percent of total revenue.
- In simple words: Write a query or SQL script that answers only this request: Return products whose revenue contribution is more than 15 percent of total revenue.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return products whose revenue contribution is more than 15 percent of total revenue. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.20 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.21 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.21`
- Original ask: Calculate inventory net movement per product and keep only products with negative net movement.
- In simple words: Write a query or SQL script that answers only this request: Calculate inventory net movement per product and keep only products with negative net movement.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate inventory net movement per product and keep only products with negative net movement. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.21 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.22 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.22`
- Original ask: Find days where successful payment amount exceeded 500.
- In simple words: Write a query or SQL script that answers only this request: Find days where successful payment amount exceeded 500.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find days where successful payment amount exceeded 500. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.22 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.23 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.23`
- Original ask: Compute monthly active customers based on any web_event or order activity.
- In simple words: Write a query or SQL script that answers only this request: Compute monthly active customers based on any web_event or order activity.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Compute monthly active customers based on any web_event or order activity. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.23 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.24 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.24`
- Original ask: Group subscriptions by plan_name and status and calculate monthly recurring revenue.
- In simple words: Write a query or SQL script that answers only this request: Group subscriptions by plan_name and status and calculate monthly recurring revenue.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Group subscriptions by plan_name and status and calculate monthly recurring revenue. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.24 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 03.25 - Task 03: Aggregation and Grouping
- File/folder: `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`
- Function/code to work on: `SQL statement for challenge 03.25`
- Original ask: Return each city with customers_count, order_count, and total_revenue while avoiding double counting.
- In simple words: Write a query or SQL script that answers only this request: Return each city with customers_count, order_count, and total_revenue while avoiding double counting.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return each city with customers_count, order_count, and total_revenue while avoiding double counting. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 03.25 after `SET search_path TO sql_mastery;` in `SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/03_Aggregation_Grouping/task_03_aggregation_grouping.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.01 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.01`
- Original ask: Return orders whose total line amount is above the overall average order total.
- In simple words: Write a query or SQL script that answers only this request: Return orders whose total line amount is above the overall average order total.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return orders whose total line amount is above the overall average order total. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.01 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.02 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.02`
- Original ask: Find customers whose first order was paid successfully within 2 days.
- In simple words: Write a query or SQL script that answers only this request: Find customers whose first order was paid successfully within 2 days.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find customers whose first order was paid successfully within 2 days. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.02 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.03 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.03`
- Original ask: Use a CTE to calculate order totals, then rank customers by total spend.
- In simple words: Write a query or SQL script that answers only this request: Use a CTE to calculate order totals, then rank customers by total spend.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use a CTE to calculate order totals, then rank customers by total spend. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.03 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.04 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.04`
- Original ask: Use NOT EXISTS to find products that were never ordered after 2026-03-01.
- In simple words: Write a query or SQL script that answers only this request: Use NOT EXISTS to find products that were never ordered after 2026-03-01.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use NOT EXISTS to find products that were never ordered after 2026-03-01. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.04 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.05 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.05`
- Original ask: Use EXISTS to find customers who both ordered and opened a support ticket.
- In simple words: Write a query or SQL script that answers only this request: Use EXISTS to find customers who both ordered and opened a support ticket.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use EXISTS to find customers who both ordered and opened a support ticket. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.05 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.06 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.06`
- Original ask: Return the latest payment per order using a correlated subquery.
- In simple words: Write a query or SQL script that answers only this request: Return the latest payment per order using a correlated subquery.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return the latest payment per order using a correlated subquery. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.06 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.07 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.07`
- Original ask: Return each customer with their most recent web event using a LATERAL join.
- In simple words: Write a query or SQL script that answers only this request: Return each customer with their most recent web event using a LATERAL join.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return each customer with their most recent web event using a LATERAL join. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.07 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.08 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.08`
- Original ask: Use a recursive CTE to walk the employee manager hierarchy from the CEO downward.
- In simple words: Write a query or SQL script that answers only this request: Use a recursive CTE to walk the employee manager hierarchy from the CEO downward.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use a recursive CTE to walk the employee manager hierarchy from the CEO downward. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.08 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.09 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.09`
- Original ask: Use a recursive CTE to return the chain of managers for one employee.
- In simple words: Write a query or SQL script that answers only this request: Use a recursive CTE to return the chain of managers for one employee.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use a recursive CTE to return the chain of managers for one employee. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.09 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.10 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.10`
- Original ask: Build a CTE pipeline that calculates gross revenue, discounts, net revenue, and payment status per order.
- In simple words: Write a query or SQL script that answers only this request: Build a CTE pipeline that calculates gross revenue, discounts, net revenue, and payment status per order.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build a CTE pipeline that calculates gross revenue, discounts, net revenue, and payment status per order. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.10 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.11 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.11`
- Original ask: Find customers whose lifetime spend is greater than the average lifetime spend of their city.
- In simple words: Write a query or SQL script that answers only this request: Find customers whose lifetime spend is greater than the average lifetime spend of their city.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find customers whose lifetime spend is greater than the average lifetime spend of their city. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.11 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.12 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.12`
- Original ask: Use a scalar subquery in SELECT to show each product's share of all product revenue.
- In simple words: Write a query or SQL script that answers only this request: Use a scalar subquery in SELECT to show each product's share of all product revenue.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use a scalar subquery in SELECT to show each product's share of all product revenue. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.12 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.13 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.13`
- Original ask: Find orders where every order item has a discount_pct of zero.
- In simple words: Write a query or SQL script that answers only this request: Find orders where every order item has a discount_pct of zero.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find orders where every order item has a discount_pct of zero. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.13 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.14 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.14`
- Original ask: Find orders where at least one item was discounted by more than 10 percent.
- In simple words: Write a query or SQL script that answers only this request: Find orders where at least one item was discounted by more than 10 percent.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find orders where at least one item was discounted by more than 10 percent. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.14 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.15 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.15`
- Original ask: Use CTEs to identify customers with a web visit, cart event, and purchase event in sequence.
- In simple words: Write a query or SQL script that answers only this request: Use CTEs to identify customers with a web visit, cart event, and purchase event in sequence.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use CTEs to identify customers with a web visit, cart event, and purchase event in sequence. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.15 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.16 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.16`
- Original ask: Return products priced above the average price of their category.
- In simple words: Write a query or SQL script that answers only this request: Return products priced above the average price of their category.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return products priced above the average price of their category. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.16 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.17 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.17`
- Original ask: Use LATERAL to return the top two products by quantity for each customer.
- In simple words: Write a query or SQL script that answers only this request: Use LATERAL to return the top two products by quantity for each customer.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use LATERAL to return the top two products by quantity for each customer. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.17 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.18 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.18`
- Original ask: Find tickets whose latest event is not a customer reply.
- In simple words: Write a query or SQL script that answers only this request: Find tickets whose latest event is not a customer reply.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find tickets whose latest event is not a customer reply. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.18 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.19 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.19`
- Original ask: Use a CTE to deduplicate web events by session_id, event_type, and occurred_at.
- In simple words: Write a query or SQL script that answers only this request: Use a CTE to deduplicate web events by session_id, event_type, and occurred_at.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use a CTE to deduplicate web events by session_id, event_type, and occurred_at. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.19 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.20 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.20`
- Original ask: Compare monthly revenue to the previous month using CTEs without window functions.
- In simple words: Write a query or SQL script that answers only this request: Compare monthly revenue to the previous month using CTEs without window functions.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Compare monthly revenue to the previous month using CTEs without window functions. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.20 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.21 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.21`
- Original ask: Use a CTE to isolate failed payments, then join to orders and customers for a retry report.
- In simple words: Write a query or SQL script that answers only this request: Use a CTE to isolate failed payments, then join to orders and customers for a retry report.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use a CTE to isolate failed payments, then join to orders and customers for a retry report. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.21 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.22 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.22`
- Original ask: Find customers with an active subscription but no order in the last 30 days from 2026-04-30.
- In simple words: Write a query or SQL script that answers only this request: Find customers with an active subscription but no order in the last 30 days from 2026-04-30.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find customers with an active subscription but no order in the last 30 days from 2026-04-30. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.22 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.23 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.23`
- Original ask: Use nested CTEs to compute category revenue and return categories above the category average.
- In simple words: Write a query or SQL script that answers only this request: Use nested CTEs to compute category revenue and return categories above the category average.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use nested CTEs to compute category revenue and return categories above the category average. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.23 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.24 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.24`
- Original ask: Use a derived table to find each customer's highest value order.
- In simple words: Write a query or SQL script that answers only this request: Use a derived table to find each customer's highest value order.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use a derived table to find each customer's highest value order. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.24 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 04.25 - Task 04: Subqueries and CTEs
- File/folder: `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`
- Function/code to work on: `SQL statement for challenge 04.25`
- Original ask: Write the same top-customer query once with a subquery and once with a CTE, then compare readability.
- In simple words: Write a query or SQL script that answers only this request: Write the same top-customer query once with a subquery and once with a CTE, then compare readability.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Write the same top-customer query once with a subquery and once with a CTE, then compare readability. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 04.25 after `SET search_path TO sql_mastery;` in `SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/04_Subqueries_CTEs/task_04_subqueries_ctes.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.01 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.01`
- Original ask: Rank customers by lifetime net revenue using RANK and DENSE_RANK.
- In simple words: Write a query or SQL script that answers only this request: Rank customers by lifetime net revenue using RANK and DENSE_RANK.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Rank customers by lifetime net revenue using RANK and DENSE_RANK. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.01 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.02 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.02`
- Original ask: Return the first order per customer using ROW_NUMBER.
- In simple words: Write a query or SQL script that answers only this request: Return the first order per customer using ROW_NUMBER.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return the first order per customer using ROW_NUMBER. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.02 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.03 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.03`
- Original ask: Return the latest support ticket event per ticket using ROW_NUMBER.
- In simple words: Write a query or SQL script that answers only this request: Return the latest support ticket event per ticket using ROW_NUMBER.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return the latest support ticket event per ticket using ROW_NUMBER. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.03 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.04 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.04`
- Original ask: Calculate a running total of daily successful payment amount.
- In simple words: Write a query or SQL script that answers only this request: Calculate a running total of daily successful payment amount.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate a running total of daily successful payment amount. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.04 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.05 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.05`
- Original ask: Calculate a 7-day moving average of daily web event count.
- In simple words: Write a query or SQL script that answers only this request: Calculate a 7-day moving average of daily web event count.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate a 7-day moving average of daily web event count. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.05 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.06 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.06`
- Original ask: Use LAG to show the previous order date for each customer and days between orders.
- In simple words: Write a query or SQL script that answers only this request: Use LAG to show the previous order date for each customer and days between orders.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use LAG to show the previous order date for each customer and days between orders. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.06 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.07 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.07`
- Original ask: Use LEAD to show the next ticket event time for each ticket.
- In simple words: Write a query or SQL script that answers only this request: Use LEAD to show the next ticket event time for each ticket.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use LEAD to show the next ticket event time for each ticket. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.07 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.08 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.08`
- Original ask: Find orders where order total is greater than the customer's previous order total.
- In simple words: Write a query or SQL script that answers only this request: Find orders where order total is greater than the customer's previous order total.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find orders where order total is greater than the customer's previous order total. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.08 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.09 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.09`
- Original ask: Compute percent_rank of products by revenue within each category.
- In simple words: Write a query or SQL script that answers only this request: Compute percent_rank of products by revenue within each category.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Compute percent_rank of products by revenue within each category. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.09 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.10 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.10`
- Original ask: Divide customers into revenue quartiles using NTILE.
- In simple words: Write a query or SQL script that answers only this request: Divide customers into revenue quartiles using NTILE.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Divide customers into revenue quartiles using NTILE. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.10 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.11 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.11`
- Original ask: Return the top three products by quantity sold within each category.
- In simple words: Write a query or SQL script that answers only this request: Return the top three products by quantity sold within each category.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return the top three products by quantity sold within each category. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.11 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.12 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.12`
- Original ask: Use FIRST_VALUE to show each customer's first channel and compare it to later channels.
- In simple words: Write a query or SQL script that answers only this request: Use FIRST_VALUE to show each customer's first channel and compare it to later channels.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use FIRST_VALUE to show each customer's first channel and compare it to later channels. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.12 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.13 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.13`
- Original ask: Use LAST_VALUE with an explicit frame to show each customer's latest order status on every order row.
- In simple words: Write a query or SQL script that answers only this request: Use LAST_VALUE with an explicit frame to show each customer's latest order status on every order row.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use LAST_VALUE with an explicit frame to show each customer's latest order status on every order row. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.13 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.14 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.14`
- Original ask: Calculate cumulative subscription monthly recurring revenue by start month.
- In simple words: Write a query or SQL script that answers only this request: Calculate cumulative subscription monthly recurring revenue by start month.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate cumulative subscription monthly recurring revenue by start month. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.14 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.15 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.15`
- Original ask: Detect gaps of more than 14 days between customer web sessions.
- In simple words: Write a query or SQL script that answers only this request: Detect gaps of more than 14 days between customer web sessions.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Detect gaps of more than 14 days between customer web sessions. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.15 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.16 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.16`
- Original ask: Group consecutive daily activity into islands per customer.
- In simple words: Write a query or SQL script that answers only this request: Group consecutive daily activity into islands per customer.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Group consecutive daily activity into islands per customer. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.16 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.17 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.17`
- Original ask: Calculate each order's percentage of monthly revenue using SUM over a partition.
- In simple words: Write a query or SQL script that answers only this request: Calculate each order's percentage of monthly revenue using SUM over a partition.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate each order's percentage of monthly revenue using SUM over a partition. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.17 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.18 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.18`
- Original ask: Return products whose price is above the category average using AVG as a window function.
- In simple words: Write a query or SQL script that answers only this request: Return products whose price is above the category average using AVG as a window function.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Return products whose price is above the category average using AVG as a window function. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.18 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.19 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.19`
- Original ask: Calculate support ticket resolution-time rank by priority.
- In simple words: Write a query or SQL script that answers only this request: Calculate support ticket resolution-time rank by priority.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate support ticket resolution-time rank by priority. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.19 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.20 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.20`
- Original ask: Use COUNT over to show total orders per customer without collapsing rows.
- In simple words: Write a query or SQL script that answers only this request: Use COUNT over to show total orders per customer without collapsing rows.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use COUNT over to show total orders per customer without collapsing rows. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.20 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.21 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.21`
- Original ask: Build a cohort table using MIN signup month over customer partitions.
- In simple words: Write a query or SQL script that answers only this request: Build a cohort table using MIN signup month over customer partitions.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build a cohort table using MIN signup month over customer partitions. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.21 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.22 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.22`
- Original ask: Calculate running inventory balance per product ordered by movement_at.
- In simple words: Write a query or SQL script that answers only this request: Calculate running inventory balance per product ordered by movement_at.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate running inventory balance per product ordered by movement_at. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.22 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.23 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.23`
- Original ask: Find the first failed payment after a successful payment for each customer.
- In simple words: Write a query or SQL script that answers only this request: Find the first failed payment after a successful payment for each customer.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find the first failed payment after a successful payment for each customer. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.23 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.24 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.24`
- Original ask: Compare each employee's closed ticket count to their department average using window aggregates.
- In simple words: Write a query or SQL script that answers only this request: Compare each employee's closed ticket count to their department average using window aggregates.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Compare each employee's closed ticket count to their department average using window aggregates. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.24 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 05.25 - Task 05: Window Functions
- File/folder: `SQL/05_Window_Functions/task_05_window_functions.sql`
- Function/code to work on: `SQL statement for challenge 05.25`
- Original ask: Create a sessionized web_event result where a new session group starts after 30 minutes of inactivity.
- In simple words: Write a query or SQL script that answers only this request: Create a sessionized web_event result where a new session group starts after 30 minutes of inactivity.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a sessionized web_event result where a new session group starts after 30 minutes of inactivity. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 05.25 after `SET search_path TO sql_mastery;` in `SQL/05_Window_Functions/task_05_window_functions.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/05_Window_Functions/task_05_window_functions.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.01 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.01`
- Original ask: Design a normalized returns table linked to orders, order_items, customers, and products.
- In simple words: Write a query or SQL script that answers only this request: Design a normalized returns table linked to orders, order_items, customers, and products.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Design a normalized returns table linked to orders, order_items, customers, and products. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.01 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.02 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.02`
- Original ask: Create a product_reviews table with rating constrained from 1 to 5 and one review per customer per product.
- In simple words: Write a query or SQL script that answers only this request: Create a product_reviews table with rating constrained from 1 to 5 and one review per customer per product.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a product_reviews table with rating constrained from 1 to 5 and one review per customer per product. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.02 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.03 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.03`
- Original ask: Add a generated column to order_items that stores net_line_amount.
- In simple words: Write a query or SQL script that answers only this request: Add a generated column to order_items that stores net_line_amount.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Add a generated column to order_items that stores net_line_amount. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.03 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.04 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.04`
- Original ask: Create a domain for positive_money and use it on a new vendor_contracts table.
- In simple words: Write a query or SQL script that answers only this request: Create a domain for positive_money and use it on a new vendor_contracts table.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a domain for positive_money and use it on a new vendor_contracts table. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.04 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.05 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.05`
- Original ask: Create an enum for ticket_event_type and migrate ticket_events.event_type to use it.
- In simple words: Write a query or SQL script that answers only this request: Create an enum for ticket_event_type and migrate ticket_events.event_type to use it.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create an enum for ticket_event_type and migrate ticket_events.event_type to use it. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.05 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.06 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.06`
- Original ask: Add a CHECK constraint that prevents shipments.delivered_at before shipments.shipped_at.
- In simple words: Write a query or SQL script that answers only this request: Add a CHECK constraint that prevents shipments.delivered_at before shipments.shipped_at.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Add a CHECK constraint that prevents shipments.delivered_at before shipments.shipped_at. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.06 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.07 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.07`
- Original ask: Add a foreign key from orders.sales_rep_id to employees.employee_id with an explicit delete behavior.
- In simple words: Write a query or SQL script that answers only this request: Add a foreign key from orders.sales_rep_id to employees.employee_id with an explicit delete behavior.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Add a foreign key from orders.sales_rep_id to employees.employee_id with an explicit delete behavior. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.07 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.08 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.08`
- Original ask: Create a staging schema and a raw_orders table that accepts loose text fields.
- In simple words: Write a query or SQL script that answers only this request: Create a staging schema and a raw_orders table that accepts loose text fields.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a staging schema and a raw_orders table that accepts loose text fields. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.08 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.09 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.09`
- Original ask: Design a slowly changing dimension table for customer addresses.
- In simple words: Write a query or SQL script that answers only this request: Design a slowly changing dimension table for customer addresses.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Design a slowly changing dimension table for customer addresses. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.09 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.10 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.10`
- Original ask: Split product category into a separate categories table and update products to reference it.
- In simple words: Write a query or SQL script that answers only this request: Split product category into a separate categories table and update products to reference it.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Split product category into a separate categories table and update products to reference it. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.10 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.11 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.11`
- Original ask: Create a bridge table for campaigns and products with a composite primary key.
- In simple words: Write a query or SQL script that answers only this request: Create a bridge table for campaigns and products with a composite primary key.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a bridge table for campaigns and products with a composite primary key. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.11 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.12 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.12`
- Original ask: Add a unique constraint that prevents duplicate active subscriptions for the same customer and plan.
- In simple words: Write a query or SQL script that answers only this request: Add a unique constraint that prevents duplicate active subscriptions for the same customer and plan.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Add a unique constraint that prevents duplicate active subscriptions for the same customer and plan. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.12 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.13 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.13`
- Original ask: Create an audit table for order status transitions with old_status, new_status, and changed_at.
- In simple words: Write a query or SQL script that answers only this request: Create an audit table for order status transitions with old_status, new_status, and changed_at.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create an audit table for order status transitions with old_status, new_status, and changed_at. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.13 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.14 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.14`
- Original ask: Create a monthly partitioned table for web_events_archive.
- In simple words: Write a query or SQL script that answers only this request: Create a monthly partitioned table for web_events_archive.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a monthly partitioned table for web_events_archive. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.14 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.15 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.15`
- Original ask: Create a temporary table that stores one month's high-value customers for analysis.
- In simple words: Write a query or SQL script that answers only this request: Create a temporary table that stores one month's high-value customers for analysis.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a temporary table that stores one month's high-value customers for analysis. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.15 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.16 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.16`
- Original ask: Create a view-friendly star schema outline with fact_orders and dimensions for customer, product, and date.
- In simple words: Write a query or SQL script that answers only this request: Create a view-friendly star schema outline with fact_orders and dimensions for customer, product, and date.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a view-friendly star schema outline with fact_orders and dimensions for customer, product, and date. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.16 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.17 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.17`
- Original ask: Use ALTER TABLE to add a NOT NULL constraint safely for customers.country.
- In simple words: Write a query or SQL script that answers only this request: Use ALTER TABLE to add a NOT NULL constraint safely for customers.country.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use ALTER TABLE to add a NOT NULL constraint safely for customers.country. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.17 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.18 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.18`
- Original ask: Create a table with a JSONB column and a CHECK constraint that validates required metadata keys.
- In simple words: Write a query or SQL script that answers only this request: Create a table with a JSONB column and a CHECK constraint that validates required metadata keys.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a table with a JSONB column and a CHECK constraint that validates required metadata keys. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.18 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.19 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.19`
- Original ask: Design a many-to-many relationship between employees and departments with assignment dates.
- In simple words: Write a query or SQL script that answers only this request: Design a many-to-many relationship between employees and departments with assignment dates.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Design a many-to-many relationship between employees and departments with assignment dates. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.19 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.20 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.20`
- Original ask: Create an exclusion constraint to prevent overlapping active subscription periods per customer and plan.
- In simple words: Write a query or SQL script that answers only this request: Create an exclusion constraint to prevent overlapping active subscription periods per customer and plan.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create an exclusion constraint to prevent overlapping active subscription periods per customer and plan. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.20 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.21 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.21`
- Original ask: Add comments on tables and columns for support_tickets and ticket_events.
- In simple words: Write a query or SQL script that answers only this request: Add comments on tables and columns for support_tickets and ticket_events.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Add comments on tables and columns for support_tickets and ticket_events. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.21 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.22 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.22`
- Original ask: Create a materialized view definition for daily revenue summary.
- In simple words: Write a query or SQL script that answers only this request: Create a materialized view definition for daily revenue summary.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a materialized view definition for daily revenue summary. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.22 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.23 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.23`
- Original ask: Design a data retention table policy using partition naming and drop strategy comments.
- In simple words: Write a query or SQL script that answers only this request: Design a data retention table policy using partition naming and drop strategy comments.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Design a data retention table policy using partition naming and drop strategy comments. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.23 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.24 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.24`
- Original ask: Create a migration script that renames coupon_code to promotion_code without losing data.
- In simple words: Write a query or SQL script that answers only this request: Create a migration script that renames coupon_code to promotion_code without losing data.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a migration script that renames coupon_code to promotion_code without losing data. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.24 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 06.25 - Task 06: Data Modeling and DDL
- File/folder: `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`
- Function/code to work on: `SQL statement for challenge 06.25`
- Original ask: Write a rollback script for one DDL change from this module.
- In simple words: Write a query or SQL script that answers only this request: Write a rollback script for one DDL change from this module.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Write a rollback script for one DDL change from this module. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 06.25 after `SET search_path TO sql_mastery;` in `SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/06_Data_Modeling_DDL/task_06_data_modeling_ddl.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.01 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.01`
- Original ask: Insert a new customer and return the generated customer_id.
- In simple words: Write a query or SQL script that answers only this request: Insert a new customer and return the generated customer_id.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Insert a new customer and return the generated customer_id. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.01 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.02 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.02`
- Original ask: Insert an order with two order_items inside one transaction.
- In simple words: Write a query or SQL script that answers only this request: Insert an order with two order_items inside one transaction.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Insert an order with two order_items inside one transaction. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.02 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.03 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.03`
- Original ask: Update failed payments back to 'pending' for retry only for orders that are not cancelled.
- In simple words: Write a query or SQL script that answers only this request: Update failed payments back to 'pending' for retry only for orders that are not cancelled.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Update failed payments back to 'pending' for retry only for orders that are not cancelled. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.03 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.04 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.04`
- Original ask: Delete anonymous web_events older than 90 days from 2026-04-30 using a safe preview query first.
- In simple words: Write a query or SQL script that answers only this request: Delete anonymous web_events older than 90 days from 2026-04-30 using a safe preview query first.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Delete anonymous web_events older than 90 days from 2026-04-30 using a safe preview query first. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.04 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.05 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.05`
- Original ask: Use INSERT ... ON CONFLICT to upsert a customer by email.
- In simple words: Write a query or SQL script that answers only this request: Use INSERT ... ON CONFLICT to upsert a customer by email.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use INSERT ... ON CONFLICT to upsert a customer by email. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.05 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.06 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.06`
- Original ask: Use MERGE to synchronize a staging product price table into products.
- In simple words: Write a query or SQL script that answers only this request: Use MERGE to synchronize a staging product price table into products.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use MERGE to synchronize a staging product price table into products. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.06 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.07 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.07`
- Original ask: Use UPDATE ... FROM to set orders.status to 'delivered' for shipments with delivered_at present and successful payment.
- In simple words: Write a query or SQL script that answers only this request: Use UPDATE ... FROM to set orders.status to 'delivered' for shipments with delivered_at present and successful payment.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use UPDATE ... FROM to set orders.status to 'delivered' for shipments with delivered_at present and successful payment. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.07 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.08 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.08`
- Original ask: Use RETURNING to capture changed order_ids into a follow-up query.
- In simple words: Write a query or SQL script that answers only this request: Use RETURNING to capture changed order_ids into a follow-up query.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use RETURNING to capture changed order_ids into a follow-up query. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.08 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.09 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.09`
- Original ask: Create a transaction with SAVEPOINT around a risky order status update.
- In simple words: Write a query or SQL script that answers only this request: Create a transaction with SAVEPOINT around a risky order status update.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a transaction with SAVEPOINT around a risky order status update. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.09 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.10 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.10`
- Original ask: Write a transaction that transfers ticket ownership from one employee to another.
- In simple words: Write a query or SQL script that answers only this request: Write a transaction that transfers ticket ownership from one employee to another.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Write a transaction that transfers ticket ownership from one employee to another. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.10 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.11 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.11`
- Original ask: Demonstrate how SELECT FOR UPDATE would protect inventory during order creation.
- In simple words: Write a query or SQL script that answers only this request: Demonstrate how SELECT FOR UPDATE would protect inventory during order creation.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Demonstrate how SELECT FOR UPDATE would protect inventory during order creation. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.11 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.12 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.12`
- Original ask: Write two statements that could deadlock if run in opposite order, then reorder them safely.
- In simple words: Write a query or SQL script that answers only this request: Write two statements that could deadlock if run in opposite order, then reorder them safely.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Write two statements that could deadlock if run in opposite order, then reorder them safely. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.12 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.13 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.13`
- Original ask: Use DELETE with USING to remove duplicate staging rows while keeping the newest row.
- In simple words: Write a query or SQL script that answers only this request: Use DELETE with USING to remove duplicate staging rows while keeping the newest row.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use DELETE with USING to remove duplicate staging rows while keeping the newest row. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.13 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.14 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.14`
- Original ask: Bulk insert campaign rows from a VALUES clause.
- In simple words: Write a query or SQL script that answers only this request: Bulk insert campaign rows from a VALUES clause.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Bulk insert campaign rows from a VALUES clause. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.14 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.15 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.15`
- Original ask: Use COPY command comments to describe how you would load a CSV into staging.raw_orders.
- In simple words: Write a query or SQL script that answers only this request: Use COPY command comments to describe how you would load a CSV into staging.raw_orders.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use COPY command comments to describe how you would load a CSV into staging.raw_orders. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.15 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.16 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.16`
- Original ask: Update subscription statuses to expired when ended_on is before 2026-04-30.
- In simple words: Write a query or SQL script that answers only this request: Update subscription statuses to expired when ended_on is before 2026-04-30.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Update subscription statuses to expired when ended_on is before 2026-04-30. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.16 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.17 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.17`
- Original ask: Cancel unpaid pending orders older than 30 days and write affected rows to an audit table.
- In simple words: Write a query or SQL script that answers only this request: Cancel unpaid pending orders older than 30 days and write affected rows to an audit table.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Cancel unpaid pending orders older than 30 days and write affected rows to an audit table. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.17 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.18 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.18`
- Original ask: Use a CTE with INSERT to create support tickets for failed payments above 200.
- In simple words: Write a query or SQL script that answers only this request: Use a CTE with INSERT to create support tickets for failed payments above 200.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use a CTE with INSERT to create support tickets for failed payments above 200. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.18 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.19 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.19`
- Original ask: Use a writable CTE to insert a ticket_event immediately after creating a support_ticket.
- In simple words: Write a query or SQL script that answers only this request: Use a writable CTE to insert a ticket_event immediately after creating a support_ticket.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use a writable CTE to insert a ticket_event immediately after creating a support_ticket. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.19 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.20 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.20`
- Original ask: Write a transaction that changes product prices and records old and new prices in price_history.
- In simple words: Write a query or SQL script that answers only this request: Write a transaction that changes product prices and records old and new prices in price_history.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Write a transaction that changes product prices and records old and new prices in price_history. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.20 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.21 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.21`
- Original ask: Show how READ COMMITTED and REPEATABLE READ would affect a revenue report during concurrent payments.
- In simple words: Write a query or SQL script that answers only this request: Show how READ COMMITTED and REPEATABLE READ would affect a revenue report during concurrent payments.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Show how READ COMMITTED and REPEATABLE READ would affect a revenue report during concurrent payments. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.21 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.22 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.22`
- Original ask: Use advisory-lock comments to protect one monthly billing run from running twice.
- In simple words: Write a query or SQL script that answers only this request: Use advisory-lock comments to protect one monthly billing run from running twice.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use advisory-lock comments to protect one monthly billing run from running twice. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.22 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.23 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.23`
- Original ask: Use TRUNCATE on a staging table and explain the difference from DELETE in comments.
- In simple words: Write a query or SQL script that answers only this request: Use TRUNCATE on a staging table and explain the difference from DELETE in comments.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use TRUNCATE on a staging table and explain the difference from DELETE in comments. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.23 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.24 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.24`
- Original ask: Update order status based on payment and shipment state with a CASE expression.
- In simple words: Write a query or SQL script that answers only this request: Update order status based on payment and shipment state with a CASE expression.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Update order status based on payment and shipment state with a CASE expression. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.24 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 07.25 - Task 07: DML, Transactions, and MERGE
- File/folder: `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`
- Function/code to work on: `SQL statement for challenge 07.25`
- Original ask: Design an idempotent daily load script that can be rerun without duplicating facts.
- In simple words: Write a query or SQL script that answers only this request: Design an idempotent daily load script that can be rerun without duplicating facts.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Design an idempotent daily load script that can be rerun without duplicating facts. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 07.25 after `SET search_path TO sql_mastery;` in `SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/07_DML_Transactions_Merge/task_07_dml_transactions_merge.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.01 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.01`
- Original ask: Run EXPLAIN for a customer lookup by email and propose the supporting index.
- In simple words: Write a query or SQL script that answers only this request: Run EXPLAIN for a customer lookup by email and propose the supporting index.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Run EXPLAIN for a customer lookup by email and propose the supporting index. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.01 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.02 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.02`
- Original ask: Create a composite index for orders filtered by customer_id and sorted by order_date desc.
- In simple words: Write a query or SQL script that answers only this request: Create a composite index for orders filtered by customer_id and sorted by order_date desc.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a composite index for orders filtered by customer_id and sorted by order_date desc. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.02 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.03 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.03`
- Original ask: Create a partial index for open support tickets only.
- In simple words: Write a query or SQL script that answers only this request: Create a partial index for open support tickets only.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a partial index for open support tickets only. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.03 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.04 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.04`
- Original ask: Create an expression index for lower(customers.email) and write a query that can use it.
- In simple words: Write a query or SQL script that answers only this request: Create an expression index for lower(customers.email) and write a query that can use it.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create an expression index for lower(customers.email) and write a query that can use it. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.04 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.05 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.05`
- Original ask: Create a covering index for payments by order_id including amount and status.
- In simple words: Write a query or SQL script that answers only this request: Create a covering index for payments by order_id including amount and status.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a covering index for payments by order_id including amount and status. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.05 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.06 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.06`
- Original ask: Compare index column order for queries filtering by channel and order_date.
- In simple words: Write a query or SQL script that answers only this request: Compare index column order for queries filtering by channel and order_date.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Compare index column order for queries filtering by channel and order_date. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.06 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.07 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.07`
- Original ask: Rewrite a non-sargable date filter on orders so an index can be used.
- In simple words: Write a query or SQL script that answers only this request: Rewrite a non-sargable date filter on orders so an index can be used.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Rewrite a non-sargable date filter on orders so an index can be used. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.07 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.08 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.08`
- Original ask: Create a GIN index for web_events.metadata and query by device.
- In simple words: Write a query or SQL script that answers only this request: Create a GIN index for web_events.metadata and query by device.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a GIN index for web_events.metadata and query by device. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.08 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.09 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.09`
- Original ask: Create a GIN index for full-text search over support ticket subject and note text.
- In simple words: Write a query or SQL script that answers only this request: Create a GIN index for full-text search over support ticket subject and note text.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a GIN index for full-text search over support ticket subject and note text. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.09 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.10 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.10`
- Original ask: Create a BRIN index strategy for a large append-only web_events table.
- In simple words: Write a query or SQL script that answers only this request: Create a BRIN index strategy for a large append-only web_events table.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a BRIN index strategy for a large append-only web_events table. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.10 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.11 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.11`
- Original ask: Use EXPLAIN ANALYZE to compare EXISTS versus JOIN DISTINCT for customer activity.
- In simple words: Write a query or SQL script that answers only this request: Use EXPLAIN ANALYZE to compare EXISTS versus JOIN DISTINCT for customer activity.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use EXPLAIN ANALYZE to compare EXISTS versus JOIN DISTINCT for customer activity. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.11 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.12 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.12`
- Original ask: Find a query where an index might hurt because the table is tiny or selectivity is low.
- In simple words: Write a query or SQL script that answers only this request: Find a query where an index might hurt because the table is tiny or selectivity is low.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find a query where an index might hurt because the table is tiny or selectivity is low. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.12 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.13 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.13`
- Original ask: Create statistics on correlated columns channel and status in orders.
- In simple words: Write a query or SQL script that answers only this request: Create statistics on correlated columns channel and status in orders.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create statistics on correlated columns channel and status in orders. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.13 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.14 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.14`
- Original ask: Refresh a materialized daily revenue view and discuss index placement on it.
- In simple words: Write a query or SQL script that answers only this request: Refresh a materialized daily revenue view and discuss index placement on it.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Refresh a materialized daily revenue view and discuss index placement on it. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.14 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.15 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.15`
- Original ask: Detect unused indexes using catalog-query comments and explain when to drop one.
- In simple words: Write a query or SQL script that answers only this request: Detect unused indexes using catalog-query comments and explain when to drop one.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Detect unused indexes using catalog-query comments and explain when to drop one. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.15 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.16 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.16`
- Original ask: Optimize a top-products query by pre-aggregating order_items in a CTE.
- In simple words: Write a query or SQL script that answers only this request: Optimize a top-products query by pre-aggregating order_items in a CTE.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Optimize a top-products query by pre-aggregating order_items in a CTE. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.16 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.17 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.17`
- Original ask: Avoid SELECT * in a wide join and explain how it changes memory and I/O.
- In simple words: Write a query or SQL script that answers only this request: Avoid SELECT * in a wide join and explain how it changes memory and I/O.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Avoid SELECT * in a wide join and explain how it changes memory and I/O. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.17 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.18 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.18`
- Original ask: Compare OFFSET pagination to keyset pagination for orders.
- In simple words: Write a query or SQL script that answers only this request: Compare OFFSET pagination to keyset pagination for orders.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Compare OFFSET pagination to keyset pagination for orders. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.18 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.19 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.19`
- Original ask: Write a keyset pagination query using order_date and order_id.
- In simple words: Write a query or SQL script that answers only this request: Write a keyset pagination query using order_date and order_id.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Write a keyset pagination query using order_date and order_id. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.19 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.20 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.20`
- Original ask: Use DISTINCT ON versus ROW_NUMBER for latest payment per order and compare plans.
- In simple words: Write a query or SQL script that answers only this request: Use DISTINCT ON versus ROW_NUMBER for latest payment per order and compare plans.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use DISTINCT ON versus ROW_NUMBER for latest payment per order and compare plans. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.20 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.21 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.21`
- Original ask: Optimize a query that filters JSONB metadata by campaign and device.
- In simple words: Write a query or SQL script that answers only this request: Optimize a query that filters JSONB metadata by campaign and device.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Optimize a query that filters JSONB metadata by campaign and device. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.21 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.22 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.22`
- Original ask: Identify a join that needs indexes on both foreign key and referenced key.
- In simple words: Write a query or SQL script that answers only this request: Identify a join that needs indexes on both foreign key and referenced key.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Identify a join that needs indexes on both foreign key and referenced key. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.22 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.23 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.23`
- Original ask: Explain when VACUUM and ANALYZE matter after bulk loading seed data.
- In simple words: Write a query or SQL script that answers only this request: Explain when VACUUM and ANALYZE matter after bulk loading seed data.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Explain when VACUUM and ANALYZE matter after bulk loading seed data. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.23 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.24 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.24`
- Original ask: Create a query that shows estimated versus actual rows and describe what mismatch means.
- In simple words: Write a query or SQL script that answers only this request: Create a query that shows estimated versus actual rows and describe what mismatch means.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a query that shows estimated versus actual rows and describe what mismatch means. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.24 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 08.25 - Task 08: Indexes and Query Performance
- File/folder: `SQL/08_Indexes_Performance/task_08_indexes_performance.sql`
- Function/code to work on: `SQL statement for challenge 08.25`
- Original ask: Design an indexing strategy for a dashboard with filters by month, city, status, and channel.
- In simple words: Write a query or SQL script that answers only this request: Design an indexing strategy for a dashboard with filters by month, city, status, and channel.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Design an indexing strategy for a dashboard with filters by month, city, status, and channel. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 08.25 after `SET search_path TO sql_mastery;` in `SQL/08_Indexes_Performance/task_08_indexes_performance.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/08_Indexes_Performance/task_08_indexes_performance.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.01 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.01`
- Original ask: Extract device, browser, and referrer values from web_events.metadata JSONB.
- In simple words: Write a query or SQL script that answers only this request: Extract device, browser, and referrer values from web_events.metadata JSONB.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Extract device, browser, and referrer values from web_events.metadata JSONB. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.01 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.02 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.02`
- Original ask: Filter web_events where metadata contains a nested experiment assignment.
- In simple words: Write a query or SQL script that answers only this request: Filter web_events where metadata contains a nested experiment assignment.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Filter web_events where metadata contains a nested experiment assignment. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.02 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.03 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.03`
- Original ask: Update a JSONB metadata object to add a normalized_device key.
- In simple words: Write a query or SQL script that answers only this request: Update a JSONB metadata object to add a normalized_device key.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Update a JSONB metadata object to add a normalized_device key. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.03 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.04 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.04`
- Original ask: Aggregate event types per session into a text array.
- In simple words: Write a query or SQL script that answers only this request: Aggregate event types per session into a text array.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Aggregate event types per session into a text array. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.04 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.05 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.05`
- Original ask: Find customers whose purchased category array overlaps a target array of categories.
- In simple words: Write a query or SQL script that answers only this request: Find customers whose purchased category array overlaps a target array of categories.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find customers whose purchased category array overlaps a target array of categories. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.05 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.06 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.06`
- Original ask: Use unnest to turn a category array into rows for analysis.
- In simple words: Write a query or SQL script that answers only this request: Use unnest to turn a category array into rows for analysis.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use unnest to turn a category array into rows for analysis. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.06 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.07 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.07`
- Original ask: Create a daterange for each subscription and test whether 2026-04-15 is inside it.
- In simple words: Write a query or SQL script that answers only this request: Create a daterange for each subscription and test whether 2026-04-15 is inside it.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a daterange for each subscription and test whether 2026-04-15 is inside it. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.07 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.08 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.08`
- Original ask: Find overlapping subscription periods using range operators.
- In simple words: Write a query or SQL script that answers only this request: Find overlapping subscription periods using range operators.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find overlapping subscription periods using range operators. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.08 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.09 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.09`
- Original ask: Calculate intervals between opened_at and closed_at for tickets and format hours.
- In simple words: Write a query or SQL script that answers only this request: Calculate intervals between opened_at and closed_at for tickets and format hours.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate intervals between opened_at and closed_at for tickets and format hours. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.09 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.10 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.10`
- Original ask: Convert order_date from UTC assumption to a named time zone for reporting.
- In simple words: Write a query or SQL script that answers only this request: Convert order_date from UTC assumption to a named time zone for reporting.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Convert order_date from UTC assumption to a named time zone for reporting. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.10 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.11 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.11`
- Original ask: Generate a date series for every day in April 2026 and left join daily revenue.
- In simple words: Write a query or SQL script that answers only this request: Generate a date series for every day in April 2026 and left join daily revenue.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Generate a date series for every day in April 2026 and left join daily revenue. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.11 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.12 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.12`
- Original ask: Use regexp_replace to normalize phone numbers to digits only.
- In simple words: Write a query or SQL script that answers only this request: Use regexp_replace to normalize phone numbers to digits only.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use regexp_replace to normalize phone numbers to digits only. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.12 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.13 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.13`
- Original ask: Use regexp_match to extract coupon family and numeric suffix from coupon_code.
- In simple words: Write a query or SQL script that answers only this request: Use regexp_match to extract coupon family and numeric suffix from coupon_code.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use regexp_match to extract coupon family and numeric suffix from coupon_code. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.13 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.14 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.14`
- Original ask: Create a tsvector search query over support_tickets.subject.
- In simple words: Write a query or SQL script that answers only this request: Create a tsvector search query over support_tickets.subject.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a tsvector search query over support_tickets.subject. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.14 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.15 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.15`
- Original ask: Rank search results for tickets using ts_rank.
- In simple words: Write a query or SQL script that answers only this request: Rank search results for tickets using ts_rank.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Rank search results for tickets using ts_rank. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.15 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.16 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.16`
- Original ask: Create a UUID-based table for external webhook events.
- In simple words: Write a query or SQL script that answers only this request: Create a UUID-based table for external webhook events.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a UUID-based table for external webhook events. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.16 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.17 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.17`
- Original ask: Use gen_random_uuid comments and extension setup for pgcrypto.
- In simple words: Write a query or SQL script that answers only this request: Use gen_random_uuid comments and extension setup for pgcrypto.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use gen_random_uuid comments and extension setup for pgcrypto. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.17 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.18 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.18`
- Original ask: Create a SQL function that returns net line amount from quantity, price, and discount.
- In simple words: Write a query or SQL script that answers only this request: Create a SQL function that returns net line amount from quantity, price, and discount.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a SQL function that returns net line amount from quantity, price, and discount. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.18 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.19 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.19`
- Original ask: Create an immutable function for email domain extraction and use it in a query.
- In simple words: Write a query or SQL script that answers only this request: Create an immutable function for email domain extraction and use it in a query.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create an immutable function for email domain extraction and use it in a query. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.19 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.20 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.20`
- Original ask: Create a stable function that returns customer lifetime spend.
- In simple words: Write a query or SQL script that answers only this request: Create a stable function that returns customer lifetime spend.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a stable function that returns customer lifetime spend. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.20 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.21 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.21`
- Original ask: Use date_trunc and extract to build fiscal-quarter labels.
- In simple words: Write a query or SQL script that answers only this request: Use date_trunc and extract to build fiscal-quarter labels.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use date_trunc and extract to build fiscal-quarter labels. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.21 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.22 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.22`
- Original ask: Use make_interval to add a configurable trial period to subscription start dates.
- In simple words: Write a query or SQL script that answers only this request: Use make_interval to add a configurable trial period to subscription start dates.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use make_interval to add a configurable trial period to subscription start dates. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.22 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.23 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.23`
- Original ask: Create a composite type for money breakdown with gross, discount, and net fields.
- In simple words: Write a query or SQL script that answers only this request: Create a composite type for money breakdown with gross, discount, and net fields.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a composite type for money breakdown with gross, discount, and net fields. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.23 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.24 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.24`
- Original ask: Use DISTINCT ON as a PostgreSQL-specific shortcut for latest row per group.
- In simple words: Write a query or SQL script that answers only this request: Use DISTINCT ON as a PostgreSQL-specific shortcut for latest row per group.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use DISTINCT ON as a PostgreSQL-specific shortcut for latest row per group. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.24 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 09.25 - Task 09: PostgreSQL Advanced Types and Functions
- File/folder: `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`
- Function/code to work on: `SQL statement for challenge 09.25`
- Original ask: Use FILTER with aggregate functions to build compact pivot-like metrics.
- In simple words: Write a query or SQL script that answers only this request: Use FILTER with aggregate functions to build compact pivot-like metrics.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use FILTER with aggregate functions to build compact pivot-like metrics. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 09.25 after `SET search_path TO sql_mastery;` in `SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/09_PostgreSQL_Advanced_Types/task_09_postgresql_advanced_types.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.01 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.01`
- Original ask: Build a monthly revenue table with gross, discount, net, paid, refunded, and outstanding amounts.
- In simple words: Write a query or SQL script that answers only this request: Build a monthly revenue table with gross, discount, net, paid, refunded, and outstanding amounts.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build a monthly revenue table with gross, discount, net, paid, refunded, and outstanding amounts. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.01 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.02 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.02`
- Original ask: Calculate signup cohort month and first purchase month for each customer.
- In simple words: Write a query or SQL script that answers only this request: Calculate signup cohort month and first purchase month for each customer.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate signup cohort month and first purchase month for each customer. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.02 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.03 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.03`
- Original ask: Create a retention matrix showing cohort month versus months since signup based on orders.
- In simple words: Write a query or SQL script that answers only this request: Create a retention matrix showing cohort month versus months since signup based on orders.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a retention matrix showing cohort month versus months since signup based on orders. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.03 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.04 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.04`
- Original ask: Build a funnel from visit to product_view to add_to_cart to purchase using web_events.
- In simple words: Write a query or SQL script that answers only this request: Build a funnel from visit to product_view to add_to_cart to purchase using web_events.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build a funnel from visit to product_view to add_to_cart to purchase using web_events. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.04 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.05 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.05`
- Original ask: Calculate conversion rate by marketing campaign and device.
- In simple words: Write a query or SQL script that answers only this request: Calculate conversion rate by marketing campaign and device.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate conversion rate by marketing campaign and device. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.05 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.06 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.06`
- Original ask: Compute customer lifetime value using successful payments minus refunds.
- In simple words: Write a query or SQL script that answers only this request: Compute customer lifetime value using successful payments minus refunds.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Compute customer lifetime value using successful payments minus refunds. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.06 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.07 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.07`
- Original ask: Build RFM segments using recency, frequency, and monetary value.
- In simple words: Write a query or SQL script that answers only this request: Build RFM segments using recency, frequency, and monetary value.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build RFM segments using recency, frequency, and monetary value. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.07 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.08 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.08`
- Original ask: Identify churn-risk subscription customers with active subscription but declining order activity.
- In simple words: Write a query or SQL script that answers only this request: Identify churn-risk subscription customers with active subscription but declining order activity.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Identify churn-risk subscription customers with active subscription but declining order activity. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.08 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.09 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.09`
- Original ask: Calculate monthly recurring revenue, new MRR, expansion MRR, contraction MRR, and churned MRR.
- In simple words: Write a query or SQL script that answers only this request: Calculate monthly recurring revenue, new MRR, expansion MRR, contraction MRR, and churned MRR.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate monthly recurring revenue, new MRR, expansion MRR, contraction MRR, and churned MRR. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.09 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.10 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.10`
- Original ask: Calculate average order value by first acquisition campaign.
- In simple words: Write a query or SQL script that answers only this request: Calculate average order value by first acquisition campaign.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate average order value by first acquisition campaign. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.10 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.11 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.11`
- Original ask: Find repeat purchase rate by customer signup month.
- In simple words: Write a query or SQL script that answers only this request: Find repeat purchase rate by customer signup month.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find repeat purchase rate by customer signup month. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.11 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.12 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.12`
- Original ask: Calculate product attach rate for each category pair bought in the same order.
- In simple words: Write a query or SQL script that answers only this request: Calculate product attach rate for each category pair bought in the same order.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate product attach rate for each category pair bought in the same order. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.12 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.13 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.13`
- Original ask: Build a customer 360 row with spend, orders, tickets, latest activity, and subscription status.
- In simple words: Write a query or SQL script that answers only this request: Build a customer 360 row with spend, orders, tickets, latest activity, and subscription status.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build a customer 360 row with spend, orders, tickets, latest activity, and subscription status. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.13 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.14 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.14`
- Original ask: Calculate SLA compliance for high-priority tickets closed within 24 hours.
- In simple words: Write a query or SQL script that answers only this request: Calculate SLA compliance for high-priority tickets closed within 24 hours.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate SLA compliance for high-priority tickets closed within 24 hours. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.14 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.15 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.15`
- Original ask: Identify support drivers by grouping ticket subjects into business categories with CASE.
- In simple words: Write a query or SQL script that answers only this request: Identify support drivers by grouping ticket subjects into business categories with CASE.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Identify support drivers by grouping ticket subjects into business categories with CASE. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.15 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.16 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.16`
- Original ask: Build a daily operations dashboard dataset with orders, revenue, failed payments, and open tickets.
- In simple words: Write a query or SQL script that answers only this request: Build a daily operations dashboard dataset with orders, revenue, failed payments, and open tickets.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build a daily operations dashboard dataset with orders, revenue, failed payments, and open tickets. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.16 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.17 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.17`
- Original ask: Calculate refund rate by product category and sales channel.
- In simple words: Write a query or SQL script that answers only this request: Calculate refund rate by product category and sales channel.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate refund rate by product category and sales channel. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.17 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.18 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.18`
- Original ask: Find top cities by revenue growth month over month.
- In simple words: Write a query or SQL script that answers only this request: Find top cities by revenue growth month over month.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find top cities by revenue growth month over month. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.18 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.19 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.19`
- Original ask: Calculate cohort payback period using campaign budget and successful payment revenue.
- In simple words: Write a query or SQL script that answers only this request: Calculate cohort payback period using campaign budget and successful payment revenue.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate cohort payback period using campaign budget and successful payment revenue. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.19 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.20 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.20`
- Original ask: Build a rolling 30-day active customer metric.
- In simple words: Write a query or SQL script that answers only this request: Build a rolling 30-day active customer metric.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build a rolling 30-day active customer metric. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.20 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.21 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.21`
- Original ask: Calculate inventory sell-through rate by product.
- In simple words: Write a query or SQL script that answers only this request: Calculate inventory sell-through rate by product.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate inventory sell-through rate by product. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.21 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.22 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.22`
- Original ask: Find products with high views but low purchases using web_events and order_items.
- In simple words: Write a query or SQL script that answers only this request: Find products with high views but low purchases using web_events and order_items.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find products with high views but low purchases using web_events and order_items. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.22 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.23 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.23`
- Original ask: Create a profitability report using order revenue minus shipping_cost.
- In simple words: Write a query or SQL script that answers only this request: Create a profitability report using order revenue minus shipping_cost.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a profitability report using order revenue minus shipping_cost. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.23 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.24 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.24`
- Original ask: Calculate employee support workload and resolution quality metrics.
- In simple words: Write a query or SQL script that answers only this request: Calculate employee support workload and resolution quality metrics.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Calculate employee support workload and resolution quality metrics. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.24 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 10.25 - Task 10: Analytics, Reporting, and Cohorts
- File/folder: `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`
- Function/code to work on: `SQL statement for challenge 10.25`
- Original ask: Design a single SQL result suitable for a BI dashboard filterable by month, city, status, and channel.
- In simple words: Write a query or SQL script that answers only this request: Design a single SQL result suitable for a BI dashboard filterable by month, city, status, and channel.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Design a single SQL result suitable for a BI dashboard filterable by month, city, status, and channel. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 10.25 after `SET search_path TO sql_mastery;` in `SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/10_Analytics_Reporting_Cohorts/task_10_analytics_reporting_cohorts.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.01 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.01`
- Original ask: Create a reporting view that exposes order totals but hides customer email.
- In simple words: Write a query or SQL script that answers only this request: Create a reporting view that exposes order totals but hides customer email.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a reporting view that exposes order totals but hides customer email. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.01 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.02 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.02`
- Original ask: Create a customer_support view that shows customer contact fields and open ticket details.
- In simple words: Write a query or SQL script that answers only this request: Create a customer_support view that shows customer contact fields and open ticket details.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a customer_support view that shows customer contact fields and open ticket details. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.02 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.03 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.03`
- Original ask: Create a materialized view for daily revenue and write a refresh command.
- In simple words: Write a query or SQL script that answers only this request: Create a materialized view for daily revenue and write a refresh command.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a materialized view for daily revenue and write a refresh command. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.03 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.04 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.04`
- Original ask: Grant SELECT on reporting views to a readonly_analyst role.
- In simple words: Write a query or SQL script that answers only this request: Grant SELECT on reporting views to a readonly_analyst role.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Grant SELECT on reporting views to a readonly_analyst role. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.04 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.05 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.05`
- Original ask: Revoke direct table access from readonly_analyst while keeping view access.
- In simple words: Write a query or SQL script that answers only this request: Revoke direct table access from readonly_analyst while keeping view access.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Revoke direct table access from readonly_analyst while keeping view access. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.05 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.06 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.06`
- Original ask: Create a masked customer view that shows only email domain and last four phone digits.
- In simple words: Write a query or SQL script that answers only this request: Create a masked customer view that shows only email domain and last four phone digits.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a masked customer view that shows only email domain and last four phone digits. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.06 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.07 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.07`
- Original ask: Create a role for support agents that can update only support_tickets status and assigned_to.
- In simple words: Write a query or SQL script that answers only this request: Create a role for support agents that can update only support_tickets status and assigned_to.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a role for support agents that can update only support_tickets status and assigned_to. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.07 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.08 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.08`
- Original ask: Enable row-level security on support_tickets.
- In simple words: Write a query or SQL script that answers only this request: Enable row-level security on support_tickets.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Enable row-level security on support_tickets. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.08 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.09 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.09`
- Original ask: Write an RLS policy so support agents can see only tickets assigned to their employee mapping.
- In simple words: Write a query or SQL script that answers only this request: Write an RLS policy so support agents can see only tickets assigned to their employee mapping.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Write an RLS policy so support agents can see only tickets assigned to their employee mapping. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.09 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.10 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.10`
- Original ask: Write an RLS policy so sales reps can see only orders assigned to them.
- In simple words: Write a query or SQL script that answers only this request: Write an RLS policy so sales reps can see only orders assigned to them.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Write an RLS policy so sales reps can see only orders assigned to them. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.10 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.11 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.11`
- Original ask: Create an admin role that bypasses normal reporting limitations using explicit grants.
- In simple words: Write a query or SQL script that answers only this request: Create an admin role that bypasses normal reporting limitations using explicit grants.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create an admin role that bypasses normal reporting limitations using explicit grants. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.11 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.12 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.12`
- Original ask: Create a security definer function that safely returns customer lifetime spend.
- In simple words: Write a query or SQL script that answers only this request: Create a security definer function that safely returns customer lifetime spend.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a security definer function that safely returns customer lifetime spend. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.12 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.13 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.13`
- Original ask: Explain in comments why search_path matters for security definer functions.
- In simple words: Write a query or SQL script that answers only this request: Explain in comments why search_path matters for security definer functions.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Explain in comments why search_path matters for security definer functions. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.13 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.14 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.14`
- Original ask: Create a view with WITH CHECK OPTION for editable active subscriptions.
- In simple words: Write a query or SQL script that answers only this request: Create a view with WITH CHECK OPTION for editable active subscriptions.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a view with WITH CHECK OPTION for editable active subscriptions. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.14 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.15 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.15`
- Original ask: Create a policy that prevents updates to closed tickets except for admin role.
- In simple words: Write a query or SQL script that answers only this request: Create a policy that prevents updates to closed tickets except for admin role.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a policy that prevents updates to closed tickets except for admin role. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.15 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.16 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.16`
- Original ask: Audit privileges for a table using information_schema query comments.
- In simple words: Write a query or SQL script that answers only this request: Audit privileges for a table using information_schema query comments.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Audit privileges for a table using information_schema query comments. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.16 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.17 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.17`
- Original ask: Create a public-safe campaign performance view with no customer-level identifiers.
- In simple words: Write a query or SQL script that answers only this request: Create a public-safe campaign performance view with no customer-level identifiers.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a public-safe campaign performance view with no customer-level identifiers. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.17 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.18 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.18`
- Original ask: Create a data export view that excludes PII and sensitive ticket notes.
- In simple words: Write a query or SQL script that answers only this request: Create a data export view that excludes PII and sensitive ticket notes.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a data export view that excludes PII and sensitive ticket notes. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.18 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.19 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.19`
- Original ask: Design a least-privilege permission matrix for analyst, support_agent, sales_rep, and admin.
- In simple words: Write a query or SQL script that answers only this request: Design a least-privilege permission matrix for analyst, support_agent, sales_rep, and admin.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Design a least-privilege permission matrix for analyst, support_agent, sales_rep, and admin. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.19 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.20 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.20`
- Original ask: Write a transaction that creates a role, grants usage on schema, grants view access, and tests access.
- In simple words: Write a query or SQL script that answers only this request: Write a transaction that creates a role, grants usage on schema, grants view access, and tests access.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Write a transaction that creates a role, grants usage on schema, grants view access, and tests access. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.20 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.21 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.21`
- Original ask: Create a materialized view index for fast dashboard reads.
- In simple words: Write a query or SQL script that answers only this request: Create a materialized view index for fast dashboard reads.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a materialized view index for fast dashboard reads. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.21 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.22 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.22`
- Original ask: Create a view that normalizes order statuses into business-friendly labels.
- In simple words: Write a query or SQL script that answers only this request: Create a view that normalizes order statuses into business-friendly labels.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a view that normalizes order statuses into business-friendly labels. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.22 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.23 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.23`
- Original ask: Use column-level privileges to allow reading customers.city but not customers.email.
- In simple words: Write a query or SQL script that answers only this request: Use column-level privileges to allow reading customers.city but not customers.email.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use column-level privileges to allow reading customers.city but not customers.email. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.23 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.24 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.24`
- Original ask: Write a query to find tables in sql_mastery with no explicit privileges granted.
- In simple words: Write a query or SQL script that answers only this request: Write a query to find tables in sql_mastery with no explicit privileges granted.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Write a query to find tables in sql_mastery with no explicit privileges granted. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.24 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 11.25 - Task 11: Views, Security, and Row-Level Security
- File/folder: `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`
- Function/code to work on: `SQL statement for challenge 11.25`
- Original ask: Design a secure sharing layer for external partners who need campaign-level metrics only.
- In simple words: Write a query or SQL script that answers only this request: Design a secure sharing layer for external partners who need campaign-level metrics only.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Design a secure sharing layer for external partners who need campaign-level metrics only. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 11.25 after `SET search_path TO sql_mastery;` in `SQL/11_Views_Security_RLS/task_11_views_security_rls.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/11_Views_Security_RLS/task_11_views_security_rls.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.01 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.01`
- Original ask: Create a SQL function that calculates order net total by order_id.
- In simple words: Write a query or SQL script that answers only this request: Create a SQL function that calculates order net total by order_id.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a SQL function that calculates order net total by order_id. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.01 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.02 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.02`
- Original ask: Create a PL/pgSQL function that returns customer lifetime spend.
- In simple words: Write a query or SQL script that answers only this request: Create a PL/pgSQL function that returns customer lifetime spend.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a PL/pgSQL function that returns customer lifetime spend. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.02 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.03 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.03`
- Original ask: Create a procedure that closes stale pending tickets older than a configurable number of days.
- In simple words: Write a query or SQL script that answers only this request: Create a procedure that closes stale pending tickets older than a configurable number of days.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a procedure that closes stale pending tickets older than a configurable number of days. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.03 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.04 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.04`
- Original ask: Create a trigger that writes order status changes into order_status_audit.
- In simple words: Write a query or SQL script that answers only this request: Create a trigger that writes order status changes into order_status_audit.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a trigger that writes order status changes into order_status_audit. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.04 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.05 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.05`
- Original ask: Create a trigger that prevents delivered orders from being moved back to pending.
- In simple words: Write a query or SQL script that answers only this request: Create a trigger that prevents delivered orders from being moved back to pending.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a trigger that prevents delivered orders from being moved back to pending. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.05 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.06 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.06`
- Original ask: Create a trigger that updates products.updated_at whenever list_price changes.
- In simple words: Write a query or SQL script that answers only this request: Create a trigger that updates products.updated_at whenever list_price changes.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a trigger that updates products.updated_at whenever list_price changes. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.06 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.07 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.07`
- Original ask: Create a function that raises an exception when payment amount exceeds order total by more than 5 percent.
- In simple words: Write a query or SQL script that answers only this request: Create a function that raises an exception when payment amount exceeds order total by more than 5 percent.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a function that raises an exception when payment amount exceeds order total by more than 5 percent. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.07 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.08 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.08`
- Original ask: Create a procedure that performs a daily revenue snapshot insert.
- In simple words: Write a query or SQL script that answers only this request: Create a procedure that performs a daily revenue snapshot insert.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a procedure that performs a daily revenue snapshot insert. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.08 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.09 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.09`
- Original ask: Use dynamic SQL to rebuild indexes for tables matching a naming pattern.
- In simple words: Write a query or SQL script that answers only this request: Use dynamic SQL to rebuild indexes for tables matching a naming pattern.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use dynamic SQL to rebuild indexes for tables matching a naming pattern. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.09 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.10 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.10`
- Original ask: Create a trigger on ticket_events that updates support_tickets.updated_at.
- In simple words: Write a query or SQL script that answers only this request: Create a trigger on ticket_events that updates support_tickets.updated_at.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a trigger on ticket_events that updates support_tickets.updated_at. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.10 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.11 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.11`
- Original ask: Create a trigger that auto-closes a ticket when a ticket_event type is 'resolved'.
- In simple words: Write a query or SQL script that answers only this request: Create a trigger that auto-closes a ticket when a ticket_event type is 'resolved'.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a trigger that auto-closes a ticket when a ticket_event type is 'resolved'. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.11 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.12 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.12`
- Original ask: Create an audit function reusable across multiple tables with TG_TABLE_NAME.
- In simple words: Write a query or SQL script that answers only this request: Create an audit function reusable across multiple tables with TG_TABLE_NAME.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create an audit function reusable across multiple tables with TG_TABLE_NAME. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.12 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.13 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.13`
- Original ask: Create a function that returns a table of top customers with parameters for date range and limit.
- In simple words: Write a query or SQL script that answers only this request: Create a function that returns a table of top customers with parameters for date range and limit.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a function that returns a table of top customers with parameters for date range and limit. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.13 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.14 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.14`
- Original ask: Create a procedure that retries failed payments by inserting rows into payment_retry_queue.
- In simple words: Write a query or SQL script that answers only this request: Create a procedure that retries failed payments by inserting rows into payment_retry_queue.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a procedure that retries failed payments by inserting rows into payment_retry_queue. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.14 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.15 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.15`
- Original ask: Use exception handling to log failed procedure runs to job_errors.
- In simple words: Write a query or SQL script that answers only this request: Use exception handling to log failed procedure runs to job_errors.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Use exception handling to log failed procedure runs to job_errors. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.15 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.16 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.16`
- Original ask: Create a scheduled-job design comment using pg_cron for refreshing materialized views.
- In simple words: Write a query or SQL script that answers only this request: Create a scheduled-job design comment using pg_cron for refreshing materialized views.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a scheduled-job design comment using pg_cron for refreshing materialized views. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.16 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.17 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.17`
- Original ask: Create a notification trigger using NOTIFY when urgent tickets are inserted.
- In simple words: Write a query or SQL script that answers only this request: Create a notification trigger using NOTIFY when urgent tickets are inserted.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a notification trigger using NOTIFY when urgent tickets are inserted. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.17 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.18 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.18`
- Original ask: Create a validation function used by a CHECK constraint for allowed coupon format.
- In simple words: Write a query or SQL script that answers only this request: Create a validation function used by a CHECK constraint for allowed coupon format.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a validation function used by a CHECK constraint for allowed coupon format. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.18 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.19 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.19`
- Original ask: Create a function that accepts JSONB input and inserts a web_event after validation.
- In simple words: Write a query or SQL script that answers only this request: Create a function that accepts JSONB input and inserts a web_event after validation.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a function that accepts JSONB input and inserts a web_event after validation. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.19 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.20 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.20`
- Original ask: Create a procedure that archives old web_events into a partitioned archive table.
- In simple words: Write a query or SQL script that answers only this request: Create a procedure that archives old web_events into a partitioned archive table.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a procedure that archives old web_events into a partitioned archive table. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.20 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.21 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.21`
- Original ask: Create a trigger that maintains inventory balance after inventory_movements inserts.
- In simple words: Write a query or SQL script that answers only this request: Create a trigger that maintains inventory balance after inventory_movements inserts.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a trigger that maintains inventory balance after inventory_movements inserts. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.21 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.22 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.22`
- Original ask: Create a function that returns order profitability including shipping cost.
- In simple words: Write a query or SQL script that answers only this request: Create a function that returns order profitability including shipping cost.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a function that returns order profitability including shipping cost. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.22 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.23 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.23`
- Original ask: Create a trigger that blocks deleting customers who have orders.
- In simple words: Write a query or SQL script that answers only this request: Create a trigger that blocks deleting customers who have orders.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a trigger that blocks deleting customers who have orders. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.23 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.24 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.24`
- Original ask: Create a procedure that reassigns tickets from inactive employees to a queue user.
- In simple words: Write a query or SQL script that answers only this request: Create a procedure that reassigns tickets from inactive employees to a queue user.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a procedure that reassigns tickets from inactive employees to a queue user. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.24 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 12.25 - Task 12: Procedures, Triggers, and Automation
- File/folder: `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`
- Function/code to work on: `SQL statement for challenge 12.25`
- Original ask: Write tests as SQL statements that prove one trigger works for insert, update, and invalid input.
- In simple words: Write a query or SQL script that answers only this request: Write tests as SQL statements that prove one trigger works for insert, update, and invalid input.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Write tests as SQL statements that prove one trigger works for insert, update, and invalid input. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 12.25 after `SET search_path TO sql_mastery;` in `SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/12_Procedures_Triggers_Automation/task_12_procedures_triggers_automation.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.01 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.01`
- Original ask: Write a test query that returns rows when customers.email is null or duplicated.
- In simple words: Write a query or SQL script that answers only this request: Write a test query that returns rows when customers.email is null or duplicated.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Write a test query that returns rows when customers.email is null or duplicated. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.01 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.02 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.02`
- Original ask: Write a test query that returns order_items with quantity <= 0 or unit_price < 0.
- In simple words: Write a query or SQL script that answers only this request: Write a test query that returns order_items with quantity <= 0 or unit_price < 0.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Write a test query that returns order_items with quantity <= 0 or unit_price < 0. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.02 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.03 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.03`
- Original ask: Write a reconciliation query comparing order net total to successful payment amount.
- In simple words: Write a query or SQL script that answers only this request: Write a reconciliation query comparing order net total to successful payment amount.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Write a reconciliation query comparing order net total to successful payment amount. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.03 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.04 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.04`
- Original ask: Detect customers with multiple active subscriptions for the same plan.
- In simple words: Write a query or SQL script that answers only this request: Detect customers with multiple active subscriptions for the same plan.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Detect customers with multiple active subscriptions for the same plan. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.04 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.05 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.05`
- Original ask: Find shipments delivered before they were shipped.
- In simple words: Write a query or SQL script that answers only this request: Find shipments delivered before they were shipped.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find shipments delivered before they were shipped. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.05 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.06 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.06`
- Original ask: Find orders marked delivered without a delivered shipment.
- In simple words: Write a query or SQL script that answers only this request: Find orders marked delivered without a delivered shipment.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find orders marked delivered without a delivered shipment. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.06 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.07 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.07`
- Original ask: Find paid orders with no successful payment row.
- In simple words: Write a query or SQL script that answers only this request: Find paid orders with no successful payment row.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find paid orders with no successful payment row. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.07 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.08 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.08`
- Original ask: Find payment rows whose amount is more than 5 percent above order total.
- In simple words: Write a query or SQL script that answers only this request: Find payment rows whose amount is more than 5 percent above order total.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find payment rows whose amount is more than 5 percent above order total. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.08 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.09 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.09`
- Original ask: Detect duplicate web_events based on session_id, event_type, occurred_at, and page_url.
- In simple words: Write a query or SQL script that answers only this request: Detect duplicate web_events based on session_id, event_type, occurred_at, and page_url.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Detect duplicate web_events based on session_id, event_type, occurred_at, and page_url. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.09 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.10 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.10`
- Original ask: Find support tickets that are closed but have no closed_at timestamp.
- In simple words: Write a query or SQL script that answers only this request: Find support tickets that are closed but have no closed_at timestamp.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find support tickets that are closed but have no closed_at timestamp. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.10 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.11 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.11`
- Original ask: Find ticket_events that occurred before the ticket opened_at time.
- In simple words: Write a query or SQL script that answers only this request: Find ticket_events that occurred before the ticket opened_at time.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find ticket_events that occurred before the ticket opened_at time. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.11 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.12 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.12`
- Original ask: Build an anomaly query for daily revenue more than 3 standard deviations from the trailing average.
- In simple words: Write a query or SQL script that answers only this request: Build an anomaly query for daily revenue more than 3 standard deviations from the trailing average.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build an anomaly query for daily revenue more than 3 standard deviations from the trailing average. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.12 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.13 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.13`
- Original ask: Build a freshness check for web_events requiring data within the last 24 hours of 2026-04-30.
- In simple words: Write a query or SQL script that answers only this request: Build a freshness check for web_events requiring data within the last 24 hours of 2026-04-30.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build a freshness check for web_events requiring data within the last 24 hours of 2026-04-30. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.13 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.14 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.14`
- Original ask: Write a row-count validation query before and after loading staging.raw_orders.
- In simple words: Write a query or SQL script that answers only this request: Write a row-count validation query before and after loading staging.raw_orders.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Write a row-count validation query before and after loading staging.raw_orders. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.14 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.15 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.15`
- Original ask: Write a checksum-style aggregate for payments to compare source and target loads.
- In simple words: Write a query or SQL script that answers only this request: Write a checksum-style aggregate for payments to compare source and target loads.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Write a checksum-style aggregate for payments to compare source and target loads. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.15 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.16 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.16`
- Original ask: Detect orphaned foreign keys if constraints were temporarily disabled.
- In simple words: Write a query or SQL script that answers only this request: Detect orphaned foreign keys if constraints were temporarily disabled.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Detect orphaned foreign keys if constraints were temporarily disabled. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.16 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.17 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.17`
- Original ask: Write a query that profiles null percentage for selected customer columns.
- In simple words: Write a query or SQL script that answers only this request: Write a query that profiles null percentage for selected customer columns.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Write a query that profiles null percentage for selected customer columns. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.17 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.18 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.18`
- Original ask: Write a query that profiles min, max, average, and percentile values for payment amount.
- In simple words: Write a query or SQL script that answers only this request: Write a query that profiles min, max, average, and percentile values for payment amount.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Write a query that profiles min, max, average, and percentile values for payment amount. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.18 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.19 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.19`
- Original ask: Find impossible status combinations across orders, payments, and shipments.
- In simple words: Write a query or SQL script that answers only this request: Find impossible status combinations across orders, payments, and shipments.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find impossible status combinations across orders, payments, and shipments. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.19 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.20 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.20`
- Original ask: Create an audit report of orders updated in the last 7 days using an audit table design.
- In simple words: Write a query or SQL script that answers only this request: Create an audit report of orders updated in the last 7 days using an audit table design.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create an audit report of orders updated in the last 7 days using an audit table design. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.20 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.21 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.21`
- Original ask: Validate that every product category in products exists in a categories reference table.
- In simple words: Write a query or SQL script that answers only this request: Validate that every product category in products exists in a categories reference table.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Validate that every product category in products exists in a categories reference table. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.21 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.22 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.22`
- Original ask: Find inactive products that still receive new order_items after deactivation.
- In simple words: Write a query or SQL script that answers only this request: Find inactive products that still receive new order_items after deactivation.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Find inactive products that still receive new order_items after deactivation. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.22 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.23 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.23`
- Original ask: Detect city spelling variants using lower, trim, and grouping.
- In simple words: Write a query or SQL script that answers only this request: Detect city spelling variants using lower, trim, and grouping.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Detect city spelling variants using lower, trim, and grouping. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.23 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.24 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.24`
- Original ask: Write a migration validation query for renaming coupon_code to promotion_code.
- In simple words: Write a query or SQL script that answers only this request: Write a migration validation query for renaming coupon_code to promotion_code.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Write a migration validation query for renaming coupon_code to promotion_code. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.24 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 13.25 - Task 13: Data Quality, Testing, and Auditing
- File/folder: `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`
- Function/code to work on: `SQL statement for challenge 13.25`
- Original ask: Create a data quality scorecard result with test_name, failing_rows, severity, and owner.
- In simple words: Write a query or SQL script that answers only this request: Create a data quality scorecard result with test_name, failing_rows, severity, and owner.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a data quality scorecard result with test_name, failing_rows, severity, and owner. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 13.25 after `SET search_path TO sql_mastery;` in `SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/13_Data_Quality_Testing_Auditing/task_13_data_quality_testing_auditing.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.01 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.01`
- Original ask: Design and implement an ecommerce reporting mart with fact_order_items and customer, product, date, and campaign dimensions.
- In simple words: Write a query or SQL script that answers only this request: Design and implement an ecommerce reporting mart with fact_order_items and customer, product, date, and campaign dimensions.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Design and implement an ecommerce reporting mart with fact_order_items and customer, product, date, and campaign dimensions. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.01 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.02 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.02`
- Original ask: Build a customer 360 mart with one row per customer and documented refresh logic.
- In simple words: Write a query or SQL script that answers only this request: Build a customer 360 mart with one row per customer and documented refresh logic.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build a customer 360 mart with one row per customer and documented refresh logic. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.02 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.03 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.03`
- Original ask: Create a subscription retention dashboard dataset with cohort month, active months, churn month, and MRR metrics.
- In simple words: Write a query or SQL script that answers only this request: Create a subscription retention dashboard dataset with cohort month, active months, churn month, and MRR metrics.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a subscription retention dashboard dataset with cohort month, active months, churn month, and MRR metrics. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.03 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.04 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.04`
- Original ask: Build a support operations mart with SLA, backlog, reopen rate, employee workload, and priority metrics.
- In simple words: Write a query or SQL script that answers only this request: Build a support operations mart with SLA, backlog, reopen rate, employee workload, and priority metrics.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build a support operations mart with SLA, backlog, reopen rate, employee workload, and priority metrics. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.04 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.05 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.05`
- Original ask: Create a product performance mart that combines views, carts, purchases, refunds, and inventory movement.
- In simple words: Write a query or SQL script that answers only this request: Create a product performance mart that combines views, carts, purchases, refunds, and inventory movement.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a product performance mart that combines views, carts, purchases, refunds, and inventory movement. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.05 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.06 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.06`
- Original ask: Design a secure analyst layer with masked views, grants, and no direct table access.
- In simple words: Write a query or SQL script that answers only this request: Design a secure analyst layer with masked views, grants, and no direct table access.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Design a secure analyst layer with masked views, grants, and no direct table access. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.06 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.07 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.07`
- Original ask: Create a complete indexing plan for the customer 360 and dashboard queries, with EXPLAIN notes.
- In simple words: Write a query or SQL script that answers only this request: Create a complete indexing plan for the customer 360 and dashboard queries, with EXPLAIN notes.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a complete indexing plan for the customer 360 and dashboard queries, with EXPLAIN notes. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.07 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.08 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.08`
- Original ask: Implement an audit mechanism for order status and payment status changes.
- In simple words: Write a query or SQL script that answers only this request: Implement an audit mechanism for order status and payment status changes.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Implement an audit mechanism for order status and payment status changes. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.08 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.09 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.09`
- Original ask: Build a daily data quality scorecard and store its output in a table.
- In simple words: Write a query or SQL script that answers only this request: Build a daily data quality scorecard and store its output in a table.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build a daily data quality scorecard and store its output in a table. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.09 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.10 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.10`
- Original ask: Create a SQL-only ETL flow from staging.raw_orders into normalized orders and order_items.
- In simple words: Write a query or SQL script that answers only this request: Create a SQL-only ETL flow from staging.raw_orders into normalized orders and order_items.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a SQL-only ETL flow from staging.raw_orders into normalized orders and order_items. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.10 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.11 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.11`
- Original ask: Design a rollback-safe migration for splitting product category into a categories table.
- In simple words: Write a query or SQL script that answers only this request: Design a rollback-safe migration for splitting product category into a categories table.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Design a rollback-safe migration for splitting product category into a categories table. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.11 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.12 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.12`
- Original ask: Create a materialized revenue summary with a refresh procedure and validation query.
- In simple words: Write a query or SQL script that answers only this request: Create a materialized revenue summary with a refresh procedure and validation query.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a materialized revenue summary with a refresh procedure and validation query. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.12 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.13 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.13`
- Original ask: Build a campaign attribution report using first-touch and last-touch models.
- In simple words: Write a query or SQL script that answers only this request: Build a campaign attribution report using first-touch and last-touch models.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build a campaign attribution report using first-touch and last-touch models. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.13 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.14 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.14`
- Original ask: Build a funnel report with conversion rates and median time between steps.
- In simple words: Write a query or SQL script that answers only this request: Build a funnel report with conversion rates and median time between steps.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build a funnel report with conversion rates and median time between steps. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.14 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.15 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.15`
- Original ask: Create a revenue forecast baseline using trailing moving averages in SQL.
- In simple words: Write a query or SQL script that answers only this request: Create a revenue forecast baseline using trailing moving averages in SQL.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a revenue forecast baseline using trailing moving averages in SQL. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.15 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.16 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.16`
- Original ask: Design a row-level security model for regional sales reps and support agents.
- In simple words: Write a query or SQL script that answers only this request: Design a row-level security model for regional sales reps and support agents.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Design a row-level security model for regional sales reps and support agents. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.16 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.17 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.17`
- Original ask: Create a performance troubleshooting report for one intentionally slow dashboard query.
- In simple words: Write a query or SQL script that answers only this request: Create a performance troubleshooting report for one intentionally slow dashboard query.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a performance troubleshooting report for one intentionally slow dashboard query. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.17 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.18 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.18`
- Original ask: Build a data deletion workflow for privacy requests while preserving aggregate reporting.
- In simple words: Write a query or SQL script that answers only this request: Build a data deletion workflow for privacy requests while preserving aggregate reporting.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build a data deletion workflow for privacy requests while preserving aggregate reporting. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.18 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.19 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.19`
- Original ask: Create a test pack that validates constraints, transformations, and business metrics.
- In simple words: Write a query or SQL script that answers only this request: Create a test pack that validates constraints, transformations, and business metrics.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a test pack that validates constraints, transformations, and business metrics. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.19 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.20 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.20`
- Original ask: Create a partition maintenance plan for web_events and demonstrate adding the next month partition.
- In simple words: Write a query or SQL script that answers only this request: Create a partition maintenance plan for web_events and demonstrate adding the next month partition.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a partition maintenance plan for web_events and demonstrate adding the next month partition. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.20 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.21 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.21`
- Original ask: Build an inventory replenishment report using sales velocity and current inventory balance.
- In simple words: Write a query or SQL script that answers only this request: Build an inventory replenishment report using sales velocity and current inventory balance.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Build an inventory replenishment report using sales velocity and current inventory balance. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.21 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.22 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.22`
- Original ask: Create a payment failure recovery workflow with retry queue, ticket creation, and audit trail.
- In simple words: Write a query or SQL script that answers only this request: Create a payment failure recovery workflow with retry queue, ticket creation, and audit trail.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Create a payment failure recovery workflow with retry queue, ticket creation, and audit trail. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.22 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.23 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.23`
- Original ask: Design a warehouse-style naming convention and refactor at least five objects to follow it.
- In simple words: Write a query or SQL script that answers only this request: Design a warehouse-style naming convention and refactor at least five objects to follow it.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Design a warehouse-style naming convention and refactor at least five objects to follow it. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.23 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.24 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.24`
- Original ask: Write a production readiness README for backup, restore, monitoring, permissions, and deployment.
- In simple words: Write a query or SQL script that answers only this request: Write a production readiness README for backup, restore, monitoring, permissions, and deployment.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Write a production readiness README for backup, restore, monitoring, permissions, and deployment. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.24 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.

## Challenge 14.25 - Task 14: Capstone Projects
- File/folder: `SQL/14_Capstone_Projects/task_14_capstone_projects.sql`
- Function/code to work on: `SQL statement for challenge 14.25`
- Original ask: Prepare a portfolio case study explaining the business problem, schema, hard queries, performance choices, and screenshots to capture.
- In simple words: Write a query or SQL script that answers only this request: Prepare a portfolio case study explaining the business problem, schema, hard queries, performance choices, and screenshots to capture.
- Real-life scenario: A manager, analyst, or backend service needs this exact database answer: Prepare a portfolio case study explaining the business problem, schema, hard queries, performance choices, and screenshots to capture. Your query must turn stored tables into that trustworthy result.
- What is going wrong: Without the correct SQL, this request can return wrong rows, missing columns, duplicate records, bad NULL handling, or data sorted/grouped in a misleading way.
- What needs to be corrected: Write the SQL statement for this challenge using the right tables, joins, filters, aliases, grouping, ordering, transactions, or DDL requested by the exercise. Keep the `.sql` task file comment-free and place the query after `SET search_path TO sql_mastery;` or store finished answers in `SQL/solutions/`.
- Implementation checklist: Identify the required table grain, select only the requested columns, apply every filter, use the requested aliases, and add deterministic ordering when the prompt asks for sorted or paginated output.
- Expected output/result: A PostgreSQL result set or database change that exactly matches the requested rows, columns, aliases, filters, ordering, grouping, or DDL behavior.
- How to test: Start the lab with `SQL/scripts/start_sql.ps1`, place the query for challenge 14.25 after `SET search_path TO sql_mastery;` in `SQL/14_Capstone_Projects/task_14_capstone_projects.sql` or in a solutions file, then run `SQL/scripts/run_task_file.ps1 SQL/14_Capstone_Projects/task_14_capstone_projects.sql`. For SELECT tasks, inspect the returned columns and row count.
- You are done when: The query returns the expected columns/rows or the script performs the expected database change without unintended side effects.
