# Lecture 5: NoSQL and Key-Value Stores

- **Q66. Why is key design central in a key-value store?**

  > - **Key-value pair**
  >   - A unique key identifies its stored value.
  > - **Key as access path**
  >   - Match the identifier already known by the application.
  >     - `cart:user:42` retrieves user 42's cart directly.
  > - **Key as placement input**
  >   - Hashing often determines which partition stores the value.
  >     - Poor distribution can overload particular partitions.
  > - **Limitation**
  >   - Searching arbitrary value fields may require scans or extra indexes.
  > - **Request flow**
  >   ```mermaid
  >   flowchart LR
  >       Known[Known user identifier] --> Key[Construct key]
  >       Key --> Partition[Locate partition]
  >       Partition --> Value[Read value]
  >   ```

- **Q67. When is a relational database preferable to NoSQL?**

  > - **NoSQL: Not Only SQL**
  >   - Includes key-value, document, wide-column, and graph models.
  > - **Choose relational storage for orders and payments**
  >   - Related records need reliable references.
  >   - Transactions must preserve financial rules.
  >   - Reports require joins across several tables.
  > - **Decision**
  >   - Match capabilities to required queries and correctness.
  >     - NoSQL does not automatically mean transactions are unavailable.

- **Q68. Explain Time To Live (TTL) for a session.**

  > - **Meaning**
  >   - TTL is the remaining lifetime before a key expires.
  > - **Create a ten-minute session**
  >   ```text
  >   SET prep:session:42 "user=42" EX 600
  >   TTL prep:session:42
  >   GET prep:session:42
  >   ```
  > - **Behavior**
  >   - Before expiry: `GET` returns `user=42`.
  >   - After expiry: the key is treated as missing.
  >     - Reading with `GET` does not automatically reset the lifetime.
  > - **Purpose**
  >   - Remove temporary sessions and refreshable cache entries automatically.

- **Q69. What is a hot key, and why is it dangerous?**

  > - **Meaning**
  >   - One key receives disproportionately many requests.
  > - **Impact**
  >   - Its responsible node becomes overloaded.
  >     - Responses slow down; requests can time out.
  > - **Why more nodes may not help**
  >   - Hashing distributes different keys, not necessarily one key's traffic.
  > - **Response**
  >   - Measure request concentration; use suitable caching or replicas for allowed reads.

- **Q70. When is a secondary-index workaround risky?**

  > - **Secondary index: another lookup path**
  >   - A separate key maps an email address to a user identifier.
  > - **Risk: multiple records must stay synchronized**
  >   - Updating the user without updating the email index creates stale results.
  >   - Deleting or expiring the user can leave a dangling index.
  >     - The index points to data that no longer exists.
  > - **Decision**
  >   - Coordinate updates and cleanup together.
  >   - Prefer native indexed querying when alternate lookups become complicated.

- **Q71. Match the four NoSQL families to their main access patterns.**

  > - **Key-value: known-key lookup**
  >   - Temporary authentication tokens, sessions, carts, and caches.
  >     - Tokens combine direct lookup with expiration.
  >     - Weak for arbitrary searches inside stored values.
  > - **Document: fields and nested records**
  >   - Product catalogs and flexible customer preferences.
  >     - Embedding simplifies reads but can duplicate changing information.
  > - **Wide-column: designed partitions and ordered ranges**
  >   - Large streams of sensor readings or events.
  >     - Unplanned cross-partition searches can be expensive.
  > - **Graph: connected paths**
  >   - Friends-of-friends, recommendations, and dependency networks.
  >     - Large, unbounded traversals still require substantial work.

- **Q74. Distinguish expiration, eviction, LRU, and LFU.**

  > - **Expiration: lifetime ends**
  >   - A key becomes unavailable when its TTL expires.
  > - **Eviction: resource limit is reached**
  >   - The store removes eligible entries to free memory.
  >     - An entry can be evicted before its TTL ends.
  > - **Least Recently Used (LRU)**
  >   - Prefer removing entries unused for the longest time.
  > - **Least Frequently Used (LFU)**
  >   - Prefer removing entries accessed least often.

- **Q76. Choose stores and keys for sessions, catalog, carts, and checkout.**

  > - **Sessions: key-value store**
  >   - Key: `session:<token>`; expire temporary login state.
  > - **Catalog: document database**
  >   - Keep a product's variable attributes together.
  >     - Cached product key: `cache:product:101`.
  > - **Cart: key-value or document store**
  >   - Key: `cart:user:42`; retrieve related items together.
  > - **Orders and payments: relational database**
  >   - Preserve relationships and transaction rules.
  >     - Checkout must coordinate payment, final price, and stock reservation.
  > - **Trade-off**
  >   - Several stores require extra synchronization and operational work.

- **Q78. Demonstrate SET, GET, EXPIRE, INCR, MGET, hashes, and sorted sets.**

  > - **String: one key and value**
  >   ```text
  >   SET prep:product:1:status "IN STOCK"
  >   GET prep:product:1:status
  >   EXPIRE prep:product:1:status 60
  >   MGET prep:product:1:status prep:session:42
  >   ```
  >   - `SET` writes; `GET` reads; `EXPIRE` assigns seconds until expiry.
  >   - `MGET` reads several keys in the requested order.
  > - **Counter: indivisible increment**
  >   ```text
  >   SET prep:product:1:views 100
  >   INCR prep:product:1:views
  >   ```
  >   - Result: `101`; simultaneous increments do not overwrite each other.
  > - **Hash: related fields under one key**
  >   ```text
  >   HSET prep:product:1 name Laptop price 75000 stock 15
  >   HGET prep:product:1 price
  >   ```
  >   - Result: `75000`.
  > - **Sorted set: members ranked by scores**
  >   ```text
  >   ZADD prep:leaderboard 980 Laptop 850 Headphones 620 Keyboard
  >   ZREVRANGE prep:leaderboard 0 1 WITHSCORES
  >   ```
  >   - Result: Laptop `980`, then Headphones `850`.

- **Q79. How does a Python client store and retrieve a temporary cart?**

  > - **Serialize: convert structured data into a stored string**
  >   - JavaScript Object Notation (JSON) represents the cart's fields and items.
  > - **Write with an expiry; parse the retrieved value**
  >   ```python
  >   import json
  >   import redis
  >
  >   client = redis.Redis(host="localhost", port=6379, decode_responses=True)
  >   cart = {"items": [{"productId": 101, "quantity": 1}]}
  >   try:
  >       client.set("prep:cart:user:42", json.dumps(cart), ex=600)
  >       raw = client.get("prep:cart:user:42")
  >       loaded_cart = json.loads(raw) if raw is not None else None
  >       print(loaded_cart)
  >   except redis.RedisError:
  >       print("Redis request failed")
  >   finally:
  >       client.close()
  >   ```
  > - **Different outcomes**
  >   - Missing key: no stored cart was returned.
  >   - Connection failure: retrieval could not be completed.
  >     - Do not treat a failed request as evidence of an empty cart.