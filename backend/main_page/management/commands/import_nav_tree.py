"""
Django management команда для импорта навигации из nav-tree.js в БД
Использование: python manage.py import_nav_tree
"""

from django.core.management.base import BaseCommand
from main_page.models import ServiceCategory
import json


class Command(BaseCommand):
    help = 'Импортирует структуру навигации из nav-tree.js в базу данных'

    # Полная структура навигации из nav-tree.js
    NAV_TREE_DATA = {
        "id": "root",
        "kind": "section",
        "label": {"ua": "", "ru": "", "en": ""},
        "slug": {"ua": "", "ru": "", "en": ""},
        "showInMenu": False,
        "component": None,
        "children": [
            # ===================== SERVICES =====================
            {
                "id": "services",
                "kind": "section",
                "label": {
                    "ua": "Нотаріальні послуги",
                    "ru": "Нотариальные услуги",
                    "en": "Services",
                },
                "slug": {
                    "ua": "notarialni-poslugy",
                    "ru": "notarialni-poslugy",
                    "en": "notary-services",
                },
                "showInMenu": True,
                "component": None,
                "children": [
                    {
                        "id": "apostille-documents",
                        "kind": "page",
                        "label": {
                            "ua": "Апостиль на документи",
                            "ru": "Апостиль на документы",
                            "en": "Document apostille",
                        },
                        "slug": {
                            "ua": "apostil-na-dokumenty",
                            "ru": "apostil-na-dokumenty",
                            "en": "apostille",
                        },
                        "showInMenu": True,
                        "component": None,
                    },
                    {
                        "id": "services-translation-generic",
                        "kind": "page",
                        "label": {
                            "ua": "Переклад документів",
                            "ru": "Перевод документов",
                            "en": "Document translation",
                        },
                        "slug": {
                            "ua": "pereklad-dokumentiv",
                            "ru": "pereklad-dokumentiv",
                            "en": "translation",
                        },
                        "showInMenu": True,
                        "component": None,
                    },
                    # ===================== GROUP: ДОГОВОРИ =====================
                    {
                        "id": "contracts",
                        "kind": "group",
                        "label": {"ua": "Договори", "ru": "Договора", "en": "Contracts"},
                        "slug": {
                            "ua": "dogovory",
                            "ru": "dogovory",
                            "en": "contracts",
                        },
                        "showInMenu": True,
                        "component": None,
                        "children": [
                            {
                                "id": "property-agreements",
                                "kind": "page",
                                "label": {
                                    "ua": "Майнові договори",
                                    "ru": "Имущественные договоры",
                                    "en": "Property agreements",
                                },
                                "slug": {
                                    "ua": "mainovi-dogovory",
                                    "ru": "imushchestvennye-dogovory",
                                    "en": "property-agreements",
                                },
                                "showInMenu": True,
                                "component": None,
                            },
                            {
                                "id": "family-agreements",
                                "kind": "page",
                                "label": {
                                    "ua": "Сімейні договори",
                                    "ru": "Семейные договоры",
                                    "en": "Family agreements",
                                },
                                "slug": {
                                    "ua": "simeini-dogovory",
                                    "ru": "semeinye-dogovory",
                                    "en": "family-agreements",
                                },
                                "showInMenu": True,
                                "component": None,
                            },
                            {
                                "id": "contractual-guarantees",
                                "kind": "page",
                                "label": {
                                    "ua": "Договірні гарантії",
                                    "ru": "Договорные гарантии",
                                    "en": "Contractual guarantees",
                                },
                                "slug": {
                                    "ua": "dogovirni-harantii",
                                    "ru": "dogovornye-garantii",
                                    "en": "contractual-guarantees",
                                },
                                "showInMenu": True,
                                "component": None,
                            },
                            {
                                "id": "inheritance-agreements",
                                "kind": "page",
                                "label": {
                                    "ua": "Спадкові договори та заповіти",
                                    "ru": "Наследственные договоры и завещания",
                                    "en": "Inheritance agreements and wills",
                                },
                                "slug": {
                                    "ua": "spadkovi-dogovory",
                                    "ru": "nasledstvennye-dogovory",
                                    "en": "inheritance-agreements",
                                },
                                "showInMenu": True,
                                "component": None,
                            },
                            {
                                "id": "corporate-rights-agreements",
                                "kind": "page",
                                "label": {
                                    "ua": "Договори щодо корпоративних прав",
                                    "ru": "Договоры по корпоративным правам",
                                    "en": "Agreements on corporate rights",
                                },
                                "slug": {
                                    "ua": "dogovory-korporatyvni-prava",
                                    "ru": "dogovory-korporativnye-prava",
                                    "en": "corporate-rights-agreements",
                                },
                                "showInMenu": True,
                                "component": None,
                            },
                            {
                                "id": "executive-inscription",
                                "kind": "page",
                                "label": {
                                    "ua": "Виконавчий напис на договорі",
                                    "ru": "Исполнительная надпись на договоре",
                                    "en": "Executive inscription on the agreement",
                                },
                                "slug": {
                                    "ua": "vykonavchyi-napys",
                                    "ru": "ispolnitelnaya-nadpis",
                                    "en": "executive-inscription",
                                },
                                "showInMenu": True,
                                "component": None,
                            },
                            {
                                "id": "other-agreements",
                                "kind": "page",
                                "label": {
                                    "ua": "Інші договори",
                                    "ru": "Прочие договоры",
                                    "en": "Other agreements",
                                },
                                "slug": {
                                    "ua": "inshi-dogovory",
                                    "ru": "prochie-dogovory",
                                    "en": "other-agreements",
                                },
                                "showInMenu": True,
                                "component": None,
                            },
                        ],
                    },
                    # ===================== GROUP: ДОВІРЕНОСТІ =====================
                    {
                        "id": "power-of-attorney",
                        "kind": "group",
                        "label": {
                            "ua": "Довіреності",
                            "ru": "Доверенности",
                            "en": "Power of attorney",
                        },
                        "slug": {
                            "ua": "doverennosti",
                            "ru": "doverennosti",
                            "en": "power-of-attorney",
                        },
                        "showInMenu": True,
                        "component": None,
                        "children": [
                            {
                                "id": "poa-property",
                                "kind": "page",
                                "label": {
                                    "ua": "Довіреності на майно",
                                    "ru": "Доверенности на имущество",
                                    "en": "Powers of attorney for property",
                                },
                                "slug": {
                                    "ua": "doverenosti-na-mayno",
                                    "ru": "doverennosti-na-imushchestvo",
                                    "en": "poa-property",
                                },
                                "showInMenu": True,
                                "component": None,
                            },
                            {
                                "id": "poa-representation",
                                "kind": "page",
                                "label": {
                                    "ua": "Довіреності на представництво",
                                    "ru": "Доверенности на представительство",
                                    "en": "Powers of attorney for representation",
                                },
                                "slug": {
                                    "ua": "doverenosti-na-predstavnytstvo",
                                    "ru": "doverennosti-na-predstavitelstvo",
                                    "en": "poa-representation",
                                },
                                "showInMenu": True,
                                "component": None,
                            },
                            {
                                "id": "poa-special",
                                "kind": "page",
                                "label": {
                                    "ua": "Особливі види довіреностей",
                                    "ru": "Особые виды доверенностей",
                                    "en": "Special types of powers of attorney",
                                },
                                "slug": {
                                    "ua": "osoblyvi-vydy-doverenostei",
                                    "ru": "osobye-vidy-doverennostey",
                                    "en": "poa-special",
                                },
                                "showInMenu": True,
                                "component": None,
                            },
                        ],
                    },
                    # ===================== GROUP: ПІДПИС, ЗАЯВА =====================
                    {
                        "id": "signatures-statements",
                        "kind": "group",
                        "label": {
                            "ua": "Підпис, заява (на бланках)",
                            "ru": "Подпись, заявление (на бланках)",
                            "en": "Signature / Statement (forms)",
                        },
                        "slug": {
                            "ua": "pidpis-zayava",
                            "ru": "podpis-zayavlenie",
                            "en": "signature-statement",
                        },
                        "showInMenu": True,
                        "component": None,
                        "children": [
                            {
                                "id": "signatures-consents",
                                "kind": "page",
                                "label": {
                                    "ua": "Підписи та згоди",
                                    "ru": "Подписи и согласия",
                                    "en": "Signatures and consents",
                                },
                                "slug": {
                                    "ua": "pidpysy-ta-zhody",
                                    "ru": "podpisi-i-soglasiya",
                                    "en": "signatures-consents",
                                },
                                "showInMenu": True,
                                "component": None,
                            },
                            {
                                "id": "applications",
                                "kind": "page",
                                "label": {
                                    "ua": "Заяви",
                                    "ru": "Заявления",
                                    "en": "Applications",
                                },
                                "slug": {
                                    "ua": "zayavy",
                                    "ru": "zayavleniya",
                                    "en": "applications",
                                },
                                "showInMenu": True,
                                "component": None,
                            },
                        ],
                    },
                    # ===================== GROUP: КОНСУЛЬТАЦІЯ / КОПІЯ / ДУБЛІКАТ =====================
                    {
                        "id": "consult-copy-duplicate",
                        "kind": "group",
                        "label": {
                            "ua": "Консультація. Копія документів. Дублікати",
                            "ru": "Консультация. Копия документов. Дубликаты",
                            "en": "Consultation. Copies. Duplicates",
                        },
                        "slug": {
                            "ua": "konsultatsiya-kopiya-dublikaty",
                            "ru": "konsultatsiya-kopiya-dublikaty",
                            "en": "consultation-copies-duplicates",
                        },
                        "showInMenu": True,
                        "component": None,
                        "children": [
                            {
                                "id": "consultations",
                                "kind": "page",
                                "label": {
                                    "ua": "Консультації",
                                    "ru": "Консультации",
                                    "en": "Consultations",
                                },
                                "slug": {
                                    "ua": "konsultatsii",
                                    "ru": "konsultatsii",
                                    "en": "consultations",
                                },
                                "showInMenu": True,
                                "component": None,
                            },
                            {
                                "id": "document-copies",
                                "kind": "page",
                                "label": {
                                    "ua": "Копії документів",
                                    "ru": "Копии документов",
                                    "en": "Document copies",
                                },
                                "slug": {
                                    "ua": "kopii-dokumentiv",
                                    "ru": "kopii-dokumentov",
                                    "en": "document-copies",
                                },
                                "showInMenu": True,
                                "component": None,
                            },
                        ],
                    },
                    # ===================== GROUP: АПОСТИЛЬ ТА АФІДЕВІТ =====================
                    {
                        "id": "apostille-affidavit",
                        "kind": "group",
                        "label": {
                            "ua": "Апостиль та афідевіт",
                            "ru": "Апостиль и аффидевит",
                            "en": "Apostille & Affidavit",
                        },
                        "slug": {
                            "ua": "apostil-afidevit",
                            "ru": "apostil-affidevit",
                            "en": "apostille-affidavit",
                        },
                        "showInMenu": True,
                        "component": None,
                        "children": [
                            {
                                "id": "apostille-docs",
                                "kind": "page",
                                "label": {
                                    "ua": "Апостиль",
                                    "ru": "Апостиль",
                                    "en": "Apostille",
                                },
                                "slug": {
                                    "ua": "apostyl",
                                    "ru": "apostil",
                                    "en": "apostille",
                                },
                                "showInMenu": True,
                                "component": None,
                            },
                            {
                                "id": "affidavit",
                                "kind": "page",
                                "label": {
                                    "ua": "Афідевіт",
                                    "ru": "Аффидевит",
                                    "en": "Affidavit",
                                },
                                "slug": {
                                    "ua": "afidevit",
                                    "ru": "affidevit",
                                    "en": "affidavit",
                                },
                                "showInMenu": True,
                                "component": None,
                            },
                        ],
                    },
                ],
            },
            # ===================== NOTARIAL TRANSLATION =====================
            {
                "id": "notary-translate",
                "kind": "section",
                "label": {
                    "ua": "Нотаріальний переклад",
                    "ru": "Нотариальный перевод",
                    "en": "Notary translate",
                },
                "slug": {
                    "ua": "notarialni-pereklad",
                    "ru": "notarialni-pereklad",
                    "en": "notary-translate",
                },
                "showInMenu": True,
                "component": None,
                "children": [
                    {
                        "id": "translator-signature",
                        "kind": "page",
                        "label": {
                            "ua": "Засвідчення справжності підпису перекладача",
                            "ru": "Заверение подлинности подписи переводчика",
                            "en": "Translator's signature certification",
                        },
                        "slug": {
                            "ua": "zasvidchennia-spravzhnosti-pidpysu-perekladacha",
                            "ru": "zaverennie-podlinnosti-podpisi-perevodchika",
                            "en": "translator-signature",
                        },
                        "showInMenu": True,
                        "component": None,
                    },
                    {
                        "id": "notarial-translation-one-doc",
                        "kind": "page",
                        "label": {
                            "ua": "Нотаріальний переклад одного документу",
                            "ru": "Нотариальный перевод одного документа",
                            "en": "Notarial translation of one document",
                        },
                        "slug": {
                            "ua": "notarialnyi-pereklad-odnoho-dokumentu",
                            "ru": "notarialnyi-perevod-odnogo-dokumenta",
                            "en": "notarial-translation-one",
                        },
                        "showInMenu": True,
                        "component": None,
                    },
                    {
                        "id": "two-in-one-copy-translation",
                        "kind": "page",
                        "label": {
                            "ua": "2в1 (Нотаріальна копія + переклад)",
                            "ru": "2в1 (Нотариальная копия + перевод)",
                            "en": "2-in-1 (Notarial copy + translation)",
                        },
                        "slug": {
                            "ua": "2-v-1-notarialna-kopiia-pereklad",
                            "ru": "2-v-1-notarialnaya-kopiya-perevod",
                            "en": "2-in-1-copy-translation",
                        },
                        "showInMenu": True,
                        "component": None,
                    },
                ],
            },
            # ===================== MILITARY HELP =====================
            {
                "id": "military-help",
                "kind": "section",
                "label": {
                    "ua": "Допомога військовим",
                    "ru": "Помощь военным",
                    "en": "Military help",
                },
                "slug": {
                    "ua": "notarialni-dopomoga-viyskovim",
                    "ru": "notarialni-pomosch-voennym",
                    "en": "notary-military-help",
                },
                "showInMenu": True,
                "component": None,
                "children": [
                    {
                        "id": "military-help-main",
                        "kind": "page",
                        "label": {
                            "ua": "Кваліфікована юрдопомога військовослужбовцям (офлайн/онлайн)",
                            "ru": "Квалифицированная помощь военнослужащим (оффлайн/онлайн)",
                            "en": "Qualified legal help for military (offline/online)",
                        },
                        "slug": {
                            "ua": "kvalifikovana-yurydychna-dopomoha-viiskovosluzhbovtsiam-oflain-ta-onlain",
                            "ru": "kvalificirovannaya-pomosh-voennosluzhashchim-off-on",
                            "en": "qualified-legal-help-military",
                        },
                        "showInMenu": True,
                        "component": None,
                    },
                ],
            },
            # ===================== OTHER SERVICES =====================
            {
                "id": "other-services",
                "kind": "section",
                "label": {"ua": "Інші послуги", "ru": "Другие услуги", "en": "Other services"},
                "slug": {
                    "ua": "notarialni-inshi",
                    "ru": "notarialni-inshi",
                    "en": "notary-other",
                },
                "showInMenu": True,
                "component": None,
                "children": [
                    {
                        "id": "legal-consultations-with-opinion",
                        "kind": "page",
                        "label": {
                            "ua": "Юридичні консультації з наданням висновків",
                            "ru": "Юридические консультации с предоставлением заключений",
                            "en": "Legal consultations with opinions",
                        },
                        "slug": {
                            "ua": "yurydychni-konsultatsii-z-nadanniam-vysnovkiv",
                            "ru": "yuridicheskie-konsultatsii-s-zaklyucheniyami",
                            "en": "legal-consultations-opinions",
                        },
                        "showInMenu": True,
                        "component": None,
                    },
                    {
                        "id": "extracts-real-rights-register",
                        "kind": "page",
                        "label": {
                            "ua": "Отримання витягів з Держреєстру речових прав на нерухоме майно",
                            "ru": "Получение выписок из Госреестра вещных прав на недвижимость",
                            "en": "Extracts from State Register of real rights",
                        },
                        "slug": {
                            "ua": "otrymannia-vytiahiv-z-derzhavnoho-reiestru-rechovykh-prav-na-nerukhome-maino",
                            "ru": "poluchenie-vypisok-iz-reestra-veshch-prav",
                            "en": "extracts-real-rights-register",
                        },
                        "showInMenu": True,
                        "component": None,
                    },
                    {
                        "id": "edr-registration",
                        "kind": "page",
                        "label": {
                            "ua": "Держреєстрація в ЄДР (ЮО/ФОП/ГО)",
                            "ru": "Госрегистрация в ЕГР (юрлица/ФЛП/ОГ)",
                            "en": "State registration in EDR",
                        },
                        "slug": {
                            "ua": "derzhavna-reiestratsiia-v-yedynomu-derzhavnomu-reiestri-yurydychnykh-osib-fizychnykh-osib-pidpryiemtsiv-ta-hromadskykh-formuvan",
                            "ru": "gosregistraciya-v-egr-yurlitsa-flp-obedinenia",
                            "en": "edr-state-registration",
                        },
                        "showInMenu": True,
                        "component": None,
                    },
                    {
                        "id": "register-ownership-real-estate",
                        "kind": "page",
                        "label": {
                            "ua": "Держреєстрація права власності на нерухоме майно",
                            "ru": "Госрегистрация права собственности на недвижимость",
                            "en": "Registration of real estate ownership",
                        },
                        "slug": {
                            "ua": "derzhavna-reiestratsiia-prava-vlasnosti-na-nerukhome-maino",
                            "ru": "gosregistraciya-prava-sobstvennosti-nedvizhimosti",
                            "en": "register-ownership-real-estate",
                        },
                        "showInMenu": True,
                        "component": None,
                    },
                    {
                        "id": "edr-error-correction",
                        "kind": "page",
                        "label": {
                            "ua": "Виправлення помилки в ЄДР (з вини заявника)",
                            "ru": "Исправление ошибки в ЕГР (по вине заявителя)",
                            "en": "Correction of error in EDR (applicant fault)",
                        },
                        "slug": {
                            "ua": "vypravlennia-pomylky-u-vidomostiakh-yedynoho-derzhavnoho-reiestru-yurydychnykh-osib-fizychnykh-osib-pidpryiemtsiv-ta-hromadskykh-formuvan-dopushchenoi-z-vyny-zaiavnyka",
                            "ru": "ispravlenie-oshibki-v-egr-po-vine-zayavitelya",
                            "en": "edr-error-correction",
                        },
                        "showInMenu": True,
                        "component": None,
                    },
                    {
                        "id": "rights-register-for-developers",
                        "kind": "page",
                        "label": {
                            "ua": "Реєстрація нерухомості в Реєстрі прав (для забудовників/ФО/ЮО)",
                            "ru": "Регистрация недвижимости в Реестре прав (застройщики/физ/юр)",
                            "en": "Register real estate rights (developers/natural/legal)",
                        },
                        "slug": {
                            "ua": "reiestratsiia-nerukhomoho-maina-v-derzhavnomu-reiestri-rechovykh-prav-na-nerukhome-maino-dlia-zabudovnykiv-dlia-fizychnykh-ta-yurydychnykh-osib",
                            "ru": "registraciya-nedvizhimosti-v-reestre-prav-dlya-zastroyschikov-fiz-yur",
                            "en": "rights-register-for-developers",
                        },
                        "showInMenu": True,
                        "component": None,
                    },
                ],
            },
        ],
    }

    def handle(self, *args, **options):
        self.stdout.write('Начинаем импорт навигации...')
        
        # Очищаем существующие категории (ОСТОРОЖНО!)
        if options.get('clear', False):
            self.stdout.write(self.style.WARNING('Очистка существующих категорий...'))
            ServiceCategory.objects.all().delete()
        
        # Импортируем структуру
        root_children = self.NAV_TREE_DATA.get('children', [])
        
        # Фильтруем только категории услуг (исключаем статичные страницы)
        static_ids = ['home', 'about', 'offer', 'policy', 'contacts', 'trademark', 'blog', 'not-found-page']
        service_categories = [item for item in root_children if item['id'] not in static_ids]
        
        imported_count = 0
        for category_data in service_categories:
            created = self._import_category(category_data, parent=None, order=imported_count)
            if created:
                imported_count += 1
        
        self.stdout.write(
            self.style.SUCCESS(f'Успешно импортировано {imported_count} категорий!')
        )
    
    def _import_category(self, data, parent=None, order=0):
        """Рекурсивно импортирует категорию и её детей"""
        
        # Проверяем, существует ли уже категория с таким nav_id
        existing = ServiceCategory.objects.filter(nav_id=data['id']).first()
        
        if existing:
            self.stdout.write(
                self.style.WARNING(f'Категория {data["id"]} уже существует, пропускаем...')
            )
            return False
        
        # Создаем категорию
        category = ServiceCategory.objects.create(
            nav_id=data['id'],
            kind=data.get('kind', 'page'),
            label_ua=data['label'].get('ua', ''),
            label_ru=data['label'].get('ru', ''),
            label_en=data['label'].get('en', ''),
            slug_ua=data['slug'].get('ua', ''),
            slug_ru=data['slug'].get('ru', ''),
            slug_en=data['slug'].get('en', ''),
            show_in_menu=data.get('showInMenu', False),
            component=data.get('component'),
            parent=parent,
            order=order,
        )
        
        self.stdout.write(
            self.style.SUCCESS(f'✓ Создана: {category.label_ua} (ID: {category.nav_id})')
        )
        
        # Рекурсивно импортируем детей
        if 'children' in data and data['children']:
            for idx, child_data in enumerate(data['children']):
                self._import_category(child_data, parent=category, order=idx)
        
        return True
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Очистить существующие категории перед импортом',
        )

