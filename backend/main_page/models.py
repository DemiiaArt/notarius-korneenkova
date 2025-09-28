from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField


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


class VideoInterview(models.Model):
    title_video_uk = models.CharField(max_length=255)
    title_video_en = models.CharField(max_length=255)
    title_video_ru = models.CharField(max_length=255)

    text_video_uk = RichTextUploadingField()
    text_video_en = RichTextUploadingField()
    text_video_ru = RichTextUploadingField()

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

    description_uk = RichTextUploadingField(blank=True, null=True)
    description_en = RichTextUploadingField(blank=True, null=True)
    description_ru = RichTextUploadingField(blank=True, null=True)

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


