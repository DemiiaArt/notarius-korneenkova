from django.contrib import admin
from django import forms
from mptt.admin import MPTTModelAdmin
from .models import Header, BackgroundVideo, AboutMe, ServiceCategory, ServiceFeature
from ckeditor_uploader.widgets import CKEditorUploadingWidget
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

class AboutMeForm(forms.ModelForm):
    text_uk = forms.CharField(widget=CKEditorUploadingWidget())
    text_en = forms.CharField(widget=CKEditorUploadingWidget())
    text_ru = forms.CharField(widget=CKEditorUploadingWidget())

    class Meta:
        model = AboutMe
        fields = '__all__'


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


class ServiceFeatureInline(admin.TabularInline):
    model = ServiceFeature
    extra = 1
    fields = ('order', 'text_ua', 'text_ru', 'text_en')
    ordering = ['order']
    
    class Media:
        css = {
            'all': ('admin/css/forms.css',)
        }


@admin.register(ServiceCategory)
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

# Кастомизация брендинга админки
admin.site.site_header = 'Панель администратора — Notarius'
admin.site.site_title = 'Админ — Notarius'
admin.site.index_title = 'Управление контентом'
