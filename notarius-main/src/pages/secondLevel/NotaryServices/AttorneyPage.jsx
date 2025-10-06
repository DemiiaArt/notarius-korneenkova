import NotaryServices from "@components/NotaryServices/NotaryServices";
import GroupServicesCarousel from "@components/GroupServicesCarousel/GroupServicesCarousel";
import Comments from "@components/Comments/Comments";
import HowIWork from "@components/HowIWork/HowIWork";
import ReviewForm from "@components/ReviewForm/ReviewForm";
import Form from "@components/Form/Form";
import contentImg from "@media/text-content-img.png";

import OftenQuestions from "@components/OftenQuestions/OftenQuestions";
import { useIsPC } from "@hooks/isPC";

const content = [
  {
    type: "paragraph",
    text: `Нотаріальні послуги — це комплекс дій, що надаються нотаріусом з
    метою надання юридичної сили документам та угодам, захисту прав
    і законних інтересів громадян і юридичних осіб. Основна мета
    нотаріуса — гарантувати законність, достовірність і безпеку
    угод, а також запобігти спорам у майбутньому.`,
  },
  {
    type: "paragraph",
    text: `Нотаріальні послуги в Україні займають особливе місце серед юридичних процедур, адже вони гарантують правову захищеність громадян та юридичних осіб у найрізноманітніших сферах життя. Основна мета нотаріату полягає у забезпеченні законності, достовірності та безпеки документів і угод, які укладають люди. Саме нотаріус виступає своєрідним гарантом прав та обов’язків сторін, підтверджуючи їх волю та законність дій.`,
  },
  {
    type: "title",
    text: "Навіщо потрібен нотаріус?",
  },
  {
    type: "paragraph",
    text: `Звернення до нотаріуса дозволяє уникнути багатьох суперечок і
    непорозумінь у майбутньому. Від посвідчення договорів та
    заповітів до оформлення довіреностей та заяв, нотаріальні
    послуги охоплюють широкий спектр потреб. Кожна дія, здійснена
    нотаріусом, набуває юридичної сили, а документи, завірені ним,
    визнаються чинними перед державними органами, судами та іншими
    установами.`,
  },
  {
    type: "list",
    items: [
      "Юридична сила документів.",
      "Захист прав та інтересів.",
      "Спокій та впевненість.",
    ],
  },
  {
    type: "image",
    src: contentImg,
    alt: "text-content-img",
  },
  {
    type: "paragraph",
    text: `Звернення до нотаріуса дозволяє уникнути багатьох суперечок і
    непорозумінь у майбутньому. Від посвідчення договорів та
    заповітів до оформлення довіреностей та заяв, нотаріальні
    послуги охоплюють широкий спектр потреб. Кожна дія, здійснена
    нотаріусом, набуває юридичної сили, а документи, завірені ним,
    визнаються чинними перед державними органами, судами та іншими
    установами.`,
  },
];

const AttorneyPage = () => {
  const isPC = useIsPC();

  return (
    <>
      <NotaryServices
        title="Довіреності"
        listItems={[
          "дотримання всіх норм законодавства",
          "консультації онлайн або в офісі",
          "швидке оформлення документів",
        ]}
      />
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
                      <img src={block.src} alt={block.alt} />
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </article>
        </div>
      </div>
      <GroupServicesCarousel
        parentId="power-of-attorney"
        title="Категорії довіреностей"
      />
      <HowIWork />
      <Comments />
      <ReviewForm />
      <Form />
      <OftenQuestions />
    </>
  );
};

export default AttorneyPage;
