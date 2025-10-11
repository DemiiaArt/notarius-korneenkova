# Руководство по SEO оптимизации

## 📋 Что было реализовано

### 1. ✅ SEO без пререндеринга (современный подход)

Используется комбинация **React Helmet Async + правильные метатеги + sitemap.xml**, что обеспечивает отличную индексацию современными поисковыми ботами (Google, Yandex, Bing).

> **Почему без пререндеринга?** Современные поисковые боты отлично индексируют React приложения. Google использует полноценный Chrome для рендеринга, поэтому React Helmet с правильными метатегами работает идеально.

### 2. ✅ Создан SEO компонент

Компонент `Seo` расположен в `src/components/Seo/Seo.jsx` и включает:

- Динамическое управление `<html lang>` атрибутом
- Автоматическую генерацию `hreflang` тегов для всех языков (uk, ru, en)
- Open Graph теги для соцсетей
- Twitter Card теги
- Canonical URL
- Поддержку кастомных метатегов

### 3. ✅ Интегрирован HelmetProvider

React Helmet Provider добавлен в `src/main.jsx` для управления метатегами на уровне приложения.

### 4. ✅ Генерация sitemap.xml

Скрипт `scripts/generate-sitemap.js` автоматически генерирует sitemap с:

- Всеми маршрутами для трех языков
- Правильными `hreflang` тегами
- Приоритетами и частотой обновления
- Датой последнего изменения

### 5. ✅ Создан robots.txt

Файл `public/robots.txt` с правильными настройками для поисковых ботов.

### 6. ✅ SEO компонент добавлен на страницы

- **MainPage**: Главная страница с основными SEO данными
- **AboutPage**: Страница "О мене"
- **ContactsPage**: Контакты
- **BlogArticleDetailPage**: Страницы отдельных статей блога (с динамическими метатегами)

### 7. ✅ Обновлены скрипты в package.json

- `npm run build` - собирает проект и генерирует sitemap
- `npm run build:no-sitemap` - только сборка без sitemap
- `npm run generate-sitemap` - генерация sitemap отдельно

## 🚀 Как использовать

### Добавление SEO на новую страницу

```jsx
import Seo from "@components/Seo/Seo";

const MyPage = () => {
  return (
    <>
      <Seo
        title="Заголовок страницы"
        description="Описание страницы для поисковиков"
        keywords="ключевые, слова, через, запятую"
        ogImage="/path/to/image.jpg" // опционально
      />
      {/* Остальной контент страницы */}
    </>
  );
};
```

### Сборка проекта

```bash
# Development режим
npm run dev

# Production сборка с sitemap
npm run build

# Только сборка без sitemap
npm run build:no-sitemap

# Только генерация sitemap
npm run generate-sitemap

# Предварительный просмотр production сборки
npm run preview
```

### Настройка URL сайта

Создайте файл `.env` в корне проекта `notarius-main/`:

```env
# Базовый URL сайта (для SEO и sitemap)
VITE_SITE_URL=https://notarius-nadiia.com

# API endpoints
VITE_API_BASE_URL=https://notarius-nadiia.com/api
VITE_MEDIA_BASE_URL=https://notarius-nadiia.com/media
VITE_BACKEND_BASE_URL=https://notarius-nadiia.com
```

## 📝 Важные моменты

### SEO компонент

1. **Язык HTML**: Автоматически устанавливается на основе `currentLang` (ua → uk, ru → ru, en → en)

2. **Hreflang теги**: Генерируются для всех трех языков с правильными URL
   - `uk` - украинский (по умолчанию, без префикса)
   - `ru` - русский (префикс `/ru`)
   - `en` - английский (префикс `/en`)
   - `x-default` - украинский как язык по умолчанию

3. **Open Graph**: Поддержка изображений, типа контента (website/article), локали

4. **Canonical URL**: Автоматически генерируется на основе текущего пути

### Sitemap

1. **Автоматическая генерация**: Запускается после каждой сборки проекта

2. **Hreflang в sitemap**: Каждый URL содержит альтернативные версии на других языках

3. **Приоритеты**:
   - Главная страница: 1.0
   - Основные страницы: 0.9
   - Блог: 0.9
   - Услуги: 0.8
   - Служебные страницы: 0.3-0.5

4. **Частота обновления**:
   - Главная и блог: daily
   - Основные страницы: weekly
   - Служебные: yearly

## 🔧 Добавление новых маршрутов в sitemap

Если вы добавляете новую страницу, обновите массив `routes` в `scripts/generate-sitemap.js`:

```javascript
const routes = [
  // ... существующие маршруты
  { url: "/novaya-stranitsa", priority: "0.8", changefreq: "weekly" },
  { url: "/ru/novaya-stranitsa", priority: "0.7", changefreq: "weekly" },
  { url: "/en/new-page", priority: "0.7", changefreq: "weekly" },
];
```

## 🐛 Отладка

### Проверка SEO тегов

1. Откройте браузер в dev mode
2. Проверьте `<head>` секцию - должны быть:
   - `<html lang="uk">` (или ru/en)
   - Правильные `<title>` и `<meta name="description">`
   - Теги `<link rel="alternate" hreflang="...">`
   - Open Graph теги

### Проверка sitemap

1. После сборки откройте `dist/sitemap.xml`
2. Проверьте, что все URL присутствуют
3. Проверьте hreflang теги для каждого URL

### Тестирование в Google

1. **Google Search Console**: Загрузите sitemap.xml
2. **URL Inspection Tool**: Проверьте индексацию страниц
3. **Rich Results Test**: Проверьте структурированные данные

## 📚 Дополнительные ресурсы

- [React Helmet Async](https://github.com/staylor/react-helmet-async)
- [Google Search Central - hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Sitemaps XML формат](https://www.sitemaps.org/protocol.html)
- [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)

## ✨ Результат

После выполнения всех настроек:

1. ✅ **Поисковые боты индексируют контент** - React Helmet + правильные метатеги
2. ✅ **Правильная мультиязычность** - hreflang теги для всех языков
3. ✅ **SEO-оптимизация** - правильные метатеги на всех страницах
4. ✅ **Социальные сети** - Open Graph для красивых превью
5. ✅ **Автоматический sitemap** - генерируется при каждой сборке
6. ✅ **robots.txt** - правильные директивы для ботов

## 🌐 Почему это работает без пререндеринга?

### Google (>95% поисковых запросов)

- Использует полноценный Chrome для рендеринга
- Отлично индексирует React приложения
- React Helmet работает идеально

### Yandex

- Поддерживает JavaScript и React
- Индексирует динамический контент
- Рекомендует использовать метатеги

### Bing

- Полная поддержка JavaScript
- Индексирует React приложения

### Социальные сети

- Читают Open Graph теги из HTML
- React Helmet добавляет теги в `<head>`
- Превью работают корректно

**Вывод**: Для современных веб-приложений React Helmet + правильные метатеги + sitemap = отличное SEO! 🎉
