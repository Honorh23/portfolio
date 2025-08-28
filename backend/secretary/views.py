from rest_framework.generics import GenericAPIView, CreateAPIView, ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializers import SecretaryChatSerializer, EventSerializer
from .models import SecretaryChatLog
from .resume import resume_data
from langchain_community.chat_models import ChatOpenAI
from langchain.prompts.chat import ChatPromptTemplate
import os
import json
from .models import GuestMessage, Event
from .serializers import GuestMessageSerializer

class SecretaryChatView(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = SecretaryChatSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_message = serializer.validated_data['message']

        llm = ChatOpenAI(
            model="gpt-5-mini",
            openai_api_key=os.getenv("OPENROUTER_API_KEY"),
            openai_api_base="https://openrouter.ai/api/v1",
            temperature=0.4,
            max_tokens=800,
        )

        # Convert resume dict to a string and escape curly braces
        resume_text = json.dumps(resume_data, indent=2).replace("{", "{{").replace("}", "}}")

        prompt = ChatPromptTemplate.from_messages([
            ("system",
             "You are a professional AI secretary for Iradukunda Shami Honore. "
             "You must ONLY answer based on the following resume data. "
             "Do not invent or hallucinate. If something is not in the resume, say you don’t know.\n\n"
             f"Resume Data:\n{resume_text}\n\n"
             "Formatting instructions:\n"
             "- Use bullet points or numbered lists where appropriate\n"
             "- Add line breaks between sections\n"
             "- Keep answers concise and professional"),
            ("human", "{question}")
        ])

        chain = prompt | llm
        response = chain.invoke({"question": user_message})

        # Log the chat
        SecretaryChatLog.objects.create(
            user_message=user_message,
            ai_reply=response.content
        )

        return Response({"reply": response.content})


class GuestMessageView(CreateAPIView):
    queryset = GuestMessage.objects.all()
    serializer_class = GuestMessageSerializer
    permission_classes = [AllowAny]

class GuestMessageListView(ListAPIView):
    queryset = GuestMessage.objects.all().order_by("-created_at")
    serializer_class = GuestMessageSerializer



class EventCreateView(CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class EventListView(ListAPIView):
    queryset = Event.objects.all().order_by("start_time")
    serializer_class = EventSerializer