import "./Certificates.scss";
import { useIsPC } from "@hooks/isPC";
import { useTranslation } from "@hooks/useTranslation";
import { useLanguage } from "@hooks/useLanguage";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { API_BASE_URL } from "@/config/api";

import "swiper/css";
import "swiper/css/navigation";
import arrowRight from "@media/services-carousel/icons/arrow-right.svg";
import { MEDIA_BASE_URL } from "@/config/api";

const Certificates = () => {
  const [activeTab, setActiveTab] = useState("diplomas");
  const [selectedImage, setSelectedImage] = useState(null);
  const isPC = useIsPC();
  const { currentLang } = useLanguage();
  const { t } = useTranslation("components.Certificates");

  // Данные с бэкенда
  const [data, setData] = useState({
    title: "",
    certificates: [],
    diplomas: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загружаем данные с бэкенда
  useEffect(() => {
    const controller = new AbortController();
    const lang = ["ua", "ru", "en"].includes(currentLang) ? currentLang : "ua";

    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/qualification/?lang=${lang}`, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((resp) => {
        setData({
          title: resp.title || "",
          certificates:
            resp.certificates.map((item) => 
              item.image?.startsWith('/media/') ? item.image : `${MEDIA_BASE_URL}${item.image}`
            ) || [],
          diplomas:
            resp.diplomas.map((item) => 
              item.image?.startsWith('/media/') ? item.image : `${MEDIA_BASE_URL}${item.image}`
            ) || [],
        });
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setError(e.message || "Failed to load");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [currentLang]);

  const renderSwiper = (items, key) => {
    const prevClass = `certificates-carousel-prev-${key}`;
    const nextClass = `certificates-carousel-next-${key}`;
    const paginationClass = `certificates-pagination-${key}`;

    if (!items || items.length === 0) {
      return (
        <div className={`${isPC ? "fs-p--16px" : "fs-p--14px"}`}>
          {loading
            ? t("loading") || "Завантаження..."
            : t("noImages") || "Немає зображень"}
        </div>
      );
    }

    return (
      <>
        <Swiper
          key={key}
          modules={[Navigation, Pagination]}
          pagination={{
            clickable: true,
            el: `.${paginationClass}`,
          }}
          spaceBetween={32}
          slidesPerView={1}
          observer={true}
          observeParents={true}
          watchOverflow={true}
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 32 },
            1024: { slidesPerView: 3, spaceBetween: 32 },
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = `.${prevClass}`;
            swiper.params.navigation.nextEl = `.${nextClass}`;
          }}
          navigation={{
            prevEl: `.${prevClass}`,
            nextEl: `.${nextClass}`,
          }}
          className="certificates-carousel"
        >
          {items.map((item, i) => (
            <SwiperSlide className="certificates-carousel-slide" key={i}>
              <div className="certificates-carousel-slide-inner">
                <img
                  className="certificates-carousel-slide-image"
                  src={item.image}
                  alt={`${t("carousel.altText")} ${i + 1}`}
                  onClick={() => setSelectedImage(item.image)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </SwiperSlide>
          ))}

          {/* Стрелки */}
          <div className={`${prevClass} certificates-carousel-prev bg6`}>
            <img src={arrowRight} alt={t("carousel.prevAlt")} />
          </div>
          <div className={`${nextClass} certificates-carousel-next bg6`}>
            <img src={arrowRight} alt={t("carousel.nextAlt")} />
          </div>
        </Swiper>
        <div className={paginationClass}></div>
      </>
    );
  };

  if (loading) {
    return (
      <div className="certificates">
        <div className="container">
          <p className={`${isPC ? "fs-p--16px" : "fs-p--14px"}`}>
            {t("loading") || "Завантаження..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="certificates">
        <div className="container">
          <p
            className={`${isPC ? "fs-p--16px" : "fs-p--14px"}`}
            style={{ color: "#e74c3c" }}
          >
            {t("error") || "Помилка завантаження"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="certificates">
      <div className="container">
        <h2
          className={`certificates-title uppercase ${isPC ? "fs-h2--32px" : "fs-h2--20px"} fw-bold c3`}
        >
          {data.title || t("title")}
        </h2>

        {/* Вкладки */}
        <div className="certificates-tabs">
          <button
            onClick={() => setActiveTab("diplomas")}
            className={`${isPC ? "fs-p--16px" : "fs-p--12px"} uppercase fw-semi-bold c3 certificates-tab ${
              activeTab === "diplomas" ? "active" : ""
            }`}
          >
            {t("tabs.certificates")}
          </button>
          <button
            onClick={() => setActiveTab("certificates")}
            className={` ${isPC ? "fs-p--16px" : "fs-p--12px"} uppercase fw-semi-bold c3 certificates-tab ${
              activeTab === "certificates" ? "active" : ""
            }`}
          >
            {t("tabs.diploma")}
          </button>
        </div>

        {/* Контент */}
        {renderSwiper(
          activeTab === "certificates" ? data.certificates : data.diplomas,
          activeTab
        )}
      </div>

      {/* Модальное окно для просмотра изображения */}
      {selectedImage && (
        <div
          className="certificates-modal-overlay"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="certificates-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="certificates-modal-close"
              onClick={() => setSelectedImage(null)}
            >
              {t("modal.close")}
            </button>
            <img
              src={selectedImage}
              alt={t("modal.altText")}
              className="certificates-modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
