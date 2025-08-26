"""
API views for contact and other endpoints
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from .utils import verify_turnstile, check_honeypot, send_contact_email
from .serializers import ContactSerializer
from portfolio.models import Contact


class ContactView(APIView):
    """Contact form API endpoint"""
    permission_classes = [AllowAny]
    
    @method_decorator(ratelimit(key='ip', rate='5/m', method='POST'))
    def post(self, request):
        """Handle contact form submission"""
        serializer = ContactSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid form data', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check honeypot
        if not check_honeypot(request):
            return Response(
                {'error': 'Spam detected'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify Turnstile token
        turnstile_token = request.data.get('turnstile_token')
        if not verify_turnstile(turnstile_token):
            return Response(
                {'error': 'CAPTCHA verification failed'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Save contact instance
        contact_instance = serializer.save()

        # Send email
        email_sent = send_contact_email(
            contact_instance.name,
            contact_instance.email,
            contact_instance.message
        )
        
        if email_sent:
            return Response(
                {'message': 'Message sent successfully'},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'error': 'Failed to send message'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )