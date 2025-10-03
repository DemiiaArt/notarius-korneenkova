import Breadcrumbs from "@components/BreadCrumbs/BreadCrumbs";
import { useIsPC } from "@hooks/isPC";
import "./About.scss";
import { useModal } from "@components/ModalProvider/ModalProvider";
import { useEffect, useState, useRef } from "react";
import { apiClient } from "@/config/api";

export const About = ({ showBreadcrumbs = false }) => {
  const isPC = useIsPC();
  const { open } = useModal();
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
                {aboutData ? aboutData.subtitle_uk : ""}
              </p>
              <h1
                className={`about-block-title fw-light uppercase ${isPC ? "fs-h1--40px" : "fs-h2--20px"} c1`}
              >
                {aboutData?.subtitle_uk}
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
        </div>
        <div className="about-block-shadow"></div>
      </div>
    </>
  );
};

export default About;
