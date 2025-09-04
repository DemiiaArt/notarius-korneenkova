import inst from "@media/social-media/instagram.svg";
import facebook from "@media/social-media/facebook.svg";
import ticktock from "@media/social-media/ticktock.svg";
import telegram from "@media/social-media/telegram.svg";
import arrow from "@media/icons/arrow-header-mobile.svg";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.scss";
import { useIsPC } from "@hooks/isPC";
import { useModal } from "@components/ModalProvider/ModalProvider";

const whiteHeaderPaths = {
  ua: new Set([
    "notarialni-pro-mene",
    "notarialni-poslugy",
    "notarialni-pereklad",
    "notarialni-poslugy/apostil-na-dokumenty",
    "notarialni-inshi",
    "notarialni-dopomoga-viyskovim",
  ]),
  ru: new Set([
    "notarialni-pro-mene",
    "notarialni-poslugy",
    "notarialni-pereklad",
    "notarialni-poslugy/apostil-na-dokumenty",
    "notarialni-inshi",
    "notarialni-pomosch-voennym",
  ]),
  en: new Set([
    "notary-about",
    "notary-services",
    "notary-translation",
    "notary-services/apostille",
    "notary-other",
    "notary-military-help",
  ]),
};

const isGreenInfoPaths = {
  ua: new Set([
    "notarialni-poslugy",
    "notarialni-contacty",
    "notarialni-pereklad",
    "notarialni-inshi",
    "notarialni-offer",
    "notarialni-policy",
    "notarialni-dopomoga-viyskovim",
    "notarialni-offer",
    "notarialni-policy",
    "notarialni-torgivelna-marka",
  ]),
  ru: new Set([
    "notarialni-poslugy",
    "notarialni-contacty",
    "notarialni-pereklad",
    "notarialni-inshi",
    "notarialni-offer",
    "notarialni-policy",
    "notarialni-pomosch-voennym",
    "notarialni-offer",
    "notarialni-policy",
    "notarialni-torgova-marka",
  ]),
  en: new Set([
    "notary-services",
    "notary-contacts",
    "notary-translation",
    "notary-other",
    "notarialni-offer",
    "notarialni-policy",
    "notary-military-help",
    "notarialni-offer",
    "notarialni-policy",
    "notary-trade-mark",
  ]),
};

