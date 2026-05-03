# Section 11: Database & ORM Integration

> **Prerequisites:** Complete Sections 00-10. You need async/await (Section 07), serde (Section 09), and Axum basics (Section 10) to integrate DB with your web API.

## 🎯 Learning Objectives
- Set up PostgreSQL with Docker and connect from Rust
- Perform CRUD operations with SQLx (async, compile-time checked)
- Handle migrations, transactions, and connection pooling
- Build a data access layer for web apps
- Understand compile-time query checking with `sqlx prepare`

---

## 📖 Core Concepts

### PostgreSQL Setup

```bash
# Quickest way: Docker one-liner
docker run -d --name rust-postgres \
  -e POSTGRES_USER=rustuser \
  -e POSTGRES_PASSWORD=rustpass \
  -e POSTGRES_DB=myapp \
  -p 5432:5432 \
  postgres:16

# Or use docker-compose.yml:
# services:
#   db:
#     image: postgres:16
#     environment:
#       POSTGRES_USER: rustuser
#       POSTGRES_PASSWORD: rustpass
#       POSTGRES_DB: myapp
#     ports: ["5432:5432"]
```

### Environment Setup

```bash
# Install sqlx-cli for migrations
cargo install sqlx-cli --no-default-features --features postgres

# Create a .env file in your project root
echo 'DATABASE_URL=postgres://rustuser:rustpass@localhost/myapp' > .env
```

```toml
# Cargo.toml
[dependencies]
sqlx = { version = "0.7", features = ["runtime-tokio-rustls", "postgres", "chrono", "uuid"] }
tokio = { version = "1", features = ["full"] }
uuid = { version = "1", features = ["v4", "serde"] }
chrono = { version = "0.4", features = ["serde"] }
dotenvy = "0.15"   # Load .env file
```

```rust
// Load .env in main()
dotenvy::dotenv().ok(); // ok() ignores missing .env (for production)
let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
```

### Compile-Time Query Checking

```bash
# SQLx can check queries against your real DB at compile time:
# 1. Ensure DATABASE_URL is set and DB is running
# 2. Use query!() / query_as!() macros instead of query() / query_as()

# For CI (where DB isn't available), prepare offline data:
cargo sqlx prepare
# This creates a .sqlx/ directory with cached query metadata
# Commit it to git — CI can compile without a running database
```

### SQLx vs Diesel vs SeaORM

| Feature | SQLx | Diesel | SeaORM |
|---------|------|--------|--------|
| Approach | Raw SQL + macros | Query builder DSL | Active Record ORM |
| Async | Yes (native) | No (sync only) | Yes (built on SQLx) |
| Learning curve | Low (just SQL) | Medium (DSL) | Medium (ORM concepts) |
| Compile-time checks | Yes (query macros) | Yes (schema.rs) | Partial |
| When to use | You know SQL well | Complex type-safe queries | Rapid prototyping |

### Why SQLx?

**Scenario:** You're building a web API that needs a database. SQLx is unique because it **checks your SQL queries at compile time** against your actual database. If you have a typo in a column name, it won't compile!

---

## 📝 Tasks

### Task 1: Database Connection & Basic Queries

**What to do:** Set up a connection pool, define a User model with `FromRow`, and build a UserRepository with find, list, create, update, and soft-delete operations.

<details>
<summary>Click to see answer</summary>

