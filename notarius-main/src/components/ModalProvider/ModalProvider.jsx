// ModalContext.jsx
import { createContext, useContext, useCallback, useState } from "react";

const ModalContext = createContext(null);
export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within <ModalProvider>");
  return ctx;
};

const ModalProvider = function ({ children }) {
  const [openModal, setOpenModal] = useState({
    freeConsult: false,
    freeOrder: false,
  });

  const open = useCallback((key) => {
    setOpenModal((prev) =>
      Object.fromEntries(Object.keys(prev).map((k) => [k, k === key]))
    );
  }, []);

  const close = useCallback((key) => {
    setOpenModal((prev) => ({ ...prev, [key]: false }));
  }, []);

  const toggle = useCallback((key) => {
    setOpenModal((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const closeAll = useCallback(() => {
    setOpenModal((prev) =>
      Object.fromEntries(Object.keys(prev).map((k) => [k, false]))
    );
  }, []);

  const getOpenModalState = (key) => openModal[key];

  return (
    <ModalContext.Provider
      value={{ openModal, open, close, toggle, closeAll, getOpenModalState }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
