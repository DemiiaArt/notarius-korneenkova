# Примеры использования PageTemplate для вложенных страниц

## ✅ Да! PageTemplate работает для всех уровней вложенности (1-4)

`usePageData` автоматически строит **полный путь slug'ов** от корня до целевой страницы.

---

## 📝 Примеры для разных уровней

### 1️⃣ Уровень 1: Прямые дети root

**Пример:** ServicesPage, NotaryTranslatePage, MilitaryPage

```javascript
import PageTemplate from "@components/PageTemplate/PageTemplate";
import { usePageData } from "@hooks/usePageData";
import GroupServicesCarousel from "@components/GroupServicesCarousel/GroupServicesCarousel";

const ServicesPage = () => {
  // navId: "services"
  // URL: /api/services/notarialni-poslugi/?lang=ua
  const { data, loading, error } = usePageData("services");

  return (
    <PageTemplate pageData={data} loading={loading} error={error}>
      <GroupServicesCarousel parentId="services" title="Послуги" />
    </PageTemplate>
  );
};
```

---

### 2️⃣ Уровень 2: Дети services (group)

**Пример:** ContractPage, PowerOfAttorneyPage

```javascript
import PageTemplate from "@components/PageTemplate/PageTemplate";
import { usePageData } from "@hooks/usePageData";
import GroupServicesCarousel from "@components/GroupServicesCarousel/GroupServicesCarousel";

const ContractPage = () => {
  // navId: "contracts"
  // Путь в дереве: root → services → contracts
  // URL: /api/services/notarialni-poslugi/dogovory/?lang=ua
  const { data, loading, error } = usePageData("contracts");

  return (
    <PageTemplate pageData={data} loading={loading} error={error}>
      <GroupServicesCarousel
        parentId="contracts"
        title="Види договорів"
        kind="page"
      />
    </PageTemplate>
  );
};
```

---

### 3️⃣ Уровень 3: Внуки services

**Пример:** PropertyAgreementsPage, PoaPropertyPage

```javascript
import PageTemplate from "@components/PageTemplate/PageTemplate";
import { usePageData } from "@hooks/usePageData";
import GroupServicesCarousel from "@components/GroupServicesCarousel/GroupServicesCarousel";

const PropertyAgreementsPage = () => {
  // navId: "property-agreements"
  // Путь в дереве: root → services → contracts → property-agreements
  // URL: /api/services/notarialni-poslugi/dogovory/majnovi-ugody/?lang=ua
  const { data, loading, error } = usePageData("property-agreements");

  return (
    <PageTemplate pageData={data} loading={loading} error={error}>
      {/* Дополнительный контент для страницы 3 уровня */}
      <GroupServicesCarousel
        parentId="property-agreements"
        title="Типи майнових угод"
      />
    </PageTemplate>
  );
};
```

---

### 4️⃣ Уровень 4: Правнуки services

**Пример:** SpecificContractPage

```javascript
import PageTemplate from "@components/PageTemplate/PageTemplate";
import { usePageData } from "@hooks/usePageData";

const SpecificContractPage = () => {
  // navId: "sale-purchase-contract"
  // Путь: root → services → contracts → property-agreements → sale-purchase-contract
  // URL: /api/services/notarialni-poslugi/dogovory/majnovi-ugody/kupivlya-prodazh/?lang=ua
  const { data, loading, error } = usePageData("sale-purchase-contract");

  return (
    <PageTemplate pageData={data} loading={loading} error={error}>
      {/* Контент 4 уровня */}
    </PageTemplate>
  );
};
```

---

## 🎯 Как работает построение URL

### Пример для 3 уровня:

**navId:** `"property-agreements"`

**Структура дерева:**

```
root
└── services (slug: "notarialni-poslugi")
    └── contracts (kind: "group", slug: "dogovory")
        └── property-agreements (slug: "majnovi-ugody")
```

**Процесс:**

1. `findPathStackById` находит цепочку: `[root, services, contracts, property-agreements]`
2. `buildSlugPath` извлекает slug'и, пропуская root и group:
   - root ❌ (пропускаем)
   - services ✅ → "notarialni-poslugi"
   - contracts ❌ (kind: "group", пропускаем)
   - property-agreements ✅ → "majnovi-ugody"
3. Результат: `["notarialni-poslugi", "majnovi-ugody"]`
4. URL: `/api/services/notarialni-poslugi/majnovi-ugody/?lang=ua`

---

## ⚠️ Важные моменты

### 1. Узлы типа "group" пропускаются

```javascript
// Если contracts имеет kind: "group"
// root → services → contracts (group) → property-agreements
// URL будет: /api/services/notarialni-poslugi/majnovi-ugody/
//            (без "dogovory")
```

### 2. Пустые slug также пропускаются

```javascript
// Если у узла нет slug для текущего языка, он не попадет в URL
```

### 3. Backend должен поддерживать соответствующие уровни

```python
# backend/main_page/urls.py
path('services/<slug:slug1>/', ...)                                    # 1 уровень
path('services/<slug:slug1>/<slug:slug2>/', ...)                      # 2 уровень
path('services/<slug:slug1>/<slug:slug2>/<slug:slug3>/', ...)         # 3 уровень
```

---

## 📊 Преимущества

✅ **Единый подход** для всех уровней вложенности  
✅ **Автоматическое построение** URL на основе структуры дерева  
✅ **Поддержка всех языков** - slug извлекается для текущего языка  
✅ **Умное пропускание** group узлов  
✅ **Минимум кода** - одинаковый для всех страниц

---

## 🚀 Быстрый старт для новой страницы

1. **Убедитесь, что страница есть в nav-tree.js** с уникальным `id`
2. **Создайте компонент страницы:**

```javascript
import PageTemplate from "@components/PageTemplate/PageTemplate";
import { usePageData } from "@hooks/usePageData";

const MyPage = () => {
  const { data, loading, error } = usePageData("my-page-id");

  return (
    <PageTemplate pageData={data} loading={loading} error={error}>
      {/* Дополнительный контент */}
    </PageTemplate>
  );
};

export default MyPage;
```

3. **Готово!** ✨ Страница автоматически получит данные из backend

---

## 🐛 Отладка

Если возникают проблемы, проверьте консоль браузера:

```
[usePageData] Found node for "property-agreements": {...}
[usePageData] Slug path for "property-agreements": ["notarialni-poslugi", "majnovi-ugody"]
[usePageData] Fetching from: http://localhost:8000/api/services/notarialni-poslugi/majnovi-ugody/?lang=ua
[usePageData] Success: {...}
```

Эти логи покажут:

- Найден ли узел в дереве
- Какой путь slug'ов построен
- Какой URL используется
- Успешно ли получены данные
