import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";

const LANGS = ["ua", "ru", "en"];

export function useLang() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentLang, switchLanguage } = useLanguage();

  // Совместимость со старой системой
  const setLang = (newLang) => {
    if (!LANGS.includes(newLang)) return;
    switchLanguage(newLang);
  };

  return { currentLang, setLang };
}
