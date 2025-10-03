/**
 * Hook для использования навигационного дерева из контекста
 */

import { useContext } from 'react';
import { NavContext } from './NavProvider';

/**
 * Hook для использования навигационного дерева
 * @returns {Object} { navTree, loading, error, refetch }
 * 
 * @example
 * import { useNav } from '@nav/useNav';
 * 
 * function MyComponent() {
 *   const { navTree, loading } = useNav();
 *   
 *   if (loading) return <div>Загрузка...</div>;
 *   
 *   return <Navigation tree={navTree} />;
 * }
 */
export const useNav = () => {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error('useNav must be used within NavProvider');
  }
  return context;
};

