import Breadcrumbs from "@components/BreadCrumbs/BreadCrumbs";
import { useIsPC } from "@hooks/isPC";
import "./About.scss";
import { useModal } from "@components/ModalProvider/ModalProvider";
import { useAboutMe } from "@hooks/useAboutMe";
import { useLocation } from "react-router-dom";

export const About = ({ showBreadcrumbs = false }) => {
  const isPC = useIsPC();
  const { open } = useModal();
  const { pathname } = useLocation();
  
  // Определяем язык из URL
  const lang = pathname.includes('/ru/') ? 'ru' : pathname.includes('/en/') ? 'en' : 'ua';
  
  // Загружаем данные "О себе" из API
  const { aboutMe, loading, error } = useAboutMe();

  // Формируем стили для фонового изображения
  const backgroundStyle = aboutMe?.photo ? {
    backgroundImage: `url(${aboutMe.photo})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: '50% 20%'
  } : {};

  return (
    <>
      <div className="about-block" style={backgroundStyle}>
        <div className="container">
          <div className="about-block-content">
            {showBreadcrumbs && <Breadcrumbs />}
            <div className="about-block-text-content">
              {loading ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <p className={`fs-italic ${isPC ? "fs-p--20px" : "fs-p--12px"} c1`}>
                    Завантаження інформації...
                  </p>
                </div>
              ) : error ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#dc3545" }}>
                  <p className={`fs-italic ${isPC ? "fs-p--20px" : "fs-p--12px"} c1`}>
                    Помилка завантаження інформації
                  </p>
                </div>
              ) : aboutMe ? (
                <>
                  <p
                    className={`about-block-greetings fs-italic ${isPC ? "fs-p--20px" : "fs-p--12px"} c1`}
                  >
                    {lang === 'ua' ? aboutMe.subtitle_uk : 
                     lang === 'ru' ? aboutMe.subtitle_ru : 
                     aboutMe.subtitle_en}
                  </p>
                  <h1
                    className={`about-block-title fw-light uppercase ${isPC ? "fs-h1--40px" : "fs-h2--20px"} c1`}
                  >
                    {lang === 'ua' ? aboutMe.title_uk : 
                     lang === 'ru' ? aboutMe.title_ru : 
                     aboutMe.title_en}
                  </h1>
                  <div
                    className={`about-block-text fw-light lh-150 ${isPC ? "fs-p--18px" : "fs-p--14px"} c1`}
                    dangerouslySetInnerHTML={{
                      __html: lang === 'ua' ? aboutMe.text_uk : 
                              lang === 'ru' ? aboutMe.text_ru : 
                              aboutMe.text_en
                    }}
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
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <p className={`fs-italic ${isPC ? "fs-p--20px" : "fs-p--12px"} c1`}>
                    Дані не знайдено
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="about-block-shadow"></div>
      </div>
    </>
  );
};

export default About;
