import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "./MegaPanel.scss";
import { buildFullPathForId } from "@nav/nav-utils";
import { useLanguage } from "@hooks/useLanguage";

const MERGE_TO_CONTRACTS_IDS = new Set([
  "contracts",
  "inheritance-contracts",
  "corporate-rights",
  "executive-inscription",
  "contracts-other",
]);

// Константа удалена - теперь используем только showInMenu === true

function fallbackTitle(id, lang = "ua") {
  const dict = {
    ua: {
      contracts: "Договори",
      "power-of-attorney": "Довіреність",
      "signatures-statements": "Підпис, заява (на бланках)",
      "consult-copy-duplicate": "Консультація. Копія документів. Дублікати",
      "apostille-affidavit": "Апостиль та афідевіт",
      tanks: "Танки",
    },
    ru: {
      contracts: "Договоры",
      "power-of-attorney": "Доверенности",
      "signatures-statements": "Подпись, заявление (на бланках)",
      "consult-copy-duplicate": "Консультация. Копия документов. Дубликаты",
      "apostille-affidavit": "Апостиль и аффидевит",
      tanks: "Танки",
    },
    en: {
      contracts: "Contracts",
      "power-of-attorney": "Power of attorney",
      "signatures-statements": "Signature / Statement (forms)",
      "consult-copy-duplicate": "Consultation. Copies. Duplicates",
      "apostille-affidavit": "Apostille & Affidavit",
      tanks: "Tanks",
    },
  };
  return (dict[lang] && dict[lang][id]) || id;
}

