from rest_framework import serializers
from .models import GuestMessage, Event

class SecretaryChatSerializer(serializers.Serializer):
    message = serializers.CharField(
        max_length=1000,
        help_text="The message or question you want to ask the AI secretary"
    )



class GuestMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuestMessage
        fields = ["id", "name", "email", "message", "created_at", "read"]

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "title", "description", "start_time", "end_time", "created_at"]