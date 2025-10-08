# 📚 TemplatePage vs PageTemplate - Полное руководство

## 🔀 В чем разница?

### **TemplatePage** - Статический контент (СТАРЫЙ)

```jsx
import TemplatePage from "./TemplatePage.jsx";

const content = [
  { type: "paragraph", text: "Хардкоженный текст..." },
  { type: "title", text: "Заголовок" },
];

const MyPage = () => (
  <TemplatePage
    title="Заголовок"
    content={content}
    heroImgClass="notaryServicesPage"
  />
);
```

**Использование:**

- ❌ Контент хардкодится в компоненте
- ❌ Нет связи с backend
- ❌ Нет автоматической многоязычности
- ✅ Простой и быстрый для прототипов

---

### **PageTemplate** - Динамический контент (НОВЫЙ) ✅

```jsx
import PageTemplate from "@components/PageTemplate/PageTemplate";
import { usePageData } from "@hooks/usePageData";

const MyPage = () => {
  const { data, loading, error } = usePageData("my-nav-id");

  return (
    <PageTemplate pageData={data} loading={loading} error={error}>
      <Form />
      <OftenQuestions />
    </PageTemplate>
  );
};
```

**Использование:**

- ✅ Контент из backend (Django Admin)
- ✅ Автоматическая многоязычность
- ✅ Можно редактировать без деплоя
- ✅ Меньше кода
- ✅ РЕКОМЕНДУЕТСЯ для всех новых страниц

---

## 🎯 Когда использовать что?

| Сценарий                           | Использовать     | Почему                             |
| ---------------------------------- | ---------------- | ---------------------------------- |
| Новая страница 2-4 уровня          | **PageTemplate** | Автоматическая загрузка из backend |
| Страница с мультиязычным контентом | **PageTemplate** | Автоматическая смена языка         |
| Контент нужно часто обновлять      | **PageTemplate** | Редактирование через админку       |
| Быстрый прототип/демо              | **TemplatePage** | Не нужен backend                   |
| Легаси код (не трогать)            | **TemplatePage** | Не ломать работающее               |

---

## 📐 Примеры использования PageTemplate

### **Пример 1: Страница 2 уровня**

```jsx
// ServicesPage.jsx
import { memo } from "react";
import PageTemplate from "@components/PageTemplate/PageTemplate";
import { usePageData } from "@hooks/usePageData";
import ServicesCarousel from "@components/ServicesCarousel/ServicesCarousel";

const ServicesPage = memo(() => {
  const { data, loading, error } = usePageData("services");

  return (
    <PageTemplate pageData={data} loading={loading} error={error}>
      <ServicesCarousel parentId="services" title="Всі послуги" />
    </PageTemplate>
  );
});

export default ServicesPage;
```

**URL формируется:**

```
GET /api/services/notarialni-poslugi/?lang=ua
```

---

### **Пример 2: Страница 3 уровня**

```jsx
// AttorneyPage.jsx
import { memo } from "react";
import PageTemplate from "@components/PageTemplate/PageTemplate";
import { usePageData } from "@hooks/usePageData";
import GroupServicesCarousel from "@components/GroupServicesCarousel/GroupServicesCarousel";

const AttorneyPage = memo(() => {
  const { data, loading, error } = usePageData("power-of-attorney");

  return (
    <PageTemplate pageData={data} loading={loading} error={error}>
      <GroupServicesCarousel
        parentId="power-of-attorney"
        title="Види довіреностей"
      />
    </PageTemplate>
  );
});

export default AttorneyPage;
```

**URL формируется:**

```
GET /api/services/notarialni-poslugi/dovirenosti/?lang=ua
```

---

### **Пример 3: Страница 4 уровня**

```jsx
// PoaRepresentation.jsx
import { memo } from "react";
import PageTemplate from "@components/PageTemplate/PageTemplate";
import { usePageData } from "@hooks/usePageData";
import Form from "@components/Form/Form";
import OftenQuestions from "@components/OftenQuestions/OftenQuestions";

const PoaRepresentation = memo(() => {
  const { data, loading, error } = usePageData(
    "powers-of-attorney-for-representation"
  );

  return (
    <PageTemplate pageData={data} loading={loading} error={error}>
      <OftenQuestions />
      <Form />
    </PageTemplate>
  );
});

export default PoaRepresentation;
```

