import React from "react";
import { useParams, Link } from "react-router-dom";
import { useHybridNav } from "@contexts/HybridNavContext";
import { getLabel } from "@nav/nav-utils";
import { getComponentById } from "@nav/component-registry";
import DefaultFourthLevelPage from "@pagesSecondLevel/DefaultFourthLevelPage";
import "./ServiceDetailPage.scss";

const ServiceDetailPage = () => {
  const { navTree } = useHybridNav();
  const { slug1, slug2, slug3 } = useParams();

  // Находим текущий узел по пути
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

    return findNodeBySlugs(navTree.children, [slug1, slug2, slug3]);
  };

  const currentNode = findCurrentNode();

  if (!currentNode) {
    return (
      <div className="service-detail-page">
        <div className="container">
          <h1>Страница не найдена</h1>
        </div>
      </div>
    );
  }

  const title = getLabel(currentNode, "ua");
  const description = currentNode.description?.ua || "";

  // Перевіряємо, чи є компонент для цієї сторінки
  const PageComponent = getComponentById(currentNode.id);

  console.log(
    "🔍 ServiceDetailPage: Проверяем компонент для ID:",
    currentNode.id
  );
  console.log("🔍 ServiceDetailPage: PageComponent:", PageComponent);

  // Якщо є спеціальний компонент - використовуємо його
  if (PageComponent && PageComponent !== null) {
    console.log(
      "✅ ServiceDetailPage: Используем компонент из реестра:",
      currentNode.id
    );
    return <PageComponent />;
  }

  // Якщо немає спеціального компонента - використовуємо дефолтний шаблон
  console.log(
    "📄 ServiceDetailPage: Используем DefaultFourthLevelPage для:",
    currentNode.id
  );
  return (
    <DefaultFourthLevelPage title={title} heroImgClass="notaryServicesPage" />
  );
};

export default ServiceDetailPage;
