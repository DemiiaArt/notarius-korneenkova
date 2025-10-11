import { Helmet } from "@vuer-ai/react-helmet-async";
import { useLocation } from "react-router-dom";
import { useLang } from "@nav/use-lang";

/**
 * SEO компонент для управления метатегами, title, lang и hreflang
 * Работает с данными из backend (title и description приходят с сервера)
 *
 * @param {Object} props
 * @param {string} props.title - Заголовок страницы (БЕЗ добавления "| Нотаріус Надія")
 * @param {string} props.description - Описание страницы
 * @param {string} [props.ogImage] - Open Graph изображение (опционально)
 * @param {string} [props.ogType="website"] - Open Graph тип (website/article)
 * @param {boolean} [props.noSuffix=false] - Не добавлять суффикс к title
 * @param {Object} [props.customMeta] - Дополнительные метатеги
 *
 * @example
 * // Простое использование
 * <Seo
 *   title="Приватний нотаріус у Дніпрі — Надія Корнієнкова"
 *   description="Нотаріальні послуги у Дніпрі..."
 * />
 *
 * @example
 * // Для статей блога
 * <Seo
 *   title={article.seo_title}
 *   description={article.seo_description}
 *   ogImage={article.hero_image}
 *   ogType="article"
 *   noSuffix={true}
 * />
 */
const Seo = ({
  title,
  description,
  ogImage,
  ogType = "website",
  noSuffix = false,
  customMeta = {},
}) => {
  const location = useLocation();
  const { currentLang } = useLang();

  // Базовый URL сайта
  const SITE_URL =
    import.meta.env.VITE_SITE_URL || "https://notarius-korneenkova.com.ua/";

  // Текущий полный URL
  const currentUrl = `${SITE_URL}${location.pathname}`;

  // Определяем язык для HTML тега (ua -> uk для корректности)
  const htmlLang = currentLang === "ua" ? "uk" : currentLang;

  // Генерация альтернативных URL для всех языков
  const getAlternateUrl = (lang) => {
    const pathname = location.pathname;

    // Убираем языковой префикс из пути
    let basePath = pathname;
    if (pathname.startsWith("/ru/")) {
      basePath = pathname.replace("/ru/", "/");
    } else if (pathname.startsWith("/en/")) {
      basePath = pathname.replace("/en/", "/");
    }

    // Добавляем новый языковой префикс
    if (lang === "ua") {
      return `${SITE_URL}${basePath}`;
    } else if (lang === "ru") {
      return `${SITE_URL}/ru${basePath}`;
    } else if (lang === "en") {
      return `${SITE_URL}/en${basePath}`;
    }
    return `${SITE_URL}${basePath}`;
  };

  // Title: либо как есть (если noSuffix=true), либо с суффиксом
  const fullTitle = noSuffix
    ? title
    : title || "Приватний нотаріус у Дніпрі — Надія Корнієнкова";

  // Изображение для Open Graph
  const getOgImageUrl = () => {
    if (!ogImage) {
      // Изображение по умолчанию
      return `${SITE_URL}/og-default.jpg`;
    }
    // Если изображение уже с полным URL
    if (ogImage.startsWith("http")) {
      return ogImage;
    }
    // Если относительный путь
    return ogImage.startsWith("/")
      ? `${SITE_URL}${ogImage}`
      : `${SITE_URL}/${ogImage}`;
  };

  const ogImageUrl = getOgImageUrl();

  // Локаль для Open Graph
  const getOgLocale = () => {
    switch (htmlLang) {
      case "uk":
        return "uk_UA";
      case "ru":
        return "ru_RU";
      case "en":
        return "en_US";
      default:
        return "uk_UA";
    }
  };

  return (
    <Helmet>
      {/* Устанавливаем язык HTML документа */}
      <html lang={htmlLang} />

      {/* Основные метатеги */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Hreflang теги для мультиязычности */}
      <link rel="alternate" hrefLang="uk" href={getAlternateUrl("ua")} />
      <link rel="alternate" hrefLang="ru" href={getAlternateUrl("ru")} />
      <link rel="alternate" hrefLang="en" href={getAlternateUrl("en")} />
      <link rel="alternate" hrefLang="x-default" href={getAlternateUrl("ua")} />

      {/* Open Graph теги */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:locale" content={getOgLocale()} />
      <meta property="og:site_name" content="Нотаріус Надія Корнієнкова" />

      {/* Open Graph альтернативные локали */}
      {htmlLang === "uk" && (
        <meta property="og:locale:alternate" content="ru_RU" />
      )}
      {htmlLang === "uk" && (
        <meta property="og:locale:alternate" content="en_US" />
      )}
      {htmlLang === "ru" && (
        <meta property="og:locale:alternate" content="uk_UA" />
      )}
      {htmlLang === "ru" && (
        <meta property="og:locale:alternate" content="en_US" />
      )}
      {htmlLang === "en" && (
        <meta property="og:locale:alternate" content="uk_UA" />
      )}
      {htmlLang === "en" && (
        <meta property="og:locale:alternate" content="ru_RU" />
      )}

      {/* Twitter Card теги */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />

      {/* Дополнительные метатеги */}
      {Object.entries(customMeta).map(([name, content]) => (
        <meta key={name} name={name} content={content} />
      ))}

      {/* Мобильные метатеги */}
      <meta name="theme-color" content="#ffffff" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    </Helmet>
  );
};

export default Seo;
