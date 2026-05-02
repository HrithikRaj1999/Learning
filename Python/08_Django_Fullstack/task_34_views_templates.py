"""
==============================================================================
  TASK 34: Django Views & Templates
==============================================================================

REAL-WORLD CONTEXT:
Views handle HTTP requests and return responses. Templates render HTML.
This is how users SEE your application:
  - Blog listing page (shows all published posts)
  - Single post page (shows content + comments)
  - Category page (filtered posts)

SCENARIO: Make the blog VISIBLE to users:
  1. Function-based views that query the database
  2. URL routing that maps URLs to views
  3. Templates that render data into HTML pages
  4. Pagination (10 posts per page, not all 10,000 at once)

WHAT YOU'LL LEARN:
  - Django's ORM queries: Post.objects.filter(status='published')
  - Template inheritance: base.html → post_list.html extends it
  - URL parameters: /post/my-first-post/ (slug-based URLs)
  - Pagination: ?page=2 (built into Django)

EXPECTED BEHAVIOR:
  GET /                    → list of published posts (paginated)
  GET /post/my-first-post/ → single post detail page
  GET /category/python/    → all posts in "Python" category
"""

# CHALLENGE 34.1 -- Function-Based Views
# Create these views in blog/views.py:

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

"""
[ ] post_list view works at /blog/
[ ] post_detail view works at /blog/post/<slug>/
[ ] Templates render correctly with data
[ ] Pagination works
[ ] Class-based views implemented
[ ] Navigation links work between pages
"""
