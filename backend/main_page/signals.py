"""
Signals для автоматической генерации sitemap.xml при изменении контента
"""
import os
import threading
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.conf import settings
from django.core.cache import cache
from .models import ServiceCategory
from blog.models import BlogPost

# Глобальная переменная для таймера дебаунса
_generation_timer = None

@receiver(post_save, sender=ServiceCategory)
@receiver(post_delete, sender=ServiceCategory)
@receiver(post_save, sender=BlogPost)
@receiver(post_delete, sender=BlogPost)
def regenerate_sitemap_debounced(sender, instance, **kwargs):
    """
    Генерируем sitemap с задержкой 60 секунд после последнего изменения
    И очищаем кэш API эндпоинтов
    """
    global _generation_timer
    
    # Очищаем кэш API эндпоинтов
    clear_api_cache()
    
    # Отменяем предыдущий таймер, если он есть
    if _generation_timer:
        _generation_timer.cancel()
    
    # Запускаем новый таймер на 60 секунд
    _generation_timer = threading.Timer(60.0, generate_sitemap_xml)
    _generation_timer.start()

def clear_api_cache():
    """
    Очищает кэш API эндпоинтов при изменении контента
    """
    try:
        # Очищаем кэш для /api/services/ (cache_page)
        cache.clear()
        
        # Очищаем специфичные кэши блога
        for lang in ['ua', 'ru', 'en']:
            cache.delete(f'blog_categories_{lang}')
            cache.delete(f'blog_home_{lang}')
            
        print("API cache cleared successfully")
        
    except Exception as e:
        print(f"Error clearing cache: {e}")

def generate_sitemap_xml():
    """
    Генерирует sitemap.xml с hreflang для всех страниц сайта
    """
    try:
        from .sitemap_generator import SitemapGenerator
        
        generator = SitemapGenerator()
        xml_content = generator.generate()
        
        # Путь к папке с index.html из настроек Django
        frontend_path = settings.FRONTEND_PATH
        sitemap_path = os.path.join(frontend_path, 'sitemap.xml')
        
        # Создаем директорию если её нет
        os.makedirs(os.path.dirname(sitemap_path), exist_ok=True)
        
        # Сохраняем файл
        with open(sitemap_path, 'w', encoding='utf-8') as f:
            f.write(xml_content)
            
        print(f"Sitemap успешно сгенерирован: {sitemap_path}")
        
    except Exception as e:
        print(f"Ошибка генерации sitemap: {e}")