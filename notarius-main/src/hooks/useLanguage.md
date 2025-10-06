# useLanguage Hook - Единая система управления языками

## Обзор

`useLanguage` - это хук, который обеспечивает единое управление языками во всем приложении. Все переключатели языков теперь синхронизированы и работают как единое целое.

## Основные возможности

- ✅ **Единое состояние**: Все переключатели языков синхронизированы
- ✅ **Умная навигация**: Автоматическое перенаправление на правильные URL
- ✅ **Интеграция с nav-tree**: Использует структуру навигации для построения URL
- ✅ **Сохранение параметров**: Query параметры и hash сохраняются при переключении
- ✅ **Совместимость**: Работает с существующими компонентами

## Использование

### В компонентах

```jsx
import { useLanguage } from "@hooks/useLanguage";

function MyComponent() {
  const { currentLang, switchLanguage } = useLanguage();

  return (
    <div>
      <p>Текущий язык: {currentLang}</p>
      <button onClick={() => switchLanguage("en")}>
        Переключить на английский
      </button>
    </div>
  );
}
```

### Готовый переключатель

```jsx
import LanguageSwitcher from "@components/LanguageSwitcher/LanguageSwitcher";

function MyComponent() {
  return (
    <div>
      {/* Простой переключатель */}
      <LanguageSwitcher />

      {/* С дополнительными опциями */}
      <LanguageSwitcher variant="vertical" showFullNames={true} />
    </div>
  );
}
```

## API

### useLanguage()

Возвращает объект с:

- `currentLang` (string) - текущий язык (`"ua"`, `"ru"`, `"en"`)
- `switchLanguage(langCode)` (function) - функция для смены языка
- `setLang` (function) - альтернативная функция для совместимости

### LanguageSwitcher Props

- `className` (string) - дополнительные CSS классы
- `buttonClassName` (string) - CSS классы для кнопок
- `activeClassName` (string) - CSS классы для активной кнопки
- `variant` (string) - вариант отображения: `"default"`, `"vertical"`, `"minimal"`
- `showFullNames` (boolean) - показывать полные названия языков

## Интегрированные компоненты

Следующие компоненты уже интегрированы с единой системой:

- ✅ **Header** - переключатель в шапке (десктоп и мобильная версия)
- ✅ **Footer** - переключатель в футере (десктоп и мобильная версия)
- ✅ **LanguageSwitcher** - универсальный компонент переключателя
- ✅ **ApiNavContext** - контекст навигации теперь использует единый язык

## Поддерживаемые языки

- `ua` - Українська (по умолчанию)
- `ru` - Русский
- `en` - English

## Примеры URL

При переключении языка система автоматически строит правильные URL:

```
/ → /ru → /en
/about → /ru/about → /en/about
/ru/services → /services → /en/services
/en/contacts?tab=info → /contacts?tab=info → /ru/contacts?tab=info
```

## Миграция существующих компонентов

Если у вас есть компоненты с собственными переключателями языков:

### Было:

```jsx
const [currentLang, setCurrentLang] = useState("ukr");

const switchLang = (langKey) => {
  setCurrentLang(langKey);
  // какая-то логика...
};
```

### Стало:

```jsx
import { useLanguage } from "@hooks/useLanguage";

const { currentLang, switchLanguage } = useLanguage();

const switchLang = (langKey) => {
  // Маппинг если нужен
  const langMap = { ukr: "ua", rus: "ru", eng: "en" };
  const newLang = langMap[langKey] || langKey;
  switchLanguage(newLang);
};
```

## Тестирование

Для проверки синхронизации добавлен тестовый компонент `LanguageTestComponent`, который можно временно добавить в App.jsx для отладки.

## Устранение неполадок

1. **Язык не переключается**: Убедитесь, что компонент обернут в `LanguageProvider`
2. **URL не меняется**: Проверьте, что страница существует в `nav-tree.js`
3. **Стили не применяются**: Проверьте CSS классы в `LanguageSwitcher.scss`
