import React from "react";
import { useParams } from "react-router-dom";
import { useHybridNav } from "@contexts/HybridNavContext";
import { useLanguage } from "@hooks/useLanguage";
import { detectLocaleFromPath } from "@nav/nav-utils";

// Импорты компонентов
import ServiceGroupPage from "./ServiceGroupPage";
import ServiceDetailPage from "./ServiceDetailPage";

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
    return (
      <div className="dynamic-page-renderer">
        <div className="container">
          <h1>Страница не найдена</h1>
          <p>Запрашиваемая страница не существует.</p>
        </div>
      </div>
    );
  }

  // Если у узла есть компонент, используем его
  if (currentNode.component) {
    console.log("✅ Используем компонент из узла:", currentNode.id);
    const Component = currentNode.component;
    return <Component />;
  }

  // Иначе используем стандартные компоненты
  console.log("⚠️ Используем стандартный компонент для:", currentNode.id);
  if (isDetailPage) {
    return <ServiceDetailPage />;
  } else {
    return <ServiceGroupPage />;
  }
};

export default DynamicPageRenderer;
