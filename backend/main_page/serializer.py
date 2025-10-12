from rest_framework import serializers
from .models import Header, BackgroundVideo, AboutMe, ServiceCategory, ServiceFeature
from .models import Header, BackgroundVideo, AboutMe, ServicesFor, Application, Review
from .models import (
    Header, BackgroundVideo, AboutMe, ServiceCategory,
    ServicesFor, Application, Review, FreeConsultation, ContactUs,
    FrequentlyAskedQuestion, AboutMeDetail, VideoBlock
)
from .models import Header
from .models import LegalDocument
from .models import QualificationBlock, QualificationCertificate, QualificationDiploma


class HeaderSerializer(serializers.ModelSerializer):
    # Многоязычное поле адреса, выбор через контекст (lang)
    address = serializers.SerializerMethodField()

    class Meta:
        model = Header
        fields = [
            'email', 
            'phone_number', 
            'phone_number_2', 
            'address'
        ]

    def get_address(self, obj):
        """Возвращает адрес в зависимости от выбранного языка.
        Если lang некорректный/не передан — возвращаем словарь всех языков.
        """
        lang = self.context.get('lang', 'ua')
        if lang in ['ua', 'ru', 'en']:
            mapping = {
                'ua': 'address_ua',
                'ru': 'address_ru',
                'en': 'address_en',
            }
            return getattr(obj, mapping[lang], '')
        # По умолчанию возвращаем украинский
        return obj.address_ua


class ContactsSerializer(serializers.ModelSerializer):
    address = serializers.SerializerMethodField()
    working_hours = serializers.SerializerMethodField()

    class Meta:
        model = Header
        fields = [
            'email', 'phone_number', 'phone_number_2',
            'address',
            'working_hours',
            'instagram_url', 'facebook_url', 'twitter_url', 'x_url', 'telegram_url'
        ]

    def _get_lang(self):
        lang = self.context.get('lang', 'ua')
        return lang if lang in ['ua', 'ru', 'en'] else 'ua'

    def get_address(self, obj):
        lang = self._get_lang()
        mapping = {
            'ua': 'address_ua',
            'ru': 'address_ru',
            'en': 'address_en',
        }
        return getattr(obj, mapping[lang], '')

    def get_working_hours(self, obj):
        lang = self._get_lang()
        mapping = {
            'ua': 'working_hours_ua',
            'ru': 'working_hours_ru',
            'en': 'working_hours_en',
        }
        value = getattr(obj, mapping[lang], None)
        # дефолт
        return value or 'Пн-Пт 9:00–18:00'

class BackgroundVideoSerializer(serializers.ModelSerializer):
    media_url = serializers.SerializerMethodField()
    
    class Meta:
        model = BackgroundVideo
        fields = ['id', 'name', 'media_type', 'media_url', 'is_active']
    
    def get_media_url(self, obj):
        """Возвращает URL медиа файла (видео или изображения)"""
        request = self.context.get('request')
        try:
            if obj.media_type == 'video' and obj.video:
                url = obj.video.url
                return request.build_absolute_uri(url) if request else url
            elif obj.media_type == 'image' and obj.image:
                url = obj.image.url
                return request.build_absolute_uri(url) if request else url
        except Exception:
            return None
        return None

