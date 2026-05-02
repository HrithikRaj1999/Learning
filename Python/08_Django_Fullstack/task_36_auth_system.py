"""
==============================================================================
  TASK 36: Django Authentication System
==============================================================================

REAL-WORLD CONTEXT:
Every app needs: register, login, logout, profile, protected pages.
Django provides 90% of this built-in. You just configure and customize.

SCENARIO: Complete auth flow for the blog:
  1. Registration (create account with username/password)
  2. Login/Logout (Django's built-in views)
  3. Profile page (show user info + their posts)
  4. Protected views (only logged-in users can create posts)

WHAT DJANGO GIVES YOU FREE:
  - Password hashing (bcrypt/PBKDF2, never plain text)
  - Session management (cookie-based, secure)
  - UserCreationForm (registration form with validation)
  - LoginView/LogoutView (just add templates)
  - @login_required decorator (protect any view)

EXPECTED BEHAVIOR:
  GET /register/ → registration form
  POST /register/ → creates user, logs in, redirects
  GET /login/    → login form
  GET /profile/  → shows user info (or redirects to login if not authenticated)
  GET /post/new/ without login → redirects to /login/
"""

# CHALLENGE 36.1 -- User Registration
# Create accounts/views.py:

  from django.contrib.auth.forms import UserCreationForm

  def register(request):
      if request.method == 'POST':
          form = UserCreationForm(request.POST)
          if form.is_valid():
              user = form.save()
              login(request, user)
              return redirect('post_list')
      else:
          form = UserCreationForm()
      return render(request, 'accounts/register.html', {'form': form})

CHALLENGE 36.2 -- Login/Logout
Use Django's built-in views:
  path('login/', auth_views.LoginView.as_view(template_name='accounts/login.html'), name='login'),
  path('logout/', auth_views.LogoutView.as_view(), name='logout'),

CHALLENGE 36.3 -- Profile Page
Create a profile view that shows:
- Username, email
- Date joined
- Number of posts (if blog author)
- Edit profile form (change email, first/last name)

CHALLENGE 36.4 -- Protect Views
- Only logged-in users can create posts: @login_required
- Only the post author can edit/delete their posts
- Add an "author" ForeignKey to Post model linking to User

CHALLENGE 36.5 -- Permissions
- Create a "Moderator" group that can edit/delete any post
- Use @permission_required decorator
- Show different UI for different roles
"""

"""
[ ] Users can register with username/password
[ ] Users can login and logout
[ ] Profile page displays user info
[ ] Only logged-in users can create posts
[ ] Only post authors can edit their own posts
[ ] Moderator group can manage all posts
"""
