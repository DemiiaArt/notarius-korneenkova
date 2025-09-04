import "./ServicesAccordion.scss";
import { useState, useEffect } from "react";
import { useIsPC } from "@hooks/isPC";

// Данные вынесены в отдельный массив
const services = [
  {
    title: "Для громадян України в Україні та за кордоном",
    content: [
      "отримання консультацій",
      "допомога в оформленні документів",
      "підтримка у складних життєвих обставинах",
    ],
  },
  {
    title: "Для бізнесу, підприємців і команд",
    content: [
      "юридичні консультації",
      "підтримка в кризових ситуаціях",
      "розвиток команди та керівництва",
    ],
  },
  {
    title: "Для людей у перехідних станах (життєві повороти)",
    content: [
      "кар’єрні зміни",
      "переїзд або зміна країни",
      "втрата близької людини або роботи",
    ],
  },
  {
    title: "Для тих, хто навчається або викладає",
    content: [
      "підтримка студентів у стресових ситуаціях",
      "розвиток навичок саморефлексії",
      "покращення комунікацій у навчальному процесі",
    ],
  },
  {
    title: 'Для тих, хто вже відчуває себе "більше, ніж професія"',
    content: [
      "особистий розвиток",
      "формування цінностей та цілей",
      "розкриття потенціалу та внутрішньої мотивації",
    ],
  },
  {
    title: "Для військових та їхніх родин",
    content: [
      "оформлення документів у складних умовах",
      "підтримка з урахуванням психологічних станів",
      "опора із повагою, швидкістю та людяністю",
    ],
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
const AccordionItem = ({ service, isOpen, onToggle }) => {
  const isPC = useIsPC();
  return (
    <div
      className={`accordion-item bg1 ${isOpen ? "open" : ""}`}
      onClick={onToggle}
    >
      <div
        className={`accordion-header ${isPC ? "fs-p--28px" : "fs-p--18px"} fw-medium`}
      >
        <span>{service.title}</span>
        <span >{isOpen ? <MinusIcon /> : <PlusIcon />}</span>
      </div>

      <div
        className="accordion-body"
        style={{
          maxHeight: isOpen ? `${service.content.length * 3}em` : "0",
          transition: "max-height 0.4s ease",
        }}
      >
        <ul className={`accordion-content ${isPC ? "fs-p--16px" : "fs-p--14px"} fw-normal lh-150`}>
          {service.content.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const ServicesAccordion = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [showCollapsed, setShowCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // проверка размера экрана
  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setShowCollapsed(!mobile);
      setActiveItem(null);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handleToggle = (title) => {
    setActiveItem((prev) => (prev === title ? null : title));
  };
  const isPC = useIsPC();

  return (
    <div className="accordion-container bg5">
      <div className="container">
        <h2
          className={`accordion-title ${isPC ? "fs-h2--32px" : "fs-h2--20px"} fw-bold`}
        >
          ДЛЯ КОГО ПОСЛУГИ
        </h2>

        <div
          className={`accordion-list ${
            !showCollapsed && isMobile ? "collapsed-view" : "expanded-view"
          }`}
        >
          {/* первые 3 блока всегда видны */}
          <div className="open">
            {services.slice(0, 3).map((s) => (
              <AccordionItem
                key={s.title}
                service={s}
                isOpen={activeItem === s.title}
                onToggle={() => handleToggle(s.title)}
              />
            ))}
          </div>

          {/* остальные по кнопке */}
          <div className={`collapsed ${showCollapsed ? "show" : "hide"}`}>
            {services.slice(3).map((s) => (
              <AccordionItem
                key={s.title}
                service={s}
                isOpen={activeItem === s.title}
                onToggle={() => handleToggle(s.title)}
              />
            ))}
          </div>
        </div>

        {isMobile && (
          <div
            className="accordion-toggle fs-p--16px"
            onClick={() => setShowCollapsed((prev) => !prev)}
          >
            {showCollapsed ? "ПРИХОВАТИ" : "ДИВИТИСЯ БІЛЬШЕ"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesAccordion;
