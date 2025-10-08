/**
 * API Configuration
 * Централизованная конфигурация для всех API запросов
 */

// Определяем базовый URL в зависимости от окружения
const getApiBaseUrl = () => {
  // В production используем переменную окружения или текущий origin
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
  }

  // В development используем localhost
  if (import.meta.env.DEV) {
    return "http://localhost:8000/api";
  }

  // Для production по умолчанию используем текущий origin + /api
  return `${window.location.origin}/api`;
};

const getMediaBaseUrl = () => {
  if (import.meta.env.VITE_MEDIA_BASE_URL) {
    return import.meta.env.VITE_MEDIA_BASE_URL;
  }

  // В development используем localhost
  if (import.meta.env.DEV) {
    return "http://localhost:8000/media";
  }

  // Для production используем Railway URL
  return "https://notarius-korneenkova-production.up.railway.app/media";
};

export const API_BASE_URL = getApiBaseUrl();
export const MEDIA_BASE_URL = getMediaBaseUrl();

// Вспомогательные функции для API запросов
export const apiClient = {
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  },

  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  },

  async put(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  },

  async delete(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.ok;
  },
};
