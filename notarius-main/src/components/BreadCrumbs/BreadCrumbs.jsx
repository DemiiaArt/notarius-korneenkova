import { Link, useLocation } from "react-router-dom";
import "./BreadCrumbs.scss";
import { useIsPC } from "@hooks/isPC";

const routeNames = {
  ua: {
    "": { name: "Головна" },
    "notarialni-pro-mene": { name: "Про мене" },
    "notarialni-poslugy": {
      name: "Нотаріальні послуги",
      children: {
        "apostil-na-dokumenty": { name: "Апостиль на документи" },
        "pereklad-dokumentiv": { name: "Переклад документів" },
      },
    },
    "notarialni-pereklad": { name: "Нотаріальний переклад" },
    "notarialni-dopomoga-viyskovim": { name: "Допомога військовим" },
    "notarialni-inshi": { name: "Інші послуги" },
    "notarialni-offer": { name: "Договір оферти" },
    "notarialni-policy": { name: "Політика конфіденційності" },
    "notarialni-contacty": { name: "Контакти" },
    "notarialni-torgivelna-marka": { name: "Торгівельна марка" },
  },
  ru: {
    "": { name: "Главная" },
    "notarialni-pro-mene": { name: "Про меня" },
    "notarialni-poslugy": {
      name: "Нотариальные услуги",
      children: {
        "apostil-na-dokumenty": { name: "Апостиль на документы" },
        "pereklad-dokumentiv": { name: "Перевод документов" },
      },
    },
    "notarialni-pereklad": { name: "Нотариальный перевод" },
    "notarialni-pomosch-voennym": { name: "Помощь военным" },
    "notarialni-inshi": { name: "Другие услуги" },
    "notarialni-offer": { name: "Договор оферты" },
    "notarialni-policy": { name: "Политика конфиденциальности" },
    "notarialni-contacty": { name: "Контакты" },
    "notarialni-torgova-marka": { name: "Торговая марка" },
  },
  en: {
    "": { name: "Main" },
    "notary-about": { name: "About me" },
    "notary-services": {
      name: "Services",
      children: {
        apostille: { name: "Document apostille" },
        translation: { name: "Document translation" },
      },
    },
    "notary-translate": { name: "Notary translate" },
    "notary-military-help": { name: "Military-help" },
    "notary-other": { name: "Other services" },
    "notary-offer": { name: "Offer contract" },
    "notary-policy": { name: "Privacy Policy" },
    "notary-contacts": { name: "Contacts" },
    "notary-trade-mark": { name: "Trade mark" },
  },
};

const brightRoutes = {
  ua: new Set([
    "notarialni-contacty",
    "notarialni-offer",
    "notarialni-policy",
    "notarialni-torgivelna-marka",
  ]),
  ru: new Set([
    "notarialni-contacty",
    "notarialni-offer",
    "notarialni-policy",
    "notarialni-torgova-marka",
  ]),
  en: new Set([
    "notary-contacts",
    "notary-offer",
    "notary-policy",
    "notary-trade-mark",
  ]),
};

const Breadcrumbs = () => {
  const isPC = useIsPC();
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // язык и обрезка префикса
  let lang = "ua";
  let breadcrumbs = [...pathSegments];
  if (breadcrumbs[0] === "ru" || breadcrumbs[0] === "en") {
    lang = breadcrumbs[0];
    breadcrumbs = breadcrumbs.slice(1);
  }

  let currentDict = routeNames[lang];

  const buildPath = (index) => {
    const subPath = breadcrumbs.slice(0, index + 1).join("/");
    return lang === "ua" ? `/${subPath}` : `/${lang}/${subPath}`;
  };

  const isBright =
    breadcrumbs.length === 1 && brightRoutes[lang]?.has(breadcrumbs[0]);

  // 1) Цвет “домой”
  const homeColor = isBright ? "c13" : "c15";
  const baseLinkTyposafe = `${isPC ? "fs-p--14px" : "fs-p--12px"} lh-100`;

  return (
    <nav className="breadcrumbs">
      {/* Домой */}
      <Link
        className={`breadcrumbs-link ${baseLinkTyposafe} ${homeColor}`}
        to={lang === "ua" ? "/" : `/${lang}`}
      >
        {typeof routeNames[lang][""] === "string"
          ? routeNames[lang][""]
          : routeNames[lang][""].name}
      </Link>

      {breadcrumbs.map((segment, i) => {
        const to = buildPath(i);
        const isLast = i === breadcrumbs.length - 1;

        // 2) Для второй ссылки (i === 0) при глубине ≥ 2 — тот же цвет, что и у “домой”
        const nonLastColor =
          i === 0 && breadcrumbs.length >= 2 ? homeColor : "c13";

        let label = segment;
        if (currentDict && currentDict[segment]) {
          const entry = currentDict[segment];
          if (typeof entry === "string") {
            label = entry;
          } else {
            label = entry.name || segment;
            currentDict = entry.children || {};
          }
        }

        return (
          <span key={to}>
            <span className={`${isBright ? "c13" : "c15"}`}>/</span>
            {isLast ? (
              <span
                className={`${isPC ? "fs-p--14px fw-semi-bold" : "fs-p--12px fw-medium"} lh-100 ${isBright ? "c3" : "c1"}`}
              >
                {label}
              </span>
            ) : (
              <Link
                className={`breadcrumbs-link ${baseLinkTyposafe} ${nonLastColor}`}
                to={to}
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
