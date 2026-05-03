# Section 09: Networking & HTTP Fundamentals

> **Prerequisites:** Complete Sections 00-07. You need async/await (Section 07) for reqwest and TCP servers. Traits (Section 05) for serde derive. Error handling (Section 03) for Result chaining.

## 🎯 Learning Objectives
- Understand HTTP fundamentals (methods, status codes, headers)
- Master TCP/UDP networking in Rust
- Build HTTP clients with reqwest
- Master serialization/deserialization with serde
- Understand TLS/HTTPS basics

---

## 📖 Core Concepts

### HTTP Fundamentals

Before building web APIs, understand what HTTP actually is:

```
Client → Request → Server
  ┌──────────────────────────┐
  │ GET /api/users HTTP/1.1  │  ← Method + Path + Version
  │ Host: example.com        │  ← Headers
  │ Accept: application/json │
  │ Authorization: Bearer ... │
  │                          │
  │ (no body for GET)        │  ← Body (POST/PUT/PATCH have bodies)
  └──────────────────────────┘

Server → Response → Client
  ┌──────────────────────────┐
  │ HTTP/1.1 200 OK          │  ← Status code
  │ Content-Type: app/json   │  ← Response headers
  │                          │
  │ {"users": [...]}         │  ← Response body
  └──────────────────────────┘
```

| Method | Purpose | Has Body? | Idempotent? |
|--------|---------|-----------|-------------|
| GET | Read data | No | Yes |
| POST | Create data | Yes | No |
| PUT | Replace data | Yes | Yes |
| PATCH | Partial update | Yes | No |
| DELETE | Remove data | No | Yes |

| Status Code | Meaning |
|-------------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content (success, empty body) |
| 400 | Bad Request (client error) |
| 401 | Unauthorized (no/bad auth) |
| 403 | Forbidden (auth ok, no permission) |
| 404 | Not Found |
| 500 | Internal Server Error |

### TLS / HTTPS

```
HTTP  = plaintext over TCP (port 80)  — anyone on the network can read it
HTTPS = HTTP over TLS encryption (port 443) — encrypted, verified identity

In Rust:
- reqwest uses HTTPS by default
- Two TLS backends:
  - `native-tls` (default) — uses OS TLS library (OpenSSL, Schannel, etc.)
  - `rustls` — pure Rust TLS (no system dependency, more portable)
    reqwest = { version = "0.12", default-features = false, features = ["rustls-tls"] }
```

### Networking in Rust for Web Development

**Scenario:** Before building a web framework, you need to understand what's happening underneath. HTTP is just text over TCP. Understanding this makes you a better web developer.

---

## 📝 Tasks

### Task 1: TCP Server & Client

**What to do:** Build a TCP echo server that handles multiple clients (one thread per client) and a client that connects to it.

<details>
<summary>Click to see answer</summary>

```rust
use std::io::{Read, Write, BufRead, BufReader};
use std::net::{TcpListener, TcpStream};
use std::thread;

fn handle_client(mut stream: TcpStream) {
    let peer = stream.peer_addr().unwrap();
    println!("New connection from: {}", peer);
    
    let mut reader = BufReader::new(stream.try_clone().unwrap());
    let mut line = String::new();
    
    loop {
        line.clear();
        match reader.read_line(&mut line) {
            Ok(0) => {
                println!("Client {} disconnected", peer);
                break;
            }
            Ok(_) => {
                let trimmed = line.trim();
                println!("[{}] Received: {}", peer, trimmed);
                
                // Echo back with transformation
                let response = match trimmed {
                    "ping" => "pong\n".to_string(),
                    "time" => format!("Server time: [timestamp]\n"),
                    "quit" => {
                        stream.write_all(b"Goodbye!\n").ok();
                        break;
                    }
                    msg => format!("Echo: {}\n", msg.to_uppercase()),
                };
                
                if stream.write_all(response.as_bytes()).is_err() {
                    break;
                }
            }
            Err(e) => {
                eprintln!("Error reading from {}: {}", peer, e);
                break;
            }
        }
    }
}

fn run_server() -> std::io::Result<()> {
    let listener = TcpListener::bind("127.0.0.1:7878")?;
    println!("Server listening on 127.0.0.1:7878");
    
    for stream in listener.incoming() {
        let stream = stream?;
        thread::spawn(|| handle_client(stream));
    }
    
    Ok(())
}

fn run_client() -> std::io::Result<()> {
    let mut stream = TcpStream::connect("127.0.0.1:7878")?;
    println!("Connected to server!");
    
    let messages = ["ping", "hello world", "time", "quit"];
    
    for msg in messages {
        stream.write_all(format!("{}\n", msg).as_bytes())?;
        
        let mut response = [0u8; 1024];
        let n = stream.read(&mut response)?;
        println!("Sent: '{}' → Got: '{}'", msg, String::from_utf8_lossy(&response[..n]).trim());
    }
    
    Ok(())
}

fn main() {
    // Run with argument: "server" or "client"
    let args: Vec<String> = std::env::args().collect();
    match args.get(1).map(|s| s.as_str()) {
        Some("server") => run_server().unwrap(),
        Some("client") => run_client().unwrap(),
        _ => println!("Usage: program [server|client]"),
    }
}
```

