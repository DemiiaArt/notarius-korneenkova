import instagram from "@media/footer/instagram.svg";
import facebook from "@media/footer/facebook-f.svg";
import ticktock from "@media/social-media/ticktock.svg";
import telegram from "@media/footer/telegram.svg";
import whatsapp from "@media/footer/whatsap.svg";
import icon from "@media/footer/icon-accordion-footer.svg";
import logoFooter from "@media/footer/logo-footer.svg";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";

import "./Footer.scss";
import { useIsPC } from "@hooks/isPC";
import { useLanguage } from "@hooks/useLanguage";
import { useTranslation } from "@hooks/useTranslation";
import { useContacts } from "@hooks/useContacts";

const navigationLinks = {
  ua: [
    { link: "notarialni-pro-mene", label: "Про мене" },
    { link: "notarialni-poslugy", label: "Нотаріальні послуги" },
    { link: "notarialni-pereklad", label: "Нотаріальний переклад" },
    { link: "notarialni-inshi", label: "Інші послуги" },
    { link: "notarialni-dopomoga-viyskovim", label: "Допомога військовим" },
    { link: "notarialni-blog", label: "Блог" },
    { link: "notarialni-contacty", label: "Контакти" },
  ],
  ru: [
    { link: "notarialni-pro-mene", label: "Про меня" },
    { link: "notarialni-poslugy", label: "Нотариальные услуги" },
    { link: "notarialni-pereklad", label: "Нотариальный перевод" },
    { link: "notarialni-inshi", label: "Другие услуги" },
    { link: "notarialni-pomosch-voennym", label: "Помощь военным" },
    { link: "notarialni-blog", label: "Блог" },
    { link: "notarialni-contacty", label: "Контакты" },
  ],
  en: [
    { link: "notary-about", label: "About me" },
    { link: "notary-services", label: "Services" },
    { link: "notary-translate", label: "Notary translate" },
    { link: "notary-other", label: "Other services" },
    { link: "notary-military-help", label: "Military help" },
    { link: "notary-blog", label: "Blog" },
    { link: "notary-contacts", label: "Contacts" },
  ],
};

const helpLinks = {
  ua: [
    { link: "notarialni-offer", label: "Договір оферти" },
    { link: "notarialni-policy", label: "Політика конфіденційності" },
    { link: "notarialni-torgivelna-marka", label: "Торгівельна марка" },
  ],
  ru: [
    { link: "notarialni-offer", label: "Договор оферты" },
    { link: "notarialni-policy", label: "Политика конфиденциальности" },
    { link: "notarialni-torgova-marka", label: "Торговая марка" },
  ],
  en: [
    { link: "notary-offer", label: "Offer contract" },
    { link: "notary-policy", label: "Privacy Policy" },
    { link: "notary-trade-mark", label: "Trade mark" },
  ],
};

