import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { useLang } from "@nav/use-lang";
import { buildFullPathForId } from "@nav/nav-utils";
import { NAV_TREE } from "@nav/nav-tree";
import { useIsPC } from "@hooks/isPC";
import "./GroupServicesCarousel.scss";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const GroupServicesCarousel = ({
  parentId, // ID батьківського елемента в навігаційному дереві
  title = "ВИДИ НОТАРІАЛЬНИХ ПОСЛУГ",
  showTitle = true,
  className = "",
  kind = "page", // Тип елементів для показу
}) => {
  const { currentLang } = useLang();
  const isPC = useIsPC();

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

  const children = findChildren(NAV_TREE, parentId) || [];

  // Фільтруємо елементи за типом
  const visibleChildren = children.filter(
    (child) =>
      child &&
      child.kind === kind &&
      child.showInMenu !== false &&
      child.label && // Перевіряємо, що є лейбл
      child.label[currentLang]
  );

  // Отримуємо лейбл для мови
  const getLabel = (node, lang) => {
    return (node?.label && node.label[lang]) || "";
  };

  // Отримуємо URL для елемента
  const getUrl = (nodeId) => {
    return buildFullPathForId(NAV_TREE, nodeId, currentLang) || "#";
  };

  // Отримуємо зображення для послуги (можна розширити)
  const getServiceImage = (serviceId) => {
    // Тут можна додати логіку для різних зображень
    // Поки що використовуємо одне зображення
    return "/src/assets/media/services-carousel/ServicesGallery_notary.png";
  };

  if (visibleChildren.length === 0) {
    return null;
  }

  return (
    <div className={`group-services-carousel ${className}`}>
      <div className="container">
        {showTitle && (
          <h2
            className={`group-services-carousel-title ${isPC ? "fs-p--32px" : "fs-p--24px"} fw-semi-bold uppercase c3`}
          >
            {title}
          </h2>
        )}
      </div>
      <div className="group-services-carousel-wrapper">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={10}
          slidesPerView={isPC ? 4 : 2}
          navigation={{
            nextEl: ".group-services-carousel-next",
            prevEl: ".group-services-carousel-prev",
          }}
          pagination={{
            clickable: true,
            el: ".group-services-carousel-pagination",
          }}
          className="group-services-carousel-swiper"
        >
          {visibleChildren.map((service) => (
            <SwiperSlide key={service.id}>
              <Link
                to={getUrl(service.id)}
                className="group-services-carousel-slide"
              >
                <div className="group-services-carousel-image">
                  <img
                    src={getServiceImage(service.id)}
                    alt={getLabel(service, currentLang)}
                    loading="lazy"
                  />
                </div>
                <div className="group-services-carousel-content">
                  <h3
                    className={`group-services-carousel-label ${isPC ? "fs-p--24px" : "fs-p--14px"} fw-semi-bold c3`}
                  >
                    {getLabel(service, currentLang)}
                  </h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Навігаційні стрілки */}
        <button className="group-services-carousel-prev">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button className="group-services-carousel-next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

export default GroupServicesCarousel;
