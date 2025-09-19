import "./AboutTextBlock.scss";
import { useIsPC } from "@hooks/isPC";
import { useState, useEffect } from "react";

const aboutContent = [
  "Мене звати Надія Корнесенкова, і в юриспруденцію я прийшла ще в 17 років. Зараз мені 42, тож маю вже 25 років досвіду в цій сфері. За цей час я не просто напрацювала навички, а загартувала їх у реальних справах, доповнивши знаннями в бухгалтерії, економіці та перекладі.",
  "Я твердо переконана: справжня майстерність – це не тільки роки практики, а й постійний розвиток. 10 000 годин? Та я вже давно перейшла цю межу! Юриспруденція – це не просто робота, це мистецтво шукати рішення навіть там, де їх, здається, немає.",
  "Якщо вам потрібна надійна людина, яка розуміє всі тонкощі справи – я тут, щоб допомогти! Давайте працювати разом!",
  "Мене звати Надія Корнєєнкова, і в юриспруденцію я прийшла ще в 17 років. Зараз мені 42, тож маю вже 25 років досвіду в цій сфері. За цей час я не просто напрацювала навички, а загартувала їх у реальних справах, доповнивши знаннями в бухгалтерії, економіці та перекладах.",
  "Я твердо переконана: справжня майстерність – це не тільки роки практики, а й постійний розвиток. 10 000 годин? Та я вже давно перейшла цю межу! Юриспруденція – це не просто робота, це мистецтво шукати рішення навіть там, де їх, здається, немає.",
];

export const AboutTextBlock = () => {
  const isPC = useIsPC();

  const [isMobileView, setIsMobileView] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      const isMobile = window.innerWidth <= 1024;
      setIsMobileView(isMobile);

      if (!isMobile) {
        setExpanded(true); 
      } else {
        setExpanded(false); 
      }
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Определяем, какие абзацы показывать
  const visibleContent = isMobileView && !expanded
    ? aboutContent.slice(0, 3)
    : aboutContent;

  return (
    <div className="about-container">
      <div className="container">
        <h2 className={`${isPC? "fs-h2--32px" : "fs-h2--20px"} fw-bold`}>ПРО МЕНЕ</h2>

        <div className={`about-content ${expanded ? "expanded" : ""}`}>
          {visibleContent.map((paragraph, idx) => (
            <p key={idx} className={`${isPC ? "fs-p--16px" : "fs-p--14px align-center"}  lh-150`}>{paragraph}</p>
          ))}
        </div>

        {isMobileView && aboutContent.length > 3 && (
          <button
            className={`accordion-toggle toggle-btn ${isPC ? "fs-p--20px" : "fs-p--16px"}`}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "ПРИХОВАТИ" : "ДИВИТИСЯ БІЛЬШЕ"}
          </button>
        )}
      </div>
    </div>
  );
};


export default AboutTextBlock;
