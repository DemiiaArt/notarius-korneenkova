from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from django import forms
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import render, redirect
from django.contrib import messages
from django.db.models import Q
from django.contrib.admin import SimpleListFilter
from .models import (
    Header, BackgroundVideo, AboutMe, ServiceCategory, ServiceFeature,
    ServicesFor, Application, VideoInterview, Review, FreeConsultation, 
    ContactUs, FrequentlyAskedQuestion
)
from blog.models import BlogCategory, BlogPost
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from .models import LegalDocument

# Базовые админ-классы для лучшей организации
class BaseAdmin(admin.ModelAdmin):
    """Базовый класс для всех админ-классов с общими настройками"""
    save_on_top = True
    list_per_page = 25
    
    def get_queryset(self, request):
        """Сортируем по дате создания (новые сверху) если поле существует"""
        qs = super().get_queryset(request)
        try:
            if self.model._meta.get_field('created_at'):
                return qs.order_by('-created_at')
        except:
            pass
        return qs

class ContentAdmin(BaseAdmin):
    """Админ-класс для контентных моделей"""
    list_per_page = 20

# Специальный админ-класс для форм обратной связи
class FormsAdmin(BaseAdmin):
    """Базовый класс для всех форм обратной связи"""
    list_per_page = 30
    date_hierarchy = 'created_at'
    
    def get_queryset(self, request):
        return super().get_queryset(request).order_by('-created_at')
    
    def get_list_display(self, request):
        """Динамическое отображение в зависимости от модели"""
        base_display = ['name', 'phone_number', 'created_at', 'is_processed', 'status_badge']
        
        # Добавляем специфичные поля для разных форм
        if hasattr(self.model, 'city'):
            base_display.insert(2, 'city')  # Для FreeConsultation
        if hasattr(self.model, 'question'):
            base_display.append('question_preview')
            
        return base_display
    
    def get_list_editable(self, request):
        """Динамическое редактирование в зависимости от модели"""
        return ['is_processed']
    
    # Переопределяем list_display и list_editable как статические свойства
    list_display = ['name', 'phone_number', 'created_at', 'is_processed', 'status_badge', 'question_preview']
    list_editable = ['is_processed']
    
    def status_badge(self, obj):
        """Цветной индикатор статуса"""
        if obj.is_processed:
            return format_html('<span style="color: green; font-weight: bold;">✓ Обработано</span>')
        else:
            return format_html('<span style="color: red; font-weight: bold;">⚠ Требует обработки</span>')
    status_badge.short_description = 'Статус'
    
    def question_preview(self, obj):
        """Предпросмотр вопроса"""
        if hasattr(obj, 'question') and obj.question:
            if len(obj.question) > 50:
                return obj.question[:50] + '...'
            return obj.question
        return '—'
    question_preview.short_description = 'Предпросмотр вопроса'
    
    # Общие действия для всех форм
    actions = ['mark_as_processed', 'mark_as_unprocessed', 'export_to_csv']
    
    def mark_as_processed(self, request, queryset):
        """Отметить выбранные формы как обработанные"""
        updated = queryset.update(is_processed=True)
        self.message_user(request, f'{updated} форм(ы) отмечено как обработанные.')
    mark_as_processed.short_description = 'Отметить как обработанные'
    
    def mark_as_unprocessed(self, request, queryset):
        """Отметить выбранные формы как необработанные"""
        updated = queryset.update(is_processed=False)
        self.message_user(request, f'{updated} форм(ы) отмечено как необработанные.')
    mark_as_unprocessed.short_description = 'Отметить как необработанные'
    
    def export_to_csv(self, request, queryset):
        """Экспорт выбранных форм в CSV"""
        import csv
        from django.http import HttpResponse
        
        model_name = self.model._meta.verbose_name_plural
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{model_name}.csv"'
        
        writer = csv.writer(response)
        
        # Заголовки в зависимости от модели
        if hasattr(self.model, 'city'):
            writer.writerow(['Имя', 'Телефон', 'Город', 'Вопрос', 'Дата создания', 'Статус'])
        else:
            writer.writerow(['Имя', 'Телефон', 'Вопрос', 'Дата создания', 'Статус'])
        
        for obj in queryset:
            row = [obj.name, obj.phone_number]
            
            if hasattr(obj, 'city'):
                row.append(obj.city)
            
            if hasattr(obj, 'question'):
                question = obj.question[:100] + '...' if len(obj.question) > 100 else obj.question
                row.append(question)
            
            row.extend([
                obj.created_at.strftime('%d.%m.%Y %H:%M'),
                'Обработано' if obj.is_processed else 'Не обработано'
            ])
            
            writer.writerow(row)
        
        return response
    export_to_csv.short_description = 'Экспорт в CSV'

