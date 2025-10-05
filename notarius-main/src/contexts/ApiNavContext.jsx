import React, { createContext, useContext, useState, useEffect } from "react";
import { useApiNavTree } from "../hooks/useApiNavTree";
import { attachComponentsToTree } from "../nav/component-registry";
import { updateIndices } from "../nav/indices";

const ApiNavContext = createContext();

export const useApiNav = () => {
  const context = useContext(ApiNavContext);
  if (!context) {
    throw new Error("useApiNav must be used within an ApiNavProvider");
  }
  return context;
};

export const ApiNavProvider = ({ children }) => {
  const { navTree, loading, error, refreshNavTree, clearCache } =
    useApiNavTree();
  const [currentLang, setCurrentLang] = useState("ua");
  const [navTreeWithComponents, setNavTreeWithComponents] = useState(null);

  // Прикріпляємо компоненти до навігаційного дерева та оновлюємо індекси
  useEffect(() => {
    if (navTree) {
      try {
        const treeWithComponents = attachComponentsToTree(navTree);
        setNavTreeWithComponents(treeWithComponents);

        // Оновлюємо індекси на основі нового навігаційного дерева
        updateIndices(navTree);
      } catch (err) {
        console.error("Error attaching components to nav tree:", err);
        setNavTreeWithComponents(navTree); // Використовуємо без компонентів

        // Оновлюємо індекси навіть якщо не вдалося прикріпити компоненти
        updateIndices(navTree);
      }
    } else {
      setNavTreeWithComponents(null);
    }
  }, [navTree]);

  const value = {
    navTree: navTreeWithComponents,
    loading,
    error,
    currentLang,
    setCurrentLang,
    refreshNavTree,
    clearCache,
  };

  return (
    <ApiNavContext.Provider value={value}>{children}</ApiNavContext.Provider>
  );
};
