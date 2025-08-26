"""
Portfolio API views
"""
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from .models import Project, BlogPost, Document, SocialProfile
from .serializers import (
    ProjectSerializer, BlogPostSerializer, 
    DocumentSerializer, SocialProfileSerializer
)


class ProjectViewSet(viewsets.ModelViewSet):
    """Project API viewset"""
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['year', 'featured']
    search_fields = ['title', 'description', 'technologies']
    ordering_fields = ['year', 'created_at', 'title']
    lookup_field = 'slug'


class BlogPostViewSet(viewsets.ModelViewSet):
    """Blog post API viewset"""
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['kind', 'published']
    search_fields = ['title', 'body']
    ordering_fields = ['created_at', 'title']
    lookup_field = 'slug'

    def get_queryset(self):
        """Filter published posts for non-authenticated users"""
        queryset = BlogPost.objects.all()
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(published=True)
        return queryset


class BlogViewSet(BlogPostViewSet):
    """Blog posts only (kind=blog)"""
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(kind='blog')


class JournalViewSet(BlogPostViewSet):
    """Journal entries only (kind=journal)"""
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(kind='journal')


class DocumentViewSet(viewsets.ModelViewSet):
    """Document API viewset"""
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'published']
    search_fields = ['title']
    ordering_fields = ['type', 'created_at', 'title']

    def get_queryset(self):
        """Filter published documents for non-authenticated users"""
        queryset = Document.objects.all()
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(published=True)
        return queryset


class SocialProfileViewSet(viewsets.ModelViewSet):
    """Social profile API viewset"""
    serializer_class = SocialProfileSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['platform', 'active']
    ordering_fields = ['order', 'platform']

    def get_queryset(self):
        """Filter active profiles for non-authenticated users"""
        queryset = SocialProfile.objects.all()
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(active=True)
        return queryset
