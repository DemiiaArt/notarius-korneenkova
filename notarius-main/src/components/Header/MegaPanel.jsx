import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./MegaPanel.scss";

const MERGE_TO_CONTRACTS_IDS = new Set([
  "contracts",
  "inheritance-contracts",
  "corporate-rights",
  "executive-inscription",
  "contracts-other",
]);

const LEFT_ORDER_IDS = [
  "contracts",
  "power-of-attorney",
  "signatures-statements",
  "consult-copy-duplicate",
  "apostille-affidavit",
];

function fallbackTitle(id, lang = "ua") {
  const dict = {
    ua: {
      contracts: "Договори",
      "power-of-attorney": "Довіреність",
      "signatures-statements": "Підпис, заява (на бланках)",
      "consult-copy-duplicate": "Консультація. Копія документів. Дублікати",
      "apostille-affidavit": "Апостиль та афідевіт",
    },
    ru: {
      contracts: "Договоры",
      "power-of-attorney": "Доверенности",
      "signatures-statements": "Подпись, заявление (на бланках)",
      "consult-copy-duplicate": "Консультация. Копия документов. Дубликаты",
      "apostille-affidavit": "Апостиль и аффидевит",
    },
    en: {
      contracts: "Contracts",
      "power-of-attorney": "Power of attorney",
      "signatures-statements": "Signature / Statement (forms)",
      "consult-copy-duplicate": "Consultation. Copies. Duplicates",
      "apostille-affidavit": "Apostille & Affidavit",
    },
  };
  return (dict[lang] && dict[lang][id]) || id;
}

export default function MegaPanel({ openKey, onClose, data, lang = "ua" }) {
  const ref = useRef(null);

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

  // ----- данные панели -----
  const section = openKey ? data?.[openKey] : null;
  const allCols = Array.isArray(section?.columns)
    ? section.columns.filter(Boolean)
    : [];
  const cols = allCols.filter((c) => !c.isQuick);
  const quickItems = allCols
    .filter((c) => c.isQuick)
    .flatMap((c) => (Array.isArray(c.items) ? c.items : []));

  // Бакеты для "Нотаріальні послуги"
  const buckets = new Map(
    LEFT_ORDER_IDS.map((id) => [id, { id, title: null, items: [] }])
  );

  cols.forEach((col) => {
    if (!col) return;

    if (MERGE_TO_CONTRACTS_IDS.has(col.id)) {
      const b = buckets.get("contracts");
      if (!b.title && col.id === "contracts")
        b.title = col.title || fallbackTitle("contracts", lang);
      b.items.push(...(col.items || []));
      return;
    }

    if (buckets.has(col.id)) {
      const b = buckets.get(col.id);
      if (!b.title) b.title = col.title || fallbackTitle(col.id, lang);
      b.items.push(...(col.items || []));
    }
  });

  let leftGroups = LEFT_ORDER_IDS.map((id) => {
    const b = buckets.get(id);
    if (!b) return null;
    const title = b.title || fallbackTitle(id, lang);
    return b.items.length ? { id, title, items: b.items } : null;
  }).filter(Boolean);

  // ▶️ Фолбэк для секций без групп (например, notary-translate):
  // создаём синтетическую левую категорию и показываем quick-пункты.
  if (leftGroups.length === 0 && quickItems.length) {
    leftGroups = [
      {
        id: `${openKey}-quick`,
        title: section?.title || "",
        items: quickItems,
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
                        <button
                          type="button"
                          className={`mega__leftItem ${i === activeIdx ? "is-active" : ""}`}
                          onMouseEnter={() => setActiveIdx(i)}
                          onFocus={() => setActiveIdx(i)}
                        >
                          <span className="mega__leftText fs-p--14px">
                            {g.title}
                          </span>
                          <span className="mega__chev">›</span>
                        </button>
                      ) : (
                        <span
                          className="mega__leftSpan fs-p--16px fw-semi-bold c3"
                          style={{ opacity: "0.7" }}
                        >
                          {g.title}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            {/* Правая область */}
            <section className="mega__right" aria-live="polite">
              <div className="mega__rightGrid bg5">
                {(activeGroup?.items || []).map((it) => (
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