# Кастомные фильтры
class StatusFilter(SimpleListFilter):
    title = 'Статус обработки'
    parameter_name = 'status'
    
    def lookups(self, request, model_admin):
        return (
            ('processed', 'Обработано'),
            ('unprocessed', 'Не обработано'),
        )
    
    def queryset(self, request, queryset):
        if self.value() == 'processed':
            return queryset.filter(is_processed=True)
        elif self.value() == 'unprocessed':
            return queryset.filter(is_processed=False)

class ReviewStatusFilter(SimpleListFilter):
    title = 'Статус отзыва'
    parameter_name = 'review_status'
    
    def lookups(self, request, model_admin):
        return (
            ('published', 'Опубликовано'),
            ('approved', 'Одобрено'),
            ('pending', 'На модерации'),
        )
    
    def queryset(self, request, queryset):
        if self.value() == 'published':
            return queryset.filter(is_published=True)
        elif self.value() == 'approved':
            return queryset.filter(is_approved=True, is_published=False)
        elif self.value() == 'pending':
            return queryset.filter(is_approved=False)

class DateRangeFilter(SimpleListFilter):
    title = 'Период'
    parameter_name = 'date_range'
    
    def lookups(self, request, model_admin):
        return (
            ('today', 'Сегодня'),
            ('week', 'За неделю'),
            ('month', 'За месяц'),
        )
    
    def queryset(self, request, queryset):
        from datetime import datetime, timedelta
        
        if self.value() == 'today':
            today = datetime.now().date()
            return queryset.filter(created_at__date=today)
        elif self.value() == 'week':
            week_ago = datetime.now().date() - timedelta(days=7)
            return queryset.filter(created_at__date__gte=week_ago)
        elif self.value() == 'month':
            month_ago = datetime.now().date() - timedelta(days=30)
            return queryset.filter(created_at__date__gte=month_ago)

class HeaderAdmin(admin.ModelAdmin):
    list_display = [
        'email', 'phone_number', 'phone_number_2',
        'address_ua', 'address_en', 'address_ru',
        'working_hours_ua', 'instagram_url', 'facebook_url', 'twitter_url', 'x_url', 'telegram_url'
    ]
    list_filter = ['email']
    search_fields = [
        'email', 'phone_number', 'phone_number_2',
        'address_ua', 'address_en', 'address_ru',
        'working_hours_ua', 'working_hours_ru', 'working_hours_en',
        'instagram_url', 'facebook_url', 'twitter_url', 'x_url', 'telegram_url'
    ]
    save_on_top = True
    list_per_page = 25
    
    fieldsets = (
        ('Контактная информация', {
            'fields': ('email', 'phone_number', 'phone_number_2')
        }),
        ('Адреса', {
            'fields': ('address_ua', 'address_en', 'address_ru'),
            'description': 'Адреса на разных языках'
        }),
        ('Години роботи', {
            'fields': ('working_hours_ua', 'working_hours_en', 'working_hours_ru'),
            'description': 'Локализованные часы работы'
        }),
        ('Социальные сети', {
            'fields': ('instagram_url', 'facebook_url', 'twitter_url', 'x_url', 'telegram_url')
        }),
    )
    
    def has_add_permission(self, request):
        # Разрешаем добавление только если нет записей
        return not Header.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Запрещаем удаление, так как это единственная запись для шапки
        return False

class BackgroundVideoAdmin(admin.ModelAdmin):
    list_display = ['video_name', 'video', 'video_preview']
    list_filter = ['video_name']
    search_fields = ['video_name']
    readonly_fields = ['video_preview']
    save_on_top = True
    list_per_page = 25
    
    def video_preview(self, obj):
        """Превью видео"""
        if obj.video:
            return format_html(
                '<video src="{}" style="height:40px;border-radius:4px;object-fit:cover;" controls></video>', 
                obj.video.url
            )
        return '—'
    video_preview.short_description = 'Превью'
    
    fieldsets = (
        ('Информация о видео', {
            'fields': ('video_name', 'video'),
            'description': 'Загрузите фоновое видео для сайта'
        }),
    )


