from django.urls import path
from . import views

urlpatterns = [
    # Контактные данные для шапки сайта (телефоны, email, адреса на 3 языках)
    path('header/', views.HeaderView.as_view(), name='header-data'),
    
    # Фоновые видео для страниц
    path('background-videos/', views.BackgroundVideoView.as_view(), name='background-videos'),
    
    # Информация о нотариусе (текст, фото на 3 языках)
    path('about-me/', views.AboutMeView.as_view(), name='about-me'),

    # Контакты (совместимо с фронтом)
    path('contacts/', views.ContactsView.as_view(), name='contacts'),
    path('contacts/update/', views.ContactsView.as_view(), name='contacts-update'),
    
    # Иерархическая структура всех услуг (MPTT дерево)
    path('services/', views.ServicesCategoryView.as_view(), name='services'),

    # ===== УСЛУГИ =====
    
    # Услуги сгруппированные по целевой аудитории (военные, бизнес, частные лица)
    path('services-for/', views.ServicesForListView.as_view(), name='services-for-list'),

    # ===== ФОРМЫ И ЗАЯВКИ =====
    
    # Общие заявки с сайта (имя + телефон) - используется в Form.jsx
    path('applications/', views.ApplicationCreateView.as_view(), name='application-create'),
    path('applications/list/', views.ApplicationListView.as_view(), name='application-list'),  # Админка
    path('applications/<int:pk>/', views.ApplicationDetailView.as_view(), name='application-detail'),  # Админка

    # Заявки на бесплатные консультации (имя + телефон + город + вопрос) - используется в FreeConsult.jsx
    path('free-consultations/', views.FreeConsultationCreateView.as_view(), name='free-consultation-create'),
    path('free-consultations/list/', views.FreeConsultationListView.as_view(), name='free-consultation-list'),  # Админка
    path('free-consultations/<int:pk>/', views.FreeConsultationDetailView.as_view(), name='free-consultation-detail'),  # Админка

    # Форма "Связаться с нами" (имя + телефон + вопрос) - используется в OrderConsult.jsx
    path('contact-us/', views.ContactUsCreateView.as_view(), name='contact-us-create'),
    path('contact-us/list/', views.ContactUsListView.as_view(), name='contact-us-list'),  # Админка
    path('contact-us/<int:pk>/', views.ContactUsDetailView.as_view(), name='contact-us-detail'),  # Админка

    # ===== ВИДЕО ИНТЕРВЬЮ =====
    
    # Список видео интервью
    path('video-interviews/', views.VideoInterviewListView.as_view(), name='video-interview-list'),
    path('video-interviews/<int:pk>/', views.VideoInterviewDetailView.as_view(), name='video-interview-detail'),

    # ===== ОТЗЫВЫ И РЕЙТИНГ =====
    
    # Комбинированный endpoint: отзывы + статистика рейтинга (GET/POST) - используется в ReviewForm.jsx и Comments.jsx
    path('reviews/', views.ReviewListWithStatsView.as_view(), name='review-list-with-stats'),
    
    # Только список опубликованных отзывов
    path('reviews/list/', views.ReviewListView.as_view(), name='review-list'),
    
    # Создание нового отзыва (альтернативный endpoint)
    path('reviews/create/', views.ReviewCreateView.as_view(), name='review-create'),
    
    # Только статистика рейтинга (средний рейтинг, количество отзывов, распределение по звездам)
    path('reviews/stats/', views.ReviewStatsView.as_view(), name='review-stats'),
    
    # Все отзывы для модерации в админке
    path('reviews/admin/', views.ReviewAdminListView.as_view(), name='review-admin-list'),
    
    # Детали отзыва, обновление, удаление (админка)
    path('reviews/<int:pk>/', views.ReviewDetailView.as_view(), name='review-detail'),

    # ===== ДЕТАЛЬНЫЕ СТРАНИЦЫ УСЛУГ =====
    # ВАЖНО: Slug паттерны должны быть В КОНЦЕ, так как они catch-all
    
    # Детальная страница услуги 1-го уровня
    path('services/<slug:slug1>/', views.ServiceCategoryDetailView.as_view(), name='category_level1'),
    
    # Детальная страница услуги 2-го уровня
    path('services/<slug:slug1>/<slug:slug2>/', views.ServiceCategoryDetailView.as_view(), name='category_level2'),
    
    # Детальная страница услуги 3-го уровня
    path('services/<slug:slug1>/<slug:slug2>/<slug:slug3>/', views.ServiceCategoryDetailView.as_view(), name='category_level3'),

    # Эндпоинты часто задаваемых вопросов
    path('faqs/', views.FrequentlyAskedQuestionListView.as_view(), name='faq-list'),
]