import ServicesCarousel from "@components/ServicesCarousel/ServicesCarousel";
import QuestionItem from "@components/Questions/QuestionItem.jsx";
import Form from "@components/Form/Form";
import OftenQuestions from "@components/OftenQuestions/OftenQuestions";
import Breadcrumbs from "@components/BreadCrumbs/BreadCrumbs";

import { useIsPC } from "@hooks/isPC";
import "./ApostillePage.scss";
import apostilleTextImg from "../../assets/media/Apostille.jpeg";

const Apostille = () => {
  const isPC = useIsPC();
  return (
    <div className="hero">
      <div className="hero-img">
        <div className="container">
          <Breadcrumbs />
          <h1 className={`fw-bold ${isPC ? "fs-p--40px" : "fs-p--24px"} c1`}>
            Апостиль
            {isPC ? " " : <br />}
            на документи
          </h1>
        </div>
      </div>
      <div className="questions">
        <div className="container">
          <QuestionItem
            title="Що таке апостиль документів?"
            text="Апостиль («Apostille») – це спеціальний штамп на офіційних
            документах, які були складені на території України, яким
            засвідчуються справжність підпису, якість, в якій виступала особа,
            що підписала документ, та, у відповідному випадку, автентичність
            відбитку печатки або штампа, яким скріплено документ."
          />
          <QuestionItem
            title="Для яких країн проставляється апостиль документів"
            text="Апостиль документів визнають на будь-якому державному рівні в
            країнах-учасницях Гаазької Конвенції. В даний час цю Конвенцію
            підписали більше 136 держав, серед яких США, майже всі країни ЄС, а
            також Японія, Австралія."
          />
          <article className="questions-article img-question">
            <h2
              className={`questions-article-title ${
                isPC ? "fs-p--32px" : "fs-p--18px"
              } fw-semi-bold lh-100`}
            >
              На які документи можна поставити апостиль?
            </h2>
            <div className="apostille-content">
              <p
                className={`questions-article-text lh-150 ${
                  isPC ? "fs-p--18px" : "fs-p--14px"
                }`}
              >
                Апостиль документів визнають на будь-якому державному рівні в
                країнах-учасницях Гаазької Конвенції. В даний час цю Конвенцію
                підписали більше 136 держав, серед яких США, майже всі країни
                ЄС, а також Японія, Австралія.
              </p>
            </div>
            <img
              src={apostilleTextImg}
              alt="Апостиль документ"
              className="apostille-img"
            ></img>
            <div className="apostille-content content-pass">
              <ul
                className={`question-list lh-150 ${isPC ? "fs-p--18px" : "fs-p--14px"} `}
              >
                <li>Свідоцтва про народження, шлюб, розлучення</li>
                <li>Дипломи, атестати, довідки з навчальних закладів</li>
                <li>Довідки про несудимість</li>
                <li>Нотаріально завірені доручення, договори</li>
                <li>Судові та фінансові документи</li>
              </ul>
              <p
                className={`questions-article-text lh-150 ${
                  isPC ? "fs-p--18px" : "fs-p--14px"
                }`}
              >
                Апостиль документів визнають на будь-якому державному рівні в
                країнах-учасницях Гаазької Конвенції. В даний час цю Конвенцію
                підписали більше 136 держав, серед яких США, майже всі країни
                ЄС, а також Японія, Австралія.
              </p>
            </div>
          </article>
          <QuestionItem
            title="Для яких країн проставляється апостиль документів"
            text="Апостиль документів визнають на будь-якому державному рівні в
            країнах-учасницях Гаазької Конвенції. В даний час цю Конвенцію
            підписали більше 136 держав, серед яких США, майже всі країни ЄС, а
            також Японія, Австралія."
          />
        </div>
      </div>
      <ServicesCarousel parentId="services" title="Інші послуги" kind="group" />
      <OftenQuestions />
      <Form />
    </div>
  );
};

export default Apostille;
