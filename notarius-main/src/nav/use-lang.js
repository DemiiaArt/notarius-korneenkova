import { useLocation, useNavigate } from "react-router-dom";

const LANGS = ["ua", "ru", "en"];

export function useLang() {
  const location = useLocation();
  const navigate = useNavigate();
  const match = location.pathname.match(/^\/(ru|en)(?=\/|$)/);
  const currentLang = match ? match[1] : "ua";

  const setLang = (newLang) => {
    if (!LANGS.includes(newLang)) return;
    const path = location.pathname;
    if (newLang === "ua") {
      const p = path.replace(/^\/(ru|en)(?=\/|$)/, "") || "/";
      navigate(p + location.search + location.hash);
      return;
    }
    if (currentLang === "ua") {
      navigate(`/${newLang}${path}${location.search}${location.hash}`);
    } else {
      navigate(
        path.replace(/^\/(ru|en)(?=\/|$)/, `/${newLang}`) +
          location.search +
          location.hash
      );
    }
  };

  return { currentLang, setLang };
}