class AboutMeAdmin(admin.ModelAdmin):
    list_display = ['title_uk', 'subtitle_uk', 'photo_thumb']
    list_filter = ['title_uk']
    search_fields = ['title_uk', 'title_en', 'title_ru', 'subtitle_uk', 'subtitle_en', 'subtitle_ru', 'text_uk', 'text_en', 'text_ru']
    readonly_fields = ['photo_thumb']
    save_on_top = True
    list_per_page = 20
    
    fieldsets = (
        ('Українська мова', {
            'fields': ('subtitle_uk', 'title_uk', 'text_uk'),
            'description': 'Контент українською мовою'
        }),
        ('English', {
            'fields': ('subtitle_en', 'title_en', 'text_en'),
            'description': 'Content in English'
        }),
        ('Русский язык', {
            'fields': ('subtitle_ru', 'title_ru', 'text_ru'),
            'description': 'Контент на русском языке'
        }),
        ('Медіа', {
            'fields': ('photo_thumb', 'photo',),
            'description': 'Фотографія (загальна для всіх мов)'
        }),
    )
    
    def get_queryset(self, request):
        # Сортируем по ID в убывающем порядке (новые сверху)
        return super().get_queryset(request).order_by('-id')

    def photo_thumb(self, obj):
        if obj.photo:
            return format_html('<img src="{}" style="height:60px;border-radius:4px;object-fit:cover;" />', obj.photo.url)
        return '—'
    photo_thumb.short_description = 'Превью'


class ServicesForAdmin(admin.ModelAdmin):
    list_display = ['title_uk', 'subtitle_uk']
    list_filter = ['title_uk']
    search_fields = ['title_uk', 'title_en', 'title_ru', 'subtitle_uk', 'subtitle_en', 'subtitle_ru', 'description_uk', 'description_en', 'description_ru']
    save_on_top = True
    list_per_page = 20
    
    fieldsets = (
        ('Українська мова', {
            'fields': ('title_uk', 'subtitle_uk', 'description_uk'),
            'description': 'Контент українською мовою'
        }),
        ('English', {
            'fields': ('title_en', 'subtitle_en', 'description_en'),
            'description': 'Content in English'
        }),
        ('Русский язык', {
            'fields': ('title_ru', 'subtitle_ru', 'description_ru'),
            'description': 'Контент на русском языке'
        }),
    )


class ApplicationAdmin(FormsAdmin):
    list_display = ['name', 'phone_number', 'created_at', 'is_processed', 'status_badge']
    list_editable = ['is_processed']
    list_filter = [StatusFilter, DateRangeFilter, 'created_at']
    search_fields = ['name', 'phone_number']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Информация о заявке', {
            'fields': ('name', 'phone_number', 'created_at', 'is_processed'),
            'description': 'Основная информация о заявке'
        }),
    )
    
    def get_queryset(self, request):
        # Сортируем по дате создания (новые сверху)
        return super().get_queryset(request).order_by('-created_at')


class FreeConsultationAdmin(FormsAdmin):
    list_display = ['name', 'phone_number', 'city', 'created_at', 'is_processed', 'status_badge', 'question_preview']
    list_editable = ['is_processed']
    list_filter = [StatusFilter, DateRangeFilter, 'city', 'created_at']
    search_fields = ['name', 'phone_number', 'city', 'question']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Информация о клиенте', {
            'fields': ('name', 'phone_number', 'city'),
            'description': 'Контактная информация клиента'
        }),
        ('Вопрос', {
            'fields': ('question',),
            'description': 'Вопрос от клиента'
        }),
        ('Статус', {
            'fields': ('is_processed', 'created_at'),
            'description': 'Статус обработки заявки'
        }),
    )
    
    def get_queryset(self, request):
        # Сортируем по дате создания (новые сверху)
        return super().get_queryset(request).order_by('-created_at')
    
    def question_preview(self, obj):
        """Предпросмотр вопроса"""
        if len(obj.question) > 50:
            return obj.question[:50] + '...'
        return obj.question
    question_preview.short_description = 'Предпросмотр вопроса'
    


class ContactUsAdmin(FormsAdmin):
    list_display = ['name', 'phone_number', 'created_at', 'is_processed', 'status_badge', 'question_preview']
    list_editable = ['is_processed']
    list_filter = [StatusFilter, DateRangeFilter, 'created_at']
    search_fields = ['name', 'phone_number', 'question']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Информация о клиенте', {
            'fields': ('name', 'phone_number'),
            'description': 'Контактная информация клиента'
        }),
        ('Вопрос', {
            'fields': ('question',),
            'description': 'Вопрос от клиента'
        }),
        ('Статус', {
            'fields': ('is_processed', 'created_at'),
            'description': 'Статус обработки обращения'
        }),
    )
    
    def get_queryset(self, request):
        # Сортируем по дате создания (новые сверху)
        return super().get_queryset(request).order_by('-created_at')
    
    def question_preview(self, obj):
        """Предпросмотр вопроса"""
        if len(obj.question) > 50:
            return obj.question[:50] + '...'
        return obj.question
    question_preview.short_description = 'Предпросмотр вопроса'
    


