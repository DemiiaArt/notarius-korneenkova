import "./Goals.scss";
import { useIsPC } from "@hooks/isPC";
import { useTranslation } from "@hooks/useTranslation";

const Goals = () => {
  const isPC = useIsPC();
  const { getTranslations } = useTranslation("components.Goals");

  // Получаем переводы для компонента
  const translations = getTranslations();
  const { title, goals } = translations;

  // Используем переводы или fallback на украинские тексты
  const goalsContent = {
    part1: {
      title: goals?.part1?.title || "Захист",
      text:
        goals?.part1?.text ||
        "Допомагати українцям у світі залишатися сильними та захищеними.",
    },
    part2: {
      title: goals?.part2?.title || "Опора",
      text:
        goals?.part2?.text ||
        "Бути точкою опори для людей у складних життєвих питаннях. Створювати відчуття впевненості там, де панує невизначеність.",
    },
    part3: {
      title: goals?.part3?.title || "Простір",
      text:
        goals?.part3?.text ||
        "Створити простір, де правові послуги — це не лише про документи, а й про довіру, розвиток і ясність.",
    },
  };
  return (
    <div className="goals">
      <div className="container">
        <div className="goals-wrapper">
          <h2
            className={`goals-title ${isPC ? "fs-h2--32px" : "fs-h2--20px"} fw-bold uppercase c1`}
          >
            {title || "Цілі та ідеї"}
          </h2>
          <div className="goals-wrap c1">
            <GoalCard textData={goalsContent.part1} />
            <GoalCard textData={goalsContent.part2} />
            <GoalCard textData={goalsContent.part3} />
          </div>
        </div>
      </div>
    </div>
  );
};

const GoalCard = ({ textData }) => {
  const isPC = useIsPC();
  if (!textData) return <p>no content</p>;
  const { title, text } = textData;

  return (
    <div className="goal-card">
      <p
        className={`goal-card-title ${isPC ? "fs-p--24px" : "fs-p--18px"} fw-semi-bold uppercase`}
      >
        {title}
      </p>
      <p className={`${isPC ? "fs-p--18px" : "fs-p--14px"}  lh-150`}>{text}</p>
    </div>
  );
};

export default Goals;
