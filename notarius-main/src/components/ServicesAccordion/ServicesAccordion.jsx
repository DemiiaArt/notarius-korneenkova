import "./ServicesAccordion.scss";
import { useState, useEffect } from "react";
import { useIsPC } from "@hooks/isPC";
import { useServicesFor } from "@hooks/useServicesFor";
import { useLocation } from "react-router-dom";
import { detectLocaleFromPath } from "@nav/nav-utils";

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
const AccordionItem = ({ service, isOpen, onToggle, lang }) => {
  const isPC = useIsPC();
  
  // Получаем данные на нужном языке
  const langMap = { ua: 'uk', ru: 'ru', en: 'en' };
  const suffix = langMap[lang] || 'uk';
  
  const title = service[`title_${suffix}`] || service.title_uk || service.title;
  const subtitle = service[`subtitle_${suffix}`] || service.subtitle_uk || '';
  const description = service[`description_${suffix}`] || service.description_uk || '';
  
  // Парсим HTML описание в массив пунктов (для списка)
  const parseDescription = (html) => {
    if (!html) return [];
    // Создаем временный div для парсинга HTML
    const div = document.createElement('div');
    div.innerHTML = html;
    
    // Ищем li элементы
    const listItems = div.querySelectorAll('li');
    if (listItems.length > 0) {
      return Array.from(listItems).map(li => li.textContent);
    }
    
    // Если нет li, ищем p элементы
    const paragraphs = div.querySelectorAll('p');
    if (paragraphs.length > 0) {
      return Array.from(paragraphs).map(p => p.textContent).filter(text => text.trim());
    }
    
    // Если нет структуры, возвращаем весь текст
    return [div.textContent];
  };
  
  const content = service.content || parseDescription(description);
  
  return (
    <div
      className={`accordion-item bg1 ${isOpen ? "open" : ""}`}
    >
      <div onClick={onToggle} style={{ cursor: 'pointer' }}>
        <div
          className={`accordion-header ${isPC ? "fs-p--24px" : "fs-p--18px"} fw-medium`}
        >
          <span>{title}</span>
          <span>{isOpen ? <MinusIcon /> : <PlusIcon />}</span>
        </div>
        
        {/* Subtitle всегда видимый */}
        {subtitle && (
          <p className={`accordion-subtitle ${isPC ? "fs-p--18px" : "fs-p--14px"} fw-normal lh-150`} style={{ marginTop: '0.5em', paddingRight: '2em' }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Description показывается только при раскрытии */}
      <div
        className="accordion-body"
        style={{
          maxHeight: isOpen ? `${Math.max(content.length * 3, 10)}em` : "0",
          transition: "max-height 0.4s ease",
        }}
      >
        <ul
          className={`accordion-content ${isPC ? "fs-p--16px" : "fs-p--14px"} fw-normal lh-150`}
        >
          {content.map((point, idx) => (
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
  
  const { pathname } = useLocation();
  const lang = detectLocaleFromPath(pathname);
  const { servicesFor, loading } = useServicesFor();
  const isPC = useIsPC();

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

  const handleToggle = (id) => {
    setActiveItem((prev) => (prev === id ? null : id));
  };
  
  // Используем данные из API или fallback на пустой массив
  const services = servicesFor.length > 0 ? servicesFor : [];
  
  // Если данные загружаются, показываем заглушку
  if (loading) {
    return (
      <div className="accordion-container bg5">
        <div className="container">
          <h2 className={`accordion-title ${isPC ? "fs-h2--32px" : "fs-h2--20px"} fw-bold`}>
            ДЛЯ КОГО ПОСЛУГИ
          </h2>
          <p className="fs-p--16px">Завантаження...</p>
        </div>
      </div>
    );
  }
  
  // Если нет данных, не показываем компонент
  if (services.length === 0) {
    return null;
  }

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
                key={s.id}
                service={s}
                isOpen={activeItem === s.id}
                onToggle={() => handleToggle(s.id)}
                lang={lang}
              />
            ))}
          </div>

          {/* остальные по кнопке */}
          <div className={`collapsed ${showCollapsed ? "show" : "hide"}`}>
            {services.slice(3).map((s) => (
              <AccordionItem
                key={s.id}
                service={s}
                isOpen={activeItem === s.id}
                onToggle={() => handleToggle(s.id)}
                lang={lang}
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
