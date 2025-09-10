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

  // Определение языка по URL
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/en')) {
      setLang('en');
    } else if (path.startsWith('/ru')) {
      setLang('ru');
    } else {
      setLang('ua');
    }
  }, [location.pathname]);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    i18n.changeLanguage(newLang);
    
    // Обновляем URL в зависимости от языка
    const currentPath = location.pathname;
    let newPath = currentPath;
    
    if (newLang === 'ua') {
      // Убираем префикс языка для украинского
      newPath = currentPath.replace(/^\/(en|ru)/, '') || '/';
    } else {
      // Добавляем или заменяем префикс языка
      if (currentPath.startsWith('/en') || currentPath.startsWith('/ru')) {
        newPath = currentPath.replace(/^\/(en|ru)/, `/${newLang}`);
      } else {
        newPath = `/${newLang}${currentPath}`;
      }
    }
    
    navigate(newPath);
  };

  return (
    <LanguageContext.Provider value={{ language: lang, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
