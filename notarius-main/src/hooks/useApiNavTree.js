import { useState, useEffect, useCallback } from "react";

import { API_BASE_URL } from "../config/api";
const CACHE_KEY = "nav_tree_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 хвилин

// Функція для збереження в localStorage
const saveToCache = (data) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.warn("Failed to save nav tree to cache:", error);
  }
};

// Функція для отримання з localStorage
const getFromCache = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    // Перевіряємо, чи не застарів кеш
    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    console.warn("Failed to load nav tree from cache:", error);
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
};

export const useApiNavTree = () => {
  const [navTree, setNavTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNavTree = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Спочатку перевіряємо кеш, якщо не форс-рефреш
      if (!forceRefresh) {
        const cachedData = getFromCache();
        if (cachedData) {
          setNavTree(cachedData);
          setLoading(false);
          return cachedData;
        }
      }

      // Завантажуємо з API
      const response = await fetch(`${API_BASE_URL}/services/`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Зберігаємо в кеш
      saveToCache(data);

      setNavTree(data);
      return data;
    } catch (err) {
      console.error("Error fetching nav tree:", err);
      setError(err.message);

      // Спробуємо отримати з кешу навіть якщо він застарів
      const staleCache = getFromCache();
      if (staleCache) {
        console.warn("Using stale cache due to API error");
        setNavTree(staleCache);
        setError(null);
        return staleCache;
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Завантажуємо при першому використанні
  useEffect(() => {
    fetchNavTree();
  }, [fetchNavTree]);

  // Функція для оновлення кешу
  const refreshNavTree = useCallback(() => {
    return fetchNavTree(true);
  }, [fetchNavTree]);

  // Функція для очищення кешу
  const clearCache = useCallback(() => {
    localStorage.removeItem(CACHE_KEY);
    setNavTree(null);
  }, []);

  return {
    navTree,
    loading,
    error,
    refreshNavTree,
    clearCache,
  };
};
