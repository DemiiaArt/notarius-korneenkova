import { useIsPC } from "@hooks/isPC";
import { useLocation } from "react-router-dom";
import "./Skills.scss";

const skillsContent = {
  main: {
    mainTitleFirstWord: "Професійні",
    mainTitleSecondWord: "Факти",
    experience: {
      count: 2000,
      preCountText: "з ",
      postCountText: " року",
      title: "У юридичній сфері",
      text: "Досвід у судовій, позовній, арбітражній та іншій юридичній роботі",
    },
    history: {
      count: 2011,
      preCountText: "з ",
      postCountText: " року",
      title: "У професії нотаріуса",
      text: "Досвід у судовій, позовній, арбітражній та іншій юридичній роботі",
    },
    diploms: {
      count: 4,
      preCountText: "",
      postCountText: "",
      title: "Дипломи",
      text: "Економіка, право, бухгалтерський облік, англійська мова",
    },
    happy: {
      count: "10 000+",
      preCountText: "",
      postCountText: "",
      title: "Задоволених клієнтів",
      text: "Досвід у судовій, позовній, арбітражній та іншій юридичній роботі",
    },
  },
  about: {
    mainTitleFirstWord: "Професійні",
    mainTitleSecondWord: "Принципи",
    experience: {
      count: "01",
      preCountText: "",
      postCountText: "",
      title: "Індивідуальний підхід",
      text: "Кожен клієнт — унікальний, тому ми уважно вислуховуємо та підбираємо рішення, що відповідають саме його життєвій ситуації.",
    },
    history: {
      count: "02",
      preCountText: "",
      postCountText: "",
      title: "Конфіденційність",
      text: "Уся отримана інформація залишається строго конфіденційною — довіра клієнтів для нас понад усе.",
    },
    diploms: {
      count: "03",
      preCountText: "",
      postCountText: "",
      title: "Законність та точність",
      text: "У своїй роботі ми керуємося чинним законодавством та дотримуємося максимальної точності в кожній деталі.",
    },
    happy: {
      count: "04",
      preCountText: "",
      postCountText: "",
      title: "Етичність",
      text: "Дотримуємося високих етичних стандартів, поважаючи гідність кожної людини та діючи з чесністю і справедливістю.",
    },
  },
};

const Skills = () => {
  const isPC = useIsPC();
  const location = useLocation();
  const key = location.pathname == "/notarialni-pro-mene" ? "about" : "main";

  return (
    <div className="skills">
      <div className="container">
        <div className="skills-content">
          <h2
            className={`skills-title ${isPC ? "fs-h2--32px" : "fs-h2--20px"} fw-bold uppercase c3`}
          >
            {skillsContent[key].mainTitleFirstWord} <br />
            {skillsContent[key].mainTitleSecondWord}
          </h2>
          <div className="skills-list">
            <SkillCard textData={skillsContent[key].experience} />
            <SkillCard textData={skillsContent[key].history} />
            <SkillCard textData={skillsContent[key].diploms} />
            <SkillCard textData={skillsContent[key].happy} />
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
      <p className={`${isPC ? "fs-p--18px" : "fs-p--12px"} lh-130`}>{text}</p>
    </div>
  );
};

export default Skills;
