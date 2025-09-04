import { useIsPC } from "@hooks/isPC";
import "./Skills.scss";

const Skills = ({ skillsContent }) => {
  const isPC = useIsPC();
  return (
    <div className="skills">
      <div className="container">
        <div className="skills-content">
          <h2
            className={`skills-title ${isPC ? "fs-h2--32px" : "fs-h2--20px"} fw-bold uppercase c3`}
          >
            {skillsContent.mainTitleFirstWord} <br />
            {skillsContent.mainTitleSecondWord}
          </h2>
          <div className="skills-list">
            <SkillCard textData={skillsContent.experience} />
            <SkillCard textData={skillsContent.history} />
            <SkillCard textData={skillsContent.diploms} />
            <SkillCard textData={skillsContent.happy} />
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
      <p className={`${isPC ? "fs-p--30px" : "fs-p--16px"}`}>
        {preCountText}
        <span className="fs-p--40px fs-italic fw-bold c4">{count}</span>
        {postCountText}
      </p>
      <p className={`${isPC ? "fs-p--24px" : "fs-p--14px"} fw-semi-bold`}>
        {title}
      </p>
      <p className={`${isPC ? "fs-p--24px" : "fs-p--14px"} lh-130`}>{text}</p>
    </div>
  );
};

export default Skills;
