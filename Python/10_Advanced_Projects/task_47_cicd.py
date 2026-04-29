"""
================================================================
   TASK 47: CI/CD Pipeline with GitHub Actions    ****    
================================================================

CONCEPTS: GitHub Actions, automated testing, linting, deployment

INSTRUCTIONS:
Automate testing and deployment. Every push triggers tests automatically.
"""

# =========== CHALLENGES ===========

"""
CHALLENGE 47.1 -- Basic CI Pipeline
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

  # .pre-commit-config.yaml
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
