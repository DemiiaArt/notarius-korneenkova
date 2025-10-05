/**
 * Hook для работы с формой "Связаться с нами"
 * Отправка заявок через форму контактов
 */

import { useState } from 'react';
import { apiClient } from '@/config/api';

/**
 * Hook для создания заявки через форму контактов
 * @returns {Object} { submitContactUs, loading, error, success }
 */
export const useContactUs = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Отправка заявки через форму контактов
   * @param {Object} data - Данные заявки
   * @param {string} data.name - Имя клиента
   * @param {string} data.phone_number - Номер телефона
   * @param {string} data.question - Вопрос
   * @returns {Promise<Object>} Результат отправки
   */
  const submitContactUs = async (data) => {
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
      
      console.log('✅ Заявка через форму контактов успешно отправлена:', response);
      setSuccess(true);
      
      return {
        success: true,
        data: response,
        message: 'Ваше повідомлення успішно відправлено! Ми зв\'яжемося з вами найближчим часом.'
      };
      
    } catch (err) {
      const errorMessage = err.message || 'Помилка при відправці повідомлення. Спробуйте ще раз.';
      setError(errorMessage);
      console.error('❌ Ошибка при отправке заявки через форму контактов:', err);
      
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
    submitContactUs,
    loading,
    error,
    success,
    reset
  };
};

/**
 * Пример использования:
 * 
 * const { submitContactUs, loading, error, success } = useContactUs();
 * 
 * const handleSubmit = async (formData) => {
 *   const result = await submitContactUs({
 *     name: formData.name,
 *     phone_number: formData.tel,
 *     question: formData.question
 *   });
 *   
 *   if (result.success) {
 *     console.log('Заявка через форму контактов отправлена!');
 *     // Показать сообщение об успехе
 *   } else {
 *     console.error('Ошибка:', result.error);
 *     // Показать сообщение об ошибке
 *   }
 * };
 */