from django.contrib import admin
from django.shortcuts import redirect
from django.urls import reverse
from django import forms
from .models import BlogCategory, BlogPost, BlogHome


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ("name_ua", "show_in_filters", "order")
    list_editable = ("show_in_filters", "order")
    search_fields = ("name_ua", "name_ru", "name_en")
    prepopulated_fields = {
        "slug_ua": ("name_ua",),
        "slug_ru": ("name_ru",),
        "slug_en": ("name_en",),
    }


class BlogPostForm(forms.ModelForm):
    """Кастомная форма для BlogPost с подсказкой для canonical_url"""
    
    class Meta:
        model = BlogPost
        fields = '__all__'
        widgets = {
            'canonical_url': forms.TextInput(attrs={
                'placeholder': 'Например: /page/ или https://notarius-korneenkova.com.ua/page/',
                'style': 'width: 100%;'
            })
        }

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    form = BlogPostForm
    list_display = ("title_ua", "status", "published_at", "get_categories")
    list_editable = ("status",)
    list_filter = ("status", "categories")
    search_fields = ("title_ua", "title_ru", "title_en")
    filter_horizontal = ("categories",)
    date_hierarchy = "published_at"
    save_on_top = True
    prepopulated_fields = {
        "slug_ua": ("title_ua",),
        "slug_ru": ("title_ru",),
        "slug_en": ("title_en",),
    }
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('title_ua', 'title_ru', 'title_en')
        }),
        ('URL настройки', {
            'fields': ('slug_ua', 'slug_ru', 'slug_en', 'canonical_url'),
            'description': 'Настройки URL для разных языков'
        }),
        ('Контент', {
            'fields': ('content_ua', 'content_ru', 'content_en')
        }),
        ('Медиа', {
            'fields': ('cover', 'hero_image')
        }),
        ('Настройки публикации', {
            'fields': ('status', 'published_at', 'categories')
        }),
    )

    def get_categories(self, obj):
        """Отображение категорий статьи"""
        categories = obj.categories.all()
        if categories:
            return ', '.join([cat.name_ua for cat in categories])
        return '—'
    get_categories.short_description = 'Категории'


@admin.register(BlogHome)
class BlogHomeAdmin(admin.ModelAdmin):
    list_display = ("title_ua",)
    search_fields = ("title_ua", "title_ru", "title_en")

    def has_add_permission(self, request):
        # Разрешаем добавить запись только если её ещё нет
        return not BlogHome.objects.exists()

    def has_delete_permission(self, request, obj=None):
        # Нельзя удалять — ведём себя как одиночная запись
        return False

    def changelist_view(self, request, extra_context=None):
        # При заходе в раздел сразу редиректим на форму редактирования/создания
        obj = BlogHome.objects.first()
        if obj:
            url = reverse("admin:blog_bloghome_change", args=[obj.pk])
            return redirect(url)
        add_url = reverse("admin:blog_bloghome_add")
        return redirect(add_url)
