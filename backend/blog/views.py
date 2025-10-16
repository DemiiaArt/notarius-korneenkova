from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from django.core.cache import cache
from .models import BlogPost, BlogCategory, BlogHome
from .serializers import (
    BlogPostListSerializer,
    BlogPostDetailSerializer,
    BlogListResponseSerializer,
    BlogCategorySerializer,
    BlogHomeSerializer,
)
from .blog_seo import build_blog_list_json_ld, build_blog_detail_json_ld


class BlogPagination(PageNumberPagination):
    page_size = 6


class BlogListView(APIView):
    """
    Возвращает список статей блога с пагинацией и список всех категорий
    Поддерживает параметры:
    - lang: язык (ua/ru/en, по умолчанию ua)
    - category: фильтрация по slug категории
    """
    
    def get(self, request):
        # Получаем язык из query параметра, по умолчанию 'ua'
        lang = request.GET.get('lang', 'ua')
        
        # Валидация языка
        if lang not in ['ua', 'ru', 'en']:
            lang = 'ua'
        
        # Получаем параметр фильтрации по категории
        category_slug = request.GET.get('category', None)
        print(category_slug)
        
        # Получаем статьи с пагинацией и оптимизируем запросы
        posts_queryset = BlogPost.objects.published().select_related().prefetch_related('categories').order_by('-published_at', '-created_at')
        
        # Применяем фильтрацию по категории, если указана
        if category_slug:
            # Ищем категорию по slug на любом языке
            try:
                category = BlogCategory.objects.filter(
                    Q(slug_ua=category_slug) | Q(slug_ru=category_slug) | Q(slug_en=category_slug)
                ).first()
                
                if category:
                    # Фильтруем статьи по найденной категории
                    posts_queryset = posts_queryset.filter(categories=category)
                else:
                    # Если категория не найдена, возвращаем пустой результат
                    posts_queryset = posts_queryset.none()
                    
            except Exception:
                # В случае ошибки возвращаем пустой результат
                posts_queryset = posts_queryset.none()
        
        # Применяем пагинацию
        paginator = BlogPagination()
        paginated_posts = paginator.paginate_queryset(posts_queryset, request)
        
        # Получаем все категории с кэшированием
        cache_key = f'blog_categories_{lang}'
        categories = cache.get(cache_key)
        if not categories:
            categories = BlogCategory.objects.filter(show_in_filters=True).order_by('order', 'name_ua').only('name_ua', 'name_ru', 'name_en', 'slug_ua', 'slug_ru', 'slug_en', 'order')
            cache.set(cache_key, categories, 3600)  # Кэшируем на 1 час
        
        # Сериализуем данные с передачей языка в контекст
        posts_serializer = BlogPostListSerializer(paginated_posts, many=True, context={'lang': lang})
        categories_serializer = BlogCategorySerializer(categories, many=True, context={'lang': lang})
        
        # Формируем ответ
        response_data = {
            'posts': posts_serializer.data,
            'categories': categories_serializer.data
        }
        
        # Добавляем JSON-LD для списка блога с учетом пагинации
        try:
            # Получаем номер страницы из query параметра
            page_number = int(request.GET.get('page', 1))
            if page_number < 1:
                page_number = 1
            json_ld = build_blog_list_json_ld(lang, category_slug, page_number)
            if json_ld is not None:
                response_data['json_ld'] = json_ld
        except (ValueError, TypeError):
            # Если page не число, используем страницу 1
            json_ld = build_blog_list_json_ld(lang, category_slug, 1)
            if json_ld is not None:
                response_data['json_ld'] = json_ld
        except Exception:
            pass
        
        # Добавляем информацию о пагинации
        return paginator.get_paginated_response(response_data)


class BlogDetailView(APIView):
    """
    Детальный просмотр статьи блога
    Поддерживает параметр lang в query string (ua/ru/en, по умолчанию ua)
    """
    
    def get(self, request, slug):
        # Получаем язык из query параметра, по умолчанию 'ua'
        lang = request.GET.get('lang', 'ua')
        
        # Валидация языка
        if lang not in ['ua', 'ru', 'en']:
            lang = 'ua'
        
        # Ищем статью по slug на любом языке (оптимизированный запрос)
        try:
            post = BlogPost.objects.published().select_related().prefetch_related('categories').filter(
                Q(slug_ua=slug) | Q(slug_ru=slug) | Q(slug_en=slug)
            ).first()
            
            if not post:
                return Response({"detail": "Not found."}, status=404)
                
        except Exception:
            return Response({"detail": "Not found."}, status=404)
        
        # Сериализуем данные с передачей языка в контекст
        serializer = BlogPostDetailSerializer(post, context={'lang': lang})
        data = serializer.data
        
        # Добавляем JSON-LD для статьи блога
        try:
            json_ld = build_blog_detail_json_ld(post, lang)
            if json_ld is not None:
                data['json_ld'] = json_ld
        except Exception:
            pass
        
        return Response(data)


class BlogHomeView(APIView):
    """
    Возвращает данные главной страницы блога (title, slug, description, hero_image).
    Поддерживает параметр lang=ua|ru|en.
    """

    def get(self, request):
        lang = request.GET.get('lang', 'ua')
        if lang not in ['ua', 'ru', 'en']:
            lang = 'ua'

        # Кэшируем данные главной страницы блога
        cache_key = f'blog_home_{lang}'
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)

        obj = BlogHome.objects.order_by('-id').first()
        if not obj:
            response_data = {
                'title': '',
                'description': '',
                'hero_image': None,
            }
            cache.set(cache_key, response_data, 3600)  # Кэшируем на 1 час
            return Response(response_data)

        serializer = BlogHomeSerializer(obj, context={'lang': lang})
        response_data = serializer.data
        cache.set(cache_key, response_data, 3600)  # Кэшируем на 1 час
        return Response(response_data)
