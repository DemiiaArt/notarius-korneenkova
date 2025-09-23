// src/nav/buildServicesMenuList.js
import { NAV_TREE } from "./nav-tree";
import { INDICES } from "./indices"; // содержит pathById/idByPath/parentOf для всех узлов

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

function pagesToItems(node, lang) {
  if (!node?.children) return [];
  return node.children
    .filter((ch) => ch.kind === "page")
    .map((ch) => ({
      text: ch.label?.[lang] || ch.id,
      link: INDICES.pathById[lang]?.[ch.id] || "",
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
export function buildServicesMenuList(lang = "ua") {
  const servicesSection = findNodeById(NAV_TREE, "services");
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
        title: titleOverride ?? (g?.label?.[lang] || ""),
        items: pagesToItems(g, lang),
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
        title: getGroup("contracts")?.label?.[lang] || "ДОГОВОРИ",
        subMenu: contractsGroups,
      },
      {
        text: poaGroup?.label?.[lang] || "ДОВІРЕНІСТЬ",
        subMenu: [{ title: "", items: pagesToItems(poaGroup, lang) }],
      },
      {
        text: signGroup?.label?.[lang] || "ПІДПИС, ЗАЯВА (на бланках)",
        subMenu: [{ title: "", items: pagesToItems(signGroup, lang) }],
      },
      {
        text:
          consultGroup?.label?.[lang] ||
          "КОНСУЛЬТАЦІЯ. КОПІЯ ДОКУМЕНТІВ. ПОВТОРНЕ ОТРИМАННЯ СВІДОЦТВ.",
        subMenu: [{ title: "", items: pagesToItems(consultGroup, lang) }],
      },
      {
        text: apostilleGroup?.label?.[lang] || "АПОСТИЛЬ ТА АФІДЕВІТ",
        subMenu: [{ title: "", items: pagesToItems(apostilleGroup, lang) }],
      },
    ],
  };
}
