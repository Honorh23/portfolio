from django.contrib import admin
from .models import Project, BlogPost, Document, SocialProfile,Contact

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'featured', 'created_at')
    list_filter = ('featured', 'year')
    search_fields = ('title', 'description', 'technologies')    



@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'kind', 'published', 'created_at')
    list_filter = ('kind', 'published')
    search_fields = ('title', 'body')

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'type','file','published', 'created_at')
    list_filter = ('type', 'published')
    search_fields = ('title', 'description')


@admin.register(SocialProfile)
class SocialProfileAdmin(admin.ModelAdmin):
    list_display = ('platform', 'url')
    list_filter = ('platform',)
    search_fields = ('platform', 'url')


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'message', 'created_at')
    search_fields = ('name', 'email', 'message')
   