class AboutMeSerializer(serializers.ModelSerializer):
    # Агрегированные поля с выбором языка через контекст
    subtitle = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    text = serializers.SerializerMethodField()

    # Возвращаем абсолютный URL для фото
    photo = serializers.SerializerMethodField()

    class Meta:
        model = AboutMe
        fields = [
            'id',
            'subtitle',
            'title',
            'text',
            'photo'
        ]

    def _get_lang(self):
        lang = self.context.get('lang', 'ua')
        return lang if lang in ['ua', 'ru', 'en'] else 'ua'

    def get_subtitle(self, obj):
        lang = self._get_lang()
        mapping = {
            'ua': 'subtitle_uk',
            'ru': 'subtitle_ru',
            'en': 'subtitle_en',
        }
        return getattr(obj, mapping[lang], '')

    def get_title(self, obj):
        lang = self._get_lang()
        mapping = {
            'ua': 'title_uk',
            'ru': 'title_ru',
            'en': 'title_en',
        }
        return getattr(obj, mapping[lang], '')

    def get_text(self, obj):
        lang = self._get_lang()
        mapping = {
            'ua': 'text_uk',
            'ru': 'text_ru',
            'en': 'text_en',
        }
        return getattr(obj, mapping[lang], '')

    def get_photo(self, obj):
        # Строим абсолютный URL картинки для фронтенда
        request = self.context.get('request')
        try:
            if obj.photo and hasattr(obj.photo, 'url'):
                url = obj.photo.url
                return request.build_absolute_uri(url) if request else url
        except Exception:
            return None
        return None


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
            'id', 'kind', 'label', 'slug', 'card_image', 'show_in_menu', 'show_mega_panel', 'component', 'children'
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
        children = obj.get_children().order_by('order')
        if children.exists():
            return ServiceCategorySerializer(children, many=True, context=self.context).data
        return []
    
    def to_representation(self, instance):
        """Переопределяем представление для соответствия структуре nav-tree.js"""
        data = super().to_representation(instance)
        
        # Добавляем nav_id как id (соответствует структуре nav-tree.js)
        data['id'] = instance.nav_id
        
        # Переименовываем show_in_menu в showInMenu для соответствия nav-tree.js
        if 'show_in_menu' in data:
            data['showInMenu'] = data.pop('show_in_menu')
        
        if 'show_mega_panel' in data and instance.parent==None:
            data['showMegaPanel'] = data.pop('show_mega_panel')
            data.pop('label')
            data.pop('slug')
        
        # Убираем лишние поля, которые не нужны в JSON
        # data.pop('id', None)  # Убираем Django ID
        
        return data


class ServiceFeatureSerializer(serializers.ModelSerializer):
    """
    Сериализатор для особенностей услуг (ServiceFeature)
    Поддерживает выбор языка через контекст
    """
    text = serializers.SerializerMethodField()

    class Meta:
        model = ServiceFeature
        fields = ['text', 'order']

    def get_text(self, obj):
        # Получаем язык из контекста
        lang = self.context.get('lang', 'ua')
        
        # Возвращаем текст на нужном языке
        if lang in ['ua', 'ru', 'en']:
            return getattr(obj, f'text_{lang}', '')
        else:
            # Если язык не указан или неверный, возвращаем украинский
            return obj.text_ua


class ServiceCategoryDetailSerializer(serializers.ModelSerializer):
    """
    Детальный сериализатор для категории услуг.
    Поддерживает выбор языка через параметр lang в контексте.
    Включает титул, описание, hero_image, особенности услуг и canonical_url.
    """
    label = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    hero_image = serializers.ImageField(read_only=True)
    features = serializers.SerializerMethodField()
    canonical_url = serializers.SerializerMethodField()

    class Meta:
        model = ServiceCategory
        fields = ['label', 'description', 'hero_image', 'features', 'canonical_url']

    def get_label(self, obj):
        # Получаем язык из контекста
        lang = self.context.get('lang', 'ua')
        
        # Возвращаем только нужный язык или все языки
        if lang in ['ua', 'ru', 'en']:
            return getattr(obj, f'label_{lang}', '')
        else:
            # Если язык не указан или неверный, возвращаем все языки
            return {
                'ua': obj.label_ua,
                'ru': obj.label_ru,
                'en': obj.label_en,
            }

    def get_description(self, obj):
        # Получаем язык из контекста
        lang = self.context.get('lang', 'ua')
        
        # Возвращаем только нужный язык или все языки
        if lang in ['ua', 'ru', 'en']:
            return getattr(obj, f'description_{lang}', '')
        else:
            # Если язык не указан или неверный, возвращаем все языки
            return {
                'ua': getattr(obj, 'description_ua', ''),
                'ru': getattr(obj, 'description_ru', ''),
                'en': getattr(obj, 'description_en', ''),
            }

    def get_features(self, obj):
        # Получаем особенности услуг для данной категории
        features = obj.features.all().order_by('order')
        
        # Получаем язык из контекста
        lang = self.context.get('lang', 'ua')
        
        # Возвращаем простой массив строк вместо объектов
        feature_texts = []
        for feature in features:
            if lang in ['ua', 'ru', 'en']:
                text = getattr(feature, f'text_{lang}', '')
            else:
                text = feature.text_ua
            
            if text:  # Добавляем только непустые тексты
                feature_texts.append(text)
        
        return feature_texts

    def get_canonical_url(self, obj):
        """
        Возвращает канонический URL для текущего языка
        """
        # Получаем язык из контекста
        lang = self.context.get('lang', 'ua')
        
        # Используем метод модели для получения canonical URL
        return obj.get_canonical_url(lang)
        
