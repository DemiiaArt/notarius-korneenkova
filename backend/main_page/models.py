from django.db import models


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
    
    text_uk = models.TextField()
    text_en = models.TextField()
    text_ru = models.TextField()

    photo = models.ImageField(upload_to='about_me/')

    def __str__(self):
        return self.title_uk  # Используем title_uk вместо title
    
    class Meta:
        verbose_name = "О себе"
        verbose_name_plural = "О себе"