**Explanation:**
- `TcpListener::bind()` creates a server socket
- Each client gets its own thread (real servers use async instead)
- `BufReader` enables line-by-line reading
- This is the foundation that HTTP frameworks build upon

**Scenario:** Understanding TCP helps debug web server issues, implement custom protocols, and build tools like proxies or load balancers.
</details>

---

### Task 2: HTTP Client with Reqwest

**What to do:** Build a typed API client using reqwest + serde that calls JSONPlaceholder.

```toml
# Cargo.toml
[dependencies]
reqwest = { version = "0.12", features = ["json"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1", features = ["full"] }
```

<details>
<summary>Click to see answer</summary>

```rust
use serde::{Deserialize, Serialize};
use std::time::Duration;

// API response types
#[derive(Debug, Deserialize)]
struct User {
    id: u32,
    name: String,
    email: String,
    username: String,
}

#[derive(Debug, Deserialize)]
struct Post {
    id: u32,
    #[serde(rename = "userId")]
    user_id: u32,
    title: String,
    body: String,
}

#[derive(Debug, Serialize)]
struct CreatePost {
    title: String,
    body: String,
    #[serde(rename = "userId")]
    user_id: u32,
}

// Typed API client
struct ApiClient {
    client: reqwest::Client,
    base_url: String,
}

impl ApiClient {
    fn new(base_url: &str) -> Self {
        let client = reqwest::Client::builder()
            .timeout(Duration::from_secs(10))
            .user_agent("rust-learning-client/1.0")
            .build()
            .expect("Failed to build HTTP client");
        
        ApiClient {
            client,
            base_url: base_url.to_string(),
        }
    }
    
    async fn get_users(&self) -> Result<Vec<User>, reqwest::Error> {
        self.client
            .get(format!("{}/users", self.base_url))
            .send()
            .await?
            .json::<Vec<User>>()
            .await
    }
    
    async fn get_user(&self, id: u32) -> Result<User, reqwest::Error> {
        self.client
            .get(format!("{}/users/{}", self.base_url, id))
            .send()
            .await?
            .json::<User>()
            .await
    }
    
    async fn get_user_posts(&self, user_id: u32) -> Result<Vec<Post>, reqwest::Error> {
        self.client
            .get(format!("{}/posts", self.base_url))
            .query(&[("userId", user_id.to_string())])
            .send()
            .await?
            .json::<Vec<Post>>()
            .await
    }
    
    async fn create_post(&self, post: &CreatePost) -> Result<Post, reqwest::Error> {
        self.client
            .post(format!("{}/posts", self.base_url))
            .json(post)
            .send()
            .await?
            .json::<Post>()
            .await
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let api = ApiClient::new("https://jsonplaceholder.typicode.com");
    
    // GET all users
    let users = api.get_users().await?;
    println!("Found {} users", users.len());
    for user in users.iter().take(3) {
        println!("  {} ({}) - {}", user.name, user.username, user.email);
    }
    
    // GET single user
    let user = api.get_user(1).await?;
    println!("\nUser 1: {} ({})", user.name, user.email);
    
    // GET user's posts
    let posts = api.get_user_posts(1).await?;
    println!("\n{}'s posts ({} total):", user.name, posts.len());
    for post in posts.iter().take(3) {
        println!("  [{}] {}", post.id, post.title);
    }
    
    // POST create new post
    let new_post = CreatePost {
        title: "Learning Rust".to_string(),
        body: "Rust is amazing for web development!".to_string(),
        user_id: 1,
    };
    let created = api.create_post(&new_post).await?;
    println!("\nCreated post: id={}, title='{}'", created.id, created.title);
    
    Ok(())
}
```

**Explanation:**
- `serde` handles JSON serialization/deserialization with derive macros
- `#[serde(rename = "userId")]` maps Rust naming to JSON naming
- `reqwest::Client` should be reused (has connection pooling)
- Type-safe API clients catch errors at compile time

