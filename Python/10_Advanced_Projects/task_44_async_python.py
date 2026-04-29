"""
================================================================
   TASK 44: Async Python (asyncio, aiohttp)       ****    
================================================================

SETUP: pip install aiohttp aiofiles
CONCEPTS: async/await, event loop, coroutines, concurrent tasks, aiohttp

INSTRUCTIONS:
Async Python handles thousands of requests concurrently.
FastAPI, modern Django, and production servers all use async.
"""

import asyncio
import time


# ----- Challenge 44.1 -----
# Simulate fetching data from 5 URLs concurrently.
# Compare: synchronous (one-by-one) vs asynchronous (concurrent).

async def fetch_url(url, delay):
    """Simulate a network request with a delay."""
    await asyncio.sleep(delay)
    return f"Data from {url}"

async def fetch_all_concurrent(urls_with_delays):
    """Fetch all URLs concurrently using asyncio.gather."""
    pass  # YOUR CODE HERE

def fetch_all_sync(urls_with_delays):
    """Fetch all URLs one by one (synchronous)."""
    pass  # YOUR CODE HERE


# ----- Challenge 44.2 -----
# Create an async rate limiter using asyncio.Semaphore.
# Only N requests can run at the same time.

async def rate_limited_fetch(urls, max_concurrent=3):
    pass  # YOUR CODE HERE


# ----- Challenge 44.3 -----
# Create an async producer-consumer pattern using asyncio.Queue.
# Producer: generates tasks every 0.5s
# Consumer: processes tasks (takes 1s each)
# Run 1 producer and 3 consumers.

async def producer(queue, n_items):
    pass  # YOUR CODE HERE

async def consumer(queue, name):
    pass  # YOUR CODE HERE

async def run_pipeline():
    pass  # YOUR CODE HERE


# =========== TEST ===========
if __name__ == "__main__":
    urls = [("url1", 1), ("url2", 1), ("url3", 1), ("url4", 1), ("url5", 1)]

    # Sync: ~5 seconds
    start = time.time()
    fetch_all_sync(urls)
    sync_time = time.time() - start

    # Async: ~1 second
    start = time.time()
    asyncio.run(fetch_all_concurrent(urls))
    async_time = time.time() - start

    print(f"Sync:  {sync_time:.2f}s")
    print(f"Async: {async_time:.2f}s")
    print(f"Speedup: {sync_time/async_time:.1f}x faster!")
