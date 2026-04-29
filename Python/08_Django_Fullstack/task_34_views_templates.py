"""
================================================================
   TASK 34: Django Views & Templates              ***      
================================================================

INSTRUCTIONS:
Build views and templates for the blog app from Task 33.

CONCEPTS: Function-based views, class-based views, URL routing, template tags
"""

# =========== CHALLENGES ===========

"""
CHALLENGE 34.1 -- Function-Based Views
Create these views in blog/views.py:

  def post_list(request):
      '''Display all published posts with pagination (10 per page)'''
      posts = Post.objects.filter(status='published')
      paginator = Paginator(posts, 10)
      page = request.GET.get('page')
      posts = paginator.get_page(page)
      return render(request, 'blog/post_list.html', {'posts': posts})

  def post_detail(request, slug):
      '''Display a single post by slug, or 404'''
      post = get_object_or_404(Post, slug=slug, status='published')
      return render(request, 'blog/post_detail.html', {'post': post})

  def category_posts(request, slug):
      '''Display all posts in a category'''
      ...


CHALLENGE 34.2 -- URL Configuration
In blog/urls.py:
  urlpatterns = [
      path('', views.post_list, name='post_list'),
      path('post/<slug:slug>/', views.post_detail, name='post_detail'),
      path('category/<slug:slug>/', views.category_posts, name='category_posts'),
  ]

Include in myproject/urls.py:
  path('blog/', include('blog.urls')),


CHALLENGE 34.3 -- Templates
Create these templates in blog/templates/blog/:

  base.html -- master template with navigation
  post_list.html -- list of posts with pagination
  post_detail.html -- single post with category and tags


CHALLENGE 34.4 -- Class-Based Views
Convert post_list to a ListView and post_detail to a DetailView:

  class PostListView(ListView):
      model = Post
      template_name = 'blog/post_list.html'
      context_object_name = 'posts'
      paginate_by = 10
      queryset = Post.objects.filter(status='published')
"""

# =========== VERIFICATION CHECKLIST ===========
"""
[ ] post_list view works at /blog/
[ ] post_detail view works at /blog/post/<slug>/
[ ] Templates render correctly with data
[ ] Pagination works
[ ] Class-based views implemented
[ ] Navigation links work between pages
"""
