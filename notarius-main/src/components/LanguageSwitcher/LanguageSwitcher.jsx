import { useLanguage } from "../../hooks/useLanguage";
import "./LanguageSwitcher.scss";

export default function LanguageSwitcher({
  className = "",
  buttonClassName = "",
  activeClassName = "",
  variant = "default", // default, vertical, minimal
  showFullNames = false,
}) {
  const { currentLang, switchLanguage } = useLanguage();

  const languages = [
    { code: "ua", name: "UA", fullName: "Українська" },
    { code: "ru", name: "RU", fullName: "Русский" },
    { code: "en", name: "EN", fullName: "English" },
  ];

  const handleLanguageChange = (langCode) => {
    switchLanguage(langCode);
  };

  const baseClassName = `language-switcher ${className}`;
  const variantClassName =
    variant !== "default" ? `language-switcher--${variant}` : "";
  const finalClassName = `${baseClassName} ${variantClassName}`.trim();

  return (
    <nav className={finalClassName}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`language-switcher__button ${buttonClassName} ${
            currentLang === lang.code
              ? `language-switcher__button--active ${activeClassName}`
              : ""
          }`.trim()}
          title={showFullNames ? lang.fullName : undefined}
          type="button"
        >
          {showFullNames ? lang.fullName : lang.name}
        </button>
      ))}
    </nav>
  );
}
