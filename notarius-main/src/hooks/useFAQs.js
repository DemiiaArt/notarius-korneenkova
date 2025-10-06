/**
 * Hook для работы с FAQ (Часто задаваемые вопросы)
 */

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/config/api";
import { useLanguage } from "./useLanguage";

/**
 * Hook для получения FAQ
 * @returns {Object} { faqs, loading, error, fetchFAQs }
 */
export const useFAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentLang } = useLanguage();

  /**
   * Загрузка FAQ
   * @param {string} lang - язык для загрузки FAQ
   * @returns {Promise<Array>} Данные FAQ
   */
  const fetchFAQs = useCallback(async (lang) => {
    try {
      setLoading(true);
      setError(null);

      // Передаем язык в query параметре
      const data = await apiClient.get(`/faqs/?lang=${lang}`);

      // Проверяем формат данных - может быть массив или объект с полем faqs
      let faqsList = [];
      if (Array.isArray(data)) {
        faqsList = data;
      } else if (data && data.faqs) {
        faqsList = data.faqs;
      }
      console.log("useFAQs: faqsList:", faqsList);
      setFaqs(faqsList);
      return faqsList;
    } catch (err) {
      const errorMessage = err.message || "Помилка при завантаженні FAQ";
      setError(errorMessage);
      console.error("❌ Ошибка при загрузке FAQ:", err);

      // Устанавливаем пустые данные при ошибке
      setFaqs([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Загружаем FAQ при монтировании компонента или при смене языка
  useEffect(() => {
    if (currentLang) {
      fetchFAQs(currentLang);
    }
  }, [currentLang, fetchFAQs]);

  return {
    faqs,
    loading,
    error,
    fetchFAQs,
  };
};
