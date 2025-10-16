from __future__ import annotations

from typing import Optional, Dict, Any
from django.db.models import Q
from blog.models import BlogPost, BlogCategory, BlogHome


def build_blog_list_json_ld(lang: str = 'ua', category_slug: Optional[str] = None, page: int = 1) -> Optional[str]:
    """
    JSON-LD для страницы списка блога (с категориями и статьями).
    Тип: CollectionPage + ItemList.
    """
    if lang not in ['ua', 'ru', 'en']:
        lang = 'ua'

    base_url = 'https://notarius-korneenkova.com.ua'
    lang_prefix = '' if lang == 'ua' else f"/{lang}"
    page_path = '/notarialni-blog'
    page_url = f"{base_url}{lang_prefix}{page_path}"

    # Получаем данные главной страницы блога
    blog_home = BlogHome.objects.order_by('-id').first()
    title = ''
    description = ''
    
    if blog_home:
        title_field = {'ua': 'title_ua', 'ru': 'title_ru', 'en': 'title_en'}[lang]
        desc_field = {'ua': 'description_ua', 'ru': 'description_ru', 'en': 'description_en'}[lang]
        title = getattr(blog_home, title_field, '') or ''
        description_html = getattr(blog_home, desc_field, '') or ''
        
        # Очистка описания от HTML
        if description_html:
            try:
                import re
                import html as _html
                text = _html.unescape(str(description_html))
                text = text.replace('\xa0', ' ')
                text = re.sub(r'<[^>]+>', ' ', text)
                text = re.sub(r'\s+', ' ', text).strip()
                description = text[:300] + '...' if len(text) > 300 else text
            except Exception:
                description = ''

    # Получаем статьи для ItemList с учетом пагинации (6 статей на страницу)
    page_size = 6
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    
    posts = BlogPost.objects.published().select_related().prefetch_related('categories').order_by('-published_at', '-created_at')[start_index:end_index]
    
    # Фильтрация по категории, если указана
    if category_slug:
        try:
            category = BlogCategory.objects.filter(
                Q(slug_ua=category_slug) | Q(slug_ru=category_slug) | Q(slug_en=category_slug)
            ).first()
            if category:
                posts = posts.filter(categories=category)
        except Exception:
            pass

    # Формируем ItemList
    item_list = []
    for post in posts:
        try:
            # Локализованные поля
            title_field = {'ua': 'title_ua', 'ru': 'title_ru', 'en': 'title_en'}[lang]
            slug_field = {'ua': 'slug_ua', 'ru': 'slug_ru', 'en': 'slug_en'}[lang]
            content_field = {'ua': 'content_ua', 'ru': 'content_ru', 'en': 'content_en'}[lang]
            
            post_title = getattr(post, title_field, '') or ''
            post_slug = getattr(post, slug_field, '') or ''
            post_content = getattr(post, content_field, '') or ''
            
            # Очистка контента для excerpt
            excerpt = ''
            if post_content:
                try:
                    import re
                    import html as _html
                    text = _html.unescape(str(post_content))
                    text = text.replace('\xa0', ' ')
                    text = re.sub(r'<[^>]+>', ' ', text)
                    text = re.sub(r'\s+', ' ', text).strip()
                    excerpt = text[:200] + '...' if len(text) > 200 else text
                except Exception:
                    excerpt = ''
            
            # URL статьи
            post_url = post.get_canonical_url(lang)
            
            # Изображение
            image_url = None
            if post.cover and hasattr(post.cover, 'url'):
                image_url = post.cover.url
                if not image_url.startswith('http'):
                    image_url = f"{base_url}{image_url}"
            elif post.hero_image and hasattr(post.hero_image, 'url'):
                image_url = post.hero_image.url
                if not image_url.startswith('http'):
                    image_url = f"{base_url}{image_url}"
            
            # Дата публикации
            date_published = post.published_at.isoformat() if post.published_at else post.created_at.isoformat()
            
            item_list.append({
                "@type": "BlogPosting",
                "@id": f"{post_url}#article",
                "headline": post_title,
                "url": post_url,
                **({"description": excerpt} if excerpt else {}),
                **({"image": image_url} if image_url else {}),
                "datePublished": date_published,
                "dateModified": post.updated_at.isoformat(),
                "author": {"@id": f"{base_url}/#person"},
                "publisher": {"@id": f"{base_url}/#organization"},
                "inLanguage": lang,
            })
        except Exception:
            continue

    # Формируем CollectionPage
    data: Dict[str, Any] = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": f"{page_url}#collection",
        "name": title or "Блог нотариуса",
        **({"description": description} if description else {}),
        "url": page_url,
        "inLanguage": lang,
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": len(item_list),
            "itemListElement": item_list,
        },
    }

    try:
        import json
        return json.dumps(data, ensure_ascii=False)
    except Exception:
        return None


def build_blog_detail_json_ld(post: BlogPost, lang: str = 'ua') -> Optional[str]:
    """
    JSON-LD для детальной страницы статьи блога.
    Тип: BlogPosting.
    """
    if lang not in ['ua', 'ru', 'en']:
        lang = 'ua'

    base_url = 'https://notarius-korneenkova.com.ua'
    
    # Локализованные поля
    title_field = {'ua': 'title_ua', 'ru': 'title_ru', 'en': 'title_en'}[lang]
    content_field = {'ua': 'content_ua', 'ru': 'content_ru', 'en': 'content_en'}[lang]
    
    title = getattr(post, title_field, '') or ''
    content_html = getattr(post, content_field, '') or ''
    
    # Очистка контента от HTML
    description = ''
    if content_html:
        try:
            import re
            import html as _html
            text = _html.unescape(str(content_html))
            text = text.replace('\xa0', ' ')
            text = re.sub(r'<[^>]+>', ' ', text)
            text = re.sub(r'\s+', ' ', text).strip()
            description = text[:300] + '...' if len(text) > 300 else text
        except Exception:
            description = ''
    
    # URL статьи
    url = post.get_canonical_url(lang)
    
    # Изображение
    image_url = None
    if post.cover and hasattr(post.cover, 'url'):
        image_url = post.cover.url
        if not image_url.startswith('http'):
            image_url = f"{base_url}{image_url}"
    elif post.hero_image and hasattr(post.hero_image, 'url'):
        image_url = post.hero_image.url
        if not image_url.startswith('http'):
            image_url = f"{base_url}{image_url}"
    
    # Дата публикации
    date_published = post.published_at.isoformat() if post.published_at else post.created_at.isoformat()
    
    # Категории
    categories = []
    for category in post.categories.all():
        cat_field = {'ua': 'name_ua', 'ru': 'name_ru', 'en': 'name_en'}[lang]
        cat_name = getattr(category, cat_field, '') or ''
        if cat_name:
            categories.append(cat_name)
    
    data: Dict[str, Any] = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": f"{url}#article",
        "headline": title,
        "url": url,
        **({"description": description} if description else {}),
        **({"image": image_url} if image_url else {}),
        "datePublished": date_published,
        "dateModified": post.updated_at.isoformat(),
        "author": {"@id": f"{base_url}/#person"},
        "publisher": {"@id": f"{base_url}/#organization"},
        **({"keywords": ", ".join(categories)} if categories else {}),
        "inLanguage": lang,
    }

    try:
        import json
        return json.dumps(data, ensure_ascii=False)
    except Exception:
        return None