function getSlugForGroup(id, lang = "ua", navTree = null) {
  // Сначала пытаемся найти slug в navTree (из backend)
  if (navTree) {
    const findNodeById = (nodes, targetId) => {
      for (const node of nodes) {
        if (node.id === targetId) {
          return node;
        }
        if (node.children) {
          const found = findNodeById(node.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    const node = findNodeById(navTree.children, id);
    if (node && node.slug && node.slug[lang]) {
      return node.slug[lang];
    }
  }

  // Фолбэк на хардкод, если не найдено в navTree
  const slugMap = {
    ua: {
      contracts: "dogovory",
      "power-of-attorney": "doverennosti",
      "signatures-statements": "pidpis-zayava",
      "consult-copy-duplicate": "konsultatsiya-kopiya-dublikaty",
      "apostille-affidavit": "apostil-afidevit",
      tanks: "tanki",
    },
    ru: {
      contracts: "dogovory",
      "power-of-attorney": "doverennosti",
      "signatures-statements": "podpis-zayavlenie",
      "consult-copy-duplicate": "konsultatsiya-kopiya-dublikaty",
      "apostille-affidavit": "apostil-affidevit",
      tanks: "tanki",
    },
    en: {
      contracts: "contracts",
      "power-of-attorney": "power-of-attorney",
      "signatures-statements": "signature-statement",
      "consult-copy-duplicate": "consultation-copies-duplicates",
      "apostille-affidavit": "apostille-affidavit",
      tanks: "tanks",
    },
  };
  return (slugMap[lang] && slugMap[lang][id]) || id;
}

export default function MegaPanel({
  openKey,
  onClose,
  data,
  lang = "ua", // Оставляем для обратной совместимости
  navTree = null,
}) {
  const ref = useRef(null);
  const { currentLang } = useLanguage();

  // Используем currentLang из контекста вместо переданного параметра
  const activeLang = currentLang || lang;

  // — hooks всегда вызываются —
  useEffect(() => {
    const onDocClick = (e) => {
      if (!ref.current) return;
      if (openKey && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openKey, onClose]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const [activeIdx, setActiveIdx] = useState(-1);

  // Функция для получения URL секции
  const getSectionUrl = (sectionId) => {
    if (!navTree) return "#";
    return buildFullPathForId(navTree, sectionId, activeLang) || "#";
  };

  // Определяем базовый путь в зависимости от секции и языка
  const getBasePath = (sectionId, lang = activeLang) => {
    const paths = {
      ua: {
        services: "notarialni-poslugy",
        "notary-translate": "notarialni-pereklad",
        "other-services": "notarialni-inshi",
        "military-help": "notarialni-dopomoga-viyskovim",
      },
      ru: {
        services: "notarialni-poslugy",
        "notary-translate": "notarialni-pereklad",
        "other-services": "notarialni-inshi",
        "military-help": "notarialni-pomosch-voennym",
      },
      en: {
        services: "notary-services",
        "notary-translate": "notary-translate",
        "other-services": "notary-other",
        "military-help": "notary-military-help",
      },
    };

    return (
      paths[lang]?.[sectionId] || paths.ua[sectionId] || "notarialni-poslugy"
    );
  };
  // ----- данные панели -----
  const section = openKey ? data?.[openKey] : null;
  const allCols = Array.isArray(section?.columns)
    ? section.columns.filter(Boolean)
    : [];
  const cols = allCols.filter((c) => !c.isQuick);
  const quickItems = allCols
    .filter((c) => c.isQuick)
    .flatMap((c) => (Array.isArray(c.items) ? c.items : []));

  // Динамически создаем LEFT_ORDER_IDS на основе showInMenu === true
  const dynamicLeftOrderIds = useMemo(() => {
    // Добавляем все группы с showInMenu === true в том порядке, как они приходят из backend
    return cols.map((col) => col.id);
  }, [cols]);

  // Бакеты для "Нотаріальні послуги"
  const buckets = new Map(
    dynamicLeftOrderIds.map((id) => [id, { id, title: null, items: [] }])
  );

  cols.forEach((col) => {
    if (!col) return;

    if (MERGE_TO_CONTRACTS_IDS.has(col.id)) {
      const b = buckets.get("contracts");
      if (!b.title && col.id === "contracts")
        b.title = col.title || fallbackTitle("contracts", activeLang);
      b.items.push(...(col.items || []));
      return;
    }

    if (buckets.has(col.id)) {
      const b = buckets.get(col.id);
      if (!b.title) b.title = col.title || fallbackTitle(col.id, activeLang);
      b.items.push(...(col.items || []));
    }
  });

  // Проверяем, есть ли хотя бы одна группа с детьми
  const hasGroupsWithChildren = cols.some(
    (col) => col.items && col.items.length > 0
  );

  // Проверяем, является ли текущая секция одной из тех, что должна работать как "services"
  const isServicesLikeSection = [
    "services",
    "other-services",
    "notary-translate",
    "military-help",
  ].includes(openKey);

  let leftGroups = dynamicLeftOrderIds
    .map((id) => {
      const b = buckets.get(id);
      if (!b) return null;
      const title = b.title || fallbackTitle(id, activeLang);

      // Для секций как "services": если есть группы с детьми, показываем все группы слева
      // Для других секций: показываем только группы с детьми
      if (isServicesLikeSection && hasGroupsWithChildren) {
        return { id, title, items: b.items };
      } else if (!isServicesLikeSection) {
        return b.items.length ? { id, title, items: b.items } : null;
      } else {
        return b.items.length ? { id, title, items: b.items } : null;
      }
    })
    .filter(Boolean);

  // ▶️ Если нет групп с детьми, создаём синтетическую левую категорию с заголовком секции
  if (leftGroups.length === 0) {
    leftGroups = [
      {
        id: `${openKey}-section-title`,
        title: section?.title || "",
        items: [], // пустой массив
      },
    ];
  }

  // Авто-активация, если слева ровно 1 категория
  useEffect(() => {
    setActiveIdx(leftGroups.length === 1 ? 0 : -1);
  }, [openKey, leftGroups.length]);

  const showHeader = leftGroups.length > 1;
  // ранний выход уже ПОСЛЕ хуков
  if (!openKey || !section) return null;

  const activeGroup = activeIdx >= 0 ? leftGroups[activeIdx] : null;
  const hasLeft = leftGroups.length > 0;

  return (
    <div className="mega-wrap">
      <div
        className={`mega ${!showHeader ? "mega--noHeader" : ""}`}
        ref={ref}
        role="dialog"
        aria-label={section.title}
      >
        <div className="container">
          {/* Заголовок секции */}
          {/* {showHeader && (
            <header className="mega__header">
              <h3 className="mega__title">{section.title}</h3>
            </header>
          )} */}
          <div
            className={`mega__layout ${!hasLeft ? "mega__layout--noLeft" : ""}`}
          >
            {/* Левый сайдбар */}
            {hasLeft && (
              <aside className="mega__left">
                <ul
                  className="mega__leftList"
                  style={{ ...(!showHeader && { margin: "20px 0 0 0" }) }}
                >
                  {leftGroups.map((g, i) => (
                    <li key={g.id}>
                      {showHeader ? (
                        <Link
                          to={
                            g.id.includes("-section-title")
                              ? getSectionUrl(openKey)
                              : `/${activeLang === "ua" ? "" : activeLang + "/"}${getBasePath(openKey, activeLang)}/${getSlugForGroup(g.id, activeLang, navTree)}`
                          }
                          className={`mega__leftItem ${i === activeIdx ? "is-active" : ""}`}
                          onMouseEnter={() => setActiveIdx(i)}
                          onFocus={() => setActiveIdx(i)}
                          onClick={onClose}
                        >
                          <span className="mega__leftText fs-p--14px">
                            {g.title}
                          </span>
                          <span className="mega__chev">›</span>
                        </Link>
                      ) : (
                        <Link
                          to={
                            g.id.includes("-section-title")
                              ? getSectionUrl(openKey)
                              : `/${activeLang === "ua" ? "" : activeLang + "/"}${getBasePath(openKey, activeLang)}/${getSlugForGroup(g.id, activeLang, navTree)}`
                          }
                          className="mega__leftSpan fs-p--16px fw-semi-bold c3"
                          style={{ opacity: "0.7" }}
                          onClick={onClose}
                        >
                          {g.title}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            {/* Правая область */}
            <section className="mega__right" aria-live="polite">
              <div className={`mega__rightGrid ${activeGroup ? "bg5" : ""}`}>
                {/* Если нет групп с детьми, показываем все группы справа */}
                {!hasGroupsWithChildren
                  ? cols.map((col) => (
                      <Link
                        key={col.id}
                        to={`/${activeLang === "ua" ? "" : activeLang + "/"}${getBasePath(openKey, activeLang)}/${getSlugForGroup(col.id, activeLang, navTree)}`}
                        className="mega__link fs-p--12px fw-normal"
                        onClick={onClose}
                      >
                        {col.title}
                      </Link>
                    ))
                  : /* Иначе показываем элементы активной группы */
                    (activeGroup?.items || []).map((it) => (
                      <Link
                        key={it.url}
                        to={it.url}
                        className="mega__link fs-p--12px fw-normal"
                        onClick={onClose}
                      >
                        {it.label}
                      </Link>
                    ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
