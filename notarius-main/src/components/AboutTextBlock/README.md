# AboutTextBlock - Компонент с HTML-контентом и функцией "Показать больше"

## Описание

Компонент отображает текстовый контент, полученный с бэкенда в виде HTML-строки, с возможностью сворачивания/разворачивания на мобильных устройствах.

## Особенности

### 1. Работа с HTML-контентом

Компонент принимает HTML-строку с бэкенда и автоматически разбивает её на параграфы:

```javascript
// Пример данных с бэкенда:
{
  "title": "О нас",
  "content": "<p>Первый параграф</p><p>Второй параграф</p><p>Третий параграф</p>"
}
```

Функция `extractParagraphsFromHTML()` извлекает параграфы из HTML и возвращает массив:

```javascript
["Первый параграф", "Второй параграф", "Третий параграф"];
```

### 2. Адаптивное поведение

#### Desktop (>1024px)

- Показывает весь контент
- Кнопка "Показать больше" скрыта

#### Mobile (≤1024px)

- Показывает первые 3 параграфа
- Отображается кнопка "ДИВИТИСЯ БІЛЬШЕ"
- При клике разворачивает весь контент
- Кнопка меняется на "ПРИХОВАТИ"

### 3. Многоязычность

Все тексты переведены на 3 языка:

| Ключ       | UA                   | EN            | RU              |
| ---------- | -------------------- | ------------- | --------------- |
| `showMore` | ДИВИТИСЯ БІЛЬШЕ      | SHOW MORE     | ПОКАЗАТЬ БОЛЬШЕ |
| `hide`     | ПРИХОВАТИ            | HIDE          | СКРЫТЬ          |
| `loading`  | Завантаження...      | Loading...    | Загрузка...     |
| `error`    | Помилка завантаження | Loading error | Ошибка загрузки |

## Как это работает

### Парсинг HTML

```javascript
const extractParagraphsFromHTML = (htmlString) => {
  // 1. Создаем временный DOM элемент
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;

  // 2. Извлекаем все <p> теги
  const paragraphs = Array.from(tempDiv.querySelectorAll("p")).map((p) =>
    p.innerHTML.trim()
  );

  // 3. Если параграфов нет, разбиваем по двойным переносам строк
  if (paragraphs.length === 0) {
    const textContent = tempDiv.textContent || "";
    return textContent.split(/\n\n+/).filter(Boolean);
  }

  return paragraphs;
};
```

### Отображение с dangerouslySetInnerHTML

```javascript
visibleContent.map((paragraph, idx) => (
  <p
    key={idx}
    className="..."
    dangerouslySetInnerHTML={{ __html: paragraph }}
  />
));
```

⚠️ **Безопасность**: Убедитесь, что HTML с бэкенда санитизирован!

## Форматы данных с бэкенда

Компонент поддерживает несколько форматов:

### Вариант 1: HTML с параграфами (рекомендуется)

```html
<p>Первый абзац текста</p>
<p>Второй абзац с <strong>выделением</strong></p>
<p>Третий абзац с <a href="#">ссылкой</a></p>
```

### Вариант 2: Текст с двойными переносами строк

```
Первый абзац текста

Второй абзац текста

Третий абзац текста
```

### Вариант 3: HTML с тегами <br>

```html
Первый абзац<br /><br />
Второй абзац<br /><br />
Третий абзац
```

## API Endpoint

```javascript
GET /api/about-me/detail/?lang={lang}

Response:
{
  "title": "Заголовок",
  "content": "<p>HTML контент</p>"
}
```

## Использование в других компонентах

Если нужна похожая функциональность в других компонентах, используйте функцию `extractParagraphsFromHTML`:

```javascript
import { extractParagraphsFromHTML } from "@components/AboutTextBlock/AboutTextBlock";

// В вашем компоненте
const htmlFromBackend = "<p>Текст 1</p><p>Текст 2</p>";
const paragraphs = extractParagraphsFromHTML(htmlFromBackend);

// paragraphs = ["Текст 1", "Текст 2"]
```

## Состояния компонента

1. **Loading**: Показывает "Завантаження..."
2. **Error**: Показывает "Помилка завантаження"
3. **Success**: Отображает контент с возможностью сворачивания

## CSS классы

- `.about-content` - контейнер для контента
- `.about-content.expanded` - развернутое состояние
- `.accordion-toggle` - кнопка сворачивания/разворачивания

## Примеры использования

### Базовый пример

```jsx
import { AboutTextBlock } from "@components/AboutTextBlock/AboutTextBlock";

function AboutPage() {
  return (
    <div>
      <h1>О нас</h1>
      <AboutTextBlock />
    </div>
  );
}
```

### С кастомизацией

Если нужно изменить количество видимых параграфов на мобильных:

```javascript
// В строке 97
const visibleContent =
  isMobileView && !expanded
    ? aboutContent.slice(0, 5) // Изменено с 3 на 5
    : aboutContent;
```

## Рекомендации

1. **Санитизация HTML**: Убедитесь, что HTML с бэкенда безопасен (используйте DOMPurify на бэкенде)
2. **Количество параграфов**: Оптимально 3-5 видимых параграфов на мобильных
3. **Длина параграфов**: Старайтесь делать параграфы примерно одинаковой длины
4. **Форматирование**: Используйте `<p>` теги для лучшего парсинга

## Возможные улучшения

- Добавить плавную анимацию разворачивания
- Добавить lazy loading для изображений в HTML
- Добавить поддержку markdown
- Кэширование распарсенных параграфов
