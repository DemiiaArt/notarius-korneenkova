import Breadcrumbs from "@components/BreadCrumbs/BreadCrumbs";
import { useIsPC } from "@hooks/isPC";
import { useAboutMe } from "@hooks/useAboutMe";
import { useLanguage } from "@hooks/useLanguage";
import "./About.scss";
import { useModal } from "@components/ModalProvider/ModalProvider";

export const About = ({ showBreadcrumbs = false }) => {
  const isPC = useIsPC();
  const { open } = useModal();
  
  // Безопасное получение данных
  let aboutMe, loading, getContentByLanguage, language, content;
  
  try {
    const aboutMeData = useAboutMe();
    aboutMe = aboutMeData.aboutMe;
    loading = aboutMeData.loading;
    getContentByLanguage = aboutMeData.getContentByLanguage;
  } catch (error) {
    console.error('Ошибка при загрузке данных AboutMe:', error);
    loading = false;
    aboutMe = null;
    getContentByLanguage = () => ({ subtitle: '', title: '', text: '' });
  }
  
  try {
    const languageData = useLanguage();
    language = languageData.language;
  } catch (error) {
    console.error('Ошибка при получении языка:', error);
    language = 'ua';
  }
  
  content = getContentByLanguage ? getContentByLanguage(language) : { subtitle: '', title: '', text: '' };

  return (
    <>
      <div className="about-block">
        <div className="container">
          <div className="about-block-content">
            {showBreadcrumbs && <Breadcrumbs />}
            {!loading && content && (
              <>
                <p
                  className={`about-block-greetings fs-italic ${isPC ? "fs-p--18px" : "fs-p--12px"} c1`}
                >
                  {content.subtitle || "Привіт! Мене звати Надія Корнєєнкова."}
                </p>
                <h1
                  className={`about-block-title fw-light uppercase ${isPC ? "fs-h2--32px" : "fs-h2--20px"} c1`}
                >
                  {content.title || "Ваш надійний нотаріус, медіатор та перекладач."}
                </h1>
                <p
                  className={`about-block-text fw-light lh-150 ${isPC ? "fs-p--16px" : "fs-p--14px"} c1`}
                >
                  {content.text || "Працюю з українцями по всьому світу — допомагаю з документами, перекладами та важливими правовими рішеннями."}
                </p>
              </>
            )}
            {loading && (
              <div className="loading-skeleton">
                <div className="skeleton-text skeleton-subtitle"></div>
                <div className="skeleton-text skeleton-title"></div>
                <div className="skeleton-text skeleton-description"></div>
              </div>
            )}
            <button className="btn-secondary btn-z-style uppercase c1 ">
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
        <div className="about-block-shadow"></div>
      </div>
    </>
  );
};

export default About;
