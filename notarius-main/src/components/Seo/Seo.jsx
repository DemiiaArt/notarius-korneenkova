import { Helmet } from "react-helmet-async";
import { SITE_BASE_URL } from "@/config/api";

// Допоміжна: будуємо абсолютний URL акуратно
function joinUrl(base, path) {
  if (!base) return path || "";
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  if (!path) return b;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

/**
 * buildCanonical:
 * - Для рівнів 3–4: беремо з navTree.canonical_url[lang], якщо є
 * - Для фронтових 1–2: будуємо з поточного маршруту (routePath) на базі SITE_BASE_URL
 * - Якщо у canonical з navTree протокол/хост "локальні" — замінюємо хост на VITE_SITE_BASE_URL
 */
function buildCanonical({ lang, routePath, nodeFromNavTree, SITE_BASE_URL }) {
  // 1) Якщо є канонікал у вузлі дерева (3–4 рівні)
  const fromTree = nodeFromNavTree?.canonical_url?.[lang]; // напр. "http://localhost:5173/page/"
  if (fromTree) {
    // Логируем сырое значение для узлов 3-4 уровня
    console.log(`🔍 Raw canonical_url[${lang}] from navTree:`, fromTree);

    try {
      const base = new URL(SITE_BASE_URL);
      const url = new URL(fromTree, SITE_BASE_URL);
      // Нормалізуємо хост/протокол до продовського BASE_URL
      url.protocol = base.protocol;
      url.hostname = base.hostname;
      url.port = base.port;
      // Прибрати зайвий слеш в кінці
      let href = url.toString();
      if (href.endsWith("/")) href = href.slice(0, -1);

      // Логируем финальный canonical
      console.log(`✅ Final canonical after normalization:`, href);

      return href;
    } catch (e) {
      console.warn(`⚠️ Failed to normalize canonical URL:`, e);
      // Якщо чомусь невдалий URL — fallback нижче
    }
  }

  // 2) Інакше (1–2 рівні, чистий фронт): з routePath
  // Очікуємо, що routePath — це поточний шлях без домену (напр. "ua/notarialni-poslugy" або "notarialni-poslugy")
  // Якщо мовні префікси у шляхах, просто передай коректний routePath зверху.
  const href = joinUrl(SITE_BASE_URL, routePath);
  const finalHref = href.endsWith("/") ? href.slice(0, -1) : href;

  console.log(`📝 Generated canonical from routePath:`, finalHref);
  console.log(`📝 RoutePath details:`, { routePath, lang, SITE_BASE_URL });

  return finalHref;
}

/**
 * Seo component
 * - title, description — як було
 * - lang — поточна мова ("ua" | "ru" | "en")
 * - routePath — поточний шлях (без домену), напр. "ua/notarialni-poslugy"
 * - navTreeLoaded — коли дерево готове (true) — тільки тоді вставляємо canonical
 * - nodeFromNavTree — вузол для поточної сторінки (для 3–4 рівнів)
 * - ld (optional) — об'єкт JSON-LD, який вольється в <script type="application/ld+json">
 * - canonicalOverride (optional) — якщо дуже треба примусово задати canonical
 */
export default function Seo({
  title,
  description,
  lang,
  routePath,
  navTreeLoaded,
  nodeFromNavTree,
  ld,
  canonicalOverride,
}) {
  // Используем SITE_BASE_URL из конфига
  const baseUrl = SITE_BASE_URL;

  // Не вставляємо canonical, доки не завантажено navTree (важливо!)
  console.log(`🔧 Seo component called with:`, {
    navTreeLoaded,
    lang,
    routePath,
    nodeFromNavTree: nodeFromNavTree ? "exists" : "null",
    canonicalOverride: canonicalOverride || "none",
  });

  const canonical = canonicalOverride
    ? canonicalOverride
    : navTreeLoaded
      ? buildCanonical({
          lang,
          routePath,
          nodeFromNavTree,
          SITE_BASE_URL: baseUrl,
        })
      : null;

  console.log(`🎯 Final canonical:`, canonical);

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}

      {/* Canonical додаємо тільки коли дерево готове */}
      {canonical && <link rel="canonical" href={canonical} data-rh="true" />}

      {/* Опційно JSON-LD */}
      {ld && <script type="application/ld+json">{JSON.stringify(ld)}</script>}
    </Helmet>
  );
}
