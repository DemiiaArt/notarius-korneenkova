# Документация: Ссылки на статьи блога

## Обзор

Реализована функциональность для отображения отдельных статей блога через динамические ссылки со slug-ами.

## Что было сделано

### 1. Создана страница `BlogArticleDetailPage.jsx`

**Путь:** `src/pages/BlogPage/BlogArticleDetailPage.jsx`

**Функциональность:**

- Загружает данные статьи из API по slug через хук `useBlogArticle(slug)`
- Преобразует HTML-контент статьи в формат для `TemplateBlogPage`
- Обрабатывает изображения (обложка и изображения в контенте)
- Форматирует дату публикации
- Извлекает теги из категорий статьи
- Обрабатывает состояния загрузки и ошибок

**Пример использования:**

```jsx
// Страница автоматически получает slug из URL параметров
// URL: /notarialni-blog/my-article-slug
// Slug: "my-article-slug"
```

### 2. Обновлён `AppRoutes.jsx`

**Добавлены маршруты для всех языков:**

```jsx
// Ukrainian (no prefix)
<Route path="/notarialni-blog/:slug" element={<BlogArticleDetailPage />} />

// Russian
<Route path="/ru/notarialni-blog/:slug" element={<BlogArticleDetailPage />} />

// English
<Route path="/en/notary-blog/:slug" element={<BlogArticleDetailPage />} />
```

**Важно:** Маршруты для блога размещены **перед** динамическими маршрутами `/:slug1/:slug2`, чтобы они обрабатывались корректно.

### 3. Исправлен `BlogCard.jsx`

**Изменения:**

- Исправлено использование переменной `displayLink` вместо `link` в условии рендеринга
- Добавлена поддержка мультиязычности при формировании ссылок
- Теперь все карточки блога правильно формируют ссылки с учетом текущего языка

**Структура ссылки:**

```jsx
const getBlogLink = () => {
  if (link !== "#") return link;
  if (!slug) return "#";

  // Определяем slug блога в зависимости от языка
  const blogSlug = currentLang === "en" ? "notary-blog" : "notarialni-blog";

  // Определяем префикс языка
  const langPrefix = currentLang === "ua" ? "" : `/${currentLang}`;

  return `${langPrefix}/${blogSlug}/${slug}`;
};

const displayLink = getBlogLink();
```

**Примеры сформированных ссылок:**

- **Украинский:** `/notarialni-blog/my-article`
- **Русский:** `/ru/notarialni-blog/my-article`
- **Английский:** `/en/notary-blog/my-article`

### 4. Обновлён `SimilarArticles.jsx`

**Изменения:**

- Убраны тестовые данные
- Добавлена загрузка реальных статей из API через хук `useBlog({ page: 1 })`
- Отображаются последние 4 статьи из API
- Добавлена обработка состояния загрузки

## Как это работает

### Поток данных для отображения статьи:

1. **Пользователь кликает на карточку блога**
   - Карточка создаёт ссылку `/notarialni-blog/${slug}` через `displayLink`
2. **React Router обрабатывает URL**
   - Маршрут `/notarialni-blog/:slug` совпадает с запросом
   - Рендерится компонент `BlogArticleDetailPage`
3. **BlogArticleDetailPage загружает данные**
   - Извлекает `slug` из параметров URL через `useParams()`
   - Вызывает `useBlogArticle(slug)` для загрузки данных статьи
   - API запрос: `GET http://localhost:8000/api/blog/notarialni-blog/${slug}/`
4. **Данные преобразуются и отображаются**
   - HTML контент парсится в блоки (параграфы, заголовки, списки, изображения)
   - Данные передаются в `TemplateBlogPage` для отображения

### API Endpoints

**Список статей:**

```
GET /api/blog/notarialni-blog/?lang=ua&page=1
```

**Отдельная статья:**

```
GET /api/blog/notarialni-blog/{slug}/
```

**Структура ответа для статьи:**

