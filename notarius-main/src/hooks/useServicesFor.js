/**
 * Hook для роботи з ServicesFor (Для кого послуги)
 * Завантажує список категорій "Для кого послуги" з API
 */

import { useState, useEffect } from 'react';
import { apiClient } from '@/config/api';

/**
 * Hook для отримання списку ServicesFor
 * @returns {Object} { servicesFor, loading, error, refetch }
 */
export const useServicesFor = () => {
  const [servicesFor, setServicesFor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServicesFor = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('useServicesFor: Fetching from API...');
      const data = await apiClient.get('/services-for/');
      console.log('useServicesFor: API response:', data);
      
      setServicesFor(Array.isArray(data) ? data : []);
      
    } catch (err) {
      setError(err.message);
      console.error('useServicesFor ERROR:', err);
      setServicesFor([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesFor();
  }, []);

  return { 
    servicesFor, 
    loading, 
    error, 
    refetch: fetchServicesFor 
  };
};

/**
 * Приклад використання:
 * 
 * const { servicesFor, loading, error } = useServicesFor();
 * 
 * if (loading) return <div>Завантаження...</div>;
 * if (error) return <div>Помилка: {error}</div>;
 * 
 * return (
 *   <div>
 *     {servicesFor.map(service => (
 *       <div key={service.id}>
 *         <h3>{service.title_uk}</h3>
 *         <p>{service.subtitle_uk}</p>
 *         <div dangerouslySetInnerHTML={{ __html: service.description_uk }} />
 *       </div>
 *     ))}
 *   </div>
 * );
 */

