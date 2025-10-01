
import Breadcrumbs from "@components/BreadCrumbs/BreadCrumbs";
import SimilarArticles from "@components/SimilarArticles/SimilarArticles";

import { useIsPC } from "@hooks/isPC";

import "./TemplateBlogPage.scss";

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
const TemplateBlogPage = ({ title, content = [], heroImgClass, heroImage, tags = [], publishDate }) => {
  const isPC = useIsPC();

  return (
    <div className="hero">
      <div className="hero-img-shadow-target">
        <div 
          className={`hero-img ${heroImgClass || ""}`}
          style={heroImage ? { backgroundImage: `url(${heroImage})` } : {}}
        >
          <div className="container hero-container">
            <Breadcrumbs />
            <h1 className={`fw-bold uppercase ${isPC ? "fs-p--40px" : "fs-p--24px"} c1 blog-title-h1`}>
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
            {content.map((block, i) => {
              switch (block.type) {
                case "paragraph":
                  return (
                    <p
                      key={i}
                      className={`text-content-text lh-150 ${
                        isPC ? "fs-p--16px" : "fs-p--14px"
                      }`}
                    >
                      {block.text}
                    </p>
                  );
                case "title":
                  return (
                    <h2
                      key={i}
                      className={`text-content-title ${
                        isPC ? "fs-p--32px" : "fs-p--18px"
                      } fw-semi-bold lh-100`}
                    >
                      {block.text}
                    </h2>
                  );
                case "list":
                  return (
                    <ul
                      key={i}
                      className={`text-content-list lh-150 ${
                        isPC ? "fs-p--16px" : "fs-p--14px"
                      }`}
                    >
                      {block.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  );
                case "image":
                  return (
                    <div key={i} className="text-content-image">
                      <img src={block.src} alt={block.alt || ""} />
                    </div>
                  );
                default:
                  return null;
              }
            })}
            
            {/* Дата публикации */}
            {publishDate && (
              <p className={`text-content-date ${isPC ? "fs-p--20px" : "fs-p--14px"} c14`}>
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
