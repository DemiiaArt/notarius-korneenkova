from django.urls import path
from . import views

urlpatterns = [
    path('header/', views.HeaderView.as_view(), name='header-data'),
    path('background-videos/', views.BackgroundVideoView.as_view(), name='background-videos'),
    path('about-me/', views.AboutMeView.as_view(), name='about-me'),
    path('services/', views.ServicesCategoryView.as_view(), name='services'),
    
    # Эндпоинты услуг
    path('services-for/', views.ServicesForListView.as_view(), name='services-for-list'),
    
    # Эндпоинты заявок
    path('applications/', views.ApplicationCreateView.as_view(), name='application-create'),
    path('applications/list/', views.ApplicationListView.as_view(), name='application-list'),
    path('applications/<int:pk>/', views.ApplicationDetailView.as_view(), name='application-detail'),
    
    # Эндпоинты бесплатных консультаций
    path('free-consultations/', views.FreeConsultationCreateView.as_view(), name='free-consultation-create'),
    path('free-consultations/list/', views.FreeConsultationListView.as_view(), name='free-consultation-list'),
    path('free-consultations/<int:pk>/', views.FreeConsultationDetailView.as_view(), name='free-consultation-detail'),
    
    # Эндпоинты формы контактов
    path('contact-us/', views.ContactUsCreateView.as_view(), name='contact-us-create'),
    path('contact-us/list/', views.ContactUsListView.as_view(), name='contact-us-list'),
    path('contact-us/<int:pk>/', views.ContactUsDetailView.as_view(), name='contact-us-detail'),
    
    # Эндпоинты видео интервью
    path('video-interviews/', views.VideoInterviewListView.as_view(), name='video-interview-list'),
    path('video-interviews/<int:pk>/', views.VideoInterviewDetailView.as_view(), name='video-interview-detail'),
    
    # Эндпоинты отзывов
    path('reviews/', views.ReviewListView.as_view(), name='review-list'),
    path('reviews/create/', views.ReviewCreateView.as_view(), name='review-create'),
    path('reviews/stats/', views.ReviewStatsView.as_view(), name='review-stats'),
    path('reviews/admin/', views.ReviewAdminListView.as_view(), name='review-admin-list'),
    path('reviews/<int:pk>/', views.ReviewDetailView.as_view(), name='review-detail'),
    
    # ВАЖНО: Slug паттерны должны быть В КОНЦЕ, так как они catch-all
    path('<slug:slug1>/', views.ServiceCategoryDetailView.as_view(), name='category_level1'),
    path('<slug:slug1>/<slug:slug2>/', views.ServiceCategoryDetailView.as_view(), name='category_level2'),
    path('<slug:slug1>/<slug:slug2>/<slug:slug3>/', views.ServiceCategoryDetailView.as_view(), name='category_level3'),
]