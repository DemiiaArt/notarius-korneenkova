import Services from "@components/Services/Services";
import Form from "@components/Form/Form";
import OftenQuestions from "@components/OftenQuestions/OftenQuestions";
import Breadcrumbs from "@components/BreadCrumbs/BreadCrumbs";

import { useIsPC } from "@hooks/isPC";

import "./TemplatePage.scss";

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
 */
const TemplatePage = ({ title, content = [], heroImgClass }) => {
  const isPC = useIsPC();

  return (
    <div className="hero">
      <div className="hero-img-shadow-target">
        <div className={`hero-img ${heroImgClass || ''}`}>
          <div className="container hero-container">
            <Breadcrumbs />
            <h1
              className={`fw-bold ${
                isPC ? "fs-p--40px" : "fs-p--24px"
              } c1`}
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
          </article>
        </div>
      </div>

      <Services />
      <OftenQuestions />
      <Form />
    </div>
  );
};

export default TemplatePage;