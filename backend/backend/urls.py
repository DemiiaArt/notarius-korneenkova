"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from main_page.views import CKEditorUploadView
from main_page.admin import admin_site

def health_check(request):
    """Проверка здоровья приложения с проверкой базы данных"""
    try:
        from django.db import connection
        from django.core.exceptions import ImproperlyConfigured
        
        # Проверяем подключение к базе данных
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
        
        return JsonResponse({
            "status": "ok", 
            "message": "Django app is running",
            "database": "connected"
        })
    except Exception as e:
        return JsonResponse({
            "status": "error", 
            "message": f"Django app error: {str(e)}",
            "database": "disconnected"
        }, status=503)

urlpatterns = [
    path('admin/', admin_site.urls),  # Используем кастомный админ-сайт
    path('api/blog/', include('blog.urls')),
    path('api/', include('main_page.urls')),
    path('ckeditor5/', include('django_ckeditor_5.urls')),
    path('ckeditor/upload/', CKEditorUploadView.as_view(), name='ckeditor_upload'),
    path('health/', health_check, name='health_check'),
    path('', health_check, name='root_health_check'),
]
# END1
# Обслуживание MEDIA файлов в режиме разработки
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)