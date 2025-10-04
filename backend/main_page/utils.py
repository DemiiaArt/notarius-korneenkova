root_data = {
    "id": "root",
    "kind": "section",
    "label": { "ua": "", "ru": "", "en": "" },
    "slug": { "ua": "", "ru": "", "en": "" },
    "showInMenu": "false",
    "component": "null",
    "children": [
        # // ===================== HOME =====================
        {
        "id": "home",
        "kind": "page",
        "label": { "ua": "Головна", "ru": "Главная", "en": "Main" },
        "slug": { "ua": "", "ru": "", "en": "" },
        "showInMenu": "false",
        "component": "null",
        },

        # // ===================== ABOUT =====================
        {
        "id": "about",
        "kind": "page",
        "label": { "ua": "Про мене", "ru": "Про меня", "en": "About me" },
        "slug": {
            "ua": "notarialni-pro-mene",
            "ru": "notarialni-pro-mene",
            "en": "notary-about",
        },
        "showInMenu": "true",
        "component": "null",
        },

        # // ===================== SERVICES WRAPPER =====================
        # // All service-like pages are nested under this URL segment where possible.
        

        # // ===================== OFFER / POLICY / CONTACTS / TRADE MARK =====================
        {
        "id": "offer",
        "kind": "page",
        "label": {
            "ua": "Договір оферти",
            "ru": "Договор оферты",
            "en": "Offer contract",
        },
        "slug": {
            "ua": "notarialni-offer",
            "ru": "notarialni-offer",
            "en": "notary-offer",
        },
        "showInMenu": "false",
        "component": "null",
        },
        {
        "id": "policy",
        "kind": "page",
        "label": {
            "ua": "Політика конфіденційності",
            "ru": "Политика конфиденциальности",
            "en": "Privacy Policy",
        },
        "slug": {
            "ua": "notarialni-policy",
            "ru": "notarialni-policy",
            "en": "notary-policy",
        },
        "showInMenu": "false",
        "component": "null",
        },
        {
        "id": "contacts",
        "kind": "page",
        "label": { "ua": "Контакти", "ru": "Контакты", "en": "Contacts" },
        "slug": {
            "ua": "notarialni-contacty",
            "ru": "notarialni-contacty",
            "en": "notary-contacts",
        },
        "showInMenu": "true",
        "component": "null",
        },
        {
        "id": "trademark",
        "kind": "page",
        "label": {
            "ua": "Торгівельна марка",
            "ru": "Торговая марка",
            "en": "Trade mark",
        },
        "slug": {
            "ua": "notarialni-torgivelna-marka",
            "ru": "notarialni-torgova-marka",
            "en": "notary-trade-mark",
        },
        "showInMenu": "false",
        "component": "null",
        },
        {
        "id": "blog",
        "kind": "page",
        "label": {
            "ua": "Блог",
            "ru": "Блог",
            "en": "Blog",
        },
        "slug": {
            "ua": "notarialni-blog",
            "ru": "notarialni-blog",
            "en": "notary-blog",
        },
        "showInMenu": "false",
        "component": "null",
        },
        {
        "id": "not-found-page",
        "kind": "page",
        "label": {
            "ua": "stotinku-ne-znaydeno",
            "ru": "stranicu-ne-naydeno",
            "en": "page-not-found",
        },
        "showInMenu": "false",
        "component": "null",
        },
    ],
    }


def inject_services(root_data, services_data):
    """
    Вставляет категории услуг из БД после элемента 'about' в структуру навигации
    ВАЖНО: создаём копию root_data, чтобы не модифицировать глобальный объект!
    """
    # Создаём глубокую копию, чтобы не модифицировать оригинал
    import copy
    result_data = copy.deepcopy(root_data)
    
    new_children = []
    
    for item in result_data['children']:
        new_children.append(item)
        
        # После элемента 'about' вставляем категории из БД
        if item.get('id') == 'about':
            new_children.extend(services_data)
    
    result_data['children'] = new_children
    return result_data