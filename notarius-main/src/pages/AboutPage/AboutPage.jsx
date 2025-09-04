import LeadsButton from "@components/LeadsButton/LeadsButton";
import About from "@components/About/About";
import AboutTextBlock from "@components/AboutTextBlock/AboutTextBlock";
import Skills from "@components/Skills/Skills";
import Goals from "@components/Goals/Goals";
import VideoBlock from "@components/VideoBock/VideoBlock";
import Form from "@components/Form/Form";
import Certificates from "@components/Certificates/Certificates";


import "./AboutPage.scss";

const AboutPage = ({ skillsContent }) => {
  return (
    <>
      <div className="about-page">
        <About showBreadcrumbs />
      </div>
      <AboutTextBlock />
      <VideoBlock
        title="Відео-знайомство з Надією"
        description="Дізнайтеся більше про професійний шлях та цінності приватного нотаріуса Надії у короткому відеоінтерв’ю."
      />
      <Skills skillsContent={skillsContent} />
      <Goals />
      <Form />
      <Certificates />
    </>
  );
};

export default AboutPage;
