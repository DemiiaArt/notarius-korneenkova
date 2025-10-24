import Seo from "@components/Seo/Seo";
import JsonLdSchema from "@components/Seo/JsonLdSchema";
import { useSeo } from "@hooks/useSeo";
import MainVideo from "@components/MainVideo/MainVideo";
import About from "@components/About/About";
import Skills from "@components/Skills/Skills";
import ServicesCarousel from "@components/ServicesCarousel/ServicesCarousel";
import Comments from "@components/Comments/Comments";
import ReviewForm from "@components/ReviewForm/ReviewForm";
import VideoBlock from "@components/VideoBock/VideoBlock";
import ServicesAccordion from "@components/ServicesAccordion/ServicesAccordion";
import Form from "@components/Form/Form";
import MainTextBlock from "@components/MainTextBlock/MainTextBlock";
import "./MainPage.scss";
const MainPage = ({ lang }) => {
  // SEO параметры для главной страницы
  const seoProps = useSeo({
    navId: "home",
    title: "Приватний нотаріус у Дніпрі — Надія Корнієнкова",
    description:
      "Нотаріальні послуги у Дніпрі: довіреності, договори, спадщина, апостиль, афідевіт. Пн–Чт 10:00–18:00, Пт 10:00–17:00. Дзвінок: +380 67 544 07 00.",
  });

  return (
    <>
      <Seo {...seoProps} />
      <JsonLdSchema apiUrl="/api/background-videos/" />
      <MainVideo lang={lang} />
      <About />
      <Skills />
      <ServicesCarousel parentId="services" title="Послуги" kind="group" />
      <Comments />
      <ReviewForm />
      <VideoBlock pageType="mainPage" />
      <ServicesAccordion />
      <Form />
      <MainTextBlock /> 
    </>
  );
};

export default MainPage;
