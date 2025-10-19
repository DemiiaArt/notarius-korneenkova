# JSON-LD Schema Implementation

## Обзор

Реализована универсальная система для автоматической вставки JSON-LD структурированных данных (Schema.org) из backend API в `<head>` документа HTML.

## Что было сделано

### 1. Создан универсальный компонент `JsonLdSchema`

**Файл:** `notarius-main/src/components/Seo/JsonLdSchema.jsx`

Компонент автоматически:

- Загружает данные с API
- Извлекает поле `json_ld` из ответа
- Сохраняет данные в state компонента
- Через `react-helmet-async` создает `<script type="application/ld+json">` тег
- Вставляет его в `<head>` документа перед `</head>`
- Автоматически обновляет/удаляет тег при изменении данных или размонтировании

### 2. Создан хук для страниц услуг

**Файл:** `notarius-main/src/hooks/useServiceJsonLd.js`

Автоматически строит правильный API URL для страниц услуг на основе навигационного дерева.

### 3. Интегрирован в PageTemplate

**Файл:** `notarius-main/src/components/PageTemplate/PageTemplate.jsx`

Теперь `PageTemplate` автоматически добавляет JSON-LD для всех страниц услуг при передаче prop `navId`.

### 4. Добавлен на основные страницы

| Страница      | Файл                                       | API Endpoint                        |
| ------------- | ------------------------------------------ | ----------------------------------- |
| Главная       | `pages/MainPage/MainPage.jsx`              | `/api/background-videos/`           |
| Про мене      | `pages/AboutPage/AboutPage.jsx`            | `/api/about-me/detail/`             |
| Контакты      | `pages/ContactsPage/ContactsPage.jsx`      | `/api/video-blocks/?type=contacts`  |
| Блог (список) | `pages/BlogPage/MainBlogPage.jsx`          | `/api/blog/notarialni-blog/`        |
| Блог (статья) | `pages/BlogPage/BlogArticleDetailPage.jsx` | `/api/blog/notarialni-blog/{slug}/` |
| Услуги        | `pages/ServicesPage/ServicesPage.jsx`      | Автоматически через `PageTemplate`  |

## Измененные файлы

```
notarius-main/src/
├── components/
│   ├── Seo/
│   │   ├── JsonLdSchema.jsx                    ← НОВЫЙ
│   │   ├── JsonLdSchema.examples.md            ← НОВЫЙ
│   │   └── README.md                           ← НОВЫЙ
│   └── PageTemplate/
│       └── PageTemplate.jsx                    ← ИЗМЕНЕН
├── hooks/
│   └── useServiceJsonLd.js                     ← НОВЫЙ
└── pages/
    ├── MainPage/
    │   └── MainPage.jsx                        ← ИЗМЕНЕН
    ├── AboutPage/
    │   └── AboutPage.jsx                       ← ИЗМЕНЕН
    ├── ContactsPage/
    │   └── ContactsPage.jsx                    ← ИЗМЕНЕН
    ├── BlogPage/
    │   ├── MainBlogPage.jsx                    ← ИЗМЕНЕН
    │   └── BlogArticleDetailPage.jsx           ← ИЗМЕНЕН
    └── ServicesPage/
        └── ServicesPage.jsx                    ← ИЗМЕНЕН
```

## Как это работает

### Пример: Страница "Про мене"

**1. Frontend код:**

```jsx
import JsonLdSchema from "@components/Seo/JsonLdSchema";

const AboutPage = () => {
  return (
    <>
      <JsonLdSchema apiUrl="/api/about-me/detail/" />
      {/* Остальной контент */}
    </>
  );
};
```

**2. Backend response:**

```json
{
  "title": "Про мене",
  "text": "...",
  "json_ld": "{\"@context\": \"https://schema.org\", \"@type\": \"Person\", ...}"
}
```

**3. Результат в HTML:**

```html
<head>
  <!-- Другие метатеги -->
  <script id="json-ld-schema-api-about-me-detail-" type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Приватний нотаріус Надія Корнієнкова",
      "jobTitle": "Приватний нотаріус",
      ...
    }
  </script>
</head>
```

## Поддерживаемые API Endpoints

Компонент работает со всеми API endpoints, которые возвращают поле `json_ld`:

| Тип страницы | API Endpoint                                 | Параметры                    |
| ------------ | -------------------------------------------- | ---------------------------- |
| Главная      | `GET /api/background-videos/`                | `?lang={lang}`               |
| Про мене     | `GET /api/about-me/detail/`                  | `?lang={lang}`               |
| Контакты     | `GET /api/video-blocks/`                     | `?lang={lang}&type=contacts` |
| Услуги (1)   | `GET /api/services/{slug1}/`                 | `?lang={lang}`               |
| Услуги (2)   | `GET /api/services/{slug1}/{slug2}/`         | `?lang={lang}`               |
| Услуги (3)   | `GET /api/services/{slug1}/{slug2}/{slug3}/` | `?lang={lang}`               |
| Блог список  | `GET /api/blog/notarialni-blog/`             | `?lang={lang}`               |
| Блог статья  | `GET /api/blog/notarialni-blog/{slug}/`      | `?lang={lang}`               |

