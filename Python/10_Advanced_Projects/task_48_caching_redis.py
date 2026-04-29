"""
================================================================
   TASK 48: Caching with Redis                    ****    
================================================================

SETUP: pip install redis flask-caching
CONCEPTS: Redis, caching strategies, TTL, cache invalidation

INSTRUCTIONS:
Caching makes apps 10-100x faster. Redis is the most popular cache.
"""

# =========== CHALLENGES ===========

"""
CHALLENGE 48.1 -- Basic Redis Operations
Connect to Redis and practice:
  import redis
  r = redis.Redis(host='localhost', port=6379, db=0)

  # String operations
  r.set('key', 'value')
  r.get('key')
  r.setex('temp_key', 60, 'expires in 60s')  # TTL

  # Hash operations (perfect for user sessions)
  r.hset('user:1', mapping={'name': 'Alice', 'email': 'alice@test.com'})
  r.hgetall('user:1')

  # List operations (perfect for queues)
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
      # Create the product...
      cache.delete('products_list')  # Invalidate cache!


CHALLENGE 48.4 -- Session Storage with Redis
Store Flask sessions in Redis instead of cookies:
  pip install flask-session
  app.config['SESSION_TYPE'] = 'redis'
"""
