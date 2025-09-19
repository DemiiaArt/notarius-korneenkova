import image1 from "@media/services-carousel/ServicesGallery_notary.png";
import image2 from "@media/services-carousel/ServicesGallery_ranslate.png";
import image3 from "@media/services-carousel/ServicesGallery_military.png";
import arrowRight from "@media/services-carousel/icons/arrow-right.svg";
import arrow from "@media/icons/arrow-header-mobile.svg";
import { useLocation } from "react-router-dom";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./Services.scss";
import "swiper/css";
import "swiper/css/navigation";
import { useIsPC } from "@hooks/isPC";
import { useState } from "react";
import { Link } from "react-router-dom";
import { detectLang, buildLocalizedLink } from "@utils/detectLang";
import { useLang } from "../../nav/use-lang";
import { buildServicesMenuList } from "../../nav/build-services-menu-list";

const Services = () => {
  const isPC = useIsPC();
  const { pathname } = useLocation();

  const showServicesListPaths = new Set([
    "/notarialni-poslugy",
    "/ru/notarialni-poslugy",
    "/en/notary-services",
  ]);
  const isServicesPage = showServicesListPaths.has(pathname);

  const slides = [
    {
      imgSrc: image1,
      imgAlt: "ServicesGallery_notary.png",
      text: "нотаріальні послуги",
      links: {
        ua: "/notarialni-poslugy",
        ru: "/notarialni-poslugy",
        en: "/notary-services",
      },
    },
    {
      imgSrc: image2,
      imgAlt: "ServicesGallery_ranslate.png",
      text: "нотаріальний переклад",
      links: {
        ua: "/notarialni-pereklad",
        ru: "/notarialni-pereklad",
        en: "/notary-translation",
      },
    },
    {
      imgSrc: image3,
      imgAlt: "ServicesGallery_military.png",
      text: "допомога військовим",
      links: {
        ua: "/notarialni-dopomoga-viyskovim",
        ru: "/notarialni-dopomoga-viyskovim",
        en: "/notary-military-help",
      },
    },
    // {
    //   imgSrc: image1,
    //   imgAlt: "ServicesGallery_notary.png",
    //   text: "Договір дарування нерухомості або рухомого майна",
    //   links: {
    //     ua: "",
    //     ru: "",
    //     en: "",
    //   },
    // },
    // {
    //   imgSrc: image2,
    //   imgAlt: "ServicesGallery_ranslate.png",
    //   text: "Договір позики",
    //   links: {
    //     ua: "",
    //     ru: "",
    //     en: "",
    //   },
    // },
    // {
    //   imgSrc: image3,
    //   imgAlt: "ServicesGallery_military.png",
    //   text: "Договір міни майна",
    //   links: {
    //     ua: "",
    //     ru: "",
    //     en: "",
    //   },
    // },
  ];

  if (isServicesPage)
    return (
      <div className="services">
        <div className="container">
          <h2
            className={`services-title uppercase ${isPC ? "fs-h2--32px" : "fs-h2--20px"} fw-bold c3`}
          >
            послуги
          </h2>
          <ServicesList isPC={isPC} />
        </div>
        <ServicesCarousel slides={slides} />
      </div>
    );

  return (
    <div className="services">
      <div className="container">
        <h2
          className={`services-title uppercase ${isPC ? "fs-h2--32px" : "fs-h2--20px"} fw-bold c3`}
        >
          послуги
        </h2>
      </div>
      <ServicesCarousel slides={slides} />
    </div>
  );
};

