from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from .models import BlogPost, BlogCategory, BlogHome
from .serializers import (
    BlogPostListSerializer,
    BlogPostDetailSerializer,
    BlogListResponseSerializer,
    BlogCategorySerializer,
    BlogHomeSerializer,
)


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
        
        # Получаем статьи с пагинацией
        posts_queryset = BlogPost.objects.published().order_by('-published_at', '-created_at')
        
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
        
        # Получаем все категории, которые показываются в фильтрах
        categories = BlogCategory.objects.filter(show_in_filters=True).order_by('order', 'name_ua')
        
        # Сериализуем данные с передачей языка в контекст
        posts_serializer = BlogPostListSerializer(paginated_posts, many=True, context={'lang': lang})
        categories_serializer = BlogCategorySerializer(categories, many=True, context={'lang': lang})
        
        # Формируем ответ
        response_data = {
            'posts': posts_serializer.data,
            'categories': categories_serializer.data
        }
        
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
        
        # Ищем статью по slug на любом языке
        try:
            post = BlogPost.objects.published().filter(
                Q(slug_ua=slug) | Q(slug_ru=slug) | Q(slug_en=slug)
            ).first()
            
            if not post:
                return Response({"detail": "Not found."}, status=404)
                
        except Exception:
            return Response({"detail": "Not found."}, status=404)
        
        # Сериализуем данные с передачей языка в контекст
        serializer = BlogPostDetailSerializer(post, context={'lang': lang})
        return Response(serializer.data)


class BlogHomeView(APIView):
    """
    Возвращает данные главной страницы блога (title, slug, description, hero_image).
    Поддерживает параметр lang=ua|ru|en.
    """

    def get(self, request):
        lang = request.GET.get('lang', 'ua')
        if lang not in ['ua', 'ru', 'en']:
            lang = 'ua'

        obj = BlogHome.objects.order_by('-id').first()
        if not obj:
            return Response({
                'title': '',
                'description': '',
                'hero_image': None,
            })

        serializer = BlogHomeSerializer(obj, context={'lang': lang})
        return Response(serializer.data)
