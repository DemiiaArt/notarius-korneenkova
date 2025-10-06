import { useState, useEffect } from 'react';

import { API_BASE_URL } from "../config/api";

export const useHeaderContacts = (lang = 'ua') => {
  const [contacts, setContacts] = useState({
    email: '',
    phone_number: '',
    phone_number_2: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHeaderContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/header/?lang=${encodeURIComponent(lang)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setContacts(data);
    } catch (err) {
      console.error('Ошибка при получении контактов для шапки:', err);
      setError('Не удалось загрузить контакты');
      
      // Устанавливаем контакты по умолчанию
      setContacts({
        email: 'nknotary.dnipro@gmail.com',
        phone_number: '+ 38 067 820 07 00',
        phone_number_2: '+ 38 067 544 07 00',
        address: 'м. Дніпро, бул. Слави, 2-Б, 49100'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateHeaderContacts = async (newContacts) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/header-contacts/update/`, {
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
    fetchHeaderContacts();
    // перезагрузка при смене языка, чтобы получить локализованный адрес
  }, [lang]);

  return {
    contacts,
    loading,
    error,
    fetchHeaderContacts,
    updateHeaderContacts,
  };
}; 