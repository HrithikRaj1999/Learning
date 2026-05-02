"""
==============================================================================
  TASK 48: Caching with Redis
==============================================================================

REAL-WORLD CONTEXT:
Database queries are SLOW (10-100ms). Redis cache is FAST (0.1ms).
Caching reduces DB load by 90%+ for read-heavy endpoints.

SCENARIO:
  48.1 — Basic Redis: SET/GET/EXPIRE/Hash/List operations.
  48.2 — Flask Caching: @cache.cached(timeout=300) on expensive endpoints.
  48.3 — Cache Invalidation: When data changes, clear the stale cache.

WHAT'S WRONG WITHOUT CACHING:
  GET /api/products (1000 products, joined with categories) → 200ms per request
  1000 users hit this endpoint → database collapses under load

WITH CACHING:
  First request: DB query (200ms), store in Redis
  Next 999 requests: serve from Redis (0.1ms)
  Cache expires after 5 minutes → refresh from DB

EXPECTED BEHAVIOR:
  r.set("user:1", json.dumps(user_data))
  r.get("user:1") → cached data (no DB hit)
  r.expire("user:1", 300) → auto-delete after 5 minutes
"""

# CHALLENGE 48.1 -- Basic Redis Operations
Connect to Redis and practice:
  import redis
  r = redis.Redis(host='localhost', port=6379, db=0)

  r.set('key', 'value')
  r.get('key')
  r.setex('temp_key', 60, 'expires in 60s')  # TTL

  r.hset('user:1', mapping={'name': 'Alice', 'email': 'alice@test.com'})
  r.hgetall('user:1')

  r.lpush('queue', 'task1', 'task2')
  r.rpop('queue')

CHALLENGE 48.2 -- Cache Database Queries in Flask
Use Flask-Caching to cache expensive DB queries:

  from flask_caching import Cache
  cache = Cache(app, config={'CACHE_TYPE': 'redis', 'CACHE_REDIS_URL': 'redis://localhost:6379/0'})

  @app.route('/api/products')
  @cache.cached(timeout=300)  # Cache for 5 minutes
  def get_products():
      products = Product.query.all()  # Expensive query
      return jsonify([p.to_dict() for p in products])

CHALLENGE 48.3 -- Cache Invalidation
The hardest problem in CS! Implement strategies:
- Time-based (TTL): auto-expire after N seconds
- Event-based: invalidate when data changes
- Tag-based: invalidate all caches with a certain tag

  @app.route('/api/products', methods=['POST'])
  def create_product():
      cache.delete('products_list')  # Invalidate cache!

CHALLENGE 48.4 -- Session Storage with Redis
Store Flask sessions in Redis instead of cookies:
  pip install flask-session
  app.config['SESSION_TYPE'] = 'redis'
"""
