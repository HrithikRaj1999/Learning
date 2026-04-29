"""
================================================================
   TASK 17: Custom Exceptions                     ***      
================================================================

INSTRUCTIONS:
Django raises Http404, PermissionDenied, ValidationError -- all custom exceptions.
Learn to create your own for clean error handling.

CONCEPTS: custom exception classes, exception hierarchy, error messages
"""


# ----- Challenge 17.1 -----
# Create a validation system with custom exceptions:
# - ValidationError(message, field=None)
# - RequiredFieldError(field) -> inherits from ValidationError
# - InvalidFormatError(field, expected_format) -> inherits from ValidationError

class ValidationError(Exception):
    pass  # YOUR CODE HERE

class RequiredFieldError(ValidationError):
    pass  # YOUR CODE HERE

class InvalidFormatError(ValidationError):
    pass  # YOUR CODE HERE


# ----- Challenge 17.2 -----
# Write a validate_user_data function that validates a user dict:
# Required fields: "name", "email", "age"
# Email must contain "@" and "."
# Age must be between 0 and 150
# Raise appropriate custom exceptions for each violation.
def validate_user_data(data):
    pass  # YOUR CODE HERE


# =========== TEST CASES (DO NOT MODIFY) ===========
if __name__ == "__main__":
    # Test 17.1
    try:
        raise RequiredFieldError("name")
    except ValidationError as e:
        assert "name" in str(e).lower()
    print("[PASS] Test 17.1 Passed: Custom Exception Hierarchy")

    # Test 17.2
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

    # Valid data should not raise
    validate_user_data({"name": "Alice", "email": "alice@test.com", "age": 25})
    print("[PASS] Test 17.2 Passed: validate_user_data")

    print("\n*** ALL TASK 17 TESTS PASSED! ***")
