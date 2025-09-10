import { useState, useEffect } from 'react';

// const API_BASE_URL = 'http://localhost:8000/api';
const API_BASE_URL = 'alluring-vitality-production.up.railway.app/api';

export const useAboutMe = () => {
  const [aboutMe, setAboutMe] = useState({
    subtitle_uk: '',
    subtitle_en: '',
    subtitle_ru: '',
    title_uk: '',
    title_en: '',
    title_ru: '',
    text_uk: '',
    text_en: '',
    text_ru: '',
    photo: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAboutMe = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Запрос к API AboutMe:', `${API_BASE_URL}/main_page/about-me/`);
      
      const response = await fetch(`${API_BASE_URL}/main_page/about-me/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Ответ сервера AboutMe:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Полученные данные AboutMe:', data);
      setAboutMe(data);
    } catch (err) {
      console.error('Ошибка при получении данных "О себе":', err);
      setError('Не удалось загрузить информацию "О себе"');
      
      // Устанавливаем данные по умолчанию
      setAboutMe({
        subtitle_uk: 'Привіт! Мене звати Надія Корнєєнкова.',
        subtitle_en: 'Hello! My name is Nadiya Kornienkova.',
        subtitle_ru: 'Привет! Меня зовут Надежда Корниенкова.',
        title_uk: 'Ваш надійний нотаріус, медіатор та перекладач.',
        title_en: 'Your reliable notary, mediator and translator.',
        title_ru: 'Ваш надежный нотариус, медиатор и переводчик.',
        text_uk: 'Працюю з українцями по всьому світу — допомагаю з документами, перекладами та важливими правовими рішеннями.',
        text_en: 'I work with Ukrainians around the world — helping with documents, translations and important legal decisions.',
        text_ru: 'Работаю с украинцами по всему миру — помогаю с документами, переводами и важными правовыми решениями.',
        photo: null
      });
    } finally {
      setLoading(false);
    }
  };

  const getContentByLanguage = (language) => {
    switch (language) {
      case 'en':
        return {
          subtitle: aboutMe.subtitle_en,
          title: aboutMe.title_en,
          text: aboutMe.text_en
        };
      case 'ru':
        return {
          subtitle: aboutMe.subtitle_ru,
          title: aboutMe.title_ru,
          text: aboutMe.text_ru
        };
      case 'ua':
      default:
        return {
          subtitle: aboutMe.subtitle_uk,
          title: aboutMe.title_uk,
          text: aboutMe.text_uk
        };
    }
  };

  useEffect(() => {
    fetchAboutMe();
  }, []);

  return {
    aboutMe,
    loading,
    error,
    fetchAboutMe,
    getContentByLanguage,
  };
};