from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from mptt.models import MPTTModel, TreeForeignKey
from django.core.exceptions import ValidationError
from django_ckeditor_5.fields import CKEditor5Field
from phonenumber_field.modelfields import PhoneNumberField
import os


def validate_video_format(file):
    """
    Валидатор для проверки формата видео.
    Разрешены только MP4 файлы.
    """
    ext = os.path.splitext(file.name)[1].lower()
    valid_extensions = ['.mp4']
    
    if ext not in valid_extensions:
        raise ValidationError(
            f'Непідтримуваний формат файлу. Тільки MP4 дозволено. '
            f'Ваш файл: {ext}'
        )


class Header(models.Model):
    email = models.EmailField(max_length=255)
    phone_number = models.CharField(max_length=255)
    phone_number_2 = models.CharField(max_length=255, blank=True, null=True)
    address_ua = models.CharField(max_length=255)
    address_en = models.CharField(max_length=255)
    address_ru = models.CharField(max_length=255)
    
    # Рабочие часы (многоязычные)
    working_hours_ua = models.CharField(max_length=255, blank=True, null=True, verbose_name="Години роботи (UA)")
    working_hours_en = models.CharField(max_length=255, blank=True, null=True, verbose_name="Working hours (EN)")
    working_hours_ru = models.CharField(max_length=255, blank=True, null=True, verbose_name="Время работы (RU)")

    # Социальные сети (URL)
    instagram_url = models.URLField(max_length=500, blank=True, null=True)
    facebook_url = models.URLField(max_length=500, blank=True, null=True)
    twitter_url = models.URLField(max_length=500, blank=True, null=True)
    tiktok_url = models.URLField(max_length=500, blank=True, null=True, verbose_name="TikTok")
    # Новые поля для хранения номеров телефонов, из которых будут формироваться ссылки
    whatsapp_phone = PhoneNumberField(blank=True, null=True, verbose_name="WhatsApp телефон")
    telegram_phone = PhoneNumberField(blank=True, null=True, verbose_name="Telegram телефон")
    # URL-поля удалены, ссылки формируются на лету на основе номеров
    

    def __str__(self):
        return self.email
    
    class Meta:
        verbose_name = "Контакты"
        verbose_name_plural = "Контакты"
        db_table = 'main_page_header'


class BackgroundVideo(models.Model):
    MEDIA_TYPE_CHOICES = [
        ('video', 'Видео'),
        ('image', 'Изображение'),
    ]
    
    name = models.CharField(max_length=255, verbose_name="Название", default="Фоновое медиа")
    media_type = models.CharField(
        max_length=10,
        choices=MEDIA_TYPE_CHOICES,
        default='video',
        verbose_name="Тип медиа"
    )
    video = models.FileField(
        upload_to='background_videos/',
        blank=True,
        null=True,
        verbose_name="Видеофайл",
        validators=[validate_video_format],
        help_text="Тільки MP4 формат"
    )
    image = models.ImageField(
        upload_to='background_videos/',
        blank=True,
        null=True,
        verbose_name="Изображение"
    )
    is_active = models.BooleanField(default=True, verbose_name="Активно")

    def __str__(self):
        return f"{self.name} ({self.get_media_type_display()})"

    class Meta:
        verbose_name = "Фоновый медиа"
        verbose_name_plural = "Фоновые медиа"


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

class AboutMeDetail(models.Model):
    """
    Детальный блок "Про мене" на странице About.
    Содержит локализованные заголовок и контент на трёх языках.
    """

    title_ua = models.CharField(max_length=255, verbose_name="Заголовок (UA)")
    title_ru = models.CharField(max_length=255, verbose_name="Заголовок (RU)")
    title_en = models.CharField(max_length=255, verbose_name="Заголовок (EN)")

    text_ua = CKEditor5Field(blank=True, null=True, verbose_name="Текст (UA)")
    text_ru = CKEditor5Field(blank=True, null=True, verbose_name="Текст (RU)")
    text_en = CKEditor5Field(blank=True, null=True, verbose_name="Текст (EN)")

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    def __str__(self):
        return self.title_ua

    class Meta:
        verbose_name = "Блок про мене (детали)"
        verbose_name_plural = "Блоки про мене (детали)"
        ordering = ['-created_at']

