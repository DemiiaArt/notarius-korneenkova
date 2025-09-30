import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000/api';

export const useContacts = () => {
  const [contacts, setContacts] = useState({
    email: '',
    phone_number: '',
    phone_number_2: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/contacts/`);
      
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
        address: 'м. Дніпро, бул. Слави, 2-Б, 49100'
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
  }, []);

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    updateContacts,
  };
}; 