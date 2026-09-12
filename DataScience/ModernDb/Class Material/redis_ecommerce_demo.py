import time
import redis

PREFIX = "webinar:ecommerce:"


def heading(title):
    print("\n" + "=" * 60)
    print(title)
    print("=" * 60)


def connect():
    r = redis.Redis(
        host="localhost",
        port=6379,
        db=0,
        decode_responses=True,
    )
    r.ping()
    return r


def clean_demo_data(r):
    """Remove only keys created by this demonstration."""
    keys = list(r.scan_iter(match=f"{PREFIX}*"))
    if keys:
        r.delete(*keys)


def demo_string(r):
    heading("1. STRING — One key, one value")

    key = f"{PREFIX}product:1:status"

    print("SET product status...")
    r.set(key, "IN STOCK")
    print("GET:", r.get(key))

    print("\nUpdate the same key...")
    r.set(key, "LOW STOCK")
    print("GET:", r.get(key))


def demo_hash(r):
    heading("2. HASH — Several fields for one object")

    key = f"{PREFIX}product:1"

    r.hset(
        key,
        mapping={
            "name": "Laptop",
            "category": "Electronics",
            "price": 75000,
            "stock": 15,
        },
    )

    print("Product stored as a Redis Hash:\n")

    for field, value in r.hgetall(key).items():
        print(f"  {field:10} : {value}")

    print("\nRead only the price:")
    print("  ₹", r.hget(key, "price"))

    print("\nTeaching point:")
    print("A Hash lets us keep several related fields under one key.")


def demo_ttl(r):
    heading("3. TTL — Temporary data that expires")

    key = f"{PREFIX}session:42"

    r.set(key, "user=42", ex=10)

    print("Session created.")
    print("Value:", r.get(key))
    print("TTL:", r.ttl(key), "seconds")

    print("\nWaiting 2 seconds...")
    time.sleep(2)

    print("TTL now:", r.ttl(key), "seconds")




def demo_counter(r):
    heading("4. COUNTER — Fast atomic increments")

    key = f"{PREFIX}product:1:views"

    r.set(key, 100)

    print("Initial views:", r.get(key))

    print("\nThree customers view the product:")
    for _ in range(3):
        print("  View count:", r.incr(key))

    print("\nTeaching point:")
    print("INCR changes a numeric value atomically.")
    print("This is useful for views, likes, counters, etc.")


def demo_sorted_set(r):
    heading("5. SORTED SET — Product popularity leaderboard")

    key = f"{PREFIX}leaderboard:products"

    r.zadd(
        key,
        {
            "Laptop": 980,
            "Headphones": 850,
            "Keyboard": 620,
            "Coffee Maker": 540,
        },
    )

    print("Top products:\n")

    leaders = r.zrevrange(key, 0, 3, withscores=True)

    for position, (product, score) in enumerate(leaders, start=1):
        print(f"  {position}. {product:15} {int(score)} views")

    print("\nTeaching point:")
    print("A Sorted Set associates members with scores.")
    print("Redis can efficiently return members in ranked order.")


def show_keys(r):
    heading("6. What did Python create in Redis?")

    for key in sorted(r.scan_iter(match=f"{PREFIX}*")):
        print(f"{key:45} type={r.type(key)}")


def main():
    try:
        r = connect()
        print("Connected to Redis at localhost:6379")

        # Only remove this demo's keys; existing Redis data is untouched.
        clean_demo_data(r)

        demo_string(r)
        demo_hash(r)
        demo_ttl(r)
        demo_counter(r)
        demo_sorted_set(r)
        show_keys(r)

    except redis.RedisError as error:
        print("\nCould not connect to Redis.")
        print("Make sure the Redis Docker container is running.")
        print("Reason:", error)


if __name__ == "__main__":
    main()
