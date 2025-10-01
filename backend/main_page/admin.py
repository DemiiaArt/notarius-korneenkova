from django.contrib import admin
from django.utils.html import format_html
from .models import Header, BackgroundVideo, AboutMe, ServicesFor, Application, VideoInterview, Review

@admin.register(Header)
class HeaderAdmin(admin.ModelAdmin):
    list_display = ['email', 'phone_number', 'phone_number_2', 'address_ua', 'address_en', 'address_ru']
    list_filter = ['email']
    search_fields = ['email', 'phone_number', 'phone_number_2']
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
    )
    
    def has_add_permission(self, request):
        # Разрешаем добавление только если нет записей
        return not Header.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Запрещаем удаление, так как это единственная запись для шапки
        return False

@admin.register(BackgroundVideo)
class BackgroundVideoAdmin(admin.ModelAdmin):
    list_display = ['video_name', 'video']
    list_filter = ['video_name']
    search_fields = ['video_name']
    save_on_top = True
    list_per_page = 25
    
    fieldsets = (
        ('Информация о видео', {
            'fields': ('video_name', 'video'),
            'description': 'Загрузите фоновое видео для сайта'
        }),
    )

@admin.register(AboutMe)
class AboutMeAdmin(admin.ModelAdmin):
    list_display = ['title_uk', 'subtitle_uk', 'photo_thumb']
    list_filter = ['title_uk']
    search_fields = ['title_uk', 'title_en', 'title_ru', 'subtitle_uk', 'subtitle_en', 'subtitle_ru']
    readonly_fields = ['photo_thumb']
    save_on_top = True
    list_per_page = 25
    
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


@admin.register(ServicesFor)
class ServicesForAdmin(admin.ModelAdmin):
    list_display = ['title_uk', 'subtitle_uk']
    list_filter = ['title_uk']
    search_fields = ['title_uk', 'title_en', 'title_ru', 'subtitle_uk', 'subtitle_en', 'subtitle_ru']
    save_on_top = True
    list_per_page = 25
    
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


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone_number', 'created_at', 'is_processed']
    list_filter = ['is_processed', 'created_at']
    search_fields = ['name', 'phone_number']
    readonly_fields = ['created_at']
    list_editable = ['is_processed']
    save_on_top = True
    list_per_page = 25
    
    fieldsets = (
        ('Информация о заявке', {
            'fields': ('name', 'phone_number', 'created_at', 'is_processed'),
            'description': 'Основная информация о заявке'
        }),
    )
    
    def get_queryset(self, request):
        # Сортируем по дате создания (новые сверху)
        return super().get_queryset(request).order_by('-created_at')


@admin.register(VideoInterview)
class VideoInterviewAdmin(admin.ModelAdmin):
    list_display = ['title_video_uk', 'video_thumb']
    list_filter = ['title_video_uk']
    search_fields = ['title_video_uk', 'title_video_en', 'title_video_ru']
    readonly_fields = ['video_thumb']
    save_on_top = True
    list_per_page = 25
    
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


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['name', 'service', 'rating', 'created_at', 'is_approved', 'is_published', 'review_preview']
    list_filter = ['is_approved', 'is_published', 'rating', 'service', 'created_at']
    search_fields = ['name', 'text']
    readonly_fields = ['created_at']
    list_editable = ['is_approved', 'is_published']
    save_on_top = True
    list_per_page = 25
    date_hierarchy = 'created_at'
    
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
    
    actions = ['approve_reviews', 'publish_reviews', 'unpublish_reviews']
    
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


# Кастомизация брендинга админки
admin.site.site_header = 'Панель администратора — Notarius'
admin.site.site_title = 'Админ — Notarius'
admin.site.index_title = 'Управление контентом'