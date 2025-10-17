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
import { useHybridNav } from "@contexts/HybridNavContext";
import {
  findPathStackById,
  buildFullPathForId,
  getLabel,
} from "@nav/nav-utils";
import { useLanguage } from "@hooks/useLanguage";

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

const Breadcrumbs = () => {
  const isPC = useIsPC();
  const location = useLocation();
  const { currentLang } = useLanguage();
  const { navTree, loading, error, mergeComplete } = useHybridNav();

  // Язык и сегменты без префикса языка
  const rawSegments = location.pathname.split("/").filter(Boolean);
  let lang = currentLang || "ua"; // Используем язык из контекста
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

  // Показываем загрузку если навигация еще не загружена или не объединена
  if (loading || !mergeComplete) {
    return (
      <nav className="breadcrumbs">
        <span className={`${baseLinkTyposafe} ${homeColor}`}>
          {loading ? "Завантаження..." : "Об'єднання з backend..."}
        </span>
      </nav>
    );
  }

  // Показываем ошибку если не удалось загрузить навигацию
  if (error || !navTree) {
    return (
      <nav className="breadcrumbs">
        <Link
          className={`breadcrumbs-link ${baseLinkTyposafe} ${homeColor}`}
          to={lang === "ua" ? "/" : `/${lang}`}
        >
          {lang === "ru" ? "Главная" : lang === "en" ? "Main" : "Головна"}
        </Link>
      </nav>
    );
  }

  // Метки для "домой" берём из API навигации (узел 'home'), иначе дефолт
  const homeNode = findPathStackById(navTree, "home")?.at(-1);
  const HOME_LABEL =
    getLabel(homeNode, lang) ||
    (lang === "ru" ? "Главная" : lang === "en" ? "Main" : "Головна");

  const homeTo = lang === "ua" ? "/" : `/${lang}`;

  // Находим текущий узел по пути
  const currentPath = location.pathname.replace(/\/+$/, "/");
  let currentId = null;

  // Ищем узел, который соответствует текущему пути
  function findNodeByPath(node, targetPath) {
    if (!node || !node.children) return null;

    for (const child of node.children) {
      const childPath = buildFullPathForId(navTree, child.id, lang);
      if (childPath === targetPath) {
        return child.id;
      }

      const found = findNodeByPath(child, targetPath);
      if (found) return found;
    }
    return null;
  }

  currentId = findNodeByPath(navTree, currentPath);

  // СПЕЦИАЛЬНАЯ ОБРАБОТКА ДЛЯ БЛОГА
  // Если не нашли узел через обычный поиск, проверяем блог
  if (!currentId) {
    const blogPatterns = {
      ua: /^\/notarialni-blog(\/[^\/]+)?$/,
      ru: /^\/ru\/notarialni-blog(\/[^\/]+)?$/,
      en: /^\/en\/notary-blog(\/[^\/]+)?$/,
    };

    const isBlogPage = Object.values(blogPatterns).some((pattern) =>
      pattern.test(location.pathname)
    );

    if (isBlogPage) {
      const pathParts = location.pathname.split("/").filter(Boolean);
      // Убираем префикс языка если есть
      const partsWithoutLang =
        pathParts[0] === "ru" || pathParts[0] === "en"
          ? pathParts.slice(1)
          : pathParts;

      // Если есть slug статьи после blog slug
      if (partsWithoutLang.length > 1) {
        const articleSlug = partsWithoutLang[1];
        console.log("🔍 [Breadcrumbs] Ищем статью блога:", articleSlug);

        // Пытаемся найти статью в children блога
        const blogNode = findPathStackById(navTree, "blog")?.at(-1);
        console.log("🔍 [Breadcrumbs] Узел блога:", blogNode);

        if (blogNode && blogNode.children) {
          console.log("🔍 [Breadcrumbs] Дети блога:", blogNode.children);
          const article = blogNode.children.find(
            (child) =>
              child.slug?.ua === articleSlug ||
              child.slug?.ru === articleSlug ||
              child.slug?.en === articleSlug
          );
          if (article) {
            console.log("✅ [Breadcrumbs] Нашли статью:", article);
            currentId = article.id;
          } else {
            console.warn("⚠️ [Breadcrumbs] Статья не найдена в children блога");
          }
        }
      } else {
        // Это главная страница блога
        console.log("✅ [Breadcrumbs] Это главная страница блога");
        currentId = "blog";
      }
    }
  }

  // Если не нашли текущую страницу (например, 404) — покажем только «Домой»
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

  // Собираем цепочку узлов от текущего до корня
  const pathStack = findPathStackById(navTree, currentId);
  if (!pathStack) {
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

  // Превращаем в объекты { to, label }, пропуская 'home' и 'root'
  const crumbItems = pathStack
    .filter((node) => node.id !== "home" && node.id !== "root")
    .map((node) => {
      // Включаємо групи тільки якщо у них є слаг
      if (node.kind === "group" && !node.slug?.[lang]) return null;

      const to = buildFullPathForId(navTree, node.id, lang);
      const label = getLabel(node, lang) || node.id;
      return { id: node.id, to, label };
    })
    .filter(Boolean);

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
