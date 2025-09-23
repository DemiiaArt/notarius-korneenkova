import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Link, useLocation } from "react-router-dom";
import { useLang } from "@nav/use-lang";
import { buildFullPathForId } from "@nav/nav-utils";
import { NAV_TREE } from "@nav/nav-tree";
import { useIsPC } from "@hooks/isPC";
import "./ServicesCarousel.scss";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ServicesCarousel = ({
  parentId, // ID батьківського елемента в навігаційному дереві
  title = "ПОСЛУГИ",
  showTitle = true,
  className = "",
  kind = "page",
}) => {
  const { currentLang } = useLang();
  const isPC = useIsPC();
  const location = useLocation();

  // Функция для определения уровня вложенности страницы
  const getPageLevel = (pathname) => {
    const segments = pathname
      .split("/")
      .filter((segment) => segment.length > 0);
    return segments.length;
  };

  // Функция для определения, является ли страница последним уровнем
  const isLastLevel = (pathname) => {
    const segments = pathname
      .split("/")
      .filter((segment) => segment.length > 0);
    // Если в пути есть "secondLevel", то это не последний уровень
    return !pathname.includes("secondLevel");
  };

  // Определяем уровень текущей страницы
  const currentPageLevel = getPageLevel(location.pathname);
  const isLastLevelPage = isLastLevel(location.pathname);

  // Отладочная информация
  // console.log("ServicesCarousel Level Debug:", {
  //   pathname: location.pathname,
  //   currentPageLevel,
  //   isLastLevelPage,
  //   originalParentId: parentId,
  //   originalKind: kind,
  // });

  // Знаходимо батьківський елемент та його дочірні елементи
  const findChildren = (node, targetId) => {
    if (node.id === targetId) {
      return node.children || [];
    }

    if (node.children) {
      for (const child of node.children) {
        const result = findChildren(child, targetId);
        if (result) return result;
      }
    }

    return null;
  };

  // Логика выбора данных для карусели
  let targetParentId = parentId;
  let targetKind = kind;

  // Если это главная страница services - не показываем ServicesCarousel (используется GroupServicesCarousel)
  // Но показываем на страницах второго уровня (secondLevel)
  if (
    (location.pathname === "/notarialni-poslugy" ||
      location.pathname === "/notary-services") &&
    !location.pathname.includes("secondLevel")
  ) {
    return null;
  }

  // Если это 1 уровень или последний уровень - показываем конкретные ID из хедера
  if (currentPageLevel === 1 || isLastLevelPage) {
    // Используем специальную логику для хедерных сервисов
    targetParentId = "root";
    targetKind = "custom"; // Специальный тип для хедерных сервисов
  } else {
    // Для 2 уровня и далее - используем переданные параметры
    targetParentId = parentId;
    targetKind = kind;
  }

  let visibleChildren = [];

  if (targetKind === "custom") {
    // Для хедерных сервисов используем предварительно созданный массив
    const headerServiceIds = [
      "services",
      "notary-translate",
      "other-services",
      "military-help",
    ];

    visibleChildren = headerServiceIds
      .map((id) => {
        const node = findChildren(NAV_TREE, "root").find(
          (child) => child.id === id
        );
        return node
          ? {
              id: node.id,
              kind: node.kind,
              label: node.label,
              showInMenu: node.showInMenu,
            }
          : null;
      })
      .filter(
        (child) =>
          child &&
          child.showInMenu !== false &&
          child.label &&
          child.label[currentLang]
      );
  } else {
    // Обычная логика для других случаев
    const children = findChildren(NAV_TREE, targetParentId) || [];

    visibleChildren = children.filter(
      (child) =>
        child &&
        child.kind === targetKind &&
        child.showInMenu !== false &&
        child.label && // Перевіряємо, що є лейбл
        child.label[currentLang]
    );
  }

  // Отладочная информация для выбранных данных
  // console.log("ServicesCarousel Data Debug:", {
  //   targetParentId,
  //   targetKind,
  //   visibleChildrenCount: visibleChildren.length,
  //   visibleChildren: visibleChildren.map((c) => ({
  //     id: c?.id,
  //     label: c?.label?.[currentLang],
  //   })),
  // });

  // Отримуємо лейбл для мови
  const getLabel = (node, lang) => {
    return (node?.label && node.label[lang]) || "";
  };

  // Отримуємо URL для елемента
  const getUrl = (nodeId) => {
    return buildFullPathForId(NAV_TREE, nodeId, currentLang) || "#";
  };

  // Отримуємо зображення для послуги
  const getServiceImage = (serviceId) => {
    const images = [
      "/src/assets/media/services-carousel/ServicesGallery_notary.png",
      "/src/assets/media/services-carousel/ServicesGallery_ranslate.png",
      "/src/assets/media/services-carousel/ServicesGallery_military.png",
    ];

    // Використовуємо хеш ID для вибору зображення
    let hash = 0;
    for (let i = 0; i < serviceId.length; i++) {
      const char = serviceId.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    const imageIndex = Math.abs(hash) % images.length;
    return images[imageIndex];
  };

  if (visibleChildren.length === 0) {
    return null;
  }

  return (
    <div className={`services-carousel ${className}`}>
      <div className="services-carousel-container">
        {showTitle && <h2 className="services-carousel-title">{title}</h2>}
      </div>
      <div className="services-carousel-wrapper">
        <Swiper
          modules={[Navigation]}
          spaceBetween={isPC ? 10 : 4}
          slidesPerView={isPC ? 3 : 1.43}
          centeredSlides={false}
          navigation={{
            nextEl: ".services-carousel-next",
            prevEl: ".services-carousel-prev",
          }}
          className="services-carousel-swiper"
        >
          {visibleChildren.map((service, index) => (
            <SwiperSlide key={service.id}>
              <Link to={getUrl(service.id)} className="services-carousel-slide">
                <div className="services-carousel-image">
                  <img
                    src={getServiceImage(service.id)}
                    alt={getLabel(service, currentLang)}
                    loading="lazy"
                  />
                  <div className="services-carousel-overlay"></div>
                </div>
                <div className="services-carousel-content">
                  <h3
                    className={`services-carousel-label fw-semi-bold ${isPC ? "fs-p--28px" : "fs-p--18px"} c1`}
                  >
                    {getLabel(service, currentLang)}
                  </h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Навігаційні стрілки */}
        <button className="services-carousel-prev">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button className="services-carousel-next">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ServicesCarousel;
