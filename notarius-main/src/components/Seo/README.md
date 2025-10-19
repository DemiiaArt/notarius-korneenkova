# SEO Components - JSON-LD Schema Integration

## Описание

Универсальная система для автоматической вставки JSON-LD структурированных данных (Schema.org) из backend API в `<head>` документа.

## Компоненты

### 1. `JsonLdSchema` - Универсальный компонент

Основной компонент для вставки JSON-LD данных. Работает со всеми API endpoints, которые возвращают поле `json_ld`.

**Файл:** `src/components/Seo/JsonLdSchema.jsx`

#### Props

| Prop           | Тип       | По умолчанию     | Описание                                                    |
| -------------- | --------- | ---------------- | ----------------------------------------------------------- |
| `apiUrl`       | `string`  | **обязательный** | URL для загрузки данных (например, `/api/about-me/detail/`) |
| `includeLang`  | `boolean` | `true`           | Добавлять ли параметр `lang` к URL                          |
| `params`       | `object`  | `{}`             | Дополнительные параметры запроса                            |
| `dependencies` | `array`   | `[]`             | Дополнительные зависимости для useEffect                    |

#### Принцип работы

1. При монтировании компонента делается запрос на указанный `apiUrl`
2. Из ответа извлекается поле `json_ld` (может быть строкой или объектом)
3. Данные сохраняются в state компонента
4. Через `react-helmet-async` создается `<script type="application/ld+json">` тег
5. Тег автоматически вставляется в `<head>` документа (перед `</head>`)
6. При размонтировании или изменении языка Helmet автоматически обновляет тег

### 2. `useServiceJsonLd` - Хук для страниц услуг

Автоматически строит правильный API URL для страниц услуг на основе навигационного дерева.

**Файл:** `src/hooks/useServiceJsonLd.js`

#### Использование

```jsx
import { useServiceJsonLd } from "@hooks/useServiceJsonLd";

const apiUrl = useServiceJsonLd("notary-translate");
// Вернет: "/api/services/notarialni-poslugi/notarialnyj-pereklad/"
```

## Использование

### Главная страница

```jsx
import JsonLdSchema from "@components/Seo/JsonLdSchema";

const MainPage = () => {
  return (
    <>
      <Seo title="..." description="..." />
      <JsonLdSchema apiUrl="/api/background-videos/" />

      {/* Остальной контент */}
    </>
  );
};
```

**Файл:** `src/pages/MainPage/MainPage.jsx`

### Страница "Про мене"

```jsx
import JsonLdSchema from "@components/Seo/JsonLdSchema";

const AboutPage = () => {
  return (
    <>
      <Seo title="..." description="..." />
      <JsonLdSchema apiUrl="/api/about-me/detail/" />

      {/* Остальной контент */}
    </>
  );
};
```

**Файл:** `src/pages/AboutPage/AboutPage.jsx`

### Страница контактов

```jsx
import JsonLdSchema from "@components/Seo/JsonLdSchema";

const ContactsPage = () => {
  return (
    <>
      <Seo title="..." description="..." />
      <JsonLdSchema apiUrl="/api/video-blocks/" params={{ type: "contacts" }} />

      {/* Остальной контент */}
    </>
  );
};
```

**Файл:** `src/pages/ContactsPage/ContactsPage.jsx`

### Блог - Список статей

```jsx
import JsonLdSchema from "@components/Seo/JsonLdSchema";

const MainBlogPage = () => {
  return (
    <>
      <JsonLdSchema apiUrl="/api/blog/notarialni-blog/" />

      {/* Остальной контент */}
    </>
  );
};
```

**Файл:** `src/pages/BlogPage/MainBlogPage.jsx`

### Блог - Отдельная статья

```jsx
import JsonLdSchema from "@components/Seo/JsonLdSchema";
import { useParams } from "react-router-dom";

const BlogArticleDetailPage = () => {
  const { slug } = useParams();

  return (
    <>
      <Seo title="..." description="..." />
      <JsonLdSchema
        apiUrl={`/api/blog/notarialni-blog/${slug}/`}
        dependencies={[slug]}
      />

      {/* Остальной контент */}
    </>
  );
};
```

**Файл:** `src/pages/BlogPage/BlogArticleDetailPage.jsx`

### Услуги (автоматически через PageTemplate)

Для страниц услуг JSON-LD добавляется автоматически через компонент `PageTemplate`:

```jsx
const ServicesPage = () => {
  const { data, loading, error } = usePageData("services");

  return (
    <PageTemplate
      pageData={data}
      loading={loading}
      error={error}
      navId="services" // ← JSON-LD добавится автоматически
    >
      {/* Остальной контент */}
    </PageTemplate>
  );
};
```

**Файл:** `src/pages/ServicesPage/ServicesPage.jsx`

**PageTemplate** автоматически:

1. Использует хук `useServiceJsonLd(navId)` для построения правильного URL
2. Добавляет компонент `JsonLdSchema` с этим URL
3. Работает для всех уровней вложенности услуг (1-3 уровня)

**Файл:** `src/components/PageTemplate/PageTemplate.jsx`

### Услуги (вручную для специфических случаев)

Если нужно вручную добавить JSON-LD для конкретной услуги:

```jsx
import JsonLdSchema from "@components/Seo/JsonLdSchema";
import { useParams } from "react-router-dom";

const ServiceDetailPage = () => {
  const { slug1, slug2, slug3 } = useParams();

  // Для 1 уровня
  const apiUrl1 = `/api/services/${slug1}/`;

  // Для 2 уровня
  const apiUrl2 = `/api/services/${slug1}/${slug2}/`;

  // Для 3 уровня
  const apiUrl3 = `/api/services/${slug1}/${slug2}/${slug3}/`;

  return (
    <>
      <Seo title="..." description="..." />
      <JsonLdSchema
        apiUrl={apiUrl3} // Используйте нужный уровень
        dependencies={[slug1, slug2, slug3]}
      />

      {/* Остальной контент */}
    </>
  );
};
```

