from __future__ import annotations

from typing import Optional, Dict, Any

from .models import Header, AboutMe, ServiceCategory, FrequentlyAskedQuestion


def _clean_phone(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    try:
        # PhoneNumberField support
        if hasattr(value, 'as_e164') and value.as_e164:
            return value.as_e164
        s = str(value)
        s = s.strip().replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
        if s.startswith('+'):
            prefix = '+'
            digits = s[1:]
        else:
            prefix = ''
            digits = s
        digits = ''.join(ch for ch in digits if ch.isdigit())
        if not digits:
            return None
        return f"{prefix}{digits}" if prefix else f"+{digits}"
    except Exception:
        return None


def build_home_json_ld(lang: str = 'ua') -> Optional[str]:
    """
    Сборка JSON-LD для главной страницы с учётом языка.
    Возвращает сериализованную строку JSON или None при ошибке.
    """
    # Нормализуем язык
    if lang not in ['ua', 'ru', 'en']:
        lang = 'ua'

    site_url = 'https://notarius-korneenkova.com.ua/'
    image_url = 'https://notarius-korneenkova.com.ua/static/office.jpg'

    name_map: Dict[str, str] = {
        'ua': 'Приватний нотаріус Надія Корнієнкова',
        'ru': 'Частный нотариус Надежда Корниенкова',
        'en': 'Private Notary Nadiia Korniienkova',
    }
    locality_map: Dict[str, str] = {
        'ua': 'Дніпро',
        'ru': 'Днепр',
        'en': 'Dnipro',
    }

    header: Optional[Header] = Header.objects.first()

    telephone: Optional[str] = None
    email: Optional[str] = None
    street_address: Optional[str] = None
    instagram: Optional[str] = None
    facebook: Optional[str] = None
    tiktok: Optional[str] = None
    twitter: Optional[str] = None

    if header:
        telephone = _clean_phone(getattr(header, 'phone_number', None))
        email_value = getattr(header, 'email', None)
        email = f"mailto:{email_value}" if email_value else None
        address_field_map = {'ua': 'address_ua', 'ru': 'address_ru', 'en': 'address_en'}
        street_address = getattr(header, address_field_map[lang], None) or ''
        instagram = getattr(header, 'instagram_url', None)
        facebook = getattr(header, 'facebook_url', None)
        tiktok = getattr(header, 'tiktok_url', None)
        twitter = getattr(header, 'twitter_url', None)

    data: Dict[str, Any] = {
        "@context": "https://schema.org",
        "@type": "Notary",
        "name": name_map[lang],
        "url": site_url,
        "image": image_url,
        **({"telephone": telephone} if telephone else {}),
        **({"email": email} if email else {}),
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": street_address or "Dmytro Yavornitsky Avenue, 2",
            "addressLocality": locality_map[lang],
            "postalCode": "49000",
            "addressCountry": "UA",
        },
        "areaServed": locality_map[lang],
        "openingHoursSpecification": [
            {"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"], "opens": "10:00", "closes": "18:00"},
            {"@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "10:00", "closes": "17:00"},
        ],
        "sameAs": [
            *([site_url]),
            *( [instagram] if instagram else [] ),
            *( [facebook] if facebook else [] ),
            *( [tiktok] if tiktok else [] ),
            *( [twitter] if twitter else [] ),
        ],
    }

    try:
        import json
        return json.dumps(data, ensure_ascii=False)
    except Exception:
        return None



