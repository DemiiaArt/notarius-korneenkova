# Руководство по интеграции SEO с Backend

## 📋 Обзор

Система SEO настроена для получения метаданных (Title и Description) с backend.  
**Keywords не используются** - современные поисковые системы не учитывают keywords.  
**H1 проверен** - на всех страницах используется правильно (1 раз на странице).

---

## 🎯 Что реализовано

### 1. **SEO Компонент** (`src/components/Seo/Seo.jsx`)

- ✅ Убраны keywords
- ✅ Динамический `<html lang>` (uk/ru/en)
- ✅ Автоматические hreflang теги
- ✅ Open Graph с альтернативными локалями
- ✅ Поддержка `noSuffix` для полного контроля над Title
- ✅ Работа с изображениями от backend

### 2. **Hook для получения SEO с Backend** (`src/hooks/useSeoData.js`)

- ✅ `useSeoData` - простой hook для получения данных
- ✅ `useCachedSeoData` - с кешированием в localStorage
- ✅ Автоматический fallback при ошибках
- ✅ Поддержка всех языков (ua/ru/en)

### 3. **H1 Использование**

- ✅ Проверены все страницы
- ✅ H1 используется **1 раз на странице** (правильно)
- ✅ H1 находится в hero-блоке с правильной семантикой

---

## 📝 Формат данных с Backend

### Структура API Response

```json
{
  "title": "Заголовок страницы (полный, готовый к использованию)",
  "description": "Описание для поисковиков (150-160 символов)",
  "h1": "Заголовок H1 (опционально, если отличается от title)",
  "og_image": "/media/path/to/image.jpg"
}
```

### Endpoint структура

```
GET /api/seo/{page_id}/?lang={lang}

Примеры:
- /api/seo/home/?lang=ua
- /api/seo/home/?lang=ru
- /api/seo/home/?lang=en
- /api/seo/contacts/?lang=ua
```

---

## 🚀 Использование на страницах

### Вариант 1: Статические данные (сейчас)

```jsx
import Seo from "@components/Seo/Seo";

const MainPage = () => {
  return (
    <>
      <Seo
        title="Приватний нотаріус у Дніпрі — Надія Корнієнкова"
        description="Нотаріальні послуги у Дніпрі: довіреності, договори, спадщина, апостиль, афідевіт. Пн–Чт 10:00–18:00, Пт 10:00–17:00. Дзвінок: +380 67 544 07 00."
        noSuffix={true} // Не добавлять " | Нотаріус Надія"
      />
      {/* Контент страницы */}
    </>
  );
};
```

### Вариант 2: Данные с Backend (рекомендовано)

```jsx
import Seo from "@components/Seo/Seo";
import { useSeoData } from "@hooks/useSeoData";

const MainPage = () => {
  const { seoData, loading } = useSeoData("home", {
    fallback: {
      title: "Приватний нотаріус у Дніпрі — Надія Корнієнкова",
      description: "Нотаріальні послуги...",
      h1: "Приватний нотаріус",
    },
  });

  return (
    <>
      {!loading && seoData && (
        <Seo
          title={seoData.title}
          description={seoData.description}
          ogImage={seoData.ogImage}
          noSuffix={true}
        />
      )}

      <div className="hero">
        <h1>{seoData?.h1 || "Приватний нотаріус"}</h1>
        {/* Контент */}
      </div>
    </>
  );
};
```

### Вариант 3: С кешированием (для production)

```jsx
import { useCachedSeoData } from "@hooks/useSeoData";

const ContactsPage = () => {
  const { seoData, loading, refresh } = useCachedSeoData("contacts", {
    cacheDuration: 3600000, // 1 час
    fallback: {
      title: "Контакти нотаріуса у Дніпрі",
      description: "Прийом: Пн–Чт 10:00–18:00...",
    },
  });

  // refresh() - для принудительного обновления кеша

  return (
    <>
      {seoData && (
        <Seo title={seoData.title} description={seoData.description} />
      )}
      {/* Контент */}
    </>
  );
};
```

---

## 📊 Метаданные для разных страниц

### Главная страница

**Украинский (UA)**:

