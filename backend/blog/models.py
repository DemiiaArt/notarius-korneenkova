from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField


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
        return self.filter(status="published")


class BlogPost(models.Model):
    """
    Статья блога.
    На основе скриншотов: заголовок, краткий текст (анонс), обложка, дата,
    содержимое, категории/теги, пагинация на списке и блок похожих статей.
    """

    STATUS_CHOICES = (
        ("draft", "Черновик"),
        ("published", "Опубликовано"),
    )

    title_ua = models.CharField(max_length=255, verbose_name="Заголовок (UA)")
    title_ru = models.CharField(max_length=255, verbose_name="Заголовок (RU)")
    title_en = models.CharField(max_length=255, verbose_name="Заголовок (EN)")

    slug_ua = models.SlugField(max_length=255, unique=True, verbose_name="Slug (UA)")
    slug_ru = models.SlugField(max_length=255, unique=True, verbose_name="Slug (RU)")
    slug_en = models.SlugField(max_length=255, unique=True, verbose_name="Slug (EN)")

    # Анонсы убраны: будем формировать краткий текст на лету из контента

    content_ua = RichTextUploadingField(verbose_name="Контент (UA)")
    content_ru = RichTextUploadingField(verbose_name="Контент (RU)")
    content_en = RichTextUploadingField(verbose_name="Контент (EN)")

    cover = models.ImageField(upload_to="blog/covers/", verbose_name="Обложка")

    categories = models.ManyToManyField(BlogCategory, related_name="posts", blank=True)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="draft")
    published_at = models.DateField(null=True, blank=True, verbose_name="Дата публикации")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = BlogPostQuerySet.as_manager()

    class Meta:
        verbose_name = "Статья блога"
        verbose_name_plural = "Статьи блога"
        ordering = ["-published_at", "-created_at"]

    def __str__(self) -> str:
        return self.title_ua

