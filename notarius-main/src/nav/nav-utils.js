export const withLangPrefix = (lang, path = "") =>
  lang === "ua"
    ? ("/" + path).replace(/\/+$/, "/").replace("//", "/")
    : ("/" + lang + "/" + path).replace(/\/+$/, "/").replace("//", "/");

export function findPathStackById(root, id) {
  if (!root || typeof root !== "object") return null;

  const stack = [];
  let found = null;

  (function dfs(n) {
    if (found || !n || typeof n !== "object") return;

    stack.push(n);

    if (n.id === id) {
      found = [...stack];
      stack.pop();
      return;
    }

    const kids = Array.isArray(n.children)
      ? n.children.filter(Boolean) // убираем undefined/null
      : [];

    for (const ch of kids) {
      if (found) break;
      dfs(ch);
    }

    stack.pop();
  })(root);

  return found;
}

export function buildFullPathForId(root, id, lang) {
  const stack = findPathStackById(root, id);
  if (!stack) return null;

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

  return withLangPrefix(lang, segments.join("/"));
}

export function buildIndices(root, langs = ["ua", "ru", "en"]) {
  const pathById = { ua: {}, ru: {}, en: {} };
  const idByPath = { ua: {}, ru: {}, en: {} };
  const parentOf = {};
  (function walk(n, parentId) {
    parentOf[n.id] = parentId ?? null;
    langs.forEach((lang) => {
      const full = buildFullPathForId(root, n.id, lang);
      if (full) {
        const norm = full.replace(/\/+$/, "/");
        pathById[lang][n.id] = norm;
        idByPath[lang][norm] = n.id;
      }
    });
    n.children?.forEach((ch) => walk(ch, n.id));
  })(root, null);
  return { pathById, idByPath, parentOf };
}

export function detectLocaleFromPath(pathname) {
  if (pathname.startsWith("/ru")) return "ru";
  if (pathname.startsWith("/en")) return "en";
  return "ua";
}

// Безопасно достать подпись узла по языку
export function getLabel(node, lang) {
  return (node?.label && node.label[lang]) || "";
}

// Функция для поиска узла по ID в дереве
export function findNodeById(tree, id) {
  if (!tree || typeof tree !== "object") return null;

  if (tree.id === id) {
    return tree;
  }

  if (tree.children && Array.isArray(tree.children)) {
    for (const child of tree.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }

  return null;
}

// Функция для получения всех детей узла
export function getNodeChildren(tree, nodeId) {
  const node = findNodeById(tree, nodeId);
  return node?.children || [];
}

// Функция для проверки, есть ли у узла дети
export function hasNodeChildren(tree, nodeId) {
  const children = getNodeChildren(tree, nodeId);
  return children.length > 0;
}

// Функция для получения пути к узлу
export function getNodePath(tree, nodeId, lang = "ua") {
  const stack = findPathStackById(tree, nodeId);
  if (!stack) return null;

  return stack.map((node) => getLabel(node, lang)).filter(Boolean);
}
