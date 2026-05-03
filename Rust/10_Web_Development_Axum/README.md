# Section 10: Web Development with Axum

> **Prerequisites:** Complete Sections 00-09. You need async/await (Section 07), serde (Section 09), and traits (Section 05). Understanding of HTTP methods and status codes (Section 09) is essential.

## 🎯 Learning Objectives
- Build production REST APIs with Axum
- Implement routing, middleware, and state management
- Handle authentication (JWT)
- Design proper error responses

---

## 📖 Core Concepts

### Why Axum?

**Scenario:** You're building a production API that needs to handle 100K+ requests/second with sub-millisecond latency. Axum (by the Tokio team) is the modern standard:
- Built on `tower` middleware ecosystem
- Type-safe extractors (no runtime magic)
- Great error messages from the compiler

```toml
# Cargo.toml
[dependencies]
axum = "0.7"
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tower-http = { version = "0.5", features = ["cors", "trace"] }
jsonwebtoken = "9"
```

---

## 📝 Tasks

### Task 1: Basic Axum Server with Routing

**What to do:** Build a REST API with CRUD routes for a users resource using Axum extractors.

<details>
<summary>Click to see answer</summary>

```rust
use axum::{
    extract::{Path, Query, State, Json},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post, put, delete},
    Router,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

// --- Models ---
#[derive(Debug, Clone, Serialize, Deserialize)]
struct User {
    id: u32,
    name: String,
    email: String,
    role: String,
}

#[derive(Debug, Deserialize)]
struct CreateUser {
    name: String,
    email: String,
    #[serde(default = "default_role")]
    role: String,
}

fn default_role() -> String { "user".to_string() }

#[derive(Debug, Deserialize)]
struct UpdateUser {
    name: Option<String>,
    email: Option<String>,
    role: Option<String>,
}

#[derive(Debug, Deserialize)]
struct ListParams {
    #[serde(default = "default_page")]
    page: u32,
    #[serde(default = "default_limit")]
    limit: u32,
    role: Option<String>,
}

fn default_page() -> u32 { 1 }
fn default_limit() -> u32 { 10 }

// --- Shared State ---
#[derive(Clone)]
struct AppState {
    users: Arc<Mutex<HashMap<u32, User>>>,
    next_id: Arc<Mutex<u32>>,
}

impl AppState {
    fn new() -> Self {
        AppState {
            users: Arc::new(Mutex::new(HashMap::new())),
            next_id: Arc::new(Mutex::new(1)),
        }
    }
}

// --- API Response Types ---
#[derive(Serialize)]
struct ApiResponse<T: Serialize> {
    success: bool,
    data: Option<T>,
    error: Option<String>,
}

impl<T: Serialize> ApiResponse<T> {
    fn success(data: T) -> Json<Self> {
        Json(ApiResponse { success: true, data: Some(data), error: None })
    }
    
    fn error(msg: &str) -> Json<ApiResponse<()>> {
        Json(ApiResponse { success: false, data: None, error: Some(msg.to_string()) })
    }
}

// --- Handlers ---
async fn list_users(
    State(state): State<AppState>,
    Query(params): Query<ListParams>,
) -> impl IntoResponse {
    let users = state.users.lock().unwrap();
    
    let mut filtered: Vec<&User> = users.values().collect();
    
    // Filter by role if specified
    if let Some(role) = &params.role {
        filtered.retain(|u| &u.role == role);
    }
    
    // Pagination
    let start = ((params.page - 1) * params.limit) as usize;
    let paginated: Vec<User> = filtered.into_iter()
        .skip(start)
        .take(params.limit as usize)
        .cloned()
        .collect();
    
    ApiResponse::success(paginated)
}

async fn get_user(
    State(state): State<AppState>,
    Path(id): Path<u32>,
) -> Result<impl IntoResponse, (StatusCode, Json<ApiResponse<()>>)> {
    let users = state.users.lock().unwrap();
    
    match users.get(&id) {
        Some(user) => Ok(ApiResponse::success(user.clone())),
        None => Err((StatusCode::NOT_FOUND, ApiResponse::error("User not found"))),
    }
}

async fn create_user(
    State(state): State<AppState>,
    Json(input): Json<CreateUser>,
) -> impl IntoResponse {
    let mut next_id = state.next_id.lock().unwrap();
    let mut users = state.users.lock().unwrap();
    
    let user = User {
        id: *next_id,
        name: input.name,
        email: input.email,
        role: input.role,
    };
    
    users.insert(*next_id, user.clone());
    *next_id += 1;
    
    (StatusCode::CREATED, ApiResponse::success(user))
}

async fn update_user(
    State(state): State<AppState>,
    Path(id): Path<u32>,
    Json(input): Json<UpdateUser>,
) -> Result<impl IntoResponse, (StatusCode, Json<ApiResponse<()>>)> {
    let mut users = state.users.lock().unwrap();
    
    match users.get_mut(&id) {
        Some(user) => {
            if let Some(name) = input.name { user.name = name; }
            if let Some(email) = input.email { user.email = email; }
            if let Some(role) = input.role { user.role = role; }
            Ok(ApiResponse::success(user.clone()))
        }
        None => Err((StatusCode::NOT_FOUND, ApiResponse::error("User not found"))),
    }
}

async fn delete_user(
    State(state): State<AppState>,
    Path(id): Path<u32>,
) -> Result<impl IntoResponse, (StatusCode, Json<ApiResponse<()>>)> {
    let mut users = state.users.lock().unwrap();
    
    match users.remove(&id) {
        Some(_) => Ok((StatusCode::NO_CONTENT, ())),
        None => Err((StatusCode::NOT_FOUND, ApiResponse::error("User not found"))),
    }
}

async fn health_check() -> &'static str {
    "OK"
}

#[tokio::main]
async fn main() {
    let state = AppState::new();
    
    let app = Router::new()
        .route("/health", get(health_check))
        .route("/api/users", get(list_users).post(create_user))
        .route("/api/users/{id}", get(get_user).put(update_user).delete(delete_user))
        .with_state(state);
    
    println!("Server running on http://127.0.0.1:3000");
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

**Explanation:**
- `Router::new()` defines the route tree
- Extractors (`State`, `Path`, `Query`, `Json`) pull typed data from requests
- `impl IntoResponse` allows returning different response types
- `AppState` is shared across all handlers via `Arc`

**Scenario:** This is the standard pattern for any REST API in Rust. User management, product catalogs, blog APIs — all follow this structure.
</details>

---

### Task 2: Middleware & Error Handling

**What to do:** Add request logging middleware, authentication middleware, and a custom AppError type that implements IntoResponse.

<details>
<summary>Click to see answer</summary>

```rust
use axum::{
    extract::Request,
    http::{StatusCode, header},
    middleware::{self, Next},
    response::{IntoResponse, Response},
    Json,
};
use serde::Serialize;
use std::time::Instant;

