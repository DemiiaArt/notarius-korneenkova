import { SITE_BASE_URL } from "@/config/api";

/**
 * Добавляет canonical_url к статическим узлам NAV_TREE, которые его не имеют
 * Использует тот же принцип, что и buildFullPathForId
 */
export function addCanonicalToStaticNodes(navTree) {
  if (!navTree) return navTree;

  // Рекурсивно обходим дерево
  function processNode(node, parentPath = []) {
    const processedNode = { ...node };

    // Если у узла нет canonical_url, генерируем его
    if (
      !processedNode.canonical_url ||
      Object.keys(processedNode.canonical_url).length === 0
    ) {
      const canonicalUrls = {};

      ["ua", "ru", "en"].forEach((lang) => {
        const path = buildPathForNode(processedNode, parentPath, lang);
        if (path) {
          const baseUrl = SITE_BASE_URL.replace(/\/+$/, "");
          const cleanPath = path.replace(/\/+$/, "/").replace("//", "/");
          canonicalUrls[lang] = `${baseUrl}${cleanPath}`;
        }
      });

      if (Object.keys(canonicalUrls).length > 0) {
        processedNode.canonical_url = canonicalUrls;
        console.log(
          `✅ Added canonical_url to static node "${node.id}":`,
          canonicalUrls
        );
      }
    }

    // Обрабатываем детей
    if (processedNode.children) {
      processedNode.children = processedNode.children.map((child) =>
        processNode(child, [...parentPath, node])
      );
    }

    return processedNode;
  }

  return processNode(navTree);
}

/**
 * Строит путь для узла на основе его slug'ов
 */
function buildPathForNode(node, parentPath, lang) {
  const segments = [];

  // Добавляем сегменты от родителей
  for (const parent of parentPath) {
    if (parent.id === "root") continue;

    const slug = parent.slug?.[lang];
    if (slug && slug.trim()) {
      segments.push(slug.trim());
    }
  }

  // Добавляем slug текущего узла
  const nodeSlug = node.slug?.[lang];
  if (nodeSlug && nodeSlug.trim()) {
    segments.push(nodeSlug.trim());
  }

  if (segments.length === 0) {
    return null;
  }

  // Строим путь с языковым префиксом
  const path = segments.join("/");
  return withLangPrefix(lang, path);
}

/**
 * Добавляет языковой префикс к пути
 */
function withLangPrefix(lang, path = "") {
  if (lang === "ua") {
    return ("/" + path).replace(/\/+$/, "/").replace("//", "/");
  } else {
    return ("/" + lang + "/" + path).replace(/\/+$/, "/").replace("//", "/");
  }
}
