import "./OftenQuestions.scss";
import { useState, useEffect, useRef } from "react";
import { useIsPC } from "@hooks/isPC";
// Данные вынесены в отдельный массив
const oftenQuestionsData = [
  {
    title: "Які документи потрібні для початку співпраці з юристом?",
    text: "Зазвичай достатньо надати копії установчих документів (статут, виписка з ЄДР), ідентифікаційний код, паспорт (для фізосіб) або документи, що підтверджують повноваження представника компанії. Перелік може змінюватися залежно від ситуації.",
  },
  {
    title: "Скільки коштує юридичний супровід бізнесу?",
    text: "Ціна залежить від обсягу та складності робіт. Вартість розраховується індивідуально.",
  },
  {
    title:
      "Чим відрізняється абонентське юридичне обслуговування від разової консультації?",
    text: "Абонентське обслуговування передбачає постійну підтримку, а разова консультація вирішує конкретне питання.",
  },
  {
    title: "Чи можете ви представляти мої інтереси у суді?",
    text: "Так, наші юристи мають право представляти клієнтів у судових інстанціях.",
  },
  {
    title: "Скільки часу займає реєстрація бізнесу з вашою допомогою?",
    text: "В середньому — від 3 до 5 робочих днів.",
  },
];

// Иконки вынесены отдельно
const MinusIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path
      d="M19 12.75H5C4.586 12.75 4.25 12.414 4.25 12C4.25 11.586 4.586 11.25 5 11.25H19C19.414 11.25 19.75 11.586 19.75 12C19.75 12.414 19.414 12.75 19 12.75Z"
      fill="#1A1A1A"
    />
  </svg>
);

const PlusIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path
      d="M19.75 12C19.75 12.414 19.414 12.75 19 12.75H12.75V19C12.75 19.414 12.414 19.75 12 19.75C11.586 19.75 11.25 19.414 11.25 19V12.75H5C4.586 12.75 4.25 12.414 4.25 12C4.25 11.586 4.586 11.25 5 11.25H11.25V5C11.25 4.586 11.586 4.25 12 4.25C12.414 4.25 12.75 4.586 12.75 5V11.25H19C19.414 11.25 19.75 11.586 19.75 12Z"
      fill="#1A1A1A"
    />
  </svg>
);

// Один элемент аккордеона
const OftenQuestionsItem = ({ question, isOpen, onToggle }) => {
  const isPC = useIsPC(768);

  const bodyRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (isOpen && bodyRef.current) {
      setHeight(`${bodyRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen]);

  return (
    <div
      className={`often-quetions-item bg1 ${isOpen ? "open" : ""}`}
      onClick={onToggle}
    >
      <div
        className={`often-quetions-header ${isPC ? "fs-p--body-20" : "fs-p--16px"} fw-semi-bold c3`}
      >
        <span>{question.title}</span>
        <span className="fs-h5">{isOpen ? <MinusIcon /> : <PlusIcon />}</span>
      </div>

      <div
        className="often-quetions-body"
        style={{
          maxHeight: height,
          transition: "max-height 0.4s ease",
        }}
        ref={bodyRef}
      >
        <p
          className={`often-quetions-text ${isPC ? "fs-p--16px" : "fs-p--14px"} fw-normal lh-150`}
        >
          {question.text}
        </p>
      </div>
    </div>
  );
};

export const OftenQuestions = () => {
  const [activeItem, setActiveItem] = useState(null);

  const handleToggle = (title) => {
    setActiveItem((prev) => (prev === title ? null : title));
  };

  const isPC = useIsPC(768);

  return (
    <div className="often-quetions bg1">
      <div className="container">
        <div className="often-quetions-content">
          <h2
            className={`often-quetions-title ${isPC ? "fs-h2--32px" : "fs-h2--20px"} lh-100 uppercase fw-bold`}
          >
            Часті {isPC ? <br /> : ""} запитання
          </h2>
          <div className="often-quetions-list">
            <div className="open">
              {oftenQuestionsData.map((q) => (
                <OftenQuestionsItem
                  key={q.title}
                  question={q}
                  isOpen={activeItem === q.title}
                  onToggle={() => handleToggle(q.title)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OftenQuestions;
