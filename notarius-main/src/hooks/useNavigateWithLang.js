import { useNavigate } from "react-router-dom";
import { useLanguage } from "./useLanguage";
import { buildFullPathForId } from "../nav/nav-utils";
import { NAV_TREE } from "../nav/nav-tree";
import { useHybridNav } from "../contexts/HybridNavContext";

/**
 * Хук для навигации с учетом текущего языка
 * @returns {Object} Объект с методами навигации
 */
export function useNavigateWithLang() {
  const navigate = useNavigate();
  const { currentLang } = useLanguage();
  const { navTree } = useHybridNav();

  /**
   * Переход на страницу по ID из навигационного дерева
   * @param {string} pageId - ID страницы из nav-tree
   * @param {string} [lang] - Язык (опционально, по умолчанию текущий)
   */
  const navigateToPage = (pageId, lang = null) => {
    const targetLang = lang || currentLang;
    const currentNavTree = navTree || NAV_TREE;

    const path = buildFullPathForId(currentNavTree, pageId, targetLang);

    if (path) {
      navigate(path);
    } else {
      console.warn(
        `⚠️ Не удалось построить путь для страницы ${pageId} на языке ${targetLang}`
      );
    }
  };

  /**
   * Переход на произвольный путь
   * @param {string} path - Путь для навигации
   */
  const navigateTo = (path) => {
    navigate(path);
  };

  return {
    navigateToPage,
    navigateTo,
    navigate, // Оригинальный navigate на случай, если нужен
    currentLang,
  };
}
