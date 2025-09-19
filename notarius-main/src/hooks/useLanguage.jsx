import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import i18n from "../i18n";

const LanguageContext = createContext();

export const LanguageProvider = ({ children, defaultLanguage = "ua" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [lang, setLang] = useState(defaultLanguage);

  //Синхронизация i18n при смене языка
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);
};
