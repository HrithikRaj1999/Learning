"""
==============================================================================
  TASK 19: Mocking & Test Doubles
==============================================================================

REAL-WORLD CONTEXT:
You can't call REAL APIs in tests (slow, costs money, unreliable, changes state).
Mocking lets you:
  - Test code that calls external APIs without actually calling them
  - Control what the "API" returns (test happy path AND error scenarios)
  - Verify your code called the dependency correctly

SCENARIO 1: WeatherApp calls a WeatherService API.
  In tests: mock the service to return controlled temperatures.
  Verify: app correctly categorizes as Hot/Warm/Cold.

SCENARIO 2: UserService calls a UserRepository (database).
  In tests: mock the repository to return fake users.
  Verify: service correctly formats display names OR raises on missing user.

WHAT TO BUILD:
  - Mock WeatherService.get_temperature() → test all 3 temperature ranges
  - Mock UserRepository.find_by_id() → test found user AND missing user
  - Use MagicMock or patch to inject test doubles
"""

import pytest
from unittest.mock import patch, MagicMock
import json


# --- PRODUCTION CODE (you test this, don't modify) ---

class WeatherService:
    """Simulates an external API call."""
    def get_temperature(self, city):
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


# YOUR FIX: Write test functions below using mocks.
# Example:
#   def test_weather_app_hot():
#       mock_service = MagicMock()
#       mock_service.get_temperature.return_value = 35
#       app = WeatherApp(mock_service)
#       assert "Hot" in app.get_forecast("Delhi")

if __name__ == "__main__":
    print("Run tests with: python -m pytest task_19_mocking.py -v")
    print("Write your mock-based test functions above!")
