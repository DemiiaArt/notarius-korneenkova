from rest_framework import serializers
from .models import BlogPost, BlogCategory, BlogHome
from django.utils.html import strip_tags


class BlogCategorySerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    slug = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug', 'show_in_filters']
    
    def get_name(self, obj):
        # Получаем язык из контекста
        lang = self.context.get('lang', 'ua')
        
        # Возвращаем название на нужном языке
        if lang in ['ua', 'ru', 'en']:
            return getattr(obj, f'name_{lang}', '')
        else:
            # Если язык не указан или неверный, возвращаем украинский
            return obj.name_ua
    
    def get_slug(self, obj):
        # Получаем язык из контекста
        lang = self.context.get('lang', 'ua')
        
        # Возвращаем slug на нужном языке
        if lang in ['ua', 'ru', 'en']:
            return getattr(obj, f'slug_{lang}', '')
        else:
            # Если язык не указан или неверный, возвращаем украинский
            return obj.slug_ua


class BlogPostListSerializer(serializers.ModelSerializer):
    categories = BlogCategorySerializer(many=True, read_only=True)
    title = serializers.SerializerMethodField()
    slug = serializers.SerializerMethodField()
    excerpt = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id',
            'title',
            'slug',
            'excerpt',
            'cover', 'published_at', 'status', 'categories'
        ]

    def _short(self, html: str):
        text = strip_tags(html or '')
        return (text[:100] + ('…' if len(text) > 100 else ''))

    def get_title(self, obj):
        # Получаем язык из контекста
        lang = self.context.get('lang', 'ua')
        
        # Возвращаем заголовок на нужном языке
        if lang in ['ua', 'ru', 'en']:
            return getattr(obj, f'title_{lang}', '')
        else:
            # Если язык не указан или неверный, возвращаем украинский
            return obj.title_ua
    
    def get_slug(self, obj):
        # Получаем язык из контекста
        lang = self.context.get('lang', 'ua')
        
        # Возвращаем slug на нужном языке
        if lang in ['ua', 'ru', 'en']:
            return getattr(obj, f'slug_{lang}', '')
        else:
            # Если язык не указан или неверный, возвращаем украинский
            return obj.slug_ua

    def get_excerpt(self, obj):
        # Получаем язык из контекста
        lang = self.context.get('lang', 'ua')
        
        # Возвращаем excerpt на нужном языке
        if lang in ['ua', 'ru', 'en']:
            content = getattr(obj, f'content_{lang}', '')
            return self._short(content)
        else:
            # Если язык не указан или неверный, возвращаем украинский
            return self._short(obj.content_ua)


class BlogPostDetailSerializer(serializers.ModelSerializer):
    categories = BlogCategorySerializer(many=True, read_only=True)
    similar_posts = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    slug = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()
    canonical_url = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id',
            'title',
            'slug',
            'content',
            'hero_image',
            'cover', 'published_at', 'status', 'canonical_url', 'categories', 'similar_posts'
        ]

    def get_title(self, obj):
        # Получаем язык из контекста
        lang = self.context.get('lang', 'ua')
        
        # Возвращаем заголовок на нужном языке
        if lang in ['ua', 'ru', 'en']:
            return getattr(obj, f'title_{lang}', '')
        else:
            # Если язык не указан или неверный, возвращаем украинский
            return obj.title_ua
    
    def get_slug(self, obj):
        # Получаем язык из контекста
        lang = self.context.get('lang', 'ua')
        
        # Возвращаем slug на нужном языке
        if lang in ['ua', 'ru', 'en']:
            return getattr(obj, f'slug_{lang}', '')
        else:
            # Если язык не указан или неверный, возвращаем украинский
            return obj.slug_ua

    def get_content(self, obj):
        # Получаем язык из контекста
        lang = self.context.get('lang', 'ua')
        
        # Возвращаем контент на нужном языке
        if lang in ['ua', 'ru', 'en']:
            return getattr(obj, f'content_{lang}', '')
        else:
            # Если язык не указан или неверный, возвращаем украинский
            return obj.content_ua

    def get_similar_posts(self, obj):
        """
        Получает похожие статьи для текущей статьи
        """
        similar_posts = obj.get_similar_posts(limit=30)
        return SimilarArticleSerializer(similar_posts, many=True, context=self.context).data

    def get_canonical_url(self, obj):
        """
        Возвращает канонический URL для текущего языка
        """
        # Получаем язык из контекста
        lang = self.context.get('lang', 'ua')
        
        # Используем метод модели для получения canonical URL
        return obj.get_canonical_url(lang)


class SimilarArticleSerializer(serializers.ModelSerializer):
    """
    Упрощенный сериализатор для похожих статей
    """
    title = serializers.SerializerMethodField()
    slug = serializers.SerializerMethodField()
    excerpt = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id',
            'title',
            'slug',
            'excerpt',
            'cover', 'published_at'
        ]

    def _short(self, html: str):
        text = strip_tags(html or '')
        return (text[:100] + ('…' if len(text) > 100 else ''))

    def get_title(self, obj):
        # Получаем язык из контекста
        lang = self.context.get('lang', 'ua')
        
        # Возвращаем заголовок на нужном языке
        if lang in ['ua', 'ru', 'en']:
            return getattr(obj, f'title_{lang}', '')
        else:
            # Если язык не указан или неверный, возвращаем украинский
            return obj.title_ua
    
    def get_slug(self, obj):
        # Получаем язык из контекста
        lang = self.context.get('lang', 'ua')
        
        # Возвращаем slug на нужном языке
        if lang in ['ua', 'ru', 'en']:
            return getattr(obj, f'slug_{lang}', '')
        else:
            # Если язык не указан или неверный, возвращаем украинский
            return obj.slug_ua

    def get_excerpt(self, obj):
        # Получаем язык из контекста
        lang = self.context.get('lang', 'ua')
        
        # Возвращаем excerpt на нужном языке
        if lang in ['ua', 'ru', 'en']:
            content = getattr(obj, f'content_{lang}', '')
            return self._short(content)
        else:
            # Если язык не указан или неверный, возвращаем украинский
            return self._short(obj.content_ua)


class BlogListResponseSerializer(serializers.Serializer):
    """
    Сериализатор для ответа списка блога с категориями
    """
    posts = BlogPostListSerializer(many=True)
    categories = BlogCategorySerializer(many=True)



class BlogHomeSerializer(serializers.ModelSerializer):
    """
    Сериализатор главной страницы блога с мультиязычными полями.
    Возвращает { title, slug, description, hero_image } согласно выбранному языку.
    """
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = BlogHome
        fields = ['title', 'description', 'hero_image']

    def _get_lang(self):
        lang = self.context.get('lang', 'ua')
        return lang if lang in ['ua', 'ru', 'en'] else 'ua'

    def get_title(self, obj):
        lang = self._get_lang()
        return getattr(obj, f'title_{lang}', '')

    def get_description(self, obj):
        lang = self._get_lang()
        return getattr(obj, f'description_{lang}', '')

