from django.contrib import admin
from django import forms
from .models import Header, BackgroundVideo, AboutMe, Services, ServiceDescription
from ckeditor_uploader.widgets import CKEditorUploadingWidget

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
    list_display = ['video_name', 'video']
    list_filter = ['video_name']
    search_fields = ['video_name']
    
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
    form = AboutMeForm
    list_display = ['title_uk', 'subtitle_uk']
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
    
    def get_queryset(self, request):
        # Сортируем по ID в убывающем порядке (новые сверху)
        return super().get_queryset(request).order_by('-id')


class ServiceDescriptionInline(admin.TabularInline):
    model = ServiceDescription
    extra = 1
    fields = ('text_uk', 'text_en', 'text_ru')


@admin.register(Services)
class ServicesAdmin(admin.ModelAdmin):
    list_display = ['title_uk', 'title_en', 'title_ru', 'image']
    search_fields = ['title_uk', 'title_en', 'title_ru']
    inlines = [ServiceDescriptionInline]


class ServiceDescriptionForm(forms.ModelForm):
    text_uk = forms.CharField(widget=CKEditorUploadingWidget())
    text_en = forms.CharField(widget=CKEditorUploadingWidget())
    text_ru = forms.CharField(widget=CKEditorUploadingWidget())

    class Meta:
        model = ServiceDescription
        fields = '__all__'


@admin.register(ServiceDescription)
class ServiceDescriptionAdmin(admin.ModelAdmin):
    form = ServiceDescriptionForm
    list_display = ['service']
    autocomplete_fields = ['service']
    search_fields = ['service__title_uk', 'service__title_en', 'service__title_ru']

from mptt.admin import DraggableMPTTAdmin
from .models import ServiceCategory


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(DraggableMPTTAdmin):
    mptt_indent_field = "label_ua"  # поле, по которому будут рисоваться отступы
    prepopulated_fields = {
        "nav_id": ("label_en",),
        "slug_ua": ("label_ua",),
        "slug_ru": ("label_ua",),
        "slug_en": ("label_en",),
    }

    list_display = (
        'tree_actions',       # кнопки перемещения (из MPTT)
        'indented_title',     # красиво отрисованное дерево
        'kind',
        'nav_id',
        'show_in_menu',
        'order',
        'created_at',
        'updated_at',
    )
    list_display_links = ('indented_title',)

    list_editable = ('order', 'show_in_menu',)

    search_fields = ('label_ua', 'label_ru', 'label_en', 'nav_id')
    list_filter = ('kind', 'show_in_menu')

    # Чтобы дерево можно было редактировать drag&drop
    mptt_level_indent = 20

    def indented_title(self, instance):
        """Название с учётом вложенности"""
        return instance.label_ua
    indented_title.short_description = "Название (UA)"