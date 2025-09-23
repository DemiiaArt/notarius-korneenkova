// One-source nav tree for UA / RU / EN.
// Use with the helpers we discussed (buildFullPathForId, buildIndices, etc.).
// NOTE: Slugs for many pages are proposed; tweak as you like to match existing routes.

export const NAV_TREE = {
  id: "root",
  kind: "section",
  label: { ua: "", ru: "", en: "" },
  slug: { ua: "", ru: "", en: "" },
  showInMenu: false,
  component: null,
  children: [
    // ===================== HOME =====================
    {
      id: "home",
      kind: "page",
      label: { ua: "Головна", ru: "Главная", en: "Main" },
      slug: { ua: "", ru: "", en: "" },
      showInMenu: false,
      component: null,
    },

    // ===================== ABOUT =====================
    {
      id: "about",
      kind: "page",
      label: { ua: "Про мене", ru: "Про меня", en: "About me" },
      slug: {
        ua: "notarialni-pro-mene",
        ru: "notarialni-pro-mene",
        en: "notary-about",
      },
      showInMenu: true,
      component: null,
    },

    // ===================== SERVICES WRAPPER =====================
    // All service-like pages are nested under this URL segment where possible.
    {
      id: "services",
      kind: "section",
      label: {
        ua: "Нотаріальні послуги",
        ru: "Нотариальные услуги",
        en: "Services",
      },
      slug: {
        ua: "notarialni-poslugy",
        ru: "notarialni-poslugy",
        en: "notary-services",
      },
      showInMenu: true,
      component: null,
      children: [
        // ---- quick pages from routeNames.ua children ----
        {
          id: "apostille-documents",
          kind: "page",
          label: {
            ua: "Апостиль на документи",
            ru: "Апостиль на документы",
            en: "Document apostille",
          },
          slug: {
            ua: "apostil-na-dokumenty",
            ru: "apostil-na-dokumenty",
            en: "apostille",
          },
          showInMenu: true,
          component: null,
        },
        {
          id: "services-translation-generic",
          kind: "page",
          label: {
            ua: "Переклад документів",
            ru: "Перевод документов",
            en: "Document translation",
          },
          slug: {
            ua: "pereklad-dokumentiv",
            ru: "pereklad-dokumentiv",
            en: "translation",
          },
          showInMenu: true,
          component: null,
        },

        // ===================== GROUP: ДОГОВОРИ =====================
        {
          id: "contracts",
          kind: "group",
          label: { ua: "Договори", ru: "Договора", en: "Contracts" },
          slug: {
            ua: "dogovory",
            ru: "dogovory",
            en: "contracts",
          },
          children: [
            {
              id: "property-agreements",
              kind: "page",
              label: {
                ua: "Майнові договори",
                ru: "Имущественные договоры",
                en: "Property agreements",
              },
              slug: {
                ua: "mainovi-dogovory",
                ru: "imushchestvennye-dogovory",
                en: "property-agreements",
              },
              showInMenu: true,
              component: null,
            },
            {
              id: "family-agreements",
              kind: "page",
              label: {
                ua: "Сімейні договори",
                ru: "Семейные договоры",
                en: "Family agreements",
              },
              slug: {
                ua: "simeini-dogovory",
                ru: "semeinye-dogovory",
                en: "family-agreements",
              },
              showInMenu: true,
              component: null,
            },
            {
              id: "contractual-guarantees",
              kind: "page",
              label: {
                ua: "Договірні гарантії",
                ru: "Договорные гарантии",
                en: "Contractual guarantees",
              },
              slug: {
                ua: "dogovirni-harantii",
                ru: "dogovornye-garantii",
                en: "contractual-guarantees",
              },
              showInMenu: true,
              component: null,
            },
            {
              id: "inheritance-agreements",
              kind: "page",
              label: {
                ua: "Спадкові договори та заповіти",
                ru: "Наследственные договоры и завещания",
                en: "Inheritance agreements and wills",
              },
              slug: {
                ua: "spadkovi-dogovory",
                ru: "nasledstvennye-dogovory",
                en: "inheritance-agreements",
              },
              showInMenu: true,
              component: null,
            },
            {
              id: "corporate-rights-agreements",
              kind: "page",
              label: {
                ua: "Договори щодо корпоративних прав",
                ru: "Договоры по корпоративным правам",
                en: "Agreements on corporate rights",
              },
              slug: {
                ua: "dogovory-korporatyvni-prava",
                ru: "dogovory-korporativnye-prava",
                en: "corporate-rights-agreements",
              },
              showInMenu: true,
              component: null,
            },
            {
              id: "executive-inscription",
              kind: "page",
              label: {
                ua: "Виконавчий напис на договорі",
                ru: "Исполнительная надпись на договоре",
                en: "Executive inscription on the agreement",
              },
              slug: {
                ua: "vykonavchyi-napys",
                ru: "ispolnitelnaya-nadpis",
                en: "executive-inscription",
              },
              showInMenu: true,
              component: null,
            },
            {
              id: "other-agreements",
              kind: "page",
              label: {
                ua: "Інші договори",
                ru: "Прочие договоры",
                en: "Other agreements",
              },
              slug: {
                ua: "inshi-dogovory",
                ru: "prochie-dogovory",
                en: "other-agreements",
              },
              showInMenu: true,
              component: null,
            },
            //     {
            //       id: "gift-agreement",
            //       kind: "page",
            //       label: {
            //         ua: "Договір дарування нерухомості або рухомого майна",
            //         ru: "Договор дарения недвижимости или движимого имущества",
            //         en: "Gift agreement (real or movable property)",
            //       },
            //       slug: {
            //         ua: "dogovir-daruvannia",
            //         ru: "dogovor-dareniya",
            //         en: "gift-agreement",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //     {
            //       id: "loan-agreement",
            //       kind: "page",
            //       label: {
            //         ua: "Договір позики",
            //         ru: "Договор займа",
            //         en: "Loan agreement",
            //       },
            //       slug: {
            //         ua: "dogovir-pozyky",
            //         ru: "dogovor-zaima",
            //         en: "loan-agreement",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //     {
            //       id: "exchange-agreement",
            //       kind: "page",
            //       label: {
            //         ua: "Договір міни майна",
            //         ru: "Договор мены имущества",
            //         en: "Exchange agreement",
            //       },
            //       slug: {
            //         ua: "dogovir-miny-maina",
            //         ru: "dogovor-meny-imushchestva",
            //         en: "exchange-agreement",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //     {
            //       id: "lifetime-maintenance",
            //       kind: "page",
            //       label: {
            //         ua: "Договір довічного утримання (догляду)",
            //         ru: "Договор пожизненного содержания (уход)",
            //         en: "Lifetime maintenance agreement",
            //       },
            //       slug: {
            //         ua: "dovichne-utrymannia",
            //         ru: "pozhiznennoe-soderzhanie",
            //         en: "lifetime-maintenance",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //     {
            //       id: "rent-realty-land",
            //       kind: "page",
            //       label: {
            //         ua: "Договір оренди (найму) будівель, земельних ділянок (якщо вимагається нотаріальне посвідчення)",
            //         ru: "Договор аренды зданий, земельных участков (если требуется нотариальное удостоверение)",
            //         en: "Lease of buildings / land (notarial)",
            //       },
            //       slug: {
            //         ua: "orenda-budivel-zemli-notarialno",
            //         ru: "arenda-zdaniy-zemli-notarialno",
            //         en: "lease-buildings-land-notarial",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //     {
            //       id: "mortgage-pledge",
            //       kind: "page",
            //       label: {
            //         ua: "Договір застави (іпотеки)",
            //         ru: "Договор залога (ипотеки)",
            //         en: "Mortgage / pledge",
            //       },
            //       slug: {
            //         ua: "ipotyka-zastava",
            //         ru: "ipoteka-zalog",
            //         en: "mortgage-pledge",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //     {
            //       id: "division-common-property",
            //       kind: "page",
            //       label: {
            //         ua: "Договір поділу або виділу з майна у спільній власності",
            //         ru: "Договор раздела/выдела из общего имущества",
            //         en: "Division or allocation from shared property",
            //       },
            //       slug: {
            //         ua: "podil-abo-vydil-spilne-maino",
            //         ru: "razdel-ili-vydel-obshchee-imushchestvo",
            //         en: "division-shared-property",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //     {
            //       id: "marriage-contract",
            //       kind: "page",
            //       label: {
            //         ua: "Шлюбний договір",
            //         ru: "Брачный договор",
            //         en: "Marriage contract",
            //       },
            //       slug: {
            //         ua: "shliubnyi-dohovir",
            //         ru: "brachnyi-dogovor",
            //         en: "marriage-contract",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //     {
            //       id: "spouses-property-division",
            //       kind: "page",
            //       label: {
            //         ua: "Договір про поділ майна подружжя",
            //         ru: "Договор о разделе имущества супругов",
            //         en: "Spouses' property division",
            //       },
            //       slug: {
            //         ua: "podil-maina-podruzhzhia",
            //         ru: "razdel-imushchestva-suprugov",
            //         en: "spouses-property-division",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //     {
            //       id: "share-allocation-spouses",
            //       kind: "page",
            //       label: {
            //         ua: "Договір про виділ частки у спільному майні подружжя",
            //         ru: "Договор о выделе доли в общем имуществе супругов",
            //         en: "Share allocation in spouses' common property",
            //       },
            //       slug: {
            //         ua: "vydil-chastky-spilne-maino-podruzhzhia",
            //         ru: "vydel-doli-obshchee-imushchestvo-suprugov",
            //         en: "share-allocation-spouses",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //     {
            //       id: "terminate-mortgage",
            //       kind: "page",
            //       label: {
            //         ua: "Договір про розірвання Договору іпотеки",
            //         ru: "Договор о расторжении договора ипотеки",
            //         en: "Termination of mortgage agreement",
            //       },
            //       slug: {
            //         ua: "rozirvannia-ipoteky",
            //         ru: "rastorzhenie-ipoteki",
            //         en: "terminate-mortgage",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //     {
            //       id: "surety-agreement",
            //       kind: "page",
            //       label: {
            //         ua: "Договір поруки",
            //         ru: "Договор поручительства",
            //         en: "Surety agreement",
            //       },
            //       slug: {
            //         ua: "dogovir-poruky",
            //         ru: "dogovor-poruchitelstva",
            //         en: "surety-agreement",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //     {
            //       id: "future-sale-object",
            //       kind: "page",
            //       label: {
            //         ua: "Договір купівлі-продажу майбутнього об’єкту продажу",
            //         ru: "Договор купли-продажи будущего объекта",
            //         en: "Sale of future object",
            //       },
            //       slug: {
            //         ua: "kupivlia-prodazh-maibutnoho-obiekta",
            //         ru: "prodazha-budushchego-obekta",
            //         en: "sale-of-future-object",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //   ],
            // },

            // // ---- Спадкові договори ----
            // {
            //   id: "inheritance-contracts",
            //   kind: "group",
            //   label: {
            //     ua: "Спадкові договори та заповіти",
            //     ru: "Наследственные договоры и завещания",
            //     en: "Inheritance agreements",
            //   },
            //   slug: { ua: "", ru: "", en: "" },
            //   children: [
            //     {
            //       id: "will-simple",
            //       kind: "page",
            //       label: {
            //         ua: "Заповіт простий",
            //         ru: "Простое завещание",
            //         en: "Simple will",
            //       },
            //       slug: {
            //         ua: "zapovit-prostyi",
            //         ru: "prostoe-zaveshchanie",
            //         en: "simple-will",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //     {
            //       id: "will-witnesses",
            //       kind: "page",
            //       label: {
            //         ua: "Заповіт при свідках / складний (з умовами)",
            //         ru: "Завещание при свидетелях / сложное (с условиями)",
            //         en: "Will with witnesses / complex (with conditions)",
            //       },
            //       slug: {
            //         ua: "zapovit-pry-svidkakh",
            //         ru: "zaveshchanie-pri-svidetelyakh",
            //         en: "will-with-witnesses",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //     {
            //       id: "spouses-joint-will",
            //       kind: "page",
            //       label: {
            //         ua: "Спільний заповіт подружжя",
            //         ru: "Совместное завещание супругов",
            //         en: "Spouses' joint will",
            //       },
            //       slug: {
            //         ua: "spilnyi-zapovit-podruzhzhia",
            //         ru: "sovmestnoe-zaveshchanie-suprugov",
            //         en: "spouses-joint-will",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //     {
            //       id: "refuse-inheritance",
            //       kind: "page",
            //       label: {
            //         ua: "Договір про відмову від прийняття спадщини",
            //         ru: "Отказ от принятия наследства (договор)",
            //         en: "Refusal to accept inheritance",
            //       },
            //       slug: {
            //         ua: "vidmova-vid-spadshchyny",
            //         ru: "otkaz-ot-nasledstva",
            //         en: "refusal-of-inheritance",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //     {
            //       id: "division-inheritance",
            //       kind: "page",
            //       label: {
            //         ua: "Договір про розподіл спадкового майна",
            //         ru: "Договор о разделе наследственного имущества",
            //         en: "Division of inherited property",
            //       },
            //       slug: {
            //         ua: "rozpodil-spadkovoho-maina",
            //         ru: "razdel-nasledstvennogo-imushchestva",
            //         en: "division-of-inherited-property",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //   ],
            // },

            // // ---- Корпоративні права ----
            // {
            //   id: "corporate-rights",
            //   kind: "group",
            //   label: {
            //     ua: "Договори щодо корпоративних прав",
            //     ru: "Договоры по корпоративным правам",
            //     en: "Corporate rights agreements",
            //   },
            //   slug: { ua: "", ru: "", en: "" },
            //   children: [
            //     {
            //       id: "sell-share-llc",
            //       kind: "page",
            //       label: {
            //         ua: "Договір купівлі-продажу частки в статутному капіталі ТОВ",
            //         ru: "Купля-продажа доли в уставном капитале ООО",
            //         en: "Sale of LLC share",
            //       },
            //       slug: {
            //         ua: "prodazh-chastky-tov",
            //         ru: "prodazha-doli-ooo",
            //         en: "sale-llc-share",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //     {
            //       id: "gift-corporate-rights",
            //       kind: "page",
            //       label: {
            //         ua: "Договір дарування корпоративних прав",
            //         ru: "Дарение корпоративных прав",
            //         en: "Gift of corporate rights",
            //       },
            //       slug: {
            //         ua: "daruvannia-korporatyvnykh-prav",
            //         ru: "dareniye-korporativnykh-prav",
            //         en: "gift-corporate-rights",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //     {
            //       id: "charter-changes",
            //       kind: "page",
            //       label: {
            //         ua: "Договір про внесення змін до установчих документів (в окремих випадках)",
            //         ru: "Договор о внесении изменений в учредительные документы (в отдельных случаях)",
            //         en: "Amendments to charter (certain cases)",
            //       },
            //       slug: {
            //         ua: "zminy-do-ustanovchykh",
            //         ru: "izmeneniya-v-uchreditelnye",
            //         en: "charter-amendments",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //   ],
            // },

            // // ---- Виконавчий напис ----
            // {
            //   id: "executive-inscription",
            //   kind: "group",
            //   label: {
            //     ua: "ВИКОНАВЧИЙ НАПИС на договорі",
            //     ru: "Исполнительная надпись на договоре",
            //     en: "Executive inscription",
            //   },
            //   slug: { ua: "", ru: "", en: "" },
            //   children: [
            //     {
            //       id: "exec-rent-realestate",
            //       kind: "page",
            //       label: {
            //         ua: "Оренда нерухомості",
            //         ru: "Аренда недвижимости",
            //         en: "Real estate rent",
            //       },
            //       slug: {
            //         ua: "vykonavchyi-napys-orenda-nerukhomosti",
            //         ru: "ispolnitelnaya-nadpis-arenda-nedvizhimosti",
            //         en: "executive-rent-real-estate",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //     {
            //       id: "exec-rent-vehicle",
            //       kind: "page",
            //       label: {
            //         ua: "Транспортного засобу оренда",
            //         ru: "Аренда транспортного средства",
            //         en: "Vehicle rent",
            //       },
            //       slug: {
            //         ua: "vykonavchyi-napys-orenda-avto",
            //         ru: "ispolnitelnaya-nadpis-arenda-avto",
            //         en: "executive-rent-vehicle",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //   ],
            // },

            // // ---- Прочие/обобщающие ----
            // {
            //   id: "contracts-other",
            //   kind: "group",
            //   label: {
            //     ua: "Інші договори / Корпоративні права",
            //     ru: "Прочие договоры / Корп. права",
            //     en: "Other contracts / Corporate rights",
            //   },
            //   slug: { ua: "", ru: "", en: "" },
            //   children: [
            //     {
            //       id: "other-contracts-generic",
            //       kind: "page",
            //       label: {
            //         ua: "Інші Договори",
            //         ru: "Прочие договоры",
            //         en: "Other contracts",
            //       },
            //       slug: {
            //         ua: "inshi-dogovory",
            //         ru: "prochie-dogovory",
            //         en: "other-contracts",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
            //     {
            //       id: "corporate-rights-generic",
            //       kind: "page",
            //       label: {
            //         ua: "Корпоративні права (загальне)",
            //         ru: "Корпоративные права (общее)",
            //         en: "Corporate rights (generic)",
            //       },
            //       slug: {
            //         ua: "korporatyvni-prava",
            //         ru: "korporativnye-prava",
            //         en: "corporate-rights",
            //       },
            //       showInMenu: true,
            //       component: null,
            //     },
          ],
        },

        // ===================== GROUP: ДОВІРЕНІСТЬ =====================
        {
          id: "power-of-attorney",
          kind: "group",
          label: {
            ua: "Довіреності",
            ru: "Доверенности",
            en: "Power of attorney",
          },
          slug: {
            ua: "doverennosti",
            ru: "doverennosti",
            en: "power-of-attorney",
          },
          children: [
            {
              id: "poa-property",
              kind: "page",
              label: {
                ua: "Довіреності на майно",
                ru: "Доверенности на имущество",
                en: "Powers of attorney for property",
              },
              slug: {
                ua: "doverenosti-na-mayno",
                ru: "doverennosti-na-imushchestvo",
                en: "poa-property",
              },
              showInMenu: true,
              component: null,
            },
            {
              id: "poa-representation",
              kind: "page",
              label: {
                ua: "Довіреності на представництво",
                ru: "Доверенности на представительство",
                en: "Powers of attorney for representation",
              },
              slug: {
                ua: "doverenosti-na-predstavnytstvo",
                ru: "doverennosti-na-predstavitelstvo",
                en: "poa-representation",
              },
              showInMenu: true,
              component: null,
            },
            {
              id: "poa-special",
              kind: "page",
              label: {
                ua: "Особливі види довіреностей",
                ru: "Особые виды доверенностей",
                en: "Special types of powers of attorney",
              },
              slug: {
                ua: "osoblyvi-vydy-doverenostei",
                ru: "osobye-vidy-doverennostey",
                en: "poa-special",
              },
              showInMenu: true,
              component: null,
            },
          ],
          //     {
          //       id: "poa-movable-funds",
          //       kind: "page",
          //       label: {
          //         ua: "Розпорядження рухомим майном (грошовими коштами)",
          //         ru: "Распоряжение движимым имуществом (денежными средствами)",
          //         en: "Disposition of movable property (funds)",
          //       },
          //       slug: {
          //         ua: "rozporiadzhennia-rukhomym-mainom-koshty",
          //         ru: "rasporyazhenie-dvizhimym-imushchestvom-sredstva",
          //         en: "movable-property-funds",
          //       },
          //       showInMenu: true,
          //       component: null,
          //     },
          //     {
          //       id: "poa-combined",
          //       kind: "page",
          //       label: {
          //         ua: "Об’єднана довіреність (різні повноваження)",
          //         ru: "Объединённая доверенность (разные полномочия)",
          //         en: "Combined power of attorney",
          //       },
          //       slug: {
          //         ua: "obednana-dovirennist",
          //         ru: "obedinyonnaya-doverennost",
          //         en: "combined-poa",
          //       },
          //       showInMenu: true,
          //       component: null,
          //     },
          //     {
          //       id: "poa-bilingual",
          //       kind: "page",
          //       label: {
          //         ua: "Довіреність на двох мовах",
          //         ru: "Доверенность на двух языках",
          //         en: "Bilingual power of attorney",
          //       },
          //       slug: {
          //         ua: "dovirennist-dvoma-movamy",
          //         ru: "doverennost-na-dvukh-yazykakh",
          //         en: "bilingual-poa",
          //       },
          //       showInMenu: true,
          //       component: null,
          //     },
          //     {
          //       id: "poa-revocation",
          //       kind: "page",
          //       label: {
          //         ua: "Скасування довіреності",
          //         ru: "Отмена доверенности",
          //         en: "Revocation of power of attorney",
          //       },
          //       slug: {
          //         ua: "skasuvannia-dovirennosti",
          //         ru: "otmena-doverennosti",
          //         en: "poa-revocation",
          //       },
          //       showInMenu: true,
          //       component: null,
          //     },
          //   ],
        },

        // ===================== GROUP: ПІДПИС, ЗАЯВА =====================
        {
          id: "signatures-statements",
          kind: "group",
          label: {
            ua: "Підпис, заява (на бланках)",
            ru: "Подпись, заявление (на бланках)",
            en: "Signature / Statement (forms)",
          },
          slug: {
            ua: "pidpis-zayava",
            ru: "podpis-zayavlenie",
            en: "signature-statement",
          },
          children: [
            {
              id: "signatures-consents",
              kind: "page",
              label: {
                ua: "Підписи та згоди",
                ru: "Подписи и согласия",
                en: "Signatures and consents",
              },
              slug: {
                ua: "pidpysy-ta-zhody",
                ru: "podpisi-i-soglasiya",
                en: "signatures-consents",
              },
              showInMenu: true,
              component: null,
            },
            {
              id: "applications",
              kind: "page",
              label: {
                ua: "Заяви",
                ru: "Заявления",
                en: "Applications",
              },
              slug: {
                ua: "zayavy",
                ru: "zayavleniya",
                en: "applications",
              },
              showInMenu: true,
              component: null,
            },
            // {
            //   id: "consent-spouse-child-travel",
            //   kind: "page",
            //   label: {
            //     ua: "Згода подружжя, на виїзд дитини та інші.",
            //     ru: "Согласие супруга(и), на выезд ребёнка и др.",
            //     en: "Spousal consent, child travel etc.",
            //   },
            //   slug: {
            //     ua: "zgoda-podruzhzhia-vyiizd-dytyny",
            //     ru: "soglasie-supruga-vyezd-rebenka",
            //     en: "consent-child-travel",
            //   },
            //   showInMenu: true,
            //   component: null,
            // },
            // {
            //   id: "signature-bank-cards",
            //   kind: "page",
            //   label: {
            //     ua: "На банківських картках",
            //     ru: "На банковских картах",
            //     en: "On bank cards",
            //   },
            //   slug: {
            //     ua: "pidpys-na-bankivskykh-kartkakh",
            //     ru: "podpis-na-bankovskikh-kartakh",
            //     en: "signature-bank-cards",
            //   },
            //   showInMenu: true,
            //   component: null,
            // },
            // {
            //   id: "signature-charter-protocol",
            //   kind: "page",
            //   label: {
            //     ua: "На статуті, протоколі, рішенні (1 підпис)",
            //     ru: "На уставе, протоколе, решении (1 подпись)",
            //     en: "On charter/protocol/decision (1 signature)",
            //   },
            //   slug: {
            //     ua: "pidpys-na-statuti-protokoli",
            //     ru: "podpis-na-ustave-protokole",
            //     en: "signature-charter-protocol",
            //   },
            //   showInMenu: true,
            //   component: null,
            // },
            // {
            //   id: "exit-participant-llc",
            //   kind: "page",
            //   label: {
            //     ua: "Вихід учасника із Товариства заява",
            //     ru: "Заявление о выходе участника из Общества",
            //     en: "Exit of participant from LLC (statement)",
            //   },
            //   slug: {
            //     ua: "vykhid-uchasnyka-zt",
            //     ru: "vykhod-uchastnika-iz-obshchestva",
            //     en: "exit-participant-llc",
            //   },
            //   showInMenu: true,
            //   component: null,
            // },
            // {
            //   id: "statements-bilingual",
            //   kind: "page",
            //   label: {
            //     ua: "Заяви на двох мовах",
            //     ru: "Заявления на двух языках",
            //     en: "Statements in two languages",
            //   },
            //   slug: {
            //     ua: "zaiavy-dvoma-movamy",
            //     ru: "zayavleniya-na-dvukh-yazykakh",
            //     en: "statements-bilingual",
            //   },
            //   showInMenu: true,
            //   component: null,
            // },
          ],
        },

        // ===================== GROUP: КОНСУЛЬТАЦІЯ / КОПІЯ / ДУБЛІКАТ =====================
        {
          id: "consult-copy-duplicate",
          kind: "group",
          label: {
            ua: "Консультація. Копія документів. Дублікати",
            ru: "Консультация. Копия документов. Дубликаты",
            en: "Consultation. Copies. Duplicates",
          },
          slug: {
            ua: "konsultatsiya-kopiya-dublikaty",
            ru: "konsultatsiya-kopiya-dublikaty",
            en: "consultation-copies-duplicates",
          },
          children: [
            {
              id: "consultations",
              kind: "page",
              label: {
                ua: "Консультації",
                ru: "Консультации",
                en: "Consultations",
              },
              slug: {
                ua: "konsultatsii",
                ru: "konsultatsii",
                en: "consultations",
              },
              showInMenu: true,
              component: null,
            },
            {
              id: "document-copies",
              kind: "page",
              label: {
                ua: "Копії документів",
                ru: "Копии документов",
                en: "Document copies",
              },
              slug: {
                ua: "kopii-dokumentiv",
                ru: "kopii-dokumentov",
                en: "document-copies",
              },
              showInMenu: true,
              component: null,
            },
            // {
            //   id: "notarial-consultation",
            //   kind: "page",
            //   label: {
            //     ua: "Нотаріальні консультації",
            //     ru: "Нотариальные консультации",
            //     en: "Notarial consultations",
            //   },
            //   slug: {
            //     ua: "notarialni-konsultatsii",
            //     ru: "notarialnye-konsultatsii",
            //     en: "notarial-consultations",
            //   },
            //   showInMenu: true,
            //   component: null,
            // },
            // {
            //   id: "copy-up-to-4pp",
            //   kind: "page",
            //   label: {
            //     ua: "Копія окремих документ до 4-х стор.",
            //     ru: "Копия отдельных документов до 4-х стр.",
            //     en: "Copy of documents up to 4 pages",
            //   },
            //   slug: {
            //     ua: "kopia-do-4-storinok",
            //     ru: "kopiya-do-4-stranits",
            //     en: "copy-up-to-4pp",
            //   },
            //   showInMenu: true,
            //   component: null,
            // },
            // {
            //   id: "copy-multipage-per-page",
            //   kind: "page",
            //   label: {
            //     ua: "Копія багатосторінкового документа (1 сторінка)",
            //     ru: "Копия многостраничного документа (1 страница)",
            //     en: "Copy of multipage document (per page)",
            //   },
            //   slug: {
            //     ua: "kopia-bahatostorin",
            //     ru: "kopiya-mnogostran",
            //     en: "copy-multipage-per-page",
            //   },
            //   showInMenu: true,
            //   component: null,
            // },
            // {
            //   id: "duplicate-docs",
            //   kind: "page",
            //   label: {
            //     ua: "Дублікат документів",
            //     ru: "Дубликат документов",
            //     en: "Duplicate documents",
            //   },
            //   slug: {
            //     ua: "dublikat-dokumentiv",
            //     ru: "dublikat-dokumentov",
            //     en: "duplicate-documents",
            //   },
            //   showInMenu: true,
            //   component: null,
            // },
            // {
            //   id: "duplicates-certificates-consult",
            //   kind: "page",
            //   label: {
            //     ua: "Консультації щодо отримання дублікатів Свідоцтв",
            //     ru: "Консультации по получению дубликатов свидетельств",
            //     en: "Consulting on getting certificate duplicates",
            //   },
            //   slug: {
            //     ua: "konsultatsii-dublekaty-svidoctv",
            //     ru: "konsultacii-dublikaty-svidetelstv",
            //     en: "certificate-duplicates-consulting",
            //   },
            //   showInMenu: true,
            //   component: null,
            // },
          ],
        },

        // ===================== GROUP: АПОСТИЛЬ ТА АФІДЕВІТ =====================
        {
          id: "apostille-affidavit",
          kind: "group",
          label: {
            ua: "Апостиль та афідевіт",
            ru: "Апостиль и аффидевит",
            en: "Apostille & Affidavit",
          },
          slug: {
            ua: "apostil-afidevit",
            ru: "apostil-affidevit",
            en: "apostille-affidavit",
          },
          children: [
            {
              id: "apostille-docs",
              kind: "page",
              label: {
                ua: "Апостиль",
                ru: "Апостиль",
                en: "Apostille",
              },
              slug: {
                ua: "apostyl",
                ru: "apostil",
                en: "apostille",
              },
              showInMenu: true,
              component: null,
            },
            {
              id: "affidavit",
              kind: "page",
              label: {
                ua: "Афідевіт",
                ru: "Аффидевит",
                en: "Affidavit",
              },
              slug: {
                ua: "afidevit",
                ru: "affidevit",
                en: "affidavit",
              },
              showInMenu: true,
              component: null,
            },
            // {
            //   id: "affidavit-translator",
            //   kind: "page",
            //   label: {
            //     ua: "Афідевіт за підписом перекладача",
            //     ru: "Аффидевит по подписи переводчика",
            //     en: "Affidavit by translator's signature",
            //   },
            //   slug: {
            //     ua: "afidevit-perekladacha",
            //     ru: "affidevit-perevodchika",
            //     en: "affidavit-translator",
            //   },
            //   showInMenu: true,
            //   component: null,
            // },
          ],
        },
      ],
    },

    // ===================== NOTARIAL TRANSLATION (separate section as in routes) =====================
    {
      id: "notary-translate",
      kind: "section",
      label: {
        ua: "Нотаріальний переклад",
        ru: "Нотариальный перевод",
        en: "Notary translate",
      },
      slug: {
        ua: "notarialni-pereklad",
        ru: "notarialni-pereklad",
        en: "notary-translate",
      },
      showInMenu: true,
      component: null,
      children: [
        {
          id: "translator-signature",
          kind: "page",
          label: {
            ua: "Засвідчення справжності підпису перекладача",
            ru: "Заверение подлинности подписи переводчика",
            en: "Translator’s signature certification",
          },
          slug: {
            ua: "zasvidchennia-spravzhnosti-pidpysu-perekladacha",
            ru: "zaverennie-podlinnosti-podpisi-perevodchika",
            en: "translator-signature",
          },
          showInMenu: true,
          component: null,
        },
        {
          id: "notarial-translation-one-doc",
          kind: "page",
          label: {
            ua: "Нотаріальний переклад одного документу",
            ru: "Нотариальный перевод одного документа",
            en: "Notarial translation of one document",
          },
          slug: {
            ua: "notarialnyi-pereklad-odnoho-dokumentu",
            ru: "notarialnyi-perevod-odnogo-dokumenta",
            en: "notarial-translation-one",
          },
          showInMenu: true,
          component: null,
        },
        {
          id: "two-in-one-copy-translation",
          kind: "page",
          label: {
            ua: "2в1 (Нотаріальна копія + переклад)",
            ru: "2в1 (Нотариальная копия + перевод)",
            en: "2-in-1 (Notarial copy + translation)",
          },
          slug: {
            ua: "2-v-1-notarialna-kopiia-pereklad",
            ru: "2-v-1-notarialnaya-kopiya-perevod",
            en: "2-in-1-copy-translation",
          },
          showInMenu: true,
          component: null,
        },
      ],
    },

    // ===================== MILITARY HELP =====================
    {
      id: "military-help",
      kind: "section",
      label: {
        ua: "Допомога військовим",
        ru: "Помощь военным",
        en: "Military help",
      },
      slug: {
        ua: "notarialni-dopomoga-viyskovim",
        ru: "notarialni-pomosch-voennym",
        en: "notary-military-help",
      },
      showInMenu: true,
      component: null,
      children: [
        {
          id: "military-help-main",
          kind: "page",
          label: {
            ua: "Кваліфікована юрдопомога військовослужбовцям (офлайн/онлайн)",
            ru: "Квалифицированная помощь военнослужащим (оффлайн/онлайн)",
            en: "Qualified legal help for military (offline/online)",
          },
          slug: {
            ua: "kvalifikovana-yurydychna-dopomoha-viiskovosluzhbovtsiam-oflain-ta-onlain",
            ru: "kvalificirovannaya-pomosh-voennosluzhashchim-off-on",
            en: "qualified-legal-help-military",
          },
          showInMenu: true,
          component: null,
        },
      ],
    },

    // ===================== OTHER SERVICES (separate top section from routeNames) =====================
    {
      id: "other-services",
      kind: "section",
      label: { ua: "Інші послуги", ru: "Другие услуги", en: "Other services" },
      slug: {
        ua: "notarialni-inshi",
        ru: "notarialni-inshi",
        en: "notary-other",
      },
      showInMenu: true,
      component: null,
      children: [
        {
          id: "legal-consultations-with-opinion",
          kind: "page",
          label: {
            ua: "Юридичні консультації з наданням висновків",
            ru: "Юридические консультации с предоставлением заключений",
            en: "Legal consultations with opinions",
          },
          slug: {
            ua: "yurydychni-konsultatsii-z-nadanniam-vysnovkiv",
            ru: "yuridicheskie-konsultatsii-s-zaklyucheniyami",
            en: "legal-consultations-opinions",
          },
          showInMenu: true,
          component: null,
        },
        {
          id: "extracts-real-rights-register",
          kind: "page",
          label: {
            ua: "Отримання витягів з Держреєстру речових прав на нерухоме майно",
            ru: "Получение выписок из Госреестра вещных прав на недвижимость",
            en: "Extracts from State Register of real rights",
          },
          slug: {
            ua: "otrymannia-vytiahiv-z-derzhavnoho-reiestru-rechovykh-prav-na-nerukhome-maino",
            ru: "poluchenie-vypisok-iz-reestra-veshch-prav",
            en: "extracts-real-rights-register",
          },
          showInMenu: true,
          component: null,
        },
        {
          id: "edr-registration",
          kind: "page",
          label: {
            ua: "Держреєстрація в ЄДР (ЮО/ФОП/ГО)",
            ru: "Госрегистрация в ЕГР (юрлица/ФЛП/ОГ)",
            en: "State registration in EDR",
          },
          slug: {
            ua: "derzhavna-reiestratsiia-v-yedynomu-derzhavnomu-reiestri-yurydychnykh-osib-fizychnykh-osib-pidpryiemtsiv-ta-hromadskykh-formuvan",
            ru: "gosregistraciya-v-egr-yurlitsa-flp-obedinenia",
            en: "edr-state-registration",
          },
          showInMenu: true,
          component: null,
        },
        {
          id: "register-ownership-real-estate",
          kind: "page",
          label: {
            ua: "Держреєстрація права власності на нерухоме майно",
            ru: "Госрегистрация права собственности на недвижимость",
            en: "Registration of real estate ownership",
          },
          slug: {
            ua: "derzhavna-reiestratsiia-prava-vlasnosti-na-nerukhome-maino",
            ru: "gosregistraciya-prava-sobstvennosti-nedvizhimosti",
            en: "register-ownership-real-estate",
          },
          showInMenu: true,
          component: null,
        },
        {
          id: "edr-error-correction",
          kind: "page",
          label: {
            ua: "Виправлення помилки в ЄДР (з вини заявника)",
            ru: "Исправление ошибки в ЕГР (по вине заявителя)",
            en: "Correction of error in EDR (applicant fault)",
          },
          slug: {
            ua: "vypravlennia-pomylky-u-vidomostiakh-yedynoho-derzhavnoho-reiestru-yurydychnykh-osib-fizychnykh-osib-pidpryiemtsiv-ta-hromadskykh-formuvan-dopushchenoi-z-vyny-zaiavnyka",
            ru: "ispravlenie-oshibki-v-egr-po-vine-zayavitelya",
            en: "edr-error-correction",
          },
          showInMenu: true,
          component: null,
        },
        {
          id: "rights-register-for-developers",
          kind: "page",
          label: {
            ua: "Реєстрація нерухомості в Реєстрі прав (для забудовників/ФО/ЮО)",
            ru: "Регистрация недвижимости в Реестре прав (застройщики/физ/юр)",
            en: "Register real estate rights (developers/natural/legal)",
          },
          slug: {
            ua: "reiestratsiia-nerukhomoho-maina-v-derzhavnomu-reiestri-rechovykh-prav-na-nerukhome-maino-dlia-zabudovnykiv-dlia-fizychnykh-ta-yurydychnykh-osib",
            ru: "registraciya-nedvizhimosti-v-reestre-prav-dlya-zastroyschikov-fiz-yur",
            en: "rights-register-for-developers",
          },
          showInMenu: true,
          component: null,
        },
      ],
    },

    // ===================== OFFER / POLICY / CONTACTS / TRADE MARK =====================
    {
      id: "offer",
      kind: "page",
      label: {
        ua: "Договір оферти",
        ru: "Договор оферты",
        en: "Offer contract",
      },
      slug: {
        ua: "notarialni-offer",
        ru: "notarialni-offer",
        en: "notary-offer",
      },
      showInMenu: false,
      component: null,
    },
    {
      id: "policy",
      kind: "page",
      label: {
        ua: "Політика конфіденційності",
        ru: "Политика конфиденциальности",
        en: "Privacy Policy",
      },
      slug: {
        ua: "notarialni-policy",
        ru: "notarialni-policy",
        en: "notary-policy",
      },
      showInMenu: false,
      component: null,
    },
    {
      id: "contacts",
      kind: "page",
      label: { ua: "Контакти", ru: "Контакты", en: "Contacts" },
      slug: {
        ua: "notarialni-contacty",
        ru: "notarialni-contacty",
        en: "notary-contacts",
      },
      showInMenu: true,
      component: null,
    },
    {
      id: "trademark",
      kind: "page",
      label: {
        ua: "Торгівельна марка",
        ru: "Торговая марка",
        en: "Trade mark",
      },
      slug: {
        ua: "notarialni-torgivelna-marka",
        ru: "notarialni-torgova-marka",
        en: "notary-trade-mark",
      },
      showInMenu: false,
      component: null,
    },
    {
      id: "blog",
      kind: "page",
      label: {
        ua: "Блог",
        ru: "Блог",
        en: "Blog",
      },
      slug: {
        ua: "notarialni-blog",
        ru: "notarialni-blog",
        en: "notary-blog",
      },
      showInMenu: false,
      component: null,
    },
    {
      id: "not-found-page",
      kind: "page",
      label: {
        ua: "stotinku-ne-znaydeno",
        ru: "stranicu-ne-naydeno",
        en: "page-not-found",
      },
      showInMenu: false,
      component: null,
    },
  ],
};
