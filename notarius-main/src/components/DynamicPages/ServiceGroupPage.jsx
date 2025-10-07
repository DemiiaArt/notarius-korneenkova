import React from "react";
import { useParams } from "react-router-dom";
import { useHybridNav } from "@contexts/HybridNavContext";
import { findNodeById, getLabel } from "@nav/nav-utils";
import { getComponentById } from "@nav/component-registry";
import DefaultThirdLevelPage from "@pagesSecondLevel/DefaultThirdLevelPage";
import "./ServiceGroupPage.scss";

const ServiceGroupPage = () => {
  const { navTree } = useHybridNav();
  const { slug1, slug2 } = useParams();

  // Находим текущий узел по пути
  const findCurrentNode = () => {
    if (!navTree) return null;

    // Ищем узел по slug'ам
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

    return findNodeBySlugs(navTree.children, [slug1, slug2]);
  };

  const currentNode = findCurrentNode();

  if (!currentNode) {
    return (
      <div className="service-group-page">
        <div className="container">
          <h1>Страница не найдена</h1>
        </div>
      </div>
    );
  }

  const title = getLabel(currentNode, "ua");
  const description = currentNode.description?.ua || "";
  const children = currentNode.children || [];

  // Перевіряємо, чи є компонент для цієї сторінки
  const PageComponent = getComponentById(currentNode.id);

  console.log(
    "🔍 ServiceGroupPage: Проверяем компонент для ID:",
    currentNode.id
  );
  console.log("🔍 ServiceGroupPage: PageComponent:", PageComponent);

  // Якщо є спеціальний компонент - використовуємо його
  if (PageComponent && PageComponent !== null) {
    console.log(
      "✅ ServiceGroupPage: Используем компонент из реестра:",
      currentNode.id
    );
    return <PageComponent />;
  }

  // Якщо є дочірні елементи - показуємо список
  if (children.length > 0) {
    return (
      <div className="service-group-page">
        <div className="container">
          <div className="service-group-header">
            <h1 className="service-group-title">{title}</h1>
            {description && (
              <div
                className="service-group-description"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </div>

          <div className="service-group-content">
            <h2 className="services-subtitle">Доступні послуги:</h2>
            <div className="services-grid">
              {children.map((service) => (
                <div key={service.id} className="service-card">
                  <h3 className="service-card-title">
                    {getLabel(service, "ua")}
                  </h3>
                  {service.description?.ua && (
                    <div
                      className="service-card-description"
                      dangerouslySetInnerHTML={{
                        __html: service.description.ua,
                      }}
                    />
                  )}
                  <a
                    href={`/${slug1}/${slug2}/${service.slug?.ua || service.id}`}
                    className="service-card-link"
                  >
                    Детальніше
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Якщо немає дочірніх елементів - використовуємо дефолтний шаблон
  console.log(
    "📄 ServiceGroupPage: Используем DefaultThirdLevelPage для:",
    currentNode.id
  );
  return (
    <DefaultThirdLevelPage
      navId={currentNode.id}
      wrapperClassName="service-group-default-wrap"
    />
  );
};

export default ServiceGroupPage;
