import Breadcrumbs from "@components/BreadCrumbs/BreadCrumbs";
import { useIsPC } from "@hooks/isPC";
import "./About.scss";
import { useModal } from "@components/ModalProvider/ModalProvider";
import { useEffect, useState, useRef } from "react";
import { apiClient } from "@/config/api";
import { useLocation } from "react-router-dom";
import { detectLocaleFromPath } from "@nav/nav-utils";

export const About = ({ showBreadcrumbs = false }) => {
  const isPC = useIsPC();
  const { open } = useModal();
  const { pathname } = useLocation();
  const lang = detectLocaleFromPath(pathname);
  const [aboutData, setAboutData] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    apiClient.get("/about-me/")
      .then((data) => {
        console.log("отримані дані:", data)
        setAboutData(data)
      })
      .catch((err) => console.log("Error fetching about-me:", err))
  }, [])
  
  // Получаем данные на нужном языке
  const getLocalizedField = (field) => {
    if (!aboutData) return '';
    const langMap = { ua: 'uk', ru: 'ru', en: 'en' };
    const suffix = langMap[lang] || 'uk';
    return aboutData[`${field}_${suffix}`] || aboutData[`${field}_uk`] || '';
  };

  return (
    <>
      <div className="about-block">
        <div className="container">
          <div className="about-block-content">
            {showBreadcrumbs && <Breadcrumbs />}
            <div className="about-block-text-content">
              <p
                className={`about-block-greetings fs-italic ${isPC ? "fs-p--20px" : "fs-p--12px"} c1`}
              >
                {getLocalizedField('subtitle')}
              </p>
              <h1
                className={`about-block-title fw-light uppercase ${isPC ? "fs-h1--40px" : "fs-h2--20px"} c1`}
              >
                {getLocalizedField('title')}
              </h1>
              <div
                className={`about-block-text fw-light lh-150 ${isPC ? "fs-p--18px" : "fs-p--14px"} c1`}
                dangerouslySetInnerHTML={{ __html: getLocalizedField('text') }}
              />
              <button className="btn-secondary btn-z-style uppercase c1 fs-p--16px ">
                Детальніше
              </button>
              <button
                onClick={() => open("freeOrder")}
                className="about-block-btn btn-z-style uppercase c1 "
              >
                Замовити консультацію
              </button>
            </div>
          </div>
        </div>
        <div className="about-block-shadow"></div>
      </div>
    </>
  );
};

export default About;
