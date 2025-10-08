# 🚀 PageTemplate - Шпаргалка

## ⚡ Быстрый старт

```jsx
import { memo } from "react";
import PageTemplate from "@components/PageTemplate/PageTemplate";
import { usePageData } from "@hooks/usePageData";

const YourPage = memo(() => {
  const { data, loading, error } = usePageData("your-nav-id");

  return (
    <PageTemplate pageData={data} loading={loading} error={error}>
      {/* Дополнительные компоненты */}
    </PageTemplate>
  );
});

export default YourPage;
```

---

## 🔍 Как найти navId?

1. Откройте `src/nav/nav-tree.js`
2. Найдите вашу страницу
3. Скопируйте поле `id`:

```javascript
{
  id: "power-of-attorney",  // 👈 Это navId
  slug: { ua: "dovirenosti", ... }
}
```

---

## 📋 Уровни страниц

| Уровень | URL                                              | navId пример                              |
| ------- | ------------------------------------------------ | ----------------------------------------- |
| 2       | `/notarialni-poslugi`                            | `"services"`                              |
| 3       | `/notarialni-poslugi/dovirenosti`                | `"power-of-attorney"`                     |
| 4       | `/notarialni-poslugi/dovirenosti/predstavnictvo` | `"powers-of-attorney-for-representation"` |

---

## 🎨 С дополнительными компонентами

```jsx
<PageTemplate pageData={data} loading={loading} error={error}>
  <GroupServicesCarousel parentId="services" title="Послуги" />
  <Form />
  <OftenQuestions />
</PageTemplate>
```

---

## 🆚 TemplatePage vs PageTemplate

|                | TemplatePage (старый) | PageTemplate (новый) ✅ |
| -------------- | --------------------- | ----------------------- |
| Контент        | Хардкод               | Backend                 |
| Языки          | Дублирование          | Автоматически           |
| Редактирование | Код + деплой          | Админка                 |
| Использовать   | ❌ Только легаси      | ✅ Все новые страницы   |

---

## ✅ Чек-лист

- [ ] Импортировал `PageTemplate` и `usePageData`
- [ ] Нашел `navId` в `nav-tree.js`
- [ ] Вызвал `usePageData(navId)`
- [ ] Передал `pageData, loading, error`
- [ ] Проверил на всех языках (ua, ru, en)
- [ ] Добавил контент в Django Admin

---

## 🔗 Полная документация

- **Подробное сравнение:** `TEMPLATE_VS_PAGETEMPLATE.md`
- **Примеры вложенности:** `NESTED_PAGES_EXAMPLES.md`
- **Обзор рефакторинга:** `REFACTORING.md`
