/**
 * Hook для работы с часто задаваемыми вопросами (FAQ)
 * Загрузка FAQ из API с поддержкой многоязычности
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/config/api';

/**
 * Hook для получения списка часто задаваемых вопросов
 * @param {string} lang - язык для получения данных (ua, ru, en)
 * @returns {Object} { faqs, loading, error, fetchFaqs }
 */
export const useFrequentlyAskedQuestions = (lang = 'ua') => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Загрузка FAQ с API
   * @param {boolean} forceRefresh - принудительное обновление
   * @returns {Promise<Array>} Массив FAQ
   */
  const fetchFaqs = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Добавляем параметр языка в URL
      const endpoint = `/faqs/?lang=${lang}`;
      const data = await apiClient.get(endpoint);
      
      console.log('✅ FAQ загружены:', data);
      setFaqs(Array.isArray(data) ? data : []);
      
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Помилка при завантаженні FAQ';
      setError(errorMessage);
      console.error('❌ Ошибка при загрузке FAQ:', err);
      
      // Устанавливаем пустой массив при ошибке
      setFaqs([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [lang]);

  // Загружаем данные при первом использовании или изменении языка
  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  return {
    faqs,
    loading,
    error,
    fetchFaqs
  };
};

/**
 * Пример использования:
 * 
 * const { faqs, loading, error } = useFrequentlyAskedQuestions('ua');
 * 
 * if (loading) return <div>Завантаження...</div>;
 * if (error) return <div>Помилка: {error}</div>;
 * 
 * return (
 *   <div>
 *     {faqs.map((faq, index) => (
 *       <div key={index}>
 *         <h3>{faq.title}</h3>
 *         <p>{faq.text}</p>
 *       </div>
 *     ))}
 *   </div>
 * );
 */
