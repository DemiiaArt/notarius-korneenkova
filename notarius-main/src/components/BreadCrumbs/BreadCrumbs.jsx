// import { Link, useLocation } from "react-router-dom";
// import "./BreadCrumbs.scss";
// import { useIsPC } from "@hooks/isPC";

// const routeNames = {
//   ua: {
//     "": { name: "Головна" },
//     "notarialni-pro-mene": { name: "Про мене" },
//     "notarialni-poslugy": {
//       name: "Нотаріальні послуги",
//       children: {
//         "apostil-na-dokumenty": { name: "Апостиль на документи" },
//         "pereklad-dokumentiv": { name: "Переклад документів" },
//       },
//     },
//     "notarialni-pereklad": {
//       name: "Нотаріальний переклад",
//       children: {
//         "zasvidchennia-spravzhnosti-pidpysu-perekladacha": {
//           name: "Засвідчення справжності підпису перекладача",
//         },
//         "notarialnyi-pereklad-odnoho-dokumentu": {
//           name: "Нотаріальний переклад одного документу",
//         },
//         "2-v-1-notarialna-kopiia-pereklad": {
//           name: "2в1 (Нотаріальна копія + переклад)",
//         },
//       },
//     },
//     "notarialni-dopomoga-viyskovim": {
//       name: "Допомога військовим",
//       children: {
//         "kvalifikovana-yurydychna-dopomoha-viiskovosluzhbovtsiam-oflain-ta-onlain":
//           {
//             name: "Кваліфікована юридична допомога військовослужбовцям офлайн та онлайн.",
//           },
//       },
//     },
//     "notarialni-inshi": {
//       name: "Інші послуги",
//       children: {
//         "yurydychni-konsultatsii-z-nadanniam-vysnovkiv": {
//           name: "Юридичні консультації з наданням висновків",
//         },
//         "otrymannia-vytiahiv-z-derzhavnoho-reiestru-rechovykh-prav-na-nerukhome-maino":
//           {
//             name: "Отримання витягів з Державного реєстру речових прав на нерухоме майно",
//           },
//         "derzhavna-reiestratsiia-v-yedynomu-derzhavnomu-reiestri-yurydychnykh-osib-fizychnykh-osib-pidpryiemtsiv-ta-hromadskykh-formuvan":
//           {
//             name: "Державна реєстрація в Єдиному державному реєстрі юридичних осіб, фізичних осіб-підприємців та громадських формувань",
//           },
//         "derzhavna-reiestratsiia-prava-vlasnosti-na-nerukhome-maino": {
//           name: "Державна реєстрація права власності на нерухоме майно",
//         },
//         "vypravlennia-pomylky-u-vidomostiakh-yedynoho-derzhavnoho-reiestru-yurydychnykh-osib-fizychnykh-osib-pidpryiemtsiv-ta-hromadskykh-formuvan-dopushchenoi-z-vyny-zaiavnyka":
//           {
//             name: "Виправлення помилки у відомостях Єдиного державного реєстру юридичних осіб, фізичних осіб-підприємців та громадських формувань, допущеної з вини заявника",
//           },
//         "reiestratsiia-nerukhomoho-maina-v-derzhavnomu-reiestri-rechovykh-prav-na-nerukhome-maino-dlia-zabudovnykiv-dlia-fizychnykh-ta-yurydychnykh-osib":
//           {
//             name: "Реєстрація нерухомого майна  в Державному реєстрі речових прав на нерухоме майно для забудовників, для фізичних та юридичних осіб.",
//           },
//       },
//     },
//     "notarialni-offer": { name: "Договір оферти" },
//     "notarialni-policy": { name: "Політика конфіденційності" },
//     "notarialni-contacty": { name: "Контакти" },
//     "notarialni-torgivelna-marka": { name: "Торгівельна марка" },
//   },
//   ru: {
//     "": { name: "Главная" },
//     "notarialni-pro-mene": { name: "Про меня" },
//     "notarialni-poslugy": {
//       name: "Нотариальные услуги",
//       children: {
//         "apostil-na-dokumenty": { name: "Апостиль на документы" },
//         "pereklad-dokumentiv": { name: "Перевод документов" },
//       },
//     },
//     "notarialni-pereklad": { name: "Нотариальный перевод" },
//     "notarialni-pomosch-voennym": { name: "Помощь военным" },
//     "notarialni-inshi": { name: "Другие услуги" },
//     "notarialni-offer": { name: "Договор оферты" },
//     "notarialni-policy": { name: "Политика конфиденциальности" },
//     "notarialni-contacty": { name: "Контакты" },
//     "notarialni-torgova-marka": { name: "Торговая марка" },
//   },
//   en: {
//     "": { name: "Main" },
//     "notary-about": { name: "About me" },
//     "notary-services": {
//       name: "Services",
//       children: {
//         apostille: { name: "Document apostille" },
//         translation: { name: "Document translation" },
//       },
//     },
//     "notary-translate": { name: "Notary translate" },
//     "notary-military-help": { name: "Military-help" },
//     "notary-other": { name: "Other services" },
//     "notary-offer": { name: "Offer contract" },
//     "notary-policy": { name: "Privacy Policy" },
//     "notary-contacts": { name: "Contacts" },
//     "notary-trade-mark": { name: "Trade mark" },
//   },
// };