class VideoInterviewAdmin(admin.ModelAdmin):
    list_display = ['title_video_uk', 'video_thumb']
    list_filter = ['title_video_uk']
    search_fields = ['title_video_uk', 'title_video_en', 'title_video_ru', 'text_video_uk', 'text_video_en', 'text_video_ru']
    readonly_fields = ['video_thumb']
    save_on_top = True
    list_per_page = 20
    
    fieldsets = (
        ('Українська мова', {
            'fields': ('title_video_uk', 'text_video_uk'),
            'description': 'Контент українською мовою'
        }),
        ('English', {
            'fields': ('title_video_en', 'text_video_en'),
            'description': 'Content in English'
        }),
        ('Русский язык', {
            'fields': ('title_video_ru', 'text_video_ru'),
            'description': 'Контент на русском языке'
        }),
        ('Відео', {
            'fields': ('video_thumb', 'video'),
            'description': 'Відеофайл (загальний для всіх мов)'
        }),
    )
    
    def video_thumb(self, obj):
        if obj.video:
            return format_html('<video src="{}" style="height:60px;border-radius:4px;object-fit:cover;" controls></video>', obj.video.url)
        return '—'
    video_thumb.short_description = 'Превью'


class ReviewAdmin(BaseAdmin):
    list_display = ['name', 'service', 'rating', 'created_at', 'is_approved', 'is_published', 'status_badge', 'review_preview']
    list_filter = [ReviewStatusFilter, DateRangeFilter, 'rating', 'service', 'created_at']
    search_fields = ['name', 'text', 'service']
    readonly_fields = ['created_at']
    list_editable = ['is_approved', 'is_published']
    list_per_page = 25
    date_hierarchy = 'created_at'
    
    def status_badge(self, obj):
        """Цветной индикатор статуса отзыва"""
        if obj.is_published:
            return format_html('<span style="color: green; font-weight: bold;">✓ Опубликовано</span>')
        elif obj.is_approved:
            return format_html('<span style="color: orange; font-weight: bold;">✓ Одобрено</span>')
        else:
            return format_html('<span style="color: red; font-weight: bold;">⚠ На модерации</span>')
    status_badge.short_description = 'Статус'
    
    fieldsets = (
        ('Информация об отзыве', {
            'fields': ('name', 'service', 'rating', 'text'),
            'description': 'Основная информация об отзыве'
        }),
        ('Модерация', {
            'fields': ('is_approved', 'is_published', 'created_at'),
            'description': 'Управление публикацией отзыва'
        }),
    )
    
    def get_queryset(self, request):
        # Сортируем по дате создания (новые сверху)
        return super().get_queryset(request).order_by('-created_at')
    
    def review_preview(self, obj):
        """Предпросмотр текста отзыва"""
        if len(obj.text) > 50:
            return obj.text[:50] + '...'
        return obj.text
    review_preview.short_description = 'Предпросмотр'
    
    actions = ['approve_reviews', 'publish_reviews', 'unpublish_reviews', 'export_reviews_to_csv']
    
    def approve_reviews(self, request, queryset):
        """Одобрить выбранные отзывы"""
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'{updated} отзыв(ов) одобрено.')
    approve_reviews.short_description = 'Одобрить выбранные отзывы'
    
    def publish_reviews(self, request, queryset):
        """Опубликовать выбранные отзывы"""
        updated = queryset.update(is_approved=True, is_published=True)
        self.message_user(request, f'{updated} отзыв(ов) опубликовано.')
    publish_reviews.short_description = 'Опубликовать выбранные отзывы'
    
    def unpublish_reviews(self, request, queryset):
        """Снять с публикации выбранные отзывы"""
        updated = queryset.update(is_published=False)
        self.message_user(request, f'{updated} отзыв(ов) снято с публикации.')
    unpublish_reviews.short_description = 'Снять с публикации'
    
    def export_reviews_to_csv(self, request, queryset):
        """Экспорт выбранных отзывов в CSV"""
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="reviews.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Имя', 'Услуга', 'Рейтинг', 'Текст отзыва', 'Дата создания', 'Статус'])
        
        for obj in queryset:
            status = 'Опубликовано' if obj.is_published else ('Одобрено' if obj.is_approved else 'На модерации')
            writer.writerow([
                obj.name,
                obj.service,
                obj.rating,
                obj.text[:200] + '...' if len(obj.text) > 200 else obj.text,
                obj.created_at.strftime('%d.%m.%Y %H:%M'),
                status
            ])
        
        return response
    export_reviews_to_csv.short_description = 'Экспорт отзывов в CSV'


