# JSON-LD Breadcrumb Schema для SEO

## Описание

Реализована система автоматической генерации структурированных данных JSON-LD для хлебных крошек (breadcrumbs) на каждой странице сайта. Это улучшает SEO и помогает поисковым системам лучше понимать структуру сайта.

## Как это работает

### 1. Хук `useBreadcrumbSchema`

**Файл:** `src/hooks/useBreadcrumbSchema.js`

Хук автоматически генерирует JSON-LD схему на основе:

- Текущего URL (location)
- Дерева навигации (navTree из HybridNavContext)
- Текущего языка
- Тех же данных, что использует компонент Breadcrumbs

**Возвращает:** JSON-строку со схемой или `null`, если данные еще не готовы.

### 2. Компонент `BreadcrumbSchema`

**Файл:** `src/components/SEO/BreadcrumbSchema.jsx`

Компонент:

- Использует хук `useBreadcrumbSchema` для получения схемы
- Автоматически вставляет `<script type="application/ld+json">` в конец `<body>`
- Обновляет скрипт при каждом переключении страницы
- Удаляет старый скрипт перед добавлением нового
- Ничего не рендерит в DOM (возвращает `null`)

### 3. Интеграция в приложение

**Файл:** `src/App.jsx`

Компонент `BreadcrumbSchema` добавлен в `AppContent`, что обеспечивает:

- Работу на всех страницах приложения
- Автоматическое обновление при навигации
- Доступ ко всем необходимым контекстам (HybridNav, Language)

## Пример сгенерированной схемы

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Головна",
      "item": "https://site.ua/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Нотаріальні послуги",
      "item": "https://site.ua/notarialni-poslugy/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Договір дарування",
      "item": "https://site.ua/dogovir-daruvannya-neruhomosti/"
    }
  ]
}
```

## Особенности реализации

1. **Динамичность:** Схема обновляется при каждом изменении URL
2. **Синхронизация:** Использует те же данные, что и визуальные хлебные крошки
3. **Мультиязычность:** Автоматически подстраивается под текущий язык (ua/ru/en)
4. **Производительность:** Использует `useMemo` для оптимизации
5. **Clean-up:** Правильно удаляет старые скрипты при размонтировании

## Преимущества для SEO

- ✅ Помогает поисковым системам понять иерархию страниц
- ✅ Улучшает отображение в результатах поиска (rich snippets)
- ✅ Соответствует стандартам Schema.org
- ✅ Автоматически обновляется без ручного вмешательства

## Проверка работы

1. Откройте сайт в браузере
2. Перейдите на любую страницу
3. Откройте DevTools → Elements
4. В конце `<body>` найдите:
   ```html
   <script id="breadcrumb-schema" type="application/ld+json">
     { "@context":"https://schema.org", ... }
   </script>
   ```
5. При переходе на другую страницу содержимое скрипта автоматически обновится

## Валидация

Проверить корректность схемы можно с помощью:

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

## Зависимости

- React Router (useLocation)
- HybridNavContext
- useLanguage hook
- nav-utils (findPathStackById, buildFullPathForId, getLabel)
