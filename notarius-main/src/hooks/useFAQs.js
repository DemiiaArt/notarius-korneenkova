/**
 * Hook для работы с FAQ (Часто задаваемые вопросы)
 */

import { useState, useEffect, useCallback } from "react";
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

    const slug = node.slug?.[lang];
    if (slug) {
      slugs.push(slug);
    }
    // Если нет slug, но это НЕ группа - это ошибка
    else if (node.kind !== "group") {
      console.warn(
        `[useFAQs] Node "${node.id}" has no slug for lang "${lang}"`
      );
    }
  }

  return slugs;
};

/**
 * Hook для получения FAQ из endpoint services
 * @param {string} navId - ID элемента из nav-tree (обязательный параметр)
 * @returns {Object} { faqs, loading, error, fetchFAQs }
 */
export const useFAQs = (navId) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentLang } = useLang();
  const { navTree } = useHybridNav();

  /**
   * Загрузка FAQ
   * @returns {Promise<Array>} Данные FAQ
   */
  const fetchFAQs = useCallback(async () => {
    // Если navId не передан, возвращаем пустой массив
    if (!navId || !navTree || !currentLang) {
      console.warn("[useFAQs] Missing required parameters:", {
        navId,
        navTree: !!navTree,
        currentLang,
      });
      setFaqs([]);
      setLoading(false);
      return [];
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Находим узел в nav tree по navId
      const node = findNodeById(navTree, navId);

      if (!node) {
        throw new Error(`Node with id "${navId}" not found in nav tree`);
      }

      // 2. Строим полный путь slug'ов
      const slugPath = buildSlugPath(navTree, navId, currentLang);

      if (!slugPath || slugPath.length === 0) {
        throw new Error(
          `No slug path found for "${navId}" in language "${currentLang}"`
        );
      }

      // 3. Формируем URL для backend запроса
      const slugPathString = slugPath.join("/");
      const url = `${API_BASE_URL}/services/${slugPathString}/?lang=${currentLang}`;

      console.log(`[useFAQs] Fetching FAQs from: ${url}`);

      // 4. Делаем запрос
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        // Обработка 404 ошибки
        if (response.status === 404) {
          console.warn(`[useFAQs] 404 for "${navId}", no FAQs available`);
          setFaqs([]);
          return [];
        }
        throw new Error(`HTTP ${response.status} while fetching ${url}`);
      }

      const data = await response.json();

      // Проверяем формат данных - FAQs могут быть в data.faqs
      let faqsList = [];
      if (Array.isArray(data.faqs)) {
        faqsList = data.faqs;
      } else if (Array.isArray(data)) {
        faqsList = data;
      }

      console.log("[useFAQs] FAQs loaded:", faqsList.length, "items");
      setFaqs(faqsList);
      return faqsList;
    } catch (err) {
      const errorMessage = err.message || "Помилка при завантаженні FAQ";
      setError(errorMessage);
      console.error("[useFAQs] Error:", err);

      // Устанавливаем пустые данные при ошибке
      setFaqs([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [navId, navTree, currentLang]);

  // Загружаем FAQ при монтировании компонента или при смене параметров
  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  return {
    faqs,
    loading,
    error,
    fetchFAQs,
  };
};
