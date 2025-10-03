/**
 * Hook для работы со страницей категории услуг
 * Получает данные категории на основе текущего URL
 */

import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { useServiceCategoryDetail } from './useServiceCategories';
import { detectLocaleFromPath } from '@nav/nav-utils';

/**
 * Hook для получения данных категории услуг на основе текущего URL
 * Автоматически извлекает slug'и из pathname и загружает данные
 * 
 * @returns {Object} { category, loading, error, lang, slugs }
 * 
 * @example
 * // На странице /ua/notarialni-poslugy/dogovory/dogovor-kupivli-prodazhu
 * const { category, loading } = useServiceCategoryPage();
 * 
 * if (loading) return <div>Загрузка...</div>;
 * 
 * return (
 *   <div>
 *     <h1>{category.label[lang]}</h1>
 *     <div dangerouslySetInnerHTML={{ __html: category.description[lang] }} />
 *   </div>
 * );
 */
export const useServiceCategoryPage = () => {
  const location = useLocation();
  const lang = detectLocaleFromPath(location.pathname);

  // Извлекаем slug'и из pathname
  const slugs = useMemo(() => {
    const path = location.pathname;
    
    // Удаляем начальный язык (/ua/, /ru/, /en/) и разбиваем на части
    const cleanPath = path.replace(/^\/(ua|ru|en)\//, '');
    const parts = cleanPath.split('/').filter(Boolean);
    
    return parts;
  }, [location.pathname]);

  // Загружаем данные категории
  const { category, loading, error, refetch } = useServiceCategoryDetail(slugs, lang);

  return {
    category,
    loading,
    error,
    refetch,
    lang,
    slugs
  };
};

/**
 * Пример использования в компоненте страницы:
 * 
 * import { useServiceCategoryPage } from '@hooks/useServiceCategoryPage';
 * 
 * function ServicePage() {
 *   const { category, loading, error, lang } = useServiceCategoryPage();
 *   
 *   if (loading) {
 *     return <div className="loading">Завантаження...</div>;
 *   }
 *   
 *   if (error) {
 *     return <div className="error">Помилка: {error}</div>;
 *   }
 *   
 *   if (!category) {
 *     return <div className="not-found">Категорію не знайдено</div>;
 *   }
 *   
 *   return (
 *     <div className="service-page">
 *       <h1>{category.label[lang]}</h1>
 *       <div 
 *         className="description"
 *         dangerouslySetInnerHTML={{ __html: category.description[lang] }} 
 *       />
 *     </div>
 *   );
 * }
 */

