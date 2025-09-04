import NotaryServices from "@components/NotaryServices/NotaryServices";
import Services from "@components/Services/Services";
// import Comments from "@components/Comments/Comments";
// import HowIWork from "@components/HowIWork/HowIWork";
import QuestionItem from "@components/Questions/Questions";
// import ReviewForm from "@components/ReviewForm/ReviewForm";
// import Form from "@components/Form/Form";
// import OftenQuestions from "@components/OftenQuestions/OftenQuestions";

import "./MilitaryPage.scss";

const MilitaryPage = () => {
  return (
    <>
      <div className="military-wrap">
        <NotaryServices
          title="Допомога військовим"
          listItems={[
            "дотримання всіх норм законодавства",
            "консультації онлайн або в офісі",
            "швидке оформлення документів",
          ]}
        />
      </div>
      <Services />
      <div className="questions">
        <div className="container">
          <QuestionItem
            title="Кваліфікована юридична допомога військовослужбовцям офлайн та онлайн."
            text="Апостиль («Apostille») – це спеціальний штамп на офіційних документах, які були складені на території України, яким засвідчуються справжність підпису, якість, в якій виступала особа, що підписала документ, та, у відповідному випадку, автентичність відбитку печатки або штампа, яким скріплено документ."
          />
          <QuestionItem
            title="Для яких країн проставляється апостиль документів"
            text="Апостиль документів визнають на будь-якому державному рівні в
            країнах-учасницях Гаазької Конвенції. В даний час цю Конвенцію
            підписали більше 136 держав, серед яких США, майже всі країни ЄС, а
            також Японія, Австралія."
          />
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
        </div>
      </div>
      {/* <HowIWork />
      <Comments />
      <ReviewForm />
      <Form />
      <OftenQuestions /> */}
    </>
  );
};

export default MilitaryPage;
