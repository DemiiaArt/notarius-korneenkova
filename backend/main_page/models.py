from django.db import models
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