export const Header = () => {
  const { pathname } = useLocation();
  const lang = /^\/(en|ru)(?=\/|$)/.exec(pathname)?.[1] || "ua";
  const slug = pathname
    .replace(/^\/(en|ru)(?=\/|$)/, "") // убрали префикс языка
    .replace(/^\/+|\/+$/g, ""); // убрали ведущие/хвостовые "/"

  // строгое совпадение: только то, что явно есть в Set
  const isWhiteHeader = !!whiteHeaderPaths[lang]?.has(slug);
  const isGreenInfo = !!isGreenInfoPaths[lang]?.has(slug);

  const languages = {
    ukr: "Ук",
    rus: "Ру",
    eng: "En",
  };

  const [currentLang, setCurrentLang] = useState("ukr");

  const [menuOpen, setMenuOpen] = useState(false);

  const { open } = useModal();

  const isPC = useIsPC();

  useEffect(() => {
    if (isPC) {
      setMenuOpen(false);
    }
  }, [isPC, setMenuOpen]);

  const [activeIndexes, setActiveIndexes] = useState([]);
  const itemsRef = useRef({});

  const toggleAccordion = (index) => {
    setActiveIndexes(
      (prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index) // если был открыт — закрыть
          : [...prev, index] // если был закрыт — открыть
    );
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header className={`header ${menuOpen ? "menu-open bg8" : ""}`}>
        <div className={`header-info ${isGreenInfo ? "bg4" : "bg1"}`}>
          <div className="container">
            <div
              className={`header-info-content fs-p--16px lh-150 text-decoration--none ${isGreenInfo ? "c1" : "c3"}`}
            >
              <a className="header-info-email" href="#">
                nknotary.dnipro@gmail.com
              </a>
              <div className="header-info-phones-wrap">
                <a className="header-info-phones" href="#">
                  + 38 067 820 07 00
                </a>
                <a className="header-info-phones" href="#">
                  + 38 067 544 07 00
                </a>
              </div>
              <a className="header-info-address " href="#">
                м. Дніпро, бул. Слави, 2-Б, 49100 
              </a>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="header-content">
            <div className="navbar-burger-block">
              <button
                className={`navbar-burger-wrap btn-z-style ${menuOpen ? "active" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span
                  className={`${menuOpen ? "bg3" : ""} ${isWhiteHeader ? "bg1" : "bg3"}`}
                ></span>
                <span
                  className={`${menuOpen ? "bg3" : ""} ${isWhiteHeader ? "bg1" : "bg3"}`}
                ></span>
                <span
                  className={`${menuOpen ? "bg3" : ""} ${isWhiteHeader ? "bg1" : "bg3"}`}
                ></span>
              </button>
            </div>
            <div className="navbar-link-block fs-p--16px lh-150 c3">
              <div className="navbar-social-link-dropdown">
                <a
                  className={`navbar-social-link ${isWhiteHeader ? "br-c1" : "br-c3"}`}
                  href="#"
                >
                  <svg
                    className={`navbar-social-link-icon ${isWhiteHeader ? "c1" : "c3"}`}
                    width="15"
                    height="14"
                    viewBox="0 0 15 14"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillrull="evenodd"
                      cliprull="evenodd"
                      d="M1.03117 6.02691C5.0577 4.05119 7.74268 2.74867 9.08611 2.11936C12.9219 0.322542 13.7189 0.0104165 14.2384 0.000109891C14.3527 -0.00215693 14.6082 0.0297341 14.7737 0.180964C14.9134 0.30866 14.9518 0.481158 14.9702 0.602228C14.9886 0.723297 15.0115 0.999097 14.9933 1.2146C14.7855 3.6743 13.8861 9.64335 13.4285 12.3983C13.2349 13.564 12.8536 13.9548 12.4845 13.9931C11.6825 14.0762 11.0734 13.3961 10.2965 12.8225C9.08085 11.9251 8.39409 11.3664 7.21409 10.4907C5.8504 9.47859 6.73442 8.92233 7.51159 8.01324C7.71498 7.77533 11.249 4.15509 11.3174 3.82668C11.326 3.7856 11.3339 3.6325 11.2532 3.55166C11.1724 3.47081 11.0532 3.49846 10.9672 3.52045C10.8453 3.55161 8.90325 4.99723 5.14115 7.85731C4.58991 8.2836 4.09062 8.49131 3.64327 8.48042C3.15011 8.46842 2.20146 8.16638 1.49623 7.90821C0.631245 7.59154 -0.0562297 7.42412 0.00363389 6.88633C0.0348146 6.60622 0.377327 6.31974 1.03117 6.02691Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
                <a
                  className={`navbar-social-link ${isWhiteHeader ? "br-c1" : "br-c3"}`}
                  href="#"
                >
                  <svg
                    className={`navbar-social-link-icon ${isWhiteHeader ? "c1" : "c3"}`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_254_819)">
                      <path
                        d="M5.1202 0C8.37354 0 11.6269 0 14.8802 0C15.0869 0.0333333 15.2935 0.0533333 15.4935 0.1C17.7602 0.606667 19.2135 1.98 19.8335 4.22C19.9135 4.51333 19.9469 4.82 20.0002 5.12V14.88C19.9869 14.9467 19.9802 15.02 19.9602 15.0867C19.8269 15.6067 19.7602 16.16 19.5402 16.64C18.5469 18.7933 16.8335 19.9467 14.4535 19.98C11.4869 20.02 8.5202 19.9933 5.55354 19.9867C4.40687 19.9867 3.3402 19.6733 2.4002 19.0067C0.813536 17.8733 0.0135359 16.3133 0.00686921 14.3667C0.000202546 11.4533 0.00686921 8.54 0.00686921 5.62C0.00686921 5.24667 0.0268692 4.86 0.106869 4.49333C0.613536 2.23333 1.99354 0.786667 4.2202 0.166667C4.51354 0.0866667 4.8202 0.0533333 5.1202 0ZM18.2202 10C18.2202 8.55333 18.2202 7.11333 18.2202 5.66667C18.2202 5.20667 18.1735 4.76 18.0202 4.32667C17.4535 2.74 16.0869 1.78 14.3602 1.78C11.4535 1.78 8.54687 1.77333 5.6402 1.78667C5.20687 1.78667 4.74687 1.84667 4.3402 1.98667C2.7402 2.52 1.78687 3.90667 1.78687 5.63333C1.78687 8.54 1.78687 11.4467 1.78687 14.3533C1.78687 14.8067 1.83354 15.2467 1.99354 15.6733C2.5602 17.2467 3.91354 18.2067 5.6202 18.2133C8.54687 18.22 11.4735 18.2133 14.4002 18.2133C15.7135 18.2133 16.7669 17.6867 17.5402 16.62C18.0335 15.9467 18.2269 15.1733 18.2269 14.3467C18.2269 12.8933 18.2269 11.4467 18.2269 9.99333L18.2202 10Z"
                        fill="currentColor"
                      />
                      <path
                        d="M15.1526 9.99368C15.1526 12.8203 12.8259 15.1537 9.99926 15.147C7.16593 15.147 4.83926 12.8137 4.8526 9.98701C4.85926 7.16035 7.16593 4.85368 9.99926 4.84035C12.8259 4.83368 15.1526 7.16035 15.1593 9.98701L15.1526 9.99368ZM13.3726 9.99368C13.3726 8.13368 11.8526 6.62035 9.99926 6.62035C8.13926 6.62035 6.62593 8.14035 6.62593 9.99368C6.62593 11.8537 8.14593 13.367 9.99926 13.367C11.8593 13.367 13.3726 11.847 13.3726 9.99368Z"
                        fill="currentColor"
                      />
                      <path
                        d="M15.4004 3.34719C16.1137 3.36719 16.6937 3.96719 16.6737 4.66053C16.6537 5.39386 16.0537 5.96053 15.3271 5.93386C14.6271 5.90719 14.0538 5.30719 14.0738 4.62053C14.0938 3.89386 14.6871 3.32719 15.4004 3.34719Z"
                        fill="currentColor"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_254_819">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
                <a
                  className={`navbar-social-link ${isWhiteHeader ? "br-c1" : "br-c3"}`}
                  href="#"
                >
                  <svg
                    className={`navbar-social-link-icon ${isWhiteHeader ? "c1" : "c3"}`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_254_825)">
                      <path
                        d="M11.8892 12.1117V20.8333H7.67121V12.1117H4.16699V8.57526H7.67121V7.28858C7.67121 2.51171 9.77212 0 14.2173 0C15.58 0 15.9207 0.208025 16.667 0.377527V3.87543C15.8315 3.73675 15.5963 3.6597 14.7283 3.6597C13.6981 3.6597 13.1465 3.93707 12.6436 4.4841C12.1407 5.03113 11.8892 5.9788 11.8892 7.33481V8.58296H16.667L15.3854 12.1194H11.8892V12.1117Z"
                        fill="currentColor"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_254_825">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
                <a
                  className={`navbar-social-link ${isWhiteHeader ? "br-c1" : "br-c3"}`}
                  href="#"
                >
                  <svg
                    className={`navbar-social-link-icon ${isWhiteHeader ? "c1" : "c3"}`}
                    width="19"
                    height="20"
                    viewBox="0 0 19 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.5678 0.760815L13.0792 0H10.1222V6.85231L10.1122 13.5455C10.1172 13.5952 10.1222 13.6499 10.1222 13.6996C10.1222 15.3754 8.74198 16.7429 7.03933 16.7429C5.33668 16.7429 3.95643 15.3804 3.95643 13.6996C3.95643 12.0239 5.33668 10.6564 7.03933 10.6564C7.39195 10.6564 7.73449 10.721 8.05185 10.8304V7.48881C7.72442 7.43411 7.38691 7.40427 7.03933 7.40427C3.52825 7.40925 0.666992 10.2337 0.666992 13.7046C0.666992 17.1755 3.52825 20 7.04437 20C10.5605 20 13.4217 17.1755 13.4217 13.7046V5.74341C14.6962 7.00149 16.3434 8.22974 18.167 8.62257V5.20636C16.1873 4.34112 14.2177 1.78518 13.5678 0.760815Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
                <svg
                  className={`navbar-social-link-arrow-icon ${isWhiteHeader ? "c1" : "c3"}`}
                  width="9"
                  height="9"
                  viewBox="0 0 9 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_431_1485)">
                    <path
                      d="M0.75 3.75L4.5 7.5L8.25 3.75"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_431_1485">
                      <rect
                        width="9"
                        height="9"
                        fill="white"
                        transform="translate(9 9) rotate(180)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <Link
                className={`navbar-link text-decoration--none ${isWhiteHeader ? "c1" : "c3"}`}
                to="/notarialni-pro-mene"
              >
                Про мене
              </Link>
              <Link
                className={`navbar-link text-decoration--none ${isWhiteHeader ? "c1" : "c3"}`}
                to="/notarialni-poslugy"
              >
                Послуги
              </Link>
              <Link
                className={`navbar-link text-decoration--none ${isWhiteHeader ? "c1" : "c3"}`}
                to="/notarialni-contacty"
              >
                Контакти
              </Link>
            </div>
            <Link to="/" className="header-logo-wrap">
              <svg
                className={`header-logo ${isWhiteHeader ? "c1" : "c3"}`}
                width="137"
                height="41"
                viewBox="0 0 137 41"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.13551 32.2339H8.60084C8.4898 32.2339 8.40097 32.3253 8.40097 32.4395V38.6024H8.25236L3.02005 32.3059C2.98247 32.2602 2.9261 32.2339 2.86802 32.2339H1.62955C1.51852 32.2339 1.42969 32.3253 1.42969 32.4395V39.3827C1.42969 39.4969 1.51852 39.5883 1.62955 39.5883H2.16423C2.27526 39.5883 2.36409 39.4969 2.36409 39.3827V33.2197H2.51271L7.75526 39.5162C7.79284 39.5619 7.84921 39.5883 7.90729 39.5883H9.13722C9.24825 39.5883 9.33708 39.4969 9.33708 39.3827V32.4395C9.33708 32.3253 9.24825 32.2339 9.13722 32.2339H9.13551Z"
                  fill="currentColor"
                />
                <path
                  d="M15.4829 32.3499C15.4487 32.2796 15.3787 32.2339 15.3035 32.2339H13.5868C13.5099 32.2339 13.4399 32.2778 13.4074 32.3499L10.1139 39.2931C10.0832 39.3563 10.0883 39.4319 10.1242 39.4934C10.1601 39.5531 10.225 39.59 10.2933 39.59H10.8946C10.9715 39.59 11.0415 39.5461 11.074 39.4741L11.8734 37.7941H17.0101L17.8095 39.4741C17.8437 39.5444 17.9137 39.59 17.9889 39.59H18.5987C18.667 39.59 18.732 39.5531 18.7678 39.4934C18.8037 39.4336 18.8088 39.3581 18.7781 39.2931L15.4846 32.3499H15.4829ZM14.8406 33.2004L16.5864 36.8662H12.2919L14.0377 33.2004H14.8389H14.8406Z"
                  fill="currentColor"
                />
                <path
                  d="M23.2157 32.1739C22.5751 32.1739 21.9874 32.1897 21.4203 32.2038C20.8566 32.2179 20.3236 32.2337 19.7428 32.2337C19.6318 32.2337 19.543 32.3251 19.543 32.4393V39.3825C19.543 39.4967 19.6318 39.5881 19.7428 39.5881C20.3117 39.5881 20.8429 39.6021 21.4066 39.6162C21.9789 39.632 22.5717 39.6461 23.2157 39.6461C25.6858 39.6461 27.6195 38.0047 27.6195 35.9082C27.6195 33.8118 25.6841 32.1704 23.2157 32.1704V32.1739ZM23.2157 38.6918C22.6263 38.6918 22.0729 38.676 21.5382 38.6602C21.1914 38.6497 20.8515 38.6409 20.5064 38.6356V33.1897C20.8686 33.1844 21.2187 33.1738 21.5706 33.1633C22.0916 33.1475 22.6297 33.1317 23.2157 33.1317C25.3646 33.1317 26.6475 34.5446 26.6475 35.9118C26.6475 37.279 25.3646 38.6918 23.2157 38.6918Z"
                  fill="currentColor"
                />
                <path
                  d="M29.3363 32.2334H28.7624C28.652 32.2334 28.5625 32.3255 28.5625 32.439V39.384C28.5625 39.4975 28.652 39.5896 28.7624 39.5896H29.3363C29.4467 39.5896 29.5362 39.4975 29.5362 39.384V32.439C29.5362 32.3255 29.4467 32.2334 29.3363 32.2334Z"
                  fill="currentColor"
                />
                <path
                  d="M35.6743 32.3494C35.6401 32.2791 35.5701 32.2334 35.4949 32.2334H33.7782C33.7013 32.2334 33.6313 32.2773 33.5988 32.3494L30.3053 39.2926C30.2746 39.3558 30.2797 39.4314 30.3156 39.4929C30.3515 39.5527 30.4164 39.5896 30.4847 39.5896H31.086C31.1629 39.5896 31.2329 39.5456 31.2654 39.4736L32.0648 37.7936H37.2015L38.0009 39.4736C38.0351 39.5439 38.1051 39.5896 38.1803 39.5896H38.7901C38.8585 39.5896 38.9234 39.5527 38.9592 39.4929C38.9951 39.4332 39.0002 39.3576 38.9695 39.2926L35.676 32.3494H35.6743ZM35.032 33.1999L36.7778 36.8657H32.4833L34.2291 33.1999H35.0303H35.032Z"
                  fill="currentColor"
                />
                <path
                  d="M51.8586 39.463C51.8893 39.3857 51.8722 39.2978 51.8159 39.2399L48.5309 35.8148L51.71 32.5866C51.768 32.5286 51.7851 32.439 51.7544 32.3617C51.7236 32.2844 51.6502 32.2334 51.5699 32.2334H50.7995C50.7465 32.2334 50.6953 32.2545 50.6577 32.2931L47.6854 35.3386H44.9368V32.439C44.9368 32.3248 44.848 32.2334 44.737 32.2334H44.1647C44.0537 32.2334 43.9648 32.3248 43.9648 32.439V39.3822C43.9648 39.4964 44.0537 39.5878 44.1647 39.5878H44.737C44.848 39.5878 44.9368 39.4964 44.9368 39.3822V36.2946H47.6734L50.7482 39.5263C50.7858 39.565 50.8371 39.5878 50.8917 39.5878H51.6707C51.751 39.5878 51.8244 39.5386 51.8552 39.4613L51.8586 39.463Z"
                  fill="currentColor"
                />
                <path
                  d="M55.8888 32.1353C53.3554 32.1353 51.6523 33.6536 51.6523 35.9117C51.6523 38.1699 53.3537 39.6882 55.8888 39.6882C58.4238 39.6882 60.1235 38.1699 60.1235 35.9117C60.1235 33.6536 58.4221 32.1353 55.8888 32.1353ZM55.8888 38.7305C53.9123 38.7305 52.6346 37.6234 52.6346 35.9117C52.6346 34.2001 53.9123 33.0912 55.8888 33.0912C57.8652 33.0912 59.1412 34.1984 59.1412 35.9117C59.1412 37.6251 57.8635 38.7305 55.8888 38.7305Z"
                  fill="currentColor"
                />
                <path
                  d="M69.0685 34.7202C69.0685 33.2686 67.5789 32.1738 65.6025 32.1738C64.7347 32.1738 64.0702 32.1896 63.4279 32.2037C62.7925 32.2178 62.1365 32.2336 61.2858 32.2336C61.1748 32.2336 61.0859 32.325 61.0859 32.4392V39.3824C61.0859 39.4966 61.1748 39.588 61.2858 39.588H61.8495C61.9605 39.588 62.0494 39.4966 62.0494 39.3824V37.2068H65.6127L67.8249 39.5265C67.8625 39.5651 67.9137 39.588 67.9684 39.588H68.7661C68.8464 39.588 68.9199 39.537 68.9506 39.4597C68.9814 39.3824 68.9643 39.2945 68.9062 39.2348L66.817 37.1049C68.1426 36.7974 69.0702 35.8396 69.0702 34.7184L69.0685 34.7202ZM68.0948 34.7307C68.0948 35.4794 67.2099 36.2807 65.8929 36.2807C65.0986 36.2807 64.0719 36.2772 63.2246 36.2737C62.7532 36.2737 62.3364 36.2702 62.0477 36.2702V33.1896C62.5636 33.1878 63.0384 33.1755 63.539 33.1632C64.1642 33.1474 64.8099 33.1316 65.611 33.1316C67.1655 33.1316 68.0948 33.9452 68.0948 34.7307Z"
                  fill="currentColor"
                />
                <path
                  d="M76.4915 39.5898H77.7215C77.8325 39.5898 77.9213 39.4984 77.9213 39.3842V32.441C77.9213 32.3267 77.8325 32.2354 77.7215 32.2354H77.1868C77.0757 32.2354 76.9869 32.3267 76.9869 32.441V38.6039H76.8383L71.606 32.3074C71.5684 32.2617 71.512 32.2354 71.454 32.2354H70.2155C70.1045 32.2354 70.0156 32.3267 70.0156 32.441V39.3842C70.0156 39.4984 70.1045 39.5898 70.2155 39.5898H70.7502C70.8612 39.5898 70.95 39.4984 70.95 39.3842V33.2212H71.0986L76.3412 39.5177C76.3788 39.5634 76.4352 39.5898 76.4932 39.5898H76.4915Z"
                  fill="currentColor"
                />
                <path
                  d="M85.8047 33.1806C85.9157 33.1806 86.0045 33.0892 86.0045 32.975V32.439C86.0045 32.3248 85.9157 32.2334 85.8047 32.2334H79.3288C79.2177 32.2334 79.1289 32.3248 79.1289 32.439V39.3822C79.1289 39.4964 79.2177 39.5878 79.3288 39.5878H85.8047C85.9157 39.5878 86.0045 39.4964 86.0045 39.3822V38.8462C86.0045 38.732 85.9157 38.6406 85.8047 38.6406H80.1026V36.3737H85.2427C85.3537 36.3737 85.4425 36.2823 85.4425 36.168V35.6514C85.4425 35.5372 85.3537 35.4458 85.2427 35.4458H80.1026V33.1788H85.8047V33.1806Z"
                  fill="currentColor"
                />
                <path
                  d="M87.0905 39.5896H93.5664C93.6774 39.5896 93.7662 39.4982 93.7662 39.384V38.848C93.7662 38.7337 93.6774 38.6424 93.5664 38.6424H87.8643V36.3754H93.0044C93.1154 36.3754 93.2042 36.284 93.2042 36.1698V35.6532C93.2042 35.5389 93.1154 35.4475 93.0044 35.4475H87.8643V33.1806H93.5664C93.6774 33.1806 93.7662 33.0892 93.7662 32.975V32.439C93.7662 32.3248 93.6774 32.2334 93.5664 32.2334H87.0905C86.9795 32.2334 86.8906 32.3248 86.8906 32.439V39.3822C86.8906 39.4964 86.9795 39.5878 87.0905 39.5878V39.5896Z"
                  fill="currentColor"
                />
                <path
                  d="M102.362 32.2334H101.827C101.716 32.2334 101.628 32.3248 101.628 32.439V38.6019H101.479L96.2466 32.3054C96.209 32.2598 96.1527 32.2334 96.0946 32.2334H94.8561C94.7451 32.2334 94.6562 32.3248 94.6562 32.439V39.3822C94.6562 39.4964 94.7451 39.5878 94.8561 39.5878H95.3908C95.5018 39.5878 95.5906 39.4964 95.5906 39.3822V33.2193H95.7393L100.982 39.5158C101.019 39.5614 101.076 39.5878 101.134 39.5878H102.364C102.475 39.5878 102.564 39.4964 102.564 39.3822V32.439C102.564 32.3248 102.475 32.2334 102.364 32.2334H102.362Z"
                  fill="currentColor"
                />
                <path
                  d="M108.332 35.8134L111.511 32.5852C111.569 32.5272 111.586 32.4375 111.555 32.3602C111.524 32.2829 111.451 32.2319 111.371 32.2319H110.6C110.547 32.2319 110.496 32.253 110.458 32.2917L107.486 35.3371H104.738V32.4375C104.738 32.3233 104.649 32.2319 104.538 32.2319H103.965C103.854 32.2319 103.766 32.3233 103.766 32.4375V39.3807C103.766 39.495 103.854 39.5863 103.965 39.5863H104.538C104.649 39.5863 104.738 39.495 104.738 39.3807V36.2931H107.474L110.549 39.5248C110.587 39.5635 110.638 39.5863 110.693 39.5863H111.471C111.552 39.5863 111.625 39.5371 111.656 39.4598C111.687 39.3825 111.67 39.2946 111.613 39.2349L108.328 35.8098L108.332 35.8134Z"
                  fill="currentColor"
                />
                <path
                  d="M115.69 32.1353C113.156 32.1353 111.453 33.6536 111.453 35.9117C111.453 38.1699 113.156 39.6882 115.69 39.6882C118.223 39.6882 119.926 38.1699 119.926 35.9117C119.926 33.6536 118.223 32.1353 115.69 32.1353ZM115.69 38.7305C113.713 38.7305 112.437 37.6234 112.437 35.9117C112.437 34.2001 113.715 33.0912 115.69 33.0912C117.664 33.0912 118.942 34.1984 118.942 35.9117C118.942 37.6251 117.664 38.7305 115.69 38.7305Z"
                  fill="currentColor"
                />
                <path
                  d="M127.898 32.3216C127.86 32.2653 127.799 32.2337 127.734 32.2337H127.132C127.049 32.2337 126.974 32.2864 126.945 32.3672L124.693 38.611H122.946L120.704 32.3672C120.675 32.2864 120.6 32.2319 120.516 32.2319H119.907C119.842 32.2319 119.78 32.2653 119.743 32.3198C119.705 32.376 119.697 32.4463 119.72 32.5096L122.254 39.4528C122.283 39.5336 122.358 39.5863 122.442 39.5863H125.2C125.284 39.5863 125.359 39.5336 125.388 39.4528L127.922 32.5096C127.944 32.4463 127.935 32.376 127.899 32.3198L127.898 32.3216Z"
                  fill="currentColor"
                />
                <path
                  d="M135.344 39.2926L132.051 32.3494C132.017 32.2791 131.949 32.2334 131.872 32.2334H130.153C130.076 32.2334 130.006 32.2773 129.974 32.3494L126.68 39.2926C126.65 39.3558 126.655 39.4314 126.691 39.4929C126.726 39.5527 126.791 39.5896 126.86 39.5896H127.461C127.538 39.5896 127.608 39.5456 127.64 39.4736L128.44 37.7936H133.576L134.376 39.4736C134.41 39.5439 134.478 39.5896 134.555 39.5896H135.165C135.233 39.5896 135.298 39.5527 135.334 39.4929C135.37 39.4332 135.375 39.3576 135.344 39.2926ZM131.409 33.1999L133.155 36.8657H128.86L130.606 33.1999H131.407H131.409Z"
                  fill="currentColor"
                />
                <path
                  d="M70.6807 22.44L86.106 8.19687C86.5706 7.76808 86.6099 7.03176 86.1931 6.55728C85.9915 6.32532 85.7165 6.19 85.4159 6.17067C85.1169 6.15661 84.8248 6.2603 84.5993 6.46766L70.9455 19.0782L70.8788 19.1397L69.6557 20.2679L69.6284 20.2398V6.90699C70.6909 6.45712 71.4408 5.38163 71.4408 4.13042C71.4408 2.47677 70.1255 1.12891 68.5061 1.12891C66.8867 1.12891 65.5714 2.47502 65.5714 4.13042C65.5714 5.36582 66.3042 6.43076 67.3462 6.89118V20.2381L67.3121 20.2556L66.1385 19.1731L66.0343 19.0765L52.377 6.4659C52.1549 6.25854 51.8662 6.15486 51.5639 6.16892C51.2615 6.18649 50.9848 6.3218 50.7832 6.55553C50.5817 6.78749 50.4809 7.08448 50.498 7.39553C50.5116 7.70306 50.6466 7.98775 50.8703 8.19511L59.8163 16.4545C63.2516 19.6195 65.1956 21.4207 66.2991 22.4382V22.4523L67.722 23.7773L67.7955 23.8353C67.8194 23.8529 67.8433 23.874 67.8689 23.8898C67.8997 23.9109 67.9356 23.9284 67.9834 23.9548C68.0073 23.9689 68.0346 23.9829 68.0603 23.99C68.1013 24.0075 68.144 24.0216 68.1884 24.0321L68.2618 24.0532C68.3062 24.0602 68.3524 24.0673 68.3934 24.0673C68.431 24.0743 68.4668 24.0743 68.501 24.0743C68.5283 24.0743 68.5574 24.0743 68.5847 24.0673C68.6291 24.0673 68.6718 24.0602 68.7128 24.0532C68.7401 24.0497 68.7658 24.0427 68.7931 24.0321C68.8375 24.0216 68.8802 24.0075 68.9178 23.9935C68.9451 23.9829 68.9707 23.9689 69.0083 23.9513C69.0425 23.9337 69.0784 23.9126 69.1091 23.8933C69.133 23.8757 69.1569 23.8582 69.1928 23.8283L70.6824 22.4523V22.4382L70.6807 22.44Z"
                  fill="currentColor"
                />
                <path
                  d="M51.6286 25.4329C52.2539 25.4329 52.7612 24.911 52.7612 24.2678V16.0295C52.7612 15.3863 52.2539 14.8608 51.6286 14.8608C51.0034 14.8608 50.4961 15.3863 50.4961 16.0295V24.2678C50.4961 24.911 51.0034 25.4329 51.6286 25.4329Z"
                  fill="currentColor"
                />
                <path
                  d="M86.5034 24.2693V16.0309C86.5034 15.3877 85.996 14.8623 85.3708 14.8623C84.7456 14.8623 84.2383 15.3877 84.2383 16.0309V24.2693C84.2383 24.9124 84.7456 25.4344 85.3708 25.4344C85.996 25.4344 86.5034 24.9124 86.5034 24.2693Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
            <div className="header-btns">
              <button className="search-icon-wrap btn-z-style">
                <svg
                  className={`search-icon ${menuOpen ? "c3" : ""} ${isWhiteHeader ? "c1" : "c3"}`}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.353 20.646L17.344 16.637C18.68 15.135 19.5 13.164 19.5 11C19.5 6.313 15.687 2.5 11 2.5C6.313 2.5 2.5 6.313 2.5 11C2.5 15.687 6.313 19.5 11 19.5C13.164 19.5 15.135 18.68 16.637 17.344L20.646 21.353C20.744 21.451 20.872 21.499 21 21.499C21.128 21.499 21.256 21.45 21.354 21.353C21.548 21.158 21.548 20.842 21.353 20.646ZM3.49902 11C3.49902 6.865 6.86302 3.5 10.999 3.5C15.135 3.5 18.499 6.865 18.499 11C18.499 15.135 15.135 18.5 10.999 18.5C6.86302 18.5 3.49902 15.135 3.49902 11Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <div className="header-change-lang-dropdown">
                <button
                  className={`header-change-lang current ${isWhiteHeader ? "c1" : "c3"}`}
                >
                  {languages[currentLang]}
                  <svg
                    className={`header-change-lang-arrow-icon ${isWhiteHeader ? "c1" : "c3"}`}
                    width="9"
                    height="9"
                    viewBox="0 0 9 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_431_1485)">
                      <path
                        d="M0.75 3.75L4.5 7.5L8.25 3.75"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_431_1485">
                        <rect
                          width="9"
                          height="9"
                          fill="white"
                          transform="translate(9 9) rotate(180)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
                <div className="header-change-lang-list">
                  {Object.entries(languages)
                    .filter(([key]) => key !== currentLang)
                    .map(([key, label]) => (
                      <button
                        key={key}
                        className={`header-change-lang ${isWhiteHeader ? "c1" : "c3"}`}
                        onClick={() => switchLang(key)}
                      >
                        {label}
                      </button>
                    ))}
                </div>
              </div>
              <button
                onClick={() => open("freeOrder")}
                className="phone-btn-wrap btn-z-style"
              >
                {isPC ? (
                  <p className="phone-btn uppercase fs-p--16px">Зв'язатися</p>
                ) : (
                  <svg
                    className={`phone-btn ${menuOpen ? "c3" : ""} ${isWhiteHeader ? "c1" : "c3"}`}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.4873 17.1402L16.4223 13.4442C16.2302 13.2694 15.9777 13.1761 15.7181 13.1841C15.4585 13.1921 15.2122 13.3008 15.0313 13.4872L12.6383 15.9482C12.0623 15.8382 10.9043 15.4772 9.71228 14.2882C8.52028 13.0952 8.15928 11.9342 8.05228 11.3622L10.5113 8.96824C10.6977 8.78737 10.8064 8.54106 10.8144 8.28145C10.8225 8.02183 10.7292 7.76928 10.5543 7.57724L6.85928 3.51324C6.68432 3.3206 6.44116 3.20374 6.18143 3.1875C5.92171 3.17125 5.66588 3.2569 5.46828 3.42624L3.29828 5.28724C3.12539 5.46075 3.0222 5.69169 3.00828 5.93624C2.99328 6.18624 2.70728 12.1082 7.29928 16.7022C11.3053 20.7072 16.3233 21.0002 17.7053 21.0002C17.9073 21.0002 18.0313 20.9942 18.0643 20.9922C18.3086 20.9778 18.5392 20.8743 18.7123 20.7012L20.5723 18.5302C20.7423 18.3333 20.8286 18.0776 20.8127 17.8179C20.7968 17.5582 20.68 17.315 20.4873 17.1402Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      <div
        className={`overlay ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
      />
      <nav className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="container">
          <ul className="mobile-menu-list">
            <Link
              onClick={closeMenu}
              to="/notarialni-pro-mene"
              className="mobile-menu-item fs-p--16px fw-medium lh-100 c9"
            >
              Про мене
            </Link>

            {/* Послуги */}
            <li
              className={`mobile-menu-item ${activeIndexes.includes(0) ? "active" : ""}`}
            >
              <div
                className="accordion-header fw-medium"
                onClick={() => toggleAccordion(0)}
              >
                Послуги
                <span className="mobile-menu-item-icon">
                  <img src={arrow} alt="Arrow" />
                </span>
              </div>
              <div
                ref={(el) => (itemsRef.current[0] = el)}
                className="accordion-header-content"
                style={{
                  height: activeIndexes.includes(0)
                    ? `${itemsRef.current[0]?.scrollHeight}px`
                    : "0px",
                }}
              >
                <ul>
                  <li className="accordion-header-content-item">
                    <Link onClick={closeMenu} to="/notarialni-poslugy">
                      Нотаріальні послуги
                    </Link>
                  </li>
                  <li className="accordion-header-content-item">
                    <Link onClick={closeMenu} to="/notarialni-pereklad">
                      Нотаріальний переклад
                    </Link>
                  </li>
                  <li className="accordion-header-content-item">
                    <Link
                      onClick={closeMenu}
                      to="/notarialni-dopomoga-viyskovim"
                    >
                      Допомога військовим
                    </Link>
                  </li>
                  <li className="fs-p--16px lh-100">
                    <Link onClick={closeMenu} to="/notarialni-inshi">
                      Інші послуги
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            {/* Контакти */}
            <li
              className={`mobile-menu-item ${activeIndexes.includes(1) ? "active" : ""}`}
            >
              <div
                className="accordion-header fw-medium"
                onClick={() => toggleAccordion(1)}
              >
                Контакти
                <span className="mobile-menu-item-icon">
                  <img src={arrow} alt="Arrow" />
                </span>
              </div>
              <div
                ref={(el) => (itemsRef.current[1] = el)}
                className="accordion-header-content"
                style={{
                  height: activeIndexes.includes(1)
                    ? `${itemsRef.current[1]?.scrollHeight}px`
                    : "0px",
                }}
              >
                <ul>
                  <li className="accordion-header-content-item fs-p--16px lh-100 c9">
                    <a href="">+380 67 820 07 00</a>
                  </li>
                  <li className="accordion-header-content-item fs-p--16px lh-100 c9">
                    <a href="">+380 67 544 07 00</a>
                  </li>
                  <li className="accordion-header-content-item fs-p--16px lh-100 c9">
                    <a href="">nknotary.dnipro@gmail.com</a>
                  </li>
                  <li className="accordion-header-content-item fs-p--16px lh-100 c9">
                    <a href="">м. Дніпро, бул. Слави, 2-Б, 49100</a>
                  </li>
                </ul>
              </div>
            </li>
            <li className="mobile-menu-item">
              <div className="accordion-header fw-medium">
                Соціальні мережі
                <ul className="mobile-menu-social-block">
                  <li className="mobile-menu-social-block-item">
                    <a href="" className="mobile-menu-social-block-item-link">
                      <img
                        src={inst}
                        alt="instagram"
                        className="mobile-menu-social-block-item-img"
                      />
                    </a>
                  </li>
                  <li className="mobile-menu-social-block-item">
                    <a href="" className="mobile-menu-social-block-item-link">
                      <img
                        src={facebook}
                        alt="facebook"
                        className="mobile-menu-social-block-item-img"
                      />
                    </a>
                  </li>
                  <li className="mobile-menu-social-block-item">
                    <a href="" className="mobile-menu-social-block-item-link">
                      <img
                        src={ticktock}
                        alt="ticktock"
                        className="mobile-menu-social-block-item-img"
                      />
                    </a>
                  </li>
                  <li className="mobile-menu-social-block-item">
                    <a href="" className="mobile-menu-social-block-item-link">
                      <img
                        src={telegram}
                        alt="telegram"
                        className="mobile-menu-social-block-item-img"
                      />
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="mobile-menu-footer bg9">
          <div className="container">
            <div className="mobile-menu-change-lang-wrap">
              {Object.entries(languages).map(([key, label]) => (
                <button
                  key={key}
                  className={`mobile-menu-change-lang lh-100 ${isPC ? "fs-p--30px" : "fs-p--16px"} ${currentLang === key ? "active" : ""}`}
                  onClick={() => setCurrentLang(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