class ServicesForSerializer(serializers.ModelSerializer):
    # Агрегированные поля с выбором языка через контекст
    title = serializers.SerializerMethodField()
    subtitle = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = ServicesFor
        fields = [
            'id',
            'title',
            'subtitle',
            'description'
        ]

    def _get_lang(self):
        lang = self.context.get('lang', 'ua')
        return lang if lang in ['ua', 'ru', 'en'] else 'ua'

    def get_title(self, obj):
        lang = self._get_lang()
        mapping = {
            'ua': 'title_uk',
            'ru': 'title_ru',
            'en': 'title_en',
        }
        return getattr(obj, mapping[lang], '')

    def get_subtitle(self, obj):
        lang = self._get_lang()
        mapping = {
            'ua': 'subtitle_uk',
            'ru': 'subtitle_ru',
            'en': 'subtitle_en',
        }
        return getattr(obj, mapping[lang], '')

    def get_description(self, obj):
        lang = self._get_lang()
        mapping = {
            'ua': 'description_uk',
            'ru': 'description_ru',
            'en': 'description_en',
        }
        return getattr(obj, mapping[lang], '')


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


class FrequentlyAskedQuestionSerializer(serializers.ModelSerializer):
    """
    Сериализатор для часто задаваемых вопросов с поддержкой выбора языка.
    Возвращает { title, text, order } для фронтенда.
    """
    title = serializers.SerializerMethodField()
    text = serializers.SerializerMethodField()

    class Meta:
        model = FrequentlyAskedQuestion
        fields = ['title', 'text', 'order']

    def _get_lang(self):
        lang = self.context.get('lang', 'ua')
        return lang if lang in ['ua', 'ru', 'en'] else 'ua'

    def get_title(self, obj):
        lang = self._get_lang()
        return getattr(obj, f'question_{lang}', '')

    def get_text(self, obj):
        lang = self._get_lang()
        return getattr(obj, f'answer_{lang}', '')
    
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


class LegalDocumentSerializer(serializers.ModelSerializer):
    """
    Сериализатор юридических документов с поддержкой выбора языка через контекст.
    Возвращает { key, title, content }.
    """
    title = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()

    class Meta:
        model = LegalDocument
        fields = ['key', 'title', 'content', 'updated_at', 'file']

    def _get_lang(self):
        lang = self.context.get('lang', 'ua')
        return lang if lang in ['ua', 'ru', 'en'] else 'ua'

    def get_title(self, obj):
        lang = self._get_lang()
        return getattr(obj, f'title_{lang}', '')

    def get_content(self, obj):
        lang = self._get_lang()
        return getattr(obj, f'content_{lang}', '')
    
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


