from django.urls import path
from . import views

urlpatterns = [
    path('header/', views.HeaderView.as_view(), name='header-data'),
    path('background-videos/', views.BackgroundVideoView.as_view(), name='background-videos'),
    path('about-me/', views.AboutMeView.as_view(), name='about-me'),
    path('upload/', views.CKEditorUploadView.as_view(), name='ckeditor-upload'),
    path('services/', views.ServicesListView.as_view(), name='services-list'),
    path('services/<int:pk>/', views.ServicesDetailView.as_view(), name='services-detail'),
]