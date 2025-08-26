"""
Portfolio serializers
"""
from rest_framework import serializers
from .models import Project, BlogPost, Document, SocialProfile


class ProjectSerializer(serializers.ModelSerializer):
    """Project serializer"""
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'description', 'year', 'technologies',
            'github_url', 'live_url', 'image', 'featured', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class BlogPostSerializer(serializers.ModelSerializer):
    """Blog post serializer"""
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'body', 'kind', 'published', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class DocumentSerializer(serializers.ModelSerializer):
    """Document serializer"""
    
    class Meta:
        model = Document
        fields = [
            'id', 'title', 'type', 'file', 'published', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SocialProfileSerializer(serializers.ModelSerializer):
    """Social profile serializer"""
    
    class Meta:
        model = SocialProfile
        fields = [
            'id', 'platform', 'url', 'order', 'active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
