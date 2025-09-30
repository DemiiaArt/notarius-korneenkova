import userIcon from "@media/icons/user-icon.png";
import quotes from "@media/icons/quotes-icon.svg";
import arrowRight from "@media/comments-carousel/arrow-right.svg";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { useIsPC } from "@hooks/isPC";
import "swiper/css/navigation";
import "swiper/css";
import "./Comments.scss";

const Comments = () => {
   const isPC = useIsPC();
  const comments = [
    {
      index:'1',
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
      index:'2',
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
      index:'3',
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
      index:'4',
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

  return (
    <div className="comments">
      <div className="container">
        <h2 className={`comments-title ${isPC? "fs-h2--32px" : "fs-h2--20px"} fw-bold uppercase c3`}>Відгуки</h2>
        <CommentsCarousel comments={comments} />
      </div>
    </div>
  );
};

const CommentsCarousel = ({ comments }) => {
  const isPC = useIsPC();
  if (!comments) return <>no comments</>;

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
          768: {slidesPerView: 2},
          1200: { slidesPerView: 3 },
        }}
        loop={false}
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
          }) => (
            <SwiperSlide key={index} className="comments-carousel-slide">
              <div className="comments-carousel-card">
                <div className="comments-carousel-card-header">
                  <img
                    className="comments-carousel-card-image"
                    src={imgSrc}
                    alt={imgAlt}
                  />
                  <div className="comments-carousel-card-text-wrap">
                    <p className={`comments-carousel-card-user-name ${isPC ? "fs-p--20px" : "fs-p--16px"} fw-semi-bold c3`}>
                      {userName} {userSurName}
                    </p>
                    <p className={`comments-carousel-card-service ${isPC ? "fs-p--16px" : "fs-p--12px"} lh-150 c3`}>
                      {userService}
                    </p>
                  </div>
                  <img
                    className="comments-carousel-card-quotes"
                    src={quotes}
                    alt={quotes}
                  />
                </div>
                <p className={`comments-carousel-card-text ${isPC ? "fs-p--18px" : "fs-p--14px"} lh-150 c3`}>
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
