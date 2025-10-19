import { useMemo } from "react";
import { useLang } from "@nav/use-lang";
import { useHybridNav } from "@contexts/HybridNavContext";
import { findPathStackById } from "@nav/nav-utils";

/**
 * Строит путь slug'ов от родителя до целевого узла для JSON-LD
 * @param {Object} navTree - Навигационное дерево
 * @param {string} targetId - ID целевого узла
 * @param {string} lang - Язык
 * @returns {Array<string>} - Массив slug'ов
 */
const buildSlugPath = (navTree, targetId, lang) => {
  const stack = findPathStackById(navTree, targetId);

  if (!stack || stack.length === 0) {
    return [];
  }

  const slugs = [];

  for (const node of stack) {
    // Пропускаем root
    if (node.id === "root") continue;

    const slug = node.slug?.[lang];
    if (slug) {
      slugs.push(slug);
    } else if (node.kind !== "group") {
      console.warn(
        `[buildSlugPath] Node "${node.id}" has no slug for lang "${lang}"`
      );
    }
  }

  return slugs;
};

/**
 * Хук для получения API URL для JSON-LD схемы услуги
 * @param {string} navId - ID элемента из nav-tree (например: "services", "notary-translate")
 * @returns {string|null} - API URL для JSON-LD или null, если не может быть построен
 *
 * @example
 * const apiUrl = useServiceJsonLd("notary-translate");
 * // Вернет: "/api/services/notarialni-poslugi/notarialnyj-pereklad/"
 */
export const useServiceJsonLd = (navId) => {
  const { currentLang } = useLang();
  const { navTree } = useHybridNav();

  const apiUrl = useMemo(() => {
    if (!navTree || !navId) {
      return null;
    }

    try {
      // Строим полный путь slug'ов
      const slugPath = buildSlugPath(navTree, navId, currentLang);

      if (!slugPath || slugPath.length === 0) {
        console.warn(
          `[useServiceJsonLd] No slug path found for "${navId}" in language "${currentLang}"`
        );
        return null;
      }

      // Формируем URL для API
      const slugPathString = slugPath.join("/");
      return `/api/services/${slugPathString}/`;
    } catch (error) {
      console.error(`[useServiceJsonLd] Error for "${navId}":`, error);
      return null;
    }
  }, [navTree, navId, currentLang]);

  return apiUrl;
};
