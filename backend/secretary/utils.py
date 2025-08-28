from datetime import datetime, timedelta
from django.core.mail import send_mail
from .models import Event
from django.conf import settings

def send_daily_itinerary():
    today = datetime.now().date()
    events = Event.objects.filter(start_time__date=today).order_by("start_time")
    
    if not events.exists():
        body = "No events scheduled for today."
    else:
        body = "Today's Itinerary:\n\n"
        for i, event in enumerate(events, start=1):
            body += f"{i}. {event.title}\n   Time: {event.start_time.strftime('%H:%M')} - {event.end_time.strftime('%H:%M')}\n"
            if event.description:
                body += f"   Details: {event.description}\n"
            body += "\n"

    send_mail(
        subject=f"Daily Itinerary for {today.strftime('%Y-%m-%d')}",
        message=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.DEFAULT_FROM_EMAIL],
    )
