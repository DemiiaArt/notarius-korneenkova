import Seo from "@components/Seo/Seo";
import Breadcrumbs from "@components/BreadCrumbs/BreadCrumbs";
import { useIsPC } from "@hooks/isPC";
import { useTranslation } from "@hooks/useTranslation";
import { useLanguage } from "@hooks/useLanguage";
import { useContacts } from "@hooks/useContacts";
import Loader from "@components/Loader/Loader";

import "./ContactsPage.scss";
import VideoBlock from "@components/VideoBock/VideoBlock";

const ContactsPage = () => {
  const isPC = useIsPC();
  const { t } = useTranslation("components.pages.ContactsPage");
  const { currentLang } = useLanguage();
  const { contacts, loading, error } = useContacts(currentLang);
  if (loading) {
    return (
      <div className="contacts-page bg1">
        <div className="container">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo
        title="Контакти нотаріуса у Дніпрі — адреса, телефон, графік"
        description="Прийом: Пн–Чт 10:00–18:00, Пт 10:00–17:00. Адреса: просп. Дмитра Яворницького, 2. Телефон: +380 67 544 07 00."
      />
      <div className="contacts-page bg1">
        <div className="container">
          <Breadcrumbs />
          <div className="contacts-wrap">
            {error && (
              <p className={`${isPC ? "fs-p--16px" : "fs-p--14px"} c16`}>
                {error}
              </p>
            )}
            <div className="contacts">
              <div className="contacts-info">
                <h2
                  className={`${isPC ? "fs-p--40px" : "fs-h2--24px"} fw-bold uppercase`}
                >
                  {t("title")}
                </h2>
                <ul className="contacts-info">
                  <li>
                    <h4
                      className={`${isPC ? "fs-p--18px" : "fs-p--14px"} fw-normal lh-150`}
                    >
                      {t("callUs")}
                    </h4>
                    {contacts.phone_number && (
                      <a
                        href={`tel:${contacts.phone_number.replace(/\s|\+/g, "")}`}
                        className={`${isPC ? "fs-p--24px" : "fs-p--16px"} fw-semi-bold tel-link`}
                      >
                        {contacts.phone_number}
                      </a>
                    )}
                    {contacts.phone_number_2 && (
                      <a
                        href={`tel:${contacts.phone_number_2.replace(/\s|\+/g, "")}`}
                        className={`${isPC ? "fs-p--24px" : "fs-p--16px"} fw-semi-bold tel-link`}
                      >
                        {contacts.phone_number_2}
                      </a>
                    )}
                  </li>
                  <li>
                    <h4
                      className={`${isPC ? "fs-p--18px" : "fs-p--14px"} fw-normal lh-150`}
                    >
                      {t("email")}
                    </h4>
                    <a
                      href={`mailto:${contacts.email || ""}`}
                      className={`${isPC ? "fs-p--24px" : "fs-p--16px"} fw-semi-bold`}
                    >
                      {contacts.email || "nknotary.dnipro@gmail.com"}
                    </a>
                  </li>
                  <li>
                    <h4
                      className={`${isPC ? "fs-p--18px" : "fs-p--14px"} fw-normal lh-150`}
                    >
                      {t("workingHours")}
                    </h4>
                    <p
                      className={`${isPC ? "fs-p--24px" : "fs-p--16px"} fw-semi-bold`}
                    >
                      {contacts.working_hours || t("workingHoursTime")}
                    </p>
                  </li>
                  <li>
                    <h4
                      className={`${isPC ? "fs-p--18px" : "fs-p--14px"} fw-normal lh-150`}
                    >
                      {t("ourAddress")}
                    </h4>
                    <a
                      href="#"
                      className={`${isPC ? "fs-p--24px" : "fs-p--16px"} fw-semi-bold`}
                    >
                      {contacts.address || t("address")}
                    </a>
                  </li>
                </ul>
              </div>
              <div className="socialsCircles-wrap">
                <div className="socialsCircles">
                  <h4
                    className={`${isPC ? "fs-p--18px" : "fs-p--14px"} fw-normal lh-150`}
                  >
                    {t("followUs")}
                  </h4>
                  <ul className="socials">
                    <li className="socials-item">
                      <a
                        href={contacts.facebook_url || "#"}
                        className="socials-item-link"
                        aria-label="facebook"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                          className="socials-item-img"
                        >
                          <g clipPath="url(#clip0_254_825)">
                            <path d="M11.8892 12.1117V20.8333H7.67121V12.1117H4.16699V8.57526H7.67121V7.28858C7.67121 2.51171 9.77212 0 14.2173 0C15.58 0 15.9207 0.208025 16.667 0.377527V3.87543C15.8315 3.73675 15.5963 3.6597 14.7283 3.6597C13.6981 3.6597 13.1465 3.93707 12.6436 4.4841C12.1407 5.03113 11.8892 5.9788 11.8892 7.33481V8.58296H16.667L15.3854 12.1194H11.8892V12.1117Z" />
                          </g>
                        </svg>
                      </a>
                    </li>
                    <li className="socials-item">
                      <a
                        href={contacts.instagram_url || "#"}
                        className="socials-item-link"
                        aria-label="instagram"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <svg
                          width="18"
                          height="18"
                          className="socials-item-img"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.9395 5.29C17.8695 3.85 17.5395 2.57001 16.4895 1.52001C15.4395 0.470007 14.1595 0.14001 12.7195 0.0700098C11.2295 -0.00999023 6.77953 -0.00999023 5.29953 0.0700098C3.85953 0.14001 2.58954 0.470007 1.52954 1.52001C0.469543 2.57001 0.149531 3.85 0.0795312 5.29C-0.00046875 6.78 -0.00046875 11.23 0.0795312 12.72C0.149531 14.16 0.479543 15.44 1.52954 16.49C2.58954 17.54 3.85953 17.87 5.29953 17.94C6.78953 18.02 11.2395 18.02 12.7195 17.94C14.1595 17.87 15.4395 17.54 16.4895 16.49C17.5395 15.44 17.8695 14.16 17.9395 12.72C18.0195 11.23 18.0195 6.78001 17.9395 5.30001V5.29ZM8.99955 13.75C6.37955 13.75 4.24954 11.62 4.24954 9C4.24954 6.38 6.37955 4.25 8.99955 4.25C11.6195 4.25 13.7495 6.38 13.7495 9C13.7495 11.62 11.6195 13.75 8.99955 13.75ZM14.5195 4.5C13.9695 4.5 13.5195 4.05 13.5195 3.5C13.5195 2.95 13.9595 2.5 14.5195 2.5C15.0695 2.5 15.5195 2.95 15.5195 3.5C15.5195 4.05 15.0695 4.5 14.5195 4.5ZM12.2495 9C12.2495 10.79 10.7895 12.25 8.99955 12.25C7.20955 12.25 5.74954 10.79 5.74954 9C5.74954 7.21 7.20955 5.75 8.99955 5.75C10.7895 5.75 12.2495 7.21 12.2495 9Z"
                            fill="currentColor"
                          />
                        </svg>
                      </a>
                    </li>
                    <li className="socials-item">
                      <a
                        href={
                          contacts.telegram_phone
                            ? `https://t.me/${contacts.telegram_phone.replace(/[^\d]/g, "")}`
                            : contacts.telegram || "#"
                        }
                        className="socials-item-link"
                        aria-label="telegram"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <svg
                          width="19"
                          height="20"
                          viewBox="0 0 19 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="socials-item-img"
                        >
                          <path
                            d="M13.5678 0.760815L13.0792 0H10.1222V6.85231L10.1122 13.5455C10.1172 13.5952 10.1222 13.6499 10.1222 13.6996C10.1222 15.3754 8.74198 16.7429 7.03933 16.7429C5.33668 16.7429 3.95643 15.3804 3.95643 13.6996C3.95643 12.0239 5.33668 10.6564 7.03933 10.6564C7.39195 10.6564 7.73449 10.721 8.05185 10.8304V7.48881C7.72442 7.43411 7.38691 7.40427 7.03933 7.40427C3.52825 7.40925 0.666992 10.2337 0.666992 13.7046C0.666992 17.1755 3.52825 20 7.04437 20C10.5605 20 13.4217 17.1755 13.4217 13.7046V5.74341C14.6962 7.00149 16.3434 8.22974 18.167 8.62257V5.20636C16.1873 4.34112 14.2177 1.78518 13.5678 0.760815Z"
                            fill="currentColor"
                          />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="socialsCircles">
                  <h4
                    className={`${isPC ? "fs-p--18px" : "fs-p--14px"} fw-normal lh-150`}
                  >
                    {t("writeUs")}
                  </h4>
                  <ul className="socials">
                    <li className="socials-item">
                      <a
                        href={
                          contacts.whatsapp_phone
                            ? `https://wa.me/${contacts.whatsapp_phone.replace(/[^\d]/g, "")}`
                            : contacts.whatsapp || "#"
                        }
                        className="socials-item-link"
                        aria-label="whatsapp"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="socials-item-img"
                        >
                          <path
                            d="M9 0C4.03 0 0 4.03 0 9C0 10.67 0.46001 12.24 1.26001 13.59L0 18L4.40997 16.74C5.75997 17.54 7.33 18 9 18C13.97 18 18 13.97 18 9C18 4.03 13.97 0 9 0ZM13.82 12.44C13.61 13.03 12.61 13.57 12.16 13.62C11.71 13.67 11.29 13.83 9.21002 13.01C6.71002 12.01 5.12 9.43 5 9.27C4.88 9.11 4 7.93001 4 6.71001C4 5.49001 4.62999 4.9 4.85999 4.64C5.08999 4.39 5.36002 4.33 5.52002 4.33C5.69002 4.33 5.85 4.33 6 4.34C6.17 4.34 6.36999 4.33999 6.54999 4.75999C6.76999 5.24999 7.23999 6.47 7.29999 6.58C7.35999 6.7 7.40001 6.84999 7.32001 7.00999C7.23001 7.16999 7.19001 7.28 7.07001 7.42C6.95001 7.56 6.81001 7.74001 6.70001 7.85001C6.57001 7.97001 6.45003 8.10001 6.59003 8.35001C6.74003 8.59001 7.23002 9.41 7.96002 10.06C8.90002 10.91 9.69 11.17 9.94 11.29C10.18 11.41 10.33 11.39 10.47 11.23C10.62 11.07 11.09 10.51 11.25 10.26C11.41 10.02 11.57 10.06 11.8 10.14C12.03 10.22 13.23 10.83 13.48 10.95C13.72 11.08 13.89 11.14 13.95 11.24C14.01 11.34 14.01 11.84 13.81 12.42L13.82 12.44Z"
                            fill="currentColor"
                          />
                        </svg>
                      </a>
                    </li>
                    <li className="socials-item">
                      <a
                        href={contacts.tiktok_url || "#"}
                        className="socials-item-link"
                        aria-label="tiktok"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <svg
                          width="15"
                          height="14"
                          viewBox="0 0 15 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="socials-item-img"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.03117 6.02691C5.0577 4.05119 7.74268 2.74867 9.08611 2.11936C12.9219 0.322542 13.7189 0.0104165 14.2384 0.000109891C14.3527 -0.00215693 14.6082 0.0297341 14.7737 0.180964C14.9134 0.30866 14.9518 0.481158 14.9702 0.602228C14.9886 0.723297 15.0115 0.999097 14.9933 1.2146C14.7855 3.6743 13.8861 9.64335 13.4285 12.3983C13.2349 13.564 12.8536 13.9548 12.4845 13.9931C11.6825 14.0762 11.0734 13.3961 10.2965 12.8225C9.08085 11.9251 8.39409 11.3664 7.21409 10.4907C5.8504 9.47859 6.73442 8.92233 7.51159 8.01324C7.71498 7.77533 11.249 4.15509 11.3174 3.82668C11.326 3.7856 11.3339 3.6325 11.2532 3.55166C11.1724 3.47081 11.0532 3.49846 10.9672 3.52045C10.8453 3.55161 8.90325 4.99723 5.14115 7.85731C4.58991 8.2836 4.09062 8.49131 3.64327 8.48042C3.15011 8.46842 2.20146 8.16638 1.49623 7.90821C0.631245 7.59154 -0.0562297 7.42412 0.00363389 6.88633C0.0348146 6.60622 0.377327 6.31974 1.03117 6.02691Z"
                            fill="#0C0C0C"
                          />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2646.241367943601!2d35.0671685787208!3d48.45189826576539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40dbfd2b5c9f9861%3A0x75eacf0288361864!2z0L_RgC3Rgi4g0JTQvNC40YLRgNC40Y8g0K_QstC-0YDQvdC40YbQutC-0LPQviwgMiwg0JTQvdC10L_RgCwg0JTQvdC10L_RgNC-0L_QtdGC0YDQvtCy0YHQutCw0Y8g0L7QsdC70LDRgdGC0YwsIDQ5MDAw!5e0!3m2!1sru!2sua!4v1757944059432!5m2!1sru!2sua"
                width={`100%`}
                height={`${isPC ? "700" : "400"}`}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
        <VideoBlock pageType="contactsPage" />
      </div>
    </>
  );
};

export default ContactsPage;
