/**
 * Hook для работы с данными "О себе"
 * Загрузка информации о нотариусе из API
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/config/api';

/**
 * Hook для получения данных "О себе"
 * @returns {Object} { aboutMe, loading, error, fetchAboutMe }
 */
export const useAboutMe = () => {
  const [aboutMe, setAboutMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Загрузка данных "О себе"
   * @param {boolean} forceRefresh - принудительное обновление
   * @returns {Promise<Object>} Данные о нотариусе
   */
  const fetchAboutMe = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiClient.get('/about-me/');
      
      console.log('✅ Данные "О себе" загружены:', data);
      setAboutMe(data);
      
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Помилка при завантаженні даних "О себе"';
      setError(errorMessage);
      console.error('❌ Ошибка при загрузке данных "О себе":', err);
      
      // Устанавливаем null при ошибке
      setAboutMe(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Загружаем данные при первом использовании
  useEffect(() => {
    fetchAboutMe();
  }, [fetchAboutMe]);

  return {
    aboutMe,
    loading,
    error,
    fetchAboutMe
  };
};

/**
 * Пример использования:
 * 
 * const { aboutMe, loading, error } = useAboutMe();
 * 
 * if (loading) return <div>Завантаження...</div>;
 * if (error) return <div>Помилка: {error}</div>;
 * 
 * return (
 *   <div>
 *     <h1>{aboutMe.title_uk}</h1>
 *     <p>{aboutMe.subtitle_uk}</p>
 *     <div dangerouslySetInnerHTML={{ __html: aboutMe.text_uk }} />
 *     <img src={aboutMe.photo} alt="Фото нотариуса" />
 *   </div>
 * );
 */
