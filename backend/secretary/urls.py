from django.urls import path
from .views import SecretaryChatView, GuestMessageView, GuestMessageListView

urlpatterns = [
    path("chat/", SecretaryChatView.as_view(), name="secretary-chat"),
    path("guest-message/", GuestMessageView.as_view(), name="guest_message"),
    path("guest-messages/", GuestMessageListView.as_view(), name="guest_messages_list"),
]
