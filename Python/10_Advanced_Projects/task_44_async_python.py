"""
==============================================================================
  TASK 44: Async Python (asyncio)
==============================================================================

REAL-WORLD CONTEXT:
Sync code: fetch URL1 (2s) → fetch URL2 (2s) → total: 4s.
Async code: fetch URL1 AND URL2 simultaneously → total: 2s.

Used for: web scraping, API aggregation, WebSocket servers, file I/O.
FastAPI is built entirely on async Python.

SCENARIOS:
  44.1 — Concurrent fetch: Make 5 API calls at once (not one by one).
  44.2 — Rate limiting: Call API max 3 at a time (semaphore).
  44.3 — Producer/Consumer: Queue of jobs, workers process them async.

WHAT'S WRONG (sync approach):
  5 API calls × 2 seconds each = 10 seconds total (blocking)

YOUR FIX (async):
  5 API calls concurrently = 2 seconds total (parallel I/O)

EXPECTED BEHAVIOR:
  await fetch_all_concurrent(urls) → completes in ~max(delays), not sum(delays)
  await rate_limited_fetch(urls, max_concurrent=3) → max 3 running at once
"""

import asyncio
import time


async def fetch_url(url, delay):
    """Simulate a network request with a delay."""
    await asyncio.sleep(delay)
    return f"Data from {url}"


# SCENARIO: Dashboard needs data from 5 microservices. Calling them one-by-one
# takes 10 seconds. Calling concurrently takes 2 seconds (the slowest one).
# YOUR FIX: Use asyncio.gather() to run all fetches in parallel.
async def fetch_all_concurrent(urls_with_delays):
    """Fetch all URLs concurrently using asyncio.gather."""
    pass


# SCENARIO: Sync version for comparison. Shows how slow sequential is.
def fetch_all_sync(urls_with_delays):
    """Fetch all URLs one by one (synchronous)."""
    pass


# SCENARIO: External API allows max 3 concurrent requests (rate limit).
# More than 3 → HTTP 429 Too Many Requests. Use semaphore to limit.
# YOUR FIX: asyncio.Semaphore(3) → only 3 coroutines run at once.
async def rate_limited_fetch(urls, max_concurrent=3):
    pass


# SCENARIO: Background job system: producer adds tasks to queue,
# consumers process them. Classic async pattern for job workers.
# YOUR FIX: asyncio.Queue with producer/consumer pattern.
async def producer(queue, n_items):
    pass

async def consumer(queue, name):
    pass

async def run_pipeline():
    pass

if __name__ == "__main__":
    urls = [("url1", 1), ("url2", 1), ("url3", 1), ("url4", 1), ("url5", 1)]

    start = time.time()
    fetch_all_sync(urls)
    sync_time = time.time() - start

    start = time.time()
    asyncio.run(fetch_all_concurrent(urls))
    async_time = time.time() - start

    print(f"Sync:  {sync_time:.2f}s")
    print(f"Async: {async_time:.2f}s")
    print(f"Speedup: {sync_time/async_time:.1f}x faster!")
