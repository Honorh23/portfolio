"""
Portfolio content models
"""
from django.db import models
from django.utils.text import slugify
from django.core.validators import URLValidator


class Project(models.Model):
    """Portfolio project model"""
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField()
    year = models.IntegerField()
    technologies = models.JSONField(default=list, help_text="List of technologies used")
    github_url = models.URLField(blank=True, null=True)
    live_url = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-year', '-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class BlogPost(models.Model):
    """Blog post and journal entry model"""
    KIND_CHOICES = [
        ('blog', 'Blog Post'),
        ('journal', 'Journal Entry'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    body = models.TextField()
    kind = models.CharField(max_length=10, choices=KIND_CHOICES, default='blog')
    published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.get_kind_display()})"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class Document(models.Model):
    """Document model for CV, cover letters, etc."""
    TYPE_CHOICES = [
        ('cv', 'CV/Resume'),
        ('cover_letter', 'Cover Letter'),
        ('certificate', 'Certificate'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    file = models.FileField(upload_to='documents/')
    published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['type', '-created_at']

    def __str__(self):
        return f"{self.title} ({self.get_type_display()})"


class SocialProfile(models.Model):
    """Social media profile links"""
    PLATFORM_CHOICES = [
        ('github', 'GitHub'),
        ('linkedin', 'LinkedIn'),
        ('twitter', 'Twitter'),
        ('email', 'Email'),
        ('website', 'Website'),
        ('other', 'Other'),
    ]
    
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    url = models.URLField()
    order = models.IntegerField(default=0, help_text="Display order (lower numbers first)")
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'platform']

    def __str__(self):
        return f"{self.get_platform_display()}: {self.url}"
    
from django.db import models

class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField(max_length=2000)
    website = models.CharField(max_length=100, blank=True, null=True)  # Honeypot field
    turnstile_token = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
