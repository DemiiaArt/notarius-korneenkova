# 📝 Восстановление моделей блога в кастомной админке

## Проблема
После переключения на кастомный админ-сайт пропали модели блога:
- Категории блога (BlogCategory)
- Статьи блога (BlogPost)

## Решение

### 1. **Добавлены импорты моделей блога**
```python
from blog.models import BlogCategory, BlogPost
```

### 2. **Созданы админ-классы для блога**
```python
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ("name_ua", "show_in_filters", "order")
    list_editable = ("show_in_filters", "order")
    # ... другие настройки

class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title_ua", "status", "published_at", "cover_preview")
    # ... другие настройки с превью обложки
```

### 3. **Добавлена группа "📝 БЛОГ"**
```python
'📝 БЛОГ': {
    'models': ['BlogCategory', 'BlogPost'],
    'icon': 'fas fa-blog',
    'description': 'Категории и статьи блога',
    'priority': 2  # Вторая по важности после форм
}
```

### 4. **Обновлена логика поиска моделей**
- Теперь ищет модели в приложениях `main_page` и `blog`
- Правильные URL для моделей блога

### 5. **Зарегистрированы модели в кастомном админ-сайте**
```python
admin_site.register(BlogCategory, BlogCategoryAdmin)
admin_site.register(BlogPost, BlogPostAdmin)
```

## Результат

### ✅ **Теперь в админке есть:**
```
📞 ФОРМЫ ОБРАТНОЙ СВЯЗИ (ПЕРВАЯ)
├── Заявки (Application)
├── Бесплатные консультации (FreeConsultation)
└── Связаться с нами (ContactUs)

📝 БЛОГ (ВТОРАЯ)
├── Категории блога (BlogCategory)
└── Статьи блога (BlogPost)

Основной контент
├── Header
├── AboutMe
├── ServicesFor
└── BackgroundVideo

Услуги и категории
├── ServiceCategory
└── ServiceFeature

Контент и отзывы
├── Review
├── VideoInterview
└── FrequentlyAskedQuestion
```

### 🎯 **Улучшения для блога:**
- **Превью обложек** статей в списке
- **Улучшенные фильтры** по статусу и категориям
- **Поиск** по заголовкам на всех языках
- **Редактируемые поля** для категорий
- **Горизонтальные фильтры** для категорий в статьях

Теперь все модели блога восстановлены и работают в кастомной админке! 🎉
