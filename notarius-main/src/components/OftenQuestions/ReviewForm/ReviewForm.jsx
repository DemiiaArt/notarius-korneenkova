import React, { useState } from "react";
import { useIsPC } from "@hooks/isPC";
import { useTranslation } from "@hooks/useTranslation";
import "./ReviewForm.scss";
import { useReviews, useSubmitReview } from "@hooks/useReviews";

export const ReviewForm = () => {
  const isPC = useIsPC();
  const { t } = useTranslation("components.ReviewForm");

  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  // value для полей
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [selectedService, setSelectedService] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  // Загружаем отзывы и статистику рейтинга
  const {
    ratingStats,
    loading: reviewsLoading,
    error: reviewsError,
    fetchReviews,
  } = useReviews();

  // Hook для отправки отзыва
  const {
    submitReview,
    loading: submitLoading,
    error: submitError,
    success: submitSuccess,
    reset: resetSubmit,
  } = useSubmitReview();

  const services = [
    {
      value: "certification",
      label: t("services.certification"),
    },
    {
      value: "realEstateTransactions",
      label: t("services.realEstateTransactions"),
    },
    { value: "heritage", label: t("services.heritage") },
    { value: "attorney", label: t("services.attorney") },
    {
      value: "agreements",
      label: t("services.agreements"),
    },
  ];

  // Динамические данные рейтинга из API
  const { ratingCounts, totalVotes, averageRating } = ratingStats;

  // управление звездами
  const handleClick = (value) => setSelectedRating(value);
  const handleMouseEnter = (value) => setHoveredRating(value);
  const handleMouseLeave = () => setHoveredRating(0);

  const StarIcon = ({ active = false }) => (
    <svg
      viewBox="0 0 40 37"
      fill={active ? "#338D96" : "transparent"}
      stroke={active ? "#338D96" : "#8D8D8D"}
      strokeWidth="0.5"
      style={{ transition: "fill 0.2s, stroke 0.2s" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24.2529 13.8965L24.3086 14.0693H38.252L27.1182 22.1582L26.9717 22.2656L27.0273 22.4375L31.2793 35.5254L20.1465 27.4375L20 27.3301L19.8535 27.4375L8.71973 35.5254L12.9727 22.4375L13.0283 22.2656L12.8818 22.1582L1.74805 14.0693H15.6914L15.7471 13.8965L20 0.806641L24.2529 13.8965Z" />
    </svg>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedRating === 0) {
      alert(t("validation.rateRequired"));
      return;
    }
    if (!selectedService) {
      alert(t("validation.serviceRequired"));
      return;
    }
    if (!name.trim()) {
      alert(t("validation.nameRequired"));
      return;
    }
    if (!text.trim()) {
      alert(t("validation.textRequired"));
      return;
    }

    // Отправляем отзыв через API
    const result = await submitReview({
      name: name.trim(),
      service: selectedService,
      rating: selectedRating,
      text: text.trim(),
    });

    if (result.success) {
      // Очистка полей после успешной отправки
      setName("");
      setText("");
      setSelectedRating(0);
      setSelectedService("");
      setIsOpen(false);

      // Обновляем статистику рейтинга
      fetchReviews();
    } else {
      alert(result.message || t("validation.submitError"));
    }
  };

  const renderAverageStars = (rating) =>
    [1, 2, 3, 4, 5].map((i) => <StarIcon key={i} active={i <= rating} />);

  const getReviewWord = (count) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return t("reviews.many");
    switch (lastDigit) {
      case 1:
        return t("reviews.one");
      case 2:
      case 3:
      case 4:
        return t("reviews.few");
      default:
        return t("reviews.many");
    }
  };

  return (
    <div className="container">
      <div className="review-block">
        {/* Блок рейтинга */}
        <div className="rating-summary">
          <h2 className={`${isPC ? "fs-p--28px" : "fs-p--18px"} fw-semi-bold`}>
            {t("rating")}
          </h2>
          {reviewsLoading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p className={`${isPC ? "fs-p--16px" : "fs-p--12px"} c3`}>
                Завантаження рейтингу...
              </p>
            </div>
          ) : reviewsError ? (
            <div
              style={{ textAlign: "center", padding: "20px", color: "#dc3545" }}
            >
              <p className={`${isPC ? "fs-p--16px" : "fs-p--12px"} c3`}>
                Помилка завантаження рейтингу
              </p>
            </div>
          ) : (
            <div className="rate-wrap">
              <div className="rate-score-wrap">
                <div
                  className={`rating-score fw-bold ${isPC ? "fs-p--40px" : "fs-p--24px"} c3`}
                >
                  {averageRating}
                </div>
                <div
                  className={`votes ${isPC ? "fs-p--16px" : "fs-p--10px"} lh-150 c3`}
                >
                  {totalVotes} {getReviewWord(totalVotes)}
                </div>
              </div>
              <div className="stars c7" id="averageStars">
                {renderAverageStars(averageRating)}
              </div>
            </div>
          )}
          {!reviewsLoading && !reviewsError && (
            <div className="rating-bars">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingCounts[rating] || 0;
                const percent = totalVotes > 0 ? (count / totalVotes) * 100 : 0;

                return (
                  <div className="bar" key={rating}>
                    <span className={`${isPC ? "fs-p--18px" : "fs-p--10px"}`}>
                      {rating}
                    </span>
                    <div className="bar-container">
                      <div
                        className="bar-fill"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Форма отзыва */}
        <div className="review-form">
          <h2 className={`${isPC ? "fs-p--28px" : "fs-p--18px"} fw-semi-bold`}>
            {t("leaveReview")}
          </h2>

          {/* Звезды */}
          <div className="rate-wrap">
            <label className={`${isPC ? "fs-p--18px" : "fs-p--10px"}`}>
              {t("setRating")}
            </label>
            <div className="star-input fs-star" id="starInput">
              {[1, 2, 3, 4, 5].map((value) => (
                <div
                  key={value}
                  data-value={value}
                  onClick={() => handleClick(value)}
                  onMouseEnter={() => handleMouseEnter(value)}
                  onMouseLeave={handleMouseLeave}
                >
                  <StarIcon
                    active={value <= (hoveredRating || selectedRating)}
                  />
                </div>
              ))}
            </div>
          </div>

          <form
            className="review-form-input input-white"
            onSubmit={handleSubmit}
          >
            {/* Имя */}
            <div
              className={`input-group ${isPC ? "fs-p--18px" : "fs-p--10px"} c3 lh-150`}
            >
              <input
                type="text"
                id="review-name"
                name="name"
                placeholder={t("name")}
                autoComplete="on"
                required
                disabled={submitSuccess}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="review-name">{t("name")}</label>
            </div>

            {/* Кастомный select */}
            <div
              className={`input-group select-group ${isPC ? "fs-p--18px" : "fs-p--10px"} c3 lh-150`}
            >
              <div
                className={`c14 custom-select ${isOpen ? "open" : ""}`}
                onClick={() => !submitSuccess && setIsOpen(!isOpen)}
              >
                <div
                  className={`c3 custom-select__trigger ${!selectedService ? "placeholder" : ""}`}
                >
                  {selectedService
                    ? services.find((s) => s.value === selectedService)?.label
                    : t("service")}
                  <span className="arrow"></span>
                </div>

                {isOpen && (
                  <ul className="custom-options">
                    {services.map((service) => (
                      <li
                        key={service.value}
                        className={`custom-option ${
                          selectedService === service.value ? "selected" : ""
                        }`}
                        onClick={() => {
                          setSelectedService(service.value);
                          setIsOpen(false);
                        }}
                      >
                        {service.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Текст отзыва */}
            <div
              className={`input-group ${isPC ? "fs-p--18px" : "fs-p--10px"} c3 lh-150`}
            >
              <textarea
                placeholder={t("impression")}
                value={text}
                id="message"
                required
                onChange={(e) => {
                  setText(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight - 10}px`;
                }}
                rows={1}
                disabled={submitSuccess}
              />
              <label htmlFor="message">{t("impression")}</label>
            </div>

            {/* Кнопка */}
            <button
              type="submit"
              className={`btn-submit ${
                submitSuccess
                  ? isPC
                    ? "fs-p--16px"
                    : "fs-p--10px"
                  : isPC
                    ? "fs-p--16px"
                    : "fs-p--12px"
              } bg4 c1 fw-normal uppercase`}
              disabled={submitSuccess || submitLoading}
            >
              {submitSuccess
                ? t("submitted")
                : submitLoading
                  ? t("submitting")
                  : t("submit")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
