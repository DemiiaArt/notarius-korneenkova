import React from "react";
import { useParams, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const { currentLang } = useLanguage();
  // Определяем язык непосредственно из URL, чтобы избежать рассинхронизации при переключении
  const effectiveLang = detectLocaleFromPath(location.pathname) || currentLang;

  // Определяем тип страницы (3-й или 4-й уровень)
  const isDetailPage = !!slug3;

  // Находим текущий узел
  const findCurrentNode = () => {
    if (!navTree) {
      console.log("❌ navTree is null");
      return null;
    }

    const normalize = (s) => (s == null ? "" : String(s)).trim().toLowerCase();

    const findNodeBySlugs = (nodes, targetSlugs, depth = 0) => {
      console.log(
        `${"  ".repeat(depth)}🔍 Searching at depth ${depth}, target: ${targetSlugs[0]}`
      );

      for (const node of nodes) {
        // Проверяем slug для текущего языка
        const nodeSlug = node.slug?.[effectiveLang];
        console.log(
          `${"  ".repeat(depth)}  - node.id: ${node.id}, slug[${effectiveLang}]: ${nodeSlug}`
        );

        const target = normalize(targetSlugs[0]);
        const matchBySlug = normalize(nodeSlug) === target;
        const matchById = normalize(node.id) === target;

        if (matchBySlug || matchById) {
          console.log(
            `${"  ".repeat(depth)}  ✅ Match found! by ${matchBySlug ? "slug" : "id"} → node.id: ${node.id}`
          );

          if (targetSlugs.length === 1) {
            console.log(
              `${"  ".repeat(depth)}  ✅ Final node found: ${node.id}`
            );
            return node;
          }

          if (node.children) {
            console.log(
              `${"  ".repeat(depth)}  → Searching in children of ${node.id}`
            );
            const child = findNodeBySlugs(
              node.children,
              targetSlugs.slice(1),
              depth + 1
            );
            if (child) return child;
          } else {
            console.log(`${"  ".repeat(depth)}  ⚠️ No children in ${node.id}`);
          }
        }
      }
      return null;
    };

    let slugs = [slug1, slug2, slug3].filter(Boolean).map((s) => {
      try {
        return decodeURIComponent(s);
      } catch (_) {
        return s;
      }
    });
    // Если первый сегмент — языковой префикс, убираем его
    if (slugs.length > 0 && ["ua", "ru", "en"].includes(slugs[0])) {
      slugs = slugs.slice(1);
    }
    console.log(
      "🔍 Starting search with slugs:",
      slugs,
      "lang:",
      effectiveLang
    );
    return findNodeBySlugs(navTree.children, slugs);
  };

  const currentNode = findCurrentNode();

  // Отладочная информация
  console.log("🔍 DynamicPageRenderer:");
  console.log("  - slug1:", slug1);
  console.log("  - slug2:", slug2);
  console.log("  - slug3:", slug3);
  console.log("  - currentLang:", currentLang);
  console.log("  - effectiveLang(from URL):", effectiveLang);
  console.log("  - currentNode:", currentNode);
  console.log("  - navTree:", navTree);

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
        navId={currentNode.id}
        wrapperClassName="default-fourth-level-wrap"
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