## Требования к Backend

Backend должен возвращать поле `json_ld` в ответе. Может быть:

**Вариант 1 - Строка:**

```python
{
    "title": "...",
    "json_ld": json.dumps({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "..."
    })
}
```

**Вариант 2 - Объект (будет автоматически сериализован):**

```python
{
    "title": "...",
    "json_ld": {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "..."
    }
}
```

## Примеры использования

### Базовый пример

```jsx
<JsonLdSchema apiUrl="/api/about-me/detail/" />
```

### С дополнительными параметрами

```jsx
<JsonLdSchema apiUrl="/api/video-blocks/" params={{ type: "contacts" }} />
```

### С динамическим slug

```jsx
const { slug } = useParams();

<JsonLdSchema
  apiUrl={`/api/blog/notarialni-blog/${slug}/`}
  dependencies={[slug]}
/>;
```

### Без параметра lang

```jsx
<JsonLdSchema apiUrl="/api/some-endpoint/" includeLang={false} />
```

## Преимущества решения

✅ **Универсальность** - один компонент для всех страниц
✅ **React-интеграция** - использует `react-helmet-async` для управления `<head>`
✅ **Автоматизация** - не нужно вручную управлять script тегами
✅ **Многоязычность** - автоматически добавляет параметр `lang`
✅ **Безопасность** - автоматическая очистка при размонтировании
✅ **SSR-совместимость** - полная поддержка Server-Side Rendering
✅ **Гибкость** - поддержка дополнительных параметров
✅ **Переиспользование** - легко добавить на новые страницы
✅ **SEO** - улучшает индексацию в поисковых системах

## Проверка работы

### 1. В браузере

Откройте DevTools → Elements и найдите в `<head>`:

```html
<script type="application/ld+json">
  ...
</script>
```

### 2. Google Rich Results Test

https://search.google.com/test/rich-results

### 3. Schema Markup Validator

https://validator.schema.org/

## Документация

Подробная документация доступна в:

- `notarius-main/src/components/Seo/README.md` - полное руководство
- `notarius-main/src/components/Seo/JsonLdSchema.examples.md` - примеры использования

## Добавление на новую страницу

Чтобы добавить JSON-LD на новую страницу:

1. Импортируйте компонент:

```jsx
import JsonLdSchema from "@components/Seo/JsonLdSchema";
```

2. Добавьте компонент в JSX:

```jsx
<JsonLdSchema apiUrl="/api/your-endpoint/" />
```

3. Убедитесь, что backend возвращает поле `json_ld`

## Troubleshooting

### JSON-LD не появляется

1. Проверьте консоль браузера на ошибки
2. Проверьте Network tab - делается ли запрос к API
3. Убедитесь, что backend возвращает поле `json_ld`
4. Проверьте формат JSON-LD (должен быть валидный JSON)

### Дублирование JSON-LD

1. Убедитесь, что компонент не монтируется дважды
2. Helmet автоматически управляет дубликатами, но лучше избегать их создания

### Не обновляется при смене языка

1. Проверьте, что `includeLang={true}`
2. Убедитесь, что хук `useLanguage()` работает корректно

## Технические детали

### Использование react-helmet-async

Компонент использует `react-helmet-async` вместо прямой манипуляции DOM:

**Преимущества:**

- ✅ Правильная интеграция с React lifecycle
- ✅ Поддержка Server-Side Rendering
- ✅ Автоматическое управление дублированием
- ✅ Вставка в `<head>` синхронизирована с остальными SEO тегами
- ✅ Предсказуемое поведение при навигации

**Как это работает:**

```jsx
<Helmet>
  <script type="application/ld+json">{JSON.stringify(jsonLdData)}</script>
</Helmet>
```

Helmet автоматически:

1. Вставляет script в `<head>` перед `</head>`
2. Обновляет его при изменении данных
3. Удаляет при размонтировании компонента

## Заключение

Реализация полностью готова к использованию. Компонент универсален и может быть легко расширен для поддержки новых API endpoints.

Использование `react-helmet-async` обеспечивает правильную интеграцию с React и SSR, а также гарантирует, что JSON-LD вставляется в `<head>` так же, как и другие SEO метатеги.

Все изменения протестированы, не содержат ошибок линтера и готовы к deployment.
