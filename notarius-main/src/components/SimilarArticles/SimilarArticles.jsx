import { useIsPC } from "@hooks/isPC";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import BlogCard from "@components/Blog/BlogCard";
import { useBlog } from "@hooks/useBlog";
import arrowRight from "@media/services-carousel/icons/arrow-right.svg";

import "swiper/css";
import "swiper/css/navigation";
import "./SimilarArticles.scss";

const SimilarArticles = () => {
  const isPC = useIsPC();

  // Загружаем последние статьи из API (первая страница, без фильтрации)
  const { articles, loading } = useBlog({ page: 1 });

  // Берем первые 4 статьи для отображения
  const similarArticles = articles.slice(0, 4);

  // Не показываем секцию, если нет статей или идет загрузка
  if (loading || similarArticles.length === 0) {
    return null;
  }

  return (
    <div className="similar-articles">
      <div className="container">
        <h2
          className={`similar-articles-title ${isPC ? "fs-h2--32px" : "fs-p--18px"} fw-bold c3`}
        >
          Схожі статті
        </h2>

        {/* Мобильная версия - 3 карточки в колонку без свайпера */}
        <div className="similar-articles-mobile">
          {similarArticles.slice(0, 3).map((article, index) => (
            <div
              key={article.id || index}
              className="similar-articles-mobile-item"
            >
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
            // pagination={{
            //   clickable: true,
            // }}
            className="similar-articles-carousel"
          >
            {similarArticles.map((article, index) => (
              <SwiperSlide
                key={article.id || index}
                className="similar-articles-carousel-slide"
              >
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
