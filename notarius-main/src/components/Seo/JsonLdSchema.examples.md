# JsonLdSchema - Примеры использования

Универсальный компонент для вставки JSON-LD структурированных данных из API.

## Главная страница

```jsx
import JsonLdSchema from "@components/Seo/JsonLdSchema";

const HomePage = () => {
  return (
    <>
      <Seo title="..." description="..." />
      <JsonLdSchema apiUrl="/api/background-videos/" />

      {/* Остальной контент */}
    </>
  );
};
```

## Страница "Про мене"

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

## Страница контактов

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

## Услуги (1 уровень)

```jsx
import JsonLdSchema from "@components/Seo/JsonLdSchema";
import { useParams } from "react-router-dom";

const ServiceLevel1Page = () => {
  const { slug1 } = useParams();

  return (
    <>
      <Seo title="..." description="..." />
      <JsonLdSchema apiUrl={`/api/services/${slug1}/`} dependencies={[slug1]} />

      {/* Остальной контент */}
    </>
  );
};
```

## Услуги (2 уровень)

```jsx
import JsonLdSchema from "@components/Seo/JsonLdSchema";
import { useParams } from "react-router-dom";

const ServiceLevel2Page = () => {
  const { slug1, slug2 } = useParams();

  return (
    <>
      <Seo title="..." description="..." />
      <JsonLdSchema
        apiUrl={`/api/services/${slug1}/${slug2}/`}
        dependencies={[slug1, slug2]}
      />

      {/* Остальной контент */}
    </>
  );
};
```

## Услуги (3 уровень)

```jsx
import JsonLdSchema from "@components/Seo/JsonLdSchema";
import { useParams } from "react-router-dom";

const ServiceLevel3Page = () => {
  const { slug1, slug2, slug3 } = useParams();

  return (
    <>
      <Seo title="..." description="..." />
      <JsonLdSchema
        apiUrl={`/api/services/${slug1}/${slug2}/${slug3}/`}
        dependencies={[slug1, slug2, slug3]}
      />

      {/* Остальной контент */}
    </>
  );
};
```

## Блог - Список статей

```jsx
import JsonLdSchema from "@components/Seo/JsonLdSchema";

const BlogPage = () => {
  return (
    <>
      <Seo title="..." description="..." />
      <JsonLdSchema apiUrl="/api/blog/notarialni-blog/" />

      {/* Остальной контент */}
    </>
  );
};
```

## Блог - Отдельная статья

```jsx
import JsonLdSchema from "@components/Seo/JsonLdSchema";
import { useParams } from "react-router-dom";

const BlogArticlePage = () => {
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

## Без параметра lang

Если API не принимает параметр `lang`:

```jsx
<JsonLdSchema apiUrl="/api/some-endpoint/" includeLang={false} />
```

## Несколько JSON-LD на одной странице

Можно использовать несколько компонентов на одной странице:

```jsx
const ComplexPage = () => {
  return (
    <>
      <Seo title="..." description="..." />

      {/* Схема организации */}
      <JsonLdSchema apiUrl="/api/organization/" />

      {/* Схема страницы */}
      <JsonLdSchema apiUrl="/api/page-data/" />

      {/* Остальной контент */}
    </>
  );
};
```

## Важные замечания

1. **React Helmet**: Использует `react-helmet-async` для управления `<head>` документа
2. **Автоматическое управление**: При размонтировании или изменении данных Helmet автоматически обновляет теги
3. **Параметр lang**: По умолчанию добавляется автоматически (`?lang=ua|ru|en`)
4. **Вставка в head**: Script вставляется в `<head>` перед `</head>` (как и другие SEO теги)
5. **Формат данных**: Компонент поддерживает `json_ld` как в виде строки, так и объекта
6. **SSR совместимость**: Полная поддержка Server-Side Rendering
7. **Логирование**: В консоль выводятся сообщения об успешной загрузке и ошибках