class FrequentlyAskedQuestionAdmin(ContentAdmin):
    list_display = ['question_ua', 'order', 'is_published', 'status_badge', 'created_at']
    list_editable = ['order', 'is_published']
    list_filter = ['is_published', 'created_at']
    search_fields = ['question_ua', 'question_ru', 'question_en', 'answer_ua', 'answer_ru', 'answer_en']
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 20
    
    def status_badge(self, obj):
        """Цветной индикатор статуса"""
        if obj.is_published:
            return format_html('<span style="color: green; font-weight: bold;">✓ Опубликовано</span>')
        else:
            return format_html('<span style="color: red; font-weight: bold;">⚠ Скрыто</span>')
    status_badge.short_description = 'Статус'

    fieldsets = (
        ('Українська мова', {
            'fields': ('question_ua', 'answer_ua'),
            'description': 'Питання та відповідь українською мовою'
        }),
        ('Русский язык', {
            'fields': ('question_ru', 'answer_ru'),
            'description': 'Вопрос и ответ на русском языке'
        }),
        ('English', {
            'fields': ('question_en', 'answer_en'),
            'description': 'Question and answer in English'
        }),
        ('Параметры', {
            'fields': ('order', 'is_published', 'created_at', 'updated_at'),
            'description': 'Порядок и публикация'
        }),
    )

class LegalDocumentAdmin(ContentAdmin):
    list_display = ['key', 'title_ua', 'updated_at']
    list_filter = ['key', 'updated_at']
    search_fields = ['title_ua', 'title_ru', 'title_en', 'content_ua', 'content_ru', 'content_en']
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 20

    fieldsets = (
        ('Параметры', {
            'fields': ('key', 'created_at', 'updated_at'),
            'description': 'Тип документа и метаданные'
        }),
        ('Українська мова', {
            'fields': ('title_ua', 'content_ua'),
        }),
        ('Русский язык', {
            'fields': ('title_ru', 'content_ru'),
        }),
        ('English', {
            'fields': ('title_en', 'content_en'),
        }),
    )

class ServiceFeatureInline(admin.TabularInline):
    model = ServiceFeature
    extra = 1
    fields = ('order', 'text_ua', 'text_ru', 'text_en')
    ordering = ['order']
    
    class Media:
        css = {
            'all': ('admin/css/forms.css',)
        }


class ServiceCategoryAdmin(MPTTModelAdmin):
    prepopulated_fields = {
        "nav_id": ("label_en",),
        "slug_ua": ("label_ua",),
        "slug_ru": ("label_ua",),
        "slug_en": ("label_en",),
    }
    exclude = ('component',)
    inlines = [ServiceFeatureInline]

    list_display = (
        'label_ua',
        'parent',
        'kind',
        'show_in_menu',
        'order',
        # 'created_at',
        # 'updated_at',
    )
    list_editable = ('parent', 'kind', 'order', 'show_in_menu',)

    search_fields = ('label_ua', 'label_ru', 'label_en', 'nav_id')
    list_filter = ('kind', 'show_in_menu',)

    # Чтобы дерево можно было редактировать drag&drop
    mptt_level_indent = 30
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        """
        Ограничиваем выбор родительских категорий, исключая категории 3-го уровня
        """
        if db_field.name == "parent":
            # Исключаем категории с level >= 2 (3-й уровень вложенности)
            kwargs["queryset"] = ServiceCategory.objects.filter(level__lt=2)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    
    def get_form(self, request, obj=None, **kwargs):
        """
        Кастомизируем форму в зависимости от того, является ли категория корневой
        """
        form = super().get_form(request, obj, **kwargs)
        
        # Скрываем поле show_mega_panel для всех категорий, кроме корневых
        if 'show_mega_panel' in form.base_fields:
            # Если это существующая категория и она не корневая, скрываем поле
            if obj and obj.parent is not None:
                form.base_fields['show_mega_panel'].widget = forms.HiddenInput()
                form.base_fields['show_mega_panel'].initial = False
            # Если это новая категория, скрываем поле по умолчанию
            elif obj is None:
                form.base_fields['show_mega_panel'].widget = forms.HiddenInput()
                form.base_fields['show_mega_panel'].initial = False
        
        return form
    
    def show_mega_panel_display(self, obj):
        """
        Показываем поле show_mega_panel только для корневых категорий
        """
        if obj.parent is None:
            return "✓" if obj.show_mega_panel else "✗"
        else:
            return "—"  # Не применимо для дочерних категорий
    show_mega_panel_display.short_description = "Мега-панель"
    show_mega_panel_display.admin_order_field = 'show_mega_panel'
    
    def hero_image_preview(self, obj):
        """
        Превью главного изображения
        """
        if obj.hero_image:
            return format_html('<img src="{}" style="height:40px;border-radius:4px;object-fit:cover;" />', obj.hero_image.url)
        return '—'
    
    
    def save_model(self, request, obj, form, change):
        """
        Автоматически управляем show_in_menu для дочерних категорий
        """
        # Если это дочерняя категория или новая категория (которая станет дочерней), 
        # принудительно устанавливаем show_mega_panel = False
        if obj.parent is not None:
            obj.show_mega_panel = False
        
        # Сохраняем объект
        super().save_model(request, obj, form, change)
        
        # Если убираем галочку show_in_menu у родительской категории
        if not obj.show_in_menu:
            # Убираем галочки у всех дочерних категорий
            descendants = obj.get_descendants()
            descendants.update(show_in_menu=False)
            
        # Если ставим галочку show_in_menu у родительской категории
        elif obj.show_in_menu:
            # Ставим галочки у всех дочерних категорий
            descendants = obj.get_descendants()
            descendants.update(show_in_menu=True)

