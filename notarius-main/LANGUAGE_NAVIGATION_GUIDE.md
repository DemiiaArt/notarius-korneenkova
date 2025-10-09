# 🌍 Руководство по навигации с учетом языка

## Проблема

При смене языка пользователь должен оставаться на той же странице, но на новом языке. Например:

- Пользователь на `/notarialni-pro-mene` (UA - страница "О нас")
- Переключает язык на English
- Должен попасть на `/notary-about` (EN - та же страница "О нас")

## Решение

Создан универсальный хук `useNavigateWithLang`, который автоматически учитывает текущий язык и правильно строит пути.

## Как использовать

### 1. Импорт хука

```javascript
import { useNavigateWithLang } from "@hooks/useNavigateWithLang";
```

### 2. Использование в компоненте

```javascript
function MyComponent() {
  const { navigateToPage } = useNavigateWithLang();

  return (
    <button onClick={() => navigateToPage("about")}>
      Перейти на страницу "О нас"
    </button>
  );
}
```

### 3. Переход на страницу с конкретным языком

```javascript
function MyComponent() {
  const { navigateToPage } = useNavigateWithLang();

  return (
    <>
      <button onClick={() => navigateToPage("about")}>
        О нас (текущий язык)
      </button>
      <button onClick={() => navigateToPage("about", "en")}>
        About (English)
      </button>
      <button onClick={() => navigateToPage("about", "ru")}>
        О нас (Русский)
      </button>
    </>
  );
}
```

## Как работает переключение языка

Переключение языка уже настроено в компоненте `LanguageSwitcher`. Когда пользователь переключает язык:

1. `LanguageSwitcher` вызывает `switchLanguage(newLang)` из хука `useLanguage`
2. `useLanguage` автоматически:
   - Определяет текущую страницу по URL
   - Находит её ID в навигационном дереве
   - Строит новый путь для выбранного языка
   - Переводит пользователя на эту страницу

**Пример:**

```
Текущий URL: /notarialni-pro-mene (UA)
           ↓ пользователь выбирает English
Новый URL:   /notary-about (EN)
```

## Доступные ID страниц

Все страницы определены в `src/nav/nav-tree.js`:

| ID страницы        | UA путь                | RU путь                | EN путь             |
| ------------------ | ---------------------- | ---------------------- | ------------------- |
| `home`             | `/`                    | `/`                    | `/`                 |
| `about`            | `/notarialni-pro-mene` | `/notarialni-pro-mene` | `/notary-about`     |
| `services`         | `/notarialni-poslugy`  | `/notarialni-poslugy`  | `/notary-services`  |
| `contacts`         | `/contacts`            | `/contacts`            | `/contacts`         |
| `blog`             | `/blog`                | `/blog`                | `/blog`             |
| `military-help`    | `/dopomoha-viiskovym`  | `/dopomoha-viiskovym`  | `/military-help`    |
| `notary-translate` | `/notarialni-pereklad` | `/notarialni-pereklad` | `/notary-translate` |

## Примеры использования

### Пример 1: Навигация в компоненте About

```javascript
import { useNavigateWithLang } from "@hooks/useNavigateWithLang";

export const About = () => {
  const { navigateToPage } = useNavigateWithLang();

  return (
    <div>
      <button onClick={() => navigateToPage("about")}>Подробнее</button>
      <button onClick={() => navigateToPage("contacts")}>Контакты</button>
    </div>
  );
};
```

### Пример 2: Меню навигации

```javascript
import { useNavigateWithLang } from "@hooks/useNavigateWithLang";

function MainMenu() {
  const { navigateToPage } = useNavigateWithLang();

  const menuItems = [
    { id: "home", label: "Главная" },
    { id: "about", label: "О нас" },
    { id: "services", label: "Услуги" },
    { id: "contacts", label: "Контакты" },
  ];

  return (
    <nav>
      {menuItems.map((item) => (
        <a
          key={item.id}
          onClick={(e) => {
            e.preventDefault();
            navigateToPage(item.id);
          }}
          href="#"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
```

### Пример 3: Переключение языка с сохранением страницы

Переключение языка уже работает автоматически! Просто используйте `LanguageSwitcher`:

```javascript
import LanguageSwitcher from "@components/LanguageSwitcher/LanguageSwitcher";

function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  );
}
```

## Отладка

Если навигация работает неправильно, проверьте консоль браузера. При смене языка выводятся следующие логи:

```
🔍 Текущий путь: /notarialni-pro-mene
🔍 Текущий язык: ua
🔍 Новый язык: en
🔍 ID из INDICES: about
✅ Новый путь: /notary-about
```

Если видите `⚠️ Fallback путь`, значит страница не найдена в навигационном дереве.

## Что уже настроено

✅ Компонент `About.jsx` - использует `useNavigateWithLang`
✅ Компонент `LanguageSwitcher` - автоматически переключает язык
✅ Хук `useLanguage` - автоматически определяет текущую страницу и строит правильный путь
✅ Навигационное дерево `nav-tree.js` - содержит все маршруты для всех языков

## Нужна помощь?

1. Проверьте, что страница добавлена в `src/nav/nav-tree.js`
2. Убедитесь, что у страницы есть `slug` для всех языков (ua, ru, en)
3. Используйте `navigateToPage(pageId)` вместо `navigate("/path")`
4. Проверьте консоль на наличие предупреждений

## Добавление новой страницы

Чтобы добавить новую страницу с поддержкой многоязычности:

1. Добавьте страницу в `src/nav/nav-tree.js`:

```javascript
{
  id: "new-page",
  kind: "page",
  label: {
    ua: "Нова сторінка",
    ru: "Новая страница",
    en: "New page"
  },
  slug: {
    ua: "nova-storinka",
    ru: "novaya-stranitsa",
    en: "new-page"
  },
  showInMenu: true,
}
```

2. Зарегистрируйте компонент в `src/nav/component-registry.js`:

```javascript
const NewPage = lazy(() => import("@pages/NewPage/NewPage"));

const COMPONENTS = {
  // ...
  "new-page": NewPage,
};
```

3. Используйте навигацию:

```javascript
navigateToPage("new-page");
```

Готово! Страница автоматически будет доступна на всех языках.
