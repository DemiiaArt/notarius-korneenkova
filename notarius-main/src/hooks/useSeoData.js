import { useState, useEffect } from "react";
import { useLanguage } from "./useLanguage";
import { API_BASE_URL } from "@/config/api";

/**
 * Hook для получения SEO данных с backend
 *
 * @param {string} pageId - ID страницы (например: 'home', 'about', 'contacts', 'services')
 * @param {Object} [options] - Дополнительные опции
 * @param {string} [options.endpoint] - Кастомный endpoint API
 * @param {Object} [options.fallback] - Fallback данные если API недоступен
 *
 * @returns {Object} - { seoData, loading, error }
 *
 * @example
 * const { seoData, loading } = useSeoData('home');
 * // seoData содержит: { title, description, h1, og_image }
 *
 * @example
 * // С fallback данными
 * const { seoData } = useSeoData('about', {
 *   fallback: {
 *     title: 'Про мене',
 *     description: 'Опис...',
 *     h1: 'Приватний нотаріус'
 *   }
 * });
 */
export const useSeoData = (pageId, options = {}) => {
  const { currentLang } = useLanguage();
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { endpoint = `/seo/${pageId}/`, fallback = null } = options;

  useEffect(() => {
    // Если нет pageId, используем fallback сразу
    if (!pageId) {
      if (fallback) {
        setSeoData(fallback);
      }
      setLoading(false);
      return;
    }

    const fetchSeoData = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `${API_BASE_URL}${endpoint}?lang=${currentLang}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Ожидаемая структура данных с backend:
        // {
        //   title: "Заголовок страницы",
        //   description: "Описание страницы",
        //   h1: "Заголовок H1" (опционально),
        //   og_image: "/path/to/image.jpg" (опционально)
        // }

        const finalSeoData = {
          title: data.title || fallback?.title || "",
          description: data.description || fallback?.description || "",
          h1: data.h1 || data.title || fallback?.h1 || "",
          ogImage: data.og_image || fallback?.ogImage || null,
        };

        console.log(
          `[useSeoData] Данные загружены для pageId: ${pageId}, lang: ${currentLang}`,
          finalSeoData
        );
        setSeoData(finalSeoData);
      } catch (err) {
        console.error(`Error fetching SEO data for ${pageId}:`, err);
        setError(err.message);

        // Используем fallback при ошибке
        if (fallback) {
          const fallbackSeoData = {
            title: fallback.title || "",
            description: fallback.description || "",
            h1: fallback.h1 || fallback.title || "",
            ogImage: fallback.ogImage || null,
          };
          console.log(
            `[useSeoData] Используем fallback для pageId: ${pageId}, lang: ${currentLang}`,
            fallbackSeoData
          );
          setSeoData(fallbackSeoData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSeoData();
  }, [pageId, currentLang, endpoint, fallback]);

  return { seoData, loading, error };
};

/**
 * Hook для получения SEO данных с кешированием
 * Использует localStorage для кеширования SEO данных
 *
 * @param {string} pageId - ID страницы
 * @param {Object} [options] - Опции (те же что у useSeoData)
 * @param {number} [options.cacheDuration=3600000] - Длительность кеша в мс (по умолчанию 1 час)
 *
 * @returns {Object} - { seoData, loading, error, refresh }
 */
export const useCachedSeoData = (pageId, options = {}) => {
  const { currentLang } = useLanguage();
  const { cacheDuration = 3600000, ...restOptions } = options; // 1 час по умолчанию

  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cacheKey = `seo_${pageId}_${currentLang}`;

  // Функция для получения данных из кеша
  const getCachedData = () => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      // Проверяем, не устарел ли кеш
      if (now - timestamp > cacheDuration) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return data;
    } catch (err) {
      console.warn(`Failed to load SEO cache for ${pageId}:`, err);
      return null;
    }
  };

  // Функция для сохранения данных в кеш
  const saveCachedData = (data) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (err) {
      console.warn(`Failed to save SEO cache for ${pageId}:`, err);
    }
  };

  // Функция для принудительного обновления
  const refresh = async () => {
    localStorage.removeItem(cacheKey);
    fetchSeoData();
  };

  const fetchSeoData = async () => {
    // Сначала пробуем загрузить из кеша
    const cached = getCachedData();
    if (cached) {
      setSeoData(cached);
      setLoading(false);
      return;
    }

    // Если кеша нет, загружаем с сервера
    try {
      setLoading(true);
      setError(null);

      const url = `${API_BASE_URL}/seo/${pageId}/?lang=${currentLang}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const seoDataObj = {
        title: data.title || restOptions.fallback?.title || "",
        description:
          data.description || restOptions.fallback?.description || "",
        h1: data.h1 || data.title || restOptions.fallback?.h1 || "",
        ogImage: data.og_image || restOptions.fallback?.ogImage || null,
      };

      setSeoData(seoDataObj);
      saveCachedData(seoDataObj);
    } catch (err) {
      console.error(`Error fetching SEO data for ${pageId}:`, err);
      setError(err.message);

      // Используем fallback при ошибке
      if (restOptions.fallback) {
        const fallbackData = {
          title: restOptions.fallback.title || "",
          description: restOptions.fallback.description || "",
          h1: restOptions.fallback.h1 || restOptions.fallback.title || "",
          ogImage: restOptions.fallback.ogImage || null,
        };
        setSeoData(fallbackData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pageId) {
      fetchSeoData();
    }
  }, [pageId, currentLang]);

  return { seoData, loading, error, refresh };
};
