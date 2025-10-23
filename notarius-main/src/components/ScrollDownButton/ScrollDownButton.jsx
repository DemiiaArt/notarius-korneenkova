import { useRef } from "react";
import { useTranslation } from "@hooks/useTranslation";
import "./ScrollDownButton.scss";

const ScrollDownButton = () => {
  const aboutBlockRef = useRef(null);
  const { t } = useTranslation("components.ScrollDownButton");

  const scrollToAbout = () => {
    const aboutBlock = document.getElementById("about-block");
    if (aboutBlock) {
      aboutBlock.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <button
      className="scroll-down-button"
      onClick={scrollToAbout}
      role="button"
      tabIndex="0"
      aria-label={t("ariaLabel")}
    >
      <div className="scroll-down-button__content">
        <div className="scroll-down-button__text uppercase">{t("text")}</div>
        <div className="scroll-down-button__dots">
          <div className="scroll-down-button__dot scroll-down-button__dot--1"></div>
          <div className="scroll-down-button__dot scroll-down-button__dot--2"></div>
          <div className="scroll-down-button__dot scroll-down-button__dot--3"></div>
        </div>
      </div>
    </button>
  );
};

export default ScrollDownButton;
