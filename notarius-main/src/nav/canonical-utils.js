import { SITE_BASE_URL } from "@/config/api";

/**
 * Генерирует canonical URL для узла на основе его slug'ов
 * Использует тот же принцип, что и buildFullPathForId для хлебных крошек
 *
 * @param {Object} navTree - Навигационное дерево
 * @param {string} nodeId - ID узла
 * @param {string} lang - Язык (ua/ru/en)
 * @returns {string} - Canonical URL
 */
export function buildCanonicalUrlForNode(navTree, nodeId, lang) {
  if (!navTree || !nodeId || !lang) {
    console.warn(`⚠️ buildCanonicalUrlForNode: missing params`, {
      navTree: !!navTree,
      nodeId,
      lang,
    });
    return null;
  }

  // Находим путь к узлу
  const stack = findPathStackById(navTree, nodeId);
  if (!stack || stack.length === 0) {
    console.warn(
      `⚠️ buildCanonicalUrlForNode: node "${nodeId}" not found in navTree`
    );
    return null;
  }

  const segments = [];

  // Проходим по стеку от корня до целевого элемента
  for (const node of stack) {
    // Пропускаем корневой элемент
    if (node.id === "root") continue;

    // Если у узла есть слаг для данного языка, добавляем его
    if (node.slug && node.slug[lang] && node.slug[lang].trim()) {
      segments.push(node.slug[lang].trim());
    }
    // Если это группа без слага, пропускаем её
    else if (node.kind === "group") {
      continue;
    }
    // Для страниц без слага тоже пропускаем
    else if (node.kind === "page") {
      continue;
    }
  }

  // Строим путь с языковым префиксом
  const path = withLangPrefix(lang, segments.join("/"));

  // Убираем завершающий слеш
  const cleanPath = path.replace(/\/+$/, "/").replace("//", "/");

  // Строим полный canonical URL
  const baseUrl = SITE_BASE_URL.replace(/\/+$/, "");
  const canonicalUrl = `${baseUrl}${cleanPath}`;

  console.log(
    `🔗 Generated canonical URL for "${nodeId}" [${lang}]:`,
    canonicalUrl
  );

  return canonicalUrl;
}

/**
 * Генерирует canonical URL для всех языков узла
 *
 * @param {Object} navTree - Навигационное дерево
 * @param {string} nodeId - ID узла
 * @returns {Object} - Объект с canonical_url для всех языков
 */
export function buildCanonicalUrlsForNode(navTree, nodeId) {
  const canonicalUrls = {};

  ["ua", "ru", "en"].forEach((lang) => {
    const canonicalUrl = buildCanonicalUrlForNode(navTree, nodeId, lang);
    if (canonicalUrl) {
      canonicalUrls[lang] = canonicalUrl;
    }
  });

  return Object.keys(canonicalUrls).length > 0 ? canonicalUrls : null;
}

/**
 * Добавляет canonical_url к узлу, если его нет
 *
 * @param {Object} node - Узел навигации
 * @param {Object} navTree - Навигационное дерево
 * @returns {Object} - Узел с добавленным canonical_url
 */
export function addCanonicalUrlToNode(node, navTree) {
  if (!node || !navTree) return node;

  // Если canonical_url уже есть, не перезаписываем
  if (node.canonical_url && Object.keys(node.canonical_url).length > 0) {
    console.log(
      `✅ Node "${node.id}" already has canonical_url:`,
      node.canonical_url
    );
    return node;
  }

  // Генерируем canonical_url
  const canonicalUrls = buildCanonicalUrlsForNode(navTree, node.id);

  if (canonicalUrls) {
    node.canonical_url = canonicalUrls;
    console.log(`✅ Added canonical_url to "${node.id}":`, canonicalUrls);
  } else {
    console.warn(`⚠️ Could not generate canonical_url for "${node.id}"`);
  }

  return node;
}

// Импортируем необходимые функции из nav-utils
import { findPathStackById } from "./nav-utils";

// Копируем функцию withLangPrefix из nav-utils
export const withLangPrefix = (lang, path = "") =>
  lang === "ua"
    ? ("/" + path).replace(/\/+$/, "/").replace("//", "/")
    : ("/" + lang + "/" + path).replace(/\/+$/, "/").replace("//", "/");
