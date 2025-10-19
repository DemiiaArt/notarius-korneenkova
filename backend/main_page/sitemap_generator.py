"""
Генератор sitemap.xml с поддержкой hreflang для многоязычного сайта
"""
from datetime import datetime
from .models import ServiceCategory
from blog.models import BlogPost

class SitemapGenerator:
    """
    Генератор sitemap.xml с hreflang атрибутами
    """
    
    def __init__(self):
        self.base_url = "https://notarius-korneenkova.com.ua"
        self.today = datetime.now().strftime('%Y-%m-%d')
        
        # Статические страницы из nav-tree.js
        self.static_pages = [
            {
                "id": "home",
                "urls": {"ua": "/", "ru": "/ru", "en": "/en"},
                "priority": "1.0",
                "changefreq": "daily"
            },
            {
                "id": "about", 
                "urls": {
                    "ua": "/notarialni-pro-mene",
                    "ru": "/ru/notarialni-pro-mene", 
                    "en": "/en/notary-about"
                },
                "priority": "0.9",
                "changefreq": "weekly"
            },
            {
                "id": "contacts",
                "urls": {
                    "ua": "/notarialni-contacty",
                    "ru": "/ru/notarialni-contacty",
                    "en": "/en/notary-contacts"
                },
                "priority": "0.9",
                "changefreq": "monthly"
            },
            {
                "id": "blog",
                "urls": {
                    "ua": "/notarialni-blog",
                    "ru": "/ru/notarialni-blog", 
                    "en": "/en/notary-blog"
                },
                "priority": "0.9",
                "changefreq": "daily"
            },
            {
                "id": "offer",
                "urls": {
                    "ua": "/notarialni-offer",
                    "ru": "/ru/notarialni-offer",
                    "en": "/en/notary-offer"
                },
                "priority": "0.5",
                "changefreq": "yearly"
            },
            {
                "id": "policy",
                "urls": {
                    "ua": "/notarialni-policy",
                    "ru": "/ru/notarialni-policy",
                    "en": "/en/notary-policy"
                },
                "priority": "0.5",
                "changefreq": "yearly"
            },
            {
                "id": "trademark",
                "urls": {
                    "ua": "/notarialni-torgivelna-marka",
                    "ru": "/ru/notarialni-torgova-marka",
                    "en": "/en/notary-trade-mark"
                },
                "priority": "0.5",
                "changefreq": "yearly"
            }
        ]
    
    def generate(self):
        """
        Генерирует полный sitemap.xml
        """
        xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
        xml += 'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
        
        # Добавляем статические страницы
        for page in self.static_pages:
            xml += self._generate_url_entry(page)
        
        # Добавляем услуги (динамически из ServiceCategory)
        services = ServiceCategory.objects.filter(show_in_menu=True)
        for service in services:
            page = self._build_service_page(service)
            if page:
                xml += self._generate_url_entry(page)
        
        # Добавляем статьи блога (динамически из BlogPost)
        posts = BlogPost.objects.filter(status=True)
        for post in posts:
            page = self._build_blog_post_page(post)
            if page:
                xml += self._generate_url_entry(page)
        
        xml += '</urlset>'
        return xml
    
    def _build_service_page(self, service):
        """
        Строит страницу услуги на основе ServiceCategory
        """
        urls = {}
        
        # Получаем URL для каждого языка
        if service.slug_ua:
            canonical_url = service.get_canonical_url('ua')
            # Извлекаем только путь из полного URL, убираем любой домен
            if canonical_url.startswith('http'):
                # Убираем любой домен (localhost или production)
                from urllib.parse import urlparse
                parsed = urlparse(canonical_url)
                urls['ua'] = parsed.path
            else:
                urls['ua'] = canonical_url
                
        if service.slug_ru:
            canonical_url = service.get_canonical_url('ru')
            if canonical_url.startswith('http'):
                from urllib.parse import urlparse
                parsed = urlparse(canonical_url)
                urls['ru'] = parsed.path
            else:
                urls['ru'] = canonical_url
                
        if service.slug_en:
            canonical_url = service.get_canonical_url('en')
            if canonical_url.startswith('http'):
                from urllib.parse import urlparse
                parsed = urlparse(canonical_url)
                urls['en'] = parsed.path
            else:
                urls['en'] = canonical_url
        
        if not urls:
            return None
            
        return {
            "urls": urls,
            "priority": "0.8",
            "changefreq": "weekly",
            "lastmod": service.updated_at.strftime('%Y-%m-%d')
        }
    
    def _build_blog_post_page(self, post):
        """
        Строит страницу статьи блога на основе BlogPost
        """
        urls = {}
        
        # Получаем URL для каждого языка
        if post.slug_ua:
            canonical_url = post.get_canonical_url('ua')
            # Извлекаем только путь из полного URL, убираем любой домен
            if canonical_url.startswith('http'):
                from urllib.parse import urlparse
                parsed = urlparse(canonical_url)
                urls['ua'] = parsed.path
            else:
                urls['ua'] = canonical_url
                
        if post.slug_ru:
            canonical_url = post.get_canonical_url('ru')
            if canonical_url.startswith('http'):
                from urllib.parse import urlparse
                parsed = urlparse(canonical_url)
                urls['ru'] = parsed.path
            else:
                urls['ru'] = canonical_url
                
        if post.slug_en:
            canonical_url = post.get_canonical_url('en')
            if canonical_url.startswith('http'):
                from urllib.parse import urlparse
                parsed = urlparse(canonical_url)
                urls['en'] = parsed.path
            else:
                urls['en'] = canonical_url
        
        if not urls:
            return None
            
        # Используем published_at или updated_at
        lastmod_date = post.published_at or post.updated_at
        
        return {
            "urls": urls,
            "priority": "0.7",
            "changefreq": "weekly", 
            "lastmod": lastmod_date.strftime('%Y-%m-%d')
        }
    
    def _generate_url_entry(self, page):
        """
        Генерирует одну запись <url> с hreflang атрибутами
        """
        urls = page.get('urls', {})
        ua_url = urls.get('ua')
        ru_url = urls.get('ru')
        en_url = urls.get('en')
        
        # Основная ссылка (приоритет UA)
        main_url = ua_url or ru_url or en_url
        if not main_url:
            return ""
        
        xml = '  <url>\n'
        xml += f'    <loc>{self.base_url}{main_url}</loc>\n'
        xml += f'    <lastmod>{page.get("lastmod", self.today)}</lastmod>\n'
        xml += f'    <changefreq>{page.get("changefreq", "weekly")}</changefreq>\n'
        xml += f'    <priority>{page.get("priority", "0.5")}</priority>\n'
        
        # Добавляем hreflang атрибуты
        if ua_url:
            xml += f'    <xhtml:link rel="alternate" hreflang="uk" href="{self.base_url}{ua_url}" />\n'
        if ru_url:
            xml += f'    <xhtml:link rel="alternate" hreflang="ru" href="{self.base_url}{ru_url}" />\n'
        if en_url:
            xml += f'    <xhtml:link rel="alternate" hreflang="en" href="{self.base_url}{en_url}" />\n'
        if ua_url:
            xml += f'    <xhtml:link rel="alternate" hreflang="x-default" href="{self.base_url}{ua_url}" />\n'
        
        xml += '  </url>\n'
        return xml
