import instagram from "@media/social-media/instagram.svg";
import facebook from "@media/social-media/facebook.svg";
import ticktock from "@media/social-media/ticktock.svg";
import x from "@media/social-media/x.svg";
import youtube from "@media/social-media/youtube.svg";
import icon from "@media/footer/icon-accordion-footer.svg";
import planet from "@media/footer/planet.svg";
import logoFooter from "@media/footer/logo-footer.svg";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";

import "./Footer.scss";
import { useIsPC } from "@hooks/isPC";
import { useLanguage } from "@hooks/useLanguage";
import { useTranslation } from "@hooks/useTranslation";

const navigationLinks = {
  ua: [
    { link: "notarialni-pro-mene", label: "Про себе" },
    { link: "notarialni-poslugy", label: "Нотаріальні послуги" },
    { link: "notarialni-pereklad", label: "Нотаріальний переклад" },
    { link: "notarialni-inshi", label: "Інші послуги" },
    { link: "notarialni-dopomoga-viyskovim", label: "Допомога військовим" },
    { link: "notarialni-contacty", label: "Контакти" },
  ],
  ru: [
    { link: "notarialni-pro-mene", label: "Про меня" },
    { link: "notarialni-poslugy", label: "Нотариальные услуги" },
    { link: "notarialni-pereklad", label: "Нотариальный перевод" },
    { link: "notarialni-inshi", label: "Прочие услуги" },
    { link: "notarialni-pomosch-voennym", label: "Помощь военным" },
    { link: "notarialni-contacty", label: "Контакты" },
  ],
  en: [
    { link: "notary-about", label: "About" },
    { link: "notary-services", label: "Services" },
    { link: "notary-translation", label: "Translation" },
    { link: "notary-other", label: "Other services" },
    { link: "notary-military-help", label: "Military help" },
    { link: "notary-contacts", label: "Contacts" },
  ],
};

const helpLinks = {
  ua: [
    { link: "notarialni-offer", label: "Договір оферти" },
    { link: "notarialni-policy", label: "Політика конфіденційності" },
    { link: "notarialni-torgivelna-marka", label: "Торгова марка" },
  ],
  ru: [
    { link: "notarialni-offer", label: "Договор оферты" },
    { link: "notarialni-policy", label: "Политика конфиденциальности" },
    { link: "notarialni-torgova-marka", label: "Торговая марка" },
  ],
  en: [
    { link: "notary-offer", label: "Offer contract" },
    { link: "notary-policy", label: "Privacy policy" },
    { link: "notary-trade-mark", label: "Trade mark" },
  ],
};

