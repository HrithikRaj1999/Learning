"""
==============================================================================
  TASK 39: HTML, CSS & JavaScript Fundamentals
==============================================================================

REAL-WORLD CONTEXT:
Even backend Python developers need to understand frontend basics:
  - How HTML structures pages (semantic elements)
  - How CSS styles them (Grid, Flexbox, responsive design)
  - How JavaScript makes them interactive (DOM manipulation, events)

SCENARIO: Build 4 frontend mini-projects that you'll later connect to your
Python backend:

  39.1 — Responsive Landing Page:
    Navigation bar, hero section, feature cards (CSS Grid), mobile-responsive.
    File: landing.html (single file with embedded CSS)

  39.2 — Interactive Form:
    Registration form with client-side validation, show/hide password,
    real-time error messages, disabled submit until valid.
    File: form.html

  39.3 — Todo App (Vanilla JS):
    Add/delete/toggle todos, filter (All/Active/Completed), localStorage.
    This is the FRONTEND version of your Flask/Django API todos.
    File: todo.html

  39.4 — Fetch API Practice:
    Call your Flask API from JavaScript (GET, POST, error handling).
    This connects frontend → backend.

WHY THIS MATTERS:
  Fullstack interviews expect you to understand BOTH sides.
  Even if you specialize in backend, you'll debug frontend issues.
"""

# CHALLENGE 39.1 -- Responsive Landing Page
Create a landing page with:
- Navigation bar (sticky)
- Hero section with heading and CTA button
- Features section (3 cards using CSS Grid)
- Footer
- Mobile responsive (use media queries)
File: landing.html (single file with embedded CSS)

CHALLENGE 39.2 -- Interactive Form
Create a registration form with:
- Name, Email, Password, Confirm Password fields
- Client-side validation using JavaScript
- Show/hide password toggle
- Real-time validation messages
- Submit button disabled until form is valid
File: form.html

CHALLENGE 39.3 -- Todo App (Vanilla JS)
Create a todo app with:
- Add/delete/toggle todos
- Filter: All / Active / Completed
- Store in localStorage
- Count display: "3 items left"
File: todo.html

This is the frontend version of what you'll connect to Flask/Django later!

CHALLENGE 39.4 -- Fetch API Practice
Create a page that:
- Fetches data from https://jsonplaceholder.typicode.com/posts
- Displays posts in cards
- Has a search/filter input
- Loading spinner while fetching
File: api_explorer.html
"""

"""
[ ] Landing page is responsive
[ ] Form validates all fields correctly
[ ] Todo app persists data in localStorage
[ ] API explorer fetches and displays data
"""