**Scenario:** Every web application needs to call external APIs. Payment providers, email services, third-party data sources — all accessed through HTTP clients.
</details>

---

### Task 3: Serde — Serialization Deep Dive

**What to do:** Master serde's advanced features: optional fields, defaults, renaming, tagged enums, flattening.

<details>
<summary>Click to see answer</summary>

```rust
use serde::{Deserialize, Serialize, Deserializer};

// Handling optional fields, defaults, and custom parsing
#[derive(Debug, Serialize, Deserialize)]
struct ServerConfig {
    host: String,
    
    #[serde(default = "default_port")]
    port: u16,
    
    #[serde(default)]
    debug: bool,
    
    #[serde(skip_serializing_if = "Option::is_none")]
    tls_cert: Option<String>,
    
    #[serde(rename = "maxConnections", default = "default_max_conn")]
    max_connections: u32,
    
    #[serde(flatten)]
    extra: std::collections::HashMap<String, serde_json::Value>,
}

fn default_port() -> u16 { 8080 }
fn default_max_conn() -> u32 { 100 }

// Enum serialization
#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type", content = "data")]
enum Event {
    #[serde(rename = "user.created")]
    UserCreated { id: u32, name: String },
    
    #[serde(rename = "user.deleted")]
    UserDeleted { id: u32 },
    
    #[serde(rename = "post.published")]
    PostPublished { id: u32, title: String, author_id: u32 },
}

// Handling API responses with different shapes
#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum ApiResponse<T> {
    Success { data: T, meta: Option<Meta> },
    Error { error: ApiError },
}

#[derive(Debug, Deserialize)]
struct Meta {
    total: u32,
    page: u32,
    per_page: u32,
}

#[derive(Debug, Deserialize)]
struct ApiError {
    code: String,
    message: String,
}

fn main() {
    // Parse config with missing/extra fields
    let json = r#"{
        "host": "0.0.0.0",
        "debug": true,
        "maxConnections": 5000,
        "custom_field": "extra value",
        "feature_flags": ["fast-mode", "beta"]
    }"#;
    
    let config: ServerConfig = serde_json::from_str(json).unwrap();
    println!("Config: {:?}", config);
    println!("Port (default): {}", config.port); // 8080
    println!("Extra fields: {:?}", config.extra);
    
    // Serialize back
    let serialized = serde_json::to_string_pretty(&config).unwrap();
    println!("\nSerialized:\n{}", serialized);
    
    // Tagged enum serialization
    let events = vec![
        Event::UserCreated { id: 1, name: "Alice".to_string() },
        Event::PostPublished { id: 42, title: "Hello Rust".to_string(), author_id: 1 },
    ];
    
    for event in &events {
        let json = serde_json::to_string(event).unwrap();
        println!("Event JSON: {}", json);
    }
    
    // Parse back
    let event_json = r#"{"type": "user.created", "data": {"id": 5, "name": "Bob"}}"#;
    let parsed: Event = serde_json::from_str(event_json).unwrap();
    println!("Parsed event: {:?}", parsed);
}
```

**Explanation:**
- `#[serde(default)]` handles missing fields gracefully
- `#[serde(rename)]` maps between Rust and JSON naming conventions
- `#[serde(tag = "type")]` creates discriminated unions (common in APIs)
- `#[serde(flatten)]` captures unknown fields
- `#[serde(untagged)]` tries each variant in order

**Scenario:** Every web API deals with JSON. Config files, API responses, WebSocket messages, database records — serde handles them all.
</details>

---

### Task 4: Building a REST Client Library

**What to do:** Build a reusable REST client with builder pattern, auth methods, and retry structure.

<details>
<summary>Click to see answer</summary>

