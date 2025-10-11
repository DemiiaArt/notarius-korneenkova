import Breadcrumbs from "@components/BreadCrumbs/BreadCrumbs";
import SimilarArticles from "@components/SimilarArticles/SimilarArticles";
import { normalizeAndConvertHtml } from "@/utils/html";
import { useIsPC } from "@hooks/isPC";

import "./TemplateBlogPage.scss";
import { BACKEND_BASE_URL } from "@/config/api";

/**
 * Универсальный шаблон страницы
 * @param {Object} props
 * @param {string} props.title - Заголовок страницы
 * @param {Array} props.content - Контент страницы
 *    [{
 *      type: "paragraph" | "title" | "image" | "list",
 *      text?: string,
 *      src?: string,
 *      alt?: string,
 *      items?: string[]
 *    }]
 * @param {string} [props.heroImgClass] - CSS класс для фонового изображения в hero-блоке
 * @param {string} [props.heroImage] - Путь к изображению для hero-блока
 * @param {Array} [props.tags] - Массив тегов статьи
 * @param {string} [props.publishDate] - Дата публикации статьи
 */
const TemplateBlogPage = ({
  title,
  content = "",
  heroImgClass,
  heroImage,
  tags = [],
  publishDate,
}) => {
  const isPC = useIsPC();
console.log(content)
  return (
    <div className="hero">
      <div className="hero-img-shadow-target">
        <div
          className={`hero-img ${heroImgClass || ""}`}
          style={heroImage ? { backgroundImage: `url(${BACKEND_BASE_URL}${heroImage})` } : {}}
        >
          <div className="container hero-container">
            <Breadcrumbs />
            <h1
              className={`fw-bold uppercase ${isPC ? "fs-p--40px" : "fs-p--24px"} c1 blog-title-h1`}
            >
              {title.split("\n").map((line, idx) => (
                <span key={idx}>
                  {line}
                  {idx !== title.split("\n").length - 1 &&
                    (isPC ? " " : <br />)}
                </span>
              ))}
            </h1>
          </div>
        </div>
        <div className="hero-img-shadow"></div>
      </div>

      <div className="template-text-content">
        <div className="container">
          <div className="article-wrapper">
            <article className="text-content">
            {content && (
              <div
                className="text-content-html"
                dangerouslySetInnerHTML={{
                  __html: normalizeAndConvertHtml(content),
                }}
              />
            )}

              {/* Дата публикации */}
              {publishDate && (
                <p
                  className={`text-content-date ${isPC ? "fs-p--20px" : "fs-p--14px"} c14`}
                >
                  {publishDate}
                </p>
              )}
            </article>

            {/* Теги статьи */}
            {tags.length > 0 && (
              <div className="article-tags">
                {tags.map((tag, index) => (
                  <span key={index} className="article-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Свайпер с похожими статьями */}
      <SimilarArticles />
    </div>
  );
};

export default TemplateBlogPage;
