#!/usr/bin/env python
"""
Script to create additional sample data for the portfolio
Run with: python manage.py shell < scripts/create_sample_data.py
"""

from portfolio.models import Project, BlogPost, Document, SocialProfile
from django.core.files.base import ContentFile
import json

# Create additional projects
additional_projects = [
    {
        "title": "AI-Powered Chat Assistant",
        "description": "Intelligent chat assistant built with Django and OpenAI API. Features context-aware responses, conversation memory, and integration with external APIs for enhanced functionality.",
        "year": 2024,
        "technologies": ["Python", "Django", "OpenAI API", "WebSockets", "React", "TypeScript"],
        "featured": True,
    },
    {
        "title": "Real-time Analytics Dashboard",
        "description": "Comprehensive analytics dashboard with real-time data visualization. Built with Django REST Framework backend and React frontend with Chart.js integration.",
        "year": 2023,
        "technologies": ["Django", "DRF", "React", "Chart.js", "WebSockets", "PostgreSQL"],
        "featured": False,
    },
    {
        "title": "Microservices E-learning Platform",
        "description": "Scalable e-learning platform built with microservices architecture. Features course management, video streaming, progress tracking, and payment integration.",
        "year": 2023,
        "technologies": ["Django", "FastAPI", "Docker", "PostgreSQL", "Redis", "Celery"],
        "featured": False,
    }
]

for project_data in additional_projects:
    project, created = Project.objects.get_or_create(
        title=project_data["title"],
        defaults=project_data
    )
    if created:
        print(f"Created project: {project.title}")

# Create additional blog posts
additional_posts = [
    {
        "title": "Building Scalable APIs with Django REST Framework",
        "body": """
        In this comprehensive guide, I'll share my experience building scalable APIs using Django REST Framework. 
        We'll cover best practices for serialization, authentication, and performance optimization.
        
        ## Key Topics Covered:
        - API Design Principles
        - Serializer Optimization
        - Authentication Strategies
        - Caching and Performance
        - Testing Best Practices
        
        Django REST Framework provides a powerful toolkit for building Web APIs. Through my experience 
        building multiple production applications, I've learned several key strategies for creating 
        APIs that can scale effectively.
        """,
        "kind": "blog",
        "published": True,
    },
    {
        "title": "Integrating AI into Web Applications",
        "body": """
        Artificial Intelligence is transforming how we build web applications. In this post, I explore 
        practical approaches to integrating AI capabilities into Django applications.
        
        ## Integration Strategies:
        - OpenAI API Integration
        - Custom Model Deployment
        - Real-time AI Features
        - Performance Considerations
        - Cost Optimization
        
        From my experience building AI-powered features like interview prep tools and portfolio tours, 
        I've learned that successful AI integration requires careful planning and consideration of 
        user experience, performance, and costs.
        """,
        "kind": "blog",
        "published": True,
    },
    {
        "title": "Reflections on Learning FastAPI",
        "body": """
        After spending months working primarily with Django, I decided to explore FastAPI for building 
        high-performance APIs. Here are my thoughts on the transition and key differences.
        
        ## Key Observations:
        - Performance Benefits
        - Type Hints and Validation
        - Automatic Documentation
        - Learning Curve
        - When to Choose Each Framework
        
        Both frameworks have their strengths, and understanding when to use each has made me a more 
        versatile developer. FastAPI excels in scenarios requiring high performance and automatic 
        documentation, while Django provides a more comprehensive ecosystem for full-stack development.
        """,
        "kind": "journal",
        "published": True,
    }
]

for post_data in additional_posts:
    post, created = BlogPost.objects.get_or_create(
        title=post_data["title"],
        defaults=post_data
    )
    if created:
        print(f"Created blog post: {post.title}")

print("Sample data creation completed!")
