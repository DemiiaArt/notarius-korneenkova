"""
Management команда для ручной генерации sitemap.xml
"""
from django.core.management.base import BaseCommand
from main_page.sitemap_generator import SitemapGenerator
import os
from django.conf import settings

class Command(BaseCommand):
    help = 'Генерирует sitemap.xml'

    def handle(self, *args, **options):
        try:
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
                
            self.stdout.write(
                self.style.SUCCESS(f'Sitemap успешно сгенерирован: {sitemap_path}')
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Ошибка генерации sitemap: {e}')
            )