**URL формируется:**

```
GET /api/services/notarialni-poslugi/dovirenosti/predstavnictvo/?lang=ua
```

---

## 🔧 DefaultThirdLevelPage - Как это работает

`DefaultThirdLevelPage` - это **fallback компонент**, который автоматически используется когда:

- В `ServiceGroupPage` нет кастомного компонента для страницы
- В `nav-tree.js` не указан `component` для узла

### **Внутри DefaultThirdLevelPage:**

```jsx
import { memo } from "react";
import PageTemplate from "@components/PageTemplate/PageTemplate";
import { usePageData } from "@hooks/usePageData";

const DefaultThirdLevelPage = memo(({ navId }) => {
  // Автоматически загружает данные из backend
  const { data, loading, error } = usePageData(navId);

  return (
    <PageTemplate pageData={data} loading={loading} error={error}>
      <ServicesCarousel parentId="services" title="Інші послуги" />
      <OftenQuestions />
      <Form />
    </PageTemplate>
  );
});
```

### **Как вызывается:**

```jsx
// ServiceGroupPage.jsx
if (!PageComponent && children.length === 0) {
  return (
    <DefaultThirdLevelPage
      navId={currentNode.id} // ✅ Передается navId
    />
  );
}
```

---

## 🚀 Миграция с TemplatePage на PageTemplate

### **Шаг 1: Было (TemplatePage)**

```jsx
import TemplatePage from "../TemplatePage";
import contentImg from "@media/text-content-img.png";

const content = [
  { type: "paragraph", text: "Статический текст..." },
  { type: "title", text: "Заголовок" },
  { type: "image", src: contentImg, alt: "img" },
];

const AttorneyPage = () => (
  <TemplatePage
    title="Довіреності"
    content={content}
    heroImgClass="notaryServicesPage"
  />
);
```

**Проблемы:**

- 📌 ~150 строк кода
- 📌 Контент захардкожен
- 📌 Нужно дублировать для каждого языка

---

### **Шаг 2: Стало (PageTemplate)**

```jsx
import { memo } from "react";
import PageTemplate from "@components/PageTemplate/PageTemplate";
import { usePageData } from "@hooks/usePageData";
import GroupServicesCarousel from "@components/GroupServicesCarousel/GroupServicesCarousel";

const AttorneyPage = memo(() => {
  const { data, loading, error } = usePageData("power-of-attorney");

  return (
    <PageTemplate pageData={data} loading={loading} error={error}>
      <GroupServicesCarousel
        parentId="power-of-attorney"
        title="Види довіреностей"
      />
    </PageTemplate>
  );
});

export default AttorneyPage;
```

**Результат:**

- ✅ ~25 строк кода (-83%)
- ✅ Контент из backend
- ✅ Автоматическая многоязычность
- ✅ Редактирование через админку

---

### **Шаг 3: Добавить контент в Django Admin**

1. Войти в Django Admin: `http://localhost:8000/admin/`
2. Найти модель `ServiceCategory`
3. Найти запись с `nav_id = "power-of-attorney"`
4. Заполнить поля:
   - `label_ua` = "Довіреності"
   - `label_ru` = "Доверенности"
   - `label_en` = "Power of attorney"
   - `description_ua` = HTML-контент через CKEditor
   - `description_ru` = HTML-контент
   - `description_en` = HTML-контент
   - `hero_image` = Загрузить изображение
5. Сохранить

---

## 🎨 Как PageTemplate рендерит контент

### **1. Hero-блок (NotaryServices)**

```jsx
<NotaryServices
  title={pageData?.title} // Заголовок
  listItems={pageData?.listItems} // Список дочерних элементов
  heroImageUrl={
    pageData?.hero_image ? `http://localhost:8000${pageData.hero_image}` : null
  }
/>
```

### **2. HTML-контент из backend**

```jsx
<div className="template-text-content">
  <div className="container">
    <article className="text-content">
      <div
        className="text-content-html"
        dangerouslySetInnerHTML={{
          __html: pageData.description, // HTML из CKEditor
        }}
      />
    </article>
  </div>
