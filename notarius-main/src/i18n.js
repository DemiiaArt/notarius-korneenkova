import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ua from "./locales/ua.json";
import en from "./locales/en.json";
import ru from "./locales/ru.json";

i18n.use(initReactI18next).init({
  resources: {
    ua: { translation: ua },
    en: { translation: en },
    ru: { translation: ru },
  },
  lng: "ua", // язык по умолчанию
  fallbackLng: "ua",
  interpolation: { escapeValue: false },
});

export default i18n;
