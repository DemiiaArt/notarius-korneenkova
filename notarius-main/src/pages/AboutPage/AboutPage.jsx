import Seo from "@components/Seo/Seo";
import JsonLdSchema from "@components/Seo/JsonLdSchema";
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
      <Seo
        title="Про мене — Приватний нотаріус Надія Корнієнкова"
        description="Досвідчений нотаріус з багаторічною практикою в Дніпрі. Професійний підхід, індивідуальні консультації, швидке оформлення документів."
      />
      <JsonLdSchema apiUrl="/api/about-me/detail/" />
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
