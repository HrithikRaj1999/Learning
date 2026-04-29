"""
================================================================
   TASK 36: Django Authentication System          ****    
================================================================

INSTRUCTIONS:
Build a complete auth system: register, login, logout, profile, permissions.

CONCEPTS: Django auth, User model, login_required, permissions, groups
"""

# =========== CHALLENGES ===========

"""
CHALLENGE 36.1 -- User Registration
Create accounts/views.py:

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
  # In urls.py:
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

# =========== VERIFICATION CHECKLIST ===========
"""
[ ] Users can register with username/password
[ ] Users can login and logout
[ ] Profile page displays user info
[ ] Only logged-in users can create posts
[ ] Only post authors can edit their own posts
[ ] Moderator group can manage all posts
"""
