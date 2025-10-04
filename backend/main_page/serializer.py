from rest_framework import serializers
from .models import (
    Header, BackgroundVideo, AboutMe, ServiceCategory,
    ServicesFor, Application, VideoInterview, Review, FreeConsultation, ContactUs
)



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
        """Получаем только прямых дочерних элементов (не всех потомков)"""
        # Используем children.all() вместо get_children() для получения только прямых детей
        direct_children = obj.children.filter(show_in_menu=True).order_by('order')
        if direct_children.exists():
            return ServiceCategorySerializer(direct_children, many=True, context=self.context).data
        return []
    
    def to_representation(self, instance):
        """Переопределяем представление для соответствия структуре nav-tree.js"""
        data = super().to_representation(instance)
        
        # Добавляем nav_id как id (соответствует структуре nav-tree.js)
        data['id'] = instance.nav_id
        
        # Убираем лишние поля, которые не нужны в JSON
        # data.pop('id', None)  # Убираем Django ID
        
        return data


class ServiceCategoryDetailSerializer(serializers.ModelSerializer):
    """
    Детальный сериализатор для категории услуг: только титул и описание (3 языка).
    """
    label = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = ServiceCategory
        fields = ['label', 'description']

    def get_label(self, obj):
        return {
            'ua': obj.label_ua,
            'ru': obj.label_ru,
            'en': obj.label_en,
        }

    def get_description(self, obj):
        return {
            'ua': getattr(obj, 'description_ua', ''),
            'ru': getattr(obj, 'description_ru', ''),
            'en': getattr(obj, 'description_en', ''),
        }
class ServicesForSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicesFor
        fields = [
            'id',
            'title_uk', 'title_en', 'title_ru',
            'subtitle_uk', 'subtitle_en', 'subtitle_ru',
            'description_uk', 'description_en', 'description_ru'
        ]


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = [
            'id',
            'name',
            'phone_number',
            'created_at',
            'is_processed'
        ]
        read_only_fields = ['id', 'created_at', 'is_processed']


class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['name', 'phone_number']


class VideoInterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoInterview
        fields = [
            'id',
            'title_video_uk', 'title_video_en', 'title_video_ru',
            'text_video_uk', 'text_video_en', 'text_video_ru',
            'video'
        ]


class ReviewSerializer(serializers.ModelSerializer):
    """
    Сериализатор для отображения отзывов
    """
    service_display = serializers.CharField(source='get_service_display', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id',
            'name',
            'service',
            'service_display',
            'rating',
            'text',
            'created_at',
            'is_approved',
            'is_published'
        ]
        read_only_fields = ['id', 'created_at', 'is_approved', 'is_published']


class ReviewCreateSerializer(serializers.ModelSerializer):
    """
    Сериализатор для создания отзывов
    """
    class Meta:
        model = Review
        fields = ['name', 'service', 'rating', 'text']
    
    def validate_rating(self, value):
        """
        Проверка, что рейтинг в диапазоне от 1 до 5
        """
        if value < 1 or value > 5:
            raise serializers.ValidationError("Рейтинг должен быть от 1 до 5")
        return value
    
    def validate_text(self, value):
        """
        Проверка текста отзыва
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Текст отзыва не может быть пустым")
        
        if len(value) < 10:
            raise serializers.ValidationError("Текст отзыва должен содержать минимум 10 символов")
        
        if len(value) > 2000:
            raise serializers.ValidationError("Текст отзыва не должен превышать 2000 символов")
        
        return value.strip()
    
    def validate_name(self, value):
        """
        Проверка имени
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Имя не может быть пустым")
        
        if len(value) < 2:
            raise serializers.ValidationError("Имя должно содержать минимум 2 символа")
        
        if len(value) > 255:
            raise serializers.ValidationError("Имя не должно превышать 255 символов")
        
        return value.strip()


