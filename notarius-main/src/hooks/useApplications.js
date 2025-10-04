/**
 * Hook для работы с заявками (Applications)
 * Отправка заявок на бэкенд
 */

import { useState } from 'react';
import { apiClient } from '@/config/api';

/**
 * Hook для создания заявки
 * @returns {Object} { submitApplication, loading, error, success }
 */
export const useApplications = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Отправка заявки на бэкенд
   * @param {Object} data - Данные заявки
   * @param {string} data.name - Имя клиента
   * @param {string} data.phone_number - Номер телефона
   * @returns {Promise<Object>} Результат отправки
   */
  const submitApplication = async (data) => {
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
      
      // Отправляем данные на бэкенд
      const response = await apiClient.post('/applications/', {
        name: data.name.trim(),
        phone_number: data.phone_number.trim(),
      });
      
      console.log('✅ Заявка успешно отправлена:', response);
      setSuccess(true);
      
      return {
        success: true,
        data: response,
        message: 'Ваша заявка успішно відправлена! Ми зв\'яжемося з вами найближчим часом.'
      };
      
    } catch (err) {
      const errorMessage = err.message || 'Помилка при відправці заявки. Спробуйте ще раз.';
      setError(errorMessage);
      console.error('❌ Ошибка при отправке заявки:', err);
      
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
    submitApplication,
    loading,
    error,
    success,
    reset
  };
};

/**
 * Пример использования:
 * 
 * const { submitApplication, loading, error, success } = useApplications();
 * 
 * const handleSubmit = async (formData) => {
 *   const result = await submitApplication({
 *     name: formData.name,
 *     phone_number: formData.tel
 *   });
 *   
 *   if (result.success) {
 *     console.log('Заявка отправлена!');
 *     // Показать сообщение об успехе
 *   } else {
 *     console.error('Ошибка:', result.error);
 *     // Показать сообщение об ошибке
 *   }
 * };
 */

