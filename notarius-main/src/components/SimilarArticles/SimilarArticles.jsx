import { useIsPC } from "@hooks/isPC";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import BlogCard from "@components/Blog/BlogCard";
import BlogCard1 from "@media/BlogCard1.png";
import BlogCard2 from "@media/BlogCard2.png";
import BlogCard3 from "@media/BlogCard3.png";
import arrowRight from "@media/services-carousel/icons/arrow-right.svg";

import "swiper/css";
import "swiper/css/navigation";
import "./SimilarArticles.scss";

const SimilarArticles = () => {
  const isPC = useIsPC();

  const similarArticles = [
    {
      title: "Нотаріальне посвідчення підпису",
      text: "Підтвердження достовірності підпису на документі є найбільш популярною нотаріальною послугою серед фізичних осіб. Обличчя самостійно",
      date: "08.01.2024",
      image: BlogCard2,
      category: "bisnes, taxes"
    },
    {
      title: "Сімейні спори та нотаріальні послуги",
      text: "У сімейних справах нотаріальне посвідчення підпису може бути критично важливим для захисту прав членів сім'ї та розподілу майна.",
      date: "05.01.2024",
      image: BlogCard3,
      category: "family"
    },
    {
      title: "Воєнний час - особливості нотаріальних послуг",
      text: "У воєнний час нотаріальні послуги набувають особливого значення. Багато громадян потребують швидкого оформлення документів.",
      date: "03.01.2024",
      image: BlogCard1,
      category: "military, family"
    },
    {
      title: "Податкові питання та нотаріальні послуги",
      text: "Правильне оформлення документів через нотаріуса може допомогти у вирішенні податкових питань та захистити від можливих перевірок.",
      date: "01.01.2024",
      image: BlogCard2,
      category: "taxes"
    }
  ];

  return (
    <div className="similar-articles">
      <div className="container">
        <h2 className={`similar-articles-title ${isPC ? "fs-h2--32px" : "fs-p--18px"} fw-bold c3`}>
          Схожі статті
        </h2>
        
        {/* Мобильная версия - 3 карточки в колонку без свайпера */}
        <div className="similar-articles-mobile">
          {similarArticles.slice(0, 3).map((article, index) => (
            <div key={index} className="similar-articles-mobile-item">
              <BlogCard {...article} />
            </div>
          ))}
        </div>

        {/* Десктопная версия - свайпер */}
        <div className="similar-articles-carousel-wrapper">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={32}
            slidesPerView={2}
            observer={true}
            observeParents={true}
            watchOverflow={true}
            breakpoints={{
              1024: { slidesPerView: 3, spaceBetween: 32 },
            }}
            navigation={{
              nextEl: ".similar-articles-carousel-next",
              prevEl: ".similar-articles-carousel-prev",
            }}
            pagination={{
              clickable: true,
            }}
            className="similar-articles-carousel"
          >
            {similarArticles.map((article, index) => (
              <SwiperSlide key={index} className="similar-articles-carousel-slide">
                <BlogCard {...article} />
              </SwiperSlide>
            ))}

            {/* Стрелки */}
            <div className="similar-articles-carousel-prev">
              <img src={arrowRight} alt="arrow-left" />
            </div>
            <div className="similar-articles-carousel-next">
              <img src={arrowRight} alt="arrow-right" />
            </div>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default SimilarArticles;
