import { useState, useEffect } from 'react';

import { API_BASE_URL } from "../config/api";

export const useContacts = (lang = 'ua') => {
  const [contacts, setContacts] = useState({
    email: '',
    phone_number: '',
    phone_number_2: '',
    address: '',
    working_hours: '',
    instagram_url: null,
    facebook_url: null,
    twitter_url: null,
    tiktok_url: null,
    whatsapp: null,
    telegram: null,
    whatsapp_phone: null,
    telegram_phone: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/contacts/?lang=${encodeURIComponent(lang)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setContacts(data);
    } catch (err) {
      console.error('Ошибка при получении контактов:', err);
      setError('Не удалось загрузить контакты');
      
      // Устанавливаем контакты по умолчанию
      setContacts({
        email: 'nknotary.dnipro@gmail.com',
        phone_number: '+ 38 067 820 07 00',
        phone_number_2: '+ 38 067 544 07 00',
        address: 'м. Дніпро, бул. Слави, 2-Б, 49100',
        working_hours: 'Пн-Пт 9:00–18:00',
        instagram_url: null,
        facebook_url: null,
        twitter_url: null,
        tiktok_url: null,
        whatsapp: null,
        telegram: null,
        whatsapp_phone: null,
        telegram_phone: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateContacts = async (newContacts) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/contacts/update/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContacts),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setContacts(data);
      return { success: true, data };
    } catch (err) {
      console.error('Ошибка при обновлении контактов:', err);
      setError('Не удалось обновить контакты');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [lang]);

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    updateContacts,
  };
}; 