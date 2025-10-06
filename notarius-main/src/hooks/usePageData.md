# usePageData Hook

Универсальный хук для получения данных страницы из backend API.

## Использование

```javascript
import { usePageData } from "@hooks/usePageData";

const MyPage = () => {
  const { data, loading, error } = usePageData("services");

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      <h1>{data?.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: data?.description }} />
    </div>
  );
};
```

## Параметры

- **navId** (string) - ID элемента из nav-tree (например: "services", "notary-translate", "military-help", "other-services")

## Возвращаемое значение

Объект с полями:

- **data** (object | null) - Данные страницы или null если еще не загружены
  - `title` (string) - Заголовок страницы
  - `description` (string) - HTML описание страницы
  - `hero_image` (string) - URL главного изображения
  - `listItems` (array) - Массив особенностей/пунктов списка
- **loading** (boolean) - true во время загрузки данных
- **error** (string | null) - Сообщение об ошибке или null

## Как это работает

1. Находит узел в merged navTree по navId
2. Извлекает slug для текущего языка из узла
3. Формирует URL: `/api/services/{slug}/?lang={currentLang}`
4. Делает запрос к backend
5. Трансформирует данные: `{ label → title, features → listItems }`
6. Автоматически перезапрашивает данные при смене языка

## Примеры navId для разных уровней

### 1 уровень (прямые дети root)

- `"services"` → `/api/services/notarialni-poslugi/?lang=ua`
- `"notary-translate"` → `/api/services/notarialni-pereklad/?lang=ua`
- `"military-help"` → `/api/services/dopomoga-vijskovim/?lang=ua`
- `"other-services"` → `/api/services/inshi-poslugi/?lang=ua`

### 2 уровень (дети services)

- `"contracts"` → `/api/services/notarialni-poslugi/dogovory/?lang=ua`
- `"power-of-attorney"` → `/api/services/notarialni-poslugi/dovirenosti/?lang=ua`
- `"translator-signature"` → `/api/services/notarialni-pereklad/zasvidchennya-pidpisu/?lang=ua`

### 3 уровень (внуки services)

- `"property-agreements"` → `/api/services/notarialni-poslugi/dogovory/majnovi-ugody/?lang=ua`
- `"poa-property"` → `/api/services/notarialni-poslugi/dovirenosti/dovirenosti-na-majno/?lang=ua`

### 4 уровень (правнуки services)

Любые глубоко вложенные страницы автоматически поддерживаются

## Зависимости

- `useLang()` - получение текущего языка
- `useHybridNav()` - получение merged navTree
- `findNodeById()` - поиск узла в дереве по ID