- Title: `Приватний нотаріус у Дніпрі — Надія Корнієнкова`
- Description: `Нотаріальні послуги у Дніпрі: довіреності, договори, спадщина, апостиль, афідевіт. Пн–Чт 10:00–18:00, Пт 10:00–17:00. Дзвінок: +380 67 544 07 00.`
- H1: `Приватний нотаріус`

**Русский (RU)**:

- Title: `Частный нотариус в Днепре — Надежда Корниенкова`
- Description: `Нотариальные услуги в Днепре: доверенности, договоры, наследство, апостиль, аффидевит. Пн–Чт 10:00–18:00, Пт 10:00–17:00. Звонок: +380 67 544 07 00.`
- H1: `Частный нотариус`

**English (EN)**:

- Title: `Private Notary in Dnipro — Nadiia Korneenkova`
- Description: `Notary services in Dnipro: powers of attorney, contracts, inheritance, apostille & affidavits. Mon–Thu 10:00–18:00, Fri 10:00–17:00. Call: +380 67 544 07 00.`
- H1: `Private Notary`

---

### Хаб «Нотаріальні послуги»

**Украинский (UA)**:

- Title: `Нотаріальні послуги у Дніпрі — довіреності, договори, апостиль`
- Description: `Повний спектр нотаріальних дій: довіреності, договори, спадкові заяви, виконавчий напис, апостиль та афідевіт. Консультація телефоном.`
- H1: `Нотаріальні послуги`

**Русский (RU)**:

- Title: `Нотариальные услуги в Днепре — доверенности, договоры, апостиль`
- Description: `Полный спектр нотариальных действий: доверенности, договоры, наследственные заявления, исполнительная надпись, апостиль и аффидевит.`
- H1: `Нотариальные услуги`

**English (EN)**:

- Title: `Notary Services in Dnipro — POA, Contracts, Apostille`
- Description: `Full range of notarial services: powers of attorney, contracts, inheritance documents, executive inscription, apostille & affidavits.`
- H1: `Notary Services`

---

### Контакты

**Украинский (UA)**:

- Title: `Контакти нотаріуса у Дніпрі — адреса, телефон, графік`
- Description: `Прийом: Пн–Чт 10:00–18:00, Пт 10:00–17:00. Адреса: просп. Дмитра Яворницького, 2. Телефон: +380 67 544 07 00.`
- H1: `Контакти`

**Русский (RU)**:

- Title: `Контакты нотариуса в Днепре — адрес, телефон, график`
- Description: `Прием: Пн–Чт 10:00–18:00, Пт 10:00–17:00. Адрес: просп. Дмитра Яворницкого, 2. Телефон: +380 67 544 07 00.`
- H1: `Контакты`

**English (EN)**:

- Title: `Notary Contact in Dnipro — Address, Phone, Hours`
- Description: `Mon–Thu 10:00–18:00, Fri 10:00–17:00. Address: Dmytro Yavornitsky Ave, 2. Phone: +380 67 544 07 00.`
- H1: `Contact`

---

### Внутренние страницы (шаблон для услуг)

**Украинский (UA)**:

- Title: `[Назва послуги] у Дніпрі — Приватний нотаріус Надія Корнієнкова`
- Description: `Повний спектр нотаріальних дій: [Назва послуги]. Консультація телефоном +380 67 544 07 00. Прийом: Пн–Чт 10:00–18:00, Пт 10:00–17:00. Адреса: просп. Дмитра Яворницького, 2`
- H1: `[Назва послуги]`

**Русский (RU)**:

- Title: `[Название услуги] в Днепре — Частный нотариус Надежда Корниенкова`
- Description: `Полный спектр нотариальных действий: [Название услуги]. Консультация по телефону +380 67 544 07 00. Прием: Пн–Чт 10:00–18:00, Пт 10:00–17:00.`
- H1: `[Название услуги]`

**English (EN)**:

- Title: `[Service Name] in Dnipro — Private Notary Nadiia Korneenkova`
- Description: `Full range of notarial services: [Service Name]. Consultation by phone +380 67 544 07 00. Mon–Thu 10:00–18:00, Fri 10:00–17:00.`
- H1: `[Service Name]`

---

## 🔧 Настройка Backend

### Django Model (пример)

