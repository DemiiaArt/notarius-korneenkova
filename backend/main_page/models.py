from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from mptt.models import MPTTModel, TreeForeignKey
from django.core.exceptions import ValidationError


class Header(models.Model):
    email = models.EmailField(max_length=255)
    phone_number = models.CharField(max_length=255)
    phone_number_2 = models.CharField(max_length=255, blank=True, null=True)
    address_ua = models.CharField(max_length=255)
    address_en = models.CharField(max_length=255)
    address_ru = models.CharField(max_length=255)

    def __str__(self):
        return self.email
    
    class Meta:
        verbose_name = "Шапка профиля"
        verbose_name_plural = "Шапки профиля"


class BackgroundVideo(models.Model):
    video_name = models.CharField(max_length=255)
    video = models.FileField(upload_to='background_videos/')

    def __str__(self):
        return self.video_name

    class Meta:
        verbose_name = "Фоновое видео"
        verbose_name_plural = "Фоновые видео"


class AboutMe(models.Model):
    
    subtitle_uk = models.CharField(
        max_length=255,
        verbose_name="Підзаголовок"
    )
    subtitle_en = models.CharField(
        max_length=255,
        verbose_name="Підзаголовок"
    )
    subtitle_ru = models.CharField(
        max_length=255,
        verbose_name="Підзаголовок"
    )

    title_uk = models.CharField(max_length=255)
    title_en = models.CharField(max_length=255)
    title_ru = models.CharField(max_length=255)
    
    text_uk = RichTextUploadingField()
    text_en = RichTextUploadingField()
    text_ru = RichTextUploadingField()

    photo = models.ImageField(upload_to='about_me/')

    def __str__(self):
        return self.title_uk  # Используем title_uk вместо title
    
    class Meta:
        verbose_name = "О себе"
        verbose_name_plural = "О себе"

class Services(models.Model):
    title_uk = models.CharField(max_length=255)
    title_en = models.CharField(max_length=255)
    title_ru = models.CharField(max_length=255)

    image = models.ImageField(upload_to='services/')

    def __str__(self):
        return self.title_uk
    
    class Meta:
        verbose_name = "Услуга"
        verbose_name_plural = "Услуги"

class ServiceDescription(models.Model):
    service = models.ForeignKey(Services, on_delete=models.CASCADE)
    text_uk = RichTextUploadingField()
    text_en = RichTextUploadingField()
    text_ru = RichTextUploadingField()                                                                                                                                                                                                                                                                     

    def __str__(self):
        return self.service.title_uk
    
    class Meta:
        verbose_name = "Описание услуги"
        verbose_name_plural = "Описание услуг"


class ServiceCategory(MPTTModel):
    """
    Модель категорий услуг с иерархической структурой
    Основана на структуре навигации из nav-tree.js
    """
    
    # Тип элемента (section, group, page)
    KIND_CHOICES = [
        ('section', 'Раздел'),
        ('group', 'Группа'),
        ('page', 'Страница'),
    ]
    kind = models.CharField(
        max_length=20,
        choices=KIND_CHOICES,
        default='page',
        verbose_name="Тип элемента"
    )
    
    # Многоязычные названия
    label_ua = models.CharField(
        max_length=255,
        verbose_name="Название (UA)"
    )
    label_ru = models.CharField(
        max_length=255,
        verbose_name="Название (RU)"
    )
    label_en = models.CharField(
        max_length=255,
        verbose_name="Название (EN)"
    )

        # Уникальный идентификатор (соответствует id из nav-tree.js)
    nav_id = models.SlugField(
        max_length=255, 
        unique=True,
        verbose_name="ID навигации"
    )

    # Многоязычные URL slug'и
    slug_ua = models.SlugField(
        max_length=255,
        blank=True,
        verbose_name="URL slug (UA)"
    )
    slug_ru = models.SlugField(
        max_length=255,
        blank=True,
        verbose_name="URL slug (RU)"
    )
    slug_en = models.SlugField(
        max_length=255,
        blank=True,
        verbose_name="URL slug (EN)"
    )
    
    # Показывать ли в меню
    show_in_menu = models.BooleanField(
        default=False,
        verbose_name="Показывать в меню"
    )
    
    # Ссылка на React компонент (по умолчанию null)
    component = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="React компонент"
    )
    
    # MPTT поля для иерархии
    parent = TreeForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name="Родительская категория"
    )
    
    # Порядок сортировки
    order = models.PositiveIntegerField(
        default=0,
        verbose_name="Порядок сортировки"
    )
    
    # Метаданные
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    

        
    class Meta:
        verbose_name = "Категория услуг"
        verbose_name_plural = "Категории услуг"
        ordering = ['order', 'label_ua']
        
    class MPTTMeta:
        verbose_name_plural = "Категории услуг"

    def __str__(self):
        return f"{self.label_ua}"
    
    def clean(self):
        # ограничение глубины до 3 уровней
        if self.parent and self.parent.level >= 2:
            raise ValidationError("Нельзя создавать вложенность глубже 3 уровней.")
        
        # Ограничение количества корневых категорий до 4
        if not self.parent:
            if ServiceCategory.objects.filter(parent__isnull=True).exclude(pk=self.pk).count() > 3:
                raise ValidationError("Нельзя создавать больше 4 корневых категорий.")
    