// const brightRoutes = {
//   ua: new Set([
//     "notarialni-contacty",
//     "notarialni-offer",
//     "notarialni-policy",
//     "notarialni-torgivelna-marka",
//   ]),
//   ru: new Set([
//     "notarialni-contacty",
//     "notarialni-offer",
//     "notarialni-policy",
//     "notarialni-torgova-marka",
//   ]),
//   en: new Set([
//     "notary-contacts",
//     "notary-offer",
//     "notary-policy",
//     "notary-trade-mark",
//   ]),
// };

// const Breadcrumbs = () => {
//   const isPC = useIsPC();
//   const location = useLocation();
//   const pathSegments = location.pathname.split("/").filter(Boolean);

//   // язык и обрезка префикса
//   let lang = "ua";
//   let breadcrumbs = [...pathSegments];
//   if (breadcrumbs[0] === "ru" || breadcrumbs[0] === "en") {
//     lang = breadcrumbs[0];
//     breadcrumbs = breadcrumbs.slice(1);
//   }

//   let currentDict = routeNames[lang];

//   const buildPath = (index) => {
//     const subPath = breadcrumbs.slice(0, index + 1).join("/");
//     return lang === "ua" ? `/${subPath}` : `/${lang}/${subPath}`;
//   };

//   const isBright =
//     breadcrumbs.length === 1 && brightRoutes[lang]?.has(breadcrumbs[0]);

//   // 1) Цвет “домой”
//   const homeColor = isBright ? "c13" : "c15";
//   const baseLinkTyposafe = `${isPC ? "fs-p--14px" : "fs-p--12px"} lh-100`;

//   return (
//     <nav className="breadcrumbs">
//       {/* Домой */}
//       <Link
//         className={`breadcrumbs-link ${baseLinkTyposafe} ${homeColor}`}
//         to={lang === "ua" ? "/" : `/${lang}`}
//       >
//         {typeof routeNames[lang][""] === "string"
//           ? routeNames[lang][""]
//           : routeNames[lang][""].name}
//       </Link>

//       {breadcrumbs.map((segment, i) => {
//         const to = buildPath(i);
//         const isLast = i === breadcrumbs.length - 1;

//         // 2) Для второй ссылки (i === 0) при глубине ≥ 2 — тот же цвет, что и у “домой”
//         const nonLastColor =
//           i === 0 && breadcrumbs.length >= 2 ? homeColor : "c13";

//         let label = segment;
//         if (currentDict && currentDict[segment]) {
//           const entry = currentDict[segment];
//           if (typeof entry === "string") {
//             label = entry;
//           } else {
//             label = entry.name || segment;
//             currentDict = entry.children || {};
//           }
//         }

//         return (
//           <span key={to}>
//             <span className={`${isBright ? "c13" : "c15"}`}>/</span>
//             {isLast ? (
//               <span
//                 className={`${isPC ? "fs-p--14px fw-semi-bold" : "fs-p--12px fw-medium"} lh-100 ${isBright ? "c3" : "c1"}`}
//               >
//                 {label}
//               </span>
//             ) : (
//               <Link
//                 className={`breadcrumbs-link ${baseLinkTyposafe} ${nonLastColor}`}
//                 to={to}
//               >
//                 {label}
//               </Link>
//             )}
//           </span>
//         );
//       })}
//     </nav>
//   );
// };

// export default Breadcrumbs;

