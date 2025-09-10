import { useState, useEffect } from 'react';

// const API_BASE_URL = 'http://localhost:8000/api';
const API_BASE_URL = 'alluring-vitality-production.up.railway.app/api';

export const useHeaderContacts = () => {
  const [contacts, setContacts] = useState({
    email: '',
    phone_number: '',
    phone_number_2: '',
    address_ua: '',
    address_en: '',
    address_ru: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHeaderContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Запрос к API:', `${API_BASE_URL}/main_page/header/`);
      
      const response = await fetch(`${API_BASE_URL}/main_page/header/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Ответ сервера:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Полученные данные:', data);
      setContacts(data);
    } catch (err) {
      console.error('Ошибка при получении контактов для шапки:', err);
      setError('Не удалось загрузить контакты');
      
      // Устанавливаем контакты по умолчанию
      setContacts({
        email: 'nknotary.dnipro@gmail.com',
        phone_number: '+ 38 067 820 07 00',
        phone_number_2: '+ 38 067 544 07 00',
        address_ua: 'м. Дніпро, бул. Слави, 2-Б, 49100',
        address_en: 'Dnipro, Slavy Ave, 2-B, 49100',
        address_ru: 'г. Днепр, бул. Славы, 2-Б, 49100'
      });
    } finally {
      setLoading(false);
    }
  };

  const getAddressByLanguage = (language) => {
    switch (language) {
      case 'en':
        return contacts.address_en;
      case 'ru':
        return contacts.address_ru;
      case 'ua':
      default:
        return contacts.address_ua;
    }
  };

  useEffect(() => {
    fetchHeaderContacts();
  }, []);

  return {
    contacts,
    loading,
    error,
    fetchHeaderContacts,
    getAddressByLanguage,
  };
}; 