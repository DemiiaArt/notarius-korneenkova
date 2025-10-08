# Certificates Component - Интеграция с QualificationBlock

## Описание

Компонент `Certificates` отображает сертификаты и дипломы, загружая данные из модели `QualificationBlock` на бэкенде.

## Структура данных бэкенда

### Модели (Django)

#### QualificationBlock

Основная модель для блока "Кваліфікація та досвід":

```python
class QualificationBlock(models.Model):
    title_ua = CharField(max_length=255)
    title_ru = CharField(max_length=255)
    title_en = CharField(max_length=255)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
```

#### QualificationCertificate

Изображения сертификатов (первая карусель):

```python
class QualificationCertificate(models.Model):
    block = ForeignKey(QualificationBlock, related_name='certificates')
    image = ImageField(upload_to='qualifications/certificates/')
    order = PositiveIntegerField(default=0)
```

#### QualificationDiploma

Изображения дипломов (вторая карусель):

```python
class QualificationDiploma(models.Model):
    block = ForeignKey(QualificationBlock, related_name='diplomas')
    image = ImageField(upload_to='qualifications/diplomas/')
    order = PositiveIntegerField(default=0)
```

## API Endpoint

### URL

```
GET /api/qualification/?lang={lang}
```

### Параметры

- `lang` (optional) - Код языка: `ua`, `ru`, `en` (по умолчанию `ua`)

### Пример ответа

```json
{
  "title": "Кваліфікація та досвід",
  "certificates": [
    {
      "image": "http://localhost:8000/media/qualifications/certificates/cert1.jpg",
      "order": 0
    },
    {
      "image": "http://localhost:8000/media/qualifications/certificates/cert2.jpg",
      "order": 1
    }
  ],
  "diplomas": [
    {
      "image": "http://localhost:8000/media/qualifications/diplomas/diploma1.jpg",
      "order": 0
    }
  ],
  "updated_at": "2024-01-15T10:30:00Z"
}
```

## Как работает компонент

### 1. Загрузка данных

При монтировании и смене языка компонент:

1. Выполняет запрос к `/api/qualification/?lang={currentLang}`
2. Получает заголовок, сертификаты и дипломы
3. Отображает данные в каруселях

```javascript
useEffect(() => {
  const lang = ["ua", "ru", "en"].includes(currentLang) ? currentLang : "ua";

  fetch(`${API_BASE_URL}/qualification/?lang=${lang}`)
    .then((r) => r.json())
    .then((data) => {
      setData({
        title: data.title,
        certificates: data.certificates,
        diplomas: data.diplomas,
      });
    });
}, [currentLang]);
```

### 2. Отображение каруселей

Компонент имеет две вкладки:

- **Сертифікати** - показывает `data.diplomas` (множественные сертификаты)
- **Свідоцтво** - показывает `data.certificates` (дипломы)

### 3. Модальное окно

При клике на изображение открывается модальное окно с полноразмерным изображением.

## Использование в проекте

### В компоненте AboutPage

```javascript
import Certificates from "@components/Certificates/Certificates";

const AboutPage = () => {
  return (
    <div>
      <h1>О нас</h1>
      <Certificates />
    </div>
  );
};
```

### Самостоятельная страница

Создайте `QualificationPage.jsx`:

```javascript
import Breadcrumbs from "@components/BreadCrumbs/BreadCrumbs";
import Certificates from "@components/Certificates/Certificates";
import "./QualificationPage.scss";

const QualificationPage = () => {
  return (
    <div className="qualification-page">
      <div className="container">
        <Breadcrumbs />
        <Certificates />
      </div>
    </div>
  );
};

export default QualificationPage;
```

Добавьте в `nav-tree.js`:

```javascript
{
  id: "qualification",
  kind: "page",
  label: {
    ua: "Кваліфікація та досвід",
    ru: "Квалификация и опыт",
    en: "Qualification"
  },
  slug: {
    ua: "qualification",
    ru: "qualification",
    en: "qualification",
  },
  showInMenu: true,
}
```

## Состояния компонента

### Loading

Отображает сообщение загрузки на текущем языке.

### Error

Отображает сообщение об ошибке, если загрузка не удалась.

### Success

Отображает:

- Заголовок с бэкенда (на текущем языке)
- Две вкладки с каруселями
- Модальное окно для просмотра изображений

## Переводы

Все тексты в компоненте переведены на 3 языка:

