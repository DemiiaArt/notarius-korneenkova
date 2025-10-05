from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from mptt.models import MPTTModel, TreeForeignKey
from django.core.exceptions import ValidationError
from django_ckeditor_5.fields import CKEditor5Field


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
        verbose_name = "Контакты в шапке профиля"
        verbose_name_plural = "Контакты в шапке профиля"


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
    
    text_uk = CKEditor5Field('Text', config_name='default')
    text_en = CKEditor5Field('Text', config_name='default')
    text_ru = CKEditor5Field('Text', config_name='default')

    photo = models.ImageField(upload_to='about_me/')

    def __str__(self):
        return self.title_uk  # Используем title_uk вместо title
    
    class Meta:
        verbose_name = "О себе"
        verbose_name_plural = "О себе"


class VideoInterview(models.Model):
    title_video_uk = models.CharField(max_length=255)
    title_video_en = models.CharField(max_length=255)
    title_video_ru = models.CharField(max_length=255)

    text_video_uk = CKEditor5Field('Text', config_name='default')
    text_video_en = CKEditor5Field('Text', config_name='default')
    text_video_ru = CKEditor5Field('Text', config_name='default')

    video = models.FileField(upload_to='video_interview/')

    def __str__(self):
        return self.title_video_uk
    
    class Meta:
        verbose_name = "Видео интервью"
        verbose_name_plural = "Видео интервью"

class ServicesFor(models.Model):
    title_uk = models.CharField(max_length=255)
    title_en = models.CharField(max_length=255)
    title_ru = models.CharField(max_length=255)

    image = models.ImageField(upload_to='services/', blank=True, null=True)
    subtitle_uk = models.CharField(max_length=255)
    subtitle_en = models.CharField(max_length=255)
    subtitle_ru = models.CharField(max_length=255)

    description_uk = CKEditor5Field('Description', config_name='default', blank=True, null=True)
    description_en = CKEditor5Field('Description', config_name='default', blank=True, null=True)
    description_ru = CKEditor5Field('Description', config_name='default', blank=True, null=True)

    def __str__(self):
        return self.title_uk
    
    class Meta:
        verbose_name = "Для кого услуги"
        verbose_name_plural = "Для кого услуги"


