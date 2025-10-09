# Лучшие практики работы с переводами

## Проблема: переводы не обновляются при смене языка

### ❌ Неправильно

```javascript
const ContactsPage = () => {
  const { getTranslations } = useTranslation("pages.ContactsPage");
  const { currentLang } = useLanguage();

  // ❌ ОШИБКА: вычисляется один раз при монтировании
  const translations = getTranslations();

  return <h1>{translations.title}</h1>;
};
```

**Проблема:** `translations` вычисляется только один раз при первом рендере компонента и не обновляется при изменении `currentLang`.

### ✅ Правильно

```javascript
import { useMemo } from "react";

const ContactsPage = () => {
  const { getTranslations } = useTranslation("pages.ContactsPage");
  const { currentLang } = useLanguage();

  // ✅ ПРАВИЛЬНО: пересчитывается при смене языка
  const translations = useMemo(
    () => getTranslations(),
    [currentLang, getTranslations]
  );

  return <h1>{translations.title}</h1>;
};
```

**Решение:** Оборачиваем `getTranslations()` в `useMemo` с зависимостями от `currentLang` и `getTranslations`.

## Три способа использования переводов

### Способ 1: Использование `t()` функции (рекомендуется для отдельных ключей)

```javascript
const MyComponent = () => {
  const { t } = useTranslation("components.MyComponent");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </div>
  );
};
```

**Плюсы:**

- Автоматически реагирует на смену языка
- Не нужен `useMemo`
- Подходит для небольшого количества переводов

**Минусы:**

- Много вызовов функции для большого количества текстов

### Способ 2: Использование `getTranslations()` с `useMemo` (рекомендуется для группы переводов)

```javascript
import { useMemo } from "react";

const MyComponent = () => {
  const { getTranslations } = useTranslation("components.MyComponent");
  const { currentLang } = useLanguage();

  const translations = useMemo(
    () => getTranslations(),
    [currentLang, getTranslations]
  );

  return (
    <div>
      <h1>{translations.title}</h1>
      <p>{translations.description}</p>
      <button>{translations.button}</button>
    </div>
  );
};
```

**Плюсы:**

- Хорошо для компонентов с множеством переводов
- Один объект со всеми переводами
- Автоматически обновляется при смене языка

**Минусы:**

- Требует `useMemo`

### Способ 3: Комбинированный подход

```javascript
import { useMemo } from "react";

const MyComponent = () => {
  const { t, getTranslations } = useTranslation("components.MyComponent");
  const { currentLang } = useLanguage();

  // Для группы связанных переводов
  const fields = useMemo(
    () => getTranslations("fields"),
    [currentLang, getTranslations]
  );

  return (
    <div>
      {/* Для одиночных переводов */}
      <h1>{t("title")}</h1>

      {/* Для группы переводов */}
      <input placeholder={fields.name} />
      <input placeholder={fields.email} />
      <input placeholder={fields.phone} />
    </div>
  );
};
```

## Структура файлов локализации

```json
{
  "components": {
    "MyComponent": {
      "title": "Заголовок",
      "description": "Описание",
      "fields": {
        "name": "Имя",
        "email": "Email",
        "phone": "Телефон"
      },
      "buttons": {
        "submit": "Отправить",
        "cancel": "Отмена"
      }
    }
  },
  "pages": {
    "ContactsPage": {
      "title": "Контакты",
      "callUs": "Позвоните нам"
    }
  }
}
```

## Примеры использования

### Пример 1: Простой компонент

```javascript
const Header = () => {
  const { t } = useTranslation("components.Header");

  return (
    <header>
      <nav>
        <a href="/">{t("home")}</a>
        <a href="/about">{t("about")}</a>
        <a href="/contacts">{t("contacts")}</a>
      </nav>
    </header>
  );
};
```

### Пример 2: Форма с множеством полей

```javascript
import { useMemo } from "react";

const ContactForm = () => {
  const { getTranslations } = useTranslation("components.ContactForm");
  const { currentLang } = useLanguage();

  const t = useMemo(() => getTranslations(), [currentLang, getTranslations]);

  return (
    <form>
      <h2>{t.title}</h2>
      <input placeholder={t.fields.name} />
      <input placeholder={t.fields.email} />
      <input placeholder={t.fields.message} />
      <button>{t.buttons.submit}</button>
    </form>
  );
};
```

### Пример 3: Условный рендеринг с переводами

```javascript
import { useMemo } from "react";

const StatusMessage = ({ status }) => {
  const { getTranslations } = useTranslation("components.StatusMessage");
  const { currentLang } = useLanguage();

  const messages = useMemo(
    () => getTranslations("messages"),
    [currentLang, getTranslations]
  );

  return (
    <div>
      {status === "success" && <p>{messages.success}</p>}
      {status === "error" && <p>{messages.error}</p>}
      {status === "loading" && <p>{messages.loading}</p>}
    </div>
  );
};
```

## Частые ошибки

### ❌ Ошибка 1: Забыли `useMemo`

```javascript
// ❌ Не обновится при смене языка
const translations = getTranslations();
```

### ❌ Ошибка 2: Неправильные зависимости

```javascript
// ❌ Отсутствует зависимость от currentLang
const translations = useMemo(() => getTranslations(), []);
```

### ❌ Ошибка 3: Использование перевода вне компонента

```javascript
// ❌ Хуки можно использовать только внутри компонентов
const translations = getTranslations();

function MyComponent() {
  return <div>{translations.title}</div>;
}
```

### ✅ Правильно

```javascript
function MyComponent() {
  const { currentLang } = useLanguage();
  const { getTranslations } = useTranslation("components.MyComponent");

  const translations = useMemo(
    () => getTranslations(),
    [currentLang, getTranslations]
  );

  return <div>{translations.title}</div>;
}
```

## Проверка работы переводов

1. Откройте страницу в браузере
2. Переключите язык через `LanguageSwitcher`
3. Убедитесь, что все тексты изменились

Если тексты не меняются:

- Проверьте, используете ли `useMemo` с правильными зависимостями
- Убедитесь, что переводы есть во всех файлах локализации (ua.json, ru.json, en.json)
- Проверьте консоль на наличие ошибок

## Добавление новых переводов

1. Добавьте ключи во все файлы локализации:

**ua.json:**

```json
{
  "components": {
    "NewComponent": {
      "title": "Заголовок",
      "subtitle": "Підзаголовок"
    }
  }
}
```

**en.json:**

```json
{
  "components": {
    "NewComponent": {
      "title": "Title",
      "subtitle": "Subtitle"
    }
  }
}
```

**ru.json:**

```json
{
  "components": {
    "NewComponent": {
      "title": "Заголовок",
      "subtitle": "Подзаголовок"
    }
  }
}
```

2. Используйте в компоненте:

```javascript
import { useMemo } from "react";

const NewComponent = () => {
  const { getTranslations } = useTranslation("components.NewComponent");
  const { currentLang } = useLanguage();

  const t = useMemo(() => getTranslations(), [currentLang, getTranslations]);

  return (
    <div>
      <h1>{t.title}</h1>
      <h2>{t.subtitle}</h2>
    </div>
  );
};
```

## Заключение

**Золотое правило:** Всегда используйте `useMemo` при вызове `getTranslations()` с зависимостями от `currentLang` и `getTranslations`, чтобы переводы обновлялись при смене языка! ✅
