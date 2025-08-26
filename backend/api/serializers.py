"""
API serializers
"""
from rest_framework import serializers
from portfolio.models import Contact


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['name', 'email', 'message', 'website', 'turnstile_token']  # Include all fields as needed

    def validate_email(self, value):
        """Validate the email field to ensure it's in the correct format."""
        if not value:
            raise serializers.ValidationError("Email field cannot be empty.")
        return value

    def validate_message(self, value):
        """Validate the message field for length."""
        if len(value) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters long.")
        return value

    


class AIInterviewSerializer(serializers.Serializer):
    """AI Interview serializer"""
    job_description = serializers.CharField(max_length=5000)
    audio_answer = serializers.FileField(required=False, allow_null=True)


class AITourSerializer(serializers.Serializer):
    """AI Tour serializer"""
    section = serializers.CharField(max_length=100)
