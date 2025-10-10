# Интеграция блога с 2 уровнями вложенности

## Что было сделано

Backend добавляет в navTree блог со статьями как children:

```json
{
  "id": "blog",
  "kind": "page",
  "children": [
    {
      "id": "article-1",
      "slug": { "ua": "stattya-1", "ru": "statya-1", "en": "article-1" },
      ...
    },
    {
      "id": "article-2",
      ...
    }
  ]
}
```

### 1. Обновлен `nav-tree.js`

**До:**

```javascript
{
  id: "blog",
  kind: "page",
  showInMenu: false,
  children: [
    {
      id: "blog-article", // статичный child
      ...
    }
  ]
}
```

**После:**

```javascript
{
  id: "blog",
  kind: "page",
  showInMenu: true,  // показываем в меню
  children: [],      // статьи будут добавлены из backend
}
```

### 2. Обновлен `BlogArticlePage.jsx`

**До:** Использовал статичные данные из `blogData.js`
**После:** Работает как обертка над `BlogArticleDetailPage`, который загружает данные из API

```javascript
const BlogArticlePage = () => {
  return <BlogArticleDetailPage />;
};
```

### 3. Обновлен `component-registry.js`

Добавлена автоматическая регистрация статей блога:

```javascript
function assignComponents(node, parentId = null) {
  // Прикрепляем компонент по ID
  if (node.id && hasComponent(node.id)) {
    node.component = getComponentById(node.id);
  }
  // Специальная обработка для статей блога
  // Если узел - это child блога и начинается с "article-", используем BlogArticlePage
  else if (parentId === "blog" && node.id && node.id.startsWith("article-")) {
    node.component = getComponentById("blog-article");
    console.log(`📝 Назначен BlogArticlePage для статьи: ${node.id}`);
  }
  // ...
}
```

Теперь все статьи из backend (`article-1`, `article-2`, etc.) автоматически получают компонент `BlogArticlePage`.

### 4. Роутинг

Уже существующие роуты в `AppRoutes.jsx`:

```javascript
{/* Blog article routes */}
<Route path="/notarialni-blog/:slug" element={<BlogArticleDetailPage />} />
<Route path="/ru/notarialni-blog/:slug" element={<BlogArticleDetailPage />} />
<Route path="/en/notary-blog/:slug" element={<BlogArticleDetailPage />} />
```

Эти роуты обрабатывают все статьи блога.

### 5. Breadcrumbs

`Breadcrumbs.jsx` уже работает с `HybridNavContext` и автоматически отображает путь для статей из navTree:

- Блог → Статья

### 6. Header/Navigation

Блог уже добавлен в `Header.jsx` без мега-панели:

**Desktop:**

```javascript
<Link className="navbar-link" to={getNavUrl("blog")}>
  {getNavLabel("blog")}
</Link>
```

**Mobile:**

```javascript
<Link onClick={closeMenu} to={getNavUrl("blog")} className="mobile-menu-item">
  {getNavLabel("blog")}
</Link>
```

## Структура URL

### Украинская версия (без префикса)

- **Уровень 1**: `/notarialni-blog` → `MainBlogPage` (список всех статей)
- **Уровень 2**: `/notarialni-blog/stattya-1` → `BlogArticleDetailPage` (статья)

### Русская версия

- **Уровень 1**: `/ru/notarialni-blog`
- **Уровень 2**: `/ru/notarialni-blog/statya-1`

### Английская версия

- **Уровень 1**: `/en/notary-blog`
- **Уровень 2**: `/en/notary-blog/article-1`

## Как это работает

1. **Backend** добавляет блог в navTree со статьями как children
2. **component-registry** автоматически назначает `BlogArticlePage` всем статьям (article-\*)
3. **BlogArticlePage** использует `BlogArticleDetailPage` для загрузки данных из API
4. **Breadcrumbs** автоматически показывают путь: Головна / Блог / Стаття
5. **Header** показывает блог в навигации без мега-панели
6. **Routes** обрабатывают статьи через существующие роуты

## Преимущества

✅ Статьи автоматически добавляются из backend
✅ Не нужно регистрировать каждую статью отдельно
✅ Работает с breadcrumbs и навигацией
✅ Поддержка мультиязычности
✅ SEO-friendly URL
✅ Блог в навигации без мега-панели

## Тестирование

Для проверки:

1. Убедитесь что backend возвращает статьи в navTree
2. Перезапустите frontend: `npm run dev`
3. Проверьте:
   - `/notarialni-blog` - главная блога (список статей)
   - `/notarialni-blog/stattya-1` - страница статьи
   - Breadcrumbs показывают правильный путь
   - Блог виден в Header

## Примечания

- Статьи загружаются из API через `useBlogArticle(slug)`
- Все статьи используют один компонент `BlogArticleDetailPage`
- Backend должен возвращать статьи с id начинающимся с "article-"
- Мега-панель для блога не показывается (хардкодед в Header)
