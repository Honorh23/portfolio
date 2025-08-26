"""
API URL configuration
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views, views_ai

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('portfolio/', include('portfolio.urls')),
    path('contact/', views.ContactView.as_view(), name='contact'),
    path('ai/interview/', views_ai.AIInterviewView.as_view(), name='ai-interview'),
    path('ai/tour/', views_ai.AITourView.as_view(), name='ai-tour'),
]
