/**
 * Hook для работы с блогом
 * Загрузка статей блога из API
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/config/api';

/**
 * Hook для получения списка статей блога
 * @returns {Object} { articles, loading, error, fetchArticles }
 */
export const useBlog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Загрузка списка статей
   * @param {boolean} forceRefresh - принудительное обновление
   * @returns {Promise<Array>} Массив статей
   */
  const fetchArticles = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiClient.get('/blog/notarialni-blog/');
      
      console.log('✅ Блог загружен:', data);
      setArticles(data.results || data);
      
      return data.results || data;
    } catch (err) {
      const errorMessage = err.message || 'Помилка при завантаженні блогу';
      setError(errorMessage);
      console.error('❌ Ошибка при загрузке блога:', err);
      
      // Устанавливаем пустой массив при ошибке
      setArticles([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Загружаем статьи при первом использовании
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return {
    articles,
    loading,
    error,
    fetchArticles
  };
};

/**
 * Hook для получения отдельной статьи блога
 * @param {string} slug - slug статьи
 * @returns {Object} { article, loading, error, fetchArticle }
 */
export const useBlogArticle = (slug) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Загрузка статьи по slug
   * @param {string} articleSlug - slug статьи
   * @returns {Promise<Object>} Данные статьи
   */
  const fetchArticle = useCallback(async (articleSlug) => {
    if (!articleSlug) {
      setError('Slug статьи не указан');
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await apiClient.get(`/blog/notarialni-blog/${articleSlug}/`);
      
      console.log('✅ Статья загружена:', data);
      setArticle(data);
      
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Помилка при завантаженні статті';
      setError(errorMessage);
      console.error('❌ Ошибка при загрузке статьи:', err);
      
      setArticle(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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
    fetchArticle
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
