import React, { createContext, useContext } from "react";
import { useHybridNavTree } from "../hooks/useHybridNavTree";

const HybridNavContext = createContext();

export const useHybridNav = () => {
  const context = useContext(HybridNavContext);
  if (!context) {
    throw new Error("useHybridNav must be used within a HybridNavProvider");
  }
  return context;
};

export const HybridNavProvider = ({ children }) => {
  try {
    const hybridNavData = useHybridNavTree();

    return (
      <HybridNavContext.Provider value={hybridNavData}>
        {children}
      </HybridNavContext.Provider>
    );
  } catch (error) {
    console.error("Error in HybridNavProvider:", error);
    // Возвращаем fallback провайдер с базовыми данными
    const fallbackData = {
      navTree: null,
      loading: false,
      error: error.message,
      clearCache: () => {},
      mergeWithBackendData: () => Promise.resolve(null),
      backendTree: [],
      backendLoaded: false,
      mergeComplete: false,
    };

    return (
      <HybridNavContext.Provider value={fallbackData}>
        {children}
      </HybridNavContext.Provider>
    );
  }
};
