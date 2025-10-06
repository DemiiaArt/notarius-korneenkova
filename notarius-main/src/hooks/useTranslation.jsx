import { useContext, useMemo } from "react";
import { LanguageContext } from "./useLanguage";

// Импортируем файлы переводов
import uaTranslations from "../locales/ua.json";
import ruTranslations from "../locales/ru.json";
import enTranslations from "../locales/en.json";

// Объект со всеми переводами
const translations = {
  ua: uaTranslations,
  ru: ruTranslations,
  en: enTranslations,
};

/**
 * Хук для работы с переводами
 * @param {string} namespace - пространство имен (например, "components.HowIWork")
 * @returns {object} объект с функциями для работы с переводами
 */
export const useTranslation = (namespace = "") => {
  const { currentLang } = useContext(LanguageContext);

  // Получаем переводы для текущего языка
  const currentTranslations = useMemo(() => {
    return translations[currentLang] || translations.ua;
  }, [currentLang]);

  // Функция для получения перевода по ключу
  const t = (key) => {
    if (!namespace) {
      return getNestedValue(currentTranslations, key) || key;
    }

    const fullKey = `${namespace}.${key}`;
    return getNestedValue(currentTranslations, fullKey) || key;
  };

  // Функция для получения всех переводов для namespace
  const getTranslations = (ns) => {
    const targetNamespace = ns || namespace;
    return getNestedValue(currentTranslations, targetNamespace) || {};
  };

  return {
    t,
    getTranslations,
    currentLang,
  };
};

/**
 * Вспомогательная функция для получения значения по вложенному ключу
 * @param {object} obj - объект для поиска
 * @param {string} path - путь к значению (например, "components.HowIWork.title")
 * @returns {any} найденное значение или undefined
 */
const getNestedValue = (obj, path) => {
  if (!obj || !path) return undefined;

  const keys = path.split(".");
  let result = obj;

  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = result[key];
    } else {
      return undefined;
    }
  }

  return result;
};

export default useTranslation;
