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
    console.log(import.meta.env.DEV);
    return "http://localhost:8000/api";
  }

  // Для production по умолчанию используем текущий origin + /api
  return `${window.location.origin}/api`;
};

const getMediaBaseUrl = () => {
  if (import.meta.env.DEV) {
    return "http://localhost:8000/media";
  }
    if (import.meta.env.VITE_MEDIA_BASE_URL) {
    return import.meta.env.VITE_MEDIA_BASE_URL;
  }

  // По умолчанию используем текущий origin
  return `${window.location.origin}/media`;
};

export const API_BASE_URL = getApiBaseUrl();
export const MEDIA_BASE_URL = getMediaBaseUrl();

// Вспомогательные функции для API запросов
// Безопасный билдер медиа-URL, чтобы избежать двойного /media
export function buildMediaUrl(input) {
  if (!input) return "";
  const raw = String(input).trim();

  // Абсолютный URL
  const isAbsolute = /^(https?:)?\/\//i.test(raw);
  if (isAbsolute) {
    const idx = raw.indexOf("/media/");
    if (idx !== -1) {
      const tail = raw.substring(idx + 7); // после '/media/'
      const needsSlash = !MEDIA_BASE_URL.endsWith("/");
      return `${MEDIA_BASE_URL}${needsSlash ? "/" : ""}${tail}`;
    }
    return raw;
  }

  // Относительный путь: убираем возможный префикс '/media'
  let path = raw;
  if (path.startsWith("/media/")) path = path.substring(7);
  else if (path.startsWith("media/")) path = path.substring(6);

  const needsSlash = !MEDIA_BASE_URL.endsWith("/") && !path.startsWith("/");
  return `${MEDIA_BASE_URL}${needsSlash ? "/" : ""}${path}`;
}

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
