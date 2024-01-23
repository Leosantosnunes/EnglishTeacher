from django.urls import path
from . import views

urlpatterns = [
    path('initialization', views.initialization, name='initialization'),
    path('chat', views.chat, name='chat'),
    path('getChat', views.get_chat, name='getChat'),
    path('getByDate/', views.getByDate, name='getByDate')
]
