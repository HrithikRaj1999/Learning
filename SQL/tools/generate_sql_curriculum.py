from __future__ import annotations

from pathlib import Path
from textwrap import dedent


ROOT = Path(__file__).resolve().parents[1]


MODULES = [
    {
        "number": 1,
        "folder": "01_Querying_Filtering_Sorting",
        "slug": "querying_filtering_sorting",
        "title": "Querying, Filtering, and Sorting",
        "level": "Intermediate",
        "concepts": [
            "SELECT",
            "WHERE",
            "ORDER BY",
            "LIMIT/OFFSET",
            "CASE",
            "COALESCE",
            "NULL handling",
            "date filters",
            "pattern matching",
            "set operators",
        ],
        "exercises": [
            "Return each active customer with customer_id, full_name, email, city, and signup_date sorted by newest signup first.",
            "List paid orders placed in March 2026 with order_id, customer_id, order_date, channel, and status sorted by order_date then order_id.",
            "Find products whose list_price is between 50 and 250 and whose active flag is true, ordered by price descending.",
            "Return customers from either Bangalore, Mumbai, or Austin whose email ends with '.com'.",
            "Show orders where coupon_code is null and channel is not 'marketplace'.",
            "Create a customer contact list that uses phone when present, otherwise email, as preferred_contact.",
            "Label every order as 'fresh', 'recent', or 'older' based on order_date relative to 2026-04-01 using CASE.",
            "Return the first 10 web events after 2026-03-01 for anonymous sessions where customer_id is null.",
            "Find support tickets with high or urgent priority that are not closed.",
            "Return distinct cities that appear in either customers.city or orders.shipping_city.",
            "List customers whose names contain the letter 'a' case-insensitively and sort by the position of the first 'a'.",
            "Return orders with a derived is_completed flag that is true only for delivered or refunded statuses.",
            "Find products where sku starts with 'BK-' or 'EL-' and the product name contains at least two words.",
            "Return payment rows where amount is not equal to 0 and status is not failed, sorted by absolute amount descending.",
            "Build a query that casts order_date to date and returns only weekend orders.",
            "Show web events whose metadata JSON contains a device value of 'mobile'.",
            "Return orders paginated as page 3 with 5 rows per page using deterministic ordering.",
            "Find customers with signup_date in the last 90 days from 2026-04-30.",
            "Return a single column called entity_name that unions customer names and product names without duplicates.",
            "Return a single column called entity_name that unions customer names and product names while keeping duplicates.",
            "Show products with list_price rounded to the nearest 10 and sorted by the rounded value.",
            "Filter orders where shipping_city differs from the customer's profile city.",
            "Return tickets where subject has the word 'refund', 'delay', or 'login' using a regular expression.",
            "Create a compact order label in the format ORD-<order_id>-<channel> using string concatenation.",
            "Return customers with no state value and display 'UNKNOWN' as state_display.",
        ],
    },
    {
        "number": 2,
        "folder": "02_Joins_Relationships",
        "slug": "joins_relationships",
        "title": "Joins and Relationships",
        "level": "Intermediate-Advanced",
        "concepts": [
            "INNER JOIN",
            "LEFT JOIN",
            "FULL JOIN",
            "self join",
            "anti join",
            "semi join",
            "non-equi join",
            "join cardinality",
            "bridge tables",
        ],
        "exercises": [
            "Return every order with customer full_name, email, order_date, status, and channel.",
            "Return each order item with order_id, product_name, category, quantity, unit_price, and line gross amount.",
            "List all customers and their orders, keeping customers who have never ordered.",
            "Find customers who have not placed any order using a LEFT JOIN anti join pattern.",
            "Find customers who have placed at least one delivered order using EXISTS or a semi join.",
            "Return employees with their manager name using a self join on employees.",
            "Return each support ticket with customer name, assigned employee name, and related order status when present.",
            "Join payments to orders and customers, but keep failed or unmatched payment investigations visible.",
            "Find order_items whose stored unit_price differs from the current products.list_price.",
            "Return product categories and the number of distinct customers who bought each category.",
            "Find customer pairs from the same city without returning duplicate reversed pairs.",
            "Join shipments to orders and calculate delivery duration in days for delivered shipments.",
            "Return customers who opened a support ticket before their first order date.",
            "Find orders that have no successful payment using a NOT EXISTS anti join.",
            "Return every marketing campaign with matching web events by utm_campaign, keeping campaigns with zero events.",
            "Join web_events to customers and orders where a purchase event occurs within 7 days before an order.",
            "Find products that have inventory movements but have never appeared in order_items.",
            "Return sales reps and the customers they have served through orders, removing duplicates.",
            "Detect accidental row multiplication by joining orders, order_items, and payments and comparing row counts per order.",
            "Use a FULL OUTER JOIN to compare customer cities against shipping cities and show cities present on only one side.",
            "Return tickets with their latest ticket_event by joining to a derived table.",
            "Find customers whose subscription active period overlaps their order date.",
            "Join products to order_items with a non-equi condition that flags line prices below 80 percent of list_price.",
            "Return the department hierarchy with each employee and department name.",
            "Build an order fact query with one row per order containing customer, sales rep, payment, shipment, and item-count fields.",
        ],
    },
    {
        "number": 3,
        "folder": "03_Aggregation_Grouping",
        "slug": "aggregation_grouping",
        "title": "Aggregation and Grouping",
        "level": "Intermediate-Advanced",
        "concepts": [
            "GROUP BY",
            "HAVING",
            "COUNT DISTINCT",
            "filtered aggregates",
            "ROLLUP",
            "CUBE",
            "GROUPING SETS",
            "percentiles",
            "string_agg",
            "json aggregation",
        ],
        "exercises": [
            "Calculate total revenue per order using order_items quantity, unit_price, and discount_pct.",
            "Return total paid amount per customer for successful payments only.",
            "Count orders by status and channel in a single grouped result.",
            "Find customers with more than two orders and show order_count and latest_order_date.",
            "Return average order value per month based on line totals.",
            "Calculate product-level quantity sold, gross revenue, and average discount.",
            "Find categories where total quantity sold is greater than 10.",
            "Use filtered aggregates to count open, pending, and closed support tickets per priority.",
            "Return each sales rep with delivered_order_count and refunded_order_count.",
            "Calculate distinct customer count per marketing campaign using web_events.",
            "Build a monthly revenue report with subtotal rows using ROLLUP.",
            "Build a status-by-channel cube showing counts for every combination and subtotal.",
            "Use GROUPING SETS to return revenue by month, by channel, and grand total in one result.",
            "Calculate median payment amount per payment method.",
            "Calculate 90th percentile delivery duration by carrier.",
            "Return each customer with a comma-separated list of categories they purchased.",
            "Return each order as a JSON array of item objects containing product_name, quantity, and net_amount.",
            "Find duplicate customer email domains and count customers per domain.",
            "Compute support ticket average resolution hours by assigned employee.",
            "Return products whose revenue contribution is more than 15 percent of total revenue.",
            "Calculate inventory net movement per product and keep only products with negative net movement.",
            "Find days where successful payment amount exceeded 500.",
            "Compute monthly active customers based on any web_event or order activity.",
            "Group subscriptions by plan_name and status and calculate monthly recurring revenue.",
            "Return each city with customers_count, order_count, and total_revenue while avoiding double counting.",
        ],
    },
    {
        "number": 4,
        "folder": "04_Subqueries_CTEs",
        "slug": "subqueries_ctes",
        "title": "Subqueries and CTEs",
        "level": "Intermediate-Advanced",
        "concepts": [
            "scalar subqueries",
            "correlated subqueries",
            "EXISTS",
            "NOT EXISTS",
            "CTE pipelines",
            "recursive CTEs",
            "LATERAL",
            "materialized CTE behavior",
        ],
        "exercises": [
            "Return orders whose total line amount is above the overall average order total.",
            "Find customers whose first order was paid successfully within 2 days.",
            "Use a CTE to calculate order totals, then rank customers by total spend.",
            "Use NOT EXISTS to find products that were never ordered after 2026-03-01.",
            "Use EXISTS to find customers who both ordered and opened a support ticket.",
            "Return the latest payment per order using a correlated subquery.",
            "Return each customer with their most recent web event using a LATERAL join.",
            "Use a recursive CTE to walk the employee manager hierarchy from the CEO downward.",
            "Use a recursive CTE to return the chain of managers for one employee.",
            "Build a CTE pipeline that calculates gross revenue, discounts, net revenue, and payment status per order.",
            "Find customers whose lifetime spend is greater than the average lifetime spend of their city.",
            "Use a scalar subquery in SELECT to show each product's share of all product revenue.",
            "Find orders where every order item has a discount_pct of zero.",
            "Find orders where at least one item was discounted by more than 10 percent.",
            "Use CTEs to identify customers with a web visit, cart event, and purchase event in sequence.",
            "Return products priced above the average price of their category.",
            "Use LATERAL to return the top two products by quantity for each customer.",
            "Find tickets whose latest event is not a customer reply.",
            "Use a CTE to deduplicate web events by session_id, event_type, and occurred_at.",
            "Compare monthly revenue to the previous month using CTEs without window functions.",
            "Use a CTE to isolate failed payments, then join to orders and customers for a retry report.",
            "Find customers with an active subscription but no order in the last 30 days from 2026-04-30.",
            "Use nested CTEs to compute category revenue and return categories above the category average.",
            "Use a derived table to find each customer's highest value order.",
            "Write the same top-customer query once with a subquery and once with a CTE, then compare readability.",
        ],
    },
    {
        "number": 5,
        "folder": "05_Window_Functions",
        "slug": "window_functions",
        "title": "Window Functions",
        "level": "Advanced",
        "concepts": [
            "ROW_NUMBER",
            "RANK",
            "DENSE_RANK",
            "LEAD/LAG",
            "running totals",
            "moving averages",
            "window frames",
            "NTILE",
            "FIRST_VALUE/LAST_VALUE",
            "gaps and islands",
        ],
        "exercises": [
            "Rank customers by lifetime net revenue using RANK and DENSE_RANK.",
            "Return the first order per customer using ROW_NUMBER.",
            "Return the latest support ticket event per ticket using ROW_NUMBER.",
            "Calculate a running total of daily successful payment amount.",
            "Calculate a 7-day moving average of daily web event count.",
            "Use LAG to show the previous order date for each customer and days between orders.",
            "Use LEAD to show the next ticket event time for each ticket.",
            "Find orders where order total is greater than the customer's previous order total.",
            "Compute percent_rank of products by revenue within each category.",
            "Divide customers into revenue quartiles using NTILE.",
            "Return the top three products by quantity sold within each category.",
            "Use FIRST_VALUE to show each customer's first channel and compare it to later channels.",
            "Use LAST_VALUE with an explicit frame to show each customer's latest order status on every order row.",
            "Calculate cumulative subscription monthly recurring revenue by start month.",
            "Detect gaps of more than 14 days between customer web sessions.",
            "Group consecutive daily activity into islands per customer.",
            "Calculate each order's percentage of monthly revenue using SUM over a partition.",
            "Return products whose price is above the category average using AVG as a window function.",
            "Calculate support ticket resolution-time rank by priority.",
            "Use COUNT over to show total orders per customer without collapsing rows.",
            "Build a cohort table using MIN signup month over customer partitions.",
            "Calculate running inventory balance per product ordered by movement_at.",
            "Find the first failed payment after a successful payment for each customer.",
            "Compare each employee's closed ticket count to their department average using window aggregates.",
            "Create a sessionized web_event result where a new session group starts after 30 minutes of inactivity.",
        ],
    },
    {
        "number": 6,
        "folder": "06_Data_Modeling_DDL",
        "slug": "data_modeling_ddl",
        "title": "Data Modeling and DDL",
        "level": "Advanced",
        "concepts": [
            "schemas",
            "CREATE TABLE",
            "ALTER TABLE",
            "constraints",
            "foreign keys",
            "normalization",
            "generated columns",
            "domains",
            "enums",
            "partitioning",
        ],
        "exercises": [
            "Design a normalized returns table linked to orders, order_items, customers, and products.",
            "Create a product_reviews table with rating constrained from 1 to 5 and one review per customer per product.",
            "Add a generated column to order_items that stores net_line_amount.",
            "Create a domain for positive_money and use it on a new vendor_contracts table.",
            "Create an enum for ticket_event_type and migrate ticket_events.event_type to use it.",
            "Add a CHECK constraint that prevents shipments.delivered_at before shipments.shipped_at.",
            "Add a foreign key from orders.sales_rep_id to employees.employee_id with an explicit delete behavior.",
            "Create a staging schema and a raw_orders table that accepts loose text fields.",
            "Design a slowly changing dimension table for customer addresses.",
            "Split product category into a separate categories table and update products to reference it.",
            "Create a bridge table for campaigns and products with a composite primary key.",
            "Add a unique constraint that prevents duplicate active subscriptions for the same customer and plan.",
            "Create an audit table for order status transitions with old_status, new_status, and changed_at.",
            "Create a monthly partitioned table for web_events_archive.",
            "Create a temporary table that stores one month's high-value customers for analysis.",
            "Create a view-friendly star schema outline with fact_orders and dimensions for customer, product, and date.",
            "Use ALTER TABLE to add a NOT NULL constraint safely for customers.country.",
            "Create a table with a JSONB column and a CHECK constraint that validates required metadata keys.",
            "Design a many-to-many relationship between employees and departments with assignment dates.",
            "Create an exclusion constraint to prevent overlapping active subscription periods per customer and plan.",
            "Add comments on tables and columns for support_tickets and ticket_events.",
            "Create a materialized view definition for daily revenue summary.",
            "Design a data retention table policy using partition naming and drop strategy comments.",
            "Create a migration script that renames coupon_code to promotion_code without losing data.",
            "Write a rollback script for one DDL change from this module.",
        ],
    },
    {
        "number": 7,
        "folder": "07_DML_Transactions_Merge",
        "slug": "dml_transactions_merge",
        "title": "DML, Transactions, and MERGE",
        "level": "Advanced",
        "concepts": [
            "INSERT",
            "UPDATE",
            "DELETE",
            "UPSERT",
            "MERGE",
            "RETURNING",
            "transactions",
            "savepoints",
            "isolation",
            "locking",
        ],
        "exercises": [
            "Insert a new customer and return the generated customer_id.",
            "Insert an order with two order_items inside one transaction.",
            "Update failed payments back to 'pending' for retry only for orders that are not cancelled.",
            "Delete anonymous web_events older than 90 days from 2026-04-30 using a safe preview query first.",
            "Use INSERT ... ON CONFLICT to upsert a customer by email.",
            "Use MERGE to synchronize a staging product price table into products.",
            "Use UPDATE ... FROM to set orders.status to 'delivered' for shipments with delivered_at present and successful payment.",
            "Use RETURNING to capture changed order_ids into a follow-up query.",
            "Create a transaction with SAVEPOINT around a risky order status update.",
            "Write a transaction that transfers ticket ownership from one employee to another.",
            "Demonstrate how SELECT FOR UPDATE would protect inventory during order creation.",
            "Write two statements that could deadlock if run in opposite order, then reorder them safely.",
            "Use DELETE with USING to remove duplicate staging rows while keeping the newest row.",
            "Bulk insert campaign rows from a VALUES clause.",
            "Use COPY command comments to describe how you would load a CSV into staging.raw_orders.",
            "Update subscription statuses to expired when ended_on is before 2026-04-30.",
            "Cancel unpaid pending orders older than 30 days and write affected rows to an audit table.",
            "Use a CTE with INSERT to create support tickets for failed payments above 200.",
            "Use a writable CTE to insert a ticket_event immediately after creating a support_ticket.",
            "Write a transaction that changes product prices and records old and new prices in price_history.",
            "Show how READ COMMITTED and REPEATABLE READ would affect a revenue report during concurrent payments.",
            "Use advisory-lock comments to protect one monthly billing run from running twice.",
            "Use TRUNCATE on a staging table and explain the difference from DELETE in comments.",
            "Update order status based on payment and shipment state with a CASE expression.",
            "Design an idempotent daily load script that can be rerun without duplicating facts.",
        ],
    },
    {
        "number": 8,
        "folder": "08_Indexes_Performance",
        "slug": "indexes_performance",
        "title": "Indexes and Query Performance",
        "level": "Advanced",
        "concepts": [
            "EXPLAIN",
            "EXPLAIN ANALYZE",
            "B-tree indexes",
            "composite indexes",
            "partial indexes",
            "expression indexes",
            "covering indexes",
            "GIN",
            "BRIN",
            "statistics",
        ],
        "exercises": [
            "Run EXPLAIN for a customer lookup by email and propose the supporting index.",
            "Create a composite index for orders filtered by customer_id and sorted by order_date desc.",
            "Create a partial index for open support tickets only.",
            "Create an expression index for lower(customers.email) and write a query that can use it.",
            "Create a covering index for payments by order_id including amount and status.",
            "Compare index column order for queries filtering by channel and order_date.",
            "Rewrite a non-sargable date filter on orders so an index can be used.",
            "Create a GIN index for web_events.metadata and query by device.",
            "Create a GIN index for full-text search over support ticket subject and note text.",
            "Create a BRIN index strategy for a large append-only web_events table.",
            "Use EXPLAIN ANALYZE to compare EXISTS versus JOIN DISTINCT for customer activity.",
            "Find a query where an index might hurt because the table is tiny or selectivity is low.",
            "Create statistics on correlated columns channel and status in orders.",
            "Refresh a materialized daily revenue view and discuss index placement on it.",
            "Detect unused indexes using catalog-query comments and explain when to drop one.",
            "Optimize a top-products query by pre-aggregating order_items in a CTE.",
            "Avoid SELECT * in a wide join and explain how it changes memory and I/O.",
            "Compare OFFSET pagination to keyset pagination for orders.",
            "Write a keyset pagination query using order_date and order_id.",
            "Use DISTINCT ON versus ROW_NUMBER for latest payment per order and compare plans.",
            "Optimize a query that filters JSONB metadata by campaign and device.",
            "Identify a join that needs indexes on both foreign key and referenced key.",
            "Explain when VACUUM and ANALYZE matter after bulk loading seed data.",
            "Create a query that shows estimated versus actual rows and describe what mismatch means.",
            "Design an indexing strategy for a dashboard with filters by month, city, status, and channel.",
        ],
    },
    {
        "number": 9,
        "folder": "09_PostgreSQL_Advanced_Types",
        "slug": "postgresql_advanced_types",
        "title": "PostgreSQL Advanced Types and Functions",
        "level": "Advanced",
        "concepts": [
            "JSONB",
            "arrays",
            "ranges",
            "intervals",
            "timestamps",
            "UUID",
            "full-text search",
            "regular expressions",
            "custom functions",
            "extensions",
        ],
        "exercises": [
            "Extract device, browser, and referrer values from web_events.metadata JSONB.",
            "Filter web_events where metadata contains a nested experiment assignment.",
            "Update a JSONB metadata object to add a normalized_device key.",
            "Aggregate event types per session into a text array.",
            "Find customers whose purchased category array overlaps a target array of categories.",
            "Use unnest to turn a category array into rows for analysis.",
            "Create a daterange for each subscription and test whether 2026-04-15 is inside it.",
            "Find overlapping subscription periods using range operators.",
            "Calculate intervals between opened_at and closed_at for tickets and format hours.",
            "Convert order_date from UTC assumption to a named time zone for reporting.",
            "Generate a date series for every day in April 2026 and left join daily revenue.",
            "Use regexp_replace to normalize phone numbers to digits only.",
            "Use regexp_match to extract coupon family and numeric suffix from coupon_code.",
            "Create a tsvector search query over support_tickets.subject.",
            "Rank search results for tickets using ts_rank.",
            "Create a UUID-based table for external webhook events.",
            "Use gen_random_uuid comments and extension setup for pgcrypto.",
            "Create a SQL function that returns net line amount from quantity, price, and discount.",
            "Create an immutable function for email domain extraction and use it in a query.",
            "Create a stable function that returns customer lifetime spend.",
            "Use date_trunc and extract to build fiscal-quarter labels.",
            "Use make_interval to add a configurable trial period to subscription start dates.",
            "Create a composite type for money breakdown with gross, discount, and net fields.",
            "Use DISTINCT ON as a PostgreSQL-specific shortcut for latest row per group.",
            "Use FILTER with aggregate functions to build compact pivot-like metrics.",
        ],
    },
    {
        "number": 10,
        "folder": "10_Analytics_Reporting_Cohorts",
        "slug": "analytics_reporting_cohorts",
        "title": "Analytics, Reporting, and Cohorts",
        "level": "Advanced",
        "concepts": [
            "cohort analysis",
            "retention",
            "funnels",
            "RFM",
            "churn",
            "LTV",
            "SLA metrics",
            "financial reporting",
            "dashboard datasets",
        ],
        "exercises": [
            "Build a monthly revenue table with gross, discount, net, paid, refunded, and outstanding amounts.",
            "Calculate signup cohort month and first purchase month for each customer.",
            "Create a retention matrix showing cohort month versus months since signup based on orders.",
            "Build a funnel from visit to product_view to add_to_cart to purchase using web_events.",
            "Calculate conversion rate by marketing campaign and device.",
            "Compute customer lifetime value using successful payments minus refunds.",
            "Build RFM segments using recency, frequency, and monetary value.",
            "Identify churn-risk subscription customers with active subscription but declining order activity.",
            "Calculate monthly recurring revenue, new MRR, expansion MRR, contraction MRR, and churned MRR.",
            "Calculate average order value by first acquisition campaign.",
            "Find repeat purchase rate by customer signup month.",
            "Calculate product attach rate for each category pair bought in the same order.",
            "Build a customer 360 row with spend, orders, tickets, latest activity, and subscription status.",
            "Calculate SLA compliance for high-priority tickets closed within 24 hours.",
            "Identify support drivers by grouping ticket subjects into business categories with CASE.",
            "Build a daily operations dashboard dataset with orders, revenue, failed payments, and open tickets.",
            "Calculate refund rate by product category and sales channel.",
            "Find top cities by revenue growth month over month.",
            "Calculate cohort payback period using campaign budget and successful payment revenue.",
            "Build a rolling 30-day active customer metric.",
            "Calculate inventory sell-through rate by product.",
            "Find products with high views but low purchases using web_events and order_items.",
            "Create a profitability report using order revenue minus shipping_cost.",
            "Calculate employee support workload and resolution quality metrics.",
            "Design a single SQL result suitable for a BI dashboard filterable by month, city, status, and channel.",
        ],
    },
    {
        "number": 11,
        "folder": "11_Views_Security_RLS",
        "slug": "views_security_rls",
        "title": "Views, Security, and Row-Level Security",
        "level": "Advanced",
        "concepts": [
            "views",
            "materialized views",
            "roles",
            "GRANT",
            "REVOKE",
            "row-level security",
            "security definer",
            "data masking",
            "least privilege",
        ],
        "exercises": [
            "Create a reporting view that exposes order totals but hides customer email.",
            "Create a customer_support view that shows customer contact fields and open ticket details.",
            "Create a materialized view for daily revenue and write a refresh command.",
            "Grant SELECT on reporting views to a readonly_analyst role.",
            "Revoke direct table access from readonly_analyst while keeping view access.",
            "Create a masked customer view that shows only email domain and last four phone digits.",
            "Create a role for support agents that can update only support_tickets status and assigned_to.",
            "Enable row-level security on support_tickets.",
            "Write an RLS policy so support agents can see only tickets assigned to their employee mapping.",
            "Write an RLS policy so sales reps can see only orders assigned to them.",
            "Create an admin role that bypasses normal reporting limitations using explicit grants.",
            "Create a security definer function that safely returns customer lifetime spend.",
            "Explain in comments why search_path matters for security definer functions.",
            "Create a view with WITH CHECK OPTION for editable active subscriptions.",
            "Create a policy that prevents updates to closed tickets except for admin role.",
            "Audit privileges for a table using information_schema query comments.",
            "Create a public-safe campaign performance view with no customer-level identifiers.",
            "Create a data export view that excludes PII and sensitive ticket notes.",
            "Design a least-privilege permission matrix for analyst, support_agent, sales_rep, and admin.",
            "Write a transaction that creates a role, grants usage on schema, grants view access, and tests access.",
            "Create a materialized view index for fast dashboard reads.",
            "Create a view that normalizes order statuses into business-friendly labels.",
            "Use column-level privileges to allow reading customers.city but not customers.email.",
            "Write a query to find tables in sql_mastery with no explicit privileges granted.",
            "Design a secure sharing layer for external partners who need campaign-level metrics only.",
        ],
    },
    {
        "number": 12,
        "folder": "12_Procedures_Triggers_Automation",
        "slug": "procedures_triggers_automation",
        "title": "Procedures, Triggers, and Automation",
        "level": "Advanced",
        "concepts": [
            "SQL functions",
            "PL/pgSQL",
            "procedures",
            "triggers",
            "exception handling",
            "dynamic SQL",
            "audit automation",
            "scheduled jobs",
        ],
        "exercises": [
            "Create a SQL function that calculates order net total by order_id.",
            "Create a PL/pgSQL function that returns customer lifetime spend.",
            "Create a procedure that closes stale pending tickets older than a configurable number of days.",
            "Create a trigger that writes order status changes into order_status_audit.",
            "Create a trigger that prevents delivered orders from being moved back to pending.",
            "Create a trigger that updates products.updated_at whenever list_price changes.",
            "Create a function that raises an exception when payment amount exceeds order total by more than 5 percent.",
            "Create a procedure that performs a daily revenue snapshot insert.",
            "Use dynamic SQL to rebuild indexes for tables matching a naming pattern.",
            "Create a trigger on ticket_events that updates support_tickets.updated_at.",
            "Create a trigger that auto-closes a ticket when a ticket_event type is 'resolved'.",
            "Create an audit function reusable across multiple tables with TG_TABLE_NAME.",
            "Create a function that returns a table of top customers with parameters for date range and limit.",
            "Create a procedure that retries failed payments by inserting rows into payment_retry_queue.",
            "Use exception handling to log failed procedure runs to job_errors.",
            "Create a scheduled-job design comment using pg_cron for refreshing materialized views.",
            "Create a notification trigger using NOTIFY when urgent tickets are inserted.",
            "Create a validation function used by a CHECK constraint for allowed coupon format.",
            "Create a function that accepts JSONB input and inserts a web_event after validation.",
            "Create a procedure that archives old web_events into a partitioned archive table.",
            "Create a trigger that maintains inventory balance after inventory_movements inserts.",
            "Create a function that returns order profitability including shipping cost.",
            "Create a trigger that blocks deleting customers who have orders.",
            "Create a procedure that reassigns tickets from inactive employees to a queue user.",
            "Write tests as SQL statements that prove one trigger works for insert, update, and invalid input.",
        ],
    },
    {
        "number": 13,
        "folder": "13_Data_Quality_Testing_Auditing",
        "slug": "data_quality_testing_auditing",
        "title": "Data Quality, Testing, and Auditing",
        "level": "Advanced",
        "concepts": [
            "data tests",
            "deduplication",
            "reconciliation",
            "anomaly detection",
            "audit queries",
            "migration validation",
            "null checks",
            "referential checks",
        ],
        "exercises": [
            "Write a test query that returns rows when customers.email is null or duplicated.",
            "Write a test query that returns order_items with quantity <= 0 or unit_price < 0.",
            "Write a reconciliation query comparing order net total to successful payment amount.",
            "Detect customers with multiple active subscriptions for the same plan.",
            "Find shipments delivered before they were shipped.",
            "Find orders marked delivered without a delivered shipment.",
            "Find paid orders with no successful payment row.",
            "Find payment rows whose amount is more than 5 percent above order total.",
            "Detect duplicate web_events based on session_id, event_type, occurred_at, and page_url.",
            "Find support tickets that are closed but have no closed_at timestamp.",
            "Find ticket_events that occurred before the ticket opened_at time.",
            "Build an anomaly query for daily revenue more than 3 standard deviations from the trailing average.",
            "Build a freshness check for web_events requiring data within the last 24 hours of 2026-04-30.",
            "Write a row-count validation query before and after loading staging.raw_orders.",
            "Write a checksum-style aggregate for payments to compare source and target loads.",
            "Detect orphaned foreign keys if constraints were temporarily disabled.",
            "Write a query that profiles null percentage for selected customer columns.",
            "Write a query that profiles min, max, average, and percentile values for payment amount.",
            "Find impossible status combinations across orders, payments, and shipments.",
            "Create an audit report of orders updated in the last 7 days using an audit table design.",
            "Validate that every product category in products exists in a categories reference table.",
            "Find inactive products that still receive new order_items after deactivation.",
            "Detect city spelling variants using lower, trim, and grouping.",
            "Write a migration validation query for renaming coupon_code to promotion_code.",
            "Create a data quality scorecard result with test_name, failing_rows, severity, and owner.",
        ],
    },
    {
        "number": 14,
        "folder": "14_Capstone_Projects",
        "slug": "capstone_projects",
        "title": "Capstone Projects",
        "level": "Expert",
        "concepts": [
            "schema design",
            "analytics engineering",
            "performance tuning",
            "security",
            "automation",
            "production readiness",
        ],
        "exercises": [
            "Design and implement an ecommerce reporting mart with fact_order_items and customer, product, date, and campaign dimensions.",
            "Build a customer 360 mart with one row per customer and documented refresh logic.",
            "Create a subscription retention dashboard dataset with cohort month, active months, churn month, and MRR metrics.",
            "Build a support operations mart with SLA, backlog, reopen rate, employee workload, and priority metrics.",
            "Create a product performance mart that combines views, carts, purchases, refunds, and inventory movement.",
            "Design a secure analyst layer with masked views, grants, and no direct table access.",
            "Create a complete indexing plan for the customer 360 and dashboard queries, with EXPLAIN notes.",
            "Implement an audit mechanism for order status and payment status changes.",
            "Build a daily data quality scorecard and store its output in a table.",
            "Create a SQL-only ETL flow from staging.raw_orders into normalized orders and order_items.",
            "Design a rollback-safe migration for splitting product category into a categories table.",
            "Create a materialized revenue summary with a refresh procedure and validation query.",
            "Build a campaign attribution report using first-touch and last-touch models.",
            "Build a funnel report with conversion rates and median time between steps.",
            "Create a revenue forecast baseline using trailing moving averages in SQL.",
            "Design a row-level security model for regional sales reps and support agents.",
            "Create a performance troubleshooting report for one intentionally slow dashboard query.",
            "Build a data deletion workflow for privacy requests while preserving aggregate reporting.",
            "Create a test pack that validates constraints, transformations, and business metrics.",
            "Create a partition maintenance plan for web_events and demonstrate adding the next month partition.",
            "Build an inventory replenishment report using sales velocity and current inventory balance.",
            "Create a payment failure recovery workflow with retry queue, ticket creation, and audit trail.",
            "Design a warehouse-style naming convention and refactor at least five objects to follow it.",
            "Write a production readiness README for backup, restore, monitoring, permissions, and deployment.",
            "Prepare a portfolio case study explaining the business problem, schema, hard queries, performance choices, and screenshots to capture.",
        ],
    },
]