| Ключ                | UA                         | EN                           | RU                         |
| ------------------- | -------------------------- | ---------------------------- | -------------------------- |
| `title`             | Кваліфікація та досвід     | Qualification and experience | Квалификация и опыт        |
| `loading`           | Завантаження...            | Loading...                   | Загрузка...                |
| `error`             | Помилка завантаження       | Loading error                | Ошибка загрузки            |
| `noImages`          | Немає зображень            | No images                    | Нет изображений            |
| `tabs.certificates` | Сертифікати                | Certificates                 | Сертификаты                |
| `tabs.diploma`      | Свідоцтво                  | Diploma                      | Свидетельство              |
| `modal.close`       | ×                          | ×                            | ×                          |
| `modal.altText`     | Сертифікат повного розміру | Certificate full size        | Сертификат полного размера |
| `carousel.altText`  | Сертифікат                 | Certificate                  | Сертификат                 |
| `carousel.prevAlt`  | стрілка вліво              | arrow left                   | стрелка влево              |
| `carousel.nextAlt`  | стрілка вправо             | arrow right                  | стрелка вправо             |

## Управление данными в Django Admin

### Добавление блока квалификации

1. Перейдите в Django Admin: `/admin/main_page/qualificationblock/`
2. Нажмите "Добавить Квалификация и опыт"
3. Заполните заголовки на трех языках:
   - Заголовок (UA)
   - Заголовок (RU)
   - Заголовок (EN)
4. Сохраните

### Добавление сертификатов

1. Перейдите в блок квалификации
2. В разделе "Сертификаты" нажмите "Добавить"
3. Загрузите изображение
4. Установите порядок (order)
5. Сохраните

### Добавление дипломов

1. Перейдите в блок квалификации
2. В разделе "Свидетельства" нажмите "Добавить"
3. Загрузите изображение
4. Установите порядок (order)
5. Сохраните

## Особенности реализации

### Автоматическое обновление при смене языка

Компонент автоматически перезагружает данные при смене языка:

```javascript
useEffect(() => {
  // Загружается с новым языком
}, [currentLang]);
```

### Сортировка изображений

Изображения сортируются по полю `order`, затем по `id`:

```python
# В Django
certificates.all().order_by('order', 'id')
diplomas.all().order_by('order', 'id')
```

### Fallback

Если данные не загружены, компонент использует переводы из локализации:

```javascript
{
  data.title || t("title");
}
```

## Технические требования

### Backend

- Django REST Framework
- Модель QualificationBlock с данными
- Endpoint `/api/qualification/`
- Изображения в `media/qualifications/`

### Frontend

- React 18+
- Swiper для каруселей
- useLanguage для определения текущего языка
- useTranslation для локализации

## Troubleshooting

### Проблема: изображения не загружаются

**Решение:**

1. Проверьте CORS настройки на бэкенде
2. Убедитесь, что медиа файлы доступны
3. Проверьте настройки `MEDIA_URL` и `MEDIA_ROOT` в Django

### Проблема: переводы не меняются

**Решение:**

1. Используйте функцию `t()` напрямую, не через `useMemo`
2. Убедитесь, что переводы есть во всех файлах локализации

### Проблема: карусель не работает

**Решение:**

1. Убедитесь, что установлен Swiper: `npm install swiper`
2. Проверьте импорты CSS для Swiper
3. Убедитесь, что есть хотя бы одно изображение в массиве

## Примеры использования

### Базовое использование

```jsx
import Certificates from "@components/Certificates/Certificates";

function MyPage() {
  return <Certificates />;
}
```

### С дополнительным контентом

```jsx
import Certificates from "@components/Certificates/Certificates";

function AboutPage() {
  return (
    <div>
      <h1>О нас</h1>
      <AboutTextBlock />
      <Certificates />
      <Skills />
    </div>
  );
}
```

## API для тестирования

### Локальная разработка

```
GET http://localhost:8000/api/qualification/?lang=ua
GET http://localhost:8000/api/qualification/?lang=en
GET http://localhost:8000/api/qualification/?lang=ru
```

### Продакшн

```
GET https://your-domain.com/api/qualification/?lang=ua
```

## Связанные файлы

- **Компонент**: `src/components/Certificates/Certificates.jsx`
- **Стили**: `src/components/Certificates/Certificates.scss`
- **Модель**: `backend/main_page/models.py` (QualificationBlock)
- **Сериализатор**: `backend/main_page/serializer.py` (QualificationBlockSerializer)
- **View**: `backend/main_page/views.py` (QualificationBlockView)
- **URL**: `backend/main_page/urls.py`
- **Переводы**: `src/locales/{ua,en,ru}.json`

