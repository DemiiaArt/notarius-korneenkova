# 📝 Система отзывов - Документация

## 📋 Обзор

Полнофункциональная система отзывов с модерацией для нотариального сайта.

## 🎯 Возможности

### Backend (Django REST Framework)
- ✅ Создание отзывов с рейтингом (1-5 звезд)
- ✅ Выбор услуги из предопределенного списка
- ✅ Двойная модерация (`is_approved` + `is_published`)
- ✅ Статистика рейтингов (средний рейтинг, распределение по звездам)
- ✅ Админ-панель с batch actions
- ✅ REST API endpoints

### Frontend (React)
- ✅ Форма добавления отзыва с валидацией
- ✅ Интерактивный рейтинг звездами
- ✅ Визуализация статистики
- ✅ Карусель отзывов (Swiper)
- ✅ Адаптивный дизайн

---

## 🔌 API Endpoints

### 1. Создание отзыва
```
POST /api/reviews/create/
```

**Request Body:**
```json
{
  "name": "Иван Петров",
  "service": "certification",
  "rating": 5,
  "text": "Отличная работа!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Дякуємо! Ваш відгук з'явиться після модерації"
}
```

**Варианты услуг:**
- `certification` - Засвідчення копій документів та підписів
- `realEstateTransactions` - Нотаріальне супроводження угод з нерухомістю
- `heritage` - Оформлення спадщини та заповітів
- `attorney` - Посвідчення довіреностей та згод
- `agreements` - Посвідчення договорів купівлі-продажу, дарування, оренди

---

### 2. Список опубликованных отзывов
```
GET /api/reviews/
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Иван Петров",
    "service": "certification",
    "service_display": "Засвідчення копій документів та підписів",
    "rating": 5,
    "text": "Отличная работа!",
    "created_at": "2025-10-01T10:30:00Z",
    "is_approved": true,
    "is_published": true
  }
]
```

---

### 3. Статистика рейтинга
```
GET /api/reviews/stats/
```

**Response:**
```json
{
  "average_rating": 4.5,
  "total_reviews": 120,
  "rating_counts": {
    "1": 2,
    "2": 5,
    "3": 10,
    "4": 30,
    "5": 73
  }
}
```

---

### 4. Админ: Список всех отзывов
```
GET /api/reviews/admin/
```

Возвращает все отзывы (включая неодобренные).

---

### 5. Админ: Управление отзывом
```
GET/PUT/DELETE /api/reviews/<id>/
```

**PUT Request Body:**
```json
{
  "is_approved": true,
  "is_published": true
}
```

---

## 🗄️ Модель данных

### Review Model

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | Integer | ID отзыва |
| `name` | CharField(255) | Имя клиента |
| `service` | CharField(50) | Код услуги |
| `rating` | Integer | Рейтинг (1-5) |
| `text` | TextField | Текст отзыва |
| `created_at` | DateTimeField | Дата создания |
| `is_approved` | BooleanField | Одобрено модератором |
| `is_published` | BooleanField | Опубликовано на сайте |

---

## 🚀 Использование

### Frontend

#### 1. Форма отзыва
```jsx
import { ReviewForm } from '@/components/ReviewForm/ReviewForm';

function MyPage() {
  return (
    <div>
      <ReviewForm />
    </div>
  );
}
```

#### 2. Показ отзывов
```jsx
import Comments from '@/components/Comments/Comments';

function MyPage() {
  return (
    <div>
      <Comments />
    </div>
  );
}
```

---

## ⚙️ Конфигурация

### 1. Переменные окружения

Создайте файл `.env` в папке `notarius-main/`:

```env
# Development
VITE_API_BASE_URL=http://localhost:8000/api

# Production
# VITE_API_BASE_URL=https://your-domain.com/api
```

### 2. API Client

Файл `src/config/api.js` автоматически определяет URL в зависимости от окружения:

```javascript
import { apiClient } from '@/config/api';

// GET запрос
const data = await apiClient.get('/reviews/');

// POST запрос
const response = await apiClient.post('/reviews/create/', {
  name: 'John',
  rating: 5,
  // ...
});
```

---

## 🔧 Админ-панель

### Доступ
```
http://localhost:8000/admin/
```

### Модерация отзывов

1. **Просмотр отзывов**: Main_page → Отзывы
2. **Фильтрация**: По статусу (одобрено, опубликовано), рейтингу, услуге, дате
3. **Поиск**: По имени или тексту отзыва

### Batch Actions
- **Одобрить выбранные отзывы** - устанавливает `is_approved = True`
- **Опубликовать выбранные отзывы** - устанавливает `is_approved = True` и `is_published = True`
- **Снять с публикации** - устанавливает `is_published = False`

### Быстрое редактирование
Флаги `is_approved` и `is_published` можно редактировать прямо в списке отзывов.

---

## 🔒 Безопасность

### Модерация
- Все новые отзывы требуют модерации (`is_approved = False`, `is_published = False`)
- На сайте показываются только отзывы с `is_approved = True` и `is_published = True`
- Администратор может одобрить/опубликовать/скрыть отзыв

### Валидация
- **Backend**: 
  - Рейтинг от 1 до 5
  - Обязательные поля: name, service, rating, text
  
- **Frontend**:
  - Проверка заполнения всех полей
  - Trim пробелов
  - Disabled кнопка во время отправки

### CORS
Django настроен для работы с фронтендом (см. `settings.py`):
```python
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
```

---

## 📊 Тестирование

### Backend (Django)

```bash
cd backend
python manage.py test main_page
```

### Ручное тестирование API

1. **Создание отзыва:**
```bash
curl -X POST http://localhost:8000/api/reviews/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "service": "certification",
    "rating": 5,
    "text": "Great service!"
  }'
```

2. **Получение отзывов:**
```bash
curl http://localhost:8000/api/reviews/
```

3. **Статистика:**
```bash
curl http://localhost:8000/api/reviews/stats/
```

---

## 🐛 Troubleshooting

### Проблема: CORS errors
**Решение:** Убедитесь, что в `settings.py` включен `corsheaders`:
```python
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]
```

### Проблема: API не отвечает
**Решение:** Проверьте:
1. Backend запущен: `python manage.py runserver`
2. URL в `.env` правильный
3. Миграции применены: `python manage.py migrate`

### Проблема: Отзывы не отображаются
**Решение:** 
1. Проверьте в админке, что отзывы одобрены и опубликованы
2. Откройте DevTools → Network и проверьте ответ API

---

## 📈 Дальнейшие улучшения

### Возможные доработки:

1. **Pagination** - добавить пагинацию для списка отзывов
2. **Фильтрация** - фильтр отзывов по услугам на фронтенде
3. **Email уведомления** - уведомлять админа о новых отзывах
4. **Rate limiting** - ограничить частоту отправки отзывов с одного IP
5. **Капча** - добавить Google reCAPTCHA для защиты от спама
6. **Мультиязычность** - поддержка украинского, английского, русского для отзывов
7. **Фото отзывов** - возможность прикрепить фото к отзыву
8. **Ответы на отзывы** - возможность нотариусу отвечать на отзывы
9. **Лайки** - пользователи могут ставить лайки полезным отзывам

---

## 📝 Changelog

### v1.0.0 (2025-10-01)
- ✅ Базовая система отзывов
- ✅ Модерация
- ✅ REST API
- ✅ Frontend компоненты
- ✅ Админ-панель
- ✅ Статистика рейтингов

---

## 👨‍💻 Контакты

Для вопросов и предложений по системе отзывов обращайтесь к разработчикам проекта.