```rust
use sqlx::{PgPool, FromRow, postgres::PgPoolOptions};
use chrono::{DateTime, Utc};
use uuid::Uuid;

// Model that maps directly to a database row
#[derive(Debug, FromRow, Clone)]
struct User {
    id: Uuid,
    email: String,
    name: String,
    password_hash: String,
    role: String,
    is_active: bool,
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
}

// DTOs (Data Transfer Objects) — what we send/receive via API
#[derive(Debug)]
struct CreateUserDto {
    email: String,
    name: String,
    password_hash: String,
}

#[derive(Debug)]
struct UpdateUserDto {
    name: Option<String>,
    email: Option<String>,
    role: Option<String>,
}

// Database connection setup
async fn create_pool(database_url: &str) -> Result<PgPool, sqlx::Error> {
    PgPoolOptions::new()
        .max_connections(10)           // Connection pool size
        .min_connections(2)            // Keep minimum connections ready
        .acquire_timeout(std::time::Duration::from_secs(5))
        .idle_timeout(std::time::Duration::from_secs(600))
        .test_before_acquire(true)     // Health check connections
        .connect(database_url)
        .await
}

// Repository pattern — all DB operations in one place
struct UserRepository {
    pool: PgPool,
}

impl UserRepository {
    fn new(pool: PgPool) -> Self {
        UserRepository { pool }
    }
    
    async fn find_by_id(&self, id: Uuid) -> Result<Option<User>, sqlx::Error> {
        sqlx::query_as::<_, User>(
            "SELECT * FROM users WHERE id = $1"
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await
    }
    
    async fn find_by_email(&self, email: &str) -> Result<Option<User>, sqlx::Error> {
        sqlx::query_as::<_, User>(
            "SELECT * FROM users WHERE email = $1"
        )
        .bind(email)
        .fetch_optional(&self.pool)
        .await
    }
    
    async fn list(&self, limit: i64, offset: i64) -> Result<Vec<User>, sqlx::Error> {
        sqlx::query_as::<_, User>(
            "SELECT * FROM users WHERE is_active = true ORDER BY created_at DESC LIMIT $1 OFFSET $2"
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(&self.pool)
        .await
    }
    
    async fn create(&self, dto: &CreateUserDto) -> Result<User, sqlx::Error> {
        sqlx::query_as::<_, User>(
            r#"
            INSERT INTO users (id, email, name, password_hash, role, is_active, created_at, updated_at)
            VALUES ($1, $2, $3, $4, 'user', true, NOW(), NOW())
            RETURNING *
            "#
        )
        .bind(Uuid::new_v4())
        .bind(&dto.email)
        .bind(&dto.name)
        .bind(&dto.password_hash)
        .fetch_one(&self.pool)
        .await
    }
    
    async fn update(&self, id: Uuid, dto: &UpdateUserDto) -> Result<Option<User>, sqlx::Error> {
        // Dynamic update query based on which fields are provided
        let mut query = String::from("UPDATE users SET updated_at = NOW()");
        let mut param_count = 0;
        
        if dto.name.is_some() { param_count += 1; query.push_str(&format!(", name = ${}", param_count + 1)); }
        if dto.email.is_some() { param_count += 1; query.push_str(&format!(", email = ${}", param_count + 1)); }
        if dto.role.is_some() { param_count += 1; query.push_str(&format!(", role = ${}", param_count + 1)); }
        
        query.push_str(&format!(" WHERE id = ${} RETURNING *", param_count + 2));
        
        // Note: In production, use a query builder crate for dynamic queries
        // This is simplified for learning purposes
        
        // Simplified: use a fixed query for demonstration
        sqlx::query_as::<_, User>(
            r#"
            UPDATE users 
            SET name = COALESCE($2, name),
                email = COALESCE($3, email),
                role = COALESCE($4, role),
                updated_at = NOW()
            WHERE id = $1
            RETURNING *
            "#
        )
        .bind(id)
        .bind(&dto.name)
        .bind(&dto.email)
        .bind(&dto.role)
        .fetch_optional(&self.pool)
        .await
    }
    
    async fn soft_delete(&self, id: Uuid) -> Result<bool, sqlx::Error> {
        let result = sqlx::query(
            "UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1"
        )
        .bind(id)
        .execute(&self.pool)
        .await?;
        
        Ok(result.rows_affected() > 0)
    }
    
    async fn count(&self) -> Result<i64, sqlx::Error> {
        let row: (i64,) = sqlx::query_as(
            "SELECT COUNT(*) FROM users WHERE is_active = true"
        )
        .fetch_one(&self.pool)
        .await?;
        
        Ok(row.0)
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // In production, use environment variable
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://user:password@localhost/myapp".to_string());
    
    let pool = create_pool(&database_url).await?;
    println!("Connected to database!");
    
    let repo = UserRepository::new(pool);
    
    // Create a user
    let new_user = CreateUserDto {
        email: "alice@example.com".to_string(),
        name: "Alice".to_string(),
        password_hash: "hashed_password_here".to_string(),
    };
    
    let user = repo.create(&new_user).await?;
    println!("Created user: {} ({})", user.name, user.id);
    
    // Find by ID
    if let Some(found) = repo.find_by_id(user.id).await? {
        println!("Found: {} - {}", found.name, found.email);
    }
    
    // List users
    let users = repo.list(10, 0).await?;
    println!("Total active users: {}", repo.count().await?);
    for u in &users {
        println!("  {} ({}) - {}", u.name, u.role, u.email);
    }
    
    Ok(())
}
```

**Explanation:**
- `PgPool` manages a connection pool (reuses connections efficiently)
- `query_as` maps rows directly to structs (FromRow derive)
- `$1, $2` parameterized queries prevent SQL injection
- `fetch_optional` returns `Option<T>` (safe handling of missing rows)
- `RETURNING *` gets the inserted/updated row back

**Scenario:** Every web application needs a database layer. This repository pattern cleanly separates DB logic from business logic.
</details>

---

### Task 2: Migrations

```rust
// Task: Manage database schema with migrations
// Run: sqlx migrate add create_users_table
```