```json
{
  "id": 1,
  "title": "Название статьи",
  "slug": "article-slug",
  "excerpt": "Краткое описание",
  "content": "<p>HTML контент статьи</p>",
  "cover": "/media/blog/covers/image.jpg",
  "published_at": "2024-01-08T10:00:00Z",
  "categories": [{ "id": 1, "name": "Категория 1", "slug": "category-1" }]
}
```

## Компоненты

### BlogCard

**Расположение:** `src/components/Blog/BlogCard.jsx`

**Принимаемые props:**

```jsx
{
  slug: "article-slug",        // Slug статьи для формирования ссылки
  title: "Название статьи",    // Заголовок
  excerpt: "Краткое описание", // Описание
  cover: "/media/image.jpg",   // Обложка
  published_at: "2024-01-08",  // Дата публикации
  categories: [],              // Категории статьи
  maxTextLength: 120           // Макс. длина текста
}
```

### BlogArticleDetailPage

**Расположение:** `src/pages/BlogPage/BlogArticleDetailPage.jsx`

**Использует:**

- `useParams()` - для получения slug из URL
- `useBlogArticle(slug)` - для загрузки данных статьи
- `TemplateBlogPage` - для отображения контента

### TemplateBlogPage

**Расположение:** `src/pages/BlogPage/TemplateBlogPage.jsx`

**Принимаемые props:**

```jsx
{
  title: "Название статьи",
  content: [                    // Массив блоков контента
    { type: "paragraph", text: "..." },
    { type: "title", text: "..." },
    { type: "list", items: [...] },
    { type: "image", src: "...", alt: "..." }
  ],
  heroImage: "/path/to/image.jpg",
  tags: ["тег1", "тег2"],
  publishDate: "8 січня 2024"
}
```

## Пример использования

### В списке блога (MainBlogPage.jsx)

```jsx
const blogCardsList = articles.map((article) => (
  <li className="blog-card-item" key={article.id}>
    <BlogCard
      {...article} // Передаём все данные статьи
      maxTextLength={120} // Ограничение текста
    />
  </li>
));
```

### В похожих статьях (SimilarArticles.jsx)

```jsx
const { articles, loading } = useBlog({ page: 1 });
const similarArticles = articles.slice(0, 4);

{
  similarArticles.map((article) => <BlogCard {...article} key={article.id} />);
}
```

## Поддержка языков

Все маршруты поддерживают три языка:

- **Украинский:** `/notarialni-blog/:slug` (без префикса)
- **Русский:** `/ru/notarialni-blog/:slug`
- **Английский:** `/en/notary-blog/:slug` ⚠️ **Обратите внимание:** для английского используется `notary-blog`

### Важно!

При переключении языка на английский (en), slug блога меняется с `notarialni-blog` на `notary-blog`. Компонент `BlogCard` автоматически определяет текущий язык через `useLanguage()` и формирует корректную ссылку.

### Исправления для поддержки мультиязычности

**Проблема:** При переключении на английский язык страница статьи не находилась.

**Причины:**

1. Ссылки в `BlogCard` формировались без учета текущего языка
2. Hook `useBlogArticle` не передавал параметр `lang` в API запрос

**Решение:**

1. Обновлён `BlogCard.jsx` - добавлена функция `getBlogLink()`, которая формирует правильную ссылку в зависимости от `currentLang`
2. Обновлён `useBlogArticle` hook - добавлен параметр `lang` в API запрос:
   ```javascript
   const url = `/blog/notarialni-blog/${articleSlug}/?lang=${currentLang}`;
   ```

## Обработка ошибок

1. **Статья не найдена (404)**
   - Показывается сообщение "Статтю не знайдено"

2. **Ошибка загрузки**
   - Показывается сообщение об ошибке с деталями

3. **Статья загружается**
   - Показывается `Loader` компонент

## Примечания

- API endpoint для статьи должен возвращать данные в формате JSON
- Контент статьи должен быть в HTML формате
- Изображения автоматически преобразуются в абсолютные URL с `BACKEND_BASE_URL`
- Slug статьи должен быть уникальным и соответствовать URL-friendly формату
