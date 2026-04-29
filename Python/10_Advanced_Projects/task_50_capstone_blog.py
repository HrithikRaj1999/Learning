"""
========================================================================
   TASK 50: CAPSTONE -- Full Stack Blog Platform    *****       
========================================================================

[Trophy] CAPSTONE PROJECT 1

Build a complete blog platform from scratch using Django.
This project demonstrates ALL skills from Levels 1-9.

TECH STACK: Django + DRF + PostgreSQL + Redis + Docker

TIME ESTIMATE: 1-2 weeks
"""

# =========== REQUIREMENTS ===========

"""
FEATURES TO BUILD:

1. USER SYSTEM
   - Registration with email verification
   - Login / Logout
   - User profiles with avatar upload
   - Password reset via email

2. BLOG ENGINE
   - Create, edit, delete posts (rich text editor)
   - Categories and tags
   - Draft / Published status
   - Featured images
   - Markdown support
   - Slug-based URLs

3. COMMENTS
   - Nested comments (replies)
   - Edit / delete own comments
   - Spam filtering (basic)

4. SEARCH & DISCOVERY
   - Full-text search
   - Filter by category, tag, date
   - Related posts suggestions
   - RSS feed

5. REST API (DRF)
   - All CRUD operations via API
   - Token authentication
   - Pagination, filtering, ordering
   - API documentation (Swagger/DRF-Spectacular)

6. ADMIN PANEL
   - Custom Django admin
   - Dashboard with statistics
   - Bulk actions

7. PERFORMANCE
   - Redis caching
   - Database query optimization
   - Image compression

8. DEPLOYMENT
   - Docker + docker-compose
   - CI/CD with GitHub Actions
   - Deploy to a cloud provider
"""

# =========== PROJECT STRUCTURE ===========
"""
blog_platform/
|-- docker-compose.yml
|-- Dockerfile
|-- requirements.txt
|-- .env
|-- .github/workflows/ci.yml
|-- manage.py
|-- config/
|   |-- settings/
|   |   |-- base.py
|   |   |-- development.py
|   |   |-- production.py
|   |-- urls.py
|   |-- wsgi.py
|-- apps/
|   |-- accounts/
|   |   |-- models.py
|   |   |-- views.py
|   |   |-- serializers.py
|   |   |-- urls.py
|   |-- blog/
|   |   |-- models.py
|   |   |-- views.py
|   |   |-- serializers.py
|   |   |-- urls.py
|   |-- comments/
|       |-- models.py
|       |-- views.py
|       |-- serializers.py
|-- templates/
|-- static/
"""