const Footer = () => {
  const LANG_UI_TO_ROUTE = { ukr: "ua", rus: "ru", eng: "en" };
  const { currentLang, switchLanguage } = useLanguage();
  const { t } = useTranslation("components.Footer");
  const { contacts } = useContacts(currentLang);

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
                Ми в соцмережах
              </p>
              <a
                className={`footer-social-media-link c1 fw-normal ${isPC ? "fs-p--16px lh-150" : "fs-p--14px lh-100"}`}
              >
                Facebook
              </a>
              <a
                className={`footer-social-media-link c1 fw-normal ${isPC ? "fs-p--16px lh-150" : "fs-p--14px lh-100"}`}
              >
                Instagram
              </a>
              <a
                className={`footer-social-media-link c1 fw-normal ${isPC ? "fs-p--16px lh-150" : "fs-p--14px lh-100"}`}
              >
                Tiktok
              </a>
              <p
                className={`footer-social-media-title c1 lh-100 ${isPC ? "fs-p--24px fw-semi-bold" : "fs-p--14px fw-medium"}`}
              >
                Пишіть нам
              </p>
              <a
                className={`footer-social-media-link c1 fw-normal ${isPC ? "fs-p--16px lh-150" : "fs-p--14px lh-100"}`}
              >
                WhatsApp
              </a>
              <a
                className={`footer-social-media-link c1 fw-normal ${isPC ? "fs-p--16px lh-150" : "fs-p--14px lh-100"}`}
              >
                Telegram
              </a>
            </div>
            <div className="footer-contacts">
              <p
                className={`footer-contacts-title c1 lh-100 ${isPC ? "fs-p--24px fw-semi-bold" : "fs-p--14px fw-medium"}`}
              >
                {t("contacts")}
              </p>
              {contacts.phone_number && (
                <a
                  className={`footer-contacts-link c1 fw-normal ${isPC ? "fs-p--16px lh-150" : "fs-p--14px lh-100"}`}
                  href={`tel:${contacts.phone_number.replace(/\s|\+/g, "")}`}
                >
                  {contacts.phone_number}
                </a>
              )}
              {contacts.email && (
                <a
                  className={`footer-contacts-link c1 fw-normal ${isPC ? "fs-p--16px lh-150" : "fs-p--14px lh-100"}`}
                  href={`mailto:${contacts.email}`}
                >
                  {contacts.email}
                </a>
              )}
              {contacts.address && (
                <a
                  className={`footer-contacts-link no-click c1 fw-normal ${isPC ? "fs-p--16px lh-150" : "fs-p--14px lh-100"}`}
                  href="#"
                >
                  {contacts.address}
                </a>
              )}
              {contacts.working_hours && (
                <a
                  className={`footer-contacts-link no-click c1 fw-normal ${isPC ? "fs-p--16px lh-150" : "fs-p--14px lh-100"}`}
                  href="#"
                >
                  {contacts.working_hours}
                </a>
              )}
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
                    to={
                      currentLang === "ua"
                        ? `/${link}`
                        : `/${currentLang}/${link}`
                    }
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
                    to={
                      currentLang === "ua"
                        ? `/${link}`
                        : `/${currentLang}/${link}`
                    }
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
            <a
              className="footer-social-media-item bg2"
              href={contacts.instagram_url || "#"}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={instagram}
                alt="Inst"
                className="footer-social-media-icon"
              />
            </a>
            <a
              className="footer-social-media-item bg2"
              href={contacts.facebook_url || "#"}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={facebook}
                alt="Facebook"
                className="footer-social-media-icon"
              />
            </a>
            <a
              className="footer-social-media-item bg2"
              href={contacts.twitter_url || contacts.x_url || "#"}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={ticktock}
                alt="TickTock"
                className="footer-social-media-icon"
              />
            </a>
            <a
              className="footer-social-media-item bg2"
              href={contacts.youtube_url || "#"}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={whatsapp}
                alt="whatsapp"
                className="footer-social-media-icon"
              />
            </a>
            <a className="footer-social-media-item bg2">
              <img
                src={telegram}
                alt="Telegram"
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
  const { currentLang } = useLanguage();
  const { contacts } = useContacts(currentLang);

  const toggleAccordion = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const items = [
    {
      title: t("contacts"),
      content: (
        <>
          {contacts.phone_number && (
            <a
              className={`${isPC ? "fs-p--16px lh-150" : "fs-p--14px"} fw-normal`}
              href={`tel:${contacts.phone_number.replace(/\s|\+/g, "")}`}
            >
              {contacts.phone_number}
            </a>
          )}
          {contacts.email && (
            <a
              className={`${isPC ? "fs-p--16px lh-150" : "fs-p--14px"} fw-normal`}
              href={`mailto:${contacts.email}`}
            >
              {contacts.email}
            </a>
          )}
          {contacts.address && (
            <a
              className={`${isPC ? "fs-p--16px lh-150" : "fs-p--14px"} fw-normal`}
            >
              {contacts.address}
            </a>
          )}
          {contacts.working_hours && (
            <a
              className={`${isPC ? "fs-p--16px lh-150" : "fs-p--14px"} fw-normal`}
            >
              {contacts.working_hours}
            </a>
          )}
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
