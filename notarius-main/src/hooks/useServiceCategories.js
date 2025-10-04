/**
 * Hook для работы с категориями услуг (ServiceCategory)
 * Загружает иерархическую структуру услуг из API
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/config/api';

/**
 * Hook для получения всей структуры категорий услуг
 * @returns {Object} { categories, loading, error, refetch }
 */
export const useServiceCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('useServiceCategories: Fetching from API...');
      const data = await apiClient.get('/services/');
      console.log('useServiceCategories: API response:', data);
      
      // Backend возвращает полную структуру навигации с корнем
      // Извлекаем children из корневого элемента
      const rootChildren = data.children || [];
      console.log('useServiceCategories: rootChildren:', rootChildren);
      console.log('useServiceCategories: Is array?', Array.isArray(rootChildren));
      
      if (!Array.isArray(rootChildren)) {
        console.log('useServiceCategories: rootChildren is not an array, setting empty');
        setCategories([]);
        return;
      }
      
      // Список чисто статичных элементов (НЕ из БД)
      const staticIds = ['home', 'about', 'offer', 'policy', 'contacts', 'trademark', 'blog', 'not-found-page'];
      
      // Фильтруем: берем категории услуг из БД (services, notary-translate, other-services, military-help)
      // Эти категории НЕ входят в список статичных и имеют show_in_menu = true
      const servicesCategories = rootChildren.filter(item => {
        const isStatic = staticIds.includes(item.id);
        const isDynamic = !isStatic && item.show_in_menu !== false;
        
        console.log(`useServiceCategories: Item ${item.id}: isStatic=${isStatic}, isDynamic=${isDynamic}, kind=${item.kind}`);
        
        return isDynamic;
      });
      
      console.log('useServiceCategories: Final categories:', servicesCategories);
      setCategories(servicesCategories);
      
    } catch (err) {
      setError(err.message);
      console.error('useServiceCategories ERROR:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { 
    categories, 
    loading, 
    error, 
    refetch: fetchCategories 
  };
};

/**
 * Hook для получения деталей конкретной категории по пути slug'ов
 * @param {Array<string>} slugPath - Массив slug'ов (до 3 элементов)
 * @param {string} lang - Текущий язык (ua, ru, en)
 * @returns {Object} { category, loading, error, refetch }
 * 
 * @example
 * // Для URL /notarialni-poslugy/dogovory/dogovor-kupivli-prodazhu
 * const { category } = useServiceCategoryDetail(
 *   ['notarialni-poslugy', 'dogovory', 'dogovor-kupivli-prodazhu'],
 *   'ua'
 * );
 */
export const useServiceCategoryDetail = (slugPath = [], lang = 'ua') => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategory = useCallback(async () => {
    if (!slugPath || slugPath.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Формируем путь из slug'ов (максимум 3 уровня)
      const path = slugPath.slice(0, 3).join('/');
      const data = await apiClient.get(`/${path}/`);
      
      setCategory(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching service category detail:', err);
      setCategory(null);
    } finally {
      setLoading(false);
    }
  }, [slugPath.join('/')]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  return { 
    category, 
    loading, 
    error, 
    refetch: fetchCategory 
  };
};

/**
 * Утилита для преобразования API данных в формат NAV_TREE
 * @param {Array} apiCategories - Данные с API
 * @returns {Array} Категории в формате NAV_TREE
 */
export const transformCategoriesToNavTree = (apiCategories) => {
  if (!apiCategories || !Array.isArray(apiCategories)) {
    return [];
  }

  return apiCategories.map(cat => ({
    id: cat.id,
    kind: cat.kind,
    label: cat.label,
    slug: cat.slug,
    showInMenu: cat.show_in_menu,
    component: cat.component,
    children: cat.children ? transformCategoriesToNavTree(cat.children) : []
  }));
};

/**
 * Hook для получения объединенной структуры навигации
 * Объединяет статичный NAV_TREE с данными из API
 * @param {Object} staticNavTree - Статичный NAV_TREE
 * @returns {Object} { navTree, loading, error }
 */
export const useNavigationTree = (staticNavTree) => {
  const { categories, loading, error } = useServiceCategories();
  const [navTree, setNavTree] = useState(staticNavTree);

  useEffect(() => {
    if (!loading && categories.length > 0) {
      // Находим узел "services" в статичном дереве
      const servicesNode = staticNavTree.children?.find(
        child => child.id === 'services'
      );

      if (servicesNode) {
        // Преобразуем API данные в формат NAV_TREE
        const apiChildren = transformCategoriesToNavTree(categories);
        
        // Объединяем: сначала данные из API, потом статичные
        const mergedChildren = [
          ...apiChildren,
          ...(servicesNode.children || []).filter(
            child => !apiChildren.find(api => api.id === child.id)
          )
        ];

        // Создаем новое дерево с обновленным узлом services
        const updatedNavTree = {
          ...staticNavTree,
          children: staticNavTree.children.map(child => 
            child.id === 'services' 
              ? { ...child, children: mergedChildren }
              : child
          )
        };

        setNavTree(updatedNavTree);
      }
    }
  }, [categories, loading, staticNavTree]);

  return { 
    navTree, 
    loading, 
    error 
  };
};

/**
 * Hook для поиска категории в дереве по ID
 * @param {Object} navTree - Дерево навигации
 * @param {string} categoryId - ID категории
 * @returns {Object|null} Найденная категория или null
 */
export const useFindCategoryById = (navTree, categoryId) => {
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const findCategory = (node, id) => {
      if (node.id === id) return node;
      
      if (node.children) {
        for (const child of node.children) {
          const found = findCategory(child, id);
          if (found) return found;
        }
      }
      
      return null;
    };

    const found = findCategory(navTree, categoryId);
    setCategory(found);
  }, [navTree, categoryId]);

  return category;
};

/**
 * Пример использования:
 * 
 * // 1. Получить все категории
 * const { categories, loading, error } = useServiceCategories();
 * 
 * // 2. Получить детали конкретной категории
 * const { category } = useServiceCategoryDetail(
 *   ['notarialni-poslugy', 'dogovory'],
 *   'ua'
 * );
 * 
 * // 3. Использовать объединенное дерево навигации
 * import { NAV_TREE } from '@nav/nav-tree';
 * const { navTree, loading } = useNavigationTree(NAV_TREE);
 * 
 * // 4. Найти категорию по ID
 * const category = useFindCategoryById(navTree, 'apostille-documents');
 */

