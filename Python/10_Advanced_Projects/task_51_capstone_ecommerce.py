"""
========================================================================
   TASK 51: CAPSTONE -- E-Commerce API             *****        
========================================================================

[Trophy] CAPSTONE PROJECT 2

Build a backend API for an e-commerce platform.
Focus: API design, database modeling, payment integration.

TECH STACK: Django + DRF + PostgreSQL + Celery + Redis
"""

# =========== REQUIREMENTS ===========

"""
FEATURES TO BUILD:

1. PRODUCT CATALOG
   - Products with multiple images
   - Categories (nested/hierarchical)
   - Price, stock, SKU
   - Product variants (size, color)
   - Search & filter

2. SHOPPING CART
   - Add/remove items
   - Update quantities
   - Cart persistence (session or DB)
   - Price calculations with tax

3. ORDER SYSTEM
   - Checkout flow
   - Order status tracking (pending -> processing -> shipped -> delivered)
   - Order history
   - Invoice generation (PDF)

4. USER MANAGEMENT
   - Registration & authentication (JWT tokens)
   - Address book (shipping addresses)
   - Wishlist
   - Order history

5. PAYMENT (simulated)
   - Payment intent creation
   - Payment confirmation
   - Refund handling
   - Webhook handling

6. ADMIN DASHBOARD API
   - Sales analytics
   - Inventory management
   - Customer management

7. BACKGROUND TASKS (Celery)
   - Send order confirmation emails
   - Process payments
   - Generate daily sales reports
   - Low stock alerts
"""