class FreeConsultationSerializer(serializers.ModelSerializer):
    """
    Сериализатор для отображения бесплатных консультаций
    """
    class Meta:
        model = FreeConsultation
        fields = [
            'id',
            'name',
            'phone_number',
            'city',
            'question',
            'created_at',
            'is_processed'
        ]
        read_only_fields = ['id', 'created_at', 'is_processed']


class FreeConsultationCreateSerializer(serializers.ModelSerializer):
    """
    Сериализатор для создания запроса на бесплатную консультацию
    """
    class Meta:
        model = FreeConsultation
        fields = ['name', 'phone_number', 'city', 'question']
    
    def validate_name(self, value):
        """
        Проверка имени
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Имя не может быть пустым")
        
        if len(value) < 2:
            raise serializers.ValidationError("Имя должно содержать минимум 2 символа")
        
        if len(value) > 255:
            raise serializers.ValidationError("Имя не должно превышать 255 символов")
        
        return value.strip()
    
    def validate_phone_number(self, value):
        """
        Проверка номера телефона
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Номер телефона не может быть пустым")
        
        # Удаляем пробелы и спецсимволы для проверки
        cleaned = value.strip().replace(' ', '').replace('-', '').replace('(', '').replace(')', '').replace('+', '')
        
        if len(cleaned) < 9:
            raise serializers.ValidationError("Номер телефона слишком короткий")
        
        if len(value) > 20:
            raise serializers.ValidationError("Номер телефона не должен превышать 20 символов")
        
        return value.strip()
    
    def validate_city(self, value):
        """
        Проверка города
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Город не может быть пустым")
        
        if len(value) < 2:
            raise serializers.ValidationError("Название города должно содержать минимум 2 символа")
        
        if len(value) > 255:
            raise serializers.ValidationError("Название города не должно превышать 255 символов")
        
        return value.strip()
    
    def validate_question(self, value):
        """
        Проверка вопроса
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Вопрос не может быть пустым")
        
        if len(value) < 10:
            raise serializers.ValidationError("Вопрос должен содержать минимум 10 символов")
        
        if len(value) > 5000:
            raise serializers.ValidationError("Вопрос не должен превышать 5000 символов")
        
        return value.strip()


class ContactUsSerializer(serializers.ModelSerializer):
    """
    Сериализатор для отображения обращений через форму контактов
    """
    class Meta:
        model = ContactUs
        fields = [
            'id',
            'name',
            'phone_number',
            'question',
            'created_at',
            'is_processed'
        ]
        read_only_fields = ['id', 'created_at', 'is_processed']


class ContactUsCreateSerializer(serializers.ModelSerializer):
    """
    Сериализатор для создания запроса через форму контактов
    """
    class Meta:
        model = ContactUs
        fields = ['name', 'phone_number', 'question']
    
    def validate_name(self, value):
        """
        Проверка имени
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Имя не может быть пустым")
        
        if len(value) < 2:
            raise serializers.ValidationError("Имя должно содержать минимум 2 символа")
        
        if len(value) > 255:
            raise serializers.ValidationError("Имя не должно превышать 255 символов")
        
        return value.strip()
    
    def validate_phone_number(self, value):
        """
        Проверка номера телефона
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Номер телефона не может быть пустым")
        
        # Удаляем пробелы и спецсимволы для проверки
        cleaned = value.strip().replace(' ', '').replace('-', '').replace('(', '').replace(')', '').replace('+', '')
        
        if len(cleaned) < 9:
            raise serializers.ValidationError("Номер телефона слишком короткий")
        
        if len(value) > 20:
            raise serializers.ValidationError("Номер телефона не должен превышать 20 символов")
        
        return value.strip()
    
    def validate_question(self, value):
        """
        Проверка вопроса
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Вопрос не может быть пустым")
        
        if len(value) < 10:
            raise serializers.ValidationError("Вопрос должен содержать минимум 10 символов")
        
        if len(value) > 5000:
            raise serializers.ValidationError("Вопрос не должен превышать 5000 символов")
        
        return value.strip()