SCHEMA_SQL = r"""
DROP SCHEMA IF EXISTS sql_mastery CASCADE;
CREATE SCHEMA sql_mastery;
SET search_path TO sql_mastery;

CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'successful', 'failed', 'refunded');
CREATE TYPE ticket_status AS ENUM ('open', 'pending_customer', 'resolved', 'closed');
CREATE TYPE subscription_status AS ENUM ('trialing', 'active', 'paused', 'cancelled', 'expired');

CREATE TABLE departments (
    department_id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    department_name text NOT NULL UNIQUE
);

CREATE TABLE employees (
    employee_id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    full_name text NOT NULL,
    email text NOT NULL UNIQUE,
    department_id integer REFERENCES departments(department_id),
    manager_id integer REFERENCES employees(employee_id),
    role_title text NOT NULL,
    active boolean NOT NULL DEFAULT true,
    hired_on date NOT NULL
);

CREATE TABLE customers (
    customer_id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    full_name text NOT NULL,
    email text NOT NULL UNIQUE,
    phone text,
    city text NOT NULL,
    state text,
    country text NOT NULL DEFAULT 'US',
    signup_date date NOT NULL,
    active boolean NOT NULL DEFAULT true,
    CHECK (position('@' in email) > 1)
);

CREATE TABLE products (
    product_id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    sku text NOT NULL UNIQUE,
    product_name text NOT NULL,
    category text NOT NULL,
    list_price numeric(10, 2) NOT NULL CHECK (list_price >= 0),
    active boolean NOT NULL DEFAULT true,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE marketing_campaigns (
    campaign_id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    campaign_code text NOT NULL UNIQUE,
    campaign_name text NOT NULL,
    channel text NOT NULL,
    started_on date NOT NULL,
    ended_on date,
    budget numeric(12, 2) NOT NULL CHECK (budget >= 0)
);

CREATE TABLE orders (
    order_id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    customer_id integer NOT NULL REFERENCES customers(customer_id),
    sales_rep_id integer REFERENCES employees(employee_id),
    order_date timestamp NOT NULL,
    status order_status NOT NULL,
    channel text NOT NULL,
    coupon_code text,
    shipping_city text NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    order_item_id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    order_id integer NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id integer NOT NULL REFERENCES products(product_id),
    quantity integer NOT NULL CHECK (quantity > 0),
    unit_price numeric(10, 2) NOT NULL CHECK (unit_price >= 0),
    discount_pct numeric(5, 2) NOT NULL DEFAULT 0 CHECK (discount_pct >= 0 AND discount_pct <= 100)
);

CREATE TABLE payments (
    payment_id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    order_id integer NOT NULL REFERENCES orders(order_id),
    payment_date timestamp NOT NULL,
    amount numeric(12, 2) NOT NULL,
    method text NOT NULL,
    status payment_status NOT NULL,
    transaction_ref text UNIQUE
);

CREATE TABLE shipments (
    shipment_id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    order_id integer NOT NULL REFERENCES orders(order_id),
    shipped_at timestamp,
    delivered_at timestamp,
    carrier text NOT NULL,
    tracking_code text UNIQUE,
    shipping_cost numeric(10, 2) NOT NULL DEFAULT 0,
    CHECK (delivered_at IS NULL OR shipped_at IS NULL OR delivered_at >= shipped_at)
);

CREATE TABLE inventory_movements (
    movement_id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    product_id integer NOT NULL REFERENCES products(product_id),
    movement_type text NOT NULL CHECK (movement_type IN ('purchase', 'sale', 'return', 'adjustment')),
    quantity_delta integer NOT NULL,
    movement_at timestamp NOT NULL,
    reference text
);

CREATE TABLE support_tickets (
    ticket_id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    customer_id integer NOT NULL REFERENCES customers(customer_id),
    order_id integer REFERENCES orders(order_id),
    assigned_to integer REFERENCES employees(employee_id),
    opened_at timestamp NOT NULL,
    closed_at timestamp,
    priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status ticket_status NOT NULL,
    subject text NOT NULL
);

CREATE TABLE ticket_events (
    ticket_event_id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    ticket_id integer NOT NULL REFERENCES support_tickets(ticket_id) ON DELETE CASCADE,
    event_at timestamp NOT NULL,
    actor_type text NOT NULL CHECK (actor_type IN ('customer', 'agent', 'system')),
    event_type text NOT NULL,
    note text
);

CREATE TABLE web_events (
    event_id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    customer_id integer REFERENCES customers(customer_id),
    session_id text NOT NULL,
    occurred_at timestamp NOT NULL,
    event_type text NOT NULL,
    page_url text NOT NULL,
    utm_campaign text,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE subscriptions (
    subscription_id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    customer_id integer NOT NULL REFERENCES customers(customer_id),
    plan_name text NOT NULL,
    started_on date NOT NULL,
    ended_on date,
    monthly_price numeric(10, 2) NOT NULL CHECK (monthly_price >= 0),
    status subscription_status NOT NULL,
    CHECK (ended_on IS NULL OR ended_on >= started_on)
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date DESC);
CREATE INDEX idx_order_items_order_product ON order_items(order_id, product_id);
CREATE INDEX idx_payments_order_status ON payments(order_id, status);
CREATE INDEX idx_tickets_status_priority ON support_tickets(status, priority);
CREATE INDEX idx_web_events_session_time ON web_events(session_id, occurred_at);
CREATE INDEX idx_web_events_metadata_gin ON web_events USING GIN (metadata);
"""


