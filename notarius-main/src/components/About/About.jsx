import Breadcrumbs from "@components/BreadCrumbs/BreadCrumbs";
import { useIsPC } from "@hooks/isPC";
import "./About.scss";
import { useModal } from "@components/ModalProvider/ModalProvider";

export const About = ({ showBreadcrumbs = false }) => {
  const isPC = useIsPC();
  const { open } = useModal();

  return (
    <>
      <div className="about-block">
        <div className="container">
          <div className="about-block-content">
            {showBreadcrumbs && <Breadcrumbs />}
            <p
              className={`about-block-greetings fs-italic ${isPC ? "fs-p--20px" : "fs-p--12px"} c1`}
            >
              Привіт! Мене звати Надія Корнєєнкова.
            </p>
            <h1
              className={`about-block-title fw-light uppercase ${isPC ? "fs-h1--40px" : "fs-h2--20px"} c1`}
            >
              Ваш надійний нотаріус, медіатор та перекладач.
            </h1>
            <p
              className={`about-block-text fw-light lh-150 ${isPC ? "fs-p--18px" : "fs-p--14px"} c1`}
            >
              Працюю з українцями по всьому світу — допомагаю з документами,
              перекладами та важливими правовими рішеннями.
            </p>
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
        <div className="about-block-shadow"></div>
      </div>
    </>
  );
};

export default About;
