"""
==============================================================================
  TASK 47: CI/CD (Continuous Integration & Deployment)
==============================================================================

REAL-WORLD CONTEXT:
Without CI/CD: push code → hope it works → deploy manually → break production.
With CI/CD: push code → tests run automatically → lint checks → deploy if green.

SCENARIO:
  47.1 — Basic CI: GitHub Actions runs tests + lint on every push.
  47.2 — Matrix Testing: Test on Python 3.9, 3.10, 3.11, 3.12 simultaneously.
  47.3 — CD Pipeline: If tests pass on main branch → auto-deploy to server.

WHAT CI CATCHES:
  - Broken imports (works locally because you installed something manually)
  - Failing tests (you forgot to run them before pushing)
  - Lint issues (inconsistent code style)
  - Security vulnerabilities (dependency scanning)

EXPECTED BEHAVIOR:
  git push → GitHub Actions triggers → install deps → run flake8 → run pytest
  All green → ✅ merge allowed
  Test fails → ❌ merge blocked until fixed
"""

# CHALLENGE 47.1 -- Basic CI Pipeline
Create .github/workflows/ci.yml:

  name: CI
  on: [push, pull_request]
  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-python@v5
          with:
            python-version: '3.11'
        - run: pip install -r requirements.txt
        - run: pip install pytest flake8
        - run: flake8 . --max-line-length=120
        - run: pytest -v

CHALLENGE 47.2 -- Test with Multiple Python Versions
Use matrix strategy:
  strategy:
    matrix:
      python-version: ['3.9', '3.10', '3.11', '3.12']

CHALLENGE 47.3 -- Add Code Coverage
  - run: pip install pytest-cov
  - run: pytest --cov=. --cov-report=xml
  - uses: codecov/codecov-action@v3

CHALLENGE 47.4 -- Auto Deploy on Merge to Main
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - Deploy to your hosting provider (Render, Railway, etc.)

CHALLENGE 47.5 -- Pre-commit Hooks
Set up pre-commit for local development:
  pip install pre-commit

  repos:
    - repo: https://github.com/psf/black
      rev: 23.9.1
      hooks:
        - id: black
    - repo: https://github.com/pycqa/flake8
      rev: 6.1.0
      hooks:
        - id: flake8
"""