SEED_SQL = r"""
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
"""


def write_file(relative_path: str, content: str) -> None:
    path = ROOT / relative_path
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.strip() + "\n", encoding="utf-8")


def module_path(module: dict[str, object]) -> str:
    return f"{module['folder']}/task_{module['number']:02d}_{module['slug']}.sql"


def format_module(module: dict[str, object]) -> str:
    concepts = ", ".join(module["concepts"])
    lines = [
        "/*",
        "=" * 78,
        f"  TASK {module['number']:02d}: {module['title']}",
        "=" * 78,
        "",
        f"LEVEL: {module['level']}",
        f"CONCEPTS: {concepts}",
        "",
        "HOW TO PRACTICE:",
        "1. Run ../00_Setup/01_create_schema.sql",
        "2. Run ../00_Setup/02_seed_data.sql",
        "3. Write each answer under its prompt.",
        "4. Keep every solution as one independent SQL statement unless a task asks for DDL or a transaction.",
        "",
        "Target: 25 non-repeated exercises for this topic.",
        "*/",
        "",
        "SET search_path TO sql_mastery;",
        "",
    ]

    for index, exercise in enumerate(module["exercises"], start=1):
        lines.extend(
            [
                "-" * 78,
                f"-- Challenge {module['number']:02d}.{index:02d}",
                f"-- {exercise}",
                "-- Write your solution below.",
                "",
                "",
            ]
        )

    return "\n".join(lines)


