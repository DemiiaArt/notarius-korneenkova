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

    result = []
    
    for item in root_data['children']:
        result.append(item)
        
        if item.get('id') == 'about':
            result.extend(services_data)
    
    root_data['children'] = result
    return root_data