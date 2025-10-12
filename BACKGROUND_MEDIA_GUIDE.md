# Руководство по работе с фоновым медиа (MainVideo)

## Обзор

Компонент `MainVideo` теперь динамически загружает фоновое медиа (видео или изображение) с бэкенда через API.

## Структура API

### Endpoint

```
GET /api/background-videos/
```

### Ответ (пример для видео)

```json
[
  {
    "id": 1,
    "name": "Фоновое медиа",
    "media_type": "video",
    "media_url": "http://localhost:8000/media/background_videos/video.mp4",
    "is_active": true
  }
]
```

### Ответ (пример для изображения)

```json
[
  {
    "id": 1,
    "name": "Фоновое медиа",
    "media_type": "image",
    "media_url": "http://localhost:8000/media/background_videos/image.png",
    "is_active": true
  }
]
```

## Как использовать в админке

### 1. Создание нового фонового медиа

1. Откройте админку: http://localhost:8000/admin/
2. Перейдите в раздел **"Основной контент" → "Фоновые медиа"**
3. Нажмите **"Добавить фоновый медиа"**

### 2. Заполните форму

**Основная информация:**

- **Название**: Введите описательное название (например, "Главное видео", "Фоновое изображение")
- **Тип медиа**: Выберите тип:
  - `Видео` - для видео файлов (.mp4, .mov, .webm)
  - `Изображение` - для изображений (.jpg, .png, .webp)
- **Активно**: Поставьте галочку, чтобы медиа отображалось на сайте

**Медиа файлы:**

- Если выбрали **"Видео"**:
  - Загрузите видео в поле **"Видеофайл"**
  - Рекомендуемый формат: MP4 (H.264)
  - Максимальный размер: зависит от настроек сервера
- Если выбрали **"Изображение"**:
  - Загрузите изображение в поле **"Изображение"**
  - Рекомендуемый формат: JPG, PNG, WebP
  - Рекомендуемое разрешение: 1920x1080 или больше

### 3. Сохраните

Нажмите **"Сохранить"** или **"Сохранить и продолжить редактирование"**

## Как работает компонент

### Логика выбора медиа

Компонент `MainVideo`:

1. Загружает все фоновые медиа с API
2. Выбирает первый элемент с `is_active: true`
3. Если нет активных элементов, выбирает первый элемент из списка
4. Если API недоступен или возвращает пустой список, использует fallback-видео

### Поддерживаемые типы

- ✅ **Видео** (`media_type: "video"`)

  - Автоматическое воспроизведение
  - Зацикленное воспроизведение
  - Без звука (muted)
  - Pause/Play при скролле (экономия ресурсов)

- ✅ **Изображение** (`media_type: "image"`)
  - Статичное отображение
  - Адаптивное масштабирование (object-fit: cover)
  - Плавное появление (fade-in эффект)

### Ленивая загрузка

Компонент использует `IntersectionObserver` для:

- Загрузки медиа только когда блок появляется в зоне видимости
- Автоматической паузы видео когда пользователь прокручивает страницу

## Управление несколькими медиа

### Несколько медиа файлов

Вы можете создать несколько записей фонового медиа в админке:

- Отметьте галочкой **"Активно"** только для одного элемента
- Остальные оставьте неактивными
- Компонент автоматически выберет активный элемент

### Переключение медиа

Чтобы изменить отображаемое медиа:

1. Откройте список **"Фоновые медиа"** в админке
2. Снимите галочку **"Активно"** с текущего медиа
3. Поставьте галочку **"Активно"** на новом медиа
4. Сохраните
5. Обновите страницу сайта - новое медиа загрузится автоматически

## Оптимизация

### Рекомендации для видео

- **Формат**: MP4 (H.264)
- **Разрешение**: 1920x1080 (Full HD) или 1280x720 (HD)
- **Битрейт**: 2-5 Мбит/с
- **Длительность**: 10-30 секунд (для зацикливания)
- **Размер файла**: Старайтесь держать под 10 МБ

### Рекомендации для изображений

- **Формат**: WebP (лучшее сжатие), JPG (совместимость), PNG (если нужна прозрачность)
- **Разрешение**: 1920x1080 или выше
- **Оптимизация**: Используйте инструменты сжатия (TinyPNG, Squoosh)
- **Размер файла**: Старайтесь держать под 500 КБ

### Инструменты для оптимизации

**Видео:**

- [HandBrake](https://handbrake.fr/) - бесплатный конвертер
- [FFmpeg](https://ffmpeg.org/) - командная строка
- Пример FFmpeg команды:
  ```bash
  ffmpeg -i input.mov -c:v libx264 -crf 23 -preset medium -vf scale=1920:1080 -an output.mp4
  ```

**Изображения:**

- [TinyPNG](https://tinypng.com/) - онлайн сжатие
- [Squoosh](https://squoosh.app/) - WebP конвертация
- [ImageOptim](https://imageoptim.com/) - macOS приложение

## Troubleshooting

### Медиа не загружается

1. **Проверьте API:**

   - Откройте http://localhost:8000/api/background-videos/
   - Должен вернуть JSON с данными

2. **Проверьте консоль браузера:**

   - Откройте DevTools (F12)
   - Посмотрите на ошибки в Console
   - Проверьте Network вкладку

3. **Проверьте is_active:**

   - В админке убедитесь, что галочка "Активно" стоит

4. **Проверьте файл:**
   - Убедитесь, что файл загружен в админке
   - Попробуйте открыть URL медиа напрямую в браузере

### Видео не воспроизводится

1. **Формат:** Убедитесь, что используете MP4 (H.264)
2. **Размер:** Проверьте размер файла (не слишком большой?)
3. **Браузер:** Попробуйте другой браузер
4. **Консоль:** Проверьте ошибки в консоли браузера

### Изображение размыто

1. Загрузите изображение в более высоком разрешении
2. Используйте формат без потерь качества (PNG, WebP)
3. Проверьте оригинальное качество изображения

## Техническая информация

### Файлы

- **Компонент:** `notarius-main/src/components/MainVideo/MainVideo.jsx`
- **Стили:** `notarius-main/src/components/MainVideo/MainVideo.scss`
- **API Config:** `notarius-main/src/config/api.js`
- **Backend View:** `backend/main_page/views.py` (BackgroundVideoView)
- **Backend Model:** `backend/main_page/models.py` (BackgroundVideo)
- **Backend Serializer:** `backend/main_page/serializer.py` (BackgroundVideoSerializer)
- **Backend URL:** `backend/main_page/urls.py`

### База данных

**Модель BackgroundVideo:**

```python
class BackgroundVideo(models.Model):
    name = models.CharField(max_length=255)
    media_type = models.CharField(max_length=10, choices=[('video', 'Видео'), ('image', 'Изображение')])
    video = models.FileField(upload_to='background_videos/', blank=True, null=True)
    image = models.ImageField(upload_to='background_videos/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
```

### API Serializer

```python
class BackgroundVideoSerializer(serializers.ModelSerializer):
    media_url = serializers.SerializerMethodField()

    class Meta:
        model = BackgroundVideo
        fields = ['id', 'name', 'media_type', 'media_url', 'is_active']

    def get_media_url(self, obj):
        if obj.media_type == 'video' and obj.video:
            return request.build_absolute_uri(obj.video.url)
        elif obj.media_type == 'image' and obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None
```

## Поддержка

При возникновении проблем:

1. Проверьте логи Django (`python manage.py runserver`)
2. Проверьте консоль браузера (F12 → Console)
3. Убедитесь, что миграции применены (`python manage.py migrate`)
4. Проверьте документацию в `MIGRATION_FIX.md` для проблем с миграциями