</div>
```

### **3. Дополнительные компоненты (children)**

```jsx
{
  children;
} // Карусели, формы, FAQ и т.д.
```

---

## 🛠️ Props для PageTemplate

```typescript
interface PageTemplateProps {
  pageData?: {
    title: string; // Заголовок страницы
    description: string; // HTML-контент из CKEditor
    hero_image: string; // Путь к hero-изображению (/media/...)
    listItems: Array<{
      // Дочерние элементы
      id: string;
      label: string;
    }>;
  };
  loading: boolean; // Состояние загрузки
  error?: string; // Ошибка загрузки
  wrapperClassName?: string; // CSS класс для wrapper
  children?: ReactNode; // Дополнительные компоненты
}
```

---

## ⚠️ Частые ошибки

### **❌ Ошибка 1: Использование TemplatePage вместо PageTemplate**

```jsx
// ❌ НЕПРАВИЛЬНО
import TemplatePage from "./TemplatePage";
const { data, loading, error } = usePageData("services");
return <TemplatePage pageData={data} loading={loading} error={error} />;
```

**Проблема:** `TemplatePage` не понимает `pageData`, он ожидает `title` и `content`.

```jsx
// ✅ ПРАВИЛЬНО
import PageTemplate from "@components/PageTemplate/PageTemplate";
const { data, loading, error } = usePageData("services");
return <PageTemplate pageData={data} loading={loading} error={error} />;
```

---

### **❌ Ошибка 2: Забыли передать navId в DefaultThirdLevelPage**

```jsx
// ❌ НЕПРАВИЛЬНО
return <DefaultThirdLevelPage title={title} heroImgClass="..." />;
```

**Проблема:** `usePageData` внутри не знает какой `navId` использовать.

```jsx
// ✅ ПРАВИЛЬНО
return <DefaultThirdLevelPage navId={currentNode.id} />;
```

---

### **❌ Ошибка 3: Смешивание статического и динамического контента**

```jsx
// ❌ НЕПРАВИЛЬНО
const content = [{ type: "paragraph", text: "..." }];
const { data } = usePageData("services");
return (
  <PageTemplate pageData={data}>
    <TemplatePage content={content} /> {/* Не имеет смысла! */}
  </PageTemplate>
);
```

**Решение:** Выбрать один подход:

- Либо статический контент (`TemplatePage` с массивом `content`)
- Либо динамический контент (`PageTemplate` с `usePageData`)

---

## ✅ Итоговая рекомендация

### **Для ВСЕХ новых страниц используйте:**

```jsx
import { memo } from "react";
import PageTemplate from "@components/PageTemplate/PageTemplate";
import { usePageData } from "@hooks/usePageData";

const YourPage = memo(() => {
  const { data, loading, error } = usePageData("your-nav-id");

  return (
    <PageTemplate pageData={data} loading={loading} error={error}>
      {/* Ваши дополнительные компоненты */}
    </PageTemplate>
  );
});

export default YourPage;
```

### **TemplatePage оставьте только для:**

- Легаси кода, который работает
- Быстрых прототипов без backend
- Статических страниц, которые никогда не меняются

---

## 📊 Сравнение в цифрах

| Метрика             | TemplatePage       | PageTemplate   |
| ------------------- | ------------------ | -------------- |
| Строк кода          | ~150               | ~25            |
| Контент             | Хардкод            | Backend        |
| Многоязычность      | Дублирование       | Автоматическая |
| Редактирование      | Через код + деплой | Через админку  |
| Время на обновление | ~1 час             | ~5 минут       |
| Гибкость            | Низкая             | Высокая        |

---

## 🔗 Связанные файлы

- `src/pages/secondLevel/TemplatePage.jsx` - Старый компонент (статический)
- `src/components/PageTemplate/PageTemplate.jsx` - Новый компонент (динамический)
- `src/pages/secondLevel/DefaultThirdLevelPage.jsx` - Fallback для 3 уровня
- `src/hooks/usePageData.js` - Хук для загрузки данных
- `src/components/DynamicPages/ServiceGroupPage.jsx` - Использует DefaultThirdLevelPage

---

**Создано:** 2025-10-06  
**Версия:** 1.0
