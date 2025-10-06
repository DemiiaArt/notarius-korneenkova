import LeadsButton from "@components/LeadsButton/LeadsButton";
import About from "@components/About/About";
import AboutTextBlock from "@components/AboutTextBlock/AboutTextBlock";
import Skills from "@components/Skills/Skills";
import Goals from "@components/Goals/Goals";
import VideoBlock from "@components/VideoBock/VideoBlock";
import Form from "@components/Form/Form";
import Certificates from "@components/Certificates/Certificates";

import "./AboutPage.scss";

const AboutPage = () => {
  return (
    <>
      <div className="about-page">
        <About showBreadcrumbs />
      </div>
      <AboutTextBlock />
      <VideoBlock pageType="aboutPage" />
      <Skills />
      <Goals />
      <Form />
      <Certificates />
    </>
  );
};

export default AboutPage;
