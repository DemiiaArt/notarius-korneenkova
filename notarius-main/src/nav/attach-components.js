// src/nav/attach-components.js
// Динамическое прикрепление компонентов к навигационному дереву

import { attachComponentsToTree } from "./component-registry";

/**
 * Прикрепить компоненты к дереву навигации (API или статическому)
 * @param {Object} navTree - дерево навигации из API или статическое
 * @returns {Object} - дерево с прикрепленными компонентами
 */
export function attachComponents(navTree) {
  if (!navTree) {
    console.warn("attachComponents: navTree is null or undefined");
    return null;
  }

  try {
    return attachComponentsToTree(navTree);
  } catch (error) {
    console.error("Error attaching components to nav tree:", error);
    return navTree; // Возвращаем оригинальное дерево без компонентов
  }
}

// Экспортируем функцию для обратной совместимости
export { attachComponentsToTree };
