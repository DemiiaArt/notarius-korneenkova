from django.urls import path
from . import views

urlpatterns = [
    path('header/', views.HeaderView.as_view(), name='header-data'),
    path('background-videos/', views.BackgroundVideoView.as_view(), name='background-videos'),
    path('about-me/', views.AboutMeView.as_view(), name='about-me'),
    path('upload/', views.CKEditorUploadView.as_view(), name='ckeditor-upload'),
    path('services/', views.ServicesCategoryView.as_view(), name='services'),
    path('<slug:slug1>/', views.ServiceCategoryDetailView.as_view(), name='category_level1'),
    path('<slug:slug1>/<slug:slug2>/', views.ServiceCategoryDetailView.as_view(), name='category_level2'),
    path('<slug:slug1>/<slug:slug2>/<slug:slug3>/', views.ServiceCategoryDetailView.as_view(), name='category_level3'),
]