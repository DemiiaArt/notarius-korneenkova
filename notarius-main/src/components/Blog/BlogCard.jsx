import { useIsPC } from "@hooks/isPC";
import OptimizedImage from "@components/OptimizedImage/OptimizedImage";
import { Link } from "react-router-dom";
import { BACKEND_BASE_URL, buildMediaUrl } from "@/config/api";
import { useLanguage } from "@hooks/useLanguage";
import "./BlogCard.scss";

const BlogCard = ({
  // Поддержка старого API
  title,
  text,
  date,
  image,
  link = "#",
  onClick,
  // Поддержка нового API
  slug,
  excerpt,
  cover,
  hero_image,
  published_at,
  categories,
  // Настройки отображения
  maxTextLength = 80, // Максимальная длина текста
}) => {
  const isPC = useIsPC();
  const { currentLang } = useLanguage();

  // Определяем данные для отображения
  const displayTitle = title || "Без назви";
  const displayDate = date || published_at || "";

  // Обрабатываем текст с обрезанием
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  // Адаптивная длина текста в зависимости от размера экрана
  const adaptiveMaxLength = isPC
    ? maxTextLength
    : Math.floor(maxTextLength * 0.8);

  const rawText = text || excerpt || "";
  const displayText = truncateText(rawText, adaptiveMaxLength);

  // Логирование для отладки (можно убрать в продакшене)
  if (rawText.length > adaptiveMaxLength) {
    console.log(
      `✂️ Текст обрезан: ${rawText.length} → ${displayText.length} символов`
    );
  }

  // Обрабатываем изображение для карточки
  const displayImage = (() => {
    if (image) return image;
    
    if (cover) {
      return buildMediaUrl(cover);
    }
    if (hero_image) {
      return buildMediaUrl(hero_image);
    }
    return null;
  })();

  // Формируем ссылку с учетом языка
  const getBlogLink = () => {
    if (link !== "#") return link;
    if (!slug) return "#";

    // Определяем slug блога в зависимости от языка
    const blogSlug = currentLang === "en" ? "notary-blog" : "notarialni-blog";

    // Определяем префикс языка
    const langPrefix = currentLang === "ua" ? "" : `/${currentLang}`;

    return `${langPrefix}/${blogSlug}/${slug}`;
  };

  const displayLink = getBlogLink();

  // Форматируем дату
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  const cardContent = (
    <>
      {displayImage && (
        <OptimizedImage src={displayImage} alt={displayTitle || "Blog Card"} />
      )}
      {displayTitle && (
        <h2
          className={`blog-card-title ${isPC ? "fs-p--28px" : "fs-p--24px"} fw-bold uppercase c3`}
        >
          {displayTitle}
        </h2>
      )}
      {displayText && (
        <p
          className={`blog-card-text ${isPC ? "fs-p--16px" : "fs-p--14px fw-regular"} lh-150 `}
        >
          {displayText}
        </p>
      )}
      {displayDate && (
        <p
          className={`blog-card-date ${isPC ? "fs-p--20px" : "fs-p--16px"} fw-regular lh-150 `}
        >
          {formatDate(displayDate)}
        </p>
      )}
    </>
  );

  return (
    <div
      className="blog-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick(e);
        }
      }}
      aria-label={`Перейти к статье: ${displayTitle}`}
    >
      {displayLink && displayLink !== "#" ? (
        <Link to={displayLink} className="blog-card-link">
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
    </div>
  );
};

export default BlogCard;
