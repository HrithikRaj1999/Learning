"""
================================================================
   TASK 37: Django REST Framework (DRF) API       ****    
================================================================

SETUP: pip install djangorestframework
Add 'rest_framework' to INSTALLED_APPS

INSTRUCTIONS:
Build a REST API for the blog using DRF. This is the most in-demand skill.

CONCEPTS: Serializers, ViewSets, Routers, Authentication, Permissions
"""

# =========== CHALLENGES ===========

"""
CHALLENGE 37.1 -- Serializers
Create blog/serializers.py:

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
  # settings.py
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

# =========== VERIFICATION CHECKLIST ===========
"""
[ ] API browsable at /api/
[ ] CRUD operations work for posts
[ ] Search and ordering work
[ ] Token authentication works
[ ] Only authors can edit their posts via API
[ ] Proper error responses (400, 401, 403, 404)
"""
