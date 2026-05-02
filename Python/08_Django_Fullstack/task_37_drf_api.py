"""
==============================================================================
  TASK 37: Django REST Framework (DRF) API
==============================================================================

REAL-WORLD CONTEXT:
Modern apps have separate frontend (React/Vue) and backend (Django API).
Django REST Framework adds: serializers, viewsets, authentication, pagination,
filtering — everything needed for a production API.

SCENARIO: Turn the blog into a REST API:
  - GET /api/posts/     → list posts (paginated, filterable)
  - POST /api/posts/    → create post (authenticated users only)
  - GET /api/posts/1/   → single post detail
  - PUT /api/posts/1/   → update post (author only)
  - DELETE /api/posts/1/ → delete post (author only)

DRF CONCEPTS:
  - Serializers: convert Model → JSON and validate incoming JSON
  - ViewSets: CRUD logic in one class (less code than individual views)
  - Permissions: IsAuthenticated, IsAuthorOrReadOnly
  - Filters: ?status=published&category=python

EXPECTED BEHAVIOR:
  GET /api/posts/?status=published → 200 [{...}, {...}] (only published)
  POST /api/posts/ (unauthenticated) → 401 Unauthorized
  PUT /api/posts/1/ (not author) → 403 Forbidden
"""

# CHALLENGE 37.1 -- Serializers
# Create blog/serializers.py:

  from rest_framework import serializers
  from .models import Post, Category, Tag

  class CategorySerializer(serializers.ModelSerializer):
      class Meta:
          model = Category
          fields = ['id', 'name', 'slug']

  class PostSerializer(serializers.ModelSerializer):
      category = CategorySerializer(read_only=True)
      category_id = serializers.PrimaryKeyRelatedField(
          queryset=Category.objects.all(), source='category', write_only=True
      )

      class Meta:
          model = Post
          fields = ['id', 'title', 'slug', 'content', 'category', 'category_id',
                    'status', 'created_at', 'updated_at']
          read_only_fields = ['slug', 'created_at', 'updated_at']

CHALLENGE 37.2 -- ViewSets
Create blog/api_views.py:

  from rest_framework import viewsets, filters
  from rest_framework.permissions import IsAuthenticatedOrReadOnly

  class PostViewSet(viewsets.ModelViewSet):
      queryset = Post.objects.all()
      serializer_class = PostSerializer
      permission_classes = [IsAuthenticatedOrReadOnly]
      filter_backends = [filters.SearchFilter, filters.OrderingFilter]
      search_fields = ['title', 'content']
      ordering_fields = ['created_at', 'title']
      lookup_field = 'slug'

CHALLENGE 37.3 -- URL Routing
  from rest_framework.routers import DefaultRouter

  router = DefaultRouter()
  router.register(r'posts', PostViewSet)
  router.register(r'categories', CategoryViewSet)

  urlpatterns = [
      path('api/', include(router.urls)),
  ]

CHALLENGE 37.4 -- Token Authentication
  REST_FRAMEWORK = {
      'DEFAULT_AUTHENTICATION_CLASSES': [
          'rest_framework.authentication.TokenAuthentication',
          'rest_framework.authentication.SessionAuthentication',
      ]
  }

Create endpoints:
  POST /api/auth/register/ -> create user and return token
  POST /api/auth/login/ -> return token
  GET  /api/auth/profile/ -> return user info (authenticated)

CHALLENGE 37.5 -- Custom Permissions
Create a custom permission:
- IsAuthorOrReadOnly: Only post author can edit/delete

  class IsAuthorOrReadOnly(permissions.BasePermission):
      def has_object_permission(self, request, view, obj):
          if request.method in permissions.SAFE_METHODS:
              return True
          return obj.author == request.user
"""

"""
[ ] API browsable at /api/
[ ] CRUD operations work for posts
[ ] Search and ordering work
[ ] Token authentication works
[ ] Only authors can edit their posts via API
[ ] Proper error responses (400, 401, 403, 404)
"""