```python
# models.py
from django.db import models

class SeoMeta(models.Model):
    page_id = models.CharField(max_length=100, unique=True)
    title_ua = models.CharField(max_length=255)
    title_ru = models.CharField(max_length=255)
    title_en = models.CharField(max_length=255)
    description_ua = models.TextField()
    description_ru = models.TextField()
    description_en = models.TextField()
    h1_ua = models.CharField(max_length=255, blank=True)
    h1_ru = models.CharField(max_length=255, blank=True)
    h1_en = models.CharField(max_length=255, blank=True)
    og_image = models.ImageField(upload_to='seo/', blank=True, null=True)

    class Meta:
        verbose_name = "SEO Meta"
        verbose_name_plural = "SEO Metas"
```

### Django View (пример)

```python
# views.py
from rest_framework.views import APIView
from rest_framework.response import Response

class SeoMetaView(APIView):
    def get(self, request, page_id):
        lang = request.GET.get('lang', 'ua')

        try:
            seo = SeoMeta.objects.get(page_id=page_id)

            data = {
                'title': getattr(seo, f'title_{lang}'),
                'description': getattr(seo, f'description_{lang}'),
                'h1': getattr(seo, f'h1_{lang}') or getattr(seo, f'title_{lang}'),
                'og_image': seo.og_image.url if seo.og_image else None
            }

            return Response(data)
        except SeoMeta.DoesNotExist:
            return Response({'error': 'SEO meta not found'}, status=404)
```

### Django URL (пример)

```python
# urls.py
from django.urls import path

urlpatterns = [
    path('api/seo/<str:page_id>/', SeoMetaView.as_view(), name='seo-meta'),
]
```

---

## ✅ Проверка H1

### Правильное использование H1:

```jsx
// ✅ ПРАВИЛЬНО - H1 один раз на странице
<div className="hero">
  <h1>Заголовок страницы</h1>
  {/* Остальной контент */}
</div>

// ❌ НЕПРАВИЛЬНО - несколько H1
<div>
  <h1>Первый заголовок</h1>
  <h1>Второй заголовок</h1>  // ← Ошибка!
</div>
```

### Проверка на страницах:

Все основные страницы используют H1 правильно:

- ✅ MainPage - H1 в MainVideo компоненте
- ✅ AboutPage - H1 в About компоненте
- ✅ ContactsPage - H1 в хедере секции
- ✅ ServicesPage - H1 в NotaryServices
- ✅ BlogArticlePage - H1 в TemplateBlogPage
- ✅ TemplatePage - H1 в hero блоке

---

## 📱 Тестирование

### 1. Проверка метатегов в браузере

```javascript
// В консоли браузера:
console.log(document.title);
console.log(document.querySelector('meta[name="description"]').content);
console.log(document.documentElement.lang);
```

### 2. Проверка H1

```javascript
// Должен быть только один H1:
console.log(document.querySelectorAll("h1").length); // Должно быть 1
```

### 3. Проверка hreflang

```javascript
// Проверка альтернативных языков:
document.querySelectorAll('link[rel="alternate"]').forEach((link) => {
  console.log(link.hreflang, link.href);
});
```

---

## 🌐 Open Graph для соцсетей

### Автоматически добавляются теги:

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:url" content="..." />
<meta property="og:image" content="..." />
<meta property="og:locale" content="uk_UA" />
<meta property="og:locale:alternate" content="ru_RU" />
<meta property="og:locale:alternate" content="en_US" />
<meta property="og:site_name" content="Нотаріус Надія Корнієнкова" />
```

### Тестирование превью:

- **Facebook**: https://developers.facebook.com/tools/debug/
- **LinkedIn**: https://www.linkedin.com/post-inspector/
- **Twitter**: https://cards-dev.twitter.com/validator

---

## 📚 Дополнительные ресурсы

- [Google Search Central](https://developers.google.com/search)
- [Open Graph Protocol](https://ogp.me/)
- [hreflang Guide](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Schema.org](https://schema.org/) - для будущего улучшения

---

## ✨ Итого

✅ **SEO компонент**: Без keywords, с полной поддержкой RU  
✅ **Backend интеграция**: Готовые hooks для получения данных  
✅ **H1 проверен**: Используется правильно (1 раз на странице)  
✅ **Мультиязычность**: uk/ru/en с hreflang  
✅ **Open Graph**: Для соцсетей с альтернативными локалями  
✅ **Документация**: Подробные примеры и рекомендации

**Всё готово для работы с backend!** 🚀
