import { useLocation } from "react-router-dom";

export default function LanguageSwitcher({ lang }) {
  const location = useLocation();

  const switchLang = (newLang) => {
    const pathname = location.pathname;

    if (newLang === "ua") {
      return pathname.replace(/^\/(en|ru)(?=\/|$)/, "") || "/";
    }
    if (lang === "ua") {
      return `/${newLang}${pathname}`;
    }
    return pathname.replace(/^\/(en|ru)(?=\/|$)/, `/${newLang}`);
  };

  return (
    <nav>
      <a href={switchLang("ua")}>UA</a> | <a href={switchLang("en")}>EN</a> |{" "}
      <a href={switchLang("ru")}>RU</a>
    </nav>
  );
}
