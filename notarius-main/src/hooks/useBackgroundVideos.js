import { useState, useEffect } from 'react';

// const API_BASE_URL = 'http://localhost:8000/api';
const API_BASE_URL = 'https://notarius-korneenkova-production.up.railway.app/api';

export const useBackgroundVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBackgroundVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Запрос к API для видео:', `${API_BASE_URL}/main_page/background-videos/`);
      
      const response = await fetch(`${API_BASE_URL}/main_page/background-videos/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Ответ сервера для видео:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Полученные видео:', data);
      setVideos(data);
    } catch (err) {
      console.error('Ошибка при получении фоновых видео:', err);
      setError('Не удалось загрузить фоновые видео');
      
      // Устанавливаем пустой массив по умолчанию
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const getVideoUrl = (videoPath) => {
    if (!videoPath) return null;
    // Если путь уже полный URL, возвращаем как есть
    if (videoPath.startsWith('http')) {
      return videoPath;
    }
    // Иначе добавляем базовый URL бэкенда
    return `${API_BASE_URL.replace('/api', '')}${videoPath}`;
  };

  useEffect(() => {
    fetchBackgroundVideos();
  }, []);

  return {
    videos,
    loading,
    error,
    fetchBackgroundVideos,
    getVideoUrl,
  };
};