// --- Custom Error Type ---
#[derive(Debug)]
enum AppError {
    NotFound(String),
    BadRequest(String),
    Unauthorized(String),
    Internal(String),
    Validation(Vec<String>),
}

#[derive(Serialize)]
struct ErrorResponse {
    error: ErrorDetail,
}

#[derive(Serialize)]
struct ErrorDetail {
    code: String,
    message: String,
    details: Option<Vec<String>>,
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, code, message, details) = match self {
            AppError::NotFound(msg) => (StatusCode::NOT_FOUND, "NOT_FOUND", msg, None),
            AppError::BadRequest(msg) => (StatusCode::BAD_REQUEST, "BAD_REQUEST", msg, None),
            AppError::Unauthorized(msg) => (StatusCode::UNAUTHORIZED, "UNAUTHORIZED", msg, None),
            AppError::Internal(msg) => {
                // Log the actual error, return generic message
                eprintln!("Internal error: {}", msg);
                (StatusCode::INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", 
                 "An internal error occurred".to_string(), None)
            }
            AppError::Validation(errors) => {
                (StatusCode::UNPROCESSABLE_ENTITY, "VALIDATION_ERROR",
                 "Validation failed".to_string(), Some(errors))
            }
        };
        
        let body = ErrorResponse {
            error: ErrorDetail {
                code: code.to_string(),
                message,
                details,
            },
        };
        
        (status, Json(body)).into_response()
    }
}

// --- Middleware: Request Logging ---
async fn logging_middleware(request: Request, next: Next) -> Response {
    let method = request.method().clone();
    let uri = request.uri().clone();
    let start = Instant::now();
    
    let response = next.run(request).await;
    
    let duration = start.elapsed();
    let status = response.status();
    
    println!("{} {} {} {:?}", method, uri, status.as_u16(), duration);
    
    response
}