class ServicesFor(models.Model):
    title_uk = models.CharField(max_length=255)
    title_en = models.CharField(max_length=255)
    title_ru = models.CharField(max_length=255)

    image = models.ImageField(upload_to='services/', blank=True, null=True)
    subtitle_uk = models.CharField(max_length=255, blank=True, null=True)
    subtitle_en = models.CharField(max_length=255, blank=True, null=True)
    subtitle_ru = models.CharField(max_length=255, blank=True, null=True)
    
    # Описание на трех языках с CKEditor
    description_uk = CKEditor5Field(blank=True, null=True, verbose_name="Описание (UA)")
    description_en = CKEditor5Field(blank=True, null=True, verbose_name="Описание (EN)")
    description_ru = CKEditor5Field(blank=True, null=True, verbose_name="Описание (RU)")


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
    
    # Канонический URL для SEO
    canonical_url = models.CharField(
        max_length=500,
        blank=True, 
        null=True,
        verbose_name="Канонический URL (опционально)",
        help_text=""
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

    def get_canonical_url(self, language='ua'):
        """
        Возвращает канонический URL для конкретного языка
        """
        from django.conf import settings
        
        if self.canonical_url:
            # Если canonical_url уже полный URL - возвращаем как есть
            if self.canonical_url.startswith(('http://', 'https://')):
                # Убеждаемся, что полный URL заканчивается слешем
                return self.canonical_url if self.canonical_url.endswith('/') else f"{self.canonical_url}/"
            # Если относительный путь - добавляем базовый URL
            else:
                # Убеждаемся, что путь начинается со слеша
                path = self.canonical_url if self.canonical_url.startswith('/') else f"/{self.canonical_url}"
                # Убеждаемся, что путь заканчивается слешем
                path = path if path.endswith('/') else f"{path}/"
                return f"{settings.BASE_URL}{path}"
        
        # Автоматическая генерация на основе языка с учетом иерархии
        base_url = settings.BASE_URL
        full_path = self._get_full_path_for_canonical(language)
        return f"{base_url}{full_path}"

    def _get_full_path_for_canonical(self, language):
        """
        Строит полный путь с учетом иерархии родительских категорий для canonical URL
        """
        path_parts = []
        current = self
        
        # Собираем путь от текущего объекта до корня
        while current:
            if language == 'ua' and current.slug_ua:
                path_parts.insert(0, current.slug_ua)
            elif language == 'ru' and current.slug_ru:
                path_parts.insert(0, current.slug_ru)
            elif language == 'en' and current.slug_en:
                path_parts.insert(0, current.slug_en)
            else:
                # Если нет slug для нужного языка, используем UA
                if current.slug_ua:
                    path_parts.insert(0, current.slug_ua)
            
            current = current.parent
        
        # Добавляем префикс языка для RU и EN
        if language == 'ru':
            return f"/ru/{'/'.join(path_parts)}/"
        elif language == 'en':
            return f"/en/{'/'.join(path_parts)}/"
        else:
            return f"/{'/'.join(path_parts)}/"

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
    # Связь с категорией услуг
    service_category = models.ForeignKey(
        'ServiceCategory',
        on_delete=models.CASCADE,
        related_name='faqs',
        verbose_name="Категория услуг",
        null=True,
        blank=True
    )
    
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


class LegalDocument(models.Model):
    """
    Юридические документы сайта: Договор оферты, Политика конфиденциальности, Торговая марка.
    Содержат локализованные заголовки и контент с поддержкой CKEditor5.
    """

    KEY_CHOICES = [
        ('offer_agreement', 'Договір оферти'),
        ('privacy_policy', 'Політика конфіденційності'),
        ('trademark', 'Торгівельна марка'),
    ]

    key = models.SlugField(max_length=64, unique=True, choices=KEY_CHOICES, verbose_name="Тип документа")

    # Заголовки на трех языках
    title_ua = models.CharField(max_length=255, verbose_name="Заголовок (UA)")
    title_ru = models.CharField(max_length=255, verbose_name="Заголовок (RU)")
    title_en = models.CharField(max_length=255, verbose_name="Заголовок (EN)")

    # Контент на трех языках
    content_ua = CKEditor5Field(blank=True, null=True, verbose_name="Контент (UA)")
    content_ru = CKEditor5Field(blank=True, null=True, verbose_name="Контент (RU)")
    content_en = CKEditor5Field(blank=True, null=True, verbose_name="Контент (EN)")
    file = models.FileField(upload_to='trademark/', blank=True, null=True, verbose_name="Файл")

    # Метаданные
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Юридический документ"
        verbose_name_plural = "Юридические документы"
        ordering = ['key']
        db_table = 'main_page_legal_document'

    def __str__(self):
        return dict(self.KEY_CHOICES).get(self.key, self.key)

class QualificationBlock(models.Model):
    """
    Блок "Кваліфікація та досвід": общий заголовок + две карусели.
    """
    title_ua = models.CharField(max_length=255, verbose_name="Заголовок (UA)")
    title_ru = models.CharField(max_length=255, verbose_name="Заголовок (RU)")
    title_en = models.CharField(max_length=255, verbose_name="Заголовок (EN)")

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Квалификация и опыт"
        verbose_name_plural = "Квалификация и опыт"
        ordering = ['-created_at']

    def __str__(self):
        return self.title_ua


class QualificationCertificate(models.Model):
    """Изображение сертификата в левой карусели."""
    block = models.ForeignKey(QualificationBlock, on_delete=models.CASCADE, related_name='certificates')
    image = models.ImageField(upload_to='qualifications/certificates/')
    order = models.PositiveIntegerField(default=0, verbose_name="Порядок")

    class Meta:
        verbose_name = "Сертификат"
        verbose_name_plural = "Сертификаты"
        ordering = ['order', 'id']

    def __str__(self):
        return f"Certificate #{self.id}"


class QualificationDiploma(models.Model):
    """Изображение свидоцтва/диплома во второй карусели."""
    block = models.ForeignKey(QualificationBlock, on_delete=models.CASCADE, related_name='diplomas')
    image = models.ImageField(upload_to='qualifications/diplomas/')
    order = models.PositiveIntegerField(default=0, verbose_name="Порядок")

    class Meta:
        verbose_name = "Свидетельство"
        verbose_name_plural = "Свидетельства"
        ordering = ['order', 'id']

    def __str__(self):
        return f"Diploma #{self.id}"


class VideoBlock(models.Model):
    """
    Универсальная модель для управления видео блоками на сайте.
    Позволяет выбирать тип видео: интервью, обо мне, контакты.
    """
    
    VIDEO_TYPE_CHOICES = [
        ('interview', 'Видео интервью'),
        ('about_me', 'Обо мне'),
        ('contacts', 'Как добраться до офиса'),
    ]
    
    # Тип видео блока
    video_type = models.CharField(
        max_length=20,
        choices=VIDEO_TYPE_CHOICES,
        unique=True,
        verbose_name="Тип видео блока"
    )
    
    # Заголовки на трех языках
    title_ua = models.CharField(max_length=255, verbose_name="Заголовок (UA)")
    title_ru = models.CharField(max_length=255, verbose_name="Заголовок (RU)")
    title_en = models.CharField(max_length=255, verbose_name="Заголовок (EN)")
    
    # Описания на трех языках
    description_ua = CKEditor5Field(blank=True, null=True, verbose_name="Описание (UA)")
    description_ru = CKEditor5Field(blank=True, null=True, verbose_name="Описание (RU)")
    description_en = CKEditor5Field(blank=True, null=True, verbose_name="Описание (EN)")
    
    # Видеофайл
    video = models.FileField(
        upload_to='video_blocks/', 
        verbose_name="Видеофайл",
        validators=[validate_video_format],
        help_text="Тільки MP4 формат"
    )
    
    # Активность блока
    is_active = models.BooleanField(default=True, verbose_name="Активен")
    
    # Метаданные
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    
    class Meta:
        verbose_name = "Видео блок"
        verbose_name_plural = "Видео блоки"
        ordering = ['video_type']
    
    def __str__(self):
        return f"{self.get_video_type_display()} - {self.title_ua}"