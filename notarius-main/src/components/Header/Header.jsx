import arrow from "@media/icons/arrow-header-mobile.svg";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.scss";
import { useIsPC } from "@hooks/isPC";
import { useModal } from "@components/ModalProvider/ModalProvider";
import MegaPanel from "./MegaPanel";
import {
  detectLocaleFromPath,
  buildFullPathForId,
  getLabel,
  findNodeById,
} from "@nav/nav-utils";
import { buildPanelDataFromNav } from "@nav/build-panel-from-nav";
import { useHybridNav } from "@contexts/HybridNavContext";
import { useLanguage } from "@hooks/useLanguage";
import { useTranslation } from "@hooks/useTranslation";
import { useHeaderContacts } from "@hooks/useHeaderContacts";

export const Header = () => {
  const { pathname } = useLocation();
  const { currentLang, switchLanguage } = useLanguage();
  const lang = currentLang;
  const { t } = useTranslation("components.Header");
  const { contacts } = useHeaderContacts(lang);

  // Отримуємо навігацію з гібридної системи
  let navTree, loading, error, mergeComplete;
  try {
    const hybridNavData = useHybridNav();
    navTree = hybridNavData.navTree;
    loading = hybridNavData.loading;
    error = hybridNavData.error;
    mergeComplete = hybridNavData.mergeComplete;
  } catch (contextError) {
    navTree = null;
    loading = false;
    error = contextError.message;
    mergeComplete = false;
  }
  // currentLang теперь получаем из useLanguage

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

  const [openKey, setOpenKey] = useState(null); // "services" | "translate" | "other" | null

  const toggleAccordion = (index) => {
    setActiveIndexes(
      (prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index) // если был открыт — закрыть
          : [...prev, index] // если был закрыт — открыть
    );
  };

  const panelData = useMemo(
    () => (navTree ? buildPanelDataFromNav(navTree, lang) : null),
    [navTree, lang]
  );

  // Функция для проверки showMegaPanel из backend
  const shouldShowMegaPanel = useCallback(
    (key) => {
      if (!navTree) return false;

      // Ищем секцию в navTree
      const findSection = (nodes, targetId) => {
        for (const node of nodes) {
          if (node.id === targetId) {
            return node;
          }
          if (node.children) {
            const found = findSection(node.children, targetId);
            if (found) return found;
          }
        }
        return null;
      };

      const section = findSection(navTree.children, key);
      return section?.showMegaPanel === true;
    },
    [navTree]
  );

  const hoverTimer = useRef(null);

  const openOnHover = (key) => {
    // Проверяем showMegaPanel из backend
    if (!shouldShowMegaPanel(key)) {
      return;
    }
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpenKey(key), 15); // маленькая задержка
  };

  const closeAfterHover = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpenKey(null), 140); // плавно закрываем
  };

  const onFocusItem = (key) => {
    // Проверяем showMegaPanel из backend
    if (!shouldShowMegaPanel(key)) {
      return;
    }
    setOpenKey(key);
  };
  const onBlurZone = () => closeAfterHover();

  const closeMenu = () => {
    setMenuOpen(false);
  };

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

  // Функція для отримання URL з навігаційного дерева по ID
  const getNavUrl = (navId, currentLang = lang) => {
    if (!navTree || loading) return "#";
    const url = buildFullPathForId(navTree, navId, currentLang);
    return url || "#";
  };

  // Функція для отримання перекладу з навігаційного дерева по ID
  const getNavLabel = (navId, currentLang = lang) => {
    if (!navTree || loading) return navId;
    const node = findNodeById(navTree, navId);
    return getLabel(node, currentLang) || navId;
  };

  // Функція для отримання перекладу секції (для мобільного меню)
  const getSectionLabel = (sectionKey, currentLang = lang) => {
    const sectionLabels = {
      ua: {
        services: "Послуги",
        contacts: "Контакти",
        social: "Соціальні мережі",
      },
      ru: {
        services: "Услуги",
        contacts: "Контакты",
        social: "Социальные сети",
      },
      en: {
        services: "Services",
        contacts: "Contacts",
        social: "Social networks",
      },
    };
    return (
      sectionLabels[currentLang]?.[sectionKey] ||
      sectionLabels.ua[sectionKey] ||
      sectionKey
    );
  };

  // Показуємо завантаження якщо навігація ще не завантажена або не об'єднана
  if (loading || !mergeComplete) {
    return (
      <header className="header">
        <div className="header-info bg4">
          <div className="container">
            <div className="header-info-content fs-p--16px lh-150 text-decoration--none c1">
              <div style={{ textAlign: "center", padding: "20px" }}>
                {loading
                  ? "Завантаження навігації..."
                  : "Об'єднання з backend..."}
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Показуємо помилку якщо не вдалося завантажити навігацію
  if (error || !navTree) {
    return (
      <header className="header">
        <div className="header-info bg4">
          <div className="container">
            <div className="header-info-content fs-p--16px lh-150 text-decoration--none c1">
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#dc3545",
                }}
              >
                Помилка завантаження навігації
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className={`header${menuOpen ? "menu-open bg8" : ""}${openKey ? "mega-open" : ""}`}
      >
        <div className="header-info bg4">
          <div className="container">
            <div className="header-info-content fs-p--16px lh-150 text-decoration--none c1">
              <a className="header-info-email" href={`mailto:${contacts.email || ''}`}>
                {contacts.email || 'nknotary.dnipro@gmail.com'}
              </a>
              <div className="header-info-phones-wrap">
                {contacts.phone_number && (
                  <a className="header-info-phones" href={`tel:${contacts.phone_number.replace(/\s|\+/g, '')}`}>
                    {contacts.phone_number}
                  </a>
                )}
                {contacts.phone_number_2 && (
                  <a className="header-info-phones" href={`tel:${contacts.phone_number_2.replace(/\s|\+/g, '')}`}>
                    {contacts.phone_number_2}
                  </a>
                )}
              </div>
              <a className="header-info-address" href="#">
                {contacts.address || 'м. Дніпро, пр. Дмитра Яворницького, 2, 49100'}
              </a>
            </div>
          </div>
        </div>
        <div className="header-content">
          <div className="container">
            <div className="header-wrap">
              <div className="navbar-burger-block">
                <button
                  className={`navbar-burger-wrap btn-z-style ${menuOpen ? "active" : ""}`}
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <span className="bg3"></span>
                  <span className="bg3"></span>
                  <span className="bg3"></span>
                </button>
              </div>
              <div className="navbar-social-link-block-pc-wrap">
                <div className="navbar-social-link-block-pc">
                  <a className="navbar-social-link bg4" href="#">
                    <svg
                      className="navbar-social-link-icon c1"
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
                  <a className="navbar-social-link bg4" href="#">
                    <svg
                      className="navbar-social-link-icon c1"
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
                  <a className="navbar-social-link bg4" href="#">
                    <svg
                      className="navbar-social-link-icon c1"
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
                  <a className="navbar-social-link bg4" href="#">
                    <svg
                      className="navbar-social-link-icon c1"
                      width="24"
                      height="20"
                      viewBox="0 0 24 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.9483 4.11166C20.8589 3.76108 20.6048 3.49637 20.3142 3.41519C19.8001 3.27049 17.2942 2.94108 12.0001 2.94108C6.70594 2.94108 4.20241 3.27049 3.68359 3.41519C3.39653 3.49519 3.14241 3.7599 3.05182 4.11166C2.92359 4.61049 2.58829 6.70108 2.58829 9.9999C2.58829 13.2987 2.92359 15.3881 3.05182 15.8893C3.14123 16.2387 3.39535 16.5034 3.68476 16.5834C4.20241 16.7293 6.70594 17.0587 12.0001 17.0587C17.2942 17.0587 19.7989 16.7293 20.3165 16.5846C20.6036 16.5046 20.8577 16.2399 20.9483 15.8881C21.0765 15.3893 21.4118 13.294 21.4118 9.9999C21.4118 6.70578 21.0765 4.61166 20.9483 4.11166ZM23.2271 3.52696C23.7648 5.62343 23.7648 9.9999 23.7648 9.9999C23.7648 9.9999 23.7648 14.3764 23.2271 16.4728C22.9283 17.6317 22.0542 18.5434 20.9471 18.8517C18.9365 19.4117 12.0001 19.4117 12.0001 19.4117C12.0001 19.4117 5.06712 19.4117 3.053 18.8517C1.94123 18.5387 1.06829 17.6281 0.772999 16.4728C0.235352 14.3764 0.235352 9.9999 0.235352 9.9999C0.235352 9.9999 0.235352 5.62343 0.772999 3.52696C1.07182 2.36813 1.94594 1.45637 3.053 1.14813C5.06712 0.588135 12.0001 0.588135 12.0001 0.588135C12.0001 0.588135 18.9365 0.588135 20.9471 1.14813C22.0589 1.46108 22.9318 2.37166 23.2271 3.52696ZM9.64712 14.1175V5.88225L16.7059 9.9999L9.64712 14.1175Z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                </div>
              </div>
              <Link to="/" className="header-logo-wrap">
                <svg
                  className="header-logo c3"
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
                    className="search-icon c3"
                    width="24"
                    height="24"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M29.71,28.29l-6.5-6.5-.07,0a12,12,0,1,0-1.39,1.39s0,.05,0,.07l6.5,6.5a1,1,0,0,0,1.42,0A1,1,0,0,0,29.71,28.29ZM14,24A10,10,0,1,1,24,14,10,10,0,0,1,14,24Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
                <div className="header-change-lang-dropdown">
                  <div className="header-change-lang-list">
                    {[
                      { key: "ukr", label: "UA", lang: "ua" },
                      { key: "rus", label: "RU", lang: "ru" },
                      { key: "eng", label: "EN", lang: "en" },
                    ].map(({ key, label, lang: langCode }) => (
                      <button
                        key={key}
                        className={`header-change-lang fs-p--16px ${lang === langCode ? "c3" : "c16"} lh-150 `}
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
                    <p className="phone-btn uppercase fs-p--16px">
                      {t("contactButton")}
                    </p>
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.9449 3.06998C22.0236 1.57623 20.5097 0.522502 18.7697 0.173752C17.726 -0.0374985 16.6648 0.438734 16.1248 1.35123L14.1711 4.65125C13.3073 6.11125 13.736 7.99001 15.1485 8.93001L16.7885 10.02C15.4148 12.99 12.9922 15.4188 10.0359 16.79L8.93362 15.1438C7.98987 13.735 6.10987 13.31 4.64987 14.18L1.34604 16.15C0.436039 16.6925 -0.0339461 17.7525 0.173554 18.7887C0.517304 20.5075 1.57107 22.0225 3.06357 22.9425C4.06482 23.56 5.17844 23.8763 6.31094 23.8763C6.85719 23.8763 7.40599 23.8025 7.94974 23.6537C15.5485 21.5675 21.5672 15.5537 23.6535 7.95875C24.111 6.2925 23.8599 4.55498 22.9449 3.06998ZM22.4471 7.62752C20.4771 14.8 14.7933 20.4788 7.6171 22.4488C6.29335 22.8125 4.90595 22.6113 3.7197 21.8788C2.52095 21.1388 1.67475 19.9238 1.39975 18.5425C1.296 18.0238 1.53099 17.4938 1.98599 17.2225L5.28983 15.2525C5.60108 15.0675 5.94351 14.9787 6.28226 14.9787C6.90976 14.9787 7.52228 15.2825 7.89603 15.8388L9.28976 17.92C9.45601 18.1687 9.77215 18.265 10.0497 18.1488C13.6747 16.6325 16.6284 13.6738 18.1484 10.03C18.2647 9.75376 18.1686 9.435 17.9186 9.26875L15.8422 7.88749C14.9822 7.31624 14.7221 6.17375 15.2471 5.28625L17.1996 1.98627C17.4721 1.53002 18.0074 1.29374 18.5436 1.39999C19.9236 1.67624 21.1398 2.52249 21.8798 3.72249C22.6123 4.91249 22.8134 6.29877 22.4471 7.62752Z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="navbar-link-block-wrap">
        <nav className="navbar-link-block container fs-p--16px uppercase fw-semi-bold lh-150 c3">
          <Link
            className="navbar-link text-decoration--none c3"
            to={getNavUrl("about")}
          >
            {getNavLabel("about")}
          </Link>

          {/* Нотаріальні послуги */}
          {shouldShowMegaPanel("services") ? (
            <div
              className={`nav-item nav-item--mega ${openKey === "services" ? "is-open" : ""}`}
              onMouseEnter={() => openOnHover("services")}
              onMouseLeave={(e) => {
                // не закрывать, если уходим на дочернюю панель
                if (
                  e.relatedTarget &&
                  e.currentTarget.contains(e.relatedTarget)
                )
                  return;
                closeAfterHover();
              }}
              onFocus={() => onFocusItem("services")}
              onBlur={onBlurZone}
            >
              <Link
                className="navbar-link text-decoration--none c3"
                to={getNavUrl("services")}
              >
                {getNavLabel("services")}
              </Link>

              {openKey === "services" && (
                <div
                  className="nav__mega"
                  onMouseEnter={() => clearTimeout(hoverTimer.current)}
                  onMouseLeave={closeAfterHover}
                >
                  <MegaPanel
                    openKey="services"
                    data={panelData}
                    onClose={() => setOpenKey(null)}
                    lang={lang}
                    navTree={navTree}
                  />
                </div>
              )}
            </div>
          ) : (
            <Link
              className="navbar-link text-decoration--none c3"
              to={getNavUrl("services")}
            >
              {getNavLabel("services")}
            </Link>
          )}

          {/* Нотаріальний переклад */}
          {shouldShowMegaPanel("notary-translate") ? (
            <div
              className={`nav-item nav-item--mega ${openKey === "notary-translate" ? "is-open" : ""}`}
              onMouseEnter={() => openOnHover("notary-translate")}
              onMouseLeave={(e) => {
                if (
                  e.relatedTarget &&
                  e.currentTarget.contains(e.relatedTarget)
                )
                  return;
                closeAfterHover();
              }}
              onFocus={() => onFocusItem("notary-translate")}
              onBlur={onBlurZone}
            >
              <Link
                className="navbar-link text-decoration--none c3"
                to={getNavUrl("notary-translate")}
              >
                {getNavLabel("notary-translate")}
              </Link>

              {openKey === "notary-translate" && (
                <div
                  className="nav__mega"
                  onMouseEnter={() => clearTimeout(hoverTimer.current)}
                  onMouseLeave={closeAfterHover}
                >
                  <MegaPanel
                    openKey="notary-translate"
                    data={panelData}
                    onClose={() => setOpenKey(null)}
                    lang={lang}
                    navTree={navTree}
                  />
                </div>
              )}
            </div>
          ) : (
            <Link
              className="navbar-link text-decoration--none c3"
              to={getNavUrl("notary-translate")}
            >
              {getNavLabel("notary-translate")}
            </Link>
          )}

          {/* Інші послуги */}
          {shouldShowMegaPanel("other-services") ? (
            <div
              className={`nav-item nav-item--mega ${openKey === "other-services" ? "is-open" : ""}`}
              onMouseEnter={() => openOnHover("other-services")}
              onMouseLeave={(e) => {
                if (
                  e.relatedTarget &&
                  e.currentTarget.contains(e.relatedTarget)
                )
                  return;
                closeAfterHover();
              }}
              onFocus={() => onFocusItem("other-services")}
              onBlur={onBlurZone}
            >
              <Link
                className="navbar-link text-decoration--none c3"
                to={getNavUrl("other-services")}
              >
                {getNavLabel("other-services")}
              </Link>

              {openKey === "other-services" && (
                <div
                  className="nav__mega"
                  onMouseEnter={() => clearTimeout(hoverTimer.current)}
                  onMouseLeave={closeAfterHover}
                >
                  <MegaPanel
                    openKey="other-services"
                    data={panelData}
                    onClose={() => setOpenKey(null)}
                    lang={lang}
                    navTree={navTree}
                  />
                </div>
              )}
            </div>
          ) : (
            <Link
              className="navbar-link text-decoration--none c3"
              to={getNavUrl("other-services")}
            >
              {getNavLabel("other-services")}
            </Link>
          )}

          {/* Для військових */}
          {shouldShowMegaPanel("military-help") ? (
            <div
              className={`nav-item nav-item--mega ${openKey === "military-help" ? "is-open" : ""}`}
              onMouseEnter={() => openOnHover("military-help")}
              onMouseLeave={(e) => {
                if (
                  e.relatedTarget &&
                  e.currentTarget.contains(e.relatedTarget)
                )
                  return;
                closeAfterHover();
              }}
              onFocus={() => onFocusItem("military-help")}
              onBlur={onBlurZone}
            >
              <Link
                className="navbar-link text-decoration--none c3"
                to={getNavUrl("military-help")}
              >
                {getNavLabel("military-help")}
              </Link>

              {openKey === "military-help" && (
                <div
                  className="nav__mega"
                  onMouseEnter={() => clearTimeout(hoverTimer.current)}
                  onMouseLeave={closeAfterHover}
                >
                  <MegaPanel
                    openKey="military-help"
                    data={panelData}
                    onClose={() => setOpenKey(null)}
                    lang={lang}
                    navTree={navTree}
                  />
                </div>
              )}
            </div>
          ) : (
            <Link
              className="navbar-link text-decoration--none c3"
              to={getNavUrl("military-help")}
            >
              {getNavLabel("military-help")}
            </Link>
          )}
          <Link
            className="navbar-link text-decoration--none c3"
            to={getNavUrl("blog")}
          >
            {getNavLabel("blog")}
          </Link>
          <Link
            className="navbar-link text-decoration--none c3"
            to={getNavUrl("contacts")}
          >
            {getNavLabel("contacts")}
          </Link>
        </nav>
      </div>
      <div
        className={`overlay ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
      />
      <nav className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="container">
          <ul className="mobile-menu-list">
            <Link
              onClick={closeMenu}
              to={getNavUrl("about")}
              className="mobile-menu-item fs-p--16px fw-medium lh-100 c9"
            >
              {getNavLabel("about")}
            </Link>

            {/* Послуги */}
            <li
              className={`mobile-menu-item ${activeIndexes.includes(0) ? "active" : ""}`}
            >
              <div
                className="accordion-header fw-medium"
                onClick={() => toggleAccordion(0)}
              >
                {getSectionLabel("services")}
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
                    <Link onClick={closeMenu} to={getNavUrl("services")}>
                      {getNavLabel("services")}
                    </Link>
                  </li>
                  <li className="accordion-header-content-item">
                    <Link
                      onClick={closeMenu}
                      to={getNavUrl("notary-translate")}
                    >
                      {getNavLabel("notary-translate")}
                    </Link>
                  </li>
                  <li className="accordion-header-content-item">
                    <Link onClick={closeMenu} to={getNavUrl("military-help")}>
                      {getNavLabel("military-help")}
                    </Link>
                  </li>
                  <li className="fs-p--16px lh-100">
                    <Link onClick={closeMenu} to={getNavUrl("other-services")}>
                      {getNavLabel("other-services")}
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
                {getSectionLabel("contacts")}
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
                    <a href="">м. Дніпро, пр. Дмитра Яворницького, 2, 49100 </a>
                  </li>
                </ul>
              </div>
            </li>
            <li className="mobile-menu-item">
              <div className="accordion-header fw-medium">
                {getSectionLabel("social")}
                <ul className="mobile-menu-social-block">
                  <li className="mobile-menu-social-block-item">
                    <a href="#" className="mobile-menu-social-block-item-link">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        className="mobile-menu-social-block-item-img"
                        fill="none"
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
                  </li>
                  <li className="mobile-menu-social-block-item">
                    <a href="#" className="mobile-menu-social-block-item-link">
                      <svg
                        className="mobile-menu-social-block-item-img"
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
                  </li>
                  <li className="mobile-menu-social-block-item">
                    <a href="#" className="mobile-menu-social-block-item-link">
                      <svg
                        className="mobile-menu-social-block-item-img"
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
                  </li>
                  <li className="mobile-menu-social-block-item">
                    <a href="#" className="mobile-menu-social-block-item-link">
                      <svg
                        className="mobile-menu-social-block-item-img"
                        width="24"
                        height="20"
                        viewBox="0 0 24 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.9483 4.11166C20.8589 3.76108 20.6048 3.49637 20.3142 3.41519C19.8001 3.27049 17.2942 2.94108 12.0001 2.94108C6.70594 2.94108 4.20241 3.27049 3.68359 3.41519C3.39653 3.49519 3.14241 3.7599 3.05182 4.11166C2.92359 4.61049 2.58829 6.70108 2.58829 9.9999C2.58829 13.2987 2.92359 15.3881 3.05182 15.8893C3.14123 16.2387 3.39535 16.5034 3.68476 16.5834C4.20241 16.7293 6.70594 17.0587 12.0001 17.0587C17.2942 17.0587 19.7989 16.7293 20.3165 16.5846C20.6036 16.5046 20.8577 16.2399 20.9483 15.8881C21.0765 15.3893 21.4118 13.294 21.4118 9.9999C21.4118 6.70578 21.0765 4.61166 20.9483 4.11166ZM23.2271 3.52696C23.7648 5.62343 23.7648 9.9999 23.7648 9.9999C23.7648 9.9999 23.7648 14.3764 23.2271 16.4728C22.9283 17.6317 22.0542 18.5434 20.9471 18.8517C18.9365 19.4117 12.0001 19.4117 12.0001 19.4117C12.0001 19.4117 5.06712 19.4117 3.053 18.8517C1.94123 18.5387 1.06829 17.6281 0.772999 16.4728C0.235352 14.3764 0.235352 9.9999 0.235352 9.9999C0.235352 9.9999 0.235352 5.62343 0.772999 3.52696C1.07182 2.36813 1.94594 1.45637 3.053 1.14813C5.06712 0.588135 12.0001 0.588135 12.0001 0.588135C12.0001 0.588135 18.9365 0.588135 20.9471 1.14813C22.0589 1.46108 22.9318 2.37166 23.2271 3.52696ZM9.64712 14.1175V5.88225L16.7059 9.9999L9.64712 14.1175Z"
                          fill="currentColor"
                        />
                      </svg>
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
              {[
                { key: "ukr", label: "UA", lang: "ua" },
                { key: "rus", label: "RU", lang: "ru" },
                { key: "eng", label: "EN", lang: "en" },
              ].map(({ key, label, lang: langCode }) => (
                <button
                  key={key}
                  className={`mobile-menu-change-lang lh-100 ${isPC ? "fs-p--30px" : "fs-p--16px"} ${lang === langCode ? "active" : ""}`}
                  onClick={() => switchLang(key)}
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
