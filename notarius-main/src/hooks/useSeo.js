import { useLocation } from "react-router-dom";
import { useLang } from "@nav/use-lang";
import { useHybridNav } from "@contexts/HybridNavContext";
import { findNodeById } from "@nav/nav-utils";

/**
 * Хук для использования нового Seo компонента
 * Автоматически определяет все необходимые параметры
 */
export const useSeo = ({
  navId,
  title,
  description,
  ld,
  canonicalOverride,
}) => {
  const location = useLocation();
  const { currentLang } = useLang();
  const { navTree, loading, mergeComplete } = useHybridNav();

  // Определяем routePath (путь без домена)
  const routePath = location.pathname.startsWith("/")
    ? location.pathname.slice(1)
    : location.pathname;

  // Находим узел в navTree если передан navId
  const nodeFromNavTree =
    navId && navTree ? findNodeById(navTree, navId) : null;

  // Определяем когда navTree загружен
  const navTreeLoaded = !loading && mergeComplete;

  console.log(`🔍 useSeo hook state:`, {
    loading,
    mergeComplete,
    navTreeLoaded,
    navId,
    nodeFromNavTree: nodeFromNavTree ? "found" : "not found",
    routePath,
    currentLang,
  });

  return {
    title,
    description,
    lang: currentLang,
    routePath,
    navTreeLoaded,
    nodeFromNavTree,
    ld,
    canonicalOverride,
    // Добавляем флаг для показа skeleton
    shouldShowSkeleton: !navTreeLoaded && navId, // Показываем skeleton только для страниц, зависящих от navTree
  };
};