const ServicesCarousel = ({ slides }) => {
  const isPC = useIsPC();
  const { pathname } = useLocation();
  const lang = detectLang(pathname);

  return (
    <>
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".services-carousel-next",
          prevEl: ".services-carousel-prev",
        }}
        className="services-carousel"
        spaceBetween={4}
        slidesPerView={1.43}
        observer={true}
        observeParents={true}
        watchOverflow={true}
        breakpoints={{
          0: { slidesPerView: 1.5 },
          768: { slidesPerView: 3, spaceBetween: "7px" },
        }}
      >
        {slides.map(({ imgSrc, imgAlt, text, links }, idx) => {
          const linkTo = buildLocalizedLink(links, lang);
          return (
            <SwiperSlide key={idx} className="services-carousel-slide">
              <Link className="services-carousel-slide-link" to={linkTo}>
                <img
                  className="services-carousel-slide-image"
                  src={imgSrc}
                  alt={imgAlt}
                />
                <div className="services-carousel-slide-shadow"></div>
                <p
                  className={`services-carousel-slide-text ${isPC ? "fs-h2--34px" : "fs-p--18px"} fw-semi-bold uppercase c1`}
                >
                  {text}
                </p>
              </Link>
            </SwiperSlide>
          );
        })}
        <div className="services-carousel-prev bg6">
          <img src={arrowRight} alt="arrow-right.png" />
        </div>
        <div className="services-carousel-next bg6">
          <img src={arrowRight} alt="arrow-right.png" />
        </div>
      </Swiper>
    </>
  );
};

const menuList = {
  items: [
    {
      title: "ДОГОВОРИ",
      subMenu: [
        {
          title: "",
          items: [
            {
              text: "Договір дарування нерухомості або рухомого майна",
              link: "",
            },
            { text: "Договір позики", link: "" },
            { text: "Договір міни майна", link: "" },
            { text: "Договір довічного утримання (догляду)", link: "" },
            {
              text: "Договір оренди (найму) будівель, земельних ділянок (якщо вимагається нотаріальне посвідчення)",
              link: "",
            },
            { text: "Договір застави (іпотеки)", link: "" },
            {
              text: "Договір поділу або виділу з майна, що є у спільній частковій або сумісній власності",
              link: "",
            },
            { text: "Шлюбний договір", link: "" },
            { text: "Договір про поділ майна подружжя", link: "" },
            {
              text: "Договір про виділ частки у спільному майні подружжя",
              link: "",
            },
            { text: "Договір про розірвання Договору іпотеки", link: "" },
            { text: "Договір поруки", link: "" },
            {
              text: "Договір купівлі-продажу майбутнього об’єкту продажу",
              link: "",
            },
          ],
        },
        {
          title: "Спадкові договори",
          items: [
            { text: "Заповіт простий", link: "" },
            { text: "Заповіт при свідках/складний (з умовами)", link: "" },
            { text: "Спільний заповіт подружжя", link: "" },
            { text: "Договір про відмову від прийняття спадщини", link: "" },
            { text: "Договір про розподіл спадкового майна", link: "" },
          ],
        },
        {
          title: "Договори щодо корпоративних прав",
          items: [
            {
              text: "Договір купівлі-продажу частки в статутному капіталі ТОВ",
              link: "",
            },
            { text: "Договір дарування корпоративних прав", link: "" },
            {
              text: "Договір про внесення змін до установчих документів (в окремих випадках)",
              link: "",
            },
          ],
        },
        {
          title: "ВИКОНАВЧИЙ НАПИС на договорі",
          items: [
            { text: "Оренда нерухомості", link: "" },
            { text: "Транспортного засобу оренда", link: "" },
          ],
        },
        {
          title: "Договори щодо корпоративних прав",
          items: [
            { text: "Інші Договори", link: "" },
            { text: "Корпоративні права", link: "" },
          ],
        },
      ],
    },
    {
      text: "ДОВІРЕНІСТЬ",
      subMenu: [
        {
          items: [
            { text: "Розпорядження транспортним засобом", link: "" },
            { text: "Розпорядження нерухомим майном", link: "" },
            { text: "Представництво інтересів / користування авто", link: "" },
            {
              text: "Розпорядження рухомим майном (грошовими коштами)",
              link: "",
            },
            {
              text: "об’єднана довіреність на представництво інтересів з різними напрямками повноважень (рухоме/нерухоме не об’єднується)",
              link: "",
            },
            {
              text: "Довіреність на двох мовах",
              link: "",
            },
            {
              text: "Cкасування довіреності",
              link: "",
            },
          ],
        },
      ],
    },
    {
      text: "ПІДПИС, ЗАЯВА (на бланках)",
      subMenu: [
        {
          items: [
            { text: "Згода подружжя, на виїзд дитини та інші.", link: "" },
            { text: "На банківських картках", link: "" },
            { text: "На статуті, протоколі, рішенні (1 підпис)", link: "" },
            { text: "Вихід учасника із Товариства заява", link: "" },
            { text: "Заяви на двох мовах", link: "" },
          ],
        },
      ],
    },
    {
      text: "КОНСУЛЬТАЦІЯ. КОПІЯ ДОКУМЕНТІВ. ПОВТОРНЕ ОТРИМАННЯ СВІДОЦТВ.",
      subMenu: [
        {
          items: [
            { text: "Нотаріальні консультації", link: "" },
            { text: "Копія окремих документ до 4-х стор.", link: "" },
            { text: "Копія багатосторінкового документа 1 сторінка", link: "" },
            { text: "ДУБЛІКАТ документів", link: "" },
            {
              text: "Консультативні послуги щодо отримання дублікатів Свідоцтв",
              link: "",
            },
          ],
        },
      ],
    },
    {
      text: "АПОСТИЛЬ ТА АФФІДЕВІТ",
      subMenu: [
        {
          items: [
            { text: "Апостиль будь-яких документів", link: "" },
            { text: "Афідевіт від особи", link: "" },
            { text: "Афідевіт за підписом перекладача", link: "" },
          ],
        },
      ],
    },
  ],
};

