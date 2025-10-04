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
  console.log(`buildSectionPanel: Looking for section "${sectionId}"`);
  const stack = findPathStackById(NAV_TREE, sectionId);
  if (!stack || !stack.length) {
    console.log(`buildSectionPanel: Section "${sectionId}" not found`);
    return null;
  }

  const section = stack.at(-1);
  console.log(`buildSectionPanel: Found section "${sectionId}":`, section);
  const kids = Array.isArray(section.children)
    ? section.children.filter(Boolean)
    : [];
  console.log(`buildSectionPanel: Section "${sectionId}" has ${kids.length} children`);
  const columns = [];
  const quick = {
    id: "quick",
    title: quickTitle(lang),
    isQuick: true,
    items: [],
  };

  kids.forEach((child) => {
    if (!child) return;

    if (child.kind === "page" && child.showInMenu !== false) {
      quick.items.push({
        id: child.id,
        label: sentenceCase(getLabel(child, lang)),
        url: buildFullPathForId(NAV_TREE, child.id, lang),
      });
      return;
    }

    if (child.kind === "group" && Array.isArray(child.children)) {
      const items = child.children
        .filter(Boolean)
        .filter((n) => n && n.kind === "page" && n.showInMenu !== false)
        .map((n) => ({
          id: n.id,
          label: sentenceCase(getLabel(n, lang)),
          url: buildFullPathForId(NAV_TREE, n.id, lang),
        }));

      if (items.length) {
        columns.push({
          id: child.id, // << важное: ID группы из NAV_TREE
          title: sentenceCase(getLabel(child, lang)),
          isQuick: false,
          items,
        });
      }
    }
  });

  if (quick.items.length) columns.unshift(quick);

  console.log(`buildSectionPanel: Section "${sectionId}" final columns:`, columns);
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
  if (translate) out.translate = translate;

  const other = buildSectionPanel(NAV_TREE, "other-services", lang);
  if (other) out.other = other;

  return out;
}