# Админ-классы для блога
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ("name_ua", "show_in_filters", "order")
    list_editable = ("show_in_filters", "order")
    search_fields = ("name_ua", "name_ru", "name_en")
    prepopulated_fields = {
        "slug_ua": ("name_ua",),
        "slug_ru": ("name_ru",),
        "slug_en": ("name_en",),
    }
    save_on_top = True
    list_per_page = 25

class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title_ua", "status", "published_at", "cover_preview")
    list_filter = ("status", "categories", "published_at")
    search_fields = ("title_ua", "title_ru", "title_en")
    filter_horizontal = ("categories",)
    date_hierarchy = "published_at"
    prepopulated_fields = {
        "slug_ua": ("title_ua",),
        "slug_ru": ("title_ru",),
        "slug_en": ("title_en",),
    }
    readonly_fields = ("cover_preview",)
    save_on_top = True
    list_per_page = 25
    
    def cover_preview(self, obj):
        """Превью обложки статьи"""
        if obj.cover:
            return format_html('<img src="{}" style="height:40px;border-radius:4px;object-fit:cover;" />', obj.cover.url)
        return '—'
    cover_preview.short_description = 'Обложка'

# Группировка моделей в админке
class NotariusAdminSite(admin.AdminSite):
    site_header = 'Панель администратора — Notarius'
    site_title = 'Админ — Notarius'
    index_title = 'Управление контентом'
    
    def get_app_list(self, request):
        """
        Кастомная группировка приложений в админке
        """
        app_list = super().get_app_list(request)
        
        # Создаем кастомные группы
        custom_groups = {
            '📞 ФОРМЫ ОБРАТНОЙ СВЯЗИ': {
                'models': ['Application', 'FreeConsultation', 'ContactUs'],
                'icon': 'fas fa-comments',
                'description': 'Заявки, консультации и обращения клиентов',
                'priority': 1  # Высокий приоритет - будет отображаться первым
            },
            '📝 БЛОГ': {
                'models': ['BlogCategory', 'BlogPost'],
                'icon': 'fas fa-blog',
                'description': 'Категории и статьи блога',
                'priority': 2
            },
            'Основной контент': {
                'models': ['Header', 'AboutMe', 'ServicesFor', 'VideoInterview', 'BackgroundVideo'],
                'icon': 'fas fa-home',
                'priority': 3
            },
            'Услуги и категории': {
                'models': ['ServiceCategory', 'ServiceFeature'],
                'icon': 'fas fa-list',
                'priority': 4
            },
            'Контент и отзывы': {
                'models': ['Review', 'FrequentlyAskedQuestion'],
                'icon': 'fas fa-star',
                'priority': 5
            }
        }
        
        # Реорганизуем список приложений
        reorganized_apps = []
        
        # Сортируем группы по приоритету (если указан)
        sorted_groups = sorted(custom_groups.items(), 
                             key=lambda x: x[1].get('priority', 999))
        
        for group_name, group_info in sorted_groups:
            group_models = []
            
            # Находим модели из группы в основном списке
            for app in app_list:
                # Ищем модели в main_page и blog приложениях
                if app['app_label'] in ['main_page', 'blog']:
                    for model in app['models']:
                        if model['object_name'] in group_info['models']:
                            # Добавляем кастомные настройки для моделей форм
                            if model['object_name'] in ['Application', 'FreeConsultation', 'ContactUs']:
                                model['admin_url'] = f"/admin/main_page/{model['object_name'].lower()}/"
                                model['add_url'] = f"/admin/main_page/{model['object_name'].lower()}/add/"
                            # Добавляем кастомные настройки для моделей блога
                            elif model['object_name'] in ['BlogCategory', 'BlogPost']:
                                model['admin_url'] = f"/admin/blog/{model['object_name'].lower()}/"
                                model['add_url'] = f"/admin/blog/{model['object_name'].lower()}/add/"
                            group_models.append(model)
            
            if group_models:
                reorganized_apps.append({
                    'name': group_name,
                    'app_label': f'group_{group_name.lower().replace(" ", "_").replace("📞", "forms")}',
                    'models': group_models,
                    'has_module_perms': True,
                    'icon': group_info['icon'],
                    'description': group_info.get('description', ''),
                    'priority': group_info.get('priority', 999)
                })
        
        return reorganized_apps