def format_module_readme(module: dict[str, object]) -> str:
    exercises = "\n".join(
        f"| {module['number']:02d}.{index:02d} | {exercise} |"
        for index, exercise in enumerate(module["exercises"], start=1)
    )
    concepts = "\n".join(f"- {concept}" for concept in module["concepts"])
    return (
        f"# Task {module['number']:02d}: {module['title']}\n\n"
        f"Level: {module['level']}\n\n"
        "## Concepts\n\n"
        f"{concepts}\n\n"
        "## Exercises\n\n"
        "| # | Prompt |\n"
        "|---|--------|\n"
        f"{exercises}\n"
    )


def build_readme() -> str:
    table = "\n".join(
        f"| {module['number']:02d} | `{module['folder']}` | {module['title']} | {module['level']} | 25 |"
        for module in MODULES
    )
    total = sum(len(module["exercises"]) for module in MODULES)
    return (
        "# SQL Intermediate to Advanced Mastery\n\n"
        "This track is built for an intermediate SQL learner who wants to become advanced through deliberate practice.\n\n"
        "The curriculum is PostgreSQL-first because advanced SQL work depends on realistic features such as window functions, JSONB, CTEs, indexing, transactions, row-level security, functions, and query planning. Most querying exercises still transfer cleanly to other SQL databases.\n\n"
        "## Docker-First Setup\n\n"
        "From `C:\\Learning`:\n\n"
        "```powershell\n"
        "SQL/scripts/start_sql.ps1\n"
        "```\n\n"
        "This starts PostgreSQL in Docker and automatically loads the practice schema and seed data on first run.\n\n"
        "Connection details:\n\n"
        "- Host: `localhost`\n"
        "- Port: `5433`\n"
        "- Database: `sql_mastery_lab`\n"
        "- User: `learner`\n"
        "- Password: `learner_pass`\n"
        "- Practice schema: `sql_mastery`\n\n"
        "Useful commands:\n\n"
        "```powershell\n"
        "SQL/scripts/psql.ps1\n"
        "SQL/scripts/reset_sql.ps1\n"
        "SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql\n"
        "SQL/scripts/stop_sql.ps1\n"
        "```\n\n"
        "## How to Use the Tasks\n\n"
        "1. Start Docker PostgreSQL with `SQL/scripts/start_sql.ps1`.\n"
        "2. Open a task file and write answers below each prompt.\n"
        "3. Run queries interactively with `SQL/scripts/psql.ps1`.\n"
        "4. Reset the database anytime with `SQL/scripts/reset_sql.ps1`.\n"
        "5. Keep your own answers under each prompt or in `solutions/`.\n\n"
        "## Modules\n\n"
        "| # | Folder | Topic | Level | Exercises |\n"
        "|---|--------|-------|-------|-----------|\n"
        f"{table}\n\n"
        f"Total exercises: {total}\n\n"
        "## Progress Standard\n\n"
        "You are ready to call a module complete when you can:\n\n"
        "- solve at least 80 percent of the exercises without looking up syntax;\n"
        "- explain why your query returns the correct grain and does not duplicate rows;\n"
        "- rewrite at least three solutions using a different approach;\n"
        "- read `EXPLAIN` output for performance-heavy tasks;\n"
        "- describe edge cases around NULLs, duplicate rows, missing relationships, and time ranges.\n"
    )


