import "./OftenQuestions.scss";
import { useState, useEffect, useRef } from "react";
import { useIsPC } from "@hooks/isPC";
import { useTranslation } from "@hooks/useTranslation";
import { useFAQs } from "@hooks/useFAQs";

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
        className={`often-quetions-header ${isPC ? "fs-p--20px" : "fs-p--16px"} fw-semi-bold c3`}
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

export const OftenQuestions = ({ title = "Часті запитання", navId }) => {
  const [activeItem, setActiveItem] = useState(null);
  const { t } = useTranslation("components.OftenQuestions");

  // Загружаем FAQ из API
  const { faqs, loading, error } = useFAQs(navId);

  const handleToggle = (title) => {
    setActiveItem((prev) => (prev === title ? null : title));
  };

  const isPC = useIsPC(768);

  // Функция для получения переведенного заголовка
  const getTranslatedTitle = (originalTitle) => {
    const titles = t("titles");
    return titles && titles[originalTitle]
      ? titles[originalTitle]
      : originalTitle;
  };

  // Преобразуем FAQ из API в формат для компонента
  // API возвращает данные в формате { title, text, order }
  const oftenQuestionsData = Array.isArray(faqs) ? faqs : [];

  return (
    <div className="often-quetions bg1">
      <div className="container">
        <div className="often-quetions-content">
          <h2
            className={`often-quetions-title ${isPC ? "fs-h2--32px" : "fs-h2--20px"} lh-100 uppercase fw-bold`}
          >
            {getTranslatedTitle(title)}
          </h2>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p className={`${isPC ? "fs-p--18px" : "fs-p--14px"} c3`}>
                Завантаження FAQ...
              </p>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p className={`${isPC ? "fs-p--18px" : "fs-p--14px"} c3`}>
                Помилка завантаження FAQ: {error}
              </p>
            </div>
          ) : oftenQuestionsData.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p className={`${isPC ? "fs-p--18px" : "fs-p--14px"} c3`}>
                Немає доступних питань
              </p>
            </div>
          ) : (
            <div className="often-quetions-list">
              <div className="open">
                {oftenQuestionsData.map((q, index) => (
                  <OftenQuestionsItem
                    key={q.title || index}
                    question={q}
                    isOpen={activeItem === q.title}
                    onToggle={() => handleToggle(q.title)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OftenQuestions;
