/**
 * Hook для работы с блогом
 * Загрузка статей блога из API с поддержкой пагинации и фильтрации
 */

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@hooks/useLanguage";
import { apiClient } from "@/config/api";

/**
 * Hook для получения списка статей блога
 * @param {Object} options - Опции запроса
 * @param {number} options.page - Номер страницы
 * @param {string} options.category - Slug категории для фильтрации
 * @returns {Object} { articles, categories, loading, error, totalPages, totalCount, fetchArticles }
 */
export const useBlog = ({ page = 1, category = null } = {}) => {
  const { currentLang } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  /**
   * Загрузка списка статей
   * @param {boolean} forceRefresh - принудительное обновление
   * @returns {Promise<Object>} Данные блога
   */
  const fetchArticles = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true);
        setError(null);

        // Формируем query параметры
        const params = new URLSearchParams({
          lang: currentLang,
          page: page.toString(),
        });

        // Добавляем category только если он указан и не 'all'
        if (category && category !== "all") {
          params.append("category", category);
        }

        const url = `/blog/notarialni-blog/?${params.toString()}`;
        console.log("✅ Загружаем блог:", url);

        const data = await apiClient.get(url);

        console.log("✅ Блог загружен:", data);
        console.log("📊 Пагинация:", {
          count: data.count,
          currentPage: page,
          hasNext: !!data.next,
          hasPrevious: !!data.previous,
          articlesInResponse:
            data.results?.posts?.length || data.results?.length || 0,
        });

        // Обрабатываем структуру данных
        if (data.results && data.results.posts) {
          // Новая структура с вложенными posts
          setArticles(data.results.posts || []);
          setCategories(data.results.categories || []);
          setTotalCount(data.count || 0);

          // Определяем количество страниц из URL пагинации
          let calculatedPages = 1;
          if (data.next || data.previous) {
            // Извлекаем page_size из URL next/previous
            let pageSize = 6; // По умолчанию из BlogPagination

            // Пытаемся извлечь page_size из URL
            try {
              const url = new URL(data.next || data.previous);
              const urlPageSize = url.searchParams.get("page_size");
              if (urlPageSize) {
                pageSize = parseInt(urlPageSize);
              }
            } catch (e) {
              // Используем значение по умолчанию
            }

            calculatedPages = Math.ceil((data.count || 0) / pageSize);
            console.log(
              `📄 Расчет страниц: count=${data.count}, pageSize=${pageSize}, totalPages=${calculatedPages}`
            );
          }
          setTotalPages(calculatedPages);
        } else if (data.results && Array.isArray(data.results)) {
          // Старая структура с массивом статей
          setArticles(data.results || []);
          setCategories(data.categories || []);
          setTotalCount(data.count || 0);

          // Определяем количество страниц из URL пагинации
          let calculatedPages = 1;
          if (data.next || data.previous) {
            let pageSize = 6; // По умолчанию из BlogPagination

            // Пытаемся извлечь page_size из URL
            try {
              const url = new URL(data.next || data.previous);
              const urlPageSize = url.searchParams.get("page_size");
              if (urlPageSize) {
                pageSize = parseInt(urlPageSize);
              }
            } catch (e) {
              // Используем значение по умолчанию
            }

            calculatedPages = Math.ceil((data.count || 0) / pageSize);
            console.log(
              `📄 Расчет страниц (старая структура): count=${data.count}, pageSize=${pageSize}, totalPages=${calculatedPages}`
            );
          }
          setTotalPages(calculatedPages);
        } else {
          // Fallback
          setArticles([]);
          setCategories([]);
          setTotalCount(0);
          setTotalPages(1);
        }

        return data;
      } catch (err) {
        // Обработка 404 - возвращаем пустые данные
        if (err.status === 404) {
          console.warn("useBlog: 404 - blog not found in DB");
          setArticles([]);
          setCategories([]);
          setTotalCount(0);
          setTotalPages(1);
          setError(null);
          return { results: { posts: [], categories: [] }, count: 0 };
        }

        const errorMessage = err.message || "Помилка при завантаженні блогу";
        setError(errorMessage);
        console.error("❌ Ошибка при загрузке блога:", err);

        setArticles([]);
        setCategories([]);
        setTotalCount(0);
        setTotalPages(1);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentLang, page, category]
  );

  // Загружаем статьи при изменении параметров
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return {
    articles,
    categories,
    loading,
    error,
    totalPages,
    totalCount,
    fetchArticles,
  };
};

/**
 * Hook для получения отдельной статьи блога
 * @param {string} slug - slug статьи
 * @returns {Object} { article, loading, error, fetchArticle }
 */
export const useBlogArticle = (slug) => {
  const { currentLang } = useLanguage();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Загрузка статьи по slug
   * @param {string} articleSlug - slug статьи
   * @returns {Promise<Object>} Данные статьи
   */
  const fetchArticle = useCallback(
    async (articleSlug) => {
      if (!articleSlug) {
        setError("Slug статьи не указан");
        setLoading(false);
        return null;
      }

      try {
        setLoading(true);
        setError(null);

        // Формируем query параметры
        const params = new URLSearchParams({
          lang: currentLang,
        });

        const url = `/blog/notarialni-blog/${articleSlug}/?${params.toString()}`;
        console.log("✅ Загружаем статью:", url);

        const data = await apiClient.get(url);

        console.log("✅ Статья загружена:", data);
        setArticle(data);

        return data;
      } catch (err) {
        const errorMessage = err.message || "Помилка при завантаженні статті";
        setError(errorMessage);
        console.error("❌ Ошибка при загрузке статьи:", err);

        setArticle(null);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentLang]
  );

  // Загружаем статью при изменении slug
  useEffect(() => {
    if (slug) {
      fetchArticle(slug);
    }
  }, [slug, fetchArticle]);

  return {
    article,
    loading,
    error,
    fetchArticle,
  };
};

/**
 * Пример использования:
 *
 * // Список статей
 * const { articles, loading, error } = useBlog();
 *
 * // Отдельная статья
 * const { article, loading, error } = useBlogArticle('slug-stati');
 */
