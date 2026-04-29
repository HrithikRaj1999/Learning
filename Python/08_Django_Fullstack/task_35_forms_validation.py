"""
================================================================
   TASK 35: Django Forms & Validation             ****    
================================================================

INSTRUCTIONS:
Forms handle user input -- the most critical part of any web app.

CONCEPTS: ModelForm, form validation, clean methods, CSRF protection
"""

# =========== CHALLENGES ===========

"""
CHALLENGE 35.1 -- Create Forms
In blog/forms.py:

  class PostForm(forms.ModelForm):
      class Meta:
          model = Post
          fields = ['title', 'content', 'category', 'status']
          widgets = {
              'content': forms.Textarea(attrs={'rows': 10}),
          }

      def clean_title(self):
          title = self.cleaned_data['title']
          if len(title) < 5:
              raise forms.ValidationError("Title must be at least 5 characters")
          return title


  class CommentForm(forms.Form):
      name = forms.CharField(max_length=100)
      email = forms.EmailField()
      body = forms.CharField(widget=forms.Textarea)

      def clean_body(self):
          body = self.cleaned_data['body']
          if len(body) < 10:
              raise forms.ValidationError("Comment too short")
          return body


CHALLENGE 35.2 -- Create/Edit Views
  def post_create(request):
      if request.method == 'POST':
          form = PostForm(request.POST)
          if form.is_valid():
              post = form.save(commit=False)
              post.slug = slugify(post.title)
              post.save()
              return redirect('post_detail', slug=post.slug)
      else:
          form = PostForm()
      return render(request, 'blog/post_form.html', {'form': form})


CHALLENGE 35.3 -- Contact Form with Email Validation
Create a contact form that validates:
- Name (required, 2-100 chars)
- Email (required, valid format)
- Subject (required, 5-200 chars)
- Message (required, 20-5000 chars)

Display success/error messages using Django's messages framework.
"""

# =========== VERIFICATION CHECKLIST ===========
"""
[ ] PostForm validates and saves correctly
[ ] CommentForm validates input
[ ] Create view renders form and handles submission
[ ] Edit view pre-fills form with existing data
[ ] CSRF token included in templates ({% csrf_token %})
[ ] Error messages display next to fields
[ ] Success messages show after form submission
"""
