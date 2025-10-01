from rest_framework import serializers
from .models import BlogPost, BlogCategory
from django.utils.html import strip_tags


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['id', 'name_ua', 'name_ru', 'name_en', 'slug_ua', 'slug_ru', 'slug_en']


class BlogPostListSerializer(serializers.ModelSerializer):
    categories = BlogCategorySerializer(many=True, read_only=True)
    excerpt_ua = serializers.SerializerMethodField()
    excerpt_ru = serializers.SerializerMethodField()
    excerpt_en = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id',
            'title_ua', 'title_ru', 'title_en',
            'slug_ua', 'slug_ru', 'slug_en',
            'excerpt_ua', 'excerpt_ru', 'excerpt_en',
            'cover', 'published_at', 'categories'
        ]

    def _short(self, html: str):
        text = strip_tags(html or '')
        return (text[:200] + ('…' if len(text) > 200 else ''))

    def get_excerpt_ua(self, obj):
        return self._short(obj.content_ua)

    def get_excerpt_ru(self, obj):
        return self._short(obj.content_ru)

    def get_excerpt_en(self, obj):
        return self._short(obj.content_en)


class BlogPostDetailSerializer(serializers.ModelSerializer):
    categories = BlogCategorySerializer(many=True, read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id',
            'title_ua', 'title_ru', 'title_en',
            'slug_ua', 'slug_ru', 'slug_en',
            'content_ua', 'content_ru', 'content_en',
            'cover', 'published_at', 'categories'
        ]


