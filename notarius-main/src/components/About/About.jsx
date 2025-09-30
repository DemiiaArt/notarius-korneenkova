import Breadcrumbs from "@components/BreadCrumbs/BreadCrumbs";
import { useIsPC } from "@hooks/isPC";
import { useAboutMe } from "@hooks/useHomeData";
import "./About.scss";
import { useModal } from "@components/ModalProvider/ModalProvider";

export const About = ({ showBreadcrumbs = false }) => {
  const isPC = useIsPC();
  const { open } = useModal();
  const { aboutMe, loading, error } = useAboutMe();

  // Функция для получения текста на нужном языке
  const getLocalizedText = (field) => {
    if (!aboutMe) return '';
    
    // Определяем язык (можно добавить логику определения языка)
    const language = 'uk'; // По умолчанию украинский
    
    let text = '';
    switch (language) {
      case 'en':
        text = aboutMe[`${field}_en`] || aboutMe[`${field}_uk`] || '';
        break;
      case 'ru':
        text = aboutMe[`${field}_ru`] || aboutMe[`${field}_uk`] || '';
        break;
      default:
        text = aboutMe[`${field}_uk`] || '';
    }
    
    // Обрабатываем HTML-контент из CKEditor
    if (text && field === 'text') {
      // Проверяем, есть ли уже HTML-теги (от CKEditor)
      if (text.includes('<') && text.includes('>')) {
        // Если есть HTML, используем как есть
        return text;
      } else {
        // Если это обычный текст, обрабатываем его
        text = text
          .replace(/\n\n/g, '</p><p>') // Двойные переносы - новые параграфы
          .replace(/\n/g, '<br>') // Одинарные переносы - <br>
          .replace(/^(\d+)\./gm, '<li>$1.</li>') // Нумерованный список
          .replace(/^•/gm, '<li>•</li>') // Маркированный список
          .replace(/^-\s/gm, '<li>- </li>'); // Список с дефисами
        
        // Обертываем в параграфы
        text = `<p>${text}</p>`;
        
        // Обрабатываем списки
        if (text.includes('<li>')) {
          // Группируем элементы списка
          text = text.replace(/(<li>.*?<\/li>)/gs, (match) => {
            return `<ul>${match}</ul>`;
          });
        }
      }
    }
    
    return text;
  };

  // Если данные загружаются, показываем загрузку
  if (loading) {
    return (
      <div className="about-block">
        <div className="container">
          <div className="about-block-content">
            {showBreadcrumbs && <Breadcrumbs />}
            <div className="about-block-text-content">
              <p className={`about-block-greetings fs-italic ${isPC ? "fs-p--20px" : "fs-p--12px"} c1`}>
                Завантаження...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Если произошла ошибка, показываем fallback контент
  if (error || !aboutMe) {
    console.warn('AboutMe data not available, using fallback content');
  }

  return (
    <>
      <div className="about-block">
        <div className="container">
          <div className="about-block-content">
            {showBreadcrumbs && <Breadcrumbs />}
            <div className="about-block-text-content">
              <p
                className={`about-block-greetings fs-italic ${isPC ? "fs-p--20px" : "fs-p--12px"} c1`}
                dangerouslySetInnerHTML={{ 
                  __html: aboutMe ? getLocalizedText('subtitle') : 'Привіт! Мене звати Надія Корнєєнкова.' 
                }}
              />
              <h1
                className={`about-block-title fw-light uppercase ${isPC ? "fs-h1--40px" : "fs-h2--20px"} c1`}
                dangerouslySetInnerHTML={{ 
                  __html: aboutMe ? getLocalizedText('title') : 'Ваш надійний нотаріус, медіатор та перекладач.' 
                }}
              />
              <div
                className={`about-block-text fw-light lh-150 ${isPC ? "fs-p--18px" : "fs-p--14px"} c1`}
                dangerouslySetInnerHTML={{ 
                  __html: aboutMe ? getLocalizedText('text') : 'Працюю з українцями по всьому світу — допомагаю з документами, перекладами та важливими правовими рішеннями.' 
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
            </div>
          </div>
        </div>
        <div className="about-block-shadow"></div>
      </div>
    </>
  );
};

export default About;
