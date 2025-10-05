/**
 * Hook для работы с бесплатными консультациями
 * Отправка заявок на бесплатную консультацию
 */

import { useState } from 'react';
import { apiClient } from '@/config/api';

/**
 * Hook для создания заявки на бесплатную консультацию
 * @returns {Object} { submitFreeConsultation, loading, error, success }
 */
export const useFreeConsultations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Отправка заявки на бесплатную консультацию
   * @param {Object} data - Данные заявки
   * @param {string} data.name - Имя клиента
   * @param {string} data.phone_number - Номер телефона
   * @param {string} data.city - Город
   * @param {string} data.question - Вопрос
   * @returns {Promise<Object>} Результат отправки
   */
  const submitFreeConsultation = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      // Валидация данных перед отправкой
      if (!data.name || !data.name.trim()) {
        throw new Error('Імʼя не може бути порожнім');
      }
      
      if (!data.phone_number || !data.phone_number.trim()) {
        throw new Error('Номер телефону не може бути порожнім');
      }
      
      if (!data.city || !data.city.trim()) {
        throw new Error('Місто не може бути порожнім');
      }
      
      if (!data.question || !data.question.trim()) {
        throw new Error('Питання не може бути порожнім');
      }
      
      // Отправляем данные на бэкенд
      const response = await apiClient.post('/free-consultations/', {
        name: data.name.trim(),
        phone_number: data.phone_number.trim(),
        city: data.city.trim(),
        question: data.question.trim(),
      });
      
      console.log('✅ Заявка на бесплатную консультацию успешно отправлена:', response);
      setSuccess(true);
      
      return {
        success: true,
        data: response,
        message: 'Ваша заявка на безкоштовну консультацію успішно відправлена! Ми зв\'яжемося з вами найближчим часом.'
      };
      
    } catch (err) {
      const errorMessage = err.message || 'Помилка при відправці заявки. Спробуйте ще раз.';
      setError(errorMessage);
      console.error('❌ Ошибка при отправке заявки на бесплатную консультацию:', err);
      
      return {
        success: false,
        error: errorMessage,
        message: errorMessage
      };
      
    } finally {
      setLoading(false);
    }
  };

  /**
   * Сброс состояния
   */
  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return {
    submitFreeConsultation,
    loading,
    error,
    success,
    reset
  };
};

/**
 * Пример использования:
 * 
 * const { submitFreeConsultation, loading, error, success } = useFreeConsultations();
 * 
 * const handleSubmit = async (formData) => {
 *   const result = await submitFreeConsultation({
 *     name: formData.name,
 *     phone_number: formData.tel,
 *     city: formData.city,
 *     question: formData.question
 *   });
 *   
 *   if (result.success) {
 *     console.log('Заявка на бесплатную консультацию отправлена!');
 *     // Показать сообщение об успехе
 *   } else {
 *     console.error('Ошибка:', result.error);
 *     // Показать сообщение об ошибке
 *   }
 * };
 */