class ServiceFeature(models.Model):
    """
    Модель для хранения преимуществ/особенностей услуг
    """
    # Связь с категорией услуг
    service_category = models.ForeignKey(
        'ServiceCategory',
        on_delete=models.CASCADE,
        related_name='features',
        verbose_name="Категория услуг"
    )
    
    # Тексты на трех языках
    text_ua = models.CharField(
        max_length=255,
        verbose_name="Текст (UA)"
    )
    text_ru = models.CharField(
        max_length=255,
        verbose_name="Текст (RU)"
    )
    text_en = models.CharField(
        max_length=255,
        verbose_name="Текст (EN)"
    )
    
    # Порядок отображения
    order = models.PositiveIntegerField(
        default=0,
        verbose_name="Порядок отображения"
    )
    
    # Метаданные
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    
    class Meta:
        verbose_name = "Особенность услуги"
        verbose_name_plural = "Особенности услуг"
        ordering = ['order', 'text_ua']
    
    def __str__(self):
        return f"{self.service_category.label_ua} - {self.text_ua}"


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
        default=True,
        verbose_name="Показывать в меню"
    )
    
    # Показывать ли в мега-панели
    show_mega_panel = models.BooleanField(
        default=True,
        verbose_name="Показывать в мега-панели"
    )
    
    # Фотография для страницы услуг
    hero_image = models.ImageField(
        upload_to='services/',
        blank=True,
        null=True,
        verbose_name="Главное изображение"
    )
    
    # Фотография для карточки в карусели
    card_image = models.ImageField(
        upload_to='services/',
        blank=True,
        null=True,
        verbose_name="Изображение карточки"
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
    # Описание (на 3 языках)
    description_ua = CKEditor5Field(blank=True, null=True, verbose_name="Описание (UA)")
    description_ru = CKEditor5Field(blank=True, null=True, verbose_name="Описание (RU)")
    description_en = CKEditor5Field(blank=True, null=True, verbose_name="Описание (EN)")
    
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
        
        # Ограничение количества категорий с kind="Раздел" до 4
        if self.kind == 'section':
            existing_sections = ServiceCategory.objects.filter(kind='section').exclude(pk=self.pk).count()
            if existing_sections >= 4:
                raise ValidationError("Нельзя создавать больше 4 категорий с типом 'Раздел'.")
        
        # Проверка что категории типа "Раздел" могут быть только корневыми
        if self.kind == 'section' and self.parent is not None:
            raise ValidationError("Категории c типом 'Раздел' могут быть только корневыми (родительскими) категориями.")
        
        # Запрет добавления группы к странице
        if self.kind == 'group' and self.parent and self.parent.kind == 'page':
            raise ValidationError("Ошибка в поле 'Тип элемента': Нельзя добавлять группу к странице. Группы можно добавлять только к разделам.")
    



class Application(models.Model):
    name = models.CharField(max_length=255, verbose_name="Имя")
    phone_number = models.CharField(max_length=20, verbose_name="Номер телефона")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    is_processed = models.BooleanField(default=False, verbose_name="Обработано")

    def __str__(self):
        return f"{self.name} - {self.phone_number}"
    
    class Meta:
        verbose_name = "Заявка"
        verbose_name_plural = "Заявки"
        ordering = ['-created_at']


class FreeConsultation(models.Model):
    name = models.CharField(max_length=255, verbose_name="Имя")
    phone_number = models.CharField(max_length=20, verbose_name="Номер телефона")
    city = models.CharField(max_length=255, verbose_name="Город")
    question = models.TextField(verbose_name="Вопрос")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    is_processed = models.BooleanField(default=False, verbose_name="Обработано")
    
    def __str__(self):
        return f"{self.name} - {self.phone_number}"
    
    class Meta:
        verbose_name = "Бесплатная консультация"
        verbose_name_plural = "Бесплатные консультации"
        ordering = ['-created_at']
    

class ContactUs(models.Model):
    name = models.CharField(max_length=255, verbose_name="Имя")
    phone_number = models.CharField(max_length=20, verbose_name="Номер телефона")
    question = models.TextField(verbose_name="Вопрос")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    is_processed = models.BooleanField(default=False, verbose_name="Обработано")
    
    def __str__(self):
        return f"{self.name} - {self.phone_number}"
    
    class Meta:

        verbose_name = "Связаться с нами"
        verbose_name_plural = "Связаться с нами"
        ordering = ['-created_at']


class Review(models.Model):
    """
    Модель для хранения отзывов клиентов
    """
    RATING_CHOICES = [
        (1, '1 звезда'),
        (2, '2 звезды'),
        (3, '3 звезды'),
        (4, '4 звезды'),
        (5, '5 звезд'),
    ]
    
    SERVICE_CHOICES = [
        ('certification', 'Засвідчення копій документів та підписів'),
        ('realEstateTransactions', 'Нотаріальне супроводження угод з нерухомістю'),
        ('heritage', 'Оформлення спадщини та заповітів'),
        ('attorney', 'Посвідчення довіреностей та згод'),
        ('agreements', 'Посвідчення договорів купівлі-продажу, дарування, оренди'),
    ]
    
    name = models.CharField(max_length=255, verbose_name="Имя")
    service = models.CharField(
        max_length=50, 
        choices=SERVICE_CHOICES, 
        verbose_name="Услуга"
    )
    rating = models.IntegerField(
        choices=RATING_CHOICES, 
        verbose_name="Рейтинг"
    )
    text = models.TextField(verbose_name="Текст отзыва")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    is_approved = models.BooleanField(default=False, verbose_name="Одобрено")
    is_published = models.BooleanField(default=False, verbose_name="Опубликовано")
    
    def __str__(self):
        return f"{self.name} - {self.rating} звезд"
    
    class Meta:
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"
        ordering = ['-created_at']



class FrequentlyAskedQuestion(models.Model):
    """
    Частые вопросы (FAQ) для блока на главной странице.
    Хранит вопрос/ответ на трех языках, порядок и флаг публикации.
    """
    # Вопросы на трех языках
    question_ua = models.CharField(max_length=255, verbose_name="Питання (UA)")
    question_ru = models.CharField(max_length=255, verbose_name="Вопрос (RU)")
    question_en = models.CharField(max_length=255, verbose_name="Question (EN)")

    # Ответы на трех языках
    answer_ua = models.TextField(verbose_name="Відповідь (UA)")
    answer_ru = models.TextField(verbose_name="Ответ (RU)")
    answer_en = models.TextField(verbose_name="Answer (EN)")

    # Порядок отображения и публикация
    order = models.PositiveIntegerField(default=0, verbose_name="Порядок отображения")
    is_published = models.BooleanField(default=True, verbose_name="Опубликовано")

    # Метаданные
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Частый вопрос"
        verbose_name_plural = "Частые вопросы"
        ordering = ['order', 'created_at']

    def __str__(self):
        return self.question_ua
