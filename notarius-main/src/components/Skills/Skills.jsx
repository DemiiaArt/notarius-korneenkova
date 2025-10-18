import { useIsPC } from "@hooks/isPC";
import { useLocation } from "react-router-dom";
import { useTranslation } from "@hooks/useTranslation";
import "./Skills.scss";

const Skills = () => {
  const isPC = useIsPC();
  const location = useLocation();
  const { getTranslations } = useTranslation("components.Skills");

  // Получаем переводы для компонента
  const translations = getTranslations();

  const key = location.pathname == "/notarialni-pro-mene" ? "about" : "main";

  // Используем переводы или fallback на украинские тексты
  const currentContent = translations[key];

  return (
    <div className="skills">
      <div className="container">
        <div className="skills-content">
          <h2
            className={`skills-title ${isPC ? "fs-h2--32px" : "fs-h2--20px"} fw-bold uppercase c3`}
          >
            {currentContent.mainTitleFirstWord} <br />
            {currentContent.mainTitleSecondWord}
          </h2>
          <div className="skills-list">
            <SkillCard textData={currentContent.experience} />
            <SkillCard textData={currentContent.history} />
            <SkillCard textData={currentContent.diploms} />
            <SkillCard textData={currentContent.happy} />
          </div>
        </div>
      </div>
    </div>
  );
};

const SkillCard = ({ textData }) => {
  const isPC = useIsPC();

  if (!textData) return <p>no content</p>;
  const { postCountText, preCountText, count, title, text } = textData;
  return (
    <div className="skills-card">
      <p className={`${isPC ? "fs-p--30px" : "fs-p--16px"} c3`}>
        {preCountText}
        <span className="fs-p--40px fs-italic fw-bold c4">{count}</span>
        {postCountText}
      </p>
      <p className={`${isPC ? "fs-p--24px" : "fs-p--14px"} fw-semi-bold c3`}>
        {title}
      </p>
      <p className={`${isPC ? "fs-p--16px" : "fs-p--12px"} lh-130 c3`}>
        {text}
      </p>
    </div>
  );
};

export default Skills;