**SQL Migration files:**

```sql
-- migrations/20240101000001_create_users.sql
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role) WHERE is_active = true;

-- migrations/20240101000002_create_posts.sql
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    body TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_slug ON posts(slug);
```

```rust
// Running migrations programmatically
async fn run_migrations(pool: &PgPool) -> Result<(), sqlx::migrate::MigrateError> {
    sqlx::migrate!("./migrations")
        .run(pool)
        .await
}
```

---

### Task 3: Transactions

**What to do:** Implement a fund transfer and an order creation that must succeed or fail atomically.

<details>
<summary>Click to see answer</summary>

```rust
use sqlx::PgPool;
use uuid::Uuid;

struct OrderService {
    pool: PgPool,
}

impl OrderService {
    // Transfer money between accounts (MUST be atomic)
    async fn transfer_funds(
        &self,
        from_account: Uuid,
        to_account: Uuid,
        amount: f64,
    ) -> Result<(), String> {
        // Start a transaction
        let mut tx = self.pool.begin().await
            .map_err(|e| format!("Failed to start transaction: {}", e))?;
        
        // Check balance
        let balance: (f64,) = sqlx::query_as(
            "SELECT balance FROM accounts WHERE id = $1 FOR UPDATE" // FOR UPDATE locks the row
        )
        .bind(from_account)
        .fetch_one(&mut *tx)
        .await
        .map_err(|e| format!("Account not found: {}", e))?;
        
        if balance.0 < amount {
            // Transaction will be rolled back when tx is dropped
            return Err(format!("Insufficient funds: have {}, need {}", balance.0, amount));
        }
        
        // Debit sender
        sqlx::query("UPDATE accounts SET balance = balance - $1, updated_at = NOW() WHERE id = $2")
            .bind(amount)
            .bind(from_account)
            .execute(&mut *tx)
            .await
            .map_err(|e| format!("Failed to debit: {}", e))?;
        
        // Credit receiver
        sqlx::query("UPDATE accounts SET balance = balance + $1, updated_at = NOW() WHERE id = $2")
            .bind(amount)
            .bind(to_account)
            .execute(&mut *tx)
            .await
            .map_err(|e| format!("Failed to credit: {}", e))?;
        
        // Record the transaction
        sqlx::query(
            "INSERT INTO transactions (id, from_account, to_account, amount, created_at) VALUES ($1, $2, $3, $4, NOW())"
        )
        .bind(Uuid::new_v4())
        .bind(from_account)
        .bind(to_account)
        .bind(amount)
        .execute(&mut *tx)
        .await
        .map_err(|e| format!("Failed to record transaction: {}", e))?;
        
        // Commit - if any step above failed, everything is rolled back
        tx.commit().await
            .map_err(|e| format!("Failed to commit: {}", e))?;
        
        Ok(())
    }
    
    // Create order with items (all or nothing)
    async fn create_order(
        &self,
        user_id: Uuid,
        items: &[(Uuid, u32, f64)], // (product_id, quantity, price)
    ) -> Result<Uuid, String> {
        let mut tx = self.pool.begin().await
            .map_err(|e| format!("Transaction start failed: {}", e))?;
        
        let order_id = Uuid::new_v4();
        let total: f64 = items.iter().map(|(_, qty, price)| *qty as f64 * price).sum();
        
        // Create order
        sqlx::query(
            "INSERT INTO orders (id, user_id, total, status, created_at) VALUES ($1, $2, $3, 'pending', NOW())"
        )
        .bind(order_id)
        .bind(user_id)
        .bind(total)
        .execute(&mut *tx)
        .await
        .map_err(|e| format!("Failed to create order: {}", e))?;
        
        // Add order items and update inventory
        for (product_id, quantity, price) in items {
            // Check stock
            let stock: (i32,) = sqlx::query_as(
                "SELECT stock FROM products WHERE id = $1 FOR UPDATE"
            )
            .bind(product_id)
            .fetch_one(&mut *tx)
            .await
            .map_err(|_| format!("Product {} not found", product_id))?;
            
            if stock.0 < *quantity as i32 {
                // Automatically rolls back
                return Err(format!("Insufficient stock for product {}", product_id));
            }
            
            // Deduct stock
            sqlx::query("UPDATE products SET stock = stock - $1 WHERE id = $2")
                .bind(*quantity as i32)
                .bind(product_id)
                .execute(&mut *tx)
                .await
                .map_err(|e| format!("Stock update failed: {}", e))?;
            
            // Add order item
            sqlx::query(
                "INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4, $5)"
            )
            .bind(Uuid::new_v4())
            .bind(order_id)
            .bind(product_id)
            .bind(*quantity as i32)
            .bind(price)
            .execute(&mut *tx)
            .await
            .map_err(|e| format!("Order item insert failed: {}", e))?;
        }
        
        tx.commit().await
            .map_err(|e| format!("Commit failed: {}", e))?;
        
        Ok(order_id)
    }
}
```

