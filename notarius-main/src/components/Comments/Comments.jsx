import userIcon from "@media/icons/user-avatar.svg";
import quotes from "@media/icons/quotes-icon.svg";
import arrowRight from "@media/comments-carousel/arrow-right.svg";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { useIsPC } from "@hooks/isPC";
import { useReviews } from "@hooks/useReviews";
import { useTranslation } from "@hooks/useTranslation";
import "swiper/css/navigation";
import "swiper/css";
import "./Comments.scss";

const Comments = ({ title = "Відгуки" }) => {
  const isPC = useIsPC();

  const { t } = useTranslation("components.Comments");

  // Функция для получения переведенного заголовка
  const getTranslatedTitle = (originalTitle) => {
    const titles = t("titles");
    return titles && titles[originalTitle]
      ? titles[originalTitle]
      : originalTitle;
  };

  // Загружаем отзывы из API
  const { reviews, loading, error } = useReviews();

  // Fallback данные (если API не работает)
  const fallbackComments = [
    {
      index: "1",
      imgSrc: userIcon,
      imgAlt: "user-icon.jpg",
      userName: "Оксана",
      userSurName: "Мельник",
      userService: "Договір купівлі-продажу земельної ділянки",
      userComment: `Пані Надія — високо кваліфікований нотаріус,
                    яка досконало знає свою справу. Усі документи
                    були оформлені швидко, чітко та без жодних
                    зайвих питань. Особливо вразила її уважність
                    до деталей і доброзичливе ставлення.
                    Рекомендую Надію як надійного фахівця з великим досвідом!`,
    },
    {
      index: "2",
      imgSrc: userIcon,
      imgAlt: "user-icon.jpg",
      userName: "Оксана",
      userSurName: "Мельник",
      userService: "Договір купівлі-продажу земельної ділянки",
      userComment: `Пані Надія — високо кваліфікований нотаріус,
                    яка досконало знає свою справу. Усі документи
                    були оформлені швидко, чітко та без жодних
                    зайвих питань. Особливо вразила її уважність
                    до деталей і доброзичливе ставлення.
                    Рекомендую Надію як надійного фахівця з великим досвідом!`,
    },
    {
      index: "3",
      imgSrc: userIcon,
      imgAlt: "user-icon.jpg",
      userName: "Оксана",
      userSurName: "Мельник",
      userService: "Договір купівлі-продажу земельної ділянки",
      userComment: `Пані Надія — високо кваліфікований нотаріус,
                    яка досконало знає свою справу. Усі документи
                    були оформлені швидко, чітко та без жодних
                    зайвих питань. Особливо вразила її уважність
                    до деталей і доброзичливе ставлення.
                    Рекомендую Надію як надійного фахівця з великим досвідом!`,
    },
    {
      index: "4",
      imgSrc: userIcon,
      imgAlt: "user-icon.jpg",
      userName: "Оксана",
      userSurName: "Мельник",
      userService: "Договір купівлі-продажу земельної ділянки",
      userComment: `Пані Надія — високо кваліфікований нотаріус,
                    яка досконало знає свою справу. Усі документи
                    були оформлені швидко, чітко та без жодних
                    зайвих питань. Особливо вразила її уважність
                    до деталей і доброзичливе ставлення.
                    Рекомендую Надію як надійного фахівця з великим досвідом!`,
    },
  ];

  // Преобразуем отзывы из API в формат для карусели
  const apiComments = Array.isArray(reviews)
    ? reviews.map((review, index) => ({
        index: review.id?.toString() || index.toString(),
        imgSrc: userIcon, // Используем дефолтную иконку
        imgAlt: "user-icon.jpg",
        userName: review.name || "Анонім",
        userSurName: "", // В модели нет фамилии
        userService: review.service_display || review.service || "Послуга",
        userComment: review.text || "",
        rating: review.rating || 5, // Добавляем рейтинг для отображения звезд
      }))
    : [];

  // Используем API отзывы если есть, иначе fallback
  const comments = apiComments.length > 0 ? apiComments : fallbackComments;

  return (
    <div className="comments">
      <div className="container">
        <h2
          className={`comments-title ${isPC ? "fs-h2--32px" : "fs-h2--20px"} fw-bold uppercase c3`}
        >
          {getTranslatedTitle(title)}
        </h2>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p className={`${isPC ? "fs-p--18px" : "fs-p--14px"} c3`}>
              Завантаження відгуків...
            </p>
          </div>
        ) : error ? (
          <div
            style={{ textAlign: "center", padding: "40px", color: "#dc3545" }}
          >
            <p className={`${isPC ? "fs-p--18px" : "fs-p--14px"} c3`}>
              Помилка завантаження відгуків
            </p>
            <p
              className={`${isPC ? "fs-p--16px" : "fs-p--12px"} c3`}
              style={{ marginTop: "10px" }}
            >
              Показуємо демонстраційні відгуки
            </p>
          </div>
        ) : (
          <CommentsCarousel comments={comments} />
        )}
      </div>
    </div>
  );
};

