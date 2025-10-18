import "./ServicesAccordion.scss";
import { useState, useEffect, useRef } from "react";
import { useIsPC } from "@hooks/isPC";
import { useTranslation } from "@hooks/useTranslation";
import { API_BASE_URL } from "../../config/api";
import { useLanguage } from "@hooks/useLanguage";
import { normalizeAndConvertHtml } from "@/utils/html";

// Данные теперь приходят из backend: /api/services-for/?lang=ua|ru|en

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
  const bodyRef = useRef(null);
  console.log(service);
  return (
    <div
      className={`accordion-item bg1 ${isOpen ? "open" : ""}`}
      onClick={onToggle}
    >
      <div
        className={`accordion-header ${isPC ? "fs-p--24px" : "fs-p--18px"} fw-medium`}
      >
        <span>{service.title}</span>
        <span>{isOpen ? <MinusIcon /> : <PlusIcon />}</span>
      </div>

      <div
        className="accordion-body"
        ref={bodyRef}
        style={{
          maxHeight: isOpen ? `${bodyRef.current?.scrollHeight || 0}px` : "0",
          transition: "max-height 0.4s ease",
        }}
      >
        <div
          className={`accordion-content ${isPC ? "fs-p--16px" : "fs-p--14px"} fw-normal lh-150`}
        >
          {/* Закрыто: показываем подзаголовок */}
          {!isOpen && service.subtitle && (
            <p className="accordion-subtitle">{service.subtitle}</p>
          )}
          {/* Открыто: показываем подзаголовок + описание */}
          {isOpen && (
            <div>
              {service.subtitle && (
                <p className="accordion-subtitle fw-medium">
                  {service.subtitle}
                </p>
              )}
              {service.description && (
                <div
                  className="accordion-description"
                  dangerouslySetInnerHTML={{
                    __html: normalizeAndConvertHtml(service.description),
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ServicesAccordion = ({ title = "ДЛЯ КОГО ПОСЛУГИ" }) => {
  const [activeItem, setActiveItem] = useState(null);
  const [showCollapsed, setShowCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation("components.ServicesAccordion");
  const { currentLang } = useLanguage();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Функция для получения переведенного заголовка
  const getTranslatedTitle = (originalTitle) => {
    const titles = t("titles");
    return titles && titles[originalTitle]
      ? titles[originalTitle]
      : originalTitle;
  };

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

  // загрузка данных ServicesFor с backend
  useEffect(() => {
    let isCancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await fetch(
          `${API_BASE_URL}/services-for/?lang=${encodeURIComponent(currentLang || "ua")}`
        );
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        if (!isCancelled) setServices(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!isCancelled) setError(e.message || "Failed to load services");
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };
    load();
    return () => {
      isCancelled = true;
    };
  }, [currentLang]);

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
          {getTranslatedTitle(title)}
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