# Регистрируем кастомный админ-сайт
admin_site = NotariusAdminSite(name='notarius_admin')

# Регистрируем все модели в кастомном админ-сайте
admin_site.register(Header, HeaderAdmin)
admin_site.register(BackgroundVideo, BackgroundVideoAdmin)
admin_site.register(AboutMe, AboutMeAdmin)
admin_site.register(ServicesFor, ServicesForAdmin)
admin_site.register(Application, ApplicationAdmin)
admin_site.register(FreeConsultation, FreeConsultationAdmin)
admin_site.register(ContactUs, ContactUsAdmin)
admin_site.register(VideoInterview, VideoInterviewAdmin)
admin_site.register(Review, ReviewAdmin)
admin_site.register(FrequentlyAskedQuestion, FrequentlyAskedQuestionAdmin)
admin_site.register(ServiceCategory, ServiceCategoryAdmin)
admin_site.register(LegalDocument, LegalDocumentAdmin)

# Регистрируем модели блога
admin_site.register(BlogCategory, BlogCategoryAdmin)
admin_site.register(BlogPost, BlogPostAdmin)

# Кастомные представления для админки
class DashboardView:
    """Кастомная панель управления"""
    
    def __init__(self, admin_site):
        self.admin_site = admin_site
    
    def get_stats(self):
        """Получение статистики для дашборда"""
        try:
            from django.db.models import Count, Q
            from datetime import datetime, timedelta
            
            today = datetime.now().date()
            week_ago = today - timedelta(days=7)
            
            stats = {
                'total_applications': Application.objects.count(),
                'unprocessed_applications': Application.objects.filter(is_processed=False).count(),
                'total_consultations': FreeConsultation.objects.count(),
                'unprocessed_consultations': FreeConsultation.objects.filter(is_processed=False).count(),
                'total_contacts': ContactUs.objects.count(),
                'unprocessed_contacts': ContactUs.objects.filter(is_processed=False).count(),
                'total_reviews': Review.objects.count(),
                'pending_reviews': Review.objects.filter(is_approved=False).count(),
                'published_reviews': Review.objects.filter(is_published=True).count(),
                'recent_applications': Application.objects.filter(created_at__date__gte=week_ago).count(),
            }
            
            return stats
        except Exception as e:
            return {
                'total_applications': 0,
                'unprocessed_applications': 0,
                'total_consultations': 0,
                'unprocessed_consultations': 0,
                'total_contacts': 0,
                'unprocessed_contacts': 0,
                'total_reviews': 0,
                'pending_reviews': 0,
                'published_reviews': 0,
                'recent_applications': 0,
            }

