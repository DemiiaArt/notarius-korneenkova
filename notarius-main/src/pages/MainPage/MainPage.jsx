import MainVideo from "@components/MainVideo/MainVideo";
import About from "@components/About/About";
import Skills from "@components/Skills/Skills";
import ServicesCarousel from "@components/ServicesCarousel/ServicesCarousel";
import Comments from "@components/Comments/Comments";
import ReviewForm from "@components/ReviewForm/ReviewForm";
import VideoBlock from "@components/VideoBock/VideoBlock";
import ServicesAccordion from "@components/ServicesAccordion/ServicesAccordion";
import Form from "@components/Form/Form";

import "./MainPage.scss";
const MainPage = ({ lang }) => {
  return (
    <>
      <MainVideo lang={lang} />
      <About />
      <Skills />
      <ServicesCarousel parentId="services" title="Послуги" kind="group" />
      <Comments />
      <ReviewForm />
      <VideoBlock pageType="mainPage" />
      <ServicesAccordion />
      <Form />
    </>
  );
};

export default MainPage;
