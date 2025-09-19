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
  const segments = stack
    .filter((n) => n.kind !== "group")
    .map((n) => (n.slug?.[lang] || "").trim())
    .filter(Boolean);
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