# Добавляем кастомные URL для админки
def get_admin_urls():
    """Кастомные URL для админки"""
    from django.urls import path
    from django.shortcuts import render
    from django.contrib.admin.views.decorators import staff_member_required
    
    @staff_member_required
    def dashboard_view(request):
        """Кастомная панель управления"""
        try:
            dashboard = DashboardView(admin.site)
            stats = dashboard.get_stats()
        except Exception as e:
            stats = {}
        
        context = {
            'title': 'Панель управления',
            'stats': stats,
            'has_permission': True,
        }
        
        return render(request, 'admin/dashboard.html', context)
    
    @staff_member_required
    def forms_dashboard_view(request):
        """Специальная панель для мониторинга форм обратной связи"""
        try:
            from datetime import datetime, timedelta
            
            today = datetime.now().date()
            week_ago = today - timedelta(days=7)
            
            # Статистика по формам
            forms_stats = {
                'total_applications': Application.objects.count(),
                'unprocessed_applications': Application.objects.filter(is_processed=False).count(),
                'today_applications': Application.objects.filter(created_at__date=today).count(),
                'week_applications': Application.objects.filter(created_at__date__gte=week_ago).count(),
                
                'total_consultations': FreeConsultation.objects.count(),
                'unprocessed_consultations': FreeConsultation.objects.filter(is_processed=False).count(),
                'today_consultations': FreeConsultation.objects.filter(created_at__date=today).count(),
                'week_consultations': FreeConsultation.objects.filter(created_at__date__gte=week_ago).count(),
                
                'total_contacts': ContactUs.objects.count(),
                'unprocessed_contacts': ContactUs.objects.filter(is_processed=False).count(),
                'today_contacts': ContactUs.objects.filter(created_at__date=today).count(),
                'week_contacts': ContactUs.objects.filter(created_at__date__gte=week_ago).count(),
            }
            
            # Последние необработанные заявки
            recent_unprocessed = {
                'applications': Application.objects.filter(is_processed=False).order_by('-created_at')[:5],
                'consultations': FreeConsultation.objects.filter(is_processed=False).order_by('-created_at')[:5],
                'contacts': ContactUs.objects.filter(is_processed=False).order_by('-created_at')[:5],
            }
            
        except Exception as e:
            forms_stats = {}
            recent_unprocessed = {}
        
        context = {
            'title': '📞 Мониторинг форм обратной связи',
            'forms_stats': forms_stats,
            'recent_unprocessed': recent_unprocessed,
            'has_permission': True,
        }
        
        return render(request, 'admin/forms_dashboard.html', context)
    
    @staff_member_required
    def forms_management_view(request):
        """Главная панель управления формами обратной связи"""
        try:
            from datetime import datetime, timedelta
            
            today = datetime.now().date()
            week_ago = today - timedelta(days=7)
            
            # Полная статистика по всем формам
            forms_data = {
                'applications': {
                    'total': Application.objects.count(),
                    'unprocessed': Application.objects.filter(is_processed=False).count(),
                    'today': Application.objects.filter(created_at__date=today).count(),
                    'week': Application.objects.filter(created_at__date__gte=week_ago).count(),
                    'recent': Application.objects.filter(is_processed=False).order_by('-created_at')[:5]
                },
                'consultations': {
                    'total': FreeConsultation.objects.count(),
                    'unprocessed': FreeConsultation.objects.filter(is_processed=False).count(),
                    'today': FreeConsultation.objects.filter(created_at__date=today).count(),
                    'week': FreeConsultation.objects.filter(created_at__date__gte=week_ago).count(),
                    'recent': FreeConsultation.objects.filter(is_processed=False).order_by('-created_at')[:5]
                },
                'contacts': {
                    'total': ContactUs.objects.count(),
                    'unprocessed': ContactUs.objects.filter(is_processed=False).count(),
                    'today': ContactUs.objects.filter(created_at__date=today).count(),
                    'week': ContactUs.objects.filter(created_at__date__gte=week_ago).count(),
                    'recent': ContactUs.objects.filter(is_processed=False).order_by('-created_at')[:5]
                }
            }
            
            # Общая статистика
            total_forms = forms_data['applications']['total'] + forms_data['consultations']['total'] + forms_data['contacts']['total']
            total_unprocessed = forms_data['applications']['unprocessed'] + forms_data['consultations']['unprocessed'] + forms_data['contacts']['unprocessed']
            
        except Exception as e:
            forms_data = {}
            total_forms = 0
            total_unprocessed = 0
        
        context = {
            'title': '📞 Управление формами обратной связи',
            'forms_data': forms_data,
            'total_forms': total_forms,
            'total_unprocessed': total_unprocessed,
            'has_permission': True,
        }
        
        return render(request, 'admin/forms_management.html', context)
    
    return [
        path('dashboard/', dashboard_view, name='admin_dashboard'),
        path('forms-dashboard/', forms_dashboard_view, name='admin_forms_dashboard'),
        path('forms-management/', forms_management_view, name='admin_forms_management'),
    ]

# Кастомизация брендинга админки
admin.site.site_header = 'Панель администратора — Notarius'
admin.site.site_title = 'Админ — Notarius'
admin.site.index_title = 'Управление контентом'

# Добавляем кастомные URL
original_get_urls = admin.site.get_urls
admin.site.get_urls = lambda: get_admin_urls() + original_get_urls()
