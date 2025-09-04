import LeadsButton from "@components/LeadsButton/LeadsButton";
import MainVideo from "@components/MainVideo/MainVideo";
import About from "@components/About/About";
import Skills from "@components/Skills/Skills";
import Services from "@components/Services/Services";
import Comments from "@components/Comments/Comments";
import ReviewForm from "@components/ReviewForm/ReviewForm";
import VideoBlock from "@components/VideoBock/VideoBlock";
import ServicesAccordion from "@components/ServicesAccordion/ServicesAccordion";
import Form from "@components/Form/Form";

import "./MainPage.scss";

const MainPage = ({ skillsContent, lang }) => {
  return (
    <>
      <LeadsButton />
      <MainVideo lang={lang} />
        <About />
      <Skills skillsContent={skillsContent} />
      <Services />
      <Comments />
      <ReviewForm />
      <VideoBlock
        title="НАДІЯ — ВАША НАДІЙНА ОПОРА В НОТАРІАЛЬНІЙ СПРАВІ"
        description="Дізнайтеся більше про професійний шлях та цінності приватного нотаріуса Надії у короткому відеоінтерв’ю."
      />
      <ServicesAccordion />
      <Form />
    </>
  );
};

export default MainPage;
