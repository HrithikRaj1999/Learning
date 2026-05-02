"""
==============================================================================
  TASK 33: Django Project Setup & Models
==============================================================================

REAL-WORLD CONTEXT:
Django is Python's most popular full-stack web framework. Used by:
Instagram, Pinterest, Mozilla, NASA. It gives you:
  - ORM (models = database tables as Python classes)
  - Admin panel (free CRUD UI for your data)
  - Auth system (login, registration, permissions built-in)
  - URL routing, templates, forms, middleware — EVERYTHING

SCENARIO: Build a blog platform. Starting from zero:
  1. Create Django project structure
  2. Define data models (Category, Post with status/author)
  3. Run migrations (create database tables)
  4. Use admin panel to manage content

WHY DJANGO OVER FLASK:
  Flask = build everything yourself (good for learning, APIs)
  Django = batteries included (good for full websites, rapid development)

EXPECTED RESULT:
  - Blog app with Category and Post models
  - Admin panel at /admin where you can create/edit posts
  - Models use proper field types, constraints, and relationships
"""

# STEP 1: Create the Django project
#   django-admin startproject myproject
#   cd myproject
#   python manage.py startapp blog

# STEP 2: Add 'blog' to INSTALLED_APPS in myproject/settings.py

# STEP 3: Create these models in blog/models.py:

  class Category(models.Model):
      name = models.CharField(max_length=100, unique=True)
      slug = models.SlugField(unique=True)
      description = models.TextField(blank=True)

      class Meta:
          verbose_name_plural = "categories"

      def __str__(self):
          return self.name

  class Post(models.Model):
      STATUS_CHOICES = [
          ('draft', 'Draft'),
          ('published', 'Published'),
      ]

      title = models.CharField(max_length=200)
      slug = models.SlugField(unique=True)
      content = models.TextField()
      category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='posts')
      status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
      created_at = models.DateTimeField(auto_now_add=True)
      updated_at = models.DateTimeField(auto_now=True)

      class Meta:
          ordering = ['-created_at']

      def __str__(self):
          return self.title

  class Tag(models.Model):
      name = models.CharField(max_length=50, unique=True)
      posts = models.ManyToManyField(Post, related_name='tags', blank=True)

      def __str__(self):
          return self.name

STEP 4: Make and apply migrations
  python manage.py makemigrations
  python manage.py migrate

STEP 5: Register models in blog/admin.py:
  from .models import Category, Post, Tag
  admin.site.register(Category)
  admin.site.register(Post)
  admin.site.register(Tag)

STEP 6: Create a superuser and test in admin
  python manage.py createsuperuser
  python manage.py runserver
  -> Visit http://localhost:8000/admin

STEP 7: Use Django shell to practice queries:
  python manage.py shell
  >>> from blog.models import Category, Post
  >>> cat = Category.objects.create(name="Python", slug="python")
  >>> Post.objects.create(title="First Post", slug="first", content="Hello!", category=cat, status="published")
  >>> Post.objects.filter(status="published")
  >>> Post.objects.filter(category__name="Python")
"""

"""
[ ] Project created with django-admin startproject
[ ] App created with python manage.py startapp blog
[ ] Models defined (Category, Post, Tag)
[ ] Migrations created and applied
[ ] Admin registered
[ ] Superuser created
[ ] Can add data through admin interface
[ ] Can query data in Django shell
"""
