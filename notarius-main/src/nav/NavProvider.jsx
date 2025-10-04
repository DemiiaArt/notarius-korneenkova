/**
 * React Context Provider для управления навигационным деревом
 * Загружает динамическую навигацию из API и объединяет со статичными элементами
 */

import React, { createContext, useState, useEffect } from 'react';
import { NAV_TREE } from './nav-tree';
import { apiClient } from '@/config/api';

export const NavContext = createContext({
  navTree: NAV_TREE,
  loading: false,
  error: null
});

/**
 * Provider для навигационного дерева
 * Загружает категории услуг из API и объединяет их со статичными элементами
 */
export const NavProvider = ({ children }) => {
  const [navTree, setNavTree] = useState(NAV_TREE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDynamicNavigation = async () => {
      try {
        console.log('🔄 NavProvider: Loading navigation from API...');
        setLoading(true);
        setError(null);
        
        // Загружаем динамическую навигацию из API
        const apiData = await apiClient.get('/services/');
        console.log('✅ NavProvider: API response received:', apiData);
        
        // API возвращает полную структуру с корнем
        if (apiData && apiData.children) {
          console.log('✅ NavProvider: Using API data');
          setNavTree(apiData);
        } else {
          console.warn('⚠️ NavProvider: API response invalid, using static nav');
          setNavTree(NAV_TREE);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('❌ NavProvider: Error loading navigation:', err);
        setError(err.message);
        // Fallback на статическую навигацию при ошибке
        setNavTree(NAV_TREE);
        setLoading(false);
      }
    };

    loadDynamicNavigation();
  }, []);

  return (
    <NavContext.Provider value={{ 
      navTree, 
      loading, 
      error 
    }}>
      {children}
    </NavContext.Provider>
  );
};

