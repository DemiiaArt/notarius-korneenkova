// src/components/ScrollToTop/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { scrollToTop } from "@utils/scroll";

export default function ScrollToTop({ behavior = "smooth", keepOnPop = true }) {
  const { pathname } = useLocation();
  const navType = useNavigationType(); // "PUSH" | "REPLACE" | "POP"

  useEffect(() => {
    if (keepOnPop && navType === "POP") return;

    // ждём реальный рендер новой страницы
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToTop(behavior);
      });
    });
  }, [pathname, navType, behavior, keepOnPop]);

  return null;
}
