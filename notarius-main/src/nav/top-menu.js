import { buildFullPathForId, getLabel, findPathStackById } from "./nav-utils";

// Собирает верхнее меню из children root, где showInMenu === true
export function collectTopMenu(NAV_TREE, lang) {
  const items = [];
  (NAV_TREE.children || []).forEach((child) => {
    if (child.showInMenu) {
      items.push({
        id: child.id,
        title: getLabel(child, lang),
        url: buildFullPathForId(NAV_TREE, child.id, lang), // << твоя функция
      });
    }
  });
  return items;
}

// Формирует колонки:
// - "быстрые" (page прямо в services)
// - группы (group -> их page)
export function buildServicesMegaMenu(NAV_TREE, lang) {
  const servicesPath = findPathStackById(NAV_TREE, "services");
  if (!servicesPath || !servicesPath.length) return [];

  const servicesNode = servicesPath[servicesPath.length - 1];
  if (!servicesNode || !Array.isArray(servicesNode.children)) return [];

  const quick = {
    id: "quick",
    title:
      lang === "ua"
        ? "Швидкі послуги"
        : lang === "ru"
          ? "Быстрые услуги"
          : "Quick links",
    items: [],
  };

  const cats = [];

  servicesNode.children.filter(Boolean).forEach((child) => {
    if (!child || typeof child !== "object") return;

    if (child.kind === "page" && child.showInMenu !== false) {
      quick.items.push({
        id: child.id,
        title: getLabel(child, lang),
        url: buildFullPathForId(NAV_TREE, child.id, lang),
      });
      return;
    }

    if (child.kind === "group" && Array.isArray(child.children)) {
      const groupItems = child.children
        .filter(Boolean)
        .filter((n) => n && n.kind === "page" && n.showInMenu !== false)
        .map((n) => ({
          id: n.id,
          title: getLabel(n, lang),
          url: buildFullPathForId(NAV_TREE, n.id, lang),
        }));

      if (groupItems.length) {
        cats.push({
          id: child.id,
          title: getLabel(child, lang),
          items: groupItems,
        });
      }
    }
  });

  if (quick.items.length) cats.unshift(quick);
  return cats;
}