def build_about_json_ld(lang: str = 'ua') -> Optional[str]:
    """
    Сборка JSON-LD для страницы «Про мене» с учётом языка.
    Возвращает сериализованную строку JSON или None при ошибке.
    """
    # Нормализуем язык
    if lang not in ['ua', 'ru', 'en']:
        lang = 'ua'

    base_url = 'https://notarius-korneenkova.com.ua'
    # Языковые префиксы: для UA без префикса, для RU/EN — /ru, /en
    lang_prefix = '' if lang == 'ua' else f"/{lang}"
    page_path = '/notarialni-pro-mene'
    page_url = f"{base_url}{lang_prefix}{page_path}"

    name_map: Dict[str, str] = {
        'ua': 'Приватний нотаріус Надія Корнієнкова',
        'ru': 'Частный нотариус Надежда Корниенкова',
        'en': 'Private Notary Nadiia Korniienkova',
    }
    job_title_map: Dict[str, str] = {
        'ua': 'Приватний нотаріус',
        'ru': 'Частный нотариус',
        'en': 'Private Notary',
    }
    locality_map: Dict[str, str] = {
        'ua': 'Дніпро',
        'ru': 'Днепр',
        'en': 'Dnipro',
    }

    header: Optional[Header] = Header.objects.first()

    telephone: Optional[str] = None
    email: Optional[str] = None
    street_address: Optional[str] = None
    instagram: Optional[str] = None
    facebook: Optional[str] = None
    tiktok: Optional[str] = None
    twitter: Optional[str] = None

    if header:
        telephone = _clean_phone(getattr(header, 'phone_number', None))
        email_value = getattr(header, 'email', None)
        email = f"{email_value}" if email_value else None
        address_field_map = {'ua': 'address_ua', 'ru': 'address_ru', 'en': 'address_en'}
        street_address = getattr(header, address_field_map[lang], None) or ''
        instagram = getattr(header, 'instagram_url', None)
        facebook = getattr(header, 'facebook_url', None)
        tiktok = getattr(header, 'tiktok_url', None)
        twitter = getattr(header, 'twitter_url', None)

    # Получаем данные «Про мене» только из AboutMe
    about_me: Optional[AboutMe] = AboutMe.objects.last()

    # Текст/заголовок для краткого описания страницы
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None

    try:
        # Изображение возьмём из AboutMe, если доступно
        if about_me and getattr(about_me, 'photo', None) and hasattr(about_me.photo, 'url'):
            image_url = f"{base_url}{about_me.photo.url}" if not about_me.photo.url.startswith('http') else about_me.photo.url
    except Exception:
        image_url = None

    # Локализованные поля
    if about_me:
        # В AboutMe украинский суффикс — uk
        suffix = 'uk' if lang == 'ua' else lang
        title = getattr(about_me, f"title_{suffix}", None)
        description = getattr(about_me, f"text_{suffix}", None)

    # Fallback картинка, если нет фото из БД
    if not image_url:
        image_url = f"{base_url}/static/office.jpg"

    # Подготовим краткое описание без HTML
    plain_description: Optional[str] = None
    if description:
        try:
            import re
            import html as _html
            text = _html.unescape(str(description))
            text = text.replace('\xa0', ' ')
            text = re.sub(r'<[^>]+>', ' ', text)
            text = re.sub(r'\s+', ' ', text).strip()
            # Ограничим длину до ~200 символов
            if len(text) > 200:
                text = text[:197].rstrip() + '...'
            plain_description = text or None
        except Exception:
            plain_description = None

    # Готовим данные в виде @graph: только Person и Organization LocalBusiness (Notary)
    graph: list[Dict[str, Any]] = []

    person: Dict[str, Any] = {
        "@type": "Person",
        "@id": f"{base_url}/#person",
        "name": title or name_map[lang],
        "jobTitle": job_title_map[lang],
        "image": image_url,
        "url": page_url,
        **({"description": plain_description} if plain_description else {}),
        **({"telephone": telephone} if telephone else {}),
        **({"email": email} if email else {}),
        "sameAs": [
            *([base_url]),
            *( [instagram] if instagram else [] ),
            *( [facebook] if facebook else [] ),
            *( [tiktok] if tiktok else [] ),
            *( [twitter] if twitter else [] ),
        ],
    }
    graph.append(person)

    data: Dict[str, Any] = {
        "@context": "https://schema.org",
        "@graph": graph,
    }

    try:
        import json
        return json.dumps(data, ensure_ascii=False)
    except Exception:
        return None


def build_contacts_json_ld(lang: str = 'ua') -> Optional[str]:
    """
    Сборка JSON-LD для страницы контактов.
    Возвращает сериализованную строку JSON или None при ошибке.
    Формат: Organization с contactPoint и адресом.
    """
    if lang not in ['ua', 'ru', 'en']:
        lang = 'ua'

    base_url = 'https://notarius-korneenkova.com.ua'
    # URL страницы контактов с учётом языка
    lang_prefix = '' if lang == 'ua' else f"/{lang}"
    page_path = '/notarialni-contacty'
    page_url = f"{base_url}{lang_prefix}{page_path}"

    name_map: Dict[str, str] = {
        'ua': 'Приватний нотаріус Надія Корнієнкова',
        'ru': 'Частный нотариус Надежда Корниенкова',
        'en': 'Private Notary Nadiia Korniienkova',
    }
    locality_map: Dict[str, str] = {
        'ua': 'Дніпро',
        'ru': 'Днепр',
        'en': 'Dnipro',
    }

    header: Optional[Header] = Header.objects.first()

    telephone: Optional[str] = None
    email: Optional[str] = None
    street_address: Optional[str] = None
    instagram: Optional[str] = None
    facebook: Optional[str] = None
    tiktok: Optional[str] = None
    twitter: Optional[str] = None

    if header:
        telephone = _clean_phone(getattr(header, 'phone_number', None))
        email_value = getattr(header, 'email', None)
        email = f"{email_value}" if email_value else None
        address_field_map = {'ua': 'address_ua', 'ru': 'address_ru', 'en': 'address_en'}
        street_address = getattr(header, address_field_map[lang], None) or ''
        instagram = getattr(header, 'instagram_url', None)
        facebook = getattr(header, 'facebook_url', None)
        tiktok = getattr(header, 'tiktok_url', None)
        twitter = getattr(header, 'twitter_url', None)

    data: Dict[str, Any] = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": f"{base_url}/#organization",
        "name": name_map[lang],
        "url": page_url,
        **({"telephone": telephone} if telephone else {}),
        **({"email": email} if email else {}),
        "address": {
            "@type": "PostalAddress",
            "streetAddress": street_address or "Dmytro Yavornitsky Avenue, 2",
            "addressLocality": locality_map[lang],
            "postalCode": "49000",
            "addressCountry": "UA",
        },
        "areaServed": locality_map[lang],
        "contactPoint": [
            {
                "@type": "ContactPoint",
                **({"telephone": telephone} if telephone else {}),
                "contactType": "customer support",
                "areaServed": locality_map[lang],
                "availableLanguage": ["uk", "ru", "en"],
            }
        ],
        "sameAs": [
            *([base_url]),
            *( [instagram] if instagram else [] ),
            *( [facebook] if facebook else [] ),
            *( [tiktok] if tiktok else [] ),
            *( [twitter] if twitter else [] ),
        ],
    }

    try:
        import json
        return json.dumps(data, ensure_ascii=False)
    except Exception:
        return None


