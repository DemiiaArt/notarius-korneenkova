import { useState, useEffect } from "react";
import { useLang } from "@nav/use-lang";
import { useHybridNav } from "@contexts/HybridNavContext";
import { findNodeById, findPathStackById } from "@nav/nav-utils";
import { API_BASE_URL } from "@/config/api";

/**
 * Строит путь slug'ов от родителя до целевого узла
 * Пропускает узлы типа "group" и "root"
 * @param {Object} navTree - Навигационное дерево
 * @param {string} targetId - ID целевого узла
 * @param {string} lang - Язык
 * @returns {Array<string>} - Массив slug'ов
 */
const buildSlugPath = (navTree, targetId, lang) => {
  const stack = findPathStackById(navTree, targetId);

  if (!stack || stack.length === 0) {
    return [];
  }

  const slugs = [];

  for (const node of stack) {
    // Пропускаем root и узлы без slug
    if (node.id === "root") continue;

    // ⚠️ ВАЖНО: Группы БЕЗ slug пропускаются, но группы СО slug добавляются в путь
    // Это позволяет использовать группы как разделы URL (например, contracts)
    const slug = node.slug?.[lang];
    if (slug) {
      slugs.push(slug);
    }
    // Если нет slug, но это НЕ группа - это ошибка
    else if (node.kind !== "group") {
      console.warn(
        `[buildSlugPath] Node "${node.id}" has no slug for lang "${lang}"`
      );
    }
  }

  return slugs;
};

/**
 * Универсальный хук для получения данных страницы из backend
 * Поддерживает страницы любого уровня вложенности (1-4)
 * @param {string} navId - ID элемента из nav-tree (например: "services", "notary-translate")
 * @returns {Object} - { data, loading, error }
 */
export const usePageData = (navId) => {
  const { currentLang } = useLang();
  const { navTree } = useHybridNav();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navTree || !navId) {
      return;
    }

    const fetchPageData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Находим узел в nav tree по navId
        const node = findNodeById(navTree, navId);

        if (!node) {
          throw new Error(`Node with id "${navId}" not found in nav tree`);
        }

        console.log(`[usePageData] Found node for "${navId}":`, node);

        // 2. Строим полный путь slug'ов от services до целевого узла
        const slugPath = buildSlugPath(navTree, navId, currentLang);

        if (!slugPath || slugPath.length === 0) {
          throw new Error(
            `No slug path found for "${navId}" in language "${currentLang}"`
          );
        }

        console.log(`[usePageData] Slug path for "${navId}":`, slugPath);

        // 3. Формируем URL для backend запроса
        // Backend ожидает:
        // - 1 уровень: /api/services/{slug1}/?lang={lang}
        // - 2 уровень: /api/services/{slug1}/{slug2}/?lang={lang}
        // - 3 уровень: /api/services/{slug1}/{slug2}/{slug3}/?lang={lang}
        const slugPathString = slugPath.join("/");
        const url = `${API_BASE_URL}/services/${slugPathString}/?lang=${currentLang}`;

        console.log(`[usePageData] Fetching from: ${url}`);

        // 4. Делаем запрос
        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          // Обработка 404 ошибки - показываем заглушку вместо ошибки
          if (response.status === 404) {
            const fallbackData = {
              title: node.label?.[currentLang] || "Сторінка",
              description: "Тут немає контенту будь-ласка заповніть БД",
              hero_image: null,
              listItems: [],
            };
            console.warn(
              `[usePageData] 404 for "${navId}", using fallback data`
            );
            setData(fallbackData);
            return;
          }
          throw new Error(`HTTP ${response.status} while fetching ${url}`);
        }

        const responseData = await response.json();

        // 5. Трансформируем данные для фронтенда
        // Backend возвращает: { label, description, hero_image, features }
        // Фронтенд ожидает: { title, description, hero_image, listItems }
        const transformedData = {
          title: responseData.label,
          description: responseData.description,
          hero_image: responseData.hero_image,
          listItems: responseData.features || [],
        };

        console.log(`[usePageData] Success:`, transformedData);
        setData(transformedData);
      } catch (err) {
        console.error(`[usePageData] Error for "${navId}":`, err);
        setError(err.message || "Failed to fetch page data");
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [navTree, navId, currentLang]);

  return { data, loading, error };
};