// --- Middleware: Authentication ---
async fn auth_middleware(request: Request, next: Next) -> Result<Response, AppError> {
    // Skip auth for certain paths
    let path = request.uri().path().to_string();
    if path == "/health" || path == "/api/login" {
        return Ok(next.run(request).await);
    }
    
    // Check Authorization header
    let auth_header = request.headers()
        .get(header::AUTHORIZATION)
        .and_then(|value| value.to_str().ok());
    
    match auth_header {
        Some(header) if header.starts_with("Bearer ") => {
            let _token = &header[7..];
            // In real app: validate JWT token here
            Ok(next.run(request).await)
        }
        _ => Err(AppError::Unauthorized("Missing or invalid authorization token".to_string())),
    }
}

// --- Middleware: Rate Limiting (simplified) ---
async fn rate_limit_middleware(request: Request, next: Next) -> Result<Response, AppError> {
    // In real app: check Redis/in-memory counter per IP
    let client_ip = request.headers()
        .get("X-Forwarded-For")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("unknown");
    
    // Simplified: always allow (real implementation would check counters)
    println!("  Rate check for: {}", client_ip);
    Ok(next.run(request).await)
}

// Usage in router setup:
fn create_router() -> axum::Router {
    use axum::routing::get;
    
    // Public routes (no auth)
    let public = axum::Router::new()
        .route("/health", get(|| async { "OK" }))
        .route("/api/login", axum::routing::post(|| async { "token" }));
    
    // Protected routes (with auth middleware)
    let protected = axum::Router::new()
        .route("/api/users", get(|| async { "users list" }))
        .route("/api/admin", get(|| async { "admin panel" }))
        .layer(middleware::from_fn(auth_middleware));
    
    // Combine with global middleware
    axum::Router::new()
        .merge(public)
        .merge(protected)
        .layer(middleware::from_fn(logging_middleware))
        .layer(middleware::from_fn(rate_limit_middleware))
}
```

**Explanation:**
- Custom error types implement `IntoResponse` for automatic HTTP error responses
- Middleware wraps handlers (logging, auth, rate limiting)
- Internal errors are logged but NOT exposed to clients (security!)
- Route-level middleware scoping (public vs protected)

**Scenario:** Production APIs need logging (debugging), authentication (security), rate limiting (abuse prevention), and CORS (frontend integration).
</details>

---

### Task 3: JWT Authentication

**What to do:** Implement login (generate JWT) and token verification (validate + extract claims).

Add to `Cargo.toml`: `jsonwebtoken = "9"`

<details>
<summary>Click to see answer</summary>

```rust
use jsonwebtoken::{encode, decode, Header, Validation, EncodingKey, DecodingKey};
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};

// JWT Claims
#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,       // subject (user id)
    email: String,
    role: String,
    exp: u64,          // expiration time
    iat: u64,          // issued at
}

struct AuthService {
    secret: String,
    token_duration_hours: u64,
}

impl AuthService {
    fn new(secret: &str) -> Self {
        AuthService {
            secret: secret.to_string(),
            token_duration_hours: 24,
        }
    }
    
    fn generate_token(&self, user_id: &str, email: &str, role: &str) -> Result<String, String> {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
        
        let claims = Claims {
            sub: user_id.to_string(),
            email: email.to_string(),
            role: role.to_string(),
            iat: now,
            exp: now + (self.token_duration_hours * 3600),
        };
        
        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.secret.as_bytes()),
        ).map_err(|e| format!("Token generation failed: {}", e))
    }
    
    fn verify_token(&self, token: &str) -> Result<Claims, String> {
        decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.secret.as_bytes()),
            &Validation::default(),
        )
        .map(|data| data.claims)
        .map_err(|e| format!("Token validation failed: {}", e))
    }
}

// Login handler
#[derive(Deserialize)]
struct LoginRequest {
    email: String,
    password: String,
}

#[derive(Serialize)]
struct LoginResponse {
    token: String,
    user: UserInfo,
}

#[derive(Serialize)]
struct UserInfo {
    id: String,
    email: String,
    role: String,
}