## Backend Requirements

Backend должен возвращать поле `json_ld` в ответе API. Это поле может быть:

1. **Строкой JSON:**

   ```json
   {
     "title": "...",
     "json_ld": "{\"@context\": \"https://schema.org\", \"@type\": \"Person\", ...}"
   }
   ```

2. **Объектом:**
   ```json
   {
     "title": "...",
     "json_ld": {
       "@context": "https://schema.org",
       "@type": "Person",
       "name": "..."
     }
   }
   ```

## Поддерживаемые API Endpoints

| Страница    | API Endpoint                             | Параметры               |
| ----------- | ---------------------------------------- | ----------------------- |
| Главная     | `/api/background-videos/`                | `lang`                  |
| Про мене    | `/api/about-me/detail/`                  | `lang`                  |
| Контакты    | `/api/video-blocks/`                     | `lang`, `type=contacts` |
| Услуги (1)  | `/api/services/{slug1}/`                 | `lang`                  |
| Услуги (2)  | `/api/services/{slug1}/{slug2}/`         | `lang`                  |
| Услуги (3)  | `/api/services/{slug1}/{slug2}/{slug3}/` | `lang`                  |
| Блог список | `/api/blog/notarialni-blog/`             | `lang`                  |
| Блог статья | `/api/blog/notarialni-blog/{slug}/`      | `lang`                  |

## Дополнительные опции

### Без параметра lang

Если API не принимает параметр `lang`:

```jsx
<JsonLdSchema apiUrl="/api/some-endpoint/" includeLang={false} />
```

### Несколько JSON-LD на одной странице

```jsx
const ComplexPage = () => {
  return (
    <>
      <JsonLdSchema apiUrl="/api/organization/" />

      <JsonLdSchema apiUrl="/api/page-data/" />

      {/* Остальной контент */}
    </>
  );
};
```

## Отладка

В консоль браузера выводятся сообщения:

- ✅ `JSON-LD schema inserted from {apiUrl}` - успешная вставка
- ⚠️ `Failed to load JSON-LD schema from {apiUrl}` - ошибка загрузки (404, 500, и т.д.)
- ❌ `Error loading JSON-LD schema from {apiUrl}` - ошибка парсинга или сети

## Проверка результата

После внедрения проверьте:

1. **В браузере:**
   - Откройте DevTools → Elements
   - Найдите в `<head>` теги `<script type="application/ld+json">`
   - Проверьте содержимое

2. **Google Rich Results Test:**
   - https://search.google.com/test/rich-results
   - Вставьте URL страницы
   - Проверьте структурированные данные

3. **Schema Markup Validator:**
   - https://validator.schema.org/
   - Проверьте валидность JSON-LD

## Важные замечания

1. ✅ Использует `react-helmet-async` для управления `<head>` документа
2. ✅ Script тег **автоматически обновляется** при изменении данных
3. ✅ При размонтировании компонента тег автоматически удаляется
4. ✅ Поддерживается многоязычность (ua, ru, en)
5. ✅ Полная совместимость с Server-Side Rendering (SSR)
6. ✅ Вставляется в `<head>` перед `</head>` (как и другие SEO теги)
7. ⚠️ Убедитесь, что backend возвращает валидный JSON-LD
8. ⚠️ Проверьте, что `json_ld` содержит корректную структуру Schema.org

## Troubleshooting

### Проблема: JSON-LD не вставляется

**Решение:**

1. Проверьте консоль на ошибки
2. Убедитесь, что API возвращает поле `json_ld`
3. Проверьте, что URL правильный
4. Проверьте сетевые запросы в DevTools

### Проблема: Дублирование JSON-LD

**Решение:**

1. Убедитесь, что компонент монтируется только один раз
2. Проверьте, что нет нескольких `JsonLdSchema` с одинаковым `apiUrl` на одной странице
3. Helmet автоматически управляет дубликатами, но лучше избегать их создания

### Проблема: JSON-LD не обновляется при изменении языка

**Решение:**

1. Убедитесь, что `includeLang={true}` (по умолчанию)
2. Проверьте, что `useLanguage()` работает корректно
3. Проверьте массив `dependencies` в useEffect

## Связанные файлы

- `src/components/Seo/JsonLdSchema.jsx` - основной компонент
- `src/components/Seo/JsonLdSchema.examples.md` - детальные примеры
- `src/hooks/useServiceJsonLd.js` - хук для услуг
- `src/components/PageTemplate/PageTemplate.jsx` - шаблон со встроенным JSON-LD
- `src/components/Seo/Seo.jsx` - компонент для метатегов
- `src/components/Seo/BreadcrumbSchema.jsx` - хлебные крошки JSON-LD

## Changelog

### v1.1.0 (2025-10-19)

- ✅ Переход на `react-helmet-async` для управления `<head>`
- ✅ Улучшена интеграция с React и SSR
- ✅ JSON-LD теперь вставляется в `<head>` перед `</head>` (как метатеги)
- ✅ Убран prop `scriptId` (Helmet управляет автоматически)
- ✅ Оптимизирована работа с state

### v1.0.0 (2025-10-19)

- ✅ Создан универсальный компонент `JsonLdSchema`
- ✅ Добавлен хук `useServiceJsonLd` для страниц услуг
- ✅ Интегрирован в `PageTemplate` для автоматической вставки
- ✅ Добавлен на все основные страницы (главная, о нас, контакты, блог)
- ✅ Поддержка многоязычности
- ✅ Автоматическая очистка при размонтировании