const CommentsCarousel = ({ comments }) => {
  const isPC = useIsPC();
  if (!comments) return <>no comments</>;

  // Компонент звезды для рейтинга
  const StarIcon = ({ active = false }) => (
    <svg
      viewBox="0 0 20 19"
      fill={active ? "#338D96" : "transparent"}
      stroke={active ? "#338D96" : "#8D8D8D"}
      strokeWidth="0.5"
      style={{ transition: "fill 0.2s, stroke 0.2s" }}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
    >
      <path d="M12.1265 6.94825L12.1543 7.03465H19.126L13.5591 11.0791L13.4859 11.1328L13.5137 11.2188L15.6397 17.7627L10.0727 13.7188L10 13.6651L9.92727 13.7188L4.36027 17.7627L6.48627 11.2188L6.51409 11.1328L6.44091 11.0791L0.874023 7.03465H7.84573L7.87355 6.94825L10 0.40332L12.1265 6.94825Z" />
    </svg>
  );

  // Функция для отображения звезд рейтинга
  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((i) => (
      <StarIcon key={i} active={i <= rating} />
    ));
  };

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        pagination={{ clickable: true }}
        navigation={{
          nextEl: ".comments-carousel-next",
          prevEl: ".comments-carousel-prev",
        }}
        // autoplay={{
        //   delay: 4000, // задержка между сменой слайдов (в мс)
        //   disableOnInteraction: false, // продолжать после взаимодействия
        // }}
        speed={1500}
        className="comments-carousel"
        spaceBetween={32}
        observer={true}
        observeParents={true}
        watchOverflow={true}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 },
        }}
        loop={true}
      >
        {comments.map(
          ({
            index,
            imgSrc,
            imgAlt,
            userName,
            userSurName,
            userService,
            userComment,
            rating,
          }) => (
            <SwiperSlide key={index} className="comments-carousel-slide">
              <div className="comments-carousel-card">
                <div className="comments-carousel-card-header">
                  <img
                    className="comments-carousel-card-image"
                    src={imgSrc ? imgSrc : userIcon}
                    alt={imgAlt}
                  />
                  <div className="comments-carousel-card-text-wrap">
                    <p
                      className={`comments-carousel-card-user-name ${isPC ? "fs-p--20px" : "fs-p--16px"} fw-semi-bold c3`}
                    >
                      {userName} {userSurName}
                    </p>
                    <p
                      className={`comments-carousel-card-service ${isPC ? "fs-p--16px" : "fs-p--12px"} lh-150 c3`}
                    >
                      {userService}
                    </p>
                    {/* Отображение рейтинга звездами */}
                    {rating && (
                      <div
                        className="comments-carousel-card-rating"
                        style={{
                          display: "flex",
                          gap: "2px",
                          marginTop: "4px",
                        }}
                      >
                        {renderStars(rating)}
                      </div>
                    )}
                  </div>
                  <img
                    className="comments-carousel-card-quotes"
                    src={quotes}
                    alt={quotes}
                  />
                </div>
                <p
                  className={`comments-carousel-card-text ${isPC ? "fs-p--18px" : "fs-p--14px"} lh-150 c3`}
                >
                  {userComment}
                </p>
              </div>
            </SwiperSlide>
          )
        )}
        <div className="comments-carousel-prev">
          <img src={arrowRight} alt="arrow-right.png" />
        </div>
        <div className="comments-carousel-next">
          <img src={arrowRight} alt="arrow-right.png" />
        </div>
      </Swiper>
    </>
  );
};

export default Comments;
