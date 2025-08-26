"""
AI-powered API views
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from .serializers import AIInterviewSerializer, AITourSerializer
from .ai_utils import generate_interview_questions, generate_tour_script


class AIInterviewView(APIView):
    """AI Interview Prep endpoint"""
    permission_classes = [AllowAny]
    
    @method_decorator(ratelimit(key='ip', rate='10/m', method='POST'))
    def post(self, request):
        """Generate interview questions and feedback"""
        serializer = AIInterviewSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid data', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            job_description = serializer.validated_data['job_description']
            audio_answer = serializer.validated_data.get('audio_answer')
            
            result = generate_interview_questions(job_description, audio_answer)
            
            return Response(result, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'AI processing failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AITourView(APIView):
    """AI Portfolio Tour endpoint"""
    permission_classes = [AllowAny]
    
    @method_decorator(ratelimit(key='ip', rate='20/m', method='POST'))
    def post(self, request):
        """Generate tour script for portfolio section"""
        serializer = AITourSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid data', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            section = serializer.validated_data['section']
            result = generate_tour_script(section)
            
            return Response(result, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'AI processing failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
