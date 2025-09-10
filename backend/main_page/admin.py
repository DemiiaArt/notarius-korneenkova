from django.contrib import admin
from .models import Header, BackgroundVideo, AboutMe

@admin.register(Header)
class HeaderAdmin(admin.ModelAdmin):
    list_display = ['email', 'phone_number', 'phone_number_2', 'address_ua', 'address_en', 'address_ru']
    list_filter = ['email']
    search_fields = ['email', 'phone_number', 'phone_number_2']
    
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
    list_display = ['video_name', 'video', 'upload_date']
    list_filter = ['video_name']
    search_fields = ['video_name']
    
    fieldsets = (
        ('Информация о видео', {
            'fields': ('video_name', 'video'),
            'description': 'Загрузите фоновое видео для сайта'
        }),
    )
    
    readonly_fields = ['upload_date']
    
    def upload_date(self, obj):
        if obj.id:
            return obj.video.storage.get_created_time(obj.video.name)
        return 'Не загружено'
    upload_date.short_description = 'Дата загрузки'

@admin.register(AboutMe)
class AboutMeAdmin(admin.ModelAdmin):
    list_display = ['title_uk', 'subtitle_uk', 'created_at']
    list_filter = ['title_uk']
    search_fields = ['title_uk', 'title_en', 'title_ru', 'subtitle_uk', 'subtitle_en', 'subtitle_ru']
    
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
            'fields': ('photo',),
            'description': 'Фотографія (загальна для всіх мов)'
        }),
    )
    
    readonly_fields = ['created_at']
    
    def created_at(self, obj):
        if obj.id:
            return obj.id  # Используем ID как индикатор времени создания
        return 'Не создано'
    created_at.short_description = 'Порядок создания'
    
    def get_queryset(self, request):
        # Сортируем по ID в убывающем порядке (новые сверху)
        return super().get_queryset(request).order_by('-id')
