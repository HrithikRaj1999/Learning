"""
==============================================================================
  TASK 38: Django Admin Customization
==============================================================================

REAL-WORLD CONTEXT:
Django's admin panel is a FREE back-office tool. Customize it and you have
a complete CMS (Content Management System) without writing a single line of
frontend code. Content teams use it daily.

SCENARIO: Make the admin powerful for blog editors:
  1. Better list views (show title, category, status, date in columns)
  2. Filters (filter by status, category, date range)
  3. Search (find posts by title or content)
  4. Bulk actions ("publish 50 selected posts" in one click)
  5. Inline editing (edit comments directly inside the post edit page)
  6. Auto-generated slugs (type title → slug fills automatically)

WHY THIS MATTERS:
  Without customization: admin shows raw model fields (ugly, hard to use).
  With customization: admin becomes a professional CMS that editors love.

EXPECTED BEHAVIOR:
  Admin list: columns [Title, Category, Status, Created] with filters
  Admin action: select 10 posts → "Mark as published" → done
  Admin inline: edit post → see comments below → add/edit/delete comments
"""

# CHALLENGE 38.1 -- Customize Post Admin
# In blog/admin.py:

  @admin.register(Post)
  class PostAdmin(admin.ModelAdmin):
      list_display = ['title', 'category', 'status', 'created_at', 'author']
      list_filter = ['status', 'category', 'created_at']
      search_fields = ['title', 'content']
      prepopulated_fields = {'slug': ('title',)}
      date_hierarchy = 'created_at'
      ordering = ['-created_at']
      list_per_page = 20

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

"""
[ ] Post admin shows custom columns
[ ] Filters and search work
[ ] Slug auto-populates from title
[ ] Bulk publish action works
[ ] Comments show inline in post editor
"""
