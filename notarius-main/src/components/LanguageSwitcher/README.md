# LanguageSwitcher Component

Компонент для переключения языков с интеграцией в навигационную систему.

## Использование

```jsx
import LanguageSwitcher from "@components/LanguageSwitcher/LanguageSwitcher";

// Базовое использование
<LanguageSwitcher />

// С дополнительными стилями
<LanguageSwitcher
  className="my-custom-class"
  buttonClassName="custom-button"
  activeClassName="custom-active"
/>

// Вертикальный вариант
<LanguageSwitcher variant="vertical" />

// Минимальный вариант
<LanguageSwitcher variant="minimal" />

// С полными названиями языков
<LanguageSwitcher showFullNames={true} />
```

## Props

- `className` (string) - Дополнительные CSS классы для контейнера
- `buttonClassName` (string) - Дополнительные CSS классы для кнопок
- `activeClassName` (string) - Дополнительные CSS классы для активной кнопки
- `variant` (string) - Вариант отображения: "default", "vertical", "minimal"
- `showFullNames` (boolean) - Показывать полные названия языков вместо сокращений

## Интеграция с навигацией

Компонент автоматически:

- Определяет текущий язык из URL
- При смене языка перенаправляет на соответствующую страницу с правильным slug
- Использует навигационное дерево для построения корректных URL
- Сохраняет query параметры и hash при переключении

## Поддерживаемые языки

- `ua` - Українська
- `ru` - Русский
- `en` - English

## Примеры URL

При переключении языка:

- `/about` → `/ru/about` → `/en/about`
- `/ru/services` → `/services` → `/en/services`
- `/en/contacts` → `/contacts` → `/ru/contacts`
