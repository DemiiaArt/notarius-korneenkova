import React, { createContext, useContext } from "react";

const HybridNavContext = createContext();

export const useHybridNav = () => {
  const context = useContext(HybridNavContext);
  if (!context) {
    throw new Error("useHybridNav must be used within a HybridNavProvider");
  }
  return context;
};

export const HybridNavProvider = ({ children, value }) => {
  return (
    <HybridNavContext.Provider value={value}>
      {children}
    </HybridNavContext.Provider>
  );
};
