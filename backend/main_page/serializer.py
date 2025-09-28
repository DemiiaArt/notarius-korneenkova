from rest_framework import serializers
from .models import Header, BackgroundVideo, AboutMe, ServiceCategory

class HeaderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Header
        fields = [
            'email', 
            'phone_number', 
            'phone_number_2', 
            'address_ua', 
            'address_en', 
            'address_ru'
        ]

class BackgroundVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BackgroundVideo
        fields = ['id', 'video_name', 'video']

class AboutMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutMe
        fields = [
            'id', 
            'subtitle_uk', 'subtitle_en', 'subtitle_ru',
            'title_uk', 'title_en', 'title_ru',
            'text_uk', 'text_en', 'text_ru',
            'photo'
        ]


class ServiceCategorySerializer(serializers.ModelSerializer):
    """
    Сериализатор для ServiceCategory, формирующий структуру как в nav-tree.js
    """
    # Формируем структуру label как объект с языками
    label = serializers.SerializerMethodField()
    
    # Формируем структуру slug как объект с языками
    slug = serializers.SerializerMethodField()
    # Рекурсивно включаем дочерние элементы
    children = serializers.SerializerMethodField()
    
    class Meta:
        model = ServiceCategory
        fields = [
            'id', 'kind', 'label', 'slug', 'show_in_menu', 'component', 'children'
        ]
    
    def get_label(self, obj):
        """Формируем объект label с языками как в nav-tree.js"""
        return {
            'ua': obj.label_ua,
            'ru': obj.label_ru,
            'en': obj.label_en
        }
    
    def get_slug(self, obj):
        """Формируем объект slug с языками как в nav-tree.js"""
        return {
            'ua': obj.slug_ua,
            'ru': obj.slug_ru,
            'en': obj.slug_en
        }
    
    def get_children(self, obj):
        """Рекурсивно получаем дочерние элементы"""
        children = obj.get_children()
        if children.exists():
            return ServiceCategorySerializer(children, many=True, context=self.context).data
        return []
    
    def to_representation(self, instance):
        """Переопределяем представление для соответствия структуре nav-tree.js"""
        data = super().to_representation(instance)
        
        # Добавляем nav_id как id (соответствует структуре nav-tree.js)
        data['id'] = instance.nav_id
        
        # Убираем лишние поля, которые не нужны в JSON
        # data.pop('id', None)  # Убираем Django ID
        
        return data