fn handle_login(credentials: &LoginRequest, auth: &AuthService) -> Result<LoginResponse, String> {
    // In real app: verify against database
    if credentials.email == "admin@example.com" && credentials.password == "password123" {
        let token = auth.generate_token("user_1", &credentials.email, "admin")?;
        Ok(LoginResponse {
            token,
            user: UserInfo {
                id: "user_1".to_string(),
                email: credentials.email.clone(),
                role: "admin".to_string(),
            },
        })
    } else {
        Err("Invalid credentials".to_string())
    }
}

// Protected handler that uses claims
fn handle_protected_route(claims: &Claims) -> String {
    format!("Hello {}! You are a {} with access until timestamp {}",
            claims.email, claims.role, claims.exp)
}

fn main() {
    let auth = AuthService::new("your-secret-key-change-in-production");
    
    // Simulate login
    let login_req = LoginRequest {
        email: "admin@example.com".to_string(),
        password: "password123".to_string(),
    };
    
    match handle_login(&login_req, &auth) {
        Ok(response) => {
            println!("Login successful!");
            println!("Token: {}...", &response.token[..50]);
            println!("User: {} ({})", response.user.email, response.user.role);
            
            // Verify the token
            match auth.verify_token(&response.token) {
                Ok(claims) => {
                    println!("\nToken verified! Claims: {:?}", claims);
                    println!("{}", handle_protected_route(&claims));
                }
                Err(e) => println!("Token invalid: {}", e),
            }
        }
        Err(e) => println!("Login failed: {}", e),
    }
    
    // Test with invalid token
    println!("\nTesting invalid token:");
    match auth.verify_token("invalid.token.here") {
        Ok(_) => println!("Should not reach here"),
        Err(e) => println!("Correctly rejected: {}", e),
    }
}
```

**Explanation:**
- JWTs encode user identity into a signed token (stateless auth)
- Server validates the signature without a database lookup
- Claims contain user info (id, role, expiration)
- Secret key must be kept secure and rotated

**Scenario:** Every modern web API uses JWT for stateless authentication. SPAs, mobile apps, and microservices all benefit from token-based auth.
</details>

---

### Task 4: Full REST API Structure

**What to do:** Understand the recommended production project layout for an Axum web app.

<details>
<summary>Click to see answer</summary>

**Project Structure:**
```
src/
├── main.rs              # Entry point, server setup
├── config.rs            # Environment/config loading
├── routes/
│   ├── mod.rs           # Route registration
│   ├── users.rs         # User endpoints
│   ├── posts.rs         # Post endpoints
│   └── auth.rs          # Login/register endpoints
├── handlers/
│   ├── mod.rs
│   ├── users.rs         # User handler functions
│   └── posts.rs
├── models/
│   ├── mod.rs
│   ├── user.rs          # User struct + DB operations
│   └── post.rs
├── middleware/
│   ├── mod.rs
│   ├── auth.rs          # JWT verification
│   └── logging.rs
├── errors.rs            # AppError type
└── db.rs                # Database connection pool
```

```rust
// main.rs
use axum::Router;
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;

mod config;
mod errors;
mod middleware;
mod models;
mod routes;

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::init();
    
    // Load config
    let config = config::load().expect("Failed to load config");
    
    // Setup database pool
    // let pool = db::create_pool(&config.database_url).await;
    
    // Build application
    let app = Router::new()
        .merge(routes::public_routes())
        .merge(routes::protected_routes())
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http());
    
    // Start server
    let addr = SocketAddr::from(([0, 0, 0, 0], config.port));
    println!("🚀 Server running on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

**Explanation:** Production Rust web apps follow a layered architecture:
1. **Routes** — URL structure and HTTP methods
2. **Handlers** — Request processing logic
3. **Models** — Data structures and business logic
4. **Middleware** — Cross-cutting concerns (auth, logging)
5. **Errors** — Centralized error handling

**Scenario:** This is the architecture used by companies running Rust in production (Cloudflare, Discord, AWS). Scales from small APIs to microservices.
</details>

---

## 🎯 Key Takeaways

| Concept | How It Works | Why It Matters |
|---------|-------------|----------------|
| Extractors | `Path`, `Query`, `Json`, `State` | Type-safe request parsing |
| IntoResponse | Custom types → HTTP responses | Clean error handling |
| Middleware | `layer()` | Cross-cutting concerns |
| State | `Arc<AppState>` with `State` extractor | Shared data across handlers |
| JWT | Encode claims → verify signature | Stateless authentication |

---

## ⏭️ Next: Section 11 - Database & ORM Integration
