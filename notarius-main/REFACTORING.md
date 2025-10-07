# Рефакторинг: Универсальный хук и компонент для страниц

## 📋 Проблема

В файлах `ServicesPage.jsx` и `NotaryTranslatePage.jsx` был дублирующийся код:

- Повторяющаяся логика загрузки данных
- Использование неправильного подхода к API (UA slug вместо navId)
- Дублирование компонента NotaryServices и логики отображения загрузки

## ✅ Решение

### 1. **Создан универсальный хук `usePageData`**

**Файл:** `notarius-main/src/hooks/usePageData.js`

**Функциональность:**

- Принимает `navId` (ID из nav-tree: "services", "notary-translate" и т.д.)
- Автоматически находит узел в merged navTree
- Извлекает slug для текущего языка
- Формирует правильный URL для backend: `/api/services/{slug}/?lang={currentLang}`
- Автоматически перезапрашивает данные при смене языка

**Использование:**

```javascript
const { data, loading, error } = usePageData("services");
```

### 2. **Создан универсальный компонент `PageTemplate`**

**Файл:** `notarius-main/src/components/PageTemplate/PageTemplate.jsx`

**Функциональность:**

- Отображает NotaryServices с данными
- Показывает лоадер во время загрузки
- Отображает ошибки
- Рендерит HTML контент страницы
- Принимает children для дополнительных компонентов

**Использование:**

```javascript
<PageTemplate
  pageData={data}
  loading={loading}
  error={error}
  wrapperClassName="custom-wrap"
>
  {/* Дополнительный контент */}
  <GroupServicesCarousel parentId="services" />
</PageTemplate>
```

## 📊 Сравнение: До и После

### До (97 строк):

```javascript
import { useEffect, useState } from "react";
import { useLang } from "@nav/use-lang";
import { fetchPageDataBySlug } from "@utils/api";
import Loader from "@components/Loader/Loader";

const ServicesPage = () => {
  const { currentLang } = useLang();
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const uaSlug = "services/notarialni-poslugi"; // ❌ Hardcoded UA slug

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPageDataBySlug({
          slug: uaSlug,
          lang: currentLang,
        });
        setServiceData(data);
      } catch (e) {
        setError(e.message || "Fetch error");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [currentLang]);

  return (
    <>
      <NotaryServices
        title={serviceData?.title}
        listItems={serviceData?.listItems}
        heroImageUrl={"http://localhost:8000" + serviceData?.hero_image || null}
      />
      {loading && !serviceData && (
        <div style={{...}}>
          <Loader size="medium" variant="spinner" message="Завантаження..." />
        </div>
      )}
      <div className="template-text-content">
        <div className="container">
          <article className="text-content">
            {serviceData?.description && (
              <div dangerouslySetInnerHTML={{ __html: serviceData.description }} />
            )}
          </article>
        </div>
      </div>
      {/* Остальной контент */}
    </>
  );
};
```

### После (29 строк):

```javascript
import PageTemplate from "@components/PageTemplate/PageTemplate";
import { usePageData } from "@hooks/usePageData";

const ServicesPage = () => {
  // ✅ Использует navId из nav-tree
  const { data, loading, error } = usePageData("services");

  return (
    <PageTemplate pageData={data} loading={loading} error={error}>
      <GroupServicesCarousel
        parentId="services"
        title="ВИДИ НОТАРІАЛЬНИХ ПОСЛУГ"
        kind="group"
      />
      <HowIWork />
      <Comments />
      <ReviewForm />
      <Form />
      <OftenQuestions />
    </PageTemplate>
  );
};
```

## 🎯 Преимущества

✅ **Меньше кода:** ~70% сокращение кода в компонентах страниц  
✅ **Правильный API:** Использует navId вместо hardcoded UA slug  
✅ **Автоматическая смена языка:** Данные автоматически обновляются  
✅ **Легко поддерживать:** Вся логика в одном месте  
✅ **Переиспользуемость:** Можно использовать для всех страниц  
✅ **Типобезопасность:** Единый формат данных

## 📁 Созданные файлы

1. `notarius-main/src/hooks/usePageData.js` - Хук для загрузки данных
2. `notarius-main/src/hooks/usePageData.md` - Документация хука
3. `notarius-main/src/components/PageTemplate/PageTemplate.jsx` - Универсальный шаблон страницы

## 🔄 Обновленные файлы

1. `notarius-main/src/pages/ServicesPage/ServicesPage.jsx` - Использует новый хук и компонент
2. `notarius-main/src/pages/NotaryTranslatePage/NotaryTranslatePage.jsx` - Использует новый хук и компонент

## 🚀 Как использовать в новых страницах

```javascript
import PageTemplate from "@components/PageTemplate/PageTemplate";
import { usePageData } from "@hooks/usePageData";
import GroupServicesCarousel from "@components/GroupServicesCarousel/GroupServicesCarousel";

const MyNewPage = () => {
  const { data, loading, error } = usePageData("military-help"); // navId из nav-tree

  return (
    <PageTemplate pageData={data} loading={loading} error={error}>
      <GroupServicesCarousel parentId="military-help" title="Послуги" />
      {/* Другие компоненты */}
    </PageTemplate>
  );
};
```

## 🔍 Процесс работы хука

```mermaid
graph LR
    A[usePageData navId] --> B[Find node in navTree]
    B --> C[Extract slug for currentLang]
    C --> D[Build URL: /api/services/{slug}/?lang={lang}]
    D --> E[Fetch from backend]
    E --> F[Transform data]
    F --> G[Return data, loading, error]
```

## 📝 Примечания

- Хук автоматически обрабатывает изменение языка
- PageTemplate показывает лоадер во время загрузки
- Все данные берутся из merged navTree (статика + backend)
- URL формируется динамически на основе текущего языка
