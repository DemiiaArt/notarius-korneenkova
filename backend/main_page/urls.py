from django.urls import path
from . import views

urlpatterns = [
    path('header/', views.HeaderView.as_view(), name='header-data'),
    path('background-videos/', views.BackgroundVideoView.as_view(), name='background-videos'),
    path('about-me/', views.AboutMeView.as_view(), name='about-me'),
]