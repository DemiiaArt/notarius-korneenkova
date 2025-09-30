import "./Certificates.scss";
import { useIsPC } from "@hooks/isPC";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import cert1 from "@media/cerficates/certificate1.jpg";
import cert2 from "@media/cerficates/certificate2.jpg";
import cert3 from "@media/cerficates/certificate3.jpg";
import cert4 from "@media/cerficates/certificate4.jpg";
import cert5 from "@media/cerficates/certificate5.jpg";
import cert6 from "@media/cerficates/certificate6.jpg";
import cert7 from "@media/cerficates/certificate7.jpg";
import cert8 from "@media/cerficates/certificate8.jpg";
import cert9 from "@media/cerficates/certificate9.jpg";
import cert10 from "@media/cerficates/certificate10.jpg";
import cert11 from "@media/cerficates/certificate11.jpg";
import diploma from "@media/cerficates/diploma.jpg";

import arrowRight from "@media/services-carousel/icons/arrow-right.svg";

const Certificates = () => {
  const [activeTab, setActiveTab] = useState("diplomas");
  const [selectedImage, setSelectedImage] = useState(null);
  const isPC = useIsPC();

  const certificates = [diploma];

  const diplomas = [
    cert1,
    cert2,
    cert3,
    cert4,
    cert5,
    cert6,
    cert7,
    cert8,
    cert9,
    cert10,
    cert11,
  ];

  const renderSwiper = (items, key) => {
    const prevClass = `certificates-carousel-prev-${key}`;
    const nextClass = `certificates-carousel-next-${key}`;
    const paginationClass = `certificates-pagination-${key}`;

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
        {items.map((src, i) => (
          <SwiperSlide className="certificates-carousel-slide" key={i}>
            <div className="certificates-carousel-slide-inner">
              <img
                className="certificates-carousel-slide-image"
                src={src}
                alt={`Certificate ${i + 1}`}
                onClick={() => setSelectedImage(src)}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </SwiperSlide>
        ))}

        {/* Стрелки */}
        <div className={`${prevClass} certificates-carousel-prev bg6`}>
          <img src={arrowRight} alt="arrow-left" />
        </div>
        <div className={`${nextClass} certificates-carousel-next bg6`}>
          <img src={arrowRight} alt="arrow-right" />
        </div>
      </Swiper>
      <div className={paginationClass}></div>
      </>
    );
  };

  return (
    <div className="certificates">
      <div className="container">
        <h2 className={`certificates-title uppercase ${isPC? "fs-h2--32px" : "fs-h2--20px"} fw-bold c3`}>
          Кваліфікація та досвід
        </h2>

        {/* Вкладки */}
        <div className="certificates-tabs">
          <button
            onClick={() => setActiveTab("diplomas")}
            className={`${isPC ? "fs-p--16px" : "fs-p--12px"} uppercase fw-semi-bold c3 certificates-tab ${
              activeTab === "diplomas" ? "active" : ""
            }`}
          >
            Сертифікати
          </button>
          <button
            onClick={() => setActiveTab("certificates")}
            className={` ${isPC ? "fs-p--16px" : "fs-p--12px"} uppercase fw-semi-bold c3 certificates-tab ${
              activeTab === "certificates" ? "active" : ""
            }`}
          >
            Свідоцтво
          </button>
        </div>

        {/* Контент */}
        {renderSwiper(
          activeTab === "certificates" ? certificates : diplomas,
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
              ×
            </button>
            <img 
              src={selectedImage} 
              alt="Certificate full size"
              className="certificates-modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
