"""
================================================================
   TASK 43: API Integration (Consume External APIs)  ***   
================================================================

SETUP: pip install requests
CONCEPTS: HTTP client, API keys, rate limiting, error handling, pagination

INSTRUCTIONS:
Real apps consume external APIs. Learn to work with them properly.
"""

import requests
import json


# ----- Challenge 43.1 -----
# Create a weather checker using OpenWeatherMap API (free tier).
# - Get API key from https://openweathermap.org/api (free)
# - Fetch current weather for a city
# - Return: {"city": "London", "temp": 15.5, "description": "cloudy", "humidity": 80}
# - Handle errors: city not found, API down, invalid key

def get_weather(city, api_key="YOUR_API_KEY"):
    pass  # YOUR CODE HERE


# ----- Challenge 43.2 -----
# Create a GitHub profile fetcher:
# - Fetch user profile from https://api.github.com/users/{username}
# - Fetch their repos
# - Return summary: {"name": "...", "public_repos": 30, "top_languages": [...], "followers": 100}

def get_github_profile(username):
    pass  # YOUR CODE HERE


# ----- Challenge 43.3 -----
# Create a generic API client class:
# - Handles base URL, headers, auth tokens
# - Methods: get(), post(), put(), delete()
# - Automatic JSON parsing
# - Retry on 5xx errors
# - Rate limiting (max N requests per minute)

class APIClient:
    def __init__(self, base_url, headers=None, max_retries=3):
        pass  # YOUR CODE HERE

    def get(self, endpoint, params=None):
        pass  # YOUR CODE HERE

    def post(self, endpoint, data=None):
        pass  # YOUR CODE HERE


# ----- Challenge 43.4 -----
# Handle API pagination:
# Fetch ALL pages from a paginated API.
# Example: GitHub repos API returns 30 per page.
# Your function should follow "next" links and collect all results.

def fetch_all_pages(url, headers=None):
    pass  # YOUR CODE HERE


# =========== TEST CASES ===========
if __name__ == "__main__":
    # Test 43.2 (works without API key)
    profile = get_github_profile("torvalds")
    if profile:
        print(f"GitHub User: {profile.get('name')}")
        print(f"Public Repos: {profile.get('public_repos')}")
        print("[PASS] Test 43.2 Passed: GitHub profile")
    else:
        print("[Warning]  Test 43.2: Implement get_github_profile first")

    print("\n[Target] Complete all challenges and test with real APIs!")