```rust
use std::time::Duration;
use std::collections::HashMap;

// Configuration
#[derive(Clone)]
struct ClientConfig {
    base_url: String,
    timeout: Duration,
    max_retries: u32,
    auth: Option<AuthMethod>,
    default_headers: HashMap<String, String>,
}

#[derive(Clone)]
enum AuthMethod {
    Bearer(String),
    Basic { username: String, password: String },
    ApiKey { header: String, key: String },
}

// Request builder pattern
struct RequestBuilder {
    method: String,
    path: String,
    query: Vec<(String, String)>,
    headers: HashMap<String, String>,
    body: Option<String>,
}

impl RequestBuilder {
    fn new(method: &str, path: &str) -> Self {
        RequestBuilder {
            method: method.to_string(),
            path: path.to_string(),
            query: Vec::new(),
            headers: HashMap::new(),
            body: None,
        }
    }
    
    fn query(mut self, key: &str, value: &str) -> Self {
        self.query.push((key.to_string(), value.to_string()));
        self
    }
    
    fn header(mut self, key: &str, value: &str) -> Self {
        self.headers.insert(key.to_string(), value.to_string());
        self
    }
    
    fn json_body<T: serde::Serialize>(mut self, body: &T) -> Self {
        self.body = Some(serde_json::to_string(body).unwrap());
        self.headers.insert("Content-Type".to_string(), "application/json".to_string());
        self
    }
    
    fn build_url(&self, base_url: &str) -> String {
        let mut url = format!("{}{}", base_url, self.path);
        if !self.query.is_empty() {
            let query_str: Vec<String> = self.query.iter()
                .map(|(k, v)| format!("{}={}", k, v))
                .collect();
            url = format!("{}?{}", url, query_str.join("&"));
        }
        url
    }
}

// API Client with retry logic
struct RestClient {
    config: ClientConfig,
}

impl RestClient {
    fn new(config: ClientConfig) -> Self {
        RestClient { config }
    }
    
    fn get(&self, path: &str) -> RequestBuilder {
        RequestBuilder::new("GET", path)
    }
    
    fn post(&self, path: &str) -> RequestBuilder {
        RequestBuilder::new("POST", path)
    }
    
    fn put(&self, path: &str) -> RequestBuilder {
        RequestBuilder::new("PUT", path)
    }
    
    fn delete(&self, path: &str) -> RequestBuilder {
        RequestBuilder::new("DELETE", path)
    }
    
    // Simulate sending (in real code, this would use reqwest)
    fn execute(&self, req: RequestBuilder) -> Result<Response, ClientError> {
        let url = req.build_url(&self.config.base_url);
        println!("  {} {} (timeout: {:?})", req.method, url, self.config.timeout);
        
        if let Some(auth) = &self.config.auth {
            match auth {
                AuthMethod::Bearer(token) => println!("  Auth: Bearer {}...", &token[..8.min(token.len())]),
                AuthMethod::ApiKey { header, .. } => println!("  Auth: {} header", header),
                _ => {}
            }
        }
        
        if let Some(body) = &req.body {
            println!("  Body: {}...", &body[..50.min(body.len())]);
        }
        
        // Simulated response
        Ok(Response {
            status: 200,
            body: r#"{"success": true}"#.to_string(),
            headers: HashMap::new(),
        })
    }
}

#[derive(Debug)]
struct Response {
    status: u16,
    body: String,
    headers: HashMap<String, String>,
}

#[derive(Debug)]
enum ClientError {
    Timeout,
    ConnectionFailed(String),
    HttpError { status: u16, body: String },
}

fn main() {
    let config = ClientConfig {
        base_url: "https://api.example.com/v1".to_string(),
        timeout: Duration::from_secs(30),
        max_retries: 3,
        auth: Some(AuthMethod::Bearer("sk_live_abc123def456".to_string())),
        default_headers: HashMap::from([
            ("Accept".to_string(), "application/json".to_string()),
        ]),
    };
    
    let client = RestClient::new(config);
    
    // GET with query params
    let req = client.get("/users")
        .query("page", "1")
        .query("limit", "20")
        .header("X-Request-ID", "req-001");
    client.execute(req).unwrap();
    
    // POST with JSON body
    let new_user = serde_json::json!({
        "name": "Alice",
        "email": "alice@example.com"
    });
    let req = client.post("/users")
        .json_body(&new_user);
    client.execute(req).unwrap();
    
    // DELETE
    let req = client.delete("/users/123");
    client.execute(req).unwrap();
}
```

**Explanation:** This shows the builder pattern used by reqwest and other HTTP clients. Key patterns:
- Configuration is separate from usage (dependency injection)
- Builder pattern for constructing requests fluently
- Auth methods are modeled as enums
- Retry logic can be added transparently

**Scenario:** SDKs for payment APIs (Stripe), cloud services (AWS), or any third-party integration.
</details>

---

## 🎯 Key Takeaways

| Concept | Crate | Use Case |
|---------|-------|----------|
| HTTP methods/status | (knowledge) | Understanding web APIs |
| TCP networking | `std::net` | Custom protocols, proxies |
| HTTP client | `reqwest` 0.12 | API calls, web scraping |
| Serialization | `serde` + `serde_json` | JSON handling |
| Async HTTP | `reqwest` + `tokio` | Non-blocking API calls |
| TLS/HTTPS | `rustls` or `native-tls` | Encrypted connections |
| Type-safe APIs | Serde derive | Compile-time JSON validation |

---

## ⏭️ Next: Section 10 - Web Development (Actix/Axum)
