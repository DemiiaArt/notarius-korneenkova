import React from "react";
import { useParams } from "react-router-dom";
import { useHybridNav } from "@contexts/HybridNavContext";

// Импорты компонентов
import ServiceGroupPage from "./ServiceGroupPage";
import ServiceDetailPage from "./ServiceDetailPage";

const DynamicPageRenderer = () => {
  const { navTree } = useHybridNav();
  const { slug1, slug2, slug3 } = useParams();

  // Определяем тип страницы (3-й или 4-й уровень)
  const isDetailPage = !!slug3;

  // Находим текущий узел
  const findCurrentNode = () => {
    if (!navTree) return null;

    const findNodeBySlugs = (nodes, targetSlugs) => {
      for (const node of nodes) {
        if (node.slug?.ua === targetSlugs[0]) {
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

  // Простой рендеринг: 3-й уровень = ServiceGroupPage, 4-й уровень = ServiceDetailPage
  if (isDetailPage) {
    return <ServiceDetailPage />;
  } else {
    return <ServiceGroupPage />;
  }
};

export default DynamicPageRenderer;
