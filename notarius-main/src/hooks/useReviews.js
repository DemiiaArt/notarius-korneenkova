/**
 * Custom hook for working with reviews API
 * Упрощает работу с API отзывов
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/config/api';

/**
 * Hook для получения списка опубликованных отзывов
 */
export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get('/reviews/');
      setReviews(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, loading, error, refetch: fetchReviews };
};

/**
 * Hook для получения статистики рейтинга
 */
export const useReviewStats = (dependencies = []) => {
  const [stats, setStats] = useState({
    average_rating: 0,
    total_reviews: 0,
    rating_counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get('/reviews/stats/');
      setStats(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching review stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, ...dependencies]);

  return { stats, loading, error, refetch: fetchStats };
};

/**
 * Hook для создания отзыва
 */
export const useCreateReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createReview = useCallback(async (reviewData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await apiClient.post('/reviews/create/', reviewData);
      
      setSuccess(true);
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Error creating review:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return { createReview, loading, error, success, reset };
};

/**
 * Пример использования:
 * 
 * // Получение отзывов
 * const { reviews, loading, error } = useReviews();
 * 
 * // Получение статистики
 * const { stats } = useReviewStats();
 * 
 * // Создание отзыва
 * const { createReview, loading, success } = useCreateReview();
 * 
 * const handleSubmit = async (formData) => {
 *   const result = await createReview(formData);
 *   if (result.success) {
 *     console.log('Review created!');
 *   }
 * };
 */

