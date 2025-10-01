from django.contrib import admin
from .models import BlogCategory, BlogPost


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


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title_ua", "status", "published_at")
    list_filter = ("status", "categories")
    search_fields = ("title_ua", "title_ru", "title_en")
    filter_horizontal = ("categories",)
    date_hierarchy = "published_at"
    prepopulated_fields = {
        "slug_ua": ("title_ua",),
        "slug_ru": ("title_ru",),
        "slug_en": ("title_en",),
    }
