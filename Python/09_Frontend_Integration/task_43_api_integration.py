"""
==============================================================================
  TASK 43: External API Integration
==============================================================================

REAL-WORLD CONTEXT:
Your Python backend often needs to call OTHER APIs:
  - Weather data for a dashboard
  - GitHub profiles for a dev tool
  - Payment processing (Stripe)
  - Email sending (SendGrid)

SCENARIOS:
  43.1 — Weather API: Call OpenWeatherMap, handle API keys, parse response.
  43.2 — GitHub API: Fetch user profiles (public, no auth needed for practice).
  43.3 — Reusable API Client: Base class with retry, headers, error handling.
  43.4 — Pagination: APIs return data in pages. Fetch ALL pages automatically.

WHAT'S WRONG (without proper API client):
  - No retry: one network blip = failed request = broken feature
  - No timeout: slow API holds up your entire server
  - No error handling: API returns 500 → your app crashes
  - No pagination: only get first 30 results out of 5000

EXPECTED BEHAVIOR:
  client = APIClient("https://api.github.com", max_retries=3)
  client.get("/users/torvalds") → {"name": "Linus Torvalds", ...}
  # Automatically retries on failure, times out after 10s, handles errors
"""

import requests
import json


# SCENARIO: Dashboard needs current weather. Call external API, parse response,
# handle errors (invalid city, API down, rate limited).
# YOUR FIX: Call weather API, return parsed temperature/conditions or error.
def get_weather(city, api_key="YOUR_API_KEY"):
    pass


# SCENARIO: Dev tool shows GitHub profiles. Call public API (no auth needed).
# Handle: user not found (404), rate limited (403), network error.
# YOUR FIX: Fetch GitHub user data, return parsed dict or None.
def get_github_profile(username):
    pass


# SCENARIO: Every external API call needs: base URL, headers, retry, timeout.
# Instead of repeating this for each API, build a reusable client class.
# YOUR FIX: APIClient with get/post methods, automatic retry, error handling.
class APIClient:
    def __init__(self, base_url, headers=None, max_retries=3):
        pass

    def get(self, endpoint, params=None):
        pass

    def post(self, endpoint, data=None):
        pass


# SCENARIO: GitHub API returns max 30 repos per page. User has 200 repos.
# Need to fetch ALL pages automatically (follow "next" links).
# YOUR FIX: Follow pagination links until no more pages.
def fetch_all_pages(url, headers=None):
    pass

if __name__ == "__main__":
    profile = get_github_profile("torvalds")
    if profile:
        print(f"GitHub User: {profile.get('name')}")
        print(f"Public Repos: {profile.get('public_repos')}")
        print("[PASS] Test 43.2 Passed: GitHub profile")
    else:
        print("[Warning]  Test 43.2: Implement get_github_profile first")

    print("\n[Target] Complete all challenges and test with real APIs!")
