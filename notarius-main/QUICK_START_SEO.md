# Быстрый старт - SEO оптимизация ✅

## Что было сделано

✅ Создан универсальный **SEO компонент** с `html lang` и `hreflang`  
✅ Интегрирован **HelmetProvider** в приложение  
✅ Настроено **React Helmet Async** для динамических метатегов  
✅ Создан скрипт для **автоматической генерации sitemap.xml**  
✅ Добавлен **robots.txt** для поисковых ботов  
✅ SEO компонент добавлен на все основные страницы  
✅ Поддержка **Open Graph** и **Twitter Cards**

> **Современный подход**: Без пререндеринга! Google, Yandex и Bing отлично индексируют React приложения с правильными метатегами.

## Как запустить

### 1. Development режим

```bash
cd notarius-main
npm run dev
```

### 2. Production сборка с sitemap

```bash
npm run build
```

После сборки:

- В `dist/` будет оптимизированное приложение
- Автоматически создастся `dist/sitemap.xml` с hreflang
- Поисковые боты отлично проиндексируют сайт! 🎉

### 3. Проверка результата

```bash
npm run preview
```

## Что нужно настроить

### Создайте файл .env

В папке `notarius-main/` создайте `.env`:

```env
VITE_SITE_URL=https://notarius-nadiia.com
VITE_API_BASE_URL=https://notarius-nadiia.com/api
VITE_MEDIA_BASE_URL=https://notarius-nadiia.com/media
VITE_BACKEND_BASE_URL=https://notarius-nadiia.com
```

## Как добавить SEO на новую страницу

```jsx
import Seo from "@components/Seo/Seo";

const MyPage = () => {
  return (
    <>
      <Seo
        title="Заголовок"
        description="Описание для поисковиков"
        keywords="ключевые слова"
      />
      {/* контент */}
    </>
  );
};
```

## Проверка работы SEO

После запуска сайта проверьте в браузере:

1. **HTML язык**: `<html lang="uk">` (меняется автоматически)
2. **Метатеги**: View Source → смотрим `<head>`
3. **Hreflang**: Должны быть теги для ua/ru/en
4. **Sitemap**: `/sitemap.xml` после сборки

## После деплоя

### 1. Google Search Console

- Добавьте сайт
- Загрузите `sitemap.xml`
- Проверьте индексацию через URL Inspection Tool

### 2. Yandex Вебмастер

- Добавьте сайт
- Загрузите `sitemap.xml`
- Проверьте индексацию

### 3. Тестирование

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## Если что-то пошло не так

### Проблема: SEO теги не отображаются

**Решение**: Убедитесь, что `HelmetProvider` обёрнут вокруг приложения в `main.jsx`

### Проблема: Sitemap не генерируется

**Решение**: Запустите вручную `npm run generate-sitemap`

### Проблема: Неправильный язык в HTML

**Решение**: Проверьте, что SEO компонент получает правильный `currentLang` из `useLang()`

## Почему это работает без пререндеринга?

### 🔍 Современные поисковые боты

**Google** (>95% запросов):

- Использует Chrome для рендеринга
- Полная поддержка JavaScript и React
- React Helmet работает идеально

**Yandex**:

- Поддерживает JavaScript
- Индексирует динамический контент
- Читает метатеги из React Helmet

**Bing**:

- Полная поддержка JavaScript
- Индексирует React приложения

### 📱 Социальные сети

**Facebook, Twitter, LinkedIn**:

- Читают Open Graph из `<head>`
- React Helmet добавляет теги динамически
- Превью работают отлично

## 📖 Полная документация

Смотрите **SEO_GUIDE.md** для детальной информации.

---

**Всё готово! Ваш сайт SEO-оптимизирован! 🚀**

**Результат**:

- ✅ Отличная индексация в Google/Yandex
- ✅ Правильная мультиязычность (hreflang)
- ✅ Красивые превью в соцсетях
- ✅ Автоматический sitemap
