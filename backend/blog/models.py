from django.db import models
from django_ckeditor_5.fields import CKEditor5Field


class BlogCategory(models.Model):
    """
    Категория блога для фильтрации статей на странице списка.
    Мультиязычные названия и slug'и для маршрутизации.
    """

    name_ua = models.CharField(max_length=255, verbose_name="Назва (UA)")
    name_ru = models.CharField(max_length=255, verbose_name="Назва (RU)")
    name_en = models.CharField(max_length=255, verbose_name="Назва (EN)")

    slug_ua = models.SlugField(max_length=255, unique=True, verbose_name="Slug (UA)")
    slug_ru = models.SlugField(max_length=255, unique=True, verbose_name="Slug (RU)")
    slug_en = models.SlugField(max_length=255, unique=True, verbose_name="Slug (EN)")

    show_in_filters = models.BooleanField(default=True, verbose_name="Показывать в фильтрах")
    order = models.PositiveIntegerField(default=0, verbose_name="Порядок")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Категория блога"
        verbose_name_plural = "Категории блога"
        ordering = ["order", "name_ua"]

    def __str__(self) -> str:
        return self.name_ua


## Теги убраны по требованию


class BlogPostQuerySet(models.QuerySet):
    def published(self):
        return self.filter(status=True)


class BlogPost(models.Model):
    """
    Статья блога.
    На основе скриншотов: заголовок, краткий текст (анонс), обложка, дата,
    содержимое, категории/теги, пагинация на списке и блок похожих статей.
    """


    title_ua = models.CharField(max_length=255, verbose_name="Заголовок (UA)")
    title_ru = models.CharField(max_length=255, verbose_name="Заголовок (RU)")
    title_en = models.CharField(max_length=255, verbose_name="Заголовок (EN)")

    slug_ua = models.SlugField(max_length=255, unique=True, verbose_name="Slug (UA)")
    slug_ru = models.SlugField(max_length=255, unique=True, verbose_name="Slug (RU)")
    slug_en = models.SlugField(max_length=255, unique=True, verbose_name="Slug (EN)")

    # Анонсы убраны: будем формировать краткий текст на лету из контента

    content_ua = CKEditor5Field(blank=True, null=True, verbose_name="Описание (UA)")
    content_ru = CKEditor5Field(verbose_name="Описание (RU)")
    content_en = CKEditor5Field(verbose_name="Описание (EN)")

    cover = models.ImageField(upload_to="blog/covers/", verbose_name="Обложка")

    categories = models.ManyToManyField(BlogCategory, related_name="posts", blank=True)

    status = models.BooleanField(default=False, verbose_name="Опубликовано")
    published_at = models.DateField(null=True, blank=True, verbose_name="Дата публикации")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = BlogPostQuerySet.as_manager()

    class Meta:
        verbose_name = "Статья блога"
        verbose_name_plural = "Статьи блога"
        ordering = ["-published_at", "-created_at"]

    def get_similar_posts(self, limit=3):
        """
        Возвращает похожие статьи на основе общих категорий
        """
        if not self.categories.exists():
            return BlogPost.objects.none()
        
        # Получаем ID категорий текущей статьи
        category_ids = self.categories.values_list('id', flat=True)
        
        # Находим статьи с общими категориями, исключая текущую статью
        similar_posts = BlogPost.objects.published().filter(
            categories__in=category_ids
        ).exclude(
            id=self.id
        ).distinct().order_by('-published_at', '-created_at')[:limit]
        
        return similar_posts

    def __str__(self) -> str:
        return self.title_ua

