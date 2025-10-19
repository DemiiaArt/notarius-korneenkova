import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/api';

/**
 * Хук для загрузки фонового изображения формы обратной связи
 * @returns {Object} { backgroundImage, loading, error }
 */
export const useContactFormBackground = () => {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBackground = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/contact-form-background/`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.background_image_url) {
          setBackgroundImage(data.background_image_url);
        }
      } catch (err) {
        console.warn('Не удалось загрузить фоновое изображение формы:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBackground();
  }, []);

  return { backgroundImage, loading, error };
};
