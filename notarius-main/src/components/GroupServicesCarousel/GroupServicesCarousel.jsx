import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { useLang } from "@nav/use-lang";
import { MEDIA_BASE_URL } from "@/config/api";
import {
  buildFullPathForId,
  findPathStackById,
  getLabel,
  findNodeById,
} from "@nav/nav-utils";
import { useHybridNav } from "@contexts/HybridNavContext";
import { useIsPC } from "@hooks/isPC";
import { useTranslation } from "@hooks/useTranslation";
import arrowRight from "@media/comments-carousel/arrow-right.svg";
import "./GroupServicesCarousel.scss";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const GroupServicesCarousel = ({
  parentId, // ID батьківського елемента в навігаційному дереві
  title = "ВИДИ НОТАРІАЛЬНИХ ПОСЛУГ", // Заголовок, который будет переводиться
  showTitle = true,
  className = "",
  kind = "page", // Тип елементів для показу (теперь показываем и page, и group)
}) => {
  const { currentLang } = useLang();
  const isPC = useIsPC();
  const { navTree, loading, error } = useHybridNav();
  const { t } = useTranslation("components.GroupServicesCarousel");

  // Функция для получения переведенного заголовка
  const getTranslatedTitle = (originalTitle) => {
    const titles = t("titles");
    return titles && titles[originalTitle]
      ? titles[originalTitle]
      : originalTitle;
  };

  // Показуємо завантаження якщо навігація ще не завантажена
  if (loading) {
    return (
      <div className={`group-services-carousel ${className}`}>
        <div className="container">
          <div style={{ textAlign: "center", padding: "20px" }}>
            {t("loading")}
          </div>
        </div>
      </div>
    );
  }

  // Показуємо помилку якщо не вдалося завантажити навігацію
  if (error || !navTree) {
    return null;
  }

  // Используем функцию из nav-utils для поиска детей
  const findChildren = (node, targetId) => {
    const targetNode = findNodeById(node, targetId);
    return targetNode ? targetNode.children || [] : [];
  };

  const children = findChildren(navTree, parentId) || [];

  console.log("🔍 GroupServicesCarousel - parentId:", parentId);
  console.log("🔍 GroupServicesCarousel - children:", children);
  console.log(
    "🔍 GroupServicesCarousel - children kinds:",
    children.map((c) => ({
      id: c.id,
      kind: c.kind,
      label: c.label?.[currentLang],
    }))
  );

  // Фільтруємо елементи за типом
  // Показуємо як page, так і group елементи
  const visibleChildren = children.filter(
    (child) =>
      child &&
      (child.kind === "page" || child.kind === "group") &&
      child.showInMenu !== false &&
      child.label && // Перевіряємо, що є лейбл
      child.label[currentLang]
  );

  console.log("🔍 GroupServicesCarousel - visibleChildren:", visibleChildren);
  console.log(
    "🔍 GroupServicesCarousel - visibleChildren count:",
    visibleChildren.length
  );

  // Отримуємо лейбл для мови
  const getLabel = (node, lang) => {
    return (node?.label && node.label[lang]) || "";
  };

  // Отримуємо URL для елемента
  const getUrl = (nodeId) => {
    return buildFullPathForId(navTree, nodeId, currentLang) || "#";
  };

  // Отримуємо зображення для послуги з навігаційного дерева
  const getServiceImage = (service) => {
    // Якщо є card_image в об'єкті сервісу, використовуємо його
    if (service?.card_image) {
      return service.card_image.startsWith('/media/') 
        ? service.card_image 
        : `${MEDIA_BASE_URL}${service.card_image}`;
    }
    // Fallback - картинка за замовчуванням
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
            {getTranslatedTitle(title)}
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
                    src={getServiceImage(service)}
                    alt={getLabel(service, currentLang)}
                    loading="lazy"
                  />
                </div>
                <div className="group-services-carousel-content">
                  <h3
                    className={`group-services-carousel-label ${isPC ? "fs-p--24px" : "fs-p--14px"} fw-semi-bold c3 uppercase`}
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
          <img src={arrowRight} alt="arrow-right" />
        </button>
        <button className="group-services-carousel-next">
          <img src={arrowRight} alt="arrow-right" />
        </button>
      </div>
    </div>
  );
};

export default GroupServicesCarousel;
