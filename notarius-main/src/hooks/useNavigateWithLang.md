# useNavigateWithLang

Хук для навигации с автоматическим учетом текущего языка пользователя.

## Описание

`useNavigateWithLang` - это обертка над стандартным `useNavigate` из React Router, которая автоматически учитывает текущий язык интерфейса и навигационное дерево приложения. Хук упрощает навигацию между страницами на разных языках.

## Импорт

```javascript
import { useNavigateWithLang } from "@hooks/useNavigateWithLang";
```

## Использование

### Базовое использование

```javascript
function MyComponent() {
  const { navigateToPage } = useNavigateWithLang();

  const handleClick = () => {
    // Автоматически перейдет на страницу "about" на текущем языке
    // ua: /notarialni-pro-mene
    // ru: /notarialni-pro-mene
    // en: /notary-about
    navigateToPage("about");
  };

  return <button onClick={handleClick}>Перейти на страницу "О нас"</button>;
}
```

### Навигация на другой язык

```javascript
function LanguageSwitcher() {
  const { navigateToPage, currentLang } = useNavigateWithLang();

  const switchToEnglish = () => {
    // Перейти на текущую страницу, но на английском языке
    navigateToPage("about", "en");
  };

  return <button onClick={switchToEnglish}>Switch to English</button>;
}
```

### Использование оригинального navigate

```javascript
function MyComponent() {
  const { navigate, navigateToPage } = useNavigateWithLang();

  return (
    <>
      <button onClick={() => navigateToPage("services")}>
        Навигация через ID
      </button>
      <button onClick={() => navigate("/custom-path")}>Прямая навигация</button>
    </>
  );
}
```

## API

### Возвращаемые значения

Хук возвращает объект со следующими свойствами:

#### `navigateToPage(pageId, lang?)`

Переход на страницу по её ID из навигационного дерева.

**Параметры:**

- `pageId` (string) - ID страницы из `nav-tree.js`
- `lang` (string, optional) - Код языка ("ua", "ru", "en"). По умолчанию используется текущий язык.

**Пример:**

```javascript
navigateToPage("about"); // Переход на текущем языке
navigateToPage("services", "en"); // Переход на английской версии
```

#### `navigateTo(path)`

Переход на произвольный путь (алиас для стандартного navigate).

**Параметры:**

- `path` (string) - Путь для навигации

**Пример:**

```javascript
navigateTo("/custom-page");
navigateTo("/ru/custom-page");
```

#### `navigate`

Оригинальная функция navigate из React Router. Используйте в случаях, когда нужна полная функциональность navigate.

**Пример:**

```javascript
navigate("/path", { replace: true });
navigate(-1); // Назад
```

#### `currentLang`

Текущий язык интерфейса ("ua", "ru", "en").

**Пример:**

```javascript
const { currentLang } = useNavigateWithLang();
console.log(currentLang); // "ua"
```

## Доступные ID страниц

Все доступные ID страниц определены в `src/nav/nav-tree.js`:

- `"home"` - Главная страница
- `"about"` - О нас / Про мене
- `"services"` - Услуги / Послуги
- `"notary-translate"` - Нотариальный перевод
- `"military-help"` - Помощь военным
- `"contacts"` - Контакты
- `"blog"` - Блог
- и другие...

## Примеры использования

### В компоненте About

```javascript
import { useNavigateWithLang } from "@hooks/useNavigateWithLang";

export const About = () => {
  const { navigateToPage } = useNavigateWithLang();

  return <button onClick={() => navigateToPage("about")}>Детальніше</button>;
};
```

### В меню навигации

```javascript
function Navigation() {
  const { navigateToPage, currentLang } = useNavigateWithLang();

  const menuItems = [
    { id: "home", label: "Главная" },
    { id: "about", label: "О нас" },
    { id: "services", label: "Услуги" },
    { id: "contacts", label: "Контакты" },
  ];

  return (
    <nav>
      {menuItems.map((item) => (
        <button key={item.id} onClick={() => navigateToPage(item.id)}>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
```

### С переключением языка

```javascript
function LanguageAwarePage() {
  const { navigateToPage, currentLang } = useNavigateWithLang();

  const goToContactsInEnglish = () => {
    // Перейти на страницу контактов на английском
    navigateToPage("contacts", "en");
  };

  const goToCurrentPageInRussian = () => {
    // Перейти на текущую страницу на русском
    // (требуется знать ID текущей страницы)
    navigateToPage(currentPageId, "ru");
  };

  return (
    <div>
      <p>Текущий язык: {currentLang}</p>
      <button onClick={goToContactsInEnglish}>Contacts (English)</button>
    </div>
  );
}
```

## Преимущества

1. **Автоматический учет языка** - не нужно вручную формировать пути для разных языков
2. **Безопасность типов** - использование ID из дерева навигации
3. **Централизация** - все пути определены в одном месте (`nav-tree.js`)
4. **Гибкость** - можно использовать как упрощенную навигацию, так и оригинальный navigate

## Связанные хуки

- `useLanguage` - для управления языком интерфейса
- `useNavigate` (React Router) - оригинальный хук навигации
- `useHybridNav` - для работы с навигационным деревом

## Примечания

- Хук автоматически использует актуальное навигационное дерево из `HybridNavContext`
- При отсутствии динамического дерева используется статическое из `nav-tree.js`
- Если путь не может быть построен, выводится предупреждение в консоль
