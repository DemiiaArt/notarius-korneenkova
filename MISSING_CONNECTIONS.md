# Что не подключено между Backend и Frontend

## 🔴 КРИТИЧНЫЕ НЕСООТВЕТСТВИЯ

### 1. Header/Contacts API
**Проблема:** Эндпоинты не совпадают

**Backend:**
- ✅ `GET /api/header/` - работает

**Frontend:**
- ❌ `useHeaderContacts.js` запрашивает `/api/header-contacts/` (не существует!)
- ❌ `useContacts.js` запрашивает `/api/contacts/` (не существует!)

**Решение:**
```javascript
// В useHeaderContacts.js и useContacts.js заменить:
const response = await fetch(`${API_BASE_URL}/header/`);
```

---

## 🟡 НЕ ИСПОЛЬЗУЕМЫЕ API (Backend есть, Frontend нет)

### 2. Background Videos
**Backend:**
- ✅ `GET /api/background-videos/` - возвращает список фоновых видео

**Frontend:**
- ❌ Не используется нигде

**Решение:** Создать компонент для отображения фоновых видео или удалить из бэкенда

---

### 3. Blog (Блог)
**Backend:**
- ✅ `GET /api/blog/notarialni-blog/` - список статей
- ✅ `GET /api/blog/notarialni-blog/<slug>/` - детали статьи

**Frontend:**
- ❌ BlogArticlePage.jsx существует, но не делает API запросы
- ❌ MainBlogPage.jsx существует, но не подключен к API

**Решение:** Подключить блог к API:
```javascript
// Создать useBlog.js hook
import { apiClient } from '@/config/api';

export const useBlog = () => {
  // ...
  const data = await apiClient.get('/blog/notarialni-blog/');
  // ...
};
```

---

### 4. Services For (Для кого услуги)
**Backend:**
- ✅ `GET /api/services-for/` - категории "для кого услуги"

**Frontend:**
- ❌ Не используется

**Решение:** Создать компонент ServicesFor или удалить из бэкенда

---

### 5. Video Interviews (Видео интервью)
**Backend:**
- ✅ `GET /api/video-interviews/` - список видео
- ✅ `GET /api/video-interviews/<pk>/` - детали видео

**Frontend:**
- ❌ Не используется

**Решение:** Создать компонент VideoInterviews или удалить из бэкенда

---

### 6. Applications (Заявки/Формы)
**Backend:**
- ✅ `POST /api/applications/` - создание заявки

**Frontend:**
- ⚠️ Формы FreeConsult.jsx и OrderConsult.jsx существуют
- ❌ НО они НЕ отправляют данные на бэкенд!

**Решение:** Подключить формы к API:
```javascript
// В FreeConsult.jsx
const handleSubmit = async (formData) => {
  await apiClient.post('/applications/', {
    name: formData.name,
    phone_number: formData.phone
  });
};
```

---

## ✅ ЧТО УЖЕ РАБОТАЕТ

1. ✅ About Me - `GET /api/about-me/`
2. ✅ Services Categories - `GET /api/services/`
3. ✅ Service Details - `GET /api/<slug1>/<slug2>/<slug3>/`
4. ✅ Reviews List - `GET /api/reviews/`
5. ✅ Reviews Stats - `GET /api/reviews/stats/`
6. ✅ Create Review - `POST /api/reviews/create/`

---

## 📝 ПЛАН ДЕЙСТВИЙ (по приоритету)

### Высокий приоритет:
1. 🔴 Исправить useHeaderContacts.js и useContacts.js (эндпоинты)
2. 🔴 Подключить формы заявок к `/api/applications/`

### Средний приоритет:
3. 🟡 Подключить блог к API
4. 🟡 Подключить фоновые видео

### Низкий приоритет:
5. 🟢 Подключить Services For или удалить
6. 🟢 Подключить Video Interviews или удалить

---

## 🔧 БЫСТРЫЕ ИСПРАВЛЕНИЯ

### Fix 1: useHeaderContacts.js
```javascript
// Заменить строку 20:
const response = await fetch(`${API_BASE_URL}/header/`);
```

### Fix 2: useContacts.js
```javascript
// Заменить строку 20:
const response = await fetch(`${API_BASE_URL}/header/`);
```

### Fix 3: Формы заявок
```javascript
// В FreeConsult.jsx и OrderConsult.jsx добавить:
import { apiClient } from '@/config/api';

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await apiClient.post('/applications/', {
      name: formData.name,
      phone_number: formData.phone
    });
    // Показать успех
  } catch (error) {
    // Показать ошибку
  }
};
```

