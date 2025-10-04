/**
 * Hook для работы с формой "Связаться с нами" (ContactUs)
 * Отправка обращений на бэкенд
 */

import { useState } from 'react';
import { apiClient } from '@/config/api';

/**
 * Hook для создания обращения через форму контактов
 * @returns {Object} { submitContact, loading, error, success }
 */
export const useContactUs = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Отправка обращения через форму контактов на бэкенд
   * @param {Object} data - Данные обращения
   * @param {string} data.name - Имя клиента
   * @param {string} data.phone_number - Номер телефона
   * @param {string} data.question - Вопрос
   * @returns {Promise<Object>} Результат отправки
   */
  const submitContact = async (data) => {
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
      
      if (!data.question || !data.question.trim()) {
        throw new Error('Питання не може бути порожнім');
      }
      
      // Отправляем данные на бэкенд
      const response = await apiClient.post('/contact-us/', {
        name: data.name.trim(),
        phone_number: data.phone_number.trim(),
        question: data.question.trim(),
      });
      
      console.log('✅ Звернення успішно відправлено:', response);
      setSuccess(true);
      
      return {
        success: true,
        data: response,
        message: response.message || 'Дякуємо за звернення! Ми зв\'яжемося з вами найближчим часом.'
      };
      
    } catch (err) {
      const errorMessage = err.message || 'Помилка при відправці звернення. Спробуйте ще раз.';
      setError(errorMessage);
      console.error('❌ Помилка при відправці звернення:', err);
      
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
    submitContact,
    loading,
    error,
    success,
    reset
  };
};

/**
 * Пример использования:
 * 
 * const { submitContact, loading, error, success } = useContactUs();
 * 
 * const handleSubmit = async (formData) => {
 *   const result = await submitContact({
 *     name: formData.name,
 *     phone_number: formData.tel,
 *     question: formData.question
 *   });
 *   
 *   if (result.success) {
 *     console.log('Звернення відправлено!');
 *     // Показать сообщение об успехе
 *   } else {
 *     console.error('Помилка:', result.error);
 *     // Показать сообщение об ошибке
 *   }
 * };
 */