def build_service_json_ld(category: ServiceCategory, lang: str = 'ua') -> Optional[str]:
    """
    JSON-LD для детальной страницы услуги (1–3 уровни).
    Тип: Service. URL берётся из canonical для выбранного языка.
    """
    if lang not in ['ua', 'ru', 'en']:
        lang = 'ua'

    base_url = 'https://notarius-korneenkova.com.ua'

    # Название и описание по языку
    label_field = {'ua': 'label_ua', 'ru': 'label_ru', 'en': 'label_en'}[lang]
    desc_field = {'ua': 'description_ua', 'ru': 'description_ru', 'en': 'description_en'}[lang]
    name_value = getattr(category, label_field, None) or getattr(category, 'label_ua', '')
    description_html = getattr(category, desc_field, None)

    # Очистка описания от HTML и ограничение длины
    plain_description: Optional[str] = None
    if description_html:
        try:
            import re
            import html as _html
            text = _html.unescape(str(description_html))
            text = text.replace('\xa0', ' ')
            text = re.sub(r'<[^>]+>', ' ', text)
            text = re.sub(r'\s+', ' ', text).strip()
            if len(text) > 400:
                text = text[:397].rstrip() + '...'
            plain_description = text or None
        except Exception:
            plain_description = None

    # Канонический URL
    try:
        url = category.get_canonical_url(lang)
    except Exception:
        url = base_url

    # Картинка услуги
    image_url: Optional[str] = None
    try:
        if category.hero_image and hasattr(category.hero_image, 'url'):
            image_url = category.hero_image.url
        elif category.card_image and hasattr(category.card_image, 'url'):
            image_url = category.card_image.url
        if image_url and not image_url.startswith('http'):
            image_url = f"{base_url}{image_url}"
    except Exception:
        image_url = None

    locality_map: Dict[str, str] = {'ua': 'Дніпро', 'ru': 'Днепр', 'en': 'Dnipro'}

    # Базовый Service объект
    service_obj: Dict[str, Any] = {
        "@type": "Service",
        "@id": f"{base_url}/#service-{category.id}",
        "name": name_value,
        **({"description": plain_description} if plain_description else {}),
        "url": url,
        **({"image": image_url} if image_url else {}),
        "areaServed": locality_map[lang],
        "provider": {"@id": f"{base_url}/#organization"},
        "inLanguage": lang,
    }

    # Собираем FAQ, если есть
    faq_entities: list[Dict[str, Any]] = []
    try:
        faqs_qs = FrequentlyAskedQuestion.objects.filter(service_category=category, is_published=True).order_by('order', 'created_at')
        if faqs_qs.exists():
            import re
            import html as _html
            for faq in faqs_qs:
                q_field = { 'ua': 'question_ua', 'ru': 'question_ru', 'en': 'question_en' }[lang]
                a_field = { 'ua': 'answer_ua',   'ru': 'answer_ru',   'en': 'answer_en' }[lang]
                q_text = getattr(faq, q_field, '') or ''
                a_html = getattr(faq, a_field, '') or ''
                # Очистка ответа от HTML/nbsp
                a_text = _html.unescape(str(a_html))
                a_text = a_text.replace('\xa0', ' ')
                a_text = re.sub(r'<[^>]+>', ' ', a_text)
                a_text = re.sub(r'\s+', ' ', a_text).strip()
                if q_text and a_text:
                    faq_entities.append({
                        "@type": "Question",
                        "name": q_text,
                        "acceptedAnswer": {"@type": "Answer", "text": a_text},
                    })
    except Exception:
        faq_entities = []

    # Возвращаем либо Service один, либо граф с Service + FAQPage
    if faq_entities:
        data: Dict[str, Any] = {
            "@context": "https://schema.org",
            "@graph": [
                service_obj,
                {
                    "@type": "FAQPage",
                    "@id": f"{url}#faq",
                    "mainEntity": faq_entities,
                },
            ],
        }
    else:
        data = {"@context": "https://schema.org", **service_obj}

    try:
        import json
        return json.dumps(data, ensure_ascii=False)
    except Exception:
        return None

