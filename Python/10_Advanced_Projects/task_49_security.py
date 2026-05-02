"""
==============================================================================
  TASK 49: Web Security (OWASP Top 10)
==============================================================================

REAL-WORLD CONTEXT:
Every web app is attacked. The top vulnerabilities (OWASP Top 10):
  - SQL Injection: attacker runs arbitrary SQL on your database
  - XSS: attacker injects JavaScript that runs in other users' browsers
  - Weak passwords: plain text storage, no hashing
  - CSRF: attacker forges requests from another site

SCENARIO:
  49.1 — SQL Injection: Find and fix 5 vulnerable queries.
    BAD:  f"SELECT * FROM users WHERE name = '{name}'"  (injectable!)
    GOOD: "SELECT * FROM users WHERE name = ?", (name,)  (safe)

  49.2 — XSS Prevention: Demonstrate and fix cross-site scripting.
    BAD:  f"<h1>Hello {user_input}</h1>"  (renders <script> tags!)
    GOOD: Use Jinja2 auto-escaping (escapes < > & etc.)

  49.3 — Password Security: Hash with bcrypt, never store plain text.
    BAD:  store password as-is in database
    GOOD: bcrypt.hashpw(password.encode(), bcrypt.gensalt())

WHY THIS MATTERS:
  One SQL injection = entire database leaked (user emails, passwords, credit cards).
  These are the #1 reason companies get hacked.
"""

# CHALLENGE 49.1 -- SQL Injection Prevention
BAD (vulnerable):
  cursor.execute(f"SELECT * FROM users WHERE name = '{name}'")

GOOD (parameterized):
  cursor.execute("SELECT * FROM users WHERE name = ?", (name,))

Exercise: Find and fix 5 SQL injection vulnerabilities in the code below.

CHALLENGE 49.2 -- XSS Prevention
BAD: return f"<h1>Hello {user_input}</h1>"
GOOD: Use template engine auto-escaping (Jinja2, Django templates)

Exercise: Create a Flask route that's vulnerable to XSS, then fix it.

CHALLENGE 49.3 -- Password Security
BAD: store passwords in plain text
GOOD: hash with bcrypt

  import bcrypt
  hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
  bcrypt.checkpw(password.encode(), hashed)

Exercise: Build a secure registration/login system.

CHALLENGE 49.4 -- CSRF Protection
Django has it built-in. For Flask:
  pip install flask-wtf

Exercise: Create a form vulnerable to CSRF, then protect it.

CHALLENGE 49.5 -- Environment Variables & Secrets
NEVER hardcode secrets!

  BAD: app.secret_key = "my-secret-key-123"
  GOOD:
    import os
    app.secret_key = os.environ.get('SECRET_KEY')

  Use .env files with python-dotenv:
    pip install python-dotenv
    from dotenv import load_dotenv
    load_dotenv()

Exercise: Move all secrets to environment variables.

CHALLENGE 49.6 -- Security Audit Checklist
For your projects, verify:
[ ] No SQL injection (parameterized queries everywhere)
[ ] No XSS (auto-escaping templates)
[ ] CSRF protection on all forms
[ ] Passwords hashed with bcrypt/argon2
[ ] Secrets in environment variables
[ ] HTTPS enforced
[ ] Input validation on all endpoints
[ ] Rate limiting on auth endpoints
[ ] Proper CORS configuration
[ ] Security headers (Content-Security-Policy, X-Frame-Options)
"""
