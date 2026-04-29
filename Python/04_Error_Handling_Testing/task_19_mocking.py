"""
================================================================
   TASK 19: Mocking & Test Fixtures               ****    
================================================================

INSTRUCTIONS:
Real apps call APIs, databases, and external services. You MOCK them in tests.

CONCEPTS: unittest.mock, patch, MagicMock, side_effect, fixtures
SETUP: pip install pytest
"""

import pytest
from unittest.mock import patch, MagicMock
import json


# ======= CODE TO TEST =======
class WeatherService:
    """Simulates an external API call."""
    def get_temperature(self, city):
        # In real life, this calls an API
        raise NotImplementedError("This would call a real API")


class WeatherApp:
    def __init__(self, service: WeatherService):
        self.service = service

    def get_forecast(self, city):
        temp = self.service.get_temperature(city)
        if temp > 30:
            return f"{city}: Hot ({temp}°C)"
        elif temp > 15:
            return f"{city}: Warm ({temp}°C)"
        else:
            return f"{city}: Cold ({temp}°C)"


class UserRepository:
    """Simulates database operations."""
    def find_by_id(self, user_id):
        raise NotImplementedError("DB call")

    def save(self, user):
        raise NotImplementedError("DB call")


class UserService:
    def __init__(self, repo: UserRepository):
        self.repo = repo

    def get_user_display_name(self, user_id):
        user = self.repo.find_by_id(user_id)
        if user is None:
            raise ValueError(f"User {user_id} not found")
        return f"{user['first_name']} {user['last_name']}"


# ======= YOUR TESTS BELOW =======

# ----- Challenge 19.1 -----
# Mock WeatherService.get_temperature and test WeatherApp.get_forecast
# Test all three conditions: Hot (>30), Warm (15-30), Cold (<15)

# YOUR TESTS HERE


# ----- Challenge 19.2 -----
# Mock UserRepository and test UserService:
# - Test successful user lookup
# - Test user not found (mock returns None)
# - Verify that repo.find_by_id was called with correct arguments

# YOUR TESTS HERE


# ----- Challenge 19.3 -----
# Use side_effect to simulate a service that fails on first call but succeeds on retry.

# YOUR TESTS HERE


# =========== VALIDATION ===========
if __name__ == "__main__":
    print("Run tests with: python -m pytest task_19_mocking.py -v")
    print("Write your mock-based test functions above!")