// src/components/ServicesList.jsx

const ServicesList = ({ isPC, menu /* optional override */ }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const { currentLang } = useLang();

  // если сверху не передали menu — строим из NAV_TREE
  const menuList = menu ?? buildServicesMenuList(currentLang);

  const toggleSubmenu = (idx, hasSubmenu) => {
    if (!hasSubmenu) return;
    setOpenIndex((cur) => (cur === idx ? null : idx));
  };

  return (
    <>
      <Swiper
        modules={[Navigation]}
        className="services-list"
        slidesPerView={"auto"}
        spaceBetween={10}
        slidesOffsetAfter={150}
        observer
        observeParents
        watchOverflow
        onResize={(sw) => sw.update()}
      >
        {menuList.items.map((item, index) => {
          const label = item.title || item.text; // поддержка обоих полей (как у тебя)
          const hasSubmenu =
            Array.isArray(item.subMenu) && item.subMenu.length > 0;

          return (
            <SwiperSlide
              key={index}
              className={`services-list-item ${isPC ? "fs-p--16px" : "fs-p--12px"} fw-semi-bold uppercase c3 ${openIndex === index ? "open" : ""}`}
              onClick={() => toggleSubmenu(index, hasSubmenu)}
            >
              <div className="services-list-item-header">
                {/* если есть прямая ссылка и нет подменю — делаем линком весь пункт */}
                {item.link && !hasSubmenu ? (
                  <Link to={item.link} className="services-list-item-link">
                    <p>{label}</p>
                  </Link>
                ) : (
                  <p>{label}</p>
                )}

                {hasSubmenu && (
                  <img
                    className={`services-list-item-icon ${openIndex === index ? "open" : ""}`}
                    src={arrow}
                    alt="arrow.svg"
                  />
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Подменю для открытого пункта */}
      {openIndex !== null &&
        Array.isArray(menuList.items[openIndex]?.subMenu) && (
          <div
            className={`services-list-submenu ${openIndex !== null ? "open" : ""}`}
          >
            {menuList.items[openIndex].subMenu.map((group, gIdx) => (
              <div key={`g-${gIdx}`} className="services-list-submenu-group">
                {/* Заголовок группы — НЕ линк */}
                {group.title && (
                  <div
                    className={`services-list-submenu-title ${isPC ? "fs-p--16px" : "fs-p--12px"} fw-bold uppercase c3`}
                  >
                    {group.title}
                  </div>
                )}

                <ul className="services-list-submenu-items">
                  {group.items?.map((it, iIdx) => {
                    const cls = `services-list-submenu-item ${isPC ? "fs-p--16px" : "fs-p--12px"} fw-semi-bold uppercase c3`;
                    return (
                      <li key={`g-${gIdx}-i-${iIdx}`} className={cls}>
                        {it.link ? (
                          <Link to={it.link}>{it.text}</Link>
                        ) : (
                          <span className={cls}>{it.text}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
    </>
  );
};

export default Services;