class LegalDocumentMetaSerializer(serializers.ModelSerializer):
    """
    Лёгкий сериализатор для списка документов: { key, title, file }.
    Заголовок локализуется через контекст (lang). file — абсолютный URL, если есть.
    """
    title = serializers.SerializerMethodField()
    file = serializers.SerializerMethodField()

    class Meta:
        model = LegalDocument
        fields = ['key', 'title', 'file']

    def _get_lang(self):
        lang = self.context.get('lang', 'ua')
        return lang if lang in ['ua', 'ru', 'en'] else 'ua'

    def get_title(self, obj):
        lang = self._get_lang()
        return getattr(obj, f'title_{lang}', '')

    def get_file(self, obj):
        request = self.context.get('request')
        try:
            if obj.file and hasattr(obj.file, 'url'):
                url = obj.file.url
                return request.build_absolute_uri(url) if request else url
        except Exception:
            return None
        return None

class AboutMeDetailSerializer(serializers.ModelSerializer):
    """
    Сериализатор детального блока AboutMeDetail с выбором языка через контекст.
    Возвращает { title, text }.
    """
    title = serializers.SerializerMethodField()
    text = serializers.SerializerMethodField()

    class Meta:
        model = AboutMeDetail
        fields = ['title', 'text', 'updated_at']

    def _get_lang(self):
        lang = self.context.get('lang', 'ua')
        return lang if lang in ['ua', 'ru', 'en'] else 'ua'

    def get_title(self, obj):
        lang = self._get_lang()
        return getattr(obj, f'title_{lang}', '')

    def get_text(self, obj):
        lang = self._get_lang()
        return getattr(obj, f'text_{lang}', '')

class QualificationImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = QualificationCertificate  # placeholder; not used directly
        fields = ['image', 'order']

    def get_image(self, obj):
        request = self.context.get('request')
        try:
            if obj.image and hasattr(obj.image, 'url'):
                url = obj.image.url
                return request.build_absolute_uri(url) if request else url
        except Exception:
            return None
        return None


class QualificationBlockSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    certificates = serializers.SerializerMethodField()
    diplomas = serializers.SerializerMethodField()

    class Meta:
        model = QualificationBlock
        fields = ['title', 'certificates', 'diplomas', 'updated_at']

    def _get_lang(self):
        lang = self.context.get('lang', 'ua')
        return lang if lang in ['ua', 'ru', 'en'] else 'ua'

    def get_title(self, obj):
        lang = self._get_lang()
        return getattr(obj, f'title_{lang}', '')

    def _serialize_images(self, queryset):
        return [
            {
                'image': QualificationImageSerializer().get_image(item),
                'order': item.order,
            }
            for item in queryset
        ]

    def get_certificates(self, obj):
        return self._serialize_images(obj.certificates.all().order_by('order', 'id'))

    def get_diplomas(self, obj):
        return self._serialize_images(obj.diplomas.all().order_by('order', 'id'))


class VideoBlockSerializer(serializers.ModelSerializer):
    """
    Сериализатор для видео блоков с поддержкой многоязычности
    """
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()
    
    class Meta:
        model = VideoBlock
        fields = [
            'id',
            'video_type',
            'title',
            'description',
            'video_url',
            'is_active',
            'created_at',
            'updated_at'
        ]
    
    def get_title(self, obj):
        """Возвращает заголовок в зависимости от выбранного языка"""
        lang = self.context.get('lang', 'ua')
        if lang in ['ua', 'ru', 'en']:
            mapping = {
                'ua': 'title_ua',
                'ru': 'title_ru',
                'en': 'title_en',
            }
            return getattr(obj, mapping[lang], '')
        return obj.title_ua
    
    def get_description(self, obj):
        """Возвращает описание в зависимости от выбранного языка"""
        lang = self.context.get('lang', 'ua')
        if lang in ['ua', 'ru', 'en']:
            mapping = {
                'ua': 'description_ua',
                'ru': 'description_ru',
                'en': 'description_en',
            }
            return getattr(obj, mapping[lang], '')
        return obj.description_ua
    
    def get_video_url(self, obj):
        """Возвращает URL видео файла"""
        if obj.video:
            return obj.video.url
        return None