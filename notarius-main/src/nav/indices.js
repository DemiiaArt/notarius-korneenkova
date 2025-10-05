import { buildIndices } from "./nav-utils";

// Створюємо порожні індекси, які будуть оновлені динамічно
export const INDICES = {
  pathById: { ua: {}, ru: {}, en: {} },
  idByPath: { ua: {}, ru: {}, en: {} },
  parentOf: {},
};

// Функція для оновлення індексів на основі навігаційного дерева
export function updateIndices(navTree) {
  if (!navTree) return INDICES;

  const newIndices = buildIndices(navTree);

  // Оновлюємо існуючі індекси
  Object.assign(INDICES.pathById, newIndices.pathById);
  Object.assign(INDICES.idByPath, newIndices.idByPath);
  Object.assign(INDICES.parentOf, newIndices.parentOf);

  return INDICES;
}