def build_plan() -> str:
    rows = "\n".join(
        f"| {module['number']:02d} | {module['title']} | {module['level']} | {', '.join(module['concepts'][:4])} | 25 | [ ] |"
        for module in MODULES
    )
    return (
        "# Ultra SQL Mastery Plan\n\n"
        "Goal: move from intermediate SQL to advanced, production-ready SQL across querying, analytics, modeling, performance, security, automation, and data quality.\n\n"
        "## Track\n\n"
        "| # | Module | Level | Main Skills | Exercises | Status |\n"
        "|---|--------|-------|-------------|-----------|--------|\n"
        f"{rows}\n\n"
        "## Suggested Order\n\n"
        "1. Querying, joins, aggregation, CTEs, and windows.\n"
        "2. Data modeling, DML, transactions, and performance.\n"
        "3. PostgreSQL-specific features, analytics, security, and automation.\n"
        "4. Data quality and capstones.\n\n"
        "## Weekly Plan\n\n"
        "| Week | Focus |\n"
        "|------|-------|\n"
        "| 1 | Modules 01-03: query precision, joins, grouping |\n"
        "| 2 | Modules 04-05: CTEs, recursion, windows |\n"
        "| 3 | Modules 06-08: schema design, DML, indexes, EXPLAIN |\n"
        "| 4 | Modules 09-10: PostgreSQL features and analytics reports |\n"
        "| 5 | Modules 11-13: security, automation, data quality |\n"
        "| 6 | Module 14: capstones and portfolio polish |\n"
    )


