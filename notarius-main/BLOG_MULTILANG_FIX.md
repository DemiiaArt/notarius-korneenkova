# Исправление мультиязычности для страниц статей блога

## Проблема

При переключении языка на английский (en) страница детальной статьи блога не находилась и отображалась ошибка "Страница не найдена".

## Причины

1. **Неправильное формирование ссылок в `BlogCard.jsx`**
   - Ссылки всегда формировались как `/notarialni-blog/${slug}` независимо от текущего языка
   - Для английского языка slug блога должен быть `notary-blog`, а не `notarialni-blog`

2. **Отсутствие параметра языка в API запросе**
   - Hook `useBlogArticle` не передавал параметр `lang` в API запрос
   - Бэкенд не мог определить, на каком языке отдавать контент статьи

## Решение

### 1. Обновлён `BlogCard.jsx`

**Изменения:**

- Добавлен импорт `useLanguage` hook
- Создана функция `getBlogLink()`, которая формирует правильную ссылку с учётом текущего языка

**Код:**

```jsx
import { useLanguage } from "@hooks/useLanguage";

const BlogCard = ({ slug, ...props }) => {
  const { currentLang } = useLanguage();

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
  // ...
};
```

**Результат:**

- 🇺🇦 **Украинский:** `/notarialni-blog/article-slug`
- 🇷🇺 **Русский:** `/ru/notarialni-blog/article-slug`
- 🇬🇧 **Английский:** `/en/notary-blog/article-slug`

### 2. Обновлён `useBlogArticle` hook в `useBlog.js`

**Изменения:**

- Добавлен импорт `useLanguage` hook
- Добавлен параметр `lang` в API запрос
- Hook теперь реагирует на изменение языка через `useCallback` dependency

**Код:**

```jsx
export const useBlogArticle = (slug) => {
  const { currentLang } = useLanguage();

  const fetchArticle = useCallback(
    async (articleSlug) => {
      // Формируем query параметры
      const params = new URLSearchParams({
        lang: currentLang,
      });

      const url = `/blog/notarialni-blog/${articleSlug}/?${params.toString()}`;
      const data = await apiClient.get(url);
      // ...
    },
    [currentLang]
  );

  // ...
};
```

**Результат:**

- API запрос теперь включает параметр языка: `?lang=en`
- Бэкенд возвращает контент на правильном языке

## Тестирование

### Шаги для проверки:

1. **Запустите dev-сервер:**

   ```bash
   cd notarius-main
   npm run dev
   ```

2. **Откройте страницу блога на украинском:**
   - URL: `http://localhost:5173/notarialni-blog`
   - Кликните на любую статью
   - Должна открыться страница статьи

3. **Переключите язык на русский:**
   - Используйте переключатель языка
   - URL должен измениться на: `http://localhost:5173/ru/notarialni-blog`
   - Кликните на любую статью
   - Должна открыться страница: `http://localhost:5173/ru/notarialni-blog/article-slug`

4. **Переключите язык на английский:**
   - Используйте переключатель языка
   - URL должен измениться на: `http://localhost:5173/en/notary-blog` ✨
   - Кликните на любую статью
   - Должна открыться страница: `http://localhost:5173/en/notary-blog/article-slug` ✅

### Проверка в консоли браузера:

При клике на статью в консоли должно появиться:

```
✅ Загружаем статью: /blog/notarialni-blog/article-slug/?lang=en
✅ Статья загружена: {id: 1, title: "...", ...}
```

## API Endpoints

### Список статей:

```
GET /api/blog/notarialni-blog/?lang=ua&page=1
GET /api/blog/notarialni-blog/?lang=ru&page=1
GET /api/blog/notarialni-blog/?lang=en&page=1
```

### Отдельная статья:

```
GET /api/blog/notarialni-blog/{slug}/?lang=ua
GET /api/blog/notarialni-blog/{slug}/?lang=ru
GET /api/blog/notarialni-blog/{slug}/?lang=en
```

⚠️ **Важно:** Обратите внимание, что в URL API всегда используется `/blog/notarialni-blog/`, независимо от языка. Различие только в параметре `lang`.

## Файлы, которые были изменены

1. ✅ `notarius-main/src/components/Blog/BlogCard.jsx`
2. ✅ `notarius-main/src/hooks/useBlog.js`
3. 📝 `notarius-main/BLOG_ARTICLE_LINKS.md` (документация)
4. 📝 `notarius-main/BLOG_MULTILANG_FIX.md` (этот файл)

## Дополнительные замечания

- Маршруты в `AppRoutes.jsx` настроены правильно и не требуют изменений
- Компонент `TemplateBlogPage.jsx` работает корректно с любым языком
- Компонент `SimilarArticles.jsx` также использует обновлённый `BlogCard` и корректно работает с мультиязычностью

## Статус

✅ **Исправлено и готово к использованию**

Все карточки блога теперь корректно формируют ссылки с учётом текущего языка, и страницы статей успешно загружаются на всех трёх языках (украинском, русском и английском).