import { Link, useLocation } from "react-router-dom";
import "./BreadCrumbs.scss";
import { useIsPC } from "@hooks/isPC";

// ⬇️ импортируй из своих файлов
import { NAV_TREE } from "../../nav/nav-tree"; // <-- поправь путь
import { INDICES } from "../../nav/indices"; // <-- поправь путь

// Маршруты, которые на ярких страницах подсвечиваем иначе (оставил твоё)
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

// Небольшой помощник, чтобы достать узел по id из NAV_TREE
function findNodeById(root, targetId) {
  let found = null;
  (function dfs(node) {
    if (found) return;
    if (node.id === targetId) {
      found = node;
      return;
    }
    node.children?.forEach(dfs);
  })(root);
  return found;
}

const Breadcrumbs = () => {
  const isPC = useIsPC();
  const location = useLocation();

  // Язык и сегменты без префикса языка
  const rawSegments = location.pathname.split("/").filter(Boolean);
  let lang = "ua";
  let breadcrumbs = [...rawSegments];
  if (breadcrumbs[0] === "ru" || breadcrumbs[0] === "en") {
    lang = breadcrumbs[0];
    breadcrumbs = breadcrumbs.slice(1);
  }

  // Подсветка для "ярких" маршрутов (как у тебя было)
  const isBright =
    breadcrumbs.length === 1 && brightRoutes[lang]?.has(breadcrumbs[0]);

  // Базовые стили (оставил твои)
  const homeColor = isBright ? "c13" : "c15";
  const baseLinkTyposafe = `${isPC ? "fs-p--14px" : "fs-p--12px"} lh-100`;

  // Метки для "домой" берём из NAV_TREE (узел 'home'), иначе дефолт
  const homeNode = findNodeById(NAV_TREE, "home");
  const HOME_LABEL =
    (homeNode?.label && homeNode.label[lang]) ||
    (lang === "ru" ? "Главная" : lang === "en" ? "Main" : "Головна");

  const homeTo = lang === "ua" ? "/" : `/${lang}`;

  // Нормализованный текущий путь с завершающим слешем (так строились INDICES)
  const normPath = location.pathname.replace(/\/+$/, "/");
  const currentId = INDICES.idByPath[lang]?.[normPath];

  // Если индексы не нашли текущую страницу (например, 404) — покажем только «Домой»
  if (!currentId) {
    return (
      <nav className="breadcrumbs">
        <Link
          className={`breadcrumbs-link ${baseLinkTyposafe} ${homeColor}`}
          to={homeTo}
        >
          {HOME_LABEL}
        </Link>
      </nav>
    );
  }

  // Собираем цепочку id → крошки (исключаем 'home', т.к. рисуем его отдельно)
  const chain = [];
  let cur = currentId;
  while (cur && cur !== "root") {
    chain.push(cur);
    cur = INDICES.parentOf[cur];
  }
  chain.reverse();

  // Превращаем в объекты { to, label }, пропуская 'home'
  const crumbItems = chain
    .map((id) => {
      const node = findNodeById(NAV_TREE, id);
      if (!node || node.kind === "group") return null;
      const to = INDICES.pathById[lang][id];
      const label = (node.label && node.label[lang]) || id;
      return { id, to, label };
    })
    .filter(Boolean)
    .filter((c) => c.id !== "home"); // 'Домой' рисуем отдельно

  return (
    <nav className="breadcrumbs">
      {/* Домой */}
      <Link
        className={`breadcrumbs-link ${baseLinkTyposafe} ${homeColor}`}
        to={homeTo}
      >
        {HOME_LABEL}
      </Link>

      {crumbItems.map((c, i) => {
        const isLast = i === crumbItems.length - 1;

        // Для второй ссылки (i === 0 при глубине ≥ 2) — тот же цвет, что и «домой»
        const nonLastColor =
          i === 0 && crumbItems.length >= 2 ? homeColor : "c13";

        return (
          <span key={c.to}>
            <span className={`${isBright ? "c13" : "c15"}`}>/</span>
            {isLast ? (
              <span
                className={`${
                  isPC ? "fs-p--14px fw-semi-bold" : "fs-p--12px fw-medium"
                } lh-100 ${isBright ? "c3" : "c1"}`}
              >
                {c.label}
              </span>
            ) : (
              <Link
                className={`breadcrumbs-link ${baseLinkTyposafe} ${nonLastColor}`}
                to={c.to}
              >
                {c.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
