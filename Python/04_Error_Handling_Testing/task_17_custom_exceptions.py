"""
==============================================================================
  TASK 17: Custom Exceptions (Exception Hierarchy)
==============================================================================

REAL-WORLD CONTEXT:
Generic exceptions like ValueError tell you NOTHING about what went wrong.
Custom exceptions let you:
  - Catch SPECIFIC failures (missing field vs invalid format vs out of range)
  - Give users SPECIFIC error messages ("Email format invalid" not "ValueError")
  - Handle different errors differently in calling code

SCENARIO: User registration form validates: name (required), email (must be valid
format), age (must be 1-150). Each type of failure needs a DIFFERENT error type
so the frontend can show the error next to the right field.

WHAT'S WRONG (without custom exceptions):
  raise ValueError("name is required")  → caller can't distinguish from
  raise ValueError("invalid email")     → any other ValueError in the system

YOUR FIX: Exception hierarchy:
  ValidationError (base)
    ├── RequiredFieldError (field is missing)
    └── InvalidFormatError (field has wrong format)
"""


# Exception hierarchy: all validation errors share a base class.
# Callers can catch ValidationError for ALL, or specific subclasses for targeted handling.
class ValidationError(Exception):
    pass

class RequiredFieldError(ValidationError):
    pass

class InvalidFormatError(ValidationError):
    pass


# SCENARIO: Validate user registration data:
#   - "name" must be present → RequiredFieldError if missing
#   - "email" must contain @ → InvalidFormatError if invalid
#   - "age" must be 1-150 → ValidationError if out of range
#   - All valid → return None (no error)
# YOUR FIX: Check each field, raise the SPECIFIC exception type for each failure.
# EXPECTED: validate_user_data({"email": "a@b.com", "age": 25}) → RequiredFieldError (no name)
def validate_user_data(data):
    pass

if __name__ == "__main__":
    try:
        raise RequiredFieldError("name")
    except ValidationError as e:
        assert "name" in str(e).lower()
    print("[PASS] Test 17.1 Passed: Custom Exception Hierarchy")

    try:
        validate_user_data({"email": "test@test.com", "age": 25})
        assert False, "Should raise RequiredFieldError"
    except RequiredFieldError:
        pass

    try:
        validate_user_data({"name": "Alice", "email": "bad-email", "age": 25})
        assert False, "Should raise InvalidFormatError"
    except InvalidFormatError:
        pass

    try:
        validate_user_data({"name": "Alice", "email": "a@b.com", "age": 200})
        assert False, "Should raise ValidationError"
    except ValidationError:
        pass

    validate_user_data({"name": "Alice", "email": "alice@test.com", "age": 25})
    print("[PASS] Test 17.2 Passed: validate_user_data")

    print("\n*** ALL TASK 17 TESTS PASSED! ***")
