from django.urls import path
from . import views

urlpatterns = [
    path('header/', views.HeaderView.as_view(), name='header-data'),
    path('background-videos/', views.BackgroundVideoView.as_view(), name='background-videos'),
    path('about-me/', views.AboutMeView.as_view(), name='about-me'),
    path('upload/', views.CKEditorUploadView.as_view(), name='ckeditor-upload'),
    path('services/', views.ServicesListView.as_view(), name='services-list'),
    path('services/<int:pk>/', views.ServicesDetailView.as_view(), name='services-detail'),
    
    # Новые эндпоинты
    path('services-for/', views.ServicesForListView.as_view(), name='services-for-list'),
    path('applications/', views.ApplicationCreateView.as_view(), name='application-create'),
    path('applications/list/', views.ApplicationListView.as_view(), name='application-list'),
    path('applications/<int:pk>/', views.ApplicationDetailView.as_view(), name='application-detail'),
    path('video-interviews/', views.VideoInterviewListView.as_view(), name='video-interview-list'),
    path('video-interviews/<int:pk>/', views.VideoInterviewDetailView.as_view(), name='video-interview-detail'),
]