def build_rubric() -> str:
    return dedent(
        """
        # SQL Interview and Production Readiness Rubric

        ## 6/10: Solid Intermediate

        - Writes correct SELECT, JOIN, GROUP BY, HAVING, and CASE queries.
        - Understands INNER versus LEFT joins.
        - Handles NULL intentionally.
        - Can use simple CTEs and subqueries.

        ## 8/10: Advanced Working Level

        - Uses window functions for ranking, running totals, retention, and deduplication.
        - Designs normalized tables with constraints and indexes.
        - Reads basic EXPLAIN plans and identifies obvious bottlenecks.
        - Writes safe DML with transactions and RETURNING.
        - Builds analytics queries without accidental double counting.

        ## 10/10: Production Ready

        - Designs schemas, marts, migrations, views, and permission layers.
        - Tunes queries with evidence from EXPLAIN ANALYZE.
        - Uses PostgreSQL features such as JSONB, ranges, GIN, materialized views, functions, and RLS.
        - Creates repeatable data quality checks and audit trails.
        - Can explain tradeoffs in indexing, transaction isolation, denormalization, partitioning, and security.
        """
    )


def build_setup_readme() -> str:
    return dedent(
        """
        # SQL Setup

        These files create a PostgreSQL practice schema named `sql_mastery`.

        The recommended workflow is Docker. From `C:\\Learning`:

        ```powershell
        SQL/scripts/start_sql.ps1
        ```

        ## Connection

        - Host: `localhost`
        - Port: `5433`
        - Database: `sql_mastery_lab`
        - User: `learner`
        - Password: `learner_pass`
        - Schema: `sql_mastery`

        ## Common Commands

        ```powershell
        SQL/scripts/start_sql.ps1
        SQL/scripts/psql.ps1
        SQL/scripts/reset_sql.ps1
        SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql
        SQL/scripts/stop_sql.ps1
        ```

        ## Manual psql Alternative

        If you already have PostgreSQL installed locally, you can still run:

        ```powershell
        psql -d sql_mastery_lab -f SQL/00_Setup/01_create_schema.sql
        psql -d sql_mastery_lab -f SQL/00_Setup/02_seed_data.sql
        ```

        The schema script drops and recreates only the `sql_mastery` schema, not the whole database.
        """
    )


