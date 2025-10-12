import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NAV_TREE } from "../nav/nav-tree";
import {
  buildFullPathForId,
  findPathStackById,
  detectLocaleFromPath,
} from "../nav/nav-utils";
import { INDICES } from "../nav/indices";

export const LanguageContext = createContext();

export const LanguageProvider = ({
  children,
  defaultLanguage = "ua",
  navTree = null,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [lang, setLang] = useState(defaultLanguage);

  // Определяем текущий язык из URL
  useEffect(() => {
    const detectedLang = detectLocaleFromPath(location.pathname);
    setLang(detectedLang);
  }, [location.pathname]);

  // Функция для смены языка с учетом навигационного дерева
  const switchLanguage = (newLang) => {
    if (!["ua", "ru", "en"].includes(newLang)) return;

    const currentPath = location.pathname;
    const search = location.search;
    const hash = location.hash;

    // Используем актуальное дерево навигации (с backend данными)
    const currentNavTree = navTree || NAV_TREE;

    // Определяем текущий язык из пути
    const currentLang = detectLocaleFromPath(currentPath);

    console.log("🔍 Текущий путь:", currentPath);
    console.log("🔍 Текущий язык:", currentLang);
    console.log("🔍 Новый язык:", newLang);

    // СПЕЦИАЛЬНАЯ ОБРАБОТКА ДЛЯ БЛОГА
    // Проверяем, является ли это страницей блога или статьи блога
    const blogPatterns = {
      ua: /^\/notarialni-blog(\/[^\/]+)?$/,
      ru: /^\/ru\/notarialni-blog(\/[^\/]+)?$/,
      en: /^\/en\/notary-blog(\/[^\/]+)?$/,
    };

    // Проверяем, соответствует ли текущий путь паттерну блога
    const isBlogPage = Object.values(blogPatterns).some((pattern) =>
      pattern.test(currentPath)
    );

    if (isBlogPage) {
      console.log("📝 Это страница блога, используем специальную логику");

      // Определяем slug статьи (если есть)
      const blogSlugs = {
        ua: "notarialni-blog",
        ru: "notarialni-blog",
        en: "notary-blog",
      };

      // Извлекаем slug статьи из пути
      let articleSlug = null;
      const pathParts = currentPath.split("/").filter(Boolean);

      // Убираем префикс языка если есть
      const partsWithoutLang =
        pathParts[0] === "ru" || pathParts[0] === "en"
          ? pathParts.slice(1)
          : pathParts;

      // Если есть что-то после slug блога, это slug статьи
      if (partsWithoutLang.length > 1) {
        articleSlug = partsWithoutLang[1];
      }

      // Строим новый путь
      let newPath;
      if (articleSlug) {
        // Статья блога
        newPath =
          newLang === "ua"
            ? `/${blogSlugs[newLang]}/${articleSlug}`
            : `/${newLang}/${blogSlugs[newLang]}/${articleSlug}`;
      } else {
        // Главная страница блога
        newPath =
          newLang === "ua"
            ? `/${blogSlugs[newLang]}`
            : `/${newLang}/${blogSlugs[newLang]}`;
      }

      console.log("✅ Новый путь блога:", newPath);
      navigate(newPath + search + hash);
      return;
    }

    // Нормализуем текущий путь для поиска в INDICES
    const normalizedPath = currentPath.replace(/\/+$/, "/");

    // Ищем ID страницы через INDICES
    let pageId = INDICES.idByPath[currentLang]?.[normalizedPath];
    console.log("🔍 ID из INDICES:", pageId);

    // Если не нашли в INDICES, пробуем поиск по дереву
    if (!pageId) {
      pageId = findCurrentPageId(currentPath, currentNavTree);
      console.log("🔍 ID из findCurrentPageId:", pageId);
    }

    if (pageId) {
      // Если нашли страницу, строим новый путь для нового языка
      const newPath = buildFullPathForId(currentNavTree, pageId, newLang);
      console.log("✅ Новый путь:", newPath);

      if (newPath) {
        const finalUrl = newPath + search + hash;
        navigate(finalUrl);
        return;
      }
    }

    // Fallback: используем старую логику для страниц не в дереве
    const fallbackPath = buildFallbackPath(currentPath, newLang);
    console.log("⚠️ Fallback путь:", fallbackPath);
    navigate(fallbackPath + search + hash);
  };

  // Функция для поиска ID текущей страницы в навигационном дереве
  const findCurrentPageId = (pathname, navTreeToUse = NAV_TREE) => {
    // Убираем языковой префикс для поиска
    const cleanPath = pathname.replace(/^\/(ru|en)(?=\/|$)/, "");
    console.log("🔍 Ищем по очищенному пути:", cleanPath);

    // Ищем в дереве по пути, передавая корневое дерево
    const result = findPageIdByPath(navTreeToUse, cleanPath, navTreeToUse);
    console.log("🔍 Результат поиска:", result);
    return result;
  };

  // Рекурсивный поиск ID страницы по пути
  const findPageIdByPath = (node, targetPath, rootNode = null) => {
    if (!node || !node.children) return null;

    // Используем переданный rootNode или текущий node как корень
    const root = rootNode || node;

    // Нормализуем путь для сравнения
    const normalizedTarget = targetPath.replace(/^\/+|\/+$/g, "");
    console.log("🔍 Ищем в узле:", node.id, "целевой путь:", normalizedTarget);

    for (const child of node.children) {
      // Проверяем текущий узел
      if (child.slug && (child.kind === "page" || child.kind === "section")) {
        for (const lang of ["ua", "ru", "en"]) {
          const slug = child.slug[lang];
          if (slug) {
            // Строим полный путь для этого узла, используя корневое дерево
            const fullPath = buildFullPathForId(root, child.id, lang);
            if (fullPath) {
              const normalizedFullPath = fullPath.replace(/^\/+|\/+$/g, "");
              // Убираем языковой префикс для сравнения
              const cleanFullPath = normalizedFullPath.replace(
                /^(ru|en)\//,
                ""
              );

              console.log(
                `  Проверяем ${child.id} (${lang}): ${fullPath} -> ${cleanFullPath} vs ${normalizedTarget}`
              );

              if (
                cleanFullPath === normalizedTarget ||
                normalizedTarget === cleanFullPath
              ) {
                console.log("✅ Найдено совпадение:", child.id);
                return child.id;
              }
            }
          }
        }
      }

      // Рекурсивно ищем в детях
      const found = findPageIdByPath(child, targetPath, root);
      if (found) return found;
    }

    return null;
  };

  // Fallback функция для построения пути
  const buildFallbackPath = (currentPath, newLang) => {
    if (newLang === "ua") {
      return currentPath.replace(/^\/(ru|en)(?=\/|$)/, "") || "/";
    }

    const cleanPath = currentPath.replace(/^\/(ru|en)(?=\/|$)/, "");
    return `/${newLang}${cleanPath}`;
  };

  const value = {
    currentLang: lang,
    switchLanguage,
    setLang,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
