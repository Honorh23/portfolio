"""
Portfolio URL configuration
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet)
router.register(r'blog', views.BlogViewSet, basename='blog')
router.register(r'journal', views.JournalViewSet, basename='journal')
router.register(r'docs', views.DocumentViewSet, basename='document')
router.register(r'profiles', views.SocialProfileViewSet, basename='socialprofile')

urlpatterns = [
    path('', include(router.urls)),
]