def build_solutions_readme() -> str:
    return dedent(
        """
        # Solutions

        Keep your own answers here if you prefer not to write directly in the task files.

        Recommended naming:

        - `task_01_querying_filtering_sorting_answers.sql`
        - `task_02_joins_relationships_answers.sql`
        - continue the same pattern for later modules

        For deeper learning, write two versions for difficult prompts:

        - a clear version optimized for readability;
        - a performance-aware version with comments about indexes or query plan tradeoffs.
        """
    )


def main() -> None:
    write_file("README.md", build_readme())
    write_file("ULTRA_SQL_PLAN.md", build_plan())
    write_file("INTERVIEW_READINESS_RUBRIC.md", build_rubric())
    write_file("00_Setup/README.md", build_setup_readme())
    write_file("00_Setup/01_create_schema.sql", SCHEMA_SQL)
    write_file("00_Setup/02_seed_data.sql", SEED_SQL)
    write_file("solutions/README.md", build_solutions_readme())

    for module in MODULES:
        write_file(module_path(module), format_module(module))
        write_file(f"{module['folder']}/README.md", format_module_readme(module))

    seen: set[str] = set()
    duplicates: list[str] = []
    for module in MODULES:
        for exercise in module["exercises"]:
            normalized = exercise.lower().strip()
            if normalized in seen:
                duplicates.append(exercise)
            seen.add(normalized)

    if duplicates:
        raise SystemExit(f"Duplicate exercises found: {duplicates}")

    total = sum(len(module["exercises"]) for module in MODULES)
    print(f"Generated {len(MODULES)} SQL modules with {total} exercises.")


if __name__ == "__main__":
    main()
