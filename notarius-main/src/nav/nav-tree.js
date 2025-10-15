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
      showMegaPanel: true,
      children: [],
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
      showMegaPanel: true,
      component: null,
      children: [],
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
      showMegaPanel: true,
      component: null,
      children: [],
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
      showMegaPanel: true,
      component: null,
      children: [],
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
        ua: "Торговельна марка",
        ru: "Торговая марка",
        en: "Trademark",
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
      showInMenu: true,
      component: null,
      children: [], // Статьи будут добавлены из backend
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
