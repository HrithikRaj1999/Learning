"""
================================================================
   TASK 38: Django Admin Customization            ***      
================================================================

INSTRUCTIONS:
Django Admin is a superpower. Customize it for real-world use.

CONCEPTS: ModelAdmin, list_display, list_filter, search_fields, actions
"""

# =========== CHALLENGES ===========

"""
CHALLENGE 38.1 -- Customize Post Admin
In blog/admin.py:

  @admin.register(Post)
  class PostAdmin(admin.ModelAdmin):
      list_display = ['title', 'category', 'status', 'created_at', 'author']
      list_filter = ['status', 'category', 'created_at']
      search_fields = ['title', 'content']
      prepopulated_fields = {'slug': ('title',)}
      date_hierarchy = 'created_at'
      ordering = ['-created_at']
      list_per_page = 20

      # Custom action: publish selected posts
      actions = ['make_published']

      def make_published(self, request, queryset):
          count = queryset.update(status='published')
          self.message_user(request, f'{count} posts published.')
      make_published.short_description = "Mark selected as published"


CHALLENGE 38.2 -- Inline Models
Show comments inline within post editing:

  class CommentInline(admin.TabularInline):
      model = Comment
      extra = 1

  class PostAdmin(admin.ModelAdmin):
      inlines = [CommentInline]


CHALLENGE 38.3 -- Custom Admin Dashboard
Override the admin index template to show:
- Total posts count
- Posts published this week
- Most active categories
"""

# =========== VERIFICATION CHECKLIST ===========
"""
[ ] Post admin shows custom columns
[ ] Filters and search work
[ ] Slug auto-populates from title
[ ] Bulk publish action works
[ ] Comments show inline in post editor
"""