**Explanation:**
- Transactions ensure ALL operations succeed or ALL are rolled back
- `FOR UPDATE` locks rows to prevent concurrent modifications
- If any step returns `Err`, the transaction is automatically rolled back when `tx` drops
- Essential for financial operations, inventory management, and any multi-step data changes

**Scenario:** E-commerce (order + inventory update), banking (transfers), user registration (user + profile + settings), multi-table inserts.
</details>

---

### Task 4: Query Builder Pattern

**What to do:** Build a type-safe dynamic query builder that constructs SQL from filters, with whitelist protection against injection.

<details>
<summary>Click to see answer</summary>

```rust
use sqlx::PgPool;

// Dynamic query builder for search/filter endpoints
struct UserQuery {
    conditions: Vec<String>,
    params: Vec<String>,
    order_by: String,
    limit: i64,
    offset: i64,
}

impl UserQuery {
    fn new() -> Self {
        UserQuery {
            conditions: Vec::new(),
            params: Vec::new(),
            order_by: "created_at DESC".to_string(),
            limit: 20,
            offset: 0,
        }
    }
    
    fn name_contains(mut self, name: &str) -> Self {
        let param_idx = self.params.len() + 1;
        self.conditions.push(format!("name ILIKE ${}", param_idx));
        self.params.push(format!("%{}%", name));
        self
    }
    
    fn role(mut self, role: &str) -> Self {
        let param_idx = self.params.len() + 1;
        self.conditions.push(format!("role = ${}", param_idx));
        self.params.push(role.to_string());
        self
    }
    
    fn active_only(mut self) -> Self {
        self.conditions.push("is_active = true".to_string());
        self
    }
    
    fn order_by(mut self, field: &str, direction: &str) -> Self {
        // Whitelist allowed fields to prevent SQL injection
        let allowed_fields = ["name", "email", "created_at", "updated_at"];
        let allowed_dirs = ["ASC", "DESC"];
        
        if allowed_fields.contains(&field) && allowed_dirs.contains(&direction.to_uppercase().as_str()) {
            self.order_by = format!("{} {}", field, direction.to_uppercase());
        }
        self
    }
    
    fn paginate(mut self, page: u32, per_page: u32) -> Self {
        self.limit = per_page.min(100) as i64; // Cap at 100
        self.offset = ((page.saturating_sub(1)) * per_page) as i64;
        self
    }
    
    fn build_sql(&self) -> String {
        let mut sql = "SELECT * FROM users".to_string();
        
        if !self.conditions.is_empty() {
            sql.push_str(" WHERE ");
            sql.push_str(&self.conditions.join(" AND "));
        }
        
        sql.push_str(&format!(" ORDER BY {}", self.order_by));
        sql.push_str(&format!(" LIMIT {} OFFSET {}", self.limit, self.offset));
        
        sql
    }
}

// Usage example
fn example_search() {
    let query = UserQuery::new()
        .active_only()
        .role("admin")
        .name_contains("alice")
        .order_by("name", "ASC")
        .paginate(1, 20);
    
    let sql = query.build_sql();
    println!("Generated SQL: {}", sql);
    // SELECT * FROM users WHERE is_active = true AND role = $1 AND name ILIKE $2 ORDER BY name ASC LIMIT 20 OFFSET 0
}

fn main() {
    example_search();
}
```

**Explanation:**
- Query builders prevent SQL injection by using parameterized queries
- Whitelist allowed sort fields (never trust user input in ORDER BY)
- Cap pagination limits to prevent abuse
- ILIKE for case-insensitive search (PostgreSQL)

**Scenario:** Search endpoints, admin panels, data export, reporting dashboards — anywhere users filter/sort data.
</details>

---

## 🎯 Key Takeaways

| Concept | Tool | Use Case |
|---------|------|----------|
| Connection pool | `PgPoolOptions` | Reuse connections efficiently |
| Type-safe queries | `query_as!` macro | Compile-time SQL checking |
| Migrations | `sqlx migrate` / `sqlx-cli` | Schema versioning |
| Offline mode | `cargo sqlx prepare` | CI without running DB |
| Transactions | `pool.begin()` | Atomic multi-step operations |
| Repository pattern | Struct with pool | Clean separation of concerns |
| Parameterized queries | `$1, $2` | SQL injection prevention |
| Env config | `dotenvy` + `.env` | Database URL management |

---

## ⏭️ Next: Section 12 - Advanced System Tools & FFI
