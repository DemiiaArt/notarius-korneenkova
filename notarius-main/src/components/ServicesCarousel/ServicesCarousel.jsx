import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Link, useLocation } from "react-router-dom";
import { useLang } from "@nav/use-lang";
import { buildFullPathForId, getLabel, findNodeById } from "@nav/nav-utils";
import { useHybridNav } from "@contexts/HybridNavContext";
import { useIsPC } from "@hooks/isPC";
import { useTranslation } from "@hooks/useTranslation";
import arrowRight from "@media/comments-carousel/arrow-right.svg";
import "./ServicesCarousel.scss";
import { BACKEND_BASE_URL } from "@/config/api";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ServicesCarousel = ({
  parentId, // ID батьківського елемента в навігаційному дереві
  title = "ПОСЛУГИ", // Заголовок, который будет переводиться
  showTitle = true,
  className = "",
  kind = "page",
}) => {
  const { currentLang } = useLang();
  const isPC = useIsPC();
  const location = useLocation();
  const { navTree, loading, error } = useHybridNav();
  const { t } = useTranslation("components.ServicesCarousel");

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
      <div className={`services-carousel ${className}`}>
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

  // Используем функцию из nav-utils для поиска детей
  const findChildren = (node, targetId) => {
    const targetNode = findNodeById(node, targetId);
    return targetNode ? targetNode.children || [] : [];
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
        const node = findChildren(navTree, "root").find(
          (child) => child.id === id
        );
        return node
          ? {
              id: node.id,
              kind: node.kind,
              label: node.label,
              showInMenu: node.showInMenu,
              cardImage: node.cardImage, // Добавляем card_image из merged дерева
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
    const children = findChildren(navTree, targetParentId) || [];

    visibleChildren = children.filter(
      (child) =>
        child &&
        child.kind === targetKind &&
        child.showInMenu !== false &&
        child.label && // Перевіряємо, що є лейбл
        child.label[currentLang]
    );
  }

  // Отримуємо лейбл для мови
  const getLabel = (node, lang) => {
    return (node?.label && node.label[lang]) || "";
  };

  // Отримуємо URL для елемента
  const getUrl = (nodeId) => {
    return buildFullPathForId(navTree, nodeId, currentLang) || "#";
  };

  // Отримуємо зображення для послуги
  const getServiceImage = (service) => {
    // Якщо є card_image в об'єкті сервісу, використовуємо його
    console.log("🖼️ ServicesCarousel - Getting image for service:", service);
    if (service?.cardImage) {
      return `${BACKEND_BASE_URL}${service.cardImage}`;
    }

    // Fallback - картинка за замовчуванням
    return "/src/assets/media/services-carousel/ServicesGallery_notary.png";
  };

  if (visibleChildren.length === 0) {
    return null;
  }

  return (
    <div className={`services-carousel ${className}`}>
      <div className="container">
        <div className="services-carousel-container">
          {showTitle && (
            <h2 className="services-carousel-title">
              {getTranslatedTitle(title)}
            </h2>
          )}
        </div>
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
                    src={getServiceImage(service)}
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
          <img src={arrowRight} alt="arrow-right" />
        </button>
        <button className="services-carousel-next">
          <img src={arrowRight} alt="arrow-right" />
        </button>
      </div>
    </div>
  );
};

export default ServicesCarousel;
