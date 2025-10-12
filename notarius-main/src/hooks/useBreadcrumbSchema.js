import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useHybridNav } from "@contexts/HybridNavContext";
import { useLanguage } from "@hooks/useLanguage";
import {
  findPathStackById,
  buildFullPathForId,
  getLabel,
} from "@nav/nav-utils";

/**
 * Хук для генерации JSON-LD структурированных данных для хлебных крошек
 * @returns {string|null} JSON-LD schema as string or null if data is not ready
 */
export const useBreadcrumbSchema = () => {
  const location = useLocation();
  const { currentLang } = useLanguage();
  const { navTree, loading, error, mergeComplete } = useHybridNav();

  const breadcrumbSchema = useMemo(() => {
    // Не генерируем схему пока данные не загружены
    if (loading || !mergeComplete || error || !navTree) {
      return null;
    }

    // Получаем базовый URL сайта
    const baseUrl = window.location.origin;

    // Определяем язык
    const rawSegments = location.pathname.split("/").filter(Boolean);
    let lang = currentLang || "ua";
    let breadcrumbs = [...rawSegments];
    if (breadcrumbs[0] === "ru" || breadcrumbs[0] === "en") {
      lang = breadcrumbs[0];
      breadcrumbs = breadcrumbs.slice(1);
    }

    // Получаем метку для домашней страницы
    const homeNode = findPathStackById(navTree, "home")?.at(-1);
    const HOME_LABEL =
      getLabel(homeNode, lang) ||
      (lang === "ru" ? "Главная" : lang === "en" ? "Main" : "Головна");

    const homeTo = lang === "ua" ? "/" : `/${lang}`;

    // СПЕЦИАЛЬНАЯ ОБРАБОТКА ДЛЯ БЛОГА
    const blogPatterns = {
      ua: /^\/notarialni-blog(\/[^\/]+)?$/,
      ru: /^\/ru\/notarialni-blog(\/[^\/]+)?$/,
      en: /^\/en\/notary-blog(\/[^\/]+)?$/,
    };

    const currentPath = location.pathname;
    const isBlogPage = Object.values(blogPatterns).some((pattern) =>
      pattern.test(currentPath)
    );

    if (isBlogPage) {
      // Это страница блога или статьи блога
      const blogLabels = {
        ua: "Блог",
        ru: "Блог",
        en: "Blog",
      };

      const blogSlugs = {
        ua: "notarialni-blog",
        ru: "notarialni-blog",
        en: "notary-blog",
      };

      const blogPath =
        lang === "ua" ? `/${blogSlugs[lang]}` : `/${lang}/${blogSlugs[lang]}`;

      const itemListElement = [
        {
          "@type": "ListItem",
          position: 1,
          name: HOME_LABEL,
          item: `${baseUrl}${homeTo}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: blogLabels[lang],
          item: `${baseUrl}${blogPath}`,
        },
      ];

      // Если это страница статьи (есть slug после blog slug)
      const pathParts = currentPath.split("/").filter(Boolean);
      const partsWithoutLang =
        pathParts[0] === "ru" || pathParts[0] === "en"
          ? pathParts.slice(1)
          : pathParts;

      if (partsWithoutLang.length > 1) {
        // Это статья блога, добавляем текущую страницу
        // Здесь мы не знаем название статьи, поэтому просто используем "Стаття" / "Article"
        const articleLabel =
          lang === "ru" ? "Статья" : lang === "en" ? "Article" : "Стаття";

        itemListElement.push({
          "@type": "ListItem",
          position: 3,
          name: articleLabel,
          item: `${baseUrl}${currentPath}`,
        });
      }

      const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement,
      };

      return JSON.stringify(schema);
    }

    // ОБЫЧНАЯ ОБРАБОТКА ДЛЯ ДРУГИХ СТРАНИЦ
    // Находим текущий узел по пути
    const normalizedPath = currentPath.replace(/\/+$/, "/");

    function findNodeByPath(node, targetPath) {
      if (!node || !node.children) return null;

      for (const child of node.children) {
        const childPath = buildFullPathForId(navTree, child.id, lang);
        if (childPath === targetPath) {
          return child.id;
        }

        const found = findNodeByPath(child, targetPath);
        if (found) return found;
      }
      return null;
    }

    const currentId = findNodeByPath(navTree, normalizedPath);

    // Если не нашли текущую страницу, не генерируем схему
    if (!currentId) {
      return null;
    }

    // Получаем цепочку узлов
    const pathStack = findPathStackById(navTree, currentId);
    if (!pathStack) {
      return null;
    }

    // Формируем элементы хлебных крошек
    const crumbItems = pathStack
      .filter((node) => node.id !== "home" && node.id !== "root")
      .map((node) => {
        // Включаем группы только если у них есть slug
        if (node.kind === "group" && !node.slug?.[lang]) return null;

        const to = buildFullPathForId(navTree, node.id, lang);
        const label = getLabel(node, lang) || node.id;
        return { id: node.id, to, label };
      })
      .filter(Boolean);

    // Создаем JSON-LD структуру
    const itemListElement = [
      {
        "@type": "ListItem",
        position: 1,
        name: HOME_LABEL,
        item: `${baseUrl}${homeTo}`,
      },
      ...crumbItems.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: crumb.label,
        item: `${baseUrl}${crumb.to}`,
      })),
    ];

    // Формируем полную схему
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement,
    };

    return JSON.stringify(schema);
  }, [location.pathname, navTree, loading, error, mergeComplete, currentLang]);

  return breadcrumbSchema;
};
