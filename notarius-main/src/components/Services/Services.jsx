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
                  className={`services-carousel-slide-text ${isPC ? "fs-p--30px" : "fs-p--18px"} fw-semi-bold uppercase c1`}
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
      text: "ДОГОВОРИ",
      subMenu: [
        { text: "Спадкові договори" },
        { text: "Договори щодо корпоративних прав" },
        { text: "ВИКОНАВЧИЙ НАПИС на договорі" },
      ],
    },
    {
      text: "ДОВІРЕНІСТЬ",
      link: "/notarialni-apostil",
    },
    {
      text: "ПІДПИС, ЗАЯВА (на бланках)",
      link: "/notarialni-apostil",
    },
    {
      text: "Документи під ключ",
      link: "/notarialni-apostil",
    },
    {
      text: "АПОСТИЛЬ ТА АФФІДЕВІТ",
      link: "/notarialni-poslugy/apostil-na-dokumenty",
    },
  ],
};

const ServicesList = ({ isPC }) => {
  const [isOpenSubmenu, setIsOpenSubmenu] = useState(false);

  const toggleSubmenu = () => {
    setIsOpenSubmenu(!isOpenSubmenu);
  };

  return (
    <>
      <Swiper
        modules={[Navigation]}
        className="services-list"
        slidesPerView={"auto"}
        observer={true}
        observeParents={true}
        watchOverflow={true}
        breakpoints={{
          764: { slidesPerView: 10 },
        }}
      >
        {menuList.items.map(({ text, link }, index) => (
          <SwiperSlide
            key={index}
            className={`services-list-item ${isPC ? "fs-p--16px" : "fs-p--12px"} fw-semi-bold uppercase c3 ${index == 0 ? "br-c3" : ""}`}
            onClick={() => index === 0 && toggleSubmenu()}
          >
            {index > 0 ? <Link to={link}>{text}</Link> : ""}
            {index == 0 ? (
              <div className="services-list-item-header">
                <p>{text}</p>
                <img
                  className={`services-list-item-icon ${isOpenSubmenu ? "open" : ""}`}
                  src={arrow}
                  alt="arrow.svg"
                />
              </div>
            ) : (
              ""
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <ul className={`services-list-submenu ${isOpenSubmenu ? "open" : ""}`}>
        {menuList.items.map(({ subMenu }) =>
          subMenu
            ? subMenu.map(({ text, link }, index) => (
                <Link
                  to={link}
                  key={index}
                  className={`services-list-submenu-item ${isPC ? "fs-p--16px" : "fs-p--12px"} fw-semi-bold uppercase c3`}
                >
                  {text}
                </Link>
              ))
            : null
        )}
      </ul>
    </>
  );
};

export default Services;