const Footer = () => {
  const LANG_UI_TO_ROUTE = { ukr: "ua", rus: "ru", eng: "en" };
  const { currentLang, switchLanguage } = useLanguage();
  const { t } = useTranslation("components.Footer");

  const languages = {
    ukr: "UA",
    rus: "RU",
    eng: "EN",
  };

  // Маппинг языков для Footer
  const langMap = {
    ua: "ukr",
    ru: "rus",
    en: "eng",
  };

  const footerLang = langMap[currentLang] || "ukr";

  const switchLang = (langKey) => {
    // Маппинг старых ключей на новые
    const langMap = {
      ukr: "ua",
      rus: "ru",
      eng: "en",
    };
    const newLang = langMap[langKey] || langKey;
    switchLanguage(newLang);
  };

  const [openIndex, setOpenIndex] = useState(null);

  const isPC = useIsPC();

  if (isPC) {
    return (
      <footer
        className={`footer bg3 ${openIndex !== null ? "accordion-open" : ""}`}
      >
        <div className="container">
          <div className="footer-content">
            <div className="footer-social-media">
              <p
                className={`footer-social-media-title c1 lh-100 ${isPC ? "fs-p--24px fw-semi-bold" : "fs-p--14px fw-medium"}`}
              >
                Стежте за нами
              </p>
              <a
                className={`footer-social-media-link c1 fw-normal ${isPC ? "fs-p--16px lh-150" : "fs-p--14px lh-100"}`}
              >
                Tiktok
              </a>
              <a
                className={`footer-social-media-link c1 fw-normal ${isPC ? "fs-p--16px lh-150" : "fs-p--14px lh-100"}`}
              >
                Instagram
              </a>
              <a
                className={`footer-social-media-link c1 fw-normal ${isPC ? "fs-p--16px lh-150" : "fs-p--14px lh-100"}`}
              >
                Facebook
              </a>
              <a
                className={`footer-social-media-link c1 fw-normal ${isPC ? "fs-p--16px lh-150" : "fs-p--14px lh-100"}`}
              >
                X
              </a>
              <a className="footer-social-media-link c1">Youtube</a>
            </div>
            <div className="footer-contacts">
              <p
                className={`footer-contacts-title c1 lh-100 ${isPC ? "fs-p--24px fw-semi-bold" : "fs-p--14px fw-medium"}`}
              >
                {t("contacts")}
              </p>
              <a
                className={`footer-contacts-link c1 fw-normal ${isPC ? "fs-p--16px lh-150" : "fs-p--14px lh-100"}`}
                href="#"
              >
                +380 67 820 07 00
              </a>
              <a
                className={`footer-contacts-link c1 fw-normal ${isPC ? "fs-p--16px lh-150" : "fs-p--14px lh-100"}`}
                href="#"
              >
                nk.yes@gmail.com
              </a>
              <a
                className={`footer-contacts-link no-click c1 fw-normal ${isPC ? "fs-p--16px lh-150" : "fs-p--14px lh-100"}`}
                href="#"
              >
                м.Дніпро, пр. Дмитра Яворницького, 2
              </a>
              <a
                className={`footer-contacts-link no-click c1 fw-normal ${isPC ? "fs-p--16px lh-150" : "fs-p--14px lh-100"}`}
                href="#"
              >
                Пн-Нд: 09:00 - 18:00
              </a>
              <div className="footer-change-lang-dropdown">
                <div className="footer-change-lang-list">
                  {Object.entries(languages).map(([key, label]) => (
                    <button
                      key={key}
                      className={`footer-change-lang ${footerLang == key ? "c1" : "c16"}`}
                      onClick={() => switchLang(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="footer-navigation">
              <p
                className={`footer-navigation-title c1 lh-100 ${isPC ? "fs-p--24px fw-semi-bold" : "fs-p--14px fw-medium"}`}
              >
                {t("navigation")}
              </p>
              {navigationLinks[LANG_UI_TO_ROUTE[footerLang]].map(
                ({ link, label }) => (
                  <Link
                    key={link}
                    to={`/${link}`}
                    className={`footer-navigation-link c1 fw-normal ${isPC ? "fs-p--16px lh-150" : "fs-p--14px lh-100"}`}
                  >
                    {label}
                  </Link>
                )
              )}
            </div>
            <div className="footer-help">
              <p
                className={`footer-help-title c1 lh-100 ${isPC ? "fs-p--24px fw-semi-bold" : "fs-p--14px fw-medium"}`}
              >
                {t("help")}
              </p>
              {helpLinks[LANG_UI_TO_ROUTE[footerLang]].map(
                ({ link, label }) => (
                  <Link
                    key={link}
                    to={`/${link}`}
                    className={`footer-help-link c1 fw-normal ${isPC ? "fs-p--16px lh-150" : "fs-p--14px lh-100"}`}
                  >
                    {label}
                  </Link>
                )
              )}
            </div>
          </div>
          <img className="footer-logo" src={logoFooter} alt="logoFooter" />
        </div>
      </footer>
    );
  }

  return (
    <footer
      className={`footer bg3 ${openIndex !== null ? "accordion-open" : ""}`}
    >
      <div className="container">
        <div className="footer-content">
          <div className="footer-social-media">
            <a className="footer-social-media-item bg2">
              <img
                src={instagram}
                alt="Inst"
                className="footer-social-media-icon"
              />
            </a>
            <a className="footer-social-media-item bg2">
              <img
                src={facebook}
                alt="Facebook"
                className="footer-social-media-icon"
              />
            </a>
            <a className="footer-social-media-item bg2">
              <img
                src={ticktock}
                alt="TickTock"
                className="footer-social-media-icon"
              />
            </a>
            <a className="footer-social-media-item bg2">
              <img src={x} alt="X" className="footer-social-media-icon" />
            </a>
            <a className="footer-social-media-item bg2">
              <img
                src={youtube}
                alt="Youtube"
                className="footer-social-media-icon"
              />
            </a>
          </div>
          <FooterAccordion openIndex={openIndex} setOpenIndex={setOpenIndex} />
        </div>
        <div className="footer-change-lang-dropdown">
          <div className="footer-change-lang-list">
            {Object.entries(languages).map(([key, label]) => (
              <button
                key={key}
                className={`footer-change-lang ${footerLang == key ? "c1" : "c16"}`}
                onClick={() => switchLang(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <img className="footer-logo" src={logoFooter} alt="logoFooter" />
      </div>
    </footer>
  );
};

const FooterAccordion = ({ openIndex, setOpenIndex }) => {
  const isPC = useIsPC();
  const { t } = useTranslation("components.Footer");

  const toggleAccordion = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const items = [
    {
      title: t("contacts"),
      content: (
        <>
          <a
            className={`${isPC ? "fs-p--16px lh-150" : "fs-p--14px"} fw-normal`}
          >
            +380 67 820 07 00
          </a>
          <a
            className={`${isPC ? "fs-p--16px lh-150" : "fs-p--14px"} fw-normal`}
          >
            nk.yes@gmail.com
          </a>
          <a
            className={`${isPC ? "fs-p--16px lh-150" : "fs-p--14px"} fw-normal`}
          >
            {t("address")}
          </a>
          <a
            className={`${isPC ? "fs-p--16px lh-150" : "fs-p--14px"} fw-normal`}
          >
            {t("workingHours")}
          </a>
        </>
      ),
    },
    {
      title: t("navigation"),
      content: (
        <>
          <a
            className={`${isPC ? "fs-p--16px lh-150" : "fs-p--14px"} fw-normal`}
          >
            {t("home")}
          </a>
          <a
            className={`${isPC ? "fs-p--16px lh-150" : "fs-p--14px"} fw-normal`}
          >
            {t("aboutUs")}
          </a>
        </>
      ),
    },
    {
      title: t("help"),
      content: (
        <>
          <a
            className={`${isPC ? "fs-p--16px lh-150" : "fs-p--14px"} fw-normal`}
          >
            {t("faq")}
          </a>
          <a
            className={`${isPC ? "fs-p--16px lh-150" : "fs-p--14px"} fw-normal`}
          >
            {t("support")}
          </a>
        </>
      ),
    },
  ];

  return (
    <div className="footer-accordion bg3 c1">
      {items.map((item, i) => (
        <FooterAccordionItem
          key={i}
          title={item.title}
          isOpen={openIndex === i}
          onToggle={() => toggleAccordion(i)}
        >
          {item.content}
        </FooterAccordionItem>
      ))}
    </div>
  );
};

const FooterAccordionItem = ({ title, children, isOpen, onToggle }) => {
  const contentRef = useRef(null);

  const isPC = useIsPC();

  return (
    <div className={`footer-accordion-item ${isOpen ? "open" : ""}`}>
      <button
        className={`footer-accordion-header ${isPC ? "fs-p--28px" : "fs-p--18px"} fw-medium bg3 c1 ${isOpen ? "open" : ""}`}
        onClick={onToggle}
      >
        {title}
        <img src={icon} alt="arrow" className="footer-accordion-icon" />
      </button>
      <div
        ref={contentRef}
        className="footer-accordion-content"
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
          transition: "max-height 0.3s ease",
          overflow: "hidden",
        }}
      >
        <div className="footer-accordion-inner">{children}</div>
      </div>
    </div>
  );
};

export default Footer;
