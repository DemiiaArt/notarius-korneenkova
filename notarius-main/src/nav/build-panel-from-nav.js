// build-panels-from-nav.js
import { findPathStackById, buildFullPathForId } from "@nav/nav-utils";
import { getLabel } from "@nav/nav-helpers-extra";

function quickTitle(lang) {
  if (lang === "ru") return "Быстрые услуги";
  if (lang === "en") return "Quick links";
  return "Швидкі послуги";
}

function sentenceCase(str, locale = "uk") {
  if (!str) return "";
  const low = str.toLocaleLowerCase(locale);
  return low.replace(/^\s*([\p{L}])/u, (m, p1) => p1.toLocaleUpperCase(locale));
}

export function buildSectionPanel(NAV_TREE, sectionId, lang) {
  const stack = findPathStackById(NAV_TREE, sectionId);
  if (!stack || !stack.length) {
    return null;
  }

  const section = stack.at(-1);
  const children = Array.isArray(section.children)
    ? section.children.filter(Boolean)
    : [];
  const columns = [];
  const quick = {
    id: "quick",
    title: quickTitle(lang),
    isQuick: true,
    items: [],
  };

  children.forEach((child) => {
    if (!child) return;

    if (child.kind === "page" && child.showInMenu !== false) {
      // Добавляем страницы 3-го уровня напрямую в columns для отображения справа
      columns.push({
        id: child.id,
        title: sentenceCase(getLabel(child, lang)),
        isQuick: false,
        items: [], // нет детей 4-го уровня
      });
      return;
    }

    // Обрабатываем группы
    if (child.kind === "group" && Array.isArray(child.children)) {
      const items = child.children
        .filter(Boolean)
        .filter((n) => n && n.kind === "page" && n.showInMenu !== false)
        .map((n) => ({
          id: n.id,
          label: sentenceCase(getLabel(n, lang)),
          url: buildFullPathForId(NAV_TREE, n.id, lang),
        }));

      // Добавляем группу в columns только если showInMenu === true
      if (child.showInMenu === true) {
        columns.push({
          id: child.id, // << важное: ID группы из NAV_TREE
          title: sentenceCase(getLabel(child, lang)),
          isQuick: false,
          items, // может быть пустым массивом для групп без детей
        });
      }
    }

    // Обрабатываем секции (дети 3-го уровня)
    if (child.kind === "section" && Array.isArray(child.children)) {
      const items = child.children
        .filter(Boolean)
        .filter((n) => n && n.kind === "page" && n.showInMenu !== false)
        .map((n) => ({
          id: n.id,
          label: sentenceCase(getLabel(n, lang)),
          url: buildFullPathForId(NAV_TREE, n.id, lang),
        }));

      // Добавляем секцию в columns только если showInMenu === true
      if (child.showInMenu === true) {
        columns.push({
          id: child.id, // << важное: ID секции из NAV_TREE
          title: sentenceCase(getLabel(child, lang)),
          isQuick: false,
          items, // дети 3-го уровня
        });
      }
    }
  });

  if (quick.items.length) columns.unshift(quick);

  return {
    title: sentenceCase(getLabel(section, lang)),
    columns,
  };
}

export function buildPanelDataFromNav(NAV_TREE, lang) {
  const out = {};
  const services = buildSectionPanel(NAV_TREE, "services", lang);
  if (services) out.services = services;

  const translate = buildSectionPanel(NAV_TREE, "notary-translate", lang);
  if (translate) out["notary-translate"] = translate;

  const other = buildSectionPanel(NAV_TREE, "other-services", lang);
  if (other) out["other-services"] = other;

  const military = buildSectionPanel(NAV_TREE, "military-help", lang);
  if (military) out["military-help"] = military;

  return out;
}
