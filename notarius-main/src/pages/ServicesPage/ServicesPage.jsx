import NotaryServices from "@components/NotaryServices/NotaryServices";
import Services from "@components/Services/Services";
import Comments from "@components/Comments/Comments";
import HowIWork from "@components/HowIWork/HowIWork";
import Questions from "@components/Questions/Questions";
import ReviewForm from "@components/ReviewForm/ReviewForm";
import Form from "@components/Form/Form";
import "./ServicesPage.scss";
import OftenQuestions from "@components/OftenQuestions/OftenQuestions";

const ServicesPage = () => {
  return (
    <>
      <NotaryServices
        title="Нотаріальні послуги"
        listItems={[
          "дотримання всіх норм законодавства",
          "консультації онлайн або в офісі",
          "швидке оформлення документів",
        ]}
      />
      <Services />
      <Questions />
      <HowIWork />
      <Comments />
      <ReviewForm />
      <Form />
      <OftenQuestions />
    </>
  );
};

export default ServicesPage;
