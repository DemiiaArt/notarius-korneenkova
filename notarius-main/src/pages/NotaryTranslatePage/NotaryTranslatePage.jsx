import { lazy, Suspense, memo } from "react";
import NotaryServices from "@components/NotaryServices/NotaryServices";
import ServicesCarousel from "@components/ServicesCarousel/ServicesCarousel";
import "./NotaryTranslatePage.scss";

import { useIsPC } from "@hooks/isPC";
import contentImg from "@media/text-content-img.png";
import GroupServicesCarousel from "@components/GroupServicesCarousel/GroupServicesCarousel";

// Lazy load heavy components
const Comments = lazy(() => import("@components/Comments/Comments"));
const HowIWork = lazy(() => import("@components/HowIWork/HowIWork"));
const Questions = lazy(() => import("@components/Questions/Questions"));
const ReviewForm = lazy(() => import("@components/ReviewForm/ReviewForm"));
const Form = lazy(() => import("@components/Form/Form"));
const OftenQuestions = lazy(
  () => import("@components/OftenQuestions/OftenQuestions")
);
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

const NotaryTranslatePage = memo(() => {
  const isPC = useIsPC();

  return (
    <>
      <div className="translate-wrap">
        <NotaryServices
          title="НОТАРІАЛЬНИЙ ПЕРЕКЛАД"
          listItems={[
            "дотримання всіх норм законодавства",
            "консультації онлайн або в офісі",
            "швидке оформлення документів",
          ]}
        />
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
                      <img src={block.src} alt={block.alt} loading="lazy" />
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
        parentId={"notary-translate"}
        title="Послуги перекладу"
      />
      {/* <ServicesCarousel parentId="services" title="Інші послуги" /> */}
      {/* <Questions /> */}
      <Suspense fallback={<div>Завантаження...</div>}>
        <HowIWork />
      </Suspense>
      <Suspense fallback={<div>Завантаження...</div>}>
        <Comments />
      </Suspense>
      <Suspense fallback={<div>Завантаження...</div>}>
        <ReviewForm />
      </Suspense>
      <Suspense fallback={<div>Завантаження...</div>}>
        <Form />
      </Suspense>
      <Suspense fallback={<div>Завантаження...</div>}>
        <OftenQuestions />
      </Suspense>
    </>
  );
});

export default NotaryTranslatePage;
