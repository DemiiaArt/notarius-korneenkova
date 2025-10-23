import Breadcrumbs from "@components/BreadCrumbs/BreadCrumbs";
import { useIsPC } from "@hooks/isPC";
import "./About.scss";
import { useModal } from "@components/ModalProvider/ModalProvider";
import { useEffect, useState } from "react";
import { useLanguage } from "@hooks/useLanguage";
import { useTranslation } from "@hooks/useTranslation";
import { useNavigateWithLang } from "@hooks/useNavigateWithLang";
import { API_BASE_URL } from "../../config/api";
import { normalizeAndConvertHtml } from "@/utils/html";

export const About = ({ showBreadcrumbs = false }) => {
  const isPC = useIsPC();
  const { open } = useModal();
  const { navigateToPage } = useNavigateWithLang();
  const { currentLang } = useLanguage();
  const { t } = useTranslation("components.NotaryServices");

  const [about, setAbout] = useState({
    subtitle: "",
    title: "",
    text: "",
    photo: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    const loadAbout = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await fetch(
          `${API_BASE_URL}/about-me/?lang=${encodeURIComponent(currentLang || "ua")}`
        );
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        if (!isCancelled) setAbout(data || {});
      } catch (e) {
        if (!isCancelled) setError(e.message || "Failed to load AboutMe");
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };
    loadAbout();
    return () => {
      isCancelled = true;
    };
  }, [currentLang]);

  return (
    <>
      <div
        className="about-block"
        style={
          about.photo ? { backgroundImage: `url(${about.photo})` } : undefined
        }
      >
        <div className="container">
          <div className="about-block-content">
            {showBreadcrumbs && <Breadcrumbs />}
            <div className="about-block-text-content">
              <p
                className={`about-block-greetings fs-italic ${isPC ? "fs-p--20px" : "fs-p--12px"} c1`}
              >
                {about.subtitle || "Привіт! Мене звати Надія Корнєєнкова."}
              </p>
              <h1
                className={`about-block-title fw-light uppercase ${isPC ? "fs-h1--40px" : "fs-h2--20px"} c1`}
              >
                {about.title ||
                  "Ваш надійний нотаріус, медіатор та перекладач."}
              </h1>
              {about.text ? (
                <div
                  className={`about-block-text fw-light lh-150 ${isPC ? "fs-p--18px" : "fs-p--14px"} c1`}
                  dangerouslySetInnerHTML={{
                    __html: normalizeAndConvertHtml(about.text),
                  }}
                />
              ) : (
                <p
                  className={`about-block-text fw-light lh-150 ${isPC ? "fs-p--18px" : "fs-p--14px"} c1`}
                >
                  Працюю з українцями по всьому світу — допомагаю з документами,
                  перекладами та важливими правовими рішеннями.
                </p>
              )}
              <button
                onClick={() => navigateToPage("about")}
                className="btn-secondary btn-z-style uppercase c1 fs-p--14px "
              >
                {t("moreDetails")}
              </button>
              <button
                onClick={() => open("freeOrder")}
                className="about-block-btn btn-z-style uppercase c1 "
              >
                {t("orderConsultation")}
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
