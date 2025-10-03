/**
 * React Context Provider для управления навигационным деревом
 * Предоставляет статичное навигационное дерево
 */

import React, { createContext } from 'react';
import { NAV_TREE } from './nav-tree';

export const NavContext = createContext({
  navTree: NAV_TREE,
  loading: false,
  error: null
});

/**
 * Provider для навигационного дерева
 * Предоставляет статичное дерево навигации из NAV_TREE
 */
export const NavProvider = ({ children }) => {
  return (
    <NavContext.Provider value={{ 
      navTree: NAV_TREE, 
      loading: false, 
      error: null 
    }}>
      {children}
    </NavContext.Provider>
  );
};

