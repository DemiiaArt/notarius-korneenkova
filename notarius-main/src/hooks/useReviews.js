/**
 * Hook для работы с отзывами
 * Загрузка отзывов и отправка новых отзывов в API
 */

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/config/api";

/**
 * Hook для получения отзывов и статистики рейтинга
 * @returns {Object} { reviews, ratingStats, loading, error, fetchReviews }
 */
export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState({
    averageRating: 0,
    totalVotes: 0,
    ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Загрузка отзывов и статистики рейтинга
   * @param {boolean} forceRefresh - принудительное обновление
   * @returns {Promise<Object>} Данные отзывов и статистики
   */
  const fetchReviews = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiClient.get("/reviews/");

      // Проверяем формат данных - может быть массив или объект с полем reviews
      let reviewsList = [];
      if (Array.isArray(data)) {
        reviewsList = data;
      } else if (data && data.reviews) {
        reviewsList = data.reviews;
      }

      setReviews(reviewsList);

      setRatingStats(
        data.rating_stats || {
          averageRating: 0,
          totalVotes: 0,
          ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        }
      );

      return data;
    } catch (err) {
      const errorMessage = err.message || "Помилка при завантаженні відгуків";
      setError(errorMessage);
      console.error("❌ Ошибка при загрузке отзывов:", err);

      // Устанавливаем пустые данные при ошибке
      setReviews([]);
      setRatingStats({
        averageRating: 0,
        totalVotes: 0,
        ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Загружаем данные при первом использовании
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    ratingStats,
    loading,
    error,
    fetchReviews,
  };
};

/**
 * Hook для отправки нового отзыва
 * @returns {Object} { submitReview, loading, error, success, reset }
 */
export const useSubmitReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Отправка нового отзыва
   * @param {Object} reviewData - данные отзыва
   * @param {string} reviewData.name - имя автора
   * @param {string} reviewData.service - услуга
   * @param {number} reviewData.rating - рейтинг (1-5)
   * @param {string} reviewData.text - текст отзыва
   * @returns {Promise<Object>} Результат отправки
   */
  const submitReview = async (reviewData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Валидация данных
      if (!reviewData.name?.trim()) {
        throw new Error('Поле "Имя" обязательно');
      }
      if (!reviewData.service) {
        throw new Error("Выберите услугу");
      }
      if (
        !reviewData.rating ||
        reviewData.rating < 1 ||
        reviewData.rating > 5
      ) {
        throw new Error("Выберите рейтинг от 1 до 5 звезд");
      }
      if (!reviewData.text?.trim()) {
        throw new Error("Напишите отзыв");
      }

      const response = await apiClient.post("/reviews/", {
        name: reviewData.name.trim(),
        service: reviewData.service,
        rating: reviewData.rating,
        text: reviewData.text.trim(),
      });

      console.log("✅ Отзыв успешно отправлен:", response);
      setSuccess(true);
      return {
        success: true,
        data: response,
        message: "Ваш отзыв успешно отправлен! Он появится после модерации.",
      };
    } catch (err) {
      const errorMessage =
        err.message || "Помилка при відправці відгуку. Спробуйте ще раз.";
      setError(errorMessage);
      console.error("❌ Ошибка при отправке отзыва:", err);
      return { success: false, error: errorMessage, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return { submitReview, loading, error, success, reset };
};

/**
 * Пример использования:
 *
 * // Загрузка отзывов и статистики
 * const { reviews, ratingStats, loading, error } = useReviews();
 *
 * // Отправка нового отзыва
 * const { submitReview, loading: submitLoading, error: submitError, success } = useSubmitReview();
 *
 * const handleSubmit = async (formData) => {
 *   const result = await submitReview({
 *     name: formData.name,
 *     service: formData.service,
 *     rating: formData.rating,
 *     text: formData.text
 *   });
 *
 *   if (result.success) {
 *     // Обновляем список отзывов
 *     fetchReviews();
 *   }
 * };
 */
