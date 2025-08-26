"""
Utility functions for API views
"""
import requests
from django.conf import settings
from django.core.mail import send_mail
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework import status


def verify_turnstile(token):
    """Verify Cloudflare Turnstile token"""
    if not settings.TURNSTILE_SECRET_KEY:
        return True  # Skip verification in development
    
    response = requests.post(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        data={
            'secret': settings.TURNSTILE_SECRET_KEY,
            'response': token,
        }
    )
    return response.json().get('success', False)


def check_honeypot(request):
    """Check honeypot field to detect bots"""
    honeypot_field = request.data.get('website', '')
    return honeypot_field == ''  # Should be empty for humans


def send_contact_email(name, email, message):
    """Send contact form email"""
    subject = f'Portfolio Contact: {name}'
    body = f"""
    New contact form submission:
    
    Name: {name}
    Email: {email}
    Message: {message}
    """
    
    try:
        send_mail(
            subject,
            body,
            settings.EMAIL_HOST_USER,
            [settings.EMAIL_HOST_USER],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Email sending failed: {e}")
        return False


class RateLimitMixin:
    """Mixin to add rate limiting to views"""
    
    @method_decorator(ratelimit(key='ip', rate='5/m', method='POST'))
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
