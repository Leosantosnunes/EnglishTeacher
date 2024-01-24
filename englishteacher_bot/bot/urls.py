from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

urlpatterns = [
    path('initialization', views.initialization, name='initialization'),
    path('chat', views.chat, name='chat'),
    path('getChat', views.get_chat, name='getChat'),
    path('getByDate/', views.getByDate, name='getByDate'),
    path('voice', views.voice,name='voice')
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
