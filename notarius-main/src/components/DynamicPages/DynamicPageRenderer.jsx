import React from "react";
import { useParams } from "react-router-dom";
import { useHybridNav } from "@contexts/HybridNavContext";
import { useLanguage } from "@hooks/useLanguage";
import { detectLocaleFromPath } from "@nav/nav-utils";
import { getComponentById } from "@nav/component-registry";

// Импорты компонентов
import ServiceGroupPage from "./ServiceGroupPage";
import ServiceDetailPage from "./ServiceDetailPage";
import DefaultThirdLevelPage from "@pagesSecondLevel/DefaultThirdLevelPage";
import DefaultFourthLevelPage from "@pagesSecondLevel/DefaultFourthLevelPage";

const DynamicPageRenderer = () => {
  const { navTree } = useHybridNav();
  const { slug1, slug2, slug3 } = useParams();
  const { currentLang } = useLanguage();

  // Определяем тип страницы (3-й или 4-й уровень)
  const isDetailPage = !!slug3;

  // Находим текущий узел
  const findCurrentNode = () => {
    if (!navTree) return null;

    const findNodeBySlugs = (nodes, targetSlugs) => {
      for (const node of nodes) {
        // Проверяем slug для текущего языка
        const nodeSlug = node.slug?.[currentLang];
        if (nodeSlug === targetSlugs[0]) {
          if (targetSlugs.length === 1) return node;
          if (node.children) {
            const child = findNodeBySlugs(node.children, targetSlugs.slice(1));
            if (child) return child;
          }
        }
      }
      return null;
    };

    const slugs = [slug1, slug2, slug3].filter(Boolean);
    return findNodeBySlugs(navTree.children, slugs);
  };

  const currentNode = findCurrentNode();

  // Отладочная информация
  console.log("🔍 DynamicPageRenderer:");
  console.log("  - slug1:", slug1);
  console.log("  - slug2:", slug2);
  console.log("  - slug3:", slug3);
  console.log("  - currentLang:", currentLang);
  console.log("  - currentNode:", currentNode);

  if (!currentNode) {
    console.log("❌ currentNode is null - страница не найдена");
    return (
      <div className="dynamic-page-renderer">
        <div className="container">
          <h1>Страница не найдена</h1>
          <p>Запрашиваемая страница не существует.</p>
        </div>
      </div>
    );
  }

  // Проверяем, есть ли компонент в реестре для данного ID
  const ComponentFromRegistry = getComponentById(currentNode.id);

  console.log("🔍 Проверяем компонент для ID:", currentNode.id);
  console.log("🔍 ComponentFromRegistry:", ComponentFromRegistry);

  if (ComponentFromRegistry && ComponentFromRegistry !== null) {
    console.log("✅ Используем компонент из реестра:", currentNode.id);
    return <ComponentFromRegistry />;
  }

  // Если компонента нет в реестре, используем дефолтные компоненты
  console.log(
    "⚠️ Компонент не найден в реестре, используем дефолтный для:",
    currentNode.id
  );

  // Определяем уровень вложенности по количеству slug'ов
  const slugCount = [slug1, slug2, slug3].filter(Boolean).length;

  if (slugCount >= 3) {
    // 4-й уровень или выше - используем DefaultFourthLevelPage
    console.log("📄 Используем DefaultFourthLevelPage для 4+ уровня");
    return (
      <DefaultFourthLevelPage
        title={currentNode.label?.[currentLang] || currentNode.id}
        heroImgClass="notaryServicesPage"
      />
    );
  } else if (slugCount === 2) {
    // 3-й уровень - используем DefaultThirdLevelPage
    console.log("📄 Используем DefaultThirdLevelPage для 3-го уровня");
    return (
      <DefaultThirdLevelPage
        navId={currentNode.id}
        wrapperClassName="default-third-level-wrap"
      />
    );
  } else {
    // 1-й уровень - используем ServiceGroupPage как fallback
    console.log("📄 Используем ServiceGroupPage как fallback");
    return <ServiceGroupPage />;
  }
};

export default DynamicPageRenderer;
