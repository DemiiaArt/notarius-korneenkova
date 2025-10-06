import { memo } from "react";
import { useHybridNav } from "@contexts/HybridNavContext";
import { findNodeById } from "@nav/nav-utils";
import GroupServicesCarousel from "@components/GroupServicesCarousel/GroupServicesCarousel";
import ServicesCarousel from "@components/ServicesCarousel/ServicesCarousel";

/**
 * Умная карусель, которая автоматически выбирает:
 * - GroupServicesCarousel - если у parentId есть дети
 * - ServicesCarousel - если у parentId нет детей (показывает верхний уровень)
 *
 * @param {Object} props
 * @param {string} props.parentId - ID родительского элемента из nav-tree
 * @param {string} props.title - Заголовок карусели
 * @param {string} [props.className] - Дополнительные CSS классы
 * @param {boolean} [props.showTitle] - Показывать ли заголовок (по умолчанию true)
 *
 * @example
 * // Автоматически покажет GroupServicesCarousel если есть дети
 * <AdaptiveCarousel
 *   parentId="power-of-attorney"
 *   title="Категорії довіреностей"
 * />
 *
 * @example
 * // Автоматически покажет ServicesCarousel если нет детей
 * <AdaptiveCarousel
 *   parentId="military-help"
 *   title="Послуги допомога військовим"
 * />
 */
const AdaptiveCarousel = memo(
  ({ parentId, title, className = "", showTitle = true }) => {
    const { navTree, loading } = useHybridNav();

    // Показываем загрузку
    if (loading || !navTree) {
      return (
        <div className={`adaptive-carousel ${className}`}>
          <div className="container">
            <div style={{ textAlign: "center", padding: "20px" }}>
              Завантаження...
            </div>
          </div>
        </div>
      );
    }

    // Находим узел по parentId
    const parentNode = findNodeById(navTree, parentId);

    // Если узел не найден - ничего не показываем
    if (!parentNode) {
      console.warn(`[AdaptiveCarousel] Node with id "${parentId}" not found`);
      return null;
    }

    // Проверяем наличие детей
    const hasChildren = parentNode.children && parentNode.children.length > 0;

    console.log(
      `[AdaptiveCarousel] parentId="${parentId}", hasChildren=${hasChildren}, children count=${parentNode.children?.length || 0}`
    );

    // Если есть дети - используем GroupServicesCarousel
    if (hasChildren) {
      return (
        <GroupServicesCarousel
          parentId={parentId}
          title={title}
          className={className}
          showTitle={showTitle}
        />
      );
    }

    // Если нет детей - используем ServicesCarousel для показа верхнего уровня
    // Используем "Інші послуги" как заголовок для навигации на верхний уровень
    return (
      <ServicesCarousel
        parentId="root"
        title="Інші послуги"
        kind="section"
        className={className}
        showTitle={showTitle}
      />
    );
  }
);

AdaptiveCarousel.displayName = "AdaptiveCarousel";

export default AdaptiveCarousel;
