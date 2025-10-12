# Пример работы JSON-LD Breadcrumb Schema

## Тестирование в браузере

После запуска приложения (`npm run dev`), откройте DevTools и проверьте:

### 1. На главной странице `/`

```html
<script id="breadcrumb-schema" type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Головна",
        "item": "http://localhost:5173/"
      }
    ]
  }
</script>
```

### 2. На странице услуг `/notarialni-poslugy/`

```html
<script id="breadcrumb-schema" type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Головна",
        "item": "http://localhost:5173/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Нотаріальні послуги",
        "item": "http://localhost:5173/notarialni-poslugy/"
      }
    ]
  }
</script>
```

### 3. На странице конкретной услуги

Например `/notarialni-poslugy/dogovir-daruvannya-neruhomosti/`:

```html
<script id="breadcrumb-schema" type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Головна",
        "item": "http://localhost:5173/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Нотаріальні послуги",
        "item": "http://localhost:5173/notarialni-poslugy/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Договір дарування",
        "item": "http://localhost:5173/notarialni-poslugy/dogovir-daruvannya-neruhomosti/"
      }
    ]
  }
</script>
```

## Как проверить в DevTools

1. Откройте браузер (Chrome/Firefox)
2. Нажмите F12 для открытия DevTools
3. Перейдите на вкладку "Elements" (Chrome) или "Inspector" (Firefox)
4. Нажмите Ctrl+F для поиска
5. Введите `breadcrumb-schema` в поле поиска
6. Скрипт будет выделен в конце тега `<body>`

## Проверка динамического обновления

1. Откройте главную страницу
2. Посмотрите содержимое скрипта (1 элемент)
3. Перейдите на страницу услуг
4. **Скрипт автоматически обновится** (2 элемента)
5. Перейдите на конкретную услугу
6. **Скрипт снова обновится** (3 элемента)

## Проверка для разных языков

### Украинский (по умолчанию) - `/`

```json
{
  "name": "Головна",
  "item": "http://localhost:5173/"
}
```

### Русский - `/ru/`

```json
{
  "name": "Главная",
  "item": "http://localhost:5173/ru/"
}
```

### Английский - `/en/`

```json
{
  "name": "Main",
  "item": "http://localhost:5173/en/"
}
```

## Валидация в Google

1. Скопируйте содержимое скрипта из DevTools
2. Перейдите на https://search.google.com/test/rich-results
3. Вставьте код
4. Нажмите "Test Code"
5. Убедитесь, что нет ошибок

## Валидация в Schema.org

1. Скопируйте содержимое скрипта из DevTools
2. Перейдите на https://validator.schema.org/
3. Вставьте код
4. Проверьте результат

## Debugging

Если скрипт не появляется:

1. Проверьте консоль на ошибки
2. Убедитесь, что `navTree` загружен (не должно быть "Завантаження...")
3. Проверьте, что текущая страница есть в `navTree`
4. Убедитесь, что компонент `BreadcrumbSchema` добавлен в `App.jsx`

## Console Debugging

Добавьте в `useBreadcrumbSchema.js` для отладки:

```javascript
useEffect(() => {
  console.log("📍 Breadcrumb Schema:", breadcrumbSchema);
}, [breadcrumbSchema]);
```

Это выведет схему в консоль при каждом обновлении.
