// src/nav/buildServicesMenuList.js
import { findPathStackById, buildFullPathForId, getLabel } from "./nav-utils";

function findNodeById(root, targetId) {
  let found = null;
  (function dfs(n) {
    if (found) return;
    if (n.id === targetId) {
      found = n;
      return;
    }
    n.children?.forEach(dfs);
  })(root);
  return found;
}

function pagesToItems(node, navTree, lang) {
  if (!node?.children) return [];
  return node.children
    .filter((ch) => ch.kind === "page")
    .map((ch) => ({
      text: getLabel(ch, lang) || ch.id,
      link: buildFullPathForId(navTree, ch.id, lang) || "",
    }));
}

/**
 * Собираем ровно твои 5 категорий:
 * - ДОГОВОРИ            -> из групп: contracts + inheritance-contracts + corporate-rights + executive-inscription + contracts-other
 * - ДОВІРЕНІСТЬ         -> power-of-attorney
 * - ПІДПИС, ЗАЯВА...    -> signatures-statements
 * - КОНСУЛЬТАЦІЯ...     -> consult-copy-duplicate
 * - АПОСТИЛЬ ТА АФІДЕВІТ -> apostille-affidavit
 */
export function buildServicesMenuList(navTree, lang = "ua") {
  if (!navTree) return { items: [] };

  const servicesSection = findNodeById(navTree, "services");
  if (!servicesSection) return { items: [] };

  const getGroup = (id) => findNodeById(servicesSection, id);

  // 1) ДОГОВОРИ: комбинируем несколько групп как секции подменю
  const contractsGroups = [
    { id: "contracts", titleOverride: "" }, // как в твоих данных — без заголовка
    { id: "inheritance-contracts" },
    { id: "corporate-rights" },
    { id: "executive-inscription" },
    { id: "contracts-other" },
  ]
    .map(({ id, titleOverride }) => {
      const g = getGroup(id);
      return {
        title: titleOverride ?? getLabel(g, lang),
        items: pagesToItems(g, navTree, lang),
      };
    })
    .filter((g) => g.items.length > 0);

  // 2) Остальные категории — по одной группе
  const poaGroup = getGroup("power-of-attorney");
  const signGroup = getGroup("signatures-statements");
  const consultGroup = getGroup("consult-copy-duplicate");
  const apostilleGroup = getGroup("apostille-affidavit");

  return {
    items: [
      {
        title: getLabel(getGroup("contracts"), lang) || "ДОГОВОРИ",
        subMenu: contractsGroups,
      },
      {
        text: getLabel(poaGroup, lang) || "ДОВІРЕНІСТЬ",
        subMenu: [{ title: "", items: pagesToItems(poaGroup, navTree, lang) }],
      },
      {
        text: getLabel(signGroup, lang) || "ПІДПИС, ЗАЯВА (на бланках)",
        subMenu: [{ title: "", items: pagesToItems(signGroup, navTree, lang) }],
      },
      {
        text:
          getLabel(consultGroup, lang) ||
          "КОНСУЛЬТАЦІЯ. КОПІЯ ДОКУМЕНТІВ. ПОВТОРНЕ ОТРИМАННЯ СВІДОЦТВ.",
        subMenu: [
          { title: "", items: pagesToItems(consultGroup, navTree, lang) },
        ],
      },
      {
        text: getLabel(apostilleGroup, lang) || "АПОСТИЛЬ ТА АФІДЕВІТ",
        subMenu: [
          { title: "", items: pagesToItems(apostilleGroup, navTree, lang) },
        ],
      },
    ],
  };
}
