# 🔧 Группы со slug'ами в URL

## 🐛 Проблема

Раньше `usePageData("contracts")` возвращал данные с URL:

```
http://localhost:8000/api/services/notarialni-poslugy/?lang=ua
```

Вместо ожидаемого:

```
http://localhost:8000/api/services/notarialni-poslugy/dogovory/?lang=ua
```

---

## 🔍 Причина

**`buildSlugPath` пропускал ВСЕ узлы с `kind="group"`**, даже если у них был slug.

### Старая логика:

```javascript
for (const node of stack) {
  if (node.id === "root") continue;

  // ❌ Всегда пропускаем группы
  if (node.kind === "group") continue;

  const slug = node.slug?.[lang];
  if (slug) {
    slugs.push(slug);
  }
}
```

**Результат для "contracts":**

- Путь: `root → services → contracts`
- `root` → пропускается
- `services` → добавляется slug `"notarialni-poslugy"`
- `contracts` → **пропускается** (kind="group")
- Итог: `["notarialni-poslugy"]` ❌

---

## ✅ Решение

**Новая логика: группы СО slug добавляются в путь, группы БЕЗ slug пропускаются**

### Новая логика:

```javascript
for (const node of stack) {
  if (node.id === "root") continue;

  // ✅ Проверяем наличие slug, а не kind
  const slug = node.slug?.[lang];
  if (slug) {
    slugs.push(slug); // Добавляем slug любого узла (даже group)
  }
  // Если нет slug, но это НЕ группа - это ошибка
  else if (node.kind !== "group") {
    console.warn(`Node "${node.id}" has no slug for lang "${lang}"`);
  }
}
```

**Результат для "contracts" (если есть slug "dogovory"):**

- Путь: `root → services → contracts`
- `root` → пропускается
- `services` → добавляется slug `"notarialni-poslugy"`
- `contracts` → добавляется slug `"dogovory"` ✅
- Итог: `["notarialni-poslugy", "dogovory"]` ✅
- URL: `/api/services/notarialni-poslugy/dogovory/?lang=ua` ✅

---

## 📋 Что нужно сделать

### **Шаг 1: Проверить slug в backend**

Убедитесь, что в Django Admin для узла с `nav_id = "contracts"` есть slug'и:

```python
# В Django Admin или через shell
from main_page.models import ServiceCategory

contracts = ServiceCategory.objects.get(nav_id="contracts")
print(contracts.slug_ua)  # Должен быть "dogovory" или похожий slug
print(contracts.slug_ru)
print(contracts.slug_en)
```

---

### **Шаг 2: Если slug'ов нет - добавить**

```python
# В Django Admin или через shell
contracts = ServiceCategory.objects.get(nav_id="contracts")
contracts.slug_ua = "dogovory"
contracts.slug_ru = "dogovory"
contracts.slug_en = "contracts"
contracts.save()
```

---

### **Шаг 3: Проверить на frontend**

```javascript
// В ContractPage.jsx
const { data, loading, error } = usePageData("contracts");

// Откройте консоль браузера, должны увидеть:
// [usePageData] Slug path for "contracts": ["notarialni-poslugy", "dogovory"]
// Fetching: http://localhost:8000/api/services/notarialni-poslugy/dogovory/?lang=ua
```

---

## 🎯 Когда использовать group со slug

### **✅ Группа СО slug (используется в URL):**

```javascript
{
  id: "contracts",
  kind: "group",
  slug: { ua: "dogovory", ru: "dogovory", en: "contracts" },
  children: [/* ... */]
}
```

**URL:** `/notarialni-poslugy/dogovory` ✅

**Использование:**

- Когда группа должна иметь свою страницу
- Когда группа используется как категория в URL
- Когда нужен `usePageData("contracts")` для загрузки данных

---

### **✅ Группа БЕЗ slug (не влияет на URL):**

```javascript
{
  id: "power-of-attorney-types",
  kind: "group",
  slug: { ua: "", ru: "", en: "" },  // Пустые slug'и
  children: [/* ... */]
}
```

**URL:** Дочерние страницы берут URL от родителя ✅

**Использование:**

- Когда группа нужна только для организации меню
- Когда группа не имеет своей страницы
- Когда дочерние страницы должны быть на одном уровне с родителем

---

## 📊 Примеры

### Пример 1: Contracts (группа со slug)

**Структура:**

```
services (section, slug: "notarialni-poslugy")
  └── contracts (group, slug: "dogovory")
      ├── marriage-contract (page, slug: "shlyubniy-dogovir")
      └── gift-agreement (page, slug: "dogovir-daruvannya")
```

**URL'ы:**

```
/notarialni-poslugy                          → services
/notarialni-poslugy/dogovory                 → contracts (группа со slug)
/notarialni-poslugy/dogovory/shlyubniy-dogovir → marriage-contract
/notarialni-poslugy/dogovory/dogovir-daruvannya → gift-agreement
```

---

### Пример 2: Power of Attorney (группа БЕЗ slug для детей)

**Структура:**

```
services (section, slug: "notarialni-poslugy")
  └── power-of-attorney (section, slug: "dovirenosti")
      └── poa-types (group, slug: "")
          ├── poa-representation (page, slug: "predstavnictvo")
          └── poa-property (page, slug: "na-majno")
```

**URL'ы:**

```
/notarialni-poslugy                      → services
/notarialni-poslugy/dovirenosti          → power-of-attorney
/notarialni-poslugy/dovirenosti/predstavnictvo → poa-representation (без poa-types в URL)
/notarialni-poslugy/dovirenosti/na-majno       → poa-property (без poa-types в URL)
```

---

## ⚠️ Важные замечания

1. **kind="group" vs kind="section":**
   - `group` - логическая группировка (может иметь или не иметь slug)
   - `section` - всегда имеет slug и свою страницу

2. **Группы со slug должны иметь контент в backend:**
   - Если используете `usePageData("contracts")`, убедитесь что в backend есть:
     - `description_ua/ru/en` (HTML контент)
     - `hero_image` (изображение)
     - `label_ua/ru/en` (заголовок)

3. **Backend URL patterns должны поддерживать группы:**
   ```python
   # backend/main_page/urls.py
   path('services/<slug:slug1>/', ...)                    # 2 уровень
   path('services/<slug:slug1>/<slug:slug2>/', ...)       # 3 уровень (может быть group!)
   path('services/<slug:slug1>/<slug:slug2>/<slug:slug3>/', ...)  # 4 уровень
   ```

---

## 🔗 Связанные файлы

- `src/hooks/usePageData.js` - Хук с исправленной логикой buildSlugPath
- `backend/main_page/models.py` - Модель ServiceCategory с полями slug_ua/ru/en
- `src/nav/nav-tree.js` - Статическое дерево навигации
- `src/hooks/useHybridNavTree.js` - Merge статического и backend деревьев

---

**Создано:** 2025-10-06  
**Версия:** 1.0
